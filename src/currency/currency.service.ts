import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CurrencyService {
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor(private readonly config: ConfigService) {
        this.baseUrl = this.config.get<string>('CURRENCY_API_BASE') || 'https://api.freecurrencyapi.com/v1';
        this.apiKey = this.config.get<string>('CURRENCY_API_KEY');
    }

    private async callApi(path: string, params = {}) {
        try {
            const url = `${this.baseUrl}/${path}`;
            const response = await axios.get(url, {
                params: { ...params, apikey: this.apiKey },
                timeout: 10000,
            });
            return response.data;
        } catch (err: any) {
            console.error('Currency API error', err?.response?.data || err.message);
            throw new HttpException('Failed to fetch currency data', HttpStatus.BAD_GATEWAY);
        }
    }

    async latest(base: string) {
        // default base if not provided
        const params: any = {};
        if (base) params.base_currency = base;
        return this.callApi('latest', params);
    }

    async historical(base: string, date: string) {
        if (!date) {
            throw new HttpException('date query param required', HttpStatus.BAD_REQUEST);
        }

        // Validate that the date is not in the future or too recent
        const requestedDate = new Date(date);
        const today = new Date();
        // Set time to start of day for comparison
        today.setHours(0, 0, 0, 0);
        requestedDate.setHours(0, 0, 0, 0);

        if (requestedDate > today) {
            throw new HttpException('Date cannot be in the future', HttpStatus.BAD_REQUEST);
        }

        // API may have a delay - use date at least 1 day in the past
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        oneDayAgo.setHours(0, 0, 0, 0);

        if (requestedDate > oneDayAgo) {
            throw new HttpException(
                'Historical data is only available for dates at least 1 day in the past. Please use the latest endpoint for recent rates.',
                HttpStatus.BAD_REQUEST
            );
        }

        const params: any = { date };
        if (base) params.base_currency = base;
        return this.callApi('historical', params);
    }


    async symbols() {
        // freecurrencyapi might have /symbols endpoint; if not, we can parse latest keys
        return this.callApi('latest', {});
    }
}
