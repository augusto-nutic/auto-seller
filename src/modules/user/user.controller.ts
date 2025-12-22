import { Controller, Get, Post, Body, Delete, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createUserSchema } from './schemas/create-user.schema';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';
import { Response } from 'express';


@Controller('user')
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly UserService: UserService,
  ) { }

  @Post('register')
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) data: Prisma.UserCreateInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    
    const { user, accessToken, refreshToken } = await this.UserService.create({...data,});

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

    return user
  }

  @Get("teste")
  findAll() {
    return "user"
}

}
