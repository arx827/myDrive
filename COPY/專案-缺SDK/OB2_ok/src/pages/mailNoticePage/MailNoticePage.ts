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
import { mailNoticeSearchValidateForm } from "./model";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Option, ResponseEntity, MailNoticeInitOutputDto, MailNoticePaginateInptDto, MailNoticePaginateOutputDto} from "@fubonlife/obd-api-axios-sdk";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import axios, {AxiosResponse} from 'axios';
import LoadingUtil from "@/assets/config/LoadingUtil";
import MailLetterForm from "@/components/shared/form/mailLetter/mailLetterForm/MailLetterForm.vue";

/**
 * 郵寄通知函查詢 flag
 */
export enum EnumGetMailNoticeSearch{
    CLICK_SEARCH_MAIL_NOTICE="CLICK_SEARCH_MAIL_NOTICE", //點擊查詢
    ON_PAGE_CHANGE="ON_PAGE_CHANGE",    //換頁
}

@Component({
    components:{
        FblDataGrid, HiddenFolde, MailLetterForm
    }
})
export default class MailNoticePage extends Vue{

    mailNoticeSearchForm = {
        policyNo01: "",   //保單號碼
        policyNo02: "",   //保單號碼
        policyNo03: "",   //保單號碼 
        mailByPostId: "", //郵寄編號
        registerNo: "", //掛號編號
        custId: "",   //受訪者id
        custName: "", //受訪者姓名

        taskItemSelect: [], //電訪項目
        contractStatusSelected: "", //契約狀態
        caseStatusSelected: "",     //案件階段
        deliverStatusSelected: "",  //投遞狀態
        manualLetterStatusSelected: "", //信函狀態 批次/人工郵寄
        returnReasonSelected: "",   //退回原因
        cancelLetterSelected: "",   //取消信函

        dueContactStartDate: null, //應電訪日
        dueContactEndDate: null,    //應電訪日
        dueContactStartString : "",  //應電訪日
        dueContactEndString: "",   //應電訪日

        letterStartDate: null, //產信日
        letterEndDate: null,    //產信日
        letterStartDateString : "",  //產信日
        letterEndDateString: "",   //產信日

        mailByPostStartDate: null, //郵寄日期
        mailByPostEndDate: null,    //郵寄日期
        mailByPostStartDateString : "",  //郵寄日期
        mailByPostEndDateString: "",   //郵寄日期

        returnStartDate: null, //退回日期
        returnEndDate: null,    //退回日期
        returnStartDateString : "",  //退回日期
        returnEndDateString: "",   //退回日期

    }

    mailNoticeSearchRule: { [key: string]: ValidationRule[] } = {
        policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
        policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
        policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
        custId: [{ validator: this.validateCustId, trigger: "blur" }],
        custName:[{ validator: this.validateCustName, trigger: "blur" }],
        mailByPostId:[{ validator: this.validateMailByPostId, trigger: "blur" }],
        registerNo:[{ validator: this.validateRegisterNo, trigger: "blur" }],
        dueContStart: [{ validator: this.validateDueContactStart, trigger: "blur" }],
        dueContEnd: [{ validator: this.validateDueContactEnd, trigger: "blur" }],
        letterStart: [{ validator: this.validateLetterStart, trigger: "blur" }],
        letterEnd: [{ validator: this.validateLetterEnd, trigger: "blur" }],
        mailByPostStart: [{ validator: this.validateMailByPostStart, trigger: "blur" }],
        mailByPostEnd: [{ validator: this.validateMailByPostEnd, trigger: "blur" }],
        returnStart: [{ validator: this.validateReturnStart, trigger: "blur" }],
        returnEnd: [{ validator: this.validateReturnEnd, trigger: "blur" }],
    };


