import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {FblColumnType, FblPageEvent, FblPDataGridHolder} from "@/components/shared/data-grid/models";
import {SelectOption, TextMessageForm, TextMessageValidateForm, FeildValidation, MessageTemplateMap, MessageTemplateObj} from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { default as loadingUtil, default as LoadingUtil } from "@/assets/config/LoadingUtil";
import {GetMsgCustInfoInput, GetMsgCustInfoOutput, 
        GetMsgCustPhoneInput, GetMsgCustPhoneOutput,
        GetMsgTemplateOutput,
        GetSendedMsgInfFilter, GetSendedMsgInfoOutput,SendMessageGrid,
        SendMsgInput, SendMsgOutput
        ,CasePolicyLogDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Modal, message } from "ant-design-vue";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import "@/assets/less/base.less";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";

@Component({
    components: { FblDataGrid }
})
export default class TextMessage extends Vue{

    // 簡訊內容使用的 正規表示式 判斷是否 有包含 " [ ] | \ ( ) + & % "
    msgContentRegex:RegExp = /[‘[\]|\\()+&%]/;
    // 取得當前 案件包編號
    currentPackNo: string = "";
    // 此名單下的案件歷程資訊
    casePolicyLogList:Array<CasePolicyLogDto> = [];
    // 簡訊發送相關輸入參數物件
    textMessageForm: TextMessageForm = {
        custName: "",
        custId: "",
        phoneNum: "",
        msgContent: "",
    };
    // 簡訊發送相關驗證輸入參數
    textMessageValidateForm: TextMessageValidateForm = {
        phoneNum: {
            feedback: false, hoverVisible: false
        },
        msgContent:  {
            feedback: false, hoverVisible: false
        },
    };
    // 簡訊發送相關驗證輸入規則
    textMessageFormRules: { [key: string]: ValidationRule[] } = {
        msgContent:[{validator:this.validateMsgContent, trigger: "blur"}],
        phoneNum:[{validator:this.validatePhoneNum, trigger: "blur"}]
        
    }
    // 選擇的電話號碼
    selectedPhoneNum: string = "";
    // 選擇的簡訊範本
    selectedMsgTemplate: string = "";
    // 簡訊電話號碼下拉選單
    custPhoneNumOpts: SelectOption[] = [{label:"",value:""}];
    // 簡訊範本下拉選單
    messageTemplateOpts:SelectOption[] = [{label:"",value:""}];
    // 簡訊範本 mapping 表
    messageTemplateMap: MessageTemplateMap = {};
    
    // 預設簡訊內容字數
    defaultMsgContentSize : number = 250;
    // 簡訊內容 "最大字數" default: 250 (最多就250, 不可變)
    maxMsgContent:number = this.defaultMsgContentSize; 
    // 簡訊內容 "剩餘字數" default: 250 (最多就250)
    currentLastMsgContent: number = this.defaultMsgContentSize; 
    // 查詢表單區域 展開/收合
    showSubmitBlock: boolean = true;
    
    // 監控 簡訊內容，計算剩餘字數
    @Watch("textMessageForm.msgContent")
    onMsgContentChange():void{
        this.currentLastMsgContent = this.maxMsgContent - this.textMessageForm.msgContent.length;
    }

    destroyed(){
        // nothing to do here
    }

    // 初始
    created(){
        // 從 vuex 取得 案件包，並取得案件包編號
        
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
            this.casePolicyLogList = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList; //此名單下的案件歷程資訊
        }

        // 發送清單清空
        this.sendMsgGrid.data = [];

