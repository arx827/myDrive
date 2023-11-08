import Vue from 'vue'
import VueRouter, { Route } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { message, Transfer } from 'ant-design-vue'
import { BehaviorSubject, Subject } from 'rxjs'
import { LoginModule } from '@/plugins/store/LoginModule'
import { WindowModule } from '@/plugins/store/WindowSizeModule'

import AnswerOptionSetting from '@/pages/answerOptionSetting/AnswerOptionSetting.vue';
import CommonUtil from '@/assets/config/CommonUtil'
import LoadingUtil from '@/assets/config/LoadingUtil'
import ErrorModalUtil from '@/assets/config/ErrorModalUtil'

import ssoLogin from '@/pages/ssoLogin.vue'
import permission1 from '@/pages/permission1.vue'
import BackDoorUtil from '@/pages/backDoor/BackDoorUtil'
import axios from 'axios';
import jwt from 'jsonwebtoken';

Vue.use(VueRouter)
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route, from: Route }>(null);
const LOGIN_STATE = 'login_state'; 
const routes = [

  
  //Jasypt畫面
  { path:'/jasyptEncryption', name:'JasyptEncrption', component:()=> import('@/pages/JasyptPage.vue')},
  // 錯誤頁面
  { path: '/backDoorValidation', name: 'BackDoorValidation', component: () => import('@/pages/backDoor/BackDoorValidation.vue') },
  // 手動批次畫面
  {
    path: '/backDoorBatch', name: 'BackDoorBatch', component: () => import('@/pages/backDoor/BackDoorBatch.vue'),
    beforeEnter(to, from, next) {
      if (!BackDoorUtil.checkToken()) {
        next({ name: 'BackDoorValidation', query: { from: 'BackDoorBatch' } });
      } else {
        next();
      }
    }
  },
  // 資料查詢畫面
  {
    path: '/backDoorSearch', name: 'BackDoorSearch', component: () => import('@/pages/backDoor/BackDoorSearch.vue'),
    beforeEnter(to, from, next) {
      if (!BackDoorUtil.checkToken()) {
        next({ name: 'BackDoorValidation', query: { from: 'BackDoorSearch' } });
      } else {
        next();
      }
    }
  },
  // 資料編輯畫面
  {
    path: '/backDoorEdit', name: 'BackDoorEdit', component: () => import('@/pages/backDoor/BackDoorEdit.vue'),
    beforeEnter(to, from, next) {
      if (!BackDoorUtil.checkToken()) {
        next({ name: 'BackDoorValidation', query: { from: 'BackDoorEdit' } });
      } else {
        next();
      }
    }
  },
  // 監控API畫面
  {
    path: '/healthCheck', name: 'HealthCheck', component: () => import('@/pages/backDoor/HealthCheck.vue'),
    beforeEnter(to, from, next) {
      if (!BackDoorUtil.checkToken()) {
        next({ name: 'BackDoorValidation', query: { from: 'HealthCheck' } });
      } else {
        next();
      }
    }
  },

  { path: '/login', name: 'Login', component: LoginPage },

  // 會辦照會回覆跳板
  { path: '/infNotiReplySkipPage', name: 'infNotiReplySkipPage', component: () => import('@/pages/infNotiReply/InfNotiReplySkipPage.vue')},
  // 會辦照會回覆登入
  { path: '/infNotiReplyLogin', name: 'InfNotiReplyLogin', component: () => import('@/pages/infNotiReply/InfNotiReplyLogin.vue')},
  // 會辦照會回覆主頁
  { path: '/infNotiReplyMainPage', name: 'infNotiReplyMainPage', component: () => import('@/pages/infNotiReply/InfNotiReplyMainPage.vue')
    ,children:[
      {path: 'infReplySearch', name: 'InfReplySearch', component: ()=> import('@/pages/infReply/InfReplySearch.vue')}
    ],
    beforeEnter(to, from, next) {
      
      if (!LoginModule.hasValidToken) {
      // message.warn('尚未登入');
        next({ name: 'InfNotiReplyLogin' });
      } else {
        next();
      }
    },
  },

  { path: '/version-check', name: 'versionCheck', component: () => import('@/pages/versionCheck/VersionCheckPage.vue') },
  {
    path: '/', name: 'Main', component: MainPage,
    children: [
      { path: 'user-maintain', name: 'UserMaintain', component: () => import('@/pages/userMaintain/UserMaintainPage.vue') },

      {
        path: 'shift-setting-adjust', name: 'SHIFT_SETTING_ADJUST', //此處的name填寫第二層選單的menuId
        components: {
          //此處填寫第三層選單的menuId
          SHIFT_SETTING_MENU: () => import('@/pages/shiftsWork/ShiftsWorkPage.vue'),
          EVENT_SETTING_MENU: () => import('@/pages/eventSetting/EventSetting.vue')
        }
      },
      {
        path: '/assign-manage', name: 'ASSIGN_MANAGE', //此處的name填寫第二層選單的menuId
        components: {
          //此處填寫第三層選單的menuId
          PROMPT_MONITOR: () => import('@/pages/dispatchManagement/DispatchManagementPage.vue'),
          CASES_ESTIMATED_REPORT: () => import('@/pages/assignManage/CaseEstimateReportPage.vue'),
        }
      },
      // 監控作業 > Pending件管理
      { path: '/pending-case-manage', name: 'PENDING_CASE_MANAGE', component: () => import('@/pages/pendingCaseManagement/PendingCaseManagementPage.vue') },
      {
        path: 'afterCallWorkSetting', name: 'AFTERCALL_WORK_SETTING',
        components: {
          REVIEW_SETTING: () => import('@/pages/reviewSetting/ReviewSetting.vue'),
          INF_SETTING:()=>import('@/pages/informSetting/InformSetting.vue'),
          NOTI_SETTING:()=>import('@/pages/notificationSetting/NotificationSetting.vue'),
          TEMPLATE_SETTING:()=>import('@/pages/sendTemplate/sendTemplate.vue')
        }
      },
      { path: 'event-setting', name: 'EventSetting', component: () => import('@/pages/eventSetting/EventSetting.vue') }, //第三層頁面(tab)，避免無權限的人由url直接存取，所以此處註解掉
      { path: 'shifts-work', name: 'ShiftsWork', component: () => import('@/pages/shiftsWork/ShiftsWorkPage.vue') },  //第三層頁面(tab)，避免無權限的人由url直接存取，所以此處註解掉
      { path: 'role-setting', name: 'RoleSetting', component: () => import('@/pages/roleSetting/RoleSettingPage.vue') },
      { path: 'menu-setting', name: 'MenuSetting', component: () => import('@/pages/menuSetting/MenuSettingPage.vue') },



      //{ path: 'answerOptionSetting', name: 'answerOptionSetting', component: AnswerOptionSetting },
      //{ path: 'questionBankLetterRights', name: 'questionBankLetterRights', component: () => import('@/pages/questionBankLetterRights/QuestionBankLetterRights.vue') },
      //{ path: 'recordingVoiceCloseSetting', name: 'recordingVoiceCloseSetting', component: () => import('@/pages/recordingVoiceCloseSetting/RecordingVoiceCloseSetting.vue') },
      { path: 'agent-setting', name: 'AgentSetting', component: () => import('@/pages/agentSetting/AgentSettingPage.vue') },
      //{ path: 'taskTypeSetting', name: 'taskTypeSetting', component: () => import('@/pages/taskTypeSetting/TaskTypeSetting.vue') },
      //{ path: 'taskSetting', name: 'taskSetting', component: () => import('@/pages/taskSetting/TaskSetting.vue') },
      //{ path: 'personTaskSetting', name: 'personTaskSetting ', component: () => import('@/pages/personTask/PersonTask.vue') },
      { path: 'user-skillsetting', name: 'userSkillSetting ', component: () => import('@/pages/userSkillSetting/UserSkillSetting.vue') },
      {
        path: 'unlock-menu', name: 'UNLOCK_MENU',
        components: {
          USER_UNLOCK_MENU: () => import('@/pages/userUnlock/UserUnlockPage.vue'), 
          INF_UNLOCK_MENU: () => import('@/pages/infUnlock/InfUnlockPage.vue')
        }
      },
      { path: 'cust-mark', name: 'CustMark', component: () => import('@/pages/custMark/CustMarkPage.vue') },
      {
        path: 'callout-task-setting', name: 'CALLOUT_TASK_SETTING',
        components: {
          ANSWER_OPTION_SETTING_MENU: () => import('@/pages/answerOptionSetting/AnswerOptionSetting.vue'),
          QUESTIONBANK_LETTERRIGHTS_MENU: () => import('@/pages/questionBankLetterRights/QuestionBankLetterRights.vue'),
          RECORDING_VOICE_CLOSE_MENU: () => import('@/pages/recordingVoiceCloseSetting/RecordingVoiceCloseSetting.vue'),
          TASK_TYPE_MENU: () => import('@/pages/taskTypeSetting/TaskTypeSetting.vue'),
          TASK_SETTING_MENU: () => import('@/pages/taskSetting/TaskSetting.vue'),
          QUESTIONNAIRE_SETTING_MENU: () => import('@/pages/questionnaireSetting/QuestionnaireSetting.vue'),
          PERSON_TASK_SETTING_MENU: () => import('@/pages/personTask/PersonTask.vue')
        }
      },
      { path: 'pending-page', name: 'PendingPage', component: () => import('@/pages/pending/PendingPage.vue') },      // 第二層選單的name，需與DB內的menuId完全相同
      { path: 'get-record-page', name: 'GetRecordPage', component: () => import('@/pages/getRecord/GetRecordPage.vue') }, // OBD2-1257 錄音調檔-查詢功能
      { path: 'get-record-history-page', name: 'GetRecordHistoryPage', component: () => import('@/pages/getRecord/GetRecordHistoryPage.vue') }, // OBD2-1258 錄音調檔-歷程查詢
      // OBD2-1583 查詢條件>案件查詢 前端頁面
      { path: 'case-page', name: 'CaseSearchPage', component: () => import('@/pages/case/CaseSearchPage.vue') },
      //電訪結果表--暫時放這，方便刻前端
      { path:'case-result-page', name: 'CaseResultSearch', component: () => import('@/pages/caseResult/CaseResultSearchPage.vue') },
      // { path: 'test-third-menu', name: 'TEST_SECOND_LEVEL', 
      //   components: {
      //     //此處第三層選單名稱，需與DB內的menuId完全相同
      //     THIRD_MENU_ONE:  () => import('@/pages/custMark/CustMarkPage.vue'),
      //     THIRD_MENU_TWO:  () => import('@/pages/shiftSettingAndAdjust/ShiftSettingAndAdjust.vue')
      //   }
      // }
      
      //OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面，把執機畫面設定給 main 的 child
      { path: 'on-duty', name: 'OnDuty', component: () => import('@/pages/onDuty/OnDutyPage.vue') },
      // OBD2-1574 會辦核保/保全/客利/保費/風管/營品/其他前端畫面
      { path: 'countersignature-nb', name: 'infNb', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-ps', name: 'infPs', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-pl-cb', name: 'infPlCb', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-rn', name: 'infRn', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-rm', name: 'infRm', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-qb', name: 'infQb', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-other', name: 'infOther', component: () => import('@/pages/countersignature/CountersignaturePage.vue') },
      { path: 'countersignature-reply', name: 'infReply', component: () => import('@/pages/countersignatureClose/CountersignatureClosePage.vue') },
      { path: 'common-code', name: 'CommonCode', component: () => import('@/pages/commonCode/CommonCode.vue') },
      { path: 'pending-case-management', name: 'PendingCaseManagement', component: () => import('@/pages/pendingCaseManagement/PendingCaseManagementPage.vue') },

      // 驗證作業-委外函證驗證作業
      { path: 'letter-validate-page', name: 'letterValidatePage', component: () => import('@/pages/letterValidatePage/LetterValidatePage.vue') },
      // 驗證作業-郵寄通知函報表
      { path: 'mail-notice-page', name: 'mailNoticePage', component: () => import('@/pages/mailNoticePage/MailNoticePage.vue') },
      // 驗證作業-掛號退回掃碼作業
      { path: 'mail-return-to-send-page', name: 'mailReturnToSendPage', component: () => import('@/pages/mailReturnToSend/MailReturnToSendPage.vue') },


      //電訪記錄檔設定
      { path: 'teleRecord_setting', name: 'teleRecord_setting_page', component: () => import('@/pages/teleRecord/TeleRecord.vue') },

      // 電訪結果設定
      {
        path: 'callout-result-setting', name: 'CALLOUT_RESULT_SETTING',
        components: {
          CONTACT_RESULT_SETTING:  () => import('@/pages/teleResult/contactResult/ContactResult.vue'),
          TELE_RESULT_SETTING: () => import('@/pages/teleResult/teleResult/TeleResult.vue'),
          CLOSED_REASON_SETTING: () => import('@/pages/teleResult/caseClosedReason/CaseClosedReason.vue'),
          TELE_RESULT_CONFIG: () => import('@/pages/teleResult/teleResultConfig/TeleResultConfig.vue'),
        }
      },
      // 照會中
      { path: 'notification-progress', name: 'notiProgress', component: () => import('@/pages/notificationSearch/NotificationSearch.vue') },
      // 照會回覆
      { path: 'notification-reply', name: 'notiReply', component: () => import('@/pages/notificationSearch/NotificationSearch.vue') },
      // 覆核-照會
      { path: 'review-noti', name: 'REVIEW_NOTI', component:() => import('@/pages/reviewCase/ReviewCasePage.vue')},
      // 覆核-會辦
      { path: 'review-inf', name: 'REVIEW_INF', component:() => import('@/pages/reviewCase/ReviewCasePage.vue')},
      // 覆核-電話變更
      { path: 'review-pc', name: 'REVIEW_PC', component:() => import('@/pages/reviewCase/ReviewCasePage.vue')},
      // 覆核-憂質
      { path: 'review-suspective', name: 'REVIEW_SUSPECTIVE', component:() => import('@/pages/reviewCase/ReviewCasePage.vue')},
      // 覆核-聽語障
      { path: 'review-impairment', name: 'REVIEW_IMPAIRMENT', component:() => import('@/pages/reviewCase/ReviewCasePage.vue')},
      //IMPAIRMENT
      // 待覆核
      { path: 'review-page', name: 'REVIEW_MENU', component:() => import('@/pages/reviewCase/ReviewCasePage.vue')},
      // MIS統計
      {
        path: 'dept-report', name: 'DEPT_REPORT',
        components: {
          TEL_REPORT:  () => import('@/pages/telReport/TelReportPage.vue'),
          TEL_TIME_REPORT:  () => import('@/pages/telTimeReport/TelTimeReportPage.vue'),
          TEL_CHANGE_REPORT: () => import('@/pages/telChangeReport/TelChangeReport.vue'),
          DAILY_REPORT: () => import('@/pages/dailyReport/DailyReportPage.vue'),
        }
      },
    ],
    beforeEnter(to, from, next) {
      if (!LoginModule.hasValidToken) {
        // 沒有有效的token的話打API看看有沒有在cookie
        // 讀取來自SSO的資訊
        axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/ssoLogin`).then(resp => {
          let isValid = false;
          if (resp.data && resp.data.accessToken) {
            let dtwFblCookies = resp.data.accessToken;
            if (dtwFblCookies) {
              const decoded = jwt.decode(dtwFblCookies);
              const now = Date.now();
              if (decoded) {
                isValid = !(Math.floor(now / 1000) > decoded.exp);
              }
            }
          }
          if (!isValid) {
            if (resp.data && resp.data.me) {
              localStorage.setItem("fail_from_sso", resp.data.me.id);
            }
            next({ name: 'Login' });
          } else {
            let loginState = resp.data;
            if (loginState) {
              let currentLoginState = LoginModule.loginState;
              if (!currentLoginState) {
                currentLoginState = {
                  accessToken: '',
                  me: null
                }
              }
              if (loginState.me) {
                currentLoginState.me = loginState.me;
              }
              if (loginState.accessToken) {
                currentLoginState.accessToken = loginState.accessToken;
              }
              localStorage.setItem(LOGIN_STATE, JSON.stringify(currentLoginState));
            }
            next();
          }
        });
      } else {
        next();
      }
    },
  },

  // 跳板
  {
    path: '/ssoLogin', name: 'ssoLogin', component: ssoLogin,
    beforeEnter(to, from, next) {
      // 先清除localStorage
      localStorage.clear();
      next();
    },
  },
  {
    path: '/permission1', name: 'permission1', component: permission1,
    children: [
      { path: 'on-duty', name: 'OnDuty', component: () => import('@/pages/onDuty/OnDutyPage.vue') },
    ],
    beforeEnter(to, from, next) {
      // 先清除localStorage, 若要記錄使用者，此段拿掉
      localStorage.clear();
      // 登入卡控
      const canNext = true;
      if (!canNext) {
        next({ name: 'ssoLogin' });
      } else {
        next();
      }
    },
  },
  
];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  Vue.prototype.beforeEnter$.next({
    to,
    from
  });
  // 從網址到非登入頁面即被登出
  if (from.name == null && to.name != 'Login') {
    if (localStorage.getItem(LOGIN_STATE)) {
      LoginModule.signOut();
    }
    // next("/login");
  }
  next();
});
//開啟最佳螢幕提醒
router.afterEach((to, from) => {
  //當到值機畫面與離開值機畫面的時候都須重設提醒，當從首頁(Main)到任何一頁都須提醒
  //去login的時候不用改變狀態
  if (to != from && (to.name == 'OnDuty' || from.name == 'OnDuty' || from.name == 'Main') && to.name != 'Login') {
    WindowModule.setRouterStatus();
  }
})

export default router;