import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceRecordDto } from './dto/create-service-record.dto';
import { UpdateServiceRecordDto } from './dto/update-service-record.dto';

@Injectable()
export class ServiceRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createServiceRecordDto: CreateServiceRecordDto) {
    return this.prisma.serviceRecord.create({
      data: createServiceRecordDto as any,
    });
  }

  findAll() {
    return this.prisma.serviceRecord.findMany({
      include: {
        vehicle: true,
        sourceDocument: true,
      },
      orderBy: {
        serviceDate: 'desc',
      },
    });
  }

  findByVehicle(vehicleId: string) {
    return this.prisma.serviceRecord.findMany({
      where: {
        vehicleId,
      },
      include: {
        sourceDocument: true,
      },
      orderBy: {
        serviceDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.serviceRecord.findUnique({
      where: { id },
      include: {
        vehicle: true,
        sourceDocument: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Service record not found');
    }

    return record;
  }

  async update(id: string, updateServiceRecordDto: UpdateServiceRecordDto) {
    await this.findOne(id);

    return this.prisma.serviceRecord.update({
      where: { id },
      data: updateServiceRecordDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.serviceRecord.delete({
      where: { id },
    });
  }
}