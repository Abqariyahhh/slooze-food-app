import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentMethodType } from '../dto/payment.type';
import { AddPaymentInput, UpdatePaymentInput } from '../dto/payment.input';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User, Role } from '@prisma/client';

@Resolver(() => PaymentMethodType)
@UseGuards(GqlAuthGuard)
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query(() => [PaymentMethodType])
  myPayments(@CurrentUser() user: User) {
    return this.paymentsService.getMyPayments(user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => PaymentMethodType)
  addPayment(@Args('input') input: AddPaymentInput, @CurrentUser() user: User) {
    return this.paymentsService.addPayment(input, user);
  }

  // ✅ NEW: was in service but never exposed
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => PaymentMethodType)
  updatePayment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePaymentInput,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.updatePayment(id, input, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deletePayment(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.deletePayment(id, user);
  }
}
