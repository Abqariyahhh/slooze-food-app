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
exports.RestaurantType = exports.MenuItemType = void 0;
const graphql_1 = require("@nestjs/graphql");
let MenuItemType = class MenuItemType {
    id;
    name;
    description;
    price;
    imageUrl;
    isAvailable;
    restaurantId;
};
exports.MenuItemType = MenuItemType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], MenuItemType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MenuItemType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MenuItemType.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], MenuItemType.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MenuItemType.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], MenuItemType.prototype, "isAvailable", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], MenuItemType.prototype, "restaurantId", void 0);
exports.MenuItemType = MenuItemType = __decorate([
    (0, graphql_1.ObjectType)()
], MenuItemType);
let RestaurantType = class RestaurantType {
    id;
    name;
    description;
    country;
    address;
    rating;
    isActive;
    menuItems;
};
exports.RestaurantType = RestaurantType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RestaurantType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RestaurantType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RestaurantType.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RestaurantType.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RestaurantType.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], RestaurantType.prototype, "rating", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], RestaurantType.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(() => [MenuItemType], { nullable: true }),
    __metadata("design:type", Array)
], RestaurantType.prototype, "menuItems", void 0);
exports.RestaurantType = RestaurantType = __decorate([
    (0, graphql_1.ObjectType)()
], RestaurantType);
//# sourceMappingURL=restaurant.type.js.map