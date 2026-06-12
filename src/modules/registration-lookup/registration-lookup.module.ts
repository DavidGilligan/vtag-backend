import { Module } from '@nestjs/common';
import { RegistrationLookupService } from './registration-lookup.service';
import { RegistrationLookupController } from './registration-lookup.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { DvsaMotModule } from '../dvsa-mot/dvsa-mot.module';

@Module({
  imports: [PrismaModule, DvsaMotModule],
  controllers: [RegistrationLookupController],
  providers: [RegistrationLookupService],
})
export class RegistrationLookupModule {}