import CommonUtil from '@/assets/config/CommonUtil';
import ValidationUtil from '@/assets/config/ValidationUtil';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import { CaseCallUpHistoryInput, DeptMarkDto, PageOfDeptMarkDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { FblDataGrid, DragModal } })
export default class DeptMark extends Vue {

    @Prop()
    callUpHistoryParam: CaseCallUpHistoryInput;

    @Prop()
    caseNoFromCaseHistory: string;

    // 判斷是否從彈窗顯示
    @Prop()
    amIform: boolean;
    scroll = { x: 1300, y: 150 };

    ROW_KEY: string = "rowKey";

    currentPackNo: string = "";

    // 載入畫面
    public isLoading: boolean = false;

    // 交辦部門註記 內容
    public grid: FblPDataGridHolder<DeptMarkDto> = {
        rowKey: this.ROW_KEY,
        data: [],
        pagination: {
            showSizeChanger: false,
            pageSizeOptions: ['5', '10', '15'],
            current: 1,
            pageSize: 5,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: 'businessType',
                title: this.$t('deptMark_businessType').toString(), // 業務別
                width: CommonUtil.countColumnWidth(3),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'casePolicy',
                title: this.$t('deptMark_casePolicy').toString(), // 保單號碼
                width: CommonUtil.countColumnWidth(4),
                sorter: true
            },
            {
                type: FblColumnType.PLAIN,
                property: 'riskCtrlRole',
                title: this.$t('deptMark_riskCtrlRole').toString(), // 註記對象
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'custName',
                title: this.$t('deptMark_custName').toString(), // 客戶姓名
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.TEMPLATE,
                property: 'content',
                template: 'contentTemp',
                title: this.$t('deptMark_content').toString(), // 內容
                width: 400,
                maxLength: 250,
                fontSize: 16,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'memoMemberName',
                title: this.$t('deptMark_memoMemberName').toString(), // 註記人員
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'createDate',
                title: this.$t('deptMark_createDate').toString(), // 註記日期
                width: CommonUtil.countColumnWidth(4),
                sorter: true
            },
        ],
    };

    /**
     * 頁面初始化
     */
    created() {
        // 判斷是否從彈窗顯示
        if (this.amIform) {
            this.grid.pagination.pageSize = 15;
            this.scroll = { x: 1300, y: 450 };
        }
        if (!ValidationUtil.isEmpty(PackMatchModule) &&
            !ValidationUtil.isEmpty(PackMatchModule.matchedCasePack) &&
            !ValidationUtil.isEmpty(PackMatchModule.matchedCasePack.packNo)) {
            this.currentPackNo = PackMatchModule.matchedCasePack.packNo;
        }
        this.reload(this.currentPackNo);
    }

    /**
     * 頁面重整
     */
    reload(newPackNo: string) {
        if (ValidationUtil.isEmpty(this.caseNoFromCaseHistory)) {
            // caseNoFromCaseHistory為空表示開啟來源為值機畫面
            if (!ValidationUtil.isEmpty(newPackNo)) {
                this.currentPackNo = newPackNo;
                this.isLoading = true;
                this.$deptMarkApi.paginateDeptMarkUsingGET(
                    this.currentPackNo,
                    this.grid.pagination.current - 1,
                    this.grid.pagination.pageSize,
                    this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined)
                    .then((resp: AxiosResponse<PageOfDeptMarkDto>) => {
                        const p = { ...this.grid.pagination };
                        p.total = parseInt(resp.data.totalElements);
                        this.loadGridData(resp.data.content);
                        this.grid.pagination = p;
                        this.$emit('totalDataLength', p.total);
                    })
                    .catch(e => console.error(e))
                    .finally(() => this.isLoading = false);
            } else {
                console.error("PackMatchModule.matchedCasePack的packNo為空");
            }
        } else {
            // caseNoFromCaseHistory不為空表示開啟來源為案件歷程
            this.isLoading = true;
            this.$deptMarkApi.paginateDeptMarkByCaseNoUsingGET(
                this.caseNoFromCaseHistory,
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined)
                .then((resp: AxiosResponse<PageOfDeptMarkDto>) => {
                    const p = { ...this.grid.pagination };
                    p.total = parseInt(resp.data.totalElements);
                    this.loadGridData(resp.data.content);
                    this.grid.pagination = p;
                    this.$emit('totalDataLength', p.total);
                })
                .catch(e => console.error(e))
                .finally(() => this.isLoading = false);
        }

    }

    /**
     * 載入部門註記資料
     */
    loadGridData(contents: DeptMarkDto[]) {
        this.grid.data = [];
        let rowKey = 0;
        contents.forEach(content => {
            content[this.ROW_KEY] = rowKey++;
            this.grid.data.push(content);
        });
    }

    /**
     * 分頁動作
     * @param e 
     */
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload(this.currentPackNo);
        }
    }
}