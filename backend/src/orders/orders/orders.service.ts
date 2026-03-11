import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User, Role } from '@prisma/client';
import { CreateOrderInput } from '../dto/order.input';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(input: CreateOrderInput, user: User) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    if (restaurant.country !== user.country)
      throw new ForbiddenException('Cannot order from restaurants outside your country');

    // ✅ Fixed N+1: single query instead of one per item
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: input.items.map((i) => i.menuItemId) } },
    });
    const menuMap = new Map(menuItems.map((m) => [m.id, m]));

    let total = 0;
    const itemsData: { menuItemId: string; quantity: number; price: any }[] = [];

    for (const item of input.items) {
      const menuItem = menuMap.get(item.menuItemId);
      if (!menuItem) throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
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

  async getMyOrders(user: User) {
    const orders = await this.prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { include: { menuItem: true } }, restaurant: true },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(this.mapOrder);
  }

  async checkoutOrder(orderId: string, user: User) {
    // ✅ Removed manual role check — now handled by RolesGuard on resolver
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== user.id && user.role !== Role.ADMIN)
      throw new ForbiddenException('Not your order');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });
    return this.mapOrder(updated);
  }

  async cancelOrder(orderId: string, user: User) {
    // ✅ Removed manual role check — now handled by RolesGuard on resolver
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== user.id && user.role !== Role.ADMIN)
      throw new ForbiddenException('Not your order');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });
    return this.mapOrder(updated);
  }

  private mapOrder(order: any) {
    return {
      id: order.id,
      userId: order.userId,
      restaurantId: order.restaurantId,
      restaurantName: order.restaurant?.name || '',
      status: order.status,
      totalAmount: Number(order.totalAmount),
      notes: order.notes,
      createdAt: order.createdAt,
      items: order.items.map((i: any) => ({
        id: i.id,
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        price: Number(i.price),
        menuItemName: i.menuItem?.name,
      })),
    };
  }
}
