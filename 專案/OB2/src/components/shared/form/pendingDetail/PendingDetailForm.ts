import CommonUtil from "@/assets/config/CommonUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType, FblPageEvent } from "@/components/shared/data-grid/models";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { PendingCaseDetailDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import CaseHistoryForm from "../history/caseHistory/CaseHistoryForm.vue";
import { CaseHistoryParam } from "./model";

@Component({
    components: { FblDataGrid, DragModal, CaseHistoryForm }
})
export default class PendingDetailForm extends Vue {

    @Prop()
    record: object;

    @Prop()
    item: string;

    // 案件歷程
    isShowCaseHistory: boolean = false;
    caseHistoryParam: CaseHistoryParam = {
        custId: "",
        casePolicy: "",
        caseNo: "",
    }

    public gridData = {
        rowKey: 'rowKey',
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" }
        },
        scroll: { x: 500, y: 370 },
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                property: 'casePolicy',
                template: 'casePolicyTemp',
                title: this.$t('pendingCaseManagement_casePolicy').toString(), // 保單號碼
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'taskName',
                title: this.$t('pendingCaseManagement_taskName').toString(), // 電訪項目
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'questName',
                title: this.$t('pendingCaseManagement_questName').toString(), // 問卷名稱
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'custName',
                title: this.$t('pendingCaseManagement_custName').toString(), // 受訪者姓名
                width: CommonUtil.countColumnWidth(5),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'dueContDateChg',
                title: this.$t('pendingCaseManagement_dueContDateChg').toString(), // 應電訪日
                width: CommonUtil.countColumnWidth(4),
                align: "center",
                formatter: (data: PendingCaseDetailDto) => {
                    return MomentUtil.transformRocYearMonthDay(data.dueContDateChg);
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: 'pendingDayNo',
                title: this.$t('pendingCaseManagement_pendingDayNo').toString(), // Pending天數
                width: CommonUtil.countColumnWidth(6),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'sysTypeCodeName',
                title: this.$t('pendingCaseManagement_sysTypeCodeName').toString(), // 通路別
                width: CommonUtil.countColumnWidth(3),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'agentUnitNo',
                title: this.$t('pendingCaseManagement_agentUnitNo').toString(), // 單位代號
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'agentUnitName',
                title: this.$t('pendingCaseManagement_agentUnitName').toString(), // 單位名稱
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'superUnitName',
                title: this.$t('pendingCaseManagement_departmentName').toString(), // 部門
                width: CommonUtil.countColumnWidth(5),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'unitName',
                title: this.$t('pendingCaseManagement_divisionName').toString(), // 科別
                width: CommonUtil.countColumnWidth(5),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'tmrName',
                title: this.$t('pendingCaseManagement_tmrName').toString(), // 電訪員
                width: CommonUtil.countColumnWidth(3),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'agentAssignTime',
                title: this.$t('pendingCaseManagement_agentAssignTime').toString(), // 指定聯絡時段
                width: CommonUtil.countColumnWidth(6),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'visitDate',
                title: this.$t('pendingCaseManagement_visitDate').toString(), // 方便連絡時段
                width: CommonUtil.countColumnWidth(6),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'lastPickDate',
                title: this.$t('pendingCaseManagement_lastPickDate').toString(), // 最近一次取件時間
                width: CommonUtil.countColumnWidth(8),
                align: "center",
            },
        ],
    };

    /**
     * 頁面啟動
     */
    created() {
        console.log("this.record", this.record);
        LoadingUtil.show();
        this.$pendingApi.caseDetailUsingPOST(this.item, this.record["tmrId"])
            .then((resp: AxiosResponse<PendingCaseDetailDto[]>) => {
                this.gridData.data = [];
                let rowKey = 0;
                resp.data.forEach(r => {
                    r["rowKey"] = rowKey++;
                    this.gridData.data.push(r);
                });
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
    }

    /**
     * 開啟 案件歷程 視窗
     */
    openCaseHistory(data: PendingCaseDetailDto) {
        console.log("PendingCaseDetailDto", data);
        this.caseHistoryParam.caseNo = data.caseNo;
        this.caseHistoryParam.casePolicy = data.casePolicy;
        // this.caseHistoryParam.custId = data.custId; // VL903-1028 [Pending案件管理]點擊保單號碼後，另開『案件歷程』視窗也帶入了受訪者ID資訊
        this.isShowCaseHistory = true;
    }

    onPageChange(e: FblPageEvent) {
        console.log("e", e);
        this.gridData.pagination.current = e.pagination.current;
        this.gridData.pagination.pageSize = e.pagination.pageSize;
        this.gridData.pagination.total = e.pagination.total;
    }
}