    mailNoticeSearchValidateForm:mailNoticeSearchValidateForm = {
        policyNo01: { feedback: false, hoverVisible: false },
        policyNo02: { feedback: false, hoverVisible: false },
        policyNo03: { feedback: false, hoverVisible: false },
        custId: { feedback: false, hoverVisible: false },
        custName: { feedback: false, hoverVisible: false },
        mailByPostId: { feedback: false, hoverVisible: false },
        registerNo: { feedback: false, hoverVisible: false },
        dueContStart: { feedback: false, hoverVisible: false },
        dueContEnd: { feedback: false, hoverVisible: false },
        letterStart: { feedback: false, hoverVisible: false },
        letterEnd: { feedback: false, hoverVisible: false },
        mailByPostStart: { feedback: false, hoverVisible: false },
        mailByPostEnd: { feedback: false, hoverVisible: false },
        returnStart: { feedback: false, hoverVisible: false },
        returnEnd: { feedback: false, hoverVisible: false },    
    }


    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;
    formatterDateTime = this.$twDateTimeFormatter;
    //vue2 時間選擇器標題格式
    timeTitleFormat: string = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date()));

    //日期選擇器hover是否顯示
    isDueContactStartVisible: boolean = false;
    isDueContactEndVisible: boolean = false;
    isLetterStartVisible: boolean = false;
    isLetterEndVisible: boolean = false;
    isMailByPostStartVisible: boolean = false;
    isMailByPostEndVisible: boolean = false;
    isReturnStartVisible: boolean = false;
    isReturnEndVisible: boolean = false;

    //判斷當下是否可執行匯出
    isExportDisable: boolean = false;
    overMaxRowCountMessage: string = "";

    // ===================================== Grid Modal 點擊相關參數 start========================================================
    mailNoticeSearchModal:{[key:string]:boolean} = {
        isPostVisible:false, // 郵寄編號
    }
    // 人工產信Form parameter
    mailLetterFormParam:{caseNo:string}={caseNo:undefined};

    // ===================================== 下拉式選單 ========================================================

    defaultGlobalAllOption: Option = { label: this.$t('global_all').toString(), value: '' }; //全部
    taskOptions: Option[] = [];   //電訪項目_選單
    contractStatusOptions: Option[] = [];//契約狀態_選單
    caseStatusOptions: Option[] = [];    //案件階段_選單
    deliverStatusOptions: Option[] = []; //投遞狀態_選單
    manualLetterStatusOptions: Option[] = [];//信函狀態 批次/人工郵寄_選單
    returnReasonOptions: Option[] = [];  //退回原因_選單
    cancelLetterOptions: Option[] = [];  //取消信函_選單


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

    // ===================================== Grid ========================================================
    mailNoticeGrid: FblPDataGridHolder<any>={
        rowKey: "mailByPostId",
        data:[],
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true,

        },
        scroll: { x: 500, y: 600 },
        columns:[
            // {
            //     type: FblColumnType.CHECKBOX,
            //     property: "isSelected",
            //     title: this.$t('mailNotice_grid_isSelected').toString(),   //核取方塊
            //     width: CommonUtil.countColumnWidth(1),
            // },
            {
                type: FblColumnType.TEMPLATE,
                property: "mailByPostId",
                title: this.$t('mailNotice_grid_mailByPostId').toString(), //郵寄編號
                width: 120,
                template: "alink_mailByPostId_Template",
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "letterDate",
                title: this.$t('mailNotice_grid_letterDate').toString(),   //產信日期
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "mailByPostDate",
                title: this.$t('mailNotice_grid_mailByPostDate').toString(),   //郵寄日期
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "registerNo",
                title: this.$t('mailNotice_grid_registerNo').toString(),   //掛號號碼
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('mailNotice_grid_custId').toString(),   //受訪者ID
                width: 110,
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "custName",
                title: this.$t('mailNotice_grid_custName').toString(), //受訪者姓名
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "contractStatusName",
                title: this.$t('mailNotice_grid_contractStatusName').toString(),   //契約狀態
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "obdStatusName",
                title: this.$t('mailNotice_grid_obdStatusName').toString(),    //案件狀態
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "casePolicy",
                title: this.$t('mailNotice_grid_casePolicy').toString(),   //保單號碼
                width: 110,
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "receiver",
                title: this.$t('mailNotice_grid_receiver').toString(), //收件人
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "addressTypeName",
                title: this.$t('mailNotice_grid_addressTypeName').toString(),  //地址類型
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "address",
                title: this.$t('mailNotice_grid_address').toString(),  //郵寄地址
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "untiName",
                title: this.$t('mailNotice_grid_untiName').toString(), //科別
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "userName",
                title: this.$t('mailNotice_grid_userName').toString(), //電訪員
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateName",
                title: this.$t('mailNotice_grid_updateName').toString(),   //異動人員
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "manualLetterStatus",
                title: this.$t('mailNotice_grid_manualLetterStatus').toString(),   //信函狀態
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "cancelLetter",
                title: this.$t('mailNotice_grid_cancelLetter').toString(), //信函取消
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "cancelLetterReason",
                title: this.$t('mailNotice_grid_cancelLetterReason').toString(),   //取消原因
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "taskName",
                title: this.$t('mailNotice_grid_taskName').toString(), //電訪項目
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "deliverStatusName",
                title: this.$t('mailNotice_grid_deliverStatusName').toString(),    //投遞狀態
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "returnDate",
                title: this.$t('mailNotice_grid_returnDate').toString(),   //退回日期
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "returnReasonName",
                title: this.$t('mailNotice_grid_returnReasonName').toString(), //退回原因
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "dueContDateChg",
                title: this.$t('mailNotice_grid_dueContDateChg').toString(),   //應電訪日
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "packNo",
                title: this.$t('mailNotice_grid_packNo').toString(),   //名單序號
                width: 110,
            },
        ]

    }


    // ===================================== 初始  ========================================================
    created(){

        LoadingUtil.show();
        this.$mailNoticeApi.mailNoticeInitUsingGET()
        .then((resp:AxiosResponse<MailNoticeInitOutputDto>)=>{
            if(resp != null && resp.data != null){
                // 電訪項目_選單
                this.taskOptions = resp.data.taskOptions;
                // 契約狀態_選單
                this.addGlobalAllOptionFirst(resp.data.contractStatusOptions, this.contractStatusOptions);
                // 案件階段_選單
                this.addGlobalAllOptionFirst(resp.data.caseStatusOptions, this.caseStatusOptions);
                // 投遞狀態_選單
                this.addGlobalAllOptionFirst(resp.data.deliverStatusOptions, this.deliverStatusOptions);
                // 信函狀態 批次/人工郵寄_選單
                this.addGlobalAllOptionFirst(resp.data.manualLetterStatusOptions, this.manualLetterStatusOptions);
                // 退回原因_選單
                this.addGlobalAllOptionFirst(resp.data.returnReasonOptions, this.returnReasonOptions);
                // 取消信函_選單
                this.addGlobalAllOptionFirst(resp.data.cancelLetterOptions, this.cancelLetterOptions);

                LoadingUtil.close();
            }else{
                ErrorModalUtil.modalError(this.$t('mailNotice_init_error_1').toString()); //通知函報表下拉選單初始化失敗
                LoadingUtil.close();
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('mailNotice_init_error_1').toString()); //通知函報表下拉選單初始化失敗
            LoadingUtil.close();
        });
    }

    /**
     * 
     * @param resObj 來源options (取得後預計塞入的 options)
     * @param desObj 目的options (塞完後的 options)
     */
    addGlobalAllOptionFirst(resObj:Option[], desObj:Option[]){
        desObj.push(this.defaultGlobalAllOption); //全部
        resObj.forEach((option:Option)=>{
            desObj.push({label:option.label, value:option.value});
        });
    }

    // ===================================== Grid 事件 ========================================================

    // 換頁
    onPageChange(e: FblPageEvent) {
        if (this.mailNoticeGrid.data.length > 0) {
            this.mailNoticeGrid.sort = e.sort;
            this.mailNoticeGrid.pagination = e.pagination;
            this.getMailNoticeSearch(EnumGetMailNoticeSearch.ON_PAGE_CHANGE);
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

      // 點擊郵寄編號
      clickMailByPostId(data:any){
        this.mailNoticeSearchModal.isPostVisible = true;
        this.mailLetterFormParam.caseNo = data.caseNo;
      }


    // ===================================== Search 事件 ========================================================

    // 查詢
    searchMailNotice(){
        if(this.validateSearch()){
            this.isExportDisable = false;
            this.mailNoticeGrid.data = [];
            this.mailNoticeGrid.pagination.current = 1;
            this.getMailNoticeSearch(EnumGetMailNoticeSearch.CLICK_SEARCH_MAIL_NOTICE);
        }
    }

    // 整理查詢 通知函報表物件
    arrangeMailNoticePaginateInptDto():MailNoticePaginateInptDto{
        var mailNoticePaginateInptDto:MailNoticePaginateInptDto = {};
        mailNoticePaginateInptDto.taskIds = this.mailNoticeSearchForm.taskItemSelect;
        mailNoticePaginateInptDto.policyNo = this.mailNoticeSearchForm.policyNo01;
        mailNoticePaginateInptDto.policySeq = this.mailNoticeSearchForm.policyNo02;
        mailNoticePaginateInptDto.idDup = this.mailNoticeSearchForm.policyNo03;
        mailNoticePaginateInptDto.contractStatus = this.mailNoticeSearchForm.contractStatusSelected;
        mailNoticePaginateInptDto.caseStatus = this.mailNoticeSearchForm.caseStatusSelected;
        mailNoticePaginateInptDto.mailByPostId = this.mailNoticeSearchForm.mailByPostId;
        mailNoticePaginateInptDto.registerNo = this.mailNoticeSearchForm.registerNo;
        mailNoticePaginateInptDto.custId = this.mailNoticeSearchForm.custId;
        mailNoticePaginateInptDto.custName = this.mailNoticeSearchForm.custName;
        mailNoticePaginateInptDto.deliverStatus = this.mailNoticeSearchForm.deliverStatusSelected;
        mailNoticePaginateInptDto.manualLetterStatus = this.mailNoticeSearchForm.manualLetterStatusSelected;
        mailNoticePaginateInptDto.cancelLetter = this.mailNoticeSearchForm.cancelLetterSelected;
        mailNoticePaginateInptDto.returnReason = this.mailNoticeSearchForm.returnReasonSelected;
        mailNoticePaginateInptDto.dueContactStartDate = this.mailNoticeSearchForm.dueContactStartDate;
        mailNoticePaginateInptDto.dueContactEndDate = this.mailNoticeSearchForm.dueContactEndDate;
        mailNoticePaginateInptDto.letterStartDate = this.mailNoticeSearchForm.letterStartDate;
        mailNoticePaginateInptDto.letterEndDate = this.mailNoticeSearchForm.letterEndDate;
        mailNoticePaginateInptDto.mailByPostStartDate = this.mailNoticeSearchForm.mailByPostStartDate;
        mailNoticePaginateInptDto.mailByPostEndDate = this.mailNoticeSearchForm.mailByPostEndDate;
        mailNoticePaginateInptDto.returnStartDate = this.mailNoticeSearchForm.returnStartDate;
        mailNoticePaginateInptDto.returnEndDate = this.mailNoticeSearchForm.returnEndDate;
        return mailNoticePaginateInptDto;
    }

    // 通知函報表查詢
    getMailNoticeSearch(searchFlag:EnumGetMailNoticeSearch){
        
        LoadingUtil.show();

        var mailNoticePaginateInptDto:MailNoticePaginateInptDto = this.arrangeMailNoticePaginateInptDto();
        var page = this.mailNoticeGrid.pagination.current-1;
        var size = this.mailNoticeGrid.pagination.pageSize;
        var sort = this.mailNoticeGrid.sort ? JSON.stringify([this.mailNoticeGrid.sort]) : undefined;
        
        this.$mailNoticeApi.paginateMailNoticeUsingPOST(page, size, mailNoticePaginateInptDto, sort)
        .then((resp:AxiosResponse<MailNoticePaginateOutputDto>)=>{
            
            if(resp.data != null){
                const p = {...this.mailNoticeGrid.pagination};
                p.total = parseInt(resp.data.mailNoticeSearchGridPage.totalElements);

                this.mailNoticeGrid.data = resp.data.mailNoticeSearchGridPage.content;
                this.mailNoticeGrid.pagination = p;
                if (p.total == 0) {
                    //	查無符合篩選條件之資料
                    MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                }
                
                this.$exportApi.checkExportUsingGET(this.mailNoticeGrid.pagination.total)
                .then((exportCheck)=>{
                   if(exportCheck.data.isOverMaxCount){
                       this.isExportDisable = true;
                   }
                   this.overMaxRowCountMessage = exportCheck.data.errorMessage; 
                   LoadingUtil.close();
                }).catch((error)=>{
                    ErrorModalUtil.modalError(this.$t('error_checkOverExportMaxNum_error').toString()); //確認查詢結果是否超出匯出最大限制筆數失敗
                    LoadingUtil.close();
                });
            }else{
                ErrorModalUtil.modalError(this.$t('mailNotice_paginate_erroe_1').toString()); //通知函報表查詢失敗
                LoadingUtil.close();
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('mailNotice_paginate_erroe_1').toString()); //通知函報表查詢失敗
            LoadingUtil.close();
        });
        

    }

    // 匯出
    exportSearchResult(){
        if(!this.isExportDisable){
            if(this.mailNoticeGrid.data.length == 0){
                ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出     
            }else{
                // 打匯出 ajax
                if(this.validateSearch()){
                    this.exportMailNoticeSearchInfo();
                }else{
                    ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
                }
            }
        }else{
            if (ValidationUtil.isEmpty(this.overMaxRowCountMessage)) {
                ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
            } else {
                //匯出筆數超過最大限制
                ErrorModalUtil.modalError(this.overMaxRowCountMessage);
            }
        }
    }
    
    //點擊匯出郵掛清單
    exportMailLetterList(){
        if(!this.isExportDisable){
            if(this.mailNoticeGrid.data.length == 0){
                ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出     
            }
            else{
                // 打匯出 ajax
                if(this.validateSearch()){
                    
                    this.exportMailLetterListWord();
                }else{
                    ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
                }
            }
        }else{
            if (ValidationUtil.isEmpty(this.overMaxRowCountMessage)) {
                ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
            } else {
                //匯出筆數超過最大限制
                ErrorModalUtil.modalError(this.overMaxRowCountMessage);
            }
        }
    }

    // 匯出
    exportMailNoticeSearchInfo(){
        var mailNoticePaginateInptDto:MailNoticePaginateInptDto = this.arrangeMailNoticePaginateInptDto();

        LoadingUtil.show();
        this.$mailNoticeApi.exportMailNoticeUsingPOST(mailNoticePaginateInptDto, {responseType : 'blob'})
        .then((resp:AxiosResponse<ResponseEntity>)=>{
            this.dealDownLoadData(resp.data, this.$t('mailNotice_export_file_1').toString() + ".xlsx");   // 郵寄通知函報表.xlsx
            MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
        }).catch((error)=>{
          ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }).finally(()=>{
          LoadingUtil.close();
        });

    }

    //匯出郵掛清單word
    exportMailLetterListWord(){
        var mailNoticePaginateInptDto:MailNoticePaginateInptDto = this.arrangeMailNoticePaginateInptDto();

        LoadingUtil.show();
        // axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/mailNotice/exportMailLetterListWord`, mailNoticePaginateInptDto, {responseType : 'blob'})
        this.$mailNoticeApi.exportMailLetterListWordUsingPOST( mailNoticePaginateInptDto, {responseType : 'blob'})
        .then((resp)=>{
            this.dealDownLoadData(resp.data, this.$t('mailNotice_export_file_2').toString() + ".doc");   // 郵掛清單.doc
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        })
        .finally(()=>{
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

    //清除
    resetMailNoticeSearch(){
        this.mailNoticeSearchForm = {
            policyNo01: "",   //保單號碼
            policyNo02: "",   //保單號碼
            policyNo03: "",   //保單號碼 
            mailByPostId: "", //郵寄編號
            registerNo: "", //掛號編號
            custId: "",   //受訪者id
            custName: "", //受訪者姓名
    
            taskItemSelect: [], //電訪項目
            contractStatusSelected: "", //契約狀態
            caseStatusSelected: "",     //案件階段
            deliverStatusSelected: "",  //投遞狀態
            manualLetterStatusSelected: "", //信函狀態 批次/人工郵寄
            returnReasonSelected: "",   //退回原因
            cancelLetterSelected: "",   //取消信函
    
            dueContactStartDate: null, //應電訪日
            dueContactEndDate: null,    //應電訪日
            dueContactStartString : "",  //應電訪日
            dueContactEndString: "",   //應電訪日
    
            letterStartDate: null, //產信日
            letterEndDate: null,    //產信日
            letterStartDateString : "",  //產信日
            letterEndDateString: "",   //產信日
    
            mailByPostStartDate: null, //郵寄日期
            mailByPostEndDate: null,    //郵寄日期
            mailByPostStartDateString : "",  //郵寄日期
            mailByPostEndDateString: "",   //郵寄日期
    
            returnStartDate: null, //退回日期
            returnEndDate: null,    //退回日期
            returnStartDateString : "",  //退回日期
            returnEndDateString: "",   //退回日期
        };

        this.mailNoticeGrid.data = [];
        this.mailNoticeGrid.pagination.total = 0;
        this.clearValidateStatus();

    }

    clearValidateStatus(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo01, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo03, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custId, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custName, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostId, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.registerNo, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;
        this.isMailByPostStartVisible = false;
        this.isMailByPostEndVisible = false;
        this.isReturnStartVisible = false;
        this.isReturnEndVisible = false;
    }

    //查詢前驗證檢核
    validateSearch(){
        let validate = true;

        this.validatePolicyNo(null, null, () => {
            if (this.mailNoticeSearchValidateForm.policyNo01.hover) {
                validate = false;
            }
        });
        this.validatePolicyNo02(null, null, () => {
            if (this.mailNoticeSearchValidateForm.policyNo02.hover) {
                validate = false;
            }
        });
        this.validatePolicyNo03(null, null, () => {
            if (this.mailNoticeSearchValidateForm.policyNo03.hover) {
                validate = false;
            }
        });
        this.validateCustId(null, this.mailNoticeSearchForm.custId, () => {
            if (this.mailNoticeSearchValidateForm.custId.hover) {
                validate = false;
            }
        });
        this.validateCustName(null, this.mailNoticeSearchForm.custName, () => {
            if (this.mailNoticeSearchValidateForm.custName.hover) {
                validate = false;
            }
        });
        this.validateMailByPostId(null, this.mailNoticeSearchForm.mailByPostId, () => {
            if (this.mailNoticeSearchValidateForm.mailByPostId.hover) {
                validate = false;
            }
        });

        this.validateRegisterNo(null, this.mailNoticeSearchForm.registerNo, () => {
            if (this.mailNoticeSearchValidateForm.registerNo.hover) {
                validate = false;
            }
        });


        if(!this.dueContactDateValidate()){
            validate = false;
        }
        if(!this.letterDateValidate()){
            validate = false;
        }
        if(!this.mailByPostDateValidate()){
            validate = false;
        }
        if(!this.returnDateValidate()){
            validate = false;
        }

        if(validate){
            //檢核查詢條件數量(少於兩個不可執行查詢)
            let countResult = this.checkFilterCount();
            validate = countResult;
            if(!countResult){
              ErrorModalUtil.modalError(this.$t('mailNotice_search_filterCountError_1').toString()); //查詢條件至少輸入兩項
            }               
        }

        return validate;
    }

    //檢核查詢條件數量(少於兩個不可執行查詢)
    checkFilterCount(){
        let isAbleToSearch = false;
        let filterColumn = [];

        Object.keys(this.mailNoticeSearchForm).forEach((key=>{
            if(key != 'dueContactStartDate' && key !='dueContactEndDate' 
                && key !='letterStartDate' && key !='letterEndDate'
                && key !='mailByPostStartDate' && key !='mailByPostEndDate'
                && key !='returnStartDate' && key !='returnEndDate'){
              if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm[key])) {
                filterColumn.push(key);
              }
            }
          }))
      
          //若有填寫保單號碼或作業單號 即可直接查詢
        //   if(filterColumn.some((c)=>c == 'policyNo01' )){
        //       isAbleToSearch = true;
        //   }
      
          //計算有效查詢欄位數量
          if(!isAbleToSearch){
            let count = 0;
            if(filterColumn.some((c)=> c == "policyNo01" || c == "policyNo02" || c =="policyNo03")){
              count ++;
              filterColumn = filterColumn.filter((c)=> c != "policyNo01" && c != "policyNo02" && c !="policyNo03" );
            }
            if(filterColumn.some((c)=> c == "dueContactStartString" || c == "dueContactEndString")){
              count ++;
              filterColumn = filterColumn.filter((c)=> c != "dueContactStartString" && c != "dueContactEndString");
            }
            if(filterColumn.some((c)=> c == "letterStartDateString" || c == "letterEndDateString" )){
              count ++;
              filterColumn = filterColumn.filter((c)=> c != "letterStartDateString" && c != "letterEndDateString" );
            }
            
            if(filterColumn.some((c)=> c == "mailByPostStartDateString" || c == "mailByPostEndDateString" )){
                count ++;
                filterColumn = filterColumn.filter((c)=> c != "mailByPostStartDateString" && c != "mailByPostEndDateString" );
            }

            if(filterColumn.some((c)=> c == "returnStartDateString" || c == "returnEndDateString" )){
                count ++;
                filterColumn = filterColumn.filter((c)=> c != "returnStartDateString" && c != "returnEndDateString" );
            }

            count = count + filterColumn.length;
      
            if(count >=2){
              isAbleToSearch = true;
            }
          }
          
          return isAbleToSearch;
    }


    dueContactDateValidate(){
        let validate = true;
        this.validateDueContactStart(null, this.mailNoticeSearchForm.dueContactStartString, () => {
            if (this.mailNoticeSearchValidateForm.dueContStart.hoverVisible) {
                validate = false;
            }
        });
        this.validateDueContactEnd(null, this.mailNoticeSearchForm.dueContactEndString, () => {
            if (this.mailNoticeSearchValidateForm.dueContEnd.hoverVisible) {
                validate = false;
            }
        });
        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validate && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.dueContactEndString)) {
            this.validateDueContactStartAndEndDate(null, this.mailNoticeSearchForm.dueContactStartDate, this.mailNoticeSearchForm.dueContactEndDate, this.mailNoticeSearchForm.dueContactStartString,
            this.mailNoticeSearchForm.dueContactEndString, this.isDueContactStartVisible, this.isDueContactEndVisible, () => {
                if (this.mailNoticeSearchValidateForm.dueContStart.hoverVisible || this.mailNoticeSearchValidateForm.dueContEnd.hoverVisible) {
                    validate = false;
                }
            });
        }
        return validate;
    }

    letterDateValidate(){
        let validate = true;
        this.validateLetterStart(null, this.mailNoticeSearchForm.letterStartDateString, () => {
            if (this.mailNoticeSearchValidateForm.letterStart.hoverVisible) {
                validate = false;
            }
        });
        this.validateLetterEnd(null, this.mailNoticeSearchForm.letterEndDateString, () => {
            if (this.mailNoticeSearchValidateForm.letterEnd.hoverVisible) {
                validate = false;
            }
        });
        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validate && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.letterStartDateString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.letterEndDateString)) {
            this.validateLetterStartAndEndDate(null, this.mailNoticeSearchForm.letterStartDate, this.mailNoticeSearchForm.letterEndDate, this.mailNoticeSearchForm.letterStartDateString,
            this.mailNoticeSearchForm.letterEndDateString, this.isLetterStartVisible, this.isLetterEndVisible, () => {
                if (this.mailNoticeSearchValidateForm.letterStart.hoverVisible || this.mailNoticeSearchValidateForm.letterEnd.hoverVisible) {
                    validate = false;
                }
            });
        }
        return validate;
    }

    mailByPostDateValidate(){
        let validate = true;
        this.validateMailByPostStart(null, this.mailNoticeSearchForm.mailByPostStartDateString, () => {
            if (this.mailNoticeSearchValidateForm.mailByPostStart.hoverVisible) {
                validate = false;
            }
        });
        this.validateMailByPostEnd(null, this.mailNoticeSearchForm.mailByPostEndDateString, () => {
            if (this.mailNoticeSearchValidateForm.mailByPostEnd.hoverVisible) {
                validate = false;
            }
        });
        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validate && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.mailByPostStartDateString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.mailByPostEndDateString)) {
            this.validateMailByPostStartAndEndDate(null, this.mailNoticeSearchForm.mailByPostStartDate, this.mailNoticeSearchForm.mailByPostEndDate, this.mailNoticeSearchForm.mailByPostStartDateString,
            this.mailNoticeSearchForm.mailByPostEndDateString, this.isMailByPostStartVisible, this.isMailByPostEndVisible, () => {
                if (this.mailNoticeSearchValidateForm.mailByPostStart.hoverVisible || this.mailNoticeSearchValidateForm.mailByPostEnd.hoverVisible) {
                    validate = false;
                }
            });
        }
        return validate;    
    }

    returnDateValidate(){
        let validate = true;
        this.validateReturnStart(null, this.mailNoticeSearchForm.returnStartDateString, () => {
            if (this.mailNoticeSearchValidateForm.returnStart.hoverVisible) {
                validate = false;
            }
        });
        this.validateReturnEnd(null, this.mailNoticeSearchForm.returnEndDateString, () => {
            if (this.mailNoticeSearchValidateForm.returnEnd.hoverVisible) {
                validate = false;
            }
        });
        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validate && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.returnStartDateString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.returnEndDateString)) {
            this.validateReturnStartAndEndDate(null, this.mailNoticeSearchForm.returnStartDate, this.mailNoticeSearchForm.returnEndDate, this.mailNoticeSearchForm.returnStartDateString,
            this.mailNoticeSearchForm.returnEndDateString, this.isReturnStartVisible, this.isReturnEndVisible, () => {
                if (this.mailNoticeSearchValidateForm.returnStart.hoverVisible || this.mailNoticeSearchValidateForm.returnEnd.hoverVisible) {
                    validate = false;
                }
            });
        }
        return validate;    
    }

    // ===================================== 應電訪日期 DatePicker 事件 ========================================================
    
    onDueContactStartDateChange(date){
        this.mailNoticeSearchForm.dueContactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;

        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        this.dueContactDateValidate();
    }
    onDueContactEndDateChange(date){
        this.mailNoticeSearchForm.dueContactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
    
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        this.dueContactDateValidate();
    }

    eventMousOverDueContactStartDate(){
        if (this.mailNoticeSearchValidateForm.dueContStart.feedback) {
            this.isDueContactStartVisible = true;
        } else {
            this.isDueContactStartVisible = false;
        }
    }
    eventMousOverDueContactEndDate(){
        if (this.mailNoticeSearchValidateForm.dueContEnd.feedback) {
            this.isDueContactEndVisible = true;
        } else {
            this.isDueContactEndVisible = false;
        }
    }
    
    clearDueContactStartDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        this.isDueContactStartVisible = false;
        this.mailNoticeSearchForm.dueContactStartString = "";
        this.mailNoticeSearchForm.dueContactStartDate = null;
        this.dueContactDateValidate();
    }
    clearDueContactEndDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        this.isDueContactEndVisible = false;
        this.mailNoticeSearchForm.dueContactEndString = "";
        this.mailNoticeSearchForm.dueContactEndDate = null;
        this.dueContactDateValidate();
    }

    checkManualInputDueContactStartDate(data:any){
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;

        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);

        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isDueContactStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.dueContactStartDate = parseDate ? parseDate : this.mailNoticeSearchForm.dueContactStartDate;
          this.mailNoticeSearchForm.dueContactStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.dueContactStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];

    }
    checkManualInputDueContactEndDate(data:any){
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isDueContactEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.dueContactEndDate = parseDate ? parseDate : this.mailNoticeSearchForm.dueContactEndDate;
          this.mailNoticeSearchForm.dueContactEndString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.dueContactEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }


    // ===================================== 產信日期 DatePicker 事件 ========================================================

    onLetterStartDateChange(date){
        this.mailNoticeSearchForm.letterStartDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;
    
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        this.letterDateValidate();
    }
    onLetterEndDateChange(date){
        this.mailNoticeSearchForm.letterEndDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;
    
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        this.letterDateValidate();
    }
    
    eventMousOverLetterStartDate(){
        if (this.mailNoticeSearchValidateForm.letterStart.feedback) {
            this.isLetterStartVisible = true;
        } else {
            this.isLetterStartVisible = false;
        }
    }
    eventMousOverLetterEndDate(){
        if (this.mailNoticeSearchValidateForm.letterEnd.feedback) {
            this.isLetterEndVisible = true;
        } else {
            this.isLetterEndVisible = false;
        }
    }
    
    clearLetterStartDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        this.isLetterStartVisible = false;
        this.mailNoticeSearchForm.letterStartDateString = "";
        this.mailNoticeSearchForm.letterStartDate = null;
        this.letterDateValidate();
    }
    clearLetterEndDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        this.isLetterEndVisible = false;
        this.mailNoticeSearchForm.letterEndDateString = "";
        this.mailNoticeSearchForm.letterEndDate = null;
        this.letterDateValidate();
    }
    
    checkManualInputLetterStartDate(data:any){
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;
    
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
    
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isLetterStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.letterStartDate = parseDate ? parseDate : this.mailNoticeSearchForm.letterStartDate;
          this.mailNoticeSearchForm.letterStartDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.letterStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    
    }
    checkManualInputLetterEndDate(data:any){
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isLetterEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.letterEndDate = parseDate ? parseDate : this.mailNoticeSearchForm.letterEndDate;
          this.mailNoticeSearchForm.letterEndDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.letterEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }


    // ===================================== 郵寄日期 DatePicker 事件 ========================================================

    onMailByPostStartDateChange(date){
        this.mailNoticeSearchForm.mailByPostStartDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isMailByPostStartVisible = false;
        this.isMailByPostEndVisible = false;
      
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        this.mailByPostDateValidate();
      }
      onMailByPostEndDateChange(date){
        this.mailNoticeSearchForm.mailByPostEndDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isMailByPostStartVisible = false;
        this.isMailByPostEndVisible = false;
      
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        this.mailByPostDateValidate();
      }
      
      eventMousOverMailByPostStartDate(){
        if (this.mailNoticeSearchValidateForm.mailByPostStart.feedback) {
            this.isMailByPostStartVisible = true;
        } else {
            this.isMailByPostStartVisible = false;
        }
      }
      eventMousOverMailByPostEndDate(){
        if (this.mailNoticeSearchValidateForm.mailByPostEnd.feedback) {
            this.isMailByPostEndVisible = true;
        } else {
            this.isMailByPostEndVisible = false;
        }
      }
      
      clearMailByPostStartDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        this.isMailByPostStartVisible = false;
        this.mailNoticeSearchForm.mailByPostStartDateString = "";
        this.mailNoticeSearchForm.mailByPostStartDate = null;
        this.mailByPostDateValidate();
      }
      clearMailByPostEndDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        this.isMailByPostEndVisible = false;
        this.mailNoticeSearchForm.mailByPostEndDateString = "";
        this.mailNoticeSearchForm.mailByPostEndDate = null;
        this.mailByPostDateValidate();
      }
      
      checkManualInputMailByPostStartDate(data:any){
        this.isMailByPostStartVisible = false;
        this.isMailByPostEndVisible = false;
      
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
      
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isMailByPostStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.mailByPostStartDate = parseDate ? parseDate : this.mailNoticeSearchForm.mailByPostStartDate;
          this.mailNoticeSearchForm.mailByPostStartDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.mailByPostStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
      
      }
      checkManualInputMailByPostEndDate(data:any){
        this.isMailByPostStartVisible = false;
        this.isMailByPostEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isMailByPostEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.mailByPostEndDate = parseDate ? parseDate : this.mailNoticeSearchForm.mailByPostEndDate;
          this.mailNoticeSearchForm.mailByPostEndDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.mailByPostEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
      }

    // ===================================== 退回日期 DatePicker 事件 ========================================================

    onReturnStartDateChange(date){
        this.mailNoticeSearchForm.returnStartDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isReturnStartVisible = false;
        this.isReturnEndVisible = false;
      
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        this.returnDateValidate();
      }
      onReturnEndDateChange(date){
        this.mailNoticeSearchForm.returnEndDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isReturnStartVisible = false;
        this.isReturnEndVisible = false;
      
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        this.returnDateValidate();
      }
      
      eventMousOverReturnStartDate(){
        if (this.mailNoticeSearchValidateForm.returnStart.feedback) {
            this.isReturnStartVisible = true;
        } else {
            this.isReturnStartVisible = false;
        }
      }
      eventMousOverReturnEndDate(){
        if (this.mailNoticeSearchValidateForm.returnEnd.feedback) {
            this.isReturnEndVisible = true;
        } else {
            this.isReturnEndVisible = false;
        }
      }
      
      clearReturnStartDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        this.isReturnStartVisible = false;
        this.mailNoticeSearchForm.returnStartDateString = "";
        this.mailNoticeSearchForm.returnStartDate = null;
        this.returnDateValidate();
      }
      clearReturnEndDate(){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        this.isReturnEndVisible = false;
        this.mailNoticeSearchForm.returnEndDateString = "";
        this.mailNoticeSearchForm.returnEndDate = null;
        this.returnDateValidate();
      }
      
      checkManualInputReturnStartDate(data:any){
        this.isReturnStartVisible = false;
        this.isReturnEndVisible = false;
      
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
      
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isReturnStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.returnStartDate = parseDate ? parseDate : this.mailNoticeSearchForm.returnStartDate;
          this.mailNoticeSearchForm.returnStartDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.returnStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
      
      }
      checkManualInputReturnEndDate(data:any){
        this.isReturnStartVisible = false;
        this.isReturnEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isReturnEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, true, this.$t('global_dateError').toString(), false);
          }
          this.mailNoticeSearchForm.returnEndDate = parseDate ? parseDate : this.mailNoticeSearchForm.returnEndDate;
          this.mailNoticeSearchForm.returnEndDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.mailNoticeSearchForm.returnEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
      }

    // ===================================== 驗證 ========================================================

    /**
     * @description 取得驗證參數
     * @param fv 
     * @returns 
     * 
     * @author B1842
     * @version 2022/06/13
     */
    callCommonUtilFeild(fv: ValidateFormComponent){
        return CommonUtil.getFeildValid(fv);
    }

    /**
     * @description 變更hover hoverVisivle參數
     * @param fv 
     * 
     * @author B1842
     * @version 2022/06/13
     */
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    /**
    * 保單號碼驗證
    * @param rule 驗證規則 
    * @param value 驗證內容
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
     validatePolicyNo(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo01, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, false, '', false);
        
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo01)) {
            if (!ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo01)) {
                if(ValidationUtil.isAnyChinese(this.mailNoticeSearchForm.policyNo01)){
                    CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo01, true, this.$t('mailNotice_validate_policyNo_1').toString(), false); // 保單號碼 不可輸入中文 
                    callback(() => { });
                }else{
                    if (ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo02)) {
                        // 保單序號 必填
                        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, true, this.$t('mailNotice_validate_policySeq_1').toString(), false);
                    } else if (!ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo02)) {
                        // 保單序號 僅可輸入數字
                        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, true, this.$t('mailNotice_validate_policySeq_2').toString(), false); 
                    }
                }

            } else {
                // 保單序號 僅可輸入數字
                if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo02)) {
                    CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, true, this.$t('mailNotice_validate_policySeq_2').toString(), false); 
                }
            }
        } else {
            // 保單序號 僅可輸入數字
            if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo02)) {
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, true, this.$t('mailNotice_validate_policySeq_2').toString(), false);
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
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, false, '', false);
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo02)) {
            if (!ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo02)) {
                // 保單序號 僅可輸入數字
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, true, this.$t('mailNotice_validate_policySeq_2').toString(), false);
                callback(() => { });
            }
        } else {
            if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo01)) {
                if (!ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo01)) {
                    // 保單序號 必填
                    CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo02, true, this.$t('mailNotice_validate_policySeq_1').toString(), false);
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
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo03, false, '', false);
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.policyNo03)) {
            if (!ValidationUtil.numberOnlyValidation(this.mailNoticeSearchForm.policyNo03)) {
                // 保單重複碼 僅可輸入數字
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.policyNo03, true, this.$t('mailNotice_validate_idDup_1').toString(), false); 
                callback(() => { });
            }
        }
        callback();
    }

   /**
     * 受訪者id驗證
     * @param rule 驗證規則 
     * @param value
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateCustId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custId, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            if (!ValidationUtil.alphabetAndNumberValidation(value)) {
                //受訪者ID 僅可輸入英文與數字 
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custId, true, this.$t('mailNotice_validate_custId_1').toString(), false);
                callback(() => { });
            }
        }
        callback();
    }

    /**
     * 受訪者姓名驗證
     * @param rule 驗證規則 
     * @param value
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateCustName(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custName, false, '', false);
        if(!ValidationUtil.isEmpty(value)){
            if(!ValidationUtil.onlyHalfwidthOrFullWithNum(value)){
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custName, false, '', false); 
            }else{
                //受訪者姓名 僅可輸入中文、全形英文或全形符號 
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.custName, true, this.$t('mailNotice_validate_custName_1').toString(), false);
                callback(()=>{});
            }
        }
        callback();
    }

    /**
     * 郵寄編號驗證
     * @param rule 驗證規則 
     * @param value
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
     validateMailByPostId(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostId, false, '', false);
        if(!ValidationUtil.isEmpty(value)){
            if(!ValidationUtil.alphabetAndNumberAndSymbolValidation(value)){
                //郵寄編號 僅可輸入英文與數字及符號 
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostId, true, this.$t('mailNotice_validate_mailPostById_1').toString(), false); 
                callback(()=>{});
            }else{
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostId, false, '', false);
            }
        }
        callback();
    }

    /**
     * 掛號編號驗證
     * @param rule 驗證規則 
     * @param value
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateRegisterNo(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.registerNo, false, '', false);
        if(!ValidationUtil.isEmpty(value)){
            if(!ValidationUtil.onlyHalfEngChnNum(value)){
                //掛號編號 僅可中文及英數字 
                CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.registerNo, true, this.$t('mailNotice_validate_registerNo_1').toString(), false);
                callback(()=>{});
            }
        }
        callback();
    }

    /**
     * 應電訪日期格式驗證(起)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateDueContactStart(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isDueContactStartVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }

    /**
     * 應電訪日期格式驗證(訖)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateDueContactEnd(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isDueContactEndVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }


    /**
     * 應電訪日期 起訖日期驗證
     * @param rule 驗證規則 
     * @param startTime 起始日期
     * @param endTime 結束日期 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateDueContactStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, false, '', false);
        if ( startString != endString && moment(startDate).isAfter(endDate) ) {

        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.dueContactEndString)) {
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.dueContEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }

    /**
     * 產信日期格式驗證(起)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateLetterStart(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isLetterStartVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }

    /**
     * 產信日期格式驗證(訖)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateLetterEnd(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isLetterEndVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }


    /**
     * 產信日期 起訖日期驗證
     * @param rule 驗證規則 
     * @param startTime 起始日期
     * @param endTime 結束日期 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateLetterStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, false, '', false);
        if ( startString != endString && moment(startDate).isAfter(endDate) ) {

        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.letterStartDateString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.letterEndDateString)) {
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.letterEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }

    /**
     * 郵寄日期格式驗證(起)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateMailByPostStart(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isMailByPostStartVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }
    
    /**
     * 郵寄日期格式驗證(訖)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateMailByPostEnd(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isMailByPostEndVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }
    
    
    /**
     * 郵寄日期 起訖日期驗證
     * @param rule 驗證規則 
     * @param startTime 起始日期
     * @param endTime 結束日期 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateMailByPostStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, false, '', false);
        if ( startString != endString && moment(startDate).isAfter(endDate) ) {
    
        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.mailByPostStartDateString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.mailByPostEndDateString)) {
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.mailByPostEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }

    /**
     * 退回日期格式驗證(起)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateReturnStart(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isReturnStartVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }
    
    /**
     * 退回日期格式驗證(訖)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateReturnEnd(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
        const parseDate = this.formatter.parse(value);
        if (!parseDate) {
            this.isReturnEndVisible = true;
            //日期錯誤
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, true, this.$t('global_dateError').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }
    
    
    /**
     * 退回日期 起訖日期驗證
     * @param rule 驗證規則 
     * @param startTime 起始日期
     * @param endTime 結束日期 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateReturnStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, false, '', false);
        if ( startString != endString && moment(startDate).isAfter(endDate) ) {
    
        dateDisableStart = true;
        dateDisableEnd = true;
        if (!ValidationUtil.isEmpty(this.mailNoticeSearchForm.returnStartDateString) && !ValidationUtil.isEmpty(this.mailNoticeSearchForm.returnEndDateString)) {
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            //請輸入正確的起訖日期
            CommonUtil.feildValidateWithVisible(this.mailNoticeSearchValidateForm.returnEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
            callback(() => { });
        }
        }
        callback();
    }
}