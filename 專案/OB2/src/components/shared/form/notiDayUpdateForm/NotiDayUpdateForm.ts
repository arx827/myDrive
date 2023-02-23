import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import { Modal, TimePicker } from "ant-design-vue";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Option } from "@fubonlife/obd-api-axios-sdk";
import message from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { NotiDaySettingGrid, NotiDayUpdation, TobdNotiDay } from "@fubonlife/obd-api-axios-sdk";
import NotiDayValidateForm from "./model";


@Component
export default class NotiDayUpdateForm extends Vue {


  @Prop()
  public initData: NotiDaySettingGrid;

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
  typeDescription: string = "";
  /**
   * 編輯，會辦日期設定表單
   */
  reset() {
    // 塞入會辦日期設定表單的欄位資料
    this.notiDaySettingForm = {
      notiDayId: this.initData.notiDayId,
      type: this.initData.type,
      workingDay: this.initData.workingDay,
      remark: this.initData.remark,
    };
    this.typeDescription = this.notiDaySettingForm.type == "REMINDER" ? "催辦" : "到期";
  }

  // 送出照會日期設定異動變動
  submit() {
    (this.$refs.notiDaySettingForm as any).validate();
    let notiWorkingDayValidation: boolean = !this.notiDayValidationForm.workingDay.feedback ? true : false;
    let notiRemarkValidation: boolean = !this.notiDayValidationForm.remark.feedback ? true : false;
    if (notiWorkingDayValidation && notiRemarkValidation) {
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),//"確認"
        content: this.$t('global_confirm_modified?').toString(),//"確認修改?
        onOk: () => {
          LoadingUtil.show();
          let updateBody: NotiDayUpdation = {};
          updateBody.notiDayId = this.initData.notiDayId;
          updateBody.type = this.initData.type;
          updateBody.workingDay = this.notiDaySettingForm.workingDay;
          updateBody.remark = this.notiDaySettingForm.remark;
          this.$notifyBasicSettingApi.updateNotiDayUsingPOST(updateBody)
            .then((resp: AxiosResponse<TobdNotiDay>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadNotiDayGrid");
            }).catch(err => {
              ErrorModalUtil.modalError(this.$t("fileUpload_modify").toString() + this.$t("global_failure").toString());
            }).finally(() => {
              LoadingUtil.close();
            })
        }
      });
    } else {
      return
    }
  }

  notiDaySettingForm = {
    notiDayId: "",
    type: "",
    workingDay: null,
    remark: "",
  };
  // ============================驗證validate section start============================
  // 欄位驗證
  notiDaySettingFormRules: { [key: string]: ValidationRule[] } = {
    workingDay: [{ validator: this.validateWorkingDay, trigger: "blur" }],
    remark: [{ validator: this.validateRemark, trigger: "blur" }],
  };

  //表單驗證物件
  notiDayValidationForm: NotiDayValidateForm = {
    workingDay: { feedback: false, hoverVisible: false, msg: "" },
    remark: { feedback: false, hoverVisible: false, msg: "" },

  }
  //顯示popOver的flag
  isNotiWorkingDayVisible: boolean = false;
  isNotiRemarkVisible: boolean = false;

  //驗證工作天數
  validateWorkingDay(rule, value, callback) {

    CommonUtil.feildValidateWithVisible(this.notiDayValidationForm.workingDay, false, "", false);
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiDayValidationForm.workingDay, true, this.$t("notification_workingDay_setting_not_blank").toString(), false);
    }
  }

  notiWorkingDayMouseOver() {
    if (this.notiDayValidationForm.workingDay.feedback) {
      this.isNotiWorkingDayVisible = true;
    } else {
      this.isNotiWorkingDayVisible = false;
    }

  }
  onNotiWorkingDayChange() {
    this.validateWorkingDay(null, this.notiDaySettingForm.workingDay, () => { });
  }

  //驗證備註
  validateRemark(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiDayValidationForm.remark, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiDayValidationForm.remark, true, this.$t("notification_remark_not_blank").toString(), false);
      callback(false);
    }
  }

  notiRemarkMouseOver() {
    if (this.notiDayValidationForm.remark.feedback) {
      this.isNotiRemarkVisible = true;
    } else {
      this.isNotiRemarkVisible = false;
    }

  }

  onNotiRemarkChange() {
    this.validateRemark(null, this.notiDaySettingForm.remark, () => { });

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













