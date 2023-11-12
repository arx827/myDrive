import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TimePicker } from "ant-design-vue";
import DatePicker from '@fubonlife/vue2-datepicker';
import { eventInsert } from "@/components/shared/form/eventInsertForm/model";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Option } from "@fubonlife/obd-api-axios-sdk";
import moment from "moment";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";

@Component({
    components: { TimePicker, DatePicker }
})
export default class EventInsertForm extends Vue {
    // 解決Tooltip無法隱藏的問題
    isDateVisible: boolean = false;

    //時間選擇器是否開啟
    isTimePickerStartOpen: boolean = false;
    isTimePickerEndOpen: boolean = false;

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    //FeedBack
    eventDateFeedback: boolean = false;
    unitIdFeedback: boolean = false;
    userFeedback: boolean = false;
    startTimeFeedback: boolean = false;
    endTimeFeedback: boolean = false;

    //Hover
    eventDateHover: string = '';
    unitIdHover: string = '';
    userHover: string = '';
    startTimeHover: string = '';
    endTimeHover: string = '';

    //state
    stateEventDate: string = "";
    stateUnitId: string = "";
    stateUser: string = "";
    stateStartTime: string = "";
    stateEndTime: string = "";

    //message
    eventDateMsg: string = '';
    unitIdMsg: string = '';
    userMsg: string = '';
    startTimeMsg: string = '';
    endTimeMsg: string = '';

    @Prop()
    public initData;

    //姓名下拉選單是否可編輯
    isNameDisable: boolean = true;

    @Prop()
    originalSelectDiviOptions: Option[];

    @Prop()
    originalSelectTmrOptions: Option[];

    @Prop()
    originalUnitUserInfo: {
        [key: string]: Option[];
    };

    //==================================科別 電訪員下拉式選單 start========================
    // 科別下拉選單
    selectDiviOptions: Option[] = [];
    // 電訪員下拉選單
    selectTmrOptions: Option[] = [];

    // 科別對應人員資料
    unitUserInfo = {};

    //初始化科別和電訪員下拉選單
    getUnitAndTmrOptions() {
        this.selectDiviOptions = this.originalSelectDiviOptions;
        this.unitUserInfo=this.originalUnitUserInfo;
    }

    /**
   * 選擇科別時，電訪員範圍限縮
   */
    onSeletDivi() {
        this.selectTmrOptions = [];
        
        // 有選擇科別
        if (!ValidationUtil.isEmpty(this.eventInsertForm.selectUnitIdOptions)) {
            this.isNameDisable=false;
            let unitId = this.eventInsertForm.selectUnitIdOptions
            this.eventInsertForm.selectUserNameOptions = ""
            // 取得科別對應人員
            if (!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
                this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
            }
        }
    }

    // ==================================下拉式選單 end========================

    eventInsertForm: eventInsert = {
        eventName: this.$t('eventS_overWork').toString(), //加班
        eventDate: null,
        startTime: null,
        endTime: null,
        startTimeMoment: null,
        endTimeMoment: null,
        selectUnitIdOptions: "",
        selectUserNameOptions: "",
        shiftWorkCode: null,
        remark: null,
        userId: null,
        eventDateString: "",
    };


    // From 欄位條件篩選
    changeRules: { [key: string]: ValidationRule[] } = {
        eventDate: [{ validator: this.validateEventDate, trigger: "blur" }],
        selectUnitIdOptions: [{ validator: this.validateUnitId, trigger: "blur" }],
        selectUserNameOptions: [{ validator: this.validateUnitId, trigger: "blur" }],
        startTimeMoment: [{ validator: this.validateStartTime, trigger: "blur" }],
        endTimeMoment: [{ validator: this.validateEndTime, trigger: "blur" }],
    };



    //建立表單
    created(): void {
        this.getUnitAndTmrOptions();
        this.reset();
    }

