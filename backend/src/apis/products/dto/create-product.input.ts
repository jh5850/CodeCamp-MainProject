import { Field, InputType, Int } from '@nestjs/graphql';

@InputType() // 플레이그라운드에 보여지는것.
export class CreateProductInput {
  @Field(() => String)
  ko_name: string;

  @Field(() => String)
  en_name: string;

  @Field(() => String)
  detail: string;

  // @Field(() => Int)
  // price: number;

  @Field(() => Int)
  kcal: number;

  @Field(() => Int)
  sugar: number;

  @Field(() => Int)
  protein: number;

  @Field(() => Int)
  transfat: number;

  @Field(() => Int)
  salt: number;

  @Field(() => String)
  ProductCategoryId: string;    //<<<  노션에서는 아이디를 가져오는데 아이디가 잘모르겠다.

  @Field(() => [String])
  ProductAllergy: string[];

  // @Field(() => [String])  
  // img_url: string;  

}
