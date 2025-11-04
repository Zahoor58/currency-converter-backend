import { CurrencyService } from './currency.service';
import { HistoricalQueryDto } from './dto/HistoricalQueryDto';
import { LatestQueryDto } from './dto/LatestQueryDto';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    getLatest(query: LatestQueryDto): Promise<unknown>;
    getHistorical(query: HistoricalQueryDto): Promise<unknown>;
    getSymbols(): Promise<unknown>;
}
