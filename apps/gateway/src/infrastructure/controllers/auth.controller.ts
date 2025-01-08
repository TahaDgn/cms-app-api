import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { OrchestratorClient, IdentityGrpcClient } from '../grpc-clients';
import { RegisterRequestDto, LoginRequestDto } from '../../application/dtos';
import slugify from 'slugify';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly orchestratorClient: OrchestratorClient,
    private readonly identityClient: IdentityGrpcClient,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    const { email, name, tenantName, userType } = dto;

    await this.orchestratorClient.userRegistrationSaga({
      user: {
        email,
        name,
        type: userType,
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

    const verifyResp = await this.identityClient.verifyAccessCode({
      accessCode,
    });

    const redirectUrl = `http://cms-app/auth/login?accessToken=${verifyResp.accessToken}`;

    return res.redirect(redirectUrl);
  }
}
