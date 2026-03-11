import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantType } from '../dto/restaurant.type';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => RestaurantType)
@UseGuards(GqlAuthGuard)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  @Query(() => [RestaurantType])
  restaurants(@CurrentUser() user: User) {
    return this.restaurantsService.findAll(user.country);
  }

  @Query(() => RestaurantType)
  restaurant(@Args('id', { type: () => ID }) id: string, @CurrentUser() user: User) {
    return this.restaurantsService.findOne(id, user.country);
  }
}
