import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { FblColumnType } from '@/components/shared/data-grid/models';
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { ResponseEntity, UploadFileLogDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil from "@/assets/config/CommonUtil";
import MomentUtil from "@/assets/config/MomentUtil";

@Component({
    components: { FblDataGrid }
})
export default class UploadFileHistroy extends Vue {

    @Prop()
    caseNo: string;

    @Prop()
    caseLogid: string;

    // 新增 or 修改
    addAndEditType: string = null;

    // 列資料
    rowData: UploadFileLogDto = null;

    // 欄位資料
    gridData = {
        rowKey: 'rowkey',
        data: [],
        pagination: false,
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: 'createDate',
                title: this.$t('fileUpload_createDate').toString(), // 上傳日期
                align: "center",
                width: CommonUtil.countColumnWidth(10),
                formatter: (data: UploadFileLogDto) => {
                    if (data) {
                        return MomentUtil.transformRoc(data.createDate);
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: 'casePolicy',
                title: this.$t('fileUpload_policyNo').toString(), // 保單號碼
                // customRender: (data) => {
                //     if (data.policyNo) {
                //         return data.policyNo.join(', ');
                //     }
                //     return '';
                // },
                align: "center",
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'custId',
                title: this.$t('fileUpload_custId').toString(), // 受訪者ID
                align: "center",
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'custName',
                title: this.$t('fileUpload_custName').toString(), // 受訪者姓名
                align: "center",
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'fileTypeName',
                title: this.$t('fileUpload_fileTypeName').toString(), // 文件類別
                align: "center",
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'fileStatementName',
                title: this.$t('fileUpload_fileStatementName').toString(), // 文件說明
                align: "center",
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'remark',
                title: this.$t('fileUpload_otherFileStatementName').toString(), // 其他文件說明
                align: "center",
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'fileNameTemp',
                property: 'fileName',
                title: this.$t('fileUpload_fileName').toString(), // 檔案名稱
                align: "center",
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'packNo',
                title: this.$t('fileUpload_packNo').toString(), // 名單序號
                align: "center",
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: 'taskName',
                title: this.$t('fileUpload_taskName').toString(), // 電訪項目
                align: "center",
                width: CommonUtil.countColumnWidth(10),
            },
        ],
    };

    /**
     * 下載檔案
     * @param data 
     */
    handleDownload(data: UploadFileLogDto) {
        console.log('下載:', data);
        LoadingUtil.show();
        this.$fileUploadApi.downloadFileUsingPOST(data.fileId, { responseType: 'blob' })
            .then((resp: AxiosResponse<ResponseEntity>) => {
                this.dealDownLoadData(resp.data, [data.fileName, data.fileExtension].join("."));
            }).catch(e => {
                console.error(e);
                ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
            }).finally(() => LoadingUtil.close());
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
            ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
        }
    }

    /**
     * 頁面啟動第一動
     */
    created() {
        this.reload();
    }

    /**
     * 重新整理
     */
    reload() {
        LoadingUtil.show();
        this.gridData.data = [];
        this.$historyApi.getUploadFileHistoryUsingGET(VlidationUtil.isEmpty(this.caseLogid) ? "" : this.caseLogid, VlidationUtil.isEmpty(this.caseNo) ? "" : this.caseNo)
            .then((resp: AxiosResponse<UploadFileLogDto[]>) => {
                if (!VlidationUtil.isEmpty(resp.data)) {
                    let rowkey = 0;
                    this.gridData.data = resp.data.map(d => {
                        d["rowkey"] = rowkey++;
                        return d;
                    }).sort();
                }
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
    }
}