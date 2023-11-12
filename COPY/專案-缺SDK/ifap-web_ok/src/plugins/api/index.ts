import axios from 'axios';
import {
  Configuration,
  AuthApiFactory,
  AuthApi,
  DepartmentApi,
  DepartmentApiFactory,
  UserApi,
  UserApiFactory,
  RoleApi,
  RoleApiFactory,
  MenuApi,
  MenuApiFactory,
  SmtpApi,
  SmtpApiFactory,
  EmailVerifyApi,
  EmailVerifyApiFactory,
  EmailRecordApi,
  EmailRecordApiFactory,
  ValidDomainApi,
  ValidDomainApiFactory,
  UserMaintenanceApi,
  UserMaintenanceApiFactory,
  MailAccountApi,
  MailAccountApiFactory,
} from "@fubonlife/ifap-api-axios-sdk";
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $authApi: AuthApi;
    $userApi: UserApi;
    $departmentApi: DepartmentApi;
    $roleApi: RoleApi;
    $menuApi: MenuApi;
    $smtpApi: SmtpApi;
    $emailVerifyApi: EmailVerifyApi;
    $emailRecordApi: EmailRecordApi;
    $validDomainApi: ValidDomainApi;
    $userMaintenanceApi: UserMaintenanceApi;
    $mailAccountApi: MailAccountApi;
  }
}
export default new (class Api {
  public install(Vue, options: Configuration) {
    Vue.prototype.$authApi = AuthApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$userApi = UserApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$departmentApi = DepartmentApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$roleApi = RoleApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$menuApi = MenuApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$smtpApi = SmtpApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$emailVerifyApi = EmailVerifyApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$emailRecordApi = EmailRecordApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$validDomainApi = ValidDomainApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$userMaintenanceApi = UserMaintenanceApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
    Vue.prototype.$mailAccountApi = MailAccountApiFactory(
      options,
      process.env.VUE_APP_API_BASE_URL,
      axios,
    );
  }
})();
