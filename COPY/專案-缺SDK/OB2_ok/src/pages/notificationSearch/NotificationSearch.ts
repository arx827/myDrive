import { Vue, Component, Watch } from "vue-property-decorator";
import {
  FblActionEvent,
  FblColumnType,
  FblPageEvent,
  FblPDataGridHolder,
  FblRow,
} from "@/components/shared/data-grid/models";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import MomentUtil from "@/assets/config/MomentUtil";
import { PageOfNotiSearchGridDto, Option, NotiSearchGridDto, NotiSearchInitDto } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import LoadingUtil from "@/assets/config/LoadingUtil";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import { notiSearchValidateForm, NotificationProcess, CloseStatus } from "./model";
import "@/assets/less/infPage.less";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { message } from "ant-design-vue";
import NotificationModal from "@/components/shared/notificationMadal/NotificationModal.vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { AxiosResponse } from "axios";
import { NotiStep } from "@/pages/onDuty/model";
import { HandleStatus } from "@/components/shared/notificationMadal/model";

@Component({
  components: {
    FblDataGrid,
    HiddenFolde,
    // CuntersignatureModal,
    NotificationModal,
  }
})
export default class NotificationSearch extends Vue {

  //查詢條件
  notiSearchForm = {
    policyNo01: "",
    policyNo02: "",
    policyNo03: "",
    departmentIdList: [], //部門
    divisionIdList: [], //科別
    tmrIdList: [], //電訪員
    sendStartDate: null, //發送日期
    sendEndDate: null,
    sendStartString: "",
    sendEndString: "",
    expiryStartDate: null, //照會到期日期
    expiryEndDate: null,
    expiryStartString: "",
    expiryEndString: "",
    custId: '', //受訪者ID
    handleStatus: [], //處理狀態
    custName: '', //受訪者姓名
    notiInfoId: '', //作業單號
    sendStatus:[], //發送狀態
    caseClosedStatus: [],  // 結案狀態
    replyStartDate: null,      // 回覆日期(起)
    replyStartDateString: '',
    replyEndDate: null,        // 回覆日期(訖)
    replyEndDateString: ''
  };

  // 選取的照會單資訊
  selectNotiData: NotiSearchGridDto = {};

  // 主表搜尋條件過濾
  infFilter: FblFilters = {
    filters: []
  };

  //是否包含代理人
  isIncludeAgent: boolean = false;

  //查詢表單驗證規則
  notiSearchRule: { [key: string]: ValidationRule[] } = {
    policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
    policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
    policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
    custId: [{ validator: this.validateCustId, trigger: "blur" }],
    sendStart: [{ validator: this.validateSendStart, trigger: "blur" }],
    sendEnd: [{ validator: this.validateSendEnd, trigger: "blur" }],
    expiryStart: [{ validator: this.validateExpiryStart, trigger: "blur" }],
    expiryEnd: [{ validator: this.validateExpiryEnd, trigger: "blur" }],
    replyDateStart: [{ validator: this.validateReplyStart, trigger: "blur" }],
    replyDateEnd: [{ validator: this.validateReplyEnd, trigger: "blur" }]
  };

  //欄位驗證提示工具
  notiSearchValidateForm :notiSearchValidateForm = {
    sendStart: { feedback: false, hoverVisible: false },
    sendEnd: { feedback: false, hoverVisible: false },
    expiryStart: { feedback: false, hoverVisible: false },
    expiryEnd: { feedback: false, hoverVisible: false },
    policyNo01: { feedback: false, hoverVisible: false },
    policyNo02: { feedback: false, hoverVisible: false },
    policyNo03: { feedback: false, hoverVisible: false },
    custId: { feedback: false, hoverVisible: false },
    replyDateStart: { feedback: false, hoverVisible: false },
    replyDateEnd: { feedback: false, hoverVisible: false }
  }

