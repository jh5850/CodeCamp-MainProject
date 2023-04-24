import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';


@Entity() // 불러줄때
@ObjectType()
export class User{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id: string

    @Column()       //mysql
    @Field(()=>String)
    email: string

    @Column()
    @Field(()=>String)
    name: string

    @Column()
    @Field(()=>String)
    phone: string

    @Column()
    @Field(()=>String)
    birth: string

    @Column()
    @Field(()=>String)
    address: string

    @Column()
    password: string

    @Column({ default: 0 })
    @Field(() => Int)
    payment: number;     //사용자가 현재까지 지불한 금액

    @DeleteDateColumn()
    DeletedAt:Date

}