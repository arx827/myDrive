import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import RouterPage from '@compononts/layout/RouterPageLayout.vue';
import { message } from 'ant-design-vue';
import { BehaviorSubject, Subject } from 'rxjs';
import MainPage from '@/pages/MainPage.vue';
import LoginPage from '@/pages/LoginPage.vue';

import Index from '@/pages/Index.vue';
// 人員管理 / 群組權限
import GroupPermissionsComp from '@/pages/personnel/group_permissions/GroupPermissions_index.vue';
import GroupPermissionsAddAndEditComp from '@/pages/personnel/group_permissions/GroupPermissions_addAndEdit.vue';

// GIS / 查詢作業 / 保單狀態查詢
import SearchPolicyStateComp from '@/pages/gis/search/policy_state/SearchPolicyState_index.vue';
import SearchPolicyStateResultComp from '@/pages/gis/search/policy_state/SearchPolicyState_result.vue';

// GIS / 查詢作業 / 異動資料查詢
import SearchChangeDataComp from '@/pages/gis/search/change_data/SearchChangeData_index.vue';
import SearchChangeDataResultComp from '@/pages/gis/search/change_data/SearchChangeData_result.vue';
import SearchChangeDataDetailsComp from '@/pages/gis/search/change_data/SearchChangeData_details.vue';

// GIS / 查詢作業 / 人員派件統計
import SearchDispatchComp from '@/pages/gis/search/dispatch/SearchDispatch_index.vue';
import SearchDispatchResultComp from '@/pages/gis/search/dispatch/SearchDispatch_result.vue';

// GIS / 查詢作業 / 團險收據列印
import SearchPrintComp from '@/pages/gis/search/print/SearchPrint_index.vue';
import SearchPrintResultComp from '@/pages/gis/search/print/SearchPrint_result.vue';

// GIS / 維護作業 / 公告維護
import MaintenancePaComp from '@/pages/gis/maintenance_gio/pa/MaintenancePa_index.vue';
import MaintenancePaAddAndEditComp from '@/pages/gis/maintenance_gio/pa/MaintenancePa_addAndEdit.vue';

// GIS / 維護作業 / 文件維護
import MaintenanceDocComp from '@/pages/gis/maintenance_gio/doc/MaintenanceDoc_index.vue';
import MaintenanceDocAddAndEditComp from '@/pages/gis/maintenance_gio/doc/MaintenanceDoc_addAndEdit.vue';
import MaintenanceDocApprovingComp from '@/pages/gis/maintenance_gio/doc/MaintenanceDoc_approving.vue';

// GIS / 維護作業 / 險種資料維護
import MaintenanceInsuranceTypeDataComp from '@/pages/gis/maintenance_gio/insurance_type_data/MITypeData_index.vue';
import MaintenanceInsuranceTypeDataEditComp from '@/pages/gis/maintenance_gio/insurance_type_data/MITypeData_edit.vue';
import MaintenanceInsuranceTypeDataPlanComp from '@/pages/gis/maintenance_gio/insurance_type_data/MITypeData_underwriteRuleAndPlan.vue';
import MaintenanceInsuranceTypeDataRuleEditComp from '@/pages/gis/maintenance_gio/insurance_type_data/MITypeData_underwriteRuleEdit.vue';
import MaintenanceInsuranceTypeDataPlanAddAndEditComp from '@/pages/gis/maintenance_gio/insurance_type_data/MITypeData_underwritePlanAddAndEdit.vue';

// GIS / 維護作業 / 公司基本資料維護
import MaintenanceCompanyInfoComp from '@/pages/gis/maintenance_gio/company_info/MaintenanceCompanyInfo.vue';
import MaintenanceCompanyInfoConfirmComp from '@/pages/gis/maintenance_gio/company_info/MaintenanceCompanyInfo_confirm.vue';

// GIS / 維護作業 / 營業類別維護
import MaintenanceBusinessComp from '@/pages/gis/maintenance_gio/business/MaintenanceBusiness.vue';
import MaintenanceBusinessAddAndEditComp from '@/pages/gis/maintenance_gio/business/MaintenanceBusiness_addAndEdit.vue';

// GIS / 要保單位維護 / 要保單位資料維護
import ApplMaintenanceApplDataComp from '@/pages/gis/appl_maintenance/appl_data/ApplMaintenanceApplData.vue';
import ApplMaintenanceApplDataResultComp from '@/pages/gis/appl_maintenance/appl_data/ApplMaintenanceApplData_result.vue';
import ApplMaintenanceApplDataConfirmComp from '@/pages/gis/appl_maintenance/appl_data/ApplMaintenanceApplData_confirm.vue';

