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
import { InfGrid, InfSearchFilter, Option, StaffDto } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import { FeildValidation, InfSearchValidateForm } from "./model";
import "@/assets/less/infPage.less";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { message } from "ant-design-vue";
import CuntersignatureModal from "@/components/shared/countersignatureModal/CountersignatureModal.vue";

@Component({
  components: { FblDataGrid, HiddenFolde, CuntersignatureModal }
})
export default class CountersignaturePage extends Vue {

  //查詢條件
  infSearchForm = {
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
    expiryStartDate: null, //會辦到期日期
    expiryEndDate: null,
    expiryStartString: "",
    expiryEndString: "",
    custId: '', //受訪者ID
    handleStatus: [], //處理狀態
    custName: '', //受訪者姓名
    infInfoId: '', //作業單號
    infDep: [], //會辦部門
    infType: "", //會辦類型
    sendStatus:[] //發送狀態
  };

  // 主表搜尋條件過濾
  infFilter: FblFilters = {
    filters: []
  };

  //其他查詢條件
  otherFilter: InfSearchFilter = {
    taskBusinessTypeIdList: [],
    tmrDepartmentIdList: [],
    tmrDivisionIdList: [],
    tmrIdList: [],
    infDepartmentIdList: [],
    handleStatusIdList: [],
    infOtherPage: false,
    policyNo01: "",
    policyNo02: "",
    policyNo03: "",
    includeAgent: false,
    sendStatusList:[]
  }

  //是否包含代理人
  isIncludeAgent: boolean = false;

  //查詢表單驗證規則
  infSearchRule: { [key: string]: ValidationRule[] } = {
    policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
    policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
    policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
    custId: [{ validator: this.validateCustId, trigger: "blur" }],
    sendStart: [{ validator: this.validateSendStart, trigger: "blur" }],
    sendEnd: [{ validator: this.validateSendEnd, trigger: "blur" }],
    expiryStart: [{ validator: this.validateExpiryStart, trigger: "blur" }],
    expiryEnd: [{ validator: this.validateExpiryEnd, trigger: "blur" }],
  };

