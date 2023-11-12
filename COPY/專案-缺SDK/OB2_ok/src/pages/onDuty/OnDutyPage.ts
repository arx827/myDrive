import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { default as LoadingUtil } from "@/assets/config/LoadingUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import VlidationUtil, { default as validationUtil } from "@/assets/config/ValidationUtil";
import BlockHeader from '@/components/shared/block-header/BlockHeader.vue';
import CuntersignatureModal from "@/components/shared/countersignatureModal/CountersignatureModal.vue";
import CustomerAnswer from "@/components/shared/customerAnswer/CustomerAnswer.vue";
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPageEvent } from '@/components/shared/data-grid/models';
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import CallUpForm from "@/components/shared/form/callUpForm/CallUpForm.vue";
import DeptMark from "@/components/shared/form/deptMark/DeptMark.vue";
import DescriptionsForm from "@/components/shared/form/descriptionsForm/DescriptionsForm.vue";
import F2BFileForm from "@/components/shared/form/f2BFileForm/F2BFileForm.vue";
import FileUploadForm from "@/components/shared/form/fileUpload/fileUploadForm/FileUploadForm.vue";
import CallupHistory from "@/components/shared/form/history/callupHistory/CallupHistory.vue";
import PolicyData from "@/components/shared/form/history/policyData/PolicyData.vue";
import ServeContactHistroy from "@/components/shared/form/history/serveContactHistroy/ServeContactHistroy.vue";
import InterViewerRemarkForm from '@/components/shared/form/interViewerRemark/InterViewerRemark.vue';
import NotiInfNotCloseRemind from "@/components/shared/form/nofiInfNotCloseRemind/NotiInfNotCloseRemind.vue";
import NoticeForm from "@/components/shared/form/notice/noticeForm/NoticeForm.vue";
import TeleResult from "@/components/shared/form/onDutyComponents/teleResult/TeleResult.vue";
import RiskControl from '@/components/shared/form/riskControl/RiskControl.vue';
import ImpairmentForm from "@/components/shared/form/impairment/ImpairmentForm.vue";
import TransitionForm from "@/components/shared/form/transition/TransitionForm.vue";
import NotificationAgentSearchModal from "@/components/shared/notificationMadal/NotificationAgentSearchModal.vue";
import CaseSearchPage from "@/pages/case/CaseSearchPage.vue";
import QuestArea from "@/pages/questArea/QuestArea.vue";
import QuestCheckIdArea from "@/pages/questCheckIdArea/QuestCheckIdArea.vue";
import QuestOpenArea from "@/pages/questOpenArea/QuestOpenArea.vue";
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import { ComponentDto, AppealInfo, AppealInput, CaseCallUpHistoryInput, CasePackDto, CasePackTelephoneListDto, CustMarkInput, CustMarkOutput, F2bFileGrid, F2bFmsInsuranceUrl, F2BFmsResponse, InCallingInput, InCallingOutput, NotificationOtherAgentDto, PolicyBeforeDto, QuestAreaDto, QuestDataDto, QuestDetailDataDto, RiskControlDetailsDto, ServeContactDataList, ServeContactInput, TelDataDto, CasePolicyAndLogIdDto, ImpairmentInfoDto } from '@fubonlife/obd-api-axios-sdk';
import "@less/callUp.less";
import "@less/page-onDuty.less";
import NotificationModal from "@shared/notificationMadal/NotificationModal.vue";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Vue, Watch } from "vue-property-decorator";
import { QuestAllData, NotiStep } from "./model";
import { AuthComonent } from "@/assets/config/CommonUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";

// TOP_MENU Array 子物件  
export interface TopMenuItem {
  key?: string, class: string; label: string; isAvailable: boolean
}
// TOP_MENU Array 物件 
export interface TopMenu extends Array<TopMenuItem>{}
@Component({
  components: {
    DragModal,
    FblDataGrid,
    BlockHeader,
    CallUpForm,
    NoticeForm,
    InterViewerRemarkForm,
    FileUploadForm,
    QuestArea,
    QuestOpenArea,
    QuestCheckIdArea,
    RiskControl,
    TeleResult,
    CaseSearchPage,
    CuntersignatureModal,
    NotificationModal,
    ImpairmentForm,
    TransitionForm,
    CustomerAnswer,
    DescriptionsForm,
    CallupHistory,
    ServeContactHistroy,
    PolicyData,
    NotiInfNotCloseRemind,
    DeptMark,
    F2BFileForm,
    NotificationAgentSearchModal,
  }
})
export default class OnDutyPage extends Vue {
  
  // 保單基本資料備份
  thePolicyBasicBackupData: PolicyBeforeDto = null;

  // 保單基本資料備份
  tobdCasePolicyHearingData: ImpairmentInfoDto = null;


  // 保單基本資料是否有變更
  isPolicyBasicDateChanged: boolean = false;

  // 業務別
  theBusinessTypeCode: string = "";

  // 風控明細
  isRiskControlDetails: boolean = false;
  riskControlDetailsShowData: TelDataDto = null;
  theRiskControlDetailsData: RiskControlDetailsDto = null;

  isCallUpFormVisible: boolean = false;
  isNoticeFormVisible: boolean = false; //是否顯示發通知視窗
  isFileUploadFormVisible: boolean = false; //是否顯示檔案上傳視窗
  isNotificationFormVisible: boolean = false; //是否顯示照會視窗
  isCountersignatureFormVisible: boolean = false; //是否顯示會辦視窗
  isCaseSearchModalVisible: boolean = false; //是否顯示案件查詢彈窗
  isImpairmentFormVisible: boolean = false; //是否顯示聽語障視窗
  isTransitionFormVisible: boolean = false; //是否顯示歸戶視窗
  isDeptMarkVisible: boolean = false; //是否顯示部門註記全部資訊
  isServeHistoryFormVisible: boolean = false; //是否顯示服務歷程全部資訊
  isPhoneCallHistoryFormVisible: boolean = false; //是否顯示撥號歷程全部資訊
  isPolicyDataFormVisiable: boolean = false; //是否顯示保單基本資料全部資訊
  policyDataCountNum: number = 0; // 保單基本資料總筆數
  deptMarkDataCountNum: number = 0; // 部門註記資料總筆數
  isPolicyDataVisiableIfHaveData: boolean = false; // 是否顯示保單基本資料全部資訊，如果確定有資料才顯示
  isGetPolicyContractStatusData: boolean = false; // 是否已執行完畢_取得保單基本資料_契約狀態
  callUpHistoryCountNum: number = 0; // 撥號歷程資料總筆數

  impairmentgridInfo: any;

  // 顯示電訪結果區資訊 flag
  isShowTeleResult: boolean = false;

