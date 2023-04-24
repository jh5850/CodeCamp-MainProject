import {
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { IContext } from "src/commons/types/context";
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from "src/commons/auth/gql-auth.guard";
import { Cache } from "cache-manager";
import * as jwt from "jsonwebtoken";

@Resolver() ///@Resolver 모라고 해야할지 기억이아남..
export class AuthResolver {
  // 클래스 AuthResolver
  constructor(
    //의존성주입 여기서 사용하기 위해서 constructor 사용.
    private readonly usersService: UsersService, // 유저서비스를 가져옴
    private readonly authService: AuthService, // 어쓰서비스를 가져옴

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  @Mutation(() => String) ///뮤테이션 스트링타입 ->(getAccessToken) 타입이 스트링타입!
  async login(
    ///함수명 로그인
    @Args("email") email: string, /// 'email' - 플레이그라운드에서 쓰는 이름, 이메일은 스트링타입.
    @Args("password") password: string, /// 'password'- 플레이그라운드에서 쓰는 이름, 패스워드 스트링타입으로.
    @Context() context: IContext ///context는 req.res를 접근하기위해서 묶어서 가져올수있는 데코레이션.
  ): Promise<string> {
    /// 리턴타입이 프로미스이고 스트링타입인거.

    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOne({ email }); // 유저서비스에서 이메일만 찾는것을 유저로할당.

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
    if (!user) throw new UnprocessableEntityException("이메일이 없습니다."); ///만약 user가 없다면 던져라(보내라) '이메일이 없습니다.'

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    const isAuth = await bcrypt.compare(password, user.password); /// bcrypt를 사용한 비밀번호와 로그인시 입력한 비밀번호를확인.(로그인시비번, DB비번) 순서중요!!

    if (!isAuth) throw new UnprocessableEntityException("암호가 틀렸습니다."); ///만약인증이 안됐다면 보내라 '암호가 틀렸습니다'

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.authService.setRefreshToken({ user, res: context.res }); /// 쿠키에다가 담아야되서 res를 같이 담아준다.

    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user });
  } ///리턴해라 ?? 어쓰서비스의 겟어세스토큰의 유저를

  //////////////---------------##------------------//////////////////

  @UseGuards(GqlAuthRefreshGuard) ///로그인한 회원한해서 함수를 실행!!!!
  @Mutation(() => String) ///   뮤테이션 - 스트링타입
  restoreAcessToken(
    ///  함수명!
    @Context() context: IContext ///context는 req.res를 접근하기위해서 묶어서 가져올수있는 데코레이션.
  ): string {
    // ??????????????????

    // accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user: context.req.user }); ///리턴해라 어세스토큰의 겟토큰안에 유저, ?????????????
  }

  //////////////---------------##------------------//////////////////

  @UseGuards(GqlAuthAccessGuard) // 로그인한 회원한해서 함수르르 실행!
  @Mutation(() => String) ///뮤테이션 스트링타입
  async logout(
    //함수명
    @Context() context: IContext ///context는 req.res를 접근하기위해서 묶어서 가져올수있는 데코레이션.
  ) {
    console.log("111111111", context.req.headers);

    const accessToken = context.req.headers.authorization // Bearer를 빈칸으로!, accessToken으로 할당!
      .replace("Bearer ", "");

    console.log("2222222", accessToken);

    const refreshToken = context.req.headers.cookie // refreshToken을 빈칸으로, refreshToken으로 할당!
      .replace("refreshToken=", "");

    try {
      const decodeAe = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY); // ???

      const decodeRe = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY); // ???
    } catch (error) {
      throw new UnprocessableEntityException(error); //에러 생기면 던져라
    }

    await this.cacheManager.set(
      // 캐시매니저에 저장
      `accessToken = ${accessToken}`, // ??
      "accessToken",
      3600 // ??
    );

    await this.cacheManager.set(
      // 캐시매니저 저장
      `refreshToken = ${refreshToken}`, // ??
      "refreshToken",
      3600 // ??
    );

    return "로그아웃 성공";
  }
}
