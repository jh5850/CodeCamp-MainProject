import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {    
                   // extends - 상속받아서 핵심을 가지고 특정물건을 만든다.
                   // strategy - 객체들이 할 수 있는 동작을 각각의 전략으로 만들어 놓고 동적으로 동작을 변경해야 한다면 전략만 변경하여 동작이 바뀌도록 하는 패턴
                   //PassportStrategy ( Strategy ) 가져옴, 'access'라는 패스포트쓰기위해서 정해주는것, 노션 읽기

  constructor(
    @Inject(CACHE_MANAGER)          
    private readonly cacheManager: Cache,

  ) {      
    super({   //super안에 상속받것을 부모(PassportStrategy)의 생성자에게 다시 던져주는거. 그럼 PassportStrategy 실행한다.
      
      //   jwtFromRequest: (req) => {
      //     console.log(req);
      //     const temp = req.headers.Authorization; // Bearer sdaklfjqlkwjfkljas
      // temp - 임시로 잠깐 넣는 공간
      //     const accessToken = temp.toLowercase().replace('bearer ', '');
      //     return accessToken;
      //   },

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   //압축풀기
      secretOrKey: process.env.JWT_ACCESS_KEY,    /// ????
      passReqToCallback: true,        //  true인 경우 요청이 확인 콜백으로 전달됩니다. 즉 검증???
    });
  }

  async validate(req,payload) {  // validate- 위에 절차가 성공했을때 실행된다. 압축푼걸 페이로드로 받는다          // payload - 데이터가들어가있다(ex-email,id)
    console.log(payload); // { email: q@q.com, sub =  id: askljdfklj-128930djk }

    const accessToken = req.headers.authorization.replace('Bearer ', '')    // Bearer을 빈칸으로! 
    const checkAccess = await this.cacheManager.get(            // ????
      `accessToken = ${ accessToken }`,
    )

    if(checkAccess) {         // checkAccess 라면 던져라 에러를 
      throw new UnauthorizedException('로그아웃된 토큰입니다.')
    }

    return {  
      email: payload.email,       //리턴 플레이로드이메일을 이메일로
      id: payload.sub,            //리턴 플레이로드아이디를 아이디로
      exp: payload.exp,
    };
  }
}
