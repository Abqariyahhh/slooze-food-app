import { Module } from '@nestjs/common';
import { OrdersService } from './orders/orders.service';
import { OrdersResolver } from './orders/orders.resolver';

@Module({
  providers: [OrdersService, OrdersResolver],
})
export class OrdersModule {}
