import { PartialType } from '@nestjs/swagger';
import { CreateMotDto } from './create-mot.dto';

export class UpdateMotDto extends PartialType(CreateMotDto) {}
