import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DvsaMotService } from './dvsa-mot.service';
import { DvsaMotController } from './dvsa-mot.controller';

@Module({
  imports: [HttpModule],
  controllers: [DvsaMotController],
  providers: [DvsaMotService],
  exports: [DvsaMotService],
})
export class DvsaMotModule {}