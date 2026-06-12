import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type CachedMotResult = {
  data: any;
  expiresAt: number;
};

@Injectable()
export class DvsaMotService {
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  private motCache = new Map<string, CachedMotResult>();

  constructor(private readonly httpService: HttpService) {}

  async getAccessToken() {
    const now = Date.now();

    if (this.accessToken && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const response = await firstValueFrom(
      this.httpService.post(
        process.env.DVSA_TOKEN_URL!,
        new URLSearchParams({
          client_id: process.env.DVSA_CLIENT_ID!,
          client_secret: process.env.DVSA_CLIENT_SECRET!,
          scope: process.env.DVSA_SCOPE!,
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiresAt = now + (response.data.expires_in - 60) * 1000;

    return this.accessToken;
  }

  async getMotHistoryByRegistration(registration: string) {
    const cleanRegistration = registration.replace(/\s/g, '').toUpperCase();
    const cached = this.motCache.get(cleanRegistration);
    const now = Date.now();

    if (cached && now < cached.expiresAt) {
      return cached.data;
    }

    const token = await this.getAccessToken();

    const response = await firstValueFrom(
      this.httpService.get(
        `${process.env.DVSA_MOT_BASE_URL}/v1/trade/vehicles/registration/${cleanRegistration}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': process.env.DVSA_API_KEY!,
            Accept: 'application/json',
          },
        },
      ),
    );

    this.motCache.set(cleanRegistration, {
      data: response.data,
      expiresAt: now + 1000 * 60 * 60,
    });

    return response.data;
  }
}