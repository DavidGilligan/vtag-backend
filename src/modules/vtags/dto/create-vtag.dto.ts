import { IsString } from 'class-validator';

export class CreateVtagDto {
  @IsString()
  vehicleId: string;
}