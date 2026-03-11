import { Module } from '@nestjs/common';
import { PaymentsService } from './payments/payments.service';
import { PaymentsResolver } from './payments/payments.resolver';

@Module({
  providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
