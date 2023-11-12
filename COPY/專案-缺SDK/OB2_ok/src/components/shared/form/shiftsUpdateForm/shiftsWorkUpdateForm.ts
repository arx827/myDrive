import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TimePicker, DatePicker, Modal, message } from "ant-design-vue";
import {
    FblActionEvent,
    FblColumnType,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { SubTaskUpdateGrid, UserShiftWorkUpdate, UserShiftWorkDto, DeleteUserEventGrid } from "@fubonlife/obd-api-axios-sdk";
import LoadingUtil from "@/assets/config/LoadingUtil";
import EventModifyForm from "@/components/shared/form/eventModifyForm/EventModifyForm.vue";
import { eventModify } from "@/components/shared/form/eventModifyForm/model";
import moment from "moment";
import DragModal from '@/components/shared/dragModal/DragModal.vue'
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { LoginModule } from '@/plugins/store/LoginModule';
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { validShiftsWorkUpdateResult } from "./model";


@Component({
    components: { TimePicker, DatePicker, FblDataGrid, EventModifyForm,DragModal }
})
export default class ShiftsWorkUpdateForm extends Vue {

    @Prop()
    public initData;

    @Prop()
    public overDate: boolean;

    // 顯示班表設定之事件 flag
    isShowEventData: boolean = false;
    isAddEventBtnShow: boolean = false;

    // 顯示提示 選擇空值表示刪除班別
    isShowNoticeSelectedEmptyShift: boolean = false;

    // 顯示 系統已刪除班別及相關事件 modal
    isShowDeletedEventsModal: boolean = false;
    // 刪除班別及相關事件後顯示資訊(班別資訊)
    deleteShiftWorkInfo = {
        workDate: null,
        user: null,
        shiftWork: null,
    }

    //新增或編輯表框時的資料
    shiftsDataForm: any = {};
    isEditing: boolean = true;
    selectedLabel: string = "";

    //編輯時的物件資料
    userShifitWorkUpdate: UserShiftWorkUpdate = {
        shiftWorkCode: null,
        remarks: null,
    };

    //表單驗證參數
    updateShiftWorkFeedback: boolean = false;
    updateShiftWorkHover: string = '';
    stateUpdateShiftWork: string = "";
    updateShiftWorkMsg: string = '';

    //下拉式選單初始化
    shiftWorkCodeOptions = []

    //新增userShiftWork
    userCreation: UserShiftWorkDto;

    //二次確認視窗是否顯示
    confirmVisible: boolean = false;

    //單筆修改單資料
    eventModifyFormVisible = false;
    titleText: string = '';
    eventModifyForm: eventModify = {
        id: null,
        eventName: null,
        dateString: null,
        eventCode: null,
        eventDate: null,
        startTime: null,
        startTimeDate: null,
        endTimeDate: null,
        endTime: null,
        shiftWorkCode: null,
        shiftWork: null,
        remark: null,
        user: null,
        userId: null,
        isTimeDulplicated: false
    };

    // 多筆修改表單
    shifitUpdateForm = {
        key: null,
        eventDate: null,
        originalShiftWorkCode: null,//原始的班別
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
        remark: "",
        modifiedShiftWorkCode: null,//改變後的班別
    };

    // data grid Setting
    grid: FblPDataGridHolder<SubTaskUpdateGrid> = {
        rowKey: "id",
        data: [],
        columns: [
            {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t("global_edit").toString(), //編輯
                        edit: true
                    }, {
                        name: "delete",
                        title: this.$t('global_delete').toString(), //刪除
                        delete: true
                    }
                ],
                width: 80,
            },
            {
                type: FblColumnType.PLAIN,
                property: "eventName",
                title: this.$t('eventS_eventName').toString(), //事件名稱
            },
            {
                type: FblColumnType.PLAIN,
                property: "startTime",
                title: this.$t('eventS_startOneWord').toString(), //起
                width:100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "endTime",
                title: this.$t('eventS_endOneWord').toString(), //訖
                width:100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "remark",
                title: this.$t('global_remark').toString(), //備註
            },
        ],
    };

    // 刪除班別及相關事件後顯示資訊(事件資訊)
    deletedGrid: FblPDataGridHolder<DeleteUserEventGrid> = {
        rowKey: "id",
        data: [],
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "eventName",
                title: this.$t('eventS_eventName').toString(), //事件名稱
            },
            {
                type: FblColumnType.PLAIN,
                property: "startTime",
                title: this.$t('eventS_startOneWord').toString(), //起
            },
            {
                type: FblColumnType.PLAIN,
                property: "endTime",
                title: this.$t('eventS_endOneWord').toString(), //訖
            },
            {
                type: FblColumnType.PLAIN,
                property: "remark",
                title: this.$t('global_remark').toString(), //備註
            },
        ],
    };
    //設定該列的className用於改變字的顏色(有衝突->紅色,無衝突->黑色) 
    //如果有同樣的事件或者時間相衝突的時候設定為衝突
    rowClassName(record, index) {
        if (record.isConflict || record.isTimeDulplicated) {
            return "red"
        } else {
            return "black"
        }
    }
    /**
     * 重新載入頁面
     * @returns 
     */
    async reload() {
        this.reset();

        //匯入update表單資料來自父件
        this.shifitUpdateForm.updateDate = this.initData.updateDate;
        this.shifitUpdateForm.user = this.initData.userName;
        this.shifitUpdateForm.originalShiftWorkCode = this.initData.shiftWorkCode;
        this.shifitUpdateForm.remark = this.initData.remark;
        this.shifitUpdateForm.eventDate = this.initData.date;
        this.shifitUpdateForm.userId = this.initData.userId;

        //透過父元件傳過來的userId來搜尋updateName
        if (this.initData.editing) {
            let respUserDto = await this.$userApi.getUserUsingGET(this.initData.updateId);
            this.shifitUpdateForm.updateName = respUserDto.data.unitId + "-" + respUserDto.data.name;
        }
        if (this.initData.editing || this.initData.isHoliday) {
            try {
                let workDate = MomentUtil.formatStringDate(this.initData.workDate, "YYYY-MM-DD");
                let paraMeterDate = MomentUtil.transformRocYearMonthDay(workDate);
                //從後端拿到當天的事件
                const resp = await this.$userEventApi.getUserEventUpdateGridWithFilterUsingGET(paraMeterDate, this.initData.userId);
                this.shifitUpdateForm.originalTask = resp.data.subTaskGrids;
                this.shifitUpdateForm.subTask = resp.data.subTaskGrids;
                this.grid.data = this.shifitUpdateForm.subTask;
            } catch (err) {
                ErrorModalUtil.modalError(this.$t('global_failure').toString()); //失敗
            }
        }

        // 判斷若為編輯 且不為過期 時 初始的異動班別是請選擇，所以打開 提示
        if (this.initData.editing && !this.overDate) {
            this.isShowNoticeSelectedEmptyShift = true;
        }
    }
    //顯示一開始的班別設定涵蓋時間
    get showOriginalShiftWork(): string {
        if (this.initData.shiftWorkCode != "尚未設定班別") {
            let retvl;
            this.shiftWorkCodeOptions.forEach(shiftTime => {
                if (shiftTime.value == this.initData.shiftWorkCode) {
                    retvl = shiftTime.label
                }
            })
            return retvl
        } else {
            return this.initData.shiftWorkCode
        }
    }
    //初始化下拉式班別選單資訊
    async initShfitWorkCodeOptions() {
        try {
            const resp = await this.$userShiftWorkApi.getAllShiftsWorkUsingGET();
            let shiftWorks = resp.data;
            this.shiftWorkCodeOptions.push(
                {
                    value: "",
                    label: "" //空白
                }
            )
            shiftWorks.forEach(shiftWork => {
                let workStartTime = shiftWork.workStartTime.substring(11, 16);
                let workEndTime = shiftWork.workEndTime.substring(11, 16);

                this.shiftWorkCodeOptions.push(
                    {
                        value: shiftWork.shiftWorkCode,
                        label: shiftWork.shiftWorkCode + "(" + workStartTime + "~" + workEndTime + ")"
                    }
                )
            })
            this.shifitUpdateForm.modifiedShiftWorkCode = "";
            // this.isEventTypeDuplicate();
            this.isEventTypeTimeDulplicate();
        } catch (e) {
            ErrorModalUtil.modalError(e);
        }
    }
    //建立表單
    async created() {
        //初始化下拉式班別選單資訊
        this.initShfitWorkCodeOptions();
        this.reload();
    }

    //若initData有異動則重設表單
    @Watch("initData")
    onInitDataChanged(): void {
        this.reload();
    }

    //重設表單
    reset() {
        this.clearForm();
        // this.shifitUpdateForm = this.initData;
        this.shifitUpdateForm.subTask = [];
        this.shifitUpdateForm.deleteId = [];
        this.shifitUpdateForm.modifyTask = [];
        this.shifitUpdateForm.originalTask = [];
        //清除彈掉出來的表格
        this.confirmVisible = false;
        this.eventModifyFormVisible = false;
        this.shifitUpdateForm.modifiedShiftWorkCode = "";
        //清除欄位驗證
        this.updateShiftWorkFeedback = false;
        this.updateShiftWorkHover = '';
        this.stateUpdateShiftWork = "";
        this.updateShiftWorkMsg = '';

    }

    //清除表單狀態
    clearForm() {
        //清除表單欄位
        this.shifitUpdateForm = {
            key: null,
            eventDate: null,
            shiftWorkCode: null,
            shiftWork: null,
            originalShiftWorkCode: null,
            user: null,
            userId: null,
            subTask: [],
            deleteId: [],
            modifyTask: [],
            originalTask: [],
            updateDate: null,
            updateName: null,
            remark: "",
            modifiedShiftWorkCode: null,
        };
    }
    @Watch("shifitUpdateForm.subTask")
    onSubTaskChange() {
        this.grid.data = this.shifitUpdateForm.subTask;
    }
    //判斷編輯或刪除
    async onEventTableActionClick(e: FblActionEvent<SubTaskUpdateGrid>) {
        if (!this.overDate) {
            this.$emit('changeEditState', true, this.shifitUpdateForm.modifiedShiftWorkCode);
            switch (e.action.name) {
                case "delete":

                    await this.removeSubTask(e.row.data.id);
                    break;
                case "edit":
                    this.titleText = this.$t('eventS_eventModify').toString(); //事件修改
                    this.eventModifyFormVisible = true;
                    this.eventModifyForm = {
                        id: e.row.data.id,
                        eventName: e.row.data.eventName,
                        dateString: this.shifitUpdateForm.eventDate,
                        eventCode: e.row.data.eventCode,
                        eventDate: e.row.data.eventDate,
                        startTime: e.row.data.startTime,
                        endTime: e.row.data.endTime,
                        startTimeDate: moment(e.row.data.startTimeDate),
                        endTimeDate: moment(e.row.data.endTimeDate),
                        user: this.shifitUpdateForm.user,
                        userId: this.shifitUpdateForm.userId,
                        shiftWorkCode: this.shifitUpdateForm.shiftWorkCode == null ? this.shifitUpdateForm.originalShiftWorkCode : this.shifitUpdateForm.shiftWorkCode,
                        shiftWork: this.selectedLabel == "" ? this.showOriginalShiftWork : this.selectedLabel,
                        remark: e.row.data.remark,
                    };
                    break;
            }
        } else {
            MessageUtil.messageInfo(this.$t('shiftS_dataReadOnly').toString()) //資料已過時，唯讀不能編輯或刪除
        }
    }

    //移除暫時刪除的事件
    async removeSubTask(id) {
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('global_delete').toString(),
            content: this.$t('eventS_confirmDelete').toString() + '?',
            onOk: () => {
                let tempList = [];
                //找到相同id的資料列移除該筆資料
                this.shifitUpdateForm.subTask.forEach(element => {
                    if (element.id != id) {
                        tempList.push(element);
                    }
                });
                this.shifitUpdateForm.subTask = tempList;
                // this.isEventTypeDuplicate();
                this.isEventTypeTimeDulplicate();
                MessageUtil.messageSuccess(this.$t('global_dataDeleteSucess').toString())
            }
        });

    }

    //送出編輯表單
    onModifyFormSubmit(e: eventModify) {
        (this.$refs.eventModifyForm as any).onModifyFormSubmit();

    }
    fblDataGridShow: boolean = true;

    //更新修改的內容
    modifyValue(data) {
        this.eventModifyFormVisible = false;
        let tempList = [];
        let updated = false;
        this.shifitUpdateForm.subTask.forEach(element => {
            if (element.id != data.id) {
                //非本次更新的資料列，不做變更
                tempList.push(element);
            } else {
                //本次更新的資料列，取代成新資料
                updated = true;
                tempList.push(data);
            }
        });
        if (!updated) {
            //先前未更新到資料，代表是新增，而非修改，因此另外更新
            tempList.push(data);
        }

        this.shifitUpdateForm.subTask = tempList;

        this.grid.data = this.shifitUpdateForm.subTask;

        /**
         * OBD2_1493_班別設定事件異動衝突顯示
         * 將有錯誤呈現紅字的 事件恢復為黑字
         ***********************************/
        this.grid.data.forEach(data=>{
            var el:NodeListOf<Element> = document.querySelectorAll('[data-row-key="'+ data.id + '"]');
            if(el.length > 0){
                el[0].classList.replace('red', 'black');
            }
        });
        /****************************************/
        

        // this.isEventTypeDuplicate();
        this.isEventTypeTimeDulplicate();

    }

    // OBD2UAT-76 不再檢核事件重複 2022/05/25
    //事件類別除加班外是否有重複
    // isEventTypeDuplicate() {
    //     let set = new Set();
    //     this.shifitUpdateForm.subTask.forEach((item) => {
    //         if (set.has(item.eventCode) && "W" != item.eventCode) {
    //             this.shifitUpdateForm.subTask.find(each => item.eventCode == each.eventCode).isConflict = true;
    //             item.isConflict = true;
    //         } else {
    //             item.isConflict = false;
    //             set.add(item.eventCode);
    //         }
    //     })
    // }

    //事件時間是否有衝突
    isEventTypeTimeDulplicate() {
        this.shifitUpdateForm.subTask.forEach((item) => {
            //將時間衝突狀態歸零for modify和刪除驗證
            item.isTimeDulplicated = false;
            //過濾掉除了自己之外的陣列
            let temparayArray = this.shifitUpdateForm.subTask.filter(item2 => item2 != item);
            //讓事件自己本身和其他事件時間比對
            temparayArray.forEach(item3 => {
                if (!item.isTimeDulplicated && (item.startTime >= item3.endTime || item.endTime <= item3.startTime)) {
                    item.isTimeDulplicated = false;
                } else {
                    item.isTimeDulplicated = true;
                }
            })
        })

    }


    //事件列表中，是否有衝突事件
    isAnyConflic() {
        let flag = false;
        this.grid.data.forEach((item) => {
            if (item.isConflict) {
                flag = true;
            }
        })
        return flag;
    }

    //取消編輯表單(關閉編輯表單)
    onModifyFormCalcel() {
        this.eventModifyFormVisible = false;
    }

    //選擇新班別後判斷是否和事件衝突
    async onSelectShfitCodeChange(value, label) {

        this.$emit('changeEditState', true, this.shifitUpdateForm.modifiedShiftWorkCode);
        this.selectedLabel = "";
        this.shiftWorkCodeOptions.forEach(option => {
            if (option.value == value) {
                this.selectedLabel = option.label;
            }
        })
        this.shifitUpdateForm.shiftWorkCode = value;
        //清除欄位驗證
        this.updateShiftWorkFeedback = false;
        this.updateShiftWorkHover = '';
        this.stateUpdateShiftWork = "";
        this.updateShiftWorkMsg = '';

        
        // if (this.initData.editing && !ValidationUtil.isEmpty(value)) {  //如果為編輯狀態的時候判斷當日事件是否與新班別時段衝突 確定 value 不為空才打 確認有無衝突
        // OBD2-1622 事件先設定加班，班別設定新增時無出現事件修改- 將原本上方多判斷的 this.initData.editing 刪除 (新增: false / 編輯 true)
        if (!ValidationUtil.isEmpty(value)) {
            try {
                //轉換成後端api需要的日期格式
                let workDate = MomentUtil.formatStringDate(this.initData.workDate, "YYYY-MM-DD");
                let paraMeterDate = MomentUtil.transformRocYearMonthDay(workDate);
                const resp = await this.$userEventApi.getCheckedListUsingGET(paraMeterDate, value, this.initData.userId);
                this.shifitUpdateForm.originalTask = resp.data;
                this.shifitUpdateForm.subTask = [];
                resp.data.forEach((e: SubTaskUpdateGrid) => {
                    this.shifitUpdateForm.subTask.push(e)
                })
                this.shifitUpdateForm.subTask.forEach(e => {
                    if (e.isConflict == true) {
                        e.isConflict = false;
                        e.isTimeDulplicated = true;
                    }
                })
                this.grid.data = this.shifitUpdateForm.subTask;
            } catch (err) {
                ErrorModalUtil.modalError(this.$t('global_failure').toString());
            }

        }

        // 不為請選擇，控制顯示 事件資訊
        if (!ValidationUtil.isEmpty(value)) {
            this.isShowEventData = true;
            this.isAddEventBtnShow = true;
            this.isShowNoticeSelectedEmptyShift = false; // 提示關閉
        } else {
            this.isShowEventData = false;
            this.isAddEventBtnShow = false;
            this.isShowNoticeSelectedEmptyShift = true; // 提示打開
        }

    }
    //送出暫存的修改紀錄,更新班別資訊(主要也是最終送出到後端處)
    async onFormUpdateSubmit() {
        //如果原本有班別設定時進行編輯
        if (this.initData.editing) {

            if (this.isAnyConflic()) {
                ErrorModalUtil.modalError(this.$t('eventS_eventTypeDuplicated').toString()); //除加班外事件類型不可重複
            } else {
                if (this.shifitUpdateForm.originalShiftWorkCode == this.shifitUpdateForm.shiftWorkCode) {
                    MessageUtil.messageInfo(this.$t('shiftS_shiftWorkCodeNotChange').toString()); //班別無異動
                }
                //填入後端updateBody需要的參數
                this.userShifitWorkUpdate.shiftWorkCode = this.shifitUpdateForm.shiftWorkCode;
                this.userShifitWorkUpdate.remarks = this.shifitUpdateForm.remark;
                this.userShifitWorkUpdate.updateDate = MomentUtil.default(new Date());
                this.userShifitWorkUpdate.userId = this.initData.userId;
                this.userShifitWorkUpdate.isEditing = true;
                //取得異動人員資訊
                const state = LoginModule.loginState;
                this.userShifitWorkUpdate.updateId = state.me.id;
                // let eventDate = MomentUtil.transformRocYearMonthDay(this.initData.workDate.toString());
                this.shifitUpdateForm.deleteId = [];
                this.shifitUpdateForm.originalTask.forEach(element => {
                    this.shifitUpdateForm.deleteId.push(element.id)
                });
                let eventDate = this.initData.date;
                //整理修改後的資料
                this.shifitUpdateForm.modifyTask = [];
                this.shifitUpdateForm.subTask.forEach(element => {
                    this.shifitUpdateForm.modifyTask.push({
                        id: element.id,
                        shiftWorkCode: element.shiftWorkCode,
                        eventCode: element.eventCode,
                        userId: element.userId,
                        eventDate: MomentUtil.transformRocYearMonthDay(eventDate.slice(0, 10)) + " 00:00:00",
                        startTime: MomentUtil.transformRocYearMonthDay(eventDate.slice(0, 10)) + " " + element.startTime + ":00",
                        endTime: MomentUtil.transformRocYearMonthDay(eventDate.slice(0, 10)) + " " + element.endTime + ":00",
                        remark: element.remark
                    })
                })


                this.userShifitWorkUpdate.oldEventIds = (this.shifitUpdateForm.deleteId.length == 0) ? [""] : this.shifitUpdateForm.deleteId;
                this.userShifitWorkUpdate.newSubTasks = this.shifitUpdateForm.modifyTask;

                try {
                    const resp = await this.$userShiftWorkApi.modifyShiftWorkbyUserIdUsingPOST(
                        this.initData.workDate,
                        this.userShifitWorkUpdate,
                        this.initData.userId,
                    )
                    return true
                } catch (error) {
                    // OBD2_1493_班別設定事件異動衝突顯示 : 整理回傳錯誤訊息，並將錯誤的事件列呈現紅字
                    var errMsg = this.onFormUpdateSubmitErrorHandle(error);
                    ErrorModalUtil.modalError(errMsg);
                    return false;
                }

            }
        } else {//新增模式

            if (this.isAnyConflic()) {
                ErrorModalUtil.modalError(this.$t('eventS_eventTypeDuplicated').toString());
            } else {
                //填入後端updateBody需要的參數
                this.userShifitWorkUpdate.shiftWorkCode = this.shifitUpdateForm.shiftWorkCode;
                this.userShifitWorkUpdate.remarks = this.shifitUpdateForm.remark;
                this.userShifitWorkUpdate.updateDate = MomentUtil.default(new Date());
                this.userShifitWorkUpdate.userId = this.initData.userId;
                this.userShifitWorkUpdate.isEditing = false;
                //取得異動人員資訊by Vuex
                const state = LoginModule.loginState;
                this.userShifitWorkUpdate.updateId = state.me.id;

                this.shifitUpdateForm.deleteId = [];
                this.shifitUpdateForm.originalTask.forEach(element => {
                    this.shifitUpdateForm.deleteId.push(element.id)
                });
                //整理修改後的資料
                this.shifitUpdateForm.subTask.forEach(element => {
                    this.shifitUpdateForm.modifyTask.push({
                        id: element.id,
                        shiftWorkCode: element.shiftWorkCode,
                        eventCode: element.eventCode,
                        userId: element.userId,
                        eventDate: MomentUtil.transformRocYearMonthDay(this.initData.date.slice(0, 10)) + " 00:00:00",
                        startTime: MomentUtil.transformRocYearMonthDay(this.initData.date.slice(0, 10)) + " " + element.startTime + ":00",
                        endTime: MomentUtil.transformRocYearMonthDay(this.initData.date.slice(0, 10)) + " " + element.endTime + ":00",
                        remark: element.remark
                    })
                })

                this.userShifitWorkUpdate.oldEventIds = (this.shifitUpdateForm.deleteId.length == 0) ? [""] : this.shifitUpdateForm.deleteId;
                this.userShifitWorkUpdate.newSubTasks = this.shifitUpdateForm.modifyTask;

                try {
                    const resp = await this.$userShiftWorkApi.modifyShiftWorkbyUserIdUsingPOST(
                        this.initData.workDate,
                        this.userShifitWorkUpdate,
                        this.initData.userId,
                    )
                    return true
                } catch (error) {
                    // OBD2_1493_班別設定事件異動衝突顯示 : 整理回傳錯誤訊息，並將錯誤的事件列呈現紅字
                    var errMsg = this.onFormUpdateSubmitErrorHandle(error);
                    ErrorModalUtil.modalError(errMsg);
                    return false;
                } finally {
                    this.shifitUpdateForm.modifyTask = []
                }
            }
        }
    }

    /**
     * OBD2_1493_班別設定事件異動衝突顯示
     * 整理回傳錯誤訊息，並將錯誤的事件列呈現紅字
     ***********************************/
    onFormUpdateSubmitErrorHandle(error:any){
         // 取得錯誤訊息，正規去除 "[" "]"
         var tempErrMsg = error.response.data.message.match(/(?<=\[)(.*)(?=\])/g);
         // 錯誤訊息以 ", " 切分並換行，回傳給 ErrorModalUtil 使用
         var errMsg = tempErrMsg.toString().replace(", ", "\n");

         // 依回傳錯誤訊息的 第"幾"筆，算出是第幾列有問題
         var arrIndex = [];
         tempErrMsg.toString().split(", ").forEach(elem=>{
             var ind = Number(elem.match(/(?<=第)(.*)(?=筆)/g));
             arrIndex.push(ind-1);
         });
         
         // 共幾列有問題，取得那幾列並呈現紅字
         arrIndex.forEach(i=>{
             var elmId = this.grid.data[i].id;
             var el:NodeListOf<Element> = document.querySelectorAll('[data-row-key="'+ elmId + '"]');
             if(el.length > 0){
                 el[0].classList.replace('black', 'red');
             }

         });

         return errMsg;
    }


    //新增班別表單內的事件
    addEventDetail() {
        this.$emit('changeEditState', true, this.shifitUpdateForm.modifiedShiftWorkCode);
        this.titleText = this.$t("eventS_eventAdd").toString(); //事件新增
        this.eventModifyFormVisible = true;
        this.eventModifyForm = {
            id: null,
            eventName: null,
            dateString: this.shifitUpdateForm.eventDate,
            eventCode: "",
            eventDate: this.shifitUpdateForm.eventDate,
            startTime: null,
            endTime: null,
            startTimeDate: null,
            endTimeDate: null,
            user: this.shifitUpdateForm.user,
            userId: this.shifitUpdateForm.userId,
            shiftWorkCode: this.shifitUpdateForm.shiftWorkCode == null ? this.shifitUpdateForm.originalShiftWorkCode : this.shifitUpdateForm.shiftWorkCode,
            shiftWork: this.selectedLabel == "" ? this.showOriginalShiftWork : this.selectedLabel,
            remark: null,
        };
    }


    //表單驗證
    validateSubmit() {
        var result: validShiftsWorkUpdateResult = { success: false, message: "" };

        // 如果不是編輯 (新增) 則驗證 異動班別欄位
        if (!this.initData.editing && !this.initData.isHoliday) {
            this.validateUpdatedShiftWork(null, this.shifitUpdateForm.modifiedShiftWorkCode, () => {
                if (this.stateUpdateShiftWork == 'error') {
                    result.success = false;
                }
            });
        }

        // 如果為編輯，且異動班表為請選擇
        if (this.initData.editing) {

            // 異動班別為請選擇
            if (ValidationUtil.isEmpty(this.shifitUpdateForm.modifiedShiftWorkCode)) {
                result.success = false;
                result.message = this.$t('shiftS_forSureDeleteShiftAndEvents').toString(); //此班別將清空並刪除相關事件，確認執行?

            }

        }

        return result;

    }
    /**
    * 異動後班別，篩選條件，必填。
    * @param rule 驗證規則 
    * @param value 輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateUpdatedShiftWork(rule, value, callback) {
        this.updateShiftWorkFeedback = true;
        this.updateShiftWorkHover = '';
        this.stateUpdateShiftWork = "";
        this.updateShiftWorkMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            this.updateShiftWorkFeedback = false;
            callback();
        } else {
            this.updateShiftWorkHover = "hover";
            this.stateUpdateShiftWork = "error";
            this.updateShiftWorkMsg = this.$t('eventS_modifiedShiftWorkRequired').toString(); //異動後班別必填
            callback(() => { });
        }
        callback();
    }

    // 刪除 班別及相關事件 api
    async deleteShiftAndEvent() {
        var deleteResult = false;

        var workDate = MomentUtil.formatStringDate(this.initData.workDate, "YYYY-MM-DD");

        try {
            var resp = await this.$userShiftWorkApi.deleteUserShiftWorkUsingPOST(this.initData.userId, workDate);

            if (resp) {
                // 整理顯示刪除後的班別資訊
                this.deleteShiftWorkInfo.workDate = resp.data.workDate;
                this.deleteShiftWorkInfo.user = resp.data.userInfo;
                this.shiftWorkCodeOptions.forEach(shiftTime => {
                    if (shiftTime.value == resp.data.shiftWorkCode) {
                        this.deleteShiftWorkInfo.shiftWork = shiftTime.label
                    }
                })
                // 整理顯示刪除後的事件資訊
                this.deletedGrid.data = resp.data.deleteUserEventGridList;
                // 顯示 系統已刪除班別及相關事件 modal
                this.isShowDeletedEventsModal = true;

                deleteResult = true;
            }
        } catch (error) {
            ErrorModalUtil.modalError("以userId和Date刪除單一班別設定失敗：" + error.response.data.message);
            deleteResult = false;
        }

        return deleteResult;

    }

    // 關閉 刪除班別及相關事件後出現的 視窗
    closeDeletedEventModal() {
        this.isShowDeletedEventsModal = false; //系統已刪除班別及相關事件 modal
        this.$emit('closeCheckModalDeletedShiftAndEvents', false); // 關閉編輯班別設定的 modal
        this.$emit('reloadData'); // 重新 reload 班別搜尋
    }

}