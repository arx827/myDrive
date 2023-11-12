import { AccountDto } from '@fubonlife/iams-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: AccountDto;
}
