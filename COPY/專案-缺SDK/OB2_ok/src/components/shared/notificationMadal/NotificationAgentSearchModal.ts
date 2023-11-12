import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { NotificationOtherAgentDto, PageOfNotificationOtherAgentDto } from "@fubonlife/obd-api-axios-sdk";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from "../data-grid/models";
import { NotificationAgentSearchForm } from "./model";
import { AxiosResponse } from "axios";

@Component({
    components: { HiddenFolde, FblDataGrid }
})
export default class NotificationAgentSearchModal extends Vue {

    @Prop()
    searchOtherAgentShow: boolean;

    // 資料載入中
    isLoading: boolean = false;

    notificationAgentSearchForm: NotificationAgentSearchForm = {
        agentId: "",
        agentName: "",
        agentUnitId: "",
    }

    otherAgentGrid: FblPDataGridHolder<NotificationOtherAgentDto> = {
        rowKey: "agentId",
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
                template: "pickTemplate",
                title: this.$t('notificationAgentSearchModal_pickAgent').toString(),  // 選取
                width: CommonUtil.countColumnWidth(2),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentId",
                title: this.$t('notificationAgentSearchModal_agentId').toString(),  // 業務員ID
                width: CommonUtil.countColumnWidth(5),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentName",
                title: this.$t('notificationAgentSearchModal_agentName').toString(),  // 業務員姓名
                width: CommonUtil.countColumnWidth(5),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentUnitId",
                title: this.$t('notificationAgentSearchModal_agentUnitId').toString(),  // 單位代碼
                width: CommonUtil.countColumnWidth(4),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentUnit",
                title: this.$t('notificationAgentSearchModal_agentUnit').toString(),  // 單位名稱
                width: CommonUtil.countColumnWidth(8),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentOfficeTel",
                title: this.$t('notificationAgentSearchModal_agentOfficeTel').toString(), // 公司電話
                width: CommonUtil.countColumnWidth(10),
                align: 'center',
                formatter: (data: NotificationOtherAgentDto) => {
                    if (!ValidationUtil.isEmpty(data.agentOfficeTel) &&
                        !ValidationUtil.isEmpty(data.ext)) {
                        return [data.agentOfficeTel, data.ext].join("#");
                    } else if (!ValidationUtil.isEmpty(data.agentOfficeTel)) {
                        return data.agentOfficeTel;
                    } else if (!ValidationUtil.isEmpty(data.ext)) {
                        return "#" + data.ext;
                    } else {
                        return "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentMob",
                title: this.$t('notificationAgentSearchModal_agentMob').toString(),  // 手機號碼
                width: CommonUtil.countColumnWidth(10),
                align: 'center',
            },
        ]
    }

    @Watch("searchOtherAgentShow")
    clearSearchForm() {
        this.notificationAgentSearchForm = {
            agentId: "",
            agentName: "",
            agentUnitId: "",
        }
        this.otherAgentGrid.data = [];
        this.otherAgentGrid.pagination = {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" }
        }
    }

    /**
     * 搜尋
     */
    searchOtherAgent() {
        this.otherAgentGrid.pagination.current = 1;
        // 搜尋前檢查
        if (ValidationUtil.isEmpty(this.notificationAgentSearchForm.agentId) &&
            ValidationUtil.isEmpty(this.notificationAgentSearchForm.agentName) &&
            ValidationUtil.isEmpty(this.notificationAgentSearchForm.agentUnitId)) {
            ErrorModalUtil.modalError(this.$t('notificationAgentSearchModal_noSearchCondition').toString()) // 請輸入單位代號、業務員ID、業務員姓名擇一輸入
        } else {
            this.reload();
        }
    }

    /**
     * 重新抓資料
     */
    reload() {
        this.isLoading = true;
        this.$notificationAgentApi.searchNotiAgentUsingGET(
            this.notificationAgentSearchForm.agentId,
            this.notificationAgentSearchForm.agentName,
            this.notificationAgentSearchForm.agentUnitId,
            this.otherAgentGrid.pagination.current - 1,
            this.otherAgentGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfNotificationOtherAgentDto>) => {
                this.otherAgentGrid.data = [];
                const p = { ...this.otherAgentGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                if (resp.data && resp.data.content && resp.data.content.length > 0) {
                    this.otherAgentGrid.data = resp.data.content;
                }
                this.otherAgentGrid.pagination = p;
            })
            .catch(e => console.error(e))
            .finally(() => this.isLoading = false);
    }

    /**
     * 換頁
     * @param e 
     */
    onPageChange(e: FblPageEvent) {
        if (this.otherAgentGrid.data.length > 0) {
            this.otherAgentGrid.sort = e.sort;
            this.otherAgentGrid.pagination = e.pagination;
            this.reload();
        }
    }

    /**
     * 選取其他業務員資料
     * @param data 
     */
    pickAgent(data: NotificationOtherAgentDto) {
        this.$emit("pickAgent", data);
    }
}