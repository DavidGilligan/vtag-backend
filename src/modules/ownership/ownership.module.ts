import { Module } from '@nestjs/common';
import { OwnershipService } from './ownership.service';
import { OwnershipController } from './ownership.controller';

@Module({
  controllers: [OwnershipController],
  providers: [OwnershipService],
})
export class OwnershipModule {}
