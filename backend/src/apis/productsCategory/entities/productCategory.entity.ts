import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProductCategory{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id: string

    @Column({ unique: true }) // 이름이 같을필요가 없어서.
    @Field(() => String)
    name: string;


    @Column({ default: false }) //기본값을 false로 지정.
    @Field(() => Boolean)
    set: boolean;


    // @Column({nullable:true})
    // @Field(()=>Boolean)
    // set: Boolean            //<<?

}

