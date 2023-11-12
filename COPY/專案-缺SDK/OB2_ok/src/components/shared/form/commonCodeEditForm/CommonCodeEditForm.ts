import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FeildValidation } from "@/pages/custMark/model";
import { TSysCommonCodeCreation, TSysCommonCodeUpdate } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CommonCodeChangeFormDto, CommonCodeValidateForm } from "./model";

@Component
export default class CommonCodeEditForm extends Vue {
    @Prop()
    public selectCommonCodeTypeOptions;
    @Prop()
    public initData;

    //判斷表單是否編輯
    isEdited: boolean = false;

    //下拉選單選項
    commonCodeTypeOptions;
    commonCodeStatusOptions = [
        {
            value: 'Y',
            label: this.$t('global_effective').toString() //有效
        },
        {
            value: 'N',
            label: this.$t('global_deactivate').toString() //停用
        },
    ];

    //是否為編輯
    isEdit: boolean = false;

    //新增/編輯資料
    commonCodeChangeForm: CommonCodeChangeFormDto = {
        uuid: "",
        typeId: "",
        typeDesc: "",
        code: "",
        codeName: "",
        sMemo1: "",
        sMemo2: "",
        sMemo3: "",
        status: "",
        codeSort: null,
    }

    // From 欄位驗證規則(新增/編輯)
    commonCodeFormRules: { [key: string]: ValidationRule[] } = {
        typeId: [{ validator: this.validateTypeId, trigger: "blur" }],
        code: [{ validator: this.validateCode, trigger: "blur" }],
        codeName: [{ validator: this.validateCodeName, trigger: "blur" }],
        status: [{ validator: this.validateStatus, trigger: "blur" }],
        codeSort: [{ validator: this.validateCodeSort, trigger: "blur" }]
    };

