import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import {
    FblColumnType,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { resultMessage } from "./model";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { UploadProgressGrid } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
@Component({
    components: { FblDataGrid }
})
export default class ShiftWorkUploadForm extends Vue {
    @Prop()
    public isSingleUpload;
    @Prop()
    public allowMonth;
    @Prop()
    public secondText;
    // @Prop()
    // public thirdText;

    validationResult: boolean = false;
    //匯入資料是否有誤
    hasError = false;
    //匯入是否成功
    importSuccessed = false;
    //檔案清單
    fileList = [];
    //匯入檢核訊息
    errorMessage = null;
    errorMessageList: resultMessage[] = [];
    //匯入檔案內容
    uploadData = null;
    //上傳歷程內容
    uploadProgressList = []

    //filter初始設定
    uploadProgressFilter: FblFilters = {
        filters: []
    };

    /**
    * 重新載入頁面
    * @returns 
    */
    async reload() {
        LoadingUtil.show();
        try {
            const rangeEnd = moment().endOf('months');
            const rangeStart = moment().startOf('months');
            const start = FiltersUtil.setFilterParam("uploadDate", FblOperator.GEQ, MomentUtil.format(new Date(rangeStart.toISOString()), "YYYY-MM-DD"));
            const end = FiltersUtil.setFilterParam("uploadDate", FblOperator.LEQ, MomentUtil.format(new Date(rangeEnd.toISOString()), "YYYY-MM-DD"));
            let classType;
            if (!this.isSingleUpload) {
                classType = FiltersUtil.setFilterParam("type", FblOperator.EQ, "S");
            } else {
                //若為單筆匯入其歷程搜尋class為O
                classType = FiltersUtil.setFilterParam("type", FblOperator.EQ, "O");
            }
            this.uploadProgressFilter = FiltersUtil.setFilters(start, end, classType);
            // 整理為 Filters
            const filterUploadProgress: string = JSON.stringify(this.uploadProgressFilter);
            //搜尋本月上傳歷程
            const resp = await this.$uploadProgressApi.findAllUploadProgressUsingGET(filterUploadProgress);
            // let respUsers=await this.$userApi.getUserListInSchedulePageUsingGET();

            let tempararyList = [];
            resp.data.forEach(eachLog => {

                tempararyList.push({
                    uploadDate: MomentUtil.transformRoc(eachLog.uploadDate),
                    uploadName: eachLog.uploadName,
                    uploadResult: eachLog.uploadResult,
                    rowCount: eachLog.rowCount,
                    checkResult: eachLog.checkResult
                });
            })

            this.gridLog.data = tempararyList;
            //大於三筆資料才需右側滾輪
            if (resp.data.length > 3) {
                this.gridLog.scroll = { y: 100 };
            } else {
                this.gridLog.scroll = {};
            }
            
        } catch (err) {
            console.log(err);  //歷程載入失敗
        } finally {
            LoadingUtil.close();
        }
    }

    //建立表單
    created(): void {
        this.reload();
    }

    //因為不接受一次上傳多個檔案，所以每次上傳要移除舊檔
    handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }

    //上傳時檢查格式與檔案大小
    beforeUpload(file) {
        this.fileList = [];
        const isExcel = file.type.includes("sheet");
        //判斷檔案類型
        if (!isExcel) {
            MessageUtil.messageInfo(this.$t('global_formatFailure').toString()); //格式錯誤
            return false;
        }
        //判斷檔案大小
        const isLT5MB = parseInt(file.size) / 1024 / 1024 < 5;
        if (!isLT5MB) {
            MessageUtil.messageInfo(this.$t('eventS_fileSizeLimitExceeded').toString()); //超過檔案大小限制
            return false;
        }
        this.fileList = [...this.fileList, file];
        this.uploadData = file;
        return false;
    }

    //上傳檔案至後端檢核
    async handleUpload() {
        this.errorMessageList = [];
        this.errorMessage = null;
        this.importSuccessed = false;
        this.hasError = false;
        this.grid.data = null;
        this.validationResult = false;
        LoadingUtil.show();
        if (this.isSingleUpload) {
            //如果為單筆匯入的話
            await this.$userShiftWorkApi.excelImportSingleUsingPOST(this.uploadData)
                .then((res => {
                    if (res.data.length != 1 || res.data[0].title != "檢核成功") {
                        this.hasError = true;
                        this.importSuccessed = false;
                        let count = 0;
                        res.data.forEach(eachMessage => {
                            count++;
                            this.errorMessageList.push({
                                index: count,
                                title: eachMessage.title,
                                context: eachMessage.message,
                            });
                        })
                        this.grid.data = this.errorMessageList;
                        //大於三筆資料才需右側滾輪
                        if (this.grid.data.length > 3) {
                            this.grid.scroll = { y: 100 };
                        } else {
                            this.grid.scroll = {};
                        }
                        LoadingUtil.close();
                        this.$t("global_edit").toString()
                        ErrorModalUtil.modalError(this.$t('global_importFailure').toString()); //匯入失敗
                    } else {
                        if (res.data[0].title == "檢核成功") {
                            this.importSuccessed = true;
                            this.errorMessage = res.data[0].message;
                            MessageUtil.messageSuccess(this.$t('global_importSuccess').toString()); //匯入成功
                        }
                    }
                }))
                .catch((err) => {
                    ErrorModalUtil.modalError(this.$t('global_importFailure').toString()); //匯入失敗
                })
                .finally(() => {
                    this.validationResult = true;
                    LoadingUtil.close();
                    this.reload();
                });
        } else {//如果為多筆匯入的話
            await this.$userShiftWorkApi.excelImportUsingPOST1(this.uploadData)
                .then((res => {
                    if (res.data.length != 1 || res.data[0].title != "檢核成功") {
                        this.hasError = true;
                        this.importSuccessed = false;
                        let count = 0;
                        res.data.forEach(eachMessage => {
                            count++;
                            this.errorMessageList.push({
                                index: count,
                                title: eachMessage.title,
                                context: eachMessage.message,
                            });
                        })
                        this.grid.data = this.errorMessageList;
                        //大於三筆資料才需右側滾輪
                        if (this.grid.data.length > 3) {
                            this.grid.scroll = { y: 100 };
                        } else {
                            this.grid.scroll = {};
                        }
                        LoadingUtil.close();
                        ErrorModalUtil.modalError(this.$t('global_importFailure').toString()); //匯入失敗
                    } else {
                        if (res.data[0].title == "檢核成功") {
                            this.importSuccessed = true;
                            this.errorMessage = res.data[0].message;
                            MessageUtil.messageSuccess(this.$t('global_importSuccess').toString()); //匯入成功
                        } else if (res.data[0].title == "匯入筆數") {
                            this.hasError = true;
                            this.importSuccessed = false;
                            let count = 0;
                            res.data.forEach(eachMessage => {
                                count++;
                                this.errorMessageList.push({
                                    index: count,
                                    title: eachMessage.title,
                                    context: eachMessage.message,
                                });
                            })
                            this.grid.data = this.errorMessageList;
                            this.grid.scroll = {};
                            LoadingUtil.close();
                            ErrorModalUtil.modalError(this.$t('global_importFailure').toString()); //匯入失敗
                        }
                    }
                }))
                .catch((err) => {
                    ErrorModalUtil.modalError(this.$t('global_importFailure').toString()); //匯入失敗
                })
                .finally(() => {
                    this.validationResult = true;
                    LoadingUtil.close();
                    this.reload();
                });
        }


    }

    //關閉整批上傳畫面時清除資料
    onFormUploadClose() {
        this.fileList = [];
        this.hasError = false;
        this.uploadData = this.fileList;
        this.errorMessage = "";
        this.grid.data = null;
        this.validationResult = false;
        if (this.importSuccessed) {
            this.$emit("reloadData");
        }
    }

    uploadFormClose() {

        this.$emit("uploadFormClose");
    }

    //檢核結果資料
    grid: FblPDataGridHolder<resultMessage> = {
        rowKey: "index",
        data: [],
        scroll: {},
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "index",
                title: this.$t('eventS_serialNumber').toString(), //序號
                width: 50,
            },
            {
                type: FblColumnType.PLAIN,
                property: "title",
                title: this.$t('eventS_checkItem').toString(), //檢核項目
                width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "context",
                title: this.$t('eventS_checkMessage').toString(), //檢核訊息
            },
        ],
    };

    //上傳歷程資料
    gridLog: FblPDataGridHolder<UploadProgressGrid> = {
        rowKey: "uploadDate",
        data: [],
        scroll: {},
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "uploadDate",
                title: this.$t('global_uploadTime').toString(), //上傳時間
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "uploadName",
                title: this.$t('global_uploadStaff').toString(), //上傳人員
                width: 150,
            },
            {
                type: FblColumnType.PLAIN,
                property: "uploadResult",
                title: this.$t('global_uploadResult').toString(), //上傳結果
            },
            {
                type: FblColumnType.PLAIN,
                property: "checkResult",
                title: "檢核" + this.$t('global_result').toString(), //上傳結果
            },

            {
                type: FblColumnType.PLAIN,
                property: "rowCount",
                title: this.$t('global_uploadEventS_rowCount').toString(), //上傳筆數
            },
        ],
    };
}