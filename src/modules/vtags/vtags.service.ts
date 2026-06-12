import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVtagDto } from './dto/create-vtag.dto';

@Injectable()
export class VtagsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateReferenceCode() {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    return `V-${randomNumber}`;
  }

  async create(createVtagDto: CreateVtagDto) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: {
        id: createVtagDto.vehicleId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    let referenceCode = this.generateReferenceCode();

    let existing = await this.prisma.vTagReference.findUnique({
      where: {
        referenceCode,
      },
    });

    while (existing) {
      referenceCode = this.generateReferenceCode();

      existing = await this.prisma.vTagReference.findUnique({
        where: {
          referenceCode,
        },
      });
    }

    return this.prisma.vTagReference.create({
      data: {
        vehicleId: createVtagDto.vehicleId,
        referenceCode,
        status: 'ACTIVE',
      },
      include: {
        vehicle: true,
      },
    });
  }

  findAll() {
    return this.prisma.vTagReference.findMany({
      include: {
        vehicle: true,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const vtag = await this.prisma.vTagReference.findUnique({
      where: {
        id,
      },
      include: {
        vehicle: true,
      },
    });

    if (!vtag) {
      throw new NotFoundException('V-TAG not found');
    }

    return vtag;
  }

  async findByReference(referenceCode: string) {
    const vtag = await this.prisma.vTagReference.findUnique({
      where: {
        referenceCode,
      },
      include: {
        vehicle: true,
      },
    });

    if (!vtag) {
      throw new NotFoundException('V-TAG reference not found');
    }

    return vtag;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vTagReference.update({
      where: {
        id,
      },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });
  }
}