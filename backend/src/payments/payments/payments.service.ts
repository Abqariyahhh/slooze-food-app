import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { User, Role } from '@prisma/client';
import { AddPaymentInput } from '../dto/payment.input';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getMyPayments(user: User) {
    return this.prisma.paymentMethod.findMany({ where: { userId: user.id } });
  }

  async addPayment(input: AddPaymentInput, user: User) {
    if (user.role !== Role.ADMIN)
      throw new ForbiddenException('Only Admins can add payment methods');
    if (input.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }
    return this.prisma.paymentMethod.create({ data: { ...input, userId: user.id } });
  }

  async updatePayment(id: string, input: Partial<AddPaymentInput>, user: User) {
    if (user.role !== Role.ADMIN)
      throw new ForbiddenException('Only Admins can modify payment methods');
    return this.prisma.paymentMethod.update({ where: { id }, data: input });
  }

  async deletePayment(id: string, user: User) {
    if (user.role !== Role.ADMIN)
      throw new ForbiddenException('Only Admins can delete payment methods');
    await this.prisma.paymentMethod.delete({ where: { id } });
    return true;
  }
}
