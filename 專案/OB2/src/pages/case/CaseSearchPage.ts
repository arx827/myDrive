import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import {
  FblColumnType,
  FblPageEvent,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { Modal, message } from "ant-design-vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import { SelectOption, CasePageSearchForm, CasePageSearchValidateForm, FeildValidation } from "./model";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { ComponentDto, Option, CaseSearchInfInitData, GetCaseSearchInDto, GetCaseSearchCondition, 
  GetCaseSearchOutDto, CaseSearchDto, ExportCaseSearchInDto, ResponseEntity, DataHubInput, CaseCallUpHistoryDto, CaseCallUpHistoryInput, HandleNoList
 } from "@fubonlife/obd-api-axios-sdk";
import CaseHistoryForm from '@/components/shared/form/history/caseHistory/CaseHistoryForm.vue';
import MailRecord from '@/components/shared/form/history/mailHistory/MailHistory.vue';
import CommonUtil from "@/assets/config/CommonUtil";
import QuestionAnswer from '@/components/shared/form/history/questionAnswer/QuestionAnswer.vue';
import axios from 'axios';
import {AxiosResponse} from 'axios';
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import { AuthComonent } from "@/assets/config/CommonUtil";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import UploadFileHistroy from "@/components/shared/form/history/uploadFileHistroy/UploadFileHistroy.vue";
import InfRecord from "@/components/shared/form/history/infRecord/InfRecord.vue"
import MPlusHistory from "@/components/shared/form/history/mPlusHistory/MPlusHistory.vue";
import CallupHistory from "@/components/shared/form/history/callupHistory/CallupHistory.vue";
import HandleInfoForm from "@/components/shared/form/handleInfoForm/HandleInfoForm.vue";
import PostRecord from "@/components/shared/form/history/postRecord/PostRecord.vue";

@Component({
  components: { FblDataGrid, HiddenFolde, 
    CaseHistoryForm, MailRecord, QuestionAnswer, DragModal, UploadFileHistroy,InfRecord,MPlusHistory, CallupHistory, HandleInfoForm, PostRecord}
})
export default class CaseSearchPage extends Vue {

  // 畫面元件
  authComponent: AuthComonent ={
    CASESEARCH_SEARCH : {
        show: false,
        enable: false
    },
    CASESEARCH_EXPORT : {
        show: false,
        enable: false
    },
  };

  //若有傳入保單號碼 隱藏上方查詢條件區塊 僅查詢該保單號碼資料 (照會/會辦未結案提醒用) B1683
  @Prop()
  casePolicyNumber;

  @Prop()
  packNumber;

  packNo: string = "";

  caseNo:string = "";

  caseLogid: string = "";

  // 檔案上傳
  showUploadFileHistory: boolean = false;

  
  // ===================================== Grid Modal 點擊相關參數 start========================================================
  
  // 案件查詢 grid 顯示 modal 控制參數
  caseSearchPageGridModal:{[key:string]:boolean} = {
    isShowCaseHistory:false, //案件查詢-案件歷程
    infReocrdvisible:false, //案件查詢-會辦內容
    onMailRecordVisible:false, //案件查詢-Email紀錄
    isPostRecordVisible:false, //案件查詢-郵寄紀錄
    isQuestionAnswerVisible:false, //案件查詢-保戶回答
    infMplusSendMessageVisible:false, //案件查詢-MPlus和簡訊紀錄
    isCallUpHistoryVisible:false, //案件查詢-撥號歷程
    notiReocrdvisible:false, //案件查詢-照會內容
  }

  
  // 案件歷程 modal 參數
  caseHistoryParam:{custId?:string;casePolicy?:string;caseNo?:string}={
    custId: "",
    casePolicy: "",
    caseNo:"",
  }

   // mail歷程 modal 參數
   mailHistoryParam:{caseLogId?:string;caseNo?:string}={
    caseNo:"",
    caseLogId:""
  }

  // 郵寄紀錄 modal 參數
  postRecordParam:{caseLogId?:string;caseNo?:string}={
    caseNo:"",
    caseLogId:""
  }

  // 保戶回答 modal 參數
  questionAnswerParam: DataHubInput ={
    CASE_NO: "",
    GUID: "",
  };

  // 撥號歷程 modal 參數
  callUpHistoryParam: CaseCallUpHistoryInput ={
    custId: "",
    caseNo: "",
    guid: "",
  };

  // 處理單內容-會辦紀錄/照會紀錄 modal 參數
  handleInfoData: HandleNoList = {};

  // ===================================== Grid Modal 點擊相關參數 end========================================================


  //查詢條件
  casePageSearchForm:CasePageSearchForm = {
    taskItems: [], //電訪項目
    pherId: "",    //要保人id
    pherName: "",   // 要保人姓名
    dueContactStartDate: null, //應電訪日
    dueContactEndDate: null,    //應電訪日
    dueContactStartString : "",  //應電訪日
    dueContactEndString: "",   //應電訪日
    importStartDate: null,      //匯入日期
    importEndDate: null,        //匯入日期
    importStartString: "",      //匯入日期
    importEndString: "",        //匯入日期
    policyNo01: "",   //保單號碼
    policyNo02: "",   //保單號碼
    policyNo03: "",   //保單號碼
    packNo: "",       //名單序號
    insuredId: "",    //被保人id
    insuredName: "",  //被保人姓名
    departmentIdList: [], //部門
    divisionIdList: [],   //科別
    changeNo: "",   //受理案號
    custId: "",   //受訪者id
    custName: "", //受訪者姓名
    agentId: "",  //業務員id
    agentName: "",  //業務員姓名
    tmrIdList:[], //電訪員
  };

  //欄位驗證提示工具
  casePageSearchValidateForm: CasePageSearchValidateForm = {
    taskItems:{ hover: "", feedback: false, state: "", msg: "" },
    pherId:{ hover: "", feedback: false, state: "", msg: "" },
    pherName:{ hover: "", feedback: false, state: "", msg: "" },
    dueContactStartDate:{ hover: "", feedback: false, state: "", msg: "" },
    dueContactEndDate:{ hover: "", feedback: false, state: "", msg: "" },
    importStartDate:{ hover: "", feedback: false, state: "", msg: "" },
    importEndDate:{ hover: "", feedback: false, state: "", msg: "" },
    policyNo01:{ hover: "", feedback: false, state: "", msg: "" },
    policyNo02:{ hover: "", feedback: false, state: "", msg: "" },
    policyNo03:{ hover: "", feedback: false, state: "", msg: "" },
    packNo:{ hover: "", feedback: false, state: "", msg: "" },
    insuredId:{ hover: "", feedback: false, state: "", msg: "" },
    insuredName:{ hover: "", feedback: false, state: "", msg: "" },
    departmentIdList:{ hover: "", feedback: false, state: "", msg: "" },
    divisionIdList:{ hover: "", feedback: false, state: "", msg: "" },
    changeNo:{ hover: "", feedback: false, state: "", msg: "" },
    custId:{ hover: "", feedback: false, state: "", msg: "" },
    custName:{ hover: "", feedback: false, state: "", msg: "" },
    agentId:{ hover: "", feedback: false, state: "", msg: "" },
    agentName:{ hover: "", feedback: false, state: "", msg: "" },
    tmrIdList:{ hover: "", feedback: false, state: "", msg: "" }, 
  }

