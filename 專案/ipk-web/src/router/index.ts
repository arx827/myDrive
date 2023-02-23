import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { message } from 'ant-design-vue';
import { BehaviorSubject } from 'rxjs';
import MainPage from '@/pages/Main/MainPage.vue';
import Login from '@/pages/LoginPage/Login.vue';
import { UserService, checkIntraAp } from '@/plugins/user';
import OuterTab from '@/components/shared/tab/OuterTab.vue';

Vue.use(VueRouter);
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(null);
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Main',
    component: MainPage,
    children: [
      /* ----------------------------------- 元件範例 ------------------------------------- */
      {
        path: 'componentExample',
        component: OuterTab,
        children: [
          {
            path: 'alert-message',
            name: 'alert-message',
            component: () => import('@/components/demoData/AlertMessage.vue'),
          },
          {
            path: 'upload',
            name: 'upload',
            component: () => import('@/components/demoData/UploadPage.vue'),
          },
          {
            path: 'form-demo',
            name: 'form-demo',
            component: () => import('@/components/demoData/FormDemo.vue'),
          },
          {
            path: 'loading',
            name: 'loading',
            component: () => import('@/components/demoData/Loading.vue'),
          },
          {
            path: 'vxe-table-demo',
            name: 'vxe-table-demo',
            component: () => import('@/components/demoData/VxeTableDemo.vue'),
          },
        ],
      },
      /* ----------------------------------- 帳務基本設定 ------------------------------------- */
      // {
      //   path: 'basicAccountSetting',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'keep-book',
      //       name: 'keep-book',
      //       component: () => import('@/pages/act/KeepBook/KeepBook.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'bank-code',
      //       name: 'bank-code',
      //       component: () => import('@/pages/act/BankCode/BankCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'reconciliation-code',
      //       name: 'reconciliation-code',
      //       component: () => import('@/pages/act/ReconciliationCode/ReconciliationCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'segment-expense-code',
      //       name: 'segment-expense-code',
      //       component: () => import('@/pages/act/SegmentExpenseCode/SegmentExpenseCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'nii-code',
      //       name: 'nii-code',
      //       component: () => import('@/pages/act/NIICode/NIICode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'ics-code',
      //       name: 'ics-code',
      //       component: () => import('@/pages/act/ICSCode/ICSCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'account-code',
      //       name: 'account-code',
      //       component: () => import('@/pages/act/AccountCode/AccountCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'financial-asset',
      //       name: 'financial-asset',
      //       component: () => import('@/pages/act/FinancialAsset/FinancialAsset.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'portfolio-code',
      //       name: 'portfolio-code',
      //       component: () => import('@/pages/act/PortfolioCode/PortfolioCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'outsourcing-code',
      //       name: 'outsourcing-code',
      //       component: () => import('@/pages/act/OutsourcingCode/OutsourcingCode.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },
      /* ----------------------------------- 帳務處理 ------------------------------------- */
      // {
      //   path: 'AccountProcessing',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'portfolio-mapping',
      //       name: 'portfolio-mapping',
      //       component: () => import('@/pages/act/PortfolioMapping/PortfolioMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'project-code-mapping',
      //       name: 'project-code-mapping',
      //       component: () => import('@/pages/act/ProjectCodeMapping/ProjectCodeMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'ic-mapping',
      //       name: 'ic-mapping',
      //       component: () => import('@/pages/act/IcMapping/IcMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'cost-unit-mapping',
      //       name: 'cost-unit-mapping',
      //       component: () => import('@/pages/act/CostUnitMapping/CostUnitMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'ee-mapping',
      //       name: 'ee-mapping',
      //       component: () => import('@/pages/act/EeMapping/EeMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'account-code-rule',
      //       name: 'account-code-rule',
      //       component: () => import('@/pages/act/AccountCodeRule/AccountCodeRule.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'bank-code-mapping',
      //       name: 'bank-code-mapping',
      //       component: () => import('@/pages/act/BankCodeMapping/BankCodeMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },
      /* ----------------------------------- 報表產出 ------------------------------------- */
      // {
      //   path: 'ReportOutput',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'nii-ics-report-mapping',
      //       name: 'nii-ics-report-mapping',
      //       component: () => import('@/pages/act/NiiIcsReportMapping/NiiIcsReportMapping.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //     {
      //       path: 'nii-ar',
      //       name: 'nii-ar',
      //       component: () => import('@/pages/act/NiiAr/NiiAr.vue'),
      //       meta: {
      //         keepAlive: true,
      //       },
      //     },
      //   ],
      // },
      /* ----------------------------------- 一般帳務處理 ------------------------------------- */
      // {
      //   path: 'GeneralAccountSettings',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'mon-close-time-table',
      //       name: 'mon-close-time-table',
      //       component: () => import('@/pages/act/MonCloseTimetable/MonCloseTimetable.vue'),
      //     },
      //     {
      //       path: 'act-manual-batch',
      //       name: 'act-manual-batch',
      //       component: () => import('@/pages/act/ActManualBatch/ActManualBatch.vue'),
      //     },
      //   ],
      // },
      /* ----------------------------------- 投資帳務資料介面 ------------------------------------- */
      {
        path: 'GeneralLedger',
        component: OuterTab,
        children: [
          {
            path: 'general-ledger',
            name: 'general-ledger',
            component: () => import('@/pages/act/GeneralLedger/InvestAccount.vue'),
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
      /* ----------------------------------- 資產區隔管理功能 ------------------------------------- */
      // {
      //   path: 'IpIgRange',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'ip-ig-range',
      //       name: 'ip-ig-range',
      //       component: () => import('@/pages/ip/IpIgRange/IpIgRange.vue'),
      //     },
      //     {
      //       path: 'ip-rp-setting',
      //       name: 'ip-rp-setting',
      //       component: () => import('@/pages/ip/IpRPSetting/IpRPSetting.vue'),
      //     },
      //     {
      //       path: 'ip-adjustment',
      //       name: 'ip-adjustment',
      //       component: () => import('@/pages/ip/IpAdjustment/IpAdjustment.vue'),
      //     },
      //   ],
      // },
      /* ----------------------------------- 一般帳務處理 ------------------------------------- */
      // {
      //   path: 'Act',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'act-report-upload',
      //       name: 'act-report-upload',
      //       component: () => import('@/pages/act/ActReportUpload/ActReportUpload.vue'),
      //     },
      //   ],
      // },
      /* ----------------------------------- 報表公用查詢功能 ------------------------------------- */
      // {
      //   path: 'ReportSearch',
      //   component: OuterTab,
      //   children: [
      //     {
      //       path: 'report-setup',
      //       name: 'report-setup',
      //       component: () => import('@/pages/ip/ReportSetup/ReportSetup.vue'),
      //     },
      //   ],
      // },
      /* ----------------------------------- ALM & Solvency ------------------------------------- */
      {
        path: 'AlmSolvency',
        component: OuterTab,
        children: [
          {
            path: 'alm-general-ledger',
            name: 'alm-general-ledger',
            component: () => import('@/pages/alm/AlmGeneralLedger/AlmGeneralLedger.vue'),
            meta: {
              keepAlive: true,
            },
          },
          // {
          //   path: 'alm-assets',
          //   name: 'alm-assets',
          //   component: () => import('@/pages/act/AlmAssets/AlmAssets.vue'),
          //   meta: {
          //     keepAlive: true,
          //   },
          // },
          // {
          //   path: 'alm-parameter-table',
          //   name: 'alm-parameter-table',
          //   component: () => import('@/pages/act/AlmParameterTable/AlmParameterTable.vue'),
          //   meta: {
          //     keepAlive: true,
          //   },
          // },
        ],
      },
      /* ----------------------------------- 投資系統部 ------------------------------------- */
      {
        path: 'InvestSystem',
        component: OuterTab,
        children: [
          {
            path: 'ipo-report-setting',
            name: 'ipo-report-setting',
            component: () => import('@/pages/is/IpoReportSetting/IpoReportSetting.vue'),
          },
          {
            path: 'available-funds',
            name: 'available-funds',
            component: () => import('@/pages/is/AvailableFunds/AvailableFunds.vue'),
          },
          {
            path: 'investment-limit-report',
            name: 'investment-limit-report',
            component: () => import('@/pages/is/InvestmentLimitReport/InvestmentLimitReport.vue'),
          },
        ],
      },
      /* ----------------------------------- 其他設定 ------------------------------------- */
      {
        path: 'Settings',
        component: OuterTab,
        children: [
          {
            path: 'batch-setting',
            name: 'batch-setting',
            component: () => import('@/pages/act/BatchSetting/BatchSetting.vue'),
          },
          {
            path: 'announcement-setting',
            name: 'announcement-setting',
            component: () => import('@/pages/AnnouncementSetting/AnnouncementSetting.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'notice-setting',
            name: 'notice-setting',
            component: () => import('@/pages/NoticeSetting/NoticeSetting.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'mail-setting',
            name: 'mail-setting',
            component: () => import('@/pages/MailSetting/MailSetting.vue'),
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
      /* ----------------------------------- 資料維護 ------------------------------------- */
      {
        path: 'DataMaintenance',
        component: OuterTab,
        children: [
          {
            path: 'counterparty-ssi',
            name: 'counterparty-ssi',
            component: () => import('@/pages/cf/CounterpartySsi/CounterpartySsi.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'fubon-ssi',
            name: 'fubon-ssi',
            component: () => import('@/pages/cf/FubonSsi/FubonSsi.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'cut-off-config',
            name: 'cut-off-config',
            component: () => import('@/pages/cf/CutOffConfig/CutOffConfig.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'approval-config',
            name: 'approval-config',
            component: () => import('@/pages/cf/ApprovalConfig/ApprovalConfig.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'contact',
            name: 'contact',
            component: () => import('@/pages/cf/Contact/Contact.vue'),
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
      /* ----------------------------------- 交易管理 ------------------------------------- */
      {
        path: 'TransactionManagement',
        component: OuterTab,
        children: [
          {
            path: 'tx-review',
            name: 'tx-review',
            component: () => import('@/pages/cf/TransactionManagement/TxReview/TxReview.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'tx-double-review',
            name: 'tx-double-review',
            component: () => import('@/pages/cf/TransactionManagement/TxDoubleReview/TxDoubleReview.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'file-download',
            name: 'file-download',
            component: () => import('@/pages/cf/TransactionManagement/FileDownload/FileDownload.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'foreign-equity',
            name: 'foreign-equity',
            component: () => import('@product/ForeignEquity/ForeignEquity.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'domestic-bond',
            name: 'domestic-bond',
            component: () => import('@product/DomesticBond/DomesticBond.vue'),
            meta: {
              keepAlive: true,
            },
          },
          {
            path: 'foreign-bond',
            name: 'foreign-bond',
            component: () => import('@product/ForeignBond/ForeignBond.vue'),
            meta: {
              keepAlive: true,
            },
          },
        ],
      },
    ],
    beforeEnter(to, from, next) {
      const userService: UserService = Vue.prototype.$user;
      if (!userService.hasValidToken()) {
        message.warn('尚未登入');
        next({ name: 'Login' });
      } else {
        next();
      }
    },
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: () => import('@/pages/Monitor/MonitorPage.vue'),
    beforeEnter: checkIntraAp,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  Vue.prototype.beforeEnter$.next({
    to,
    from,
  });
  // 判断此跳轉路由的來源是否存在，存在的情况跳轉到來源路由，否则跳回首頁
  if (to.matched.length === 0 || to.name === from.name) {
    return;
  }
  next(); // 如果匹配正確跳轉
});

export default router;
