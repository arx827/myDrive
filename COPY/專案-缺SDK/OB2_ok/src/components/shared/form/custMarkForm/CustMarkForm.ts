import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FeildValidation } from "@/pages/custMark/model";
import { CustMarkCreation, CustMarkUpdate } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Option } from "ant-design-vue/types/mentions/option";
import moment from "moment";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CustMarkChangeFormDto, CustMarkValidateForm } from "./model";
import "@/assets/less/custMark.less";
import { LoginModule } from "@/plugins/store/LoginModule";
import VlidationUtil from "@/assets/config/ValidationUtil";

@Component
export default class CustMarkForm extends Vue {
    @Prop()
    public selectNationalityOptions: Option[];
    @Prop()
    public selectLanguageOptions: Option[];
    @Prop()
    public selectTagOptions: Option[];
    @Prop()
    public initData;

    isDateStartVisible: boolean = false;
    isDateEndVisible: boolean = false;

    //判斷表單是否編輯
    isEdited: boolean = false;

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    //下拉選單選項、checkbox選項
    nationalityOptions;
    languageOptions;
    tagOptions;

    //是否為編輯
    isEdit: boolean = false;

    //新增/編輯資料
    custMarkChangeForm: CustMarkChangeFormDto = {
        custMarkId: "",
        nationality: "",
        custId: "",
        name: "",
        languageIdList: [],
        tagIdList: [],
        content: "",
        handled: "",
        isAffective: "",
        createId: "",
        createName: "",
        createTime: "",
        updateId: "",
        updateName: "",
        updateTime: "",
        effectiveStartDate: null,
        effectiveEndDate: null,
        effectiveStartString: "",
        effectiveEndString: "",
        datePickerEffectiveStartDate: null,
        datePickerEffectiveEndDate: null,
    }

    // From 欄位驗證規則(新增/編輯)
    custMarkFormRules: { [key: string]: ValidationRule[] } = {
        nationality: [{ validator: this.validateNationality, trigger: "blur" }],
        custId: [{ validator: this.validateCustId, trigger: "blur" }],
        name: [{ validator: this.validateName, trigger: "blur" }],
        effectiveStartDate: [{ validator: this.validateEffectiveStartDate, trigger: "blur" }],
        effectiveEndDate: [{ validator: this.validateEffectiveEndDate, trigger: "blur" }],
        content: [{ validator: this.validateContent, trigger: "blur" }],
        handled: [{ validator: this.validateHandled, trigger: "blur" }]
    };

    //欄位驗證提示工具
    custMarkValidateForm :CustMarkValidateForm = {
        nationality: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        custId: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        name: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        effectiveStartDate: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        effectiveEndDate: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        content: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        tagIdList: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
        languageIdList: {
            hover: "",
            feedback: false,
            state: "",
            msg: ""
        },
    }

