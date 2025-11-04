import { CurrencyService } from './currency.service';
import { HistoricalQueryDto } from './dto/historical-query.dto';
import { LatestQueryDto } from './dto/latest-query.dto';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    getLatest(query: LatestQueryDto): Promise<any>;
    getHistorical(query: HistoricalQueryDto): Promise<any>;
    getSymbols(): Promise<any>;
}
