import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal, TimePicker } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { NotiSettingGrid, Option, NotiSettingUpdateAndCreation, NotiSetting } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import NotiSettingUpdateFormValidateForm from "./model";
import ContinuePackStoreMoudle from "@/plugins/store/ContinuePackModule";
@Component
export default class NotiSettingUpdateForm extends Vue {

  //電訪照會碼設定表單資料傳入 B1530
  @Prop()
  public initData: NotiSettingGrid;

  @Prop() //照會主類別下拉選單
  originalNotiMajorTypeOptions: Option[];

  @Prop() //照會主類別有效下拉選單
  originalNotiMajorTypeEffectiveOptions: Option[];

  @Prop() //照會次類別下拉選單
  originalNotiMajotSubTypeOptions: Option[];

  @Prop() //照會次類別有效下拉選單
  originalNotiMajotSubTypeEffectiveOptions: Option[];

  @Prop() //銀保照會碼有效下拉選單
  originalNotiBancassuranceEffectiveOptions: Option[];

  @Prop()//狀態下拉選單
  originalNotiSettingStatusOptions: Option[];

  //實際主類別下拉選單
  notiMajorTypeSelectOptions: Option[] = [];
  //實際次類別下拉選單
  notiMajorSubTypeSelectOptions: Option[] = [];



  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];

  created(): void {
    this.reset();
    if (this.isEditing) {
      this.notiMajorTypeSelectOptions = this.originalNotiMajorTypeOptions;
      this.notiMajorSubTypeSelectOptions = this.originalNotiMajotSubTypeOptions;
    } else {
      this.notiMajorTypeSelectOptions = this.originalNotiMajorTypeEffectiveOptions;
      this.notiMajorSubTypeSelectOptions = this.originalNotiMajotSubTypeEffectiveOptions;
    }
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
    if (!ValidationUtil.isEmpty(this.initData.notiSettingId)) {

      return true
    } else {
      return false;
    }
  }

  /**
   * 編輯，電訪照會碼設定表單
   */
  reset() {

    // 塞入電訪照會碼設定表單的欄位資料
    this.notiSettingUpdateForm = {
      notiSettingId: this.initData.notiSettingId,
      notiMajorTypeId: this.initData.reviewTypeId,
      notiMajorSubTypeId: this.initData.reviewSubTypeId,
      notiDescription: this.initData.notiDescription,
      addtional: this.initData.addtional,
      notiBancassurance: this.initData.notiBancassuranceId,
      status: this.initData.status
    };
  }

   /**
   * 送出，電訪照會碼設定表單
   */
  submit() {
    (this.$refs.notiSettingUpdateForm as any).validate();

    let notiMajorTypeIdValidation: boolean = !this.notiSettingUpdateValidationForm.notiMajorTypeId.feedback? true : false;
    let notiMajorSubTypeIdValidation: boolean = !this.notiSettingUpdateValidationForm.notiMajorSubTypeId.feedback? true : false;
    let notiDescriptionValidation: boolean = !this.notiSettingUpdateValidationForm.notiDescription.feedback? true : false;
    let notiAdditionalValidation: boolean = !this.notiSettingUpdateValidationForm.addtional.feedback? true : false;
    let notiBancassuranceValidation: boolean = !this.notiSettingUpdateValidationForm.notiBancassurance.feedback? true : false;
    //送出前先進行驗證
    if(notiMajorTypeIdValidation&& notiMajorSubTypeIdValidation&&notiDescriptionValidation&&notiAdditionalValidation&&notiBancassuranceValidation){
    if (this.isEditing) {//編輯模式
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),//"確認"
        content: this.$t('global_confirm_modified?').toString(),
        onOk: () => {
          LoadingUtil.show();
          let updateBody: NotiSettingUpdateAndCreation = {};
          updateBody.notiSettingId = this.initData.notiSettingId
          updateBody.notiDescription = this.notiSettingUpdateForm.notiDescription;
          updateBody.addtional = this.notiSettingUpdateForm.addtional;
          updateBody.notiBancassuranceId = this.notiSettingUpdateForm.notiBancassurance;
          updateBody.status = this.notiSettingUpdateForm.status;
          this.$notiSettingApi.updateNotiSettingUsingPOST(updateBody)
            .then((resp: AxiosResponse<NotiSetting>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadNotiSetting");
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
          let createBody: NotiSettingUpdateAndCreation = {};
          createBody.reviewTypeId = this.notiSettingUpdateForm.notiMajorTypeId;
          createBody.reviewSubTypeId = this.notiSettingUpdateForm.notiMajorSubTypeId;
          createBody.notiDescription = this.notiSettingUpdateForm.notiDescription;
          createBody.addtional = this.notiSettingUpdateForm.addtional;
          createBody.notiBancassuranceId = this.notiSettingUpdateForm.notiBancassurance;
          this.$notiSettingApi.insertNotiSettingUsingPOST(createBody)
            .then((resp: AxiosResponse<NotiSetting>) => {
              MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
              this.$emit("reloadNotiSetting");
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


  //宣告電訪照會碼設定的欄位資料
  notiSettingUpdateForm = {
    notiSettingId: "", //電訪照會碼
    notiMajorTypeId: "", //照會主類別
    notiMajorSubTypeId: "", //照會次類別
    notiDescription: "",//電訪照會說明
    addtional: "",//電訪照會補字內容
    notiBancassurance: "",//銀保照會碼
    status: "",//狀態
  };


  // ============================驗證validate section start============================
  // 欄位驗證
  notiSettingUpdateFormRules: { [key: string]: ValidationRule[] } = {
    notiMajorTypeId: [{ validator: this.validateNotiMajorTypeId, trigger: "blur" }],
    notiMajorSubTypeId: [{ validator: this.validateNotiMajorSubTypeId, trigger: "blur" }], //照會次類別
    notiDescription: [{ validator: this.validateNotiDescription, trigger: "blur" }],//電訪照會說明
    addtional: [{ validator: this.validateAddtional, trigger: "blur" }],//電訪照會補字內容
    notiBancassurance: [{ validator: this.validateNotiBancassurance, trigger: "blur" }],//銀保照會碼
  };

    //結案表單驗證物件
    notiSettingUpdateValidationForm:  NotiSettingUpdateFormValidateForm = {
      notiMajorTypeId: { feedback: false, hoverVisible: false, msg: "" }, //照會主類別id
      notiMajorSubTypeId: { feedback: false, hoverVisible: false, msg: "" }, //照會次類別id
      notiDescription: { feedback: false, hoverVisible: false, msg: "" },//電訪照會說明
      addtional: { feedback: false, hoverVisible: false, msg: "" },//電訪照會補字內容
      notiBancassurance: { feedback: false, hoverVisible: false, msg: "" },//銀保照會碼
      status: { feedback: false, hoverVisible: false, msg: "" },//狀態
    }

     // //顯示popOver的flag
  notiMajorTypeIdVisible: boolean = false;
  notiMajorSubTypeIdVisible: boolean = false;
  notiDescriptionVisible: boolean = false;
  addtionalVisible: boolean = false;
  notiBancassuranceVisible: boolean = false;


  validateNotiMajorTypeId(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiMajorTypeId, false, "", false);
  
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiMajorTypeId, true, this.$t("notiSettingPage_notiMajorType_not_blank").toString(), false);
      callback(false);
    }
  }

  notiNotiMajorTypeIdMouseOver() {
    if (this.notiSettingUpdateValidationForm.notiMajorTypeId.feedback) {
      this. notiMajorTypeIdVisible = true;
    } else {
      this. notiMajorTypeIdVisible = false;
    }

  }
  onNotiMajorTypeIdChange() {
      this.validateNotiMajorTypeId(null, this.notiSettingUpdateForm.notiMajorTypeId, () => { });
  }
  

  validateNotiMajorSubTypeId(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiMajorSubTypeId, false, "", false);
  
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiMajorSubTypeId, true, this.$t("notiSettingPage_notiMajorSubType_not_blank").toString(), false);
      callback(false);
    }
  }

  notiNotiMajorSubTypeIdMouseOver() {
    if (this.notiSettingUpdateValidationForm.notiMajorSubTypeId.feedback) {
      this.notiMajorSubTypeIdVisible = true;
    } else {
      this.notiMajorSubTypeIdVisible = false;
    }

  }
  onNotiMajorSubTypeIdChange() {
      this.validateNotiMajorSubTypeId(null, this.notiSettingUpdateForm.notiMajorSubTypeId, () => { });
  }

  validateNotiDescription(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiDescription, false, "", false);
  
    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiDescription, true, this.$t("notiSettingPage_notiSettingDescription_not_blank").toString(), false);
      callback(false);
    }
  }

  notiNotiDescriptionMouseOver() {
    if (this.notiSettingUpdateValidationForm.notiDescription.feedback) {
      this.notiDescriptionVisible = true;
    } else {
      this.notiDescriptionVisible = false;
    }

  }
  onNotiDescriptionChange() {
      this.validateNotiDescription(null, this.notiSettingUpdateForm.notiDescription, () => { });

  }

  
