import { Vue, Component, Prop } from "vue-property-decorator";
import { Modal, message } from "ant-design-vue";
import { FblColumnType, FblPDataGridHolder, FblPageEvent} from "../../../data-grid/models";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { InitFlag, CaseHistorySearchForm, CaseHistorySearchValidateForm, FeildValidation, } from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment, { Moment } from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { ComponentDto, GetCaseHistoryCondition, ResponseEntity, GetCaseHistoryOutDto, CaseHistoryDto, DataHubInput, CaseCallUpHistoryDto, CaseCallUpHistoryInput, HandleNoList } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from 'axios';
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import { AuthComonent } from "@/assets/config/CommonUtil";
import InfRecord from '@/components/shared/form/history/infRecord/InfRecord.vue';
import MailRecord from '@/components/shared/form/history/mailHistory/MailHistory.vue';
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import MPlusHistory from "@/components/shared/form/history/mPlusHistory/MPlusHistory.vue";
import CallupHistory from "@/components/shared/form/history/callupHistory/CallupHistory.vue";
import DeptMark from "@/components/shared/form/deptMark/DeptMark.vue";
import HandleInfoForm from "@/components/shared/form/handleInfoForm/HandleInfoForm.vue";
import QuestionAnswer from '@/components/shared/form/history/questionAnswer/QuestionAnswer.vue';
import PostRecord from "@/components/shared/form/history/postRecord/PostRecord.vue";

@Component({
  components: {HiddenFolde, FblDataGrid, 
    DeptMark, InfRecord, MailRecord, QuestionAnswer, DragModal,MPlusHistory, CallupHistory, HandleInfoForm, PostRecord}
})
export default class CaseHistoryForm extends Vue {

  // 畫面元件
  authComponent: AuthComonent ={
    CASESEARHIS_SEARCH : {
        show: false,
        enable: false
    },
    CASESEARHIS_EXPORT : {
        show: false,
        enable: false
    },
    // Pending 件管理使用 案件歷程 component
    PENDDING_MANAGE_CASESEARHIS_SEARCH : {
      show: false,
      enable: false
    },
    // Pending 件管理使用 案件歷程 component
    PENDDING_MANAGE_CASESEARHIS_EXPORT : {
      show: false,
      enable: false
    },

    // 值機畫面的 案件歷程 component
    ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH : {
      show: false,
      enable: false
    },
    // 值機畫面的 案件歷程 component
    ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT : {
      show: false,
      enable: false
    },

  };

  @Prop()
  public caseHistoryParam: { custId?: string; casePolicy?: string };

  

  //DatePicker民國年的格式
  formatter = this.$twDateFormatter;

  caseHistorySearchForm: CaseHistorySearchForm = {
    // 匯入日期
    contactStartDate: null,
    contactEndDate: null,
    datePickerContactStartDate: null,
    datePickerContactEndDate: null,
    contactStartString: "",
    contactEndString: "",
    // 保單號碼
    policyNo01: "",
    policyNo02: "",
    policyNo03: "",
    //受訪者id
    custId: "",
    caseNo:''
  };

  caseHistorySearchValidateForm: CaseHistorySearchValidateForm = {
    contactStartDate: { hover: "", feedback: false, state: "", msg: "" },
    contactEndDate: { hover: "", feedback: false, state: "", msg: "" },
    policyNo01: { hover: "", feedback: false, state: "", msg: "" },
    policyNo02: { hover: "", feedback: false, state: "", msg: "" },
    policyNo03: { hover: "", feedback: false, state: "", msg: "" },
    custId: { hover: "", feedback: false, state: "", msg: "" },
  };

  caseHistorySearchRules: { [key: string]: ValidationRule[] } = {
    contactStartDate: [{ validator: this.validateContactStartDate, trigger: "blur" }],
    contactEndDate: [{ validator: this.validateContactEndDate, trigger: "blur" }],
    policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
    policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
    policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
    custId: [{ validator: this.validateCustId, trigger: "blur" }],
  }

  //日期選擇器hover是否顯示
  isContactStartVisible: boolean = false;
  isContactEndVisible: boolean = false;

  //判斷當下是否可執行匯出
  isExportDisable: boolean = false;
  overMaxRowCountMessage: string = "";

  // ===================================== Grid Modal 點擊相關參數 start========================================================
  caseHistoryPageGridModal:{[key:string]:boolean} ={
    markOrMemoInfoVisible:false, // 交辦部門註記 (行政部門+電訪)紀錄 
    infReocrdvisible:false, //案件歷程-會辦內容
    onMailRecordVisible:false, //案件歷程-Email紀錄
    isPostRecordVisible:false, //案件歷程-Email紀錄
    isQuestionAnswerVisible:false, //案件歷程-保戶回答
    onMPlusAndSendMessageRecordVisible:false,//案件歷程-Mplus紀錄
    isCallUpHistoryVisible:false, //案件歷程-撥號歷程
    notiReocrdvisible:false, //案件歷程-照會內容
  }

  // 交辦部門註記 (行政部門+電訪)紀錄 
  markOrMemoParam = {
    caseNo: "",
  }

  // 保戶回答 modal 參數
  questionAnswerParam: DataHubInput ={
    CASE_NO: "",
    GUID: "",
  };

   // email 歷程 參數
   mailHistoryParam: DataHubInput ={
    CASE_NO: "",
    GUID: "",
  };

  // 郵寄紀錄 參數
  postRecordParam:{caseLogId?:string;caseNo?:string}={
    caseNo:"",
    caseLogId:"",
  }

  // 撥號歷程 modal 參數
  callUpHistoryParam: CaseCallUpHistoryInput ={
    custId: "",
    caseNo: "",
    guid: "",
  };

