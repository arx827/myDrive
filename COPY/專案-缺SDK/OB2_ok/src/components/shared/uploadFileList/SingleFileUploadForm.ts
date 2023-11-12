import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { FeildValidation, FileGrid, SingleFileUploadValidate } from "./model";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

@Component({
    components: { FblDataGrid }
})
export default class SingleFileUploadForm extends Vue {
    //檔案內容
    @Prop()
    fileProp: FileGrid;

    singleFile: FileGrid = {
        fileId: "",
        fileName: "",
        fileRemark: "",
        uploadData: null,
    };

    //是否有重新上傳檔案
    isChangeFile: Boolean = false;

    fileList = []; 

    //欄位驗證提示工具
    singleFileUploadValidateForm : SingleFileUploadValidate = {
        fileName: { hover: "", feedback: false, state: "", msg: "" },
        remark: { hover: "", feedback: false, state: "", msg: "" },
    }

    
    // 欄位驗證方式
    singleFileUploadRules: { [key: string]: ValidationRule[] } = {
        remark: [{ validator: this.validateRemark, trigger: "blur" }],
    };

    @Watch("fileProp")
    onInitDataChanged(): void {
        this.reload();
    }

    /**
     * 頁面開啟
     * @returns 
     */
    created(){
        this.reload();
    }

    /**
     * 頁面重整
     * @returns 
     */
    reload(){
        this.singleFile = this.$props.fileProp;
        this.isChangeFile = false;
        this.resetUploadForm();
    }
    
    //重設表單內容
    resetUploadForm(){
        this.fileList = [];
        this.singleFile.uploadData = this.fileList;
        this.feildValidate(this.singleFileUploadValidateForm.fileName, false, "success", "", "");
        this.feildValidate(this.singleFileUploadValidateForm.remark, false, "success", "", "");
    }

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //關閉表單
    uploadFormClose(){
        this.resetUploadForm();
        this.$emit("uploadFormClose");
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
        this.singleFile.uploadData = file;
        if(ValidationUtil.isEmpty(this.singleFile.fileId)){
            this.singleFile.fileId = file.name + file.type + new Date().getTime();
        }
        this.singleFile.fileName = file.name;
        this.isChangeFile = true;
        return false;
    }

    //上傳檔案至後端檢核
    handleUpload() {
        if(this.validateSubmit()){
            this.$emit("handleUpload",this.singleFile, this.isChangeFile);
        }
    }
    
    //送出前檢核
    validateSubmit(){
        let validate = true;
        this.feildValidate(this.singleFileUploadValidateForm.fileName, false, "success", "", "");
        this.feildValidate(this.singleFileUploadValidateForm.remark, false, "success", "", "");
        if(ValidationUtil.isEmpty(this.singleFile.fileName)){
            validate = false;
            ErrorModalUtil.modalError(this.$t('uploadFileForm_selectFileError').toString()); //請先選擇檔案
        }
        if(ValidationUtil.isEmpty(this.singleFile.fileRemark)){
            validate = false;
            this.feildValidate(this.singleFileUploadValidateForm.remark, true, "error", "hover", this.$t('uploadFileForm_fileRemarkRequire').toString()); //附件備註 必填
        }else{
            if(this.singleFile.fileRemark.length >50){
                validate = false;
                this.feildValidate(this.singleFileUploadValidateForm.remark, true, "error", "hover", this.$t('uploadFileForm_fileRemark_over').toString()); //附件備註 不可輸入超過50字
            }
        }
        return validate;
    }

    //備註驗證
    validateRemark(rule, value, callback) {
        if(ValidationUtil.isEmpty(this.singleFile.fileRemark)){
            this.feildValidate(this.singleFileUploadValidateForm.remark, true, "error", "hover", this.$t('uploadFileForm_fileRemarkRequire').toString()); //附件備註 必填
            callback(() => { });
        }else{
            if(this.singleFile.fileRemark.length >50){
                this.feildValidate(this.singleFileUploadValidateForm.remark, true, "error", "hover", this.$t('uploadFileForm_fileRemark_over').toString()); //附件備註 不可輸入超過50字
                callback(() => { });
            }
        }
        callback();
    }
}