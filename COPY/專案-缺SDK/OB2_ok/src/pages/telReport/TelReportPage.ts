import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder
} from "@/components/shared/data-grid/models";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { FblFilters } from "@/components/shared/filter-builder/models";
import TelChangeDetail from '@/components/shared/form/telChangeDetail/TelChangeDetail.vue';
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { Option, TelReportDto, TelReportSearchDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";
import { DatePickerTypeEnum, FeildValidation, TelReportPageSearchForm, TelReportPageSearchValidateForm } from "./model";

@Component({
    components: { FblDataGrid, HiddenFolde, DragModal, TelChangeDetail }
})

export default class TelReportPage extends Vue {

    //宣告日期變數
    date = new Date();

    //日期選擇器hover是否顯示
    isDataStartDateVisible: boolean = false;
    isDataEndDateVisible: boolean = false;

    //上方查詢條件
    telReportPageSearchForm: TelReportPageSearchForm = {
        departmentIdList: [],
        divisionIdList: [],
        userIdList: [],
        startDate: moment(new Date()).startOf("day"),
        telChangePickerStartDate: moment(new Date()).startOf("day").toDate(),
        endDate: moment(new Date()).startOf("day"),
        telChangePickerEndDate: moment(new Date()).startOf("day").toDate(),
        telChangeStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
        telChangeEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
    };

    //上方查詢條件過濾
    telReportPageSearchFilters: FblFilters = {
        filters: []
    }
    telReportInput: TelReportSearchDto = {
        page: 0,
        size: 0,
        departmentIdList: [],
        divisionIdList: [],
        userIdList: [],
        startDate: '',
        endDate: '',
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
    telReportPageSearchValidationForm: TelReportPageSearchValidateForm = {
        departmentIdList: { feedback: false, hoverVisible: false },
        divisionIdList: { feedback: false, hoverVisible: false },
        userIdList: { feedback: false, hoverVisible: false },
        startDate: { feedback: false, hoverVisible: false },
        endDate: { feedback: false, hoverVisible: false },
    }

    // 搜尋欄位驗證方式
    telReportPageSearchRules: { [key: string]: ValidationRule[] } = {
        departmentIdList: [{ validator: this.validateDepartmentIdList, trigger: "blur" }],
        startDate: [{ validator: this.validateStartDate, trigger: "blur" }],
        endDate: [{ validator: this.validateEndDate, trigger: "blur" }],
    };

    // 是否顯示電話變更明細
    telChangeDetailVisible: boolean = false;

    // 開啟電話明細所需資料
    telChangeDetailInfo: { depName?: String, divName?: String, tmrId?: String, tmrName?: String, startDate?: String, endDate?: String, dueContactCount?: number } = {
        depName: '',
        divName: '',
        tmrId: '',
        tmrName: '',
        startDate: '',
        endDate: '',
        dueContactCount: 0,
    }

    // data grid Setting
    grid: FblPDataGridHolder<TelReportDto> = {
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
                property: "superUnitName",
                title: this.$t('global_department').toString(), // 部門
                width: 140,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "unitName",
                title: this.$t('global_division').toString(), // 科別
                width: 140,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "userName",
                title: this.$t('global_telemarketer').toString(), // 電訪員
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "pendingCase",
                title: this.$t('telReportPage_pendingCase').toString(), // 待電訪(A)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseCount",
                title: this.$t('telReportPage_caseCount').toString(), // 已取件數(B)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseCountTimes",
                title: this.$t('telReportPage_caseCountTimes').toString(), // 已取件次數
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "onTimeCase",
                title: this.$t('telReportPage_onTimeCase').toString(), // 準時結案件數(C)
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "notOnTimeCase",
                title: this.$t('telReportPage_notOnTimeCase').toString(), // 未準時結案件數(D)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "notValidCase",
                title: this.$t('telReportPage_notValidCase').toString(), // 無效件數(E)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "validCase",
                title: this.$t('telReportPage_validCase').toString(), // 有效件數(F)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "finishCase",
                title: this.$t('telReportPage_finishCase').toString(), // 完成電訪件數(G)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "notFinishCase",
                title: this.$t('telReportPage_notFinishCase').toString(), // 未完成電訪件數(H)
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "notConnection",
                title: this.$t('telReportPage_notConnection').toString(), // 聯絡不上件數(I)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "pickupRate",
                title: this.$t('telReportPage_pickupRate').toString(), // 取件率=(B)/(A)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "onTimeRate",
                title: this.$t('telReportPage_onTimeRate').toString(), // 電訪準時結案率=C/(C+D)
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactRate",
                title: this.$t('telReportPage_contactRate').toString(), // 電訪聯絡率=(G+H)/F
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "successRate",
                title: this.$t('telReportPage_successRate').toString(), // 電訪成功率=(G)/(F)
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
                    this.telReportPageSearchForm.departmentIdList.push(this.defaultDeptId);

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
                    this.teleChangeSearch();
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
            this.telReportInput.page = this.grid.pagination.current - 1;
            this.telReportInput.size = this.grid.pagination.pageSize;
            this.$telReportPageApi.paginateTelReportDataUsingPOST(this.telReportInput)
                .then((resp) => {
                    if (resp.data != null) {
                        const p = { ...this.grid.pagination };
                        p.total = parseInt(resp.data.totalElements);
                        this.grid.data = resp.data.content;
                        this.grid.pagination = p;
                        if (p.total == 0) {
                            MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                        }
                    }
                    // else {
                    //     // 通話時數統計查詢失敗
                    //     ErrorModalUtil.modalError(this.$t(resp.data.returnMessage).toString());
                    // }

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

    teleChangeSearch() {
        if (this.validateSearch()) {
            this.isExportDisable = false;
            this.grid.pagination.current = 1;
            const emptyList = [];
            this.telReportInput.departmentIdList = (this.telReportPageSearchForm.departmentIdList.length == 0) ? emptyList : this.telReportPageSearchForm.departmentIdList;
            this.telReportInput.divisionIdList = (this.telReportPageSearchForm.divisionIdList.length == 0) ? emptyList : this.telReportPageSearchForm.divisionIdList;
            this.telReportInput.userIdList = (this.telReportPageSearchForm.userIdList.length == 0) ? emptyList : this.telReportPageSearchForm.userIdList;
            this.telReportInput.startDate = MomentUtil.default(this.telReportPageSearchForm.telChangePickerStartDate);
            this.telReportInput.endDate = MomentUtil.default(this.telReportPageSearchForm.telChangePickerEndDate);

            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch() {
        let validate = true;
        let validateDataDate = true;

        // 部門
        this.validateDepartmentIdList(null, this.telReportPageSearchForm.departmentIdList, () => {
            if (this.telReportPageSearchValidationForm.departmentIdList.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料日期(起)
        this.validateStartDate(null, this.telReportPageSearchForm.telChangeStartString, () => {
            if (this.telReportPageSearchValidationForm.startDate.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料日期(訖)
        this.validateEndDate(null, this.telReportPageSearchForm.telChangeEndString, () => {
            if (this.telReportPageSearchValidationForm.endDate.feedback) {
                validateDataDate = false;
                validate = false;
            }
        });

        // 資料起訖日期皆符合規範
        if (validateDataDate && !ValidationUtil.isEmpty(this.telReportPageSearchForm.telChangeStartString) && !ValidationUtil.isEmpty(this.telReportPageSearchForm.telChangeEndString)) {
            this.validateDueContactStartAndEndDate(null, this.telReportPageSearchForm.telChangePickerStartDate, this.telReportPageSearchForm.telChangePickerEndDate, this.telReportPageSearchForm.telChangeStartString,
                this.telReportPageSearchForm.telChangeEndString, this.isDataStartDateVisible, this.isDataEndDateVisible, () => {
                    if (this.telReportPageSearchValidationForm.startDate.feedback || this.telReportPageSearchValidationForm.endDate.feedback) {
                        validate = false;
                    }
                });
        }

        return validate;
    }

    // 清除
    resetTeleChangeSearchForm() {
        this.isExportDisable = true;
        this.telReportPageSearchForm = {
            departmentIdList: [this.defaultDeptId],
            divisionIdList: [],
            userIdList: [],
            startDate: moment(new Date()).startOf("day"),
            telChangePickerStartDate: moment(new Date()).startOf("day").toDate(),
            endDate: moment(new Date()).startOf("day"),
            telChangePickerEndDate: moment(new Date()).startOf("day").toDate(),
            telChangeStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            telChangeEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
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

                this.$telReportPageApi.exportTelReportDataUsingPOST(this.telReportInput, { responseType: 'blob' })
                    .then((resp) => {
                        this.dealDownLoadData(resp.data, this.$t('telReportPage_exportExcelFile').toString()); // 取件和電訪結果統計表.xlsx
                        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); // 匯出成功
                    }).catch((err) => {
                        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); // 匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            if (ValidationUtil.isEmpty(this.overMaxRowCountMessage)) {
                ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); // 請先執行查詢再匯出
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

        if (this.telReportPageSearchForm.departmentIdList.length > 0) {

            this.telReportPageSearchForm.departmentIdList.forEach((depId) => {

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
        let unitIdTempList = Object.assign(this.telReportPageSearchForm.divisionIdList);
        unitIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if (!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)) {
                if (this.telReportPageSearchForm.divisionIdList.length > 0) {
                    this.telReportPageSearchForm.divisionIdList = this.telReportPageSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });

        //重置電訪員選項
        let userIdTempList = Object.assign(this.telReportPageSearchForm.userIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.telReportPageSearchForm.userIdList.length > 0) {
                    this.telReportPageSearchForm.userIdList = this.telReportPageSearchForm.userIdList.filter(userId => userId != eachSelected);
                }
            }
        });

        //連動科別異動
        this.onSeletDivi();
        this.validateDepartmentIdList(null, this.telReportPageSearchForm.departmentIdList, () => { });
    }


    /**
     * 選擇科別時，電訪員範圍限縮
     */
    onSeletDivi() {
        this.overMaxRowCountMessage = "";
        this.isExportDisable = true;
        this.selectTmrOptions = [];

        // 有選擇科別
        if (this.telReportPageSearchForm.divisionIdList.length > 0) {


            // 取得科別對應人員
            this.telReportPageSearchForm.divisionIdList.forEach((unitId) => {
                if (!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
                }
            });

        } else {

            // 有選擇部門
            if (this.telReportPageSearchForm.departmentIdList.length > 0) {

                this.telReportPageSearchForm.departmentIdList.forEach((depId) => {

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
        let userIdTempList = Object.assign(this.telReportPageSearchForm.userIdList);
        userIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if (!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)) {
                if (this.telReportPageSearchForm.userIdList.length > 0) {
                    this.telReportPageSearchForm.userIdList = this.telReportPageSearchForm.userIdList.filter(userId => userId != eachSelected);
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
    onTelChangeStartChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.telReportPageSearchForm.telChangeStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.telReportPageSearchForm.startDate = date;
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        this.validateSearch();
    }

    //自動轉為字串更新搜尋條件
    onTelChangeEndChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.telReportPageSearchForm.telChangeEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.telReportPageSearchForm.endDate = date;
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        this.validateSearch();
    }

    //清除日期
    clearDate(cleanType: String) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        if (cleanType === DatePickerTypeEnum.StartDate) {
            this.telReportPageSearchForm.telChangeStartString = "";
            this.telReportPageSearchForm.startDate = null;
            if (!ValidationUtil.isEmpty(this.telReportPageSearchForm.endDate)) {
                this.isDataStartDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, true, this.$t('telReportPagePage_startDateRequired').toString(), false); // 資料日期(起) 必填
            }
        } else if (cleanType === DatePickerTypeEnum.EndDate) {
            this.telReportPageSearchForm.telChangeEndString = "";
            this.telReportPageSearchForm.endDate = null;
            if (!ValidationUtil.isEmpty(this.telReportPageSearchForm.startDate)) {
                this.isDataEndDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, true, this.$t('telReportPagePage_endDateRequired').toString(), false); // 資料日期(訖) 必填
            }
        }
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputStartDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
            this.telReportPageSearchForm.telChangePickerStartDate = parseDate;
        } else {
            this.isDataStartDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, true, this.$t('global_dateError').toString(), false);
        }
        this.telReportPageSearchForm.startDate = parseDate ? parseDate : this.telReportPageSearchForm.startDate;
        this.telReportPageSearchForm.telChangeStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.telReportPageSearchForm.startDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputEndDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isDataStartDateVisible = false;
        this.isDataEndDateVisible = false;
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
            this.telReportPageSearchForm.telChangePickerEndDate = parseDate;
        } else {
            this.isDataEndDateVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, true, this.$t('global_dateError').toString(), false);
        }
        this.telReportPageSearchForm.endDate = parseDate ? parseDate : this.telReportPageSearchForm.endDate;
        this.telReportPageSearchForm.startDate = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.telReportPageSearchForm.endDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    //日期選擇器 當日之後不可選擇
    disabledDate(value) {
        const rangeEnd = moment().add('days').endOf('days');
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
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.departmentIdList, false, "", false);
        if (!ValidationUtil.isEmpty(value)) {
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.departmentIdList, false, "", false);
        } else {
            // 部門 必填
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.departmentIdList, true, this.$t('pendingCaseManagement_departmentNameRequied').toString(), false);
            callback(() => { });
        }
        callback();
    }

    /**
    * 電話變更受理日期格式驗證(起)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateStartDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
                callback();
            } else {
                this.isDataStartDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        } else if (!ValidationUtil.isEmpty(this.telReportPageSearchForm.endDate)) {
            this.isDataStartDateVisible = true;
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, true, this.$t('telReportPagePage_startDateRequired').toString(), false); // 資料日期(起) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 電話變更受理日期格式驗證(訖)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEndDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
                callback();
            } else {
                this.isDataEndDateVisible = true;
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        } else if (!ValidationUtil.isEmpty(this.telReportPageSearchForm.startDate)) {
            this.isDataEndDateVisible = true;
            CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, true, this.$t('telReportPagePage_endDateRequired').toString(), false); // 資料日期(訖) 必填
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
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            var isOver31Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 31);
            if (!isOver31Days) {
                dateDisableStart = false;
                dateDisableEnd = false;
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, false, '', false);
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, false, '', false);
                callback();
            } else {
                dateDisableStart = true;
                dateDisableEnd = true;
                if (!ValidationUtil.isEmpty(this.telReportPageSearchForm.telChangeStartString) && !ValidationUtil.isEmpty(this.telReportPageSearchForm.telChangeEndString)) {
                    CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                    CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                }
                callback(() => { });
            }
        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.telReportPageSearchForm.telChangeStartString) && !ValidationUtil.isEmpty(this.telReportPageSearchForm.telChangeEndString)) {
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.startDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.telReportPageSearchValidationForm.endDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
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