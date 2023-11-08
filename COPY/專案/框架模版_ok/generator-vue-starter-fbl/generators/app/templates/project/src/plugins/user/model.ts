import { AccountDto } from '@fubonlife/<%= code %>-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: AccountDto;
}