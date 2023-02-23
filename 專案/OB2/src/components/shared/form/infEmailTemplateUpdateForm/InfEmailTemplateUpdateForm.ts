import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import { Modal, TimePicker } from "ant-design-vue";
import { RoleDto, RoleChange, RoleChangeStatusEnum, RoleDtoStatusEnum, Option } from "@fubonlife/obd-api-axios-sdk";
import message from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { RoleSettingValidateObject } from "@/pages/roleSetting/model";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { InfEmailTemplateSettingGrid, InfEmailTemplate } from "@fubonlife/obd-api-axios-sdk";
import ValidationUtil from "@/assets/config/ValidationUtil";
@Component
export default class InfDayUpdateForm extends Vue {

  //會辦日期設定表單資料傳入
  @Prop()
  public initData: InfEmailTemplateSettingGrid;

  @Prop()
  originalMajorTypeOptions:Option[];

  //實際綁定的主類別下拉選單

  majorTypeOptions:Option[]=[];
 

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

  get isEditing():boolean{
    if(!ValidationUtil.isEmpty(this.initData.infEmailTemplateId)){
      return true;
    }else{
      return false;
    }
    
  }
  /**
   * 編輯，會辦日期設定表單
   */
  reset() {
    // 塞入會辦日期設定表單的欄位資料
    this.majorTypeOptions=this.originalMajorTypeOptions;
    this.infEmailTemplateSettingForm = {
      infTypeId: this.initData.infTypeId,
      subject: this.initData.subject,
      content: this.initData.content,
    };
  }

  // 送出會辦日期設定異動變動
  submit() {
    // if (this.infEmailTemplateSettingForm.subject.length == 0 && this.infEmailTemplateSettingForm.content.length == 0) {
    //   ErrorModalUtil.modalError(this.$t("atLeastOneColumnNotblanck").toString());
    //   return
    // }
    this.validateTypeId(null,this.infEmailTemplateSettingForm.infTypeId,()=>{});
    this.validateSubject(null, this.infEmailTemplateSettingForm.subject, () => { })
    this.validateContent(null, this.infEmailTemplateSettingForm.content, () => { });
    let TypeIdValidation: boolean = this.infEmailTemplateValidationForm.infTypeId.state == "success" ? true : false;
    let subjectValidation: boolean = this.infEmailTemplateValidationForm.subject.state == "success" ? true : false;
    let contentValidation: boolean = this.infEmailTemplateValidationForm.content.state == "success" ? true : false;
    
    if (subjectValidation && contentValidation&&TypeIdValidation) {//驗證成功才送出
      if(this.isEditing){
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),//"確認"
        content: this.$t('global_confirm_modified?').toString(),//"確認修改?
        onOk: () => {
          LoadingUtil.show();
          let updateBody: InfEmailTemplate = {};
          updateBody.infEmailTemplateId = this.initData.infEmailTemplateId;
          updateBody.subject = this.infEmailTemplateSettingForm.subject;
          updateBody.content = this.infEmailTemplateSettingForm.content;
          this.$informBasicSettingApi.updateInformEmailTemplateUsingPOST(updateBody)
            .then((resp: AxiosResponse<InfEmailTemplate>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadInfEmailTemplate");
            }).catch(err => {
              console.log(err)
            }).finally(() => {
              LoadingUtil.close();
            })
        }
      });
    }else{

      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),//"確認"
        content: this.$t('global_confirm_add?').toString(),//"確認新增?
        onOk: () => {
          LoadingUtil.show();
          let createdBody: InfEmailTemplate = {};
          createdBody.infTypeId=this.infEmailTemplateSettingForm.infTypeId;
          createdBody.subject = this.infEmailTemplateSettingForm.subject;
          createdBody.content = this.infEmailTemplateSettingForm.content;
          this.$informBasicSettingApi.insertInformEmailTemplateUsingPOST(createdBody)
            .then((resp: AxiosResponse<InfEmailTemplate>) => {
              MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
              this.$emit("reloadInfEmailTemplate");
            }).catch(err => {
              console.log(err)
            }).finally(() => { //如果驗證失敗就return
              LoadingUtil.close();
            })
        }
      });
    }

  
    } else {
      return //驗證失敗返回
    }
  }

   //宣告會辦日期設定的欄位資料
   infEmailTemplateSettingForm = {
    infTypeId: "",
    subject: "",
    content: "",
  };

  // ============================驗證validate section start============================
  infEmailTemplateValidationForm = {
    infTypeId:{
      feedback: false,
      state: "",
      hover: "",
      content: "",
    },
    subject: {
      feedback: false,
      state: "",
      hover: "",
      content: "",
    },
    content: {
      feedback: false,
      state: "",
      hover: "",
      content: "",
    }

  }
  //顯示popOver的flag
  isEmailSubjectVisible: boolean = false;

  //顯示popOver的flag
  isEmailContentVisible: boolean = false;

