import { message, Modal } from "ant-design-vue";
import { LoginModule } from "@/plugins/store/LoginModule";
import DatePicker from '@fubonlife/vue2-datepicker';
import { TaskColor, TaskInterface, FblEventSettingForm, SelectOptions } from "@/pages/eventSetting/models";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { Vue, Component } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { ComponentDto, Event, EventClassGrid, UserEventGrid, Option } from "@fubonlife/obd-api-axios-sdk";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { AxiosResponse } from "axios";
import EventInsertForm from "@/components/shared/form/eventInsertForm/EventInsertForm.vue";
import EventUpdateForm from "@/components/shared/form/eventUpdateForm/EventUpdateForm.vue";
import { eventInsert } from "@/components/shared/form/eventInsertForm/model";
import { eventUpdate } from "@/components/shared/form/eventUpdateForm/model";
import moment from "moment";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import UploadAndLog from "@/components/shared/uploadAndLog/UploadAndLog.vue"
import { resultMessage } from "@/components/shared/uploadAndLog/model";
import { AuthComonent } from "@/assets/config/CommonUtil";
import { identity } from "rxjs";

const GanttElastic = require("gantt-elastic-rewrite").default;
@Component({
    components: { HiddenFolde, GanttElastic, DatePicker, EventInsertForm, EventUpdateForm, UploadAndLog }
})
export default class EventSettingPage extends Vue {
    // 畫面元件
    authComponent: AuthComonent = {
        EVENT_SEARCH_CLEAR: {
            show: false,
            enable: false
        },
        EVENT_EXPORT: {
            show: false,
            enable: false
        },
        EVENT_CREATE: {
            show: false,
            enable: false
        },
        EVENT_IMPORT: {
            show: false,
            enable: false
        }
    };

    editAuth: boolean = false;
    //判斷當下是否可執行匯出
    isExportDisable: boolean = true;
    //儲存取消二次確認用的flag(是否編輯過)
    isDataEdited: boolean = false;

    // 解決Tooltip無法隱藏的問題
    isDateStartVisible: boolean = false;
    isDateEndVisible: boolean = false;

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    //事件類別下拉選項
    selectEventCodeOptions = [];
    eventCodeSelections: string[] = [];

    // 欄位驗證錯誤訊息
    startHover: string = "";
    startFeedback: boolean = false;
    stateStart: string = "";
    startErrorMsg: string = '';

    endHover: string = "";
    endFeedback: boolean = false;
    stateEnd: string = "";
    endErrorMsg: string = '';

    //圖例清單
    eventClassList = [];

    //==================================下拉式選單 start========================

    // 部門
    selectDepOptions: Option[] = [];
    // 科別
    selectDiviOptions: Option[] = [];
    // 電訪員
    selectTmrOptions: Option[] = [];
    //使用者清單
    allUserList: Option[] = [];
    //部門對應的科別清單
    allDivList: Option[] = [];

    // 部門對應科別/人員資料(為map的形式)
    depUnitInfo = {};
    depUserInfo = {};
    // 科別對應人員資料
    unitUserInfo : {
        [key: string]: Option[];
    }= {};

    // ==================================下拉式選單 end========================


    //單筆新增表單資料
    eventInsertFormVisible = false;
    titleText: string = '';
    eventInsertForm: eventInsert = {
        eventName: null,
        eventDate: null,
        startTime: null,
        endTime: null,
        selectUnitIdOptions: null,
        selectUserNameOptions: null,
        shiftWorkCode: null,
        remark: null,
        startTimeMoment: null,
        endTimeMoment: null,
        userId: null,
    };

    //多筆修改表單資料
    eventUpdateFormVisible = false;
    eventUpdateForm: eventUpdate = {
        key: null,
        eventDate: null,
        shiftWorkCode: null,
        shiftWork: null,
        user: null,
        userId: null,
        subTask: [],
        deleteId: [],
        modifyTask: [],
        originalTask: [],
        updateDate: null,
        updateName: null,
    };

    //檔案清單
    fileList = [];
    //匯入檢核訊息
    errorMessageList: resultMessage[] = [];
    //匯入檔案內容
    uploadData = null;
    //下月日期(顯示用)
    nextMonth = MomentUtil.transformRocYearMonth(MomentUtil.format(moment(new Date()).add(1, 'months').toDate(), 'YYYY/MM'));
    //上傳歷程內容
    uploadProgressList = []
    //上傳是否曾經成功(判斷是否重整頁面)
    isAnyUploadSuccessed = false;
    //上傳表單filter初始設定
    uploadProgressFilter: FblFilters = {
        filters: []
    };
    //匯入表單內的顯示文字
    describeList = [this.$t('global_importDescribeLimit').toString(), this.$t('global_importDescribeNextMonth').toString(), this.$t('global_workingMonth').toString() + this.nextMonth];
    //匯入表單
    eventUploadFormVisible = false;

    //filter初始設定(事件用)
    eventSettingFilter: FblFilters = {
        filters: []
    };

    //filter初始設定(班別用)
    userShiftWorkFilter: FblFilters = {
        filters: []
    };

    //上方查詢條件 form
    eventForm: FblEventSettingForm = {
        startDate: moment(new Date()),
        endDate: moment(new Date()),
        startString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
        endString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
        departmentIdList: [], //部門
        divisionIdList: [], //科別
        tmrIdList: [], //電訪員

    };

