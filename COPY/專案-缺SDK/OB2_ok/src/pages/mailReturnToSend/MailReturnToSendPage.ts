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
import {mailReturnToSendValidForm} from "./model";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { MailReturnToSendInputDto, MailReturnToSendOutputDto} from "@fubonlife/obd-api-axios-sdk";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import axios, {AxiosResponse} from 'axios';
import LoadingUtil from "@/assets/config/LoadingUtil";import { from } from "rxjs";

@Component({
    components:{}
})
export default class MailReturnToSendPage extends Vue{

    // DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    // 掛號退回 form 物件
    mailReturnToSendForm = {
        retunrDate:new Date(), // 退回日期為系統時間
        mailBarCodeList:{
            mailBarCode_1:undefined,
            mailBarCode_2:undefined,
            mailBarCode_3:undefined,
            mailBarCode_4:undefined,
            mailBarCode_5:undefined,
            mailBarCode_6:undefined,
            mailBarCode_7:undefined,
            mailBarCode_8:undefined,
            mailBarCode_9:undefined,
            mailBarCode_10:undefined,
            mailBarCode_11:undefined,
            mailBarCode_12:undefined,
            mailBarCode_13:undefined,
            mailBarCode_14:undefined,
            mailBarCode_15:undefined,
            mailBarCode_16:undefined,
            mailBarCode_17:undefined,
            mailBarCode_18:undefined,
            mailBarCode_19:undefined,
            mailBarCode_20:undefined,
            mailBarCode_21:undefined,
            mailBarCode_22:undefined,
            mailBarCode_23:undefined,
            mailBarCode_24:undefined,
        }
    }

    // 掛號退回 驗證 form 物件
    mailReturnToSendValidForm:mailReturnToSendValidForm = {
        mailBarCode_1:{ feedback: false, hoverVisible: false },
        mailBarCode_2:{ feedback: false, hoverVisible: false },
        mailBarCode_3:{ feedback: false, hoverVisible: false },
        mailBarCode_4:{ feedback: false, hoverVisible: false },
        mailBarCode_5:{ feedback: false, hoverVisible: false },
        mailBarCode_6:{ feedback: false, hoverVisible: false },
        mailBarCode_7:{ feedback: false, hoverVisible: false },
        mailBarCode_8:{ feedback: false, hoverVisible: false },
        mailBarCode_9:{ feedback: false, hoverVisible: false },
        mailBarCode_10:{ feedback: false, hoverVisible: false },
        mailBarCode_11:{ feedback: false, hoverVisible: false },
        mailBarCode_12:{ feedback: false, hoverVisible: false },
        mailBarCode_13:{ feedback: false, hoverVisible: false },
        mailBarCode_14:{ feedback: false, hoverVisible: false },
        mailBarCode_15:{ feedback: false, hoverVisible: false },
        mailBarCode_16:{ feedback: false, hoverVisible: false },
        mailBarCode_17:{ feedback: false, hoverVisible: false },
        mailBarCode_18:{ feedback: false, hoverVisible: false },
        mailBarCode_19:{ feedback: false, hoverVisible: false },
        mailBarCode_20:{ feedback: false, hoverVisible: false },
        mailBarCode_21:{ feedback: false, hoverVisible: false },
        mailBarCode_22:{ feedback: false, hoverVisible: false },
        mailBarCode_23:{ feedback: false, hoverVisible: false },
        mailBarCode_24:{ feedback: false, hoverVisible: false },
    }

    // 掛號退回 驗證 rule 
    mailNoticeSearchRule: { [key: string]: ValidationRule[] } = {
        mailBarCode_1:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_2:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_3:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_4:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_5:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_6:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_7:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_8:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_9:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_10:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_11:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_12:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_13:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_14:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_15:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_16:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_17:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_18:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_19:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_20:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_21:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_22:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_23:[{ validator: this.validateMailBarCode, trigger: "blur" }],
        mailBarCode_24:[{ validator: this.validateMailBarCode, trigger: "blur" }],
    }


