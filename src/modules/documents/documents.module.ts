import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentAnalysisModule } from '../document-analysis/document-analysis.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [PrismaModule, OcrModule, DocumentAnalysisModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}