import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(filePath: string): Promise<string> {
    const worker = await createWorker('eng');

    try {
      const result = await worker.recognize(filePath);
      return result.data.text;
    } finally {
      await worker.terminate();
    }
  }
}