import { PaymentType } from '@prisma/client';
export declare class AddPaymentInput {
    type: PaymentType;
    last4: string;
    nickname?: string;
    isDefault?: boolean;
}
export declare class UpdatePaymentInput {
    nickname?: string;
    isDefault?: boolean;
}
