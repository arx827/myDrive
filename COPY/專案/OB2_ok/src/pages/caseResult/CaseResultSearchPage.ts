import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
  } from "@/components/shared/data-grid/models";
  import { Modal, message } from "ant-design-vue";
import { AuthComonent } from "@/assets/config/CommonUtil";
import { SelectOption, CaseResultPageSearchForm, CaseResultPageSearchValidateForm, FeildValidation } from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { ComponentDto, Option, CaseSearchInfInitData, GetCaseSearchInDto, GetCaseSearchCondition, CaseResultSearchCondition,GetCaseResultSearchOutDto,GetCaseResultSearchInDto,
    GetCaseSearchOutDto, CaseSearchDto, ExportCaseSearchInDto, ResponseEntity, DataHubInput, CaseCallUpHistoryDto, CaseCallUpHistoryInput, HandleNoList,CaseResultSearchDto
   } from "@fubonlife/obd-api-axios-sdk";
import CommonUtil from "@/assets/config/CommonUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import {AxiosResponse} from 'axios';
import axios from 'axios';
import MessageUtil from "@/assets/config/MessageUtil";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";


//@component宣告以下class是一個vue元件，後面components:{}表示要在此class中使用的其他已宣告元件
@Component({
    components: { 
        FblDataGrid, 
        HiddenFolde, 
      }
  })