    //欄位驗證提示工具
    commonCodeValidateForm: CommonCodeValidateForm = {
        typeId: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        code: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        codeName: {
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
        codeSort: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
    }

    created() {
        this.commonCodeTypeOptions = (JSON.parse(JSON.stringify(this.selectCommonCodeTypeOptions)));
        this.commonCodeTypeOptions.splice(0, 1);
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
            if (this.commonCodeChangeForm.uuid == '') {
                LoadingUtil.show();
                let insert: TSysCommonCodeCreation = {
                    typeId: this.commonCodeChangeForm.typeId,
                    code: this.commonCodeChangeForm.code.trim(),
                    codeName: this.commonCodeChangeForm.codeName.trim(),
                    smemo1: this.commonCodeChangeForm.sMemo1,
                    smemo2: this.commonCodeChangeForm.sMemo2,
                    smemo3: this.commonCodeChangeForm.sMemo3,
                    status: this.commonCodeChangeForm.status,
                    codeSort: this.commonCodeChangeForm.codeSort,
                }
                this.$commonApi.insertCommonCodeUsingPOST(insert)
                    .then((resp) => {
                        if(resp.data.success){
                            // 新增成功
                            MessageUtil.messageSuccess(this.$t('global_addSuccess').toString());
                        }else {
                            // success為false錯誤訊息
                            hasError = true;
                            ErrorModalUtil.modalError(this.$t(resp.data.returnMessage).toString());
                        }
                    }).catch((err) => {
                        hasError = true;
                        console.error(err);
                    }).finally(() => {
                        LoadingUtil.close();
                        if (!hasError) {
                            this.$emit("reloadData");
                        }
                    })
            } else {
                LoadingUtil.show();
                let updates: TSysCommonCodeUpdate = {
                    uuid: this.commonCodeChangeForm.uuid,
                    typeId: this.commonCodeChangeForm.typeId,
                    code: this.commonCodeChangeForm.code.trim(),
                    codeName: this.commonCodeChangeForm.codeName.trim(),
                    smemo1: this.commonCodeChangeForm.sMemo1,
                    smemo2: this.commonCodeChangeForm.sMemo2,
                    smemo3: this.commonCodeChangeForm.sMemo3,
                    status: this.commonCodeChangeForm.status,
                    codeSort: this.commonCodeChangeForm.codeSort,
                }
                this.$commonApi.updateCommonCodeUsingPOST(updates)
                    .then((resp) => {
                        if(resp.data.success){
                            // 修改成功
                            MessageUtil.messageSuccess(this.$t('shiftS_updateSuccessed').toString());
                        }else {
                            // success為false錯誤訊息
                            hasError = true;
                            ErrorModalUtil.modalError(this.$t(resp.data.returnMessage).toString());
                        }
                    }).catch((err) => {
                        hasError = true;
                        console.error(err);
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
        this.commonCodeChangeForm = {
            uuid: this.initData.uuid,
            typeId: this.initData.typeId,
            code: this.initData.code,
            codeName: this.initData.codeName,
            sMemo1: this.initData.sMemo1,
            sMemo2: this.initData.sMemo2,
            sMemo3: this.initData.sMemo3,
            status: this.initData.status,
            codeSort: this.initData.codeSort,
        };
        if ("" == this.commonCodeChangeForm.uuid) {
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
        this.validateTypeId(null, this.commonCodeChangeForm.typeId, () => {
            if (this.commonCodeValidateForm.typeId.state == 'error') {
                validate = false;
            }
        });
        this.validateCode(null, this.commonCodeChangeForm.code, () => {
            if (this.commonCodeValidateForm.code.state == 'error') {
                validate = false;
            }
        });
        this.validateCodeName(null, this.commonCodeChangeForm.codeName, () => {
            if (this.commonCodeValidateForm.codeName.state == 'error') {
                validate = false;
            }
        });
        this.validateStatus(null, this.commonCodeChangeForm.status, () => {
            if (this.commonCodeValidateForm.status.state == 'error') {
                validate = false;
            }
        });
        this.validateCodeSort(null, this.commonCodeChangeForm.codeSort, () => {
            if (this.commonCodeValidateForm.codeSort.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    //清除表單狀態
    clearFormStatus() {
        this.feildValidate(this.commonCodeValidateForm.typeId, false, "success", "", "");
        this.feildValidate(this.commonCodeValidateForm.code, false, "success", "", "");
        this.feildValidate(this.commonCodeValidateForm.codeName, false, "success", "", "");
        this.feildValidate(this.commonCodeValidateForm.status, false, "success", "", "");
        this.feildValidate(this.commonCodeValidateForm.codeSort, false, "success", "", "");
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }


    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //代碼類別驗證
    validateTypeId(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.commonCodeValidateForm.typeId, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            this.feildValidate(this.commonCodeValidateForm.typeId, false, "success", "", "");
            callback();
        } else {
            //代碼類別 必填
            this.feildValidate(this.commonCodeValidateForm.typeId, true, "error", "hover", this.$t('commonCode_typeIdRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //代碼ID驗證
    validateCode(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.commonCodeValidateForm.code, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.codeIdValidation(value)) {
                this.feildValidate(this.commonCodeValidateForm.code, false, "success", "", "");
            } else {
                // 僅可輸入英、數字及符號,_.–
                this.feildValidate(this.commonCodeValidateForm.code, true, "error", "hover", this.$t('commonCode_CodeIdAlphanumericAndUnderscoresAndCommaInputOnly').toString());
                callback(() => { });
            }
        } else {
            //代碼ID 必填
            this.feildValidate(this.commonCodeValidateForm.code, true, "error", "hover", this.$t('commonCode_codeRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //代碼說明驗證
    validateCodeName(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.commonCodeValidateForm.codeName, true, "", "", "");
        if (!ValidationUtil.isEmpty(value) && value.trim().length >= 1) {
            this.feildValidate(this.commonCodeValidateForm.codeName, false, "success", "", "");
            callback();
        } else {
            //代碼說明 必填
            this.feildValidate(this.commonCodeValidateForm.codeName, true, "error", "hover", this.$t('commonCode_codeNameRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //狀態驗證
    validateStatus(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.commonCodeValidateForm.status, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            this.feildValidate(this.commonCodeValidateForm.status, false, "success", "", "");
            callback();
        } else {
            //狀態 必填
            this.feildValidate(this.commonCodeValidateForm.status, true, "error", "hover", this.$t('commonCode_statusRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //排列順序驗證
    validateCodeSort(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.commonCodeValidateForm.codeSort, true, "", "", "");
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.numberOnlyValidation(value)) {
                if (!ValidationUtil.codeSortValidation(value)) {
                    if (this.commonCodeChangeForm.codeSort.toString().length > 9) {
                        // 排列順序不可超過9碼
                        this.feildValidate(this.commonCodeValidateForm.codeSort, true, "error", "hover", this.$t('commonCode_notOver9Words').toString());
                        callback(() => { });
                    } else {
                        this.feildValidate(this.commonCodeValidateForm.codeSort, false, "success", "", "");
                    }
                } else {
                    // 排序不可為0或第一位不可輸入0
                    this.feildValidate(this.commonCodeValidateForm.codeSort, true, "error", "hover", this.$t('commonCode_CodeIdAlphanumericInputOnly').toString());
                    callback(() => { });
                }
            } else {
                // 僅可輸入數字
                this.feildValidate(this.commonCodeValidateForm.codeSort, true, "error", "hover", this.$t('global_numbersInputOnly').toString());
                callback(() => { });
            }
        } else {
            // 排列順序 必填
            this.feildValidate(this.commonCodeValidateForm.codeSort, true, "error", "hover", this.$t('commonCode_codeSortRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //取得表單是否已編輯
    getIsEdit() {
        return this.isEdited;
    }

    //代碼類別選項變動時
    onTypeIdChange() {
        this.validateTypeId(null, this.commonCodeChangeForm.typeId, () => { })
    }
}