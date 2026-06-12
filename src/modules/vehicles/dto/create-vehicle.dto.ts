import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  originalRegistration?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  colour?: string;
}