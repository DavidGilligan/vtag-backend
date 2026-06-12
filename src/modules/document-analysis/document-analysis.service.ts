import { Injectable } from '@nestjs/common';

type ExtractedMetadata = {
  documentDate?: Date;
  mileage?: number;
  garageName?: string;
  registrationDetected?: string;
  totalCost?: number;
  extractedItems: string[];
  confidenceScore: number;
};

@Injectable()
export class DocumentAnalysisService {
  extractMetadata(text: string): ExtractedMetadata {
    const extractedItems: string[] = [];

    const dateMatch = text.match(
      /\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/,
    );

    const mileageMatch = text.match(
      /\b(?:mileage|odometer|miles)\D{0,15}([0-9,]{3,7})\b/i,
    );

    const registrationMatch = text.match(
      /\b[A-Z]{2}[0-9]{2}\s?[A-Z]{3}\b/i,
    );

    const costMatch = text.match(
      /(?:total|amount due|balance due|grand total)\D{0,20}£?\s?([0-9]+(?:\.[0-9]{2})?)/i,
    );

    let garageName: string | undefined;

    if (/john\s+clark/i.test(text)) {
      garageName = 'John Clark BMW';
    } else if (/bmw/i.test(text)) {
      garageName = 'BMW Service Centre';
    } else if (/land\s+rover|range\s+rover/i.test(text)) {
      garageName = 'Land Rover / Range Rover';
    }

    if (/oil/i.test(text)) extractedItems.push('Oil service');
    if (/brake/i.test(text)) extractedItems.push('Brake inspection');
    if (/filter|microfilter/i.test(text)) extractedItems.push('Filter replacement');
    if (/tyre|tire/i.test(text)) extractedItems.push('Tyre check');
    if (/diagnostic/i.test(text)) extractedItems.push('Diagnostic scan');

    let confidenceScore = 0.2;

    if (dateMatch) confidenceScore += 0.15;
    if (mileageMatch) confidenceScore += 0.2;
    if (registrationMatch) confidenceScore += 0.15;
    if (costMatch) confidenceScore += 0.15;
    if (garageName) confidenceScore += 0.15;

    return {
      documentDate: dateMatch ? this.parseDate(dateMatch[1]) : undefined,
      mileage: mileageMatch
        ? Number(mileageMatch[1].replace(/,/g, ''))
        : undefined,
      garageName,
      registrationDetected: registrationMatch
        ? registrationMatch[0].toUpperCase().replace(/\s/g, '')
        : undefined,
      totalCost: costMatch ? Number(costMatch[1]) : undefined,
      extractedItems,
      confidenceScore: Math.min(confidenceScore, 1),
    };
  }

  private parseDate(value: string): Date | undefined {
    const parts = value.split(/[\/.-]/);

    if (parts.length !== 3) return undefined;

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    let year = Number(parts[2]);

    if (year < 100) {
      year += 2000;
    }

    return new Date(year, month, day);
  }
}