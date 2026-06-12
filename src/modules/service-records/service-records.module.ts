import { Module } from '@nestjs/common';
import { ServiceRecordsService } from './service-records.service';
import { ServiceRecordsController } from './service-records.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceRecordsController],
  providers: [ServiceRecordsService],
  exports: [ServiceRecordsService],
})
export class ServiceRecordsModule {}