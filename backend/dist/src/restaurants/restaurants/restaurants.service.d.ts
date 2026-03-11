import { PrismaService } from '../../prisma/prisma/prisma.service';
import { Country } from '@prisma/client';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userCountry: Country): Promise<({
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
    findOne(id: string, userCountry: Country): Promise<{
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
