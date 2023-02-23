import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import "@/assets/less/pendingPage.less";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FileGrid } from "@/components/shared/uploadFileList/model";
import UploadFileListForm from "@/components/shared/uploadFileList/UploadFileListForm.vue";
import { LoginModule } from "@/plugins/store/LoginModule";
import { CheckShiftAndSkillInputDto, CheckShiftAndSkillOutputDto, ComponentDto, OutputErrorCodeDto, PendingGrid, PendingListDto, PolicyMarkDto, StaffDto } from "@fubonlife/obd-api-axios-sdk";
import { message, Modal, TimePicker } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder } from "../../data-grid/models";
import { FeildValidation, policyMaskFormDto, policyMaskValidateForm, SelectOption } from "./model";
import { AuthComonent } from "@/assets/config/CommonUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";

@Component({
    components: { FblDataGrid, TimePicker, UploadFileListForm }
})
export default class UserSkillsSettingForm extends Vue {
    @Prop()
    public selectDeptOptionsProp: SelectOption[];
    @Prop()
    public unitDepInfo;
    @Prop()
    public selectPolicyLevelOptions: SelectOption[];
    @Prop()
    public isMarkReboot;
    @Prop()
    public policyList;
    @Prop()
    public checkedCaseNoList;

    selectDeptOptions: SelectOption[] = [];

    @Watch("policyList")
    onInitDataChanged(): void {
        if(!VlidationUtil.isEmpty(this.policyList)){
            this.reload();
        }
    }

    fileList: FileGrid[] =[];

    selectDiviOptions: SelectOption[] = [];
    selectTmrOptions: SelectOption[] = [];
    selectLevelOptions: SelectOption[] = [];

    isLevelDisable: boolean = false;
    isContactTimeDisable: boolean = false;
    isTimePickerShow: boolean = false;

    departmentName: string = "";
    divisionName: string = "";
    defaultDepartmentId: string = "VPP00";
    
    //案件註記表單
    policyMaskForm: policyMaskFormDto = {
        isReboot: false,
        departmentId: "",
        divisionId: "",
        tmrId: "",
        contactDate: null,
        contactString: "",
        caseLevelId: "",
        convenientContactStartTime: null,
        convenientContactEndTime: null,
        convenientContactStartString: "",
        convenientContactEndString: "",
        custMark: "",
        markReason: "",
    };

    checkSkillAndShiftReturnInfo: CheckShiftAndSkillOutputDto[] = [];

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    //日期選擇器hover是否顯示
    isContactDateVisible: boolean = false;
    isTimeStartVisible: boolean = false;
    isTimeEndVisible: boolean = false;

    //時間選擇器是否顯示
    isConvenientContactStartOpen: boolean = false;
    isConvenientContactEndOpen: boolean = false;

    //欄位驗證提示工具
    policyMaskValidateForm :policyMaskValidateForm = {
        departmentId: { hover: "", feedback: false, state: "", msg: "" },
        divisionId: { hover: "", feedback: false, state: "", msg: "" },
        tmrId: { hover: "", feedback: false, state: "", msg: "" },
        contactDate: { hover: "", feedback: false, state: "", msg: "" },
        caseLevelId: { hover: "", feedback: false, state: "", msg: "" },
        convenientContactStartTime: { hover: "", feedback: false, state: "", msg: "" },
        convenientContactEndTime: { hover: "", feedback: false, state: "", msg: "" },
        custMark: { hover: "", feedback: false, state: "", msg: "" },
        markReason: { hover: "", feedback: false, state: "", msg: "" },
    }

    // 搜尋欄位驗證方式
    policyMaskFormRules: { [key: string]: ValidationRule[] } = {
        convenientContactStartTime: [{ validator: this.validateTimeStart, trigger: "blur" }],
        convenientContactEndTime: [{ validator: this.validateTimeEnd, trigger: "blur" }],
        markReason: [{ validator: this.validateMarkReason, trigger: "blur" }],
        custMark: [{ validator: this.validateMark, trigger: "blur" }],
    };

    // 畫面元件
    authComponent: AuthComonent ={
        PENDING_MARK_TMR : {
            show: false,
            enable: false
        }
    };

    //建立表單
    created(){
        LoadingUtil.show();
        this.selectLevelOptions = JSON.parse(JSON.stringify(this.$props.selectPolicyLevelOptions));
        this.selectDeptOptions = JSON.parse(JSON.stringify(this.$props.selectDeptOptionsProp));
        this.selectDeptOptions.push({ label: "", value: '' });
        this.selectDeptOptions.reverse();
        this.selectLevelOptions.find((option)=> ValidationUtil.isEmpty(option.value)).label = "";
        this.selectLevelOptions = this.selectLevelOptions.filter((option)=> option.value !='2');
        // 取得畫面元件權限
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
        .then((res: AxiosResponse<ComponentDto>) => {
            if (res.data.component) {
                this.authComponent.PENDING_MARK_TMR = ValidationUtil.isEmpty(res.data.component.PENDING_MARK_TMR) ? this.authComponent.PENDING_MARK_TMR : res.data.component.PENDING_MARK_TMR;
            }
            LoadingUtil.close();
            this.reload();
        }).catch((err) => {
            LoadingUtil.close();
            console.log(err);
        });
    }

