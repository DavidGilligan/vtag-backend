export class CreateMotDto {
  vehicleId: string;

  sourceDocumentId?: string;

  testDate: Date;

  status: string;

  mileage?: number;

  testCentre?: string;

  advisories?: any;

  defects?: any;
}