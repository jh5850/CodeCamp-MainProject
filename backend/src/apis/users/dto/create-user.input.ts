import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()  //넣어줄때
export class CreateUserInput {
    @Field(()=>String)
    id: string

    @Field(()=>String)  //grphql
    email: string

    @Field(()=>String)
    name: string

    @Field(()=>String)
    phone: string

    @Field(()=>String)
    birth: string

    @Field(()=>String)
    address: string

    @Field(()=>String)
    password: string
}
