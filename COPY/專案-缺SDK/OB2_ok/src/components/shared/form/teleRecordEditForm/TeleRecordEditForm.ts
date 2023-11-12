import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { TeleRecordCreationOrUpdation, TeleRecordGrid, TeleRecordUpdationOptions, TobdTeleResultConfig } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ValidateInput from "@/components/shared/validateInput/ValidateInput.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import teleRecordEditValidationForm from "./model";

@Component({
    components: { ValidateInput }
})
export default class TeleRecordEditForm extends Vue {

    @Prop()
    public initData: TeleRecordGrid;

    @Prop()
    initEditFormOptionsDto: TeleRecordUpdationOptions;

    //電訪項目下拉選單
    taskOptions = [];

    //聯絡結果下拉選單
    contactResultOptions = [];

    //電訪結果下拉選單
    teleResultOptions = [];

    //結案原因下拉選單
    caseClosedReasonOptions = [];


    //是否照會下拉選單
    //是否郵寄權益信函下拉選單
    selectEngOptionsChild = [];


    //照會單是否結案下拉選單
    notiClosedFlagOption = [];

    //北富銀VS保經代網電訪結果
    campBankResultOptions = [];


    //經過篩選的電訪配置設定
    teleResultConfigList: Array<TobdTeleResultConfig> = [];

    //判斷照會是否結案可否選擇
    notiClosedDisabledFlag: boolean = false;

    //判斷權益函退信原因≠招領逾期可否選擇
    mailLetterReturnDisabledFlag: boolean = false;

    // 是否編輯
    isEdited: boolean = false;

    get isEdit(): boolean {
        if (!ValidationUtil.isEmpty(this.initData.teleRecordId)) {
            return true;
        } else {
            return false;
        }
    }

