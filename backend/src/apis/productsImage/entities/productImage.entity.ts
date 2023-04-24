import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "src/apis/products/entities/product.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class ProductImage{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id: string

    @Column()
    @Field(()=>String)
    url: string

    @ManyToOne(() => Product)
    @Field(()=>Product)
    product: Product;

}