    @Watch("eventInsertForm.selectUnitIdOptions")
    onUserUnitChanged(): void {
        this.unitIdFeedback = false;
        this.unitIdHover = '';
        this.stateUnitId = "";
        this.unitIdMsg = '';
        
    }

    @Watch("eventInsertForm.selectUserNameOptions")
    onUserNameChanged(): void {
        this.userFeedback = false;
        this.userHover = '';
        this.stateUser = "";
        this.userMsg = '';
        this.eventInsertForm.userId=this.eventInsertForm.selectUserNameOptions;
        
    }

    //若initData有異動則重設表單
    @Watch("initData")
    onInitDataChanged(): void {
        this.reset();
    }

    //重設表單
    reset() {
        this.clearForm();
    }

    //清除表單狀態
    clearForm() {
        //清除表單欄位
        this.eventInsertForm = {
            eventName: this.$t('eventS_overWork').toString(), //加班
            eventDate: null,
            eventDateString: "",
            startTime: "",
            endTime: "",
            selectUnitIdOptions: "",
            selectUserNameOptions: "",
            shiftWorkCode: null,
            remark: null,
            startTimeMoment: null,
            endTimeMoment: null,
            userId: null,
        };

        //feedback
        this.eventDateFeedback = false;
        this.unitIdFeedback = false;
        this.userFeedback = false;
        this.startTimeFeedback = false;
        this.endTimeFeedback = false;

        //hover
        this.eventDateHover = '';
        this.unitIdHover = '';
        this.userHover = '';
        this.startTimeHover = '';
        this.endTimeHover = '';

        //state
        this.stateEventDate = "";
        this.stateUnitId = "";
        this.stateUser = "";
        this.stateStartTime = "";
        this.stateEndTime = "";

        //message
        this.eventDateMsg = '';
        this.unitIdMsg = '';
        this.userMsg = '';
        this.startTimeMsg = '';
        this.endTimeMsg = '';

        //姓名下拉選單預設不可編輯
        this.isNameDisable = true;
    }

