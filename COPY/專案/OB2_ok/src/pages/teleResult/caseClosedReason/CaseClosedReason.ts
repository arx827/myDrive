import { Vue, Component, Watch } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CaseClosedReasonEditForm from "@/components/shared/form/teleResultForm/caseClosedReasonEditForm/CaseClosedReasonEditForm.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import ValidateInput from "@/components/shared/validateInput/ValidateInput.vue";
import { CaseClosedReasonDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { CaseClosedReasonSearchForm, EditDataDto } from "./model";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { FblDataGrid, HiddenFolde, CaseClosedReasonEditForm, ValidateInput }
})

export default class CaseClosedReason extends Vue {


    // 上方查詢條件
    CaseClosedReasonSearchForm: CaseClosedReasonSearchForm = {
        caseClosedReasonId: "",
        caseClosedReasonName: "",
        status: "",
    };

    // 是否啟用下拉選單
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

    // 表單按鈕文字(新增/編輯)
    formButtonText: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    // 表單是否顯示
    formVisible: boolean = false;

    // 新增 編輯
    editingData: EditDataDto = {};

    // (validate)結案原因代碼搜尋欄位驗證提示工具
    caseClosedReasonIdFeildValidation: ValidateFormComponent = {
        feedback: false,
        state: "",
        hover: "",
        msg: this.$t('caseClosedReason_IdValidateErrorMsg').toString(),
        hoverVisible: false
    }

    // (validate)搜尋欄位驗證方式
    caseClosedReasonSearchRules: { [key: string]: ValidationRule[] } = {
        caseClosedReasonId: [{ validator: this.validateCaseClosedReasonId, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<CaseClosedReasonDto> = {
        rowKey: "caseClosedReasonId",
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
                property: "caseClosedReasonId",
                title: this.$t('caseClosedReason_caseClosedReasonId').toString(), //結案原因代碼
                sorter: true,
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseClosedReasonName",
                title: this.$t('caseClosedReason_caseClosedReasonName').toString(), //結案原因名稱
                sorter: true,
                width: CommonUtil.countColumnWidth(15),
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('contactResult_status').toString(), //是否啟用
                sorter: true,
                formatter: (data: CaseClosedReasonDto) => {
                    return data.status == "Y" ? "啟用" : "停用";
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createName",
                title: this.$t('global_createStaff').toString(), //建立人員
                sorter: true,
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('global_createDate').toString(), //建立日期
                sorter: true,
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateName",
                title: this.$t('global_lastChangeStaff').toString(), //最後異動人員
                sorter: true,
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('global_lastChangeDate').toString(), //最後異動日期
                sorter: true,
            },
        ],
    };

    // 初始化頁面
    created() {
        this.caseClosedReasonSearch();
    }

    reload() {
        this.formVisible = false;
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();

            this.$caseClosedReasonApi.paginateCaseClosedReasonUsingGET(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.CaseClosedReasonSearchForm.caseClosedReasonId.trim(),
                this.CaseClosedReasonSearchForm.caseClosedReasonName.trim(),
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                this.CaseClosedReasonSearchForm.status
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
                ErrorModalUtil.modalError(this.$t('caseClosedReason_searchFailed').toString())
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    caseClosedReasonSearch() {
        if (this.validateSearch()) {
            this.grid.pagination.current = 1;
            this.reload();
        }
    }

    // (validate)查詢前驗證格式
    validateSearch() {
        let validate = true;
        this.validateCaseClosedReasonId(null, this.CaseClosedReasonSearchForm.caseClosedReasonId, () => {
            if (this.caseClosedReasonIdFeildValidation.feedback) {
                validate = false;
            }
        });
        return validate;
    }

    // 清除
    resetCaseClosedReasonSearchForm() {
        this.CaseClosedReasonSearchForm = {
            caseClosedReasonId: "",
            caseClosedReasonName: "",
            status: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        CommonUtil.feildValidateWithVisible(this.caseClosedReasonIdFeildValidation, false, "", false);
    }

    // 編輯
    onTableActionClick(e: FblActionEvent<CaseClosedReasonDto>) {
        switch (e.action.name) {
            case "edit":
                this.caseClosedReasonEditModal(e.row.data);
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
        if ((this.$refs.caseClosedReasonEditForm as any).validateSubmit()) {
            Modal.confirm({
                okText: this.$t('global_ok').toString(), // 確定
                cancelText: this.$t('global_cancel').toString(), // 取消
                title: this.formButtonText,
                // 請確認是否要新增/修改
                content: this.$t('custMark_confirmMsg').toString() + this.formButtonText + ' ?',
                onOk: () => {
                    (this.$refs.caseClosedReasonEditForm as any).onFormSubmit();
                }
            });
        }
    }

    // Form取消
    onFormCalcel() {
        this.formVisible = false;
    }

    // 編輯Modal
    caseClosedReasonEditModal(data: CaseClosedReasonDto) {
        this.formButtonText = this.$t('global_modify').toString(); // 編輯
        this.formVisible = true;
        this.editingData = {
            caseClosedReasonId: data.caseClosedReasonId,
            caseClosedReasonName: data.caseClosedReasonName,
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
    caseClosedReasonAddModal() {
        this.formButtonText = this.$t('global_add').toString(); // 新增
        this.formVisible = true;
        this.editingData = {
            caseClosedReasonId: "",
            caseClosedReasonName: "",
            status: "Y",
            createId: "",
            createName: "",
            createDate: "",
            updateId: "",
            updateName: "",
            updateDate: "",
        };
    }

    // (validate)電訪結果代碼 驗證
    validateCaseClosedReasonId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.caseClosedReasonIdFeildValidation, false, "", false);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.caseClosedReasonIdFeildValidation, false, "", false);
            } else {
                // 結案原因代碼 僅可輸入英數字且限20字
                CommonUtil.feildValidateWithVisible(this.caseClosedReasonIdFeildValidation, true, this.$t('caseClosedReason_IdValidateErrorMsg').toString(), true);
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.caseClosedReasonIdFeildValidation, false, "", false);
        }
        callback();
    }

    callCommonUtilFeild(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValid(fv);
    }

    validateInput(event) {
        this.CaseClosedReasonSearchForm.caseClosedReasonId = event;
        this.validateCaseClosedReasonId(null, this.CaseClosedReasonSearchForm.caseClosedReasonId, () => { });
    }
}