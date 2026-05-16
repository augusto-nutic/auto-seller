import { Controller, Get, Post, Body ,UseGuards } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from 'src/pipes/zod/zod.validatePipe';
import { createEnterpriseSchema } from './schemas/create-enterprise.schema';
import { JwtAuthGuard } from '../auth/JWT/jwt.guard';


@Controller('enterprise')
@UseGuards(JwtAuthGuard)
export class EnterpriseController {
  constructor(
    private readonly enterpriseService: EnterpriseService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createEnterpriseSchema)) data: Prisma.EnterpriseCreateInput,
  ) {
    const { user} = await this.enterpriseService.create({...data,});
    return user
  }
  
  @UseGuards(JwtAuthGuard)
  @Get("teste")
  findAll() {
    return "Acesso concedido"
}

}
