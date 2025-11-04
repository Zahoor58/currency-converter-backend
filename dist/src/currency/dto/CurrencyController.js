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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyController = void 0;
const common_1 = require("@nestjs/common");
const currency_service_1 = require("./currency.service");
const historical_query_dto_1 = require("./dto/historical-query.dto");
const latest_query_dto_1 = require("./dto/latest-query.dto");
let CurrencyController = class CurrencyController {
    constructor(currencyService) {
        this.currencyService = currencyService;
    }
    async getLatest(query) {
        return this.currencyService.latest(query.base);
    }
    async getHistorical(query) {
        return this.currencyService.historical(query.base, query.date);
    }
    async getSymbols() {
        return this.currencyService.symbols();
    }
};
exports.CurrencyController = CurrencyController;
__decorate([
    (0, common_1.Get)('latest'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof latest_query_dto_1.LatestQueryDto !== "undefined" && latest_query_dto_1.LatestQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "getLatest", null);
__decorate([
    (0, common_1.Get)('historical'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof historical_query_dto_1.HistoricalQueryDto !== "undefined" && historical_query_dto_1.HistoricalQueryDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "getHistorical", null);
__decorate([
    (0, common_1.Get)('symbols'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "getSymbols", null);
exports.CurrencyController = CurrencyController = __decorate([
    (0, common_1.Controller)('currency'),
    __metadata("design:paramtypes", [typeof (_a = typeof currency_service_1.CurrencyService !== "undefined" && currency_service_1.CurrencyService) === "function" ? _a : Object])
], CurrencyController);
//# sourceMappingURL=CurrencyController.js.map