  //DatePicker民國年的格式
  formatter = this.$twDateFormatter;
  formatterDateTime = this.$twDateTimeFormatter;
  //vue2 時間選擇器標題格式
  timeTitleFormat: string = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date()));

  //日期選擇器hover是否顯示
  isExpiryStartVisible: boolean = false;
  isExpiryEndVisible: boolean = false;
  isSendStartVisible: boolean = false;
  isSendEndVisible: boolean = false;

  //部門科別預設值
  departmentDefaultId: string;
  divdefaultId: string;

  //照會表單是否顯示
  // isCountersignatureFormVisible: boolean = false;
  isNotificationFormVisible: boolean = false;

  //照會資料
  notiOpenData = {
    title: '',
    caseNo: '',
    notiStep: NotiStep.reply,
    notiInfoId: '',
    packNo: '',
    caseLogId: '',
    packLogId: '',
    reOpen: false
  };

  // 照會查詢流程
  notiProcess = NotificationProcess;
  entryPoint: string = this.$route.name;

  // ===================================== Grid ========================================================
  grid: FblPDataGridHolder<NotiSearchGridDto> = {
    rowKey: "notiInfoId",
    data: [],
    pagination: {
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      current: 1,
      pageSize: 15,
      total: 0,
      locale: { items_per_page: "" }
    },
    scroll: { x: 500, y: 430 },
    columns: [
      {
        // 作業單號碼
        type: FblColumnType.TEMPLATE,
        property: "notiInfoId",
        title: this.$t('infPage_infInfoIdNo').toString(),
        template: "notiInfoIdTemplate",
        fixed: 'left',
        width: 160,
        align: 'center'
      },
      {
        // 案件階段
        type: FblColumnType.PLAIN,
        property: "caseStageName",
        title: this.$t('infPage_caseStage').toString(),
        fixed: 'left',
        width: 80,
        align: 'center'
      },
      {
        // 案件狀態
        type: FblColumnType.PLAIN,
        property: "caseStatusName",
        title: this.$t('infPage_caseStatus').toString(),
        fixed: 'left',
        width: 80,
        align: 'center'
      },
      {
        // 保單號碼
        type: FblColumnType.PLAIN,
        property: "casePolicy",
        title: this.$t('infPage_policyNo').toString(),
        fixed: 'left',
        width: 130,
        align: 'center'
      },
      {
        // 受訪者身分
        type: FblColumnType.PLAIN,
        property: "custTypeName",
        title: this.$t('infPage_custType').toString(),
        width: 100,
        align: 'center'
      },
      {
        // 受訪者ID
        type: FblColumnType.PLAIN,
        property: "custId",
        title: this.$t('infPage_custId').toString(),
        width: 120,
        align: 'center'
      },
      {
        // 受訪者姓名
        type: FblColumnType.ELLIPSIS,
        property: "custName",
        title: this.$t('infPage_custName').toString(),
        width: this.countColumnWidth(6),
        align: 'center'
      },
      {
        // 照會日期
        type: FblColumnType.PLAIN,
        property: "sendDate",
        title: this.$t('notification_notiDate').toString(),
        width: 100,
        align: 'center',
        formatter(data : NotiSearchGridDto) {
          if(data.sendDate){
            return MomentUtil.transformRocYearMonthDay(data.sendDate);
          } else {
            return "";
          }
        }
      },
      {
        // 照會到期日期
        type: FblColumnType.PLAIN,
        property: "expireDate",
        title: this.$t('notification_expireDate').toString(),
        width: 120,
        align: 'center',
        formatter(data : NotiSearchGridDto) {
          if(data.expireDate){
            return MomentUtil.transformRocYearMonthDay(data.expireDate);
          } else {
            return "";
          }
        }
      },
      {
        // 照會回覆日期
        type: FblColumnType.PLAIN,
        property: "replyDate",
        title: this.$t('notification_replyDate').toString(),
        width: 120,
        align: 'center',
        formatter(data : NotiSearchGridDto) {
          if(data.replyDate){
            return MomentUtil.transformRocYearMonthDay(data.replyDate);
          } else {
            return "";
          }
        }
      },
      {
        // 會辦催辦日期
        type: FblColumnType.PLAIN,
        property: "reminderDate",
        title: this.$t('notification_reminderDate').toString(),
        width: 120,
        hidden: this.entryPoint == NotificationProcess.notiReply,  // 照會回覆查詢不需顯示
        align: 'center',
        formatter(data : NotiSearchGridDto) {
          if(data.reminderDate){
            return MomentUtil.transformRocYearMonthDay(data.reminderDate);
          } else {
            return "";
          }
        }
      },
      {
        // 逾期天數
        type: FblColumnType.PLAIN,
        property: "overDateCount",
        title: this.$t('infPage_overDayCount').toString(),
        width: 80,
        hidden: this.entryPoint == NotificationProcess.notiReply,  // 照會回覆查詢不需顯示
        align: 'center'
      },
      {
        // 科別
        type: FblColumnType.PLAIN,
        property: "division",
        title: this.$t('global_division').toString(),
        width: 140,
        align: 'center'
      },
      {
        // 電訪員
        type: FblColumnType.PLAIN,
        property: "tmrName",
        title: this.$t('global_telemarketer').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 自動催辦次數
        type: FblColumnType.PLAIN,
        property: "reminderCount",
        title: this.$t('infPage_reminderCount').toString(),
        width: 120,
        align: 'center'
      },
      {
        // 覆核狀態
        type: FblColumnType.PLAIN,
        property: "reviewStatusName",
        title: this.$t('infPage_reviewStatus').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 結案狀態
        type: FblColumnType.PLAIN,
        property: "caseClosedStatusName",
        title: this.$t('infPage_caseCloseStatus').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 處理狀態
        type: FblColumnType.PLAIN,
        property: "handleStatusName",
        title: this.$t('infPage_handleStatus').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 發送狀態
        type: FblColumnType.PLAIN,
        property: "sendOmsStatusName",
        title: this.$t('infPage_sendStatus').toString(),
        width: 80,
        align: 'center'
      }
    ]
  };

  // 計算欄位寬度要顯示幾個字(全形中文)
  countColumnWidth(number) {
    return (Number(number + 1)) * 16 + 16;
  }

  // ===================================== 下拉式選單 ========================================================
  // 部門
  selectDepOptions: Option[] = [];
  // 科別
  selectDiviOptions: Option[] = [];
  // 電訪員
  selectTmrOptions: Option[] = [];
  //使用者清單
  allUserList: Option[] = [];
  //使用者清單
  allDivList: Option[] = [];
  // 處理狀態
  handleStatusOptions: Option[] = [];
  // 發送狀態
  sendStatusOptions: Option[] = [];
  // 結案狀態
  caseClosedStatusOptions: Option[] = [];

  depUnitInfo = {};
  depUserInfo = {};
  unitUserInfo = {};

  // ===================================== 發送日期 DatePicker 事件 ========================================================
  
  //開始日期變動
  onSendStartChange(date){
    this.notiSearchForm.sendStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    this.sendDateVaildate();
  }

  //結束日期變動
  onSendEndChange(date){
    this.notiSearchForm.sendEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    this.sendDateVaildate();
  }

  //滑鼠移入
  eventMouseOverSendStart(){
    if (this.notiSearchValidateForm.sendStart.feedback) {
      this.isSendStartVisible = true;
    } else {
        this.isSendStartVisible = false;
    }
  }

  //滑鼠移入
  eventMouseOverSendEnd(){
    if (this.notiSearchValidateForm.sendEnd.feedback) {
      this.isSendEndVisible = true;
    } else {
        this.isSendEndVisible = false;
    }
  }

  //開始日期清除
  clearSendStartDate() {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    this.isSendStartVisible = false;
    this.notiSearchForm.sendStartString = "";
    this.notiSearchForm.sendStartDate = null;
    this.sendDateVaildate();
  }

  //結束日期清除
  clearSendEndDate() {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    this.isSendEndVisible = false;
    this.notiSearchForm.sendEndString = "";
    this.notiSearchForm.sendEndDate = null;
    this.sendDateVaildate();
  }

  //手動輸入起始日期
  checkManualInputSendStartDate(data: any) {
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (!parseDate) {
      this.isSendStartVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, true, this.$t('global_dateError').toString(), false);
    }
    this.notiSearchForm.sendStartDate = parseDate ? parseDate : this.notiSearchForm.sendStartDate;
    this.notiSearchForm.sendStartString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiSearchForm.sendStartDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //手動輸入結束日期
  checkManualInputSendEndDate(data: any) {
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (!parseDate) {
      this.isSendEndVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, true, this.$t('global_dateError').toString(), false);
    }
    this.notiSearchForm.sendEndDate = parseDate ? parseDate : this.notiSearchForm.sendEndDate;
    this.notiSearchForm.sendEndString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiSearchForm.sendEndDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  

  // ===================================== 發送日期 DatePicker 事件 ========================================================

  // ===================================== 照會到期日期 DatePicker 事件 ========================================================

  //起始日期變動
  onExpiryStartChange(date){
    this.notiSearchForm.expiryStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    this.expiryDateVaildate();
  }

  //結束日期變動
  onExpiryEndChange(date){
    this.notiSearchForm.expiryEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    this.expiryDateVaildate();
  }

  //滑鼠移入
  eventMouseOverExpiryStart(){
    if (this.notiSearchValidateForm.expiryStart.feedback) {
      this.isExpiryStartVisible = true;
    } else {
        this.isExpiryStartVisible = false;
    }
  }

  //滑鼠移入
  eventMouseOverExpiryEnd(){
    if (this.notiSearchValidateForm.expiryEnd.feedback) {
      this.isExpiryEndVisible = true;
    } else {
        this.isExpiryEndVisible = false;
    }
  }

  //起始日期清除
  clearExpiryStartDate() {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    this.isExpiryStartVisible = false;
    this.notiSearchForm.expiryStartString = "";
    this.notiSearchForm.expiryStartDate = null;
    this.expiryDateVaildate();
  }

  //結束日期清除
  clearExpiryEndDate() {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    this.isExpiryEndVisible = false;
    this.notiSearchForm.expiryEndString = "";
    this.notiSearchForm.expiryEndDate = null;
    this.expiryDateVaildate();
  }

  //手動輸入起始日期
  checkManualInputExpiryStartDate(data: any) {
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (!parseDate) {
      this.isExpiryStartVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, true, this.$t('global_dateError').toString(), false);
    }
    this.notiSearchForm.expiryStartDate = parseDate ? parseDate : this.notiSearchForm.expiryStartDate;
    this.notiSearchForm.expiryStartString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiSearchForm.expiryStartDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //手動輸入結束日期
  checkManualInputExpiryEndDate(data: any) {
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (!parseDate) {
      this.isExpiryEndVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, true, this.$t('global_dateError').toString(), false);
    }
    this.notiSearchForm.expiryEndDate = parseDate ? parseDate : this.notiSearchForm.expiryEndDate;
    this.notiSearchForm.expiryEndString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiSearchForm.expiryEndDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  // ===================================== 照會到期日期 DatePicker 事件 ========================================================

  // ===================================== 照會回覆日期 DatePicker 事件 ========================================================

  //起始日期變動
  onReplyStartChange(date){
    this.notiSearchForm.replyStartDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    this.replyDateVaildate();
  }

  //結束日期變動
  onReplyEndChange(date){
    this.notiSearchForm.replyEndDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    this.replyDateVaildate();
  }

  //起始日期清除
  clearReplyStartDate() {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    this.notiSearchForm.replyStartDateString = "";
    this.notiSearchForm.replyStartDate = null;
    this.expiryDateVaildate();
  }

  //結束日期清除
  clearReplyEndDate() {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    this.notiSearchForm.replyEndDateString = "";
    this.notiSearchForm.replyEndDate = null;
    this.expiryDateVaildate();
  }

  //手動輸入起始日期
  checkManualInputReplyStartDate(data: any) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (!parseDate) {
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, true, this.$t('global_dateError').toString(), false);
    }
    this.notiSearchForm.replyStartDate = parseDate ? parseDate : this.notiSearchForm.replyStartDate;
    this.notiSearchForm.replyStartDateString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiSearchForm.replyStartDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //手動輸入結束日期
  checkManualInputReplyEndDate(data: any) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (!parseDate) {
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, true, this.$t('global_dateError').toString(), false);
    }
    this.notiSearchForm.replyEndDate = parseDate ? parseDate : this.notiSearchForm.replyEndDate;
    this.notiSearchForm.replyEndDateString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiSearchForm.replyEndDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  // ===================================== 照會回覆日期 DatePicker 事件 ========================================================

  // ===================================== 事件 ========================================================

  // 重整頁面
  reload(){
    LoadingUtil.show();

    this.$notificationApi.paginateNotiSearchUsingPOST({
      page : this.grid.pagination.current-1,
      size : this.grid.pagination.pageSize,
      custId : this.notiSearchForm.custId.toUpperCase(),
      custName : this.notiSearchForm.custName,
      policyNo : this.notiSearchForm.policyNo01.toUpperCase(),
      policySeq : this.notiSearchForm.policyNo02,
      idDup : this.notiSearchForm.policyNo03,
      exprieEndDate : this.notiSearchForm.expiryEndDate,
      exprieStartDate : this.notiSearchForm.expiryStartDate,
      sendStartDate : this.notiSearchForm.sendStartDate,
      sendEndDate : this.notiSearchForm.sendEndDate,
      handleStatusIdList : this.notiSearchForm.handleStatus,
      includeAgent : this.isIncludeAgent,
      notiInfoId : this.notiSearchForm.notiInfoId.toUpperCase(),
      tmrDepartmentIdList : this.notiSearchForm.departmentIdList,
      tmrDivisionIdList : this.notiSearchForm.divisionIdList,
      tmrIdList : this.notiSearchForm.tmrIdList,
      sendStatusIdList : this.notiSearchForm.sendStatus,
      caseClosedStatusIdList : this.notiSearchForm.caseClosedStatus,
      replyStartDate : this.notiSearchForm.replyStartDate,
      replyEndDate : this.notiSearchForm.replyEndDate
    })
    .then((resp: AxiosResponse<PageOfNotiSearchGridDto>)=>{
      LoadingUtil.close();
      const p = { ...this.grid.pagination };
      p.total = parseInt(resp.data.totalElements);
      this.grid.data = resp.data.content;
      this.grid.pagination = p;
      if(p.total != 0 && this.grid.data.length ==0 && p.current != 1){
        //若回覆掉本頁最後一筆會辦單，將退回上一頁重新查詢
        p.current = p.current -1;
        this.reload();
      }else if (p.total == 0) {
        //	查無符合篩選條件之資料
        MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
      }
    }).catch((err)=>{
      // 照會查詢失敗
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t('notification_error_search').toString());
    })
  }

  // ===================================== Search 事件 ========================================================
  // 查詢
  notiSearch() {
    if(this.validateSearch()){
      
      this.grid.pagination.current = 1;
      this.reload();
    }
  }

  //查詢前驗證檢核
  validateSearch(){
    let validate = true;

    this.validatePolicyNo02(null, null, () => {
      if (this.notiSearchValidateForm.policyNo02.feedback) {
        validate = false;
      }
    });

    this.validatePolicyNo03(null, null, () => {
      if (this.notiSearchValidateForm.policyNo03.feedback) {
        validate = false;
      }
    });

    this.validateCustId(null, this.notiSearchForm.custId, () => {
      if (this.notiSearchValidateForm.custId.feedback) {
        validate = false;
      }
    });
    
    if(!this.sendDateVaildate()){
      validate = false;
    }

    if(!this.expiryDateVaildate()){
      validate = false;
    }

    // 照會回覆查詢需要多驗證
    if(this.entryPoint == NotificationProcess.notiReply){
      if(!this.replyDateVaildate()){
        validate = false;
      }
    }

    if(validate){
      //檢核查詢條件數量(少於兩個不可執行查詢)
      let countResult = this.checkFilterCount();
      validate = countResult;
      if(!countResult){
        ErrorModalUtil.modalError(this.$t('pedding_filterCountError').toString()); //查詢條件至少輸入兩項
      }
    }
    
    return validate;
  }

  //發送日期驗證
  sendDateVaildate(){
    let validate = true;
    this.validateSendStart(null, this.notiSearchForm.sendStartString, () => {
      if (this.notiSearchValidateForm.sendStart.feedback) {
        validate = false;
      }
    });
    this.validateSendEnd(null, this.notiSearchForm.sendEndString, () => {
      if (this.notiSearchValidateForm.sendEnd.feedback) {
        validate = false;
      }
    });
    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validate && !ValidationUtil.isEmpty(this.notiSearchForm.sendStartString) && !ValidationUtil.isEmpty(this.notiSearchForm.sendEndString)) {
      this.validateSendStartAndEndDate(null, this.notiSearchForm.sendStartDate, this.notiSearchForm.sendEndDate, this.notiSearchForm.sendStartString,
      this.notiSearchForm.sendEndString, this.isSendStartVisible, this.isSendEndVisible, () => {
        if (this.notiSearchValidateForm.sendStart.feedback || this.notiSearchValidateForm.sendEnd.feedback) {
          validate = false;
        }
      });
    }
    return validate;
  }

  //照會到期日期驗證
  expiryDateVaildate(){
    let validate = true;
    this.validateExpiryStart(null, this.notiSearchForm.expiryStartString, () => {
      if (this.notiSearchValidateForm.expiryStart.feedback) {
        validate = false;
      }
    });
    this.validateExpiryEnd(null, this.notiSearchForm.expiryEndString, () => {
      if (this.notiSearchValidateForm.expiryEnd.feedback) {
        validate = false;
      }
    });
    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validate && !ValidationUtil.isEmpty(this.notiSearchForm.expiryStartString) && !ValidationUtil.isEmpty(this.notiSearchForm.expiryEndString)) {
      this.validateExpiryStartAndEndDate(null, this.notiSearchForm.expiryStartDate, this.notiSearchForm.expiryEndDate, this.notiSearchForm.expiryStartString,
      this.notiSearchForm.expiryEndString, this.isExpiryStartVisible, this.isExpiryEndVisible, () => {
        if (this.notiSearchValidateForm.expiryStart.feedback || this.notiSearchValidateForm.expiryEnd.feedback) {
          validate = false;
        }
      });
    }
    return validate;
  }
  
  /**
   * @description 照會回覆日期驗證
   * @returns 
   * 
   * @author B1529
   * @version 2022/08/24
   */
  replyDateVaildate(){
    let validate = true;
    this.validateReplyStart(null, this.notiSearchForm.replyStartDateString, () => {
      if (this.notiSearchValidateForm.replyDateStart.feedback) {
        validate = false;
      }
    });
    this.validateReplyEnd(null, this.notiSearchForm.replyEndDateString, () => {
      if (this.notiSearchValidateForm.replyDateEnd.feedback) {
        validate = false;
      }
    });
    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validate && !ValidationUtil.isEmpty(this.notiSearchForm.replyStartDateString) && !ValidationUtil.isEmpty(this.notiSearchForm.replyEndDateString)) {
      this.validateReplyStartAndEndDate(null, this.notiSearchForm.replyStartDate, this.notiSearchForm.replyEndDate, this.notiSearchForm.replyStartDateString,
      this.notiSearchForm.replyEndDateString, () => {
        if (this.notiSearchValidateForm.replyDateStart.feedback || this.notiSearchValidateForm.replyDateEnd.feedback) {
          validate = false;
        }
      });
    }
    return validate;
  }

  //檢核查詢條件數量(少於兩個不可執行查詢)
  checkFilterCount() {
    let isAbleToSearch = false;
    let filterColumn = [];

    Object.keys(this.notiSearchForm).forEach((key=>{
      if(key != 'sendStartDate' && key !='sendEndDate' && key !='expiryStartDate' && key !='expiryEndDate'
          && key != 'replyStartDate' && key != 'replyEndDate' ){
        if (!ValidationUtil.isEmpty(this.notiSearchForm[key])) {
          filterColumn.push(key);
        }
      }
    }))

    //若有填寫保單號碼或作業單號 即可直接查詢
    if(filterColumn.some((c)=>c == 'policyNo01' || c == 'notiInfoId')){
        isAbleToSearch = true;
    }

    //計算有效查詢欄位數量
    if(!isAbleToSearch){
      let count = 0;
      if(filterColumn.some((c)=> c == "policyNo01" || c == "policyNo02" || c =="policyNo03")){
        count ++;
        filterColumn = filterColumn.filter((c)=> c != "policyNo01" && c != "policyNo02" && c !="policyNo03" );
      }
      if(filterColumn.some((c)=> c == "sendStartString" || c == "sendEndString")){
        count ++;
        filterColumn = filterColumn.filter((c)=> c != "sendStartString" && c != "sendEndString");
      }
      if(filterColumn.some((c)=> c == "expiryStartString" || c == "expiryEndString" )){
        count ++;
        filterColumn = filterColumn.filter((c)=> c != "expiryStartString" && c != "expiryEndString" );
      }
      if(filterColumn.some((c)=> c == "replyStartDateString" || c == "replyEndDateString")){
        count ++;
        filterColumn = filterColumn.filter((c)=> c != "replyStartDateString" && c != "replyEndDateString" );
      }

      count = count + filterColumn.length;

      if(count >=2){
        isAbleToSearch = true;
      }
    }
    
    return isAbleToSearch;
  }

  // 清除
  notiSearchReset() {
    this.notiSearchForm = {
      policyNo01: "",
      policyNo02: "",
      policyNo03: "",
      departmentIdList: [], //部門
      divisionIdList: [], //科別
      tmrIdList: [], //電訪員
      sendStartDate: null, //發送日期
      sendEndDate: null,
      sendStartString: "",
      sendEndString: "",
      expiryStartDate: null, //照會到期日期
      expiryEndDate: null,
      expiryStartString: "",
      expiryEndString: "",
      custId: '', //受訪者ID
      handleStatus: [], //處理狀態
      custName: '', //受訪者姓名
      notiInfoId: '', //作業單號
      sendStatus: [], //發送狀態
      caseClosedStatus: [],  //結案狀態
      replyStartDate: null,      // 回覆日期(起)
      replyStartDateString: '',
      replyEndDate: null,        // 回覆日期(訖)
      replyEndDateString: ''
    };
    this.grid.data = [];
    this.grid.pagination.total = 0;
    this.clearValidateStatus();
    this.onSelectDept();
    this.onSeletDivi();
  }

  //清除查詢條件的驗證狀態
  clearValidateStatus() {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo01, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo03, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.custId, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
  }

  // ===================================== Grid 事件 ========================================================
  
  //換頁
  onPageChange(e: FblPageEvent) {
    if (this.grid.data.length > 0) {
      this.grid.sort = e.sort;
      this.grid.pagination = e.pagination;
      this.reload();
    }
  }

  //滑鼠移出cell，detail消失
  handleEllipsisMouseLeave() {
    message.destroy();
  }

  //滑鼠點擊該cell，顯示detail
  handleEllipsisClick($event, data) {
    console.log(1)
    message.destroy();
    message.config({
        duration: 0,
        top: `50px`,
    });
    message.info(data);
    //取得message 的html元件
    let antDesignMessage = document.getElementsByClassName('ant-message');
    //變更messae顯示位置
    MessageUtil.changePosition(antDesignMessage, $event.x, $event.y)
    message.config({
        duration: 3,
        top: `50px`,
    });
  }

  // ===================================== Grid 事件 ========================================================

  /**
   * 選擇部門時，科別範圍限縮
   */
  onSelectDept() {

    this.selectDiviOptions = [];
    this.selectTmrOptions = [];
    
    if (this.notiSearchForm.departmentIdList.length > 0) {

      this.notiSearchForm.departmentIdList.forEach((depId) => {
        
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
    let unitIdTempList = Object.assign(this.notiSearchForm.divisionIdList);
    unitIdTempList.forEach((eachSelected)=>{

      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
        if(this.notiSearchForm.divisionIdList.length > 0) {
          this.notiSearchForm.divisionIdList = this.notiSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.notiSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.notiSearchForm.tmrIdList.length > 0) {
          this.notiSearchForm.tmrIdList = this.notiSearchForm.tmrIdList.filter(userId => userId != eachSelected);
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
    if(this.notiSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.notiSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.notiSearchForm.departmentIdList.length > 0) {

        this.notiSearchForm.departmentIdList.forEach((depId) => {
  
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
    let userIdTempList = Object.assign(this.notiSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.notiSearchForm.tmrIdList.length > 0) {
          this.notiSearchForm.tmrIdList = this.notiSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }

  /**
   * Hook
   */
  // 初始化頁面
  created() {

    LoadingUtil.show();
    // this.setInfInitFilter();
    this.$notificationApi.notiSearchInitUsingPOST()
    .then((resp : AxiosResponse<NotiSearchInitDto>)=>{
      this.handleStatusOptions = resp.data.handleStatus;
      this.caseClosedStatusOptions = resp.data.caseClosedStatus;
      
      if(this.entryPoint == NotificationProcess.notiProgress){  // 照會中查詢
        this.notiSearchForm.handleStatus.push("00");
        this.notiSearchForm.handleStatus.push("01");
      } 
      else if(this.entryPoint == NotificationProcess.notiReply){  // 照會回覆查詢
        this.notiSearchForm.caseClosedStatus.push(CloseStatus.W);
      }
      
      this.sendStatusOptions = resp.data.sendStatusOption;
      if(resp.data.unitDepInfo != null){

        // 部門對應科別/人員資料
        this.depUnitInfo = resp.data.unitDepInfo.depUnitInfo;
        this.depUserInfo = resp.data.unitDepInfo.depUserInfo;

        // 科別對應人員資料
        this.unitUserInfo = resp.data.unitDepInfo.unitUserInfo;

        // 部門 下拉
        this.selectDepOptions = Object.assign(resp.data.unitDepInfo.departOptions);
        this.notiSearchForm.departmentIdList.push(resp.data.unitDepInfo.defaultDepId);
        
        // 科別 下拉
        this.allDivList = resp.data.unitDepInfo.unitList;
        this.notiSearchForm.divisionIdList.push(resp.data.unitDepInfo.defaultUnitId);
        
        // 電訪員 下拉
        this.allUserList = resp.data.unitDepInfo.userList;
        this.notiSearchForm.tmrIdList.push(LoginModule.loginState.me.id);

        // 有預設部門需一起異動科別/人員
        if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultDepId)) {
          this.onSelectDept();
        }

        // 有預設科別需一起異動人員
        if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultUnitId)) {
          this.onSeletDivi();
        }

      }else{
        ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常
        LoadingUtil.close();
      }
      LoadingUtil.close();
      this.isIncludeAgent = true;
      this.notiSearch();
    })
    .catch((err)=>{
      LoadingUtil.close();
      // 照會查詢 下拉選單載入失敗
      ErrorModalUtil.modalError(this.$t('notification_error_querySelect').toString())
    })
  }

  // ===================================== 驗證 ========================================================

  /**
  * 保單號碼驗證
  * @param rule 驗證規則 
  * @param value 驗證內容
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validatePolicyNo(rule, value, callback) {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo01, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, false, '', false);
    // this.feildValidate(this.notiSearchValidateForm.policyNo01, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.notiSearchForm.policyNo01)) {
      if (!ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo01)) {
          if (ValidationUtil.isEmpty(this.notiSearchForm.policyNo02)) {
            // 保單序號 必填
            CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, true, this.$t('infPage_policyNoSeqRequired').toString(), false);
          } else if (!ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo02)) {
            // 保單序號 僅可輸入數字
            CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, true, this.$t('infPage_policyNoSeqFormatError').toString(), false);
          }
      } else {
        // 保單序號 僅可輸入數字
        if (!ValidationUtil.isEmpty(this.notiSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo02)) {
          CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, true, this.$t('infPage_policyNoSeqFormatError').toString(), false);
        }
      }
    } else {
      // 保單序號 僅可輸入數字
      if (!ValidationUtil.isEmpty(this.notiSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo02)) {
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, true, this.$t('infPage_policyNoSeqFormatError').toString(), false);
      }
    }
    callback();
  }

  /**
  * 保單序號驗證
  * @param rule 驗證規則 
  * @param value 驗證內容
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validatePolicyNo02(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, false, '', false);
    if (!ValidationUtil.isEmpty(this.notiSearchForm.policyNo02)) {
      if (!ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo02)) {
        // 保單序號 僅可輸入數字
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, true, this.$t('infPage_policyNoSeqFormatError').toString(), false);
        callback(() => { });
      }
    } else {
      if (!ValidationUtil.isEmpty(this.notiSearchForm.policyNo01)) {
        if (!ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo01)) {
          // 保單序號 必填
          CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo02, true, this.$t('infPage_policyNoSeqRequired').toString(), false);
          callback(() => { });
        }
      }
    }
    callback();
  }

  /**
  * 保單重複碼驗證
  * @param rule 驗證規則 
  * @param value 驗證內容
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validatePolicyNo03(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo03, false, '', false);
    if (!ValidationUtil.isEmpty(this.notiSearchForm.policyNo03)) {
      if (!ValidationUtil.numberOnlyValidation(this.notiSearchForm.policyNo03)) {
        // 保單重複碼 僅可輸入數字
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.policyNo03, true, this.$t('infPage_policyNoDupFormatError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 受訪者代碼驗證
  * @param rule 驗證規則 
  * @param value
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateCustId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.custId, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      if (!ValidationUtil.alphabetAndNumberValidation(value)) {
        //受訪者代碼 僅可輸入英文與數字
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.custId, true, this.$t('infPage_custIdFormatError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 發送日期格式驗證(起)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSendStart(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (!parseDate) {
        this.isSendStartVisible = true;
        //日期錯誤
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, true, this.$t('global_dateError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 發送日期格式驗證(訖)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSendEnd(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (!parseDate) {
        this.isSendEndVisible = true;
        //日期錯誤
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, true, this.$t('global_dateError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 會辦到期日期格式驗證(起)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateExpiryStart(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (!parseDate) {
        this.isExpiryStartVisible = true;
        //日期錯誤
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, true, this.$t('global_dateError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 照會到期日期格式驗證(訖)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateExpiryEnd(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (!parseDate) {
        this.isExpiryEndVisible = true;
        //日期錯誤
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, true, this.$t('global_dateError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 發送日期 起訖日期驗證
  * @param rule 驗證規則 
  * @param startTime 起始日期
  * @param endTime 結束日期 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSendStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
    
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, false, '', false);
    if ( startString != endString && moment(startDate).isAfter(endDate) ) {

      dateDisableStart = true;
      dateDisableEnd = true;
      if (!ValidationUtil.isEmpty(this.notiSearchForm.sendStartString) && !ValidationUtil.isEmpty(this.notiSearchForm.sendEndString)) {
        //請輸入正確的起訖日期
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
        //請輸入正確的起訖日期
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.sendEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 照會到期日期 起訖日期驗證
  * @param rule 驗證規則 
  * @param startTime 起始日期
  * @param endTime 結束日期 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateExpiryStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, false, '', false);

    if ( startString != endString && moment(startDate).isAfter(endDate) ) {

      dateDisableStart = true;
      dateDisableEnd = true;
      if (!ValidationUtil.isEmpty(this.notiSearchForm.expiryStartString) && !ValidationUtil.isEmpty(this.notiSearchForm.expiryEndString)) {
        //請輸入正確的起訖日期
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
        //請輸入正確的起訖日期
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.expiryEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 照會回覆日期 起訖日期驗證
  * @param rule 驗證規則 
  * @param startTime 起始日期
  * @param endTime 結束日期 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
   validateReplyStartAndEndDate(rule, startDate, endDate, startString, endString, callback) {

    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);

    if ( startString != endString && moment(startDate).isAfter(endDate) ) {

      if (!ValidationUtil.isEmpty(this.notiSearchForm.replyStartDateString) && !ValidationUtil.isEmpty(this.notiSearchForm.replyEndDateString)) {
        //請輸入正確的起訖日期
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
        //請輸入正確的起訖日期
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 照會回覆日期格式驗證(起)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
   validateReplyStart(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (!parseDate) {
        //日期錯誤
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateStart, true, this.$t('global_dateError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 照會回覆日期格式驗證(訖)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateReplyEnd(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, false, '', false);
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (!parseDate) {
        //日期錯誤
        CommonUtil.feildValidateWithVisible(this.notiSearchValidateForm.replyDateEnd, true, this.$t('global_dateError').toString(), false);
        callback(() => { });
      }
    }
    callback();
  }

  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
    );
  }

  // 離開彈窗 (未來統一修改為此關閉視窗方式) (目前已使用的彈窗為 ： 會辦資料、歸戶提示、服務歷程訊息彈窗)
  onCloseModal(modalName) {
    this[modalName] = false;
  }

  //查詢結果的作業單號碼是否為超連結
  checkInfIdLinkShow(data){
    let isShow = false;
    if(!ValidationUtil.isEmpty(data.handleStatus) && data.caseClosedStatus !='Y'){
      isShow = true;
    }
    return isShow;
  }

  /**
   * @description 取得驗證參數
   * @param fv 
   * @returns 
   * 
   * @author B1529
   * @version 2022/06/13
   */
   callCommonUtilFeild(fv: ValidateFormComponent){
    return CommonUtil.getFeildValid(fv);
  }

  /**
   * @description 變更hover hoverVisivle參數
   * @param fv 
   * 
   * @author B1529
   * @version 2022/06/13
   */
  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

  /**
   * @description 開啟照會作業單
   * @param data
   * 
   * @author B1529
   * @version 2022/08/23
   */
  handleInspectClick(data : NotiSearchGridDto) {

    // 紀錄選取資料
    this.selectNotiData = data;

    if(HandleStatus.NOT_PROCESS == data.handleStatus || HandleStatus.PROCESSING == data.handleStatus){
      this.notiOpenData.notiStep = NotiStep.reply;
    } else if(CloseStatus.W == data.caseClosedStatus){
      this.notiOpenData.notiStep = NotiStep.close;
    }

    this.notiOpenData.title = this.$t('notificationReply_notiReply').toString();  // 照會回覆
    this.notiOpenData.notiInfoId = data.notiInfoId;
    this.notiOpenData.caseNo = data.caseNo;
    this.isNotificationFormVisible = true;
    
  }

  /**
   * @description 照會作業單重整畫面
   * 
   * @author B1529
   * @version 2022/08/23
   */
  notiReSearch(){

    // 關閉照會作業單
    this.onCloseModal('isNotificationFormVisible');

    // 重整查詢畫面
    this.reload();
  }

  /**
   * @description 照會回覆結案另開照會開單
   * 
   * @author B1529
   * @version 2022/09/01
   */
  onNotiOpen(){

    // 關閉照會作業單
    this.onCloseModal('isNotificationFormVisible');

    // 另開照會開單...
    this.notiOpenData.title = this.$t('teleResultArea_afterTel_noti_btn').toString();   // 照會
    this.notiOpenData.notiStep = NotiStep.open;
    this.notiOpenData.notiInfoId = this.selectNotiData.notiInfoId;
    this.notiOpenData.caseNo = this.selectNotiData.caseNo;
    this.notiOpenData.packNo = this.selectNotiData.packNo;
    this.notiOpenData.caseLogId = this.selectNotiData.caseLogId;
    this.notiOpenData.packLogId = this.selectNotiData.packLogId;
    this.notiOpenData.reOpen = true;
    this.isNotificationFormVisible = true;
  }
}