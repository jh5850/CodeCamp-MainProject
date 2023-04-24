import {Entity, ManyToMany, PrimaryGeneratedColumn, Column} from 'typeorm'
import { Product } from 'src/apis/products/entities/product.entity' 
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class ProductAllergy{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string

    @Column()
    @Field(() => String)
    name: string

    @ManyToMany(() => Product, (products) => products.productAllergy)  //?
    @Field(() => [Product])
    products: Product[];
}


