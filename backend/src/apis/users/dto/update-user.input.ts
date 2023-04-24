import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  // name: string
  // description: string
  // price: number
}

// PickType(CreateProductInput, ['name', 'price']); => 고르기
// OmitType(CreateProductInput, ['description']);   => 빼기
// PartialType(CreateProductInput);                 => 있어도 되고 없어도 됨(nullable)
