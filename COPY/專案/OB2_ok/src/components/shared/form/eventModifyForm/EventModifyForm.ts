import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TimePicker, DatePicker } from "ant-design-vue";
import { eventModify } from "@/components/shared/form/eventModifyForm/model";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import { Event } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import moment from "moment";

@Component({
    components: { TimePicker, DatePicker }
})
export default class EventModifyForm extends Vue {

    @Prop()
    public initData;

    //時間選擇器是否開啟
    isTimePickerStartOpen: boolean = false;
    isTimePickerEndOpen: boolean = false;

    //事件類別下拉選單選項清單
    selectEventCodeOptions = [];

    //驗證相關參數
    eventCodeFeedback: boolean = false;
    startTimeFeedback: boolean = false;
    endTimeFeedback: boolean = false;

    eventCodeHover: string = '';
    startTimeHover: string = '';
    endTimeHover: string = '';

    stateEventCode: string = "";
    stateStartTime: string = "";
    stateEndTime: string = "";

    eventCodeMsg: string = '';
    startTimeMsg: string = '';
    endTimeMsg: string = '';

    //修改表單
    eventModifyForm: eventModify = {
        id: null,
        dateString: null,
        eventName: null,
        eventCode: null,
        eventDate: null,
        startTime: null,
        endTime: null,
        startTimeDate: null,
        endTimeDate: null,
        shiftWorkCode: null,
        shiftWork: null,
        remark: null,
        user: null,
        userId: null,
        isConflic : false,
    };

    // From 欄位條件篩選
    changeRules: { [key: string]: ValidationRule[] } = {
        eventCode: [{ validator: this.validateEventCode, trigger: "blur" }],
        startTimeDate: [{ validator: this.validateStartTime, trigger: "blur" }],
        endTimeDate: [{ validator: this.validateEndTime, trigger: "blur" }],
    };

    //建立表單
    async created() {
        this.reset();
        LoadingUtil.show();
        // 事件類別下拉式清單中的資料來源
        await this.$eventApi.findAllEventUsingGET1()
            .then((res: AxiosResponse<Event[]>) => {
                res.data.forEach(e => this.selectEventCodeOptions.push(
                    {
                        label: e.event,
                        value: e.eventCode
                    }
                ));
                LoadingUtil.close();
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                LoadingUtil.close();
            });
    }

    //若initData有異動則重設表單
    @Watch("initData")
    onInitDataChanged(): void {
        this.reset();
    }

    //重設表單
    reset() {
        this.clearForm();
        this.eventModifyForm = this.initData;
    }

    //清除表單狀態
    clearForm() {
        //清除表單欄位
        this.eventModifyForm = {
            id: null,
            eventName: null,
            dateString: null,
            eventCode: null,
            eventDate: null,
            startTime: null,
            endTime: null,
            startTimeDate: null,
            endTimeDate: null,
            shiftWorkCode: null,
            shiftWork: null,
            remark: null,
            user: null,
            userId: null,
            isConflic: false,
        };

        //清除欄位驗證
        this.eventCodeFeedback = false;
        this.startTimeFeedback = false;
        this.endTimeFeedback = false;

        this.eventCodeHover = '';
        this.startTimeHover = '';
        this.endTimeHover = '';

        this.stateEventCode = "";
        this.stateStartTime = "";
        this.stateEndTime = "";

        this.eventCodeMsg = '';
        this.startTimeMsg = '';
        this.endTimeMsg = '';
    }

    //修改事件細項後送出時
    async onModifyFormSubmit() {
        if (this.validateSubmit()) {
            LoadingUtil.show();
            //取得更新後事件的事件名稱
            const resp = await this.$eventApi.getEventNameUsingGET(this.eventModifyForm.eventCode);
            this.eventModifyForm.eventName = resp.data;
            LoadingUtil.close();
            if(this.eventModifyForm.id == null){
                this.eventModifyForm.id = "insert" + new Date().getTime();
            }
            //將修改後的細項送出至多筆更新表單
            this.$emit('modifyValue', this.eventModifyForm);
        }
    }

    //時間選擇器(起)，自動轉為字串更新表單資料
    onStartTimeChange(time, timeString) {
        this.eventModifyForm.startTime = timeString;
        this.startTimeHover = '';
        this.stateStartTime = "";
        this.startTimeMsg = '';
        this.startTimeFeedback = false;
    }

    //時間選擇器(訖)，自動轉為字串更新表單資料
    onEndTimeChange(date, timeString) {
        this.eventModifyForm.endTime = timeString;
        this.endTimeHover = '';
        this.stateEndTime = "";
        this.endTimeMsg = '';
        this.endTimeFeedback = false;
    }

    validateSubmit() {
        let vaild = true;

        this.validateEventCode(null, this.eventModifyForm.eventCode, () => {
            if (this.stateEventCode == 'error') {
                vaild = false;
            }
        });

        let startAndEndValidate : boolean = true;

        this.validateStartTime(null, this.eventModifyForm.startTime, () => {
            if (this.stateStartTime == 'error') {
                vaild = false;
                startAndEndValidate = false;
            }
        });

        this.validateEndTime(null, this.eventModifyForm.endTime, () => {
            if (this.stateEndTime == 'error') {
                vaild = false;
                startAndEndValidate = false;
            }
        });

        //起始與結束時間皆符合規範才進一步判斷起訖區間
        if(startAndEndValidate){
            this.validationStartAndEndTime(null, this.eventModifyForm.startTimeDate, this.eventModifyForm.endTimeDate, () => {
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
    validationStartAndEndTime(rule, startTime, endTime, callback){
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
        }else{
            
            let start = moment(JSON.parse(JSON.stringify(startTime))) ;
            if( this.eventModifyForm.eventCode=="W" && !start.add(29,"minutes").isBefore(endTime)){
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
    * 事件代碼，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEventCode(rule, value, callback) {
        this.eventCodeFeedback = true;
        this.eventCodeHover = '';
        this.stateEventCode = "";
        this.eventCodeMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            this.eventCodeFeedback = false;
            callback();
        } else {
            this.eventCodeHover = "hover";
            this.stateEventCode = "error";
            this.eventCodeMsg = this.$t('eventS_eventTypeRequired').toString(); // 事件類型必填
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