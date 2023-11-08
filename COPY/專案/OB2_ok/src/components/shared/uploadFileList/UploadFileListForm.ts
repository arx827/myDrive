import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import SingleFileUploadForm from "@/components/shared/uploadFileList/SingleFileUploadForm.vue"
import { AttachedFileDto, OutputErrorCodeDto } from "@fubonlife/obd-api-axios-sdk";
import { FblPDataGridHolder, FblColumnType, FblActionEvent } from "../data-grid/models";
import { FileGrid } from "./model";
import LoadingUtil from "@/assets/config/LoadingUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import ValidationUtil from "@/assets/config/ValidationUtil";

@Component({
    components: { SingleFileUploadForm, FblDataGrid }
})
export default class UploadFileListForm extends Vue {
    @Prop()
    public fileListProp;

    @Watch("fileListProp")
    onInitDataChanged(): void {
        this.reload();
    }

    //上傳單一附件表單是否顯示
    formVisible: boolean = false;
    // 檔案清單顯示設定
    singleFile: FileGrid = null;
    fileList: FileGrid[] = [];

    isEdit: boolean = false
    editFileId: string = "";

    grid: FblPDataGridHolder<FileGrid> = {
        rowKey: "fileId",
        data: [],
        columns: [
            {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t('global_edit').toString(), //編輯
                        edit: true
                    },
                    {
                        name: "delete",
                        title: this.$t('global_delete').toString(), //刪除
                        delete: true
                    }

                ],
                width: 100
            },
            {
                type: FblColumnType.PLAIN,
                property: "fileName",
                title: this.$t('uploadFileForm_fileName').toString(), //檔案名稱
            },
            {
                type: FblColumnType.PLAIN,
                property: "fileRemark",
                title: this.$t('uploadFileForm_fileRemark').toString(), //附件備註
            }
        ]
    };

    //建立表單
    created(){
        this.fileList = this.$props.fileListProp; 
        this.grid.data = this.fileList;
    }

    //重整表單
    reload(){
        this.formVisible = false;
        this.grid.data = [];
    }

    //上傳附件表單開啟
    showFileAdd(){
        this.singleFile ={
            fileId: "",
            fileName: "",
            fileRemark: "",
            uploadData: null,
        }
        this.formVisible = true;
        this.isEdit = false;
        this.editFileId = "";
    }

    //刪除/編輯
    onTableActionClick(e:FblActionEvent<FileGrid>){
        switch (e.action.name) {
            case "delete":
                this.fileDelete(e.row.data);
                break;
            case "edit":
                this.fileEdit(e.row.data);
                break;
        }
    }

    // 刪除附件
    fileDelete(singleFile:FileGrid){
        this.$emit("deleteSingleFile", singleFile);
    }

    //附件刪除成功 更新前端檔案清單
    afterSingleDelete(output:OutputErrorCodeDto, singleFile: FileGrid){
        if(output.success){
            LoadingUtil.show();
            let tempList: FileGrid[] = [];
            this.grid.data.forEach((file) => {
                if (file.fileId != singleFile.fileId) {
                    tempList.push(file);
                }
            })
            this.grid.data = tempList;
            LoadingUtil.close();
        }else{
            ErrorModalUtil.modalError(this.$t(output.apiErrorCode).toString());
        }
    }

    // 編輯附件
    fileEdit(data:FileGrid){
        this.singleFile = JSON.parse(JSON.stringify(data));
        this.formVisible = true;
        this.isEdit = true;
        this.editFileId = data.fileId;
    }

    ///附件單一上傳表單送出
    singleFileSubmit(){
        (this.$refs.singleFileUploadForm as any).handleUpload();
    }

    //附件單一上傳表單關閉
    singleFileCancel(){
        this.formVisible = false;
    }

    //選取後上傳前的檢核
    beforeSingleUpload(file){
        let fileTypeCheckResult = ValidationUtil.fileTypeValidate(file);
        //判斷檔案類型
        if (!fileTypeCheckResult) {
            // 檔案格式僅可上傳WORD、EXCEL、PDF、TIF、TXT、MSG、JPG
            (this.$refs.singleFileUploadForm as any).beforeUploadValidateFail(this.$t('infReplyForm_fileTypeError').toString());
            return false;
        }
        
        //判斷檔案是否為空
        if(file.size == 0){
            (this.$refs.singleFileUploadForm as any).beforeUploadValidateFail(this.$t('global_fileSize0').toString());
            return false;
        }

        //檔名長度檢核
        if(file.name.length > 150){
            (this.$refs.singleFileUploadForm as any).beforeUploadValidateFail(this.$t('uploadFileForm_fileNameSizeOver').toString()); //檔名過長
            return false;
        }
        (this.$refs.singleFileUploadForm as any).beforeUploadValidateSuccess(file);
        return false;
    }

    //上傳檔案至後端檢核
    handleSingleUpload(singleFile:FileGrid, isChangeFile:Boolean) {
        if(this.isEdit){
            this.$emit("editSingleFile", singleFile, this.editFileId, isChangeFile);
        }else{
            this.$emit("addSingleFile", singleFile);
        } 
    }

    //附件新增/修改 後端檢核成功，更新前端檔案清單內容
    afterSingleUpload(output: OutputErrorCodeDto, singleFile: FileGrid){
        if(output.success){
            LoadingUtil.show();
            this.formVisible = false;
            let tempList : FileGrid[] = [];
            let updated = false;
            this.grid.data.forEach(fileInTable => {
                if (fileInTable.fileId != singleFile.fileId) {
                    //非本次更新的資料列，不做變更
                    tempList.push(fileInTable);
                }else{
                    //本次更新的資料列，取代成新資料
                    updated = true;
                    singleFile.fileId = output.returnMessage;
                    tempList.push(singleFile);
                }
            });
            if(!updated){
                //先前未更新到資料，代表是新增，而非修改，因此另外更新
                singleFile.fileId = output.returnMessage;
                tempList.push(singleFile);
            }
            this.grid.data =[];
            this.grid.data = tempList;
            LoadingUtil.close();
        }else{
            ErrorModalUtil.modalError(this.$t(output.apiErrorCode).toString());
        }
    }

    //取得檔案名稱清單
    getFileNameList(){
        let fileIdList = [];
        this.grid.data.forEach((file)=>{
            fileIdList.push(file.fileId)
        })
        return fileIdList;
    }

    //取得檔案清單
    getFileList(){
        let fileList: AttachedFileDto[] = [];
        this.grid.data.forEach((file)=>{
            fileList.push({
                fileId: file.fileId,
                remark: file.fileRemark
            })
        })
        return fileList;
    }
}