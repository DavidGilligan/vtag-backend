import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTimelineDto: CreateTimelineDto) {
    return this.prisma.timelineEvent.create({
      data: createTimelineDto as any,
    });
  }

  findAll() {
    return this.prisma.timelineEvent.findMany({
      include: {
        vehicle: true,
        sourceDocument: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const timelineEvent = await this.prisma.timelineEvent.findUnique({
      where: { id },
      include: {
        vehicle: true,
        sourceDocument: true,
      },
    });

    if (!timelineEvent) {
      throw new NotFoundException('Timeline event not found');
    }

    return timelineEvent;
  }

  findByVehicle(vehicleId: string) {
    return this.prisma.timelineEvent.findMany({
      where: {
        vehicleId,
      },
      include: {
        sourceDocument: true,
      },
      orderBy: [
        {
          eventDate: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async update(id: string, updateTimelineDto: UpdateTimelineDto) {
    await this.findOne(id);

    return this.prisma.timelineEvent.update({
      where: { id },
      data: updateTimelineDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.timelineEvent.delete({
      where: { id },
    });
  }
}