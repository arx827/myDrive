
import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { Option } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: { HiddenFolde }
})
export default class DispatchManagementPage extends Vue {

    // 搜尋結果是否可見
    isTableVisible: boolean = true;

    // 電訪項目映射物件
    itemMapping = {
        dispatchManagement_pendingPicked: this.$t('dispatchManagement_pendingPicked').toString(), // 新件待取件
        dispatchManagement_pendingDued: this.$t('dispatchManagement_pendingDued').toString(), // 新件逾時未取
        dispatchManagement_callBackPicked: this.$t('dispatchManagement_callBackPicked').toString(), // 回撥件待取件
        dispatchManagement_callBackDued: this.$t('dispatchManagement_callBackDued').toString(), // 回撥件逾時未取
        dispatchManagement_pendingAboutDued: this.$t('dispatchManagement_pendingAboutDued').toString(), // 新件即將逾時未取
        dispatchManagement_callBackAboutDued: this.$t('dispatchManagement_callBackAboutDued').toString(), // 回撥件即將逾時未取
    }

    // 統計資料
    // statisticData: Map<string, Map<string, number>> = new Map();
    statisticData = null;

    // 電訪項目代碼與名稱映射
    taskMap: Map<string, string> = null;

    // 電訪項目搜尋表單
    taskSearchForm = {
        taskIds: []
    }

    // 電訪項目下拉選單
    selectTaskOptions = [];

    // 更新時間
    updateTime = "";

    // 要搜尋過才能匯出
    exportDisable: boolean = true;

    // 欄位長度隨電訪項目增長
    tableColumnsChildren = [];
    tableColumns = [
        {
            title: this.$t('dispatchManagement_item').toString(), // 項目
            dataIndex: 'item',
            key: 'key',
            width: CommonUtil.countColumnWidth(6),
            align: "center"
        },
        {
            title: this.$t('dispatchManagement_taskItem').toString(), // 電訪項目
            children: [
            ],
        }
    ];

    // table資料
    tableData = [];

    /**
     * 頁面開啟
     */
    created() {
        this.taskSearch();
    }

    /**
     * 重新載入
     */
    reload() {
        LoadingUtil.show();
        const getTaskIdNameSelectedPromise = this.$taskSettingApi.getTaskIdNameSelectedUsingGET("")
            .then((resp: AxiosResponse<Option[]>) => {
                this.selectTaskOptions = resp.data;
                this.taskMap = new Map(this.selectTaskOptions.map(s => [s.value, s.label]));
            })
            .then(() => {
                this.$dispatchManagementApi.countAllTypeDispatchCaseUsingPOST(this.searchAllIfNone())
                    .then((resp: AxiosResponse<{
                        [key: string]: {
                            [key: string]: number;
                        };
                    }>) => {
                        this.statisticData = new Map(Object
                            .keys(resp.data).map(
                                k1 => [k1, new Map(Object.keys(resp.data[k1]).map(k2 => [k2, resp.data[k1][k2]]))]
                            ));

                        this.tableData = [];
                        let key = 0;
                        this.statisticData.forEach((v1: Map<string, number>, k1: string) => {
                            let sum = 0;
                            let data = {
                                key: key++,
                                item: this.itemMapping[k1],
                                callItem: "callItem"
                            }
                            v1.forEach((v2: number, k2: string) => {
                                data[k2] = v2;
                                sum = sum + v2;
                            });
                            data["sum"] = sum;
                            this.tableData.push(data);
                        });

                        // 第一欄「項目」排序順序固定
                        this.tableData.sort((a, b) => {
                            const fixedOder = [
                                this.$t('dispatchManagement_pendingPicked').toString(), // 新件待取件
                                this.$t('dispatchManagement_callBackPicked').toString(), // 回撥件待取件
                                this.$t('dispatchManagement_pendingAboutDued').toString(), // 新件即將逾時未取
                                this.$t('dispatchManagement_callBackAboutDued').toString(), // 回撥件即將逾時未取
                                this.$t('dispatchManagement_pendingDued').toString(), // 新件逾時未取
                                this.$t('dispatchManagement_callBackDued').toString() // 回撥件逾時未取
                            ];
                            return fixedOder.indexOf(a.item) - fixedOder.indexOf(b.item);
                        });

                        // table欄位生成僅與前端有關，與後端資料脫鉤。 
                        this.tableColumnsFill(this.searchAllIfNone());
                        this.isTableVisible = true;
                    })
                    .catch(e => console.error(e))
                    .finally(() => LoadingUtil.close());
            })
            .catch(e => console.error(e));
    }