// GIS / 要保單位維護 / 承辦人帳號維護
import ApplMaintenanceUndertakerDataComp from '@/pages/gis/appl_maintenance/undertaker_data/ApplMaintenanceUndertakerData_index.vue';
import ApplMaintenanceUndertakerDataResultComp from '@/pages/gis/appl_maintenance/undertaker_data/ApplMaintenanceUndertakerData_result.vue';
import ApplMaintenanceUndertakerDataAddAndEditComp from '@/pages/gis/appl_maintenance/undertaker_data/ApplMaintenanceUndertakerData_addAndEdit.vue';
import ApplMaintenanceUndertakerDataConfirmComp from '@/pages/gis/appl_maintenance/undertaker_data/ApplMaintenanceUndertakerData_confirm.vue';

// GIS / 要保單位維護 / 險種核保規則／計劃別維護
import ApplMaintenanceInsuranceTypeComp from '@/pages/gis/appl_maintenance/insurance_type/ApplMaintenanceInsuranceType.vue';
import ApplMaintenanceInsuranceTypeResultComp from '@/pages/gis/appl_maintenance/insurance_type/ApplMaintenanceInsuranceType_result.vue';
import ApplMaintenanceInsuranceTypeResultInsurancePlanComp from '@/pages/gis/appl_maintenance/insurance_type/ApplMaintenanceInsuranceType_insurancePlan.vue';
import ApplMaintenanceInsuranceTypeResultPlanComp from '@/pages/gis/appl_maintenance/insurance_type/ApplMaintenanceInsuranceType_resultPlan.vue';
import ApplMaintenanceInsuranceTypeResultRuleComp from '@/pages/gis/appl_maintenance/insurance_type/ApplMaintenanceInsuranceType_resultRule.vue';

// GIS / 行銷人員專區 / 團險保費查詢
import MarketingGioPremiumGioComp from '@/pages/gis/marketing_gio/premium_gio/MarketingPremiumGio_index.vue';
// GIS / 行銷人員專區 / 行銷區域維護
import MarketingGioMarketingComp from '@/pages/gis/marketing_gio/marketing/Marketing_index.vue';
import MarketingGioMarketingEditComp from '@/pages/gis/marketing_gio/marketing/Marketing_edit.vue';

// import ProductPage from '@/pages/ProductPage.vue'
// import RolePage from '@/pages/RolePage.vue'
import { UserService } from '@/plugins/user';

// 解決導航欄中的vue-router在3.0版本以上重複點選單報錯問題
const includPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return (includPush.call(this, location) as any).catch((err) => err);
};

