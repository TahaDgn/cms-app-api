import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { GATEWAY_HTTP_PORT } from 'libs/constants';
import {
  classToPlain,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import {
  Type,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { parseValidationErrors } from './application';
import { isValidJsonString } from 'libs/shared-utils';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  await app.listen(GATEWAY_HTTP_PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      transformerPackage: {
        plainToClass: (cls, plainObject: object) => {
          const parsedPlainObject = {};

          for (const key in plainObject) {
            if (plainObject[key] != '' && isValidJsonString(plainObject[key])) {
              parsedPlainObject[key] = JSON.parse(plainObject[key]);

              continue;
            }

            parsedPlainObject[key] = plainObject[key];
          }

          const transformed = plainToClass(cls, parsedPlainObject, {
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
          return classToPlain(cls, options);
        },
      },
      exceptionFactory: (errors: ValidationError[] = []) => {
        return new UnprocessableEntityException(parseValidationErrors(errors));
      },
    }),
  );

  console.log('Gateway is running on port:', GATEWAY_HTTP_PORT);
}
bootstrap();
