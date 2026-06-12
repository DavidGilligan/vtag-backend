import { Module } from '@nestjs/common';
import { VtagsService } from './vtags.service';
import { VtagsController } from './vtags.controller';

@Module({
  controllers: [VtagsController],
  providers: [VtagsService],
})
export class VtagsModule {}
