import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Option, InfSettingFirstDto, InfSettingFirstUpdateDto, InfSettingFirstUpdateDtoStatusEnum, ReviewSubTypeDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import InfItemValidateForm from "./model";
@Component
export default class InfItemSettingEditForm extends Vue {

  // 會辦項目(外部)
  @Prop()
  public initData: InfSettingFirstDto;

  // 會辦項目欄位
  infItemSettingEditForm = {
    description: "",//第一層項目
    status: "",//狀態
  };

  // 狀態(外部)
  @Prop()
  originalSelectStatusOptions: Option[];

  // 狀態(實際)
  selectStatusOptions: Option[];

  created(): void {
    this.selectStatusOptions = this.originalSelectStatusOptions;
    if (!this.isEditing) {
      this.infItemSettingEditForm.status = InfSettingFirstUpdateDtoStatusEnum.Y;
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
    if (!ValidationUtil.isEmpty(this.initData.reviewSubTypeId)) {
      return true;
    } else {
      return false;
    }
  }

  // 編輯-會辦項目第一層
  reset() {
    this.infItemSettingEditForm = {
      description: this.initData.itemDesc,
      status: this.initData.status == "Y" ? InfSettingFirstUpdateDtoStatusEnum.Y : InfSettingFirstUpdateDtoStatusEnum.L,
    };
  }

  // 送出
  submit() {

    this.validateinfItemDescription(null, this.infItemSettingEditForm.description, () => { });
    let infItemDescriptionValidation: boolean = !this.infItemSettingValidationForm.description.feedback ? true : false;

    // 欄位驗證
    if (infItemDescriptionValidation) {
      if (this.isEditing) {//編輯
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//確認
          content: this.$t('global_confirm_modified?').toString(),//確認修改?
          onOk: () => {
            LoadingUtil.show();
            let updateBody: InfSettingFirstUpdateDto = {};
            updateBody.description = this.infItemSettingEditForm.description;
            updateBody.status = this.infItemSettingEditForm.status == InfSettingFirstUpdateDtoStatusEnum.Y ? InfSettingFirstUpdateDtoStatusEnum.Y : InfSettingFirstUpdateDtoStatusEnum.L;
            this.$communicatSettingApi.updateInformItemCUsingPOST(this.initData.reviewSubTypeId, updateBody)
              .then((resp: AxiosResponse<ReviewSubTypeDto>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadInformItem");
                console.log(resp.data.reviewSubTypeId);
              })
              .catch((error) => {
                console.log(error);
                ErrorModalUtil.modalError(this.$t(error.response.data.apiErrorCode).toString());
              })
              .finally(() => {
                LoadingUtil.close();
              })
          }
        });
      } else {//新增
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//確認
          content: this.$t('global_confirm_add?').toString(),//確認新增?
          onOk: () => {
            LoadingUtil.show();
            let createBody: InfSettingFirstUpdateDto = {};
            createBody.description = this.infItemSettingEditForm.description;
            createBody.status = InfSettingFirstUpdateDtoStatusEnum.Y;
            this.$communicatSettingApi.insertInformItemCUsingPOST(createBody)
              .then((resp: AxiosResponse<ReviewSubTypeDto>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadInformItem");
                console.log(resp.data.reviewSubTypeId);
              }).catch((error) => {
                ErrorModalUtil.modalError(this.$t(error.response.data.apiErrorCode).toString());
              })
              .finally(() => {
                LoadingUtil.close();
              })
          }
        });
      }
    }
  }

  // *驗證validate*

  // 欄位驗證
  infItemSettingFormRules: { [key: string]: ValidationRule[] } = {
    description: [{ validator: this.validateinfItemDescription, trigger: "blur" }],
  };

  // 結案表單驗證物件
  infItemSettingValidationForm: InfItemValidateForm = {
    description: { feedback: false, hoverVisible: false, msg: "" },

  }

  // 顯示popOver的flag
  isinfItemDescriptionVisible: boolean = false;

  // 驗證第一層項目不可大於10字且不可以為空
  validateinfItemDescription(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, true, this.$t('visitPersonSetting_firstLevel_is_not_blank').toString(), false);//"第一層項目不可為空"
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

  // *共用驗證相關物件*

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

}