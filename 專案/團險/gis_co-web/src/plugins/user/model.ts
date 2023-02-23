import { UserInfoDto, FgppolrJoin } from '@fubonlife/co-giiss-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: UserInfoDto;
  policyDetail: FgppolrJoin;
}
