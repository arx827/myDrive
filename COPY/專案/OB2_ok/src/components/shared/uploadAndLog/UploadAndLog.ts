import MessageUtil from "@/assets/config/MessageUtil";
import {
    FblColumnType,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { Vue, Component } from "vue-property-decorator";
import { resultMessage } from "./model";
import { UploadProgressGrid } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";

@Component({
    components: { FblDataGrid }
})
export default class UploadAndLog extends Vue {
    //是否顯示驗證結果區塊
    validationResult: boolean = false;
    //匯入資料檢核是否有誤
    checkHasError = false;
    //檔案清單
    fileList = []; 
    //匯入檢核訊息
    SuccessedResultMessage = null;
    errorMessageList : resultMessage[] = [];
    //匯入檔案內容
    uploadData = null;
    //上傳歷程內容
    uploadProgressList = []
    //表單文字內容
    describeList = [];

    //重設表單內容
    resetUploadForm(){
        this.fileList = [];
        this.checkHasError= false;
        this.uploadData = this.fileList;
        this.SuccessedResultMessage = "";
        this.grid.data = null;
        this.validationResult = false;
    }

    //關閉表單
    uploadFormClose(){
        this.resetUploadForm();
        this.$emit("uploadFormClose");
    }

    //設定初始值
    settingInitValue(data, describeList){
        this.fileList = [];
        this.reloadLogProgress(data);
        this.describeList = describeList;
    }

    //重新渲染上傳歷程的表格資料
    reloadLogProgress(data){
        this.gridLog.data = data;
        //大於三筆資料才需右側滾輪
        if(data.length >3){
            this.gridLog.scroll = { y:100 };
        }else{
            this.gridLog.scroll = { };
        }
    }

    //因為不接受一次上傳多個檔案，所以每次上傳要移除舊檔
    handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }

    //上傳前端檢核 檢查格式與檔案大小
    beforeUpload(file) {
        this.$emit("beforeUpload", file);
        return false;
    }

    //上傳前端檢核--失敗
    beforeUploadValidateFail(message){
        this.fileList = [];
        ErrorModalUtil.modalError(message);
        return false;
    }

    //上傳前端檢核-成功
    beforeUploadValidateSuccess(file){
        this.fileList = [];
        this.fileList = [...this.fileList, file];
        this.uploadData = file;
        return false;
    }

    //上傳檔案至後端檢核
    handleUpload() {
        this.errorMessageList = [];
        this.SuccessedResultMessage = null;
        this.checkHasError= false;
        this.grid.data = null;
        this.validationResult = false;
        this.$emit("handleUpload",this.uploadData);
    }

    //上傳結果顯示
    handleUploadResult(errorMessageList, checkHasError, SuccessedResultMessage){
        this.$emit("reloadLogProgress");
        this.grid.data = errorMessageList;
        //大於三筆資料才需右側滾輪
        if(this.grid.data.length >3){
            this.grid.scroll = { y:100 };
        }else{
            this.grid.scroll = { };
        }
        this.checkHasError = checkHasError;
        if(!this.checkHasError){
            this.SuccessedResultMessage = SuccessedResultMessage
        }
        this.validationResult = true;
    }

    //檢核結果資料
    grid: FblPDataGridHolder<resultMessage> = {
        rowKey: "index",
        data: [],
        scroll: { },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "index",
                title: this.$t('eventS_serialNumber').toString(), //序號
                width: 50,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "title",
                title: this.$t('eventS_checkItem').toString(), //檢核項目
                width: 100,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "context",
                title: this.$t('eventS_checkMessage').toString(), //檢核訊息
                align: "left"
            },
        ],
    };

    //上傳歷程資料
    gridLog: FblPDataGridHolder<UploadProgressGrid> = {
        rowKey: "uploadDate",
        data: [],
        scroll: { },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "uploadDate",
                title: this.$t('global_uploadTime').toString(), //上傳時間
                width: 200,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "uploadName",
                title: this.$t('global_uploadBy').toString(), //上傳者
                width: 200,
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "checkResult",
                title: this.$t('global_checkResult').toString(), //檢核結果
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "uploadResult",
                title: this.$t('global_uploadResult').toString(), //上傳結果
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "rowCount",
                title: this.$t('global_importedCount').toString(), //匯入筆數
                align: "center"
            },
        ],
    };
}