        // 1. 取得 custName, custId (依 packNo)
        this.getCustInfo();
        // 2. 取得 取得手機號碼 (依 packNo 取 T_OBD_CASE_POLICY 取得 MOB_CHANG (多排除重複))
        this.getCustPhoneNum();
        // 3. 取得 簡訊範本
        this.getMsgTemplate();
        // 4. 取得寄送簡訊清單
        this.getSendedMsgInfo();

    }

    /**
     * 取得 custName, custId (依 packNo)
     */
    getCustInfo(){
        // 整理 getMsgCustInfo input 參數
        var getMsgCustInfoInput:GetMsgCustInfoInput={};
        getMsgCustInfoInput.packNo = this.currentPackNo.trim();
        // call getMsgCustInfo
        this.$textMessageApi.getMsgCustInfoUsingPOST(getMsgCustInfoInput)
        .then((resp:AxiosResponse<GetMsgCustInfoOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    this.textMessageForm.custName = resp.data.custName;
                    this.textMessageForm.custId = resp.data.custId;
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);
                }
            }else{
                ErrorModalUtil.modalError(this.$t('textMessage_getCustInfo_occur_error').toString()) //取得客戶資訊發生異常
            }
            
        })
        .catch((error=>{
            ErrorModalUtil.modalError(this.$t('textMessage_getCustInfo_occur_error').toString()); //取得客戶資訊發生異常
        }))

    }

    /**
     * 取得 取得手機號碼 (依 packNo 取 T_OBD_CASE_POLICY 取得 MOB_CHANG (多排除重複))
     */
    getCustPhoneNum(){
        // 整理 getCustPhoneNum input
        var getMsgCustPhoneInput:GetMsgCustPhoneInput = {};
        getMsgCustPhoneInput.packNo = this.currentPackNo.trim();
        // call getCustPhoneNum
        this.$textMessageApi.getCustPhoneNumUsingPOST(getMsgCustPhoneInput)
        .then((resp:AxiosResponse<GetMsgCustPhoneOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    resp.data.phoneNumList.forEach((phoneNum=>{
                        this.custPhoneNumOpts.push({label: phoneNum, value: phoneNum});
                    }));
                }else{
                    Modal.warning({
                        // title: "", // 不需要
                        content: this.$t('textMessage_getCustPhoneNum_occur_error_1').toString(), //查無手機號碼資訊
                        okText: this.$t('global_ok').toString(), // 確定
                        centered: true
                    });
                }
            }else{
                ErrorModalUtil.modalError(this.$t('textMessage_getCustPhoneNum_occur_error').toString()); //取得客戶手機資訊發生異常
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('textMessage_getCustPhoneNum_occur_error').toString()); //取得客戶手機資訊發生異常
        })
        
    }
    
    /**
     * 取得 簡訊範本
     */
    getMsgTemplate(){

        // call getMsgTemplate
        this.$textMessageApi.getMsgTemplateUsingGET()
        .then((resp:AxiosResponse<GetMsgTemplateOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    resp.data.msgTemplateList.forEach((msgTemplate=>{
                        this.messageTemplateOpts.push({label:msgTemplate.codeName, value:msgTemplate.code});
                        this.messageTemplateMap[msgTemplate.code] = {codeName:msgTemplate.codeName, content:msgTemplate.content};
                    }));
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);
                }
            }else{
                ErrorModalUtil.modalError(this.$t('textMessage_getMsgTemplate_occur_error').toString()); //取得簡訊範本發生異常
            }
        })
        .catch(()=>{
            ErrorModalUtil.modalError(this.$t('textMessage_getMsgTemplate_occur_error').toString()); //取得簡訊範本發生異常
        })
        
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {

        if(!validationUtil.isEmpty(option.componentOptions.children[0]) && !validationUtil.isEmpty(option.componentOptions.propsData.value)){
            return (
                        option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >=0
                    );
        }
        
    }

    // 選擇簡訊電話號碼下拉值
    changeSelectedPhoneNum(selectedPhoneNum){
        
        this.textMessageForm.phoneNum = selectedPhoneNum;
        // 重新驗證 選擇之簡訊電話號碼是否符合規範
        this.validatePhoneNum(null, this.textMessageForm.phoneNum, ()=>{});
        
    }

    // 手動輸入電話號碼，清空 選擇之簡訊電話號碼下拉值
    retypedPhoneNum(){
        this.selectedPhoneNum = "";
    }
    
    // 選擇簡訊範本下拉值
    changeMsgTemplate(selectTemplate){
        
        // 選擇之簡訊範本不為空，由 範本mapping 表帶入 簡訊範本的內容
        if(!validationUtil.isEmpty(selectTemplate)){
            var msgTemplateObj:MessageTemplateObj = this.messageTemplateMap[selectTemplate];
            this.textMessageForm.msgContent = msgTemplateObj.content;
        }else{
            this.textMessageForm.msgContent = "";
        }
        // 重新驗證簡訊範本內容是否符合規範
        this.validateMsgContent(null, this.textMessageForm.msgContent, ()=>{});
        
        // 恢復現在簡訊內容 剩餘字數為預設
        this.currentLastMsgContent = this.defaultMsgContentSize;
    }
    
    /**
     * 取得 簡訊發送清單資訊
     */
    async getSendedMsgInfo(){

        /**
         * 整理 getSendedMsgInfo input 參數物件
         ******************************************************************************/ 
        // 外層 物件
        var sendMsgFilter: GetSendedMsgInfFilter = {
            filter: {}
        };

        // 內層 filter 物件
        var sendMsgInfoFilters: FblFilters={
            filters:[]
        }
        var packNo = FiltersUtil.setFilterParam("packNo", FblOperator.EQ, (this.currentPackNo));
        sendMsgInfoFilters = FiltersUtil.setFilters(packNo);
        
        var page:number = this.sendMsgGrid.pagination.current-1;
        var size:number = this.sendMsgGrid.pagination.pageSize;
        var sort:string = this.sendMsgGrid.sort ? JSON.stringify([this.sendMsgGrid.sort]) : undefined;
        sendMsgFilter.filter = sendMsgInfoFilters;
        
        /******************************************************************************/

        loadingUtil.show();
        this.$textMessageApi.getSendedMsgInfoUsingPOST(page, size, sort, sendMsgFilter)
        .then((resp:AxiosResponse<GetSendedMsgInfoOutput>)=>{
            if(resp.data != null){
                if(resp.data.success){
                    if(resp.data.sendMessageGridPage != null){
                        this.sendMsgGrid.data = resp.data.sendMessageGridPage.content;
                    }else{
                        // 可能該 案件包 或 電話 沒有寄送紀錄，仍然是 成功，但回傳空的資料表
                        this.sendMsgGrid.data = [];
                        // MessageUtil.messageWarning(resp.data.returnMessage); 
                    }
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);
                }
            }else{
                ErrorModalUtil.modalError(this.$t('textMessage_getSendedMsgInfo_occur_error').toString()); //取得發送清單發生異常
            }
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('textMessage_getSendedMsgInfo_occur_error').toString()); //取得發送清單發生異常
        })
        .finally(()=>{
            loadingUtil.close();
        })
    }
    
    // 簡訊寄送清單換頁
    onPageChange(e: FblPageEvent){
        if(this.sendMsgGrid.data.length>0){
            this.sendMsgGrid.pagination = e.pagination;
            this.sendMsgGrid.sort = e.sort;
            this.getSendedMsgInfo();
        }
    }

    /**
     * 驗證寄送簡訊相關輸入參數
     */
    validateSendMsg(){
        var validate = true;
        this.validatePhoneNum(null, this.textMessageForm.phoneNum, ()=>{
            if(this.textMessageValidateForm.phoneNum.feedback){
                validate = false;
            }
        });
        this.validateMsgContent(null, this.textMessageForm.msgContent, ()=>{
            if(this.textMessageValidateForm.msgContent.feedback){
                validate = false;
            }
        });
        return validate;
    }

    /**
     * 確認發送內容是否正確
     */
    doubleCheckToSendMsg(){
        //驗證寄送簡訊相關輸入參數
        if(this.validateSendMsg()){
            Modal.confirm({
                okText: this.$t('global_ok').toString(), //確定
                cancelText: this.$t('global_cancel').toString(), //取消
                title: this.$t('global_ok').toString(), //確定
                content: this.$t('textMessage_doubleCheck_sendMsg_content').toString(), //確認發送內容是否正確
                onOk:()=>{this.sendTextMsg()}
            })
        }
        
    }

    /**
     * 發送簡訊
     */
    sendTextMsg(){
        
        /**
         * 整理 sendTextMessage 輸入參數
         **************************************************/
        var sendMsgInfo:SendMsgInput = {};
        sendMsgInfo.packNo = this.currentPackNo;
        sendMsgInfo.custName = this.textMessageForm.custName;
        sendMsgInfo.custId = this.textMessageForm.custId;
        sendMsgInfo.phoneNum = this.textMessageForm.phoneNum;
        sendMsgInfo.msgContent = this.textMessageForm.msgContent;
        sendMsgInfo.casePolicyLogInfoList = this.casePolicyLogList; //此名單下的案件歷程資訊
        /***************************************************/

        // call sendTextMessage
        loadingUtil.show();
        this.$textMessageApi.sendTextMessageUsingPOST(sendMsgInfo)
        .then((resp:AxiosResponse<SendMsgOutput>)=>{
            var result = true;
            if(resp.data != null){
                if(resp.data.success){
                    MessageUtil.messageSuccess(this.$t('textMessage_sendTextMsg_success').toString()); //發送成功!
                    // 寄送成功，清空填寫欄位
                    this.afterSuccessSendedTextMsg();
                }else{
                    MessageUtil.messageError(this.$t('textMessage_sendTextMsg_failure').toString()); //發送失敗!
                    result = false;
                }
            }else{
                ErrorModalUtil.modalError(this.$t('textMessage_sendTextMsg_occur_error').toString()); //寄送簡訊發生異常
                result = false;
            }
            
            loadingUtil.close();
            return result;
        })
        // 寄送完 再call 查詢寄送簡訊清單
        .then(async (result)=>{
            await this.getSendedMsgInfo();
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('textMessage_sendTextMsg_occur_error').toString()); //寄送簡訊發生異常
        })
        .finally(()=>{
            loadingUtil.close();
        })
        
    }

    /**
     * 寄信成功 清空填寫欄位
     */
    afterSuccessSendedTextMsg(){
        this.selectedPhoneNum = "";
        this.textMessageForm.phoneNum = "";
        this.selectedMsgTemplate = "";
        this.textMessageForm.msgContent = "";
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

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    /**
     * 驗證簡訊電話號碼規則
     */
    validatePhoneNum(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.phoneNum, false, '', false);
        
        if(!validationUtil.isEmpty(value.trim())){

            if(validationUtil.numberValidation(value)){
                CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.phoneNum, false, '', false);
                callback();
            }else{
                //電話號碼必須是數字
                CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.phoneNum, true, this.$t('textMessage_msg_phoneNum_validate_num').toString(), false);
                callback(() => { });
            }

        }else{
            //電話號碼必填
            CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.phoneNum, true, this.$t('textMessage_msg_phoneNum_validate_required').toString(), false);
            callback(() => { });
        }
        callback();

    }

    /**
     * 驗證簡訊內容規則
     */
    validateMsgContent(rule, value, callback){

        CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.msgContent, false, '', false);

        if(!validationUtil.isEmpty(value.trim())){
            
            var match = this.textMessageForm.msgContent.match(this.msgContentRegex);
            if(match){
                //不能包含下列符號 ‘ [ ] | \\ ( ) + & %
                CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.msgContent, true, this.$t('textMessage_msg_content_validate_symbol').toString(), false);
                callback(() => { });
            }else{
                CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.msgContent, false, '', false);
                callback();
            }
        }else{
            //簡訊內容必填
            CommonUtil.feildValidateWithVisible(this.textMessageValidateForm.msgContent, true, this.$t('textMessage_msg_content_validate_required').toString(), false);
            callback(() => { });
        }
       
        callback();

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
        MessageUtil.changePosition(antDesignMessage, $event.x, $event.y)
        
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

    // 寄送簡訊清單表格初始
    sendMsgGrid: FblPDataGridHolder<SendMessageGrid> = {
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
                title: this.$t('textMessage_sendMsgGrid_createDate').toString() //發送日期
            },
            {
                type: FblColumnType.PLAIN,
                property: "policyNo",
                title: this.$t('textMessage_sendMsgGrid_policyNo').toString(), //保單號碼
                formatter:(data:any) =>{
                    if("" == data.policyNo || null == data.policyNo){
                        return "–";
                    }else{
                        return data.policyNo;
                    }
                }
            },

            {
                type: FblColumnType.PLAIN,
                property: "packNo",
                title: this.$t('textMessage_sendMsgGrid_packNo').toString() //名單序號
            },

            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('textMessage_sendMsgGrid_custId').toString() //客戶ID
            },

            {
                type: FblColumnType.PLAIN,
                property: "custName",
                title: this.$t('textMessage_sendMsgGrid_custName').toString() //客戶姓名
            },

            {
                type: FblColumnType.PLAIN,
                property: "telePhone",
                title: this.$t('textMessage_sendMsgGrid_telePhone').toString() //電話號碼
            },

            {
                type: FblColumnType.ELLIPSIS,
                property: "content",
                title: this.$t('textMessage_sendMsgGrid_content').toString(), //內容
                width: 250
            },

            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('textMessage_sendMsgGrid_status').toString() //處理狀態
            },

            {
                type: FblColumnType.PLAIN,
                property: "operator",
                title: this.$t('textMessage_sendMsgGrid_operator').toString() //處理人員
            },

        ]
    };
}