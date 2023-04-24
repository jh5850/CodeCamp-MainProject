import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';


export enum POINT_TRANSACTION_STATUS_ENUM { //열거하는 타입- 상수값중에서 비슷한 종료들을 묶어두기 위한 용도로 쓰임! 
    PAYMENT = 'PAYMENT',
    CANCEL = 'CANCEL',
}
                    ///그래프큐엘에서 쓰기위해서 registerEnumType 함수안에 넣어야한다.
registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
    name: 'POINT_TRANSACTION_STATUS_ENUM'       ///~을 name으로지정
});


@Entity()
@ObjectType()               ///객체타입으로 
export class Payment{       // payment
    @PrimaryGeneratedColumn('uuid')     ///PK값?? ,uuid 유니크한 아이디
    @Field(()=>String)          ///그래프큐엘은 대문자
    id: string                  ///자바스크립트(id) 는 소문자

    @Column()                   /// colum 은 mysql   
    @Field(() => String)
    impUid: string;

    @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM })
    @Field(() => POINT_TRANSACTION_STATUS_ENUM)
    status: string;

    @Column()
    @Field(()=>Int)
    amount: number      //결제할때 새로 들어온 금액

    @Column({default:""})
    @Field(()=>String)
    method: string

    @Column({default:""})
    @Field(()=>String)
    reason: string


    // @JoinColumn()              
    // @OneToOne(() => User)                /// User테이블과 원투원 열결
    // @Field(()=> User)        // 주석풀면 에러남((node:154) UnhandledPromiseRejectionWarning: Error: Cannot determine a GraphQL input type ("User") for the "user". Make sure your class is decorated with an appropriate decorator.)
    // user: User;     

    @ManyToOne(() => User)
    @Field(() => User)              //payment(=productOrder.input).input.ts를삭제 -> 에러나는곳으고 가서 쓸모없는값들을 삭제...day22가서확인 
    user: User;
    
    @CreateDateColumn()
    @Field(() => Date)
    cratedAt: Date;


}