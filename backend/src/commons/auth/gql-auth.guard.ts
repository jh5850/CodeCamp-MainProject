import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthAccessGuard extends AuthGuard('access') { 
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}
// 어쓰가드 상속하고 'access'라는 어쓰가드를 쓰기위해서 정해주는것
// 패스포트에 req를 보내주기위해서 로직만듬.

//UsersResolver -> GqlAuthAccessGuard ->JwtAccessStrategy

// GqlAuthAccessGuard -JwtAccessStrategy이 req를 못가져와서  중간에서 이어주는 역할



export class GqlAuthRefreshGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req;
  }
}
