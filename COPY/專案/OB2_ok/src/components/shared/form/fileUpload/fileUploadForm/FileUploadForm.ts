import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { OutputErrorCodeDto, ResponseEntity, UploadFileDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import { FblColumnType } from "../../../data-grid/models";
import FileUploadEditForm from "../fileUploadEditForm/FileUploadEditForm.vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import MomentUtil from "@/assets/config/MomentUtil";

@Component({
    components: { FileUploadEditForm, FblDataGrid }
})
export default class FileUploadForm extends Vue {
    @Prop()
    packNo: string;

    // 是否顯示 新增/修改 彈窗
    isAddAndEditVisible: boolean = false;

    // 新增 or 修改
    addAndEditType: string = null;

    // 列資料
    rowData: UploadFileDto = null;

    // 欄位資料
    gridData = {
        rowKey: 'rowkey',
        data: [],
        pagination: false,
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                template: 'handleTemp',
                // width: 100,
                align: 'right',
                title: '',
            },
            {
                type: FblColumnType.PLAIN,
                property: 'createDate',
                title: this.$t('fileUpload_createDate').toString(), // 上傳日期
                // width: 80,
                formatter: (data: UploadFileDto) => {
                    if (data) {
                        return MomentUtil.transformRocYearMonthDay(data.createDate);
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
                // width: 120,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'custId',
                title: this.$t('fileUpload_custId').toString(), // 受訪者ID
                // width: 120,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'custName',
                title: this.$t('fileUpload_custName').toString(), // 受訪者姓名
                // width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'fileTypeName',
                title: this.$t('fileUpload_fileTypeName').toString(), // 文件類別
                // width: 120,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'fileStatementName',
                title: this.$t('fileUpload_fileStatementName').toString(), // 文件說明
                // width: 150,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'remark',
                title: this.$t('fileUpload_otherFileStatementName').toString(), // 其他文件說明
                // width: 150,
            },
            {
                type: FblColumnType.TEMPLATE,
                template: 'fileNameTemp',
                property: 'fileName',
                title: this.$t('fileUpload_fileName').toString(), // 檔案名稱
                // width: 150,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'packNo',
                title: this.$t('fileUpload_packNo').toString(), // 名單序號
                // width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'taskName',
                title: this.$t('fileUpload_taskName').toString(), // 電訪項目
                // width: 80,
            },
        ],
    };

    /**
     * 下載檔案
     * @param data 
     */
    handleDownload(data: UploadFileDto) {
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
     * 上傳檔案儲存
     */
    handleSave() {
        (this.$refs.fileUploadEditForm as any).handleSubmit();
    }

    /**
     * 新增時有上傳檔但直接離開，則把未儲存的檔案刪除
     */
    handleClose() {
        (this.$refs.fileUploadEditForm as any).handleLeave();
    }

    /**
     * 上傳檔案儲存後的動作
     */
    fileUploadSaved() {
        this.reload();
        this.isAddAndEditVisible = false;
    }

    /**
     * 刪除上傳檔案
     * @param data 
     */
    handleDeleteData(data: UploadFileDto) {
        console.log('delete data:', data);
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('fileUpload_delete').toString(), // 刪除
            content: this.$t('fileUpload_deleteLogConfirm').toString(), // 確認刪除此上傳檔案相關紀錄?
            onOk: () => {
                LoadingUtil.show();
                this.$fileUploadApi.deleteUploadFileUsingPOST(data.fileId)
                    .then((resp: AxiosResponse<OutputErrorCodeDto>) => {
                        LoadingUtil.close();
                        if (resp.data.success) {
                            Modal.info({ content: this.$t('fileUpload_deleteSuccess').toString() }); // 刪除成功!
                            this.reload();
                        }
                    }).catch(e => {
                        console.error(e);
                        LoadingUtil.close();
                    });
            }
        });
    }

    /**
     * 編輯上傳檔案
     * @param data 
     */
    handleEditData(data: UploadFileDto) {
        this.addAndEditType = this.$t('fileUpload_fileUploadModify').toString(); // 檔案上傳-修改
        this.rowData = data;
        this.isAddAndEditVisible = true;
    }

    /**
     * 新增上傳檔案
     */
    handleNewData() {
        this.addAndEditType = this.$t('fileUpload_fileUploadAdd').toString(); // 檔案上傳-新增
        this.rowData = null;
        this.isAddAndEditVisible = true;
    }

    /**
     * 頁面啟動第一動
     */
    created() {
        console.log(this.packNo);
        this.reload();
    }

    /**
     * 重新整理
     */
    reload() {
        LoadingUtil.show();
        this.gridData.data = [];
        this.$fileUploadApi.paginateFileListUsingGET(this.packNo)
            .then((resp: AxiosResponse<UploadFileDto[]>) => {
                if (!VlidationUtil.isEmpty(resp.data)) {
                    this.gridData.data = resp.data;
                    let rowkey = 0;
                    (this.gridData.data as UploadFileDto[]).sort()
                        .forEach(d => {
                            d["rowkey"] = rowkey++;
                        })
                    console.log(this.gridData.data);
                }
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
    }
}