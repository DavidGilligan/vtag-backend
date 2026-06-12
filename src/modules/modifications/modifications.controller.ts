import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModificationsService } from './modifications.service';
import { CreateModificationDto } from './dto/create-modification.dto';
import { UpdateModificationDto } from './dto/update-modification.dto';

@Controller('modifications')
export class ModificationsController {
  constructor(private readonly modificationsService: ModificationsService) {}

  @Post()
  create(@Body() createModificationDto: CreateModificationDto) {
    return this.modificationsService.create(createModificationDto);
  }

  @Get()
  findAll() {
    return this.modificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModificationDto: UpdateModificationDto) {
    return this.modificationsService.update(+id, updateModificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modificationsService.remove(+id);
  }
}
