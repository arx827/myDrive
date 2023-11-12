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
import { Option, TeleRecordGrid, TeleRecordFilters, TeleRecordUpdationOptions } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import TeleRecordEditForm from "@/components/shared/form/teleRecordEditForm/TeleRecordEditForm.vue";

@Component({
    components: { FblDataGrid, HiddenFolde, TeleRecordEditForm }
})

export default class TeleResultConfig extends Vue {

    // 查詢條件
    teleRecordSearchForm: TeleRecordFilters = {
        taskId: "all",
        contactResultId: "all",
        teleResultId: "all",
        caseClosedReasonId: "all",
        notification: "all",
        notiClosed: "all",
        sendInteresetLetter: "all",
        recruitmentOverdue: "all",
        campBankResult: "all",
    };

    // 電訪項目 下拉選單
    taskQueryOptions: Array<Option> = [];//主頁搜尋
    taskOptions: Array<Option> = [];

    // 聯絡結果 下拉選單
    contactResultOptions: Array<Option> = [];
    contactResultQueryOptions: Array<Option> = [];//主頁搜尋

    // 電訪結果 下拉選單
    teleResultOptions: Array<Option> = [];
    teleResultQueryOptions: Array<Option> = [];//主頁搜尋

    // 結案原因 下拉選單

    caseClosedReasonQueryOptions: Array<Option> = [];//主頁搜尋

    //照會單是否結案 有空白
    notiClosedFlagQueryOptions: Array<Option> = [];//主頁搜尋

    //權益函退信原因≠招領逾期 有空白
    mailLetterReturnFlagQueryOption: Array<Option> = [];//主頁搜尋

