import { ConfigService } from '@nestjs/config';
export declare class CurrencyService {
    private configService;
    private baseUrl;
    constructor(configService: ConfigService);
    getLatest(base?: string): Promise<any>;
    getHistorical(date: string, base?: string): Promise<any>;
    getSymbols(): Promise<any>;
}
