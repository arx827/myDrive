import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TimePicker, DatePicker} from "ant-design-vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { eventUpdate } from "./model";
import EventModifyForm from "@/components/shared/form/eventModifyForm/EventModifyForm.vue";
import { eventModify } from "@/components/shared/form/eventModifyForm/model";
import MomentUtil from "@/assets/config/MomentUtil";
import EventsTableForm from "@/components/shared/form/eventsTableForm/EventsTableForm.vue";
import { ComponentState } from "@fubonlife/obd-api-axios-sdk";

@Component({
    components: { TimePicker, DatePicker, FblDataGrid, EventModifyForm, EventsTableForm }
})
export default class EventUpdateForm extends Vue {
    //是否顯示異動後班別欄位
    isShiftWrokModifyVisible = false;
    
    @Prop()
    public initData;

    @Prop()
    public editAuth;

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

    /**
     * 重新載入頁面
     * @returns 
     */
    async reload() {
        this.reset();
        this.confirmVisible = false;
        this.eventModifyFormVisible = false;
        LoadingUtil.show();
        try {
            //取得欲更新的人員當日所有事件
            const resp = await this.$userEventApi.getUserEventUpdateGridWithFilterUsingGET(this.initData.eventDate, this.initData.userId);
            this.eventUpdateForm.updateDate = (resp.data.updateDate ==null)? null : MomentUtil.transformRocYearMonthDayHHMMSS(resp.data.updateDate);
            this.eventUpdateForm.updateName = resp.data.updateId;
            this.eventUpdateForm.originalTask = resp.data.subTaskGrids;
            this.eventUpdateForm.subTask = resp.data.subTaskGrids;
            (this.$refs.eventsTableForm as any).reload();
        } catch (err) {
            LoadingUtil.close();
            console.error(err);
        } finally {
            LoadingUtil.close();
        }
    }

    //建立表單
    created(): void {
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
        this.eventUpdateForm = this.initData;
        this.eventUpdateForm.subTask = [];
        this.eventUpdateForm.deleteId = [];
        this.eventUpdateForm.modifyTask = [];
        this.eventUpdateForm.originalTask = [];
    }

    //清除表單狀態
    clearForm() {
        //清除表單欄位
        this.eventUpdateForm = {
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
    }

    //判斷表單是否修改過
    changeEditState(flag){
        this.$emit('changeEditState',flag);
    }

    //送出暫存的修改紀錄
    onFormUpdateSubmit() {
        (this.$refs.eventsTableForm as any).onFormUpdateSubmit();
    }

    //重整父頁面
    reloadParent(){
        this.$emit("reloadData");
    }

    //事件列表中，是否有衝突事件
    isAnyConflic(){
        return (this.$refs.eventsTableForm as any).isAnyConflic();
    }
}