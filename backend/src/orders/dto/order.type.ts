import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class OrderItemType {
  @Field(() => ID) id: string;
  @Field() menuItemId: string;
  @Field() quantity: number;
  @Field(() => Float) price: number;
  @Field({ nullable: true }) menuItemName?: string;
}

@ObjectType()
export class OrderType {
  @Field(() => ID) id: string;
  @Field() userId: string;
  @Field() restaurantId: string;
  @Field() restaurantName: string;
  @Field() status: string;
  @Field(() => Float) totalAmount: number;
  @Field({ nullable: true }) notes?: string;
  @Field() createdAt: Date;
  @Field(() => [OrderItemType]) items: OrderItemType[];
}