    created(): void{
        // 複製selectNationalityOptions的值 
        // 因記憶體位置不會變 故做反序列化後 轉JSON格式
        this.nationalityOptions = (JSON.parse(JSON.stringify(this.selectNationalityOptions)));
        // 此下拉選單欄位採「A類型」 所以需要刪除第一項只保留後面的資料 
        this.nationalityOptions.splice(0,1);
        this.languageOptions = this.selectLanguageOptions.filter((language)=> language.value != "");
        this.tagOptions = this.selectTagOptions.filter((tag)=> tag.value != "");
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
    onFormSubmit(){
        if(this.validateSubmit()){
            let hasError = false;
            if(this.custMarkChangeForm.custMarkId == ""){
                LoadingUtil.show();
                let creation : CustMarkCreation = {
                    custId: this.custMarkChangeForm.custId.toUpperCase(),
                    custName: this.custMarkChangeForm.name,
                    nationality: this.custMarkChangeForm.nationality,
                    content: this.custMarkChangeForm.content,
                    handled: this.custMarkChangeForm.handled,
                    languageIdList: this.custMarkChangeForm.languageIdList,
                    tagIdList: this.custMarkChangeForm.tagIdList,
                    effectiveEndDate: ("" == this.custMarkChangeForm.effectiveEndString)? "" : MomentUtil.transformRocYearMonthDay(this.custMarkChangeForm.effectiveEndString),
                    effectiveStartDate: MomentUtil.transformRocYearMonthDay(this.custMarkChangeForm.effectiveStartString),
                }
                this.$custMarkApi.createUsingPOST(creation)
                .then(()=>{
                    //特殊保戶註記新增成功
                    MessageUtil.messageSuccess(this.$t('custMark_addSuccess').toString());
                }).catch((err)=>{
                    //特殊保戶註記新增失敗
                    ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());
                    hasError = true;
                }).finally(()=>{
                    LoadingUtil.close();
                    if(!hasError){
                        this.$emit("reloadData");
                    }
                })
            }else{
                LoadingUtil.show();
                let update : CustMarkUpdate = {
                    custMarkId: this.custMarkChangeForm.custMarkId,
                    custId: this.custMarkChangeForm.custId.toUpperCase(),
                    nationality: this.custMarkChangeForm.nationality,
                    custName: this.custMarkChangeForm.name,
                    content: this.custMarkChangeForm.content,
                    handled: this.custMarkChangeForm.handled,
                    languageIdList: this.custMarkChangeForm.languageIdList,
                    tagIdList: this.custMarkChangeForm.tagIdList,
                    effectiveEndDate: ("" == this.custMarkChangeForm.effectiveEndString)? "" : MomentUtil.transformRocYearMonthDay(this.custMarkChangeForm.effectiveEndString),
                    effectiveStartDate: MomentUtil.transformRocYearMonthDay(this.custMarkChangeForm.effectiveStartString),
                }
                this.$custMarkApi.updateUsingPOST(update)
                .then(()=>{
                    //特殊保戶註記更新成功
                    MessageUtil.messageSuccess(this.$t('custMark_updateSuccess').toString());
                }).catch((err)=>{
                    //特殊保戶註記更新失敗
                    ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());
                    hasError = true;
                }).finally(()=>{
                    LoadingUtil.close();
                    if(!hasError){
                        this.$emit("reloadData");
                    }
                })
            } 
        }
    }

    //重設表單
    reset(){
        this.clearFormStatus();
        this.custMarkChangeForm = {
            custMarkId: this.initData.custMarkId,
            nationality: this.initData.nationality,
            custId: this.initData.custId,
            name: this.initData.name,
            languageIdList: this.initData.languageIdList,
            tagIdList: this.initData.tagIdList,
            content: this.initData.content,
            handled: this.initData.handled,
            isAffective: this.initData.isAffective,
            createId: this.initData.createId,
            createName: this.initData.createName,
            createTime: this.initData.createTime,
            updateId: this.initData.updateId,
            updateName: this.initData.updateName,
            updateTime: this.initData.updateTime,
            effectiveStartDate: this.initData.effectiveStartDate,
            effectiveEndDate: this.initData.effectiveEndDate,
            effectiveStartString: this.initData.effectiveStartString,
            effectiveEndString: this.initData.effectiveEndString,
        };
        this.custMarkChangeForm.datePickerEffectiveStartDate = new Date(this.initData.effectiveStartDate);
        this.custMarkChangeForm.datePickerEffectiveEndDate = new Date(this.initData.effectiveEndDate);
        this.isDateEndVisible = false;
        this.isDateStartVisible = false;
        if("" == this.custMarkChangeForm.custMarkId){
            this.isEdit = false;
            this.custMarkChangeForm.nationality = 'native';
            this.isEdited = true;
        }else{
            this.isEdit = true;
            this.isEdited = false;
        }
    }

    //表單送出前的驗證
    validateSubmit(){
        let validate = true;
        let startAndEndValidate = true;
        this.validateCustId(null,this.custMarkChangeForm.custId,()=>{
            if(this.custMarkValidateForm.custId.state == 'error'){
                validate = false;
            }
        });
        this.validateNationality(null,this.custMarkChangeForm.nationality,()=>{
            if(this.custMarkValidateForm.nationality.state == 'error'){
                validate = false;
            }
        });
        this.validateName(null,this.custMarkChangeForm.name,()=>{
            if(this.custMarkValidateForm.name.state == 'error'){
                validate = false;
            }
        });
        this.validateContent(null,this.custMarkChangeForm.content,()=>{
            if(this.custMarkValidateForm.content.state == 'error'){
                validate = false;
            }
        });
        this.validateEffectiveStartDate(null,this.custMarkChangeForm.effectiveStartString,()=>{
            if(this.custMarkValidateForm.effectiveStartDate.state == 'error'){
                validate = false;
                startAndEndValidate = false;
            }
        });
        if(startAndEndValidate && "" != this.custMarkChangeForm.effectiveEndString){
            this.validateStartAndEndDate(null, this.custMarkChangeForm.datePickerEffectiveStartDate, this.custMarkChangeForm.datePickerEffectiveEndDate, () => {
                if (this.custMarkValidateForm.effectiveEndDate.state == 'error' || this.custMarkValidateForm.effectiveStartDate.state == 'error') {
                    validate = false;
                }
            });
        }
        if(validate){
            if(this.custMarkChangeForm.tagIdList.length == 0 && this.custMarkChangeForm.languageIdList.length ==0){
                // 語言與客戶標籤 須擇一填寫
                ErrorModalUtil.modalError(this.$t('custMark_tagAndLanguageError').toString())
                validate = false;
            }
        }
        this.isDateStartVisible = false;
        return validate;
    }

    //checkbox勾選時
    onLanguageChange(checkedValues) {
        this.isEdited = true;
        this.custMarkChangeForm.languageIdList = checkedValues;
    }

    onTagChange(checkedValues) {
        this.isEdited = true;
        this.custMarkChangeForm.tagIdList = checkedValues;
    }

    //清除表單狀態
    clearFormStatus(){
        this.feildValidate(this.custMarkValidateForm.nationality,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.custId,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.name,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.effectiveEndDate,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.content,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.tagIdList,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.languageIdList,false,"success","","");
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >=0
        );
    }

    //日期選擇器(起)，自動轉為字串更新搜尋條件
    onStartChange(date) {
        this.isEdited = true;
        this.custMarkChangeForm.effectiveStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.custMarkChangeForm.datePickerEffectiveStartDate = date;
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.effectiveEndDate,false,"success","","");
    }

    //日期選擇器(訖)，自動轉為字串更新搜尋條件
    onEndChange(date) {
        this.isEdited = true;
        this.custMarkChangeForm.effectiveEndString  = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.custMarkChangeForm.datePickerEffectiveEndDate = date;
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
        this.feildValidate(this.custMarkValidateForm.effectiveEndDate,false,"success","","");
    }

    //清除日期
    clearStartDate(){
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
        this.isDateStartVisible = false;
        this.custMarkChangeForm.effectiveStartString = "";
        this.custMarkChangeForm.effectiveStartDate = null;
        this.custMarkChangeForm.datePickerEffectiveStartDate = null;
    }

    //清除日期
    clearEndDate(){
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.effectiveEndDate,false,"success","","");
        this.isDateEndVisible = false;
        this.custMarkChangeForm.effectiveEndString = "";
        this.custMarkChangeForm.effectiveEndDate = null;
        this.custMarkChangeForm.datePickerEffectiveEndDate = null;
    }

    /**
     * 確保Tooltip在日期正確時確實隱藏
     */
    eventMouseOverStart() {
        if (this.custMarkValidateForm.effectiveStartDate.feedback) {
            this.isDateStartVisible = true;
        } else {
            this.isDateStartVisible = false;
        }
    }
    eventMouseOverEnd() {
        if (this.custMarkValidateForm.effectiveEndDate.feedback) {
            this.isDateEndVisible = true;
        } else {
            this.isDateEndVisible = false;
        }
    }

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //國籍驗證
    validateNationality(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.nationality,true,"","","");
        if (!ValidationUtil.isEmpty(value)) {
            this.feildValidate(this.custMarkValidateForm.nationality,false,"success","","");
            callback();
        } else {
            // 客戶國籍 必填
            this.feildValidate(this.custMarkValidateForm.nationality,true,"error","hover",this.$t('custMark_nationalityRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //身分證字號驗證
    validateCustId(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.custId,true,"","","");
        if (!ValidationUtil.isEmpty(value)) {
            if(ValidationUtil.idNoValidation(value)){
                if("native" == this.custMarkChangeForm.nationality){
                    //本國人 法定格式驗證
                    if(ValidationUtil.idNoNativeValidation(value)){
                        this.feildValidate(this.custMarkValidateForm.custId,false,"success","","");
                    }else{
                        // 客戶身分證字號 格式有誤
                        this.feildValidate(this.custMarkValidateForm.custId,true,"error","hover",this.$t('custMark_custIdFormatError').toString());
                        callback(() => { });
                    }
                }else{
                    //外國人 英數驗證
                    if(this.custMarkChangeForm.custId.length >10){
                        //客戶身分證字號 不可超過十個字
                        this.feildValidate(this.custMarkValidateForm.custId,true,"error","hover",this.$t('custMark_custIdOverTen').toString());
                        callback(() => { });
                    }else{
                        this.feildValidate(this.custMarkValidateForm.custId,false,"success","","");
                    }
                }
            }else{
                // 客戶身分證字號 格式有誤
                this.feildValidate(this.custMarkValidateForm.custId,true,"error","hover",this.$t('custMark_custIdFormatError').toString());
                callback(() => { });
            }
        } else {
            // 客戶身分證字號 必填
            this.feildValidate(this.custMarkValidateForm.custId,true,"error","hover",this.$t('custMark_custIdRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //姓名驗證
    validateName(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.name,true,"","","");
        if (!ValidationUtil.isEmpty(value)) {
            if(this.custMarkChangeForm.name.length >100){
                //姓名 不可超過100字元
                this.feildValidate(this.custMarkValidateForm.name,true,"error","hover",this.$t('custMark_nameNotOver100').toString());
            }else{
                this.feildValidate(this.custMarkValidateForm.name,false,"success","","");
            }
        } else {
            // 姓名 必填
            this.feildValidate(this.custMarkValidateForm.name,true,"error","hover",this.$t('global_humanNameRequired').toString());
            
            callback(() => { });
        }
        callback();
    }

    //內容驗證
    validateContent(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.content,true,"","","");
        if(this.custMarkChangeForm.tagIdList.length>0){
            if (!ValidationUtil.isEmpty(value)) {
                this.feildValidate(this.custMarkValidateForm.content,false,"success","","");
            } else {
                // 內容 必填
                this.feildValidate(this.custMarkValidateForm.content,true,"error","hover",this.$t('custMark_contentRequired').toString());
                callback(() => { });
            }
        }else{
            this.feildValidate(this.custMarkValidateForm.content,false,"success","","");
        }
        callback();
    }

    //有效區間 起 驗證
    validateEffectiveStartDate(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,true,"","","");
        if (!ValidationUtil.isEmpty(value)) {
            this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
            callback();
        } else {
            this.isDateStartVisible = true;
            // 有效區間(起) 必填"
            this.feildValidate(this.custMarkValidateForm.effectiveStartDate,true,"error","hover",this.$t('custMark_activeStartRequired').toString());
            callback(() => { });
        }
        callback();
    }

    //有效區間 訖 驗證
    validateEffectiveEndDate(rule, value, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
        callback();
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputStartDate(data: any) {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.isEdited = true;
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if(!VlidationUtil.isEmpty(data.currentTarget.value) && VlidationUtil.isEmpty(parseDate)){
            this.isDateStartVisible = true;
        }
        if(parseDate){
            this.custMarkChangeForm.effectiveStartDate = parseDate ? parseDate : this.custMarkChangeForm.effectiveStartDate;
            this.custMarkChangeForm.effectiveStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.custMarkChangeForm.effectiveStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
        }
    }

    /**
     * 手動輸入結束日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputEndDate(data: any) {
        this.isDateEndVisible = false;
        this.isDateStartVisible = false;
        this.isEdited = true;
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if(!VlidationUtil.isEmpty(data.currentTarget.value) && VlidationUtil.isEmpty(parseDate)){
            this.isDateEndVisible = true;
        }
        if(parseDate){
            this.custMarkChangeForm.effectiveEndDate = parseDate ? parseDate : this.custMarkChangeForm.effectiveEndDate;
            this.custMarkChangeForm.effectiveEndString = parseDate ?
                MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.custMarkChangeForm.effectiveEndDate.toString()))) :
                data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
        }
        if(VlidationUtil.isEmpty(data.currentTarget.value)){
            this.custMarkChangeForm.effectiveEndDate = null;
            this.custMarkChangeForm.effectiveEndString = "";
        }
    }

    /**
    * 起訖日期驗證
    * @param rule 驗證規則 
    * @param startTime 起始日期
    * @param endTime 結束日期 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateStartAndEndDate(rule, startDate, endDate, callback) {
        this.isEdited = true;
        this.feildValidate(this.custMarkValidateForm.effectiveStartDate,true,"","","");
        this.feildValidate(this.custMarkValidateForm.effectiveEndDate,true,"","","");
        if (this.custMarkChangeForm.effectiveStartString == this.custMarkChangeForm.effectiveEndString || moment(startDate).isBefore(endDate)) {
            this.feildValidate(this.custMarkValidateForm.effectiveStartDate,false,"success","","");
            this.feildValidate(this.custMarkValidateForm.effectiveEndDate,false,"success","","");
            callback();
        } else {
            this.isDateEndVisible = true;
            this.isDateStartVisible = true;
            // 請輸入正確的起訖日期
            this.feildValidate(this.custMarkValidateForm.effectiveStartDate,true,"error","hover",this.$t('global_pleaseInputCorrectStartAndEndDate').toString());
            this.feildValidate(this.custMarkValidateForm.effectiveEndDate,true,"error","hover",this.$t('global_pleaseInputCorrectStartAndEndDate').toString());
            callback(() => { });
        }
        callback();
    }

    //處理方法 驗證
    validateHandled(rule, value, callback) {
        this.isEdited = true;
        callback();
    }

    //取得表單是否已編輯
    getIsEdit(){
        return this.isEdited;
    }

    //客戶國籍選項變動時
    onNationalityChange(){
        this.validateCustId(null, this.custMarkChangeForm.custId, () => { });
    }
}