    //套件基本設定
    options = {
        taskMapping: {
            progress: "percent",
        },
        maxRows: 15,
        maxHeight: 500,
        row: {
            height: 24,
        },
        calendar: {
            hour: {
                height: 24,
            },
            month: {
                display: false,
            },
        },
        chart: {
            expander: {
                display: false,
            },
        },
        times: {
            timeScale: 30 * 1000,
            timeZoom: 2,
        },
        scope: {
            before: 0,
            after: 0,
        },
        taskList: {
            //左側所需欄位，可自行新增
            columns: [
                {
                    id: 1, //不可重複
                    label: this.$t("global_division").toString(), //欄位名稱 科別
                    value: "department", //欄位內容，需對應上方option其一欄位
                    width: 110, //欄位預設寬度
                    html: true, //是否接受使用html語法，預設為false
                },
                {
                    id: 2,
                    label: this.$t("global_humanName").toString(), //姓名
                    value: "name",
                    width: 90,
                    html: true,
                },
                {
                    id: 4,
                    label: this.$t("global_date").toString(), //日期
                    value: "dateLink",
                    width: 80,
                    html: true,
                },
                {
                    id: 5,
                    label: this.$t("global_shiftWork").toString(), //班別
                    value: "workingHour",
                    width: 120,
                    html: true,
                },
                {
                    id: 6,
                    label: this.$t("global_minutes").toString(), //分鐘數
                    value: "minute",
                    width: 60,
                    html: true,
                },
            ],
        },
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputStartDate(data: any) {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.startFeedback = true;
        this.startHover = "";
        this.stateStart = '';
        this.startErrorMsg = "";
        this.endHover = "";
        this.stateEnd = '';
        this.endErrorMsg = "";
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.startFeedback = false;
            this.endFeedback = false;
        } else {
            this.isDateStartVisible = true;
            this.startHover = "hover";
            this.stateStart = 'error';
            this.startErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
        }
        this.eventForm.startDate = parseDate ? parseDate : this.eventForm.startDate;
        this.eventForm.startString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.eventForm.startDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 手動輸入結束日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputEndDate(data: any) {
        this.isDateEndVisible = false;
        this.isDateStartVisible = false;
        this.endFeedback = true;
        this.endHover = "";
        this.stateEnd = '';
        this.endErrorMsg = "";
        this.startHover = "";
        this.stateStart = '';
        this.startErrorMsg = "";
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.endFeedback = false;
            this.startFeedback = false;
        } else {
            this.isDateEndVisible = true;
            this.endHover = "hover";
            this.stateEnd = 'error';
            this.endErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
        }
        this.eventForm.endDate = parseDate ? parseDate : this.eventForm.endDate;
        this.eventForm.endString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.eventForm.endDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 確保Tooltip在日期正確時確實隱藏
     */
    eventMouseOverStart() {
        if (this.startFeedback) {
            this.isDateStartVisible = true;
        } else {
            this.isDateStartVisible = false;
        }
    }
    eventMouseOverEnd() {
        if (this.endFeedback) {
            this.isDateEndVisible = true;
        } else {
            this.isDateEndVisible = false;
        }
    }

    // 欄位條件篩選
    changeRules: { [key: string]: ValidationRule[] } = {
        startDate: [{ validator: this.validateStartDate, trigger: "blur" }],
        endDate: [{ validator: this.validateEndDate, trigger: "blur" }],
    };

    data() {
        return {
            tasks,
            //options,
        };
    }

    //重設表單
    resetFrom() {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;

        this.startHover = "";
        this.startFeedback = false;
        this.stateStart = "";
        this.startErrorMsg = '';

        this.endHover = "";
        this.endFeedback = false;
        this.stateEnd = "";
        this.endErrorMsg = '';

        this.eventForm = {
            startDate: moment(new Date()),
            endDate: moment(new Date()),
            startString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            endString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            departmentIdList: [], //部門
            divisionIdList: [], //科別
            tmrIdList: [], //電訪員

        };

        this.eventCodeSelections = [];
        tasks = this.popAllTask(tasks);

        this.selectDiviOptions = [];
        this.selectTmrOptions = [];
        // 科別 下拉
        this.selectDiviOptions = [];

        this.selectDiviOptions = Object.assign(this.allDivList);

        //電訪員下拉
        this.selectTmrOptions = Object.assign(this.allUserList);
    }

    //當滑鼠移出，取消顯示該人員今日工作內容
    onTaskMouseout() {
        message.destroy();
    }

    //左側欄位被點選(編輯事件)
    onTaskClick(event) {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        if (event.data.id != "1" && MomentUtil.compare(new Date(MomentUtil.addDay(new Date(), -1)), new Date(MomentUtil.transformRocYearMonthDay(event.data.date)))) {
            this.eventUpdateForm = {
                key: event.data.id,
                eventDate: event.data.date,
                shiftWorkCode: event.data.workingHour.substr(0, 1),
                shiftWork: event.data.workingHour,
                user: event.data.department + " - " + event.data.name,
                userId: event.data.userId,
                subTask: [],
                deleteId: [],
                modifyTask: [],
                originalTask: [],
                updateDate: null,
                updateName: null,
            };
            this.eventUpdateFormVisible = true;
        }
    }

    //當滑鼠移入，顯示該人員今日工作內容
    onTaskMouseover(event) {
        message.destroy();
        // 排除時段刻度事件
        if (event.data.id != null) {
            let parentId = "0";
            // 取得滑鼠移入事件所屬人員
            for (const val of tasks) {
                let flag = false;
                for (const child of val.tasks) {
                    if (event.data.id == child.id) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    parentId = val.id;
                    break;
                }
            }
            //取得該人員今日的所有事件
            let parent = getParentTask(tasks, parentId);
            let ev = tasks[parent].tasks;
            let retString = "";
            ev.forEach((value) => {
                if (!value.id.includes("cover")) {
                    let d = new Date(value.start);
                    retString += (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
                    retString += ":";
                    retString += (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
                    retString += "~";
                    let de = new Date(value.duration + value.start);
                    retString += (de.getHours() < 10) ? "0" + de.getHours() : de.getHours();
                    retString += ":";
                    retString += (de.getMinutes() < 10) ? "0" + de.getMinutes() : de.getMinutes();
                    retString += " " + value.name;
                }
            });
            //以message方式顯示，設定不自動消失
            message.config({
                duration: 0,
                top: `50px`,
            });
            MessageUtil.messageInfoEvent(retString, tasks[parent].name + " " + tasks[parent].date);
            //取得message 的html元件
            let antDesignMessage = document.getElementsByClassName('ant-message');
            //變更messae顯示位置
            MessageUtil.changePosition(antDesignMessage, event.event.x, event.event.y)
            message.config({
                duration: 3,
                top: `50px`,
            });
        }
    }

    //送出新增表單
    onFormSubmit(e: eventInsert) {
        if ((this.$refs.eventInsertForm as any).validateSubmit()) {
            Modal.confirm({
                title: this.$t('global_save').toString(), //儲存
                content: this.$t('eventS_daaCorrectExecuteSave').toString() + '？', //資料無誤，確認執行儲存
                okText: this.$t('global_ok').toString(), //確認
                cancelText: this.$t('global_cancel').toString(),  //取消
                icon: 'info-circle',
                onOk: () => {
                    (this.$refs.eventInsertForm as any).onFormSubmit();
                },
                onCancel: () => { },
            });
        }
    }

    //送出多筆修改表單
    onFormUpdateSubmit(e: eventUpdate) {
        if (this.isDataEdited) {

            let isAnyConflic = (this.$refs.eventUpdateForm as any).isAnyConflic();
            if (isAnyConflic) {
                ErrorModalUtil.modalError(this.$t('eventS_eventTypeDuplicated').toString()); //除加班外事件類型不可重複
            } else {
                Modal.confirm({
                    title: this.$t('global_save').toString(), //儲存
                    content: this.$t('eventS_daaCorrectExecuteSave').toString() + '？', //資料無誤，確認執行儲存
                    okText: this.$t('global_ok').toString(), //確認
                    cancelText: this.$t('global_cancel').toString(),  //取消
                    icon: 'info-circle',
                    onOk: () => { (this.$refs.eventUpdateForm as any).onFormUpdateSubmit(); },
                    onCancel: () => { },
                });
            }

        } else {
            this.reload();
        }
    }

    //以上方叉叉關閉整批上傳表單
    onFormUploadReset() {
        (this.$refs.uploadAndLog as any).resetUploadForm();
        this.eventUploadFormVisible = false;
        if (this.isAnyUploadSuccessed) {
            this.reload();
        }
    }

    //以關閉按鈕關閉上傳表單
    onFormUploadClose() {
        this.eventUploadFormVisible = false;
        if (this.isAnyUploadSuccessed) {
            this.reload();
        }
    }

    //取消新增表單(關閉新增表單)
    onFormCalcel() {
        this.eventInsertFormVisible = false;
    }

    //多筆更新取消儲存
    onFormUpdateCalcel() {
        if (this.isDataEdited) {
            Modal.confirm({
                title: this.$t('global_warning').toString(), //警告
                content: this.$t('eventS_isAbandonThisModifyOrNot').toString() + '？', //確認不儲存資料
                okText: this.$t('global_ok').toString(), //確認
                cancelText: this.$t('global_cancel').toString(),  //取消
                icon: 'warning',
                onOk: () => { this.calcelConfirm(true); },
                onCancel: () => { this.calcelConfirm(false); },
            })
        } else {
            this.eventUpdateFormVisible = false;
        }
    }

    //多筆更新取消 判斷是否修改過資料
    calcelConfirm(data) {
        if (data) {
            this.isDataEdited = false;
            this.eventUpdateFormVisible = false;
        } else {
            this.eventUpdateFormVisible = true;
        }
    }

    //按下查詢按鈕
    eventSearch() {
        if (this.validateSubmit()) {
            this.reload();
        }
    }

    //驗證欄位格式
    validateSubmit() {
        let vaild = true;

        if (this.eventForm.endDate == null) {
            this.eventForm.endDate = this.eventForm.startDate;
            this.eventForm.endString = this.eventForm.startString;
        }

        //日期格式範圍驗證
        let startAndEndValidate = true;

        this.validateStartDate(null, this.eventForm.startString, () => {
            if (this.stateStart == 'error') {
                vaild = false;
                startAndEndValidate = false;
            } else {
                this.validateStartDateRange(null, this.eventForm.startDate, () => {
                    if (this.stateStart == 'error') {
                        vaild = false;
                        startAndEndValidate = false;
                    }
                });
            }
        });

        this.validateEndDate(null, this.eventForm.endString, () => {
            if (this.stateEnd == 'error') {
                vaild = false;
                startAndEndValidate = false;
            } else {
                this.validateEndtDateRange(null, this.eventForm.endDate, () => {
                    if (this.stateEnd == 'error') {
                        vaild = false;
                        startAndEndValidate = false;
                    }
                });
            }
        });

        //起始與結束皆符合規範才進一步判斷起訖區間
        if (startAndEndValidate) {
            this.validateStartAndEndDate(null, this.eventForm.startDate, this.eventForm.endDate, () => {
                if (this.stateStart == 'error' || this.stateEnd == 'error') {
                    vaild = false;
                }
            });
        }
        return vaild;
    }

    // 清除查詢條件「日期(起)」的欄位值
    clearStartDate() {
        this.isDateStartVisible = false;
        this.startHover = "";
        this.startFeedback = false;
        this.stateStart = "";
        this.startErrorMsg = '';
        const copyEventForm = { ...this.eventForm }
        this.eventForm.startDate = moment(new Date());
        this.eventForm.endDate = copyEventForm.endDate;
        this.eventForm.startString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            this.eventForm.endString = copyEventForm.endString,
            this.eventForm.eventCode = copyEventForm.eventCode
    }

    // 清除查詢條件「日期(訖)」的欄位值
    clearEndDate() {
        this.isDateEndVisible = false;
        this.endHover = "";
        this.endFeedback = false;
        this.stateEnd = "";
        this.endErrorMsg = '';
        const copyEventForm = { ...this.eventForm }
        this.eventForm.startDate = copyEventForm.startDate,
            this.eventForm.endDate = null,
            this.eventForm.startString = copyEventForm.startString,
            this.eventForm.endString = "",
            this.eventForm.eventCode = copyEventForm.eventCode
    }

    /**
     * 頁面開啟
     * @returns 
     */
    created() {
        LoadingUtil.show();

        // 取得畫面元件權限 範例
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
            .then((res: AxiosResponse<ComponentDto>) => {
                if (res.data.component) {
                    this.authComponent.EVENT_SEARCH_CLEAR = ValidationUtil.isEmpty(res.data.component.EVENT_SEARCH_CLEAR) ? this.authComponent.EVENT_SEARCH_CLEAR : res.data.component.EVENT_SEARCH_CLEAR;
                    this.authComponent.EVENT_EXPORT = ValidationUtil.isEmpty(res.data.component.EVENT_EXPORT) ? this.authComponent.EVENT_EXPORT : res.data.component.EVENT_EXPORT;
                    this.authComponent.EVENT_CREATE = ValidationUtil.isEmpty(res.data.component.EVENT_CREATE) ? this.authComponent.EVENT_CREATE : res.data.component.EVENT_CREATE;
                    this.authComponent.EVENT_IMPORT = ValidationUtil.isEmpty(res.data.component.EVENT_IMPORT) ? this.authComponent.EVENT_IMPORT : res.data.component.EVENT_IMPORT;
                    this.editAuth = JSON.parse(JSON.stringify(this.authComponent.EVENT_CREATE.show));
                }
            }).catch((err) => {
                console.log(err);
            });

        // 事件類別下拉式清單中的資料來源
        this.$eventApi.findAllEventUsingGET1()
            .then((res: AxiosResponse<Event[]>) => {
                res.data.forEach(e => this.selectEventCodeOptions.push(
                    {
                        label: e.event,
                        value: e.eventCode
                    }
                ));
            })
            .catch((err) => {
                console.error(err);
            })
        //取得部門 科別 電訪員下拉選單
        this.$userApi.getStaffListInSchedulePageUsingGET()
            .then((resp) => {

                if (resp.data != null) {

                    // 部門對應科別/人員資料
                    this.depUnitInfo = resp.data.depUnitInfo;
                    this.depUserInfo = resp.data.depUserInfo;

                    // 科別對應人員資料
                    this.unitUserInfo = resp.data.unitUserInfo;
                    console.log(this.unitUserInfo);
                    // 部門 下拉
                    this.selectDepOptions = Object.assign(resp.data.departOptions);
                    this.eventForm.departmentIdList.push(resp.data.defaultDepId);

                    // // 科別 下拉
                    this.allDivList = resp.data.unitList;

                    //電訪員下拉
                    this.allUserList = resp.data.userList;

                    // 有預設部門需一起異動科別/人員
                    if (!ValidationUtil.isEmpty(resp.data.defaultDepId)) {
                        this.onSelectDept();
                    }

                } else {
                    ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常
                }

            })
            .catch((err) => {

                // 會辦查詢 下拉選單載入失敗
                ErrorModalUtil.modalError(this.$t('infPage_querySelectionFailed').toString())
            }).finally(() => {
                this.eventForm.startDate = moment(new Date());
                this.eventForm.endDate = moment(new Date());
                this.eventForm.startString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));
                this.eventForm.endString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));
                LoadingUtil.close();
                this.reload();
            });
    }

    //改變編輯狀態
    changeEditState(flag: boolean) {
        this.isDataEdited = flag;
    }

    /**
     * 重新載入頁面
     * @returns 
     */
    reload() {
        this.eventInsertFormVisible = false;
        this.eventUpdateFormVisible = false;
        this.eventUploadFormVisible = false;
        this.isDataEdited = false;
        LoadingUtil.show();
        //圖例資料來源
        this.eventClassList = [];
        this.$eventClassApi.getEventClassGridUsingGET()
            .then((res: AxiosResponse<EventClassGrid[]>) => {
                res.data.forEach(ec => {
                    this.eventClassList.push(
                        {
                            label: ec.events,
                            value: "background-color:" + ec.classColor + "; color:" + ec.classColor
                        }
                    )
                });
            })
            .catch((err) => {
                console.error(err);
            }).finally(() => {

            });

        //事件清單重置，除了時段，皆清空
        tasks = this.popAllTask(tasks);

        // 塞入查詢條件
        const startEvent = FiltersUtil.setFilterParam("eventDate", FblOperator.GEQ, MomentUtil.transformRocYearMonthDay(this.eventForm.startString));
        const endEvnet = FiltersUtil.setFilterParam("eventDate", FblOperator.LEQ, MomentUtil.transformRocYearMonthDay(this.eventForm.endString));
        const startShift = FiltersUtil.setFilterParam("workDate", FblOperator.GEQ, MomentUtil.transformRocYearMonthDay(this.eventForm.startString));
        const endShift = FiltersUtil.setFilterParam("workDate", FblOperator.LEQ, MomentUtil.transformRocYearMonthDay(this.eventForm.endString));
        this.eventSettingFilter = FiltersUtil.setFilters(startEvent, endEvnet);
        this.userShiftWorkFilter = FiltersUtil.setFilters(startShift, endShift);

        // 整理為 Filters
        const filterEvent: string = JSON.stringify(this.eventSettingFilter);
        const filterShift: string = JSON.stringify(this.userShiftWorkFilter);

        //依據條件搜尋符合的事件
        //userId的部分，查詢時無選取特定使用者，就直接query 下拉選單內 內的所有userId

        const emptyList = [];
        this.$userEventApi.getUserEventGridUsingPOST({
            userEventFilter: this.eventSettingFilter,
            userShiftWorkFilter: this.userShiftWorkFilter,
            superUnitIds: this.eventForm.departmentIdList,
            unitIds: this.eventForm.divisionIdList,
            userIds: this.eventForm.tmrIdList,
            eventCodes: this.eventCodeSelections
        }).then((res: AxiosResponse<UserEventGrid[]>) => {
            res.data.forEach((ec, index) => {
                let linkElement = "";
                if (MomentUtil.compare(new Date(MomentUtil.addDay(new Date(), -1)), new Date(ec.eventDate))) {
                    linkElement = `<a href="javascript:void(0)"> ` + stringDate(ec.eventDate) + `</a>`;
                } else {
                    linkElement = stringDate(ec.eventDate);
                }
                let flag = true;
                if (this.eventCodeSelections.length != 0) {
                    flag = false;
                    ec.subTaskGrids.forEach(item => {
                        if (this.eventCodeSelections.includes(item.eventCode)) {
                            flag = true;
                        }
                    })
                }
                if (flag) {
                    tasks.push({
                        id: ec.userEventByDateId,
                        name: ec.name,
                        userId: ec.userId,
                        dateLink: linkElement,
                        department: ec.unitName,
                        workingHour: ec.shiftWorkCode,
                        date: stringDate(ec.eventDate),
                        minute: ec.minute,
                        duration: 0,
                        percent: 100,
                        type: "group",
                        tasks: getSubList(ec.subTaskGrids),
                    })
                }

            });
            LoadingUtil.close();
        })
            .catch((err) => {
                LoadingUtil.close();
                console.error(err);
            })
            .finally(() => {
                this.isExportDisable = false;
                if (tasks.length == 1) {
                    //無符合篩選條件之資料、查詢結果
                    MessageUtil.messageInfo(this.$t('eventS_noMatchedData').toString() + "！", this.$t('global_searchResult').toString());
                }
            });
    }

    //日期選擇器(起)，自動轉為字串更新搜尋條件
    onStartChange(date) {
        this.isExportDisable = true;
        this.eventForm.startString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.validateSubmit();
    }

    //日期選擇器(訖)，自動轉為字串更新搜尋條件
    onEndChange(date) {
        this.isExportDisable = true;
        this.eventForm.endString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.validateSubmit();
    }

    //將所有事件移除，除了時間刻度外
    popAllTask(list: any[]) {
        while (list.length > 1) {
            list.pop();
        }
        return list;
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
  * 選擇部門時，科別範圍限縮
  */
    onSelectDept() {
        this.isExportDisable = true;

        this.selectDiviOptions = [];
        this.selectTmrOptions = [];

        if (this.eventForm.departmentIdList.length > 0) {

            this.eventForm.departmentIdList.forEach((depId) => {

                // 取得部門對應的科別
                if (!ValidationUtil.isEmpty(this.depUnitInfo[depId])) {
                    this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
                }

                // 取得部門對應人員
                if (!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
                }

            });

        } else {
            // 科別 下拉
            this.selectDiviOptions = Object.assign(this.allDivList);

            // 電訪員 下拉
            this.selectTmrOptions = Object.assign(this.allUserList);

        }

        //重置科別選項
        let unitIdTempList = Object.assign(this.eventForm.divisionIdList);
        unitIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if (!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)) {
                if (this.eventForm.divisionIdList.length > 0) {
                    this.eventForm.divisionIdList = this.eventForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });

        //重置電訪員選項
        let userIdTempList = Object.assign(this.eventForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.eventForm.tmrIdList.length > 0) {
                    this.eventForm.tmrIdList = this.eventForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });

        //連動科別異動
        this.onSeletDivi();
    }

    /**
     * 選擇科別時，電訪員範圍限縮
     */
    onSeletDivi() {
        this.isExportDisable = true;
        this.selectTmrOptions = [];


        // 有選擇科別
        if (this.eventForm.divisionIdList.length > 0) {

            // 取得科別對應人員
            this.eventForm.divisionIdList.forEach((unitId) => {
                if (!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
                }
            });

        } else {

            // 有選擇部門
            if (this.eventForm.departmentIdList.length > 0) {

                this.eventForm.departmentIdList.forEach((depId) => {

                    // 取得部門對應人員
                    if (!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
                        this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
                    }

                });

            } else {
                // 電訪員 下拉
                this.selectTmrOptions = Object.assign(this.allUserList);
            }
        }

        //重置電訪員選項
        let userIdTempList = Object.assign(this.eventForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.eventForm.tmrIdList.length > 0) {
                    this.eventForm.tmrIdList = this.eventForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });

    }

    onSelectTmr() {
        this.isExportDisable = true;
    }

    onEventTypeChange() {
        this.isExportDisable = true;
    }

    //新增單筆事件、開啟設定表單
    addEvent() {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.titleText = this.$t('eventS_singleAdd').toString(); //單筆新增
        this.eventInsertForm = {
            eventName: this.$t('eventS_overWork').toString(), //加班
            eventDate: null,
            startTime: null,
            endTime: null,
            selectUnitIdOptions: null,
            selectUserNameOptions: null,
            shiftWorkCode: null,
            remark: null,
            startTimeMoment: null,
            endTimeMoment: null,
            userId: null,
        };
        this.eventInsertFormVisible = true;
    }

    //日期選擇器，可選擇範圍限定於最近六個月與次月日期
    disabledDate(value) {
        const rangeEnd = moment().add(1, 'months').endOf('months');
        const rangeStart = moment().add((-6), 'months').startOf('months');
        if (!value || !rangeEnd || !rangeStart) {
            return false;
        }
        return (value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf());
    }

    /**
    * 日期格式驗證
    * @param rule 驗證規則 
    * @param value 開始日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateStartDate(rule, value, callback) {
        this.startFeedback = true;
        this.startHover = '';
        this.stateStart = "";
        this.startErrorMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                this.startFeedback = false;
                callback();
            } else {
                this.isDateStartVisible = true;
                this.startHover = "hover";
                this.stateStart = "error";
                this.startErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
                callback(() => { });
            }
        } else {
            this.startHover = "hover";
            this.stateStart = "error";
            this.startErrorMsg = this.$t('eventS_dateRequired').toString(); //事件日期必填
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
    validateStartDateRange(rule, value, callback) {
        this.startFeedback = true;
        this.startHover = '';
        this.stateStart = "";
        this.startErrorMsg = '';
        const rangeEnd = moment().add(1, 'months').endOf('months');
        const rangeStart = moment().add((-6), 'months').startOf('months');
        if ((value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf())) {
            this.isDateStartVisible = true;
            this.startHover = "hover";
            this.stateStart = "error";
            this.startErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
            callback(() => { });
        } else {
            this.startFeedback = false;
            callback();
        }
        callback();
    }

    /**
    * 日期格式驗證
    * @param rule 驗證規則 
    * @param value 結束日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEndDate(rule, value, callback) {
        this.endFeedback = true;
        this.endHover = '';
        this.stateEnd = "";
        this.endErrorMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                this.endFeedback = false;
                callback();
            } else {
                this.isDateEndVisible = true;
                this.endHover = "hover";
                this.stateEnd = "error";
                this.endErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
                callback(() => { });
            }
        } else {
            this.endHover = "hover";
            this.stateEnd = "error";
            this.endErrorMsg = this.$t('eventS_dateRequired').toString(); //事件日期必填
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
    validateEndtDateRange(rule, value, callback) {
        this.endFeedback = true;
        this.endHover = '';
        this.stateEnd = "";
        this.endErrorMsg = '';
        const rangeEnd = moment().add(1, 'months').endOf('months');
        const rangeStart = moment().add((-6), 'months').startOf('months');
        if ((value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf())) {
            this.isDateEndVisible = true;
            this.endHover = "hover";
            this.stateEnd = "error";
            this.endErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
            callback(() => { });
        } else {
            this.endFeedback = false;
            callback();
        }
        callback();
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
        this.startFeedback = true;
        this.endFeedback = true;
        if (this.eventForm.startString == this.eventForm.endString ||
            moment(startDate).isBefore(endDate)) {
            let date = moment(JSON.parse(JSON.stringify(this.eventForm.startDate)));
            let isInOneMonth = date.add(31, 'days').isAfter(this.eventForm.endDate)
            if (isInOneMonth) {
                this.isDateEndVisible = false;
                this.isDateStartVisible = false;
                this.startFeedback = false;
                this.endFeedback = false;
                callback();
            } else {
                this.isDateEndVisible = true;
                this.isDateStartVisible = true;
                this.stateStart = 'error';
                this.startHover = "hover";
                this.startErrorMsg = this.$t('global_dateRangeOver31').toString(); //查詢起訖區間不可大於31天
                this.stateEnd = 'error';
                this.endHover = "hover";
                this.endErrorMsg = this.$t('global_dateRangeOver31').toString(); //查詢起訖區間不可大於31天
                callback(() => { });
            }

        } else {
            this.isDateEndVisible = true;
            this.isDateStartVisible = true;
            this.stateStart = 'error';
            this.startHover = "hover";
            this.startErrorMsg = this.$t('global_pleaseInputCorrectStartAndEndDate').toString(); //請輸入正確的起訖日期
            this.stateEnd = 'error';
            this.endHover = "hover";
            this.endErrorMsg = this.$t('global_pleaseInputCorrectStartAndEndDate').toString(); //請輸入正確的起訖日期
            callback(() => { });
        }
        callback();
    }

    //點選匯出
    exportEvents() {
        if (this.isExportDisable) {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        } else if (tasks.length <= 1) {
            ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
        } else {
            if (this.validateSubmit() && !this.isExportDisable) {
                const startEvent = FiltersUtil.setFilterParam("eventDate", FblOperator.GEQ, MomentUtil.transformRocYearMonthDay(this.eventForm.startString));
                const endEvnet = FiltersUtil.setFilterParam("eventDate", FblOperator.LEQ, MomentUtil.transformRocYearMonthDay(this.eventForm.endString));
                this.eventSettingFilter = FiltersUtil.setFilters(startEvent, endEvnet);

                // 整理為 Filters
                const filterEvent: string = JSON.stringify(this.eventSettingFilter);
                LoadingUtil.show();
                //依據條件搜尋符合的事件
                this.$userEventApi.excelExportUsingGET(
                    (this.eventCodeSelections.length == 0) ? null : this.eventCodeSelections,
                    (this.eventForm.departmentIdList.length == 0) ? null : this.eventForm.departmentIdList,
                    (this.eventForm.divisionIdList.length == 0) ? null : this.eventForm.divisionIdList,
                    filterEvent,
                    (this.eventForm.tmrIdList.length == 0) ? null : this.eventForm.tmrIdList,
                    { responseType: 'blob' })
                    .then((res) => {
                        this.dealDownLoadData(res.data, "事件匯出.xlsx");
                        LoadingUtil.close();
                        MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
                    })
                    .catch((err) => {
                        LoadingUtil.close();
                        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                    }).finally(() => {
                        // this.reload();
                    })
            }
        }

    }

    //處理後端回傳的下載內容
    dealDownLoadData(resData, fileName) {
        try {
            let blob;
            if (resData instanceof Blob) {
                blob = resData;
            } else {
                blob = new Blob([resData], { type: resData.type });
            }
            if (!!window.ActiveXObject || "ActiveXObject" in window) {  //IE瀏覽器
                (window.navigator as any).msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
                // navigator.msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕 
            } else {
                var linkElement = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", fileName);
                var clickEvent = new MouseEvent("click",
                    {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                linkElement.dispatchEvent(clickEvent);
            }
        } catch (ex) {
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

    /**
    * 點選整批上傳按鈕
    * @returns 
    */
    uploadReload() {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.eventUploadFormVisible = true;
        this.isAnyUploadSuccessed = false;
        this.getLogProgerss(false);

    }

    //加載上傳歷程
    getLogProgerss(isUploaded) {
        let data = []
        LoadingUtil.show();
        const rangeEnd = moment().endOf('months').add(1, "days");
        const rangeStart = moment().startOf('months');
        const start = FiltersUtil.setFilterParam("uploadDate", FblOperator.GT, MomentUtil.format(new Date(rangeStart.toISOString()), "YYYY-MM-DD"));
        const end = FiltersUtil.setFilterParam("uploadDate", FblOperator.LT, MomentUtil.format(new Date(rangeEnd.toISOString()), "YYYY-MM-DD"));
        const classType = FiltersUtil.setFilterParam("type", FblOperator.EQ, "E");
        this.uploadProgressFilter = FiltersUtil.setFilters(start, end, classType);
        // 整理為 Filters
        const filterUploadProgress: string = JSON.stringify(this.uploadProgressFilter);
        //搜尋本月上傳歷程
        this.$uploadProgressApi.findAllUploadProgressUsingGET(filterUploadProgress).then((resp) => {
            resp.data.forEach(item => {
                item.uploadDate = MomentUtil.transformRocYearMonthDayHHMMSS(item.uploadDate);
            });
            data = resp.data;
            LoadingUtil.close();
        }).catch((err) => {
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('global_historyLoadingFailure').toString());  //歷程載入失敗
        }).finally(() => {
            if (isUploaded) {
                (this.$refs.uploadAndLog as any).reloadLogProgress(data);
            } else {
                (this.$refs.uploadAndLog as any).settingInitValue(data, this.describeList);
            }
        })

    }

    //本次上傳結束後，重新加載上傳歷程(新增顯示本次上傳結果)
    reloadLogProgress() {
        this.getLogProgerss(true);
    }

    //因為不接受一次上傳多個檔案，所以每次上傳要移除舊檔
    handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }

    //上傳時檢查格式與檔案大小
    beforeUpload(file) {
        const isExcel = (file.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        //判斷檔案類型
        if (!isExcel) {
            (this.$refs.uploadAndLog as any).beforeUploadValidateFail(this.$t('global_formatFailure').toString());
            return false;
        }
        //判斷檔案大小
        const isLT5MB = parseInt(file.size) / 1024 / 1024 < 5;
        if (!isLT5MB) {
            (this.$refs.uploadAndLog as any).beforeUploadValidateFail(this.$t('eventS_fileSizeLimitExceeded').toString())
            return false;
        }
        (this.$refs.uploadAndLog as any).beforeUploadValidateSuccess(file);
        return false;
    }

    //上傳檔案至後端檢核
    async handleUpload(uploadData) {
        this.errorMessageList = [];
        let checkHasError = false;
        LoadingUtil.show();
        let SuccessedResultMessage = "";
        await this.$userEventApi.excelImportWithObjectUsingPOST(uploadData)
            .then((res => {
                if (res.data.length != 1 || (res.data[0].title != "檢核成功" && res.data[0].title != "匯入失敗")) {
                    checkHasError = true;
                    let count = 0;
                    res.data.forEach(eachMessage => {
                        count++;
                        this.errorMessageList.push({
                            index: count,
                            title: eachMessage.title,
                            context: eachMessage.message,
                        });
                    })
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t('eventS_importDataIncorrect').toString()); //匯入資料有誤
                } else if (res.data[0].title == "檢核成功") {
                    checkHasError = false;
                    SuccessedResultMessage = res.data[0].message;
                    this.isAnyUploadSuccessed = true;
                    LoadingUtil.close();
                    MessageUtil.messageSuccess(this.$t('global_importSuccess').toString()); //匯入成功
                } else if (res.data[0].title == "匯入失敗") {
                    checkHasError = false;
                    SuccessedResultMessage = res.data[0].message;
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t('global_importFailure').toString()); //匯入失敗
                } else {
                    checkHasError = false;
                    SuccessedResultMessage = this.$t('eventS_importDataIncorrect').toString() //匯入資料有誤
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t('eventS_importDataIncorrect').toString()); //匯入資料有誤
                }
            }))
            .catch((err) => {
                checkHasError = true;
                SuccessedResultMessage = this.$t('global_importFailure').toString(); //匯入失敗
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t('global_importFailure').toString());  //匯入失敗
            })
            .finally(() => {
                (this.$refs.uploadAndLog as any).handleUploadResult(this.errorMessageList, checkHasError, SuccessedResultMessage);
            });
    }
}

