export declare class MenuItemType {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
    restaurantId: string;
}
export declare class RestaurantType {
    id: string;
    name: string;
    description?: string;
    country: string;
    address?: string;
    rating: number;
    isActive: boolean;
    menuItems?: MenuItemType[];
}
