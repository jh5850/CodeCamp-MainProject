import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/update-user.input";
import { UseGuards } from "@nestjs/common";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { IContext } from "src/commons/types/context";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthGuard } from "@nestjs/passport";

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //

    @InjectRepository(User)
    private readonly usersRepository: Repository<User> //
  ) {}

  // 1.생성
  @Mutation(() => User)
  async createUser(
    @Args("email") email: string,
    @Args("name") name: string,
    @Args("phone") phone: string,
    @Args("birth") birth: string,
    @Args("address") address: string,
    @Args("password") password: string

    // @Args({ name: 'age', type: () => Int }) age: number, //모르겠다...
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      email,
      name,
      phone,
      birth,
      address,
      hashedPassword,
    });
  }

  // 2.조회

  @Query(() => User)
  fetchUser(
    @Args("email") email: string //
  ): Promise<User> {
    return this.usersService.findOne({ email });
  }

  @Query(() => [User])
  fetchUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // 3.수정
  @Mutation(() => User)
  async updateUser(
    @Args("email") email: string,
    @Args("UpdateUserInput") updateUserInput: UpdateUserInput
  ): Promise<User> {
    const user = await this.usersService.findOne({ email });
    // Q) 검증하는 로직은 Resolver vs Service 어디에서 검증하는게 좋을까??
    return this.usersService.update({ user, updateUserInput });
  }

  // 4.삭제
  @Mutation(() => Boolean)
  deleteUser(
    @Args("UserId") userId: string //
  ): Promise<boolean> {
    return this.usersService.delete({ userId });
  }

  /////----------조회-------------/////
  @UseGuards(GqlAuthAccessGuard) //로그인한 유저만 실행되도록 방어막치는것.
  @Query(() => User)
  fetchLoginUser(@Context() context: IContext) {
    console.log(context.req.user.email);
    return this.usersService.findLogin({ context });
  }

  /////----------삭제-------------/////

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteLoginUser(
    // @Args('userId') userId: string
    @Context() context: IContext
  ) {
    return this.usersService.deleteLogin({ context });
  }

  /////----------수정-------------/////

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async updateLoginUser(
    @Context() context: IContext,
    @Args("password") password: string
  ) {
    console.log(context.req.user.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.findOne({
      where: {
        email: context.req.user.email,
      },
    });
    return this.usersService.loginUpdate({ user, hashedPassword });
  }
}
