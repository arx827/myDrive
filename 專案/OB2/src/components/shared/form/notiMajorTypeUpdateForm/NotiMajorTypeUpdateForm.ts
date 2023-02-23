import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal, TimePicker } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ReviewType, MajorTypeGrid, Option } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import  NotiMajorTypeValidateForm from "./model";

@Component
export default class NotiMajorTypeUpdateaForm extends Vue {

  
  @Prop()
  public initData: MajorTypeGrid;


  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];
  created(): void {

    this.$commonApi.findByTypeIdUsingGET("status")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectStatusOptions = res.data;
        if (!this.isEditing) {
          this.notiMajorTypeUpdateForm.status = "Y";
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
    if (!ValidationUtil.isEmpty(this.initData.majorTypeId)) {
      return true
    } else {
      return false;
    }
  }

  reset() {
    this.notiMajorTypeUpdateForm = {
      majorTypeId: this.initData.majorTypeId,
      description: this.initData.description,
      status: this.initData.status=="Y"?"Y":"N",    
    };
  }

  // 送出罐頭語
  submit() {
      //送出前先進行驗證

      (this.$refs.notiMajorTypeUpdateForm as any).validate();

      let notiDescriptionValidation: boolean = !this.notiMajorTypeValidationForm.description.feedback? true : false;
      if(notiDescriptionValidation){
      if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.notiMajorTypeUpdateForm.status=="Y"? this.$t('global_confirm_modified?').toString():this.$t("notification_relativeBancassuranceCode_outage_confirm_modified?").toString(),
          onOk: () => {
            LoadingUtil.show();
            let updateBody: MajorTypeGrid = {};
            updateBody.majorTypeId= this.initData.majorTypeId;
            updateBody.description = this.notiMajorTypeUpdateForm.description;
            updateBody.status = this.notiMajorTypeUpdateForm.status;
            this.$notifyBasicSettingApi.updateNotiTypeUsingPOST(updateBody)
              .then((resp: AxiosResponse<ReviewType>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadNotiMajorType");
              }).catch(err => {
                console.log(err )
              }).finally(() => {
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
            let createBody: ReviewType = {};
            createBody.description = this.notiMajorTypeUpdateForm.description;
            this.$notifyBasicSettingApi.insertNotiTypeUsingPOST(createBody)
              .then((resp: AxiosResponse<ReviewType>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadNotiMajorType");
              }).catch(err => {
                ErrorModalUtil.modalError(this.$t("global_addtFailure").toString());
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      }
    }else{
      return //
    }
  }
  notiMajorTypeUpdateForm = {
    majorTypeId: "",
    description: "",
    status: "",    
  };
  // ============================驗證validate section start============================
  // 欄位驗證
  notiMajorTypeUpdateFormRules: { [key: string]: ValidationRule[] } = {
    description: [{ validator: this.validateDescription, trigger: "blur" }],
  };

  //結案表單驗證物件
  notiMajorTypeValidationForm:  NotiMajorTypeValidateForm = {
    description: { feedback: false, hoverVisible: false, msg: "" },

  }
  // //顯示popOver的flag
  isDescriptionVisible: boolean = false;


  validateDescription(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.notiMajorTypeValidationForm.description, false, "", false);
  
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiMajorTypeValidationForm.description, true, this.$t("notification_majorType_description_not_blank").toString(), false);
      callback(false);
    }
  }

  notiDescriptionMouseOver() {
    if (this.notiMajorTypeValidationForm.description.feedback) {
      this.isDescriptionVisible = true;
    } else {
      this.isDescriptionVisible = false;
    }

  }
  onDescriptionChange() {
      this.validateDescription(null, this.notiMajorTypeUpdateForm.description, () => { });
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




