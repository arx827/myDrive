import { Vue, Component } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { Option, TelTimeResultGrid, TelTimeResultInput } from "@fubonlife/obd-api-axios-sdk";
import { FblFilters } from "@/components/shared/filter-builder/models";
import { TelTimeReportSearchForm, FeildValidation, TelTimeReportSearchValidateForm, DatePickerEnum, DatePickerTypeEnum } from "./model";
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

export default class TelTimeReportPage extends Vue {

    //宣告日期變數
    date = new Date();

    //日期選擇器hover是否顯示
    isDataStartDateVisible: boolean = false;
    isDataEndDateVisible: boolean = false;

    //上方查詢條件
    telTimeReportSearchForm: TelTimeReportSearchForm = {
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

    //上方查詢條件過濾
    telTimeReportSearchFilters: FblFilters = {
        filters: []
    }
    telTimeResultInput: TelTimeResultInput = {
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
    telTimeReportSearchValidationForm: TelTimeReportSearchValidateForm = {
        departmentIdList: { feedback: false, hoverVisible: false },
        divisionIdList: { feedback: false, hoverVisible: false },
        tmrIdList: { feedback: false, hoverVisible: false },
        dataStartDate: { feedback: false, hoverVisible: false },
        dataEndDate: { feedback: false, hoverVisible: false },
    }

    // 搜尋欄位驗證方式
    telTimeReportSearchRules: { [key: string]: ValidationRule[] } = {
        departmentIdList: [{ validator: this.validateDepartmentIdList, trigger: "blur" }],
        dataStartDate: [{ validator: this.validateDataStartDate, trigger: "blur" }],
        dataEndDate: [{ validator: this.validateDataEndDate, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<TelTimeResultGrid> = {
        rowKey: "userId",
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
                property: "depName",
                title: this.$t('global_department').toString(), //部門
                width: 140,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "divName",
                title: this.$t('global_division').toString(), //科別
                width: 140,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "userName",
                title: this.$t('global_telemarketer').toString(), //電訪員
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseCount",
                title: this.$t('telTimeReportPage_caseCount').toString(), //已取件數(A)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "afterCallTimeTotal",
                title: this.$t('telTimeReportPage_afterCallTimeTotal').toString(), //話後總分鐘數(B)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "dailTime",
                title: this.$t('telTimeReportPage_dailTime').toString(), //撥號總分鐘數(C)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "callTime",
                title: this.$t('telTimeReportPage_callTime').toString(), //通話總分鐘數(D)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "workTime",
                title: this.$t('telTimeReportPage_workTime').toString(), //作業總分鐘數(E)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "afterCallTimeAvg",
                title: this.$t('telTimeReportPage_afterCallTimeAvg').toString(), //平均話後分鐘數=(B)/(A)
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "dailTimeAvg",
                title: this.$t('telTimeReportPage_dailTimeAvg').toString(), //平均撥號分鐘數=(C)/(A)
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "callTimeAvg",
                title: this.$t('telTimeReportPage_callTimeAvg').toString(), //平均通話分鐘數=(D)/(A)
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "workTimeAvg",
                title: this.$t('telTimeReportPage_workTimeAvg').toString(), //平均作業分鐘數=(E)/(A)
                align: 'center',
                width: 200,
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
                    this.telTimeReportSearchForm.departmentIdList.push(this.defaultDeptId);

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

                    this.teleResultSearch();
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

            this.$telTimeReportApi.paginateTelTimeResultUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                this.telTimeResultInput
            ).then((resp) => {

                if (resp.data != null && resp.data.success) {
                    const p = { ...this.grid.pagination };
                    p.total = parseInt(resp.data.telTimeResultGrids.totalElements);
                    this.grid.data = resp.data.telTimeResultGrids.content;
                    this.grid.pagination = p;
                    if (p.total == 0) {
                        MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                    }
                } else {
                    // 通話時數統計查詢失敗
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
                })

            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.searchFlag = true;
                LoadingUtil.close();
            })
        }
    }

    teleResultSearch() {
        if (this.validateSearch()) {
            this.isExportDisable = false;
            this.grid.pagination.current = 1;
            const emptyList = [];
            this.telTimeResultInput.departmentIdList = (this.telTimeReportSearchForm.departmentIdList.length == 0) ? emptyList : this.telTimeReportSearchForm.departmentIdList;
            this.telTimeResultInput.divisionIdList = (this.telTimeReportSearchForm.divisionIdList.length == 0) ? emptyList : this.telTimeReportSearchForm.divisionIdList;
            this.telTimeResultInput.tmrIdList = (this.telTimeReportSearchForm.tmrIdList.length == 0) ? emptyList : this.telTimeReportSearchForm.tmrIdList;
            this.telTimeResultInput.dataStartDate = MomentUtil.default(this.telTimeReportSearchForm.dataPickerStartDate);
            this.telTimeResultInput.dataEndDate = MomentUtil.default(this.telTimeReportSearchForm.dataPickerEndDate);

            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch() {
        let validate = true;
        let validateDataDate = true;

        // 部門
        this.validateDepartmentIdList(null, this.telTimeReportSearchForm.departmentIdList, () => {
            if (this.telTimeReportSearchValidationForm.departmentIdList.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料日期(起)
        this.validateDataStartDate(null, this.telTimeReportSearchForm.dataStartString, () => {
            if (this.telTimeReportSearchValidationForm.dataStartDate.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料日期(訖)
        this.validateDataStartDate(null, this.telTimeReportSearchForm.dataEndString, () => {
            if (this.telTimeReportSearchValidationForm.dataEndDate.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料起訖日期皆符合規範
        if (validateDataDate && !ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataStartString) && !ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataEndString)) {
            this.validateDueContactStartAndEndDate(null, this.telTimeReportSearchForm.dataPickerStartDate, this.telTimeReportSearchForm.dataPickerEndDate, this.telTimeReportSearchForm.dataStartString,
                this.telTimeReportSearchForm.dataEndString, this.isDataStartDateVisible, this.isDataEndDateVisible, () => {
                    if (this.telTimeReportSearchValidationForm.dataStartDate.feedback || this.telTimeReportSearchValidationForm.dataEndDate.feedback) {
                        validate = false;
                    }
                });
        }

        return validate;
    }

    // 清除
    resetTeleResultSearchForm() {
        this.isExportDisable = true;
        this.telTimeReportSearchForm = {
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

                this.$telTimeReportApi.exportTelTimeResultUsingPOST(this.telTimeResultInput, { responseType: 'blob' })
                    .then((resp) => {
                        this.dealDownLoadData(resp.data, this.$t('telTimeReportPage_exportFileName').toString()); //通話時數統計資料.xlsx
                        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
                    }).catch((err) => {
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

        if (this.telTimeReportSearchForm.departmentIdList.length > 0) {

            this.telTimeReportSearchForm.departmentIdList.forEach((depId) => {

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
        let unitIdTempList = Object.assign(this.telTimeReportSearchForm.divisionIdList);
        unitIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if (!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)) {
                if (this.telTimeReportSearchForm.divisionIdList.length > 0) {
                    this.telTimeReportSearchForm.divisionIdList = this.telTimeReportSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });

        //重置電訪員選項
        let userIdTempList = Object.assign(this.telTimeReportSearchForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.telTimeReportSearchForm.tmrIdList.length > 0) {
                    this.telTimeReportSearchForm.tmrIdList = this.telTimeReportSearchForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });

        //連動科別異動
        this.onSeletDivi();
        this.validateDepartmentIdList(null, this.telTimeReportSearchForm.departmentIdList, () => { });
    }


    /**
     * 選擇科別時，電訪員範圍限縮
     */
    onSeletDivi() {
        this.overMaxRowCountMessage = "";
        this.isExportDisable = true;
        this.selectTmrOptions = [];

        // 有選擇科別
        if (this.telTimeReportSearchForm.divisionIdList.length > 0) {

            
            // 取得科別對應人員
            this.telTimeReportSearchForm.divisionIdList.forEach((unitId) => {
                if (!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
                }
            });
            
        } else {
            
            // 有選擇部門
            if (this.telTimeReportSearchForm.departmentIdList.length > 0) {

                this.telTimeReportSearchForm.departmentIdList.forEach((depId) => {

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
        let userIdTempList = Object.assign(this.telTimeReportSearchForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.telTimeReportSearchForm.tmrIdList.length > 0) {
                    this.telTimeReportSearchForm.tmrIdList = this.telTimeReportSearchForm.tmrIdList.filter(userId => userId != eachSelected);
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
        this.telTimeReportSearchForm.dataStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.telTimeReportSearchForm.dataStartDate = date;
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        this.validateSearch();
    }

    //自動轉為字串更新搜尋條件
    onDueContractEndChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.telTimeReportSearchForm.dataEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.telTimeReportSearchForm.dataEndDate = date;
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        this.validateSearch();
    }

    //清除日期
    clearDataDate(cleanType: String) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        if (cleanType === DatePickerTypeEnum.StartDate) {
            this.telTimeReportSearchForm.dataStartString = "";
            this.telTimeReportSearchForm.dataStartDate = null;
            if (!ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataEndDate)) {
                this.isDataStartDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, true, this.$t('telTimeReportPage_dataStartDateRequired').toString(), false); //資料日期(起) 必填
            }
        } else if (cleanType === DatePickerTypeEnum.EndDate) {
            this.telTimeReportSearchForm.dataEndString = "";
            this.telTimeReportSearchForm.dataEndDate = null;
            if (!ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataStartDate)) {
                this.isDataEndDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, true, this.$t('telTimeReportPage_dataEndDateRequired').toString(), false); //資料日期(訖) 必填
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
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
            this.telTimeReportSearchForm.dataPickerStartDate = parseDate;
        } else {
            this.isDataStartDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, true, this.$t('global_dateError').toString(), false);
        }
        this.telTimeReportSearchForm.dataStartDate = parseDate ? parseDate : this.telTimeReportSearchForm.dataStartDate;
        this.telTimeReportSearchForm.dataStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.telTimeReportSearchForm.dataStartDate.toString()))) :
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
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
            this.telTimeReportSearchForm.dataPickerEndDate = parseDate;
        } else {
            this.isDataEndDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, true, this.$t('global_dateError').toString(), false);
        }
        this.telTimeReportSearchForm.dataEndDate = parseDate ? parseDate : this.telTimeReportSearchForm.dataEndDate;
        this.telTimeReportSearchForm.dataStartDate = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.telTimeReportSearchForm.dataEndDate.toString()))) :
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
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.departmentIdList, false, "", false);
        if (!ValidationUtil.isEmpty(value)) {
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.departmentIdList, false, "", false);
        } else {
            // 部門 必填
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.departmentIdList, true, this.$t('pendingCaseManagement_departmentNameRequied').toString(), false);
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
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
                callback();
            } else {
                this.isDataStartDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        } else if (!ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataEndDate)) {
            this.isDataStartDateVisible = true;
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, true, this.$t('telTimeReportPage_dataStartDateRequired').toString(), false); //資料日期(起) 必填
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
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
                callback();
            } else {
                this.isDataEndDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        } else if (!ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataStartDate)) {
            this.isDataEndDateVisible = true;
            CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, true, this.$t('telTimeReportPage_dataEndDateRequired').toString(), false); //資料日期(訖) 必填
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
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            var isOver31Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 31);
            if (!isOver31Days) {
                dateDisableStart = false;
                dateDisableEnd = false;
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, false, '', false);
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, false, '', false);
                callback();
            } else {
                dateDisableStart = true;
                dateDisableEnd = true;
                if (!ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataStartString) && !ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataEndString)) {
                    CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                    CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                }
                callback(() => { });
            }
        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataStartString) && !ValidationUtil.isEmpty(this.telTimeReportSearchForm.dataEndString)) {
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataStartDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.telTimeReportSearchValidationForm.dataEndDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
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