validateTypeId(rule, value, callback){
  this.infEmailTemplateValidationForm.infTypeId.feedback=false;
  this.infEmailTemplateValidationForm.infTypeId.hover = "";
  if (ValidationUtil.isEmpty(value)) {
    this.infEmailTemplateValidationForm.infTypeId.content = this.$t("visitPersonSetting_type_not_blank").toString();
    this.infEmailTemplateValidationForm.infTypeId.hover = "hover";
    this.infEmailTemplateValidationForm.infTypeId.state = "error";
    this.infEmailTemplateValidationForm.infTypeId.feedback = true;
    callback(false);
  } else{
    this.infEmailTemplateValidationForm.infTypeId.feedback = false;
    this.infEmailTemplateValidationForm.infTypeId.state = "success";
    callback();
  }
}
onTypeIdChange(){
  this.validateTypeId(null,this.infEmailTemplateSettingForm.infTypeId,()=>{});
}
  validateSubject(rule, value, callback) {

    this.infEmailTemplateValidationForm.subject.feedback = true;
    this.infEmailTemplateValidationForm.subject.hover = "";
    if (ValidationUtil.isEmpty(value)) {
      this.infEmailTemplateValidationForm.subject.content = this.$t("infEmail_template_subject_not_blank").toString();
      this.infEmailTemplateValidationForm.subject.hover = "hover";
      this.infEmailTemplateValidationForm.subject.state = "error";
      this.infEmailTemplateValidationForm.subject.feedback = true;
    } else if (!ValidationUtil.isEmpty(value) && value.length > 200) {
      this.infEmailTemplateValidationForm.subject.content = this.$t("subject_not_over_200").toString();
      this.infEmailTemplateValidationForm.subject.hover = "hover";
      this.infEmailTemplateValidationForm.subject.state = "error";
      this.infEmailTemplateValidationForm.subject.feedback = true;
      callback(false);
    } else {
      this.infEmailTemplateValidationForm.subject.feedback = false;
      this.infEmailTemplateValidationForm.subject.state = "success";
    }
  }

  //控制主旨錯誤popOver是否出現的判斷
  infEmailSubjectMouseOver() {
    if (this.infEmailTemplateValidationForm.subject.state == "error") {
      this.isEmailSubjectVisible = true;
    } else {
      this.isEmailSubjectVisible = false;
    }
  }

  //當主旨改變的時候
  onSubjectChange() {
    if (this.infEmailTemplateValidationForm.subject.state == "error") {
      this.validateSubject(null, this.infEmailTemplateSettingForm.subject, () => { });
    }
  }

  validateContent(rule, value, callback) {

    this.infEmailTemplateValidationForm.content.feedback = true;
    this.infEmailTemplateValidationForm.content.hover = "";
    if (ValidationUtil.isEmpty(value)) {
      this.infEmailTemplateValidationForm.content.content = this.$t("infEmail_template_content_not_blank").toString();
      this.infEmailTemplateValidationForm.content.hover = "hover";
      this.infEmailTemplateValidationForm.content.state = "error";
      this.infEmailTemplateValidationForm.content.feedback = true;
    } else if (!ValidationUtil.isEmpty(value) && value.length > 500) {
      this.infEmailTemplateValidationForm.content.content = this.$t("content_not_over_500").toString();
      this.infEmailTemplateValidationForm.content.hover = "hover";
      this.infEmailTemplateValidationForm.content.state = "error";
      this.infEmailTemplateValidationForm.content.feedback = true;
      callback(false);
    } else {
      this.infEmailTemplateValidationForm.content.feedback = false;
      this.infEmailTemplateValidationForm.content.state = "success";
    }
  }

  //控制內容popOver是否出現的判斷
  infEmailContentMouseOver() {
    if (this.infEmailTemplateValidationForm.content.state == "error") {
      this.isEmailContentVisible = true;
    } else {
      this.isEmailContentVisible = false;
    }
  }

  //當主旨改變的時候
  onContentChange() {
    if (this.infEmailTemplateValidationForm.content.state == "error") {
      this.validateContent(null, this.infEmailTemplateSettingForm.content, () => { });
    }
  }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.indexOf(input) >= 0
      );
    }


}




