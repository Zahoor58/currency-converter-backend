import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get('latest')
    async getLatest(@Query('base') base?: string) {
        return this.currencyService.latest(base);
    }

    @Get('historical')
    async getHistorical(@Query('date') date: string, @Query('base') base?: string) {
        return this.currencyService.historical(base, date);
    }

    @Get('symbols')
    async getSymbols() {
        // returns latest and from that extract currencies on frontend
        return this.currencyService.symbols();
    }
}
