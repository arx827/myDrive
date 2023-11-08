import ErrorModalUtil from "@/assets/config/ErrorModalUtil";

import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder
} from "@/components/shared/data-grid/models";
import { NotiReplyPersonGrid, ImportMessageDto } from "@fubonlife/obd-api-axios-sdk";
import { FileGrid } from "./model";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: { FblDataGrid }
})
export default class NotiReplyPerson extends Vue {


    created() {
        this.reload();

    }
    //上方最新更新日期
    latestUpdateRocDate: string = "";

    lastestUpdatedUnitNameAndPerson: string = "";

    reload() {
        LoadingUtil.show();

        this.$notiReplyPersonApi.paginateNotiTypeUsingGET(this.grid.pagination.current - 1, this.grid.pagination.pageSize)
            .then(resp => {

                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.pagination = p;
                this.grid.data = resp.data.content;

                this.latestUpdateRocDate = MomentUtil.transformRocYearMonthDayHHMMSS(this.grid.data[0].dbupdateDate);
                this.lastestUpdatedUnitNameAndPerson = this.grid.data[0].dbupdateUnitName + " " + this.grid.data[0].dbupdateName;
            }).catch(error => {
                console.log(error);
            })
            .finally(() => {
                LoadingUtil.close();
            }
            )
    }

    /**
     * 
     * @param e 使用者列表下一頁事件 
     * @returns 
     */
    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        this.reload();
    }




    grid: FblPDataGridHolder<NotiReplyPersonGrid> = {
        rowKey: "notiReplyPersonId",
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
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "notiReplyPersonId",
                title: this.$t('eventS_serialNumber').toString(),
            },
            {
                type: FblColumnType.PLAIN,
                property: "type",
                title: this.$t('pedding_type').toString(),
            }, {
                type: FblColumnType.PLAIN,
                property: "unitId",
                title: this.$t("userF_unitCode").toString(),//異動時間

            },
            {
                type: FblColumnType.PLAIN,
                property: "unitName",
                title: this.$t("pedding_agentUnitName").toString(),
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("visitPersonSetting_contactPersonEmail").toString(),//窗口email
                property: "personEmail",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("communicatSetting_ccEmail").toString(),
                property: "carbonCopyEmail",//副本email
            }

        ]

    };

    // ===================================匯入相關============================================

    notiPersonUploadFileName: string = "";

    uploadingFile: FileGrid;

    uploadValidateSuccessFlag: boolean = false;

    fileList: File[] = [];


    /**
     * @description 選擇檔案
     */
    beforeUpload(file) {

        const isExcel = (file.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || file.type.includes("application/vnd.ms-excel"));

        let validationFlag = true;
        //判斷檔案類型
        if (!isExcel) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                // 錯誤
                title: this.$t('global_error').toString(),
                // 檔案格式僅可上傳xlsx
                content: this.$t('notiReplyPerson_fileFormat_xlsx').toString(),
            });
            validationFlag = false;
            return false;
        }

        // 選擇之附檔大小不得為零
        if (parseInt(file.size) == 0) {
            MessageUtil.messageInfo(this.$t('notiReplyPerson_file_not_blank').toString()); // 檔案欄位不可為空值
            return false;
        }
        if (validationFlag) {
            this.uploadValidateSuccessFlag = true;
            this.uploadingFile = file;
            this.fileList = [file];
            this.notiPersonUploadFileName = file.name; // 將選擇檔案的檔案名稱 放到 本機附檔欄位供查看
        }
        return false;
    }

    
    // 移除已上傳附件
    handleRemove() {
        this.fileList = [];
        this.notiPersonUploadFileName = "";
    }

    handleUploadChange() {
        if (this.uploadValidateSuccessFlag&&this.notiPersonUploadFileName!="") {
            LoadingUtil.show();
            this.$notiReplyPersonApi.excelImportUsingPOST(this.uploadingFile)
                .then((resp: AxiosResponse<ImportMessageDto[]>) => {
                    let importErrorMessageList = resp.data.map(e=>e.message);
                    if (importErrorMessageList.length == 0) {
                        MessageUtil.messageSuccess(this.$t('noticeManualLetterForm_upload_file_success').toString()); // 上傳成功
                        LoadingUtil.close();
                        this.notiPersonUploadFileName="";
                        this.uploadingFile = null;
                        this.fileList = [];
                        this.uploadValidateSuccessFlag=false;
                        this.reload();
                    } else {
                        ErrorModalUtil.modalListError( importErrorMessageList , 500);
                          
                    }
                }).catch((err) => {

                    ErrorModalUtil.modalError(this.$t(err.response.data.message).toString()); // 上傳失敗 非預期之錯誤
                }).finally(() => {
                    LoadingUtil.close();
                    this.notiPersonUploadFileName="";
                    this.uploadingFile = null;
                    this.fileList = [];
                    this.uploadValidateSuccessFlag=false;
                });

        }else{
            return
        }


    }

    //驗證上傳檔案大小
    /**
     * @description 
     */
    validateUploadFileSize(target) {
        return parseInt(target) / 1024 / 1024 < 15
    }


    // =================================================================================

    exportNotiReplyPerson() {

        LoadingUtil.show();
        this.$notiReplyPersonApi.exportRoleSearchResultUsingGET({ responseType: 'blob' })
            .then(resp => {
                this.dealDownLoadData(resp.data, this.$t("notiReplyPerson_notiReplyPerson.xlsx").toString());
                MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
            }).catch((err) => {
                ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
            }).finally(() => {
                LoadingUtil.close();
            });
    }
    //處理後端回傳的下載內容
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
        } catch (ex) {
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

}