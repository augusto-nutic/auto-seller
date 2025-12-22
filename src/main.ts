import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { json } from 'express';
// import { AllExceptionsFilter } from './filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new AllExceptionsFilter());
  //para usar descomente e va em filters/http-exception.filter ponha a extensao .ts
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }))
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(json());
  app.enableCors({
    origin: 'http://localhost:5173', 
    credentials: true,
  });
   app.use(cookieParser());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
