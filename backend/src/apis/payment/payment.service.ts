import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ArgumentOutOfRangeError } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { ImaportService } from '../iamport/imaport.service';
import { User } from '../users/entities/user.entity';
import { Payment,
  POINT_TRANSACTION_STATUS_ENUM, } from './entities/payment.entity';
import { IPaymentsServiceCreate } from './interfaces/payment-service.interface';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly iamPortService : ImaportService, ////???

    private readonly dataSource: DataSource,
  ){}

/////////////////////////////////////////////////////
  async checkDuplicate({ impUid }) {
    const result = await this.paymentsRepository.findOne({ where: {impUid} })
    if (result) throw new ConflictException('이미 결제된 아이디입니다.')
  }

////////////////////////////////////////////////////
  async checkAlreadyCanceled({impUid}) {
    const payment = await this.paymentsRepository.findOne({
      where:{
        impUid,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      }
    })
    if(payment) 
    throw new ConflictException('이미 취소된 결제 아이디입니다.')
  }

///////////////////////////////////////////////////////
  async checkHasCancelablePayment({ impUid, context }){
    const payment = await this.paymentsRepository.findOne({
      where:{
        impUid,
        user: { id: context.id },
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      }
    })
    if(!payment) 
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다')
    const user = await this.usersRepository.findOne
    ({
      where: {id: context.id}                     
    })
    if (user.payment < payment.amount)
      throw new UnprocessableEntityException('포인트가 부족합니다.')

    return 
  }

/////////////////////////////////////////////////////////

async cancel({ impUid, amount, user:_user }){
  const payment = await this.create({
    impUid,
    amount: -amount,
    user:_user,
    status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
  })
  return payment
}



//////////////////////////////////////////////////////////
async create({ impUid, amount, user:_user, status = POINT_TRANSACTION_STATUS_ENUM.PAYMENT}) {

  const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // ========================= transaction 시작!!! ========================
    await queryRunner.startTransaction('SERIALIZABLE');
    // ====================================================================

    // await this.paymentsRepository.save(Payment);

    try {
  const payment = this.paymentsRepository.create({
    impUid,
    amount,
    user:_user,
    status,
  })

   //결제 데이터를 결제 테이블에 추가
  // await this.paymentsRepository.save(payment)
  await queryRunner.manager.save(payment);

        // 2. 유저의 돈 찾아오기
  // const user = await this.usersRepository.findOne
  // ({
  //   where: {id: _user.id}                     
  // })

  const user = await queryRunner.manager.findOne(User, {
    where: { id: _user.id },
    lock: { mode: 'pessimistic_write' },
  });
  console.log(user)
          // 3. 유저의 돈 업데이트

  // await this.usersRepository.update(
  //   {id: user.id},
  //   {payment: user.payment + amount},
  // )

  const updatedUser = this.usersRepository.create({
    ...user,
    payment: user.payment + amount,
  });
  console.log(updatedUser)

  await queryRunner.manager.save(updatedUser);



  // ========================= commit 성공 확정!!! =========================
  await queryRunner.commitTransaction();
  // =====================================================================

  // 4. 최종결과 프론트엔드에 돌려주기
  return payment
} catch (error) {
  // ========================= rollback 되돌리기!!! =========================
  console.log(error)
  await queryRunner.rollbackTransaction();
  // =====================================================================
} finally {
  // ========================= 연결 해제!!! =========================
  await queryRunner.release();
  // ==============================================================
  }
}
}

///////////////////////////////////////////////////



























// //////////////////////////////////////////////////////////////////
//   await this.iamPortService.fetchtoken(impUid)  ///?????impUid가 DB에 저장


//   const payment = this.paymentsRepository.create({  ///값들을 payment로 변수선언
//     impUid,  
//     amount,
//     user: _user,
//     status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT, /// ///인터페이스 정확하게 쓰는이유? 로직정리를 위해서????
//   })




  
  
//   ///////
//   await this.paymentsRepository.save(payment)  ///payment 가 DB에 저장
  
//   // 2. 유저의 돈 찾아오기
//   const user = await this.usersRepository.findOne({ ///DB에 저장된 유저 id하나 찾는것
//     where: {id: _user.id}                     ///_user.id 찾는것
//   })

//   // 3. 유저의 돈 업데이트하기
//   await this.usersRepository.update(      ///DB에 저장된 유저 update하기
//     {id: _user.id},                       ///_user.id 업데이트
//     {payment: user.payment + amount}        ///변수 user에 amount의 + amount추가!  
//     //{point: user.point + amount}        // 를 amount로선언
//   )
//   // 4. 최종결과 브라우저에 돌려주기
//   return payment;         ///리턴 (브라우저?,리졸버?) payment를
// }



// ////////////////////////////////////////////
//   async create({ 
//     impUid,          ///리졸버에서 받은값들
//     amount,
//     user: _user, //_쓴이유는 임시로 쓰겠다.
//   }: IPaymentsServiceCreate): Promise<Payment> {


//     await this.iamPortService.fetchtoken(impUid)  ///?????impUid가 DB에 저장


//     const payment = this.paymentsRepository.create({  ///값들을 payment로 변수선언
//       impUid,  
//       amount,
//       user: _user,
//       status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT, /// ///인터페이스 정확하게 쓰는이유? 로직정리를 위해서????
//     })
    
//     ///////
//     await this.paymentsRepository.save(payment)  ///payment 가 DB에 저장
    
//     // 2. 유저의 돈 찾아오기
//     const user = await this.usersRepository.findOne({ ///DB에 저장된 유저 id하나 찾는것
//       where: {id: _user.id}                     ///_user.id 찾는것
//     })

//     // 3. 유저의 돈 업데이트하기
//     await this.usersRepository.update(      ///DB에 저장된 유저 update하기
//       {id: _user.id},                       ///_user.id 업데이트
//       {payment: user.payment + amount}        ///변수 user에 amount의 + amount추가!  
//       //{point: user.point + amount}        // 를 amount로선언
//     )
//     // 4. 최종결과 브라우저에 돌려주기
//     return payment;         ///리턴 (브라우저?,리졸버?) payment를
//   }



// /////////////////////////////////////////
//   async cancel({ impUid, amount, user:_user }: IPaymentsServiceCreate):
//   Promise<Payment> {///???
//             //리졸버에서 cancel 받은 값들

//     const getToken = await axios({  /// 값들을 getToken으로 할당
//       url: "https://api.iamport.kr/users/getToken",
//       method: "post", // POST method
//       headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
//       data: {
//         imp_key: "8561200764302035", // REST API키
//         imp_secret: "28MwFXMhQs7lH74HxgxLgIVUQUocNwravQxjhb1pfDd9hpEJvg4XqRneQi7COhPsJsp6yWfiaRJd5mkB", // REST API Secret
//       },
//     });

//     const access_token = await getToken.data.response.access_token; //겟토큰의데이터어세스토큰을 어세스토큰으로 선언
//     console.log('getToken', getToken);///???

//       ///리턴 (브라우저?,리졸버?) payment를
  
// /////-----------------------------------------///////////

// }
// }