  casePageSearchRules: { [key: string]: ValidationRule[] } = {
    pherId:[{ validator: this.validatePherId, trigger: "blur" }],
    pherName:[{ validator: this.validatePherName, trigger: "blur" }],
    dueContactStartDate: [{ validator: this.validateDueContactStartDate, trigger: "blur" }],
    dueContactEndDate: [{ validator: this.validateDueContactEndDate, trigger: "blur" }],
    importStartDate: [{ validator: this.validateImportStartDate, trigger: "blur" }],
    importEndDate: [{ validator: this.validateImportEndDate, trigger: "blur" }],
    policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
    policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
    policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
    packNo:[{ validator: this.validatePackNo, trigger: "blur" }],
    insuredId:[{ validator: this.validateInsuredId, trigger: "blur" }],
    insuredName:[{ validator: this.validateInsuredName, trigger: "blur" }],
    changeNo: [{ validator: this.validateChangeNo, trigger: "blur" }],
    custId: [{ validator: this.validateCustId, trigger: "blur" }],
    custName:[{ validator: this.validateCustName, trigger: "blur" }],
    agentId: [{ validator: this.validateAgentId, trigger: "blur" }],
    agentName: [{ validator: this.validateAgentName, trigger: "blur" }],
  };


  //DatePicker民國年的格式
  formatter = this.$twDateFormatter;
  
  //日期選擇器hover是否顯示
  isDueContactStartVisible: boolean = false;
  isDueContactEndVisible: boolean = false;
  isImportDateStartVisible: boolean = false;
  isImportDateEndVisible: boolean = false;

  //判斷當下是否可執行匯出
  isExportDisable: boolean = false;
  overMaxRowCountMessage: string = "";
  

   // ===================================== 下拉式選單 ========================================================
  
  // 電訪項目
  selectTaskItemsOptions:SelectOption[] = [];
  // 部門
  selectDeptOptions: SelectOption[] = [];
  // 科別
  selectDiviOptions: SelectOption[] = [];
  // 電訪員
  selectTmrOptions: SelectOption[] = [];

  //使用者清單
  allUserList: Option[] = [];
  //科別清單
  allDivList: Option[] = [];
  
  // 部門對應科別/人員資料
  depUnitInfo = {};
  depUserInfo = {};
  // 科別對應人員資料
  unitUserInfo = {};

  //部門預設初始條件
  defaultDepId: string = "";
  //科別預設初始條件
  defaultUnitId: string = "";

