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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(input, user) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: input.restaurantId },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
        if (restaurant.country !== user.country)
            throw new common_1.ForbiddenException('Cannot order from restaurants outside your country');
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: input.items.map((i) => i.menuItemId) } },
        });
        const menuMap = new Map(menuItems.map((m) => [m.id, m]));
        let total = 0;
        const itemsData = [];
        for (const item of input.items) {
            const menuItem = menuMap.get(item.menuItemId);
            if (!menuItem)
                throw new common_1.NotFoundException(`Menu item ${item.menuItemId} not found`);
            total += Number(menuItem.price) * item.quantity;
            itemsData.push({ menuItemId: item.menuItemId, quantity: item.quantity, price: menuItem.price });
        }
        const order = await this.prisma.order.create({
            data: {
                userId: user.id,
                restaurantId: input.restaurantId,
                totalAmount: total,
                notes: input.notes,
                items: { create: itemsData },
            },
            include: { items: { include: { menuItem: true } }, restaurant: true },
        });
        return this.mapOrder(order);
    }
    async getMyOrders(user) {
        const orders = await this.prisma.order.findMany({
            where: { userId: user.id },
            include: { items: { include: { menuItem: true } }, restaurant: true },
            orderBy: { createdAt: 'desc' },
        });
        return orders.map(this.mapOrder);
    }
    async checkoutOrder(orderId, user) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== user.id && user.role !== client_1.Role.ADMIN)
            throw new common_1.ForbiddenException('Not your order');
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' },
            include: { items: { include: { menuItem: true } }, restaurant: true },
        });
        return this.mapOrder(updated);
    }
    async cancelOrder(orderId, user) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.userId !== user.id && user.role !== client_1.Role.ADMIN)
            throw new common_1.ForbiddenException('Not your order');
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
            include: { items: { include: { menuItem: true } }, restaurant: true },
        });
        return this.mapOrder(updated);
    }
    mapOrder(order) {
        return {
            id: order.id,
            userId: order.userId,
            restaurantId: order.restaurantId,
            restaurantName: order.restaurant?.name || '',
            status: order.status,
            totalAmount: Number(order.totalAmount),
            notes: order.notes,
            createdAt: order.createdAt,
            items: order.items.map((i) => ({
                id: i.id,
                menuItemId: i.menuItemId,
                quantity: i.quantity,
                price: Number(i.price),
                menuItemName: i.menuItem?.name,
            })),
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map