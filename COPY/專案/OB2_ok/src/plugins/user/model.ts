import { AccountDto } from '@fubonlife/obd-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: AccountDto;
}