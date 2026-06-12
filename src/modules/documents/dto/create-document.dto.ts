import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentScope, DocumentType } from '@prisma/client';

export class CreateDocumentDto {
  @IsString()
  uploadedByUserId: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(DocumentScope)
  documentScope?: DocumentScope;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}