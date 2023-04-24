import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from "src/apis/products/entities/product.entity";
import { Field, ObjectType } from '@nestjs/graphql';


@Entity()
@ObjectType()
export class ProductIngredient{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string

    @Column()
    @Field(() => String)
    ingredient: string

    @Column()
    @Field(() => String)
    origin: string;
    
    @ManyToOne(() => Product)
    @Field(() => Product)
    product: Product;

    
}