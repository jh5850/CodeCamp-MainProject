import { UpdateUserInput } from "../dto/update-user.input";
import { User } from "../entities/user.entity";

export interface IUsersServiceCreate {
                        //왜 id 없지???
  email: string;
  name: string;
  phone: string;
  birth: string
  address: string;
  hashedPassword: string;
  
}

export interface IUsersServiceFindOne {
  email: string 
}

export interface IUsersServiceUpdate {
  user: User 
  updateUserInput : UpdateUserInput
}

export interface IUsersServiceDelete {
  userId: string 

}