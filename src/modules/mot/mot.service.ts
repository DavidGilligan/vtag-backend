import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMotDto } from './dto/create-mot.dto';
import { UpdateMotDto } from './dto/update-mot.dto';

@Injectable()
export class MotService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMotDto: CreateMotDto) {
    return this.prisma.motRecord.create({
      data: createMotDto as any,
    });
  }

  findAll() {
    return this.prisma.motRecord.findMany({
      include: {
        vehicle: true,
        sourceDocument: true,
      },
      orderBy: {
        testDate: 'desc',
      },
    });
  }

  findByVehicle(vehicleId: string) {
    return this.prisma.motRecord.findMany({
      where: {
        vehicleId,
      },
      include: {
        sourceDocument: true,
      },
      orderBy: {
        testDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const motRecord = await this.prisma.motRecord.findUnique({
      where: { id },
      include: {
        vehicle: true,
        sourceDocument: true,
      },
    });

    if (!motRecord) {
      throw new NotFoundException('MOT record not found');
    }

    return motRecord;
  }

  async update(id: string, updateMotDto: UpdateMotDto) {
    await this.findOne(id);

    return this.prisma.motRecord.update({
      where: { id },
      data: updateMotDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.motRecord.delete({
      where: { id },
    });
  }
}