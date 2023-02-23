import axios from 'axios';
import {
  Configuration,
  AuthApi, AuthApiFactory,
  GIOAuthApi, GIOAuthApiFactory,
  MenuApi, MenuApiFactory,
  UtilityApi, UtilityApiFactory,
  GIOMaintenanceApi, GIOMaintenanceApiFactory,
  GIOUnitManagementApi, GIOUnitManagementApiFactory,
  GIOInsuranceApi, GIOInsuranceApiFactory,
  GIOMessageMaintainApi, GIOMessageMaintainApiFactory,
  GIOInsDeptMaintainApi, GIOInsDeptMaintainApiFactory,
  GIODocsetApi, GIODocsetApiFactory,
  GIOMarketingApi, GIOMarketingApiFactory,
  GIOUtilityApi, GIOUtilityApiFactory,
  GIOInsPlanReviewApi, GIOInsPlanReviewApiFactory,
  GIODataProcessApi, GIODataProcessApiFactory,
} from '@fubonlife/co-giiss-api-axios-sdk';

declare module 'vue/types/vue' {
  interface Vue {
    $authApi: AuthApi;
    $gioAuthApi: GIOAuthApi;
    $menuApi: MenuApi;
    $utilityApi: UtilityApi;
    $maintenanceApi: GIOMaintenanceApi;
    $unitManagementApi: GIOUnitManagementApi;
    $gioInsuranceApi: GIOInsuranceApi;
    $messageMaintainApi: GIOMessageMaintainApi;
    $insDeptMaintainApi: GIOInsDeptMaintainApi;
    $gioDocsetApi: GIODocsetApi;
    $gioMarketingApi: GIOMarketingApi;
    $gioUtilityApi: GIOUtilityApi;
    $gioInsPlanReviewApi: GIOInsPlanReviewApi;
    $gioDataProcessApi: GIODataProcessApi;
  }
}
export default new (class Api {
  public install(Vue, options: Configuration) {
    Vue.prototype.$authApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    Vue.prototype.$gioAuthApi = GIOAuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 登入功能
    Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 功能選單
    Vue.prototype.$utilityApi = UtilityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 共用
    Vue.prototype.$maintenanceApi = GIOMaintenanceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 維護作業
    Vue.prototype.$messageMaintainApi = GIOMessageMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 公告維護
    Vue.prototype.$gioDocsetApi = GIODocsetApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 文件維護
    Vue.prototype.$unitManagementApi = GIOUnitManagementApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 要保單位維護作業
    Vue.prototype.$gioInsuranceApi = GIOInsuranceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 險種資料維護
    Vue.prototype.$insDeptMaintainApi = GIOInsDeptMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 要保單位資料維護
    Vue.prototype.$gioMarketingApi = GIOMarketingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 行銷區域維護
    Vue.prototype.$gioUtilityApi = GIOUtilityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 團險行政-共用
    Vue.prototype.$gioInsPlanReviewApi = GIOInsPlanReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 險種核保規則／計劃別維護
    Vue.prototype.$gioDataProcessApi = GIODataProcessApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios); // 資料處理-查詢
  }
})();
