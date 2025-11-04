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
            
            // Handle specific API error responses
            if (err?.response?.data) {
                const apiError = err?.response?.data;
                const status = err?.response?.status;
                
                // Extract validation errors
                if (apiError.errors && typeof apiError.errors === 'object') {
                    const errorMessages = Object.entries(apiError.errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('; ');
                    throw new HttpException(
                        {
                            message: apiError.message || 'Validation error',
                            details: errorMessages,
                            statusCode: status || HttpStatus.BAD_REQUEST
                        },
                        status || HttpStatus.BAD_REQUEST
                    );
                }
                
                throw new HttpException(
                    apiError.message || 'Failed to fetch currency data',
                    status || HttpStatus.BAD_GATEWAY
                );
            }
            
            // Handle network/timeout errors
            if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
                throw new HttpException('Request timeout - API is not responding', HttpStatus.GATEWAY_TIMEOUT);
            }
            
            throw new HttpException('Failed to fetch currency data', HttpStatus.BAD_GATEWAY);
        }
    }

    async latest(base: string) {
        const params: any = {};
        if (base) params.base_currency = base;
        return this.callApi('latest', params);
    }

    async historical(base: string, date: string) {
        if (!date) {
            throw new HttpException('Date query parameter is required', HttpStatus.BAD_REQUEST);
        }
        
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            throw new HttpException(
                'Invalid date format. Please use YYYY-MM-DD format.',
                HttpStatus.BAD_REQUEST
            );
        }
        
        // Parse and validate the date
        const requestedDate = new Date(date);
        
        // Check if date is valid
        if (isNaN(requestedDate.getTime())) {
            throw new HttpException('Invalid date provided', HttpStatus.BAD_REQUEST);
        }
        
        // Check if date is not in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        requestedDate.setHours(0, 0, 0, 0);
        
        if (requestedDate > today) {
            throw new HttpException(
                'Date cannot be in the future',
                HttpStatus.BAD_REQUEST
            );
        }
        
        // API typically has a 1-2 day delay for historical data
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        twoDaysAgo.setHours(0, 0, 0, 0);
        
        if (requestedDate > twoDaysAgo) {
            throw new HttpException(
                'Historical data is only available for dates at least 2 days in the past. Please use the latest endpoint for recent rates.',
                HttpStatus.BAD_REQUEST
            );
        }
        
        const params: any = { date };
        if (base) params.base_currency = base;
        return this.callApi('historical', params);
    }

    async symbols() {
        return this.callApi('latest', {});
    }
}
