import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { IdentityGrpcClient, OrchestratorGrpcClient } from '../../application';
import { RegisterRequestDto, LoginRequestDto } from '../../application';
import { UserType } from '@prisma/client';
import { AuthGuardRequired, AuthorizedUser } from '../middlewares';
import { Metadata } from '@grpc/grpc-js';
import { AuthorizedUserPayload } from 'libs/interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly identityClient: IdentityGrpcClient,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    const {
      createPayload: { email, name, tenant },
    } = dto;

    const metadata = new Metadata();

    await this.orchestratorClient.userRegistrationSaga(
      {
        user: {
          email,
          name,
          type: UserType.PARTICIPANT,
        },
        tenant: {
          ...tenant,
        },
      },
      metadata,
    );

    return {
      message: 'Registration initiated. Check your email for the access link.',
    };
  }

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    const {
      createPayload: {
        email,
        tenant: { identifier },
      },
    } = dto;

    const metadata = new Metadata();

    await this.orchestratorClient.userLoginSaga(
      { email, identifier },
      metadata,
    );

    return {
      message: 'Login initiated. Check your email for the access link.',
    };
  }

  @Get('access-verification')
  async accessRequest(@Query('code') accessCode: string, @Res() res: Response) {
    if (!accessCode) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'No code provided' });
    }

    const metadata = new Metadata();

    try {
      const verifyAccessCodeResponse =
        await this.identityClient.verifyAccessCode(
          {
            accessCode,
          },
          metadata,
        );

      const redirectUrl = `http://cms-app/auth/login?accessToken=${verifyAccessCodeResponse.accessToken}`;

      return res.redirect(redirectUrl);
    } catch {
      const redirectUrl = `http://cms-app/auth/failed`;

      return res.redirect(redirectUrl);
    }
  }

  @AuthGuardRequired('*')
  @Post('logout')
  async logout(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Headers('Authorization') accessToken: string,
  ) {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    await this.identityClient.removeAccessToken(
      {
        accessToken,
      },
      metadata,
    );

    return {
      success: true,
    };
  }
}
