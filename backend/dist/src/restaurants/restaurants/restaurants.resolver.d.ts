import { RestaurantsService } from './restaurants.service';
import { User } from '@prisma/client';
export declare class RestaurantsResolver {
    private restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    restaurants(user: User): Promise<({
        menuItems: {
            id: string;
            name: string;
            description: string | null;
            isAvailable: boolean;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            restaurantId: string;
        }[];
    } & {
        id: string;
        country: import(".prisma/client").$Enums.Country;
        isActive: boolean;
        createdAt: Date;
        name: string;
        description: string | null;
        address: string | null;
        rating: number;
    })[]>;
    restaurant(id: string, user: User): Promise<{
        menuItems: {
            id: string;
            name: string;
            description: string | null;
            isAvailable: boolean;
            price: import("@prisma/client/runtime/library").Decimal;
            imageUrl: string | null;
            restaurantId: string;
        }[];
    } & {
        id: string;
        country: import(".prisma/client").$Enums.Country;
        isActive: boolean;
        createdAt: Date;
        name: string;
        description: string | null;
        address: string | null;
        rating: number;
    }>;
}
