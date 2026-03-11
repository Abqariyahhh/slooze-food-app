import { OrdersService } from './orders.service';
import { CreateOrderInput } from '../dto/order.input';
import { User } from '@prisma/client';
export declare class OrdersResolver {
    private ordersService;
    constructor(ordersService: OrdersService);
    myOrders(user: User): Promise<{
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
}