export default class CaseResultSearch extends Vue {    //vue class component 寫法此整個區塊當作一個class
    // 畫面元件
    authComponent: AuthComonent ={     //此為一個物件 名稱為authComponent，類型為AuthComonent
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
    
    //查詢條件
    caseResultPageSearchForm:CaseResultPageSearchForm = {
        taskIds: [], //電訪項目
        policyNo01: null,   //保單號碼01
        policyNo02: null,   //保單號碼02
        policyNo03: null,   //保單號碼03
        packNo: null,       //名單序號
        changeNo: null,   //受理案號
        custId: null,   //受訪者id
        custName: null, //受訪者姓名
        pherId: null,    //要保人id
        pherName: null,   // 要保人姓名
        agentId: null,  //業務員id
        agentName: null,  //業務員姓名
        importStartDate: null,      //匯入日期
        importEndDate: null,        //匯入日期
        importStartString: null,      //匯入日期
        importEndString: null,        //匯入日期
        dueContactStartDate: null, //應電訪日
        dueContactEndDate: null,    //應電訪日
        dueContactStartString : null,  //應電訪日
        dueContactEndString: null,   //應電訪日
        closeStartDate: null,      //結案日期
        closeEndDate: null,        //結案日期
        closeStartString: null,      //結案日期
        closeEndString: null,        //結案日期
        processUnit: null,        //承辦單位ID
        processId: null,      //承辦人員ID
        agentUnitNo:null,   //業務員單位代號
        caseCloseReasonCode:null, //結案狀態代碼
        insuId:null,  //被保險人ID
        insuName:null //被保險人姓名
    };

    //欄位驗證提示工具
    caseResultPageSearchValidateForm: CaseResultPageSearchValidateForm = {
        taskItems:{ hover: "", feedback: false, state: "", msg: "" },
        pherId:{ hover: "", feedback: false, state: "", msg: "" },
        pherName:{ hover: "", feedback: false, state: "", msg: "" },
        dueContactStartDate:{ hover: "", feedback: false, state: "", msg: "" },
        dueContactEndDate:{ hover: "", feedback: false, state: "", msg: "" },
        importStartDate:{ hover: "", feedback: false, state: "", msg: "" },
        importEndDate:{ hover: "", feedback: false, state: "", msg: "" },
        closeStartDate:{ hover: "", feedback: false, state: "", msg: "" },
        closeEndDate:{ hover: "", feedback: false, state: "", msg: "" },
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
        processId:{ hover: "", feedback: false, state: "", msg: "" },
        processUnit: { hover: "", feedback: false, state: "", msg: "" }
    }

    caseResultPageSearchRules: { [key: string]: ValidationRule[] } = {
        pherId:[{ validator: this.validatePherId, trigger: "blur" }],
        pherName:[{ validator: this.validatePherName, trigger: "blur" }],
        dueContactStartDate: [{ validator: this.validateDueContactStartDate, trigger: "blur" }],
        dueContactEndDate: [{ validator: this.validateDueContactEndDate, trigger: "blur" }],
        importStartDate: [{ validator: this.validateImportStartDate, trigger: "blur" }],
        importEndDate: [{ validator: this.validateImportEndDate, trigger: "blur" }],
        closeStartDate: [{ validator: this.validateCloseStartDate, trigger: "blur" }],
        closeEndDate: [{ validator: this.validateCloseEndDate, trigger: "blur" }],
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
    isCloseDateStartVisible: boolean = false;
    isCloseDateEndVisible: boolean = false;

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
    // 結案狀態
    selectCRCOptions: SelectOption[] = [{label:"結案",value:"0"},{label:"未結案",value:"1"}];

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

                                                                     
// ========================================= Grid ========================================================
// 案件查詢 grid 顯示 modal 控制參數
  caseResultSearchPageGridModal:{[key:string]:boolean} = {
    isShowCaseHistory:false, //案件查詢-案件歷程
    infReocrdvisible:false, //案件查詢-會辦內容
    onMailRecordVisible:false, //案件查詢-Email紀錄
    isPostRecordVisible:false, //案件查詢-郵寄紀錄
    isQuestionAnswerVisible:false, //案件查詢-保戶回答
    infMplusSendMessageVisible:false, //案件查詢-MPlus和簡訊紀錄
    isCallUpHistoryVisible:false, //案件查詢-撥號歷程
    notiReocrdvisible:false, //案件查詢-照會內容
  }
    // 控制案件搜尋結果的欄位
    caseResultSearchPageGrid: FblPDataGridHolder<CaseResultSearchDto> = {   //綁訂一個DTO在這裡表示後端回傳的資料
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
        //PLAIN:純文字,TAG:
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "caseNo",
                title: this.$t('caseNo').toString(), //受訪者ID
                width: 110,
                fixed: 'left',
                align: 'center',
                hidden: true,
            },
            {
                type: FblColumnType.TEMPLATE,
                //property: "taskName", //property:用在他自己標定DTO中相對應的資料，所以這欄位是資料的內容映射，替代物為，如果使用，formatter:(name of Dto)=>return
                title: this.$t('').toString(), //通常要引入全域$t('放i18n table中所對應的項目')
                width: CommonUtil.countColumnWidth(6),
                fixed: 'left',
                align: 'center',
                template:"exportPDF",//綁定.vue檔案中v-slot template設定
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "taskName", //property:用在他自己標定DTO中相對應的資料，所以這欄位是資料的內容映射，替代物為，如果使用，formatter:(name of Dto)=>return
                title: this.$t('case_search_grid_taskName').toString(), //電訪項目
                width: CommonUtil.countColumnWidth(22),
                fixed: 'left',
                align: 'center',
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "casePolicy",
                title: this.$t('case_search_grid_casePolicy').toString(), //保單號碼
                width: 130,
                fixed: 'left',
                align: 'center',
                //template: "alink_casePolicy_Template",
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "packNo",
                title: this.$t('case_search_grid_packNo').toString(), //名單序號
                width: 150,
                fixed: 'left',
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('case_search_grid_custId').toString(), //受訪者ID
                width: 110,
                fixed: 'left',
                align: 'center',
                //template: "alink_custId_Template",
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
                property: "applicantyDate",
                title: this.$t('riskControl_policyApplicantyDate').toString(), //申請日期----->借用風控的申請日期i18n名稱
                width: 100,
                align: 'center',
                formatter:(data:CaseResultSearchDto)=>{
                    return MomentUtil.transformRocYearMonthDay(data.applicantyDate)
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createCaseDate",
                title: this.$t('case_search_importDate').toString(), //匯入日期
                width: 100,
                align: 'center',
                formatter:(data:CaseResultSearchDto)=>{
                    return MomentUtil.transformRocYearMonthDay(data.createCaseDate);
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseCloseDate",
                title: this.$t('case_search_grid_caseCloseTime').toString(), //結案日期
                width: 100,
                align: 'center',
                formatter:(data:CaseResultSearchDto)=>{
                    return MomentUtil.transformRocYearMonthDay(data.caseCloseDate);
                }

            },
            {
                type: FblColumnType.PLAIN,
                property: "userName",
                title: this.$t('case_search_grid_userName').toString(), //電訪員姓名
                width: 100,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "userExt",
                title: this.$t('case_result_grid_user_Ext').toString(), //電訪員分機------>待新增
                width: 100,
                align: 'center',
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
                property: "processId",
                title: this.$t('承辦人員ID').toString(), //承辦人員ID---->待新增
                width: 100,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "processName",
                title: this.$t('case_result_grid_process_name').toString(), //承辦人員姓名---->待新增
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentUnitNo",
                title: this.$t('case_result_grid_agent_unitNo').toString(), //單位代碼---->待新增
                width: 100,
                align: 'center',
            }
        
        ]
    }

    created(){  //當頁面打開時，會做甚麼事情放這裡
        LoadingUtil.show();

        
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
          //this.casePageSearchForm.departmentIdList.push(this.defaultDepId);
          
          // 科別 下拉
          this.allDivList = resp.data.unitDepInfo.unitList;
          this.defaultUnitId = resp.data.unitDepInfo.defaultUnitId;
          // this.casePageSearchForm.divisionIdList.push(this.defaultUnitId); // 案件查詢不需要預設 科別
          
          // 電訪員 下拉
          this.allUserList = resp.data.unitDepInfo.userList;
          // this.casePageSearchForm.tmrIdList.push(LoginModule.loginState.me.id); // 案件查詢不需要預設 電訪員

          // 有預設部門需一起異動科別/人員
          if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultDepId)) {
            //this.onSelectDept();
          }

          // 有預設科別需一起異動人員
          if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultUnitId)) {
            //this.onSeletDivi();
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
        //this.casePageSearchForm.departmentIdList = [];
        this.getCaseSearchInfo();
      }

    });

    }

        //判斷上方查詢條件區塊是否顯示
    checkIsHiddenFoldeShow(){
        let show = true;

        // //由照會/會辦未結案提醒表單點擊保單號碼開啟此畫面 需隱藏上方查詢條件
        // if(this.casePolicyNumber != undefined || this.packNumber != undefined){
        // show = false;
        // }
        
        return show;
    }


    // ===================================== 驗證 ========================================================
    
  validateSearch(isRealSearch) {
    let validate = true;
    let validateImportDate = true;
    let validateDueContactDate = true;
    this.validateImportStartDate(null, this.caseResultPageSearchForm.importStartString, () => {
        if (this.caseResultPageSearchValidateForm.importEndDate.state == 'error') {
            validateImportDate = false;
            validate = false;
        }
    });
    this.validateImportEndDate(null, this.caseResultPageSearchForm.importEndString, () => {
        if (this.caseResultPageSearchValidateForm.importEndDate.state == 'error') {
            validateImportDate = false;
            validate = false;
        }
    });
    this.validateDueContactStartDate(null, this.caseResultPageSearchForm.dueContactStartString, () => {
        if (this.caseResultPageSearchValidateForm.dueContactStartDate.state == 'error') {
            validateDueContactDate = false;
            validate = false;
        }
    });
    this.validateDueContactEndDate(null, this.caseResultPageSearchForm.dueContactEndString, () => {
          if (this.caseResultPageSearchValidateForm.dueContactEndDate.state == 'error') {
              validateDueContactDate = false;
              validate = false;
          }
      });
      this.validatePolicyNo(null, null, () => {
        if (this.caseResultPageSearchValidateForm.policyNo01.state == 'error') {
            validate = false;
        }
    });

    this.validatePolicyNo02(null, null, () => {
        if (this.caseResultPageSearchValidateForm.policyNo02.state == 'error') {
            validate = false;
        }
    });

    this.validatePolicyNo03(null, null, () => {
        if (this.caseResultPageSearchValidateForm.policyNo03.state == 'error') {
            validate = false;
        }
    });
    this.validatePackNo(null, this.caseResultPageSearchForm.packNo, () => {
        if (this.caseResultPageSearchValidateForm.packNo.state == 'error') {
            validate = false;
        }
    });
    this.validateChangeNo(null, this.caseResultPageSearchForm.changeNo, () => {
        if (this.caseResultPageSearchValidateForm.changeNo.state == 'error') {
            validate = false;
        }
    });
    this.validateCustId(null, this.caseResultPageSearchForm.custId, () => {
        if (this.caseResultPageSearchValidateForm.custId.state == 'error') {
            validate = false;
        }
    });
    this.validateCustName(null, this.caseResultPageSearchForm.custName, () => {
        if (this.caseResultPageSearchValidateForm.custName.state == 'error') {
            validate = false;
        }
    });
    this.validatePherId(null, this.caseResultPageSearchForm.pherId, () => {
        if (this.caseResultPageSearchValidateForm.pherId.state == 'error') {
            validate = false;
        }
    });

    this.validatePherName(null, this.caseResultPageSearchForm.pherName, () => {
        if (this.caseResultPageSearchValidateForm.pherName.state == 'error') {
            validate = false;
        }
    });
    /*
    this.validateInsuredId(null, this.caseResultPageSearchForm.insuredId, () => {
        if (this.caseResultPageSearchValidateForm.insuredId.state == 'error') {
            validate = false;
        }
    });
    this.validateInsuredName(null, this.caseResultPageSearchForm.insuredName, () => {
        if (this.caseResultPageSearchValidateForm.insuredName.state == 'error') {
            validate = false;
        }
    });
    */
    this.validateAgentId(null, this.caseResultPageSearchForm.agentId, () => {
        if (this.caseResultPageSearchValidateForm.agentId.state == 'error') {
            validate = false;
        }
    });
    this.validateAgentName(null, this.caseResultPageSearchForm.agentName, () => {
        if (this.caseResultPageSearchValidateForm.agentName.state == 'error') {
            validate = false;
        }
    });

    //起始與結束皆符合規範才進一步判斷起訖區間
    if (validateImportDate && !ValidationUtil.isEmpty(this.caseResultPageSearchForm.importStartString) && !ValidationUtil.isEmpty(this.caseResultPageSearchForm.importEndString)) {
      this.validateImportStartAndEndDate(null, this.caseResultPageSearchForm.importStartDate, this.caseResultPageSearchForm.importEndDate, this.caseResultPageSearchForm.importStartString,
      this.caseResultPageSearchForm.importEndString, this.isImportDateStartVisible, this.isImportDateEndVisible, () => {
          if (this.caseResultPageSearchValidateForm.importStartDate.state == 'error' || this.caseResultPageSearchValidateForm.importEndDate.state == 'error') {
              validate = false;
          }
      });
    }
    if (validateDueContactDate && !ValidationUtil.isEmpty(this.caseResultPageSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.caseResultPageSearchForm.dueContactEndString)) {
      this.validateDueContactStartAndEndDate(null, this.caseResultPageSearchForm.dueContactStartDate, this.caseResultPageSearchForm.dueContactEndDate, this.caseResultPageSearchForm.dueContactStartString,
          this.caseResultPageSearchForm.dueContactEndString, this.isDueContactStartVisible, this.isDueContactEndVisible, () => {
              if (this.caseResultPageSearchValidateForm.dueContactStartDate.state == 'error' || this.caseResultPageSearchValidateForm.dueContactEndDate.state == 'error') {
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
    this.feildValidate(this.caseResultPageSearchValidateForm.pherId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.pherId, false, "", "", "");
            callback();
        } else {
            //要保人ID 僅可輸入英文與數字
            this.feildValidate(this.caseResultPageSearchValidateForm.pherId, true, "error", "hover", this.$t('case_search_valid_pherId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validatePherName(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.pherName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.pherName, false, "", "", "");
            callback();
        } else {
            //要保人姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.caseResultPageSearchValidateForm.pherName, true, "error", "hover", this.$t('case_search_valid_pherName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateDueContactStartDate(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
            callback();
        } else {
            this.isDueContactStartVisible = true;
            this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateDueContactEndDate(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
            callback();
        } else {
            this.isDueContactEndVisible = true;
            this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateImportStartDate(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
            callback();
        } else {
            this.isImportDateStartVisible = true;
            this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateImportEndDate(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
            callback();
        } else {
            this.isImportDateEndVisible = true;
            this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateCloseStartDate(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
            callback();
        } else {
            this.isCloseDateStartVisible = true;
            this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validateCloseEndDate(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
            this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
            callback();
        } else {
            this.isCloseDateEndVisible = true;
            this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
            callback(() => { });
        }
    }
    callback();
  }
  validatePolicyNo(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.policyNo01, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo01)) {

        if(ValidationUtil.isAnyChinese(this.caseResultPageSearchForm.policyNo01)){
          // 保單號碼 不可輸入中文
          this.feildValidate(this.caseResultPageSearchValidateForm.policyNo01, true, "error", "hover", this.$t('case_search_valid_policyNo_noChinese').toString());
          this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "success", "", "");
          this.feildValidate(this.caseResultPageSearchValidateForm.policyNo03, false, "success", "", "");
          callback(() => { });
        }else{
          this.feildValidate(this.caseResultPageSearchValidateForm.policyNo01, false, "success", "", "");
          if (!ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo01)) {
            if (ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo02)) {
                // 保單序號 必填
                this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_required').toString());
            } else if (!ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo02)) {
                // 保單序號 僅可輸入數字
                this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
            } else {
                this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "success", "", "");
            }
          } else {
              // 保單序號 僅可輸入數字
              if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo02)) {
                  this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
              } else {
                  this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "success", "", "");
              }
          }
        }
       
    } else {
        // 保單序號 僅可輸入數字
        if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo02)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
        } else {
            this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "success", "", "");
        }
    }
    callback();
  }
  validatePolicyNo02(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo02)) {
        if (!ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo02)) {
            // 保單序號 僅可輸入數字
            this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_error').toString());
            callback(() => { });
        }
    } else {
        if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo01)) {
            if (!ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo01)) {
                // 保單序號 必填
                this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, true, "error", "hover", this.$t('case_search_valid_policyNo_required').toString());
                callback(() => { });
            } else {
                this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "success", "", "");
            }
        }
    }
    callback();
  }
  validatePolicyNo03(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.policyNo03, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo03)) {
        if (!ValidationUtil.numberOnlyValidation(this.caseResultPageSearchForm.policyNo03)) {
            // 保單重複碼 僅可輸入數字
            this.feildValidate(this.caseResultPageSearchValidateForm.policyNo03, true, "error", "hover", this.$t('case_search_valid_policyNoDup_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validatePackNo(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.packNo, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.packNo, false, "", "", "");
            callback();
        } else {
            //名單序號 僅可輸入數字
            this.feildValidate(this.caseResultPageSearchValidateForm.packNo, true, "error", "hover", this.$t('case_search_valid_packNo_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateInsuredId(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.insuredId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.insuredId, false, "", "", "");
            callback();
        } else {
            //被保險人ID 僅可輸入英數字
            this.feildValidate(this.caseResultPageSearchValidateForm.insuredId, true, "error", "hover", this.$t('case_search_valid_insuredId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateInsuredName(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.insuredName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.insuredName, false, "", "", "");
            callback();
        } else {
            //被保險人姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.caseResultPageSearchValidateForm.insuredName, true, "error", "hover", this.$t('case_search_valid_insuredName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateChangeNo(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.changeNo, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.changeNo, false, "success", "", "");
            callback();
        } else {
            //受理案號 僅可輸入英文與數字
            this.feildValidate(this.caseResultPageSearchValidateForm.changeNo, true, "error", "hover", this.$t('case_search_valid_changeNo_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateCustId(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.custId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.custId, false, "", "", "");
            callback();
        } else {
            //受訪者ID 僅可輸入英文與數字
            this.feildValidate(this.caseResultPageSearchValidateForm.custId, true, "error", "hover", this.$t('case_search_valid_custId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateCustName(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.custName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.custName, false, "", "", "");
            callback();
        } else {
            //受訪者姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.caseResultPageSearchValidateForm.custName, true, "error", "hover", this.$t('case_search_valid_custName_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateAgentId(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.agentId, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (ValidationUtil.alphabetAndNumberValidation(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.agentId, false, "success", "", "");
            callback();
        } else {
            //業務員ID 僅可輸入英文與數字
            this.feildValidate(this.caseResultPageSearchValidateForm.agentId, true, "error", "hover", this.$t('case_search_valid_agentId_error').toString());
            callback(() => { });
        }
    }
    callback();
  }
  validateAgentName(rule, value, callback){
    this.feildValidate(this.caseResultPageSearchValidateForm.agentName, false, "", "", "");
    if (!ValidationUtil.isEmpty(value)) {
        if (!ValidationUtil.onlyHalfwidthOrFullWithNum(value)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.agentName, false, "success", "", "");
            callback();
        } else {
            //業務員姓名 僅可輸入中文、全形英文或全形符號
            this.feildValidate(this.caseResultPageSearchValidateForm.agentName, true, "error", "hover", this.$t('case_search_valid_agentName_error').toString());
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
      this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
      this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
      if (startString == endString || moment(startDate).isBefore(endDate)) {
          dateDisableStart = false;
          dateDisableEnd = false;
          this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
          this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
          callback();

      } else {
          dateDisableStart = true;
          dateDisableEnd = true;
          if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.importStartString) && !ValidationUtil.isEmpty(this.caseResultPageSearchForm.importEndString)) {
              this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
              this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
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
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    if (startString == endString || moment(startDate).isBefore(endDate)) {
        dateDisableStart = false;
        dateDisableEnd = false;
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
        callback();

    } else {
        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.caseResultPageSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.caseResultPageSearchForm.dueContactEndString)) {
            this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
            this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); //請輸入正確的起訖日期
        }
        callback(() => { });
    }
    callback();
  }

   //檢核查詢條件數量(少於1個不可執行查詢)
   checkFilterCount() {
    let isAbleToSearch = false;
    let filterColumn = [];

    Object.keys(this.caseResultPageSearchForm).forEach((key=>{
      if(key != "dueContactStartDate" && key != "dueContactEndDate" && key != "importStartDate" && key != "importEndDate"){
        if(!ValidationUtil.isEmpty(this.caseResultPageSearchForm[key])){
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

  // 自動轉為字串更新搜尋條件
  onImportStartChange(date) {
    this.caseResultPageSearchForm.importStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    this.validateSearch(false);
   }

   // 清除日期
  clearImportStartDate(){
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    this.isImportDateStartVisible = false;
    this.caseResultPageSearchForm.importStartString = "";
    this.caseResultPageSearchForm.importStartDate = null;
  }

  checkManualInputImportStartDate(data: any) {
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, true, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    } else {
        this.isImportDateStartVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseResultPageSearchForm.importStartDate = parseDate ? parseDate : this.caseResultPageSearchForm.importStartDate;
    this.caseResultPageSearchForm.importStartString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseResultPageSearchForm.importStartDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  /**
   * 確保Tooltip在日期正確時確實隱藏
   */
  eventMouseOverImportStart(){
    if (this.caseResultPageSearchValidateForm.importStartDate.feedback) {
        this.isImportDateStartVisible = true;
    } else {
        this.isImportDateStartVisible = false;
    }
  }
  eventMouseOverImportEnd(){
    if (this.caseResultPageSearchValidateForm.importEndDate.feedback) {
        this.isImportDateEndVisible = true;
    } else {
        this.isImportDateEndVisible = false;
    }
  }

  onImportEndChange(date){
    this.caseResultPageSearchForm.importEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    this.validateSearch(false);
  }

  clearImportEndDate(){
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
    this.isImportDateEndVisible = false;
    this.caseResultPageSearchForm.importEndString = "";
    this.caseResultPageSearchForm.importEndDate = null;
  }

  checkManualInputImportEndDate(data: any){
    this.isImportDateStartVisible = false;
    this.isImportDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, true, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "success", "", "");
    } else {
        this.isImportDateEndVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseResultPageSearchForm.importEndDate = parseDate ? parseDate : this.caseResultPageSearchForm.importEndDate;
    this.caseResultPageSearchForm.importEndString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseResultPageSearchForm.importEndDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }
  //自動轉為字串更新搜尋條件
  onDueContractStartChange(date){
    this.caseResultPageSearchForm.dueContactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.validateSearch(false);
  }
  clearDueContractStartDate(){
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.isDueContactStartVisible = false;
    this.caseResultPageSearchForm.dueContactStartString = "";
    this.caseResultPageSearchForm.dueContactStartDate = null;
  }
  /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputDueContractStartDate(data: any) {
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, true, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    } else {
        this.isDueContactStartVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseResultPageSearchForm.dueContactStartDate = parseDate ? parseDate : this.caseResultPageSearchForm.dueContactStartDate;
    this.caseResultPageSearchForm.dueContactStartString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseResultPageSearchForm.dueContactStartDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  eventMouseOverDueContractStart(){
    if (this.caseResultPageSearchValidateForm.dueContactStartDate.feedback) {
        this.isDueContactStartVisible = true;
    } else {
        this.isDueContactStartVisible = false;
    }
  }

  onDueContractEndChange(date){
    this.caseResultPageSearchForm.dueContactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.validateSearch(false);
  }
  clearDueContractEndDate(){
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
    this.isDueContactEndVisible = false;
    this.caseResultPageSearchForm.dueContactEndString = "";
    this.caseResultPageSearchForm.dueContactEndDate = null;
  }
  checkManualInputDueContractEndDate(data: any){
    this.isDueContactStartVisible = false;
    this.isDueContactEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, true, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "success", "", "");
    } else {
        this.isDueContactEndVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseResultPageSearchForm.dueContactEndDate = parseDate ? parseDate : this.caseResultPageSearchForm.dueContactEndDate;
    this.caseResultPageSearchForm.dueContactEndString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseResultPageSearchForm.dueContactEndDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  eventMouseOverDueContractEnd(){
    if (this.caseResultPageSearchValidateForm.dueContactStartDate.feedback) {
        this.isDueContactEndVisible = true;
    } else {
        this.isDueContactEndVisible = false;
    }
  }

  onCloseStartChange(date) {
    this.caseResultPageSearchForm.closeStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isCloseDateStartVisible = false;
    this.isCloseDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    this.validateSearch(false);
   }

   // 清除日期
  clearCloseStartDate(){
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    this.isCloseDateStartVisible = false;
    this.caseResultPageSearchForm.closeStartString = "";
    this.caseResultPageSearchForm.closeStartDate = null;
  }

  /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputCloseStartDate(data: any) {
    this.isCloseDateStartVisible = false;
    this.isCloseDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, true, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    } else {
        this.isCloseDateStartVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseResultPageSearchForm.closeStartDate = parseDate ? parseDate : this.caseResultPageSearchForm.closeStartDate;
    this.caseResultPageSearchForm.closeStartString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseResultPageSearchForm.closeStartDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  /**
   * 確保Tooltip在日期正確時確實隱藏
   */
  eventMouseOverCloseStart(){
    if (this.caseResultPageSearchValidateForm.closeStartDate.feedback) {
        this.isCloseDateStartVisible = true;
    } else {
        this.isCloseDateStartVisible = false;
    }
  }

  onCloseEndChange(date){
    this.caseResultPageSearchForm.closeEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isCloseDateStartVisible = false;
    this.isCloseDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    this.validateSearch(false);
  }

  clearCloseEndDate(){
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
    this.isCloseDateEndVisible = false;
    this.caseResultPageSearchForm.closeEndString = "";
    this.caseResultPageSearchForm.closeEndDate = null;
  }

  checkManualInputCloseEndDate(data: any){
    this.isCloseDateStartVisible = false;
    this.isCloseDateEndVisible = false;
    this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, true, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, true, "", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
        this.feildValidate(this.caseResultPageSearchValidateForm.closeStartDate, false, "success", "", "");
        this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, false, "success", "", "");
    } else {
        this.isCloseDateEndVisible = true;
        // 日期錯誤
        this.feildValidate(this.caseResultPageSearchValidateForm.closeEndDate, true, "error", "hover", this.$t('global_dateError').toString());
    }
    this.caseResultPageSearchForm.closeEndDate = parseDate ? parseDate : this.caseResultPageSearchForm.closeEndDate;
    this.caseResultPageSearchForm.closeEndString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.caseResultPageSearchForm.closeEndDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  eventMouseOverCloseEnd(){
    if (this.caseResultPageSearchValidateForm.closeEndDate.feedback) {
        this.isCloseDateEndVisible = true;
    } else {
        this.isCloseDateEndVisible = false;
    }
  }


  // ===================================== 按鈕 事件 ========================================================
  // 查詢
  searchCasePage() {
    if(this.validateSearch(true)){
      this.isExportDisable = false;
      this.caseResultSearchPageGrid.data = [];
      this.caseResultSearchPageGrid.pagination.current = 1;
      // 打 案件查詢 ajax
      this.getCaseSearchInfo();
    }
  }

  // 清除
  resetCasePageSearchForm() {

    this.caseResultPageSearchForm = {
      taskIds: [], //電訪項目

      policyNo01: "",   //保單號碼
      policyNo02: "",   //保單號碼
      policyNo03: "",   //保單號碼

      packNo: "",       //名單序號
      changeNo: "",   //受理案號
      custId: "",   //受訪者id
      custName: "", //受訪者姓名
      pherId: "",    //要保人id
      pherName: "",   // 要保人姓名
      agentId: "",  //業務員id
      agentName: "",  //業務員姓名
      importStartDate: null,      //匯入日期
      importEndDate: null,        //匯入日期
      importStartString: "",      //匯入日期
      importEndString: "",        //匯入日期
      dueContactStartDate: null, //應電訪日
      dueContactEndDate: null,    //應電訪日
      dueContactStartString : "",  //應電訪日
      dueContactEndString: "",   //應電訪日
      closeStartDate: null, //結案日期
      closeEndDate: null, //結案日期
      closeStartString:"", //結案日期
      closeEndString:"", //結案日期
      processUnit:"", //承辦窗口
      processId:"", //承辦人員ID
      agentUnitNo:"", //業務員單位代號
      caseCloseReasonCode:"", //結案狀態代碼
    };

    this.caseResultSearchPageGrid.data = [];
    this.caseResultSearchPageGrid.pagination.total = 0;
    // this.depDisable = false; //目前不需要 2022/06/07
    // this.divDisable = false; //目前不需要 2022/06/07
    this.clearValidateStatus();
    //this.onSelectDept();
    //this.onSeletDivi();
  }

  clearValidateStatus(){
    this.feildValidate(this.caseResultPageSearchValidateForm.pherId, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.pherName, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactStartDate, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.dueContactEndDate, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importStartDate, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.importEndDate, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.policyNo01, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.policyNo02, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.policyNo03, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.packNo, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.insuredId, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.insuredName, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.changeNo, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.custId, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.custName, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.agentId, false, "", "", "");
    this.feildValidate(this.caseResultPageSearchValidateForm.agentName, false, "", "", "");
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



  // 案件查詢
  getCaseSearchInfo(){
    var getCaseResultSearchInDto:GetCaseResultSearchInDto={};
    
    getCaseResultSearchInDto.page = this.caseResultSearchPageGrid.pagination.current-1;
    getCaseResultSearchInDto.size = this.caseResultSearchPageGrid.pagination.pageSize;
    getCaseResultSearchInDto.sort = this.caseResultSearchPageGrid.sort ? JSON.stringify([this.caseResultSearchPageGrid.sort]) : undefined;
    
    getCaseResultSearchInDto.caseResultSearchCondition = this.arrangeCaseSearchCondition();
    
    LoadingUtil.show();

    this.$caseSearchApi.getResultCaseSearchInfoUsingPOST(getCaseResultSearchInDto)
    .then((resp:AxiosResponse<GetCaseResultSearchOutDto>)=>{

      if(resp.data != null){
        if(resp.data.success){
            const p = { ...this.caseResultSearchPageGrid.pagination };
            p.total = parseInt(resp.data.caseResultSearchDtoPage.totalElements);
            
            
            this.caseResultSearchPageGrid.data = resp.data.caseResultSearchDtoPage.content;
            this.caseResultSearchPageGrid.pagination = p;
            if (p.total == 0) {
                //	查無符合篩選條件之資料
                MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
            }

            //確認查詢結果是否超出匯出最大限制筆數
            this.$exportApi.checkExportUsingGET(this.caseResultSearchPageGrid.pagination.total).then((exportCheck) => {
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

  // 整理 案件查詢 條件 
  arrangeCaseSearchCondition(){
    let emptyStr = "";
    var caseResultSearchCondition:CaseResultSearchCondition = {};
    //1.電訪項目 taskIds(list)長度為零，回傳空[]
    caseResultSearchCondition.taskIds=this.caseResultPageSearchForm.taskIds.length==0? []:this.caseResultPageSearchForm.taskIds;
    //2.要保人 pherId
    caseResultSearchCondition.pherId=this.caseResultPageSearchForm.pherId==emptyStr? null:this.caseResultPageSearchForm.pherId;
    //3.要保人姓名 pherName
    caseResultSearchCondition.pherName = this.caseResultPageSearchForm.pherName==emptyStr? null: this.caseResultPageSearchForm.pherName;
    //4.被保險人ID
    caseResultSearchCondition.insuId=this.caseResultPageSearchForm.insuId==emptyStr? null:this.caseResultPageSearchForm.insuId;
    //5.被保險人姓名
    caseResultSearchCondition.insuName=this.caseResultPageSearchForm.insuName==emptyStr? null:this.caseResultPageSearchForm.insuName;
    //6.應電訪日
    caseResultSearchCondition.dueContactStartDate = ValidationUtil.isEmpty(this.caseResultPageSearchForm.dueContactStartString) ? null : moment(this.caseResultPageSearchForm.dueContactStartDate).format("YYYY/MM/DD"); //check
    //----時間區塊---
    caseResultSearchCondition.dueContactEndDate = ValidationUtil.isEmpty(this.caseResultPageSearchForm.dueContactEndString) ? null : moment(this.caseResultPageSearchForm.dueContactEndDate).format("YYYY/MM/DD"); //check
    caseResultSearchCondition.importStartDate = ValidationUtil.isEmpty(this.caseResultPageSearchForm.importStartString) ? null : moment(this.caseResultPageSearchForm.importStartDate).format("YYYY/MM/DD") ;  //check
    caseResultSearchCondition.importEndDate = ValidationUtil.isEmpty(this.caseResultPageSearchForm.importEndString) ? null : moment(this.caseResultPageSearchForm.importEndDate).format("YYYY/MM/DD") ;  //check
    caseResultSearchCondition.closeStartDate = ValidationUtil.isEmpty(this.caseResultPageSearchForm.closeStartString) ? null : moment(this.caseResultPageSearchForm.closeStartDate).format("YYYY/MM/DD") ; //check
    caseResultSearchCondition.closeEndDate = ValidationUtil.isEmpty(this.caseResultPageSearchForm.closeEndString) ? null : moment(this.caseResultPageSearchForm.closeEndDate).format("YYYY/MM/DD") ; //check
    
    //處理保單號碼三個欄位串一起
    var casePolicy = (()=>{
      var returnCasePolicy = "";
      if(!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo03)){  //第三格不為空則三欄串一起
        returnCasePolicy = this.caseResultPageSearchForm.policyNo01 + "-" + this.caseResultPageSearchForm.policyNo02 + "-" + this.caseResultPageSearchForm.policyNo03;
      }else if(!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo02)){  
        returnCasePolicy = this.caseResultPageSearchForm.policyNo01 + "-" + this.caseResultPageSearchForm.policyNo02; 
      }else if(!ValidationUtil.isEmpty(this.caseResultPageSearchForm.policyNo01)){  
        returnCasePolicy = this.caseResultPageSearchForm.policyNo01;
      }else{
        returnCasePolicy=null;
      }
      return returnCasePolicy;
    })();

    //判斷保單號碼查詢條件
    if(this.casePolicyNumber == undefined){
      //一般正常查詢
      caseResultSearchCondition.casePolicy = casePolicy;  //check
    }
    // else{
    //   //若有傳入保單號碼 隱藏上方查詢條件區塊 僅查詢該保單號碼資料 (照會/會辦未結案提醒用) B1683
    //   caseResultSearchCondition.casePolicy = this.casePolicyNumber;
    // }

    //判斷名單號查詢條件
    // if(this.packNumber == undefined){
    //   // 一般正常查詢
    //   caseResultSearchCondition.packNo = this.caseResultPageSearchForm.packNo; //check
    // } else {
    //   // 若有傳入名單號碼 隱藏上方查詢條件區塊 僅查詢該保單號碼資料 (覆核作業) B0845
    //   caseResultSearchCondition.packNo = this.packNumber;
    // }
    caseResultSearchCondition.packNo = this.caseResultPageSearchForm.packNo==emptyStr? null: this.caseResultPageSearchForm.packNo;
    caseResultSearchCondition.changeNo = this.caseResultPageSearchForm.changeNo==emptyStr? null:this.caseResultPageSearchForm.changeNo ; //check
    caseResultSearchCondition.custId = this.caseResultPageSearchForm.custId==emptyStr? null:this.caseResultPageSearchForm.custId ;  //check
    caseResultSearchCondition.custName = this.caseResultPageSearchForm.custName==emptyStr? null:this.caseResultPageSearchForm.custName; //check
    caseResultSearchCondition.agentId = this.caseResultPageSearchForm.agentId==emptyStr? null:this.caseResultPageSearchForm.agentId ;  //check
    caseResultSearchCondition.agentName = this.caseResultPageSearchForm.agentName==emptyStr? null:this.caseResultPageSearchForm.agentName ; //check
    caseResultSearchCondition.agentUnitNo = this.caseResultPageSearchForm.agentUnitNo==emptyStr? null: this.caseResultPageSearchForm.agentUnitNo ; //check
    caseResultSearchCondition.caseCloseReasonCode = this.caseResultPageSearchForm.caseCloseReasonCode==emptyStr? null: this.caseResultPageSearchForm.caseCloseReasonCode; //check
    caseResultSearchCondition.processId = this.caseResultPageSearchForm.processId==emptyStr? null:this.caseResultPageSearchForm.processId ; //check
    caseResultSearchCondition.processUnit = this.caseResultPageSearchForm.processUnit==emptyStr? null: this.caseResultPageSearchForm.processUnit //check

    return caseResultSearchCondition; //讀取資料並塞入request中的condition物件
  } 

  //點擊摺疊的項目會如何
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

  // 換頁
  onPageChange(e: FblPageEvent) {
    if (this.caseResultSearchPageGrid.data.length > 0) {
        this.caseResultSearchPageGrid.sort = e.sort;
        this.caseResultSearchPageGrid.pagination = e.pagination;
        this.getCaseSearchInfo();
    }
  }
  //點擊下載PDF
  exportPDF(caseNo){
    console.log(caseNo);
    let stripSTR = new String(caseNo);
    let newStr=stripSTR.replace('-','')
    //console.log(stripSTR.replace('-',''));
    let formData=new FormData;
    formData.append('caseNo',newStr);
        axios(
            {
            method: 'post',
            url: `${process.env.VUE_APP_API_BASE_URL}/api/caseSearch/callResultPDF`,
            data: formData,
            responseType: 'blob'//!!!!一定要接收blob否則無法顯示pdf
            //timeout: 3*60*1000,
            }
        ).then(Response=>{
            console.log(Response.data);
            this.dealDownLoadData(Response.data, 'testexportPDF.pdf')

        });
    
    
   }

}