    //北富銀VS保經代網電訪結果
    campBankResultQueryOptions: Array<Option> = [];//主頁搜尋
    // Y/N/全部 下拉選單
    selectEngOptions = [
        {
            label: this.$t('global_all').toString(), //全部
            value: "all",
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

    // 表單按鈕文字(新增/編輯)
    formButtonText: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    // 表單是否顯示
    formVisible: boolean = false;

    // 表單title
    formTitle: string = "";

    // 新增 編輯 物件
    editingData: TeleRecordGrid = {};


    // data grid Setting
    grid: FblPDataGridHolder<TeleRecordGrid> = {
        rowKey: "teleRecordId",
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
                property: "campBankResultName",
                title: this.$t('teleRecord_Taipei Fubon Bank VS Insurance teleResult').toString(), //北富銀VS保經代網電訪結果
            },
            {
                type: FblColumnType.PLAIN,
                property: "taskName",
                title: this.$t('userTask').toString(), //電訪項目
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactResultName",
                title: this.$t('pedding_contactResult').toString(), //聯絡結果
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
                property: "notiClosed",
                title: this.$t('teleRecord_notificationClosedOrNot').toString(), //照會單是否結案
            },
            {
                type: FblColumnType.PLAIN,
                property: "sendInteresetLetter",
                title: this.$t('teleResultPage_isEmailAdjunct').toString(), //是否郵寄權益信函
            },
            {
                type: FblColumnType.PLAIN,
                property: "recruitmentOverdue",
                title: this.$t('teleRecord_mailLetterReturnReason').toString(), //權益函退信原因≠招領逾期
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
                formatter: (data: TeleRecordGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);

                },
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
                formatter: (data: TeleRecordGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);

                },
            },
        ],
    };

    // 初始化頁面
    created() {
        LoadingUtil.show();
        const getOptionPromise = this.loadInitialOption();
        const getEditFormOptionDtoPromise = this.loadUpdateInformInitialOption();
        const getReloadPromise = this.reload();
        Promise
            .all([getOptionPromise,
                getReloadPromise,
                getEditFormOptionDtoPromise])
            .then(() => {
                LoadingUtil.close();
            })
            .catch(err => {
                console.error(err);
                LoadingUtil.close();
            })
    }

    reload() {
        this.formVisible = false;
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();

            return this.$teleRecordSettingApi.paginateTeleRecordUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.teleRecordSearchForm
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
                console.log(err);
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    loadInitialOption() {
        return this.$teleRecordSettingApi.initTeleReCordUsingGET()
            .then((resp) => {
                // 電訪項目: taskQueryOptions:全部/有效清單 | taskOption:有效清單
                resp.data.taskOption.forEach((opt) => {
                    this.taskQueryOptions.push({ label: opt.label, value: opt.value });
                });
                // 聯絡結果: contactResultQueryOptions:全部/有效清單 | contactResultOptions:有效清單
                resp.data.contactResultOption.forEach((opt) => {
                    this.contactResultQueryOptions.push({ label: opt.label, value: opt.value });
                });
                // 電訪結果: teleResultQueryOptions:全部/有效清單 | teleResultOptions:有效清單
                resp.data.teleResultOption.forEach((opt) => {
                    this.teleResultQueryOptions.push({ label: opt.label, value: opt.value });
                });
                // 結案原因: caseClosedReasonQueryOptions:全部/有效清單 | caseClosedReasonOptions:有效清單/空白選項
                resp.data.caseClosedReasonOption.forEach((opt) => {
                    this.caseClosedReasonQueryOptions.push({ label: opt.label, value: opt.value });
                });
                //照會單是否結案
                this.notiClosedFlagQueryOptions = resp.data.notiClosedFlagOption;
                //權益函退信原因≠招領逾期
                this.mailLetterReturnFlagQueryOption = resp.data.mailLetterReturnFlagOption;
                //北富銀VS保經代網電訪結果
                this.campBankResultQueryOptions = resp.data.campBankResultOption;
            }).catch((err) => {
                // 下拉選單查詢失敗
                ErrorModalUtil.modalError(this.$t('pendingCaseManagement_dropDownMenuImportFail').toString())
            })
    }
    //初始化表單資料
    initEditFormOptionsDto: TeleRecordUpdationOptions = {};
    //取得新增修改表單
    loadUpdateInformInitialOption() {
        return this.$teleRecordSettingApi.initUpdateOrInsertRecordOptionsUsingGET()
            .then((resp) => {
                this.initEditFormOptionsDto = resp.data;
            }).catch((err) => {
                console.log(err);
            })
    }

    onSearch() {
        this.grid.pagination.current = 1;
        this.reload();
    }





    // 清除
    resetTeleRecordSearchForm() {
        this.teleRecordSearchForm = {
            taskId: "all",
            contactResultId: "all",
            teleResultId: "all",
            caseClosedReasonId: "all",
            notification: "all",
            notiClosed: "all",
            sendInteresetLetter: "all",
            recruitmentOverdue: "all",
            campBankResult: "all",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;

    }

    // 換頁
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
    }

    // 編輯
    onTableActionClick(e: FblActionEvent<TeleRecordGrid>) {
        switch (e.action.name) {
            case "edit":
                this.teleRecordEditModal(e.row.data);
                break;
        }
    }



    // 編輯Modal
    teleRecordEditModal(data: TeleRecordGrid) {
        this.formTitle = this.$t('global_maintain').toString();
        this.formButtonText = this.$t('global_modify').toString(); // 修改
        this.formVisible = true;
        this.editingData = data;
    }

    // 新增
    teleRecordAddModal() {
        this.formTitle = this.$t('global_add').toString();
        this.formButtonText = this.$t('global_add').toString(); // 新增
        this.formVisible = true;
        this.editingData = {};
    }

    // Form送出
    onFormSubmit() {
        if((this.$refs.teleRecordEditForm as any).validateBeforeSubmit()){
        Modal.confirm({
            okText: this.$t('global_ok').toString(), // 確定
            cancelText: this.$t('global_cancel').toString(), // 取消
            title: this.formButtonText,
            // 請確認是否要新增/修改
            content: this.$t('custMark_confirmMsg').toString() + this.formButtonText + ' ?',
            onOk: () => {
                (this.$refs.teleRecordEditForm as any).onFormSubmit();
            }
        });
    }

    }

    // Form取消
    onFormCancel() {
        this.formVisible = false;
    }

    //控制是否可以匯出
    isExportingAble: boolean = false;

    // 匯出電訪結果配置
    handleExport() {
        if(this.grid.data.length>0){
        LoadingUtil.show();
        this.$teleRecordSettingApi.exportTeleReCordUsingPOST(this.teleRecordSearchForm, { responseType: 'blob' })
            .then((res) => {
                this.dealDownLoadData(res.data, "電訪記錄設定.xlsx"); 
                MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
            }).catch((err) => {
                console.error(err);
                ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); // 上傳失敗
            }).finally(() => {
                LoadingUtil.close();
            });
        }else{
            ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
        }
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