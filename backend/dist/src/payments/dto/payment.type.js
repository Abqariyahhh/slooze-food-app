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
exports.PaymentMethodType = void 0;
const graphql_1 = require("@nestjs/graphql");
let PaymentMethodType = class PaymentMethodType {
    id;
    userId;
    type;
    last4;
    nickname;
    isDefault;
    createdAt;
};
exports.PaymentMethodType = PaymentMethodType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], PaymentMethodType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PaymentMethodType.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PaymentMethodType.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PaymentMethodType.prototype, "last4", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PaymentMethodType.prototype, "nickname", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaymentMethodType.prototype, "isDefault", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], PaymentMethodType.prototype, "createdAt", void 0);
exports.PaymentMethodType = PaymentMethodType = __decorate([
    (0, graphql_1.ObjectType)()
], PaymentMethodType);
//# sourceMappingURL=payment.type.js.map