//取得父事件
function getParentTask(taskList, id) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            return i;
        }
    }
}

//取得子事件清單
function getSubList(subList) {
    var retval = []
    for (let i = 0; i < subList.length; i++) {
        retval.push({
            id: subList[i].id,
            name: subList[i].event,
            nameLink: null,
            start: getDate(subList[i].start, new Date()),
            duration: parseInt(subList[i].duration),
            percent: 100,
            type: "task",
            style: {
                base: {
                    fill: subList[i].classColor,
                    stroke: subList[i].classColor,
                }
            }
        })
    }
    retval.push({
        id: subList[0].id + "cover",
        name: null,
        nameLink: null,
        start: getDate(0, new Date()),
        duration: 1 * 24 * 60 * 60 * 1000,
        percent: 100,
        type: "task",
        style: {
            base: {
                fill: "transparent",
                stroke: "transparent",
            }
        }
    })
    return retval;
}

/**
 * 以今日零時為基準，計算事件時間
 * @param hours
 * @returns 
 */
function getDate(hours, eventDate) {
    const currentDate = new Date(eventDate);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const timeStamp = new Date(
        currentYear,
        currentMonth,
        currentDay,
        0,
        0,
        0
    ).getTime();
    return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}

/**
 * 回傳時段刻度上的字(0,15,30,45)
 * @param index
 * @returns 
 */
