import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FeildValidation } from "@/pages/custMark/model";
import { CaseClosedReasonUpdate } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CaseClosedReasonChangeFormDto, CaseClosedReasonValidateForm } from "./model";


@Component
export default class CaseClosedReasonEditForm extends Vue {

    @Prop()
    public initData;

    @Prop()
    public selectStatusOptions;

    // 是否編輯
    isEdited: boolean = false;

    //下拉選單選項
    statusOptions;

    //是否為編輯
    isEdit: boolean = false;

    // 欄位
    caseClosedReasonChangeForm: CaseClosedReasonChangeFormDto = {
        caseClosedReasonId: "",
        caseClosedReasonName: "",
        status: "",
        createId: "",
        createName: "",
        createDate: "",
        updateId: "",
        updateName: "",
        updateDate: "",
    }

    // 欄位驗證規則(新增/編輯)
    caseClosedReasonFormRules: { [key: string]: ValidationRule[] } = {
        caseClosedReasonId: [{ validator: this.validateCaseClosedReasonId, trigger: "blur" }],
        caseClosedReasonName: [{ validator: this.validateCaseClosedReasonName, trigger: "blur" }],
    };

    //欄位驗證提示工具
    caseClosedReasonValidateForm: CaseClosedReasonValidateForm = {
        caseClosedReasonId: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        caseClosedReasonName: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        status: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
    }

    created() {
        this.statusOptions = (JSON.parse(JSON.stringify(this.selectStatusOptions)));
        this.statusOptions.splice(0, 1);
        this.reset();
    }

    //表單送出前的驗證
    validateSubmit() {
        let validate = true;
        this.validateCaseClosedReasonId(null, this.caseClosedReasonChangeForm.caseClosedReasonId, () => {
            if (this.caseClosedReasonValidateForm.caseClosedReasonId.state == 'error') {
                validate = false;
            }
        });
        this.validateCaseClosedReasonName(null, this.caseClosedReasonChangeForm.caseClosedReasonName, () => {
            if (this.caseClosedReasonValidateForm.caseClosedReasonName.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    //清除表單狀態
    clearFormStatus() {
        this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonId, false, "success", "", "");
        this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonName, false, "success", "", "");
        this.feildValidate(this.caseClosedReasonValidateForm.status, false, "success", "", "");
    }

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //結案原因代碼 驗證
    validateCaseClosedReasonId(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonId, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonId, false, "success", "", "");
            } else if (this.caseClosedReasonChangeForm.caseClosedReasonId.length > 20) {
                // 字數不可超過20字
                this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonId, true, "error", "hover", this.$t('caseClosedReason_IdValidateErrorMsg').toString());
                callback(() => { });
            } else {
                // 結案原因代碼 僅可輸入英數字且限20字
                this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonId, true, "error", "hover", this.$t('caseClosedReason_IdValidateErrorMsg').toString());
                callback(() => { });
            }
        } else {
            // 結案原因代碼 必填
            this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonId, true, "error", "hover", this.$t('caseClosedReason_caseClosedReasonIdRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //結案原因名稱 驗證
    validateCaseClosedReasonName(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonName, true, null, "", null);
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            if (this.caseClosedReasonChangeForm.caseClosedReasonId.length > 50) {
                // 結案原因名稱 僅可輸入50字
                this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonName, true, "error", "hover", this.$t('caseClosedReason_NameValidateErrorMsg').toString());
                callback(() => { });
            } else {
                this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonName, false, "success", "", "");
            }
        } else {
            // 結案原因名稱 必填
            this.feildValidate(this.caseClosedReasonValidateForm.caseClosedReasonName, true, "error", "hover", this.$t('caseClosedReason_caseClosedReasonNameRequired').toString());
            callback(() => { });
        }
        callback();
    }



    /**
     * 監聽initData資料變動
     * @returns 
     */
    @Watch("initData")
    onInitDataChanged(): void {
        this.reset();
    }

    //新增/編輯表單送出
    onFormSubmit() {
        if (this.validateSubmit()) {
            let hasError = false;
            if (ValidationUtil.isEmpty(this.initData.caseClosedReasonId)) {
                LoadingUtil.show();
                let insert: CaseClosedReasonUpdate = {
                    caseClosedReasonId: this.caseClosedReasonChangeForm.caseClosedReasonId.trim(),
                    caseClosedReasonName: this.caseClosedReasonChangeForm.caseClosedReasonName.trim(),
                    status: this.caseClosedReasonChangeForm.status,
                }
                this.$caseClosedReasonApi.insertCaseClosedReasonUsingPOST(insert)
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
                let updates: CaseClosedReasonUpdate = {
                    caseClosedReasonId: this.caseClosedReasonChangeForm.caseClosedReasonId,
                    caseClosedReasonName: this.caseClosedReasonChangeForm.caseClosedReasonName,
                    status: this.caseClosedReasonChangeForm.status,
                }
                let id: string = this.initData.caseClosedReasonId;
                this.$caseClosedReasonApi.updateCaseClosedReasonUsingPOST(id, updates)
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

    //重設表單
    reset() {
        this.clearFormStatus();
        this.caseClosedReasonChangeForm = {
            caseClosedReasonId: this.initData.caseClosedReasonId,
            caseClosedReasonName: this.initData.caseClosedReasonName,
            status: this.initData.status,
            createId: this.initData.createId,
            createName: this.initData.createName,
            createDate: this.initData.createDate,
            updateId: this.initData.updateId,
            updateName: this.initData.updateName,
            updateDate: this.initData.updateDate,
        };
        if (ValidationUtil.isEmpty(this.caseClosedReasonChangeForm.caseClosedReasonId)) {
            this.isEdit = false;
            this.isEdited = true;
        } else {
            this.isEdit = true;
            this.isEdited = false;
        }
    }
}