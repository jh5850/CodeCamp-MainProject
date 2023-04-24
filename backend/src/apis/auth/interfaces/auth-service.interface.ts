import { Response } from 'express';
import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUserItem } from 'src/commons/types/context';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUserItem;    //IAuthUserItem  ?????? context.ts는 모하는거???
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  res: Response;
}
