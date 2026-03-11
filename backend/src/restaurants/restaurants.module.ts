import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants/restaurants.service';
import { RestaurantsResolver } from './restaurants/restaurants.resolver';

@Module({
  providers: [RestaurantsService, RestaurantsResolver],
})
export class RestaurantsModule {}
