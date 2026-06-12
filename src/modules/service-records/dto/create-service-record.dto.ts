export class CreateServiceRecordDto {
  vehicleId: string;

  sourceDocumentId?: string;

  serviceDate?: Date;

  mileage?: number;

  garageName?: string;

  serviceItems?: any;

  totalCost?: number;
}