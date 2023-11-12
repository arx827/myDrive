import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FeildValidation } from "@/pages/custMark/model";
import { TeleResultUpdate } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TeleResultChangeFormDto, TeleResultValidateForm } from "./model";

@Component 
export default class TeleResultEditForm extends Vue {
    @Prop()
    public selectNotSuspectiveOptions;
    @Prop()
    public selectStatusOptions;
    @Prop()
    public initData;

    //判斷表單是否編輯
    isEdited: boolean = false;

    //下拉選單選項
    notSuspectiveOptions;
    statusOptions;

    //是否為編輯
    isEdit: boolean = false;

    //新增/編輯資料
    teleResultChangeForm: TeleResultChangeFormDto = {
        teleResultId: "",
        teleResultName: "",
        notSuspective: "",
        status: "",
        createId: "",
        createName: "",
        createDate: "",
        updateId: "",
        updateName: "",
        updateDate: "",
    }

    // From 欄位驗證規則(新增/編輯)
    teleResultFormRules: { [key: string]: ValidationRule[] } = {
        teleResultId: [{ validator: this.validateTeleResultId, trigger: "blur" }],
        teleResultName: [{ validator: this.validateTeleResultName, trigger: "blur" }],
    };

    //欄位驗證提示工具
    teleResultValidateForm: TeleResultValidateForm = {
        teleResultId: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        teleResultName: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        notSuspective: {
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
        this.notSuspectiveOptions = (JSON.parse(JSON.stringify(this.selectNotSuspectiveOptions)));
        this.notSuspectiveOptions.splice(0, 1);

        this.statusOptions = (JSON.parse(JSON.stringify(this.selectStatusOptions)));
        this.statusOptions.splice(0, 1);

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

    //新增/編輯表單送出
    onFormSubmit() {
        if (this.validateSubmit()) {
            let hasError = false;
            if (this.initData.teleResultId == '') {
                LoadingUtil.show();
                let insert: TeleResultUpdate = {
                    teleResultId: this.teleResultChangeForm.teleResultId.trim(),
                    teleResultName: this.teleResultChangeForm.teleResultName.trim(),
                    notSuspective: this.teleResultChangeForm.notSuspective,
                    status: this.teleResultChangeForm.status,
                }
                this.$teleResultApi.insertTeleResultUsingPOST(insert)
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
                let updates: TeleResultUpdate = {
                    teleResultId: this.teleResultChangeForm.teleResultId,
                    teleResultName: this.teleResultChangeForm.teleResultName,
                    notSuspective: this.teleResultChangeForm.notSuspective,
                    status: this.teleResultChangeForm.status,
                }
                this.$teleResultApi.updateTeleResultUsingPOST(updates)
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
        this.teleResultChangeForm = {
            teleResultId: this.initData.teleResultId,
            teleResultName: this.initData.teleResultName,
            notSuspective: this.initData.notSuspective,
            status: this.initData.status,
            createId: this.initData.createId,
            createName: this.initData.createName,
            createDate: this.initData.createDate,
            updateId: this.initData.updateId,
            updateName: this.initData.updateName,
            updateDate: this.initData.updateDate,
        };
        if ("" == this.teleResultChangeForm.teleResultId) {
            this.isEdit = false;
            this.isEdited = true;
        } else {
            this.isEdit = true;
            this.isEdited = false;
        }
    }

    //表單送出前的驗證
    validateSubmit() {
        let validate = true;
        this.validateTeleResultId(null, this.teleResultChangeForm.teleResultId, () => {
            if (this.teleResultValidateForm.teleResultId.state == 'error') {
                validate = false;
            }
        });
        this.validateTeleResultName(null, this.teleResultChangeForm.teleResultName, () => {
            if (this.teleResultValidateForm.teleResultName.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    //清除表單狀態
    clearFormStatus() {
        this.feildValidate(this.teleResultValidateForm.teleResultId, false, "success", "", "");
        this.feildValidate(this.teleResultValidateForm.teleResultName, false, "success", "", "");
        this.feildValidate(this.teleResultValidateForm.notSuspective, false, "success", "", "");
        this.feildValidate(this.teleResultValidateForm.status, false, "success", "", "");
    }

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //電訪結果代碼 驗證
    validateTeleResultId(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.teleResultValidateForm.teleResultId, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                this.feildValidate(this.teleResultValidateForm.teleResultId, false, "success", "", "");
            } else {
                // 電訪結果代碼 僅可輸入英數字
                this.feildValidate(this.teleResultValidateForm.teleResultId, true, "error", "hover", this.$t('teleResult_teleResultIdalphanumericInputOnly').toString());
                callback(() => { });
            }
        } else {
            //電訪結果代碼 必填
            this.feildValidate(this.teleResultValidateForm.teleResultId, true, "error", "hover", this.$t('teleResult_teleResultIdRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //電訪結果名稱 驗證
    validateTeleResultName(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.teleResultValidateForm.teleResultName, true, "", "", "");
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            this.feildValidate(this.teleResultValidateForm.teleResultName, false, "success", "", "");
        } else {
            // 電訪結果名稱 必填
            this.feildValidate(this.teleResultValidateForm.teleResultName, true, "error", "hover", this.$t('teleResult_teleResultNameRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //取得表單是否已編輯
    getIsEdit() {
        return this.isEdited;
    }

}