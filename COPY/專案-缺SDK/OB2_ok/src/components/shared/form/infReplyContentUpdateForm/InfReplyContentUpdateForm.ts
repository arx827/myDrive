import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal, TimePicker } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { InfInfoReplyContent, InfReplyContentSettingGrid, Option } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import InfReplyContentValidateForm from "./model";
import ContinuePackStoreMoudle from "@/plugins/store/ContinuePackModule";
@Component
export default class InfReplyContentUpdateForm extends Vue {

  //會辦日期設定表單資料傳入
  @Prop()
  public initData: InfReplyContentSettingGrid;

  //宣告會辦日期設定的欄位資料
  infReplyContentSettingForm = {
    infType: "",
    content: "",
    sort: null,
    status: "",
  };
  //會辦類型，下拉式表單
  infTypeOptions: Option[] = [];

  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];
  created(): void {

    // 會辦類別下拉選單
    this.$reviewedSettingApi.getAllReviewTypeUsingGET1()
      .then((resp) => {
        resp.data.forEach((reviewType) => {
          if (reviewType.type == "INF") {
            this.infTypeOptions.push({ label: reviewType.description, value: reviewType.reviewTypeId })
          }
        })
      }).catch((err) => {//取得覆核主類型下拉選單失敗
        ErrorModalUtil.modalError("取得會辦類型下拉選單失敗")
      })

    this.$commonApi.findByTypeIdUsingGET("status")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectStatusOptions = res.data;
        if (!this.isEditing) {
          this.infReplyContentSettingForm.status = "Y";
          this.infReplyContentSettingForm.sort=1;
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
    if (!ValidationUtil.isEmpty(this.initData.infInfoReplyContentId)) {

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
    this.infReplyContentSettingForm = {
      infType: this.initData.infTypeId,
      content: this.initData.content,
      sort: this.initData.sort,
      status: this.initData.status,
    };


  }

  // 送出罐頭語
  submit() {

    this.validateInfTypeId(null, this.infReplyContentSettingForm.infType, () => { });
    this.validateContent(null, this.infReplyContentSettingForm.content, () => { });
    this.validateSort(null, this.infReplyContentSettingForm.sort, () => { });
    this.validateStatus(null, this.infReplyContentSettingForm.status, () => { });
    let infTypeIdValidation: boolean = !this.infReplyContentValidationForm.infType.feedback ? true : false;
    let contentValidation: boolean = !this.infReplyContentValidationForm.content.feedback ? true : false;
    let sortValidation: boolean = !this.infReplyContentValidationForm.sort.feedback ? true : false;
    let statusValidation: boolean = !this.infReplyContentValidationForm.status.feedback ? true : false;
    if (infTypeIdValidation && contentValidation && sortValidation && statusValidation) {//驗證過才進行編輯和新增
      if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: "確認",
          content: "確認修改?",
          onOk: () => {
            LoadingUtil.show();
            let updateBody: InfReplyContentSettingGrid = {};
            updateBody.infInfoReplyContentId = this.initData.infInfoReplyContentId;
            updateBody.content = this.infReplyContentSettingForm.content;
            updateBody.sort = this.infReplyContentSettingForm.sort;
            updateBody.status = this.infReplyContentSettingForm.status;
            this.$informBasicSettingApi.updateInformReplyContentUsingPOST(updateBody)
              .then((resp: AxiosResponse<InfInfoReplyContent>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadInfoReplyContent");
              }).catch(err => {
                ErrorModalUtil.modalError(this.$t("修改失敗").toString());
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      } else {
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: "確認",
          content: "確認新增?",
          onOk: () => {
            LoadingUtil.show();
            let createBody: InfInfoReplyContent = {};
            createBody.infTypeId = this.infReplyContentSettingForm.infType;
            createBody.content = this.infReplyContentSettingForm.content;
            createBody.sort = this.infReplyContentSettingForm.sort;
            createBody.status = this.infReplyContentSettingForm.status;
            this.$informBasicSettingApi.insertInformReplyContentUsingPOST(createBody)
              .then((resp: AxiosResponse<InfInfoReplyContent>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadInfoReplyContent");
              }).catch(err => {
                ErrorModalUtil.modalError(this.$t("global_addtFailure").toString());
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      }
    } else {
      return
    }
  }

  // ============================驗證validate section start============================
  // 欄位驗證
  infReplyContentSettingFormRules: { [key: string]: ValidationRule[] } = {
    infType: [{ validator: this.validateInfTypeId, trigger: "blur" }],
    content: [{ validator: this.validateContent, trigger: "blur" }],
    sort: [{ validator: this.validateSort, trigger: "blur" }],
    status: [{ validator: this.validateStatus, trigger: "blur" }],
  };

  //結案表單驗證物件
  infReplyContentValidationForm: InfReplyContentValidateForm = {
    infType: { feedback: false, hoverVisible: false, msg: "" },
    content: { feedback: false, hoverVisible: false, msg: "" },
    sort: { feedback: false, hoverVisible: false, msg: "" },
    status: { feedback: false, hoverVisible: false, msg: "" },
  }
  //顯示popOver的flag
  isInfTypeIdVisible: boolean = false;
  isInfContentVisible: boolean = false;
  isInfSortVisible: boolean = false;
  isInfStatusVisible: boolean = false;


  //驗證會辦類型
  validateInfTypeId(rule, value, callback) {
    
    CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.infType, false, "", false);
    //會辦類型必填
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.infType, true, this.$t("infCom_infTypeRequired").toString(), false);
    }
  }

  infInfTypeIdMouseOver() {
    if (this.infReplyContentValidationForm.infType.feedback) {
      this.isInfTypeIdVisible = true;
    } else {
      this.isInfTypeIdVisible = false;
    }

  }

  onInfTypeIdChange() {
      
      this.validateInfTypeId(null, this.infReplyContentSettingForm.infType, () => { });
    
  }

  //驗證內容不可大於50字請不可以為空
  validateContent(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.content, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.content, true, this.$t("custMark_contentRequired").toString(), false);
      callback(false);
    } else if (!ValidationUtil.isEmpty(value) && value.length > 50) {
      CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.content, true, this.$t("conent_not_over_50").toString(), false);
    }
  }

  infReplyContentMouseOver() {
    if (this.infReplyContentValidationForm.content.feedback) {
      this.isInfContentVisible = true;
    } else {
      this.isInfContentVisible = false;
    }

  }

  onReplyContentChange() {

      this.validateContent(null, this.infReplyContentSettingForm.content, () => { });
    
  }

  //驗證選單排序
  validateSort(rule, value, callback) {

    CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.sort, false, "", false);
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.sort, true, this.$t("sort_is_not_blank").toString(), false);
    }
  }

  infSortMouseOver() {
    if (this.infReplyContentValidationForm.sort.feedback) {
      this.isInfSortVisible = true;
    } else {
      this.isInfSortVisible = false;
    }

  }

  onInfSortChange() {
   
      this.validateSort(null, this.infReplyContentSettingForm.sort, () => { });
  
  }

  //驗證狀態

  validateStatus(rule, value, callback) {

    CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.status, false, "", false);
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infReplyContentValidationForm.status, true, this.$t("commonCode_statusRequired").toString(), false);
    }
  }

  infStatusMouseOver() {
    if (this.infReplyContentValidationForm.status.feedback) {
      this.isInfStatusVisible = true;
    } else {
      this.isInfStatusVisible = false;
    }

  }

  onStatusChange() {
   
      this.validateStatus(null, this.infReplyContentSettingForm.status, () => { });
    
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




