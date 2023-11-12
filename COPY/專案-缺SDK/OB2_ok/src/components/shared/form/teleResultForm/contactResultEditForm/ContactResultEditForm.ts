import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FeildValidation } from "@/pages/custMark/model";
import { ContactResultUpdate } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ContactResultChangeFormDto, ContactResultValidateForm } from "./model";

@Component
export default class ContactResultEditForm extends Vue {
    @Prop()
    public selectSendMplusOptions;
    @Prop()
    public selectStatusOptions;
    @Prop()
    public initData;

    //判斷表單是否編輯
    isEdited: boolean = false;

    //下拉選單選項
    sendMplusOptions;
    statusOptions;

    //是否為編輯
    isEdit: boolean = false;

    //新增/編輯資料
    contactResultChangeForm: ContactResultChangeFormDto = {
        contactResultId: "",
        contactResultName: "",
        sendMplus: "",
        status: "",
        createId: "",
        createName: "",
        createDate: "",
        updateId: "",
        updateName: "",
        updateDate: "",
    }

    // From 欄位驗證規則(新增/編輯)
    contactResultFormRules: { [key: string]: ValidationRule[] } = {
        contactResultId: [{ validator: this.validateContactResultId, trigger: "blur" }],
        contactResultName: [{ validator: this.validateContactResultName, trigger: "blur" }],
    };

    //欄位驗證提示工具
    contactResultValidateForm: ContactResultValidateForm = {
        contactResultId: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        contactResultName: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        sendMplus: {
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
        this.sendMplusOptions = (JSON.parse(JSON.stringify(this.selectSendMplusOptions)));
        this.sendMplusOptions.splice(0, 1);

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
            if (this.initData.contactResultId == '') {
                LoadingUtil.show();
                let insert: ContactResultUpdate = {
                    contactResultId: this.contactResultChangeForm.contactResultId.trim(),
                    contactResultName: this.contactResultChangeForm.contactResultName.trim(),
                    sendMplus: this.contactResultChangeForm.sendMplus,
                    status: this.contactResultChangeForm.status,
                }
                this.$contactResultApi.insertContactResultUsingPOST(insert)
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
                let updates: ContactResultUpdate = {
                    contactResultId: this.contactResultChangeForm.contactResultId,
                    contactResultName: this.contactResultChangeForm.contactResultName,
                    sendMplus: this.contactResultChangeForm.sendMplus,
                    status: this.contactResultChangeForm.status,
                }
                this.$contactResultApi.updateContactResultUsingPOST(updates)
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
        this.contactResultChangeForm = {
            contactResultId: this.initData.contactResultId,
            contactResultName: this.initData.contactResultName,
            sendMplus: this.initData.sendMplus,
            status: this.initData.status,
            createId: this.initData.createId,
            createName: this.initData.createName,
            createDate: this.initData.createDate,
            updateId: this.initData.updateId,
            updateName: this.initData.updateName,
            updateDate: this.initData.updateDate,
        };
        if ("" == this.contactResultChangeForm.contactResultId) {
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
        this.validateContactResultId(null, this.contactResultChangeForm.contactResultId, () => {
            if (this.contactResultValidateForm.contactResultId.state == 'error') {
                validate = false;
            }
        });
        this.validateContactResultName(null, this.contactResultChangeForm.contactResultName, () => {
            if (this.contactResultValidateForm.contactResultName.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    //清除表單狀態
    clearFormStatus() {
        this.feildValidate(this.contactResultValidateForm.contactResultId, false, "success", "", "");
        this.feildValidate(this.contactResultValidateForm.contactResultName, false, "success", "", "");
        this.feildValidate(this.contactResultValidateForm.sendMplus, false, "success", "", "");
        this.feildValidate(this.contactResultValidateForm.status, false, "success", "", "");
    }

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //聯絡結果代碼 驗證
    validateContactResultId(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.contactResultValidateForm.contactResultId, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                this.feildValidate(this.contactResultValidateForm.contactResultId, false, "success", "", "");
            } else {
                // 聯絡結果代碼 僅可輸入英數字
                this.feildValidate(this.contactResultValidateForm.contactResultId, true, "error", "hover", this.$t('contactResult_contactResultIdalphanumericInputOnly').toString());
                callback(() => { });
            }
        } else {
            //聯絡結果代碼 必填
            this.feildValidate(this.contactResultValidateForm.contactResultId, true, "error", "hover", this.$t('contactResult_contactResultIdRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //聯絡結果名稱 驗證
    validateContactResultName(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.contactResultValidateForm.contactResultName, true, "", "", "");
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            this.feildValidate(this.contactResultValidateForm.contactResultName, false, "success", "", "");
        } else {
            // 聯絡結果名稱 必填
            this.feildValidate(this.contactResultValidateForm.contactResultName, true, "error", "hover", this.$t('contactResult_contactResultNameRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //取得表單是否已編輯
    getIsEdit() {
        return this.isEdited;
    }

}