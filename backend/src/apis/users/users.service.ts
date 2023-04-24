import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import {
  IUsersServiceCreate,
  IUsersServiceFindOne,
  IUsersServiceUpdate,
  IUsersServiceDelete,
} from "./interfaces/users-service.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  ////////////////////////////////////
  // 1.생성
  async create({
    email,
    name,
    phone,
    birth,
    address,
    hashedPassword: password, //원래는 오른쪽에서 왼쪽인데 이건 왼쪽에서 오른쪽!!!
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user) throw new ConflictException("이미 등록된 이메일입니다.");
    // if (user) throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);

    return this.usersRepository.save({
      email,
      name,
      user,
      phone,
      birth,
      address,
      password,
    });
  }

  ////////////////////////////////////
  // 2.조회
  // async findOne({ userId }: IUsersServiceFindOne): Promise<User> {
  //   const result = await this.usersRepository.findOne({
  //     where: {id: userId}
  //   })
  //   return result
  // }

  ////////////////////////////////////
  // 3.수정

  findOne({ email }: IUsersServiceFindOne): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  /////----------수정-------------/////

  async update({ user, updateUserInput }: IUsersServiceUpdate): Promise<User> {
    const { password, ...rest } = updateUserInput;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = this.usersRepository.save({
      ...user, //수정 후 수정되지 않은 다른 결과값까지 모두 받고싶을때 사용
      password: hashedPassword, //패스워드에다가 해쉬를담겠다
      ...rest,
    });
    return result;
  }

  ////////////////////////////////////
  // 4.삭제
  async delete({ userId }: IUsersServiceDelete): Promise<boolean> {
    // 5. 소프트 삭제(TypeORM 제공) - softDelete
    const result2 = await this.usersRepository.softDelete({ id: userId }); // 장점: 다른 컬럼으로도 삭제 가능
    return result2.affected ? true : false; //                                   // 단점: 여러ID 한번에 지우기 불가능
  }

  // async delete({ userId }: IUsersServiceDelete): Promise<boolean> {

  //   const result = await this.usersRepository.softDelete({ user_id: userId });
  //   return result.affected ? true : false;
  // }

  //////////////////////////////////////

  /////----------조회-------------/////

  findLogin({ context }) {
    return this.usersRepository.findOne({
      where: {
        email: context.req.user.email,
      },
    });
  }

  /////----------삭제-------------/////

  async deleteLogin({ context }) {
    const result = await this.usersRepository.softDelete({
      id: context.req.user.id,
    });
    return result.affected ? true : false;
  }

  /////----------수정-------------/////

  async loginUpdate({ user, hashedPassword: password }) {
    const result = await this.usersRepository.save({
      ...user,
      password,
    });
    return result ? true : false;
  }
}
