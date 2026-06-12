import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VtagsService } from './vtags.service';
import { CreateVtagDto } from './dto/create-vtag.dto';

@Controller('vtags')
export class VtagsController {
  constructor(private readonly vtagsService: VtagsService) {}

  @Post()
  create(@Body() createVtagDto: CreateVtagDto) {
    return this.vtagsService.create(createVtagDto);
  }

  @Get()
  findAll() {
    return this.vtagsService.findAll();
  }

  @Get('reference/:referenceCode')
  findByReference(@Param('referenceCode') referenceCode: string) {
    return this.vtagsService.findByReference(referenceCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vtagsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vtagsService.remove(id);
  }
}