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
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
let CurrencyService = class CurrencyService {
    constructor(configService) {
        this.configService = configService;
        this.baseUrl = this.configService.get('CURRENCY_API_BASE') + '/currency';
    }
    async getLatest(base) {
        try {
            const params = base ? { base } : {};
            const response = await axios_1.default.get(`${this.baseUrl}/latest`, { params });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || 'Error fetching latest currency', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getHistorical(date, base) {
        try {
            const params = { date };
            if (base)
                params.base = base;
            const response = await axios_1.default.get(`${this.baseUrl}/historical`, { params });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || 'Error fetching historical currency', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSymbols() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/symbols`);
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data || 'Error fetching symbols', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CurrencyService);
//# sourceMappingURL=CurrencyApiService.js.map