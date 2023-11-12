import { UserInfoDto, RoleDto } from '@fubonlife/oss-api-axios-sdk';

export interface LoginState {
  accessToken: string;
  me: UserInfoDto;
  roles: RoleDto[];
  selectedRole: string;
}
