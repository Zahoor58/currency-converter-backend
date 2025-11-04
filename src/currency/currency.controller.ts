import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { HistoricalQueryDto } from './dto/HistoricalQueryDto';
import { LatestQueryDto } from './dto/LatestQueryDto';


@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get('latest')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getLatest(@Query() query: LatestQueryDto) {
        return this.currencyService.latest(query.base);
    }

    @Get('historical')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async getHistorical(@Query() query: HistoricalQueryDto) {
        return this.currencyService.historical(query.base, query.date);
    }

    @Get('symbols')
    async getSymbols() {
        return this.currencyService.symbols();
    }
}

