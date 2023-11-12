import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Option, InfSettingFirstDto, InfSettingFirstUpdateDto, InfSettingFirstUpdateDtoStatusEnum, ReviewSubTypeDto, InfSettingSecondDto, InfSettingSecondUpdateDto, PageOfInfSettingFirstDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import InfItemValidateForm from "./model";
@Component
export default class InfItemSecondSettingEditForm extends Vue {

    // 會辦項目
    @Prop()
    public initData: InfSettingSecondDto;

    // 狀態(外部)
    @Prop()
    originalSelectStatusOptions: Option[];

    // 會辦項目(外部)
    @Prop()
    originalFirsItemOptions: Option[];

    // 狀態(實際)
    selectStatusOptions: Option[];

    // 會辦項目(實際)
    selectFirstItemOptions: Option[];

    // 宣告會辦會辦項目設定的欄位資料
    infItemSettingEditForm = {
        itemFirst: "",
        description: "",
        content: "",
        status: InfSettingFirstUpdateDtoStatusEnum.Y,
    };

    // 欄位驗證
    infItemSettingFormRules: { [key: string]: ValidationRule[] } = {
        itemFirst: [{ validator: this.validateinfFirstItem, trigger: "blur" }],
        description: [{ validator: this.validateinfItemDescription, trigger: "blur" }],
        content: [{ validator: this.validateinfContent, trigger: "blur" }],
    };

    created(): void {
        this.selectStatusOptions = this.originalSelectStatusOptions;
        this.selectFirstItemOptions = this.originalFirsItemOptions;
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
        if (!ValidationUtil.isEmpty(this.initData.infReviewId)) {
            return true;
        } else {
            return false;
        }
    }

    // 編輯-會辦項目第二層
    reset() {
        this.infItemSettingEditForm = {
            itemFirst: this.initData.itemFirst,
            description: this.initData.description,
            content: this.initData.content,
            status: this.initData.status == 'Y' ? InfSettingFirstUpdateDtoStatusEnum.Y : InfSettingFirstUpdateDtoStatusEnum.L,
        };
    }

