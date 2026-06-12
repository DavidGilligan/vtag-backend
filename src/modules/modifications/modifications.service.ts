import { Injectable } from '@nestjs/common';
import { CreateModificationDto } from './dto/create-modification.dto';
import { UpdateModificationDto } from './dto/update-modification.dto';

@Injectable()
export class ModificationsService {
  create(createModificationDto: CreateModificationDto) {
    return 'This action adds a new modification';
  }

  findAll() {
    return `This action returns all modifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modification`;
  }

  update(id: number, updateModificationDto: UpdateModificationDto) {
    return `This action updates a #${id} modification`;
  }

  remove(id: number) {
    return `This action removes a #${id} modification`;
  }
}
