import axios from 'axios';
import {
  Configuration,
  AuthApi, AuthApiFactory,
  ProductApi, ProductApiFactory,
  ProductSpecApi, ProductSpecApiFactory,
  AccountApi, AccountApiFactory,
  RoleApi, RoleApiFactory,
  MenuApi, MenuApiFactory,
  ReviewApi, ReviewApiFactory,
  ConfirmApi, ConfirmApiFactory,
  AddAmlCaseApi, AddAmlCaseApiFactory,
  AddAmlPendingReviewApi, AddAmlPendingReviewApiFactory,
  DeclareApi, DeclareApiFactory,
  PermissionApplicationApi, PermissionApplicationApiFactory,
  PermissionApprovalApi, PermissionApprovalApiFactory,
  SearchAMLReviewDataApi, SearchAMLReviewDataApiFactory,
  PwdEncodeApi,PwdEncodeApiFactory,
} from '@fubonlife/edd-api-axios-sdk'
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
      $authApi: AuthApi
      $accountApi: AccountApi
      $productApi: ProductApi
      $productSpecApi: ProductSpecApi
      $roleApi: RoleApi
      $menuApi: MenuApi
      $reviewApi: ReviewApi
      $confirmApi: ConfirmApi
      $addAmlApi: AddAmlCaseApi
      $addAmlPendingApi: AddAmlPendingReviewApi
      $permissionApplicationApi: PermissionApplicationApi
      $permissionApprovalApi: PermissionApprovalApi
      $declareApi: DeclareApi
      $searchAMLReviewDataApi: SearchAMLReviewDataApi
      $pwdEncodeApi:PwdEncodeApi
    }
}
export default new (class Api {
  public install(Vue, options: Configuration) {
    Vue.prototype.$authApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    Vue.prototype.$accountApi = AccountApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    Vue.prototype.$productApi = ProductApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    Vue.prototype.$productSpecApi = ProductSpecApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    Vue.prototype.$roleApi = RoleApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);

    Vue.prototype.$reviewApi = ReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);        // ?????????
    Vue.prototype.$confirmApi = ConfirmApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);      // ?????????
    Vue.prototype.$addAmlApi = AddAmlCaseApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);    // aml ??????????????????
    Vue.prototype.$addAmlPendingApi = AddAmlPendingReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);    // aml ??????????????????

    Vue.prototype.$permissionApplicationApi = PermissionApplicationApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);   // ????????????-?????????
    Vue.prototype.$permissionApprovalApi = PermissionApprovalApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);         // ????????????-?????????
    Vue.prototype.$declareApi = DeclareApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // ??????????????????
    Vue.prototype.$searchAMLReviewDataApi = SearchAMLReviewDataApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); //????????????
    Vue.prototype.$pwdEncodeApi = PwdEncodeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); //????????????
  }
})();