  //照會/會辦未結案提醒
  isNotiInfNotCloseRemindFormVisible: boolean = false; //是否顯示未結案提醒表單
  notiInfNotCloseList = [];
  notiInfNotCloseCasePolicyNumber: string = "";

  //服務歷程-外部系統
  serveDataList: ServeContactDataList[] = [];
  //服務歷程-外部系統輸入值
  serveInput: ServeContactInput;

  //=====問卷區塊參數=====
  /** 問卷各區塊答案資料 */
  questAllData: QuestAllData = this.resetQuestData();

  //問卷各區塊資料
  openAreaData = {};
  checkIdAreaData = {};
  endData = {};
  questAreaData: QuestAreaDto = {};

  //問卷儲存傳送資料
  questDataDto: QuestDataDto = {};
  questDetailDataDto: QuestDetailDataDto = {};
  questDetailDataDtolist: Array<QuestDetailDataDto> = [];

  /** 問卷區塊標題 */
  questTitle = "電訪問卷";
  // 服務歷程TAB KEY值，初始給A
  serveTabKey: string = "A";
  // 服務歷程資料筆數
  serveContactLenght: number = 0;
  // 申述提示訊息
  appealRemindText: string = this.$t('policyMark_appealRemindText').toString();
  // 申訴提示訊息style
  appealRemindStyle: string = "font-size: 18px;color: red;"  /** 問卷區塊提示訊息 */
  questTipMsg: string = "<font style='color:#FC0518'>！</font>：點選的答案包含「否」或「不確定」";

  // 是否顯示歸戶提示訊息"!"
  showTransitionMark:boolean = false;

  // 是否顯示聽語障"!"
  showImpairmentMark:boolean = false;
  impairmentDtoInfo: any;

  // 名單序號資訊
  get packNo() {
    return VlidationUtil.isEmpty(PackMatchModule.matchedCasePack) ? "" : PackMatchModule.matchedCasePack.packNo;
  }

  // 畫面元件 
  authComponent: AuthComonent ={
    // top_menu 撥號
    ON_DUTY_TOP_MENU_DIALER : {
        show: false,
        enable: false
    },
    // top_menu 照會
    ON_DUTY_TOP_MENU_NOTIFO : {
        show: false,
        enable: false
    },
    // top_menu 會辦
    ON_DUTY_TOP_MENU_INFO : {
      show: false,
      enable: false
    },
    // top_menu 發通知
    ON_DUTY_TOP_MENU_SEND_NOTICE : {
      show: false,
      enable: false
    },
    // top_menu 檔案上傳
    ON_DUTY_TOP_MENU_UPLOAD : {
      show: false,
      enable: false
    },
    // top_menu 調檔
    ON_DUTY_TOP_MENU_TRANS_FILE : {
      show: false,
      enable: false
    },
    // top_menu 調檔_F2B
    ON_DUTY_TOP_MENU_TRANS_FILE_F2B : {
      show: false,
      enable: false
    },
    // top_menu 調檔_FMS
    ON_DUTY_TOP_MENU_TRANS_FILE_FMS : {
      show: false,
      enable: false
    },
    // top_menu 調檔_保全
    ON_DUTY_TOP_MENU_TRANS_FILE_INSUR : {
      show: false,
      enable: false
    },
    // 電訪資料-F2B/FMS 欄位
    ON_DUTY_TELDATA_F2B_FMS : {
      show: false,
      enable: false
    },
    // 電訪資料-保全 欄位
    ON_DUTY_TELDATA_PS : {
      show: false,
      enable: false
    },
  };

  // 左上選單按紐，isAvailable true 才可以 work
  topMenu: TopMenu = [
    { key: 'ON_DUTY_TOP_MENU_DIALER', class: 'top-menu__call', label: this.$t('onDutyPage_dialer').toString(), isAvailable: true }, // 撥號
    { key: 'ON_DUTY_TOP_MENU_NOTIFO', class: 'top-menu__concern', label: '照會', isAvailable: true },
    { key: 'ON_DUTY_TOP_MENU_INFO', class: 'top-menu__computer', label: '會辦', isAvailable: true },
    { key: 'ON_DUTY_TOP_MENU_SEND_NOTICE', class: 'top-menu__msg', label: this.$t('onDutyPage_sendNotice').toString(), isAvailable: true }, // 發通知
    { key: 'ON_DUTY_TOP_MENU_UPLOAD', class: 'top-menu__upload', label: '檔案上傳', isAvailable: true },
    { key: 'ON_DUTY_TOP_MENU_TRANS_FILE', class: 'top-menu__file', label: '調檔', isAvailable: true },
  ]

  // 右上功能按鈕
  topFeature: { key: string; label: string }[] = [
    { key: 'impairment', label: '聽語障' },
    { key: 'alert', label: '歸戶提示訊息' },
    { key: 'appeal', label: '特保/申訴' },
    { key: 'interViewRemark', label: '訪員備註' },
  ]


  // 【服務平台】欄位列舉值
  // serviceEnum: { key: string; val: string }[] = [
  //   { key: 'O', val: '電訪', },
  //   { key: 'I', val: '客服/櫃檯', },
  //   { key: 'V', val: 'IVR', },
  //   { key: 'OBD', val: '電訪紀錄', }
  // ]

  // 【服務平台】頁籤選單
  public gridDTabEnum: { key: string; value: Array<string>; label: string }[] = [
    { key: 'A', value: ['V', 'I', 'O', 'OBD'], label: '櫃檯/電訪/客服紀錄', },
    { key: 'B', value: ['4'], label: '電訪紀錄', },
  ]

  // 默認頁籤的 key
  defaultTabDKey: string = 'A';

  // 有頁籤之表格的原始資料
  rawData = {};

