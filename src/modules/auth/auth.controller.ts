import { Controller, Post, Body, NotFoundException, Res, Req,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from './schema/login.schema';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { PrismaService } from '../database/database.service';
import { resetPasswordSchema, resetPasswordType } from './schema/reset-passwor.schema';
import { Response, Request } from 'express';
import { createEnterpriseSchema } from '../enterprise/schemas/create-enterprise.schema';
import { Prisma } from '@prisma/client';
import { EnterpriseService } from '../enterprise/enterprise.service';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private enterpriseService: EnterpriseService,
  ) { }

  @Post('register')
    async create(
      @Body(new ZodValidationPipe(createEnterpriseSchema)) data: Prisma.EnterpriseCreateInput,
      @Res({ passthrough: true }) res: Response,
    ) {
      
      const { user} = await this.enterpriseService.create({...data,});
      const {accessToken, refreshToken} = this.authService.generateAuthTokens(user.id, user.email);
      
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, 
      });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
  
      return user;
    }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) data: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(data);


    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-verification')
  async varifyAccount(@Body() body: { email: string }) {
    const { email } = body;
  
    const user = await this.prisma.enterprise.findUnique({ where: { email } });
    if (!user || user.AccountVerification === true) throw new NotFoundException("Usuario não encontrado ou já ativo.");

    return await this.authService.handleRequestVerification(email);

  }

  @Post('verify-account')
  async verifyAccount(@Body('token') token: string) {
    return this.authService.handleVerificationAccount(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {

    const user = await this.prisma.enterprise.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("Usuario nao encontrado");

    return await this.authService.handleForgotPassword(email);

  }

  @Post('reset-password')
  async resetPassword(@Body((new ZodValidationPipe(resetPasswordSchema))) data: resetPasswordType) {
    return this.authService.handleResetPassword(data.token, data.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshAccessToken(req, res);
  }

}
