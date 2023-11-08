import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TimePicker, DatePicker, Modal} from "ant-design-vue";
import {
    FblActionEvent,
    FblColumnType,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { ComponentState, SubTaskUpdateGrid } from "@fubonlife/obd-api-axios-sdk";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { eventUpdate } from "./model";
import EventModifyForm from "@/components/shared/form/eventModifyForm/EventModifyForm.vue";
import { eventModify } from "@/components/shared/form/eventModifyForm/model";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import EventsTableForm from "@/components/shared/form/eventsTableForm/EventsTableForm.vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";

@Component({
    components: { TimePicker, DatePicker, FblDataGrid, EventModifyForm, EventsTableForm }
})
export default class EventUpdateForm extends Vue {
    @Prop()
    public form;

    @Prop()
    public editAuth;

    //是否有修改過內容
    isModified: boolean = false;

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
        isConflic: false
    };

    //多筆修改表單
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
                        edit: true,
                        formatterBoolean: this.$props.editAuth,
                    },
                    {
                        name: "delete",
                        title: this.$t('global_delete').toString(), //刪除
                        delete: true,
                        formatterBoolean: this.$props.editAuth,
                    }
                ],
                width: 80,
            },
            {
                type: FblColumnType.PLAIN,
                property: "eventName",
                title: this.$t('eventS_eventType').toString(), //事件類別
                width: 100,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "startTime",
                title: this.$t('eventS_startOneWord').toString(), //起
                width: 100,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "endTime",
                title: this.$t('eventS_endOneWord').toString(), //訖
                width: 100,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "remark",
                title: this.$t('global_remark').toString(), //備註
                
            },
            
        ],
    };

    //設定該列的className用於改變字的顏色(有衝突->紅色,無衝突->黑色)
    rowClassName(record,index) {
        if(record.isConflict){
            return "red"
        }else{
            return "black"
        }
    }

    /**
     * 重新載入頁面
     * @returns 
     */
    reload() {
        this.eventUpdateForm = this.$props.form; 
        this.grid.data = this.eventUpdateForm.subTask;
        // this.isEventTypeDuplicate();
    }

    //建立表單
    created(): void {
        this.reload();
    }

    //若initData有異動則重設表單
    @Watch("form")
    onInitDataChanged(): void {
        this.reload();
    }

    //判斷編輯或刪除
    onEventTableActionClick(e: FblActionEvent<SubTaskUpdateGrid>) {
        this.isModified = true;
        this.$emit('changeEditState',true);
        switch (e.action.name) {
            case "delete":
                Modal.confirm({
                    title: this.$t('global_warning').toString(), //警告
                    content: this.$t('eventS_confirmDelete').toString() +'？', //確認刪除
                    okText: this.$t('global_ok').toString(), //確認
                    cancelText: this.$t('global_cancel').toString(),  //取消
                    icon: 'warning',
                    onOk: () => { this.removeSubTask(e.row.data.id);
                        this.grid.data = this.eventUpdateForm.subTask; },
                    onCancel: () => {  },
                })
                break;
            case "edit":
                this.titleText = this.$t('eventS_eventModify').toString(); //事件修改
                this.eventModifyFormVisible = true;
                this.eventModifyForm = {
                    id: e.row.data.id,
                    eventName: e.row.data.eventName,
                    dateString: this.eventUpdateForm.eventDate,
                    eventCode: e.row.data.eventCode,
                    eventDate: e.row.data.eventDate,
                    startTime: e.row.data.startTime,
                    endTime: e.row.data.endTime,
                    startTimeDate: moment(e.row.data.startTimeDate),
                    endTimeDate: moment(e.row.data.endTimeDate),
                    user: this.eventUpdateForm.user,
                    userId: this.eventUpdateForm.userId,
                    shiftWorkCode: this.eventUpdateForm.shiftWorkCode,
                    shiftWork: this.eventUpdateForm.shiftWork,
                    remark: e.row.data.remark,
                    isConflic: e.row.data.isConflict
                };
                break;
        }
    }

    //移除暫時刪除的事件
    removeSubTask(id) {
        let tempList = [];
        //找到相同id的資料列移除該筆資料
        this.eventUpdateForm.subTask.forEach(element => {
            if (element.id != id) {
                tempList.push(element);
            }
        });
        this.eventUpdateForm.subTask = tempList;
        // this.isEventTypeDuplicate();
    }

    //送出編輯表單
    onModifyFormSubmit(e: eventModify) {
        (this.$refs.eventModifyForm as any).onModifyFormSubmit();

    }

    //更新修改的內容
    modifyValue(data) {
        this.eventModifyFormVisible = false;
        let tempList = [];
        let updated = false;
        this.eventUpdateForm.subTask.forEach(element => {
            if (element.id != data.id) {
                //非本次更新的資料列，不做變更
                tempList.push(element);
            }else{
                //本次更新的資料列，取代成新資料
                updated = true;
                tempList.push(data);
            }
        });
        if(!updated){
            //先前未更新到資料，代表是新增，而非修改，因此另外更新
            tempList.push(data);
        }
        this.eventUpdateForm.subTask =[];
        this.eventUpdateForm.subTask = tempList;
        this.grid.data = [];
        this.grid.data = tempList;
        // this.isEventTypeDuplicate();
    }

    //取消編輯表單(關閉編輯表單)
    onModifyFormCalcel() {
        this.eventModifyFormVisible = false;
    }

    //送出暫存的修改紀錄
    async onFormUpdateSubmit() {
        if (this.isModified) {
            
            
            if(this.isAnyConflic()){
                MessageUtil.messageInfo(this.$t('eventS_eventTypeDuplicated').toString()); //除加班外，事件類型不可重複
            }else{                
                LoadingUtil.show();
                let eventDate = this.eventUpdateForm.eventDate;
                this.eventUpdateForm.deleteId = [];
                this.eventUpdateForm.originalTask.forEach(element => {
                    this.eventUpdateForm.deleteId.push(element.id)
                });
                //整理修改後的資料
                this.eventUpdateForm.subTask.forEach(element => {
                    this.eventUpdateForm.modifyTask.push({
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
                //送出此次修改後的內容
                await this.$userEventApi.modifyUserEventsUsingPOST(
                    (this.eventUpdateForm.deleteId.length==0)? [""]:this.eventUpdateForm.deleteId,
                    this.eventUpdateForm.userId, 
                    this.eventUpdateForm.modifyTask 
                )
                    .then((resp) => {
                        MessageUtil.messageSuccess(this.$t("eventS_dataSaved").toString()); //資料已儲存成功
                        LoadingUtil.close();
                        this.$emit("reloadData");
                    })
                    .catch((err) => {
                        LoadingUtil.close();
                        let errList : String[] = [];
                        errList = err.response.data.apiErrorCode.substring(1,err.response.data.apiErrorCode.length-1).split(",");
                        ErrorModalUtil.modalListError(errList,600);
                    })
                    .finally(() => {
                        this.eventUpdateForm.modifyTask = [];
                    });
            }
        } else {
            MessageUtil.messageSuccess(this.$t("eventS_dataSaved").toString()); //資料已儲存成功
            this.$emit("reloadData");
        }

    }

    //事件列表中，是否有衝突事件
    isAnyConflic(){
        let ans = false;
        this.grid.data.forEach((item)=>{
            if(item.isConflict){
                ans = true;
            }
        })
        return ans;
    }

    // OBD2UAT-76 不再檢核事件重複 2022/05/25
    //事件類別除加班外是否有重複
    // isEventTypeDuplicate(){
    //     let set = new Set();
    //     this.eventUpdateForm.subTask.forEach((item)=>{
    //         item.isConflict= false;
    //         if(set.has(item.eventCode) && "W" != item.eventCode){
    //             this.eventUpdateForm.subTask.find((each)=> each.eventCode == item.eventCode).isConflict = true;
    //             item.isConflict = true;
    //         }else{
    //             item.isConflict =false;
    //             set.add(item.eventCode);
    //         }
    //     })
    // }

    //新增事件
    addEventDetail() {
        this.$emit('changeEditState',true);
        this.isModified = true;
        this.titleText = this.$t("eventS_eventAdd").toString(); //事件新增
        this.eventModifyFormVisible = true;
        this.eventModifyForm = {
            id: null,
            eventName: null,
            dateString: this.eventUpdateForm.eventDate,
            eventCode: "",
            eventDate: this.eventUpdateForm.eventDate,
            startTime: null,
            endTime: null,
            startTimeDate: null,
            endTimeDate: null,
            user: this.eventUpdateForm.user,
            userId: this.eventUpdateForm.userId,
            shiftWorkCode: this.eventUpdateForm.shiftWorkCode,
            shiftWork: this.eventUpdateForm.shiftWork,
            remark: null,
            isConflic: false
        };
    }
}