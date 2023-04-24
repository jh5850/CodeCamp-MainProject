import { IAuthUser } from 'src/commons/types/context';


export interface IPaymentsServiceCreate {
    impUid: string
    amount: number
    user: IAuthUser['user']
}

export interface IPaymentsServiceFetchData{
    impUid : string;
    access_token: string
}
