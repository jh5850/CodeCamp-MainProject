// auth.controller.ts

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
    hashedPassword: string;
    age: number;
    birth:string,
    phone:string,
    address:string
  };
}

@Controller()
export class AuthController {
  constructor(
		private readonly usersService: UsersService, //
    private readonly authService: AuthService,
  ) {}
/////////////////////구글////////////////////////////

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
		// 1. 회원조회
    let user = await this.usersService.findOne({ email: req.user.email });

    // 2. 회원가입이 안돼있다면? 자동회원가입
    if (!user) user = await this.usersService.create({ ...req.user });
    
    // 3. 로그인
    this.authService.setRefreshToken({ user, res });
    res.redirect('http://localhost:5500/homework/main-project/frontend/login/index.html');
  }

///////////////////////카카오///////////////////////////  


@Get('/login/kakao')
@UseGuards(AuthGuard('kakao'))
async loginKakao(
  @Req() req: Request & IOAuthUser, //
  @Res() res: Response,
) {
  // 1. 회원조회
  let user = await this.usersService.findOne({ email: req.user.email });

  // 2. 회원가입이 안돼있다면? 자동회원가입
  if (!user) user = await this.usersService.create({ ...req.user });

  // 3. 로그인
  this.authService.setRefreshToken({ user, res });
  res.redirect('http://localhost:5500/homework/main-project/frontend/login/index.html');  ////////
}

///////////////////////네이버///////////////////////////  

@Get('/login/naver')
@UseGuards(AuthGuard('naver'))
async loginNaver(
  @Req() req: Request & IOAuthUser, //
  @Res() res: Response,
) {
  // 1. 회원조회
  let user = await this.usersService.findOne({ email: req.user.email });

  // 2. 회원가입이 안돼있다면? 자동회원가입
  if (!user) user = await this.usersService.create({ ...req.user });

  // 3. 로그인
  this.authService.setRefreshToken({ user, res });
  res.redirect('http://localhost:5500/homework/main-project/frontend/login/index.html');
}


}