import { InputType, Field } from '@nestjs/graphql';
import { PaymentType } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(PaymentType, { name: 'PaymentType' });

@InputType()
export class AddPaymentInput {
  @Field(() => PaymentType) type: PaymentType;
  @Field() last4: string;
  @Field({ nullable: true }) nickname?: string;
  @Field({ nullable: true }) isDefault?: boolean;
}

// ✅ NEW: was missing, needed for updatePayment mutation
@InputType()
export class UpdatePaymentInput {
  @Field({ nullable: true }) nickname?: string;
  @Field({ nullable: true }) isDefault?: boolean;
}
