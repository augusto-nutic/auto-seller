import { Controller, Get, Post, Body, Delete, UseGuards, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createUserSchema } from './schemas/create-user.schema';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';


@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly UserService: UserService,
  ) { }

  @Post('create')
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) data: Prisma.UserCreateInput,
  ) {
    const { user} = await this.UserService.create({...data,});
    return user
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("teste")
  findAll() {
    return "Acesso concedido"
}

}
