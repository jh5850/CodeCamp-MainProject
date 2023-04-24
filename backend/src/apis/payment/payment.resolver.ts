import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import axios from 'axios';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { ImaportService } from '../iamport/imaport.service';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payment.service';

@Resolver()              
export class PaymentsResolver {  //수출 , 클래스 , 페이먼트리졸버
  constructor(                //객체의 초기 값을 설정할 수 있는것??
    private readonly paymnetsService: // 클래스 내에서만 접근이 가능, 읽기전용 프로퍼티
    PaymentsService,
    private readonly iamportService: // 클래스 내에서만 접근이 가능, 읽기전용 프로퍼티
    ImaportService,
  ) {}



  ////////////////////////나만의 결제 검증////////////////////////
  @UseGuards(GqlAuthAccessGuard)    /// 로그인한 회원 한해서 함수를   실행하는것
  @Mutation(() => Payment)//????????        // 그래프큐엘(쿼리,뮤테이션) 
  async createPayment(                    ///함수명
    @Args('impUid') impUid: string, /// 
    @Args({name:'amount', type: () => Int }) amount: number,    //그냥 number만 쓰게되면 1000.0 이런식으로 들어가기때문에 타입을 Int로 따로 또 한번 지정해주는게 필요하다. name은 amount로 쓰는대신 type을 Int로 하겠다는 타입지정이 한번더 필요함.
    @Context() context: IContext, // context - Request와 Response, header 등에 대한 정보들이 context에 존재 . context 정보를 가지고 올 수 있다.
    ): Promise<Payment> {   
      
      //검증로직들!!!
      // 1. 아임포트에 요청해서 결제 완료 기록이 존재하는지 확인한다.
      const token = await this.iamportService.getToken()
      await this.iamportService.checkPaid({ impUid, amount, token })

      // 2. payment 테이블에는 impUid가 1번만 존재해야 합니다.(중복 결제를 체크)
      await this.paymnetsService.checkDuplicate({ impUid })
      
      return this.paymnetsService.create({ impUid, amount, user:context.req.user });        /// 
  }

//////////////////////나만의 결제 취소////////////////////////
  @UseGuards(GqlAuthAccessGuard)    /// 로그인한 회원 한해서 함수를   실행하는것
  @Mutation(() => Payment)          // 그래프큐엘(쿼리,뮤테이션) 
  async cancelPayment(                    ///함수명
    @Args('impUid') impUid: string, /// 
    @Args({name:'amount', type: () => Int }) amount: number,    //그냥 number만 쓰게되면 1000.0 이런식으로 들어가기때문에 타입을 Int로 따로 또 한번 지정해주는게 필요하다. name은 amount로 쓰는대신 type을 Int로 하겠다는 타입지정이 한번더 필요함.
    @Context() context: IContext, // context - Request와 Response, header 등에 대한 정보들이 context에 존재 . context 정보를 가지고 올 수 있다.
    ): Promise<Payment> {     ///payment 함수를 기다리는것.
    // 검증로직들!!!!
    // 1. 이미 취소된 건인지 확인
    await this.paymnetsService.checkAlreadyCanceled({ impUid })

    // 2. 취소하기에 충분한 내 포인트 잔액이 남아있는지
    await this.paymnetsService.checkHasCancelablePayment({
      impUid,
      context,
    })


    // console.log("qqq")

    // 3. 실제로 아임포트에 취소 요청하기
    const token = await this.iamportService.getToken()
    const canceledAmount = await this.iamportService.cancel({ impUid, token })

    console.log("aaaaaaaaa",canceledAmount)
    

    // 4. payment 테이블에 결제 취소 등록하기
    return await this.paymnetsService.cancel({
      impUid,
      amount: amount,
      user:context.req.user
    })
  }
}


