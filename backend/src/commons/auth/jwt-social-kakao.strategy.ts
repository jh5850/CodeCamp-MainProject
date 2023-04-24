// jwt-social-google.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: 'http://localhost:3000/login/kakao',
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);


    return {
      name: profile.displayName,
      email: profile._json.email,    // 1.(여기가 잘못됨)다시 확인하기
      hashedPassword: '1234',        // 2.이메일 카카오 필수동의로 만들기!
      age: 0,
      address:'',
      birth:'', 
      phone:'',
    };
  }
}