import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { PrismaService } from '../database/database.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [EnterpriseController],
  providers: [EnterpriseService, PrismaService],
  exports: [EnterpriseService], 
})
export class EnterpriseModule {}