function getQuarterLabel(index) {
    return index * 15;
}

/**
 * 每15分鐘建立一個事件作為時段刻度
 * @param 
 * @returns 
 */
function getQuarter() {
    let array = new Array();

    // 時段淺綠色底色，與表格欄位名稱的底色相同
    let a: TaskInterface = {
        start: getDate(0, new Date()),
        duration: 1 * 24 * 60 * 60 * 1000,
        percent: 100,
        type: "task",
        style: {
            base: {
                //淺綠
                fill: "#f3f5f780",
                stroke: "#f3f5f780",
            },
        },
    }
    array.push(a);

    // 每15分鐘一個事件
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 4; j++) {
            let b = { ...a };
            b.start = getDate(i + j * 0.25, new Date());
            b.duration = 1.5 * 60 * 1000;
            b.label = getQuarterLabel(j).toString();
            b.style = {
                base: {
                    fill: "black",
                    stroke: "black",
                }
            };
            if (j != 0) {
                b.duration = 1 * 60 * 1000;
                b.style = {
                    base: {
                        fill: TaskColor.colorGray,
                        stroke: TaskColor.colorGray,
                    }
                };
            }
            array.push(b);
        }
    }
    return array;
}

/**
 * 取得事件日期之字串，用於顯示在表格左側欄位
 * @param 
 * @returns 
 */
