import { Module } from '@nestjs/common';
import { MotService } from './mot.service';
import { MotController } from './mot.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MotController],
  providers: [MotService],
})
export class MotModule {}