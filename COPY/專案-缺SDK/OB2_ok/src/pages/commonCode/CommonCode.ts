import { Vue, Component } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonCodeEditForm from "@/components/shared/form/commonCodeEditForm/CommonCodeEditForm.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { TSysCommonCodeGrid, TSysCommonCodeInput } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { CommonCodeSearchForm, SelectOption, EditDataDto } from "./model";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";

@Component({
    components: { FblDataGrid, HiddenFolde, CommonCodeEditForm }
})

export default class CommonCode extends Vue {

    // 上方查詢條件
    commonCodeSearchForm: CommonCodeSearchForm = {
        typeDesc: "",
        commonCodeId: "",
        commonCodeName: "",
    };

    // 代碼類別下拉選單
    selectCommonCodeTypeOptions: SelectOption[] = [];

    // 判斷當下是否可執行匯出
    isExportDisable: boolean = true;
    // 匯出筆數超過最大限制的錯誤訊息
    overMaxRowCountMessage: string = "";

    // 表單按鈕文字
    formButtonText: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    // 表單是否顯示
    formVisible: boolean = false;

    // 搜尋條件過濾
    commonCodeSearchFilters: FblFilters = {
        filters: []
    };
    typeMappFilter = {
        typeId: ""
    }

    // 新增 編輯
    editingData: EditDataDto = {};

