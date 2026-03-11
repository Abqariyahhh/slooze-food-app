import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth.type';
import { LoginInput, RegisterInput } from './dto/auth.input';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    health(): string;
    register(input: RegisterInput): Promise<AuthPayload>;
    login(input: LoginInput): Promise<AuthPayload>;
}
