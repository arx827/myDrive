import { Vue, Component } from "vue-property-decorator";
import {
  FblColumnType,
  FblPageEvent,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import MomentUtil from "@/assets/config/MomentUtil";
import { Option, ReviewCaseGrid, ReviewCaseInput } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import { FeildValidation, ReviewSearchValidateForm, reviewTypeEnum, ReviewInfData, reviewStatusEnum } from "./model";
import "@/assets/less/infPage.less";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { message } from "ant-design-vue";
import CuntersignatureModal from "@/components/shared/countersignatureModal/CountersignatureModal.vue";
import CommonUtil from "@/assets/config/CommonUtil";
import CountersignatureModalVue from "@/components/shared/countersignatureModal/CountersignatureModal.vue";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import SuspectiveModal from "@/components/shared/suspectiveModal/SuspectiveModal.vue";
import PhoneChangeModal from "@/components/shared/phoneChangeModal/PhoneChangeModal.vue";
import NotificationModal from "@/components/shared/notificationMadal/NotificationModal.vue";
import { LoginModule } from "@/plugins/store/LoginModule";


@Component({
  components: { FblDataGrid, HiddenFolde, CuntersignatureModal, CountersignatureModalVue, DragModal, PhoneChangeModal, SuspectiveModal, NotificationModal }
})
export default class ReviewCasePage extends Vue {

  //查詢條件
  reviewCaseSearchForm = {
    policyNo01: "",
    policyNo02: "",
    policyNo03: "",
    taskIdList: [], // 電訪項目
    departmentIdList: [], //部門
    divisionIdList: [], //科別
    tmrIdList: [], //電訪員
    caseStage: "", // 案件階段
    caseStatus: "", // 案件狀態
    reviewType: [], // 覆核類型
    reviewStatusList: [], // 覆核狀態
    reviewStartDate: null, //送核日期
    reviewEndDate: null,
    reviewStartString: "",
    reviewEndString: "",
  };

  //
  reviewCaseSearchInput: ReviewCaseInput = {
    policyNo: "",
    policySeq: "",
    idDup: "",
    taskIdList: [],
    depIdList: [],
    divIdList: [],
    tmrIdList: [],
    caseStage: "",
    caseStatus: "",
    reviewType: [],
    reviewStatus: [],
    reviewStartDate: null,
    reviewEndDate: null,
    reviewMenuPage:false
  };

  //是否包含代理人
  isIncludeAgent: boolean = false;

  //查詢表單驗證規則
  reviewCaseSearchRule: { [key: string]: ValidationRule[] } = {
    policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
    policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
    policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
    // custId: [{ validator: this.validateCustId, trigger: "blur" }],
    // reviewStart: [{ validator: this.validateSendStart, trigger: "blur" }],
    // reviewEnd: [{ validator: this.validateSendEnd, trigger: "blur" }],
    // expiryStart: [{ validator: this.validateExpiryStart, trigger: "blur" }],
    // expiryEnd: [{ validator: this.validateExpiryEnd, trigger: "blur" }],
  };

  //欄位驗證提示工具
  reviewSearchValidateForm :ReviewSearchValidateForm = {
    reviewStart: { hover: "", feedback: false, state: "success", msg: "" },
    reviewEnd: { hover: "", feedback: false, state: "success", msg: "" },
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
  isReviewStartVisible: boolean = false;
  isReviewEndVisible: boolean = false;
  isSendStartVisible: boolean = false;
  isSendEndVisible: boolean = false;

  //部門科別預設值
  departmentDefaultId: string;
  divdefaultId: string;

  // 會辦覆核單是否顯示
  isReviewInfFormVisible: boolean = false;
  // 電話變更覆核單是否顯示
  isPcFormVisible: boolean = false;
  // 憂質覆核單是否顯示
  isSusFormVisible: boolean = false;
  // 照會覆核單是否顯示
  isNotiFormVisible: boolean = false;

  reviewData: ReviewInfData = {
    infStep: 0,
    infInfoId: "",
    caseNo: "",
    infTypeId:"",
    packNo:"",
    caseLogId: ""
  };

  // notificationData: ReviewInfData = {
  //   infStep: 0,
  //   infInfoId: "",
  //   caseNo: "",
  //   infTypeId:"",
  //   packNo:""
  // };

  isReviewStatusDisable: boolean = false;

  // ===================================== Grid ========================================================
  grid: FblPDataGridHolder<ReviewCaseGrid> = {
    rowKey: "reviewNo",
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
        property: "reviewNo",
        template: "ReviewNoTemplate",
        title: this.$t("infPage_infInfoIdNo").toString(),
        width: 160,
        align: 'center'
      },
      {
        // 覆核狀態
        type: FblColumnType.TEMPLATE,
        property: "reviewStatusName",
        template: "ReviewStatusTemplate",
        title: this.$t("infPage_reviewStatus").toString(),
        width: 80,
        align: 'center',
      },
      {
        // 案件階段
        type: FblColumnType.PLAIN,
        property: "obdStageName",
        title: this.$t("pedding_caseStage").toString(),
        width: 80,
        align: 'center'
      },
      {
        // 案件狀態
        type: FblColumnType.PLAIN,
        property: "obdStatusName",
        title: this.$t("pedding_caseStatus").toString(),
        width: 130,
        align: 'center'
      },
      {
        // 覆核類型
        type: FblColumnType.PLAIN,
        property: "typeName",
        title: this.$t("reviewSP_reviewSettingType").toString(),
        width: 100,
        align: 'center'
      },
      {
        // 保單號碼
        type: FblColumnType.PLAIN,
        property: "casePolicy",
        title: this.$t("pedding_policyNo").toString(),
        width: 120,
        align: 'center'
      },
      {
        // 受訪者ID
        type: FblColumnType.ELLIPSIS,
        property: "custId",
        title: this.$t("pedding_custId").toString(),
        width: CommonUtil.countColumnWidth(6),
        align: 'center'
      },
      {
        // 受訪者姓名
        type: FblColumnType.ELLIPSIS,
        property: "custName",
        title: this.$t("infPage_custName").toString(),
        width: CommonUtil.countColumnWidth(6),
        align: 'center'
      },
      {
        // 受訪者身分
        type: FblColumnType.PLAIN,
        property: "custTypeName",
        title: this.$t("pedding_custType").toString(),
        width: 100,
        align: 'center'
      },
      {
        // 電訪項目
        type: FblColumnType.PLAIN,
        property: "taskName",
        title: this.$t("userTask").toString(),
        width: 120,
        align: 'center'
      },
      {
        // 送核日期
        type: FblColumnType.PLAIN,
        property: "reviewDate",
        title: this.$t("review_date").toString(),
        width: 120,
        align: 'center',
        formatter:(data: ReviewCaseGrid) => {
          return data.reviewDate ? MomentUtil.transformRocYearMonthDay(data.reviewDate) : data.reviewDate;
        }
      },
      {
        // 通路別
        type: FblColumnType.PLAIN,
        property: "sysTypeName",
        title: this.$t("pedding_sysType").toString(),
        width: 120,
        align: 'center'
      },
      {
        // 單位代碼
        type: FblColumnType.PLAIN,
        property: "agentUnitNo",
        title: this.$t("userF_unitCode").toString(),
        width: 80,
        align: 'center'
      },
      {
        // 單位名稱
        type: FblColumnType.PLAIN,
        property: "agentUnitName",
        title: this.$t("pedding_agentUnitName").toString(),
        width: 140,
        align: 'center'
      },
      {
        // 部門別
        type: FblColumnType.PLAIN,
        property: "depName",
        title: this.$t("pedding_department").toString(),
        width: 80,
        align: 'center'
      },
      {
        // 科別
        type: FblColumnType.PLAIN,
        property: "divName",
        title: this.$t("global_division").toString(),
        width: 120,
        align: 'center'
      },
      {
        // 電訪員
        type: FblColumnType.PLAIN,
        property: "tmrName",
        title: this.$t("global_telemarketer").toString(),
        width: 140,
        align: 'center'
      },
    ]
  };


  // ===================================== 下拉式選單 ========================================================
  // 部門
  selectDepOptions: Option[] = [];
  // 科別
  selectDiviOptions: Option[] = [];
  // 電訪員
  selectTmrOptions: Option[] = [];
  //使用者清單
  allUserList: Option[] = [];
  //使用者部門清單
  allDivList: Option[] = [];
  // 案件階段
  caseStageOptions: Option[] = [];
  // 案件狀態
  caseStatusOptions: Option[] = [];
  // 覆核類別
  reviewTypeOptions: Option[] = [];
  // 覆核狀態
  reviewStatusOptions: Option[] = [];
  // 電訪項目
  taskOptions: Option[] = [];



  depUnitInfo = {};
  depUserInfo = {};
  unitUserInfo = {};

  // ===================================== 發送日期 DatePicker 事件 ========================================================
  
  //開始日期變動
  onReviewStartChange(date){
    this.reviewCaseSearchForm.reviewStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isReviewStartVisible = false;
    this.isReviewEndVisible = false;
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    this.sendDateVaildate();
  }

  //結束日期變動
  onReviewEndChange(date){
    this.reviewCaseSearchForm.reviewEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isReviewStartVisible = false;
    this.isReviewEndVisible = false;
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    this.sendDateVaildate();
  }

  //滑鼠移入
  eventMouseOverReviewStart(){
    if (this.reviewSearchValidateForm.reviewStart.feedback) {
      this.isReviewStartVisible = true;
    } else {
        this.isReviewStartVisible = false;
    }
  }

  //滑鼠移入
  eventMouseOverReivewEnd(){
    if (this.reviewSearchValidateForm.reviewEnd.feedback) {
      this.isReviewEndVisible = true;
    } else {
        this.isReviewEndVisible = false;
    }
  }

  //開始日期清除
  clearReviewStartDate() {
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    this.isReviewStartVisible = false;
    this.reviewCaseSearchForm.reviewStartString = "";
    this.reviewCaseSearchForm.reviewStartDate = null;
    this.sendDateVaildate();
  }

  //結束日期清除
  clearReviewEndDate() {
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    this.isReviewEndVisible = false;
    this.reviewCaseSearchForm.reviewEndString = "";
    this.reviewCaseSearchForm.reviewEndDate = null;
    this.sendDateVaildate();
  }

  //手動輸入起始日期
  checkManualInputReviewStartDate(data: any) {
    this.isReviewStartVisible = false;
    this.isReviewEndVisible = false;
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
      this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    } else {
      this.isReviewStartVisible = true;
      // 日期錯誤
      this.feildValidate(this.reviewSearchValidateForm.reviewStart, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.reviewCaseSearchForm.reviewStartDate = parseDate ? parseDate : this.reviewCaseSearchForm.reviewStartDate;
    this.reviewCaseSearchForm.reviewStartString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.reviewCaseSearchForm.reviewStartDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //手動輸入結束日期
  checkManualInputReviewEndDate(data: any) {
    this.isReviewStartVisible = false;
    this.isReviewEndVisible = false;
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
      this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    } else {
      this.isReviewEndVisible = true;
      // 日期錯誤
      this.feildValidate(this.reviewSearchValidateForm.reviewEnd, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.reviewCaseSearchForm.reviewEndDate = parseDate ? parseDate : this.reviewCaseSearchForm.reviewEndDate;
    this.reviewCaseSearchForm.reviewEndString = parseDate ?
      MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.reviewCaseSearchForm.reviewEndDate.toString()))) :
      data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  
  // ===================================== 事件 ========================================================

  // 重整頁面
  reload(){
    LoadingUtil.show();
    this.$reviewCaseApi.paginateReviewCaseProgressUsingPOST(this.grid.pagination.current-1,this.grid.pagination.pageSize, this.reviewCaseSearchInput)
    .then((resp) => {
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
  setReviewCaseInitFilter(){
    switch(this.$route.name){
      case 'REVIEW_NOTI' :
        //照會
        this.setReviewCaseNotiFilter();
        break;
      case 'REVIEW_INF' :
        //會辦
        this.setReviewCaseInfFilter();
        break;
      case 'REVIEW_PC' :
        this.setReviewCasePcFilter();
        //電話變更
        break;
      case 'REVIEW_SUSPECTIVE' :
        //憂質
        this.setReviewCaseSuspectiveFilter();
        break;
      case 'REVIEW_MENU' :
        //待覆核
        this.setPendingCaseFilter();
        break;
    }
  }

  //設定照會的固定查詢參數
  setReviewCaseNotiFilter(){
    // 不給選覆核類型
    this.isReviewStatusDisable = true;
    this.reviewCaseSearchForm.reviewType = [reviewTypeEnum.NOTI];
  }
  //設定照會的固定查詢參數
  setReviewCaseInfFilter(){
    // 不給選覆核類型
    this.isReviewStatusDisable = true;
    this.reviewCaseSearchForm.reviewType = [reviewTypeEnum.INF];
  }
  //設定照會的固定查詢參數
  setReviewCasePcFilter(){
    // 不給選覆核類型
    this.isReviewStatusDisable = true;
    this.reviewCaseSearchForm.reviewType = [reviewTypeEnum.PC];
  }
  //設定照會的固定查詢參數
  setReviewCaseSuspectiveFilter(){
    // 不給選覆核類型
    this.isReviewStatusDisable = true;
    this.reviewCaseSearchForm.reviewType = [reviewTypeEnum.SUSPECTIVE];
  }
  //待覆核固定查詢參數
  setPendingCaseFilter(){
    this.reviewCaseSearchForm.tmrIdList.push(LoginModule.loginState.me.id);
    this.reviewCaseSearchForm.divisionIdList.push(LoginModule.loginState.me.employee.departmentId);
    this.reviewCaseSearchForm.departmentIdList.push(LoginModule.loginState.me.employee.unitIdLevel3);
    this.reviewCaseSearchInput.reviewMenuPage = true;
    this.reviewCaseSearchForm.reviewStatusList = [reviewStatusEnum.pending, reviewStatusEnum.reivewReturn]
  }

  // ===================================== Search 事件 ========================================================
  // 查詢
  reviewCaseSearch() {
    // 轉大寫後查詢
    this.reviewCaseSearchForm.policyNo01 = this.reviewCaseSearchForm.policyNo01.toUpperCase();
    if(this.validateSearch()){
      this.reviewCaseSearchInput.taskIdList = this.reviewCaseSearchForm.taskIdList;
      this.reviewCaseSearchInput.caseStage = this.reviewCaseSearchForm.caseStage;
      this.reviewCaseSearchInput.caseStatus = this.reviewCaseSearchForm.caseStatus;
      this.reviewCaseSearchInput.depIdList = this.reviewCaseSearchForm.departmentIdList;
      this.reviewCaseSearchInput.divIdList = this.reviewCaseSearchForm.divisionIdList;
      this.reviewCaseSearchInput.tmrIdList = this.reviewCaseSearchForm.tmrIdList;
      this.reviewCaseSearchInput.policyNo = this.reviewCaseSearchForm.policyNo01;
      this.reviewCaseSearchInput.policySeq = this.reviewCaseSearchForm.policyNo02;
      this.reviewCaseSearchInput.idDup = this.reviewCaseSearchForm.policyNo03;
      this.reviewCaseSearchInput.reviewStatus = this.reviewCaseSearchForm.reviewStatusList;
      this.reviewCaseSearchInput.reviewType = this.reviewCaseSearchForm.reviewType;
      this.reviewCaseSearchInput.reviewStartDate = this.reviewCaseSearchForm.reviewStartDate ? MomentUtil.default(this.reviewCaseSearchForm.reviewStartDate) : this.reviewCaseSearchForm.reviewStartDate;
      this.reviewCaseSearchInput.reviewEndDate =  this.reviewCaseSearchForm.reviewEndDate ? MomentUtil.default(this.reviewCaseSearchForm.reviewEndDate) : this.reviewCaseSearchForm.reviewEndDate;
      this.reviewCaseSearchInput.includeAgent = this.isIncludeAgent;
      this.grid.pagination.current = 1;
      this.reload();
    }
  }

  //查詢前驗證檢核
  validateSearch(){
    let validate = true;

    this.validatePolicyNo02(null, null, () => {
      if (this.reviewSearchValidateForm.policyNo02.state == 'error') {
        validate = false;
      }
    });

    this.validatePolicyNo03(null, null, () => {
      if (this.reviewSearchValidateForm.policyNo03.state == 'error') {
        validate = false;
      }
    });
    
    if(!this.sendDateVaildate()){
      validate = false;
    }


    if(validate && !this.isIncludeAgent){
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
    this.validateSendStart(null, this.reviewCaseSearchForm.reviewStartString, () => {
      if (this.reviewSearchValidateForm.reviewStart.state == 'error') {
        validate = false;
      }
    });
    this.validateSendEnd(null, this.reviewCaseSearchForm.reviewEndString, () => {
      if (this.reviewSearchValidateForm.reviewEnd.state == 'error') {
        validate = false;
      }
    });
    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validate && !ValidationUtil.isEmpty(this.reviewCaseSearchForm.reviewStartString) && !ValidationUtil.isEmpty(this.reviewCaseSearchForm.reviewEndString)) {
      this.validateSendStartAndEndDate(null, this.reviewCaseSearchForm.reviewStartDate, this.reviewCaseSearchForm.reviewEndDate, this.reviewCaseSearchForm.reviewStartString,
      this.reviewCaseSearchForm.reviewEndString, this.isSendStartVisible, this.isSendEndVisible, () => {
        if (this.reviewSearchValidateForm.reviewStart.state == 'error' || this.reviewSearchValidateForm.reviewEnd.state == 'error') {
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

    Object.keys(this.reviewCaseSearchForm).forEach((key=>{
      if(key != 'reviewStartDate' && key !='reviewEndDate' && key !='expiryStartDate' && key !='expiryEndDate' && key !='infType'){
        if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm[key])) {
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
      if(filterColumn.some((c)=> c == "reviewStartString" || c == "reviewEndString")){
        count ++;
        filterColumn = filterColumn.filter((c)=> c != "reviewStartString" && c != "reviewEndString");
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
  reviewCaseSearchReset() {
    this.reviewCaseSearchForm = {
      taskIdList: [],
      policyNo01: "",
      policyNo02: "",
      policyNo03: "",
      departmentIdList: [], //部門
      divisionIdList: [], //科別
      tmrIdList: [], //電訪員
      caseStage:"",
      reviewStartDate: null, //發送日期
      reviewEndDate: null,
      reviewStartString: "",
      reviewEndString: "",
      caseStatus: "",
      reviewStatusList: [],
      reviewType: [],
    };

    this.grid.data = [];
    this.grid.pagination.total = 0;
    this.clearValidateStatus();
    this.setReviewCaseInitFilter();
    this.onSelectDept();
    this.onSeletDivi();
  }

  //清除查詢條件的驗證狀態
  clearValidateStatus() {
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.policyNo02, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.policyNo01, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.policyNo03, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.custId, false, "success", "", "");
    this.isSendStartVisible = false;
    this.isSendEndVisible = false;
    this.isReviewStartVisible = false;
    this.isReviewEndVisible = false;
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
    
    if (this.reviewCaseSearchForm.departmentIdList.length > 0) {

      this.reviewCaseSearchForm.departmentIdList.forEach((depId) => {
        
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
    let unitIdTempList = Object.assign(this.reviewCaseSearchForm.divisionIdList);
    unitIdTempList.forEach((eachSelected)=>{

      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
        if(this.reviewCaseSearchForm.divisionIdList.length > 0) {
          this.reviewCaseSearchForm.divisionIdList = this.reviewCaseSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.reviewCaseSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.reviewCaseSearchForm.tmrIdList.length > 0) {
          this.reviewCaseSearchForm.tmrIdList = this.reviewCaseSearchForm.tmrIdList.filter(userId => userId != eachSelected);
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
    if(this.reviewCaseSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.reviewCaseSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.reviewCaseSearchForm.departmentIdList.length > 0) {

        this.reviewCaseSearchForm.departmentIdList.forEach((depId) => {
  
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
    let userIdTempList = Object.assign(this.reviewCaseSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.reviewCaseSearchForm.tmrIdList.length > 0) {
          this.reviewCaseSearchForm.tmrIdList = this.reviewCaseSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }


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
    this.setReviewCaseInitFilter();
    this.$reviewCaseApi.reviewCasesSearchInitUsingGET()
    .then((resp) => {
      this.caseStageOptions = resp.data.caseStage;
      this.caseStatusOptions = resp.data.caseStatus;
      this.reviewStatusOptions = resp.data.reviewStatus;
      this.reviewTypeOptions = resp.data.reviewType;
      this.taskOptions = resp.data.taskOption;
    if(resp.data.unitDepInfo != null){

        // 部門對應科別/人員資料
        this.depUnitInfo = resp.data.unitDepInfo.depUnitInfo;
        this.depUserInfo = resp.data.unitDepInfo.depUserInfo;

        // 科別對應人員資料
        this.unitUserInfo = resp.data.unitDepInfo.unitUserInfo;

        // 部門 下拉
        this.selectDepOptions = Object.assign(resp.data.unitDepInfo.departOptions);
        
        // 科別 下拉
        this.allDivList = resp.data.unitDepInfo.unitList;
        
        // 電訪員 下拉
        this.allUserList = resp.data.unitDepInfo.userList;

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
      this.reviewCaseSearch();
    }).catch((err)=>{
          LoadingUtil.close();
          // 覆核查詢 下拉選單載入失敗
          ErrorModalUtil.modalError(this.$t('reviewSearchError').toString());
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
    this.feildValidate(this.reviewSearchValidateForm.policyNo01, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo01)) {
      if (!ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo01)) {
          if (ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo02)) {
            // 保單序號 必填
            this.feildValidate(this.reviewSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqRequired').toString());
          } else if (!ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo02)) {
            // 保單序號 僅可輸入數字
            this.feildValidate(this.reviewSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
          } else {
            this.feildValidate(this.reviewSearchValidateForm.policyNo02, false, "success", "", "");
          }
      } else {
        // 保單序號 僅可輸入數字
        if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo02)) {
          this.feildValidate(this.reviewSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
        } else {
          this.feildValidate(this.reviewSearchValidateForm.policyNo02, false, "success", "", "");
        }
      }
    } else {
      // 保單序號 僅可輸入數字
      if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo02)) {
        this.feildValidate(this.reviewSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
      } else {
        this.feildValidate(this.reviewSearchValidateForm.policyNo02, false, "success", "", "");
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
    this.feildValidate(this.reviewSearchValidateForm.policyNo02, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo02)) {
      if (!ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo02)) {
        // 保單序號 僅可輸入數字
        this.feildValidate(this.reviewSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqFormatError').toString());
        callback(() => { });
      }
    } else {
      if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo01)) {
        if (!ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo01)) {
          // 保單序號 必填
          this.feildValidate(this.reviewSearchValidateForm.policyNo02, true, "error", "hover", this.$t('infPage_policyNoSeqRequired').toString());
          callback(() => { });
        } else {
          this.feildValidate(this.reviewSearchValidateForm.policyNo02, false, "success", "", "");
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
    this.feildValidate(this.reviewSearchValidateForm.policyNo03, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.policyNo03)) {
      if (!ValidationUtil.numberOnlyValidation(this.reviewCaseSearchForm.policyNo03)) {
        // 保單重複碼 僅可輸入數字
        this.feildValidate(this.reviewSearchValidateForm.policyNo03, true, "error", "hover", this.$t('infPage_policyNoDupFormatError').toString());
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
  // validateCustId(rule, value, callback) {
  //   this.feildValidate(this.reviewSearchValidateForm.custId, false, "", "", "");
  //   if (!ValidationUtil.isEmpty(value)) {
  //     if (ValidationUtil.alphabetAndNumberValidation(value)) {
  //       this.feildValidate(this.reviewSearchValidateForm.custId, false, "", "", "");
  //       callback();
  //     } else {
  //       //受訪者代碼 僅可輸入英文與數字
  //       this.feildValidate(this.reviewSearchValidateForm.custId, true, "error", "hover", this.$t('infPage_custIdFormatError').toString());
  //       callback(() => { });
  //     }
  //   }
  //   callback();
  // }

  /**
  * 發送日期格式驗證(起)
  * @param rule 驗證規則 
  * @param value 日期
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSendStart(rule, value, callback) {
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
        callback();
      } else {
        this.isSendStartVisible = true;
        this.feildValidate(this.reviewSearchValidateForm.reviewStart, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
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
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
        callback();
      } else {
        this.isSendEndVisible = true;
        this.feildValidate(this.reviewSearchValidateForm.reviewEnd, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
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
    this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
    this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
    if (startString == endString || moment(startDate).isBefore(endDate)) {
      dateDisableStart = false;
      dateDisableEnd = false;
      this.feildValidate(this.reviewSearchValidateForm.reviewStart, false, "success", "", "");
      this.feildValidate(this.reviewSearchValidateForm.reviewEnd, false, "success", "", "");
      callback();
    } else {
      dateDisableStart = true;
      dateDisableEnd = true;
      if (!ValidationUtil.isEmpty(this.reviewCaseSearchForm.reviewStartString) && !ValidationUtil.isEmpty(this.reviewCaseSearchForm.reviewEndString)) {
        this.feildValidate(this.reviewSearchValidateForm.reviewStart, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        this.feildValidate(this.reviewSearchValidateForm.reviewEnd, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
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

  //覆核單開啟開啟
  handleInspectClick(data:ReviewCaseGrid, isReview: boolean){
    // 未處理、處理中
    if(data.type == reviewTypeEnum.INF){
      this.isReviewInfFormVisible = true;
      this.reviewData.caseNo = data.caseNo;
      this.reviewData.infStep = 0;
      this.reviewData.infInfoId = data.reviewNo;
      this.reviewData.packNo = data.packNo;
      // 是否能使用覆核功能
      this.reviewData.isReview = isReview;
    } else if(data.type == reviewTypeEnum.PC){
      this.isPcFormVisible = true;
      this.reviewData.caseNo = data.caseNo;
      this.reviewData.infStep = 0;
      this.reviewData.infInfoId = data.reviewNo;
      // 是否能使用覆核功能
      this.reviewData.isReview = isReview;
    } else if (data.type == reviewTypeEnum.SUSPECTIVE){
      this.isSusFormVisible = true;
      this.reviewData.caseNo = data.caseNo;
      this.reviewData.infStep = 0;
      this.reviewData.infInfoId = data.reviewNo;
      this.reviewData.packNo = data.packNo;
      // 是否能使用覆核功能
      this.reviewData.isReview = isReview;
    } else if (data.type == reviewTypeEnum.NOTI){
      this.isNotiFormVisible = true;
      this.reviewData.caseNo = data.caseNo;
      this.reviewData.infStep = 4;
      this.reviewData.infInfoId = data.reviewNo;
      this.reviewData.packNo = data.packNo;
      // 是否能使用覆核功能
      this.reviewData.isReview = isReview;
      this.reviewData.caseLogId = data.caseLogId;
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

  // 關閉彈跳視窗
  onCloseModal(){
    this.isReviewInfFormVisible = false;
    this.isPcFormVisible = false;
    this.isSusFormVisible = false;
    this.isNotiFormVisible = false;
  }
}