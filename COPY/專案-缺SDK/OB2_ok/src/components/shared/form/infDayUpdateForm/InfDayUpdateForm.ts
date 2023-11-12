import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import { Modal, TimePicker } from "ant-design-vue";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Option } from "@fubonlife/obd-api-axios-sdk";
import message from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";

import { RoleSettingValidateObject } from "@/pages/roleSetting/model";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { PageOfInfDaySettingGrid, InformBasicSettingUpdateDto, InfDaySettingGrid, InfDay, InfEmailTemplateSettingGrid, PageOfInfEmailTemplateSettingGrid, InfReplyContentSettingGrid, PageOfInfReplyContentSettingGrid } from "@fubonlife/obd-api-axios-sdk";
@Component
export default class InfDayUpdateForm extends Vue {

  //會辦日期設定表單資料傳入
  @Prop()
  public initData: InfDaySettingGrid;

  //宣告會辦日期設定的欄位資料
  infDaySettingForm = {
    infType: "",
    type: "",
    workingDay: null,
    remark: "",
  };


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

  /**
   * 編輯，會辦日期設定表單
   */
  reset() {
    // 塞入會辦日期設定表單的欄位資料
    this.infDaySettingForm = {
      infType: this.initData.infType,
      type: this.initData.type,
      workingDay: this.initData.workingDay,
      remark: this.initData.remark,
    };
  }

  // 送出會辦日期設定異動變動
  submit() {
    this.validateRemark(null, this.infDaySettingForm.remark, () => { })
    this.validateWorkDay(null, this.infDaySettingForm.workingDay, () => { });
    let remarkValidation: boolean = this.infDayValidationForm.remark.state == "success" ? true : false;
    let workingDayValidation: boolean = this.infDayValidationForm.workingDay.state == "success" ? true : false;
    if (remarkValidation && workingDayValidation) {

      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: "確認",
        content: "確認修改?",
        onOk: () => {
          LoadingUtil.show();
          let updateBody: InformBasicSettingUpdateDto = {};
          updateBody.infDayId = this.initData.infDayId;
          updateBody.workingDay = this.infDaySettingForm.workingDay;
          updateBody.remark = this.infDaySettingForm.remark;
          this.$informBasicSettingApi.updateInformDayUsingPOST(updateBody)
            .then((resp: AxiosResponse<InfDay>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadInfDayGrid");
            }).catch(err => {
              ErrorModalUtil.modalError(this.$t("fileUpload_modify").toString()+this.$t("global_failure").toString());
            }).finally(() => {
              LoadingUtil.close();
            })
        }
      });
    } else {
      return

    }
  }

  // ============================驗證validate section start============================
  infDayValidationForm = {
    workingDay: {
      feedback: false,
      state: "",
      hover: "",
      content: "",
    },
    remark: {
      feedback: false,
      state: "",
      hover: "",
      content: "",
    }
  }
  //顯示popOver的flag
  isInfDayRemarkVisible: boolean = false;

  //顯示popOver的flag
  isInfDayWorkingVisible: boolean = false;
  /**
* 會辦日期設定remark不可超過100字。
* @param rule 驗證規則 
* @param value textArea輸入值
* @param callback 回乎函數，不帶參數表示驗證成功。
* @returns 
*/
  validateRemark(rule, value, callback) {

    this.infDayValidationForm.remark.feedback = true;
    this.infDayValidationForm.remark.hover = "";
    if (ValidationUtil.isEmpty(value)) {
      this.infDayValidationForm.remark.feedback = true;
      this.infDayValidationForm.remark.state = "error";
      this.infDayValidationForm.remark.hover = "hover";
      this.infDayValidationForm.remark.content =this.$t("remarkIsnotBlank").toString();
    } else if (!ValidationUtil.isEmpty(value) && value.length > 100) {
      this.infDayValidationForm.remark.content = this.$t("remarkIsnotOVer100").toString();
      this.infDayValidationForm.remark.hover = "hover";
      this.infDayValidationForm.remark.state = "error";
      this.infDayValidationForm.remark.feedback = true;
      callback(false);
    } else {
      this.infDayValidationForm.remark.feedback = false;
      this.infDayValidationForm.remark.state = "success";
    }
  }

  infDayRemarkMouseOver() {
    if (this.infDayValidationForm.remark.state == "error") {
      this.isInfDayRemarkVisible = true;
    } else {
      this.isInfDayRemarkVisible = false;
    }

  }
  onRemarkChange() {
   
      this.validateRemark(null, this.infDaySettingForm.remark, () => { });
    
  }


  /**
  * 會辦工作天數設定不可為空。
  * @param rule 驗證規則 
  * @param value input輸入值
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateWorkDay(rule, value, callback) {

    this.infDayValidationForm.workingDay.feedback = true;
    this.infDayValidationForm.workingDay.hover = "";
    if (!ValidationUtil.isEmpty(value)) {
      this.infDayValidationForm.workingDay.feedback = false;
      this.infDayValidationForm.workingDay.state = "success";
    } else {
      this.infDayValidationForm.workingDay.feedback = true;
      this.infDayValidationForm.workingDay.state = "error";
      this.infDayValidationForm.workingDay.hover = "hover";
      this.infDayValidationForm.workingDay.content = this.$t("workDayisNotBlanck").toString();
    }
  }

  infDayWorkingDayMouseOver() {
    if (this.infDayValidationForm.workingDay.state == "error") {
      this.isInfDayWorkingVisible = true;
    } else {
      this.isInfDayWorkingVisible = false;
    }

  }

  onWorkingDayChange() {
    
      this.validateWorkDay(null, this.infDaySettingForm.workingDay, () => { });
    
  }






}




