import { ConflictException, HttpException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { Payment } from "../payment/entities/payment.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ImaportService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentsRepository: Repository<Payment>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ){}


/////////////1.액세스 토큰(access token) 발급 받기///////////////
  async getToken(){
    try {
      const result = await axios.post('http://api.iamport.kr/users/getToken', {
        imp_key:process.env.IAMPORT_API_KEY,
        imp_secret:process.env.IAMPORT_SECRET,
      })
      return result.data.response.access_token;
    } catch(error){
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      )
    }
  }

///////////////////////////////////////////////////////////


  async checkPaid({impUid, amount, token }){
    try {
      const result = await axios.get(
        `http://api.iamport.kr/payments/${impUid}`,
        { headers: {Authorization: token} },
      )
      if(result.data.response.status !== 'paid') throw new ConflictException('결제 내역이 존재하지 않습니다.')

      if(result.data.response.amount !== amount)
      throw new UnprocessableEntityException('결제 금액이 잘못되었습니다.')
      console.log(result.data.response.amount)

    } catch (error) {
      if (error?.response?.data?.message){
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        )
      } else {
        throw error;
      }
    }
  }

///////////////////////////////////////////////////////
    async cancel({impUid, token}){
      try {
        const result = axios.post(
          'http://api.iamport.kr/payments/cancel',
        { imp_Uid: impUid },
        { headers: {Authorization: token } },
      )

      
      return result
    } catch(error){
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      )
    }
  }
}

















/////////////////////////////////////////////////////////

    // async fetchtoken(impUid: string): Promise<void> {    ////void반환값을 없을때<<<<?
    //     const imp_uid = impUid;
    //     const getToken = await axios({
    //         url: "https://api.iamport.kr/users/getToken",
    //         method: "post", // POST method
    //         headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    //         data: {
    //             imp_key: process.env.IAMPORT_API_KEY, // REST API키
    //             imp_secret: process.env.IAMPORT_SECRET, // REST API Secret
    //         },
    //     });

    //     return getToken.data  //리턴값을 해줘야지 DB에저장


// ///////////////////인증토큰//////////////////
//         const access_token = await getToken.data.response.access_token;  ///
//         console.log('getToken', getToken);        

// ///////// imp_uid로 아임포트 서버에서 결제 정보 조회 ///////////
//         const getPaymentData = await axios({
//           url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
//           method: "get", // GET method   <<조회하기
//           headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
//         }).catch((error)=>{
//           console.log(error);
//           throw new UnprocessableEntityException('이미 결제되었습니다');
//         })
        

// ///////////// 조회한 결제 정보///////////////
//         const paymentData = await getPaymentData.data.response; 

// /////////// // DB에서 결제되어야 하는 금액 조회///////////

//         const order = await this.paymentsRepository.findOne({      ///          페이먼트레파지토리아이디를찾아서 order에 할당
//             where: { id: imp_uid },
//         });


//         const amountToBePaid = order.amount;     // 결제 되어야 하는 금액 //오더의어마운트를 어마운트페이드에할당


// /////////////결제 검증하기 ///////////

//     if (paymentData.amount === amountToBePaid){         ///페이먼트어마운트랑 어마운운트투미페이드랑 같으면
//       await this.paymentsRepository.update(          /// 페이먼트레파지토리에 업데이트 아이디랑 어마운트값
//         {impUid: imp_uid},  //impuid를 찾아서 amount를 업데이트해준다.
//         {amount: paymentData.amount},
//       );
//     } else {                                           // 그렇지않으면 던져라 위조 메세지를
//       throw { status: 'forgery', message: '위조된 결제시도' };


//     }
//   }
// }