validateAddtional(rule, value, callback){
  CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.addtional, false, "", false);

  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.addtional, true,this.$t("notiSettingPage_notiSettingAdditionalContent_not_blank").toString(), false);// "電訪照會補字內容不可為空"
    callback(false);
  }
}

notiAddtionalMouseOver() {
  if (this.notiSettingUpdateValidationForm.addtional.feedback) {
    this.addtionalVisible = true;
  } else {
    this.addtionalVisible = false;
  }

}
onAddtionalChange() {
    this.validateAddtional(null, this.notiSettingUpdateForm.addtional, () => { });

}


validateNotiBancassurance(rule, value, callback){
  CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiBancassurance, false, "", false);

  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiSettingUpdateValidationForm.notiBancassurance, true, this.$t("notiSettingPage_notiBancassurance_not_blank").toString(), false);//銀保照會碼不可為空
    callback(false);
  }
}

notiNotiBancassuranceMouseOver() {
  if (this.notiSettingUpdateValidationForm.notiBancassurance.feedback) {
    this.notiBancassuranceVisible = true;
  } else {
    this.notiBancassuranceVisible = false;
  }

}
onNotiBancassuranceChange() {
    this.validateNotiBancassurance(null, this.notiSettingUpdateForm.notiBancassurance, () => { });

}

  // ============================驗證validate section end============================


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







