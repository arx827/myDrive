import { AdmUserDto } from '@fubonlife/co-giiss-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: AdmUserDto;
}
