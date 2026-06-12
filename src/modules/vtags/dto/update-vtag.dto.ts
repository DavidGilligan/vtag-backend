import { PartialType } from '@nestjs/swagger';
import { CreateVtagDto } from './create-vtag.dto';

export class UpdateVtagDto extends PartialType(CreateVtagDto) {}
