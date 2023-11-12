import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { TeleResultConfigDto, TeleResultConfigUpdateDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ValidateInput from "@/components/shared/validateInput/ValidateInput.vue";

@Component({
    components: { ValidateInput }
})
export default class TeleResultConfigEditForm extends Vue {

    @Prop()
    public initData;

    @Prop()
    public taskOptions;

    @Prop()
    public selectEngOptionsChild;

    @Prop()
    public selectChineseOptionsChild;

    @Prop()
    public selectStatusOptionsChild;

    @Prop()
    public contactResultOptions;

    @Prop()
    public teleResultOptions;

    @Prop()
    public caseClosedReasonOptions;

    @Prop()
    public hostCorrespondOptions;

    @Prop()
    public completeTeleOptions;

    // 是否編輯
    isEdited: boolean = false;

    //是否為編輯
    isEdit: boolean = false;

    // 回寫AS400是否必填
    // isAs400Required: boolean = false;

    // 回寫AS400欄位是否無效
    isAs400Disabled: boolean = true;

    // 回寫主機對應值是否必填
    ishostCorrespondRequired: boolean = false;

    // 欄位
    teleResultConfigForm: TeleResultConfigDto = {
        teleResultConfigId: null,
        taskId: null,
        contactResultId: null,
        teleResultId: null,
        caseClosedReasonId: null,
        notification: 'N',
        inform: 'N',
        sendInterestLetter: 'N',
        validPolicy: 'N',
        completeTele: 'N',
        returnAs400: 'N',
        hostCorrespond: null,
        status: 'Y',
        createId: null,
        createName: null,
        createDate: null,
        updateId: null,
        updateName: null,
        updateDate: null,
    }

    // 欄位驗證規則(新增/編輯)
    teleResultConfigFormRules: { [key: string]: ValidationRule[] } = {
        teleResultConfigId: [{ validator: this.validateTeleResultConfigId, trigger: "blur" }],
        taskId: [{ validator: this.validateTaskId, trigger: "blur" }],
        contactResultId: [{ validator: this.validateContactResultId, trigger: "blur" }],
        teleResultId: [{ validator: this.validateTeleResultId, trigger: "blur" }],
        notification: [{ validator: this.validateNotification, trigger: "blur" }],
        inform: [{ validator: this.validateInform, trigger: "blur" }],
        sendInterestLetter: [{ validator: this.validateSendInterestLetter, trigger: "blur" }],
        validPolicy: [{ validator: this.validateValidPolicy, trigger: "blur" }],
        completeTele: [{ validator: this.validateCompleteTele, trigger: "blur" }],
        returnAs400: [{ validator: this.validateReturnAs400, trigger: "blur" }],
        hostCorrespond: [{ validator: this.validateHostCorrespond, trigger: "blur" }],
        status: [{ validator: this.validateStatus, trigger: "blur" }],
    };

    // (validate) teleResultConfigId欄位驗證提示工具
    teleResultConfigIdFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) taskId欄位驗證提示工具
    taskIdFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) contactResultId欄位驗證提示工具
    contactResultIdFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) teleResultId欄位驗證提示工具
    teleResultIdFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) notification欄位驗證提示工具
    notificationFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) inform欄位驗證提示工具
    informFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) sendInterestLetter欄位驗證提示工具
    sendInterestLetterFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) validPolicy欄位驗證提示工具
    validPolicyFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) completeTele欄位驗證提示工具
    completeTeleFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) returnAs400欄位驗證提示工具
    returnAs400FeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) hostCorrespond欄位驗證提示工具
    hostCorrespondFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) status欄位驗證提示工具
    statusFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    created() {
        this.reset();
    }

    //表單送出前的驗證
    validateSubmit() {
        var validate = true;
        this.validateTeleResultConfigId(null, this.teleResultConfigForm.teleResultConfigId, () => {
            if (this.teleResultConfigIdFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateTaskId(null, this.teleResultConfigForm.taskId, () => {
            if (this.taskIdFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateContactResultId(null, this.teleResultConfigForm.contactResultId, () => {
            if (this.contactResultIdFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateTeleResultId(null, this.teleResultConfigForm.teleResultId, () => {
            if (this.teleResultIdFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateNotification(null, this.teleResultConfigForm.notification, () => {
            if (this.notificationFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateInform(null, this.teleResultConfigForm.inform, () => {
            if (this.informFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateSendInterestLetter(null, this.teleResultConfigForm.sendInterestLetter, () => {
            if (this.sendInterestLetterFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateValidPolicy(null, this.teleResultConfigForm.validPolicy, () => {
            if (this.validPolicyFeildValidation.feedback) {
                validate = false;
            }
        });
        this.validateCompleteTele(null, this.teleResultConfigForm.completeTele, () => {
            if (this.completeTeleFeildValidation.feedback) {
                validate = false;
            }
        });
        if (!this.teleResultConfigForm.teleResultId) {
            this.validateReturnAs400(null, this.teleResultConfigForm.returnAs400, () => {
                if (this.returnAs400FeildValidation.feedback) {
                    validate = false;
                }
            });
        }
        if (this.teleResultConfigForm.returnAs400 == 'Y') {
            this.validateHostCorrespond(null, this.teleResultConfigForm.hostCorrespond, () => {
                if (this.hostCorrespondFeildValidation.feedback) {
                    validate = false;
                }
            });
        }
        this.validateStatus(null, this.teleResultConfigForm.status, () => {
            if (this.statusFeildValidation.feedback) {
                validate = false;
            }
        });
        return validate;
    }

    /**
     * 監聽initData資料變動
     * @returns 
     */
    @Watch("initData")
    onInitDataChanged(): void {
        this.reset();
    }

    // 監聽回寫AS400是否必填
    @Watch("teleResultConfigForm.caseClosedReasonId")
    isRequired400(): void {
        if (ValidationUtil.isEmpty(this.teleResultConfigForm.caseClosedReasonId)) {
            this.teleResultConfigForm.returnAs400 = 'N';
            this.isAs400Disabled = true;
        } else {
            // this.isAs400Required = true;
            this.isAs400Disabled = false;
        }
    }

    // 監聽回寫主機對應值是否必填
    @Watch("teleResultConfigForm.returnAs400")
    isRequiredHostCorrespond(): void {
        if (this.teleResultConfigForm.returnAs400 === 'Y') {
            this.ishostCorrespondRequired = true;
        } else {
            this.teleResultConfigForm.hostCorrespond = "";
            this.ishostCorrespondRequired = false;
        }
    }

    //新增/編輯表單送出
    onFormSubmit() {
        if (this.validateSubmit()) {
            let hasError = false;
            if (ValidationUtil.isEmpty(this.initData.teleResultConfigId)) {
                LoadingUtil.show();
                let insert: TeleResultConfigUpdateDto = {
                    teleResultConfigId: this.teleResultConfigForm.teleResultConfigId,
                    taskId: this.teleResultConfigForm.taskId,
                    contactResultId: this.teleResultConfigForm.contactResultId,
                    teleResultId: this.teleResultConfigForm.teleResultId,
                    caseClosedReasonId: this.teleResultConfigForm.caseClosedReasonId,
                    notification: this.teleResultConfigForm.notification,
                    inform: this.teleResultConfigForm.inform,
                    sendInterestLetter: this.teleResultConfigForm.sendInterestLetter,
                    validPolicy: this.teleResultConfigForm.validPolicy,
                    completeTele: this.teleResultConfigForm.completeTele,
                    returnAs400: this.teleResultConfigForm.returnAs400,
                    hostCorrespond: this.teleResultConfigForm.hostCorrespond,
                    status: this.teleResultConfigForm.status,
                }
                this.$teleResultConfigApi.insertTeleResultConfigUsingPOST(insert)
                    .then(() => {
                        // 新增成功
                        MessageUtil.messageSuccess(this.$t('global_addSuccess').toString());
                    }).catch((err) => {
                        // 新增失敗訊息
                        ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());
                        hasError = true;
                    }).finally(() => {
                        LoadingUtil.close();
                        if (!hasError) {
                            this.$emit("reloadData");
                        }
                    })
            } else {
                LoadingUtil.show();
                let updates: TeleResultConfigUpdateDto = {
                    teleResultConfigId: this.teleResultConfigForm.teleResultConfigId,
                    taskId: this.teleResultConfigForm.taskId,
                    contactResultId: this.teleResultConfigForm.contactResultId,
                    teleResultId: this.teleResultConfigForm.teleResultId,
                    caseClosedReasonId: this.teleResultConfigForm.caseClosedReasonId,
                    notification: this.teleResultConfigForm.notification,
                    inform: this.teleResultConfigForm.inform,
                    sendInterestLetter: this.teleResultConfigForm.sendInterestLetter,
                    validPolicy: this.teleResultConfigForm.validPolicy,
                    completeTele: this.teleResultConfigForm.completeTele,
                    returnAs400: this.teleResultConfigForm.returnAs400,
                    hostCorrespond: this.teleResultConfigForm.hostCorrespond,
                    status: this.teleResultConfigForm.status,
                }
                this.$teleResultConfigApi.updateTeleResultConfigUsingPOST(updates)
                    .then(() => {
                        // 修改成功
                        MessageUtil.messageSuccess(this.$t('shiftS_updateSuccessed').toString());
                    }).catch((err) => {
                        // 修改失敗
                        ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());
                        hasError = true;
                    }).finally(() => {
                        LoadingUtil.close();
                        if (!hasError) {
                            this.$emit("reloadData");
                        }
                    })
            }
        }
    }

    // 重設表單
    reset() {

        // 清除表單檢核值
        CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.taskIdFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.contactResultIdFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.teleResultIdFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.notificationFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.informFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.sendInterestLetterFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.validPolicyFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.completeTeleFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.returnAs400FeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.hostCorrespondFeildValidation, false, "", false);
        CommonUtil.feildValidateWithVisible(this.statusFeildValidation, false, "", false);

        if (ValidationUtil.isEmpty(this.initData.teleResultConfigId)) {
            this.isEdit = false;
            this.isEdited = true;
            this.teleResultConfigForm = {
                teleResultConfigId: null,
                taskId: null,
                contactResultId: null,
                teleResultId: null,
                caseClosedReasonId: null,
                notification: 'N',
                inform: 'N',
                sendInterestLetter: 'N',
                validPolicy: 'N',
                completeTele: 'N',
                returnAs400: 'N',
                hostCorrespond: null,
                status: 'Y',
                createId: null,
                createName: null,
                createDate: null,
                updateId: null,
                updateName: null,
                updateDate: null,
            };
        } else {
            this.isEdit = true;
            this.isEdited = false;
            this.teleResultConfigForm = {
                teleResultConfigId: this.initData.teleResultConfigId,
                taskId: this.initData.taskId,
                contactResultId: this.initData.contactResultId,
                teleResultId: this.initData.teleResultId,
                caseClosedReasonId: this.initData.caseClosedReasonId,
                notification: this.initData.notification,
                inform: this.initData.inform,
                sendInterestLetter: this.initData.sendInterestLetter,
                validPolicy: this.initData.validPolicy,
                completeTele: this.initData.completeTele,
                returnAs400: this.initData.returnAs400,
                hostCorrespond: this.initData.hostCorrespond,
                status: this.initData.status,
                createId: this.initData.createId,
                createName: this.initData.createName,
                createDate: this.initData.createDate,
                updateId: this.initData.updateId,
                updateName: this.initData.updateName,
                updateDate: this.initData.updateDate,
            };
        }
    }

    // (validate)編號驗證(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateTeleResultConfigId(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
            } else {
                // 僅可輸入英數字且限20字
                CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, true, this.$t('global_alphanumericInputOnly').toString(), true);
                callback(() => { });
            }
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, true, this.$t('teleResultPage_isNoRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)電訪項目(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateTaskId(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.taskIdFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.taskIdFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.taskIdFeildValidation, true, this.$t('teleResultPage_isTaskIdRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)聯絡結果(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateContactResultId(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.contactResultIdFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.contactResultIdFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.contactResultIdFeildValidation, true, this.$t('teleResultPage_isContactResultIdRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)電訪結果(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateTeleResultId(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.teleResultIdFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.teleResultIdFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.teleResultIdFeildValidation, true, this.$t('teleResultPage_isTeleResultIdRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)是否照會(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateNotification(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.notificationFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.notificationFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.notificationFeildValidation, true, this.$t('teleResultPage_isNotificationRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)是否會辦(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateInform(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.informFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.informFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.informFeildValidation, true, this.$t('teleResultPage_isInformRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)是否郵寄權益信函(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateSendInterestLetter(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.sendInterestLetterFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.sendInterestLetterFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.sendInterestLetterFeildValidation, true, this.$t('teleResultPage_isSendInterestLetterRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)是否列入有效保單(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateValidPolicy(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.validPolicyFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.validPolicyFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.validPolicyFeildValidation, true, this.$t('teleResultPage_isValidPolicyRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)是否列入完成電訪(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateCompleteTele(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.completeTeleFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.completeTeleFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.completeTeleFeildValidation, true, this.$t('teleResultPage_isCompleteTeleRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // (validate)是否回寫AS400(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateReturnAs400(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.returnAs400FeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.returnAs400FeildValidation, false, "", false);
        } else {
            if (this.teleResultConfigForm.caseClosedReasonId) {
                CommonUtil.feildValidateWithVisible(this.returnAs400FeildValidation, false, "", false);
            } else {
                // 必填
                CommonUtil.feildValidateWithVisible(this.returnAs400FeildValidation, true, this.$t('teleResultPage_isReturnAs400Required').toString(), true);
                callback(() => { });
            }
        }
        callback();
    }

    // (validate)回寫至主機的對應值(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateHostCorrespond(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.hostCorrespondFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.hostCorrespondFeildValidation, false, "", false);
        } else {
            if (this.teleResultConfigForm.returnAs400 == 'N') {
                CommonUtil.feildValidateWithVisible(this.hostCorrespondFeildValidation, false, "", false);
            } else {
                // 必填
                CommonUtil.feildValidateWithVisible(this.hostCorrespondFeildValidation, true, this.$t('teleResultPage_isHostCorrespondRequired').toString(), true);
                callback(() => { });
            }
        }
        callback();
    }

    // (validate)是否啟用(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateStatus(rule, value, callback) {
        this.isEdited = true;
        CommonUtil.feildValidateWithVisible(this.statusFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            CommonUtil.feildValidateWithVisible(this.statusFeildValidation, false, "", false);
        } else {
            // 必填
            CommonUtil.feildValidateWithVisible(this.statusFeildValidation, true, this.$t('teleResultPage_isStatusRequired').toString(), true);
            callback(() => { });
        }
        callback();
    }

    // 共用欄位驗證
    callCommonUtilFeild(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValid(fv);
    }
}