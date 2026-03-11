import { PrismaService } from '../prisma/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        country: import(".prisma/client").$Enums.Country;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
