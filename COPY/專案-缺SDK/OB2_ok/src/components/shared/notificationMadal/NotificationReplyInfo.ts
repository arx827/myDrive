import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { NotiQuestTableDto, NotiReplyInitDto, InfFileDto, NotiPdfInfoDto, NotiFileUploadDto, ResponseEntity, OutputDto, NotificationReadOnlyDto } from '@fubonlife/obd-api-axios-sdk';
import { NotiReplyValidateForm, HandleStatus } from "./model";
import { Modal, TimePicker } from "ant-design-vue";
import ValidationUtil from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { AxiosResponse } from "axios";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import NotificationCallUpAgentModal from "./NotificationCallUpAgentModal.vue";
import MessageUtil from "@/assets/config/MessageUtil";
import { AgentPersonModule } from '@/plugins/store/CallUpAgentModule';

@Component({
    components: { FblDataGrid, TimePicker, NotificationCallUpAgentModal, Modal }
  })
export default class NotificationReplyInfo extends Vue {

    @Prop()
    isEdit: boolean;

    @Prop()
    caseNo: string;

    @Prop()
    notiInfoId: string; // 照會作業單號

    // 照會傳入資訊
    agentForm = {
        caseNo: '',
        notiInfoId: '',
        caseLogId: ''
    }

    // 處理狀態
    handleStatusEnum = HandleStatus;

    // 回覆表單內容
    notiReplyForm = {
        handleStatus: "",
        contentId: "",
        content: "",
        contactDate: null,
        contactString: "",
        datePickerContactDate: null,
        convenientContactStartTime: null,
        convenientContactEndTime: null,
        convenientContactStartString: "",
        convenientContactEndString: "",
        fileIds: [],
        fileNames: [],
        deletedFileIds: [],
        expireDate: null,
        expireDatePicker: null,
        expireDateString: '',
        lastExpireDate: '',
        defaultExpireDate: '',
        addFileIds: [],
        reminder: false
    }

    // 待結案唯讀
    notiReplyReadOnly : NotificationReadOnlyDto = {};

    // 處理狀態 選項
    handleStatusOptions = [];
    // 回覆內容 選項
    replyContentOption = [];
    // 照會作業單資訊
    notiPdfInfo : NotiPdfInfoDto = {};
    // 照會作業單檔案
    notiOpenFile : InfFileDto = {};

    // 選擇上傳檔案名稱
    selectedFileName: string = "";
    // 上傳按鍵wording變換
    isUploading: boolean = false;
    // 上傳檔案儲存變數
    uploadingFile: File = null;

    //日期選擇器hover是否顯示
    isContactDateVisible: boolean = false;
    isTimePickerShow: boolean = false;

    // 聯繫業務員
    contactAgentShow: boolean = false;

    // 回覆結案
    notiClosedConfirmShow: boolean = false;

    // DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    //時間選擇器是否顯示
    isConvenientContactStartOpen: boolean = false;
    isConvenientContactEndOpen: boolean = false;

    //欄位驗證提示工具
    notiReplyValidateForm :NotiReplyValidateForm = {
        content: { feedback: false, hoverVisible: false },
        contactDate: { feedback: false, hoverVisible: false },
        convenientContactStartTime: { feedback: false, hoverVisible: false },
        convenientContactEndTime: { feedback: false, hoverVisible: false },
        notiExpireDate: { feedback: false, hoverVisible: false },
        handleStatus: { feedback: false, hoverVisible: false }
    }
    
    // 欄位驗證
    notiReplyFormRules: { [key: string]: ValidationRule[] } = {
        content: [{ validator: this.validateContent, trigger: "blur" }],
        convenientContactStartTime: [{ validator: this.validateTimeStart, trigger: "blur" }],
        convenientContactEndTime: [{ validator: this.validateTimeEnd, trigger: "blur" }],
        notiExpireDate: [{ validator: this.validateExpireDate, trigger: "blur" }]
    };

