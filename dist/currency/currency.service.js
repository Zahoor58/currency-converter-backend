"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let CurrencyService = class CurrencyService {
    constructor(config) {
        this.config = config;
        this.baseUrl = this.config.get('CURRENCY_API_BASE') || 'https://api.freecurrencyapi.com/v1';
        this.apiKey = this.config.get('CURRENCY_API_KEY');
    }
    async callApi(path, params = {}) {
        try {
            const url = `${this.baseUrl}/${path}`;
            const response = await axios_1.default.get(url, {
                params: { ...params, apikey: this.apiKey },
                timeout: 10000,
            });
            return response.data;
        }
        catch (err) {
            console.error('Currency API error', err?.response?.data || err.message);
            throw new common_1.HttpException('Failed to fetch currency data', common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async latest(base) {
        const params = {};
        if (base)
            params.base_currency = base;
        return this.callApi('latest', params);
    }
    async historical(base, date) {
        if (!date) {
            throw new common_1.HttpException('date query param required', common_1.HttpStatus.BAD_REQUEST);
        }
        const params = { date };
        if (base)
            params.base_currency = base;
        return this.callApi('historical', params);
    }
    async symbols() {
        return this.callApi('latest', {});
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map