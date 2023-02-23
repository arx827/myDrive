import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal, TimePicker } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ReviewSubType, MajorSubTypeGrid, Option } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import  NotiMajorSubTypeValidateForm from "./model";

@Component
export default class NotiMajorSubTypeUpdateForm extends Vue {


  @Prop()
  public initData: MajorSubTypeGrid;


  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];
  created(): void {

    this.$commonApi.findByTypeIdUsingGET("status")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectStatusOptions = res.data;
        if (!this.isEditing) {
          this.notiMajorSubTypeUpdateForm.status = "Y";
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
    if (!ValidationUtil.isEmpty(this.initData.majorSubTypeId)) {
      return true
    } else {
      return false;
    }
  }

  reset() {
    this.notiMajorSubTypeUpdateForm = {
      majorSubTypeId: this.initData.majorSubTypeId,
      description: this.initData.description,
      status: this.initData.status=="Y"?"Y":"N",    
    };
  }

  // 送出罐頭語
  submit() {

     (this.$refs.notiMajorSubTypeUpdateForm as any).validate();
     let notiDescriptionValidation: boolean = !this.notiMajorSubTypeValidationForm.description.feedback? true : false;
     if(notiDescriptionValidation){
     if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.notiMajorSubTypeUpdateForm.status=="Y"?this.$t('global_confirm_modified?').toString():this.$t('notiSettingPage_after_enabled_relative_notiSetting_enabled_confirm modified?').toString(),//"確認修改?:停用後,相關的電訪照會碼將一併更新為停用, 確認修改?
          onOk: () => {
            LoadingUtil.show();
            let updateBody: MajorSubTypeGrid = {};
            updateBody.majorSubTypeId= this.initData.majorSubTypeId;
            updateBody.description = this.notiMajorSubTypeUpdateForm.description;
            updateBody.status = this.notiMajorSubTypeUpdateForm.status;
            this.$notifyBasicSettingApi.updateNotiSubTypeUsingPOST(updateBody)
              .then((resp: AxiosResponse<ReviewSubType>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadNotiMajorSubType");
              }).catch(err => {
                console.log(err)
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
            let createBody: ReviewSubType = {};
            createBody.description = this.notiMajorSubTypeUpdateForm.description;
            this.$notifyBasicSettingApi.insertNotiSubTypeUsingPOST(createBody)
              .then((resp: AxiosResponse<ReviewSubType>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadNotiMajorSubType");
              }).catch(err => {
                ErrorModalUtil.modalError(this.$t("global_addtFailure").toString());
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

  //照會次類別表單物件
  notiMajorSubTypeUpdateForm = {
    majorSubTypeId: "",
    description: "",
    status: "",    
  };
  
  // ============================驗證validate section start============================
  // 欄位驗證rules
  notiMajorSubTypeUpdateFormRules: { [key: string]: ValidationRule[] } = {
    description: [{ validator: this.validateDescription, trigger: "blur" }],
  };

  //結案表單驗證物件
  notiMajorSubTypeValidationForm:  NotiMajorSubTypeValidateForm = {
    description: { feedback: false, hoverVisible: false, msg: "" },

  }
  // //顯示popOver的flag
  isDescriptionVisible: boolean = false;


  validateDescription(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.notiMajorSubTypeValidationForm.description, false, "", false);
  
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiMajorSubTypeValidationForm.description, true,this.$t("notification_majorSubType_code_description_not_blank").toString(), false);
      callback(false);
    }
  }

  notiDescriptionMouseOver() {
    if (this.notiMajorSubTypeValidationForm.description.feedback) {
      this.isDescriptionVisible = true;
    } else {
      this.isDescriptionVisible = false;
    }

  }
  onDescriptionChange() {
      this.validateDescription(null, this.notiMajorSubTypeUpdateForm.description, () => { });
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