  //部門與科別下拉選單是否禁用 2022/06/07 目前不需要
  // divDisable: boolean = false;
  // depDisable: boolean = false;

  
  // ===================================== Grid ========================================================
  caseSearchPageGrid: FblPDataGridHolder<CaseSearchDto> = {
    rowKey: "caseNo",
    data: [],
    pagination: {
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      current: 1,
      pageSize: 15,
      total: 0,
      locale: { items_per_page: "" }
    },
    scroll: { x: 500, y: 600 },
    columns: [
      {
        type: FblColumnType.TEMPLATE,
        property: "custId",
        title: this.$t('case_search_grid_custId').toString(), //受訪者ID
        width: 110,
        fixed: 'left',
        align: 'center',
        template: "alink_custId_Template",
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "custName",
        title: this.$t('case_search_grid_custName').toString(), //受訪者姓名
        width: CommonUtil.countColumnWidth(6),
        fixed: 'left',
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "custTypeName",
        title: this.$t('case_search_grid_custTypeName').toString(), //受訪者身分別
        width: 110,
        fixed: 'left',
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "casePolicy",
        title: this.$t('case_search_grid_casePolicy').toString(), //保單號碼
        width: 100,
        fixed: 'left',
        align: 'center',
        template: "alink_casePolicy_Template",
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "taskName",
        title: this.$t('case_search_grid_taskName').toString(), //電訪項目
        width: CommonUtil.countColumnWidth(6),
        fixed: 'left',
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "createDate",
        title: this.$t('case_search_grid_createDate').toString(), //日期
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "obdStageCodeName",
        title: this.$t('case_search_grid_obdStageCodeName').toString(), //案件階段
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "obdStatusCodeName",
        title: this.$t('case_search_grid_obdStatusCodeName').toString(), //案件狀態
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "questName",
        title: this.$t('case_search_grid_questName').toString(), //問卷名稱
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "contractorMemo",
        title: this.$t('case_search_grid_contractorMemo').toString(), //交辦部門註記-行政部門
        width: CommonUtil.countColumnWidth(15),
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "caseMark",
        title: this.$t('case_search_grid_caseMark').toString(), //交辦部門註記-電訪
        width: CommonUtil.countColumnWidth(15),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "dueContDateChg",
        title: this.$t('case_search_grid_dueContDateChg').toString(), //應電訪日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentAssignStartTime",
        title: this.$t('case_search_grid_agentAssignStartTime').toString(), //指定聯絡時段
        width: 100,
        align: 'center',
        formatter: (data:CaseSearchDto) =>{
          if (ValidationUtil.isEmpty(data.agentAssignStartTime) && ValidationUtil.isEmpty(data.agentAssignEndTime)) {
            return "";
          } else if(ValidationUtil.isEmpty(data.agentAssignStartTime)){
              return "~" + data.agentAssignEndTime;
          }else if(ValidationUtil.isEmpty(data.agentAssignEndTime)){
              return data.agentAssignStartTime + "~";
          }else{
              return data.agentAssignStartTime + "~" + data.agentAssignEndTime;
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "visitStartDate",
        title: this.$t('case_search_grid_visitStartDate').toString(), //方便聯絡時段
        width: 100,
        align: 'center',
        formatter: (data:CaseSearchDto) =>{
          if (ValidationUtil.isEmpty(data.visitStartDate) && ValidationUtil.isEmpty(data.visitEndDate)) {
            return "";
          } else if(ValidationUtil.isEmpty(data.visitStartDate)){
            return " ~ " + MomentUtil.getOnlyRocDate(data.visitEndDate) + " " + moment(data.visitEndDate).format("HH:mm");

          }else if(ValidationUtil.isEmpty(data.visitEndDate)){
              return MomentUtil.getOnlyRocDate(data.visitStartDate) + " " + moment(data.visitStartDate).format("HH:mm") + "~";
          }else{
              return MomentUtil.getOnlyRocDate(data.visitStartDate) + " " + moment(data.visitStartDate).format("HH:mm") + "~" + moment(data.visitEndDate).format("HH:mm");
              
          }
          
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "changeNo",
        title: this.$t('case_search_grid_changeNo').toString(), //受理案號
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "packNo",
        title: this.$t('case_search_grid_packNo').toString(), //名單序號
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysTypeCodeName",
        title: this.$t('case_search_grid_sysTypeCodeName').toString(), //通路別
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentUnitNo",
        title: this.$t('case_search_grid_agentUnitNo').toString(), //單位代號
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentUnitName",
        title: this.$t('case_search_grid_agentUnitName').toString(), //單位名稱
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentId",
        title: this.$t('case_search_grid_agentId').toString(), //業務員ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "agentName",
        title: this.$t('case_search_grid_agentName').toString(), //業務員姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "unitName",
        title: this.$t('case_search_grid_unitName').toString(), //科別
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "userName",
        title: this.$t('case_search_grid_userName').toString(), //電訪員
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "contactResultName",
        title: this.$t('case_search_grid_contactResultName').toString(), //聯絡結果
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "teleResultName",
        title: this.$t('case_search_grid_teleResultName').toString(), //電訪結果
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseClosedReasonName",
        title: this.$t('case_search_grid_caseClosedReasonName').toString(), //結案原因
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseCloseTime",
        title: this.$t('case_search_grid_caseCloseTime').toString(), //結案日期
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "pherId",
        title: this.$t('case_search_grid_pherId').toString(), //要保人ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "pherName",
        title: this.$t('case_search_grid_pherName').toString(), //要保人姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "pherBirthday",
        title: this.$t('case_search_grid_pherBirthday').toString(), //要保人生日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuId",
        title: this.$t('case_search_grid_insuId').toString(), //被保險人ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "insuName",
        title: this.$t('case_search_grid_insuName').toString(), //被保險人姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuBirthday",
        title: this.$t('case_search_grid_insuBirthday').toString(), //被保險人生日
        width: 110,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "underwritableDate",
        title: this.$t('case_search_grid_underwritableDate').toString(), //核保通過日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "policySendDate",
        title: this.$t('case_search_grid_policySendDate').toString(), //保單郵寄日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "submitDate",
        title: this.$t('case_search_grid_submitDate').toString(), //保單生效日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveCallUpHis",
        title: this.$t('case_search_grid_haveCallUpHis').toString(), //撥號歷程
        width: 100,
        align: 'center',
        template: "alink_haveCallUpHis_Template"
      },
      {
        type: FblColumnType.PLAIN,
        property: "notiDate",
        title: this.$t('case_search_grid_notiDate').toString(), //照會日期
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveNoti",
        title: this.$t('case_search_grid_haveNoti').toString(), //照會內容
        width: 100,
        align: 'center',
        template: "alink_haveNoti_Template", 
      },
      {
        type: FblColumnType.PLAIN,
        property: "infInfoDate",
        title: this.$t('case_search_grid_infInfoDate').toString(), //會辦日期
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveInfInfo",
        title: this.$t('case_search_grid_haveInfInfo').toString(), //會辦內容
        width: 100,
        align: 'center',
        template: "alink_haveInfInfo_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveSendPack",
        title: this.$t('case_search_grid_haveSendPack').toString(), //郵寄記錄
        width: 100,
        align: 'center',
        template: "alink_haveSendPack_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveSendEmail",
        title: this.$t('case_search_grid_haveSendEmail').toString(), //Email記錄
        width: 100,
        align: 'center',
        template: "alink_haveSendEmail_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveSendMsg",
        title: this.$t('case_search_grid_haveSendMsg').toString(), //M+/簡訊記錄
        width: 100,
        align: 'center',
        template: "alink_haveSendMsg_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveFileUp",
        title: this.$t('case_search_grid_haveFileUp').toString(), //檔案上傳
        width: 100,
        align: 'center',
        template: "alink_haveFileUp_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveCustAns",
        title: this.$t('case_search_grid_haveCustAns').toString(), //通話內容
        width: 100,
        align: 'center',
        template: "alink_haveCustAns_Template",
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuranceCode",
        title: this.$t('case_search_grid_insuranceCode').toString(), //險種
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "productDesc",
        title: this.$t('case_search_grid_productDesc').toString(), //商品名稱
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentId2",
        title: this.$t('case_search_grid_agentId2').toString(), //第二業務員ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "agentName2",
        title: this.$t('case_search_grid_agentName2').toString(), //第二業務員姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "contractStatusDesc",
        title: this.$t('case_search_grid_contractStatusDesc').toString(), //契約狀態
        width: 100,
        align: 'center',
      },
      
    ]
  }

  /**
   * 初始
   */
  created(){

    LoadingUtil.show();

    // 畫面元件 component 權限
    this.$authApi.getAuthComponentUsingGET(this.$route.path)
    .then((res: AxiosResponse<ComponentDto>) => {
        if (res.data.component) {
            this.authComponent.CASESEARCH_SEARCH = ValidationUtil.isEmpty(res.data.component.CASESEARCH_SEARCH) ? this.authComponent.CASESEARCH_SEARCH : res.data.component.CASESEARCH_SEARCH;
            this.authComponent.CASESEARCH_EXPORT = ValidationUtil.isEmpty(res.data.component.CASESEARCH_EXPORT) ? this.authComponent.CASESEARCH_EXPORT : res.data.component.CASESEARCH_EXPORT;
        }
        console.log("CaseSearchPage: ", JSON.stringify(this.authComponent));

    }).catch((err) => {
        console.log(err);
    });

    this.$caseSearchApi.caseSearchInfoInitUsingGET()
    .then((resp:AxiosResponse<CaseSearchInfInitData>)=>{
      if(resp.data != null){

        // 取得 電訪項目下拉
        if(resp.data.taskOptions){
          resp.data.taskOptions.forEach((taskOption:Option)=>{
            this.selectTaskItemsOptions.push({ label: taskOption.label, value: taskOption.value });
          });
        }else{
          LoadingUtil.close();
          console.log("案件查詢電訪項目下拉選單載入失敗");
        }

        // 取得 部門、科別、電訪員下拉
        if(resp.data.unitDepInfo != null){
          
          // 部門對應科別/人員資料
          this.depUnitInfo = resp.data.unitDepInfo.depUnitInfo;
          this.depUserInfo = resp.data.unitDepInfo.depUserInfo;

          // 科別對應人員資料
          this.unitUserInfo = resp.data.unitDepInfo.unitUserInfo;
          
          // 部門 下拉
          this.selectDeptOptions = Object.assign(resp.data.unitDepInfo.departOptions);
          this.defaultDepId = resp.data.unitDepInfo.defaultDepId;
          this.casePageSearchForm.departmentIdList.push(this.defaultDepId);
          
          // 科別 下拉
          this.allDivList = resp.data.unitDepInfo.unitList;
          this.defaultUnitId = resp.data.unitDepInfo.defaultUnitId;
          // this.casePageSearchForm.divisionIdList.push(this.defaultUnitId); // 案件查詢不需要預設 科別
          
          // 電訪員 下拉
          this.allUserList = resp.data.unitDepInfo.userList;
          // this.casePageSearchForm.tmrIdList.push(LoginModule.loginState.me.id); // 案件查詢不需要預設 電訪員

          // 有預設部門需一起異動科別/人員
          if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultDepId)) {
            this.onSelectDept();
          }

          // 有預設科別需一起異動人員
          if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultUnitId)) {
            this.onSeletDivi();
          }

        } // resp.data.unitDepInfo != null  END
        else{
          LoadingUtil.close();
          console.log("案件查詢部門科別電訪員下拉選單載入失敗");
        }

      } // resp.data != null END

    })
    .catch((error)=>{
      // 案件查詢下拉選單載入失敗
      ErrorModalUtil.modalError(this.$t('case_search_init_select_occur_error').toString());
    })
    .finally(()=>{
      LoadingUtil.close();
      
      //若有傳入保單號碼 隱藏上方查詢條件區塊 僅查詢該保單號碼資料 (照會/會辦未結案提醒用) B1683
      //若有傳入名單號 隱藏上方查詢條件區塊 僅查詢該名單碼資料 (覆核檔案調閱) B0845
      if(this.casePolicyNumber != undefined || this.packNumber != undefined){
        this.casePageSearchForm.departmentIdList = [];
        this.getCaseSearchInfo();
      }

    });


  }

  /**
   * 選擇部門時，科別範圍限縮
   */
  onSelectDept(){
    
    this.selectDiviOptions = [];
    this.selectTmrOptions = [];

    if(this.casePageSearchForm.departmentIdList.length > 0){

      this.casePageSearchForm.departmentIdList.forEach((depId)=>{
         // 取得部門對應的科別
         if(!ValidationUtil.isEmpty(this.depUnitInfo[depId])){
          this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
        }

        // 取得部門對應人員
        if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
        }
      });

    }else{
      // 科別 下拉
      this.selectDiviOptions = Object.assign(this.allDivList);
      // 電訪員 下拉
      this.selectTmrOptions = Object.assign(this.allUserList);
    }


     //重置科別選項
     let unitIdTempList = Object.assign(this.casePageSearchForm.divisionIdList);
     unitIdTempList.forEach((eachSelected)=>{
 
       // 如果當前選擇的科別不在科別下拉選單裡，則要移除
       if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
         if(this.casePageSearchForm.divisionIdList.length > 0) {
           this.casePageSearchForm.divisionIdList = this.casePageSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
         }
       }
     });
 
     //重置電訪員選項
     let userIdTempList = Object.assign(this.casePageSearchForm.tmrIdList);
     userIdTempList.forEach((eachSelected) => {
 
       // 如果當前選擇的人員不在人員下拉選單裡，則要移除
       if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
         if(this.casePageSearchForm.tmrIdList.length > 0) {
           this.casePageSearchForm.tmrIdList = this.casePageSearchForm.tmrIdList.filter(userId => userId != eachSelected);
         }
       }
     });

     //連動科別異動
     this.onSeletDivi(); 
  }

  /**
   * 選擇科別時，電訪員範圍限縮
   */
  onSeletDivi() {
    this.selectTmrOptions = [];


    // 有選擇科別
    if(this.casePageSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.casePageSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.casePageSearchForm.departmentIdList.length > 0) {

        this.casePageSearchForm.departmentIdList.forEach((depId) => {
  
          // 取得部門對應人員
          if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
            this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
          }
          
        });
          
      } else {
        // 電訪員 下拉
        this.selectTmrOptions = Object.assign(this.allUserList);
      }
    }

    //重置電訪員選項
    let userIdTempList = Object.assign(this.casePageSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.casePageSearchForm.tmrIdList.length > 0) {
          this.casePageSearchForm.tmrIdList = this.casePageSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }

   /**
   * 選擇電訪員後，部門與科別禁止異動
   * 目前不需要對電訪員操作後做額外動作 2022/06/07
   */
  // onSelectTmr() {
      
  //     if (this.casePageSearchForm.tmrIdList.length > 0) {
  //         this.depDisable = true;
  //         this.divDisable = true;
  //     } else {
  //         if (this.casePageSearchForm.divisionIdList.length > 0) {
  //             this.depDisable = true;
  //             this.divDisable = false;
  //         } else {
  //             this.depDisable = false;
  //             this.divDisable = false;
  //         }
  //     }
  // }




  //判斷上方查詢條件區塊是否顯示
  checkIsHiddenFoldeShow(){
    let show = true;

    //由照會/會辦未結案提醒表單點擊保單號碼開啟此畫面 需隱藏上方查詢條件
    if(this.casePolicyNumber != undefined || this.packNumber != undefined){
      show = false;
    }
    
    return show;
  }


  // 整理 案件查詢 條件 
  arrangeCaseSearchCondition(){

    var getCaseSearchCondition:GetCaseSearchCondition = {};
    getCaseSearchCondition.taskIds = this.casePageSearchForm.taskItems;
    getCaseSearchCondition.pherId = this.casePageSearchForm.pherId;
    getCaseSearchCondition.pherName = this.casePageSearchForm.pherName;

    getCaseSearchCondition.dueContactStartDate = ValidationUtil.isEmpty(this.casePageSearchForm.dueContactStartString) ? null : moment(this.casePageSearchForm.dueContactStartDate).format("YYYY/MM/DD");
    getCaseSearchCondition.dueContactEndDate = ValidationUtil.isEmpty(this.casePageSearchForm.dueContactEndString) ? null : moment(this.casePageSearchForm.dueContactEndDate).format("YYYY/MM/DD");
    
    getCaseSearchCondition.importStartDate = ValidationUtil.isEmpty(this.casePageSearchForm.importStartString) ? null : moment(this.casePageSearchForm.importStartDate).format("YYYY/MM/DD") ;
    getCaseSearchCondition.importEndDate = ValidationUtil.isEmpty(this.casePageSearchForm.importEndString) ? null : moment(this.casePageSearchForm.importEndDate).format("YYYY/MM/DD") ;

    var casePolicy = (()=>{
      var returnCasePolicy = "";
      if(!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo03)){
        returnCasePolicy = this.casePageSearchForm.policyNo01 + "-" + this.casePageSearchForm.policyNo02 + "-" + this.casePageSearchForm.policyNo03;
      }else{
        if(!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo02)){
          returnCasePolicy = this.casePageSearchForm.policyNo01 + "-" + this.casePageSearchForm.policyNo02;  
        }else{
          returnCasePolicy = this.casePageSearchForm.policyNo01;
        }
      }
      return returnCasePolicy;
    })();

    //判斷保單號碼查詢條件
    if(this.casePolicyNumber == undefined){
      //一般正常查詢
      getCaseSearchCondition.casePolicy = casePolicy;
    }else{
      //若有傳入保單號碼 隱藏上方查詢條件區塊 僅查詢該保單號碼資料 (照會/會辦未結案提醒用) B1683
      getCaseSearchCondition.casePolicy = this.casePolicyNumber;
    }
    // 判斷名單號查詢條件
    if(this.packNumber == undefined){
      // 一般正常查詢
      getCaseSearchCondition.packNo = this.casePageSearchForm.packNo;
    } else {
      // 若有傳入名單號碼 隱藏上方查詢條件區塊 僅查詢該保單號碼資料 (覆核作業) B0845
      getCaseSearchCondition.packNo = this.packNumber;
    }

    getCaseSearchCondition.insuredId = this.casePageSearchForm.insuredId;
    getCaseSearchCondition.insuredName = this.casePageSearchForm.insuredName;
    getCaseSearchCondition.departmentIds = this.casePageSearchForm.departmentIdList;
    getCaseSearchCondition.divisionIds = this.casePageSearchForm.divisionIdList;
    getCaseSearchCondition.changeNo = this.casePageSearchForm.changeNo;
    getCaseSearchCondition.custId = this.casePageSearchForm.custId;
    getCaseSearchCondition.custName = this.casePageSearchForm.custName;
    getCaseSearchCondition.agentId = this.casePageSearchForm.agentId;
    getCaseSearchCondition.agentName = this.casePageSearchForm.agentName;
    getCaseSearchCondition.tmrIds = this.casePageSearchForm.tmrIdList;

    return getCaseSearchCondition;
  } 

  // 案件查詢
  getCaseSearchInfo(){
    var getCaseSearchInDto:GetCaseSearchInDto={};
    
    getCaseSearchInDto.page = this.caseSearchPageGrid.pagination.current-1;
    getCaseSearchInDto.size = this.caseSearchPageGrid.pagination.pageSize;
    getCaseSearchInDto.sort = this.caseSearchPageGrid.sort ? JSON.stringify([this.caseSearchPageGrid.sort]) : undefined;
    
    getCaseSearchInDto.caseSearchCondition = this.arrangeCaseSearchCondition();
    
    LoadingUtil.show();

    this.$caseSearchApi.getCaseSearchInfoUsingPOST(getCaseSearchInDto)
    .then((resp:AxiosResponse<GetCaseSearchOutDto>)=>{

      if(resp.data != null){
        if(resp.data.success){
            const p = { ...this.caseSearchPageGrid.pagination };
            p.total = parseInt(resp.data.caseSearchDtoPage.totalElements);
            
            this.caseSearchPageGrid.data = resp.data.caseSearchDtoPage.content;
            this.caseSearchPageGrid.pagination = p;
            if (p.total == 0) {
                //	查無符合篩選條件之資料
                MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
            }

            //確認查詢結果是否超出匯出最大限制筆數
            this.$exportApi.checkExportUsingGET(this.caseSearchPageGrid.pagination.total).then((exportCheck) => {
                if (exportCheck.data.isOverMaxCount) {
                    this.isExportDisable = true;
                }
                this.overMaxRowCountMessage = exportCheck.data.errorMessage;
                LoadingUtil.close();
            }).catch((err) => {
                ErrorModalUtil.modalError(this.$t('error_checkOverExportMaxNum_error').toString()); //確認查詢結果是否超出匯出最大限制筆數失敗
                LoadingUtil.close();
            })

        }else{
          ErrorModalUtil.modalError(this.$t('case_search_search_occur_error').toString()); //案件查詢失敗
          LoadingUtil.close();
        }
      }

    }).catch((error)=>{
      ErrorModalUtil.modalError(this.$t('case_search_search_occur_error').toString()); //案件查詢失敗
      LoadingUtil.close();
    })

  }

  // 匯出
  exportCaseSearchInfo(){

    var exportCaseSearchInDto:ExportCaseSearchInDto = {}
    exportCaseSearchInDto.caseSearchCondition = this.arrangeCaseSearchCondition();

    LoadingUtil.show();
    this.$caseSearchApi.exportCaseSearchInfoUsingPOST(exportCaseSearchInDto, {responseType : 'blob'})
    .then((resp:AxiosResponse<ResponseEntity>)=>{
        this.dealDownLoadData(resp.data, this.$t('case_search_excel_name').toString() + ".xlsx");   // 案件查詢.xlsx
        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
    }).catch((error)=>{
      ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
    }).finally(()=>{
      LoadingUtil.close();
    });

  }
  
  //處理後端回傳的下載內容
  dealDownLoadData(resData, fileName) {
    try {
        let blob;
        if (resData instanceof Blob) {
            blob = resData;
        } else {
            blob = new Blob([resData], { type: resData.type });
        }
        if (!!window.ActiveXObject || "ActiveXObject" in window) {  //IE瀏覽器
            (window.navigator as any).msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
            // navigator.msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕 
        } else {
            var linkElement = document.createElement('a');
            var url = window.URL.createObjectURL(blob);
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", fileName);
            var clickEvent = new MouseEvent("click",
                {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
            linkElement.dispatchEvent(clickEvent);
        }
    } catch (ex) {
        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
    }
  }


  // ===================================== DatePicker 事件 ========================================================

  //===========================應電訪日起訖 相關方法 start ==========================================
  
  //自動轉為字串更新搜尋條件
  onDueContractStartChange(date){
    this.casePageSearchForm.dueContactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.validateSearch(false);
  }
  onDueContractEndChange(date){
    this.casePageSearchForm.dueContactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.validateSearch(false);
  }
  //清除日期
  clearDueContractStartDate(){
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.isDueContactStartVisible = false;
    this.casePageSearchForm.dueContactStartString = "";
    this.casePageSearchForm.dueContactStartDate = null;
  }
  clearDueContractEndDate(){
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.isDueContactEndVisible = false;
    this.casePageSearchForm.dueContactEndString = "";
    this.casePageSearchForm.dueContactEndDate = null;
  }
   /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputDueContractStartDate(data: any) {
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, true, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
        this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    } else {
        this.isDueContactStartVisible = true;
        // 日期錯誤
        this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.casePageSearchForm.dueContactStartDate = parseDate ? parseDate : this.casePageSearchForm.dueContactStartDate;
    this.casePageSearchForm.dueContactStartString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.casePageSearchForm.dueContactStartDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }
  checkManualInputDueContractEndDate(data: any){
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, true, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
        this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    } else {
        this.isDueContactEndVisible = true;
        // 日期錯誤
        this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.casePageSearchForm.dueContactEndDate = parseDate ? parseDate : this.casePageSearchForm.dueContactEndDate;
    this.casePageSearchForm.dueContactEndString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.casePageSearchForm.dueContactEndDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }
  eventMouseOverDueContractStart(){
    if (this.casePageSearchValidateForm.dueContactStartDate.feedback) {
        this.isDueContactStartVisible = true;
    } else {
        this.isDueContactStartVisible = false;
    }
  }
  eventMouseOverDueContractEnd(){
    if (this.casePageSearchValidateForm.dueContactStartDate.feedback) {
        this.isDueContactEndVisible = true;
    } else {
        this.isDueContactEndVisible = false;
    }
  }

  //===========================應電訪日起訖 相關方法 end ==========================================

  //===========================匯入起訖 相關方法 start ==========================================

  // 自動轉為字串更新搜尋條件
  onImportStartChange(date) {
    this.casePageSearchForm.importStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
    this.validateSearch(false);
   }

   onImportEndChange(date){
     this.casePageSearchForm.importEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
     this.isImportDateStartVisible = false;
     this.isImportDateEndVisible = false;
     this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
     this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
     this.validateSearch(false);
   }


  // 清除日期
  clearImportStartDate(){
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
    this.isImportDateStartVisible = false;
    this.casePageSearchForm.importStartString = "";
    this.casePageSearchForm.importStartDate = null;
  }
  clearImportEndDate(){
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
    this.isImportDateEndVisible = false;
    this.casePageSearchForm.importEndString = "";
    this.casePageSearchForm.importEndDate = null;
  }


  /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputImportStartDate(data: any) {
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, true, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
        this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
    } else {
        this.isImportDateStartVisible = true;
        // 日期錯誤
        this.feildValidate(this.casePageSearchValidateForm.importStartDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.casePageSearchForm.importStartDate = parseDate ? parseDate : this.casePageSearchForm.importStartDate;
    this.casePageSearchForm.importStartString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.casePageSearchForm.importStartDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }
  checkManualInputImportEndDate(data: any){
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, true, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
        this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
    } else {
        this.isImportDateEndVisible = true;
        // 日期錯誤
        this.feildValidate(this.casePageSearchValidateForm.importEndDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.casePageSearchForm.importEndDate = parseDate ? parseDate : this.casePageSearchForm.importEndDate;
    this.casePageSearchForm.importEndString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.casePageSearchForm.importEndDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  /**
   * 確保Tooltip在日期正確時確實隱藏
   */
  eventMouseOverImportStart(){
    if (this.casePageSearchValidateForm.importStartDate.feedback) {
        this.isImportDateStartVisible = true;
    } else {
        this.isImportDateStartVisible = false;
    }
  }
  eventMouseOverImportEnd(){
    if (this.casePageSearchValidateForm.importEndDate.feedback) {
        this.isImportDateEndVisible = true;
    } else {
        this.isImportDateEndVisible = false;
    }
  }
  //===========================匯入起訖 相關方法 end ==========================================




  // ===================================== 按鈕 事件 ========================================================
  // 查詢
  searchCasePage() {
    if(this.validateSearch(true)){
      this.isExportDisable = false;
      this.caseSearchPageGrid.data = [];
      this.caseSearchPageGrid.pagination.current = 1;
      // 打 案件查詢 ajax
      this.getCaseSearchInfo();
    }
  }

  // 清除
  resetCasePageSearchForm() {

    this.casePageSearchForm = {
      taskItems: [], //電訪項目
      pherId: "",    //要保人id
      pherName: "",   // 要保人姓名
      dueContactStartDate: null, //應電訪日
      dueContactEndDate: null,    //應電訪日
      dueContactStartString : "",  //應電訪日
      dueContactEndString: "",   //應電訪日
      importStartDate: null,      //匯入日期
      importEndDate: null,        //匯入日期
      importStartString: "",      //匯入日期
      importEndString: "",        //匯入日期
      policyNo01: "",   //保單號碼
      policyNo02: "",   //保單號碼
      policyNo03: "",   //保單號碼
      packNo: "",       //名單序號
      insuredId: "",    //被保人id
      insuredName: "",  //被保人姓名
      departmentIdList: [this.defaultDepId], //部門
      divisionIdList: [],   //科別
      changeNo: "",   //受理案號
      custId: "",   //受訪者id
      custName: "", //受訪者姓名
      agentId: "",  //業務員id
      agentName: "",  //業務員姓名
      tmrIdList:[], //電訪員
    };

    this.caseSearchPageGrid.data = [];
    this.caseSearchPageGrid.pagination.total = 0;
    // this.depDisable = false; //目前不需要 2022/06/07
    // this.divDisable = false; //目前不需要 2022/06/07
    this.clearValidateStatus();
    this.onSelectDept();
    this.onSeletDivi();
  }

  clearValidateStatus(){
    this.feildValidate(this.casePageSearchValidateForm.pherId, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.pherName, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.policyNo01, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.policyNo03, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.packNo, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.insuredId, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.insuredName, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.changeNo, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.custId, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.custName, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.agentId, false, "", "", "");
    this.feildValidate(this.casePageSearchValidateForm.agentName, false, "", "", "");
  }

  // 匯出
  exportSearchResult() {
    if (!this.isExportDisable) {
        if (this.caseSearchPageGrid.data.length == 0) {
            ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出
        } else {
            // 打匯出 ajax
            if(this.validateSearch(true)){
              this.exportCaseSearchInfo();
            }else{
              ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
            }
        }
    } else {
        if (ValidationUtil.isEmpty(this.overMaxRowCountMessage)) {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        } else {
            //匯出筆數超過最大限制
            ErrorModalUtil.modalError(this.overMaxRowCountMessage);
        }
    }
  }

  // ===================================== Grid 事件 ========================================================
 
  // 換頁
  onPageChange(e: FblPageEvent) {
    if (this.caseSearchPageGrid.data.length > 0) {
        this.caseSearchPageGrid.sort = e.sort;
        this.caseSearchPageGrid.pagination = e.pagination;
        this.getCaseSearchInfo();
    }
  }

  handleEllipsisClick($event, data) {
    message.destroy();
        message.config({
            duration: 0,
            top: `50px`
        });
        
        //摺疊字串，依照自訂字數摺疊
        var wordWrap:string = this.wordWrap(data,20);
        var arrWordWrap:Array<string> = wordWrap.split("\n");
       
        // 整理 message open 需要參數
        var arrVnode:Array<VNode> = [];
        arrWordWrap.forEach((wordStr)=>{
            arrVnode.push(this.$createElement("div", {attrs:{align:"left"}}, wordStr));
        });
        var wordWrapMessage:VNode = this.$createElement("div", arrVnode);
        var messageOptions:MessageOptions = {content:wordWrapMessage};
        message.open(messageOptions);

        //取得message 的html元件
        let antDesignMessage = document.getElementsByClassName('ant-message');
        //變更messae顯示位置
        MessageUtil.changePosition(antDesignMessage, $event.x, $event.y);
  }
  /**
   * @description 摺疊字串，依照自訂字數摺疊
   * @param str 總字串
   * @param maxWidth 欲摺疊字數
   * @returns 
   */
   wordWrap(str, maxWidth) {
    var newLineStr = "\n"; 
    var res = '';

    var testWhite = (x) => {
        var white = new RegExp(/^\s$/);
        return white.test(x.charAt(0));
    }

    while (str.length > maxWidth) {                 
        var found = false;
        // Inserts new line at first whitespace of the line
        for (var i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }
        
    }
    
    return res + str;
  }

  // 滑鼠離開 message 顯示消失
  handleEllipsisMouseLeave() {
    message.destroy();
  }

  // 點擊受訪者id超連結打開視窗
  clickLinkCustId(data:CaseSearchDto){
    this.caseHistoryParam.custId = data.custId;
    this.caseSearchPageGridModal.isShowCaseHistory = true;
  }

  // 點擊保單號碼超連結打開視窗
  clickLinkCasePolicy(data:CaseSearchDto){
    this.caseHistoryParam.casePolicy = data.casePolicy;
    this.caseSearchPageGridModal.isShowCaseHistory = true;
  }

  // 點擊 撥號歷程 超連結打開視窗
  clickLinkHaveCallUpHis(data:CaseSearchDto){
    this.callUpHistoryParam.caseNo = data.caseNo;
    this.caseSearchPageGridModal.isCallUpHistoryVisible = true;
  }
  // 點擊 照會內容 超連結打開視窗
  clickLinkHaveNoti(data:CaseSearchDto){
    this.caseSearchPageGridModal.notiReocrdvisible=true;
    this.handleInfoData = {
      CASE_LOG_GUID: '',
      CASE_NO: data.caseNo,
      TICKET_ID: '',
      TICKET_TYPE: 'OBD_NOTI_INFO',
      TICKET_TYPE_DESC: '',
    }
  }

  getNotuReocrdvisible(val: boolean){
    this.caseSearchPageGridModal.notiReocrdvisible=val;
  }

  // 點擊 會辦內容 超連結打開視窗
  clickLinkHaveInfInfo(data:CaseSearchDto){
   
    // this.caseHistoryParam.caseNo = data.caseNo;
    // console.log(this.caseHistoryParam.caseNo)
    this.caseSearchPageGridModal.infReocrdvisible=true;
    this.handleInfoData = {
      CASE_LOG_GUID: '',
      CASE_NO: data.caseNo,
      TICKET_ID: '',
      TICKET_TYPE: 'OBD_INFO',
      TICKET_TYPE_DESC: '',
    }
  }

  getInfReocrdvisible(val: boolean){
    this.caseSearchPageGridModal.infReocrdvisible=val;
  }

  // 點擊 郵寄紀錄 超連結打開視窗
  clickLinkHaveSendPack(data:CaseSearchDto){
    // TODO
    this.postRecordParam.caseNo = data.caseNo;
    this.caseSearchPageGridModal.isPostRecordVisible = true;
  }
  // 點擊 Email紀錄 超連結打開視窗
  clickLinkHaveSendEmail(data:CaseSearchDto){
    this.mailHistoryParam.caseNo=data.caseNo;
    this.caseSearchPageGridModal.onMailRecordVisible = true;
  }
  // 點擊 M+/簡訊 超連結打開視窗
  clickLinkHaveSendMsg(data:CaseSearchDto){
    this.mailHistoryParam.caseNo=data.caseNo;
    this. caseSearchPageGridModal.infMplusSendMessageVisible=true;
  }
  // 點擊 檔案上傳 超連結打開視窗
  clickLinkFileUp(data: CaseSearchDto){
    this.caseNo = data.caseNo;
    this.showUploadFileHistory = true;
  }
  // 點擊 保戶回答 超連結打開視窗
  clickLinkHaveCustAns(data:CaseSearchDto){
    this.questionAnswerParam.CASE_NO = data.caseNo;
    this.caseSearchPageGridModal.isQuestionAnswerVisible = true;
  }

  

// ===================================== 驗證 ========================================================

  validateSearch(isRealSearch) {
    let validate = true;
    let validateImportDate = true;
    let validateDueContactDate = true;
    this.validateImportStartDate(null, this.casePageSearchForm.importStartString, () => {
        if (this.casePageSearchValidateForm.importEndDate.state == 'error') {
            validateImportDate = false;
            validate = false;
        }
    });
    this.validateImportEndDate(null, this.casePageSearchForm.importEndString, () => {
        if (this.casePageSearchValidateForm.importEndDate.state == 'error') {
            validateImportDate = false;
            validate = false;
        }
    });
    this.validateDueContactStartDate(null, this.casePageSearchForm.dueContactStartString, () => {
        if (this.casePageSearchValidateForm.dueContactStartDate.state == 'error') {
            validateDueContactDate = false;
            validate = false;
        }
    });
    this.validateDueContactEndDate(null, this.casePageSearchForm.dueContactEndString, () => {
          if (this.casePageSearchValidateForm.dueContactEndDate.state == 'error') {
              validateDueContactDate = false;
              validate = false;
          }
      });
      this.validatePolicyNo(null, null, () => {
        if (this.casePageSearchValidateForm.policyNo01.state == 'error') {
            validate = false;
        }
    });

    this.validatePolicyNo02(null, null, () => {
        if (this.casePageSearchValidateForm.policyNo02.state == 'error') {
            validate = false;
        }
    });

    this.validatePolicyNo03(null, null, () => {
        if (this.casePageSearchValidateForm.policyNo03.state == 'error') {
            validate = false;
        }
    });
    this.validatePackNo(null, this.casePageSearchForm.packNo, () => {
        if (this.casePageSearchValidateForm.packNo.state == 'error') {
            validate = false;
        }
    });
    this.validateChangeNo(null, this.casePageSearchForm.changeNo, () => {
        if (this.casePageSearchValidateForm.changeNo.state == 'error') {
            validate = false;
        }
    });
    this.validateCustId(null, this.casePageSearchForm.custId, () => {
        if (this.casePageSearchValidateForm.custId.state == 'error') {
            validate = false;
        }
    });
    this.validateCustName(null, this.casePageSearchForm.custName, () => {
        if (this.casePageSearchValidateForm.custName.state == 'error') {
            validate = false;
        }
    });
    this.validatePherId(null, this.casePageSearchForm.pherId, () => {
        if (this.casePageSearchValidateForm.pherId.state == 'error') {
            validate = false;
        }
    });

    this.validatePherName(null, this.casePageSearchForm.pherName, () => {
        if (this.casePageSearchValidateForm.pherName.state == 'error') {
            validate = false;
        }
    });
    this.validateInsuredId(null, this.casePageSearchForm.insuredId, () => {
        if (this.casePageSearchValidateForm.insuredId.state == 'error') {
            validate = false;
        }
    });
    this.validateInsuredName(null, this.casePageSearchForm.insuredName, () => {
        if (this.casePageSearchValidateForm.insuredName.state == 'error') {
            validate = false;
        }
    });
    this.validateAgentId(null, this.casePageSearchForm.agentId, () => {
        if (this.casePageSearchValidateForm.agentId.state == 'error') {
            validate = false;
        }
    });
    this.validateAgentName(null, this.casePageSearchForm.agentName, () => {
        if (this.casePageSearchValidateForm.agentName.state == 'error') {
            validate = false;
        }
    });

    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validateImportDate && !ValidationUtil.isEmpty(this.casePageSearchForm.importStartString) && !ValidationUtil.isEmpty(this.casePageSearchForm.importEndString)) {
      this.validateImportStartAndEndDate(null, this.casePageSearchForm.importStartDate, this.casePageSearchForm.importEndDate, this.casePageSearchForm.importStartString,
      this.casePageSearchForm.importEndString, this.isImportDateStartVisible, this.isImportDateEndVisible, () => {
          if (this.casePageSearchValidateForm.importStartDate.state == 'error' || this.casePageSearchValidateForm.importEndDate.state == 'error') {
              validate = false;
          }
      });
    }
    if (validateDueContactDate && !ValidationUtil.isEmpty(this.casePageSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.casePageSearchForm.dueContactEndString)) {
      this.validateDueContactStartAndEndDate(null, this.casePageSearchForm.dueContactStartDate, this.casePageSearchForm.dueContactEndDate, this.casePageSearchForm.dueContactStartString,
          this.casePageSearchForm.dueContactEndString, this.isDueContactStartVisible, this.isDueContactEndVisible, () => {
              if (this.casePageSearchValidateForm.dueContactStartDate.state == 'error' || this.casePageSearchValidateForm.dueContactEndDate.state == 'error') {
                  validate = false;
              }
          });
    }

    if (validate && isRealSearch) {
      //檢核查詢條件數量(少於2個不可執行查詢)
      let countResult = this.checkFilterCount();
      validate = countResult;
      if (!countResult) {
          ErrorModalUtil.modalError(this.$t('case_search_filterCountError').toString()); //查詢條件至少輸入二項
      }
    }
    return validate;

  }

  validatePherId(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.pherId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.casePageSearchValidateForm.pherId, false, "", "", "");
            callback();
        } else {
            //要保人ID 僅可輸入英文與數字
            this.feildValidate(this.casePageSearchValidateForm.pherId, true, "error", "hover", this.$t('case_search_valid_pherId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validatePherName(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.pherName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.casePageSearchValidateForm.pherName, false, "", "", "");
            callback();
        } else {
            //要保人姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.casePageSearchValidateForm.pherName, true, "error", "hover", this.$t('case_search_valid_pherName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateDueContactStartDate(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
            callback();
        } else {
            this.isDueContactStartVisible = true;
            this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateDueContactEndDate(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
            callback();
        } else {
            this.isDueContactEndVisible = true;
            this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateImportStartDate(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
            callback();
        } else {
            this.isImportDateStartVisible = true;
            this.feildValidate(this.casePageSearchValidateForm.importStartDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateImportEndDate(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
            callback();
        } else {
            this.isImportDateEndVisible = true;
            this.feildValidate(this.casePageSearchValidateForm.importEndDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validatePolicyNo(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.policyNo01, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo01)) {

        if(ValidationUtil.isAnyChinese(this.casePageSearchForm.policyNo01)){
          // 保單號碼 不可輸入中文
          this.feildValidate(this.casePageSearchValidateForm.policyNo01, true, "error", "hover", this.$t('case_search_valid_policyNo_noChinese').toString());
          this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "success", "", "");
          this.feildValidate(this.casePageSearchValidateForm.policyNo03, false, "success", "", "");
          callback(() => { });
        }else{
          this.feildValidate(this.casePageSearchValidateForm.policyNo01, false, "success", "", "");
          if (!ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo01)) {
            if (ValidationUtil.isEmpty(this.casePageSearchForm.policyNo02)) {
                // 保單序號 必填
                this.feildValidate(this.casePageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_required').toString());
            } else if (!ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo02)) {
                // 保單序號 僅可輸入數字
                this.feildValidate(this.casePageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
            } else {
                this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "success", "", "");
            }
          } else {
              // 保單序號 僅可輸入數字
              if (!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo02)) {
                  this.feildValidate(this.casePageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
              } else {
                  this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "success", "", "");
              }
          }
        }
       
    } else {
        // 保單序號 僅可輸入數字
        if (!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo02)) {
            this.feildValidate(this.casePageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
        } else {
            this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "success", "", "");
        }
    }
    callback();
  }
  validatePolicyNo02(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo02)) {
        if (!ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo02)) {
            // 保單序號 僅可輸入數字
            this.feildValidate(this.casePageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
            callback(() => { });
        }
    } else {
        if (!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo01)) {
            if (!ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo01)) {
                // 保單序號 必填
                this.feildValidate(this.casePageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_required').toString());
                callback(() => { });
            } else {
                this.feildValidate(this.casePageSearchValidateForm.policyNo02, false, "success", "", "");
            }
        }
    }
    callback();
  }
  validatePolicyNo03(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.policyNo03, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.casePageSearchForm.policyNo03)) {
        if (!ValidationUtil.numberOnlyValidation(this.casePageSearchForm.policyNo03)) {
            // 保單重複碼 僅可輸入數字
            this.feildValidate(this.casePageSearchValidateForm.policyNo03, true, "error", "hover", this.$t('case_search_valid_policyNoDup_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validatePackNo(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.packNo, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.casePageSearchValidateForm.packNo, false, "", "", "");
            callback();
        } else {
            //名單序號 僅可輸入數字
            this.feildValidate(this.casePageSearchValidateForm.packNo, true, "error", "hover", this.$t('case_search_valid_packNo_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateInsuredId(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.insuredId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.casePageSearchValidateForm.insuredId, false, "", "", "");
            callback();
        } else {
            //被保險人ID 僅可輸入英數字
            this.feildValidate(this.casePageSearchValidateForm.insuredId, true, "error", "hover", this.$t('case_search_valid_insuredId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateInsuredName(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.insuredName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.casePageSearchValidateForm.insuredName, false, "", "", "");
            callback();
        } else {
            //被保險人姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.casePageSearchValidateForm.insuredName, true, "error", "hover", this.$t('case_search_valid_insuredName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateChangeNo(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.changeNo, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.casePageSearchValidateForm.changeNo, false, "success", "", "");
            callback();
        } else {
            //受理案號 僅可輸入英文與數字
            this.feildValidate(this.casePageSearchValidateForm.changeNo, true, "error", "hover", this.$t('case_search_valid_changeNo_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateCustId(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.custId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.casePageSearchValidateForm.custId, false, "", "", "");
            callback();
        } else {
            //受訪者ID 僅可輸入英文與數字
            this.feildValidate(this.casePageSearchValidateForm.custId, true, "error", "hover", this.$t('case_search_valid_custId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateCustName(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.custName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.casePageSearchValidateForm.custName, false, "", "", "");
            callback();
        } else {
            //受訪者姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.casePageSearchValidateForm.custName, true, "error", "hover", this.$t('case_search_valid_custName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateAgentId(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.agentId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.casePageSearchValidateForm.agentId, false, "success", "", "");
            callback();
        } else {
            //業務員ID 僅可輸入英文與數字
            this.feildValidate(this.casePageSearchValidateForm.agentId, true, "error", "hover", this.$t('case_search_valid_agentId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateAgentName(rule, value, callback){
    this.feildValidate(this.casePageSearchValidateForm.agentName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.casePageSearchValidateForm.agentName, false, "success", "", "");
            callback();
        } else {
            //業務員姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.casePageSearchValidateForm.agentName, true, "error", "hover", this.$t('case_search_valid_agentName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }

  /**
    * 起訖日期驗證
    * @param rule 驗證規則 
    * @param startTime 起始日期
    * @param endTime 結束日期 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
   validateImportStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
      this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
      this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
      if (startString == endString || moment(startDate).isBefore(endDate)) {
          dateDisableStart = false;
          dateDisableEnd = false;
          this.feildValidate(this.casePageSearchValidateForm.importStartDate, false, "success", "", "");
          this.feildValidate(this.casePageSearchValidateForm.importEndDate, false, "success", "", "");
          callback();

      } else {
          dateDisableStart = true;
          dateDisableEnd = true;
          if (!ValidationUtil.isEmpty(this.casePageSearchForm.importStartString) && !ValidationUtil.isEmpty(this.casePageSearchForm.importEndString)) {
              this.feildValidate(this.casePageSearchValidateForm.importStartDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
              this.feildValidate(this.casePageSearchValidateForm.importEndDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
          }
          callback(() => { });
      }
      callback();
    }
    
  /**
    * 起訖日期驗證
    * @param rule 驗證規則 
    * @param startTime 起始日期
    * @param endTime 結束日期 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
 validateDueContactStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
    this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    if (startString == endString || moment(startDate).isBefore(endDate)) {
        dateDisableStart = false;
        dateDisableEnd = false;
        this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, false, "success", "", "");
        this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, false, "success", "", "");
        callback();

    } else {
        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.casePageSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.casePageSearchForm.dueContactEndString)) {
            this.feildValidate(this.casePageSearchValidateForm.dueContactStartDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
            this.feildValidate(this.casePageSearchValidateForm.dueContactEndDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        }
        callback(() => { });
    }
    callback();
  }

   //檢核查詢條件數量(少於1個不可執行查詢)
   checkFilterCount() {
    let isAbleToSearch = false;
    let filterColumn = [];

    Object.keys(this.casePageSearchForm).forEach((key=>{
      if(key != "dueContactStartDate" && key != "dueContactEndDate" && key != "importStartDate" && key != "importEndDate"){
        if(!ValidationUtil.isEmpty(this.casePageSearchForm[key])){
          filterColumn.push(key);
        }
      }
    }));

     //若有填寫保單號碼或受理案號 即可直接查詢
     if(filterColumn.some((c)=>c == 'policyNo01' || c == 'changeNo' )){
          isAbleToSearch = true;
      }

      //計算有效查詢欄位數量
      if(!isAbleToSearch){
          let count = 0;
          if(filterColumn.some((c)=> c == "policyNo01" || c == "policyNo02" || c =="policyNo03")){
              count ++;
              filterColumn = filterColumn.filter((c)=> c != "policyNo01" && c != "policyNo02" && c !="policyNo03" );
          }
          if(filterColumn.some((c)=> c == "importStartString" || c == "importEndString")){
              count ++;
              filterColumn = filterColumn.filter((c)=> c != "importStartString" && c != "importEndString");
          }
          if(filterColumn.some((c)=> c == "dueContactStartString" || c == "dueContactEndString" )){
              count ++;
              filterColumn = filterColumn.filter((c)=> c != "dueContactStartString" && c != "dueContactEndString" );
          }

          count = count + filterColumn.length;

          if(count >=2){
              isAbleToSearch = true;
          }
      }

    return isAbleToSearch;
   }

  //驗證共用物件
  feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.msg = msg == null ? fv.msg : msg;
  }
  
  
  /**
   * @description 下拉式清單搜尋用(依input過濾顯示符合的清單)
   */
   filterOption(input, option) {

    if(!ValidationUtil.isEmpty(option.componentOptions.children[0]) && !ValidationUtil.isEmpty(option.componentOptions.propsData.value)){
        return (
                    option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >=0
                );
    }
    
  }

  // ===================================== Modal ========================================================

  onCloseModal(modalName) {
    this.caseSearchPageGridModal[modalName] = false;
    if(modalName == "isShowCaseHistory"){
      this.caseHistoryParam = {};
    } else if (modalName == 'isQuestionAnswerVisible') {
      this.questionAnswerParam.CASE_NO = '';
    }
  }

}