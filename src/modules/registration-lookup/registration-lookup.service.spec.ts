import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationLookupService } from './registration-lookup.service';

describe('RegistrationLookupService', () => {
  let service: RegistrationLookupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationLookupService],
    }).compile();

    service = module.get<RegistrationLookupService>(RegistrationLookupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
