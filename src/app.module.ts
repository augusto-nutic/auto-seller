import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerCustomModule } from './modules/mailer/mailer.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({isGlobal:true}),
    MailerCustomModule,    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}