    /**
     * 動態填入電訪項目欄
     */
    tableColumnsFill(columnInfos: string[]) {
        this.tableColumnsChildren = [];
        columnInfos.forEach(s => {
            const label = this.taskMap.get(s);
            // 動態多筆的電訪項目欄位
            this.tableColumnsChildren.push({
                title: label,
                dataIndex: s,
                key: s,
                width: CommonUtil.countColumnWidth(label.length - 4),
            });
        });
        this.tableColumns[1].children = this.tableColumnsChildren;
    }

    /**
     * 如果搜尋條件為空則搜尋全部
     */
    searchAllIfNone(): string[] {
        let backendInput = null;
        // 依照電訪項目名稱排序，與後端匯出一致
        if (ValidationUtil.isEmpty(this.taskSearchForm.taskIds) && this.taskSearchForm.taskIds.length == 0) {
            backendInput = this.selectTaskOptions.sort((a, b) => a.label.localeCompare(b.label)).map(s => s.value);
        } else {
            backendInput = this.taskSearchForm.taskIds.sort((a, b) => this.taskMap.get(a).localeCompare(this.taskMap.get(b)));
        }
        return backendInput;
    }

    /**
     * 於『待電訪』(/PendingPage)開啟案件列表
     */
    openPendingPage(record, index, event, text, col) {
        this.$router.push({
            path: '/pending-page',
            query: {
                dispatchType: record.item, // 第一欄數值(項目)
                contactItemId: col.key, // 該欄數值(電訪項目ID)
                dispatchNum: text // 點擊件數
            }
        });
    }

    /**
     * 電訪項目搜尋
     */
    taskSearch() {
        this.reload();
        this.exportDisable = false;
        this.updateTime = this.$t('dispatchManagement_roc').toString() + MomentUtil.transformRocYearMonthDayHHMMSS(MomentUtil.transferDate(new Date())); // "民國 "
    }

    /**
     * 電訪項目重置
     */
    resetTaskSearchForm() {
        this.taskSearchForm.taskIds = [];
        this.exportDisable = true;
        this.isTableVisible = false;
    }

    /**
     * 搜尋結果匯出
     */
    exportSearchResult() {
        if (!this.exportDisable) {
            if (this.tableData.length < 1) {
                ErrorModalUtil.modalError(this.$t('dispatchManagement_exportNoData').toString()); // 無符合資料，無法匯出
            } else {
                LoadingUtil.show();
                this.$dispatchManagementApi.exportDispatchCaseUsingPOST(this.searchAllIfNone(), this.$t('dispatchManagement_exportFileName').toString(), // 派件管理_即時監控.xlsx
                    { responseType: 'blob' })
                    .then((res) => {
                        this.dealDownLoadData(res.data, this.$t('dispatchManagement_exportFileName').toString()); // 派件管理_即時監控.xlsx
                        MessageUtil.messageInfo(this.$t('dispatchManagement_exportSuccess').toString()); // 匯出成功
                    })
                    .catch((e) => {
                        console.error(e);
                        ErrorModalUtil.modalError(this.$t('dispatchManagement_exportFailure').toString()) // 匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            ErrorModalUtil.modalError(this.$t('dispatchManagement_searchBeforeExport').toString()); // 請先執行查詢再匯出
        }
    }

    /**
     * 處理後端回傳的下載內容
     * @param resData 
     * @param fileName 
     */
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
        } catch (e) {
            console.error(e);
            MessageUtil.messageError(this.$t('dispatchManagement_exportFailure').toString()); // 匯出失敗
        }
    }

    /**
     * 下拉式清單搜尋用(依input過濾顯示符合的清單)
     * @param input 
     * @param option 
     * @returns 
     */
    filterOption(input: string, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }
}