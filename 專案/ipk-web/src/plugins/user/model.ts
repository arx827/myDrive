import { AccountDto } from '@fubonlife/ipk-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: AccountDto;
}
