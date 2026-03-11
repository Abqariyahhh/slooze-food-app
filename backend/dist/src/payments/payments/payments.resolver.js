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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const payment_type_1 = require("../dto/payment.type");
const payment_input_1 = require("../dto/payment.input");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const roles_guard_1 = require("../../auth/roles.guard");
const roles_decorator_1 = require("../../auth/roles.decorator");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
const client_1 = require("@prisma/client");
let PaymentsResolver = class PaymentsResolver {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    myPayments(user) {
        return this.paymentsService.getMyPayments(user);
    }
    addPayment(input, user) {
        return this.paymentsService.addPayment(input, user);
    }
    updatePayment(id, input, user) {
        return this.paymentsService.updatePayment(id, input, user);
    }
    deletePayment(id, user) {
        return this.paymentsService.deletePayment(id, user);
    }
};
exports.PaymentsResolver = PaymentsResolver;
__decorate([
    (0, graphql_1.Query)(() => [payment_type_1.PaymentMethodType]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsResolver.prototype, "myPayments", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, graphql_1.Mutation)(() => payment_type_1.PaymentMethodType),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_input_1.AddPaymentInput, Object]),
    __metadata("design:returntype", void 0)
], PaymentsResolver.prototype, "addPayment", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, graphql_1.Mutation)(() => payment_type_1.PaymentMethodType),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payment_input_1.UpdatePaymentInput, Object]),
    __metadata("design:returntype", void 0)
], PaymentsResolver.prototype, "updatePayment", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsResolver.prototype, "deletePayment", null);
exports.PaymentsResolver = PaymentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => payment_type_1.PaymentMethodType),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsResolver);
//# sourceMappingURL=payments.resolver.js.map