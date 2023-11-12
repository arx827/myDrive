import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Option, ReviewSubType,NotifyInformItemGrid,NotifyInformItemUpdateDto} from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import InfItemValidateForm from "../infItemSettingEditForm/model";
@Component
export default class InfItemSettingEditForm extends Vue {

  //會辦項目設定表單資料由外部傳入
  @Prop()
  public initData:NotifyInformItemGrid ;

  //宣告會辦會辦項目設定的欄位資料
  infItemSettingEditForm = {
    description: "",//第一層項目敘述
    status: "",//狀態
  };

  //狀態，下拉式表單由外部傳來
  @Prop()
  originalSelectStatusOptions: Option[];

  //狀態，實際綁定的下拉選單
  selectStatusOptions: Option[];
  created(): void {
    this.selectStatusOptions = this.originalSelectStatusOptions;
    if (!this.isEditing) {
      this.infItemSettingEditForm.status = "Y";
    }

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
    if (!ValidationUtil.isEmpty(this.initData.infMajorSubTypeId)) {
      return true
    } else {
      return false;
    }
  }

  /**
   * 編輯，會辦日期設定表單
   */
  reset() {

    // 塞入會辦日期設定表單的欄位資料
    this.infItemSettingEditForm = {
      description: this.initData.description,
      status: this.initData.status == "Y" ? "Y" : "N",
    };
  }

  // 送出
  submit() {

    this.validateinfItemDescription(null, this.infItemSettingEditForm.description, () => { });
    let infItemDescriptionValidation: boolean = !this.infItemSettingValidationForm.description.feedback ? true : false;
    if(infItemDescriptionValidation){//驗證過才能進入新增或編輯模式
    if (this.isEditing) {//編輯模式
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),//"確認"
        content: this.$t('global_confirm_modified?').toString(),//"確認修改?
        onOk: () => {
          LoadingUtil.show();
          let updateBody: NotifyInformItemUpdateDto = {};
          updateBody.reviewSubTypeId = this.initData.infMajorSubTypeId;
          updateBody.description = this.infItemSettingEditForm.description;
          updateBody.status = this.infItemSettingEditForm.status == "Y" ? "Y" : "L";
          this.$infNotifySettingApi.updateInformItemFistLevelUsingPOST(updateBody)
            .then((resp: AxiosResponse<ReviewSubType>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadInformItem");
              console.log(resp.data.reviewSubTypeId);
            }).catch((error) => { ErrorModalUtil.modalError(this.$t(error.response.data.message).toString()) }).finally(() => {
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
          let createBody: NotifyInformItemUpdateDto = {};
          createBody.description = this.infItemSettingEditForm.description;
          createBody.status = "Y"
          this.$infNotifySettingApi.insertInformItemFistLevelUsingPOST(createBody)
            .then((resp: AxiosResponse<ReviewSubType>) => {
              MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
              this.$emit("reloadInformItem");
              console.log(resp.data.reviewSubTypeId);
            }).catch((error) => {
              ErrorModalUtil.modalError(this.$t(error.response.data.message).toString());
            })
            .finally(() => {
              LoadingUtil.close();
            })
        }
      });
    }
  }else{
    return
  }
  }
   // ============================驗證validate section start============================
  // 欄位驗證
  infItemSettingFormRules: { [key: string]: ValidationRule[] } = {
    description: [{ validator: this.validateinfItemDescription, trigger: "blur" }],
  };

  //結案表單驗證物件
  infItemSettingValidationForm: InfItemValidateForm = {
    description: { feedback: false, hoverVisible: false, msg: "" },
  
  }
  //顯示popOver的flag
  isinfItemDescriptionVisible: boolean = false;
 

   //驗證第一層項目不可大於10字且不可以為空
  validateinfItemDescription(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description,true, this.$t('visitPersonSetting_firstLevel_is_not_blank').toString(), false);//"第一層項目不可為空"
      callback(false);
    } else if (!ValidationUtil.isEmpty(value) && value.length > 10) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, true, this.$t('visitPersonSetting_firstLevel_is_not_over_10').toString(), false);//"第一層項目不可超過10字"
    }
  }

  infItemDescriptionMouseOver() {
    if (this.infItemSettingValidationForm.description.feedback) {
      this.isinfItemDescriptionVisible = true;
    } else {
      this.isinfItemDescriptionVisible = false;
    }
  }
  infItemDescriptionChange() {

    this.validateinfItemDescription(null, this.infItemSettingEditForm.description, () => { });
  
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