    // 送出
    submit() {

        this.validateinfItemDescription(null, this.infItemSettingEditForm.description, () => { });
        this.validateinfFirstItem(null, this.infItemSettingEditForm.itemFirst, () => { });
        this.validateinfContent(null, this.infItemSettingEditForm.content, () => { });
        let infItemDescriptionValidation: boolean = !this.infItemSettingValidationForm.description.feedback ? true : false;
        let infFirstItemValidation: boolean = !this.infItemSettingValidationForm.itemFirst.feedback ? true : false;
        let infContentValidation: boolean = !this.infItemSettingValidationForm.content.feedback ? true : false;

        // 欄位驗證
        if (infItemDescriptionValidation && infFirstItemValidation && infContentValidation) {
            if (this.isEditing) {//編輯
                Modal.confirm({
                    okText: this.$t('global_ok').toString(),
                    cancelText: this.$t('global_cancel').toString(),
                    title: this.$t('global_confirm').toString(),//確認
                    content: this.$t('global_confirm_modified?').toString(),//確認修改?
                    onOk: () => {
                        LoadingUtil.show();
                        let updateBody: InfSettingSecondUpdateDto = {};
                        updateBody.reviewSubTypeId = this.initData.reviewSubTypeId;
                        updateBody.description = this.infItemSettingEditForm.description;
                        updateBody.content = this.infItemSettingEditForm.content;
                        updateBody.status = this.infItemSettingEditForm.status == InfSettingFirstUpdateDtoStatusEnum.Y ? InfSettingFirstUpdateDtoStatusEnum.Y : InfSettingFirstUpdateDtoStatusEnum.L;
                        this.$communicatSettingApi.updateInformSecondItemCUsingPOST(this.initData.infReviewId, updateBody)
                            .then((resp: AxiosResponse<InfSettingSecondDto>) => {
                                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                                this.$emit("reloadInformItem");
                                console.log(resp.data.infReviewId);
                            })
                            .catch((error) => {
                                console.log(error)
                                ErrorModalUtil.modalError(this.$t(error.response.data.apiErrorCode).toString());
                            })
                            .finally(() => {
                                LoadingUtil.close();
                            })
                    }
                });
            } else {
                Modal.confirm({
                    okText: this.$t('global_ok').toString(),
                    cancelText: this.$t('global_cancel').toString(),
                    title: this.$t('global_confirm').toString(),
                    content: this.$t('global_confirm_add?').toString(),
                    onOk: () => {
                        LoadingUtil.show();
                        let createBody: InfSettingSecondUpdateDto = {};
                        createBody.reviewSubTypeId = this.infItemSettingEditForm.itemFirst;
                        createBody.description = this.infItemSettingEditForm.description;
                        createBody.content = this.infItemSettingEditForm.content;
                        createBody.status = InfSettingFirstUpdateDtoStatusEnum.Y;
                        this.$communicatSettingApi.insertInformSecondItemCUsingPOST(createBody)
                            .then((resp: AxiosResponse<InfSettingSecondDto>) => {
                                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                                this.$emit("reloadInformItem");
                                console.log(resp.data.infReviewId);
                            }).catch((error) => {
                                console.log(error);
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

    onSelectedItemChange() {
        this.validateinfFirstItem(null, this.infItemSettingValidationForm.itemFirst, () => { });
    }

    // *驗證validate*

    // 驗證共用物件
    feildValidate(fv: ValidateFormComponent, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //結案表單驗證物件
    infItemSettingValidationForm: InfItemValidateForm = {
        itemFirst: {
            hover: "",
            feedback: false,
            state: "",
            msg: "",
            hoverVisible: false
        },
        description: {
            hover: "",
            feedback: false,
            state: "",
            msg: "",
            hoverVisible: false
        },
        content: {
            hover: "",
            feedback: false,
            state: "",
            msg: "",
            hoverVisible: false
        }
    }

    // 顯示popOver的flag
    isinfItemDescriptionVisible: boolean = false;
    isinfItemContentVisible: boolean = false;
    
    validateinfFirstItem(rule, value, callback) {
        // 第一層項目不可為空
        if (!value) {
            this.feildValidate(this.infItemSettingValidationForm.itemFirst, true, "error", "hover", this.$t('visitPersonSetting_firstLevel_is_not_blank').toString())
            callback(() => { });
        } else {
            this.feildValidate(this.infItemSettingValidationForm.itemFirst, false, "success", "", "");
        }
    }

    //驗證第二層項目不可大於10字且不可以為空
    validateinfItemDescription(rule, value, callback) {
        // 窗口不可為空
        if (ValidationUtil.isEmpty(value)) {
            this.feildValidate(this.infItemSettingValidationForm.description, true, "error", "hover", this.$t('second_level_item_is_not_blank').toString())
            callback(() => { });
        } else if (!ValidationUtil.isEmpty(value) && value.length > 10) {
            this.feildValidate(this.infItemSettingValidationForm.description, true, "error", "hover", this.$t('second_level_item_is_not_over_10_words').toString())
            callback(() => { });
        } else {
            this.feildValidate(this.infItemSettingValidationForm.description, false, "success", "", "");
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

    //驗證罐頭與不可以為空
    validateinfContent(rule, value, callback) {
        // 罐頭與不可為空
        if (!value) {
            this.feildValidate(this.infItemSettingValidationForm.content, true, "error", "hover", this.$t('content_is_not_blank').toString())
            callback(() => { });
        } else {
            this.feildValidate(this.infItemSettingValidationForm.content, false, "success", "", "");
        }
    }

    infItemContentMouseOver() {
        if (this.infItemSettingValidationForm.content.feedback) {
            this.isinfItemContentVisible = true;
        } else {
            this.isinfItemContentVisible = false;
        }
    }
    infItemContentChange() {
        this.validateinfContent(null, this.infItemSettingEditForm.content, () => { });
    }

    // *共用驗證相關物件*

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