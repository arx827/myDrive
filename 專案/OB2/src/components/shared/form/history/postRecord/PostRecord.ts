import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType, FblPDataGridHolder } from "@/components/shared/data-grid/models";
import { PostRecordDto } from "@fubonlife/obd-api-axios-sdk";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
    components: { FblDataGrid }
})
export default class PostRecord extends Vue {

    @Prop()
    public caseLogId;

    @Prop()
    public caseId;

    isLoading: boolean = false;

    // 初始化頁面
    created() {
        LoadingUtil.show();

        this.$postRecordApi.getPostRecordUsingPOST(
            this.caseId,
            this.caseLogId,
            this.grid.pagination.current - 1,
            this.grid.pagination.pageSize,
        ).then((resp) => {
            this.grid.data = resp.data.content;
            const p = { ...this.grid.pagination };
            p.total = parseInt(resp.data.totalElements);
            this.grid.pagination = p
        }).catch((err) => {
            // 郵寄紀錄失敗
            ErrorModalUtil.modalError(this.$t('postRecordForm_searchFailed').toString())
        }).finally(() => {
            LoadingUtil.close();
        })

    }

    // data grid Setting
    grid: FblPDataGridHolder<PostRecordDto> = {
        rowKey: "id",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        scroll: { x: 50, y: 500 },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "policyNo",
                title: this.$t('pedding_policyNo').toString(), //保單號碼
            },
            {
                type: FblColumnType.PLAIN,
                property: "packNo",
                title: this.$t('pedding_packNo').toString(), //名單序號
            },
            {
                type: FblColumnType.PLAIN,
                property: "taskName",
                title: this.$t('onDutyPage_taskName').toString(), //電訪項目
            },
            {
                type: FblColumnType.PLAIN,
                property: "questName",
                title: this.$t('case_search_grid_questName').toString(), //問卷名稱
            },
            {
                type: FblColumnType.PLAIN,
                property: "receiver",
                title: this.$t('postRecordForm_receiver_name').toString(), //收件人姓名
            },
            {
                type: FblColumnType.PLAIN,
                property: "address",
                title: this.$t('postRecordForm_address').toString(), //郵寄地址
            },
            {
                type: FblColumnType.PLAIN,
                property: "letterDate",
                title: this.$t('postRecordForm_letterDate').toString(), //產信日期
            },
            {
                type: FblColumnType.PLAIN,
                property: "mailByPostDate",
                title: this.$t('postRecordForm_mailByPostDate').toString(), //郵寄日期
            },
            {
                type: FblColumnType.PLAIN,
                property: "manualLetterStatus",
                title: this.$t('postRecordForm_manualLetterStatus').toString(), //信函狀態
            },
            {
                type: FblColumnType.PLAIN,
                property: "deliverStatus",
                title: this.$t('postRecordForm_deliverStatus').toString(), //投遞狀態
            },
            {
                type: FblColumnType.PLAIN,
                property: "cancelLetter",
                title: this.$t('postRecordForm_cancelLetter').toString(), //取消信函
            },
            {
                type: FblColumnType.PLAIN,
                property: "returnDate",
                title: this.$t('riskControl_ntrnReturnDate').toString(), //退回日期
            },
            {
                type: FblColumnType.PLAIN,
                property: "returnReason",
                title: this.$t('riskControl_ntrnReturnReason').toString(), //退回原因
            },
        ],
    };
}