  // TEST:
  // 電訪資料 內容
  public gridTelData = {
    rowKey: 'rowKey',
    data: [],
    // pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'businessTypeName',
        title: this.$t('onDutyPage_businessType').toString(), // 業務別
        width: 114,
        fixed: 'left',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'sysSourceTypeTemp',
        title: this.$t('onDutyPage_sysSourceTypeTemp').toString(), // 保單號碼
        width: 125,
        fixed: 'left',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'custType',
        title: this.$t('onDutyPage_custType').toString(), // 受訪者身分
        width: 125,
        fixed: 'left',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'taskName',
        title: this.$t('onDutyPage_taskName').toString(), // 電訪項目
        width: 175,
        fixed: 'left',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'assignContsctDateTime',
        title: this.$t('onDutyPage_assignContsctDateTime').toString(), // 指定聯絡時段
        width: 120,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'priorityFlag',
        title: this.$t('onDutyPage_priorityFlag').toString(), // 優先
      },
      {
        type: FblColumnType.PLAIN,
        property: 'vipType',
        title: this.$t('onDutyPage_vipType').toString(), // VIP客戶
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isItacy',
        title: this.$t('onDutyPage_isItacy').toString(), // 不識字
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isSignatureHand',
        title: this.$t('onDutyPage_isSignatureHand').toString(), // 蓋手印
      },
      {
        type: FblColumnType.PLAIN,
        property: 'contSpecilMemo',
        title: this.$t('onDutyPage_contSpecilMemo').toString(), // 需調檔
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'videoListTemp',
        title: this.$t('onDutyPage_videoListTemp').toString(), // 影像清單
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'riskControlDetailsTemp',
        title: this.$t('onDutyPage_riskControlDetailsTemp').toString(), // 風控明細
        // width: 120,
        // fixed: 'right',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'telDeadline',
        title: this.$t('onDutyPage_telDeadline').toString(), // 電訪期限
        // width: 120,
        // fixed: 'left',
      },
    ],
  };

  // 申訴紀錄資料
  appealData: AppealInfo = {};
  // 申訴紀錄輸入
  appealInput: AppealInput = {};
  // 特保住記資料
  custMarList: CustMarkOutput = {};
  // 特保住記輸入
  custMarkInput: CustMarkInput = {};
  // 來電提示資料
  inCallingList: InCallingOutput = {};
  // 來電提示輸入
  inCallingInput: InCallingInput = {};
  // 聽語障資料
  impairmentData: ImpairmentInfoDto = {};


  // ================================= 照會資料 =====================
  notificationData = {
    caseNo: '',
    notiStep: NotiStep.open,
    packNo: ''
    // policyNo: '',
  };

  // ================================= 會辦資料 =====================
  cuntersignatureData = {
    caseNo: '',
    infStep: 1,
    packNo: ''
    // policyNo: '',
  };

  // ================================= 撥號歷程資料 =====================
  callUpHistoryParam: CaseCallUpHistoryInput = {
    custId: "",
    caseNo: "",
    guid: "",
  };

  // =================================訪員備註 interViewRemark Start=====================

  interViewRemarkVisible: boolean = false;
  isAppealFormVisible: boolean = false;
  /**
   * 右上方button按下後動作
   */
  topRightButtonAction(key) {
    switch (key) {
      case 'interViewRemark':
        this.interViewRemarkVisible = true;
        break;
      case 'alert':
        this.isTransitionFormVisible = true;
        break;
      case 'impairment':
        this.isImpairmentFormVisible = true;
        break;
      case 'appeal':
        this.isAppealFormVisible = true;
        break;
      default:
        console.log(key)
        break;
    }
  }
  /**
   * 訪員備註按下儲存
   */
  interViewRemarkSubmit() {
    (this.$refs.userForm as any).submit(PackMatchModule.matchedCasePack$.packNo);
  }
  /**
  * 訪員備註按下離開
  */
  interViewRemarkCancel() {
    this.interViewRemarkVisible = false;
  }
  /**
  * 訪員備註儲存成功後關掉視窗
  */
  closeInterViewerRemarks() {
    this.interViewRemarkVisible = false;
  }

  // =================================訪員備註 interViewRemark end=====================

  getGrid() {
    // ========= 取件預處理 取得CASE_PACK範例 =============
    //取件預處理執行後取得的符合的名單
    let pickUpResult = PackMatchModule.pickupResult;
    // console.log(pickUpResult)
    // ========= 取件預處理 取得CASE_PACK範例 =============
    // TEST:

    // this.serveGrid.data = [];

    // 賦予原始資料
    this.$set(this.rawData, 'serveGrid',
      this.serveDataList
    );
    // 取得默認頁籤的表格資料
    // this.getTabData({
    //   gridName: 'serveGrid',
    //   property: 'Service_SYS_Code',
    //   key: this.defaultTabDKey
    // });

  }

  // 暫時無用到
  /**
   * @description 過濾當前頁籤的資料
   * @param {string} gridName 表格資料名稱 e.g. 'gridD'
   * @param {string} property 欲篩選的欄位屬性 e.g. 'service'
   * @param {string} key 選中的頁籤 e.g. 'A'
   */
  // getTabData({ gridName, property, key }: { gridName: string, property: string, key: string }) {
  //   let tabData:ServeContactDataList[] = [];
  //   this.gridDTabEnum.filter((item) => item.key == key)[0].value.map((i) => {
  //     this.rawData[gridName].filter((val) => val[property] == i).map((j) => {
  //       tabData.push(j)
  //     })
  //   }
  //   )
  //   // 以受理時間排序
  //   // tabData = tabData.sort((a, b) => new Date(a.ACCEPT_DATETIME).getDate() - new Date(b.ACCEPT_DATETIME).getDate());
  //   // this[gridName].data = tabData;
  //   // // 複製一份給modal
  //   // this.serveGridModal.data = JSON.parse(JSON.stringify(tabData));
  // }

  // 切換當前頁籤時取得對應資料
  handleChangeTabD(key: string) {
    this.serveTabKey = key;
    // this.getTabData({
    //   gridName: 'serveGrid',
    //   property: 'service',
    //   key
    // });
  }

  //按下影像清單後的buffer
  isTransferFileLoading: boolean = false;
  //顯示F2B影像清單的控制開關
  isF2BFileListvisible: boolean = false;
  //初始化清單資料
  f2BFileListiniData: Array<F2bFileGrid> = [];
  //f2B預覽網址
  f2BPreviewUrl: string = "";
  /**
   * 顯示影像清單
   * @param data 
   */
  videoListAction(data: TelDataDto) {

    if (data.businessTypeCode == "NB") {
      this.isTransferFileLoading = true;
      this.$transferFileApi.getF2bFileListOrFmsHashKeyUsingGET(data.caseNo).
        then((resp: AxiosResponse<F2BFmsResponse>) => {
          //若為承保前則調閱F2B檔案清單
          if (resp.data.executetime == "BUW") {
            this.f2BFileListiniData = resp.data.f2bFileGridList;
            this.f2BPreviewUrl = resp.data.f2bFilePreviewUrl;
            this.isF2BFileListvisible = true;
            //若為承保後則調閱FMS檔案清單    
          } else if (resp.data.executetime == "AUW") {
            let hashKey = resp.data.hashKey;
            let fmsUrl = resp.data.fmsFilePreviewUrl
            window.open(fmsUrl + hashKey)
          }

        }).catch(error => {
          ErrorModalUtil.modalError(error.response.data.message);

        }).finally(() => {

          this.isTransferFileLoading = false;
        })

    } else if (data.businessTypeCode == "PS") {
      this.isTransferFileLoading = true;
      this.$transferFileApi.getF2bPsUrlUsingGET(data.caseNo).then((resp: AxiosResponse<string>) => {
        if (!ValidationUtil.isEmpty(resp.data)) {
          window.open(resp.data);
        }
      }).catch(error => console.error(error)).finally(() => this.isTransferFileLoading = false);
    }


  }

  /**
   * 風控明細
   * @param data 
   */
  riskControlDetailsAction(data: TelDataDto) {
    this.riskControlDetailsShowData = data;
    this.theBusinessTypeCode = data.businessTypeCode;
    LoadingUtil.show();

    // 變更後保單基本資料
    const riskControlDetailsPromise: Promise<void | AxiosResponse<RiskControlDetailsDto>> =
      this.$telDataApi.searchRiskControlUsingGET(
        data.businessTypeCode, data.caseNo)
        .then((resp: AxiosResponse<RiskControlDetailsDto>) => {
          this.theRiskControlDetailsData = resp.data;
        });
    // 變更前保單基本資料
    const policyBeforePromise: Promise<void | AxiosResponse<PolicyBeforeDto>> =
      this.$telDataApi.findPolicyBeforeByCaseNoUsingGET(data.caseNo)
        .then((resp: AxiosResponse<PolicyBeforeDto>) => {
          this.thePolicyBasicBackupData = resp.data;
        });

    Promise.all([riskControlDetailsPromise, policyBeforePromise]).then(() => {
      if (this.thePolicyBasicBackupData) {
        const before = this.thePolicyBasicBackupData;
        const after = this.theRiskControlDetailsData;
        this.isPolicyBasicDateChanged =
          before.casePolicy != after.policyCasePolicy ||
          // before.policyNo != after.policyPolicyNo ||
          // before.policySeq != after.policyPolicySeq ||
          // before.idDup != after.policyIdDup ||
          before.pherName != after.policyPherName ||
          before.pherPermanentZipCode != after.policyPherPermanentZipCode ||
          before.pherPermanentAddr != after.policyPherPermanentAddr ||
          before.pherPermanentTel != after.policyPherPermanentTel ||
          before.pherPermanentTel2 != after.policyPherPermanentTel2 ||
          before.pherMob != after.policyPherMob ||
          before.pherContTel != after.policyPherContTel ||
          before.pherContTel2 != after.policyPherContTel2 ||
          before.pherContZipCode != after.policyPherContZipCode ||
          before.pherContAddr != after.policyPherContAddr ||
          before.pherEmail != after.policyPherEmail ||
          before.insuName != after.policyInsuName ||
          before.insuContZipCode != after.policyInsuContZipCode ||
          before.insuContAddr != after.policyInsuContAddr ||
          before.insuTel != after.policyInsuTel ||
          before.insuTel2 != after.policyInsuTel2 ||
          before.insuMob != after.policyInsuMob ||
          before.insuEmail != after.policyInsuEmail;
      } else {
        this.isPolicyBasicDateChanged = false;
      }
      this.isRiskControlDetails = true;
    }).finally(() => LoadingUtil.close());
  }

  // TEST:
  handleTest(data) {
    // console.log(data);
    switch (data) {
      case this.$t('onDutyPage_dialer').toString(): // 撥號
        this.isCallUpFormVisible = true;
        break;
      case "照會":
        this.notificationData.caseNo = "";
        this.notificationData.notiStep = NotiStep.open;
        this.isNotificationFormVisible = !this.isNotificationFormVisible;
        break;
      case "會辦":
        this.cuntersignatureData.caseNo = "";
        this.cuntersignatureData.infStep = 1;
        this.isCountersignatureFormVisible = !this.isCountersignatureFormVisible;
        break;
      case this.$t('onDutyPage_sendNotice').toString(): //發送通知
        this.isNoticeFormVisible = !this.isNoticeFormVisible;
        break;
      case this.$t('onDutyPage_fileUpload').toString(): // 檔案上傳
        this.isFileUploadFormVisible = !this.isFileUploadFormVisible;
        break;
      case "調檔":
        break;
    }
  }

  created() {
    //聽語障按鈕是否顯示
    this.getImpairment();

    //取得第一筆名單
    let currentPackNo = PackMatchModule.pickupResult.firstCasePack;

    // 畫面元件 component 權限
    this.getAuthComponent(); 

    //取得調檔F2BFMSInsuranceurls
    this.getF2bFmsInsuranceUrls();

    // 初始化資料
    this.changeServeInfo(currentPackNo);

    //VIP提示訊息
    this.vipNotify();

    //歸戶提示訊息 "!"
    this.setTransitionMark();
    
  }


  /**
   * 畫面元件 component 權限
   */
  getAuthComponent(){

    this.$authApi.getAuthComponentUsingGET(this.$route.path)
    .then((res: AxiosResponse<ComponentDto>) => {
        if (res.data.component) {
            // top_menu
            this.authComponent.ON_DUTY_TOP_MENU_DIALER = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_DIALER) ? this.authComponent.ON_DUTY_TOP_MENU_DIALER : res.data.component.ON_DUTY_TOP_MENU_DIALER;
            this.authComponent.ON_DUTY_TOP_MENU_NOTIFO = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_NOTIFO) ? this.authComponent.ON_DUTY_TOP_MENU_NOTIFO : res.data.component.ON_DUTY_TOP_MENU_NOTIFO;
            this.authComponent.ON_DUTY_TOP_MENU_INFO = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_INFO) ? this.authComponent.ON_DUTY_TOP_MENU_INFO : res.data.component.ON_DUTY_TOP_MENU_INFO;
            this.authComponent.ON_DUTY_TOP_MENU_SEND_NOTICE = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_SEND_NOTICE) ? this.authComponent.ON_DUTY_TOP_MENU_SEND_NOTICE : res.data.component.ON_DUTY_TOP_MENU_SEND_NOTICE;
            this.authComponent.ON_DUTY_TOP_MENU_UPLOAD = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_UPLOAD) ? this.authComponent.ON_DUTY_TOP_MENU_UPLOAD : res.data.component.ON_DUTY_TOP_MENU_UPLOAD;
            this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE) ? this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE : res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE;
            // top_menu 調檔 f2b/fms/保全
            this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_F2B = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE_F2B) ? this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_F2B : res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE_F2B;
            this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_FMS = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE_FMS) ? this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_FMS : res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE_FMS;
            this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_INSUR = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE_INSUR) ? this.authComponent.ON_DUTY_TOP_MENU_TRANS_FILE_INSUR : res.data.component.ON_DUTY_TOP_MENU_TRANS_FILE_INSUR;
            // 電訪資料
            this.authComponent.ON_DUTY_TELDATA_F2B_FMS = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TELDATA_F2B_FMS) ? this.authComponent.ON_DUTY_TELDATA_F2B_FMS : res.data.component.ON_DUTY_TELDATA_F2B_FMS;
            this.authComponent.ON_DUTY_TELDATA_PS = ValidationUtil.isEmpty(res.data.component.ON_DUTY_TELDATA_PS) ? this.authComponent.ON_DUTY_TELDATA_PS : res.data.component.ON_DUTY_TELDATA_PS;

            // 滾出 取得 authcompnent 與 menu 有相對應的設定，且 show 為 false 表示要移除該 menu
            this.topMenu.forEach((eachTop:TopMenuItem, index)=>{
              Object.keys(this.authComponent).some((eachComp)=>{
                if(eachComp === eachTop.key){
                  if(!this.authComponent[eachComp].show){
                    this.topMenu.splice(index,1);
                    return true;
                  }
                }
              })
            });
            console.log("OnDutyPage topMenu: ", JSON.stringify(this.topMenu));
        }
        console.log("OnDutyPage: ", JSON.stringify(this.authComponent));

    }).catch((err) => {
        console.log(err);
    });

  }

  //調檔F2B 的url
  f2bFileTransferUrl: string = '';
  //調檔FMS 的url
  fmsFileTransferUrl: string = '';
  //調檔保全 的url
  insuranceTransferUrl: string = '';
  //取得調檔F2BFMSInsuranceurls
  getF2bFmsInsuranceUrls() {
    this.$transferFileApi.getF2bFmsInsuranceUrlsUsingGET()
      .then((resp: AxiosResponse<F2bFmsInsuranceUrl>) => {


        this.f2bFileTransferUrl = resp.data.f2bFileTransferUrl;
        this.fmsFileTransferUrl = resp.data.fmsFileTransferUrl;
        this.insuranceTransferUrl = resp.data.insuranceTransferUrl;

      }).catch((error) => {

        console.log(error);
      })

  }

  //VIP提示訊息
  vipNotify() {
    if (PackMatchModule.pickupResult.firstCasePack.vipType != '0') {
      Modal.info({
        class: "error-modal-util-class",
        okText: this.$t('global_ok').toString(), //確認
        title: this.$t("global_information").toString(),//提示訊息
        content: this.$t("onDutyPage_contactAgentFirst").toString() //請先聯繫業務員
      });
    }
  }

  //由照會/會辦未結案提醒開啟案件查詢表單
  notiInfNotCloseRemindCaseSearch(casePolicy) {
    this.isCaseSearchModalVisible = true;
    this.notiInfNotCloseCasePolicyNumber = casePolicy;
  }

  // 更新服務資訊所內容
  changeServeInfo(currentPackNo: CasePackDto) {

    let promiseList: Promise<any>[] = []
    // 取不到的話 topMenu 都 disable
    if (validationUtil.isEmpty(currentPackNo) || currentPackNo.status == "S") {
      this.topMenu.forEach(item => {
        item.isAvailable = false;
      });
    } else {
      // 電訪資料 內容
      const getTelDataPromise = this.$telDataApi.getTelDataUsingGET(currentPackNo.packNo)
        .then((resp: AxiosResponse<TelDataDto[]>) => {
          this.gridTelData.data = resp.data;
        });
      promiseList.push(getTelDataPromise);
    }
    // ========= 取件預處理 取得CASE_PACK範例 =============
    if (!validationUtil.isEmpty(currentPackNo) && !validationUtil.isEmpty(currentPackNo.packNo)) {
      if (currentPackNo.casePolicyLogInfoList != null && currentPackNo.casePolicyLogInfoList.length > 0) {
        const casePolicyAndLogIdDtoList = currentPackNo.casePolicyLogInfoList.map(c => { return {caseNo: c.caseNo, caseLogId: c.guid} as CasePolicyAndLogIdDto;});
        if (casePolicyAndLogIdDtoList != null && casePolicyAndLogIdDtoList.length > 0) {
          const findCaseNosByPackNoPromise = this.$policyDataApi.getPolicyContractStatusDataUsingPOST(casePolicyAndLogIdDtoList).then(() => {
            console.log("getPolicyContractStatusDataUsingPOST execute....");
          }).finally(()=>{
            this.isGetPolicyContractStatusData = true; // 是否已執行完畢_取得保單基本資料_契約狀態
            //待契約狀態資料產生完畢後再撈取並產出問卷各區塊資料
            this.packNoTest = currentPackNo.packNo;
            this.getQuestAreaData();
          });
          promiseList.push(findCaseNosByPackNoPromise);
        }
      }
    }
    // 申訴紀錄
    if (!validationUtil.isEmpty(currentPackNo) && !validationUtil.isEmpty(currentPackNo.custId)) {
      this.appealInput = {
        CustID: currentPackNo.custId
      }
      const appealData = this.$historyApi.getAppealDataUsingPOST(currentPackNo.packNo, this.appealInput)
        .then((resp: AxiosResponse<AppealInfo>) => {
          this.appealData = resp.data;
          if (this.appealData != null && !validationUtil.isEmpty(this.appealData)) {

            this.appealData.asreceiveDate = validationUtil.isEmpty(this.appealData.asreceiveDate) ? this.appealData.asreceiveDate : MomentUtil.transformRocYearMonthDay(this.appealData.asreceiveDate);
            // 如果是民國前須給空值
            if (!validationUtil.isEmpty(this.appealData.asreceiveDate) && this.appealData.asreceiveDate.substring(0, 1) == "-") {
              this.appealData.asreceiveDate = "";
            }
          }

        });
      promiseList.push(appealData);
    }
    // 特保住記
    if (!validationUtil.isEmpty(currentPackNo) && !validationUtil.isEmpty(currentPackNo.custId)) {
      this.custMarkInput = {
        CUST_ID: currentPackNo.custId,
        SYS_SOURCE: ""
      }
      const custMark = this.$historyApi.getCustMarkInfoUsingPOST(currentPackNo.packNo, this.custMarkInput)
        .then((resp: AxiosResponse<CustMarkOutput>) => {
          this.custMarList = resp.data;
          if (this.custMarList.dataList != null && this.custMarList.dataList.length > 0) {
            this.custMarList.dataList.forEach(data => {
              // 民國年轉換，如果空值就不轉換
              data.EFF_START_DATE = validationUtil.isEmpty(data.EFF_START_DATE) ? data.EFF_START_DATE : MomentUtil.transformRoc(data.EFF_START_DATE);
              data.EFF_END_DATE = validationUtil.isEmpty(data.EFF_END_DATE) ? data.EFF_END_DATE : MomentUtil.transformRoc(data.EFF_END_DATE);
              if (!validationUtil.isEmpty(data.EFF_START_DATE) && data.EFF_START_DATE.substring(0, 1) == "-") {
                data.EFF_START_DATE = "";
              }
              if (!validationUtil.isEmpty(data.EFF_END_DATE) && data.EFF_END_DATE.substring(0, 1) == "-") {
                data.EFF_END_DATE = "";
              }
            })
          }
        });
      promiseList.push(custMark);
    }
    // 來電提示
    if (!validationUtil.isEmpty(currentPackNo) && !validationUtil.isEmpty(currentPackNo.custId)) {
      this.inCallingInput = {
        CUST_ID: currentPackNo.custId,
        SYS_SOURCE: ""
      }
      const inCalling = this.$historyApi.getInCallingInfoUsingPOST(currentPackNo.packNo, this.inCallingInput)
        .then((resp: AxiosResponse<InCallingOutput>) => {
          this.inCallingList = resp.data;
          if (this.inCallingList.dataList != null && this.inCallingList.dataList.length > 0) {
            this.inCallingList.dataList.forEach(data => {
              // 民國年轉換，如果空值就不轉換
              data.EFF_START_DATE = validationUtil.isEmpty(data.EFF_START_DATE) ? data.EFF_START_DATE : MomentUtil.transformRoc(data.EFF_START_DATE);
              data.EFF_END_DATE = validationUtil.isEmpty(data.EFF_END_DATE) ? data.EFF_END_DATE : MomentUtil.transformRoc(data.EFF_END_DATE);
              if (!validationUtil.isEmpty(data.EFF_START_DATE) && data.EFF_START_DATE.substring(0, 1) == "-") {
                data.EFF_START_DATE = "";
              }
              if (!validationUtil.isEmpty(data.EFF_END_DATE) && data.EFF_END_DATE.substring(0, 1) == "-") {
                data.EFF_END_DATE = "";
              }
            })
          }
        });
      promiseList.push(inCalling);
    }

    // 照會/會辦未結案提醒處理
    if (!validationUtil.isEmpty(currentPackNo) && !validationUtil.isEmpty(currentPackNo.packNo)){
      const notCloseNotify = this.$informApi.searchOpenCaseUsingGET(currentPackNo.packNo)
        .then((resp) => {
          this.notiInfNotCloseList = resp.data;
          
        }).catch((err) => {
          // 照會/會辦未結案查詢失敗
          ErrorModalUtil.modalError(this.$t('notiInfNotClose_searchFailed').toString())
        })
      promiseList.push(notCloseNotify);
    }
    
    // 撥號歷程資料    
    if (!validationUtil.isEmpty(currentPackNo) && !validationUtil.isEmpty(currentPackNo.packNo)) {
      this.callUpHistoryParam.custId = currentPackNo.custId;
    }
    LoadingUtil.show();
    Promise.all(promiseList).then(() => {
      this.getGrid();
      // const vipPrompt = (this.gridTelData.data as TelDataDto[])
      //   .filter(d => d.sysType == "1" &&
      //     d.vipType && d.vipType.toUpperCase().includes("VIP") &&
      //     d.taskId && d.taskId.toUpperCase() == "COL29");
      // if (vipPrompt && vipPrompt.length > 0) {
      //   Modal.info({
      //     okText: this.$t('global_ok').toString(),
      //     title: () => this.$t("global_information").toString(),//提示訊息
      //     content: () => this.$t("onDutyPage_contactSalesmanFirst").toString(), // 請先聯繫業務員
      //   }
      //   )
      // }
      // 如果有特保/申訴紀錄一開始需開啟
      if (this.isCustMark) {
        this.isAppealFormVisible = true;
      }
      // 如果有 照會/會辦未結案資訊 一開始需開啟
      if (this.notiInfNotCloseList.length > 0) {
        this.isNotiInfNotCloseRemindFormVisible = true;
      }
    }).catch(e => console.error(e)).finally(() => LoadingUtil.close());

  }
  // 判斷這特保住記、申訴紀錄與來電提示是其中一個有值，有的話會true
  get isCustMark() {
    return this.custMarList.success || this.appealData.success || this.inCallingList.success;
  }
  /**
   * 撥號儲存動作觸發
   */
  onDialerSave(e) {
    (this.$refs.callUpForm as any).onDialerSave();
    //告訴電訪結果區 撥號已儲存
    (this.$refs.teleResultArea as any).changeCallUpFormSaveFlag(true);
    // VL903-1242 避免當沒有任何撥號紀錄，直接關閉面板，會將方便連絡時段、聯絡結果及電訪結果的輸入值清空
    if(!validationUtil.isEmpty(callUpInfoModule.callUpInfo) && !validationUtil.isEmpty(callUpInfoModule.callUpInfo.codingNo)){
      (this.$refs.teleResultArea as any).reload("FROM_ON_DIALER_SAVE"); //重新刷新結果區，資料，附帶 falg 表示從撥號面板關閉來
    } 
  }

  // 關閉撥號作業視窗
  closeDialer() {
    this.isCallUpFormVisible = !this.isCallUpFormVisible;
  }

  /**
   * 撥號資料儲存
   */
  onDialerValueSave(data: CasePackTelephoneListDto[]) {
    console.log(data);
    // 儲存資料
    this.$emit('callUpValue', data);
    // VL903-1114 帶入撥號面板當前撥號資訊給到 vuex
    callUpInfoModule.putCurrentCallUpData(data);
    // 關閉撥號作業視窗
    this.closeDialer();
    console.log("撥號資料儲存完畢");
  }

  //關閉發送通知視窗
  closeNoticeForm() {
    this.isNoticeFormVisible = !this.isNoticeFormVisible;
  }

  //[測試用]設定pack_no
  packNoTest: string = "";
  /** 取得問卷各區塊資料 */
  getQuestAreaData() {
    console.log(this.packNoTest);

    this.$questMainApi.getQuestDataUsingGET(this.packNoTest)
      .then((resp) => {
        console.log(resp.data);
        this.openAllArea();
        this.resetQuestAnsData(resp.data.questAreaData);
        this.openAreaData = resp.data.openAreaData;
        this.checkIdAreaData = resp.data.checkIdAreaData;
        this.questAreaData = resp.data.questAreaData;
        this.endData = resp.data.endData;
        this.questTitle += "(" + this.questAreaData.openCaseCount + ")";
        this.questAreaData["packNo"] = this.packNoTest;
        this.checkIdAreaData["packNo"] = this.packNoTest;

        //是否符合電話變更(需更新畫面顯示，使用$set)
        this.$set(this.questAreaData, "isChangeWork", false);

        // 問卷資料取得完畢再顯示電訪結果區資訊
        this.isShowTeleResult = true;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      });
  }

  /** 初始化問卷各區塊答案 */
  resetQuestData(): QuestAllData {
    this.questTitle = "電訪問卷";
    let questAllData = {
      //各區塊保戶回答歷程
      custHisAnswer: { open: "", checkId: "", quest: {}, end: {} },
      //各區塊保戶回答
      custAnswer: { open: "", checkId: "", quest: {}, end: {} },
      //各區塊答案、重寄信函內容
      answer: { open: "", checkId: "", policy: {}, quest: {}, reSendLetter: {}, questCheck: {} },
      //共用資料
      commonData: { questModify: "N" }
    }
    return questAllData;
  }

  /** 初始化保單資料、問卷、結束語區塊答案及保戶回答 */
  resetQuestAnsData(questAreaData) {
    this.questAllData = this.resetQuestData();

    questAreaData.questDto.forEach((quest) => {
      console.log("初始化資料");
      let caseNo = quest.caseNo

      //塞入caseNo key
      this.questAllData.answer.policy[caseNo] = {};
      this.questAllData.answer.quest[caseNo] = {};
      this.questAllData.custAnswer.quest[caseNo] = {};
      this.questAllData.custHisAnswer.quest[caseNo] = {};
      this.questAllData.custAnswer.end[caseNo] = "";
      this.questAllData.custHisAnswer.end[caseNo] = "";

      //保單資料答案
      quest.questPolicyDto.forEach((policy) => {
        if (policy.answerOption != null && policy.answerOption != "")
          this.questAllData.answer.policy[caseNo][policy.itemCode] = "";
      });

      //問卷答案、保戶回答、歷程
      quest.questContDto.forEach((qCont) => {
        if (qCont.answerOption != null && qCont.answerOption != "")
          this.questAllData.answer.quest[caseNo][qCont.itemCode] = { value: "" };

        this.questAllData.custAnswer.quest[caseNo][qCont.itemCode] = "";
        this.questAllData.custHisAnswer.quest[caseNo][qCont.itemCode] = "";
      });

      //重寄信函內容
      this.questAllData.answer.reSendLetter[caseNo] = { type: "", addr: "" };

      //是否點過問卷檢核
      this.questAllData.answer.questCheck[caseNo] = { doChecked: "N", pass: "N", refuseCheck: "N" };

    });
  }

  /** 展開開場白、核身、問卷區塊 */
  openAllArea() {
    const header = [this.$refs.headerOpen, this.$refs.headerCheckId, this.$refs.headerQuest];
    header.forEach((data) => {
      (data as any).collapseChange((data as any).$refs.collapse, "open");
    });
  }

  /** [測試用]看目前問卷各區塊答案資料 */
  clickAnswer() {
    console.log(this.questAllData);
  }

  // 離開彈窗 (未來統一修改為此關閉視窗方式) (目前已使用的彈窗為 ： 會辦資料、歸戶提示、服務歷程訊息彈窗)
  onCloseModal(modalName) {
    this[modalName] = false;
  }

  // 換頁(提供換頁共用，name為要切頁的grid)
  onPageChange(e: FblPageEvent, name: string) {
    if (this[name].data.length > 0) {
      this[name].pagination = e.pagination;
      this[name].sort = e.sort;
    }

  }
  // 控制輔助資訊彈窗介面(key值為blockName)
  showAllData(key: string) {
    // 服務歷程
    if (key === "serveHistory") {
      this.isServeHistoryFormVisible = true;
    } else if (key === "phoneCallHistory") {
      // 撥號歷程Modal顯示
      this.isPhoneCallHistoryFormVisible = true;
    } else if (key === "policyData") {
      // 保單基本資料
      this.isPolicyDataFormVisiable = true;
    } else if (key === "deptMark") {
      // 部門註記Modal顯示
      this.isDeptMarkVisible = true;
    }
  }
  // 抓取vuex，當取件變的時候觸發
  get currentPack() {
    return PackMatchModule.pickupResult.firstCasePack;
  }
  // 監聽computed事件
  @Watch('currentPack', { deep: true })
  watchCurrentPack(newVal: CasePackDto, oldVal: CasePackDto) {
    // 如果新的值不為空且新舊件名單不同在執行取值
    if (!validationUtil.isEmpty(newVal) && !newVal.packNo.match(oldVal.packNo)) {
      this.changeServeInfo(newVal);
      this.vipNotify();
      this.setTransitionMark();   // 更新歸戶提示訊息 "!"
      (this.$refs.deptMark as any).reload(newVal.packNo);
      //強化當訪員未打開過訪員備註時是否更新訪員備註資料
      if((this.$refs.userForm as any) != undefined){
        (this.$refs.userForm as any).regetRemark(newVal.packNo); //更新訪員備註資料
      }
      // 如果切件TAB要回到第一個
      this.serveTabKey = 'A';
    }
  }

  // REPAIR-OBD2-1290_保單基本資料
  havePolicyDataShow(havePolicyData: number) {
    this.policyDataCountNum = havePolicyData;
    // 判斷是否有保單基本資料
    if (havePolicyData === 0) {
      this.isPolicyDataVisiableIfHaveData = false;
    } else {
      this.isPolicyDataVisiableIfHaveData = true;
    }
  }

  /**
   * 部門註記資料總筆數
   * @param totalDataLength 
   */
  totalDataLength(totalDataLength: number) {
    this.deptMarkDataCountNum = totalDataLength;
  }

  // 取得回傳的服務歷程比數
  serveContactDataLength(length: number) {
    this.serveContactLenght = length
  }

  // 問卷資料存檔檢核
  saveAllQuest(caseNo) {
    //如果caseNo有值則只存caseNo的問卷，如無值則存畫面上全部的問卷(讓結果區呼叫用)
    let currentPackNo = PackMatchModule.pickupResult.firstCasePack.packNo;
    let currentPackNoGuid = PackMatchModule.pickupResult.firstCasePack.packLogNo;
    let allCaseNoGuids = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList;
    const caseNoGuids = new Map();
    allCaseNoGuids.forEach((data) => {
      caseNoGuids.set(data.caseNo, data.guid);
    });

    this.questDetailDataDtolist = [];
    for (let caseData of this.questAreaData.questDto) {
      let caseNoData = caseData.caseNo;
      let caseNoGuidDate = caseNoGuids.get(caseNoData);
      //answer.policy
      for (let itemCode in this.questAllData.answer.policy[caseNoData]) {
        this.questDetailDataDto = {};
        this.questDetailDataDto.caseNoGuid = caseNoGuidDate;
        this.questDetailDataDto.caseNo = caseNoData;
        this.questDetailDataDto.itemTypeCode = "policy";
        this.questDetailDataDto.itemCode = itemCode;
        this.questDetailDataDto.answer = this.questAllData.answer.policy[caseNoData][itemCode].value;
        this.questDetailDataDtolist.push(this.questDetailDataDto);
      }
      //answer.quest & custAnswer.quest
      for (let itemCode in this.questAllData.answer.quest[caseNoData]) {
        this.questDetailDataDto = {};
        this.questDetailDataDto.caseNoGuid = caseNoGuidDate;
        this.questDetailDataDto.caseNo = caseNoData;
        this.questDetailDataDto.itemTypeCode = "rightLetter";
        this.questDetailDataDto.itemCode = itemCode;
        this.questDetailDataDto.answer = this.questAllData.answer.quest[caseNoData][itemCode].value;
        //處理remark
        let remark = this.questAllData.answer.quest[caseNoData][itemCode]["remark"];
        let answerDesc = "";
        if( remark != undefined ){
          if(this.questAllData.answer.quest[caseNoData][itemCode].value != ''){
            var remarkValueArray:Array<string> = this.questAllData.answer.quest[caseNoData][itemCode].value.split(":");
            for(let remarkValueString of remarkValueArray){
              if( remark[remarkValueString].cont != undefined ){
                answerDesc = answerDesc + remark[remarkValueString].option + "-" + remark[remarkValueString].cont + ":";
              } else {
                answerDesc = answerDesc + remark[remarkValueString].option + ":";
              }
            }
            answerDesc = answerDesc.substring(0, answerDesc.length - 1);
          }
        }
        if(answerDesc.includes("-")){
          this.questDetailDataDto.answerDesc = answerDesc;
        }
        this.questDetailDataDto.customerAnswerContent = this.questAllData.custAnswer.quest[caseNoData][itemCode];
        this.questDetailDataDtolist.push(this.questDetailDataDto);
      }
      //answer.quest & custAnswer.quest(無答案選項處理)
      caseData.questContDto.forEach((qCont) => {
        if(qCont.answerTypeCode == null){
          this.questDetailDataDto = {};
          this.questDetailDataDto.caseNoGuid = caseNoGuidDate;
          this.questDetailDataDto.caseNo = caseNoData;
          this.questDetailDataDto.itemTypeCode = "rightLetter";
          this.questDetailDataDto.itemCode = qCont.itemCode;
          this.questDetailDataDto.answer = "";
          this.questDetailDataDto.answerDesc = "";
          this.questDetailDataDto.customerAnswerContent = this.questAllData.custAnswer.quest[caseNoData][qCont.itemCode];
        this.questDetailDataDtolist.push(this.questDetailDataDto);
        }
      });
      //answer.reSendLetter
      this.questDetailDataDto = {};
      this.questDetailDataDto.caseNoGuid = caseNoGuidDate;
      this.questDetailDataDto.caseNo = caseNoData;
      this.questDetailDataDto.itemTypeCode = "AML";
      this.questDetailDataDto.itemCode = "AML";
      this.questDetailDataDto.originalMail = this.questAllData.answer.reSendLetter[caseNoData].type;
      this.questDetailDataDto.mailAddr = this.questAllData.answer.reSendLetter[caseNoData].addr;
      this.questDetailDataDtolist.push(this.questDetailDataDto);
      //custAnswer.end
      this.questDetailDataDto = {};
      this.questDetailDataDto.caseNoGuid = caseNoGuidDate;
      this.questDetailDataDto.caseNo = caseNoData;
      this.questDetailDataDto.itemTypeCode = "end";
      this.questDetailDataDto.itemCode = "end";
      this.questDetailDataDto.customerAnswerContent = this.questAllData.custAnswer.end[caseNoData];
      this.questDetailDataDtolist.push(this.questDetailDataDto);
    }

    this.questDataDto = {
      packNoGuid: currentPackNoGuid,                                    //PACKNO的Guid
      consultAnswer: this.questAllData.answer.open,                     //徵詢事項答案
      checkAnswer: this.questAllData.answer.checkId,                    //核身答案 
      customerOpenAnswerContent: this.questAllData.custAnswer.open,     //開場白保戶回答
      customerCheckAnswerContent: this.questAllData.custAnswer.checkId, //核身保戶回答
      questCustomerAnswer: this.questDetailDataDtolist                  //問卷答案及保戶回答 
    }

    LoadingUtil.show();
    this.$questMainApi.doSaveQuestUsingPOST(caseNo, currentPackNo, this.questDataDto)
      .then((resp) => {
        console.log("存檔成功");
        LoadingUtil.close();
        if (VlidationUtil.isEmpty(caseNo)) {
          //案件編號為空 執行結果區的儲存
          this.saveTeleResultAreaInfo();
        }
      })
      .catch((err) => {
        console.log(err);
        LoadingUtil.close();
        ErrorModalUtil.modalError("系統發生錯誤，請聯絡系統管理員處理(saveAllQuest error)");
        return;
      })
      .finally(() => { });

  }

  //呼叫結果區的儲存
  saveTeleResultAreaInfo() {
    (this.$refs.teleResultArea as any).toSaveTeleResult();
  }

  //因應結果區切換續訪/取下一筆，將已開啟的表單關閉
  clossAllFormByTeleResultArea() {
    // 風控明細
    this.isRiskControlDetails = false;
    // 案件查詢
    this.isCaseSearchModalVisible = false;
    // 保單基本資料
    this.isPolicyDataFormVisiable = false;
    // 交辦部門註記
    this.isDeptMarkVisible = false;
    // 服務歷程
    this.isServeHistoryFormVisible = false;
    // F2B影像清單
    this.isF2BFileListvisible = false;
    // 電訪資料-特保/申訴
    this.isAppealFormVisible = false;
    // 撥號歷程
    this.isPhoneCallHistoryFormVisible = false;
    // 未結案提醒
    this.isNotiInfNotCloseRemindFormVisible = false;
    // 撥號面板表單
    this.isCallUpFormVisible = false;
  }

  // 取得回傳的撥號歷程筆數
  callUpHistoryCount(length: number) {
    this.callUpHistoryCountNum = length
  }

  changeOpenCount(openCount) {
    this.questTitle = "電訪問卷(" + openCount + ")";
  }


  /**
   * @description 歸戶提示訊息是否顯示"!"
   * 
   * @author B1529
   * @version 2022/07/19
   */
  setTransitionMark(count?:Number){

    let length:Number = PackMatchModule.pickupResult.casePackList.length;

    if(!ValidationUtil.isEmpty(count)){
      length = count;
    }

    // 名單數量大於2筆以上需顯示"!"
    this.showTransitionMark = length > 1 ? true : false;
    
  }

  //取得聽語障資訊
  getImpairment() {
    const impairmentgridInfo: Promise<void | AxiosResponse<ImpairmentInfoDto>> =
    this.$informApi.getImpairmentInfoByPackNoUsingPOST(this.packNo)
        .then((res: AxiosResponse<ImpairmentInfoDto[]>) => {
          this.impairmentgridInfo = res.data;
          if (this.impairmentgridInfo[0]) {
            // this.isImpairmentFormVisible = true;
            this.showImpairmentMark = true;
          }else{
            // this.isImpairmentFormVisible = false;
            this.showImpairmentMark = false;
          }       
    }).finally(()=>{
      LoadingUtil.close();
    })
  }

}