Vue.use(VueRouter);
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(null);
const routes = [
  { path: '/login', name: 'Login', component: LoginPage },
  {
    path: '/',
    name: 'Main',
    redirect: '/index',
    component: MainPage,
    children: [
      {
        path: '/index', name: 'Index', component: Index,
      },
      /* ----------------------------------- [RP] 人員管理 ------------------------------------- */
      {
        path: 'personnel',
        component: RouterPage,
        redirect: '/index',
        children: [
          /* ----------------------------------- 人員權限 ------------------------------------- */
          // 人員權限 index
          {
            path: 'accountPermissions',
            name: 'PersonnelAccPermissions',
            component: () => import('@/pages/personnel/account_permissions/AccountPermissions_index.vue'),
            meta: {
              breadcrumb: ['index', '人員管理', '團險行政人員帳號權限'],
            },
          },
          // 人員權限 add
          {
            path: 'accountPermissions/add',
            name: 'PersonnelAccPermissionsAdd',
            component: () => import('@/pages/personnel/account_permissions/AccountPermissions_add.vue'),
            meta: {
              breadcrumb: ['index', '人員管理', '團險行政人員帳號權限', '新增行政人員帳號權限'],
            },
          },
          // 人員權限 edit
          {
            path: 'accountPermissions/edit',
            name: 'PersonnelAccPermissionsEdit',
            component: () => import('@/pages/personnel/account_permissions/AccountPermissions_edit.vue'),
            meta: {
              breadcrumb: ['index', '人員管理', '團險行政人員帳號權限', '項目修改'],
            },
          },

          /* ----------------------------------- 群組權限 ------------------------------------- */
          // 群組權限 index
          {
            path: 'groupPermissions',
            name: 'PersonnelGroupPermissions',
            component: GroupPermissionsComp,
            meta: {
              breadcrumb: ['index', '人員管理', '群組權限設定'],
            },
          },
          // 群組權限 Add & Edit
          {
            path: 'groupPermissions/addAndEdit',
            name: 'PersonnelGroupPermissionsAddAndEdit',
            component: GroupPermissionsAddAndEditComp,
            meta: {
              breadcrumb: ['index', '人員管理', '群組權限設定', '新增/修改'],
            },
          },
        ],
      },
      /* ----------------------------------- [RP] GIS / 查詢作業 ------------------------------------- */
      {
        path: 'gis/search',
        component: RouterPage,
        redirect: { name: 'Main' },
        children: [
          /* ----------------------------------- 保單狀態查詢 ------------------------------------- */
          // 保單狀態查詢 index
          {
            path: 'policyState',
            name: 'SearchPolicyState',
            component: SearchPolicyStateComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '保單狀態查詢'],
            },
          },
          // 保單狀態查詢 result
          {
            path: 'policyState/result',
            name: 'SearchPolicyStateResult',
            component: SearchPolicyStateResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '保單狀態查詢', '查詢結果'],
            },
          },

          /* ----------------------------------- 異動資料查詢 ------------------------------------- */
          // 異動資料查詢 index
          {
            path: 'changeData',
            name: 'SearchChangeData',
            component: SearchChangeDataComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '異動資料查詢'],
            },
          },
          // 異動資料查詢 result
          {
            path: 'changeData/result',
            name: 'SearchChangeDataResult',
            component: SearchChangeDataResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '異動資料查詢', '查詢結果'],
            },
          },
          // 異動資料查詢 details
          {
            path: 'changeData/details',
            name: 'SearchChangeDataDetails',
            component: SearchChangeDataDetailsComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '異動資料查詢', '查詢結果', '詳細投保內容'],
            },
          },

          /* ----------------------------------- 人員派件統計 ------------------------------------- */
          // 人員派件統計 index
          {
            path: 'dispatch',
            name: 'SearchDispatch',
            component: SearchDispatchComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '人員派件統計'],
            },
          },
          // 人員派件統計 result
          {
            path: 'dispatch/result',
            name: 'SearchDispatchResult',
            component: SearchDispatchResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '人員派件統計', '查詢結果'],
            },
          },

          /* ----------------------------------- 團險收據列印 ------------------------------------- */
          // 團險收據列印 index
          {
            path: 'print',
            name: 'SearchPrint',
            component: SearchPrintComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '團險收據列印'],
            },
          },
          // 團險收據列印 result
          {
            path: 'print/result',
            name: 'SearchPrintResult',
            component: SearchPrintResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '查詢作業', '團險收據列印', '查詢結果'],
            },
          },
        ],
      },
      /* ----------------------------------- [RP] GIS / 維護作業 ------------------------------------- */
      {
        path: 'gis/maintenanceGio',
        component: RouterPage,
        redirect: '/index',
        children: [
          /* ----------------------------------- 文件維護 ------------------------------------- */
          // 文件維護 index
          {
            path: 'doc',
            name: 'MaintenanceDoc',
            component: MaintenanceDocComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '文件維護'],
            },
          },
          // 文件維護 新增/修改
          {
            path: 'doc/addAndEdit',
            name: 'MaintenanceDocAddAndEdit',
            component: MaintenanceDocAddAndEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '文件維護', '新增/修改'],
            },
          },
          // 文件維護 主管核可頁
          {
            path: 'doc/approving',
            name: 'MaintenanceDocApproving',
            component: MaintenanceDocApprovingComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '文件維護', '主管核可'],
            },
          },

          /* ----------------------------------- 公告維護 ------------------------------------- */
          // 公告維護 index
          {
            path: 'pa',
            name: 'MaintenancePa',
            component: MaintenancePaComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '公告維護'],
            },
          },
          // 公告維護 新增/修改
          {
            path: 'pa/addAndEdit',
            name: 'MaintenancePaAddAndEdit',
            component: MaintenancePaAddAndEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '公告維護', '新增/修改'],
            },
          },

          /* ----------------------------------- 險種資料維護 ------------------------------------- */
          // 險種資料維護 index
          {
            path: 'insuranceTypeData',
            name: 'MaintenanceInsuranceTypeData',
            component: MaintenanceInsuranceTypeDataComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '險種資料維護'],
            },
          },
          // 險種資料維護 項目修改
          {
            path: 'insuranceTypeData/edit',
            name: 'MaintenanceInsuranceTypeDataEdit',
            component: MaintenanceInsuranceTypeDataEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '險種資料維護', '險種資料修改'],
            },
          },
          // 險種資料維護 核保規則/CB計劃別維護 列表
          {
            path: 'insuranceTypeData/underwriteRuleAndPlan/:underwriteType?',
            name: 'MaintenanceInsuranceTypeDataPlan',
            component: MaintenanceInsuranceTypeDataPlanComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '險種資料維護', '核保規則/CB計劃別維護'],
            },
          },
          // 險種資料維護 核保規則 項目編輯
          {
            path: 'insuranceTypeData/underwriteRuleEdit',
            name: 'MaintenanceInsuranceTypeDataRuleEdit',
            component: MaintenanceInsuranceTypeDataRuleEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '險種資料維護', '核保規則/CB計劃別維護', '核保規則修改'],
            },
          },
          // 險種資料維護 CB計劃別維護 新增/編輯
          {
            path: 'insuranceTypeData/underwritePlan/:type',
            name: 'MaintenanceInsuranceTypeDataPlanAddAndEdit',
            component: MaintenanceInsuranceTypeDataPlanAddAndEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '險種資料維護', '核保規則/CB計劃別維護', 'CB計劃別新增/修改'],
            },
          },

          /* ----------------------------------- 公司基本資料維護 ------------------------------------- */
          // 公司基本資料維護 資料變更 index
          {
            path: 'companyInfo',
            name: 'MaintenanceCompanyInfo',
            component: MaintenanceCompanyInfoComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '公司基本資料維護'],
            },
          },
          // 公司基本資料維護 內容確認 confirm
          {
            path: 'companyInfo/confirm',
            name: 'MaintenanceCompanyInfoConfirm',
            component: MaintenanceCompanyInfoConfirmComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '公司基本資料維護', '內容確認'],
            },
          },

          /* ----------------------------------- 營業類別維護 ------------------------------------- */
          // 營業類別維護 列表頁 index
          {
            path: 'business',
            name: 'MaintenanceBusiness',
            component: MaintenanceBusinessComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '營業類別維護'],
            },
          },
          // 營業類別維護 新增&修改
          {
            path: 'business/addAndEdit/:type',
            name: 'MaintenanceBusinessAddAndEdit',
            component: MaintenanceBusinessAddAndEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '維護作業', '營業類別維護', '新增/修改'],
            },
          },
        ],
      },
      /* ----------------------------------- [RP] GIS / 要保單位維護 ------------------------------------- */
      {
        path: 'gis/applMaintenance',
        component: RouterPage,
        redirect: '/index',
        children: [
          /* ----------------------------------- 要保單位資料維護 ------------------------------------- */
          // 要保單位資料維護 index
          {
            path: 'applData',
            name: 'ApplMaintenanceApplData',
            component: ApplMaintenanceApplDataComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '要保單位資料維護'],
            },
          },
          // 要保單位資料維護 result
          {
            path: 'applData/result',
            name: 'ApplMaintenanceApplDataResult',
            component: ApplMaintenanceApplDataResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '要保單位資料維護', '查詢結果'],
            },
          },
          // 要保單位資料維護 Confirm
          {
            path: 'applData/confirm',
            name: 'ApplMaintenanceApplDataConfirm',
            component: ApplMaintenanceApplDataConfirmComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '要保單位資料維護', '查詢結果', '內容確認'],
            },
          },

          /* ----------------------------------- 承辦人帳號維護 ------------------------------------- */
          // 承辦人帳號維護 index
          {
            path: 'undertakerData',
            name: 'ApplMaintenanceUndertakerData',
            component: ApplMaintenanceUndertakerDataComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '承辦人帳號維護'],
            },
          },
          // 承辦人帳號維護 result
          {
            path: 'undertakerData/result',
            name: 'ApplMaintenanceUndertakerDataResult',
            component: ApplMaintenanceUndertakerDataResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '承辦人帳號維護', '查詢結果'],
            },
          },
          // 承辦人帳號維護 addAndEdit
          {
            path: 'undertakerData/addAndEdit',
            name: 'ApplMaintenanceUndertakerDataAddAndEdit',
            component: ApplMaintenanceUndertakerDataAddAndEditComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '承辦人帳號維護', '查詢結果', '新增/修改'],
            },
          },
          // 承辦人帳號維護 內容確認/審核/覆核/待主管覆核
          {
            path: 'undertakerData/:type',
            name: 'ApplMaintenanceUndertakerDataConfirm',
            component: ApplMaintenanceUndertakerDataConfirmComp,
            meta: {
              breadcrumb: {
                confirm: ['index', 'GIS', '要保單位維護', '承辦人帳號維護', '查詢結果', '新增/修改', '內容確認'],
                review: ['index', 'GIS', '要保單位維護', '承辦人帳號維護', '查詢結果', '審/覆核頁'],
              },
            },
          },

          /* ----------------------------------- 險種核保規則/計劃別維護 ------------------------------------- */
          // 險種核保規則/計劃別維護 index
          {
            path: 'insuranceType',
            name: 'ApplMaintenanceInsuranceType',
            component: ApplMaintenanceInsuranceTypeComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '險種核保規則/計劃別維護'],
            },
          },
          // 險種核保規則/計劃別維護 result
          {
            path: 'insuranceType/result',
            name: 'ApplMaintenanceInsuranceTypeResult',
            component: ApplMaintenanceInsuranceTypeResultComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '險種核保規則/計劃別維護', '查詢結果'],
            },
          },
          // 險種核保規則/計劃別維護 保險計劃維護
          {
            path: 'insuranceType/insurancePlan',
            name: 'ApplMaintenanceInsuranceTypeResultInsurancePlan',
            component: ApplMaintenanceInsuranceTypeResultInsurancePlanComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '險種核保規則/計劃別維護', '查詢結果', '保險計劃維護'],
            },
          },
          // 險種核保規則/計劃別維護 計劃別維護
          {
            path: 'insuranceType/resultPlan',
            name: 'ApplMaintenanceInsuranceTypeResultPlan',
            component: ApplMaintenanceInsuranceTypeResultPlanComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '險種核保規則/計劃別維護', '查詢結果', '計劃別維護'],
            },
          },
          // 險種核保規則/計劃別維護 核保規則維護
          {
            path: 'insuranceType/resultRule',
            name: 'ApplMaintenanceInsuranceTypeResultRule',
            component: ApplMaintenanceInsuranceTypeResultRuleComp,
            meta: {
              breadcrumb: ['index', 'GIS', '要保單位維護', '險種核保規則/計劃別維護', '查詢結果', '核保規則維護'],
            },
          },
        ],
      },
      /* ----------------------------------- [RP] GIS / 行銷人員專區 ------------------------------------- */
      {
        path: 'gis/marketingGio',
        component: RouterPage,
        redirect: '/index',
        children: [
          /* ----------------------------------- 團險保費查詢 ------------------------------------- */
          // 團險保費查詢 index
          {
            path: 'premiumGio',
            name: 'MarketingGioPremiumGio',
            component: MarketingGioPremiumGioComp,
            meta: {
              breadcrumb: ['index', 'GIS', '行銷人員專區', '團險保費查詢'],
            },
          },

          /* ----------------------------------- 行銷區域維護 ------------------------------------- */
          // 行銷區域維護 index
          {
            path: 'marketing',
            name: 'MarketingGioMarketing',
            component: MarketingGioMarketingComp,
            meta: {
              breadcrumb: ['index', 'GIS', '行銷人員專區', '行銷區域維護'],
            },
          },
          // 行銷區域維護 項目修改
          {
            path: 'marketing/edit',
            name: 'MarketingGioMarketingEdit',
            component: MarketingGioMarketingEditComp,
            meta: {
              type: 'edit',
              breadcrumb: ['index', 'GIS', '行銷人員專區', '行銷區域維護', '項目修改'],
            },
          },
          // 行銷區域維護 主管核可 (與項目修改共用 component 靠 meta.type 切換畫面)
          {
            path: 'marketing/approve',
            name: 'MarketingGioMarketingApprove',
            component: MarketingGioMarketingEditComp,
            meta: {
              type: 'approving',
              breadcrumb: ['index', 'GIS', '行銷人員專區', '行銷區域維護', '主管核可'],
            },
          },
        ],
      },
      {
        path: '*',
        redirect: '/index',
      },
    ],
  },
];

// 不做登入判斷的排除名單
const excludeRouterName = ['Login'];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // 切換頁面，滾動至頂端
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  Vue.prototype.beforeEnter$.next({
    to,
    from,
  });
  // TEST:
  // next();
  // 權限判斷
  if (!excludeRouterName.includes(to.name)) {
    const userService: UserService = Vue.prototype.$user;
    if (!userService.hasValidToken()) {
      message.warn('尚未登入');
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    // eslint-disable-next-line no-tabs
    next();
  }
});

export default router;
