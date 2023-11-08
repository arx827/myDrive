import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { TobdNotiReplyContent, NotiReplyContentGrid, Option } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import NotiReplyContentValidateForm from "./model";

@Component
export default class NotiReplyContentUpdateForm extends Vue {

  //初始照會回覆罐頭語編輯資料
  @Prop()
  public initData: NotiReplyContentGrid;


  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];
  created(): void {

    this.$commonApi.findByTypeIdUsingGET("status")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectStatusOptions = res.data;
        if (!this.isEditing) {
          this.notiReplyContentSettingForm.status = "Y";
          this.notiReplyContentSettingForm.sort=1;
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
    if (!ValidationUtil.isEmpty(this.initData.notiReplyContentId)) {
      return true
    } else {
      return false;
    }
  }

  reset() {
    this.notiReplyContentSettingForm = {
      notiReplyContentId: this.initData.notiReplyContentId,
      content: this.initData.content,
      sort: this.initData.sortNo,
      status: this.initData.status,
    };
  }

  // 送出罐頭語
  submit() {
      (this.$refs.notiReplyContentSettingForm as any).validate();

      let notiContentValidation: boolean = !this.notiReplyContentValidationForm.content.feedback? true : false;
      let notiSortValidation: boolean = !this.notiReplyContentValidationForm.content.feedback? true : false;
      if(notiContentValidation&&notiSortValidation){
      if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_modified?').toString(),//"確認修改?
          onOk: () => {
            LoadingUtil.show();
            let updateBody: NotiReplyContentGrid = {};
            updateBody.notiReplyContentId = this.initData.notiReplyContentId;
            updateBody.content = this.notiReplyContentSettingForm.content;
            updateBody.sortNo = this.notiReplyContentSettingForm.sort;
            updateBody.status = this.notiReplyContentSettingForm.status;
            this.$notifyBasicSettingApi.updateNotiReplyContentUsingPOST(updateBody)
              .then((resp: AxiosResponse<TobdNotiReplyContent>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadNotiReplyContent");
              }).catch(err =>console.log(err)).finally(() => {
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
            let createBody: TobdNotiReplyContent = {};
            createBody.content = this.notiReplyContentSettingForm.content;
            createBody.sortNo = this.notiReplyContentSettingForm.sort;
            this.$notifyBasicSettingApi.insertNotiReplyContentUsingPOST(createBody)
              .then((resp: AxiosResponse<TobdNotiReplyContent>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadNotiReplyContent");
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
  
  notiReplyContentSettingForm = {
    notiReplyContentId: "",
    content: "",
    sort: null,
    status: "",
  };
  
  // ============================驗證validate section start============================
  // 欄位驗證
notiReplyContentSettingFormRules: { [key: string]: ValidationRule[] } = {
  content: [{ validator: this.validateContent, trigger: "blur" }],
  sort: [{ validator: this.validateSort, trigger: "blur" }],
};

//結案表單驗證物件
notiReplyContentValidationForm: NotiReplyContentValidateForm = {
  content: { feedback: false, hoverVisible: false, msg: "" },
  sort: { feedback: false, hoverVisible: false, msg: "" },
}
//顯示popOver的flag
isNotiContentVisible: boolean = false;
isNotiSortVisible: boolean = false;
isNotiStatusVisible: boolean = false;


//驗證內容不可大於50字請不可以為空
validateContent(rule, value, callback) {
  CommonUtil.feildValidateWithVisible(this.notiReplyContentValidationForm.content, false, "", false);

  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiReplyContentValidationForm.content, true, this.$t("custMark_contentRequired").toString(), false);
    callback(false);
  } else if (!ValidationUtil.isEmpty(value) && value.length > 50) {
    CommonUtil.feildValidateWithVisible(this.notiReplyContentValidationForm.content, true, this.$t("conent_not_over_50").toString(), false);
  }
}

infReplyContentMouseOver() {
  if (this.notiReplyContentValidationForm.content.feedback) {
    this.isNotiContentVisible = true;
  } else {
    this.isNotiContentVisible = false;
  }

}

onReplyContentChange() {

    this.validateContent(null, this.notiReplyContentSettingForm.content, () => { });
  
}

//驗證選單排序
validateSort(rule, value, callback) {

  CommonUtil.feildValidateWithVisible(this.notiReplyContentValidationForm.sort, false, "", false);
  if (ValidationUtil.isEmpty(value)) {
    CommonUtil.feildValidateWithVisible(this.notiReplyContentValidationForm.sort, true, this.$t("sort_is_not_blank").toString(), false);
  }
}

notiSortMouseOver() {
  if (this.notiReplyContentValidationForm.sort.feedback) {
    this.isNotiSortVisible = true;
  } else {
    this.isNotiSortVisible = false;
  }

}

onNotiSortChange() {
 
    this.validateSort(null, this.notiReplyContentSettingForm.sort, () => { });

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




