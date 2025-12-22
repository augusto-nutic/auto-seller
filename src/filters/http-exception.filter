import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Erro interno do servidor.';

    // HttpException explícita (ex: throw new BadRequestException())
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message = typeof responseMessage === 'string'
        ? responseMessage
        : (responseMessage as any).message || responseMessage;
    }

    // Erros do Prisma
    else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.BAD_REQUEST;

       
        const constraintMatch = exception.message.match(/`([^`]+_key)`/); 

        if (constraintMatch && constraintMatch[1]) {
          const rawConstraint = constraintMatch[1];
          const fields = rawConstraint
            .replace(/^Customer_/, '') 
            .replace(/_key$/, '') 
            .split('_');

          
          const fieldMap: Record<string, string> = {
            cpf: 'CPF',
            email: 'E-mail',
            userID: 'Usuário'
          };

          const readableFields = fields.map(f => fieldMap[f] || f);
          message = `Já existe um registro com os campos: ${readableFields.join(', ')}`;
        } else {
          message = `Registro já existe`;
        }
      } else {
        message = `Erro do banco de dados: código ${exception.code}`;
      }
    }

    // Erros do Stripe  
    else if (exception.raw?.type?.startsWith('Stripe')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Erro ao processar com Stripe.';
    }

    // Outros erros inesperados
    else if (typeof exception.message === 'string') {
      message = exception.message;
    }

    // Log do erro completo  
    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${JSON.stringify(message)}`,
      exception.stack,
    );

    // Retorno seguro para o cliente
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: (request as any).url,
    });
  }
}
