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
exports.RestaurantsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const restaurants_service_1 = require("./restaurants.service");
const restaurant_type_1 = require("../dto/restaurant.type");
const gql_auth_guard_1 = require("../../auth/gql-auth.guard");
const current_user_decorator_1 = require("../../auth/current-user.decorator");
let RestaurantsResolver = class RestaurantsResolver {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    restaurants(user) {
        return this.restaurantsService.findAll(user.country);
    }
    restaurant(id, user) {
        return this.restaurantsService.findOne(id, user.country);
    }
};
exports.RestaurantsResolver = RestaurantsResolver;
__decorate([
    (0, graphql_1.Query)(() => [restaurant_type_1.RestaurantType]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RestaurantsResolver.prototype, "restaurants", null);
__decorate([
    (0, graphql_1.Query)(() => restaurant_type_1.RestaurantType),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RestaurantsResolver.prototype, "restaurant", null);
exports.RestaurantsResolver = RestaurantsResolver = __decorate([
    (0, graphql_1.Resolver)(() => restaurant_type_1.RestaurantType),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsResolver);
//# sourceMappingURL=restaurants.resolver.js.map