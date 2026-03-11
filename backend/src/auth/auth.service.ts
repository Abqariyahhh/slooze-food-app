import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterInput, LoginInput } from './dto/auth.input';
import { AuthPayload } from './dto/auth.type';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(input: RegisterInput): Promise<AuthPayload> {
    const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: { ...input, password: hashed },
    });
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { accessToken: token, email: user.email, firstName: user.firstName, role: user.role, country: user.country, userId: user.id };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { accessToken: token, email: user.email, firstName: user.firstName, role: user.role, country: user.country, userId: user.id };
  }
}
