import { Module } from '@nestjs/common';
import { MileageService } from './mileage.service';
import { MileageController } from './mileage.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MileageController],
  providers: [MileageService],
})
export class MileageModule {}