    // ===================================== 初始  ========================================================    
    created(){
        // nothing to do here...
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
     callCommonUtilFeild(fv: ValidateFormComponent){
        return CommonUtil.getFeildValid(fv);
    }

    /**
     * @description 變更hover hoverVisivle參數
     * @param fv 
     * 
     * @author B1842
     * @version 2022/09/10
     */
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    /**
     * 掛號編號驗證
     * @param rule 驗證規則 
     * @param value
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateMailBarCode(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm[rule.field], false, '', false);
        if(!ValidationUtil.isEmpty(this.mailReturnToSendForm.mailBarCodeList[rule.field])){
            if(!ValidationUtil.alphabetAndNumberValidation(this.mailReturnToSendForm.mailBarCodeList[rule.field])){
                //郵件條碼 僅可中文及英數字 
                CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm[rule.field], true, this.$t('mailReturnToSendPage_valid_mailBarCode_1').toString(), false); 
                callback(()=>{});
            }
        }
        callback();
    }
    
    /**
     * 新增前驗證欄位
     * @returns 
     */
    validateAdd(){
        let validate = true;
        
        // 驗證 郵件條碼 全部都為空 跳出訊息
        var isAllEmpt = Object.values(this.mailReturnToSendForm.mailBarCodeList).every((currValue)=> ValidationUtil.isEmpty(currValue));
        if(isAllEmpt){
            validate = false;
            Modal.error({
                title:() => this.$t('mailReturnToSendPage_return_error_5').toString(),  // 請輸入郵件條碼
                content:() => {},
                okText: this.$t('global_ok').toString(), //確認
                onOk: () => {},
            });
        }
        
        // 驗證 掛號編號 滾出所有下去驗證
        Object.keys(this.mailNoticeSearchRule).some((eachRuleKey)=>{
            var innerValidate = true;
            var ruleObj:{field:string;fullField?:string;type?:string}={field:eachRuleKey}; // 整理 rule 物件
            this.validateMailBarCode(ruleObj, this.mailReturnToSendForm.mailBarCodeList[eachRuleKey], ()=>{
                if(this.mailReturnToSendValidForm[eachRuleKey].state == 'error'){
                    innerValidate = false;
                }
            });
            if(!innerValidate){
                validate = false;
                return true;
            }
        });


        return validate;
    }

    // ===================================== 事件  ========================================================    
    
    /**
     * 新增
     */
    addToReturn(){
        // 先執行驗證
        if(this.validateAdd()){
            // 打ajax 到後端執行退回重啟
            this.ajaxAddToReturn();
        }
    }
    
    /**
     * 清除
     */
     resetMailReturnToSendForm(){
        this.mailReturnToSendForm = {
            retunrDate:new Date(), // 退回日期為系統時間
            mailBarCodeList:{
                mailBarCode_1:undefined,
                mailBarCode_2:undefined,
                mailBarCode_3:undefined,
                mailBarCode_4:undefined,
                mailBarCode_5:undefined,
                mailBarCode_6:undefined,
                mailBarCode_7:undefined,
                mailBarCode_8:undefined,
                mailBarCode_9:undefined,
                mailBarCode_10:undefined,
                mailBarCode_11:undefined,
                mailBarCode_12:undefined,
                mailBarCode_13:undefined,
                mailBarCode_14:undefined,
                mailBarCode_15:undefined,
                mailBarCode_16:undefined,
                mailBarCode_17:undefined,
                mailBarCode_18:undefined,
                mailBarCode_19:undefined,
                mailBarCode_20:undefined,
                mailBarCode_21:undefined,
                mailBarCode_22:undefined,
                mailBarCode_23:undefined,
                mailBarCode_24:undefined,
            }
        };
        this.clearValidateStatus();
     }

     // 清除 驗證狀態
     clearValidateStatus(){
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_1, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_2, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_3, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_4, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_5, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_6, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_7, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_8, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_9, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_10, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_11, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_12, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_13, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_14, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_15, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_16, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_17, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_18, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_19, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_20, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_21, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_22, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_23, false, '', false);
        CommonUtil.feildValidateWithVisible(this.mailReturnToSendValidForm.mailBarCode_24, false, '', false);
     }

