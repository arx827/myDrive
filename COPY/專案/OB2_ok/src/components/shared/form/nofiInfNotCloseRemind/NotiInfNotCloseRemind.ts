import CommonUtil from "@/assets/config/CommonUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import "@/assets/less/pendingPage.less";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { NotiOrInfNotCloseGrid } from "@fubonlife/obd-api-axios-sdk";
import { message } from "ant-design-vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder } from "../../data-grid/models";
import CountersignatureModal from "@/components/shared/countersignatureModal/CountersignatureModal.vue";
import NotificationModal from "@/components/shared/notificationMadal/NotificationModal.vue";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { NotiStep } from "@/pages/onDuty/model";

@Component({
    components: { FblDataGrid, CountersignatureModal, NotificationModal, DragModal }
})
export default class NotiInfNotCloseRemind extends Vue {
    // 從 OnDuty 傳入的未結案提醒清單內容
    @Prop()
    propNotiInfNotCloseList;

    // 取得未結案提醒清單內容
    get getNotCloseList(){
        return this.propList;
    }
    
    // 監聽未結案提醒清單內容是否有異動
    @Watch("getNotCloseList", {deep: true})
    watchNotiInfList(newVal){
        this.grid.data = newVal;
    }

    // 未結案提醒清單內容
    propList: any = [];

    // 會辦表單是否顯示
    isInfFormVisible: boolean = false;
    // 照會表單是否顯示
    isNotiFormVisible: boolean = false;

    // 會辦表單的資訊
    infFormData = {
        infStep: 0,
        caseNo : "",
        infInfoId: "",
        packNo: "",
        caseType: ""
    }

    // 照會表單的資訊
    notiFormDate = {
        notiStep: 0,
        notiInfoId: "",
        caseNo: "",
        packNo:"",
        caseLogId: ""
    }

    // 未結案提醒清單
    grid: FblPDataGridHolder<NotiOrInfNotCloseGrid> = {
        rowKey: "notiOrInfInfoId",
        data: [],
        scroll: {x:500,y:300},
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                property: "notiOrInfInfoId",
                title: this.$t('notiInfNotClose_notiOrInfInfoId').toString(), //作業單號碼
                width: 110,
                template: "notiOrInfInfoIdTemplate",
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('notiInfNotClose_custId').toString(), //受訪者ID
                width: 80,
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "custName",
                title: this.$t('notiInfNotClose_custName').toString(), //受訪者姓名
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
                
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "custTypeDesc",
                title: this.$t('notiInfNotClose_custType').toString(), //受訪者身分
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
                
            },
            {
                type: FblColumnType.TEMPLATE,
                property: "casePolicy",
                title: this.$t('notiInfNotClose_casePolicy').toString(), //保單號碼
                width: 100,
                template: "casePolicyTemplate",
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "taskName",
                title: this.$t('notiInfNotClose_taskId').toString(), //電訪項目
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "tmrName",
                title: this.$t('notiInfNotClose_tmrId').toString(), //電訪員
                width: 80,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "dueContDateString",
                title: this.$t('notiInfNotClose_dueContDate').toString(), //應電訪日
                width: 60,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "notCloseTypeDesc",
                title: this.$t('notiInfNotClose_processType').toString(), //作業單類型
                width: CommonUtil.countColumnWidth(5),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseCloseStatusDesc",
                title: this.$t('notiInfNotClose_caseCloseStatus').toString(), //結案狀態
                width: 70,
                align: 'center'
            },
        ]
    };

    created(){
        // 避免直接使用 prop 進來的參數，改以 propList 接資料並使用
        this.propList = this.propNotiInfNotCloseList;
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

    //作業單號碼超連結點擊時
    notiOrInfInfoIdClick(data: NotiOrInfNotCloseGrid){
        if(data.notCloseTypeId == 'NOTI'){
            // 照會
            this.isNotiFormVisible = true;
            this.notiFormDate = {
                notiStep: data.hasReview? NotiStep.review : undefined,
                notiInfoId: data.notiOrInfInfoId,
                caseNo: data.caseNo,
                packNo: data.packNo,
                caseLogId: data.caseLogId
            }
        }else{
            // 會辦
            this.isInfFormVisible = true;
            this.infFormData = {
                infStep: 0 ,
                caseNo : data.caseNo,
                infInfoId: data.notiOrInfInfoId,
                packNo: data.packNo,
                caseType: data.hasReview? 'review': undefined
            }
        }
    }

    //保單號碼點擊時
    casePolicyClick(data){
        //開啟案件查詢表單
        this.$emit("notiInfNotCloseRemindCaseSearch", data.casePolicy);
    }

    // 關閉視窗
    onCloseModal(modalName){
        this[modalName] = false;
    }
}