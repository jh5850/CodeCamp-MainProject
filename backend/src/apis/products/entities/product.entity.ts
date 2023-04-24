// entity는 mysql들어갈떄 사용한한다. 디비버에서 컬럼명이다.
import {
  Entity,
  Column,
  JoinTable,
  OneToOne,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";
import { ProductAllergy } from "src/apis/productsAllergy/productAllergy.entity";
import { Payment } from "src/apis/payment/entities/payment.entity";
import { ProductCategory } from "src/apis/productsCategory/entities/productCategory.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType() // DB에 구조를 만드는것.
@Entity()
export class Product {
  //
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  ko_name: string;

  @Column()
  @Field(() => String)
  en_name: string;

  @Column()
  @Field(() => String)
  detail: string;

  // @Column()
  // @Field(() => Int)
  // price: number

  @Column()
  @Field(() => Int)
  kcal: number;

  @Column()
  @Field(() => Int)
  sugar: number;

  @Column()
  @Field(() => Int)
  protein: number;

  @Column({ type: "decimal", precision: 3, scale: 2 }) //???
  @Field(() => Int)
  transfat: number;

  @Column()
  @Field(() => Int)
  salt: number;

  @Column({ default: false }) //아직 안팔렸다.   // Column MYSQl
  @Field(() => Boolean) // Field 그래프큐엘 - 앞에대문자
  isSoldout: boolean; //<< 자바스크립트여서 - 소문자

  ////////////////////////////

  @ManyToOne(() => ProductCategory)
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  @JoinTable()
  @Field(() => [ProductAllergy])
  @ManyToMany(() => ProductAllergy, (productAllergy) => productAllergy.products)
  productAllergy: ProductAllergy[];

  // @JoinColumn()
  // @OneToOne(() => Payment)
  // @Field(()=>Payment)
  // payment: Payment;

  @DeleteDateColumn()
  deletedAt: Date;
}
