import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderType } from '../dto/order.type';
import { CreateOrderInput } from '../dto/order.input';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { RolesGuard } from '../../auth/roles.guard'; // ✅ now used
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User, Role } from '@prisma/client';

@Resolver(() => OrderType)
@UseGuards(GqlAuthGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [OrderType])
  myOrders(@CurrentUser() user: User) {
    return this.ordersService.getMyOrders(user);
  }

  @Mutation(() => OrderType)
  createOrder(@Args('input') input: CreateOrderInput, @CurrentUser() user: User) {
    return this.ordersService.createOrder(input, user);
  }

  // ✅ Guard moved to resolver — removed manual role check from service
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Mutation(() => OrderType)
  checkoutOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.checkoutOrder(orderId, user);
  }

  // ✅ Guard moved to resolver — removed manual role check from service
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Mutation(() => OrderType)
  cancelOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.cancelOrder(orderId, user);
  }
}
