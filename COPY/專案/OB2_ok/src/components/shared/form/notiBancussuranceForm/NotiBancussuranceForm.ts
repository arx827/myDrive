import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { NotiBancassurance, NotiBancassuranceGrid, Option,NotiBancassuranceUpdation} from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import  NotibancassuranceValidateForm from "./model";

@Component
export default class NotiMajorSubTypeUpdateForm extends Vue {


  @Prop()
  public initData: NotiBancassuranceGrid;



  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];
  created(): void {
  

    this.$commonApi.findByTypeIdUsingGET("status")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectStatusOptions = res.data;
        if (!this.isEditing) {
          this.bancassuranceSettingForm.status = "Y";
        }
      }).catch((err) => {
        console.log(err);
      });

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

  get isEditing(): boolean {
    if (!ValidationUtil.isEmpty(this.initData.bancassuranceId)) {
      return true
    } else {
      return false;
    }
  }

  reset() {
    this.bancassuranceSettingForm = {
      bancassuranceId: this.initData.bancassuranceId,
      description: this.initData.description,
      status: this.initData.status,    
    };
  }

  // 送出罐頭語
  submit() {
      (this.$refs.bancassuranceSettingForm as any).validate();
      let notiBancassuranceIdValidation: boolean = !this.notiBancassuranceValidationForm.bancassuranceId.feedback? true : false;
      let notiDescriptionValidation: boolean = !this.notiBancassuranceValidationForm.description.feedback? true : false;
      
      if(notiBancassuranceIdValidation&&notiDescriptionValidation){
      if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_modified?').toString(),//"確認修改?
          onOk: () => {
            LoadingUtil.show();
            let updateBody: NotiBancassuranceUpdation = {};
            updateBody.bancassuranceId= this.initData.bancassuranceId;
            updateBody.description = this.bancassuranceSettingForm.description;
            updateBody.status = this.bancassuranceSettingForm.status;
            this.$notifyBasicSettingApi.updateNotiBancassuranceUsingPOST(updateBody)
              .then((resp: AxiosResponse<NotiBancassurance>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadNotiBancassurance");
              }).catch(err => console.log(err)).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      } else {
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_add?').toString(),//"確認新增?",
          onOk: () => {
            LoadingUtil.show();
            let createBody: NotiBancassurance = {};
            createBody.bancassuranceId=this.bancassuranceSettingForm.bancassuranceId;
            createBody.description = this.bancassuranceSettingForm.description;
            this.$notifyBasicSettingApi.insertNotiBancassuranceUsingPOST(createBody)
              .then((resp: AxiosResponse<NotiBancassurance>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadNotiBancassurance");
              }).catch(err => {
                ErrorModalUtil.modalError(err.response.data.message);
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      }
    }else{
      return
    }
  }

  bancassuranceSettingForm = {
    bancassuranceId: "",
    description: "",
    status: "",    
  };
  // ============================驗證validate section start============================
 // 欄位驗證rules
notiBancassuranceUpdateFormRules: { [key: string]: ValidationRule[] } = {
  bancassuranceId: [{ validator: this.validateBancassuranceId, trigger: "blur" }],
  description: [{ validator: this.validateDescription, trigger: "blur" }],
};

//結案表單驗證物件
notiBancassuranceValidationForm:  NotibancassuranceValidateForm = {
  bancassuranceId: { feedback: false, hoverVisible: false, msg: "" },
  description: { feedback: false, hoverVisible: false, msg: "" },
}
// //顯示popOver的flag
isDescriptionVisible: boolean = false;

validateBancassuranceId(rule, value, callback){
  CommonUtil.feildValidateWithVisible(this.notiBancassuranceValidationForm.bancassuranceId, false, "", false);

  if (!ValidationUtil.isEmpty(value)) {
    if(ValidationUtil.taskIdValidation(value)){
      CommonUtil.feildValidateWithVisible(this.notiBancassuranceValidationForm.bancassuranceId, false, "", false);
    }else{
      CommonUtil.feildValidateWithVisible(this.notiBancassuranceValidationForm.bancassuranceId, true, this.$t("notification_majorType_code_only_alpahAndNumber").toString(), false);
      callback(false);
    }
  }else{
    CommonUtil.feildValidateWithVisible(this.notiBancassuranceValidationForm.bancassuranceId, true, this.$t("notification_bancassuranceCode_not_blank").toString(), false);
    callback(false);

  }
}

onBancassuranceId() {
  this.validateBancassuranceId(null, this.notiBancassuranceValidationForm.bancassuranceId, () => { });
}

validateDescription(rule, value, callback){
  CommonUtil.feildValidateWithVisible(this.notiBancassuranceValidationForm.description, false, "", false);

  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiBancassuranceValidationForm.description, true,this.$t("notification_bancassurance_description_not_blank").toString(), false);
    callback(false);
  }
}

notiDescriptionMouseOver() {
  if (this.notiBancassuranceValidationForm.description.feedback) {
    this.isDescriptionVisible = true;
  } else {
    this.isDescriptionVisible = false;
  }

}
onDescriptionChange() {
    this.validateDescription(null, this.notiBancassuranceValidationForm.description, () => { });
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




