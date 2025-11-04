// src/currency/currency.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyService {
    private baseUrl: string;

    constructor(private configService: ConfigService) {
        this.baseUrl = this.configService.get('CURRENCY_API_BASE') + '/currency';
    }

    async getLatest(base?: string): Promise<any> {
        try {
            const params = base ? { base } : {};
            const response = await axios.get(`${this.baseUrl}/latest`, { params });
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                error.response?.data || 'Error fetching latest currency',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getHistorical(date: string, base?: string): Promise<any> {
        try {
            const params: any = { date };
            if (base) params.base = base;
            const response = await axios.get(`${this.baseUrl}/historical`, { params });
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                error.response?.data || 'Error fetching historical currency',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getSymbols(): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/symbols`);
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                error.response?.data || 'Error fetching symbols',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
