import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FblColumnType } from '@/components/shared/data-grid/models';
import { LoginModule } from "@/plugins/store/LoginModule";
import { Option, OutputErrorCodeDto, ResponseEntity, UploadFileAddDto, UploadFileCaseDto, UploadFileDto, UploadFileInsertDto, CasePolicyLogDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import axios, { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { FileGrid } from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";

@Component({
    components: { FblDataGrid }
})
export default class FileUploadEditForm extends Vue {

    @Prop()
    editData!: UploadFileDto;

    @Prop()
    packNo: string;

    @Prop()
    uploadFileData: UploadFileDto[];

    casePolicyLogListCaseNos: string[] = [];

    // 此名單下的案件歷程資訊
    casePolicyLogList: Array<CasePolicyLogDto> = [];

    // 文件說明 是否必填
    isFileStatementCodeRequired: boolean = true;

    // 其他說明 是否必填
    isOtherStatementRequired: boolean = false;

    // 上傳按鍵wording變換
    isUploading: boolean = false;

    // 上傳檔案儲存變數
    uploadingFile: FileGrid = null;

    // 新增/編輯上傳檔案表單
    form: UploadFileInsertDto = {
        packNo: "",
        uploadFileCaseDtos: [],
        uploadSource: "",
        fileTypeId: "",
        fileStatementCode: "",
        remark: "",
        fileIds: [],
        fileNames: []
    };

    // 保單號碼 核選框
    isCaseNoChecked = {};

    // 文件說明 列舉值
    fileTypeStatementOptionsMap: Map<string, Option[]> = new Map();

    // 【文件類別】下拉選項
    fileTypeOptions: Option[] = [];

    // 【文件說明】下拉選項
    fileStatementOptions: Option[] = [];

    // 選擇上傳檔案名稱
    selectedFileName: string = "";

    // 保單號碼 核選框 table
    public gridCaseNoData = {
        rowKey: 'rowKey',
        data: [],
        // pagination: false,
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                property: 'caseNo',
                template: 'caseNoTemp',
                width: 10,
                align: 'right',
            },
            {
                type: FblColumnType.PLAIN,
                property: 'casePolicy',
                title: this.$t('fileUpload_policyNo').toString(), // 保單號碼
                width: 30,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'taskName',
                title: this.$t('fileUpload_taskName').toString(), // 電訪項目
                width: 30,
            },
        ],
    };

    // 檔案列表 table
    public gridFileData = {
        rowKey: 'rowkey',
        data: [],
        // pagination: false,
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                property: 'handleTemp',
                template: 'handleTemp',
                width: 10,
            },
            {
                type: FblColumnType.PLAIN,
                property: 'fileName',
                title: this.$t('fileUpload_fileName').toString(), // 檔案名稱
                width: 50,
                formatter: (data: FileGrid) => {
                    if (data) {
                        return [data.fileName, data.fileExtension].join(".")
                    }
                }
            },
        ],
    };

    /**
     * 上傳前端檢核 檢查格式與檔案大小
     * @param file 
     * @returns 
     */
    beforeUpload(file: File) {
        let fileTypeCheckResult = ValidationUtil.fileTypeValidate(file);

        //判斷檔案類型
        if (!fileTypeCheckResult) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                // 錯誤
                title: this.$t('global_error').toString(),
                // 檔案格式僅可上傳WORD、EXCEL、PDF、TIF、TXT、MSG、JPG
                content: this.$t('infReplyForm_fileTypeError').toString(),
            });
            return false;
        }
        // let fileFormat = /(.+.pdf)|(.+.tif)|(.+.tiff)|(.+.XLSX)|(.+.XLS)|(.+.doc)|(.+.docx)|(.+.MSG)|(.+.TXT)|(.+.jpg)|(.+.jpeg)|(.+.jpe)|(.+.jfif)/i;
        // if (!file.name.match(fileFormat)) {
        //     Modal.error({
        //         okText: this.$t('global_ok').toString(),
        //         cancelText: this.$t('global_cancel').toString(),
        //         title: "錯誤",
        //         content: "「上傳檔案」格式錯誤",
        //     });
        //     return false;
        // }

        if (file.size >= 15_759_375) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('fileUpload_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToobig').toString(), // 「上傳檔案」檔案大於15Mb
            });
            return false;
        }

        if (file.size <= 0) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('fileUpload_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToosmall').toString(), // 「上傳檔案」檔案大小為0,不可上傳！
            });
            return false;
        }

        // const duplicatedFileCheck = this.gridFileData.data.filter(d => file.name.includes(d.fileName));
        // if (duplicatedFileCheck && duplicatedFileCheck.length > 0) {
        //     Modal.error({
        //         okText: this.$t('global_ok').toString(),
        //         cancelText: this.$t('global_cancel').toString(),
        //         title: "錯誤",
        //         content: "「檔案名稱」重複",
        //     });
        //     return false;
        // }

        this.uploadingFile = file;
        this.selectedFileName = file.name;
        return false;
    }

    /**
     * 上傳檔案
     */
    handleUpload() {
        this.isUploading = true;
        console.log("上傳檔案"); // 上傳檔案
        if (!ValidationUtil.isEmpty(this.uploadingFile)) {
            LoadingUtil.show();

            let formData = new FormData();
            formData.append('fileRemark', this.form.remark);
            formData.append('file', this.uploadingFile);

            axios({
                method: 'post',
                url: `${process.env.VUE_APP_API_BASE_URL}/api/fileUpload/uploadFile`,
                data: formData,
                timeout: 3*60*1000,
            })
            .then((resp: AxiosResponse<OutputErrorCodeDto>) => {
                if (resp.data.success) {
                    // const fileNames = this.selectedFileName.split(".");
                    const [ext, ...fileNames] = this.selectedFileName.split('.').reverse();
                    this.gridFileData.data.push({
                        rowkey: this.gridFileData.data.length + 1,
                        fileId: resp.data.returnMessage,
                        fileName: fileNames ? fileNames.reverse().join(".") : ext,
                        fileExtension: fileNames ? ext : "",
                        remark: this.form.remark
                    });
                    console.log("上傳成功", resp.data); // 上傳成功
                } else {
                    ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
                }
            }).catch((err) => {
                console.error(err);
                ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
            }).finally(() => {
                this.isUploading = false;
                this.uploadingFile = null;
                this.selectedFileName = "";
                LoadingUtil.close();
            });
        }
    }

    /**
     * caseNo checkbox資料列表變化
     */
    handlePolicyNoChange({ caseNo }) {
        this.isCaseNoChecked[caseNo] = !this.isCaseNoChecked[caseNo];
    }

    /**
     * 【文件類別】連動【文件說明】選項
     * @param value 
     */
    handleFileStatementCodeChange(value: string) {
        if (!ValidationUtil.isEmpty(value)) {
            this.form.fileStatementCode = "";
            this.fileStatementOptions = this.fileTypeStatementOptionsMap.get(value);
            this.isFileStatementCodeRequired = value.toUpperCase() != 'OTHER_FILE';
            this.isOtherStatementRequired = value.toUpperCase() == "OTHER_FILE";
        }
    }

    /**
     * 檢查 其他說明 是否必填
     * @param value 
     */
    checkOtherStatementRequired(value: string) {
        if (!ValidationUtil.isEmpty(value)) {
            this.isOtherStatementRequired = value.toUpperCase() == 'OTHER';
        }
    }

    /**
     * 刪除檔案
     * @param data 
     */
    handleRemove(data: FileGrid) {
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('fileUpload_confirm').toString(), // 確認
            content: this.$t('fileUpload_deleteConfirm').toString(), // 確認刪除?
            onOk: () => {
                console.log("刪除檔案：", data); // 刪除檔案：
                LoadingUtil.show();
                this.$fileUploadApi.deleteFileUsingPOST(data.fileId).then((resp: AxiosResponse<OutputErrorCodeDto>) => {
                    if (resp.data.success) {
                        console.log("檔案刪除成功", resp.data); // 檔案刪除成功
                        this.gridFileData.data = this.gridFileData.data.filter(d => d.fileId != data.fileId);
                    } else {
                        console.log("檔案刪除失敗", resp.data); // 檔案刪除失敗
                    }
                }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
            }
        });
    }

    /**
     * 下載檔案
     * @param data 
     */
    handleDownload(data: FileGrid) {
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
     * @returns 
     */
    handleSubmit() {
        const caseNoList = [];
        Object.entries(this.isCaseNoChecked).map(([caseNo, isChecked]) => {
            isChecked && caseNoList.push(caseNo);
        })
        let errorMessages: string[] = []
        if (ValidationUtil.isEmpty(caseNoList)) {
            errorMessages.push(["「", this.$t('fileUpload_policyNo').toString(), "」"].join("")); // 「保單號碼」
            // Modal.error({
            //     okText: this.$t('global_ok').toString(),
            //     cancelText: this.$t('global_cancel').toString(),
            //     title: "錯誤",
            //     content: "保單號碼至少勾選一張",
            // });
            // return;
        } else {
            Object.assign(this.form, { caseNo: caseNoList });
        }

        if (ValidationUtil.isEmpty(this.form.fileTypeId)) {
            errorMessages.push(["「", this.$t('fileUpload_fileTypeName').toString(), "」"].join("")); // 「文件類別」
            // Modal.error({
            //     okText: this.$t('global_ok').toString(),
            //     cancelText: this.$t('global_cancel').toString(),
            //     title: "錯誤",
            //     content: "請選擇「文件類別」",
            // });
            // return;
        }
        if (this.isFileStatementCodeRequired && ValidationUtil.isEmpty(this.form.fileStatementCode)) {
            errorMessages.push(["「", this.$t('fileUpload_fileStatementName').toString(), "」"].join("")); // 「文件說明」
        }
        if (ValidationUtil.isEmpty(this.gridFileData.data)) {
            errorMessages.push(["「", this.$t('fileUpload_uploadFile').toString(), "」"].join("")); // 「上傳檔案」
            // Modal.error({
            //     okText: this.$t('global_ok').toString(),
            //     cancelText: this.$t('global_cancel').toString(),
            //     title: "錯誤",
            //     content: "請選擇「上傳檔案」",
            // });
            // return;
        }
        if (this.isOtherStatementRequired && ValidationUtil.isEmpty(this.form.remark)) {
            errorMessages.push(["「", this.$t('fileUpload_remark').toString(), "」"].join("")); // 「其他說明」
            // Modal.error({
            //     okText: this.$t('global_ok').toString(),
            //     cancelText: this.$t('global_cancel').toString(),
            //     title: "錯誤",
            //     content: "請填寫「其他說明」",
            // });
            // return;
        }
        if (errorMessages.length > 0) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('fileUpload_error').toString(), // 錯誤
                content: this.$t('fileUpload_pleaseInput').toString() + errorMessages.join("、"), // 請輸入：
            });
            return;
        }
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('fileUpload_confirm').toString(), // 確認
            content: this.$t('fileUpload_saveConfirm').toString(), // 確認儲存?
            onOk: () => {
                console.log('儲存 formData: ', this.form);
                this.form.packNo = this.packNo;
                this.form.uploadFileCaseDtos = [];
                (this.gridCaseNoData.data as UploadFileCaseDto[]).forEach(u => {
                    if (this.isCaseNoChecked[u.caseNo]) {
                        this.form.uploadFileCaseDtos.push(u);
                    }
                });
                // 此名單下的案件歷程資訊
                this.form.casePolicyLogInfoList = this.casePolicyLogList;

                this.form.fileIds = [];
                this.form.fileNames = [];
                (this.gridFileData.data as FileGrid[]).forEach(d => {
                    this.form.fileIds.push(d.fileId);
                    this.form.fileNames.push(d.fileName);
                });
                LoadingUtil.show();
                if (this.editData) {
                    this.$fileUploadApi.updateUploadFileUsingPOST(this.editData.uploadId, {
                        packNo: this.form.packNo,
                        // uploadSource: this.form.uploadSource,
                        fileTypeId: this.form.fileTypeId,
                        fileStatementCode: this.form.fileStatementCode,
                        remark: this.form.remark,
                    })
                        .then(() => {
                            LoadingUtil.close();
                            Modal.info({
                                okText: this.$t('global_ok').toString(),
                                title: this.$t('fileUpload_modify').toString(), // 修改
                                content: this.$t('fileUpload_modifySuccess').toString(), // 修改成功
                                onOk: () => {
                                    this.$emit("fileUploadSaved");
                                }
                            });
                        })
                        .catch(e => {
                            console.error(e);
                            LoadingUtil.close();
                            ErrorModalUtil.modalError(this.$t("fileUploadEditForm_modifiedFail").toString()); // 修改失敗
                        });
                } else {
                    // let existFileCheck = true;
                    // for (let fileName of this.form.fileNames) {
                    //     for (let uploadedFile of this.uploadFileData) {
                    //         if (uploadedFile.fileName == fileName && this.form.uploadFileCaseDtos.map(c => c.caseNo).includes(uploadedFile.caseNo)) {
                    //             Modal.error({
                    //                 okText: this.$t('global_ok').toString(),
                    //                 cancelText: this.$t('global_cancel').toString(),
                    //                 title: "錯誤",
                    //                 content: "案件編號：" + uploadedFile.caseNo + "下已有「" + fileName + "」檔案，請重新選擇檔案！",
                    //             });
                    //             LoadingUtil.close();
                    //             existFileCheck = false;
                    //         }
                    //     }
                    // }
                    // if (existFileCheck) {
                    this.$fileUploadApi.addUploadFileUsingPOST(this.form)
                        .then(() => {
                            LoadingUtil.close();
                            Modal.info({
                                okText: this.$t('global_ok').toString(),
                                title: this.$t('fileUpload_save').toString(), // 儲存
                                content: this.$t('fileUpload_saveSuccess').toString(), // 儲存成功
                                onOk: () => {
                                    this.$emit("fileUploadSaved");
                                }
                            });
                        })
                        .catch(e => {
                            console.error(e);
                            LoadingUtil.close();
                            ErrorModalUtil.modalError(this.$t("global_save_failed").toString()); // 儲存失敗
                        });
                    // }
                }

            }
        });
    }

    /**
     * 新增時有上傳檔但直接離開，則把未儲存的檔案刪除
     */
    handleLeave() {
        if (!this.editData && this.gridFileData.data.length > 0) {
            this.gridFileData.data.forEach(async data => {
                await this.$fileUploadApi.deleteFileUsingPOST(data.fileId).then((resp: AxiosResponse<OutputErrorCodeDto>) => {
                    if (resp.data.success) {
                        console.log("檔案刪除成功", data);
                    } else {
                        console.log("檔案刪除失敗", data);
                    }
                }).catch(e => console.error(e));
            });
        }
    }

    /**
     * 頁面啟動第一動
     */
    created() {
        this.casePolicyLogListCaseNos = PackMatchModule.pickupResult.casePolicyLogList.map(log => log.caseNo);
        LoadingUtil.show();
        this.$fileUploadApi.initFileEditFormUsingGET(this.packNo)
            .then((resp: AxiosResponse<UploadFileAddDto>) => {
                this.fileTypeOptions = resp.data.fileTypeOptions;
                this.fileTypeStatementOptionsMap = new Map(Object.entries(resp.data.fileTypeStatementOptionsMap));
                this.gridCaseNoData.data = resp.data.uploadFileCaseDtos

                let rowKey = 0;
                let isCaseNoCheckedTemp = {};
                this.gridCaseNoData.data.forEach(u => {
                    u["rowKey"] = rowKey++;
                    isCaseNoCheckedTemp[u.caseNo] = false;
                });
                this.isCaseNoChecked = Object.assign(isCaseNoCheckedTemp);

                if (this.editData) {
                    console.log('修改:', this.editData);
                    Object.assign(this.form, {
                        packNo: this.editData.packNo,
                        fileTypeId: this.editData.fileTypeId,
                        fileStatementCode: this.editData.fileStatementCode,
                        remark: this.editData.remark
                    });
                    this.fileStatementOptions = this.fileTypeStatementOptionsMap.get(this.form.fileTypeId);
                    this.isFileStatementCodeRequired = this.form.fileTypeId.toUpperCase() != 'OTHER_FILE';
                    this.isOtherStatementRequired = (this.form.fileTypeId && this.form.fileTypeId.toUpperCase() == 'OTHER_FILE') ||
                        (this.form.fileStatementCode && this.form.fileStatementCode.toUpperCase() == 'OTHER');

                    this.isCaseNoChecked[this.editData.caseNo] = true;
                    this.selectedFileName = this.editData.fileName;

                    this.gridFileData.data.push({
                        rowkey: 0,
                        fileId: this.editData.fileId,
                        fileName: this.editData.fileName,
                        fileExtension: this.editData.fileExtension,
                        remark: this.editData.remark,
                        uploadData: this.editData.createDate
                    })

                }
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());

        this.casePolicyLogList = PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList; //此名單下的案件歷程資訊
    }

    otherStatementState = "";
    otherStatementFeedback = true;
    otherStatementContent = "";
    otherStatementHover = "";
    validateRemark(rule, value: string, callback) {
        if (!ValidationUtil.isEmpty(value)) {
            value = value.trim();
        }
        this.otherStatementFeedback = true;
        this.otherStatementHover = "";
        this.form.remark = value;
        if (this.isOtherStatementRequired && ValidationUtil.isEmpty(value)) {
            this.otherStatementState = "error";
            this.otherStatementHover = "hover";
            this.otherStatementContent = this.$t('fileUpload_pleaseInputRemark').toString(); // 請輸入「其他說明」欄位！
            callback(false);
        } else {
            this.otherStatementState = "success";
            this.otherStatementFeedback = false;
            callback();
        }
    }
    // From 欄位驗證規則(新增/編輯)
    fileUploadEditFormRules: { [key: string]: ValidationRule[] } = {
        remark: [{ validator: this.validateRemark, trigger: "blur" }]
    };
}