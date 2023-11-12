import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { letterValidateValidForm } from "./model";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { InitLetterValidateOutput, GetLetterValidateInfoInput, GetLetterValidateInfoOutput, LetterValidateGrid, ExportLetterValidateInfoInput, ResponseEntity 
,GetAvailablePackingMailPostInput, GetAvailablePackingMailPostOutput, PackingMailPostInput
} from "@fubonlife/obd-api-axios-sdk";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import axios, { AxiosResponse, AxiosRequestConfig} from 'axios';
import LetterValidateAbnormalModal from "@/components/shared/letterValidateModal/LetterValidateAbnormalModal.vue";
import LetterValidateSamplingModal from "@/components/shared/letterValidateModal/LetterValidateSamplingModal.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { Modal, message } from "ant-design-vue";

/**
 * 打 ajax 前端使用回傳值 
 */
export enum EnumAjaxFunRetunr {
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
}
export interface GetAvailablePackingMailPostAjaxResult {
    getAvailablePackingAjaxOut?:EnumAjaxFunRetunr; 
    getAvailablePackingMailPostOutput?:GetAvailablePackingMailPostOutput
}
@Component({
    components: {
        FblDataGrid, LetterValidateAbnormalModal, LetterValidateSamplingModal
    }
})
export default class LetterValidatePage extends Vue {

    // DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    letterValidateSearchForm = {
        letterStartDate: null, //產信日
        letterEndDate: null,    //產信日
        letterStartDateString: "",  //產信日
        letterEndDateString: "",   //產信日
    }

    letterValidateSearchValidForm: letterValidateValidForm = {
        letterStart: { feedback: false, hoverVisible: false },
        letterEnd: { feedback: false, hoverVisible: false },
    }

    letterValidateSearchRule: { [key: string]: ValidationRule[] } = {
        letterStart: [{ validator: this.validateLetterStart, trigger: "blur" }],
        letterEnd: [{ validator: this.validateLetterEnd, trigger: "blur" }],
    }

    //日期選擇器hover是否顯示
    isLetterStartVisible: boolean = false;
    isLetterEndVisible: boolean = false;


    //判斷當下是否可執行匯出
    isExportDisable: boolean = false;
    overMaxRowCountMessage: string = "";


    // ===================================== Grid ========================================================
    letterValidateGrid: FblPDataGridHolder<LetterValidateGrid> = {
        rowKey: "rowKey",
        data: [],
        // 不需要分頁
        // pagination:{
        //     showSizeChanger: true,
        //     pageSizeOptions: ['15', '30', '50'],
        //     current: 1,
        //     pageSize: 15,
        //     total: 0,
        //     locale: { items_per_page: "" },
        //     showTotal: true,
        // },
        // scroll: { x: 500, y: 600 },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "letterDateStr",
                title: this.$t('letterValidate_grid_letterDateStr').toString(),   //產信日期
                width: 110,
            },
            {
                type: FblColumnType.PLAIN,
                property: "batchCount",
                title: this.$t('letterValidate_grid_batchCount').toString(), //批次
                width: 120,
                // template: "alink_batch_Template",
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "manualCount",
                title: this.$t('letterValidate_grid_manualCount').toString(), //人工
                width: 120,
                // template: "alink_manual_Template",
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "mailPostCount",
                title: this.$t('letterValidate_grid_mailPostCount').toString(), //應產生件數
                width: 120,
                // template: "alink_mailByPostCount_Template",
                align: 'center',
            },
            {
                type: FblColumnType.TEMPLATE,
                property: "abnormalCount",
                title: this.$t('letterValidate_grid_abnormalCount').toString(), //異常件數
                width: 120,
                template: "alink_abnormalCount_Template",
                align: 'center',
            },
        ]
    }

    // =====================================  Modal 點擊相關參數 start========================================================
    letterValidateModal:{ [key: string]: boolean } = {
        isSamplingModalShow: false, // 信函驗證
    }

    // 信函驗證 需要參數
    samplingParam:{letterStartDate:string; letterEndDate:string;} ={
        letterStartDate: null,
        letterEndDate: null,
    }

    // ===================================== Grid Modal 點擊相關參數 start========================================================
    letterValidateGridModal: { [key: string]: boolean } = {
        isAbnormalDetailShow: false, // 異常件明細
    }

    // 異常件明細 需要參數
    abnormalDetailParam = {
        propLetterDate: undefined,
    }


    // ===================================== 初始  ========================================================    
    created() {
        // 取得初始 產信日期
        this.getInitLetterDate()
            // 查詢報表
            .then((res: EnumAjaxFunRetunr) => {
                // 取得初始 產信日期 成功才查詢報表
                if (res === EnumAjaxFunRetunr.SUCCESS) {
                    this.searchLetterValidate();
                }
            });

    }


    // ===================================== 驗證 ========================================================

    /**
     * @description 取得驗證參數
     * @param fv 
     * @returns 
     * 
     * @author B1842
     * @version 2022/09/10
     */
    callCommonUtilFeild(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValid(fv);
    }

    /**
     * @description 變更hover hoverVisivle參數
     * @param fv 
     * 
     * @author B1842
     * @version 2022/09/10
     */
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    /**
     * 產信日期格式驗證(起)
     * @param rule 驗證規則 
     * @param value 日期
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateLetterStart(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (!parseDate) {
                this.isLetterStartVisible = true;
                //日期錯誤
                CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, true, this.$t('global_dateError').toString(), false);
                callback(() => { });
            }
        } else {
            // 產信日期為必填
            CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, true, this.$t('letterValidate_valid_1').toString(), false);
            callback(() => { });
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
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (!parseDate) {
                this.isLetterEndVisible = true;
                //日期錯誤
                CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, true, this.$t('global_dateError').toString(), false);
                callback(() => { });
            }
        } else {
            // 產信日期為必填
            CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, true, this.$t('letterValidate_valid_1').toString(), false);
            callback(() => { });
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

        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        if (startString != endString && moment(startDate).isAfter(endDate)) {

            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.letterValidateSearchForm.letterStartDateString) && !ValidationUtil.isEmpty(this.letterValidateSearchForm.letterEndDateString)) {
                //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
                //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false);
                callback(() => { });
            }
        }
        callback();
    }

    /**
     * 產信日期總驗證
     * @returns 
     */
    letterDateValidate() {
        let validate = true;
        this.validateLetterStart(null, this.letterValidateSearchForm.letterStartDateString, () => {
            if (this.letterValidateSearchValidForm.letterStart.feedback) {
                validate = false;
            }
        });
        this.validateLetterEnd(null, this.letterValidateSearchForm.letterEndDateString, () => {
            if (this.letterValidateSearchValidForm.letterEnd.feedback) {
                validate = false;
            }
        });
        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validate && !ValidationUtil.isEmpty(this.letterValidateSearchForm.letterStartDateString) && !ValidationUtil.isEmpty(this.letterValidateSearchForm.letterEndDateString)) {
            this.validateLetterStartAndEndDate(null, this.letterValidateSearchForm.letterStartDate, this.letterValidateSearchForm.letterEndDate, this.letterValidateSearchForm.letterStartDateString,
                this.letterValidateSearchForm.letterEndDateString, this.isLetterStartVisible, this.isLetterEndVisible, () => {
                    if (this.letterValidateSearchValidForm.letterStart.hoverVisible || this.letterValidateSearchValidForm.letterEnd.hoverVisible) {
                        validate = false;
                    }
                });
        }
        return validate;
    }

    /**
     * 查詢前驗證檢核
     * @returns validate : ture/false
     */
    validateSearch() {
        let validate = true;
        if (!this.letterDateValidate()) {
            validate = false;
        }
        return validate;
    }

    // ===================================== 產信日期 DatePicker 事件 ========================================================

    onLetterStartDateChange(date) {
        this.letterValidateSearchForm.letterStartDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;

        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        this.letterDateValidate();
    }
    onLetterEndDateChange(date) {
        this.letterValidateSearchForm.letterEndDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;

        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        this.letterDateValidate();
    }

    // eventMousOverLetterStartDate(){
    //     if (this.letterValidateSearchValidForm.letterStart.feedback) {
    //         this.isLetterStartVisible = true;
    //     } else {
    //         this.isLetterStartVisible = false;
    //     }
    // }
    // eventMousOverLetterEndDate(){
    //     if (this.letterValidateSearchValidForm.letterEnd.feedback) {
    //         this.isLetterEndVisible = true;
    //     } else {
    //         this.isLetterEndVisible = false;
    //     }
    // }

    clearLetterStartDate() {
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        this.isLetterStartVisible = false;
        this.letterValidateSearchForm.letterStartDateString = "";
        this.letterValidateSearchForm.letterStartDate = null;
        this.letterDateValidate();
    }
    clearLetterEndDate() {
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        this.isLetterEndVisible = false;
        this.letterValidateSearchForm.letterEndDateString = "";
        this.letterValidateSearchForm.letterEndDate = null;
        this.letterDateValidate();
    }

    checkManualInputLetterStartDate(data: any) {
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;

        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);

        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isLetterStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, true, this.$t('global_dateError').toString(), false);
        }
        this.letterValidateSearchForm.letterStartDate = parseDate ? parseDate : this.letterValidateSearchForm.letterStartDate;
        this.letterValidateSearchForm.letterStartDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.letterValidateSearchForm.letterStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];

    }
    checkManualInputLetterEndDate(data: any) {
        this.isLetterStartVisible = false;
        this.isLetterEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            this.isLetterEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.letterValidateSearchValidForm.letterEnd, true, this.$t('global_dateError').toString(), false);
        }
        this.letterValidateSearchForm.letterEndDate = parseDate ? parseDate : this.letterValidateSearchForm.letterEndDate;
        this.letterValidateSearchForm.letterEndDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.letterValidateSearchForm.letterEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    // ===================================== Grid 事件 ========================================================

    /**
     * 異常件數量點擊查詢明細
     * @param data 
     */
    clickAbnormalCount(data: any) {
        this.letterValidateGridModal.isAbnormalDetailShow = true;
        this.abnormalDetailParam.propLetterDate = data.letterDate;
    }

    // ===================================== click 事件 ========================================================

    /**
     * 查詢
     */
    searchLetterValidate() {
        if (this.validateSearch()) {
            this.isExportDisable = false;
            this.letterValidateGrid.data = [];
            this.getLetterValidateInfo();
        }
    }

    /**
     * 清除
     */
    resetSearchLetterValidate() {
        // 取得初始 產信日期
        this.getInitLetterDate()
            // 查詢報表
            .then((res: EnumAjaxFunRetunr) => {
                // 取得初始 產信日期 成功才查詢報表
                if (res === EnumAjaxFunRetunr.SUCCESS) {
                    this.searchLetterValidate();
                }
            });

        this.letterValidateGrid.data = [];
    }

    /**
     * click 匯出
     */
    exportLetterValidate() {
        if (!this.isExportDisable) {
            if (this.letterValidateGrid.data.length == 0) {
                ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出     
            } else {
                // 打匯出 ajax
                if (this.validateSearch()) {
                    this.exportLetterValidateInfo();
                } else {
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

    /**
     * click 打包
     */
    clickToPackingMailPost(){
        // 先取得是否有可打包郵寄
        this.getAvailablePackingMailPost()
        .then((res:GetAvailablePackingMailPostAjaxResult)=>{
            // 取的有可打包的郵件才打 郵寄壓縮打包下載
            if(res.getAvailablePackingAjaxOut === EnumAjaxFunRetunr.SUCCESS){
                
                this.packingMailPost(res.getAvailablePackingMailPostOutput.mailPostIdList);
            }
        })
    }

    /**
     * 關閉modal
     * @param modalName 
     */
    onCloseModal(modalName){
        this.letterValidateModal[modalName] = false;
    }

    /**
     * click 信函驗證
     */
    clickLetterVerify(){
        this.letterValidateModal.isSamplingModalShow = true;
        this.samplingParam.letterStartDate = this.letterValidateSearchForm.letterStartDate;
        this.samplingParam.letterEndDate = this.letterValidateSearchForm.letterEndDate;
    }

    /**
     * 信函驗證儲存
     */
    letterValidateSamplingModalFormSubmit(){
        (this.$refs.letterValidateSamplingModalForm as any).submit();
    }

    // ===================================== ajax ========================================================

    /**
     * 取得初始 產信日期
     */
    async getInitLetterDate() {
        var getInitLetterDateOut: EnumAjaxFunRetunr = EnumAjaxFunRetunr.SUCCESS;

        LoadingUtil.show();
            await this.$mailValidateApi.initLetterValidateUsingGET()
            .then((resp: AxiosResponse<InitLetterValidateOutput>) => {
                if (resp.data.success) {
                    this.letterValidateSearchForm.letterStartDate = new Date(resp.data.letterStartDate);
                    this.onLetterStartDateChange(resp.data.letterStartDate);
                    this.letterValidateSearchForm.letterEndDate = new Date(resp.data.letterEndDate);
                    this.onLetterEndDateChange(resp.data.letterEndDate);
                    getInitLetterDateOut = EnumAjaxFunRetunr.SUCCESS;
                } else {
                    //取得預設產信日期發生異常
                    ErrorModalUtil.modalError(this.$t('letterValidate_error_1').toString());
                    getInitLetterDateOut = EnumAjaxFunRetunr.FAIL;
                }
                LoadingUtil.close();
            })
            .catch((error) => {
                //取得預設產信日期發生異常
                ErrorModalUtil.modalError(this.$t('letterValidate_error_1').toString());
                LoadingUtil.close();
                getInitLetterDateOut = EnumAjaxFunRetunr.FAIL;
            })
            ;

        return getInitLetterDateOut;
    }

    /**
     * 依產信日期查詢報表資訊
     */
    getLetterValidateInfo() {

        var getLetterValidateInfoInput: GetLetterValidateInfoInput = {};
        getLetterValidateInfoInput.letterStartDate = this.letterValidateSearchForm.letterStartDate;
        getLetterValidateInfoInput.letterEndDate = this.letterValidateSearchForm.letterEndDate;

        LoadingUtil.show();
        this.$mailValidateApi.getLetterValidateInfoUsingPOST(getLetterValidateInfoInput)
            .then((resp: AxiosResponse<GetLetterValidateInfoOutput>) => {
                if (resp.data.success) {
                    this.letterValidateGrid.data = resp.data.letterValidateGridList;

                    var total: number = resp.data.letterValidateGridList.length;
                    this.$exportApi.checkExportUsingGET(total)
                        .then((exportCheck) => {
                            if (exportCheck.data.isOverMaxCount) {
                                this.isExportDisable = true;
                            }
                            this.overMaxRowCountMessage = exportCheck.data.errorMessage;
                            LoadingUtil.close();
                        })
                        .catch((error) => {
                            ErrorModalUtil.modalError(this.$t('error_checkOverExportMaxNum_error').toString()); //確認查詢結果是否超出匯出最大限制筆數失敗
                            LoadingUtil.close();
                        })
                } else {
                    //查詢委外函證報表資訊發生異常
                    ErrorModalUtil.modalError(this.$t('letterValidate_error_2').toString());
                }
            })
            .catch((error) => {
                //查詢委外函證報表資訊發生異常
                ErrorModalUtil.modalError(this.$t('letterValidate_error_2').toString());
                LoadingUtil.close();
            });
    }


    /**
     * 匯出委外函證驗證報表
     */
    exportLetterValidateInfo() {
        var exportLetterValidateInfoInput: ExportLetterValidateInfoInput = {};
        exportLetterValidateInfoInput.letterStartDate = this.letterValidateSearchForm.letterStartDate;
        exportLetterValidateInfoInput.letterEndDate = this.letterValidateSearchForm.letterEndDate;

        LoadingUtil.show();
        this.$mailValidateApi.exportLetterValidateInfoUsingPOST(exportLetterValidateInfoInput, { responseType: 'blob' })
            .then((resp: AxiosResponse<ResponseEntity>) => {
                this.dealDownLoadData(resp.data, this.$t('letterValidate_file_1').toString() + ".xlsx");   // 委外函證報表.xlsx
                MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
            })
            .catch((error) => {
                ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
            })
            .finally(() => {
                LoadingUtil.close();
            })
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

    /**
     * 取得是否可打包檔案
     * @returns GetAvailablePackingMailPostAjaxResult
     */
    async getAvailablePackingMailPost():Promise<GetAvailablePackingMailPostAjaxResult>{

        // 初始準備回傳的 output
        var getAvailableAjaxReturn:GetAvailablePackingMailPostAjaxResult = {
            getAvailablePackingAjaxOut:EnumAjaxFunRetunr.SUCCESS,
            getAvailablePackingMailPostOutput:{},
        };

        // 整理 取得是否可打包檔案 ajax input
        var getAvailablePackingMailPostInput:GetAvailablePackingMailPostInput={};
        getAvailablePackingMailPostInput.letterStartDate = this.letterValidateSearchForm.letterStartDate;
        getAvailablePackingMailPostInput.letterEndDate = this.letterValidateSearchForm.letterEndDate;

        LoadingUtil.show();
        await this.$mailValidateApi.getAvailablePackingMailPostUsingPOST(getAvailablePackingMailPostInput)
        .then((resp:AxiosResponse<GetAvailablePackingMailPostOutput>)=>{
            if(resp && resp.data){
                if(resp.data.success){
                    if(ValidationUtil.isEmpty(resp.data.warningMessage)){
                        getAvailableAjaxReturn.getAvailablePackingMailPostOutput = resp.data;
                        LoadingUtil.close();
                    }else{
                        getAvailableAjaxReturn.getAvailablePackingAjaxOut = EnumAjaxFunRetunr.FAIL;
                        // 完全無可被打包資訊 
                        if(resp.data.returnCode === "1"){
                            Modal.warning({
                                title: "", // 不需要，給空字串，下方格式才不會跑版
                                content: this.$t('letterValidatePacking_error_1').toString(), //無可被打包資訊 
                                okText: this.$t('global_ok').toString(), // 確定
                                centered: true,
                            });
                        }
                        // 打包資訊包含 須驗證而未驗證
                        else if(resp.data.returnCode === "2"){
                            var messageDescriptionList:Array<string> = [];
                            resp.data.warningMessage.split(",").forEach((eachMsg)=>{
                                messageDescriptionList.push(eachMsg + this.$t('letterValidatePacking_error_1_1').toString()); // 無驗證信函! 
                            });

                            Modal.warning({
                                title: "", // 不需要，給空字串，下方格式才不會跑版
                                content: (h)=>{
                                    let msgListWithPObject = [];
                                    messageDescriptionList.forEach(m => {
                                        msgListWithPObject.push(h('p', m));
                                    });
                                    return h('div', {}, msgListWithPObject);
                                },
                                okText: this.$t('global_ok').toString(), // 確定
                                centered: true,
                            })

                        }

                        
                        LoadingUtil.close();
                    }
                }else{
                    throw 'error';
                }
            }else{
                throw 'error';
            }
        })
        .catch((error)=>{
            getAvailableAjaxReturn.getAvailablePackingAjaxOut = EnumAjaxFunRetunr.FAIL;
            ErrorModalUtil.modalError(this.$t('letterValidatePacking_error_2').toString()); // 取得可打包的郵件發生異常
            LoadingUtil.close();
        });

        return getAvailableAjaxReturn;
    }


    /**
     * 打包壓縮下在檔案
     * @param mailPostIdList 
     */
    packingMailPost(mailPostIdList:Array<string>){
        
        var packingMailPostInput:PackingMailPostInput={
            mailPostIdList:[],
        };
        packingMailPostInput.mailPostIdList = mailPostIdList;
        
        LoadingUtil.show();
        this.$mailValidateApi.packingMailPostUsingPOST(packingMailPostInput, {responseType : 'blob'})
        .then((resp:AxiosResponse<ResponseEntity>)=>{
            var realFileName = resp.headers["content-disposition"].split("filename=")[1]; // 取得後端給的 fileName (民國年 + 時間)YYYMMDD+HHmmss
            this.dealDownLoadData(resp.data, realFileName + ".zip");
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('letterValidatePacking_error_3').toString()); // 打包郵件發生異常
        })
        .finally(()=>{
            LoadingUtil.close();
        })

    }

}