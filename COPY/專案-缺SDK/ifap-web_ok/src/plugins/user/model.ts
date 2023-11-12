import { UserDto } from '@fubonlife/ifap-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: UserDto;
}
