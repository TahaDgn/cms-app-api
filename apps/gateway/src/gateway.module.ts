import {
  Module,
  Type,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  AuthController,
  AuthGuardInternal,
  CmsGrpcClient,
  IdentityGrpcClient,
  OrchestratorGrpcClient,
  ProjectController,
  TicketCommentController,
  TicketController,
  UserController,
} from './infrastructure';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { RabbitMQModule, RedisModule } from 'libs/adapters';
import { isValidJsonString } from 'libs/shared-utils';
import {
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { parseValidationErrors } from './application';

@Module({
  imports: [RedisModule, RabbitMQModule],
  controllers: [
    AuthController,
    UserController,
    ProjectController,
    TicketController,
    TicketCommentController,
  ],
  providers: [
    OrchestratorGrpcClient,
    IdentityGrpcClient,
    CmsGrpcClient,
    {
      provide: APP_GUARD,
      useClass: AuthGuardInternal,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableCircularCheck: true,
          exposeDefaultValues: true,
          enableImplicitConversion: true,
        },
        transformerPackage: {
          plainToClass: (cls, plainObject: object) => {
            const parsedPlainObject = {};

            for (const key in plainObject) {
              if (
                plainObject[key] != '' &&
                isValidJsonString(plainObject[key])
              ) {
                parsedPlainObject[key] = JSON.parse(plainObject[key]);

                continue;
              }

              parsedPlainObject[key] = plainObject[key];
            }

            const transformed = plainToInstance(cls, parsedPlainObject, {
              enableImplicitConversion: true,
              exposeDefaultValues: true,
              exposeUnsetFields: false,
              excludeExtraneousValues: true,
            });

            return transformed;
          },
          classToPlain: (
            cls: Type,
            options?: ClassTransformOptions,
          ): Record<string, any> | Record<string, any>[] => {
            return instanceToPlain(cls, options);
          },
        },
        exceptionFactory: (errors: ValidationError[] = []) => {
          return new UnprocessableEntityException(
            parseValidationErrors(errors),
          );
        },
      }),
    },
  ],
})
export class GatewayModule {}
