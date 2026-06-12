import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MileageService } from './mileage.service';
import { CreateMileageDto } from './dto/create-mileage.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';

@Controller('mileage')
export class MileageController {
  constructor(private readonly mileageService: MileageService) {}

  @Post()
  create(@Body() createMileageDto: CreateMileageDto) {
    return this.mileageService.create(createMileageDto);
  }

  @Get()
  findAll() {
    return this.mileageService.findAll();
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.mileageService.findByVehicle(vehicleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mileageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMileageDto: UpdateMileageDto) {
    return this.mileageService.update(id, updateMileageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mileageService.remove(id);
  }
}