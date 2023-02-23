import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {FblColumnType, FblPageEvent, FblPDataGridHolder, FblActionEvent} from "@/components/shared/data-grid/models";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import {EmailForm, SelectOption, EmailTemplateMap, EmailTemplateObj, AttachmentGrid, EmailValidateForm, FeildValidation } from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { Modal, message } from "ant-design-vue";
import MessageUtil from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import {GetEmailCustInfoInput, GetEmailCustInfoOutput, 
    GetEmailCustEmailInput, GetEmailCustEmailOutput,
    GetEmailTemplateOutput, EmailTemplate,
    GetSendedEmailInfoCondition, GetSendedEmailInfoOutput, SendEmailGrid,
    SendEmailOutput,
    GetEmailAttachInput, GetEmailAttachOutput, EmailAttachInfo,
    DownEmailAttachInput, ResponseEntity
    ,CasePolicyLogDto } from "@fubonlife/obd-api-axios-sdk";
import axios from 'axios';
import {AxiosResponse} from 'axios';
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
 * @description 驗證收件人email格式
 * ex: aa@bb.cc 正確 (且結尾不能空白字串)
 */
const RECEIVER_ADDRESS_REGEX:RegExp = new RegExp(/\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]\S+$/);

@Component({
    components: { FblDataGrid }
})
export default class Email extends Vue{

    /**************************************************************************************************************************
     * ATTRIBUTE START
     ***************************************************************************************************************************/
    // 表單區域 展開/收合
    showSubmitBlock:boolean = true;
    
    // 取得當前 案件包編號
    currentPackNo: string = "";
    // 此名單下的案件歷程資訊
    casePolicyLogList:Array<CasePolicyLogDto> = [];

    // 寄送Email相關輸入欄位
    emailForm:EmailForm = {
        custName:"",
        custId:"",
        receiverAddress:"",
        emailSubject:"",
        emailContent:""
    }
    // 驗證寄送Email欄位
    emailValidateForm: EmailValidateForm = {
        receiverAddress:{
            feedback: false, hoverVisible: false
        },
        emailSubject:{
            feedback: false, hoverVisible: false
        },
        emailContent:{
            feedback: false, hoverVisible: false
        },
        
    }
    // 驗證寄送Email欄位 規則
    emailFormRules:{[key: string]: ValidationRule[] } = {
        receiverAddress:[{validator:this.validateReceiverAddress, trigger: "blur"}],
        emailSubject:[{validator:this.validateEmailSubject, trigger: "blur"}],
        emailContent:[{validator:this.validateEmailContent, trigger: "blur"}],
    }
    // 選擇之收件人email
    selectedCustEmail: string = "";
    // 選擇之email 範本
    selectedEmailTemplate: string = "";
    // 收件人email下拉
    custEmailOpts: SelectOption[] = [{label:"",value:""}];
    // email範本下拉
    emailTemplateOpts: SelectOption[] = [{label:"",value:""}];
    // email範本mapping 表
    emailTemplateMap:EmailTemplateMap = {};
    // 附檔查看 input 欄, disable
    emailUploadFileName:string = ''; 
    // 附檔說明欄位
    emailUploadFileDes:string = '';  
    // 暫時選擇的附檔
    tempFileList = []; 
    // 最終送出的附檔
    finalFileList = []; 

    /**************************************************************************************************************************
     * ATTRIBUTE END
     ***************************************************************************************************************************/


    /**************************************************************************************************************************
     * VALIDATE START
     ***************************************************************************************************************************/

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
     * @description 驗證共用物件
     */
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    // 驗證收件人email
    /**
     * @description 
     */
    validateReceiverAddress(rule, value, callback){

        CommonUtil.feildValidateWithVisible(this.emailValidateForm.receiverAddress, false, '', false);

        if(!validationUtil.isEmpty(value.trim())){
            //驗證收件人email 多筆 (包含單筆) 需要額外寫 function 隔開 才會作用
            var validateMultipleReceiverAddress = this.validateMultipleReceiverAddress(value);
            if(validateMultipleReceiverAddress){
                CommonUtil.feildValidateWithVisible(this.emailValidateForm.receiverAddress, false, '', false);
                callback();
            }else{
                //收件人E-MAIL格式錯誤
                CommonUtil.feildValidateWithVisible(this.emailValidateForm.receiverAddress, true, this.$t('email_receiver_addr_validate_format_error').toString(), false);
                callback(() => { });
            }
            
        }else{
            //收件人E-MAIL必填
            CommonUtil.feildValidateWithVisible(this.emailValidateForm.receiverAddress, true, this.$t('email_receiver_addr_validate_required').toString(), false);
            callback(() => { });
        }
        
        callback();
    }


