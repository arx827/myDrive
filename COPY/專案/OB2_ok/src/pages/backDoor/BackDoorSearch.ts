import CommonUtil from "@/assets/config/CommonUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from "@/components/shared/data-grid/models";
import { BackDoorSearchIutput, BackDoorSearchIutputBackDoorDbEnumEnum, PageOfMapOfstringAndstring } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import moment from "moment";

import { Component, Vue } from "vue-property-decorator";
import BackDoorUtil from "./BackDoorUtil";
import { DbOptionList, DbOptions } from "./model";

@Component({ components: { FblDataGrid } })
export default class BackDoorSearch extends Vue {

    searchTime: string = "";

    tokenCountDown: string = "";

    searchResultDataLength: number = 0;

    isLoading: boolean = false;

    statement: string = "說明：1. 最多查詢筆數：3000筆；2. 結尾不能加分號。";

    dbSelect: BackDoorSearchIutputBackDoorDbEnumEnum = null;

    dbOptions: DbOptions[] = DbOptionList.dbOptions;

    sqlScript: string = "";

    // 查詢結果
    searchResultGrid: FblPDataGridHolder<object> = {
        rowKey: 'rowKey',
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['10', '30', '50'],
            current: 1,
            pageSize: 10,
            total: 0,
            showTotal: true
        },
        columns: [],
    };

    /**
     * 開啟頁面
     */
    created() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'BackDoorSearch' },
            }).catch(() => { });
            return;
        }
        setInterval(() => {
            this.tokenCountDown = BackDoorUtil.showTokenExp();
        }, 1000)
    }

    /**
     * 重新整理
     */
    reload() {
        // 打查詢API 預計回傳欄位和資料陣列
        this.isLoading = true;
        let backDoorSearchIutput: BackDoorSearchIutput = {
            backDoorDbEnum: this.dbSelect,
            sqlString: this.sqlScript,
            page: this.searchResultGrid.pagination.current - 1,
            size: this.searchResultGrid.pagination.pageSize,
            backDoorToken: BackDoorUtil.getBackDoorToken(),
        }
        this.$backDoorSettingApi.executeSqlQueryUsingPOST(backDoorSearchIutput)
            .then((resp: AxiosResponse<PageOfMapOfstringAndstring>) => {
                const p = { ...this.searchResultGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                // 根據資料欄位數目新增欄位
                this.tableColumnsFill(resp.data.content);
                this.loadGridData(resp.data.content);
                this.searchResultGrid.pagination = p;
                this.searchResultDataLength = p.total;
            }).catch(e => console.error(e)).finally(() => this.isLoading = false);
    }

    /**
     * SQL查詢
     */
    onSearch() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'BackDoorSearch' },
            }).catch(() => { });
            return;
        }

        // 檢查SQL查詢條件
        if (!this.checkSearchParameters()) {
            return;
        }

        // 資料總長度重設
        this.searchResultDataLength = 0;

        // 重回第一頁
        this.searchResultGrid.pagination.current = 1;

        this.searchTime = moment().format('YYYY/MM/DD HH:mm:ss');

        this.reload();
    }

    /**
     * 檢查SQL查詢條件
     */
    checkSearchParameters() {
        let valid = false;
        // 檢查DB選擇和SQL腳本部為空
        valid = !ValidationUtil.isEmpty(this.dbSelect) && !ValidationUtil.isEmpty(this.sqlScript);
        if (!valid) {
            alert("DB和SQL不得為空");
            return valid;
        }
        // // 搜尋條件中可能包含分號故備註掉
        // valid = !this.sqlScript.includes(";");
        // if (!valid) {
        //     alert("SQL不得包含分號");
        //     return valid;
        // }
        return true;
    }

    /**
     * 動態填入資料欄位
     */
    tableColumnsFill(searchData: object[]) {
        let columnInfos = new Set<string>();
        searchData.forEach(s => {
            let colNames: string[] = Object.getOwnPropertyNames(s);
            colNames.forEach(colName => columnInfos.add(colName));
        });

        let dynamicColumns = [];
        columnInfos.forEach(col => {
            dynamicColumns.push({
                type: FblColumnType.PLAIN,
                title: col,
                property: col,
                width: CommonUtil.countColumnWidth(col.length),
                align: 'center',
            });
        });
        this.searchResultGrid.columns = dynamicColumns;
    }

    /**
     * 載入查詢資料
     */
    loadGridData(contents: object[]) {
        this.searchResultGrid.data = [];
        let rowKey = 1;
        contents.forEach(content => {
            content["rowKey"] = rowKey++;
            this.searchResultGrid.data.push(content);
        });
    }

    /**
     * 分頁動作
     * @param e 
     */
    onPageChange(e: FblPageEvent) {
        if (this.searchResultGrid.data.length > 0) {
            this.searchResultGrid.pagination = e.pagination;
            this.reload();
        }
    }

    /**
     * 匯出查詢結果
     */
    exportSearchResult() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'BackDoorSearch' },
            }).catch(() => { });
            return;
        }

        // 檢查SQL查詢條件
        if (!this.checkSearchParameters()) {
            return;
        }
        // 
        if (!this.searchResultDataLength) {
            alert("沒有資料匯出");
            return;
        }

        let backDoorSearchIutput: BackDoorSearchIutput = {
            backDoorDbEnum: this.dbSelect,
            sqlString: this.sqlScript,
            backDoorToken: BackDoorUtil.getBackDoorToken(),
        }
        LoadingUtil.show();
        this.$backDoorSettingApi.exportSqlQueryResultUsingPOST(backDoorSearchIutput, { responseType: 'blob' })
            .then((res) => {
                this.dealDownLoadData(res.data, "資料查詢結果.xlsx");
            })
            .catch((e) => {
                console.error(e);
                alert("匯出失敗");
            }).finally(() => {
                LoadingUtil.close();
            })
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
            alert("匯出失敗");
        }
    }


}