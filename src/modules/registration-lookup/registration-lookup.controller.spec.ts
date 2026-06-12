import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationLookupController } from './registration-lookup.controller';

describe('RegistrationLookupController', () => {
  let controller: RegistrationLookupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationLookupController],
    }).compile();

    controller = module.get<RegistrationLookupController>(RegistrationLookupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
