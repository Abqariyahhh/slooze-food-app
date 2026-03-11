import { InputType, Field } from '@nestjs/graphql';
import { Country, Role } from '@prisma/client';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(Role, { name: 'Role' });
registerEnumType(Country, { name: 'Country' });

@InputType()
export class RegisterInput {
  @Field() email: string;
  @Field() password: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field(() => Role) role: Role;
  @Field(() => Country) country: Country;
}

@InputType()
export class LoginInput {
  @Field() email: string;
  @Field() password: string;
}
