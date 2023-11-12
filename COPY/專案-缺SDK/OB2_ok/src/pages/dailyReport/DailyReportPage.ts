import { Vue, Component } from "vue-property-decorator";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { DailyReportDto, DailyReportInput, Option } from "@fubonlife/obd-api-axios-sdk";
import { DailyReportSearchForm, FeildValidation, DailyReportSearchValidateForm, DatePickerTypeEnum } from "./model";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from "moment";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { FblDataGrid, HiddenFolde }
})

export default class DailyReportPage extends Vue {

    //宣告日期變數
    date = new Date();

    //日期選擇器hover是否顯示
    isDataStartDateVisible: boolean = false;
    isDataEndDateVisible: boolean = false;

    //上方查詢條件
    dailyReportSearchForm: DailyReportSearchForm = {
        departmentIdList: [],
        divisionIdList: [],
        tmrIdList: [],
        dataStartDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day"),
        dataPickerStartDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day").toDate(),
        dataEndDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day"),
        dataPickerEndDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day").toDate(),
        dataStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1))),
        dataEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1))),
    };

    dailyReportInput: DailyReportInput = {
        departmentIdList: [],
        divisionIdList: [],
        tmrIdList: [],
        dataStartDate: MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)),
        dataEndDate: MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)),
    }

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    //查詢條件預設值
    defaultDepartmentId: string = "";

    // 控制不重複搜尋的flag
    searchFlag: boolean = true;

    //判斷當下是否可執行匯出
    isExportDisable: boolean = false;
    overMaxRowCountMessage: string = "";

    // 部門、科別、電訪員下拉式選單
    selectDeptOptions: Option[] = [];;
    selectDiviOptions: Option[] = [];
    selectDiviOptionsOnSelect: Option[] = [];
    selectTmrOptions: Option[] = [];

    // 部門、科別、電訪員的下拉選單選項來源存放
    allDivList: Option[] = [];
    allUserList: Option[] = [];

    depUnitInfo = {};
    depUserInfo = {};
    unitUserInfo = {};

    unitDepInfo = {};

    // 預設部門
    defaultDeptId = '';

    // 欄位驗證提示工具
    dailyReportSearchValidationForm: DailyReportSearchValidateForm = {
        departmentIdList: { feedback: false, hoverVisible: false },
        divisionIdList: { feedback: false, hoverVisible: false },
        tmrIdList: { feedback: false, hoverVisible: false },
        dataStartDate: { feedback: false, hoverVisible: false },
        dataEndDate: { feedback: false, hoverVisible: false },
    }

    // 搜尋欄位驗證方式
    dailyReportSearchRules: { [key: string]: ValidationRule[] } = {
        departmentIdList: [{ validator: this.validateDepartmentIdList, trigger: "blur" }],
        dataStartDate: [{ validator: this.validateDataStartDate, trigger: "blur" }],
        dataEndDate: [{ validator: this.validateDataEndDate, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<DailyReportDto> = {
        rowKey: 'id',
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
                type: FblColumnType.PLAIN,
                property: "taskType",
                title: this.$t('global_class').toString(), //類別
                width: 140,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "businessType",
                title: this.$t('onDutyPage_businessType').toString(), //業務別
                width: 140,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "executeTime",
                title: this.$t('dailyReportPage_executeTime').toString(), //執行時機
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "task",
                title: this.$t('transition_taskItem').toString(), //電訪項目
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "sysType",
                title: this.$t('case_search_grid_sysTypeCodeName').toString(), //通路別
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "dataDate",
                title: this.$t('telTimeReportPage_dataDate').toString(), //資料日期
                align: 'center',
                width: 140,
                formatter(data: DailyReportDto) {
                    return MomentUtil.transformRocYearMonthDay(data.dataDate);
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "total",
                title: this.$t('dailyReportPage_total').toString(), //統計數
                align: 'center',
                width: 140,
            },
        ],
    };

    created() {
        LoadingUtil.show();

        // 取得部門 科別 人員下拉清單
        this.$unitApi.getAllDepUnitTmrOptionsUsingGET()
            .then((resp) => {
                if (resp.data != null) {
                    this.unitDepInfo = resp.data;

                    // 部門對應科別/人員資料
                    this.depUnitInfo = resp.data.depUnitInfo;
                    this.depUserInfo = resp.data.depUserInfo;

                    // 科別對應人員資料
                    this.unitUserInfo = resp.data.unitUserInfo;

                    // 部門 下拉
                    this.selectDeptOptions = Object.assign(resp.data.departOptions);

                    // 預設部門
                    this.defaultDeptId = resp.data.defaultDepId;
                    this.dailyReportSearchForm.departmentIdList.push(this.defaultDeptId);

                    // 科別 下拉
                    this.allDivList = resp.data.unitList;

                    // 電訪員 下拉
                    this.allUserList = resp.data.userList;

                    // 有預設部門需一起異動科別
                    if (!ValidationUtil.isEmpty(resp.data.defaultDepId)) {
                        this.onSelectDept();
                    }

                    // 有預設科別需一起異動人員
                    if (!ValidationUtil.isEmpty(resp.data.defaultUnitId)) {
                        this.onSeletDivi();
                    }

                    this.dailyReportSearch();
                }
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                LoadingUtil.close()
            });

    }


    reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();

            this.$dailyReportApi.paginateDailyReportUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                this.dailyReportInput
            ).then((resp) => {

                if (resp.data != null) {
                    const p = { ...this.grid.pagination };
                    p.total = parseInt(resp.data.totalElements);
                    this.grid.data = resp.data.content;
                    this.grid.pagination = p;
                    if (p.total == 0) {
                        MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                    }
                } else {
                    // 查詢失敗
                    MessageUtil.messageInfo(this.$t('global_failure').toString());
                }

            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    dailyReportSearch() {
        if (this.validateSearch()) {
            this.isExportDisable = false;
            this.grid.pagination.current = 1;
            const emptyList = [];
            this.dailyReportInput.departmentIdList = (this.dailyReportSearchForm.departmentIdList.length == 0) ? emptyList : this.dailyReportSearchForm.departmentIdList;
            this.dailyReportInput.divisionIdList = (this.dailyReportSearchForm.divisionIdList.length == 0) ? emptyList : this.dailyReportSearchForm.divisionIdList;
            this.dailyReportInput.tmrIdList = (this.dailyReportSearchForm.tmrIdList.length == 0) ? emptyList : this.dailyReportSearchForm.tmrIdList;
            this.dailyReportInput.dataStartDate = MomentUtil.default(this.dailyReportSearchForm.dataPickerStartDate);
            this.dailyReportInput.dataEndDate = MomentUtil.default(this.dailyReportSearchForm.dataPickerEndDate);

            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch() {
        let validate = true;
        let validateDataDate = true;

        // 部門
        this.validateDepartmentIdList(null, this.dailyReportSearchForm.departmentIdList, () => {
            if (this.dailyReportSearchValidationForm.departmentIdList.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料日期(起)
        this.validateDataStartDate(null, this.dailyReportSearchForm.dataStartString, () => {
            if (this.dailyReportSearchValidationForm.dataStartDate.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料日期(訖)
        this.validateDataStartDate(null, this.dailyReportSearchForm.dataEndString, () => {
            if (this.dailyReportSearchValidationForm.dataEndDate.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料起訖日期皆符合規範
        if (validateDataDate && !ValidationUtil.isEmpty(this.dailyReportSearchForm.dataStartString) && !ValidationUtil.isEmpty(this.dailyReportSearchForm.dataEndString)) {
            this.validateDueContactStartAndEndDate(null, this.dailyReportSearchForm.dataPickerStartDate, this.dailyReportSearchForm.dataPickerEndDate, this.dailyReportSearchForm.dataStartString,
                this.dailyReportSearchForm.dataEndString, this.isDataStartDateVisible, this.isDataEndDateVisible, () => {
                    if (this.dailyReportSearchValidationForm.dataStartDate.feedback || this.dailyReportSearchValidationForm.dataEndDate.feedback) {
                        validate = false;
                    }
                });
        }

        return validate;
    }

    // 清除
    resetDailyReportSearchForm() {
        this.isExportDisable = true;
        this.dailyReportSearchForm = {
            departmentIdList: [this.defaultDeptId],
            divisionIdList: [],
            tmrIdList: [],
            dataStartDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day"),
            dataPickerStartDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day").toDate(),
            dataEndDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day"),
            dataPickerEndDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)).startOf("day").toDate(),
            dataStartString: MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)),
            dataEndString: MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - 1)),
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.onSelectDept();
    }

    // 匯出
    exportSearchResult() {
        if (!this.isExportDisable) {
            if (this.grid.data.length == 0) {
                ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出
            } else {
                LoadingUtil.show();

                this.$dailyReportApi.exportDailyReportUsingPOST(this.dailyReportInput, { responseType: 'blob' })
                    .then((resp) => {
                        this.dealDownLoadData(resp.data, this.$t('dailyReportPage_exportFileName').toString()); //日報表.xlsx
                        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
                    }).catch((err) => {
                        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        }

    }

    //處理後端回傳的下載內容
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

    // 換頁
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
    }

    /**
     * 選擇部門時，科別範圍限縮
     */
    onSelectDept() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";

        this.selectDiviOptions = [];
        this.selectTmrOptions = [];

        if (this.dailyReportSearchForm.departmentIdList.length > 0) {

            this.dailyReportSearchForm.departmentIdList.forEach((depId) => {

                // 取得部門對應的科別
                if (!ValidationUtil.isEmpty(this.depUnitInfo[depId])) {
                    this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
                }

                // 取得部門對應人員
                if (!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
                }

            });

        } else {
            // 科別 下拉
            this.selectDiviOptions = Object.assign(this.allDivList);

            // 電訪員 下拉
            this.selectTmrOptions = Object.assign(this.allUserList);

        }

        //重置科別選項
        let unitIdTempList = Object.assign(this.dailyReportSearchForm.divisionIdList);
        unitIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if (!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)) {
                if (this.dailyReportSearchForm.divisionIdList.length > 0) {
                    this.dailyReportSearchForm.divisionIdList = this.dailyReportSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });

        //重置電訪員選項
        let userIdTempList = Object.assign(this.dailyReportSearchForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.dailyReportSearchForm.tmrIdList.length > 0) {
                    this.dailyReportSearchForm.tmrIdList = this.dailyReportSearchForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });

        //連動科別異動
        this.onSeletDivi();
        this.validateDepartmentIdList(null, this.dailyReportSearchForm.departmentIdList, () => { });
    }


    /**
     * 選擇科別時，電訪員範圍限縮
     */
    onSeletDivi() {
        this.overMaxRowCountMessage = "";
        this.isExportDisable = true;
        this.selectTmrOptions = [];

        // 有選擇科別
        if (this.dailyReportSearchForm.divisionIdList.length > 0) {


            // 取得科別對應人員
            this.dailyReportSearchForm.divisionIdList.forEach((unitId) => {
                if (!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
                }
            });

        } else {

            // 有選擇部門
            if (this.dailyReportSearchForm.departmentIdList.length > 0) {

                this.dailyReportSearchForm.departmentIdList.forEach((depId) => {

                    // 取得部門對應人員
                    if (!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
                        this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
                    }

                });

            } else {
                // 電訪員 下拉
                this.selectTmrOptions = Object.assign(this.allUserList);
            }
        }

        //重置電訪員選項
        let userIdTempList = Object.assign(this.dailyReportSearchForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.dailyReportSearchForm.tmrIdList.length > 0) {
                    this.dailyReportSearchForm.tmrIdList = this.dailyReportSearchForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });

    }

    // 下拉選單選項異動
    onSelectionChange() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
    }

    //===========================資料日期 相關方法 start ==========================================
    //自動轉為字串更新搜尋條件
    onDueContractStartChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.dailyReportSearchForm.dataStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.dailyReportSearchForm.dataStartDate = date;
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        this.validateSearch();
    }

    //自動轉為字串更新搜尋條件
    onDueContractEndChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.dailyReportSearchForm.dataEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.dailyReportSearchForm.dataEndDate = date;
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        this.validateSearch();
    }

    //清除日期
    clearDataDate(cleanType: String) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        if (cleanType === DatePickerTypeEnum.StartDate) {
            this.dailyReportSearchForm.dataStartString = "";
            this.dailyReportSearchForm.dataStartDate = null;
            if (!ValidationUtil.isEmpty(this.dailyReportSearchForm.dataEndDate)) {
                this.isDataStartDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, true, this.$t('telTimeReportPage_dataStartDateRequired').toString(), false); //資料日期(起) 必填
            }
        } else if (cleanType === DatePickerTypeEnum.EndDate) {
            this.dailyReportSearchForm.dataEndString = "";
            this.dailyReportSearchForm.dataEndDate = null;
            if (!ValidationUtil.isEmpty(this.dailyReportSearchForm.dataStartDate)) {
                this.isDataEndDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, true, this.$t('telTimeReportPage_dataEndDateRequired').toString(), false); //資料日期(訖) 必填
            }
        }
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDataStartDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
            this.dailyReportSearchForm.dataPickerStartDate = parseDate;
        } else {
            this.isDataStartDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, true, this.$t('global_dateError').toString(), false);
        }
        this.dailyReportSearchForm.dataStartDate = parseDate ? parseDate : this.dailyReportSearchForm.dataStartDate;
        this.dailyReportSearchForm.dataStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.dailyReportSearchForm.dataStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDataEndDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
            this.dailyReportSearchForm.dataPickerEndDate = parseDate;
        } else {
            this.isDataEndDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, true, this.$t('global_dateError').toString(), false);
        }
        this.dailyReportSearchForm.dataEndDate = parseDate ? parseDate : this.dailyReportSearchForm.dataEndDate;
        this.dailyReportSearchForm.dataStartDate = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.dailyReportSearchForm.dataEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    //日期選擇器 當日及當日之後不可選擇
    disabledDate(value) {
        const rangeEnd = moment().add(-1, 'days').endOf('days');
        if (!value || !rangeEnd) {
            return false;
        }
        return (value.valueOf() > rangeEnd.valueOf());
    }

    //===========================應電訪日起訖 相關方法 end ==========================================


    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //部門 驗證
    validateDepartmentIdList(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.departmentIdList, false, "", false);
        if (!ValidationUtil.isEmpty(value)) {
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.departmentIdList, false, "", false);
        } else {
            // 部門 必填
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.departmentIdList, true, this.$t('pendingCaseManagement_departmentNameRequied').toString(), false);
            callback(() => { });
        }
        callback();
    }

    /**
    * 資料日期格式驗證(起)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateDataStartDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
                callback();
            } else {
                this.isDataStartDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        } else if (!ValidationUtil.isEmpty(this.dailyReportSearchForm.dataEndDate)) {
            this.isDataStartDateVisible = true;
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, true, this.$t('telTimeReportPage_dataStartDateRequired').toString(), false); //資料日期(起) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 資料日期格式驗證(訖)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateDataEndDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
                callback();
            } else {
                this.isDataEndDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        } else if (!ValidationUtil.isEmpty(this.dailyReportSearchForm.dataStartDate)) {
            this.isDataEndDateVisible = true;
            CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, true, this.$t('telTimeReportPage_dataEndDateRequired').toString(), false); //資料日期(訖) 必填
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
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            var isOver31Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 31);
            if (!isOver31Days) {
                dateDisableStart = false;
                dateDisableEnd = false;
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, false, '', false);
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, false, '', false);
                callback();
            } else {
                dateDisableStart = true;
                dateDisableEnd = true;
                if (!ValidationUtil.isEmpty(this.dailyReportSearchForm.dataStartString) && !ValidationUtil.isEmpty(this.dailyReportSearchForm.dataEndString)) {
                    CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                    CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                }
                callback(() => { });
            }
        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.dailyReportSearchForm.dataStartString) && !ValidationUtil.isEmpty(this.dailyReportSearchForm.dataEndString)) {
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataStartDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.dailyReportSearchValidationForm.dataEndDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
            }
            callback(() => { });
        }
        callback();
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
    }

    //========================共用驗證相關物件開始===================================

    // 取得驗證參數
    callCommonUtilFeild(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValid(fv);
    }

    // 變更hover hoverVisivle參數
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    //========================共用驗證相關物件結束===================================
}