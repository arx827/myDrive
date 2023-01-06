import { AccountVO } from '@fubonlife/edd-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: AccountVO;
}