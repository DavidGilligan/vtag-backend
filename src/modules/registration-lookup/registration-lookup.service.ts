import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DvsaMotService } from '../dvsa-mot/dvsa-mot.service';

@Injectable()
export class RegistrationLookupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dvsaMotService: DvsaMotService,
  ) {}

  async lookup(registration: string) {
    const normalisedRegistration = registration
      .replace(/\s/g, '')
      .toUpperCase();

    const localVehicle = await this.prisma.vehicle.findFirst({
      where: {
        registration: {
          equals: normalisedRegistration,
          mode: 'insensitive',
        },
      },
      include: {
        vtags: true,
        motRecords: {
          orderBy: {
            testDate: 'desc',
          },
        },
        mileageLogs: {
          orderBy: {
            loggedAt: 'desc',
          },
        },
      },
    });

    const dvsaVehicle =
      await this.dvsaMotService.getMotHistoryByRegistration(
        normalisedRegistration,
      );

    const motTests = dvsaVehicle.motTests ?? [];
    const latestMot = motTests[0] ?? null;

    const latestMotMileage = latestMot?.odometerValue
      ? Number(latestMot.odometerValue)
      : null;

    const estimatedMileage =
      latestMotMileage && latestMot?.completedDate
        ? this.estimateMileage(latestMotMileage, latestMot.completedDate)
        : null;

    return {
      registration: normalisedRegistration,
      vehicle: localVehicle
        ? {
            id: localVehicle.id,
            make: localVehicle.make,
            model: localVehicle.model,
            year: localVehicle.year,
            colour: localVehicle.colour,
          }
        : {
            id: null,
            make: dvsaVehicle.make,
            model: dvsaVehicle.model,
            year: dvsaVehicle.manufactureDate
              ? new Date(dvsaVehicle.manufactureDate).getFullYear()
              : null,
            colour: dvsaVehicle.primaryColour,
            fuelType: dvsaVehicle.fuelType,
            engineSize: dvsaVehicle.engineSize,
            firstUsedDate: dvsaVehicle.firstUsedDate,
          },
      vtag: {
        isTagged: Boolean(localVehicle?.vtags?.length),
        referenceCode: localVehicle?.vtags?.[0]?.referenceCode ?? null,
      },
      mileage: {
        latestMotMileage,
        estimatedMileage,
        unit: latestMot?.odometerUnit ?? null,
        source: 'DVSA MOT History API',
      },
      mot: {
        source: 'DVSA MOT History API',
        latestStatus: latestMot?.testResult ?? null,
        latestExpiryDate: latestMot?.expiryDate ?? null,
        hasOutstandingRecall: dvsaVehicle.hasOutstandingRecall,
        history: motTests.map((test) => ({
          testDate: test.completedDate,
          expiryDate: test.expiryDate,
          status: test.testResult,
          mileage: test.odometerValue ? Number(test.odometerValue) : null,
          mileageUnit: test.odometerUnit,
          motTestNumber: test.motTestNumber,
          advisories: (test.defects ?? [])
            .filter((defect) => defect.type === 'ADVISORY')
            .map((defect) => defect.text),
          failures: (test.defects ?? [])
            .filter((defect) => defect.type !== 'ADVISORY')
            .map((defect) => ({
              type: defect.type,
              text: defect.text,
              dangerous: defect.dangerous,
            })),
        })),
      },
      localVehicleFound: Boolean(localVehicle),
    };
  }

  private estimateMileage(lastMileage: number, lastMotDate: string) {
    const lastDate = new Date(lastMotDate);
    const now = new Date();

    const daysSinceMot =
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

    const averageMilesPerDay = 20;

    return Math.round(lastMileage + daysSinceMot * averageMilesPerDay);
  }
}