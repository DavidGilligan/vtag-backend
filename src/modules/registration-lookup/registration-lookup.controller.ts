import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegistrationLookupService } from './registration-lookup.service';
import { LookupRegistrationDto } from './dto/lookup-registration.dto';

@Controller('registration-lookup')
export class RegistrationLookupController {
  constructor(
    private readonly registrationLookupService: RegistrationLookupService,
  ) {}

  @Get(':registration')
  lookupByParam(@Param('registration') registration: string) {
    return this.registrationLookupService.lookup(registration);
  }

  @Post()
  lookupByBody(@Body() lookupRegistrationDto: LookupRegistrationDto) {
    return this.registrationLookupService.lookup(
      lookupRegistrationDto.registration,
    );
  }
}