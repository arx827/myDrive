import { Vue, Component } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import ContactResultEditForm from "@/components/shared/form/teleResultForm/contactResultEditForm/ContactResultEditForm.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { ContactResultDto } from "@fubonlife/obd-api-axios-sdk";
import { FblFilters } from "@/components/shared/filter-builder/models";
import { ContactResultSearchForm, EditDataDto, FeildValidation } from "./model";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";

@Component({
    components: { FblDataGrid, HiddenFolde, ContactResultEditForm }
})

export default class ContactResult extends Vue {

    // 上方查詢條件
    ContactResultSearchForm: ContactResultSearchForm = {
        contactResultId: "",
        contactResultName: "",
        sendMplus: "",
        status: "",
    };

    // M+傳送下拉選單
    selectSendMplusOptions = [
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

    // 搜尋條件過濾
    contactResultSearchFilters: FblFilters = {
        filters: []
    };

    // 新增 編輯
    editingData: EditDataDto = {};

    contactResultRules: { [key: string]: ValidationRule[] } = {
        contactResultId: [{ validator: this.validateContactResultId, trigger: "blur" }],
    };

    //聯絡結果代碼搜尋欄位驗證提示工具
    contactResultIdFeildValidation: FeildValidation = {
        feedback: false,
        state: "",
        hover: "",
    }
    // 搜尋欄位驗證方式
    contactResultSearchRules: { [key: string]: ValidationRule[] } = {
        contactResultId: [{ validator: this.validateContactResultId, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<ContactResultDto> = {
        rowKey: "contactResultId",
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
                property: "contactResultId",
                title: this.$t('contactResult_contactResultId').toString(), //聯絡結果代碼
                sorter: true,
                width: CommonUtil.countColumnWidth(10),
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactResultName",
                title: this.$t('contactResult_contactResultName').toString(), //聯絡結果名稱
                sorter: true,
                width: CommonUtil.countColumnWidth(15),
            },
            {
                type: FblColumnType.PLAIN,
                property: "sendMplus",
                title: this.$t('contactResult_sendMplus').toString(), //M+傳送
                sorter: true,
                formatter: (data: ContactResultDto) => {
                    return data.sendMplus == "Y" ? "是" : "否";
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t('contactResult_status').toString(), //是否啟用
                sorter: true,
                formatter: (data: ContactResultDto) => {
                    return data.status == "Y" ? "啟用" : "停用";
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createId",
                title: this.$t('global_createStaff').toString(), //建立人員
                sorter: true,
                formatter(data: ContactResultDto) {
                    return data.createId + "-" + data.createName
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('global_createDate').toString(), //建立日期
                sorter: true,
                formatter(data: ContactResultDto) {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateId",
                title: this.$t('global_lastChangeStaff').toString(), //最後異動人員
                sorter: true,
                formatter(data: ContactResultDto) {
                    return data.updateId + "-" + data.updateName
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('global_lastChangeDate').toString(), //最後異動日期
                sorter: true,
                formatter(data: ContactResultDto) {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                }
            },
        ],
    };

    created() {
        this.contactResultSearch();
    }

    reload() {
        this.formVisible = false;
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();
            this.$contactResultApi.paginateContactResultUsingGET(
                this.ContactResultSearchForm.contactResultId.trim(),
                this.ContactResultSearchForm.contactResultName.trim(),
                this.grid.pagination.current - 1,
                this.ContactResultSearchForm.sendMplus,
                this.grid.pagination.pageSize,
                this.ContactResultSearchForm.status,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined
            ).then((resp) => {
                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.data = resp.data.content;
                this.grid.pagination = p;
            }).catch((err) => {
                // 聯絡結果設定查詢失敗
                ErrorModalUtil.modalError(this.$t('contactResult_searchFailed').toString())
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    contactResultSearch() {
        if (this.validateSearch()) {
            this.grid.pagination.current = 1;
            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch(){
        let validate = true;
        this.validateContactResultId(null, this.ContactResultSearchForm.contactResultId, () => {
            if (this.contactResultIdFeildValidation.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    // 清除
    resetContactResultSearchForm() {
        this.ContactResultSearchForm = {
            contactResultId: "",
            contactResultName: "",
            sendMplus: "",
            status: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.feildValidate(this.contactResultIdFeildValidation, false, "success", null, null);
    }

    // 編輯
    onTableActionClick(e: FblActionEvent<ContactResultDto>) {
        switch (e.action.name) {
            case "edit":
                this.showContactResultEditModal(e.row.data);
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
        if ((this.$refs.contactResultEditForm as any).validateSubmit()) {
            if ((this.$refs.contactResultEditForm as any).getIsEdit()) {
                Modal.confirm({
                    okText: this.$t('global_ok').toString(), // 確定
                    cancelText: this.$t('global_cancel').toString(), // 取消
                    title: this.formButtonText,
                    // 請確認是否要新增/修改
                    content: this.$t('custMark_confirmMsg').toString() + this.formButtonText + ' ?',
                    onOk: () => {
                        (this.$refs.contactResultEditForm as any).onFormSubmit();
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
    showContactResultEditModal(data: ContactResultDto) {
        this.formButtonText = this.$t('global_modify').toString(); // 編輯
        this.formVisible = true;
        this.editingData = {
            contactResultId: data.contactResultId,
            contactResultName: data.contactResultName,
            sendMplus: data.sendMplus,
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
    showContactResultAddModal() {
        this.formButtonText = this.$t('global_add').toString(); // 新增
        this.formVisible = true;
        this.editingData = {
            contactResultId: "",
            contactResultName: "",
            sendMplus: "N",
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

    //聯絡結果代碼 驗證
    validateContactResultId(rule, value, callback) {
        this.feildValidate(this.contactResultIdFeildValidation, true, null, "", null);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                this.feildValidate(this.contactResultIdFeildValidation, false, "success", "", "");
            } else {
                // 聯絡結果代碼 僅可輸入英數字
                this.feildValidate(this.contactResultIdFeildValidation, true, "error", "hover", this.$t('contactResult_contactResultIdalphanumericInputOnly').toString());
                callback(() => { });
            }
        } else {
            this.feildValidate(this.contactResultIdFeildValidation, false, "success", null, null);
        }
        callback();
    }
}