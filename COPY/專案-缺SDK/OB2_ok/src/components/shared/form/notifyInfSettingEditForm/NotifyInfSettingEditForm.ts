import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Option, NotifyInformItemUpdateDto, NotifyInformSettingGrid, InfSetting } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import InfItemValidateForm from "../notifyInfItemSettingEditForm/model";


//會辦第二層項目編輯和新增視窗

@Component
export default class InfISettingEditForm extends Vue {

  //會辦項目設定表單資料由外部傳入
  @Prop()
  public initData: NotifyInformSettingGrid;

  //狀態，下拉式表單由外部傳來
  @Prop()
  originalSelectStatusOptions: Option[];

  @Prop()//外部傳進來會辦項目第一層
  originalInfItemOptions: Option[];

  // 實際表單綁定的會辦項目第一層下拉選單
  selectInfItemOptions: Option[] = [];

  // =============================第一層會辦項目

  //當會辦第一層改變時
  onSelectInfItem() {
  }

  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input) >= 0
    );
  }


  //狀態，實際綁定的下拉選單
  selectStatusOptions: Option[];
  created(): void {
    this.selectStatusOptions = this.originalSelectStatusOptions;
    this.selectInfItemOptions = this.originalInfItemOptions;
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
    if (!ValidationUtil.isEmpty(this.initData.infSettingId)) {
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
      majorSubTypeId: this.initData.majorSubTypeId,
      majorSubTypeDescription: this.initData.majorSubTypeDescription,
      infSettingId: this.initData.infSettingId,
      description: this.initData.description,
      content: this.initData.content,
      status: this.initData.status == "Y" ? "Y" : "N",
    };
  }

  // 送出
  submit() {
    (this.$refs.infSettingForm as any).validate();
    let majorSubTypeIdValidation: boolean = !this.infItemSettingValidationForm.majorSubTypeId.feedback ? true : false;
    let infSettingIdValidation: boolean = !this.infItemSettingValidationForm.description.feedback ? true : false;
    let contentValidation: boolean = !this.infItemSettingValidationForm.content.feedback ? true : false;

    if (majorSubTypeIdValidation&&infSettingIdValidation&&contentValidation) {//驗證過才能進入新增或編輯模式
      if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_modified?').toString(),//"確認修改?
          onOk: () => {
            LoadingUtil.show();
            let updateBody: NotifyInformItemUpdateDto = {};
            //設定會辦項目第一層id
            updateBody.reviewSubTypeId = this.initData.majorSubTypeId;

            //設定會辦項目第二層敘述以及id
            updateBody.infSettingDescription = this.infItemSettingEditForm.description;
            updateBody.infSettingId = this.infItemSettingEditForm.infSettingId;
            //設定罐頭語
            updateBody.content = this.infItemSettingEditForm.content;
            updateBody.status = this.infItemSettingEditForm.status == "Y" ? "Y" : "L";
            this.$infNotifySettingApi.updateInformSettingUsingPOST(updateBody)
              .then((resp: AxiosResponse<InfSetting>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadInfSetting");
                console.log(resp.data.infReviewId);
              }).catch((error) => { ErrorModalUtil.modalError(this.$t(error.response.data.message).toString())})
              .finally(() => {
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
            let createdBody: NotifyInformItemUpdateDto = {};
            //設定會辦項目第一層id
            createdBody.reviewSubTypeId = this.infItemSettingEditForm.majorSubTypeId;

            //設定會辦項目第二層敘述以及id
            createdBody.infSettingDescription = this.infItemSettingEditForm.description;

            //設定罐頭語
            createdBody.content = this.infItemSettingEditForm.content;

            this.$infNotifySettingApi.insertInformSettingUsingPOST(createdBody)
              .then((resp: AxiosResponse<InfSetting>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadInfSetting");
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
    } else {
      return //如驗證失敗擇跳回去
    }
  }

  //宣告會辦會辦項目設定的欄位資料
  infItemSettingEditForm = {
    majorSubTypeId: "",//第一層項目id
    majorSubTypeDescription: "",//第一層項目敘述
    infSettingId: "",//第二層項目id
    description: "",//第二層項目敘述
    content: "",//罐頭語
    status: "",//狀態
  };
  // ============================驗證validate section start============================
  // 欄位驗證
  infItemSettingFormRules: { [key: string]: ValidationRule[] } = {
    majorSubTypeId: [{ validator: this.validateinfItemId, trigger: "blur" }],//第一層項目id驗證
    description: [{ validator: this.validateInfSettingId, trigger: "blur" }],//第二層項目id驗證
    content: [{ validator: this.validateContent, trigger: "blur" }],//罐頭語驗證
  };

  //結案表單驗證物件
  infItemSettingValidationForm: InfItemValidateForm = {
    majorSubTypeId: { feedback: false, hoverVisible: false, msg: "" },
    description: { feedback: false, hoverVisible: false, msg: "" },
    content: { feedback: false, hoverVisible: false, msg: "" },
  }
  //顯示popOver的flag
  isMajorSubTypeIdVisible: boolean = false;
  isInfSettingIdVisible: boolean = false;
  isContentVisible: boolean = false;

  //驗證第一層項目
  validateinfItemId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.majorSubTypeId, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.majorSubTypeId, true, this.$t('visitPersonSetting_firstLevel_is_not_blank').toString(), false);//"第一層項目不可為空"
      callback(false);
    } else if (!ValidationUtil.isEmpty(value) && value.length > 10) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.majorSubTypeId, true, this.$t('visitPersonSetting_firstLevel_is_not_over_10').toString(), false);//"第一層項目不可超過10字"
      callback(false);
    } else {
      callback();
    }
  }

  infItemIdMouseOver() {
    if (this.infItemSettingValidationForm.majorSubTypeId.feedback) {
      this.isMajorSubTypeIdVisible = true;
    } else {
      this.isMajorSubTypeIdVisible = false;
    }
  }
  infItemIdChange() {

    this.validateinfItemId(null, this.infItemSettingEditForm.majorSubTypeId, () => { });

  }



  //驗證第二層項目

  validateInfSettingId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, true, this.$t('second_level_item_is_not_blank').toString(), false);//"第二層項目不可為空"
      callback(false);
    } else if (!ValidationUtil.isEmpty(value) && value.length > 20) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.description, true, this.$t('second_level_item_is_not_over_10_words').toString(), false);//"第二層項目不可超過10字"
      callback(false);
    } else {
      callback();
    }
  }

  infSettingIdMouseOver() {
    if (this.infItemSettingValidationForm.description.feedback) {
      this.isInfSettingIdVisible = true;
    } else {
      this.isInfSettingIdVisible = false;
    }
  }

  onInfSettingIdChange() {
    this.validateInfSettingId(null, this.infItemSettingEditForm.infSettingId, () => { });
  }

  //驗證罐頭語
  validateContent(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.content, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.content, true,  this.$t('content_is_not_blank').toString(), false);//"罐頭語不可為空
      callback(false);
    } else if (!ValidationUtil.isEmpty(value) && value.length > 100) {
      CommonUtil.feildValidateWithVisible(this.infItemSettingValidationForm.content, true,  this.$t('content_not_over_200_words').toString(), false);//"罐頭語不可超過200字
      callback(false);
    } else {
      callback();
    }
  }

  contentMouseOver() {
    if (this.infItemSettingValidationForm.content.feedback) {
      this.isContentVisible = true;
    } else {
      this.isContentVisible = false;
    }
  }

  onContentChange() {

    this.validateContent(null,this.infItemSettingEditForm.content,()=>{});
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






