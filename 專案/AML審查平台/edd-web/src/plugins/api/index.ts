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

    Vue.prototype.$reviewApi = ReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);        // 待審查
    Vue.prototype.$confirmApi = ConfirmApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);      // 待覆核
    Vue.prototype.$addAmlApi = AddAmlCaseApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);    // aml 手動新增案件
    Vue.prototype.$addAmlPendingApi = AddAmlPendingReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);    // aml 手動覆核案件

    Vue.prototype.$permissionApplicationApi = PermissionApplicationApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);   // 權限設定-待審查
    Vue.prototype.$permissionApprovalApi = PermissionApprovalApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);         // 權限設定-待覆核
    Vue.prototype.$declareApi = DeclareApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 可疑交易申報
    Vue.prototype.$searchAMLReviewDataApi = SearchAMLReviewDataApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); //審查查詢
    Vue.prototype.$pwdEncodeApi = PwdEncodeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); //密碼編譯
  }
})();