    created() {
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

    // 重設表單
    reset() {
        //公用下拉選單給值
        this.taskOptions = this.initEditFormOptionsDto.taskOption;
        this.selectEngOptionsChild = this.initEditFormOptionsDto.notiFlagOption;
        this.campBankResultOptions = this.initEditFormOptionsDto.campBankResultOption;
        this.teleResultConfigList = this.initEditFormOptionsDto.teleResultConfigList;
        this.notiClosedDisabledFlag = true
        this.mailLetterReturnDisabledFlag = true;
        if (this.isEdit) {//如果為編輯
            //VL903-1673 不篩選掉status=N的電訪設置檔案
            this.teleResultConfigList = this.initEditFormOptionsDto.teleResultConfigAllList;
            this.teleRecordForm = JSON.parse(JSON.stringify(this.initData));
            //轉為民國年
            this.teleRecordForm.createDate = MomentUtil.transformRocYearMonthDayHHMMSS(this.initData.createDate);
            this.teleRecordForm.updateDate = MomentUtil.transformRocYearMonthDayHHMMSS(this.initData.updateDate);
            //初始化連絡結果下拉選單
            let filterContactResultIdList = this.teleResultConfigList.filter(e => e.taskId == this.teleRecordForm.taskId).map(e => e.contactResultId);
            this.contactResultOptions = this.initEditFormOptionsDto.contactResultOption.filter(e => filterContactResultIdList.includes(e.value));
            //初始化電訪結果下拉選單
            let filterTeleResultIdList = this.teleResultConfigList.filter(e => e.contactResultId == this.teleRecordForm.contactResultId&&e.taskId ==this.teleRecordForm.taskId).map(e => e.teleResultId);
            this.teleResultOptions = this.initEditFormOptionsDto.teleResultOption.filter(e => filterTeleResultIdList.includes(e.value));

            //初始化結案原因下拉選單
            let filterCaseClosedReasonIdList = this.teleResultConfigList.filter(e => e.teleResultId == this.teleRecordForm.teleResultId&&e.contactResultId==this.teleRecordForm.contactResultId&&e.taskId==this.teleRecordForm.taskId).map(e => e.caseClosedReasonId);
            this.caseClosedReasonOptions = this.initEditFormOptionsDto.caseClosedReasonOption.filter(e => filterCaseClosedReasonIdList.includes(e.value));
       
            if (this.teleRecordForm.notification == "Y") {
                this.notiClosedDisabledFlag = false;
                
            } else {
                this.notiClosedDisabledFlag = true;
            }

            if (this.teleRecordForm.sendInteresetLetter == "Y") {
                this.mailLetterReturnDisabledFlag = false;
            } else {
                this.mailLetterReturnDisabledFlag = true;
            }
       
            
        }else{
            //如果不為維護則不變動初始資料
            this.onSelectNotificationChange();
            this.onSelectSendInteresetLetterChange();
        }

    }

    validateBeforeSubmit() {

        (this.$refs.teleRecordEditForm as any).validate();

        let taskIdValidation: boolean = !this.teleRecordEditValidationForm.taskId.feedback ? true : false;
        let contactResultIdValidation: boolean = !this.teleRecordEditValidationForm.contactResultId.feedback ? true : false;
        let teleResultIdValidation: boolean = !this.teleRecordEditValidationForm.teleResultId.feedback ? true : false;

        if (taskIdValidation && contactResultIdValidation && teleResultIdValidation) {
            return true;
        } else {

            return false;
        }
    }

    //新增/編輯表單送出
    onFormSubmit() {
        if (this.validateBeforeSubmit()) {
            if (this.isEdit) {//如為修改
                let updateBody: TeleRecordCreationOrUpdation = {};
                updateBody.teleRecordId = this.initData.teleRecordId;
                updateBody.taskId = this.teleRecordForm.taskId;
                updateBody.contactResultId = this.teleRecordForm.contactResultId;
                updateBody.teleResultId = this.teleRecordForm.teleResultId;
                updateBody.caseClosedReasonId = this.teleRecordForm.caseClosedReasonId;
                updateBody.notification = this.teleRecordForm.notification;
                updateBody.notiClosed = this.teleRecordForm.notiClosed;
                updateBody.sendInteresetLetter = this.teleRecordForm.sendInteresetLetter;
                updateBody.recruitmentOverdue = this.teleRecordForm.recruitmentOverdue;
                updateBody.campBankResult = this.teleRecordForm.campBankResult;
                this.$teleRecordSettingApi.updateTeleReCordUsingPOST(updateBody)
                    .then(resp => {
                        MessageUtil.messageSuccess(this.$t("fileUpload_modifySuccess").toString());
                        this.$emit("reloadData");

                    }
                    ).catch(err =>
                        ErrorModalUtil.modalError(err.response.data.message)
                    );

            } else {
                let createBody: TeleRecordCreationOrUpdation = {};
                createBody.taskId = this.teleRecordForm.taskId;
                createBody.contactResultId = this.teleRecordForm.contactResultId;
                createBody.teleResultId = this.teleRecordForm.teleResultId;
                createBody.caseClosedReasonId = this.teleRecordForm.caseClosedReasonId;
                createBody.notification = this.teleRecordForm.notification;
                createBody.notiClosed = this.teleRecordForm.notiClosed;
                createBody.sendInteresetLetter = this.teleRecordForm.sendInteresetLetter;
                createBody.recruitmentOverdue = this.teleRecordForm.recruitmentOverdue;
                createBody.campBankResult = this.teleRecordForm.campBankResult;

                this.$teleRecordSettingApi.insertTeleReCordUsingPOST(createBody)
                    .then(resp => {
                        MessageUtil.messageSuccess(this.$t("global_addSuccess").toString());
                        this.$emit("reloadData");

                    }
                    ).catch(err =>
                        ErrorModalUtil.modalError(err.response.data.message)
                    );

            }

        } else {
            return
        }
    }

    onSelectNotificationChange() {
        if (this.teleRecordForm.notification == "Y") {
            this.notiClosedDisabledFlag = false;
            this.teleRecordForm.notiClosed = 'N';
        } else {
            this.notiClosedDisabledFlag = true;
            this.teleRecordForm.notiClosed = 'N';
        }
    }
    //是否郵寄權益信函改便時
    onSelectSendInteresetLetterChange() {

        if (this.teleRecordForm.sendInteresetLetter == "Y") {
            this.mailLetterReturnDisabledFlag = false;
            this.teleRecordForm.recruitmentOverdue = 'N';
        } else {
            this.mailLetterReturnDisabledFlag = true;
            this.teleRecordForm.recruitmentOverdue = 'N';
        }

    }

    // 初始化顯示資料
    teleRecordForm: TeleRecordGrid = {
        teleRecordId: null,
        taskId: null,
        contactResultId: null,
        teleResultId: null,
        caseClosedReasonId: null,
        notification: 'N',
        notiClosed: 'N',
        sendInteresetLetter: 'N',
        recruitmentOverdue: 'N',
        campBankResult: 'H',
        createId: null,
        createName: null,
        createDate: null,
        updateId: null,
        updateName: null,
        updateDate: null,

    }


    // ============================驗證validate section start============================

    // 欄位驗證
    teleRecordEditFormRules: { [key: string]: ValidationRule[] } = {
        taskId: [{ validator: this.validateTaskId, trigger: "blur" }],
        contactResultId: [{ validator: this.validateContactResultId, trigger: "blur" }],
        teleResultId: [{ validator: this.validateTeleResultId, trigger: "blur" }],

    };

    //結案表單驗證物件
    teleRecordEditValidationForm: teleRecordEditValidationForm = {
        taskId: { feedback: false, hoverVisible: false, msg: "" },
        contactResultId: { feedback: false, hoverVisible: false, msg: "" },
        teleResultId: { feedback: false, hoverVisible: false, msg: "" },
    }

    //驗證電訪項目
    validateTaskId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.teleRecordEditValidationForm.taskId, false, "", false);

