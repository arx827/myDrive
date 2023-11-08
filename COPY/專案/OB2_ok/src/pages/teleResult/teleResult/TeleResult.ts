import { Vue, Component } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent, 
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import TeleResultEditForm from "@/components/shared/form/teleResultForm/teleResultEditForm/TeleResultEditForm.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { TeleResultDto } from "@fubonlife/obd-api-axios-sdk";
import { FblFilters } from "@/components/shared/filter-builder/models";
import { TeleResultSearchForm, EditDataDto, FeildValidation } from "./model";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { FblDataGrid, HiddenFolde, TeleResultEditForm }
})

export default class TeleResult extends Vue {

    // 上方查詢條件
    TeleResultSearchForm: TeleResultSearchForm = {
        teleResultId: "",
        teleResultName: "",
        notSuspective: "",
        status: "",
    };

    // 是否列入良質指標下拉選單
    selectNotSuspectiveOptions = [
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

    // 表單按鈕文字
    formButtonText: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    // 表單是否顯示
    formVisible: boolean = false;

    // 新增 編輯
    editingData: EditDataDto = {};

    teleResultRules: { [key: string]: ValidationRule[] } = {
        teleResultId: [{ validator: this.validateTeleResultId, trigger: "blur" }],
    };

    //聯絡結果代碼搜尋欄位驗證提示工具
    teleResultIdFeildValidation: FeildValidation = {
        feedback: false,
        state: "",
        hover: "",
    }
    // 搜尋欄位驗證方式
    teleResultSearchRules: { [key: string]: ValidationRule[] } = {
        teleResultId: [{ validator: this.validateTeleResultId, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<TeleResultDto> = {
        rowKey: "teleResultId",
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
                property: "teleResultId",
                title: this.$t('teleResult_teleResultId').toString(), //電訪結果代碼
                sorter: true,
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: "teleResultName",
                title: this.$t('teleResult_teleResultName').toString(), //電訪結果名稱
                sorter: true,
                width: CommonUtil.countColumnWidth(15),
            },
            {
                type: FblColumnType.PLAIN,
                property: "notSuspective",
                title: this.$t('teleResult_notSuspective').toString(), //是否列入良質指標
                sorter: true,
                formatter: (data: TeleResultDto) => {
                    return data.notSuspective == "Y" ? "是" : "否";
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('contactResult_status').toString(), //是否啟用
                sorter: true,
                formatter: (data: TeleResultDto) => {
                    return data.status == "Y" ? "啟用" : "停用";
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createId",
                title: this.$t('global_createStaff').toString(), //建立人員
                sorter: true,
                formatter(data: TeleResultDto) {
                    return data.createName
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('global_createDate').toString(), //建立日期
                sorter: true,
                formatter(data: TeleResultDto) {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateId",
                title: this.$t('global_lastChangeStaff').toString(), //最後異動人員
                sorter: true,
                formatter(data: TeleResultDto) {
                    return data.updateName
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('global_lastChangeDate').toString(), //最後異動日期
                sorter: true,
                formatter(data: TeleResultDto) {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                }
            },
        ],
    };

    created() {
        this.teleResultSearch();
    }

    reload() {
        this.formVisible = false;
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();

            this.$teleResultApi.paginateTeleResultUsingGET(
                this.TeleResultSearchForm.notSuspective,
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.TeleResultSearchForm.status,
                this.TeleResultSearchForm.teleResultId.trim(),
                this.TeleResultSearchForm.teleResultName.trim(),
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined
            ).then((resp) => {
                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.data = resp.data.content;
                this.grid.pagination = p;
                if(p.total == 0){
                    //	查無符合篩選條件之資料
                    MessageUtil.messageInfo(this.$t('CUST_MARK_NOT_FOUND').toString());
                }
            }).catch((err) => {
                // 電訪結果設定查詢失敗
                ErrorModalUtil.modalError(this.$t('teleResult_searchFailed').toString())
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    teleResultSearch() {
        if (this.validateSearch()) {
            this.grid.pagination.current = 1;
            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch(){
        let validate = true;
        this.validateTeleResultId(null, this.TeleResultSearchForm.teleResultId, () => {
            if (this.teleResultIdFeildValidation.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    // 清除
    resetTeleResultSearchForm() {
        this.TeleResultSearchForm = {
            teleResultId: "",
            teleResultName: "",
            notSuspective: "",
            status: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.feildValidate(this.teleResultIdFeildValidation, false, "success", null, null);
    }

    // 編輯
    onTableActionClick(e: FblActionEvent<TeleResultDto>) {
        switch (e.action.name) {
            case "edit":
                this.showTeleResultEditModal(e.row.data);
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
        if ((this.$refs.teleResultEditForm as any).validateSubmit()) {
            if ((this.$refs.teleResultEditForm as any).getIsEdit()) {
                Modal.confirm({
                    okText: this.$t('global_ok').toString(), // 確定
                    cancelText: this.$t('global_cancel').toString(), // 取消
                    title: this.formButtonText,
                    // 請確認是否要新增/修改
                    content: this.$t('custMark_confirmMsg').toString() + this.formButtonText + ' ?',
                    onOk: () => {
                        (this.$refs.teleResultEditForm as any).onFormSubmit();
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
    showTeleResultEditModal(data: TeleResultDto) {
        this.formButtonText = this.$t('global_modify').toString(); // 編輯
        this.formVisible = true;
        this.editingData = {
            teleResultId: data.teleResultId,
            teleResultName: data.teleResultName,
            notSuspective: data.notSuspective,
            status: data.status,
            createId: data.createId,
            createName: data.createName,
            createDate: MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate),
            updateId: data.updateId,
            updateName: data.updateName,
            updateDate: MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate),
        };
    }

    // 新增
    showTeleResultAddModal() {
        this.formButtonText = this.$t('global_add').toString(); // 新增
        this.formVisible = true;
        this.editingData = {
            teleResultId: "",
            teleResultName: "",
            notSuspective: "N",
            status: "Y",
            createId: "",
            createName: "",
            createDate: "",
            updateId: "",
            updateName: "",
            updateDate: "",
        };
    }

    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //電訪結果代碼 驗證
    validateTeleResultId(rule, value, callback) {
        this.feildValidate(this.teleResultIdFeildValidation, true, null, "", null);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                this.feildValidate(this.teleResultIdFeildValidation, false, "success", "", "");
            } else {
                // 電訪結果代碼 僅可輸入英數字
                this.feildValidate(this.teleResultIdFeildValidation, true, "error", "hover", this.$t('teleResult_teleResultIdalphanumericInputOnly').toString());
                callback(() => { });
            }
        } else {
            this.feildValidate(this.teleResultIdFeildValidation, false, "success", null, null);
        }
        callback();
    }
}