import { Vue, Component } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import TeleResultConfigEditForm from "@/components/shared/form/teleResultForm/teleResultConfigEditForm/TeleResultConfigEditForm.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import ValidateInput from "@/components/shared/validateInput/ValidateInput.vue";
import { Option, TeleResultConfigDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { FblDataGrid, HiddenFolde, TeleResultConfigEditForm, ValidateInput }
})

export default class TeleResultConfig extends Vue {

    // 查詢條件
    TeleResultConfigSearchForm: TeleResultConfigDto = {
        teleResultConfigId: "",
        taskId: "",
        contactResultId: "",
        teleResultId: "",
        caseClosedReasonId: "",
        notification: "",
        inform: "",
        sendInterestLetter: "",
        validPolicy: "",
        completeTele: "",
        returnAs400: "",
        hostCorrespond: "",
        status: "",
    };

    // 電訪項目 下拉選單
    taskOptions: Array<Option> = [];
    taskQueryOptions: Array<Option> = [];

    // 聯絡結果 下拉選單
    contactResultOptions: Array<Option> = [];
    contactResultQueryOptions: Array<Option> = [];

    // 電訪結果 下拉選單
    teleResultOptions: Array<Option> = [];
    teleResultQueryOptions: Array<Option> = [];

    // 結案原因 下拉選單
    caseClosedReasonOptions: Array<Option> = [];
    caseClosedReasonQueryOptions: Array<Option> = [];

    // 主機對應值 下拉選單
    hostCorrespondOptions: Array<Option> = [];
    hostCorrespondQueryOptions: Array<Option> = [];

    // 是否列入完成電訪 下拉選單
    completeTeleOptions: Array<Option> = [];
    completeTeleQueryOptions: Array<Option> = [];

    // Y/N/全部 下拉選單
    selectEngOptions = [
        {
            label: this.$t('global_all').toString(), //全部
            value: "",
        },
        {
            label: 'Y', //Y
            value: 'Y',
        },
        {
            label: 'N', //N
            value: 'N',
        }
    ];

    // 是/否/全部下拉選單
    selectChineseOptions = [
        {
            label: this.$t('global_all').toString(), //全部
            value: ""
        },
        {
            label: this.$t('global_yes').toString(), //是
            value: 'Y',
        }, {
            label: this.$t('global_no').toString(), //否
            value: 'N',
        }
    ];

    // 啟用/停用/全部下拉選單
    selectStatusOptions = [
        {
            label: this.$t('global_all').toString(), //全部
            value: ""
        },
        {
            label: this.$t('global_enable').toString(), //啟用
            value: 'Y',
        }, {
            label: this.$t('global_deactivate').toString(), //停用
            value: 'N',
        }
    ];

    // Y/N 下拉選單
    selectEngOptionsChild = [
        {
            label: 'Y',
            value: 'Y',
        },
        {
            label: 'N',
            value: 'N',
        }
    ];

    // 是/否 下拉選單
    selectChineseOptionsChild = [
        {
            label: this.$t('global_yes').toString(), //是
            value: 'Y',
        }, {
            label: this.$t('global_no').toString(), //否
            value: 'N',
        }
    ];

    // 啟用/停用 下拉選單
    selectStatusOptionsChild = [
        {
            label: this.$t('global_enable').toString(), //啟用
            value: 'Y',
        }, {
            label: this.$t('global_deactivate').toString(), //停用
            value: 'N',
        }
    ];

    // 表單按鈕文字(新增/編輯)
    formButtonText: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    // 表單是否顯示
    formVisible: boolean = false;

    // 表單title
    formTitle: string = "";

    // 新增 編輯
    editingData: TeleResultConfigDto = {};