    //送出新增表單
    async onFormSubmit() {
        //驗證欄位
        if (this.validateSubmit()) {
            try {
                LoadingUtil.show();
                let eventDate = MomentUtil.transformRocYearMonthDay(this.eventInsertForm.eventDateString);
                const resp = await this.$userEventApi.createUserEventUsingPOST1({
                    shiftWorkCode: null,
                    eventCode: "W",
                    userId: this.eventInsertForm.userId,
                    eventDate: eventDate + " 00:00:00",
                    startTime: eventDate + " " + this.eventInsertForm.startTime + ":00",
                    endTime: eventDate + " " + this.eventInsertForm.endTime + ":00",
                    remark: this.eventInsertForm.remark
                })
                LoadingUtil.close();
                MessageUtil.messageSuccess(this.$t("eventS_dataSaved").toString()); //資料已儲存成功
                this.$emit("reloadData");
            } catch (err) {
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());
            }
        }


    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }

    //日期選擇器，可選擇範圍限定於今日至月底
    disabledDate(value) {
        const rangeEnd = moment().endOf('months');
        const rangeStart = moment().add(-1, 'days');
        if (!value || !rangeEnd || !rangeStart) {
            return false;
        }
        return (value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf());
    }

    //日期選擇器，自動轉為字串更新表單資料
    onDateChange(date) {
        this.eventDateFeedback = false;
        this.eventDateHover = '';
        this.stateEventDate = "";
        this.eventDateMsg = '';
        this.eventInsertForm.eventDateString = date ? MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date))) : '';
    }

    //時間選擇器(起)，自動轉為字串更新表單資料
    onStartTimeChange(time, timeString) {
        this.startTimeFeedback = false;
        this.startTimeHover = '';
        this.stateStartTime = "";
        this.startTimeMsg = '';
        this.eventInsertForm.startTime = timeString;
    }

    //時間選擇器(訖)，自動轉為字串更新表單資料
    onEndTimeChange(date, timeString) {
        this.endTimeFeedback = false;
        this.endTimeHover = '';
        this.stateEndTime = "";
        this.endTimeMsg = '';
        this.eventInsertForm.endTime = timeString;
    }

    //驗證欄位格式
    validateSubmit() {
        let vaild = true;

        this.validateEventDate(null, this.eventInsertForm.eventDateString, () => {
            if (this.stateEventDate == 'error') {
                vaild = false;
            } else {
                this.validateEventDateRange(null, this.eventInsertForm.eventDate, () => {
                    if (this.stateEventDate == 'error') {
                        vaild = false;
                    }
                });
            }
        });



        this.validateUnitId(null, this.eventInsertForm.selectUnitIdOptions, () => {
            if (this.stateUnitId == 'error') {
                vaild = false;
            }
        });

        this.validateUser(null, this.eventInsertForm.selectUserNameOptions, () => {
            if (this.stateUser == 'error') {
                vaild = false;
            }
        });

        let startAndEndValidate: boolean = true;

        this.validateStartTime(null, this.eventInsertForm.startTimeMoment, () => {
            if (this.stateStartTime == 'error') {
                vaild = false;
                startAndEndValidate = false;
            }
        });

        this.validateEndTime(null, this.eventInsertForm.endTimeMoment, () => {
            if (this.stateEndTime == 'error') {
                vaild = false;
                startAndEndValidate = false;
            }
        });

        //起始與結束時間皆符合規範才進一步判斷起訖區間
        if (startAndEndValidate) {
            this.validateStartAndEndTime(null, this.eventInsertForm.startTimeMoment, this.eventInsertForm.endTimeMoment, () => {
                if (this.stateStartTime == 'error' || this.stateEndTime == 'error') {
                    vaild = false;
                }
            });
        }

        return vaild;
    }

    /**
    * 起訖時間驗證
    * @param rule 驗證規則 
    * @param startTime 起始時間
    * @param endTime 結束時間 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateStartAndEndTime(rule, startTime, endTime, callback) {
        this.startTimeFeedback = false;
        this.startTimeHover = "";
        this.stateStartTime = "";
        this.startTimeMsg = ""
        if (!startTime.isBefore(endTime)) {
            this.startTimeFeedback = true;
            this.startTimeHover = "hover";
            this.stateStartTime = "error";
            this.startTimeMsg = this.$t('global_pleaseInputCorrectStartAndEndTime').toString(); //請輸入正確的起訖時間

            this.endTimeFeedback = true;
            this.endTimeHover = "hover";
            this.stateEndTime = "error";
            this.endTimeMsg = this.$t('global_pleaseInputCorrectStartAndEndTime').toString(); //請輸入正確的起訖時間
            callback(() => { });
        } else {
            let start = moment(JSON.parse(JSON.stringify(startTime)));
            if (!start.add(29, "minutes").isBefore(endTime)) {
                this.startTimeFeedback = true;
                this.startTimeHover = "hover";
                this.stateStartTime = "error";
                this.startTimeMsg = this.$t('CANNOT_LESS_HALF_HOUR').toString(); //加班時間不得小於半小時

                this.endTimeFeedback = true;
                this.endTimeHover = "hover";
                this.stateEndTime = "error";
                this.endTimeMsg = this.$t('CANNOT_LESS_HALF_HOUR').toString(); //加班時間不得小於半小時
                callback(() => { });
            }
        }
        callback();
    }

    /**
    * 部門，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateUnitId(rule, value, callback) {
        this.unitIdFeedback = true;
        this.unitIdHover = '';
        this.stateUnitId = "";
        this.unitIdMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            this.unitIdFeedback = false;
            callback();
        } else {
            this.unitIdHover = "hover";
            this.stateUnitId = "error";
            this.unitIdMsg = this.$t('global_divisionRequired').toString(); //科別必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 姓名，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateUser(rule, value, callback) {
        this.userFeedback = true;
        this.userHover = '';
        this.stateUser = "";
        this.userMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            this.userFeedback = false;
            callback();
        } else {
            this.userHover = "hover";
            this.stateUser = "error";
            this.userMsg = this.$t('global_humanNameRequired').toString(); //姓名必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 起始時間，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateStartTime(rule, value, callback) {
        this.startTimeFeedback = true;
        this.startTimeHover = '';
        this.stateStartTime = "";
        this.startTimeMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            this.startTimeFeedback = false;
            callback();
        } else {
            this.startTimeHover = "hover";
            this.stateStartTime = "error";
            this.startTimeMsg = this.$t('eventS_startTimeRequired').toString(); //起始時間必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 結束時間，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEndTime(rule, value, callback) {
        this.endTimeFeedback = true;
        this.endTimeHover = '';
        this.stateEndTime = "";
        this.endTimeMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            this.endTimeFeedback = false;
            callback();
        } else {
            this.endTimeHover = "hover";
            this.stateEndTime = "error";
            this.endTimeMsg = this.$t('eventS_endTimeRequired').toString(); //結束時間必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 事件日期，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEventDate(rule, value, callback) {
        this.eventDateFeedback = true;
        this.eventDateHover = '';
        this.stateEventDate = "";
        this.eventDateMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                this.eventDateFeedback = false;
                callback();
            } else {
                this.isDateVisible = true;
                this.eventDateHover = "hover";
                this.stateEventDate = "error";
                this.eventDateMsg = this.$t('global_dateError').toString(); //日期錯誤
                callback(() => { });
            }
        } else {
            this.eventDateHover = "hover";
            this.stateEventDate = "error";
            this.eventDateMsg = this.$t('eventS_dateRequired').toString(); //事件日期必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 日期範圍驗證
    * @param rule 驗證規則 
    * @param value 開始日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEventDateRange(rule, value, callback) {
        this.eventDateFeedback = true;
        this.eventDateHover = '';
        this.stateEventDate = "";
        this.eventDateMsg = '';
        const rangeEnd = moment().endOf('months');
        const rangeStart = moment().startOf('day');
        if ((value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf())) {
            this.isDateVisible = true;
            this.eventDateHover = "hover";
            this.stateEventDate = "error";
            this.eventDateMsg = this.$t('global_dateError').toString(); //日期錯誤
            callback(() => { });
        } else {
            this.eventDateFeedback = false;
            callback();
        }
    }

    /**
     * 手動輸入日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDate(data: any) {
        this.isDateVisible = false;
        this.eventDateFeedback = true;
        this.eventDateHover = '';
        this.stateEventDate = "";
        this.eventDateMsg = '';
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.eventDateFeedback = false;
        } else {
            this.isDateVisible = true;
            this.eventDateHover = "hover";
            this.stateEventDate = "error";
            this.eventDateMsg = this.$t('global_dateError').toString(); //日期錯誤
        }
        this.eventInsertForm.eventDate = parseDate ? parseDate : null;
        this.eventInsertForm.eventDateString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.eventInsertForm.eventDate.toString()))) :
            data.currentTarget.value;
    }

    /**
     * 確保Tooltip在日期正確時確實隱藏
     */
    eventMouseOver() {
        if (this.eventDateFeedback) {
            this.isDateVisible = true;
        } else {
            this.isDateVisible = false;
        }
    }

    //點選時間選擇器(起)
    clickStartTimePicker(open) {
        this.isTimePickerStartOpen = open;
    }

    //手動關閉時間選擇器(起)
    closeStartTimePicker() {
        this.isTimePickerStartOpen = false;
    }

    //點選時間選擇器(訖)
    clickEndTimePicker(open) {
        this.isTimePickerEndOpen = open;
    }

    //手動關閉時間選擇器(訖)
    closeEndTimePicker() {
        this.isTimePickerEndOpen = false;
    }
}