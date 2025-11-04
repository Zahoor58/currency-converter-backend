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
            if (err?.response?.data) {
                const apiError = err?.response?.data;
                const status = err?.response?.status;
                if (apiError.errors && typeof apiError.errors === 'object') {
                    const errorMessages = Object.entries(apiError.errors)
                        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                        .join('; ');
                    throw new common_1.HttpException({
                        message: apiError.message || 'Validation error',
                        details: errorMessages,
                        statusCode: status || common_1.HttpStatus.BAD_REQUEST
                    }, status || common_1.HttpStatus.BAD_REQUEST);
                }
                throw new common_1.HttpException(apiError.message || 'Failed to fetch currency data', status || common_1.HttpStatus.BAD_GATEWAY);
            }
            if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
                throw new common_1.HttpException('Request timeout - API is not responding', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
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
            throw new common_1.HttpException('Date query parameter is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            throw new common_1.HttpException('Invalid date format. Please use YYYY-MM-DD format.', common_1.HttpStatus.BAD_REQUEST);
        }
        const requestedDate = new Date(date);
        if (isNaN(requestedDate.getTime())) {
            throw new common_1.HttpException('Invalid date provided', common_1.HttpStatus.BAD_REQUEST);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        requestedDate.setHours(0, 0, 0, 0);
        if (requestedDate > today) {
            throw new common_1.HttpException('Date cannot be in the future', common_1.HttpStatus.BAD_REQUEST);
        }
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        twoDaysAgo.setHours(0, 0, 0, 0);
        if (requestedDate > twoDaysAgo) {
            throw new common_1.HttpException('Historical data is only available for dates at least 2 days in the past. Please use the latest endpoint for recent rates.', common_1.HttpStatus.BAD_REQUEST);
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
//# sourceMappingURL=CurrencyService.js.map