    // (validate) teleResultConfigId欄位驗證提示工具
    teleResultConfigIdFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: "",
        hoverVisible: false
    }

    // (validate) 搜尋欄位驗證方式
    teleResultConfigIdSearchRules: { [key: string]: ValidationRule[] } = {
        teleResultConfigId: [{ validator: this.validateTeleResultConfigId, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<TeleResultConfigDto> = {
        rowKey: "teleResultConfigId",
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
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t('global_edit').toString(), //編輯
                        edit: true
                    },
                ],
            },
            {
                type: FblColumnType.PLAIN,
                property: "teleResultConfigId",
                title: this.$t('global_serialNumber').toString(), //編號
            },
            {
                type: FblColumnType.PLAIN,
                property: "taskName",
                title: this.$t('userTask').toString(), //電訪項目
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactResultName",
                title: this.$t('pedding_contactResult').toString(), //連絡結果
            },
            {
                type: FblColumnType.PLAIN,
                property: "teleResultName",
                title: this.$t('pedding_pendingResult').toString(), //電訪結果
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseClosedReasonName",
                title: this.$t('pedding_caseCloseReason').toString(), //結案原因
            },
            {
                type: FblColumnType.PLAIN,
                property: "notification",
                title: this.$t('teleResultPage_isNoti').toString(), //是否照會
            },
            {
                type: FblColumnType.PLAIN,
                property: "inform",
                title: this.$t('teleResultPage_isInf').toString(), //是否會辦
            },
            {
                type: FblColumnType.PLAIN,
                property: "sendInterestLetter",
                title: this.$t('teleResultPage_isEmailAdjunct').toString(), //是否郵寄權益信函
            },
            {
                type: FblColumnType.PLAIN,
                property: "validPolicy",
                title: this.$t('teleResultPage_isEffectivePolicy').toString(), //是否列入有效保單
            },
            {
                type: FblColumnType.PLAIN,
                property: "completeTele",
                title: this.$t('teleResultPage_isCompeletedUserTask').toString(), //是否列入完成電訪
                formatter: (data: TeleResultConfigDto) =>{
                    if (this.completeTeleOptions){
                        let option = this.completeTeleOptions.find(c => c.value == data.completeTele);
                        if (option) {
                            return option.label
                        } else {
                            return data.completeTele;
                        }
                    } else {
                        return data.completeTele;
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "returnAs400",
                title: this.$t('teleResultPage_isWritenInAs400').toString(), //是否回寫400
                formatter: (data: TeleResultConfigDto) => {
                    if (data.returnAs400 == "Y") {
                        return this.$t('global_yes').toString();
                    } else {
                        return this.$t('global_no').toString();
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "hostCorrespondName",
                title: this.$t('teleResultPage_isWritenInServer').toString(), //回寫至主機的對應值
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('contactResult_status').toString(), //是否啟用
                formatter: (data: TeleResultConfigDto) => {
                    if (data.status == "Y") {
                        return this.$t('global_enable').toString();
                    } else {
                        return this.$t('global_deactivate').toString();
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "createName",
                title: this.$t('global_createStaff').toString(), //建立人員
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('global_createDate').toString(), //建立日期
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateName",
                title: this.$t('global_lastChangeStaff').toString(), //最後異動人員
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('global_lastChangeDate').toString(), //最後異動日期
            },
        ],
    };

    // 初始化頁面
    created() {
        LoadingUtil.show();
        const getOptionPromise = this.loadInitialOption();
        getOptionPromise.then(()=>{
            const getReloadPromise = this.reload();
            getReloadPromise.then(()=>{
                LoadingUtil.close();
            }).catch(err => {
                console.error(err);
                LoadingUtil.close();
            });
        }).catch(err => {
            console.error(err);
            LoadingUtil.close();
        });
        // Promise
        //     .all([getOptionPromise,
        //         getReloadPromise])
        //     .then(() => {
        //         LoadingUtil.close();
        //     })
        //     .catch(err => {
        //         console.error(err);
        //         LoadingUtil.close();
        //     })
    }

    reload() {
        this.formVisible = false;
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();

            return this.$teleResultConfigApi.paginateTeleResultConfigUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.TeleResultConfigSearchForm
            ).then((resp) => {
                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.data = resp.data.content;
                this.grid.pagination = p;
                if (p.total == 0) {
                    // 查無符合篩選條件之資料
                    MessageUtil.messageInfo(this.$t('CUST_MARK_NOT_FOUND').toString());
                }
            }).catch((err) => {
                // 結案原因查詢失敗
                ErrorModalUtil.modalError(this.$t('teleResultPage_paginateFail').toString())
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    loadInitialOption() {
        return this.$teleResultConfigApi.initTeleResultConfigUsingGET()
            .then((resp) => {
                // 電訪項目: taskQueryOptions:全部/有效清單 | taskOption:有效清單
                this.taskQueryOptions.push({ label: "全部", value: "" });
                resp.data.taskOption.forEach((opt) => {
                    this.taskQueryOptions.push({ label: opt.label, value: opt.value });
                    this.taskOptions.push({ label: opt.label, value: opt.value });
                });
                // 聯絡結果: contactResultQueryOptions:全部/有效清單 | contactResultOptions:有效清單
                this.contactResultQueryOptions.push({ label: "全部", value: "" });
                resp.data.contactResultOption.forEach((opt) => {
                    this.contactResultQueryOptions.push({ label: opt.label, value: opt.value });
                    this.contactResultOptions.push({ label: opt.label, value: opt.value });
                });
                // 電訪結果: teleResultQueryOptions:全部/有效清單 | teleResultOptions:有效清單
                this.teleResultQueryOptions.push({ label: "全部", value: "" });
                resp.data.teleResultOption.forEach((opt) => {
                    this.teleResultQueryOptions.push({ label: opt.label, value: opt.value });
                    this.teleResultOptions.push({ label: opt.label, value: opt.value });
                });
                // 結案原因: caseClosedReasonQueryOptions:全部/有效清單 | caseClosedReasonOptions:有效清單/空白選項
                this.caseClosedReasonQueryOptions.push({ label: "全部", value: "" });
                resp.data.caseClosedReasonOption.forEach((opt) => {
                    this.caseClosedReasonQueryOptions.push({ label: opt.label, value: opt.value });
                    this.caseClosedReasonOptions.push({ label: opt.label, value: opt.value });
                });
                this.caseClosedReasonOptions.push({ label: "", value: "" });
                // 主機對應值: hostCorrespondQueryOptions:全部/有效清單 | hostCorrespondOptions:有效清單
                this.hostCorrespondQueryOptions.push({ label: "全部", value: "" });
                resp.data.hostCorrespondOption.forEach((opt) => {
                    this.hostCorrespondQueryOptions.push({ label: opt.label, value: opt.value });
                    this.hostCorrespondOptions.push({ label: opt.label, value: opt.value });
                });
                // 是否列入完成電訪值: completeTeleQueryOptions:全部/有效清單 | completeTeleOptions:有效清單
                this.completeTeleQueryOptions.push({ label: "全部", value: "" });
                resp.data.completeTeleOption.forEach((opt) => {
                    this.completeTeleQueryOptions.push({ label: opt.label, value: opt.value });
                    this.completeTeleOptions.push({ label: opt.label, value: opt.value });
                });
            }).catch((err) => {
                // 下拉選單載入失敗
                ErrorModalUtil.modalError(this.$t('pendingCaseManagement_dropDownMenuImportFail').toString())
            })
    }

    onSearch() {
        if (this.validateSearch()) {
            this.grid.pagination.current = 1;
            this.reload();
        }
    }

    onChange(event) {
        this.TeleResultConfigSearchForm.teleResultConfigId = event;
        this.validateTeleResultConfigId(null, this.TeleResultConfigSearchForm.teleResultConfigId, () => { });
    }

    // (validate)查詢前驗證格式
    validateSearch() {
        let validate = true;
        this.validateTeleResultConfigId(null, this.TeleResultConfigSearchForm.teleResultConfigId, () => {
            if (this.teleResultConfigIdFeildValidation.state == 'error') {
                validate = false;
            }
        });
        return true;
    }

    // 清除
    resetTeleResultConfigSearchForm() {
        this.TeleResultConfigSearchForm = {
            teleResultConfigId: "",
            taskId: "",
            contactResultId: "",
            teleResultId: "",
            caseClosedReasonId: "",
            notification: "",
            inform: "",
            sendInterestLetter: "",
            validPolicy: "",
            completeTele: "",
            returnAs400: "",
            hostCorrespond: "",
            status: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
    }

    // 編輯
    onTableActionClick(e: FblActionEvent<TeleResultConfigDto>) {
        switch (e.action.name) {
            case "edit":
                this.teleResultConfigEditModal(e.row.data);
                break;
        }
    }

    // 換頁
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
    }

    // Form送出
    onFormSubmit() {
        if ((this.$refs.teleResultConfigEditForm as any).validateSubmit()) {
            Modal.confirm({
                okText: this.$t('global_ok').toString(), // 確定
                cancelText: this.$t('global_cancel').toString(), // 取消
                title: this.formButtonText,
                // 請確認是否要新增/修改
                content: this.$t('custMark_confirmMsg').toString() + this.formButtonText + ' ?',
                onOk: () => {
                    (this.$refs.teleResultConfigEditForm as any).onFormSubmit();
                }
            });
        }
    }

    // Form取消
    onFormCancel() {
        this.formVisible = false;
    }

    // 編輯Modal
    teleResultConfigEditModal(data: TeleResultConfigDto) {
        this.formTitle = this.$t('global_maintain').toString();
        this.formButtonText = this.$t('global_modify').toString(); // 編輯
        this.formVisible = true;
        this.editingData = {
            teleResultConfigId: data.teleResultConfigId,
            taskId: data.taskId,
            contactResultId: data.contactResultId,
            teleResultId: data.teleResultId,
            caseClosedReasonId: data.caseClosedReasonId,
            notification: data.notification,
            inform: data.inform,
            sendInterestLetter: data.sendInterestLetter,
            validPolicy: data.validPolicy,
            completeTele: data.completeTele,
            returnAs400: data.returnAs400,
            hostCorrespond: data.hostCorrespond,
            status: data.status,
            createId: data.createId,
            createName: data.createName,
            createDate: data.createDate,
            updateId: data.updateId,
            updateName: data.updateName,
            updateDate: data.updateDate,
        };
    }

    // 新增
    teleResultConfigAddModal() {
        this.formTitle = this.$t('global_add').toString();
        this.formButtonText = this.$t('global_add').toString(); // 新增
        this.formVisible = true;
        this.editingData = {
            teleResultConfigId: "",
            taskId: "",
            contactResultId: "",
            teleResultId: "",
            caseClosedReasonId: "",
            notification: "",
            inform: "",
            sendInterestLetter: "",
            validPolicy: "",
            completeTele: "",
            returnAs400: "",
            hostCorrespond: "",
            status: "",
            createId: null,
            createDate: null,
            updateId: null,
            updateDate: null,
        };
    }

    // (validate)編號驗證(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean)
    validateTeleResultConfigId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
            } else {
                // 僅可輸入英數字且限20字
                CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, true, this.$t('global_alphanumericInputOnly').toString(), true);
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.teleResultConfigIdFeildValidation, false, "", false);
        }
        callback();
    }

    // 共用欄位驗證
    callCommonUtilFeild(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValid(fv);
    }

    isExporting: boolean = false;

    // 匯出電訪結果配置
    handleExport() {
        this.isExporting = true;
        LoadingUtil.show();
        this.$teleResultConfigApi.exportTeleResultConfigUsingPOST(this.TeleResultConfigSearchForm, { responseType: 'blob' })
            .then((res) => {
                this.dealDownLoadData(res.data, "電訪結果配置.xlsx"); // 電訪結果配置.xlsx
                MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
            }).catch((err) => {
                console.error(err);
                ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); // 上傳失敗
            }).finally(() => {
                this.isExporting = false;
                LoadingUtil.close();
            });
    }

    // 處理後端回傳的下載內容
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
            MessageUtil.messageError(this.$t('roleSP_exportFailure').toString()); //匯出失敗
        }
    }
}