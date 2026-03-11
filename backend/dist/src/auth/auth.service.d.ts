import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { RegisterInput, LoginInput } from './dto/auth.input';
import { AuthPayload } from './dto/auth.type';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(input: RegisterInput): Promise<AuthPayload>;
    login(input: LoginInput): Promise<AuthPayload>;
}