  // 處理單內容-會辦紀錄/照會紀錄 modal 參數
  handleInfoData: HandleNoList = {}

  // 關閉modal
  onCloseModal(modalName) {
    this.caseHistoryPageGridModal[modalName] = false;
    if(modalName == "isQuestionAnswerVisible"){
      this.questionAnswerParam.CASE_NO = '';
      this.questionAnswerParam.GUID = '';
    }
    if(modalName == "markOrMemoInfoVisible"){
      this.markOrMemoParam.caseNo = "";
    }
  }

  // ===================================== Grid Modal 點擊相關參數 end========================================================


  // ===================================== 驗證 ========================================================

  validateSearch(isRealSearch) {
    var validate = true;
    let validateContactDate = true;

    this.validateContactStartDate(null, this.caseHistorySearchForm.contactStartString, () => {
        if (this.caseHistorySearchValidateForm.contactStartDate.state == 'error') {
          validateContactDate = false;
            validate = false;
        }
    });
    this.validateContactEndDate(null, this.caseHistorySearchForm.contactEndString, () => {
        if (this.caseHistorySearchValidateForm.contactEndDate.state == 'error') {
            validateContactDate = false;
            validate = false;
        }
    });

    // 聯絡日期 有一個為空 驗證錯誤
    if(validateContactDate && (ValidationUtil.isEmpty(this.caseHistorySearchForm.contactStartString) || ValidationUtil.isEmpty(this.caseHistorySearchForm.contactEndString) )){
      this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "error", "hover", this.$t('case_his_valid_contactStarAndEnd_required').toString()); //聯絡日期 起 或 迄 不得為空
      this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "error", "hover", this.$t('case_his_valid_contactStarAndEnd_required').toString()); //聯絡日期 起 或 迄 不得為空
      validate = false;
    }
      //起始與結束皆符合規範才進一步判斷起訖區間
    else if (validateContactDate && !ValidationUtil.isEmpty(this.caseHistorySearchForm.contactStartString) && !ValidationUtil.isEmpty(this.caseHistorySearchForm.contactEndString)) {
      this.validateContactStartAndEndDate(null, this.caseHistorySearchForm.datePickerContactStartDate, this.caseHistorySearchForm.datePickerContactEndDate, 
        this.caseHistorySearchForm.contactStartString, this.caseHistorySearchForm.contactEndString, 
        this.isContactStartVisible, this.isContactEndVisible, () => {
          if (this.caseHistorySearchValidateForm.contactStartDate.state == 'error' || this.caseHistorySearchValidateForm.contactEndDate.state == 'error') {
              validate = false;
          }
      });
    }

    this.validatePolicyNo(null, null, () => {
        if (this.caseHistorySearchValidateForm.policyNo01.state == 'error') {
            validate = false;
        }
    });

    this.validatePolicyNo02(null, null, () => {
        if (this.caseHistorySearchValidateForm.policyNo02.state == 'error') {
            validate = false;
        }
    });

    this.validatePolicyNo03(null, null, () => {
        if (this.caseHistorySearchValidateForm.policyNo03.state == 'error') {
            validate = false;
        }
    });
    this.validateCustId(null, this.caseHistorySearchForm.custId, () => {
        if (this.caseHistorySearchValidateForm.custId.state == 'error') {
            validate = false;
        }
    });


    // 驗證需填入幾個欄位
    if(validate && isRealSearch){
      let countResult = this.checkFilterCount();
      validate = countResult;
      if(!countResult){
        ErrorModalUtil.modalError("保單號碼 或是 受訪者ID ,必須擇一輸入");
      }
    }
    

    return validate;

  }

  /**
   * 驗證需填入幾個欄位搜尋條件
   * 目前為 保單號碼 或 受訪者ID 需填一項
   * @returns 
   */
  checkFilterCount(){

    let isAbleToSearch = true;
    let filterColumn = [];

    Object.keys(this.caseHistorySearchForm).forEach((key)=>{
      // 聯絡日期 不用塞入
      if(key != "contactStartDate" && key != "contactEndDate" && key != "contactStartString" && key != "contactEndString" && key != "datePickerContactStartDate" && key != "datePickerContactEndDate"){
        if(!ValidationUtil.isEmpty(this.caseHistorySearchForm[key])){
          filterColumn.push(key);
        }
      }
    });

    if(filterColumn.length == 0){
      isAbleToSearch = false;
    }

    return isAbleToSearch;
  }

  validateContactStartDate(rule, value, callback) {
    this.isExportDisable = true;
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
        callback();
      } else {
        this.isContactStartVisible = true;
        this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
        callback(() => { });
      }
    }
    callback();
  }
  validateContactEndDate(rule, value, callback) {
    this.isExportDisable = true;
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      const parseDate = this.formatter.parse(value);
      if (parseDate) {
        this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
        callback();
      } else {
        this.isContactEndVisible = true;
        this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
        callback(() => { });
      }
    }
    callback();
  }

  validatePolicyNo(rule, value, callback) {
    this.isExportDisable = true;
    this.feildValidate(this.caseHistorySearchValidateForm.policyNo01, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo01)) {

      if(ValidationUtil.isAnyChinese(this.caseHistorySearchForm.policyNo01)){
        // 保單號碼 不可輸入中文
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo01, true, "error", "hover", this.$t('case_his_valid_policyNo_noChinese').toString());
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "success", "", "");
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo03, false, "success", "", "");
        callback(() => { });
      }else{

        if (!ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo01)) {
          if (ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo02)) {
            // 保單序號 必填
            this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_his_valid_policyNo_required').toString());
          } else if (!ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo02)) {
            // 保單序號 僅可輸入數字
            this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_his_valid_policyNo_error').toString());
          } else {
            this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "success", "", "");
          }
        } else {
          // 保單序號 僅可輸入數字
          if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo02)) {
            this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_his_valid_policyNo_error').toString());
          } else {
            this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "success", "", "");
          }
        }
      }
    } else {
      // 保單序號 僅可輸入數字
      if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo02)) {
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_his_valid_policyNo_error').toString());
      } else {
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "success", "", "");
      }
    }
    callback();
  }
  validatePolicyNo02(rule, value, callback) {
    this.isExportDisable = true;
    this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo02)) {
      if (!ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo02)) {
        // 保單序號 僅可輸入數字
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_his_valid_policyNo_error').toString());
        callback(() => { });
      }
    } else {
      if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo01)) {
        if (!ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo01)) {
          // 保單序號 必填
          this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_his_valid_policyNo_required').toString());
          callback(() => { });
        } else {
          this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "success", "", "");
        }
      }
    }
    callback();
  }
  validatePolicyNo03(rule, value, callback) {
    this.isExportDisable = true;
    this.feildValidate(this.caseHistorySearchValidateForm.policyNo03, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo03)) {
      if (!ValidationUtil.numberOnlyValidation(this.caseHistorySearchForm.policyNo03)) {
        // 保單重複碼 僅可輸入數字
        this.feildValidate(this.caseHistorySearchValidateForm.policyNo03, true, "error", "hover", this.$t('case_his_valid_policyNoDup_error').toString());
        callback(() => { });
      }
    }
    callback();
  }
  validateCustId(rule, value, callback) {
    this.isExportDisable = true;
    this.feildValidate(this.caseHistorySearchValidateForm.custId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
      if (ValidationUtil.alphabetAndNumberValidation(value)) {
        this.feildValidate(this.caseHistorySearchValidateForm.custId, false, "", "", "");
        callback();
      } else {
        //受訪者代碼 僅可輸入英文與數字
        this.feildValidate(this.caseHistorySearchValidateForm.custId, true, "error", "hover", this.$t('case_his_valid_custId_error').toString());
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
  validateContactStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    
    // 如果為同一天，或 聯絡日期(起) 在 聯絡日期(迄) 是在之前 驗證過關
    if (startString == endString || moment(startDate).isBefore(endDate)) {
        
        // 驗證 起迄 區間是否超過90天
        var isOver90Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 90);
        if(isOver90Days){
          dateDisableStart = true;
          dateDisableEnd = true;
          this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "error", "hover", this.$t('case_his_valid_contact_range_over').toString());  //聯絡日期區間超過 90 天
          this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "error", "hover", this.$t('case_his_valid_contact_range_over').toString()); //聯絡日期區間超過 90 天
        }else{
          dateDisableStart = false;
          dateDisableEnd = false;
          this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
          this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
          callback();
        }

    } else {
        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.caseHistorySearchForm.contactStartString) && !ValidationUtil.isEmpty(this.caseHistorySearchForm.contactEndString)) {
            this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
            this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        }
        callback(() => { });
    }
    callback();
  }
  
 // ===================================== Method ========================================================

  /******* 2022/05/10 案件歷程改為 dragModal 此段不需要 START */
  /**
   * 關閉 component (vue 原生)
   */
  // destroyed(){
  //   // call 關閉 component 需要事件
  //   this.onLeave();
  // }

  // /**
  //  * 關閉 component 
  //  */
  // onLeave() {
  //   // 父層 @onLeave -> onCloaseModal
  //   this.$emit('onLeave');
  // }
  /******* 2022/05/10 案件歷程改為 dragModal 此段不需要  END */

  created() {
    // 初始化
    this.initial(InitFlag.CREATED);
    // 案件歷程查詢
    this.getCaseHistoryInfo();
    
  }


  /**
   * 初始化
   * */ 
  initial(initFlag:InitFlag){

    switch (initFlag){
      case InitFlag.CREATED:
            this.initial_created();
          break;
      case InitFlag.RESET:
            this.initial_reset();
          break;
    }

    // 畫面元件 component 權限
    this.$authApi.getAuthComponentUsingGET(this.$route.path)
    .then((res: AxiosResponse<ComponentDto>) => {
        if (res.data.component) {
            this.authComponent.CASESEARHIS_SEARCH = ValidationUtil.isEmpty(res.data.component.CASESEARHIS_SEARCH) ? this.authComponent.CASESEARHIS_SEARCH : res.data.component.CASESEARHIS_SEARCH;
            this.authComponent.CASESEARHIS_EXPORT = ValidationUtil.isEmpty(res.data.component.CASESEARHIS_EXPORT) ? this.authComponent.CASESEARHIS_EXPORT : res.data.component.CASESEARHIS_EXPORT;
            this.authComponent.PENDDING_MANAGE_CASESEARHIS_SEARCH = ValidationUtil.isEmpty(res.data.component.PENDDING_MANAGE_CASESEARHIS_SEARCH) ? this.authComponent.PENDDING_MANAGE_CASESEARHIS_SEARCH : res.data.component.PENDDING_MANAGE_CASESEARHIS_SEARCH;
            this.authComponent.PENDDING_MANAGE_CASESEARHIS_EXPORT = ValidationUtil.isEmpty(res.data.component.PENDDING_MANAGE_CASESEARHIS_EXPORT) ? this.authComponent.PENDDING_MANAGE_CASESEARHIS_EXPORT : res.data.component.PENDDING_MANAGE_CASESEARHIS_EXPORT;
            this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH = ValidationUtil.isEmpty(res.data.component.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH) ? this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH : res.data.component.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH;
            this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT = ValidationUtil.isEmpty(res.data.component.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT) ? this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT : res.data.component.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT;
            // Pending 件管理使用 案件歷程 component
            if(this.$route.path === "/pending-case-management"){
              this.authComponent.CASESEARHIS_SEARCH.show = this.authComponent.PENDDING_MANAGE_CASESEARHIS_SEARCH.show;
              this.authComponent.CASESEARHIS_SEARCH.enable = this.authComponent.PENDDING_MANAGE_CASESEARHIS_SEARCH.enable;
              this.authComponent.CASESEARHIS_EXPORT.show = this.authComponent.PENDDING_MANAGE_CASESEARHIS_EXPORT.show;
              this.authComponent.CASESEARHIS_EXPORT.enable = this.authComponent.PENDDING_MANAGE_CASESEARHIS_EXPORT.enable;
            }
            // 值機畫面的 案件歷程 component
            else if(this.$route.path === "/on-duty"){
              this.authComponent.CASESEARHIS_SEARCH.show = this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH.show;
              this.authComponent.CASESEARHIS_SEARCH.enable = this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_SEARCH.enable;
              this.authComponent.CASESEARHIS_EXPORT.show = this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT.show;
              this.authComponent.CASESEARHIS_EXPORT.enable = this.authComponent.ON_DUTY_PENDDING_MANAGE_CASESEARHIS_EXPORT.enable;
            }
        }
        console.log("CaseHistoryForm: ", JSON.stringify(this.authComponent));

    }).catch((err) => {
        console.log(err);
    });
    
  }

  /**
   * 初始化_打開視窗當下
   * scenario_1 從案件查詢點擊 受訪者Id 查詢條件 -> 聯絡日期 今天前一個月~今天; 受訪者ID
   * scenario_2 從案件查詢點擊 保單號碼 查詢條件 -> 聯絡日期 不需要; 保單號碼
   */
  initial_created(){

    // 屬於 點擊 受訪者Id 情境，設定 初始值
    if(!ValidationUtil.isEmpty(this.caseHistoryParam.custId)){

      this.caseHistorySearchForm.custId = this.caseHistoryParam.custId;

      // 前一個月，且設定 時分秒為 0
      var beforeOneMonths:Moment = moment().add(-1, 'months').set({hour:0,minute:0,second:0,millisecond:0});
      var beforeOneMonthDate = new Date();
      // 聯絡日期起 當日前一個月
      this.caseHistorySearchForm.contactStartDate = beforeOneMonths;
      this.caseHistorySearchForm.datePickerContactStartDate = new Date(beforeOneMonthDate.setDate(beforeOneMonthDate.getDate() - 30));
      this.caseHistorySearchForm.contactStartString = MomentUtil.transformRocYearMonthDay(beforeOneMonths.format("YYYY/MM/DD"));
      // 聯絡日期訖 當日，且設定 時分秒為 0
      this.caseHistorySearchForm.contactEndDate = moment().set({hour:0,minute:0,second:0,millisecond:0});
      // OBD2UAT-102 日期初始化問題，不能用上面的 beforeOneMonthDate 變數當 new Date() 因為已被 -30 天，記憶體位置相同會導致查詢時判斷 起訖有問題
      this.caseHistorySearchForm.datePickerContactEndDate = new Date(); 
      this.caseHistorySearchForm.contactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));
    }

    // 屬於 點擊 保單號碼 情境，設定 初始值
    if(!ValidationUtil.isEmpty(this.caseHistoryParam.casePolicy)){
      var splitCasePolictParam = this.caseHistoryParam.casePolicy.split("-");
      splitCasePolictParam.forEach((eachCasePolicy, i)=>{
        if(i==0){
          this.caseHistorySearchForm.policyNo01 = eachCasePolicy;
        }
        if(i==1){
          this.caseHistorySearchForm.policyNo02 = eachCasePolicy;
        }
        if(i==2){
          this.caseHistorySearchForm.policyNo03 = eachCasePolicy;
        }
      });

      this.caseHistorySearchForm.contactStartDate = null;
      this.caseHistorySearchForm.contactEndDate = null;
      this.caseHistorySearchForm.contactStartString = "";
      this.caseHistorySearchForm.contactEndString = "";
      
    }
    
  } // initial_created end

  /**
   * 初始化_視窗上按下reset
   */
  initial_reset(){

     // 前90天，且設定 時分秒為 0，add -90 會多算一天，需加回 1 天
     var before90Days:Moment = moment().add(-90, 'days').add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0});
     // 聯絡日期起 當日前90天
     this.caseHistorySearchForm.contactStartDate = before90Days;
     this.caseHistorySearchForm.contactStartString = MomentUtil.transformRocYearMonthDay(before90Days.format("YYYY/MM/DD"));
     // 聯絡日期訖 當日，且設定 時分秒為 0
     this.caseHistorySearchForm.contactEndDate = moment().set({hour:0,minute:0,second:0,millisecond:0});
     this.caseHistorySearchForm.contactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));

     this.caseHistorySearchForm.datePickerContactStartDate = moment(this.caseHistorySearchForm.contactStartDate).toDate();
     this.caseHistorySearchForm.datePickerContactEndDate = moment(this.caseHistorySearchForm.contactEndDate).toDate();

    if(!ValidationUtil.isEmpty(this.caseHistoryParam.custId)){
      this.caseHistorySearchForm.custId = this.caseHistoryParam.custId;
    }

    if(!ValidationUtil.isEmpty(this.caseHistoryParam.casePolicy)){
      var splitCasePolictParam = this.caseHistoryParam.casePolicy.split("-");
      splitCasePolictParam.forEach((eachCasePolicy, i)=>{
        if(i==0){
          this.caseHistorySearchForm.policyNo01 = eachCasePolicy;
        }
        if(i==1){
          this.caseHistorySearchForm.policyNo02 = eachCasePolicy;
        }
        if(i==2){
          this.caseHistorySearchForm.policyNo03 = eachCasePolicy;
        }
      });
    }

  } // initial_reset end


  /**
   * 整理查詢案件歷程篩選條件
   */
  arrangeCaseHistoryCondition(){

    var caseHistoryCondition:GetCaseHistoryCondition = {};
    caseHistoryCondition.contactStartDate = ValidationUtil.isEmpty(this.caseHistorySearchForm.contactStartString) ? null : moment(this.caseHistorySearchForm.contactStartDate).format("YYYY/MM/DD") ;
    caseHistoryCondition.contactEndDate = ValidationUtil.isEmpty(this.caseHistorySearchForm.contactEndString) ? null : moment(this.caseHistorySearchForm.contactEndDate).format("YYYY/MM/DD") ;
    caseHistoryCondition.custId = this.caseHistorySearchForm.custId;

    var casePolicy = (()=>{
      var returnCasePolicy = "";
      if(!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo03)){
        returnCasePolicy = this.caseHistorySearchForm.policyNo01 + "-" + this.caseHistorySearchForm.policyNo02 + "-" + this.caseHistorySearchForm.policyNo03;
      }else{
        if(!ValidationUtil.isEmpty(this.caseHistorySearchForm.policyNo02)){
          returnCasePolicy = this.caseHistorySearchForm.policyNo01 + "-" + this.caseHistorySearchForm.policyNo02;  
        }else{
          returnCasePolicy = this.caseHistorySearchForm.policyNo01;
        }
      }
      return returnCasePolicy;
    })();

    caseHistoryCondition.casePolicy = casePolicy;

    return caseHistoryCondition;
  }

  /**
   * 查詢案件歷程
   */
  getCaseHistoryInfo(){
  
    var caseHistoryCondition:GetCaseHistoryCondition={};
    
    var page = this.caseHistoryPageGrid.pagination.current-1;
    var size = this.caseHistoryPageGrid.pagination.pageSize;
    var sort = this.caseHistoryPageGrid.sort ? JSON.stringify([this.caseHistoryPageGrid.sort]) : undefined;
    var caseHistoryCondition = this.arrangeCaseHistoryCondition();
    
    LoadingUtil.show();

    this.$historyApi.getCaseHistoryInfoUsingPOST(page, size, caseHistoryCondition, sort)
    .then((resp:AxiosResponse<GetCaseHistoryOutDto>)=>{
        
      if(resp.data != null){
        if(resp.data.success){
          const p = {...this.caseHistoryPageGrid.pagination};
          p.total = parseInt(resp.data.caseHistoryDtoPage.totalElements);
  
          this.caseHistoryPageGrid.data = resp.data.caseHistoryDtoPage.content;
          this.caseHistoryPageGrid.pagination = p;
          if(p.total == 0){
            //	查無符合篩選條件之資料
            MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
          }
  
          //確認查詢結果是否超出匯出最大限制筆數
          this.$exportApi.checkExportUsingGET(this.caseHistoryPageGrid.pagination.total).then((exportCheck) => {
              if (exportCheck.data.isOverMaxCount) {
                  this.isExportDisable = true;
              }
              this.overMaxRowCountMessage = exportCheck.data.errorMessage;
              LoadingUtil.close();
          }).catch((err) => {
              ErrorModalUtil.modalError(this.$t('error_checkOverExportMaxNum_error').toString()); //確認查詢結果是否超出匯出最大限制筆數失敗
              LoadingUtil.close();
          });

        }else{
          ErrorModalUtil.modalError("案件歷程查詢失敗"); //案件歷程查詢失敗
          LoadingUtil.close();
        }
      }

    }).catch((error)=>{
      ErrorModalUtil.modalError("案件歷程查詢失敗"); //案件歷程查詢失敗
      LoadingUtil.close();
    });

    
  }

  /**
  * 匯出
  */
  exportCaseHistoryInfo(){
    var caseHistoryCondition:GetCaseHistoryCondition = {};
    caseHistoryCondition = this.arrangeCaseHistoryCondition();

    LoadingUtil.show();
    this.$historyApi.exportCaseHistoryInfoUsingPOST(caseHistoryCondition, {responseType : 'blob'})
    .then((resp:AxiosResponse<ResponseEntity>)=>{
        this.dealDownLoadData(resp.data, "案件歷程" + ".xlsx");   // 案件查詢.xlsx
        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
    }).catch((error)=>{
      ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
    }).finally(()=>{
      LoadingUtil.close();
    });
  }

  /**
   * 處理後端回傳的下載內容
   * */
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

  //===========================聯絡日期起訖 相關方法 start ==========================================
  onContactStartChange(date){
    this.caseHistorySearchForm.contactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.caseHistorySearchForm.contactStartDate = date;
    this.isContactStartVisible = false;
    this.isContactEndVisible = false;
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    this.validateSearch(false);
  }

  clearContactStartDate(){
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    this.isContactStartVisible = false;
    this.caseHistorySearchForm.contactStartString = "";
    this.caseHistorySearchForm.contactStartDate = null;
  }
  checkManualInputContactStartDate(data:any){
    this.isContactStartVisible = false;
    this.isContactEndVisible = false;
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
        this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    } else {
        this.isContactStartVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseHistorySearchForm.contactStartDate = parseDate ? parseDate : this.caseHistorySearchForm.contactStartDate;
    this.caseHistorySearchForm.contactStartString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseHistorySearchForm.contactStartDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }
  eventMouseOverContactStart(){
    if (this.caseHistorySearchValidateForm.contactStartDate.feedback) {
        this.isContactStartVisible = true;
    } else {
        this.isContactStartVisible = false;
    }
  }

  onContactEndChange(date){
    this.caseHistorySearchForm.contactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.caseHistorySearchForm.contactEndDate = date;
    this.isContactStartVisible = false;
    this.isContactEndVisible = false;
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    this.validateSearch(false);
  }
  clearContactEndDate(){
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    this.isContactEndVisible = false;
    this.caseHistorySearchForm.contactEndString = "";
    this.caseHistorySearchForm.contactEndDate = null;
  }
  checkManualInputContactEndDate(data: any){
    this.isContactStartVisible = false;
    this.isContactEndVisible = false;
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, true, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "success", "", "");
        this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "success", "", "");
    } else {
        this.isContactEndVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseHistorySearchForm.contactEndDate = parseDate ? parseDate : this.caseHistorySearchForm.contactEndDate;
    this.caseHistorySearchForm.contactEndString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseHistorySearchForm.contactEndDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }
  eventMouseOverContactEnd(){
    if (this.caseHistorySearchValidateForm.contactEndDate.feedback) {
        this.isContactEndVisible = true;
    } else {
        this.isContactEndVisible = false;
    }
  }
  //===========================聯絡日期起訖 相關方法 end ==========================================

  // ===================================== 按鈕 事件 ========================================================
  
  /**
   * 查詢
   */
  searchCaseHistory() { 
    if(this.validateSearch(true)){
      this.isExportDisable = false;
      this.caseHistoryPageGrid.data = [];
      this.caseHistoryPageGrid.pagination.current = 1;
      // 打 案件歷程查詢 ajax
      this.getCaseHistoryInfo();
    }
    
  }

  /**
   * 清除
   */
  resetCaseHistorySearchForm(){ 
    // 清空
    this.caseHistorySearchForm={
      // 匯入日期
      contactStartDate: null,
      contactEndDate: null,
      contactStartString: "",
      contactEndString: "",
      // 保單號碼
      policyNo01: "",
      policyNo02: "",
      policyNo03: "",
      //受訪者id
      custId: "",
    };
    this.caseHistoryPageGrid.data = [];
    this.caseHistoryPageGrid.pagination.total = 0;
    this.clearValidateStatus();
    // 初始化
    this.initial(InitFlag.RESET);
  }

  /**
   * 清空驗證
   */
  clearValidateStatus(){
    this.feildValidate(this.caseHistorySearchValidateForm.contactStartDate, false, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.contactEndDate, false, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.policyNo01, false, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.policyNo02, false, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.policyNo03, false, "", "", "");
    this.feildValidate(this.caseHistorySearchValidateForm.custId, false, "", "", "");
  }

  /**
   * 點擊匯出
   */
  exportSearchResult() { 
    if(!this.isExportDisable){
      if(this.caseHistoryPageGrid.data.length == 0){
        ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出
      }else{
        // 打 匯出 ajax
        this.exportCaseHistoryInfo();
      }
    }else{
      if(ValidationUtil.isEmpty(this.overMaxRowCountMessage)){
        ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
      }else{
        //匯出筆數超過最大限制
        ErrorModalUtil.modalError(this.overMaxRowCountMessage);
      }
    }
  }

 

  // ===================================== Grid 事件 ========================================================

  /**
   * 換頁 
   */
  onPageChange(e: FblPageEvent) {
    if (this.caseHistoryPageGrid.data.length > 0) {
      this.caseHistoryPageGrid.sort = e.sort;
      this.caseHistoryPageGrid.pagination = e.pagination;
      this.getCaseHistoryInfo();
    }
  }

  /**
   * 換行
   */
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


  /**
   * 驗證共用物件
   */
  feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.msg = msg == null ? fv.msg : msg;
  }

  //點擊 交辦部門註記 (行政部門+電訪)
  clickLinkHaveMarkOrMemoInfo(data:CaseHistoryDto){
    this.markOrMemoParam.caseNo = data.caseNo;
    this.caseHistoryPageGridModal.markOrMemoInfoVisible = true;
  }

  // 點擊 撥號歷程 超連結打開視窗
  clickLinkHaveCallUpHis(data:CaseHistoryDto){
    this.callUpHistoryParam.caseNo = data.caseNo;
    this.callUpHistoryParam.guid = data.guid;
    this.caseHistoryPageGridModal.isCallUpHistoryVisible = true;
  }

  // 點擊 照會內容 超連結打開視窗
  clickLinkHaveNoti(data:CaseHistoryDto){
    this.caseHistoryPageGridModal.notiReocrdvisible = true;
    this.handleInfoData = {
      CASE_LOG_GUID: data.guid,
      CASE_NO: data.caseNo,
      TICKET_ID: '',
      TICKET_TYPE: 'OBD_NOTI_INFO',
      TICKET_TYPE_DESC: '',
    }
  }

  getNotiReocrdvisible(val: boolean){
    this.caseHistoryPageGridModal.notiReocrdvisible=val;
  }

  // 點擊 會辦內容 超連結打開視窗
  clickLinkHaveInfInfo(data:CaseHistoryDto){
    // this.questionAnswerParam.GUID=data.guid;
    // this.caseHistorySearchForm.caseNo=data.caseNo;
    this.caseHistoryPageGridModal.infReocrdvisible = true;
    this.handleInfoData = {
      CASE_LOG_GUID: data.guid,
      CASE_NO: data.caseNo,
      TICKET_ID: '',
      TICKET_TYPE: 'OBD_INFO',
      TICKET_TYPE_DESC: '',
    }
  }

  getInfReocrdvisible(val: boolean){
    this.caseHistoryPageGridModal.infReocrdvisible=val;
  }

  // 點擊 郵寄紀錄 超連結打開視窗
  clickLinkHaveSendPack(data:CaseHistoryDto){
    // TODO
    this.postRecordParam.caseLogId = data.guid;
    this.caseHistoryPageGridModal.isPostRecordVisible = true;
  }
  // 點擊 Email紀錄 超連結打開視窗
  clickLinkHaveSendEmail(data:CaseHistoryDto){
   
    this.mailHistoryParam.CASE_NO=data.caseNo;
    this.mailHistoryParam.GUID=data.guid;
    this.caseHistoryPageGridModal.onMailRecordVisible = true;
  }
  // 點擊 M+/簡訊 超連結打開視窗
  clickLinkHaveSendMsg(data:CaseHistoryDto){
    this.mailHistoryParam.CASE_NO=data.caseNo;
    this.mailHistoryParam.GUID=data.guid;
    this.caseHistoryPageGridModal.onMPlusAndSendMessageRecordVisible=true;
  }
  // 點擊 保戶回答 超連結打開視窗
  clickLinkHaveCustAns(data:CaseHistoryDto){
    this.questionAnswerParam.CASE_NO = data.caseNo;
    this.questionAnswerParam.GUID = data.guid;
    this.caseHistoryPageGridModal.isQuestionAnswerVisible = true;
  }


  // ===================================== Grid ========================================================

  caseHistoryPageGrid: FblPDataGridHolder<CaseHistoryDto> = {
    rowKey: "guid",
    data: [],
    pagination: {
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      current: 1,
      pageSize: 15,
      total: 0,
      locale: { items_per_page: "" }
    },
    scroll: { x: 500, y: 370 },
    columns:[
      /** VL903-788 需求書並無寫到 受訪者ID,受訪者姓名,受訪者身分別 欄位，先註解起來 2022/04/10
      ************************************************************************
      {
        type: FblColumnType.PLAIN,
        property: "custId",
        title: this.$t('case_his_grid_custId').toString(),  //受訪者ID
        width: 120,
        fixed: 'left',
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "custName",
        title: this.$t('case_his_grid_custName').toString(),  //受訪者姓名
        width: CommonUtil.countColumnWidth(6),
        fixed: 'left',
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "custTypeCodeName",
        title: this.$t('case_his_grid_custTypeCodeName').toString(),  //受訪者身分別
        width: 100,
        fixed: 'left',
        align: 'center',
      },
      ********************************************************************************/
      {
        type: FblColumnType.PLAIN,
        property: "createDate",
        title: this.$t('case_his_grid_createDate').toString(), //日期
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "obdStageCodeName",
        title: this.$t('case_his_grid_obdStageCodeName').toString(),  //案件階段
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "obdStatusCodeName",
        title: this.$t('case_his_grid_obdStatusCodeName').toString(),  //案件狀態
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuranceCode",
        title: this.$t('case_his_grid_insuranceCode').toString(),  //險種代碼
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "productDesc",
        title: this.$t('case_his_grid_productDesc').toString(),  //商品中文名稱
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "casePolicy",
        title: this.$t('case_his_grid_casePolicy').toString(), //保單號碼
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "submitDate",
        title: this.$t('case_his_grid_submitDate').toString(),  //保單生效日
        width: 110,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "payKindDesc",
        title: this.$t('case_his_grid_payKindDesc').toString(), //繳法
        width: 100,
        align: 'center',
        formatter:(data:CaseHistoryDto)=>{
          // 先抓 payKindDesc
          if(!ValidationUtil.isEmpty(data.payKindDesc)){
            return data.payKindDesc;
          }else{
            // 沒有 payKindDesc 抓 payKind
            if(!ValidationUtil.isEmpty(data.payKind)){
              return data.payKind;
            }else{
              // 沒有 payKindDesc 沒有 payKind 則空白
              return "";
            }
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: "payTypeDesc",
        title: this.$t('case_his_grid_payTypeDesc').toString(), //繳別
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "contractStatusDesc",
        title: this.$t('case_his_grid_contractStatusDesc').toString(),  //契約狀態
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "pherId",
        title: this.$t('case_his_grid_pherId').toString(),  //要保人ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "pherName",
        title: this.$t('case_his_grid_pherName').toString(),  //要保人姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "pherBirthday",
        title: this.$t('case_his_grid_pherBirthday').toString(),  //要保人生日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "pherInsuranceAge",
        title: this.$t('case_his_grid_pherInsuranceAge').toString(), //要保人投保年齡
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuId",
        title: this.$t('case_his_grid_insuId').toString(), //被保險人ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "insuName",
        title: this.$t('case_his_grid_insuName').toString(), //被保險人姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuBirthday",
        title: this.$t('case_his_grid_insuBirthday').toString(), //被保險人生日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "insuInsuranceAge",
        title: this.$t('case_his_grid_insuInsuranceAge').toString(), //被保人投保年齡
        width: 100,
        align: 'center',
      },
       /**
       * OBD2UAT-117
       * 案件歷程聯絡對象欄位刪除，聯絡對象姓名 採用 case 的 custName
       * 畫面、excel、檢視表一起更改
       **********************************************/
      // {
      //   type: FblColumnType.PLAIN,
      //   property: "contactPersonCodeName",
      //   title: this.$t('case_his_grid_contactPersonCodeName').toString(), //聯絡對象
      //   width: 100,
      //   align: 'center',
      // },
      {
        type: FblColumnType.PLAIN,
        property: "contactPersonName",
        title: this.$t('case_his_grid_contactPersonName').toString(), //聯絡對象姓名
        width: 100,
        align: 'center',
      },
      /**********************************************/
      {
        type: FblColumnType.PLAIN,
        property: "contactResultName", // contactResultName 
        title: this.$t('case_his_grid_contactResultName').toString(),  //聯絡結果
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "teleResultName", // teleResultName 
        title: this.$t('case_his_grid_teleResultName').toString(),  //電訪結果
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseCloseReasonCodeName",
        title: this.$t('case_his_grid_caseCloseReasonCodeName').toString(),  //結案原因
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseCloseDate",
        title: this.$t('case_his_grid_caseCloseDate').toString(),  //結案日期
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveCallUpHis",
        title: this.$t('case_his_grid_haveCallUpHis').toString(),  //撥號歷程
        width: 100,
        align: 'center',
        template: "alink_haveCallUpHis_Template"
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "taskName",
        title: this.$t('case_his_grid_taskName').toString(), //電訪項目
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "questName",
        title: this.$t('case_his_grid_questName').toString(),  //問卷名稱
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveCustAns",
        title: this.$t('case_his_grid_haveCustAns').toString(),  //通話內容
        width: 100,
        align: 'center',
        template: "alink_haveCustAns_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveNoti",
        title: this.$t('case_his_grid_haveNoti').toString(),  //照會內容
        width: 100,
        align: 'center',
        template: "alink_haveNoti_Template", 
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveInfInfo",
        title: this.$t('case_his_grid_haveInfInfo').toString(),  //會辦內容
        width: 100,
        align: 'center',
        template: "alink_haveInfInfo_Template",
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "lawReason",
        title: this.$t('case_his_grid_lawReason').toString(), //法源/內控依據
        width: CommonUtil.countColumnWidth(14),
        align: 'center',
      },
      // {
      //   type: FblColumnType.ELLIPSIS,
      //   property: "contractorMemo",
      //   title: this.$t('case_his_grid_contractorMemo').toString(), //交辦部門註記-行政部門
      //   width: CommonUtil.countColumnWidth(15),
      //   align: 'center',
      // },
      // {
      //   type: FblColumnType.ELLIPSIS,
      //   property: "caseMark",
      //   title: this.$t('case_his_grid_caseMark').toString(), //交辦部門註記-行政部門-電訪
      //   width: CommonUtil.countColumnWidth(15),
      //   align: 'center',
      // },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveMarkOrMemoInfo",
        title: this.$t('case_his_grid_haveMarkOrMemoInfo').toString(),  //交辦部門註記 (行政部門+電訪)
        width: 100,
        align: 'center',
        template: "alink_haveMarkOrMemoInfo_Template",
      },
      {
        type: FblColumnType.PLAIN,
        property: "dueContDate",
        title: this.$t('case_his_grid_dueContDate').toString(), //應電訪日
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentAssignTime",
        title: this.$t('case_his_grid_agentAssignTime').toString(), //指定聯絡時段
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "visistDate",
        title: this.$t('case_his_grid_visistDate').toString(), //方便聯絡時段
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "callFreqDay",
        title: this.$t('case_his_grid_callFreqDay').toString(), //已電訪天數
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "callFreqVisit",
        title: this.$t('case_his_grid_callFreqVisit').toString(), //已電訪次數
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "changeNo",
        title: this.$t('case_his_grid_changeNo').toString(),  //受理案號
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "packNo",
        title: this.$t('case_his_grid_packNo').toString(),  //名單序號
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "sysTypeCodeName",
        title: this.$t('case_his_grid_sysTypeCodeName').toString(), //通路別
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentUnitNo",
        title: this.$t('case_his_grid_agentUnitNo').toString(),  //單位代號
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentUnitName",
        title: this.$t('case_his_grid_agentUnitName').toString(),  //單位名稱
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentId",
        title: this.$t('case_his_grid_agentId').toString(),  //業務員ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.ELLIPSIS,
        property: "agentName",
        title: this.$t('case_his_grid_agentName').toString(),  //業務員姓名
        width: CommonUtil.countColumnWidth(6),
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentId2",
        title: this.$t('case_his_grid_agentId2').toString(), //第二業務員ID
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "agentName2",
        title: this.$t('case_his_grid_agentName2').toString(), //第二業務員姓名
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "unitName",
        title: this.$t('case_his_grid_unitName').toString(), //科別
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "userName",
        title: this.$t('case_his_grid_userName').toString(), //電訪員
        width: 100,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "underwritableDate",
        title: this.$t('case_his_grid_underwritableDate').toString(),  //核保通過日
        width: 110,
        align: 'center',
      },
      {
        type: FblColumnType.PLAIN,
        property: "policySendDate",
        title: this.$t('case_his_grid_policySendDate').toString(),  //保單郵寄日
        width: 110,
        align: 'center',
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveSendPack",
        title: this.$t('case_his_grid_haveSendPack').toString(),  //郵寄記錄
        width: 100,
        align: 'center',
        template: "alink_haveSendPack_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveSendEmail",
        title: this.$t('case_his_grid_haveSendEmail').toString(), //Email記錄
        width: 100,
        align: 'center',
        template: "alink_haveSendEmail_Template",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "haveSendMsg",
        title: this.$t('case_his_grid_haveSendMsg').toString(), //M+/簡訊記錄
        width: 100,
        align: 'center',
        template: "alink_haveSendMsg_Template",
      },
    ]
  } // grid end

}