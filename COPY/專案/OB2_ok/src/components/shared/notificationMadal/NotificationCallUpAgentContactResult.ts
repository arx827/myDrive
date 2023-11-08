import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { NotificationCallUpAgentContactResultForm, NotificationCallUpAgentContactResultValidateForm } from "./model";
import { TSysCodeDto, Option, CasePackTelephoneListDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";


@Component({
    components: { HiddenFolde, FblDataGrid }
})
export default class NotificationCallUpAgentContactResult extends Vue {

    //撥號流水號
    @Prop()
    thisCodingNo;

    // 撥號資料
    callUpData: CasePackTelephoneListDto;

    // 更新撥號資料
    updateCallUpData = {};

    notiContactResultForm: NotificationCallUpAgentContactResultForm = {
        contactResultType:'',
        contactResultDetail:'',
        contactContent:'',
    }

    // 聯絡結果下拉選單
    selectContactResultTypeOptions: Option[] = [{ label: '', value: '' }];  

    // 聯絡細項下拉選單
    selectContactResultDetailOptions: Option[] = [{ label: '', value: '' }]; 

    selectTypeAndDetailOptions: TSysCodeDto[] = [];

    // 欄位驗證
    notiCallUpAgentContactResultFormRules: { [key: string]: ValidationRule[] } = {
        contactResultType: [{ validator: this.validateContactResultType, trigger: "blur" }],
        contactResultDetail: [{ validator: this.validateContactResultDetail, trigger: "blur" }],
    };

    //欄位驗證提示工具
    notiCallUpAgentContactResultValidateForm : NotificationCallUpAgentContactResultValidateForm = {
        contactResultType: { feedback: false, hoverVisible: false, msg: ""},
        contactResultDetail: { feedback: false, hoverVisible: false, msg: ""},
    }

    @Watch('notiContactResultForm', { deep: true })
    watchContactResultForm(newVal,oldVal){
        if(newVal){
            this.updateCallUpData = {
                contDetails: this.notiContactResultForm.contactResultDetail,
                contactResult: this.notiContactResultForm.contactResultType,
                callUpRemark: this.notiContactResultForm.contactContent,
            }
            this.$emit('UpdateCallUpData', this.updateCallUpData);
        }
    }

    created() {
        this.getContactResutl();
    }

    // 下拉式選單選項
    getContactResutl() {
        // 聯絡結果
        this.$commonApi.findByTypeIdUsingGET("ag.contact_result")
            .then((resp) => {
                resp.data.forEach((e) => {
                    this.selectContactResultTypeOptions.push({ label: e.label, value:e.value});
                })
            })
        // 聯絡細項
        this.$commonApi.findByTypeIdUsingGET("ag.contact_detail")
            .then((resp) => {
                resp.data.forEach((e) => {
                    this.selectContactResultDetailOptions.push({ label: e.label, value:e.value});
                })
            })

        this.$commonApi.findByTypeIdWithTSysCodeDtoUsingGET("ag.contact_detail")
            .then((resp) => {
                resp.data.forEach( (e)=> {
                    this.selectTypeAndDetailOptions.push({code: e.code, sdesc: e.sdesc, smemo1:e.smemo1, smemo2:e.smemo2});
                })
            })
    }

    // 下拉式選單變動時
    selectContactResultChange() {

        this.selectContactResultDetailOptions = [{ label: '', value: '' }]; //全部

        let set = new Set();
        
        if (!ValidationUtil.isEmpty(this.notiContactResultForm.contactResultType)) {
            this.selectTypeAndDetailOptions.filter((e) => this.notiContactResultForm.contactResultType == e.smemo1)
                .forEach((e) => {
                    if (!set.has(e.code)) {
                        set.add(e.code);
                        this.selectContactResultDetailOptions.push({ label: e.sdesc, value: e.code });
                    }
                })
        } else {
            this.selectTypeAndDetailOptions.forEach((e) => {
                if (!set.has(e.code)) {
                    set.add(e.code);
                    this.selectContactResultDetailOptions.push({ label: e.sdesc, value: e.code });
                }
            })
        }
    }

    // 聯絡結果驗證
    validateContactResultType(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultType, false, "", false);
        if(!validationUtil.isEmpty(value)){
            CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultType, false, "", false);
        } else {
            // 聯絡結果 必填
            CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultType, true, this.$t('teleResultPage_isContactResultIdRequired').toString(), false);
            callback(() => { });
        }
    }

    // 聯絡細項驗證
    validateContactResultDetail(rule, value, callback){
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultDetail, false, "", false);
        if(!validationUtil.isEmpty(value)){
            CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultDetail, false, "", false);
        } else {
            // 聯絡細項 必填
            CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultDetail, true, this.$t('notificationCallUpAgentContactResult_contactDetailRequired').toString(), false);
            callback(() => { });
        }
    }

    // 清除表單狀態(hover,feedback)
    clearForm() {
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultType, false, "", false);
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentContactResultValidateForm.contactResultDetail, false, "", false);
    }

    // 表單送出前驗證
    validateSubmit(){
        let validate = true;

        this.validateContactResultType(null, this.notiContactResultForm.contactResultType, () => {
            if(this.notiCallUpAgentContactResultValidateForm.contactResultType.feedback) {
              validate = false;
            }
        });
        // 聯絡細項
        this.validateContactResultDetail(null, this.notiContactResultForm.contactResultDetail, () => {
            if(this.notiCallUpAgentContactResultValidateForm.contactResultDetail.feedback) {
              validate = false;
            }
        });

        return validate;
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