  //欄位驗證提示工具
  infSearchValidateForm :InfSearchValidateForm = {
    sendStart: { hover: "", feedback: false, state: "success", msg: "" },
    sendEnd: { hover: "", feedback: false, state: "success", msg: "" },
    expiryStart: { hover: "", feedback: false, state: "success", msg: "" },
    expiryEnd: { hover: "", feedback: false, state: "success", msg: "" },
    policyNo01: { hover: "", feedback: false, state: "success", msg: "" },
    policyNo02: { hover: "", feedback: false, state: "success", msg: "" },
    policyNo03: { hover: "", feedback: false, state: "success", msg: "" },
    custId: { hover: "", feedback: false, state: "success", msg: "" },
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

  //部門與科別下拉選單是否禁用
  // divDisable: boolean = false;
  // depDisable: boolean = false;

  //會辦表單是否顯示
  isCountersignatureFormVisible: boolean = false;

  //會辦資料
  cuntersignatureData = {
    caseNo: '',
    infStep: 1,
    infInfoId: '',
    infTypeId: '',
  };

  // ===================================== Grid ========================================================
  grid: FblPDataGridHolder<InfGrid> = {
    rowKey: "infInfoId",
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
        property: "infInfoId",
        title: this.$t('infPage_infInfoIdNo').toString(),
        template: "infInfoIdTemplate",
        fixed: 'left',
        width: 160,
        align: 'center'
      },
      {
        // 案件階段
        type: FblColumnType.PLAIN,
        property: "caseStage",
        title: this.$t('infPage_caseStage').toString(),
        fixed: 'left',
        width: 80,
        align: 'center'
      },
      {
        // 案件狀態
        type: FblColumnType.PLAIN,
        property: "caseStatus",
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
        // 會辦日期
        type: FblColumnType.PLAIN,
        property: "sendDate",
        title: this.$t('infPage_infDate').toString(),
        width: 100,
        align: 'center'
      },
      {
        // 會辦到期日期
        type: FblColumnType.PLAIN,
        property: "expiryDate",
        title: this.$t('infPage_expiryDate').toString(),
        width: 120,
        align: 'center'
      },
      {
        // 會辦回覆日期
        type: FblColumnType.PLAIN,
        property: "replyDate",
        title: this.$t('infPage_replyDate').toString(),
        width: 120,
        align: 'center'
      },
      {
        // 會辦催辦日期
        type: FblColumnType.PLAIN,
        property: "reminderDate",
        title: this.$t('infPage_reminderDate').toString(),
        width: 120,
        align: 'center'
      },
      {
        // 逾期天數
        type: FblColumnType.PLAIN,
        property: "overDateCount",
        title: this.$t('infPage_overDayCount').toString(),
        width: 80,
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
        // 會辦部門
        type: FblColumnType.PLAIN,
        property: "infDepartmentName",
        title: this.$t('infPage_infDep').toString(),
        width: 140,
        align: 'center'
      },
      {
        // 覆核狀態
        type: FblColumnType.PLAIN,
        property: "reviewStatus",
        title: this.$t('infPage_reviewStatus').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 結案狀態
        type: FblColumnType.PLAIN,
        property: "caseCloseStatus",
        title: this.$t('infPage_caseCloseStatus').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 處理狀態
        type: FblColumnType.PLAIN,
        property: "handleStatus",
        title: this.$t('infPage_handleStatus').toString(),
        width: 80,
        align: 'center'
      },
      {
        // 發送狀態
        type: FblColumnType.PLAIN,
        property: "sendStatus",
        title: this.$t('infPage_sendStatus').toString(),
        width: 80,
        align: 'center'
      },
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
  handleStatusOptions: Option[] = []
  // 會辦部門
  infDepOption: Option[] = []
  // 會辦類型
  infTypeOption: Option[] = []
  // 發送狀態
  sendStatusOptions: Option[] = []


  depUnitInfo = {};
  depUserInfo = {};
  unitUserInfo = {};

  // ===================================== 發送日期 DatePicker 事件 ========================================================
  
  //開始日期變動
  onSendStartChange(date){
    this.infSearchForm.sendStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    this.sendDateVaildate();
  }

  //結束日期變動
  onSendEndChange(date){
    this.infSearchForm.sendEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    this.sendDateVaildate();
  }

  //滑鼠移入
  eventMouseOverSendStart(){
    if (this.infSearchValidateForm.sendStart.feedback) {
      this.isSendStartVisible = true;
    } else {
        this.isSendStartVisible = false;
    }
  }

  //滑鼠移入
  eventMouseOverSendEnd(){
    if (this.infSearchValidateForm.sendEnd.feedback) {
      this.isSendEndVisible = true;
    } else {
        this.isSendEndVisible = false;
    }
  }

  //開始日期清除
  clearSendStartDate() {
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    this.isSendStartVisible = false;
    this.infSearchForm.sendStartString = "";
    this.infSearchForm.sendStartDate = null;
    this.sendDateVaildate();
  }

  //結束日期清除
  clearSendEndDate() {
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    this.isSendEndVisible = false;
    this.infSearchForm.sendEndString = "";
    this.infSearchForm.sendEndDate = null;
    this.sendDateVaildate();
  }

  //手動輸入起始日期
  checkManualInputSendStartDate(data: any) {
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
      this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    } else {
      this.isSendStartVisible = true;
      // 日期錯誤
      this.feildValidate(this.infSearchValidateForm.sendStart, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.infSearchForm.sendStartDate = parseDate ? parseDate : this.infSearchForm.sendStartDate;
    this.infSearchForm.sendStartString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.infSearchForm.sendStartDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //手動輸入結束日期
  checkManualInputSendEndDate(data: any) {
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
      this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    } else {
      this.isSendEndVisible = true;
      // 日期錯誤
      this.feildValidate(this.infSearchValidateForm.sendEnd, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.infSearchForm.sendEndDate = parseDate ? parseDate : this.infSearchForm.sendEndDate;
    this.infSearchForm.sendEndString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.infSearchForm.sendEndDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  

  // ===================================== 發送日期 DatePicker 事件 ========================================================

  // ===================================== 會辦到期日期 DatePicker 事件 ========================================================

  //起始日期變動
  onExpiryStartChange(date){
    this.infSearchForm.expiryStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    this.expiryDateVaildate();
  }

  //結束日期變動
  onExpiryEndChange(date){
    this.infSearchForm.expiryEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    this.expiryDateVaildate();
  }

  //滑鼠移入
  eventMouseOverExpiryStart(){
    if (this.infSearchValidateForm.expiryStart.feedback) {
      this.isExpiryStartVisible = true;
    } else {
        this.isExpiryStartVisible = false;
    }
  }

  //滑鼠移入
  eventMouseOverExpiryEnd(){
    if (this.infSearchValidateForm.expiryEnd.feedback) {
      this.isExpiryEndVisible = true;
    } else {
        this.isExpiryEndVisible = false;
    }
  }

  //起始日期清除
  clearExpiryStartDate() {
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    this.isExpiryStartVisible = false;
    this.infSearchForm.expiryStartString = "";
    this.infSearchForm.expiryStartDate = null;
    this.expiryDateVaildate();
  }

  //結束日期清除
  clearExpiryEndDate() {
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    this.isExpiryEndVisible = false;
    this.infSearchForm.expiryEndString = "";
    this.infSearchForm.expiryEndDate = null;
    this.expiryDateVaildate();
  }

  //手動輸入起始日期
  checkManualInputExpiryStartDate(data: any) {
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
      this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    } else {
      this.isExpiryStartVisible = true;
      // 日期錯誤
      this.feildValidate(this.infSearchValidateForm.expiryStart, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.infSearchForm.expiryStartDate = parseDate ? parseDate : this.infSearchForm.expiryStartDate;
    this.infSearchForm.expiryStartString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.infSearchForm.expiryStartDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //手動輸入結束日期
  checkManualInputExpiryEndDate(data: any) {
    this.isExpiryStartVisible = false;
    this.isExpiryEndVisible = false;
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
      this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    } else {
      this.isExpiryEndVisible = true;
      // 日期錯誤
      this.feildValidate(this.infSearchValidateForm.expiryEnd, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.infSearchForm.expiryEndDate = parseDate ? parseDate : this.infSearchForm.expiryEndDate;
    this.infSearchForm.expiryEndString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.infSearchForm.expiryEndDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  // ===================================== 會辦到期日期 DatePicker 事件 ========================================================

  // ===================================== 事件 ========================================================

  // 重整頁面
  reload(){
    LoadingUtil.show();
    this.otherFilter.filter = this.infFilter;
    this.$informApi.paginateReplyInformSearchUsingPOST(this.grid.pagination.current-1,this.grid.pagination.pageSize,this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,this.otherFilter)
    .then((resp)=>{
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
      // 會辦查詢失敗
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t('infPage_searchFailed').toString())
    })
  }

  //依據router設定固定查詢條件
  setInfInitFilter(){
    switch(this.$route.name){
      case 'infNb' :
        //會辦新契約
        this.setInfNBFilter();
        break;
      case 'infPs' :
        //會辦保全
        this.setInfPSFilter();
        break;
      case 'infPlCb' :
        //會辦客利
        this.setInfPLCBFilter();
        break;
      case 'infRn' :
        //會辦保費
        this.setInfRNFilter();
        break;
      case 'infRm' :
        //會辦風管
        this.setInfRMFilter();
        break;
      case 'infQb' :
        //會辦營品
        this.setInfQBFilter();
        break;
      default :
        //會辦其他
        this.setInfDefaultFilter();
    }
  }

  //設定會辦新契約的固定查詢參數
  setInfNBFilter(){
    this.infSearchForm.infType = '6';
    this.otherFilter.taskBusinessTypeIdList.push('NB');
  }

  //設定會辦保全的固定查詢參數
  setInfPSFilter(){
    this.infSearchForm.infType = '6';
    this.otherFilter.taskBusinessTypeIdList.push('PS');
  }

  //設定會辦客利的固定查詢參數
  setInfPLCBFilter(){
    this.infSearchForm.infType = '6';
    this.otherFilter.taskBusinessTypeIdList.push('PL');
    this.otherFilter.taskBusinessTypeIdList.push('CB');
  }

  //設定會辦保費的固定查詢參數
  setInfRNFilter(){
    this.infSearchForm.infType = '6';
    this.otherFilter.taskBusinessTypeIdList.push('RN');
  }

  //設定會辦風管的固定查詢參數
  setInfRMFilter(){
    this.infSearchForm.infType = '5';
  }

  //設定會辦營品的固定查詢參數
  setInfQBFilter(){
    this.infSearchForm.infType = '4';
  }

  //設定會辦其他的固定查詢參數
  setInfDefaultFilter(){
    this.infSearchForm.infType = '6';
    this.otherFilter.infOtherPage = true;
  }

  // ===================================== Search 事件 ========================================================
  // 查詢
  infSearch() {
    if(this.validateSearch()){
      const custId = FiltersUtil.setFilterParam("custId", FblOperator.EQ, this.infSearchForm.custId.toUpperCase());
      const custName = FiltersUtil.setFilterParam("custName", FblOperator.CONTAINS, this.infSearchForm.custName);
      const sendStart = FiltersUtil.setFilterParam("sendDate", FblOperator.GEQ, moment(this.infSearchForm.sendStartDate).startOf("day").toISOString(true));
      const sendEnd = FiltersUtil.setFilterParam("sendDate", FblOperator.LEQ, moment(this.infSearchForm.sendEndDate).endOf("day").toISOString(true));
      const expireStart = FiltersUtil.setFilterParam("infExpireDate", FblOperator.GEQ, moment(this.infSearchForm.expiryStartDate).startOf("day").toISOString(true));
      const expireEnd = FiltersUtil.setFilterParam("infExpireDate", FblOperator.LEQ, moment(this.infSearchForm.expiryEndDate).endOf("day").toISOString(true));
      const infInfoId = FiltersUtil.setFilterParam("infInfoId", FblOperator.EQ, this.infSearchForm.infInfoId.toUpperCase());
      const infTypeId = FiltersUtil.setFilterParam("infTypeId", FblOperator.EQ, this.infSearchForm.infType);
      this.infFilter = FiltersUtil.setFilters(custId, sendStart, sendEnd, custName, expireStart, expireEnd, infInfoId, infTypeId);
      this.otherFilter.tmrDepartmentIdList = this.infSearchForm.departmentIdList;
      this.otherFilter.tmrDivisionIdList = this.infSearchForm.divisionIdList;
      this.otherFilter.tmrIdList = this.infSearchForm.tmrIdList;
      this.otherFilter.infDepartmentIdList = this.infSearchForm.infDep;
      this.otherFilter.handleStatusIdList = this.infSearchForm.handleStatus;
      this.otherFilter.policyNo01 = this.infSearchForm.policyNo01;
      this.otherFilter.policyNo02 = this.infSearchForm.policyNo02;
      this.otherFilter.policyNo03 = this.infSearchForm.policyNo03;
      this.otherFilter.includeAgent = this.isIncludeAgent;
      this.otherFilter.sendStatusList = this.infSearchForm.sendStatus;
      if(!this.isIncludeAgent){
        this.otherFilter.taskBusinessTypeIdList = [];
      }
      this.grid.pagination.current = 1;
      this.reload();
    }
  }

  //查詢前驗證檢核
  validateSearch(){
    let validate = true;

    this.validatePolicyNo02(null, null, () => {
      if (this.infSearchValidateForm.policyNo02.state == 'error') {
        validate = false;
      }
    });

    this.validatePolicyNo03(null, null, () => {
      if (this.infSearchValidateForm.policyNo03.state == 'error') {
        validate = false;
      }
    });

    this.validateCustId(null, this.infSearchForm.custId, () => {
      if (this.infSearchValidateForm.custId.state == 'error') {
        validate = false;
      }
    });
    
    if(!this.sendDateVaildate()){
      validate = false;
    }

    if(!this.expiryDateVaildate()){
      validate = false;
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
    this.validateSendStart(null, this.infSearchForm.sendStartString, () => {
      if (this.infSearchValidateForm.sendStart.state == 'error') {
        validate = false;
      }
    });
    this.validateSendEnd(null, this.infSearchForm.sendEndString, () => {
      if (this.infSearchValidateForm.sendEnd.state == 'error') {
        validate = false;
      }
    });
    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validate && !ValidationUtil.isEmpty(this.infSearchForm.sendStartString) && !ValidationUtil.isEmpty(this.infSearchForm.sendEndString)) {
      this.validateSendStartAndEndDate(null, this.infSearchForm.sendStartDate, this.infSearchForm.sendEndDate, this.infSearchForm.sendStartString,
      this.infSearchForm.sendEndString, this.isSendStartVisible, this.isSendEndVisible, () => {
        if (this.infSearchValidateForm.sendStart.state == 'error' || this.infSearchValidateForm.sendEnd.state == 'error') {
          validate = false;
        }
      });
    }
    return validate;
  }

  //會辦到期日期驗證
  expiryDateVaildate(){
    let validate = true;
    this.validateExpiryStart(null, this.infSearchForm.expiryStartString, () => {
      if (this.infSearchValidateForm.expiryStart.state == 'error') {
        validate = false;
      }
    });
    this.validateExpiryEnd(null, this.infSearchForm.expiryEndString, () => {
      if (this.infSearchValidateForm.expiryEnd.state == 'error') {
        validate = false;
      }
    });
    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validate && !ValidationUtil.isEmpty(this.infSearchForm.expiryStartString) && !ValidationUtil.isEmpty(this.infSearchForm.expiryEndString)) {
      this.validateExpiryStartAndEndDate(null, this.infSearchForm.expiryStartDate, this.infSearchForm.expiryEndDate, this.infSearchForm.expiryStartString,
      this.infSearchForm.expiryEndString, this.isExpiryStartVisible, this.isExpiryEndVisible, () => {
        if (this.infSearchValidateForm.expiryStart.state == 'error' || this.infSearchValidateForm.expiryEnd.state == 'error') {
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

    Object.keys(this.infSearchForm).forEach((key=>{
      if(key != 'sendStartDate' && key !='sendEndDate' && key !='expiryStartDate' && key !='expiryEndDate' && key !='infType'){
        if (!ValidationUtil.isEmpty(this.infSearchForm[key])) {
          filterColumn.push(key);
        }
      }
    }))

    //若有填寫保單號碼或作業單號 即可直接查詢
    if(filterColumn.some((c)=>c == 'policyNo01' || c == 'infInfoId')){
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

      count = count + filterColumn.length;

      if(count >=2){
        isAbleToSearch = true;
      }
    }
    
    return isAbleToSearch;
  }

  // 清除
  infSearchReset() {
    this.infSearchForm = {
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
      expiryStartDate: null, //會辦到期日期
      expiryEndDate: null,
      expiryStartString: "",
      expiryEndString: "",
      custId: '', //受訪者ID
      handleStatus: [], //處理狀態
      custName: '', //受訪者姓名
      infInfoId: '', //作業單號
      infDep: [], //會辦部門
      infType: this.infSearchForm.infType, //會辦類型
      sendStatus: [] //發送狀態
    };
    this.otherFilter = {
      taskBusinessTypeIdList:[],
      tmrDepartmentIdList: [],
      tmrDivisionIdList: [],
      tmrIdList: [],
      infDepartmentIdList: [],
      handleStatusIdList: [],
      infOtherPage: false,
      policyNo01: "",
      policyNo02: "",
      policyNo03: "",
      sendStatusList:[]
    }
    this.grid.data = [];
    this.grid.pagination.total = 0;
    // this.divDisable = false;
    // this.depDisable = false;
    this.clearValidateStatus();
    this.setInfInitFilter();
    this.onSelectDept();
    this.onSeletDivi();
    // this.onSelectTmr();
  }

  //清除查詢條件的驗證狀態
  clearValidateStatus() {
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.policyNo02, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.policyNo01, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.policyNo03, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.custId, false, "success", "", "");
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
    
    if (this.infSearchForm.departmentIdList.length > 0) {

      this.infSearchForm.departmentIdList.forEach((depId) => {
        
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
    let unitIdTempList = Object.assign(this.infSearchForm.divisionIdList);
    unitIdTempList.forEach((eachSelected)=>{

      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
        if(this.infSearchForm.divisionIdList.length > 0) {
          this.infSearchForm.divisionIdList = this.infSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.infSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.infSearchForm.tmrIdList.length > 0) {
          this.infSearchForm.tmrIdList = this.infSearchForm.tmrIdList.filter(userId => userId != eachSelected);
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
    if(this.infSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.infSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.infSearchForm.departmentIdList.length > 0) {

        this.infSearchForm.departmentIdList.forEach((depId) => {
  
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
    let userIdTempList = Object.assign(this.infSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.infSearchForm.tmrIdList.length > 0) {
          this.infSearchForm.tmrIdList = this.infSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }

  /**
   * 選擇電訪員後，部門與科別禁止異動
   */
  // onSelectTmr() {
  //   if (this.infSearchForm.tmrIdList.length > 0) {
  //       this.depDisable = true;
  //       this.divDisable = true;
  //   } else {
  //       if (this.infSearchForm.divisionIdList.length > 0) {
  //           this.depDisable = true;
  //           this.divDisable = false;
  //       } else {
  //           this.depDisable = false;
  //           this.divDisable = false;
  //       }
  //   }
  // }

  //驗證共用物件
  feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.msg = msg == null ? fv.msg : msg;
  }

  /**
   * Hook
   */
  // 初始化頁面
  created() {
    LoadingUtil.show();
    this.setInfInitFilter();
    this.$informApi.replyInformSearchInitUsingGET()
    .then((resp)=>{
      this.handleStatusOptions = resp.data.handleStatus;
      this.infSearchForm.handleStatus.push("00");
      this.infSearchForm.handleStatus.push("01");
      this.infDepOption = resp.data.infDepartmentOption;
      this.infTypeOption = resp.data.infTypeOption;
      this.sendStatusOptions = resp.data.sendStatusOption;
      if(resp.data.unitDepInfo != null){

        // 部門對應科別/人員資料
        this.depUnitInfo = resp.data.unitDepInfo.depUnitInfo;
        this.depUserInfo = resp.data.unitDepInfo.depUserInfo;

        // 科別對應人員資料
        this.unitUserInfo = resp.data.unitDepInfo.unitUserInfo;

        // 部門 下拉
        this.selectDepOptions = Object.assign(resp.data.unitDepInfo.departOptions);
        this.infSearchForm.departmentIdList.push(resp.data.unitDepInfo.defaultDepId);
        
        // 科別 下拉
        this.allDivList = resp.data.unitDepInfo.unitList;
        this.infSearchForm.divisionIdList.push(resp.data.unitDepInfo.defaultUnitId);
        
        // 電訪員 下拉
        this.allUserList = resp.data.unitDepInfo.userList;
        this.infSearchForm.tmrIdList.push(LoginModule.loginState.me.id);

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
      this.infSearch();
    })
    .catch((err)=>{
      LoadingUtil.close();
      // 會辦查詢 下拉選單載入失敗
      ErrorModalUtil.modalError(this.$t('infPage_querySelectionFailed').toString())
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
    this.feildValidate(this.infSearchValidateForm.policyNo01, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.infSearchForm.policyNo01)) {
      if (!ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo01)) {
          if (ValidationUtil.isEmpty(this.infSearchForm.policyNo02)) {
            // 保單序號 必填
            this.feildValidate(this.infSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqRequired').toString());
          } else if (!ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo02)) {
            // 保單序號 僅可輸入數字
            this.feildValidate(this.infSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
          } else {
            this.feildValidate(this.infSearchValidateForm.policyNo02, false, "success", "", "");
          }
      } else {
        // 保單序號 僅可輸入數字
        if (!ValidationUtil.isEmpty(this.infSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo02)) {
          this.feildValidate(this.infSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
        } else {
          this.feildValidate(this.infSearchValidateForm.policyNo02, false, "success", "", "");
        }
      }
    } else {
      // 保單序號 僅可輸入數字
      if (!ValidationUtil.isEmpty(this.infSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo02)) {
        this.feildValidate(this.infSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
      } else {
        this.feildValidate(this.infSearchValidateForm.policyNo02, false, "success", "", "");
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
    this.feildValidate(this.infSearchValidateForm.policyNo02, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.infSearchForm.policyNo02)) {
      if (!ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo02)) {
        // 保單序號 僅可輸入數字
        this.feildValidate(this.infSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
        callback(() => { });
      }
    } else {
      if (!ValidationUtil.isEmpty(this.infSearchForm.policyNo01)) {
        if (!ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo01)) {
          // 保單序號 必填
          this.feildValidate(this.infSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqRequired').toString());
          callback(() => { });
        } else {
          this.feildValidate(this.infSearchValidateForm.policyNo02, false, "success", "", "");
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
    this.feildValidate(this.infSearchValidateForm.policyNo03, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.infSearchForm.policyNo03)) {
      if (!ValidationUtil.numberOnlyValidation(this.infSearchForm.policyNo03)) {
        // 保單重複碼 僅可輸入數字
        this.feildValidate(this.infSearchValidateForm.policyNo03, true, "error", "hover", this.$t('infPage_policyNoDupFormatError').toString());
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
    this.feildValidate(this.infSearchValidateForm.custId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      if (ValidationUtil.alphabetAndNumberValidation(value)) {
        this.feildValidate(this.infSearchValidateForm.custId, false, "", "", "");
        callback();
      } else {
        //受訪者代碼 僅可輸入英文與數字
        this.feildValidate(this.infSearchValidateForm.custId, true, "error", "hover", this.$t('infPage_custIdFormatError').toString());
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
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
        callback();
      } else {
        this.isSendStartVisible = true;
        this.feildValidate(this.infSearchValidateForm.sendStart, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
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
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
        callback();
      } else {
        this.isSendEndVisible = true;
        this.feildValidate(this.infSearchValidateForm.sendEnd, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
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
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
        callback();
      } else {
        this.isExpiryStartVisible = true;
        this.feildValidate(this.infSearchValidateForm.expiryStart, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 會辦到期日期格式驗證(訖)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateExpiryEnd(rule, value, callback) {
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
        callback();
      } else {
        this.isExpiryEndVisible = true;
        this.feildValidate(this.infSearchValidateForm.expiryEnd, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
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
    this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
    if (startString == endString || moment(startDate).isBefore(endDate)) {
      dateDisableStart = false;
      dateDisableEnd = false;
      this.feildValidate(this.infSearchValidateForm.sendStart, false, "success", "", "");
      this.feildValidate(this.infSearchValidateForm.sendEnd, false, "success", "", "");
      callback();
    } else {
      dateDisableStart = true;
      dateDisableEnd = true;
      if (!ValidationUtil.isEmpty(this.infSearchForm.sendStartString) && !ValidationUtil.isEmpty(this.infSearchForm.sendEndString)) {
        this.feildValidate(this.infSearchValidateForm.sendStart, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        this.feildValidate(this.infSearchValidateForm.sendEnd, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        callback(() => { });
      }
    }
    callback();
  }

  /**
  * 會辦到期日期 起訖日期驗證
  * @param rule 驗證規則 
  * @param startTime 起始日期
  * @param endTime 結束日期 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateExpiryStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
    this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
    this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
    if (startString == endString || moment(startDate).isBefore(endDate)) {
      dateDisableStart = false;
      dateDisableEnd = false;
      this.feildValidate(this.infSearchValidateForm.expiryStart, false, "success", "", "");
      this.feildValidate(this.infSearchValidateForm.expiryEnd, false, "success", "", "");
      callback();
    } else {
      dateDisableStart = true;
      dateDisableEnd = true;
      if (!ValidationUtil.isEmpty(this.infSearchForm.expiryStartString) && !ValidationUtil.isEmpty(this.infSearchForm.expiryEndString)) {
        this.feildValidate(this.infSearchValidateForm.expiryStart, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        this.feildValidate(this.infSearchValidateForm.expiryEnd, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
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

  //會辦表單開啟
  handleInspectClick(data){
    // 未處理、處理中
    if(data.handleStatusId == "00" || data.handleStatusId == "01"){
      this.cuntersignatureData.caseNo = data.caseNo;
      this.cuntersignatureData.infStep = 2;
      this.cuntersignatureData.infInfoId = data.infInfoId;
      this.cuntersignatureData.infTypeId = data.infTypeId;
      this.isCountersignatureFormVisible = !this.isCountersignatureFormVisible;
    }else if((data.handleStatusId == "02" || data.handleStatusId == "03" || data.handleStatusId == "04")&& data.caseCloseStatusId !='Y'){
      this.cuntersignatureData.caseNo = data.caseNo;
      this.cuntersignatureData.infStep = 3;
      this.cuntersignatureData.infInfoId = data.infInfoId;
      this.cuntersignatureData.infTypeId = data.infTypeId;
      this.isCountersignatureFormVisible = !this.isCountersignatureFormVisible;
    }
  }

  //查詢結果的作業單號碼是否為超連結
  checkInfIdLinkShow(data){
    let isShow = false;
    if(!ValidationUtil.isEmpty(data.handleStatusId) && data.caseCloseStatusId !='Y'){
      isShow = true;
    }
    return isShow;
  }
}