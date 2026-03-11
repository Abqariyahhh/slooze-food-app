import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { Country } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userCountry: Country) {
    return this.prisma.restaurant.findMany({
      where: { country: userCountry, isActive: true },
      include: { menuItems: { where: { isAvailable: true } } },
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string, userCountry: Country) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: { where: { isAvailable: true } } },
    });
    if (!restaurant) throw new ForbiddenException('Restaurant not found');
    if (restaurant.country !== userCountry)
      throw new ForbiddenException('Access denied: outside your country');
    return restaurant;
  }
}
