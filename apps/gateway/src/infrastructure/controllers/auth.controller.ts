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
import { IdentityGrpcClient, OrchestratorGrpcClient } from '../grpc-clients';
import { RegisterRequestDto, LoginRequestDto } from '../../application';
import slugify from 'slugify';
import { UserType } from '@prisma/client';
import { AuthGuard } from '../guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly identityClient: IdentityGrpcClient,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    const { email, name, tenantName } = dto;

    await this.orchestratorClient.userRegistrationSaga({
      user: {
        email,
        name,
        type: UserType.PARTICIPANT,
      },
      tenant: {
        name: tenantName,
        identifier: slugify(tenantName, { trim: true, lower: true }),
      },
    });
    return {
      message: 'Registration initiated. Check your email for the access link.',
    };
  }

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    await this.orchestratorClient.userLoginSaga(dto);

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

    try {
      const verifyAccessCodeResponse =
        await this.identityClient.verifyAccessCode({
          accessCode,
        });

      const redirectUrl = `http://cms-app/auth/login?accessToken=${verifyAccessCodeResponse.accessToken}`;

      return res.redirect(redirectUrl);
    } catch {
      const redirectUrl = `http://cms-app/auth/failed`;

      return res.redirect(redirectUrl);
    }
  }

  @AuthGuard([UserType.CLIENT, UserType.PARTICIPANT])
  @Post('logout')
  async logout(@Headers('Authorization') accessToken: string) {
    await this.identityClient.removeAccessToken({
      accessToken,
    });

    return {
      message: 'Login initiated. Check your email for the access link.',
    };
  }
}
