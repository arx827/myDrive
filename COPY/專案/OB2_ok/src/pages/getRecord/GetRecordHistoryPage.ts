import CommonUtil, { AuthComonent, ValidateFormComponent } from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { default as ValidationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from "@/components/shared/data-grid/models";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import HandleInfoForm from "@/components/shared/form/handleInfoForm/HandleInfoForm.vue";
import CallupHistory from "@/components/shared/form/history/callupHistory/CallupHistory.vue";
import CaseHistoryForm from '@/components/shared/form/history/caseHistory/CaseHistoryForm.vue';
import InfRecord from "@/components/shared/form/history/infRecord/InfRecord.vue";
import MailRecord from '@/components/shared/form/history/mailHistory/MailHistory.vue';
import MPlusHistory from "@/components/shared/form/history/mPlusHistory/MPlusHistory.vue";
import QuestionAnswer from '@/components/shared/form/history/questionAnswer/QuestionAnswer.vue';
import UploadFileHistroy from "@/components/shared/form/history/uploadFileHistroy/UploadFileHistroy.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { ComponentDto, RecordHistoryDto, RecordHistorySearchDto } from "@fubonlife/obd-api-axios-sdk";
import { TimePicker } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from 'axios';
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import { DatePickerEnum, DatePickerTypeEnum, FeildValidation, RecordPageSearchForm, RecordPageSearchValidateForm } from "./model";
@Component({
    components: {
        FblDataGrid, HiddenFolde, TimePicker,
        CaseHistoryForm, MailRecord, QuestionAnswer, DragModal, UploadFileHistroy, InfRecord, MPlusHistory, CallupHistory, HandleInfoForm
    }
})
export default class GetRecordHistoryPage extends Vue {
    // 畫面元件權限控管
    authComponent: AuthComonent = {
        COM_RECORD_HISTORY_SEARCH: {
            show: true,
            enable: false
        },
        COM_RECORD_HISTORY_EXPORT: {
            show: true,
            enable: false
        },
    };

    // 錄音撥放載入
    isLoading: boolean = false;

    // 撥放器顯示
    showRecordPlayer: boolean = false;

    // 撥放器連線網址
    recordPlayUrl: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    // 查詢條件
    recordPageSearchForm: RecordPageSearchForm = {
        dialStart: moment(new Date()).startOf("day"), // 播放/下載時間區間(開始)
        dialEnd: moment(new Date()).startOf("day"), // 播放/下載時間區間(結束)
        dialStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())), // 播放/下載時間區間(開始)字串
        dialEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())), // 播放/下載時間區間(結束)字串
        datePickerDialStart: moment(new Date()).startOf("day").toDate(), // 播放/下載時間區間(結束)日期
        datePickerDialEnd: moment(new Date()).startOf("day").toDate(), // 播放/下載時間區間(結束)日期
        userId: "", // 調聽者帳號
        extNo: "", // 電話號碼(來電)
        telNo: "", // 電話號碼(外撥)
        casePolicy: "", // 保單號碼(全)
        policyNo: "", // 保單號碼
        policySeq: "", // 保單號碼序號
        policyIdDup: "", // 保單號碼重複碼
        specifyContactStartTime: null,
        specifyContactEndTime: null,
        specifyContactStartString: "",
        specifyContactEndString: "",
    };

    // 欄位驗證提示工具
    recordPageSearchValidateForm: RecordPageSearchValidateForm = {
        dialStart: { feedback: false, hoverVisible: false },
        dialEnd: { feedback: false, hoverVisible: false },
        userId: { feedback: false, hoverVisible: false },
        extNo: { feedback: false, hoverVisible: false },
        telNo: { feedback: false, hoverVisible: false },
        casePolicy: { feedback: false, hoverVisible: false },
        policyNo: { feedback: false, hoverVisible: false },
        policySeq: { feedback: false, hoverVisible: false },
        policyIdDup: { feedback: false, hoverVisible: false },
        specifyContactStartTime: { feedback: false, hoverVisible: false },
        specifyContactEndTime: { feedback: false, hoverVisible: false },
    }

    // 查詢條件輸入規則
    recordPageSearchRules: { [key: string]: ValidationRule[] } = {
        dialStart: [{ validator: this.dialStartValidator, trigger: "blur" }],
        dialEnd: [{ validator: this.dialEndValidator, trigger: "blur" }],
        userId: [{ validator: this.userIdValidator, trigger: "blur" }],
        extNo: [{ validator: this.extNoValidator, trigger: "blur" }],
        telNo: [{ validator: this.telNoValidator, trigger: "blur" }],
        policyNo: [{ validator: this.policyNoValidator, trigger: "blur" }],
        policySeq: [{ validator: this.policySeqValidator, trigger: "blur" }],
        policyIdDup: [{ validator: this.policyIdDupValidator, trigger: "blur" }],
    };

    // DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    // 日期選擇器hover是否顯示
    isDialStartVisible: boolean = false;
    isDialEndVisible: boolean = false;

    // 判斷當下是否可執行匯出
    isExportDisable: boolean = false;
    overMaxRowCountMessage: string = "";

    // 時間選擇器是否顯示
    isSpecifyContactStartOpen: boolean = false;
    isSpecifyContactEndOpen: boolean = false;

    // 搜尋條件過濾(主表)
    recordSearchFilters: FblFilters = {
        filters: []
    };

    // 錄音調檔查詢結果顯示設定
    grid: FblPDataGridHolder<RecordHistoryDto> = {
        rowKey: "rowKey",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" }
        },
        scroll: { x: 500, y: 370 },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "createId",
                title: this.$t('getRecordHistoryPage_createId').toString(), // 調聽者帳號
                align: 'center',
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "createName",
                title: this.$t('getRecordHistoryPage_createName').toString(), // 調聽者姓名
                align: 'center',
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDept",
                title: this.$t('getRecordHistoryPage_createDept').toString(), // 調聽者部門
                align: 'center',
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "action",
                title: this.$t('getRecordHistoryPage_action').toString(), // 播放/下載
                align: 'center',
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "casePolicy",
                title: this.$t('getRecordPage_casePolicy').toString(), // 保單號碼
                align: 'center',
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.PLAIN,
                property: "custName",
                title: this.$t('getRecordPage_custName').toString(), // 受訪者姓名
                align: 'center',
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "extNo",
                title: this.$t('getRecordPage_extNo').toString(), // 電話號碼(來電)
                align: 'center',
                width: CommonUtil.countColumnWidth(7),
            },
            {
                type: FblColumnType.PLAIN,
                property: "telNo",
                title: this.$t('getRecordPage_telNo').toString(), // 電話號碼(外撥)
                align: 'center',
                width: CommonUtil.countColumnWidth(7),
            },
            {
                type: FblColumnType.PLAIN,
                property: "eduId",
                title: this.$t('getRecordPage_eduId').toString(), // 錄音檔編號UCID
                align: 'center',
                width: CommonUtil.countColumnWidth(7),
            },
            {
                type: FblColumnType.PLAIN,
                property: "tmrId",
                title: this.$t('getRecordPage_userId').toString(), // 電訪員帳號
                align: 'center',
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "tmrName",
                title: this.$t('getRecordHistoryPage_tmrName').toString(), // 電訪員姓名
                align: 'center',
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "tmrDept",
                title: this.$t('getRecordHistoryPage_tmrDept').toString(), // 電訪員部門
                align: 'center',
                width: CommonUtil.countColumnWidth(5),
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('getRecordHistoryPage_createDate').toString(), // 播放/下載時間
                align: 'center',
                width: CommonUtil.countColumnWidth(7),
            },
        ]
    };

    /**
     * 頁面開啟
     * @returns 
     */
    created() {
        LoadingUtil.show();
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
            .then((res: AxiosResponse<ComponentDto>) => {
                if (res.data.component) {
                    this.authComponent.COM_RECORD_HISTORY_EXPORT = ValidationUtil.isEmpty(res.data.component.COM_RECORD_HISTORY_EXPORT) ?
                        this.authComponent.COM_RECORD_HISTORY_EXPORT : res.data.component.COM_RECORD_HISTORY_EXPORT;
                    this.authComponent.COM_RECORD_HISTORY_SEARCH = ValidationUtil.isEmpty(res.data.component.COM_RECORD_HISTORY_SEARCH) ?
                        this.authComponent.COM_RECORD_HISTORY_SEARCH : res.data.component.COM_RECORD_HISTORY_SEARCH;
                }
            }).catch((err) => {
                console.log(err);
            }).finally(() => LoadingUtil.close());
    }

    /**
     * 播放/下載時間區間(開始) 驗證
     */
    dialStartValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
                callback();
            } else {
                this.isDialStartVisible = true;
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, true, this.$t('global_dateError').toString(), false); // 日期錯誤
                callback(() => { });
            }
        } else if (!VlidationUtil.isEmpty(this.recordPageSearchForm.dialEnd)) {
            this.isDialStartVisible = true;
            CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, true, this.$t('getRecordHistoryPage_createDateStartRequired').toString(), false); // 播放/下載時間區間(開始) 必填
            callback(() => { });
        }
        callback();
    }

    /**
     * 播放/下載時間區間(結束) 驗證
     */
    dialEndValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
                callback();
            } else {
                this.isDialEndVisible = true;
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, true, this.$t('global_dateError').toString(), false); // 日期錯誤
                callback(() => { });
            }
        } else if (!VlidationUtil.isEmpty(this.recordPageSearchForm.dialStart)) {
            this.isDialEndVisible = true;
            CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, true, this.$t('getRecordHistoryPage_createEndStartRequired').toString(), false); // 播放/下載時間區間(結束) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 起訖日期驗證
    * @param rule 驗證規則 
    * @param startTime 起始日期
    * @param endTime 結束日期 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateDueContactStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            var isOver31Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 31);
            if (!isOver31Days) {
                dateDisableStart = false;
                dateDisableEnd = false;
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
                callback();
            } else {
                dateDisableStart = true;
                dateDisableEnd = true;
                if (!ValidationUtil.isEmpty(this.recordPageSearchForm.dialStartString) && !ValidationUtil.isEmpty(this.recordPageSearchForm.dialEndString)) {
                    CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, true, this.$t('getRecordPage_startEndNo31').toString(), false); // 起訖不可超過31天
                    CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, true, this.$t('getRecordPage_startEndNo31').toString(), false); // 起訖不可超過31天
                }
                callback(() => { });
            }
        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.recordPageSearchForm.dialStartString) && !ValidationUtil.isEmpty(this.recordPageSearchForm.dialEndString)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); // 請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); // 請輸入正確的起訖日期
            }
            callback(() => { });
        }
        callback();
    }

    /**
     * 調聽者帳號 驗證
     */
    userIdValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.userId, false, '', false);
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.userId)) {
            if (ValidationUtil.alphabetAndNumberValidation(this.recordPageSearchForm.userId)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.userId, false, '', false);
                callback();
            } else {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.userId, true, this.$t('getRecordHistoryPage_createDateLetterAndNumberOnly').toString(), false); // 調聽者帳號 僅可輸入英文與數字
                callback(() => { });
            }
        }
        callback();
    }

    /**
     * 電話號碼(來電) 驗證
     */
    extNoValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.extNo, false, '', false);
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.extNo)) {
            if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.extNo)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.extNo, true, this.$t('getRecordPage_extNoNumberOnly').toString(), false); // 電話號碼(來電) 僅可輸入數字
                callback(() => { });
            }
        }
        callback();
    }

    /**
     * 電話號碼(外撥) 驗證
     */
    telNoValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.telNo, false, '', false);
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.telNo)) {
            if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.telNo)) {
                // 電話號碼(外撥) 僅可輸入數字
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.telNo, true, this.$t('getRecordPage_telNoNumberOnly').toString(), false); // 電話號碼(外撥) 僅可輸入數字
                callback(() => { });
            }
        }
        callback();
    }

    /**
     * 保單號碼 驗證
     */
    policyNoValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyNo, false, '', false);
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.policyNo)) {

            if (ValidationUtil.isAnyChinese(this.recordPageSearchForm.policyNo)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyNo, true, this.$t('getRecordPage_PolicyNoNoChineses').toString(), false); // 保單號碼 不可輸入中文
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyIdDup, false, '', false);
                callback(() => { });
            } else {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyNo, false, '', false);
                if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policyNo)) {
                    if (ValidationUtil.isEmpty(this.recordPageSearchForm.policySeq)) {
                        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, true, this.$t('getRecordPage_PolicySeqRequired').toString(), false); // 保單序號 必填
                    } else if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policySeq)) {
                        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, true, this.$t('getRecordPage_PolicySeqNumberOnly').toString(), false); // 保單序號 僅可輸入數字
                    } else {
                        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
                    }
                } else {
                    if (!ValidationUtil.isEmpty(this.recordPageSearchForm.policySeq) && !ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policySeq)) {
                        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, true, this.$t('getRecordPage_PolicySeqNumberOnly').toString(), false); // 保單序號 僅可輸入數字
                    } else {
                        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
                    }
                }
            }

        } else {
            if (!ValidationUtil.isEmpty(this.recordPageSearchForm.policySeq) && !ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policySeq)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, true, this.$t('getRecordPage_PolicySeqNumberOnly').toString(), false); // 保單序號 僅可輸入數字
            } else {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
            }
        }
        callback();
    }

    /**
     * 保單號碼序號 驗證
     */
    policySeqValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.policySeq)) {
            if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policySeq)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, true, this.$t('getRecordPage_PolicySeqNumberOnly').toString(), false); // 保單序號 僅可輸入數字
                callback(() => { });
            }
        } else {
            if (!ValidationUtil.isEmpty(this.recordPageSearchForm.policyNo)) {
                if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policyNo)) {
                    CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, true, this.$t('getRecordPage_PolicySeqRequired').toString(), false); // 保單序號 必填
                    callback(() => { });
                } else {
                    CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
                }
            }
        }
        callback();
    }

    /**
     * 保單號碼重複碼 驗證
     */
    policyIdDupValidator(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyIdDup, false, '', false);
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.policyIdDup)) {
            if (!ValidationUtil.numberOnlyValidation(this.recordPageSearchForm.policyIdDup)) {
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyIdDup, true, this.$t('getRecordPage_PolicyIdDupNumberOnly').toString(), false); // 保單重複碼 僅可輸入數字
                callback(() => { });
            }
        }
        callback();
    }

    /**
     * 查詢
     */
    searchGetRecordPage() {
        console.log("this.recordPageSearchForm", this.recordPageSearchForm);
        if (this.validateSearch(true)) {
            // 播放/下載時間區間為空則預設為系統當天
            if ((VlidationUtil.isEmpty(this.recordPageSearchForm.dialStartString) || VlidationUtil.isEmpty(this.recordPageSearchForm.dialStartString)) &&
                VlidationUtil.isEmpty(this.recordPageSearchForm.userId) &&
                VlidationUtil.isEmpty(this.recordPageSearchForm.extNo) &&
                VlidationUtil.isEmpty(this.recordPageSearchForm.telNo) &&
                VlidationUtil.isEmpty(this.recordPageSearchForm.policyNo)) {
                this.recordPageSearchForm.dialStart = moment(new Date()).startOf("day"); // 播放/下載時間區間(開始)
                this.recordPageSearchForm.dialEnd = moment(new Date()).startOf("day"); // 播放/下載時間區間(結束)
                this.recordPageSearchForm.dialStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())); // 播放/下載時間區間(開始)字串
                this.recordPageSearchForm.dialEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())); // 播放/下載時間區間(結束)字串
                this.recordPageSearchForm.datePickerDialStart = moment(new Date()).startOf("day").toDate(); // 播放/下載時間區間(結束)日期
                this.recordPageSearchForm.datePickerDialEnd = moment(new Date()).startOf("day").toDate(); // 播放/下載時間區間(結束)日期
            }

            let specifyContactStartTimeHours = this.recordPageSearchForm.specifyContactStartTime ? this.recordPageSearchForm.specifyContactStartTime.hours() : 0;
            let specifyContactStartTimeMinutes = this.recordPageSearchForm.specifyContactStartTime ? this.recordPageSearchForm.specifyContactStartTime.minutes() : 0;
            let specifyContactEndTimeHours = this.recordPageSearchForm.specifyContactEndTime ? this.recordPageSearchForm.specifyContactEndTime.hours() : 23;
            let specifyContactEndTimeMinutes = this.recordPageSearchForm.specifyContactEndTime ? this.recordPageSearchForm.specifyContactEndTime.minutes() : 59;

            this.isExportDisable = false;
            let dialStartIsoString = this.recordPageSearchForm.dialStart ? moment(this.recordPageSearchForm.dialStart).startOf("day")
                .hours(specifyContactStartTimeHours).minutes(specifyContactStartTimeMinutes).toISOString(true) : "";
            let dialEndIsoString = this.recordPageSearchForm.dialEnd ? moment(this.recordPageSearchForm.dialEnd).endOf("day")
                .hours(specifyContactEndTimeHours).minutes(specifyContactEndTimeMinutes).toISOString(true) : "";

            let policySeq = !ValidationUtil.isEmpty(this.recordPageSearchForm.policyNo) && ValidationUtil.isEmpty(this.recordPageSearchForm.policySeq) ? "0" : this.recordPageSearchForm.policySeq;
            let casePolicyStr = [this.recordPageSearchForm.policyNo, policySeq, this.recordPageSearchForm.policyIdDup]
                .filter(c => !ValidationUtil.isEmpty(c)).join("-");

            const dialStart = FiltersUtil.setFilterParam("createDate", FblOperator.GEQ, dialStartIsoString);
            const dialEnd = FiltersUtil.setFilterParam("createDate", FblOperator.LEQ, dialEndIsoString);
            const userId = FiltersUtil.setFilterParam("createId", FblOperator.EQ, this.recordPageSearchForm.userId);
            const extNo = FiltersUtil.setFilterParam("extNo", FblOperator.EQ, this.recordPageSearchForm.extNo);
            const telNo = FiltersUtil.setFilterParam("telNo", FblOperator.EQ, this.recordPageSearchForm.telNo);
            const casePolicy = FiltersUtil.setFilterParam("casePolicy", FblOperator.EQ, casePolicyStr);
            this.recordSearchFilters = FiltersUtil.setFilters(dialStart, dialEnd, userId, extNo, telNo, casePolicy);
            this.grid.pagination.current = 1;
            this.grid.data = [];
            this.reload();
        }
    }

    /**
     * 重整頁面
     */
    reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            this.showRecordPlayer = false;
            LoadingUtil.show();
            this.$recordApi.paginateRecordHistoryUsingPOST(({
                page: this.grid.pagination.current - 1,
                size: this.grid.pagination.pageSize,
                tobdRecordHistoryFilter: this.recordSearchFilters,
            } as RecordHistorySearchDto))
                .then((resp) => {
                    console.log("resp", resp);
                    const p = { ...this.grid.pagination };
                    p.total = parseInt(resp.data.totalElements);
                    let temparayDataList = [];
                    let rowKey = 0;
                    resp.data.content.forEach(c => {
                        c["rowKey"] = rowKey++;
                        temparayDataList.push(c);
                    });
                    this.grid.data = temparayDataList;
                    this.grid.pagination = p;
                    if (p.total == 0) {
                        //	查無符合篩選條件之資料
                        MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                    }
                    //確認查詢結果是否超出匯出最大限制筆數
                    this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then((exportCheck) => {
                        if (exportCheck.data.isOverMaxCount) {
                            this.isExportDisable = true;
                        }
                        this.overMaxRowCountMessage = exportCheck.data.errorMessage;
                        LoadingUtil.close();
                    }).catch((err) => {
                        // 錄音調檔查詢失敗
                        ErrorModalUtil.modalError(this.$t('getRecordPage_recordSearchFail').toString())
                        LoadingUtil.close();
                    })
                }).catch((err) => {
                    // 錄音調檔查詢失敗
                    ErrorModalUtil.modalError(this.$t('getRecordPage_recordSearchFail').toString())
                    LoadingUtil.close();
                }).finally(() => {
                    this.searchFlag = true;
                })
        }
    }

    /**
     * 換頁
     * @param e 
     */
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.sort = e.sort;
            this.grid.pagination = e.pagination;
            this.reload();
        }
    }

    /**
     * 查詢結果匯出
     */
    exportSearchResult() {
        if (!this.isExportDisable) {
            if (this.grid.data.length == 0) {
                ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出
            } else {
                LoadingUtil.show();
                this.$recordApi.exportRecordHistoryUsingPOST(({
                    page: this.grid.pagination.current - 1,
                    size: this.grid.pagination.pageSize,
                    tobdRecordHistoryFilter: this.recordSearchFilters,
                } as RecordHistorySearchDto), { responseType: 'blob' })
                    .then((resp) => {
                        this.dealDownLoadData(resp.data, this.$t('getRecordHistoryPage_recordsearchHistoryExport').toString()); // 錄音歷程調檔.xlsx
                        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
                    }).catch((err) => {
                        console.error(err);
                        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            if (ValidationUtil.isEmpty(this.overMaxRowCountMessage)) {
                ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
            } else {
                //匯出筆數超過最大限制
                ErrorModalUtil.modalError(this.overMaxRowCountMessage);
            }
        }
    }

    /**
     * 處理後端回傳的下載內容
     * @param resData 
     * @param fileName 
     */
    dealDownLoadData(resData, fileName: string) {
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

    /**
     * 播放/下載時間區間(開始) 自動轉為字串更新搜尋條件
     * @param date 
     */
    onDialStartChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.recordPageSearchForm.dialStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.recordPageSearchForm.dialStart = date;
        this.isDialStartVisible = false;
        this.isDialEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
        this.validateSearch(false);
    }

    /**
     * 播放/下載時間區間(結束) 自動轉為字串更新搜尋條件
     * @param date 
     */
    onDialEndChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.recordPageSearchForm.dialEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.recordPageSearchForm.dialEnd = date;
        this.isDialStartVisible = false;
        this.isDialEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
        this.validateSearch(false);
    }

    /**
     * 驗證共用物件
     * @param fv 
     * @param feedback 
     * @param state 
     * @param hover 
     * @param msg 
     */
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    /**
     * 查詢驗證
     * @param isRealSearch 
     * @returns 
     */
    validateSearch(isRealSearch) {
        let validate = true;
        let validateDial = true;
        this.dialStartValidator(null, this.recordPageSearchForm.dialStartString, () => {
            if (this.recordPageSearchValidateForm.dialStart.feedback) {
                validateDial = false;
                validate = false;
            }
        });
        this.dialEndValidator(null, this.recordPageSearchForm.dialEndString, () => {
            if (this.recordPageSearchValidateForm.dialEnd.feedback) {
                validateDial = false;
                validate = false;
            }
        });
        this.policyNoValidator(null, null, () => {
            if (this.recordPageSearchValidateForm.policyNo.feedback) {
                validate = false;
            } else {
                this.policySeqValidator(null, null, () => {
                    if (this.recordPageSearchValidateForm.policySeq.feedback) {
                        validate = false;
                    }
                });

                this.policyIdDupValidator(null, null, () => {
                    if (this.recordPageSearchValidateForm.policyIdDup.feedback) {
                        validate = false;
                    }
                });
            }
        });

        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validateDial && !ValidationUtil.isEmpty(this.recordPageSearchForm.dialStartString) && !ValidationUtil.isEmpty(this.recordPageSearchForm.dialEndString)) {
            this.validateDueContactStartAndEndDate(null, this.recordPageSearchForm.datePickerDialStart, this.recordPageSearchForm.datePickerDialEnd, this.recordPageSearchForm.dialStartString,
                this.recordPageSearchForm.dialEndString, this.isDialStartVisible, this.isDialEndVisible, () => {
                    if (this.recordPageSearchValidateForm.dialStart.feedback || this.recordPageSearchValidateForm.dialEnd.feedback) {
                        validate = false;
                    }
                });
        }

        //起始與結束時間皆符合規範才進一步判斷起訖區間
        if (!ValidationUtil.isEmpty(this.recordPageSearchForm.specifyContactStartString) && !ValidationUtil.isEmpty(this.recordPageSearchForm.specifyContactEndString)) {
            this.validateSpecifyStartAndEndTime(null, this.recordPageSearchForm.specifyContactStartTime, this.recordPageSearchForm.specifyContactEndTime,
                this.recordPageSearchForm.datePickerDialStart, this.recordPageSearchForm.datePickerDialEnd, () => {
                    if (this.recordPageSearchValidateForm.specifyContactStartTime.feedback || this.recordPageSearchValidateForm.specifyContactEndTime.feedback) {
                        validate = false;
                    }
                });
        }

        this.userIdValidator(null, null, () => {
            if (this.recordPageSearchValidateForm.userId.feedback) {
                validate = false;
            }
        });

        this.extNoValidator(null, null, () => {
            if (this.recordPageSearchValidateForm.extNo.feedback) {
                validate = false;
            }
        });

        this.telNoValidator(null, null, () => {
            if (this.recordPageSearchValidateForm.telNo.feedback) {
                validate = false;
            }
        });

        if (validate && isRealSearch) {
            //檢核查詢條件數量(少於兩個不可執行查詢)
            let countResult = this.checkFilterCount();
            validate = countResult;
            if (!countResult) {
                ErrorModalUtil.modalError(this.$t('getRecordPage_searchAtLeast2').toString()); // 查詢條件至少輸入兩項
            }
        }

        return validate;
    }

    /**
     * 檢核查詢條件數量(少於兩個不可執行查詢)
     * @returns 
     */
    checkFilterCount() {
        let isAbleToSearch = false;
        let filterColumn = [];

        Object.keys(this.recordPageSearchForm).forEach((key => {
            if (key != 'dialStart' && key != 'dialEnd' && key != 'specifyContactStartTime' && key != 'specifyContactEndTime') {
                if (!ValidationUtil.isEmpty(this.recordPageSearchForm[key])) {
                    filterColumn.push(key);
                }
            }
        }))

        //若有填寫保單號碼 即可直接查詢
        if (filterColumn.some((c) => c == 'policyNo')) {
            isAbleToSearch = true;
        }

        //計算有效查詢欄位數量
        if (!isAbleToSearch) {
            let count = 0;
            if (filterColumn.some((c) => c == "policyNo" || c == "policySeq" || c == "policyIdDup")) {
                count++;
                filterColumn = filterColumn.filter((c) => c != "policyNo" && c != "policySeq" && c != "policyIdDup");
            }
            if (filterColumn.some((c) => c == "dialStartString" || c == "dialEndString")) {
                count++;
                filterColumn = filterColumn.filter((c) => c != "dialStartString" && c != "dialEndString" && c != "datePickerDialStart" && c != "datePickerDialEnd");
            }
            if (filterColumn.some((c) => c == "specifyContactStartString" || c == "specifyContactEndString")) {
                count++;
                filterColumn = filterColumn.filter((c) => c != "specifyContactStartString" && c != "specifyContactEndString");
            }

            count = count + filterColumn.length;

            if (count >= 2) {
                isAbleToSearch = true;
            }
        }

        return isAbleToSearch;
    }

    /**
     * 清除日期
     * @param cleanType 
     */
    clearDial(cleanType: String) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
        this.isDialStartVisible = false;
        this.isDialEndVisible = false;
        if (cleanType === DatePickerTypeEnum.StartDate) {
            this.recordPageSearchForm[DatePickerEnum.dialStartString] = "";
            this.recordPageSearchForm[DatePickerEnum.dialStart] = null;
            if (!VlidationUtil.isEmpty(this.recordPageSearchForm.dialEnd)) {
                this.isDialStartVisible = true;
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, true, this.$t('getRecordHistoryPage_createDateStartRequired').toString(), false); // 播放/下載時間區間(開始) 必填
            }
        } else if (cleanType === DatePickerTypeEnum.EndDate) {
            this.recordPageSearchForm[DatePickerEnum.dialEndString] = "";
            this.recordPageSearchForm[DatePickerEnum.dialEnd] = null;
            if (!VlidationUtil.isEmpty(this.recordPageSearchForm.dialStart)) {
                this.isDialEndVisible = true;
                CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, true, this.$t('getRecordHistoryPage_createEndStartRequired').toString(), false); // 播放/下載時間區間(結束) 必填
            }
        }
    }


    /**
     * 播放/下載時間區間(開始) 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDialStartDate(data: any) {
        this.isDialStartVisible = false;
        this.isDialEndVisible = false;
        this.feildValidate(this.recordPageSearchValidateForm.dialStart, true, "", "", "");
        this.feildValidate(this.recordPageSearchValidateForm.dialEnd, true, "", "", "");
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.feildValidate(this.recordPageSearchValidateForm.dialStart, false, "success", "", "");
            this.feildValidate(this.recordPageSearchValidateForm.dialEnd, false, "success", "", "");
        } else {
            this.isDialStartVisible = true;
            this.feildValidate(this.recordPageSearchValidateForm.dialStart, true, "error", "hover", this.$t('global_dateError').toString()); // 日期錯誤
        }
        this.recordPageSearchForm.dialStart = parseDate ? parseDate : this.recordPageSearchForm.dialStart;
        this.recordPageSearchForm.dialStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.recordPageSearchForm.dialStart.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 播放/下載時間區間(結束) 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDialEndDate(data: any) {
        this.isDialStartVisible = false;
        this.isDialEndVisible = false;
        this.feildValidate(this.recordPageSearchValidateForm.dialStart, true, "", "", "");
        this.feildValidate(this.recordPageSearchValidateForm.dialEnd, true, "", "", "");
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.feildValidate(this.recordPageSearchValidateForm.dialStart, false, "success", "", "");
            this.feildValidate(this.recordPageSearchValidateForm.dialEnd, false, "success", "", "");
        } else {
            this.isDialEndVisible = true;
            this.feildValidate(this.recordPageSearchValidateForm.dialEnd, true, "error", "hover", this.$t('global_dateError').toString()); // 日期錯誤
        }
        this.recordPageSearchForm.dialEnd = parseDate ? parseDate : this.recordPageSearchForm.dialEnd;
        this.recordPageSearchForm.dialEndString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.recordPageSearchForm.dialEnd.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 起訖日期驗證
     * @param rule 
     * @param startDate 
     * @param endDate 
     * @param startString 
     * @param endString 
     * @param dateDisableStart 
     * @param dateDisableEnd 
     * @param callback 
     */
    validateDialStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        this.feildValidate(this.recordPageSearchValidateForm.dialStart, false, "success", "", "");
        this.feildValidate(this.recordPageSearchValidateForm.dialEnd, false, "success", "", "");
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            dateDisableStart = false;
            dateDisableEnd = false;
            this.feildValidate(this.recordPageSearchValidateForm.dialStart, false, "success", "", "");
            this.feildValidate(this.recordPageSearchValidateForm.dialEnd, false, "success", "", "");
            callback();

        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.recordPageSearchForm.dialStartString) && !ValidationUtil.isEmpty(this.recordPageSearchForm.dialEndString)) {
                this.feildValidate(this.recordPageSearchValidateForm.dialStart, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); // 請輸入正確的起訖日期
                this.feildValidate(this.recordPageSearchValidateForm.dialEnd, true, "error", "hover", this.$t('global_pleaseInputCorrectStartAndEndDate').toString()); // 請輸入正確的起訖日期
            }
            callback(() => { });
        }
        callback();
    }

    /**
    * 起訖時間驗證
    * @param rule 驗證規則 
    * @param startTime 起始時間
    * @param endTime 結束時間 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateSpecifyStartAndEndTime(rule, startTime, endTime, startDate, endDate, callback) {
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactStartTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactEndTime, false, '', false);
        if (moment(startDate).isSame(endDate) && !startTime.isBefore(endTime)) {
            CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactStartTime, true, this.$t('global_pleaseInputCorrectStartAndEndTime').toString(), false); //請輸入正確的起訖時間
            CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactEndTime, true, this.$t('global_pleaseInputCorrectStartAndEndTime').toString(), false); //請輸入正確的起訖時間
            callback(() => { });
        }
        callback();
    }

    /**
     * 取得驗證參數
     * @param fv 
     * @returns 
     */
    callCommonUtilFeild(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValid(fv);
    }

    /**
     * 變更hover hoverVisivle參數
     * @param fv 
     */
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    /**
     * 清除查詢條件
     */
    resetGetRecordPage() {
        this.showRecordPlayer = false;
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.recordPageSearchForm = {
            dialStart: moment(new Date()).startOf("day"), // 播放/下載時間區間(開始)
            dialEnd: moment(new Date()).startOf("day"), // 播放/下載時間區間(結束)
            dialStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())), // 播放/下載時間區間(開始)字串
            dialEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())), // 播放/下載時間區間(結束)字串
            datePickerDialStart: moment(new Date()).startOf("day").toDate(), // 播放/下載時間區間(結束)日期
            datePickerDialEnd: moment(new Date()).startOf("day").toDate(), // 播放/下載時間區間(結束)日期
            userId: "", // 調聽者帳號
            extNo: "", // 電話號碼(來電)
            telNo: "", // 電話號碼(外撥)
            casePolicy: "", // 保單號碼(全)
            policyNo: "", // 保單號碼
            policySeq: "", // 保單號碼序號
            policyIdDup: "", // 保單號碼重複碼
            specifyContactStartTime: null,
            specifyContactEndTime: null,
            specifyContactStartString: "",
            specifyContactEndString: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.clearValidateStatus();
    }

    //清除查詢條件的驗證狀態
    clearValidateStatus() {
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialStart, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.dialEnd, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.userId, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.extNo, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.telNo, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.casePolicy, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyNo, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policySeq, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.policyIdDup, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactStartTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactEndTime, false, '', false);
    }

    /**
     * 點選時間選擇器 (開始)
     * @param open 
     */
    clickSpecifyContactStartTimePicker(open) {
        this.isSpecifyContactStartOpen = open;
    }

    /**
     * 點選時間選擇器 (結束)
     * @param open 
     */
    clickSpecifyContactEndTimePicker(open) {
        this.isSpecifyContactEndOpen = open;
    }

    /**
     * 選擇時間後，將時間更新 (開始)
     * @param date 
     * @param timeString 
     */
    onSpecifyContactStartTimeChange(date, timeString) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactStartTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactEndTime, false, '', false);
        this.recordPageSearchForm.specifyContactStartString = timeString;
        this.validateSearch(false);
    }

    /**
     * 選擇時間後，將時間更新 (結束)
     * @param date 
     * @param timeString 
     */
    onSpecifyContactEndTimeChange(date, timeString) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactEndTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.recordPageSearchValidateForm.specifyContactStartTime, false, '', false);
        this.recordPageSearchForm.specifyContactEndString = timeString;
        this.validateSearch(false);
    }

    /**
     * 手動關閉時間選擇器 (開始)
     */
    closeSpecifyContactStartTimePicker() {
        this.isSpecifyContactStartOpen = false;
    }

    /**
     * 手動關閉時間選擇器 (結束)
     */
    closeSpecifyContactEndTimePicker() {
        this.isSpecifyContactEndOpen = false;
    }

    /**
     * 調聽者帳號轉大寫
     */
    userIdUpper() {
        this.recordPageSearchForm.userId = this.recordPageSearchForm.userId.toUpperCase();
    }

    /**
     * 保單號碼轉大寫
     */
    policyNoUpper() {
        this.recordPageSearchForm.policyNo = this.recordPageSearchForm.policyNo.toUpperCase();
    }

}