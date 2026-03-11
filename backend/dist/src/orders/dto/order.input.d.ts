export declare class OrderItemInput {
    menuItemId: string;
    quantity: number;
}
export declare class CreateOrderInput {
    restaurantId: string;
    items: OrderItemInput[];
    notes?: string;
}