function stringDate(date) {
    const currentDate = new Date(date);
    const currentYear = currentDate.getFullYear() - 1911;
    const currentMonth = (currentDate.getMonth() + 1 < 10) ? "0" + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1;
    const currentDay = (currentDate.getDate() < 10) ? "0" + currentDate.getDate() : currentDate.getDate();
    return currentYear + "/" + currentMonth + "/" + currentDay;
}

//所有事件
let tasks = [
    {
        //時段刻度
        id: "1",
        name: " ",
        userId: "",
        department:
            '<div style="background-color:#f3f5f780;line-height:35px;width:320px;text-align:center;">時段</div>',
        workingHour:
            '<div style="background-color:#f3f5f780;line-height:35px;width:2000px;text-align:center;white-space: pre"> </div>',
        date: null,
        dateLink: null,
        minute: null,
        duration: 0,
        percent: 100,
        type: "group",
        tasks: getQuarter(),
    },
];

// //套件基本設定
// let options = {
//     taskMapping: {
//         progress: "percent",
//     },
//     maxRows: 15,
//     maxHeight: 500,
//     row: {
//         height: 24,
//     },
//     calendar: {
//         hour: {
//             height: 24,
//         },
//         month: {
//             display: false,
//         },
//     },
//     chart: {
//         expander: {
//             display: false,
//         },
//     },
//     times: {
//         timeScale: 30 * 1000,
//         timeZoom: 2,
//     },
//     scope: {
//         before: 0,
//         after: 0,
//     },
//     taskList: {
//         //左側所需欄位，可自行新增
//         columns: [
//             {
//                 id: 1, //不可重複
//                 label: "科別", //欄位名稱
//                 value: "department", //欄位內容，需對應上方option其一欄位
//                 width: 110, //欄位預設寬度
//                 html: true, //是否接受使用html語法，預設為false
//             },
//             {
//                 id: 2,
//                 label: "姓名", //姓名
//                 value: "name",
//                 width: 90,
//                 html: true,
//             },
//             {
//                 id: 4,
//                 label: "日期",
//                 value: "dateLink",
//                 width: 80,
//                 html: true,
//             },
//             {
//                 id: 5,
//                 label: "班別",
//                 value: "workingHour",
//                 width: 120,
//                 html: true,
//             },
//             {
//                 id: 6,
//                 label: "分鐘數",
//                 value: "minute",
//                 width: 60,
//                 html: true,
//             },
//         ],
//     },
// };