        if (ValidationUtil.isEmpty(this.teleRecordForm.taskId)) {
            CommonUtil.feildValidateWithVisible(this.teleRecordEditValidationForm.taskId, true, this.$t("teleResultPage_isTaskIdRequired").toString(), false);//"電訪項目不可為空"
            callback(false);

        }
    }

    //電訪項目改變時,篩選連絡結果option
    onSelectTaskChange() {
        this.validateTaskId(null, this.teleRecordForm.taskId, () => { });
        this.teleRecordForm.contactResultId = "";
        this.teleRecordForm.teleResultId = "";
        this.teleRecordForm.caseClosedReasonId = "";

        this.contactResultOptions = [];
        this.teleResultOptions = [];
        this.caseClosedReasonOptions = [];

        let filterContactResultIdList = this.teleResultConfigList.filter(e => e.taskId == this.teleRecordForm.taskId).map(e => e.contactResultId);
        this.contactResultOptions = this.initEditFormOptionsDto.contactResultOption.filter(e => filterContactResultIdList.includes(e.value));
    }

    //驗證連絡結果
    validateContactResultId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.teleRecordEditValidationForm.contactResultId, false, "", false);

        if (ValidationUtil.isEmpty(this.teleRecordForm.contactResultId)) {
            CommonUtil.feildValidateWithVisible(this.teleRecordEditValidationForm.contactResultId, true, this.$t("teleResultPage_isContactResultIdRequired").toString(), false);//"聯絡結果不可為空
            callback(false);

        }

    }

    //聯絡結果改變時, 篩選電訪結果options
    onSelectContactResultChange() {
        this.validateContactResultId(null, this.teleRecordForm.contactResultId, () => { });
        this.teleRecordForm.teleResultId = "";
        this.teleRecordForm.caseClosedReasonId = "";
        this.teleResultOptions = [];
        this.caseClosedReasonOptions = [];

        let filterTeleResultIdList = this.teleResultConfigList.filter(e => e.contactResultId == this.teleRecordForm.contactResultId&&e.taskId==this.teleRecordForm.taskId).map(e => e.teleResultId);
        this.teleResultOptions = this.initEditFormOptionsDto.teleResultOption.filter(e => filterTeleResultIdList.includes(e.value));
    }


    validateTeleResultId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.teleRecordEditValidationForm.teleResultId, false, "", false);

        if (ValidationUtil.isEmpty(this.teleRecordForm.teleResultId)) {
            CommonUtil.feildValidateWithVisible(this.teleRecordEditValidationForm.teleResultId, true, this.$t("teleResultPage_isTeleResultIdRequired").toString(), false);//"電訪結果不可為空
            callback(false);

        }

    }

    //電訪結果改變時, 篩選結案原因options
    onSelectTeleResultChange() {

        this.validateTeleResultId(null, this.teleRecordForm.teleResultId, () => { });
        this.teleRecordForm.caseClosedReasonId = "";
        this.caseClosedReasonOptions = [];

        let filterCaseClosedReasonIdList = this.teleResultConfigList.filter(e =>  e.contactResultId == this.teleRecordForm.contactResultId&&e.taskId==this.teleRecordForm.taskId&&e.teleResultId == this.teleRecordForm.teleResultId).map(e => e.caseClosedReasonId);
        this.caseClosedReasonOptions = this.initEditFormOptionsDto.caseClosedReasonOption.filter(e => filterCaseClosedReasonIdList.includes(e.value));
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