import { Module } from '@nestjs/common';
import { ModificationsService } from './modifications.service';
import { ModificationsController } from './modifications.controller';

@Module({
  controllers: [ModificationsController],
  providers: [ModificationsService],
})
export class ModificationsModule {}