    // ===================================== ajax  ========================================================    
    
    /**
     * 退回重啟 ajax
     */
    ajaxAddToReturn(){
        
        var mailReturnToSendInputDto:MailReturnToSendInputDto={mailBarCodeList:[]};

        Object.values(this.mailReturnToSendForm.mailBarCodeList).forEach((eachReg:string)=>{
            if(!ValidationUtil.isEmpty(eachReg)){
                mailReturnToSendInputDto.mailBarCodeList.push(eachReg);
            }
        });
        
        LoadingUtil.show();
        this.$mailReturnToSendApi.mailReturnToSendUsingPOST(mailReturnToSendInputDto)
        .then((resp:AxiosResponse<MailReturnToSendOutputDto>)=>{

            if(resp.data && resp.data.success){
                if(resp.data.reopenSuccessMailPostList != null &&
                    resp.data.reopenSuccessMailPostList.length > 0 ){
                    Modal.success({
                        title: ()=> this.$t('mailReturnToSendPage_return_success_2').toString(), //退回成功
                        content: ()=> {
                            var reopenSuccessMailPostList:Array<string> = [];
                            resp.data.reopenSuccessMailPostList.forEach((each)=>{
                                reopenSuccessMailPostList.push(each.mailBarCode);
                            });
                            var pretext = this.$t('mailReturnToSendPage_return_success_3').toString(); //重啟成功郵件條碼如下
                            return pretext  + this.generateReturnMessage(reopenSuccessMailPostList)},
                        okText: this.$t('global_ok').toString(), //確認
                        icon: 'check-circle', // 打勾圖示
                        onOk: () => {},
                    });
                }else{
                    Modal.success({
                        title: ()=> this.$t('mailReturnToSendPage_return_success_2').toString(), //退回成功
                        content: ()=> {},
                        okText: this.$t('global_ok').toString(), //確認
                        icon: 'check-circle', // 打勾圖示
                        onOk: () => {},
                    });
                }
                this.resetMailReturnToSendForm();
                LoadingUtil.close();
            }
            // 失敗
            else{
                // 郵件條碼錯誤 未在 郵寄主表中
                if(!ValidationUtil.isEmpty(resp.data.noneMatchMailBarCodesInMailPost) ){
                    Modal.error({
                        title:() => this.$t('mailReturnToSendPage_return_error_6').toString(),  // 郵件條碼錯誤
                        content:() => {return this.generateReturnMessage(resp.data.noneMatchMailBarCodesInMailPost)},
                        okText: this.$t('global_ok').toString(), //確認
                        onOk: () => {},
                    });
                }
                else if(!ValidationUtil.isEmpty(resp.data.reopenErrorMailBarCodeList)){
                    Modal.error({
                        title:() => this.$t('mailReturnToSendPage_return_error_7').toString(),  // 部分郵件條碼重啟失敗
                        content:() => {return this.generateReturnMessage(resp.data.reopenErrorMailBarCodeList)},
                        okText: this.$t('global_ok').toString(), //確認
                        onOk: () => {},
                    });
                }
                // 其餘錯誤
                else{
                    throw 'system error'; // 隨便丟出新的 錯誤 讓下方 catch 接
                }
                LoadingUtil.close();
            } 
            
        })
        .catch((error)=>{
            ErrorModalUtil.modalError(this.$t('mailReturnToSendPage_return_error_8').toString()); // 郵件條碼退回發生異常
            LoadingUtil.close();
        });

    }

    // 整理錯誤回傳訊息
    generateReturnMessage(listObj:any):string{
        var msg = "";
        for (var i = 0; i < listObj.length; i++) {
            var temp = "";
            temp = temp + listObj[i];
            if(i!=listObj.length-1){
                temp = temp + "、";
            }
            msg = msg + temp;
        }
        return msg;
    }
    
}