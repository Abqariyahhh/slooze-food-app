import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateOrderInput } from '../dto/order.input';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(input: CreateOrderInput, user: User): Promise<{
        id: any;
        userId: any;
        restaurantId: any;
        restaurantName: any;
        status: any;
        totalAmount: number;
        notes: any;
        createdAt: any;
        items: any;
    }>;
    getMyOrders(user: User): Promise<{
        id: any;
        userId: any;
        restaurantId: any;
        restaurantName: any;
        status: any;
        totalAmount: number;
        notes: any;
        createdAt: any;
        items: any;
    }[]>;
    checkoutOrder(orderId: string, user: User): Promise<{
        id: any;
        userId: any;
        restaurantId: any;
        restaurantName: any;
        status: any;
        totalAmount: number;
        notes: any;
        createdAt: any;
        items: any;
    }>;
    cancelOrder(orderId: string, user: User): Promise<{
        id: any;
        userId: any;
        restaurantId: any;
        restaurantName: any;
        status: any;
        totalAmount: number;
        notes: any;
        createdAt: any;
        items: any;
    }>;
    private mapOrder;
}