    // 電訪內容 table
    gridData : FblPDataGridHolder<NotiQuestTableDto> = {
        rowKey: 'index',
        data: [],
        columns: [
        {
            type: FblColumnType.PLAIN,
            title: this.$t('notificationInterview_number').toString(),  // 序號
            width: 60,
            align: 'center',
            property: 'index'
        },
        {
            type: FblColumnType.PLAIN,
            property: 'question',
            title: this.$t('notificationInterview_questContent').toString()  // 電訪問卷
        },
        {
            type: FblColumnType.PLAIN,
            property: 'answer',
            title: this.$t('notificationInterview_answerInput').toString(),  // 保戶回答
        }]
    };

    // 檔案列表 table
    gridFileData : FblPDataGridHolder<InfFileDto> = {
        rowKey: 'fileId',
        data: [],
        // pagination: false,
        columns: [
        {
            type: FblColumnType.TEMPLATE,
            title: '',
            property: 'fileId',
            template: 'handleTemp',
            width: 10,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'fileName',
            title: this.$t('global_fileName').toString() //檔案名稱
        },
        ],
    };

    // ==================================================== Hook ==========================================================

    /**
     * @description 照會資訊區初始化
     * 
     * @author B1529
     * @version 2022/06/13
     */
   created() {

        // 案件編號
        if(!ValidationUtil.isEmpty(this.caseNo)){
            this.agentForm.caseNo = this.caseNo;
        }

        // 照會作業單號
        if(!ValidationUtil.isEmpty(this.notiInfoId)){
            this.agentForm.notiInfoId = this.notiInfoId;
        }

        // 初始化資料
        this.initData();
    }

    // ==================================================== Event ==========================================================

    //取得方便連絡時段時間
    getContactDateTime(time, date){
        if(time == null){
            return null
        }else{
            return moment(date).set('hour', time.hour()).set('minute', time.minute()).format("YYYY-MM-DD HH:mm");
        }
    }
    
    //日期選擇器，可選擇範圍限定於系統日之後
    disabledDate(value) {
        const rangeStart = moment().add(-1,'days');
        if (!value || !rangeStart) {
            return false;
        }
        return (value.valueOf() < rangeStart.valueOf());
    }

    /**
     * @description 開啟聯繫業務員
     */
    onDialClick() {
        console.log('撥號to 業務員');
        this.contactAgentShow = true;
    }

    /**
     * @description 關閉聯繫業務員
     * @param data 
     */
    onFormCalcel(data) {
        this.contactAgentShow = data;
    }

    // // 表單送出
    // /**
    //  * @description 儲存聯繫業務員
    //  */
    // onFormSubmit() {
    //     console.log('表單送出');

    //     if((this.$refs.notificationCallUpAgentModal as any).validateSubmit()) {
    //         Modal.confirm({
    //             okText: this.$t('global_ok').toString(), // 確定
    //             cancelText: this.$t('global_cancel').toString(), // 取消
    //             title: this.$t('notificationBasic_sendContactAgentData').toString() , // 送出聯繫業務員資料
    //             content: this.$t('notificationBasic_confirmDataCorrectToSave').toString() , // 確認資料正確儲存?
    //             onOk: () => {
    //                 (this.$refs.notificationCallUpAgentModal as any).onFormSubmit();
    //             }
    //         });
    //     } else {
    //         console.log('聯絡業務員送出失敗');
    //     }
        
    // }