    //重整表單
    reload(){
        this.policyMaskForm = {
            isReboot: this.$props.isMarkReboot,
            departmentId: "",
            divisionId: "",
            tmrId: "",
            contactDate: null,
            contactString: "",
            caseLevelId: "",
            convenientContactStartTime: null,
            convenientContactEndTime: null,
            convenientContactStartString: "",
            convenientContactEndString: "",
            custMark: "",
            markReason: "",
        };
        this.isLevelDisable = false;
        this.isContactTimeDisable = false;
        this.isTimePickerShow = false;
        this.feildValidate(this.policyMaskValidateForm.departmentId, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.divisionId, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.tmrId, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.caseLevelId, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.custMark, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.markReason, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.contactDate, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime, false, "success", "", "");
        this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime, false, "success", "", "");
        this.grid.data = this.$props.policyList;
        if(this.$props.isMarkReboot && this.grid.data.length >=1 && !ValidationUtil.isEmpty(this.grid.data[0].tmrId)){
            //案件重啟須帶出結案人員資訊 若多筆案件結案人員不同 則留空
            let tmrIdIsChange = false;
            let tmrId = this.grid.data[0].tmrId;
            this.grid.data.forEach((row)=>{
                if(tmrId != row.tmrId){
                    tmrIdIsChange = true;
                }
            })
            if(!tmrIdIsChange){
                this.policyMaskForm.departmentId = this.grid.data[0].tmrDeptId;
                this.onSelectDept();
                this.policyMaskForm.divisionId = this.grid.data[0].tmrUnitId;
                this.onSeletDivi();
                this.policyMaskForm.tmrId = this.grid.data[0].tmrId;
            }else{
                this.policyMaskForm.departmentId = this.defaultDepartmentId;
            }
        }else{
            this.policyMaskForm.departmentId = this.defaultDepartmentId;
            this.onSelectDept();
            this.onSeletDivi();
        }
        this.fileList = [];
    }

    // 計算欄位寬度要顯示幾個字(全形中文)
    countColumnWidth(number){
        return (Number(number + 1))*14 +16;
    }

    // 待電訪查詢結果顯示設定
    grid: FblPDataGridHolder<PendingListDto> = {
        rowKey: "caseNo",
        data: [],
        scroll: {x:500,y:300},
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "packNo",
                title: this.$t('pedding_packNo').toString(), //名單序號
                formatter: (data: PendingGrid) => {
                    if(data.packNo == null){
                        return "";
                    }else{
                        return data.packNo;
                    }
                },
                width: 80
            },
            {
                type: FblColumnType.PLAIN,
                property: "policyNo",
                title: this.$t('pedding_policyNo').toString(), //保單號碼
                width: 110
            },
            {
                type: FblColumnType.PLAIN,
                property: "taskName",
                title: this.$t('pedding_contactItem').toString(), //電訪項目
                width: 90
            },
            {
                type: FblColumnType.PLAIN,
                property: "typeName",
                title: this.$t('pedding_mark_custType').toString(), //身分
                width: 90
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "name",
                title: this.$t('pedding_custName').toString(), //受訪者姓名
                width: this.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactResult",  //連絡結果
                title: this.$t('pedding_contactResult').toString(),
            },
            {
                type: FblColumnType.PLAIN,
                property: "pendingResult", //電訪結果
                title: this.$t('pedding_pendingResult').toString(),
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseCloseReason", //結案原因
                title: this.$t('pedding_caseCloseReason').toString(),
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseStatus",
                title: this.$t('pedding_caseStatus').toString(), //案件狀態
                width: 80,
            },
        ]
    };

    //===========================方便連絡日 相關方法 start ==========================================

    //自動轉為字串更新搜尋條件
    onContactDateChange(date){
        this.policyMaskForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isContactDateVisible = false;
        this.feildValidate(this.policyMaskValidateForm.contactDate,false,"success","","");
        if(ValidationUtil.isEmpty(this.policyMaskForm.contactString)){
            this.isTimePickerShow = false;
        }else{
            this.isTimePickerShow = true;
            this.isLevelDisable = true;
            this.validateTimeStart();
        }
    }

    //清除日期
    clearContactDate(){
        this.feildValidate(this.policyMaskValidateForm.contactDate,false,"success","","");
        this.isContactDateVisible = false;
        this.isLevelDisable = false;
        this.policyMaskForm.contactString = "";
        this.policyMaskForm.contactDate = null;
        this.policyMaskForm.convenientContactStartString = "";
        this.policyMaskForm.convenientContactStartTime = null;
        this.policyMaskForm.convenientContactEndString = "";
        this.policyMaskForm.convenientContactEndTime = null;
        this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,false,"success","","");
        this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,false,"success","","");
        this.isTimePickerShow = false;
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
     checkManualInputContactDate(data: any) {
        this.isContactDateVisible = false;
        this.feildValidate(this.policyMaskValidateForm.contactDate,true,"","","");
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.feildValidate(this.policyMaskValidateForm.contactDate,false,"success","","");
        } else {
            this.isContactDateVisible = true;
            // 日期錯誤
            this.feildValidate(this.policyMaskValidateForm.contactDate,true,"error","hover",this.$t('global_date').toString() + this.$t('global_error').toString());
        }
        this.policyMaskForm.contactDate = parseDate ? parseDate : this.policyMaskForm.contactDate;
        this.policyMaskForm.contactString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.policyMaskForm.contactDate.toString()))) :
        data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 確保Tooltip在日期正確時確實隱藏
     */
     eventMouseOverContactDate() {
        if (this.policyMaskValidateForm.contactDate.feedback) {
            this.isContactDateVisible = true;
        } else {
            this.isContactDateVisible = false;
        }
    }
    //===========================方便連絡日 相關方法 end ==========================================

    //===========================時間選擇器 相關方法 start ==========================================

    clickConvenientContactStartTimePicker(open){
        this.isConvenientContactStartOpen = open;
    }

    clickConvenientContactEndTimePicker(open){
        this.isConvenientContactEndOpen = open;
    }

    //選擇時間後，將時間更新
    onConvenientContactStartTimeChange(date, timeString) {
        this.isTimeStartVisible = false;
        this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,false,"success","","");
        this.policyMaskForm.convenientContactStartString = timeString;
        this.policyMaskForm.convenientContactEndTime = this.policyMaskForm.convenientContactStartTime;
        this.policyMaskForm.convenientContactEndString = this.policyMaskForm.convenientContactStartString;
        this.validateTimeStart();
    }
    
    onConvenientContactEndTimeChange(date, timeString) {
        this.isTimeEndVisible = false;
        this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,false,"success","","");
        this.policyMaskForm.convenientContactEndString = timeString;
        this.validateTimeEnd();
    }

    closeConvenientContactStartTimePicker() {
        this.isConvenientContactStartOpen = false;
    }

    closeConvenientContactEndTimePicker() {
        this.isConvenientContactEndOpen = false;
    }

    //===========================時間選擇器 相關方法 end ==========================================

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >=0
        );
    }

    /**
     * 選擇部門時，科別範圍限縮
     */
    onSelectDept(){
        this.feildValidate(this.policyMaskValidateForm.tmrId, false, "success", "", "");
        this.selectDiviOptions = [{ label: "", value: '' }];
        this.selectTmrOptions = [{ label: "", value: '' }];
        this.policyMaskForm.divisionId = "";
        this.policyMaskForm.tmrId = "";
        if (!ValidationUtil.isEmpty(this.policyMaskForm.departmentId)) {
            if(!ValidationUtil.isEmpty(this.unitDepInfo.depUnitInfo[this.policyMaskForm.departmentId])){
                this.selectDiviOptions = this.selectDiviOptions.concat(this.unitDepInfo.depUnitInfo[this.policyMaskForm.departmentId]);
            }
           
            // 取得部門對應人員
            if(!ValidationUtil.isEmpty(this.unitDepInfo.depUserInfo[this.policyMaskForm.departmentId])) {
            this.selectTmrOptions = this.selectTmrOptions.concat(this.unitDepInfo.depUserInfo[this.policyMaskForm.departmentId]);
          }

        } else {
            this.policyMaskForm.divisionId = "";
            this.policyMaskForm.tmrId = "";
            // 科別 下拉
            this.selectDiviOptions = Object.assign(this.unitDepInfo.unitList);
            
            // 電訪員 下拉
            this.selectTmrOptions = Object.assign(this.unitDepInfo.userList);

        }
    }

    /**
     * 選擇科別時，電訪員範圍限縮
     */
     onSeletDivi(){
        this.feildValidate(this.policyMaskValidateForm.tmrId, false, "success", "", "");
        this.selectTmrOptions = [{ label: "", value: '' }];
        this.policyMaskForm.tmrId = "";
        if (!ValidationUtil.isEmpty(this.policyMaskForm.divisionId)) {
            // 取得科別對應人員
            if(!ValidationUtil.isEmpty(this.unitDepInfo.unitUserInfo[this.policyMaskForm.divisionId])) {
            this.selectTmrOptions = this.selectTmrOptions.concat(this.unitDepInfo.unitUserInfo[this.policyMaskForm.divisionId]);
            }
        } else {
            this.policyMaskForm.tmrId = "";
            // 有選擇部門
            if (!ValidationUtil.isEmpty(this.policyMaskForm.departmentId)) {
                // 取得部門對應人員
                if(!ValidationUtil.isEmpty(this.unitDepInfo.depUserInfo[this.policyMaskForm.departmentId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.unitDepInfo.depUserInfo[this.policyMaskForm.departmentId]);
                }
                
            } else {
                // 電訪員 下拉
                this.selectTmrOptions = Object.assign(this.unitDepInfo.userList);
            }
        }
    }

    //電訪員選項異動時
    onSelectTmr(){
        this.feildValidate(this.policyMaskValidateForm.tmrId, false, "success", "", "");
    }

    //案件等級選取變動
    onLevelChange(){
        if(ValidationUtil.isEmpty(this.policyMaskForm.caseLevelId)){
            this.isContactTimeDisable = false;
        }else{
            this.isContactTimeDisable = true;
        }
    }

    //表單送出
    onFormSubmit(){
       if(this.validateSubmit()){
           this.validateCustMark();
        }
    }

    //取得方便連絡時段時間
    getContactDateTime(time, addMinute){
        if(time == null){
            return null
        }else{
            return moment(this.policyMaskForm.contactDate).set('hour',time.hour()).set('minute',time.minute()+ addMinute).format("YYYY-MM-DD HH:mm");
        }
    }

    //將陣列轉成字串，以逗號區隔
    changeListIntoString(list:string[]){
        let s = "";
        let count = 0;
        list.forEach((item)=>{
            count ++;
            s = s + item;
            if(count != list.length){
                s = s + "、";
            }
        })
        return s;
    }

    //執行儲存
    policyMarkSave(){
        let start = this.getContactDateTime(this.policyMaskForm.convenientContactStartTime,0);
        let end = this.getContactDateTime(this.policyMaskForm.convenientContactEndTime,0);
        let submitData: PolicyMarkDto = {
            isReboot: this.policyMaskForm.isReboot,
            departmentId: ValidationUtil.isEmpty(this.policyMaskForm.tmrId)? null : this.policyMaskForm.departmentId,
            divisionId: ValidationUtil.isEmpty(this.policyMaskForm.tmrId)? null : this.policyMaskForm.divisionId,
            tmrId: this.policyMaskForm.tmrId,
            caseLevelId: this.policyMaskForm.caseLevelId,
            caseMark: this.policyMaskForm.custMark,
            markReason: this.policyMaskForm.markReason,
            fileList: (this.$refs.uploadFileListForm as any).getFileList(),
            caseNoList: this.checkedCaseNoList,
            contactTimeStart: start,
            contactTimeEnd: end,
        }
        LoadingUtil.show();
        this.$pendingPageApi.savePolicyMarkUsingPOST(submitData).then((resp)=>{
            if(!resp.data.success){
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t('pedding_mark_save_failed').toString()); //儲存失敗
            }else{
                LoadingUtil.close();
                MessageUtil.messageSuccess(this.$t('global_save_success').toString()) //儲存成功
                this.reload();
                this.$emit("reloadData");
            }
        }).catch((err)=>{
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('pedding_mark_save_failed').toString()); //儲存失敗
        })
    }

    // 驗證表單內容
    validateSubmit(){
        let validate = true;
        this.validateMarkReason(null,this.policyMaskForm.markReason,()=>{
            if(this.policyMaskValidateForm.markReason.state == 'error'){
                validate = false;
            }
        });
        if(this.policyMaskValidateForm.tmrId.state == 'error'){
            return false;
        }
        if(this.policyMaskValidateForm.custMark.state == 'error'){
            return false;
        }
        if(!ValidationUtil.isEmpty(this.policyMaskForm.contactString) &&(ValidationUtil.isEmpty(this.policyMaskForm.convenientContactStartString) || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactEndString))){
            this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,true,"error","hover",this.$t('pedding_mark_time_required').toString()); // 時間起迄皆不可為空值
            this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,true,"error","hover",this.$t('pedding_mark_time_required').toString()); // 時間起迄皆不可為空值
            return false;
        }
        if(!this.validateIsEachEmpty()){
            if(this.policyMaskForm.isReboot){
                if(ValidationUtil.isEmpty(this.policyMaskForm.caseLevelId) && (
                    ValidationUtil.isEmpty(this.policyMaskForm.contactString) 
                    || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactStartString)
                    || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactEndString)
                )){
                    //【案件等級】與【方便聯絡時段】須擇一設定，不得為空值
                    ErrorModalUtil.modalError(this.$t('pedding_mark_alert_caseLevel_time').toString())
                    validate = false;
                }
            }
            if(!ValidationUtil.isEmpty(this.policyMaskForm.contactString)){
                let start = this.getContactDateTime(this.policyMaskForm.convenientContactStartTime,0);
                let end = this.getContactDateTime(this.policyMaskForm.convenientContactEndTime,0);
                if(start == end){
                    validate = false;
                    // 起訖時間有誤
                    this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,true,"error","hover",this.$t('pedding_start_and_end_error').toString());
                    this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,true,"error","hover",this.$t('pedding_start_and_end_error').toString());
                }
                if(this.policyMaskValidateForm.convenientContactStartTime.state == 'error' || this.policyMaskValidateForm.convenientContactEndTime.state == 'error'){
                    validate = false;
                }
            }
        }else{
            validate = false;
            if(this.authComponent.PENDING_MARK_TMR.show){
                // 指定電訪員、調整案件等級、設定方便連絡時段、附件上傳至少要執行一項
                ErrorModalUtil.modalError(this.$t('pedding_mark_at_less_one').toString());
            }else{
                // 調整案件等級、設定方便連絡時段、附件上傳至少要執行一項
                ErrorModalUtil.modalError(this.$t('pedding_mark_at_less_one_noTmr').toString());
            }
            
        }

        return validate;
    }

    //當案件註記不為空的驗證
    validateCustMark(){
        if(!ValidationUtil.isEmpty(this.policyMaskForm.custMark)){
            if(ValidationUtil.isEmpty(this.policyMaskForm.caseLevelId) && (
                ValidationUtil.isEmpty(this.policyMaskForm.contactString) 
                || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactStartString)
                || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactEndString)
            )){
                Modal.confirm({
                    class: "error-modal-util-class",
                    // 請確認案件等級或方便聯絡時段是否須設定?
                    content: this.$t('pedding_mark_confirm_caseLevel_time').toString(),
                    okText: this.$t('global_yes').toString(), //是
                    cancelText: this.$t('global_no').toString(),  //否
                    icon: 'info-circle',
                    onOk: () => {
                    },
                    onCancel: () => {
                        //檢核電訪員/方便連絡時段相關資訊
                        this.checkAllSkillAndShiftInfo();
                     },
                });
            }else{
                //檢核電訪員/方便連絡時段相關資訊
                this.checkAllSkillAndShiftInfo();
            }
        }else{
            //檢核電訪員/方便連絡時段相關資訊
            this.checkAllSkillAndShiftInfo();
        }
    }

    //檢核電訪員/方便連絡時段相關資訊
    checkAllSkillAndShiftInfo(){
        let input: CheckShiftAndSkillInputDto = {
            caseNoList : this.checkedCaseNoList,
            start : this.getContactDateTime(this.policyMaskForm.convenientContactStartTime,0),
            end : this.getContactDateTime(this.policyMaskForm.convenientContactEndTime,0),
            tmrId: this.policyMaskForm.tmrId
        }
        LoadingUtil.show();
        this.$pendingPageApi.checkShiftAndSkillUsingPOST(input).then((resp)=>{
            this.checkSkillAndShiftReturnInfo = resp.data;
            //招攬人相同的案件
            let unMatchAgentRuleList = this.checkSkillAndShiftReturnInfo.filter((item)=>!item.matchedAgentRule);
            //電訪項目技能不符的案件
            let unMatchTaskSkill = this.checkSkillAndShiftReturnInfo.filter((item)=>!item.matchedTaskSkill);
            //特保註記技能不符的案件
            // let unMatchCustSkill = this.checkSkillAndShiftReturnInfo.filter((item)=>!item.matchedCustSkill);
            //當班時段不符的案件
            let unMatchShift = this.checkSkillAndShiftReturnInfo.filter((item)=>!item.matchedShift);
            if(!VlidationUtil.isEmpty(this.policyMaskForm.tmrId) && unMatchAgentRuleList && !ValidationUtil.isEmpty(unMatchAgentRuleList)){
                //招攬人錯誤訊息
                this.showAgentErrorMsg(unMatchAgentRuleList)
            }else{
                if(unMatchTaskSkill && !ValidationUtil.isEmpty(unMatchTaskSkill)){
                    //技能錯誤訊息
                    this.showTaskErrorMsg(unMatchTaskSkill,unMatchShift);
                }else if(unMatchShift && !ValidationUtil.isEmpty(unMatchShift)){
                    //回大眾池訊息
                    this.showShiftErrorMsg(unMatchShift);
                }else {
                    //執行儲存
                    this.policyMarkSave();
                }
            }
        }).catch((err)=>{
            // 檢核指定電訪員技能、班別、案件招攬人失敗
            ErrorModalUtil.modalError(this.$t("pedding_mark_checkSkillAndShiftFailed").toString())
        }).finally(()=>{
            LoadingUtil.close();
        })
    }

    //電訪項目技能與電訪員不符合提示訊息
    showTaskErrorMsg(unMatchTaskSkill, unMatchShift){
        let policyNoList = [];
        let changeNoList = [];
        unMatchTaskSkill.forEach((casePolicy)=>{
            if(!ValidationUtil.isEmpty(casePolicy.casePolicy)){
                policyNoList.push(casePolicy.casePolicy);
            }else{
                changeNoList.push(casePolicy.changeNo);
            }
        })
        Modal.confirm(
            {
                class: "error-modal-util-class",
                title: () => this.$t("global_information").toString(),//提示訊息
                okText: this.$t('global_yes').toString(), //是
                cancelText: this.$t('global_no').toString(),  //否
                content: (h) => {
                    let msgListWithPObject = [];
                    if(policyNoList.length>0){
                        msgListWithPObject.push(h('div', this.$t('pedding_policyNo').toString() +  "： ")); //保單號碼
                        msgListWithPObject.push(h('div',{ attrs: {
                            style: `color: blue;`,
                        }, }, this.changeListIntoString(policyNoList)));
                    }
                    if(changeNoList.length>0){
                        msgListWithPObject.push(h('div', this.$t('pedding_changeNo').toString() + "： ")); //受理案號
                        msgListWithPObject.push(h('div',{ attrs: {
                            style: `color: blue;`,
                        }, }, this.changeListIntoString(changeNoList)));
                    }
                    msgListWithPObject.push(h('div', this.$t('pedding_tmr_taskSkill_nuMatch').toString())); //電訪員未符合電訪項目技能，請確認是否指定？
                    msgListWithPObject.push(h('div',this.$t('pedding_mark_skillNotMatchedWarning').toString())); //若該電訪員技能不符且仍需指定,請調整該電訪員技能。
                    return h('div', {}, msgListWithPObject);
                },
                onOk: () => {
                    //確認忽略電訪項目不符 直接指定

                    if(unMatchShift && !ValidationUtil.isEmpty(unMatchShift)){
                        //回大眾池訊息
                        this.showShiftErrorMsg(unMatchShift);
                    }else{
                        //直接執行儲存
                        this.policyMarkSave();
                    }
                },
                onCancel: () => {
                    //清空指定電訪員
                    this.policyMaskForm.departmentId = "";
                    this.onSelectDept();
                },
            },  
        )
    }

    //電訪員於方便連絡時段不當班提示訊息
    showShiftErrorMsg(unMatchShift){
        let policyNoList = [];
        let changeNoList = [];
        unMatchShift.forEach((casePolicy)=>{
            if(!ValidationUtil.isEmpty(casePolicy.casePolicy)){
                policyNoList.push(casePolicy.casePolicy);
            }else{
                changeNoList.push(casePolicy.changeNo);
            }
        })
        Modal.confirm(
            {
                class: "error-modal-util-class",
                title: () => this.$t("global_information").toString(),//提示訊息
                okText: this.$t('global_yes').toString(), //是
                cancelText: this.$t('global_no').toString(),  //否
                content: (h) => {
                    let msgListWithPObject = [];
                    if(policyNoList.length>0){
                        msgListWithPObject.push(h('div', this.$t('pedding_policyNo').toString() +  "： ")); //保單號碼
                        msgListWithPObject.push(h('div',{ attrs: {
                            style: `color: blue;`,
                        }, }, this.changeListIntoString(policyNoList)));
                    }
                    if(changeNoList.length>0){
                        msgListWithPObject.push(h('div', this.$t('pedding_changeNo').toString() + "： ")); //受理案號
                        msgListWithPObject.push(h('div',{ attrs: {
                            style: `color: blue;`,
                        }, }, this.changeListIntoString(changeNoList)));
                    }
                    msgListWithPObject.push(h('div', this.$t('pedding_tmr_not_onShift').toString())); //指定電訪員於該方便聯絡時段非當班,是否要重新指定電訪員? 如不調整 ,案件將丟入大眾池中
                    return h('div', {}, msgListWithPObject);
                },
                onOk: () => {
                    //清空指定電訪員
                    this.policyMaskForm.departmentId = "";
                    this.onSelectDept();
                },
                onCancel: () => {
                    //直接執行儲存
                    this.policyMarkSave();
                },
            },  
        )
    }

    //招攬人與電訪員相同錯誤訊息
    showAgentErrorMsg(unMatchAgentRuleList){
        let policyNoList = [];
        let changeNoList = [];
        unMatchAgentRuleList.forEach((casePolicy)=>{
            if(!ValidationUtil.isEmpty(casePolicy.casePolicy)){
                policyNoList.push(casePolicy.casePolicy);
            }else{
                changeNoList.push(casePolicy.changeNo);
            }
        })
        Modal.error(
            {
                class: "error-modal-util-class",
                title: () => this.$t("global_error").toString(),//錯誤
                content: (h) => {
                    let msgListWithPObject = [];
                    if(policyNoList.length>0){
                        msgListWithPObject.push(h('div', this.$t('pedding_policyNo').toString() +  "： ")); //保單號碼
                        msgListWithPObject.push(h('div',{ attrs: {
                            style: `color: blue;`,
                        }, }, this.changeListIntoString(policyNoList)));
                    }
                    if(changeNoList.length>0){
                        msgListWithPObject.push(h('div', this.$t('pedding_changeNo').toString() + "： ")); //受理案號
                        msgListWithPObject.push(h('div',{ attrs: {
                            style: `color: blue;`,
                        }, }, this.changeListIntoString(changeNoList)));
                    }
                    msgListWithPObject.push(h('div', this.$t('pedding_tmr_conflict').toString())); //指定電訪員與保單業務員1或業務員2相同
                    return h('div', {}, msgListWithPObject);
                },
                onOk: () => {
                    this.feildValidate(this.policyMaskValidateForm.tmrId,true,"error","hover",this.$t('pedding_tmr_conflict').toString()); // 電訪員不可為保單業務員1或業務員2
                }
            }     
        )
    }

    //表單關閉
    onFormCancel(){
        let fileIdList: string[] = (this.$refs.uploadFileListForm as any).getFileNameList();
        if(fileIdList.length >0){
            this.$pendingPageApi.deletePolicyMarkAttachedFileInListUsingPOST(fileIdList).finally(()=>{
                this.reload();
            })
        }else{
            this.reload();
        }
    }

    //滑鼠移出cell，detail消失
    handleEllipsisMouseLeave() {
        message.destroy();
    }

    //滑鼠點擊該cell，顯示detail
    handleEllipsisClick($event, data) {
        message.destroy();
        message.config({
            duration: 0,
            top: `50px`,
        });
        message.info(data);
        //取得message 的html元件
        let antDesignMessage = document.getElementsByClassName('ant-message');
        //變更messae顯示位置
        MessageUtil.changePosition(antDesignMessage, $event.x, $event.y)
        message.config({
            duration: 3,
            top: `50px`,
        });
    }

    //編輯附件與註記
    editSingleFile(singleFile: FileGrid, editFileId: string, isChangeFile){
        let output: OutputErrorCodeDto = {
            success: false,
            returnMessage:"",
            apiErrorCode:null
        };

        let formData = new FormData();
        formData.append('fileId', editFileId);
        formData.append('fileRemark', singleFile.fileRemark);
        formData.append('isOnlyRemark', isChangeFile ? 'false' : 'true');
        if(isChangeFile){
            formData.append('file', singleFile.uploadData);
        }

        LoadingUtil.show();

        axios({
            method: 'post',
            url: `${process.env.VUE_APP_API_BASE_URL}/api/pendingPage/policyMarkAttachedFileUpdate`,
            data: formData,
            timeout: 3*60*1000,
        })
        .then((resp)=>{
            output = resp.data;
            LoadingUtil.close();
            if(output.success){

                if(!isChangeFile){
                    output.returnMessage = editFileId;
                }
                
                (this.$refs.uploadFileListForm as any).afterSingleUpload(output,singleFile);
            }else{
                ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
            }
        }).catch((err)=>{
            LoadingUtil.close();
            output.success = false;
            ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
        });
         
    }

    //新增附件與註記
    addSingleFile(singleFile: FileGrid){
        LoadingUtil.show();
        let output: OutputErrorCodeDto = {
            success: false,
            returnMessage:"",
            apiErrorCode:null
        };

        let formData = new FormData();
        formData.append('fileRemark', singleFile.fileRemark);
        formData.append('file', singleFile.uploadData);

        axios({
            method: 'post',
            url: `${process.env.VUE_APP_API_BASE_URL}/api/pendingPage/policyMarkAttachedFileSave`,
            data: formData,
            timeout: 3*60*1000,
        })
        .then((resp)=>{
            output = resp.data;
            if(output.success){
                LoadingUtil.close();
                (this.$refs.uploadFileListForm as any).afterSingleUpload(output,singleFile);
            }else{
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
            }
        }).catch((err)=>{
            output.success = false;
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
        })     
    }

    //刪除附件與註記
    deleteSingleFile(singleFile: FileGrid){
        LoadingUtil.show();
        let output: OutputErrorCodeDto = {
            success: false,
            returnMessage:"",
            apiErrorCode:null
        };
        this.$pendingPageApi.deletePolicyMarkAttachedFileUsingPOST(singleFile.fileId).then((resp)=>{
            output = resp.data;
            if(output.success){
                LoadingUtil.close();
                (this.$refs.uploadFileListForm as any).afterSingleDelete(output,singleFile);
            }else{
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t('global_deleteFailed').toString()); // 刪除失敗
            }
        }).catch((err)=>{
            output.success = false;
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('global_deleteFailed').toString()); // 刪除失敗
        })
    }

    //註記項目(1)- (5)少要執行一項
    validateIsEachEmpty() {
        if(ValidationUtil.isEmpty(this.policyMaskForm.tmrId)
            && ValidationUtil.isEmpty(this.policyMaskForm.caseLevelId)
            && (this.$refs.uploadFileListForm as any).getFileList().length <1
            && (ValidationUtil.isEmpty(this.policyMaskForm.contactString)
                || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactStartString)
                || ValidationUtil.isEmpty(this.policyMaskForm.convenientContactEndString))
            ){
                return true;
        }else{
            return false;
        }
    }

    //判斷時間是否小於現在時間
    validateTimeStart() {
        this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,false,"success","","");
        this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,false,"success","","");
        let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.policyMaskForm.contactDate).startOf("dates"));
        let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
        if(selectDate == today){
            if (!ValidationUtil.isEmpty(this.policyMaskForm.convenientContactStartString)) {
                let start = moment(this.policyMaskForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
                if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
                    this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,true,"error","hover",this.$t('pedding_mark_time_before_now').toString()); // 時間不可小於現在時間
                    this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,true,"error","hover",this.$t('pedding_mark_time_before_now').toString()); // 時間不可小於現在時間
                }
            }
        }
        
    }

    //判斷時間起訖與範圍
    validateTimeEnd() {
        this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,false,"success","","");
        this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,false,"success","","");
        if (!ValidationUtil.isEmpty(this.policyMaskForm.convenientContactEndString)) {
            if( MomentUtil.transferMomentToTimestamp( this.policyMaskForm.convenientContactEndTime) < MomentUtil.transferMomentToTimestamp(this.policyMaskForm.convenientContactStartTime)){
                //起訖時間有誤
                this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,true,"error","hover",this.$t('pedding_start_and_end_error').toString());
                this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,true,"error","hover",this.$t('pedding_start_and_end_error').toString());
            }else{
                let start = moment(this.policyMaskForm.convenientContactStartTime) ;
                if( start.add(480,"minutes").isBefore(this.policyMaskForm.convenientContactEndTime)){
                    this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,true,"error","hover",this.$t('pedding_mark_time_over').toString()); // 起訖不得超過八小時
                    this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,true,"error","hover",this.$t('pedding_mark_time_over').toString()); // 起訖不得超過八小時
                }
                start = moment(this.policyMaskForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
                let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.policyMaskForm.contactDate).startOf("dates"));
                let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
                if(selectDate == today){
                    if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
                        this.feildValidate(this.policyMaskValidateForm.convenientContactStartTime,true,"error","hover",this.$t('pedding_mark_time_before_now').toString()); // 時間不可小於現在時間
                        this.feildValidate(this.policyMaskValidateForm.convenientContactEndTime,true,"error","hover",this.$t('pedding_mark_time_before_now').toString()); // 時間不可小於現在時間
                    }
                }
            }
        }
    }

    //日期選擇器，可選擇範圍限定於系統日之後
    disabledDate(value) {
        const rangeStart = moment().add(-1,'days');
        if (!value || !rangeStart) {
            return false;
        }
        return (value.valueOf() < rangeStart.valueOf());
    }

    //註記原因驗證
    validateMarkReason(rule, value, callback) {
        this.feildValidate(this.policyMaskValidateForm.markReason,true,"","","");
        if (!ValidationUtil.isEmpty(value)) {
            if(this.policyMaskForm.markReason.length >250){
                this.feildValidate(this.policyMaskValidateForm.markReason,true,"error","hover",this.$t('pedding_mark_reason_over').toString()); //註記原因 不可輸入超過250字
                callback(() => { });
            }else{
                this.feildValidate(this.policyMaskValidateForm.markReason,false,"success","","");
            }
        } else {
            // 電訪員 必填
            this.feildValidate(this.policyMaskValidateForm.markReason,true,"error","hover",this.$t('pedding_mark_reason_required').toString()); //註記原因 必填
            callback(() => { });
        }
        callback();
    }

    //案件備註 字數驗證
    validateMark(rule, value, callback) {
        this.feildValidate(this.policyMaskValidateForm.custMark,false,"success","","");
        if (!ValidationUtil.isEmpty(value)) {
            if(this.policyMaskForm.custMark.length >200){
                this.feildValidate(this.policyMaskValidateForm.custMark,true,"error","hover",this.$t('pedding_mark_over').toString()); //註記原因 不可輸入超過250字
                callback(() => { });
            }else{
                this.feildValidate(this.policyMaskValidateForm.custMark,false,"success","","");
            }
        }
        callback();
    }
}