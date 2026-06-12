import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentScope,
  DocumentType,
  OcrProvider,
  OcrStatus,
  TimelineEventType,
} from '@prisma/client';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { OcrService } from '../ocr/ocr.service';
import { DocumentAnalysisService } from '../document-analysis/document-analysis.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
    private readonly documentAnalysisService: DocumentAnalysisService,
  ) {}

  async upload(file: Express.Multer.File, createDocumentDto: CreateDocumentDto) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    if (createDocumentDto.vehicleId) {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id: createDocumentDto.vehicleId },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }
    }

    const originalFileUrl = `/uploads/documents/${file.filename}`;

    const document = await this.prisma.document.create({
      data: {
        uploadedByUserId: createDocumentDto.uploadedByUserId,
        vehicleId: createDocumentDto.vehicleId,
        documentScope:
          createDocumentDto.documentScope ?? DocumentScope.VEHICLE_HISTORY,
        documentType: createDocumentDto.documentType ?? DocumentType.OTHER,
        originalFileUrl,
        originalFileName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        ocrProvider: OcrProvider.TESSERACT,
        ocrStatus: OcrStatus.PENDING,
      },
      include: {
        vehicle: true,
        metadata: true,
      },
    });

    if (
      document.vehicleId &&
      document.documentScope === DocumentScope.VEHICLE_HISTORY
    ) {
      await this.prisma.timelineEvent.create({
        data: {
          vehicleId: document.vehicleId,
          sourceDocumentId: document.id,
          eventType: TimelineEventType.DOCUMENT_UPLOADED,
          title: 'Document uploaded',
          description: `${document.documentType} uploaded and retained as original evidence.`,
          visibility: 'OWNER_ONLY',
        },
      });
    }

    return document;
  }

  async runOcr(documentId: string) {
    const document = await this.findOne(documentId);

    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        ocrStatus: OcrStatus.PROCESSING,
      },
    });

    const filePath = join(
      process.cwd(),
      document.originalFileUrl.replace('/uploads/', 'uploads/'),
    );

    try {
      const extractedText =
        await this.ocrService.extractTextFromImage(filePath);

      const metadata =
        this.documentAnalysisService.extractMetadata(extractedText);

      await this.prisma.documentExtractedMetadata.upsert({
        where: {
          documentId,
        },
        update: {
          documentDate: metadata.documentDate,
          mileage: metadata.mileage,
          garageName: metadata.garageName,
          registrationDetected: metadata.registrationDetected,
          totalCost: metadata.totalCost,
          extractedItems: metadata.extractedItems,
          confidenceScore: metadata.confidenceScore,
        },
        create: {
          documentId,
          documentDate: metadata.documentDate,
          mileage: metadata.mileage,
          garageName: metadata.garageName,
          registrationDetected: metadata.registrationDetected,
          totalCost: metadata.totalCost,
          extractedItems: metadata.extractedItems,
          confidenceScore: metadata.confidenceScore,
        },
      });

      if (
        document.documentType === DocumentType.SERVICE_RECORD &&
        document.vehicleId
      ) {
        const existingServiceRecord =
          await this.prisma.serviceRecord.findFirst({
            where: {
              sourceDocumentId: document.id,
            },
          });

        if (!existingServiceRecord) {
          await this.prisma.serviceRecord.create({
            data: {
              vehicleId: document.vehicleId,
              sourceDocumentId: document.id,
              serviceDate: metadata.documentDate,
              mileage: metadata.mileage,
              garageName: metadata.garageName,
              serviceItems: metadata.extractedItems,
              totalCost: metadata.totalCost,
            },
          });

          await this.prisma.timelineEvent.create({
            data: {
              vehicleId: document.vehicleId,
              sourceDocumentId: document.id,
              eventType: TimelineEventType.SERVICE,
              title: 'Service record created',
              description: `Service record created from ${document.originalFileName}.`,
              eventDate: metadata.documentDate,
              visibility: 'OWNER_ONLY',
            },
          });
        }

        if (metadata.mileage) {
          const existingMileageLog =
            await this.prisma.mileageLog.findFirst({
              where: {
                vehicleId: document.vehicleId,
                mileage: metadata.mileage,
              },
            });

          if (!existingMileageLog) {
            await this.prisma.mileageLog.create({
              data: {
                vehicleId: document.vehicleId,
                userId: document.uploadedByUserId,
                mileage: metadata.mileage,
              },
            });

            await this.prisma.timelineEvent.create({
              data: {
                vehicleId: document.vehicleId,
                sourceDocumentId: document.id,
                eventType: TimelineEventType.MILEAGE_LOG,
                title: 'Mileage recorded',
                description: `${metadata.mileage} miles recorded from ${document.originalFileName}.`,
                eventDate: metadata.documentDate,
                visibility: 'OWNER_ONLY',
              },
            });
          }
        }
      }

      if (
        document.documentType === DocumentType.MOT_CERTIFICATE &&
        document.vehicleId
      ) {
        const existingMotEvidenceEvent =
          await this.prisma.timelineEvent.findFirst({
            where: {
              vehicleId: document.vehicleId,
              sourceDocumentId: document.id,
              title: 'MOT certificate uploaded',
            },
          });

        if (!existingMotEvidenceEvent) {
          await this.prisma.timelineEvent.create({
            data: {
              vehicleId: document.vehicleId,
              sourceDocumentId: document.id,
              eventType: TimelineEventType.DOCUMENT_UPLOADED,
              title: 'MOT certificate uploaded',
              description:
                'MOT certificate uploaded as supporting evidence. Official MOT records should be verified through the DVSA API.',
              eventDate: metadata.documentDate,
              visibility: 'OWNER_ONLY',
            },
          });
        }
      }

      return this.prisma.document.update({
        where: { id: documentId },
        data: {
          extractedText,
          ocrStatus: OcrStatus.COMPLETE,
        },
        include: {
          vehicle: true,
          metadata: true,
          timelineEvents: true,
        },
      });
    } catch (error) {
      await this.prisma.document.update({
        where: { id: documentId },
        data: {
          ocrStatus: OcrStatus.FAILED,
        },
      });

      throw error;
    }
  }

  findAll() {
    return this.prisma.document.findMany({
      include: {
        vehicle: true,
        metadata: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        vehicle: true,
        metadata: true,
        timelineEvents: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }
}