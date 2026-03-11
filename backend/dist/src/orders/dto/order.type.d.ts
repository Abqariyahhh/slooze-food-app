export declare class OrderItemType {
    id: string;
    menuItemId: string;
    quantity: number;
    price: number;
    menuItemName?: string;
}
export declare class OrderType {
    id: string;
    userId: string;
    restaurantId: string;
    restaurantName: string;
    status: string;
    totalAmount: number;
    notes?: string;
    createdAt: Date;
    items: OrderItemType[];
}
