import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import * as b from "bcrypt"
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';



@Injectable()
export class UserService {

  constructor
    (@Inject() private prisma: PrismaService,
      private jwtService: JwtService,
      private config: ConfigService,
    ) { }

  async create(data: Prisma.UserCreateInput) {
    await this.validateUniqueFields(data);

    const hashPassword = await b.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
        address: data.address ? { create:data.address} : undefined,
      },
    });

    const { password, ...userWithoutPassword } = user;

    return {user: userWithoutPassword}
  
  }

  async userExists({id,email,stripe_connect_id,stripe_id}:{id?: string, email?: string, stripe_id?: string, stripe_connect_id?: string}) {
    if (!id && !email && !stripe_id && !stripe_connect_id) {
      throw new Error("Pelo menos um identificador deve ser fornecido.");
    }

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            id ? { id } : undefined,
            email ? { email } : undefined,
            stripe_id ? { stripe_id } : undefined,
            stripe_connect_id ? { stripe_connect_id } : undefined,
          ].filter(Boolean) as any, 
        },
      });

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      return user;
    } catch (error) {
      throw new Error("Erro ao buscar usuário: " + (error as Error).message);
    }
  }

  async update(id: string, data: Partial<Prisma.UserUpdateInput>) {
    if (data.password) {
      data.password = await b.hash(data.password as string, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  private async validateUniqueFields(data: Prisma.UserCreateInput) {
    const { email, cpf, cnpj } = data;

    const [emailExists, cpfExists, cnpjExists] = await Promise.all([
      this.prisma.user.findUnique({ where: { email } }),
      cpf ? this.prisma.user.findUnique({ where: { cpf } }) : null,
      cnpj ? this.prisma.user.findUnique({ where: { cnpj } }) : null,
    ]);

    if (emailExists) {
      throw new ConflictException('Já existe um usuário com esse e-mail');
    }

    if (cpfExists) {
      throw new ConflictException('Já existe um usuário com esse CPF');
    }

    if (cnpjExists) {
      throw new ConflictException('Já existe um usuário com esse CNPJ');
    }
  }
  
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }
}
