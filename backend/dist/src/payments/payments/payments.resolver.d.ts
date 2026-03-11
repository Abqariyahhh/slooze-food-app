import { PaymentsService } from './payments.service';
import { AddPaymentInput, UpdatePaymentInput } from '../dto/payment.input';
import { User } from '@prisma/client';
export declare class PaymentsResolver {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    myPayments(user: User): Promise<{
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
    updatePayment(id: string, input: UpdatePaymentInput, user: User): Promise<{
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
