import { Country, Role } from '@prisma/client';
export declare class RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    country: Country;
}
export declare class LoginInput {
    email: string;
    password: string;
}