    /**
     * 上傳前端檢核 檢查格式與檔案大小
     * @param file 
     * @returns
     * 
     * @author B1529
     * @version 2022/08/19
     */
    beforeUpload(file: File) {
        let fileTypeCheckResult = ValidationUtil.fileTypeValidate(file);

        //判斷檔案類型
        if (!fileTypeCheckResult) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                // 錯誤
                title: this.$t('global_error').toString(),
                // 檔案格式僅可上傳WORD、EXCEL、PDF、TIF、TXT、MSG、JPG
                content: this.$t('infReplyForm_fileTypeError').toString(),
            });
            return false;
        }

        if (file.size >= 15_759_375) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_error').toString(), //錯誤
                content: this.$t('fileUpload_sizeToobig').toString(), //「上傳檔案」檔案大於15Mb
            });
            return false;
        }

        if (file.size <= 0) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_error').toString(), //錯誤
                content: this.$t('fileUpload_sizeToosmall').toString(), //「上傳檔案」檔案大小為0,不可上傳！
            });
            return false;
        }

        this.uploadingFile = file;
        this.selectedFileName = file.name;
        return false;
    }

    //處理狀態選項變動
    onHandleStatusChange(){

        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.handleStatus, false, "", false);

        if(this.notiReplyForm.handleStatus == HandleStatus.PROCESSING){
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.content, false, "", false);
        }
    }

    //回覆罐頭語選項變動
    onContentIdChange(){
        this.notiReplyForm.content = this.notiReplyForm.contentId;
        //回覆內容驗證
        this.validateContent(null,this.notiReplyForm.content, ()=>{});
    }

    /**
     * 刪除檔案
     * @param data 
     */
    handleRemove(data: InfFileDto) {
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('global_confirm').toString(), //確認
            content: this.$t('fileUpload_deleteConfirm').toString(), //確認刪除?
            onOk: () => {
                // 暫時刪除檔案
                this.notiReplyForm.fileIds.filter(fileId => fileId != data.fileId);
                this.notiReplyForm.deletedFileIds.push(data.fileId);
                this.gridFileData.data = this.gridFileData.data.filter(d => d.fileId != data.fileId);
            }
        });
    }

    /**
     * 下載檔案
     * @param data 
     */
    handleDownload(data: InfFileDto) {
        if(data){
            LoadingUtil.show();
            this.$fileUploadApi.downloadFileUsingPOST(data.fileId, { responseType: 'blob' })
            .then((resp: AxiosResponse<ResponseEntity>) => {
                this.dealDownLoadData(resp.data, data.fileName);
            }).catch(e => {
                ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
            }).finally(() => LoadingUtil.close());
        } else {
            ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
        }
    }

    /**
     * 處理後端回傳的下載內容
     * @param resData 
     * @param fileName 
     */
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
        } catch (e) {
            ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
        }
    }

    /**
     * @description 控制方便連絡結束時間 TimePicker 是否有確定按鈕
     * @param open 
     */
    clickConvenientContactEndTimePicker(open){
        this.isConvenientContactEndOpen = open;
    }

    /**
     * @description 控制方便連絡開始時間 TimePicker 是否有確定按鈕
     * @param open 
     */
    clickConvenientContactStartTimePicker(open){
        this.isConvenientContactStartOpen = open;
    }

    //選擇時間(起)後，將時間更新
    onConvenientContactStartTimeChange(date, timeString) {
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime, false, "", false);
        this.notiReplyForm.convenientContactStartString = timeString;
        this.notiReplyForm.convenientContactEndTime = this.notiReplyForm.convenientContactStartTime;
        this.notiReplyForm.convenientContactEndString = this.notiReplyForm.convenientContactStartString;
        this.validateTimeStart();
    }

    //選擇時間(迄)後，將時間更新
    onConvenientContactEndTimeChange(date, timeString) {
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime, false, "", false);
        this.notiReplyForm.convenientContactEndString = timeString;
        this.validateTimeEnd();
    }

    //手動關閉時間選擇器(起)
    closeConvenientContactStartTimePicker() {
        this.isConvenientContactStartOpen = false;
    }

    //手動關閉時間選擇器(迄)
    closeConvenientContactEndTimePicker() {
        this.isConvenientContactEndOpen = false;
    }

    //方便聯絡時段自動轉為字串更新搜尋條件
    onContactDateChange(date){
        this.notiReplyForm.contactDate = date;
        this.notiReplyForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isContactDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.contactDate, false, "", false);
        if(ValidationUtil.isEmpty(this.notiReplyForm.contactString)){
            this.isTimePickerShow = false;
        }else{
            this.isTimePickerShow = true;
            this.validateTimeStart();
        }
    }

    //照會到期日自動轉為字串更新搜尋條件
    onNotiExpireDateChange(date){
        this.notiReplyForm.expireDate = date;
        this.notiReplyForm.expireDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate, false, "", false);
        this.validateExpireDate();
    }

    /**
     * @description 清除日期
     */
    clearContactDate(){
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.contactDate,false,"",false);
        this.isContactDateVisible = false;
        this.notiReplyForm.contactString = "";
        this.notiReplyForm.contactDate = null;
        this.notiReplyForm.datePickerContactDate = null;
        this.notiReplyForm.convenientContactStartString = "";
        this.notiReplyForm.convenientContactStartTime = null;
        this.notiReplyForm.convenientContactEndString = "";
        this.notiReplyForm.convenientContactEndTime = null;
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime, false, "", false);
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime, false, "", false);
        this.isTimePickerShow = false;
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputContactDate(data: any) {
        this.isContactDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.contactDate,false,"",false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.contactDate,false,"",false);
        } else {
            this.isContactDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.contactDate,true,this.$t('global_dateError').toString(),false);
        }
        this.notiReplyForm.contactDate = parseDate ? parseDate : this.notiReplyForm.contactDate;
        this.notiReplyForm.contactString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiReplyForm.contactDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputExpireDate(data: any) {
        
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate,false,"",false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (!parseDate) {
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate,true,this.$t('global_dateError').toString(),false);
        }
        this.notiReplyForm.expireDate = parseDate ? parseDate : this.notiReplyForm.expireDate;
        this.notiReplyForm.expireDateString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notiReplyForm.expireDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 確保Tooltip在日期正確時確實隱藏
     */
    eventMouseOverContactDate() {
        if (this.notiReplyValidateForm.contactDate.feedback) {
            this.isContactDateVisible = true;
        } else {
            this.isContactDateVisible = false;
        }
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

    //回覆內容驗證
    validateContent(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.content, false, "", false);
        if (ValidationUtil.isEmpty(this.notiReplyForm.content) && this.notiReplyForm.handleStatus != HandleStatus.PROCESSING) {
            // 回覆內容 必填
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.content,true,this.$t('infReplyForm_contentRequried').toString(),false);
            callback(() => { });
        }else if(this.notiReplyForm.content.length > 200){
            // 回覆內容 不可超過50字
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.content,true,this.$t('infReplyForm_contentOver50').toString(),false);
            callback(() => { });
        }
        callback();
    }

    //判斷時間是否小於現在時間
    validateTimeStart() {
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,false,"",false);
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,false,"",false);
        let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.notiReplyForm.contactDate).startOf("dates"));
        let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));

        if(selectDate == today && !ValidationUtil.isEmpty(this.notiReplyForm.convenientContactStartString)){
            
            let start = moment(this.notiReplyForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
            if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false); // 時間不可小於現在時間
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);   // 時間不可小於現在時間
            }
        }
    }

    //判斷時間起訖與範圍
    validateTimeEnd() {
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,false,"",false);
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,false,"",false);
        if (!ValidationUtil.isEmpty(this.notiReplyForm.convenientContactEndString)) {
            if( MomentUtil.transferMomentToTimestamp( this.notiReplyForm.convenientContactEndTime) < MomentUtil.transferMomentToTimestamp(this.notiReplyForm.convenientContactStartTime)){
                //起訖時間有誤
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
            }else{
                let start = moment(this.notiReplyForm.convenientContactStartTime) ;
                if( start.add(480,"minutes").isBefore(this.notiReplyForm.convenientContactEndTime)){
                    // 起訖不得超過八小時
                    CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_over').toString(),false);
                    CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_over').toString(),false);
                }
                start = moment(this.notiReplyForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
                let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.notiReplyForm.contactDate).startOf("dates"));
                let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
                if(selectDate == today && MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
                
                    // 時間不可小於現在時間
                    CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
                    CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
                
                }
            }
        }
    }

    /**
     * @description 驗證方便聯絡時段是否為空
     * 
     * @author B1529
     * @version 2022/08/23
     */
    validateContractDate(){

        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime,false,"",false);
        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime,false,"",false);

        if(!ValidationUtil.isEmpty(this.notiReplyForm.contactString)){

            let next = true;

            // 檢查起訖不能為空
            if( ValidationUtil.isEmpty(this.notiReplyForm.convenientContactStartString) || ValidationUtil.isEmpty(this.notiReplyForm.convenientContactEndString) ){
                // 時間起不可為空值
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime, true, this.$t('pedding_mark_time_required').toString(), false);
                // 時間訖不可為空值
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime, true, this.$t('pedding_mark_time_required').toString(), false);
                next = false;
            }

            // 檢查起訖不能相同
            if(next){
                let start = this.getContactDateTime(this.notiReplyForm.convenientContactStartTime, this.notiReplyForm.contactDate);
                let end = this.getContactDateTime(this.notiReplyForm.convenientContactEndTime, this.notiReplyForm.contactDate);
                if(start == end){
                    // 起訖時間有誤
                    CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactStartTime, true, this.$t('pedding_start_and_end_error').toString(), false);
                    CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.convenientContactEndTime , true, this.$t('pedding_start_and_end_error').toString(), false);
                }
            }
        }
    }

    /**
     * @description 驗證照會到期日
     */
    async validateExpireDate(){

        let next : boolean = true;

        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate, false, '', false);
        if (ValidationUtil.isEmpty(this.notiReplyForm.expireDate)) {
            // 照會到期日 必填
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate, true, this.$t('notificationInfo_error_expireDate').toString(), false);
            next = false;
        }

        // 是否小於原本帶出的到期日
        if(next){
            if( moment(this.notiReplyForm.expireDatePicker).isBefore(moment(this.notiReplyForm.defaultExpireDate)) ){
                let startExpireDateString = MomentUtil.transformRocYearMonthDay(this.notiReplyForm.defaultExpireDate);
                // 修改後的到期日需大於預設日
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate, true, this.$t('notificationInfo_error_expireDate_default', [startExpireDateString + '!']).toString(), false);
            }
        }

        // 超過20天
        if(next){
            if(moment(this.notiReplyForm.expireDate).isAfter(this.notiReplyForm.lastExpireDate)){
            // 照會到期回覆天數超過20日,請修改！
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate, true, this.$t('notificationInfo_error_expireDate_over').toString(), false);
                next = false;
            }
        }

        // 是否為假日
        if(next){
            LoadingUtil.show();
            let isRestRes = await this.$calendarTableApi.isRestUsingGET(this.notiReplyForm.expireDateString, 'C');
            LoadingUtil.close();
            if( isRestRes.data ){
                // 照會到期日不可選擇非工作日
                CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.notiExpireDate, true, this.$t('notificationInfo_error_expireDate_work').toString(), false);
            }
        }
    }

    /**
     * @description 驗證處理狀態
     * 
     * @author B1529
     * @version 2022/09/01
     */
    validateHandleStatus(){

        CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.handleStatus, false, "", false);
        // 處理狀態不可為處理中
        if(HandleStatus.PROCESSING == this.notiReplyForm.handleStatus){
            CommonUtil.feildValidateWithVisible(this.notiReplyValidateForm.handleStatus, true, this.$t('notificationModal_handleStatusProcessError').toString(), false);
        }
    }

    /**
     * @description 照會回覆送出驗證
     * @param isTemp 
     * @returns 
     * 
     * @author B1529
     * @version 2022/08/23
     */
    validateSubmit(isTemp: boolean){
        let validate = true;

        //回覆內容
        if(!isTemp){
            this.validateContent(null,this.notiReplyForm.content,()=>{
                if(this.notiReplyValidateForm.content.feedback){
                    validate = false;
                }
            });
        }

        // 有方便聯絡時間
        if(validate && !ValidationUtil.isEmpty(this.notiReplyForm.contactString)){

            //方便聯絡時間(起)驗證
            this.validateTimeStart();
            if(this.notiReplyValidateForm.convenientContactStartTime.feedback){
                validate = false;
            }

            //方便聯絡時間(訖)驗證
            if(validate){
                this.validateTimeEnd();
                if(this.notiReplyValidateForm.convenientContactEndTime.feedback){
                    validate = false;
                }
            }

            // 驗證方便連絡時段
            if(validate){
                this.validateContractDate();
                if(this.notiReplyValidateForm.convenientContactStartTime.feedback 
                    || this.notiReplyValidateForm.convenientContactEndTime.feedback){
                    validate = false;
                }
            }
        }

        return validate;
    }

    /**
     * @description 照會回覆結案驗證
     * @returns
     * 
     * @author B1529
     * @version 2022/09/01 
     */
    validateClosed(){

        let result = true;

        // 驗證處理狀態
        this.validateHandleStatus();
        if(this.notiReplyValidateForm.handleStatus.feedback){
            result = false;
        }

        // 驗證照會回覆欄位
        if(result){
            result = this.validateSubmit(false);
        }

        return result;
    }

    /**
     * @description 照會回覆儲存
     * 
     * @author B1529
     * @version 2022/08/22
     */
    notiReplySubmit(){

        let isTemp : boolean = (HandleStatus.PROCESSING == this.notiReplyForm.handleStatus);
        // 儲存驗證
        if( this.validateSubmit(isTemp) ){

            if(!isTemp){
                Modal.confirm({
                    class: "error-modal-util-class",
                    // 案件將回覆結果, 請確認內容是否無誤？
                    content: this.$t('notificationReply_caseWillReplyPleaseConfirm').toString() ,
                    okText: this.$t('global_yes').toString(), //是
                    cancelText: this.$t('global_no').toString(),  //否
                    icon: 'info-circle',
                    onOk: () => {
    
                        // 請確認是否不需附檔?
                        if(this.gridFileData.data.length <= 0){
                            Modal.confirm({
                                class: "error-modal-util-class",
                                // 請確認是否不需附檔?
                                content: this.$t('infMainForm_sureNotUpload').toString(),
                                okText: this.$t('global_yes').toString(), //是
                                cancelText: this.$t('global_no').toString(),  //否
                                icon: 'info-circle',
                                onOk: () => {
                                    this.notiReply(isTemp);
                                }
                            });
                        } else {
                            this.notiReply(isTemp);
                        }
                        
                    }
                });
            } else {
                this.notiReply(isTemp);
            }
        }
    }

    /**
     * @description 照會回覆結案
     * 
     * @author B1529
     * @version 2022/09/01
     */
    notiReplyClosedSubmit(){

        if( this.validateClosed() ){
            //是否確認結案再開單?
            this.notiClosedConfirmShow = true;
        }
    }

    /**
     * @description 照會回覆結案
     * 
     * @author B1529
     * @version 2022/09/14
     */
    notiReplyClosedNot(){
        
        // 更新處理狀態為"已處理"並直接走照會回覆結案
        this.notiReplyForm.handleStatus = HandleStatus.ALREADY_PROCESS;
        this.notiReplyClosed(false);
        this.notiClosedConfirmShow = false;
    }

    /**
     * @description 照會回覆結案再開單
     * 
     * @author B1529
     * @version 2022/09/14
     */
    notiReplyClosedYes(){
        this.notiReplyClosed(true);
        this.notiClosedConfirmShow = false;
    }

    /**
     * @description 聯繫業務員-離開按鈕
     * 
     * @author B1529
     * @version 2022/10/03
     */
     onLeave(){
        let closable = true;
        // 驗證有撥號是否有撥號結果、聯絡結果與細項
        const validatePeson = AgentPersonModule.validateContactInfo;
        if (!validatePeson.success) {
          ErrorModalUtil.modalListError(validatePeson.errMsg, null);
          closable = false;
        }
        if (!AgentPersonModule.isShouldSaveIsSave) {
            ErrorModalUtil.modalError(this.$t('notification_dialNotSaved').toString()); // 撥號未儲存
          closable = false;
        }
        if (!AgentPersonModule.isShouldSendIsSend) {
            ErrorModalUtil.modalError(this.$t('notification_mesgNotSent').toString()); // 訊息未發送
          closable = false;
        }
        if (closable) {
          this.contactAgentShow = false;
          AgentPersonModule.resetAll();
        }
    }

    // ==================================================== AJAX ==========================================================

    /**
     * @description 照會回覆作業單初始化
     * 
     * @author B1529
     * @version 2022/08/19
     */
    initData(){

        LoadingUtil.show();
        this.$notificationApi.notiReplyInitUsingPOST({
            notiInfoId : this.notiInfoId,
            closed : !this.isEdit
        })
        .then((res: AxiosResponse<NotiReplyInitDto>) => {

            if(res.data.success){
                
                // 處理狀態下拉
                this.handleStatusOptions = res.data.handleStatusList;
                this.notiReplyForm.handleStatus = res.data.handleStatus;
                // 回覆內容下拉
                this.replyContentOption = res.data.replyContentList;
                // 電訪內容
                this.gridData.data = res.data.notiPdfInfo.notiQuestTableInfoList;
                // 暫存檔案
                this.gridFileData.data = res.data.fileList;
                // 照會日期
                this.notiReplyForm.expireDatePicker = new Date(res.data.notiExpireDate);
                this.notiReplyForm.expireDate = moment(res.data.notiExpireDate);
                this.notiReplyForm.expireDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(res.data.notiExpireDate)));
                this.notiReplyForm.lastExpireDate = res.data.lastExpireDate;
                // 照會作業單資訊
                this.notiPdfInfo = res.data.notiPdfInfo;
                // 是否為催辦
                if(!ValidationUtil.isEmpty(this.notiPdfInfo))
                this.notiReplyForm.reminder = (!ValidationUtil.isEmpty(this.notiPdfInfo.reminderText));
                // 照會作業單檔案
                this.notiOpenFile = {
                    fileId : res.data.fileId,
                    fileName : res.data.fileName
                };
                // 照會回覆內容
                this.notiReplyForm.content = res.data.replyContent;
                // 方便聯絡時段
                if(!ValidationUtil.isEmpty(res.data.replyVisitStartDate) && !ValidationUtil.isEmpty(res.data.replyVisitEndDate)){
                    this.isTimePickerShow = true;
                    this.notiReplyForm.contactDate = moment(res.data.replyVisitStartDate);
                    this.notiReplyForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(res.data.replyVisitStartDate)));
                    this.notiReplyForm.datePickerContactDate = moment(res.data.replyVisitStartDate).toDate();
                    this.notiReplyForm.convenientContactStartTime = moment(res.data.replyVisitStartDate);
                    this.notiReplyForm.convenientContactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(res.data.replyVisitStartDate)));
                    this.notiReplyForm.convenientContactEndTime = moment(res.data.replyVisitEndDate);
                    this.notiReplyForm.convenientContactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(res.data.replyVisitEndDate)));
                }
                // 案件歷程代碼
                this.agentForm.caseLogId = res.data.caseLogId;
                this.notiReplyForm.defaultExpireDate = res.data.defaultExpireDate;

                // 待結案唯讀
                this.notiReplyReadOnly = res.data.readOnlyInfo;

            } else {
                ErrorModalUtil.modalError(res.data.returnMessage);
            }

        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            LoadingUtil.close();
        });
    }

    /**
     * @description 上傳檔案
     * 
     * @author B1529
     * @version 2022/08/22
     */
    handleUpload() {
        this.isUploading = true;
        if (!ValidationUtil.isEmpty(this.uploadingFile)) {
            LoadingUtil.show();
            this.$notificationApi.notiFileUploadUsingPOST(this.uploadingFile)
            .then((res:AxiosResponse<NotiFileUploadDto>) => {

                if(res.data.success){

                    const [ext, ...fileNames] = this.selectedFileName.split('.').reverse();
                    this.gridFileData.data.push({
                        fileId: res.data.fileId,
                        fileName: fileNames ? this.selectedFileName : ext,
                        fileExtension: fileNames ? ext : "",
                    });

                    // 紀錄新增的檔案
                    this.notiReplyForm.addFileIds.push(res.data.fileId);
                    this.notiReplyForm.fileIds.push(res.data.fileId);

                } else {
                    ErrorModalUtil.modalError(this.$t(res.data.returnMessage).toString()); // 上傳失敗
                }
            }).catch((err) => {
                console.log(err);
                ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
            }).finally(() => {
                this.isUploading = false;
                this.uploadingFile = null;
                this.selectedFileName = "";
                LoadingUtil.close();
            });
        }
    }

    /**
     * @description 照會回覆作業
     * 
     * @author B1529
     * @version 2022/08/23
     */
    notiReply(isTemp: boolean){
        
        LoadingUtil.show();

        let contactStart = this.getContactDateTime(this.notiReplyForm.convenientContactStartTime, this.notiReplyForm.datePickerContactDate);
        let contactEnd = this.getContactDateTime(this.notiReplyForm.convenientContactEndTime, this.notiReplyForm.datePickerContactDate);

        this.$notificationApi.notiReplyUsingPOST({
            notiInfoId : this.notiInfoId,
            handleStatus : this.notiReplyForm.handleStatus,
            replyContent : this.notiReplyForm.content,
            fileIds : this.notiReplyForm.fileIds,
            deleteFileIds : this.notiReplyForm.deletedFileIds,
            visitStartDate : contactStart,
            visitEndDate : contactEnd
        })
        .then((res : AxiosResponse<OutputDto>) => {
            
            if(res.data.success){
                // 照會回覆暫存成功 照會回覆成功
                let message = isTemp ? this.$t('notificationReply_tempSaveSuccess').toString() : this.$t('notificationReply_saveSuccess').toString() ;
                MessageUtil.messageSuccess(message);
                this.$emit('emitReplySubmit');
            } else {
                ErrorModalUtil.modalError(res.data.returnMessage);
            }

        }).catch((err) => {
            console.log(err);
            // 照會回覆儲存錯誤
            ErrorModalUtil.modalError(this.$t('notificationReply_saveFailed').toString());
        }).finally(() => {
            LoadingUtil.close();
        });
    }

    /**
     * @description 儲存照會到期日
     */
    async saveExpireDate(){

        await this.validateExpireDate();
        if(!this.notiReplyValidateForm.notiExpireDate.feedback){
            
            LoadingUtil.show();
            // 儲存照會到期日
            this.$notificationApi.saveNotiExpireDateUsingPOST({
                notiInfoId : this.notiInfoId,
                expireDate : this.notiReplyForm.expireDatePicker
            }).then((res:AxiosResponse<OutputDto>) => {
                
                if(res.data.success){
                    // 修改照會到期日成功!
                    MessageUtil.messageSuccess(this.$t('notificationReply_modifyExpireDaySuccess').toString());
                } else {
                    // 修改照會到期日失敗!
                    ErrorModalUtil.modalError(this.$t('notificationReply_modifyExpireDayFailed').toString());
                }

            }).catch((err) => {
                console.log(err);
                // 修改照會到期日失敗!
                ErrorModalUtil.modalError(this.$t('notificationReply_modifyExpireDayFailed').toString());
            }).finally(() => {
                LoadingUtil.close();
            });

        }
    }

    /**
     * @description 刪除此次新增的檔案
     * 
     * @author B1529
     * @version 2022/08/23
     */
    deleteTempFiles(){
        this.$notificationApi.deleteNotiReplyTempFileUsingPOST({
            fileIds : this.notiReplyForm.addFileIds
        }).then((res:AxiosResponse<OutputDto>) => {

            if(!res.data.success){
                console.log(res.data.returnMessage);
            }

        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * @description 照會回覆結案
     * 
     * @author B1529
     * @version 2022/09/01
     */
    notiReplyClosed(notiOpen: boolean){

        LoadingUtil.show();

        let contactStart = this.getContactDateTime(this.notiReplyForm.convenientContactStartTime, this.notiReplyForm.datePickerContactDate);
        let contactEnd = this.getContactDateTime(this.notiReplyForm.convenientContactEndTime, this.notiReplyForm.datePickerContactDate);

        this.$notificationApi.notiReplyAndClosedUsingPOST({
            notiInfoId : this.notiInfoId,
            handleStatus : this.notiReplyForm.handleStatus,
            replyContent : this.notiReplyForm.content,
            fileIds : this.notiReplyForm.fileIds,
            deleteFileIds : this.notiReplyForm.deletedFileIds,
            visitStartDate : contactStart,
            visitEndDate : contactEnd
        })
        .then((res : AxiosResponse<OutputDto>) => {
            
            if(res.data.success){

                // 有提示警告訊息
                if(!ValidationUtil.isEmpty(res.data.warningMessage)){
                    ErrorModalUtil.modalError(res.data.warningMessage);
                } else {
                    // 照會結案成功
                    MessageUtil.messageSuccess(this.$t('notificationModal_notiClosedSuccess').toString());
                }
                // 是否需要另開照會開單...
                this.$emit('emitReplyClosedSubmit', notiOpen);

            } else {
                ErrorModalUtil.modalError(res.data.returnMessage);
            }

        }).catch((err) => {
            console.log(err);
            // 照會結案儲存失敗
            ErrorModalUtil.modalError(this.$t('notificationModal_notiClosedFailure').toString());
        }).finally(() => {
            LoadingUtil.close();
        });
    }
}