import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';

@Injectable()   ///서비스안의 인젝터블???
export class AuthService {      /// 클래스 어쓰서비스
  constructor(      ///객체의 초기값을 설정하는것???????
    private readonly jwtService: JwtService, //
  ) {}      //제이슨웹토큰 ???????


  setRefreshToken({ user, res }: IAuthServiceSetRefreshToken): void {  ///set붙인이유??셋리프레쉬토큰안에 유저,응답 : 보이드=리턴값이 없을때    유저와 리스판스 어떻게 하려고 한로직???
    const refreshToken = this.jwtService.sign(   //  ???
      { email: user.email, sub: user.id },  // 디비저장 이메일을 이메일을 할당??
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );      /// 리스레쉬토큰을 변수로선언 = {이메일,섭,비번,기간}안에 값들로

    // // 개발환경
    // @ts-ignore
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);    //  res.헤더에다가 쿠키에다가 리프레시토큰을 저장한다.
                  // 위에 const refreshToken가 템플릿리터널로 안에 넣어준다.

    // 배포환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`)
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
  }
  
  


  getAccessToken({ user }: IAuthServiceGetAccessToken): string {    ///겟어세스토큰의 유저를 받고 스트링타입
    return this.jwtService.sign(  ///리턴, 제이슨서비스.싸인(암호화하는것.)
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    );
  }                 ///{ 이메일, 섭,비번, 기간을}


        /// cookie - 백엔드랑 연동이되는 저장소.
        /// localStorage - 브라우저에서만 사용되는 저장소.
        /// sessionStorage - 브라우저에서만 사용되는 저장소.

        // 쿠키에다가 리프레시토큰 넣어서 준다.
        // 바디에다가 어쎄스토큰 넣어서 준다.
}
