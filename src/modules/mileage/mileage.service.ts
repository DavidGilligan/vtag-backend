import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMileageDto } from './dto/create-mileage.dto';
import { UpdateMileageDto } from './dto/update-mileage.dto';

@Injectable()
export class MileageService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMileageDto: CreateMileageDto) {
    return this.prisma.mileageLog.create({
      data: createMileageDto as any,
    });
  }

  findAll() {
    return this.prisma.mileageLog.findMany({
      include: {
        vehicle: true,
        user: true,
      },
      orderBy: {
        loggedAt: 'desc',
      },
    });
  }

  findByVehicle(vehicleId: string) {
    return this.prisma.mileageLog.findMany({
      where: {
        vehicleId,
      },
      include: {
        user: true,
      },
      orderBy: {
        loggedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const mileageLog = await this.prisma.mileageLog.findUnique({
      where: { id },
      include: {
        vehicle: true,
        user: true,
      },
    });

    if (!mileageLog) {
      throw new NotFoundException('Mileage log not found');
    }

    return mileageLog;
  }

  async update(id: string, updateMileageDto: UpdateMileageDto) {
    await this.findOne(id);

    return this.prisma.mileageLog.update({
      where: { id },
      data: updateMileageDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.mileageLog.delete({
      where: { id },
    });
  }
}