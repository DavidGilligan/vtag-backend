import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MotService } from './mot.service';
import { CreateMotDto } from './dto/create-mot.dto';
import { UpdateMotDto } from './dto/update-mot.dto';

@Controller('mot')
export class MotController {
  constructor(private readonly motService: MotService) {}

  @Post()
  create(@Body() createMotDto: CreateMotDto) {
    return this.motService.create(createMotDto);
  }

  @Get()
  findAll() {
    return this.motService.findAll();
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.motService.findByVehicle(vehicleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMotDto: UpdateMotDto) {
    return this.motService.update(id, updateMotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motService.remove(id);
  }
}