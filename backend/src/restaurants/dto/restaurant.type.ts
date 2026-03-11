import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class MenuItemType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field({ nullable: true }) description?: string;
  @Field() price: number;
  @Field({ nullable: true }) imageUrl?: string;
  @Field() isAvailable: boolean;
  @Field() restaurantId: string;
}

@ObjectType()
export class RestaurantType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field({ nullable: true }) description?: string;
  @Field() country: string;
  @Field({ nullable: true }) address?: string;
  @Field(() => Float) rating: number;
  @Field() isActive: boolean;
  @Field(() => [MenuItemType], { nullable: true }) menuItems?: MenuItemType[];
}
