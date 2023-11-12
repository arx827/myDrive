import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { MailByPostGrid, CancelMail } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import MailLetterCancelFormValidationForm from "./model";
@Component
export default class MailLetterCancelForm extends Vue {

    @Prop()
    initData: MailByPostGrid;



    created() {
    }

    validateBeforeSubmit(){




    }
    /**
     * 
     * 送出取消信函
     */
    submit(mailByPostId: string) {

        this.validateCancelReason(null,this.mailLetterCancelForm.cancelReason,()=>{});

        let cancelReasonValidation:boolean=!this.mailLetterCancelValidationForm.cancelReason.feedback?true:false;

        if(cancelReasonValidation){
        console.log(this.initData.mailByPostId);
        let cancelBody: CancelMail = {};
        cancelBody.mailByPostId = this.initData.mailByPostId;
        cancelBody.cancelLetterReason = this.mailLetterCancelForm.cancelReason;
        this.$mailByPostApi.cancelMailByPostUsingPOST(
            cancelBody)
            .then(() => {
                MessageUtil.messageInfo(this.$t("noticeManualLetterForm_cancelLetter_success").toString());

                this.$emit("reloadMailByPostGrid", this.initData.caseNo);
            }).catch(err => {
                ErrorModalUtil.modalError(this.$t("noticeManualLetterForm_cancelLetter_failed").toString());
            })

    }else{
        return
    }
}


    mailLetterCancelForm = {
        cancelReason: "",
    }


    //===========================驗證相關===========================================

    cancelReasonVisible: boolean = false;
    // 欄位驗證規則
    mailLetterCancelFormRules: { [key: string]: ValidationRule[] } = {
        cancelReason: [{ validator: this.validateCancelReason, trigger: "blur" }],//
    };



    //修改郵寄主表表單驗證物件
    mailLetterCancelValidationForm: MailLetterCancelFormValidationForm = {
        cancelReason: { feedback: false, hoverVisible: false, msg: "" },

    }

    //驗證取消信函原因
    validateCancelReason(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterCancelValidationForm.cancelReason, false, "", false);

        if (this.mailLetterCancelForm.cancelReason.length == 0) {
            CommonUtil.feildValidateWithVisible(this.mailLetterCancelValidationForm.cancelReason, true, this.$t("mailCancelForm_cancelReason_not_blank").toString(), false);//"取消原因不可為空
            callback(false);
        } else {
            if (this.mailLetterCancelForm.cancelReason.length > 200) {
                CommonUtil.feildValidateWithVisible(this.mailLetterCancelValidationForm.cancelReason, true, this.$t("mailCancelForm_cancelReason_200_words").toString(), false);//"字數上限200字
                callback(false);

            }



        }
    }

    cancelReasonMouseOver() {
        if (this.mailLetterCancelValidationForm.cancelReason.feedback) {
            this.cancelReasonVisible = true;
        } else {
            this.cancelReasonVisible = false;
        }

    }
    //收件人改變時候
    onSelectCancelReason() {
        this.validateCancelReason(null, this.mailLetterCancelForm.cancelReason, () => { });
    }


//========================共用驗證相關物件開始===================================

    //取得驗證feedback綁定的參數
    callCommonUtilFeildFeedback(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateFeedback(fv);
    }

    //取得驗證status綁定的參數
    callCommonUtilFeildStatus(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateStatus(fv);
    }

    //取得hover content綁定的參數
    callCommonUtilFeildMsg(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateHoverMsg(fv);
    }

    //取得hover trigger綁定的參數
    callCommonUtilFeildTrigger(fv: ValidateFormComponent) {
        CommonUtil.getFeildVaildateTrigger(fv);
    }

    //取得hover hoverVisivle綁定的參數
    callCommonUtilFeildHoverVisible(fv: ValidateFormComponent) {
        return CommonUtil.getFeildVaildateHoverVisible(fv);
    }

    //變更hover hoverVisivle參數
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    //========================共用驗證相關物件結束===================================

}