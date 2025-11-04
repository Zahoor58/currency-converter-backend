import { ConfigService } from '@nestjs/config';
export declare class CurrencyService {
    private readonly config;
    private readonly baseUrl;
    private readonly apiKey;
    constructor(config: ConfigService);
    private callApi;
    latest(base: string): Promise<unknown>;
    historical(base: string, date: string): Promise<unknown>;
    symbols(): Promise<unknown>;
}
