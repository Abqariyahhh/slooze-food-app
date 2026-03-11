import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User } from '@prisma/client';
import { AddPaymentInput } from '../dto/payment.input';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyPayments(user: User): Promise<{
        id: string;
        createdAt: Date;
        isDefault: boolean;
        userId: string;
        type: import(".prisma/client").$Enums.PaymentType;
        last4: string;
        nickname: string | null;
    }[]>;
    addPayment(input: AddPaymentInput, user: User): Promise<{
        id: string;
        createdAt: Date;
        isDefault: boolean;
        userId: string;
        type: import(".prisma/client").$Enums.PaymentType;
        last4: string;
        nickname: string | null;
    }>;
    updatePayment(id: string, input: Partial<AddPaymentInput>, user: User): Promise<{
        id: string;
        createdAt: Date;
        isDefault: boolean;
        userId: string;
        type: import(".prisma/client").$Enums.PaymentType;
        last4: string;
        nickname: string | null;
    }>;
    deletePayment(id: string, user: User): Promise<boolean>;
}
