import { AddressSchema } from 'src/schemas/address';
import { cnpj } from 'src/schemas/cnpj';
import { cpf } from 'src/schemas/cpf';
import { z } from 'zod';
 





export const createUserSchema = z.object({
  email: z.string().email('O e-mail deve ser válido').min(1, 'O e-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string(),
  cnpj: cnpj.optional(),
  cpf: cpf.optional(),
  contact_1: z.string().min(1, 'O contato 1 é obrigatório'),
  contact_2: z.string().optional(),
  address: AddressSchema.optional(),  
});

export type CreateUserType = z.infer<typeof createUserSchema>;