    // 驗證收件人email 多筆 (包含單筆)
    /**
     * @description 
     */
    validateMultipleReceiverAddress(value){
        var result = true;

        var receiverAddrSplit = value.trim().split(";"); // 切分 ";""
        
        for(var i=0; i<receiverAddrSplit.length; i++){
            var goNext = true; // 是否繼續執行

            // 如果是最後的字串 且為 空白 不繼續驗證
            if( (i == receiverAddrSplit.length-1) && validationUtil.isEmpty(receiverAddrSplit[i])){
                goNext = false;
            }else{
                goNext = true;
            }

            if(goNext){
                if(validationUtil.isEmpty(receiverAddrSplit[i])){
                    result = false;
                    break;
                }else{
                    var match = receiverAddrSplit[i].match(RECEIVER_ADDRESS_REGEX);
                    if(!match){
                        result = false;
                        break;
                    }else{
                        result = true;
                    }
                }
            } // gonext end
        } // for end
        return result;
    }

    // 驗證主旨
    /**
     * @description 
     */
    validateEmailSubject(rule, value, callback){

        CommonUtil.feildValidateWithVisible(this.emailValidateForm.emailSubject, false, '', false);

        if(!validationUtil.isEmpty(value.trim())){
            CommonUtil.feildValidateWithVisible(this.emailValidateForm.emailSubject, false, '', false);
            callback();
        }else{
            //E-Mail主旨必填
            CommonUtil.feildValidateWithVisible(this.emailValidateForm.emailSubject, true, this.$t('email_subject_validate_required').toString(), false);
            callback(() => { });
        }

        callback();
    }

    // 驗證內文
    /**
     * @description 
     */
    validateEmailContent(rule, value, callback){
        
        CommonUtil.feildValidateWithVisible(this.emailValidateForm.emailContent, false, '', false);

        if(!validationUtil.isEmpty(value.trim())){
            CommonUtil.feildValidateWithVisible(this.emailValidateForm.emailContent, false, '', false);
            callback();
        }else{
            //內文必填
            CommonUtil.feildValidateWithVisible(this.emailValidateForm.emailContent, true, this.$t('email_content_validate_required').toString(), false);
            callback(() => { });
        }

        callback();
    }

    //驗證上傳檔案大小
    /**
     * @description 
     */
    validateUploadFileSize(target){
        return parseInt(target)/1024/1024 < 15
    }

