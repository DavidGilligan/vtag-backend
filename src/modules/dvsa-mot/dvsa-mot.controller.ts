import { Controller, Get, Param } from '@nestjs/common';
import { DvsaMotService } from './dvsa-mot.service';

@Controller('dvsa-mot')
export class DvsaMotController {
constructor(private readonly dvsaMotService: DvsaMotService) {}

@Get('token')
async getToken() {
return {
token: await this.dvsaMotService.getAccessToken(),
};
}

@Get('registration/:registration')
async getVehicle(
@Param('registration') registration: string,
) {
return this.dvsaMotService.getMotHistoryByRegistration(
registration,
);
}
}
