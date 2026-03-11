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
exports.OrdersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const order_type_1 = require("../dto/order.type");
const order_input_1 = require("../dto/order.input");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const roles_guard_1 = require("../../auth/roles.guard");
const roles_decorator_1 = require("../../auth/roles.decorator");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
const client_1 = require("@prisma/client");
let OrdersResolver = class OrdersResolver {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    myOrders(user) {
        return this.ordersService.getMyOrders(user);
    }
    createOrder(input, user) {
        return this.ordersService.createOrder(input, user);
    }
    checkoutOrder(orderId, user) {
        return this.ordersService.checkoutOrder(orderId, user);
    }
    cancelOrder(orderId, user) {
        return this.ordersService.cancelOrder(orderId, user);
    }
};
exports.OrdersResolver = OrdersResolver;
__decorate([
    (0, graphql_1.Query)(() => [order_type_1.OrderType]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersResolver.prototype, "myOrders", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_type_1.OrderType),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_input_1.CreateOrderInput, Object]),
    __metadata("design:returntype", void 0)
], OrdersResolver.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, graphql_1.Mutation)(() => order_type_1.OrderType),
    __param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersResolver.prototype, "checkoutOrder", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, graphql_1.Mutation)(() => order_type_1.OrderType),
    __param(0, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersResolver.prototype, "cancelOrder", null);
exports.OrdersResolver = OrdersResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_type_1.OrderType),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersResolver);
//# sourceMappingURL=orders.resolver.js.map