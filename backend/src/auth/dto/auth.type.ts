import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field() accessToken: string;
  @Field() email: string;
  @Field() firstName: string;
  @Field() role: string;
  @Field() country: string;
  @Field() userId: string;
}