    // data grid Setting
    grid: FblPDataGridHolder<TSysCommonCodeGrid> = {
        rowKey: "uuid",
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
                width:90,
            },
            {
                type: FblColumnType.PLAIN,
                property: "typeDesc",
                title: this.$t('commonCode_typeId').toString(), //代碼類別
                width: 250,
            },
            {
                type: FblColumnType.PLAIN,
                property: "code",
                title: this.$t('commonCode_code').toString(), //代碼ID
                width: 300,
            },
            {
                type: FblColumnType.PLAIN,
                property: "codeName",
                title: this.$t('commonCode_codeName').toString(), //代碼說明
                width: 300,
            },
            {
                type: FblColumnType.PLAIN,
                property: "smemo1",
                title: this.$t('commonCode_sMemo1').toString(), //代碼說明一
                width: 500,
            },
            {
                type: FblColumnType.PLAIN,
                property: "smemo2",
                title: this.$t('commonCode_sMemo2').toString(), //代碼說明二
                width: 300,
            },
            {
                type: FblColumnType.PLAIN,
                property: "smemo3",
                title: this.$t('commonCode_sMemo3').toString(), //代碼說明三
                width: 300,
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('global_status').toString(), //狀態
                width: 100,
                formatter: (data: TSysCommonCodeGrid) => {
                    return data.status == "Y" ? "有效" : "停用";
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "codeSort",
                title: this.$t('menuSP_arrangeOrder').toString(), //排列順序
                sorter: true,
                width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateId",
                title: this.$t('global_changeStaff').toString(), //異動人員
                width: 100,
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('global_changeTime').toString(), //異動時間
                width: 160,
                formatter(data: TSysCommonCodeGrid) {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                }
            },
        ],
    };


    // 下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
    }

    created() {
        // 代碼類別載入
        LoadingUtil.show();
        this.selectCommonCodeTypeOptions = [{ label: this.$t('global_all').toString(), value: '' }]; // 全部
        this.$commonApi.initCommonCodeUsingGET("Y")
            .then((resp) => {
                resp.data.forEach((status) => {
                    this.selectCommonCodeTypeOptions.push({ label: status.typeDesc, value: status.typeId });
                })
            }).catch((err) => {
                console.error(err);
            })
            .finally(() => {
                LoadingUtil.close();
            })

        this.commonCodeSearch();
    }


    reload() {
        this.formVisible = false;
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();
            // 依搜尋條件傳入參數
            let input: TSysCommonCodeInput = {
                typeId: this.commonCodeSearchForm.typeDesc,
                typeDesc: this.commonCodeSearchForm.typeDesc,
                code: this.commonCodeSearchForm.commonCodeId,
                codeName: this.commonCodeSearchForm.commonCodeName,
            }
            this.$commonApi.paginateCommonCodeUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                input,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined
            )
                .then((resp) => {
                    // 確認回傳狀態是否成功
                    if (resp.data != null && resp.data.success){
                        const p = { ... this.grid.pagination };
                        p.total = parseInt(resp.data.commonCodeGridPage.totalElements);
                        this.grid.data = resp.data.commonCodeGridPage.content;
                        this.grid.pagination = p;
                        if (p.total == 0) {
                            // 查無符合篩選條件之資料
                            MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                        }
                    } else {
                        // 取得共用代碼資訊發生異常
                        ErrorModalUtil.modalError(this.$t(resp.data.returnMessage).toString());
                    }

                    // 確認查詢結果是否超出匯出最大限制筆數
                    this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then((exportCheck) => {
                        if (exportCheck.data.isOverMaxCount) {
                            this.isExportDisable = true;
                        }
                        this.overMaxRowCountMessage = exportCheck.data.errorMessage;
                    }).catch((err) => {
                        console.log(err);
                    }).finally(() => {
                        this.searchFlag = true;
                        LoadingUtil.close();
                    })
                })
        }
    }

    commonCodeSearch() {
        this.isExportDisable = false;
        this.grid.pagination.current = 1;
        this.reload();
    }

    // 清除
    resetCommonCodeSearchForm() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.commonCodeSearchForm = {
            typeDesc: "",
            commonCodeId: "",
            commonCodeName: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
    }

    // 編輯
    onTableActionClick(e: FblActionEvent<TSysCommonCodeGrid>) {
        switch (e.action.name) {
            case "edit":
                this.showCommonCodeEditModal(e.row.data);
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
        if ((this.$refs.commonCodeEditForm as any).validateSubmit()) {
            if ((this.$refs.commonCodeEditForm as any).getIsEdit()) {
                Modal.confirm({
                    okText: this.$t('global_ok').toString(), // 確定
                    cancelText: this.$t('global_cancel').toString(), // 取消
                    title: this.formButtonText,
                    // 請確認是否要新增/修改
                    content: this.$t('custMark_confirmMsg').toString() + this.formButtonText + ' ?',
                    onOk: () => {
                        (this.$refs.commonCodeEditForm as any).onFormSubmit();
                    }
                });
            } else {
                this.formVisible = false;
            }
        }

    }

    // Form取消
    onFormCalcel() {
        this.formVisible = false;
    }

    // 編輯
    showCommonCodeEditModal(data: TSysCommonCodeGrid) {
        this.formButtonText = this.$t('global_modify').toString(); // 編輯
        this.formVisible = true;
        this.editingData = {
            uuid: data.uuid,
            typeId: data.typeId,
            code: data.code,
            codeName: data.codeName,
            sMemo1: data.smemo1,
            sMemo2: data.smemo2,
            sMemo3: data.smemo3,
            status: data.status,
            codeSort: data.codeSort,
            createId: data.createId,
            createTime: MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate),
            updateId: data.updateId,
            updateTime: MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate),
        };
    }

    // 新增
    showCommonCodeAddModal() {
        this.formButtonText = this.$t('global_add').toString(); // 新增
        this.formVisible = true;
        this.editingData = {
            uuid: "",
            typeId: "",
            typeDesc: "",
            code: "",
            codeName: "",
            sMemo1: "",
            sMemo2: "",
            sMemo3: "",
            status: "",
            codeSort: null,
            createId: "",
            createName: "",
            createTime: "",
            updateId: "",
            updateName: "",
            updateTime: "",
        };
    }

    // 匯出
    exportSearchResult() {
        if (!this.isExportDisable) {
            if (this.grid.data.length == 0) {
                ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); // 無符合結果，無法匯出
            } else {
                LoadingUtil.show();
                // 依搜尋條件傳入參數
                let input: TSysCommonCodeInput = {
                    typeId: this.commonCodeSearchForm.typeDesc,
                    typeDesc: this.commonCodeSearchForm.typeDesc,
                    code: this.commonCodeSearchForm.commonCodeId,
                    codeName: this.commonCodeSearchForm.commonCodeName,
                }
                this.$commonApi.exportCommonCodeUsingPOST(input, this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined, { responseType: 'blob' })
                    .then((resp) => {
                        if (resp.status == 200) {
                            this.dealDownLoadData(resp.data, this.$t('commonCode_exportFileName').toString());
                            MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); // 匯出成功
                        } else {
                            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); // 匯出失敗
                        }
                    }).catch((err) => {
                        console.log(err);
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
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
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

    // 下拉選單選項異動
    onSelectionChange() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
    }
}