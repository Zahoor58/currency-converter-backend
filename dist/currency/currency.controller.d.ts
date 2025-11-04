import { CurrencyService } from './currency.service';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    getLatest(base?: string): Promise<unknown>;
    getHistorical(date: string, base?: string): Promise<unknown>;
    getSymbols(): Promise<unknown>;
}