    // 驗證上傳全部檔案大小
    /**
     * @description 
     */
    validateUploadFinalFileSize(){
        var result = true;

        var finalFileSize:number = 0;
        this.finalFileList.forEach(file => {
            finalFileSize += file.size;
        });
        
        if(!this.validateUploadFileSize(finalFileSize)){
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToobig').toString(), // 「上傳檔案」檔案大於15Mb
              });
            result = false;
        }
        return result;
    }

    /**
     * @description 驗證檔案是否已加入
     */
    validateIsAttachExisted(finalFileList, currentFileList){
        var isAttachExited: boolean = false;

        for(var i=0; i<finalFileList.length; i++ ){
            for(var j=0; j<currentFileList.length; j++){
                if(finalFileList[i].name == currentFileList[j].name){
                    isAttachExited = true;
                    break;
                }
            }
        }

        return isAttachExited;
    }

    // 寄送email前驗證
    /**
     * @description 
     */
    validateSendEmail(){
        var result = true;
        this.validateReceiverAddress(null, this.emailForm.receiverAddress, ()=>{
            if(this.emailValidateForm.receiverAddress.feedback){
                result = false;
            }
        });
        this.validateEmailSubject(null, this.emailForm.emailSubject, ()=>{
            if(this.emailValidateForm.emailSubject.feedback){
                result = false;
            }
        });
        this.validateEmailContent(null, this.emailForm.emailContent, ()=>{
            if(this.emailValidateForm.emailContent.feedback){
                result = false;
            }
        });

        return result;
    }

    /**************************************************************************************************************************
     * VALIDATE END
     ***************************************************************************************************************************/

    
    destroyed(){
        // nothing to do here
    }

    /**
     * @description 初始
     */
    created(){
        
         // 預取件
        /*****
        var matchedCasePack = PackMatchModule.matchedCasePack;
        if(matchedCasePack != null){
            this.currentPackNo = matchedCasePack.packNo;
        }
        *******/

        // 真實取件
        if(PackMatchModule.pickupResult != null && PackMatchModule.pickupResult.firstCasePack != null){
            this.currentPackNo = PackMatchModule.pickupResult.firstCasePack.packNo;
            this.casePolicyLogList = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList; // 此名單下的案件歷程資訊
        }

        // 1. 取得 custName, custId (依 packNo)
        this.getCustInfo();
        // 2. 取得 客戶Email (依 packNo 取 T_OBD_CASE_POLICY 取得 CUST_EMAIL (多排除重複))
        this.getCustEmail();
        // 3. 取得 Email範本
        this.getEmailTemplate();
        // 4. 取得寄送Email清單
        this.getSendedEmailInfo();

    }


    /**
     * @description 取得客戶資訊
     */
    getCustInfo(){
        /**
         * 整理 getEmailCustInfoInput input 參數
         ******************************************************************************/
        var getEmailCustInfoInput:GetEmailCustInfoInput={};
        getEmailCustInfoInput.packNo = this.currentPackNo.trim();
        /******************************************************************************/

        this.$emailApi.getEmailCustInfoUsingPOST(getEmailCustInfoInput)
        .then((resp:AxiosResponse<GetEmailCustInfoOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    this.emailForm.custName = resp.data.custName;
                    this.emailForm.custId = resp.data.custId;
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);   
                }
            }else{
                ErrorModalUtil.modalError(this.$t('email_getCustInfo_occur_error').toString()); //取得客戶資訊發生異常
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('email_getCustInfo_occur_error').toString()); //取得客戶資訊發生異常
        })

    }

    /**
     * @description 取得 客戶Email (依 packNo 取 T_OBD_CASE_POLICY 取得 CUST_EMAIL (多排除重複)) 
     */
    getCustEmail(){
        
        /**
         * 整理 getEmailCustEmailInput input 參數
         ******************************************************************************/
        var getEmailCustEmailInput:GetEmailCustEmailInput = {};
        getEmailCustEmailInput.packNo = this.currentPackNo.trim();
        /******************************************************************************/

        this.$emailApi.getEmailCustEmailUsingPOST(getEmailCustEmailInput)
        .then((resp:AxiosResponse<GetEmailCustEmailOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    resp.data.emailList.forEach((emailAddr)=>{
                        this.custEmailOpts.push({label: emailAddr, value: emailAddr});
                    });
                }else{
                    Modal.warning({
                        // title: "", // 不需要
                        content: this.$t('email_getCustEmail_occur_error_1').toString(), //查無客戶Email資訊
                        okText: this.$t('global_ok').toString(), // 確定
                        centered: true
                    });
                }
            }else{
                ErrorModalUtil.modalError(this.$t('email_getCustEmail_occur_error').toString()); //取得客戶Email發生異常
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('email_getCustEmail_occur_error').toString()); //取得客戶Email發生異常
        })
    }

    /**
     * @description 取得 Email範本
     */
    getEmailTemplate(){
        this.$emailApi.getEmailTemplateUsingGET()
        .then((resp:AxiosResponse<GetEmailTemplateOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    
                    resp.data.emailTemplateList.forEach((emailTemplate:EmailTemplate)=>{
                        this.emailTemplateOpts.push({label:emailTemplate.codeName, value:emailTemplate.code});
                        this.emailTemplateMap[emailTemplate.code] = {codeName:emailTemplate.codeName, content:emailTemplate.content};
                    });
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);   
                }
            }else{
                ErrorModalUtil.modalError(this.$t('email_getEmailTemplate_occur_error').toString()); //取得Email範本發生異常
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('email_getEmailTemplate_occur_error').toString()); //取得Email範本發生異常
        })
    }

    /**
     * @description 取得寄送Email清單
     */
    getSendedEmailInfo(){
        
        /**
         * 整理取得寄送Email清單輸入參數物件
         ******************************************************************************/

        var getSendedEmailInfoCond:GetSendedEmailInfoCondition = {};
        getSendedEmailInfoCond.packNo = this.currentPackNo;
        getSendedEmailInfoCond.process = "E";

        var page:number = this.sendEmailGrid.pagination.current-1;
        var size:number = this.sendEmailGrid.pagination.pageSize;
        var sort:string = this.sendEmailGrid.sort ? JSON.stringify([this.sendEmailGrid.sort]) : undefined;
        
        /******************************************************************************/

        this.$emailApi.getSendedEmailInfoUsingPOST(page, size, getSendedEmailInfoCond, sort)
        .then((resp:AxiosResponse<GetSendedEmailInfoOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    if(resp.data.sendEmailGridPage != null){
                        this.sendEmailGrid.data = resp.data.sendEmailGridPage.content;
                    }else{
                        this.sendEmailGrid.data = [];
                        // MessageUtil.messageWarning(resp.data.returnMessage); 
                    }
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);
                }
            }else{
                ErrorModalUtil.modalError(this.$t('email_getSendedEmailInfo_occur_error').toString()); //取得發送清單發生異常
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('email_getSendedEmailInfo_occur_error').toString()); //取得發送清單發生異常
        })

    }

    /**
     * @description 已寄送清單換頁
     */
    onPageChange(e: FblPageEvent){
        if(this.sendEmailGrid.data.length > 0 ){
            this.sendEmailGrid.pagination = e.pagination;
            this.sendEmailGrid.sort = e.sort;
            this.getSendedEmailInfo();
        }
    }

     /**
     * @description 滑鼠移出cell，detail消失
     */
     handleEllipsisMouseLeave() {
        message.destroy();
    }

    /**
     * @description 滑鼠點擊該cell，顯示detail
     */
    handleEllipsisClick($event, data) {
        message.destroy();
        message.config({
            duration: 0,
            top: `50px`
        });
        
        //摺疊字串，依照自訂字數摺疊
        data = data.replace(/<br\s*[\\/]?>/gi, "\n");
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

    /**
     * @description 下拉式清單搜尋用(依input過濾顯示符合的清單)
     */
    filterOption(input, option) {

        if(!validationUtil.isEmpty(option.componentOptions.children[0]) && !validationUtil.isEmpty(option.componentOptions.propsData.value)){
            return (
                        option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >=0
                    );
        }
        
    }

    /**
     * @description 選擇客戶 email
     */
    changeSelectedCustEmail(selectedCustEmail){
        this.emailForm.receiverAddress = selectedCustEmail;
        // 重新驗證 選擇之收件人email是否符合規範
        this.validateReceiverAddress(null, this.emailForm.receiverAddress, ()=>{});
    }

    /**
     * @description 手動輸入 email，清空 選擇之客戶Email 下拉值
     */
    retypedCustEmail(){
        this.selectedCustEmail = "";
    }

    /**
     * @description 更改email範本
     */
    changeEmailTemplate(selectTemplate){
        if(!validationUtil.isEmpty(selectTemplate)){
            var emailTemplateObj:EmailTemplateObj = this.emailTemplateMap[selectTemplate];
            this.emailForm.emailContent = emailTemplateObj.content;
        }else{
            this.emailForm.emailContent = "";
        }
    }


    /**
     * @description 選擇檔案
     */
    beforeUpload(file){
        
        this.tempFileList = []; // 清空，原本選擇的檔案

        let fileTypeCheckResult = validationUtil.fileTypeValidate(file);

        //判斷檔案類型
        if (!fileTypeCheckResult) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_error').toString(), // 錯誤
                // 檔案格式僅可上傳WORD、EXCEL、PDF、TIF、TXT、MSG、JPG
                content: this.$t('infReplyForm_fileTypeError').toString(),
            });
            return false;
        }

        if (file.size >= 15_759_375) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToobig').toString(), // 「上傳檔案」檔案大於15Mb
            });
            return false;
        }

        if (file.size <= 0) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('fileUpload_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToosmall').toString(), // 「上傳檔案」檔案大小為0,不可上傳！
            });
            return false;
        }

        this.emailUploadFileName = file.name; // 將選擇檔案的檔案名稱 放到 本機附檔欄位供查看
        
        this.tempFileList = [...this.tempFileList, file]; // 將新的選擇檔案塞回 list
        
        return false;
    }


    /**
     * @description 確定加入檔案
     */
    addEmailAttach(){
        
        if(this.tempFileList.length == 0){
            MessageUtil.messageInfo(this.$t('email_attachment_validate_selected').toString()); //請選擇檔案
            return false;
        }

        if(validationUtil.isEmpty(this.emailUploadFileDes)){
            MessageUtil.messageInfo(this.$t('email_attachment_desc_validate_required').toString()); //附檔說明為必填
            return false;
        }

        // 2022/03/21 修改 可以重複檔案加入，由後端判斷重複檔案 累加 xxx(index).xxx
        // if(this.validateIsAttachExisted(this.finalFileList, this.tempFileList)){
        //     MessageUtil.messageInfo(this.$t("email_attachment_validate_isExisted").toString()); // 該檔案已加入!
        //     return false;
        // }

        this.tempFileList.forEach(file => {
            // 放入附檔列表顯示
            this.fileGrid.data.push({pk:file.uid, fileRemark: this.emailUploadFileDes, fileName:file.name});
            // 塞入最終準備寄送的附檔
            this.finalFileList.push(file);
        });
        
        this.emailUploadFileDes = ''; // 還原 附檔查看 input 欄
        this.emailUploadFileName = ''; // 還原 附檔說明欄位
        this.tempFileList = []; //加入完成清空 上傳的暫存附檔
    }

    
    /**
     * @description 附檔列表 點選事件
     */
    fileGridActionClick(e:FblActionEvent<AttachmentGrid>){
        switch(e.action.name){
            case "delete": this.fileDelete(e.row.data);
                break;
        }
    }

    /**
     * @description 刪除已選擇的附檔
     */
    fileDelete(data: AttachmentGrid){
        
        Modal.confirm({
            okText: this.$t('global_ok').toString(), //確定
                cancelText: this.$t('global_cancel').toString(), //取消
                title: this.$t('global_ok').toString(), //確定
                content: this.$t("email_doubleCheck_deleteAttach").toString(), // 是否確定要刪除?
                onOk:()=>{
                    this.finalFileList.forEach((item,index)=>{
                        // 刪除的附檔 從 finalFileList 移除
                        if(item.uid == data.pk){
                            this.finalFileList.splice(index, 1);
                        }
            
                        // 刪除的附檔 從 fileGrid.data 移除
                        this.fileGrid.data.forEach((d,index)=>{
                            if(d.pk == data.pk){
                                this.fileGrid.data.splice(index, 1);
                            }
                        })
                    });
                }
        });
        
        
    }


    /**
     * @description 發送 email 
     */
    doubleCheckToSendEmail(){

        if(this.validateSendEmail() && this.validateUploadFinalFileSize()){
            Modal.confirm({
                okText: this.$t('global_ok').toString(), //確定
                cancelText: this.$t('global_cancel').toString(), //取消
                title: this.$t('global_ok').toString(), //確定
                content: this.$t('email_doubleCheck_sendEmail_content').toString(), //確認發送內容是否正確
                onOk:()=>{this.sendEmail()}
            });
        }
        
    }

    /**
     * @description 寄送Email
     */
    sendEmail(){
        
        /**
         * 整理 寄送Email 輸入參數 需要使用 formData 串
         * MultipartFile[] 多筆目前不能使用 sdk ，僅能使用 axios + formData 實現多筆上傳
        ******************************************************************************/
        var formData = new FormData();
        
        formData.append("packNo",this.currentPackNo.trim());
        formData.append("custName",this.emailForm.custName);
        formData.append("custId",this.emailForm.custId);
        formData.append("receiverAddress",this.emailForm.receiverAddress);
        formData.append("emailSubject",this.emailForm.emailSubject);
        var formatEmailContent = this.emailForm.emailContent.replace(/\n/g, "<br/>"); // 有換行的換成 <br/>
        formData.append("emailContent",formatEmailContent);
        //此名單下的案件歷程資訊
        formData.append("casePolicyLogInfoList", JSON.stringify(this.casePolicyLogList));

        // 多筆附檔 
        this.finalFileList.forEach(file => {
            formData.append('files', file);
        });

        // 多筆附檔之說明
        this.fileGrid.data.forEach(d=>{
            formData.append("fileRemarks", d.fileRemark);
        });
        /******************************************************************************/
        
        LoadingUtil.show();
        axios({
            method: 'post',
            url: `${process.env.VUE_APP_API_BASE_URL}/api/email/sendEmail`,
            data: formData,
            timeout: 3*60*1000,
        })
        .then((resp:AxiosResponse<SendEmailOutput>)=>{
            if(resp.data != null){
                var result = true;
                if(resp.data.success){
                   MessageUtil.messageSuccess(this.$t('email_sendEmail_success').toString()); //發送成功!
                    // 寄送成功，清空欄位
                    this.afterSuccessSendedEmail();
                }else{
                    MessageUtil.messageError(this.$t('email_sendEmail_failure').toString()); // 發送失敗!
                    result = false;
                }
            }else{
                ErrorModalUtil.modalError(this.$t('email_sendEmail_failure').toString()); //寄送Email發生異常
                result = false;
            }
            
            LoadingUtil.close();
            return result;
        })
        .then((result)=>{
            this.getSendedEmailInfo();
        })
        .catch((error)=>{
            // 當需要 模擬 發送失敗時 後端 timeout 太短 server 會 給 timeout exception，故在此 顯示 發送失敗，並重新找發送清單，console 顯示 寄信發送異常
            MessageUtil.messageError(this.$t('email_sendEmail_failure').toString()); // 發送失敗!
            this.getSendedEmailInfo();
            console.log(this.$t('email_sendEmail_occur_error').toString()); //寄送Email發生異常
        })
        .finally(()=>{
            LoadingUtil.close();
        })

    }

    /**
     * @description 寄送成功，清空欄位
     */
    afterSuccessSendedEmail(){
        this.emailForm.receiverAddress = "";
        this.emailForm.emailSubject = "";
        this.emailForm.emailContent = "";
        this.selectedEmailTemplate = "";
        this.selectedCustEmail = "";

        this.finalFileList = [];
        this.fileGrid.data = [];
    }

    
    /**
     * @description email 發送清單 點選事件
     */
    sendEmailGridActionClick(e:FblActionEvent<any>){
        switch(e.action.name){
            case "download" : this.downloadEmailAttach(e.row.data);
                break;
        }
    }

    /**
     * @description 下載附檔
     */
    downloadEmailAttach(data:any){
        // 準備欲下載附件資訊
        var emailAttachInfoList:EmailAttachInfo[] = [];

        /**
         * 整理取得已寄送email的附件資訊 input 參數物件
         ******************************************************************************/
        var getEmailAttachInput:GetEmailAttachInput = {};
        getEmailAttachInput.emailId = data.pk.split(";")[0]; // 取 pk 第一個字串 為 emilId
        /******************************************************************************/
        
        this.$emailApi.getEmailAttachmentUsingPOST(getEmailAttachInput)
        .then((resp:AxiosResponse<GetEmailAttachOutput>)=>{
            var result = true;
            
            if(resp != null){
                if(resp.data.success){
                    emailAttachInfoList = resp.data.emailAttachInfoList;
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);
                    result = false;
                }
            }else{
                ErrorModalUtil.modalError(this.$t('email_getEmailAttachInfo_occur_error').toString()); //取的寄送Email附檔資料發生異常
                result = false;
            }
                
            return result;
        })
        .then((result)=>{
            // 有取到附檔資訊再下載，多筆下載
            if(result){
                
               emailAttachInfoList.forEach((emailAttach:EmailAttachInfo)=>{
                    
                    var downEmailAttachInput:DownEmailAttachInput = {emailAttachInfo:{}};
                    downEmailAttachInput.emailAttachInfo.fileName = emailAttach.fileName;
                    downEmailAttachInput.emailAttachInfo.filePath = emailAttach.filePath;
                    downEmailAttachInput.emailAttachInfo.fileId = emailAttach.fileId;

                    this.$emailApi.downloadEmailAttachmentUsingPOST(downEmailAttachInput, { responseType: 'blob' })
                    .then((resp:AxiosResponse<ResponseEntity>)=>{
                        this.dealDownLoadData(resp.data, emailAttach.fileName +"."+ emailAttach.fileExtension);
                    })
                    .catch((error)=>{
                        ErrorModalUtil.modalError(this.$t('email_downloadEmailAttach_occur_error').toString()); //下載Email附檔發生異常
                    });
                    
                });
               
            }else{
                // console 即可
                console.log("取的寄送Email附檔發生錯誤，不執行下載Email附檔");
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('email_getEmailAttachInfo_occur_error').toString()); //取的寄送Email附檔資料發生異常
        });
        
    }

    /**
     * @description 處理下載檔案
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
        } catch (ex) {
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

    /**
     * @description 附檔列表
     */
    fileGrid: FblPDataGridHolder<AttachmentGrid> = {
        rowKey: "pk",
        data: [],
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['5', '15', '30', '50'],
            current: 1,
            pageSize: 5,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "delete",
                        title: this.$t('global_delete').toString(), //刪除
                        delete: true
                    }

                ],
                width: 50
            },
            {
                type: FblColumnType.PLAIN,
                property: "fileRemark",
                title: this.$t('email_fileGrid_fileRemark').toString(), //檔案說明
                width: 100
            },
            {
                type: FblColumnType.PLAIN,
                property: "fileName",
                title: this.$t('email_fileGrid_fileName').toString(), //檔案名稱
                width: 100
            },
        ]
    };

    /**
     * @description 已寄送Email清單
     */
    sendEmailGrid: FblPDataGridHolder<SendEmailGrid> = {
        rowKey: "pk",
        data: [],
        pagination:{
            showSizeChanger: true,
            pageSizeOptions: ['5', '15', '30', '50'],
            current: 1,
            pageSize: 5,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('email_sendEmailGrid_createDate').toString() //發送日期
            },
            {
                type: FblColumnType.PLAIN,
                property: "policyNo",
                title: this.$t('email_sendEmailGrid_policyNo').toString(), //保單號碼
                formatter:(data:SendEmailGrid) =>{
                    if(!validationUtil.isEmpty(data.policyNo )){
                        return data.policyNo;
                    }else{
                        return "–";
                    }
                }
            },

            {
                type: FblColumnType.PLAIN,
                property: "packNo",
                title: this.$t('email_sendEmailGrid_packNo').toString() //名單序號
            },

            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('email_sendEmailGrid_custId').toString() //客戶ID
            },

            {
                type: FblColumnType.PLAIN,
                property: "custName",
                title: this.$t('email_sendEmailGrid_custName').toString() //客戶姓名
            },

            {
                type: FblColumnType.PLAIN,
                property: "receiverAddress",
                title: this.$t('email_sendEmailGrid_receiverAddress').toString() //收件人Email
            },
            {
                type: FblColumnType.PLAIN,
                property: "subject",
                title: this.$t('email_sendEmailGrid_subject').toString() //主旨
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "content",
                title: this.$t('email_sendEmailGrid_content').toString(), //內容
                width: 200
            },

            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('email_sendEmailGrid_status').toString(), //處理狀態
                formatter:(data:SendEmailGrid) =>{
                    if(!validationUtil.isEmpty(data.status)){
                        if(data.status == "S"){
                            return this.$t('email_sendEmailGrid_sendEmail_success').toString(); //發送成功
                        }else if(data.status == "F"){
                            return this.$t('email_sendEmailGrid_sendEmail_failiure').toString(); //發送失敗
                        }
                    }else{
                        return "";
                    }
                }
            },

            {
                type: FblColumnType.PLAIN,
                property: "operator",
                title: this.$t('email_sendEmailGrid_operator').toString() //處理人員
            },
            {
                type: FblColumnType.ACTION,
                property: "isAttachment",
                title: this.$t('email_sendEmailGrid_attachment').toString(), //附加檔案
                actions:[
                    {
                        name: "download",
                        title: "ttt",
                        download: true, //icon download
                        formatter:(data:SendEmailGrid)=>{
                            if(data.status == "S"){
                                if(data.isAttachment == "Y"){
                                    return true; 
                                }else{
                                    return false;
                                }
                            }else if(data.status == "F"){
                                return false;
                            }else{
                                return false;
                            }
                        }
                    }
                ],
                
            },

        ]
    };


}