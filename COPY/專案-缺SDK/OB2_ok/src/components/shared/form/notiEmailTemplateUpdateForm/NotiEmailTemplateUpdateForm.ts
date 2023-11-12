import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Modal } from "ant-design-vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { NotiEmailTemplateGrid, TobdNotiEmailTemplate,NotiEmailTemplateUpdation } from "@fubonlife/obd-api-axios-sdk";
import ValidationUtil from "@/assets/config/ValidationUtil";
import  NotiDayValidateForm from "./model";
@Component
export default class InfDayUpdateForm extends Vue {

  @Prop()
  public initData: NotiEmailTemplateGrid;

  created(): void {
    this.reset();
  }
  /**
   * 監聽initData資料變動
   * @returns 
   */
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  get isEditing():boolean{//尚未確定是否需要新增 先保留
    if(!ValidationUtil.isEmpty(this.initData.notiEmailTemplateId)){
      return true;
    }else{
      return false;
    }
  }
  reset() {
    this.notiEmailTemplateSettingForm = {
      notiTypeId: this.initData.notiEmailTemplateId,
      subject: this.initData.subject,
      content: this.initData.content,
    };
  }

  // 送出會辦日期設定異動變動
  submit() {
    (this.$refs.notiEmailTemplateSettingFormRules as any).validate();
    let notiSubjectValidation: boolean = !this.notiEmailTemplateValidationForm.subject.feedback? true : false;
    let notiContentValidation: boolean = !this.notiEmailTemplateValidationForm.content.feedback? true : false;
    if(notiSubjectValidation&&notiContentValidation){
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),//"確認"
        content: this.$t('global_confirm_modified?').toString(),//"確認修改?
        onOk: () => {
          LoadingUtil.show();
          let updateBody: NotiEmailTemplateUpdation = {};
          updateBody.notiEmailTemplateId = this.initData.notiEmailTemplateId;
          updateBody.subject = this.notiEmailTemplateSettingForm.subject;
          updateBody.content = this.notiEmailTemplateSettingForm.content;
          this.$notifyBasicSettingApi.updateNotiEmailTemplateUsingPOST(updateBody)
            .then((resp: AxiosResponse<TobdNotiEmailTemplate>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadNotiEmailTemplate");
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              LoadingUtil.close();
            })
        }
      });
    }else{
      return
    }
    }

   notiEmailTemplateSettingForm = {
    notiTypeId: "",
    subject: "",
    content: "",
  };
 // ============================驗證validate section start============================
 // 欄位驗證rules
 notiEmailTemplateSettingFormRules: { [key: string]: ValidationRule[] } = {
  subject: [{ validator: this.validateSubject, trigger: "blur" }],
  content: [{ validator: this.validateContent, trigger: "blur" }],
};

//結案表單驗證物件
notiEmailTemplateValidationForm:  NotiDayValidateForm = {
  subject: { feedback: false, hoverVisible: false, msg: "" },
  content: { feedback: false, hoverVisible: false, msg: "" },
}


validateSubject(rule, value, callback){
  CommonUtil.feildValidateWithVisible(this.notiEmailTemplateValidationForm.subject, false, "", false);

  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiEmailTemplateValidationForm.subject, true, this.$t("infEmail_template_subject_not_blank").toString(), false);
    callback(false);
  }
}

validateContent(rule, value, callback){
  CommonUtil.feildValidateWithVisible(this.notiEmailTemplateValidationForm.content, false, "", false);

  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiEmailTemplateValidationForm.content, true, this.$t("infEmail_template_content_not_blank").toString(), false);
    callback(false);
  }
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




