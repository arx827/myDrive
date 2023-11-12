import { Vue, Component } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { CaseEstimatedReportDto, LoadUserDiviDto,CalendarTableWithBoolean, } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { LoginModule } from "@/plugins/store/LoginModule"
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import {
    FblColumnType,
    FblPDataGridHolder,
    
} from "@/components/shared/data-grid/models";
import moment from "moment";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";

@Component({ components:{HiddenFolde
,FblDataGrid
}
})
export default class CaseEstimateReportPage extends Vue {
    // 為vue-datepicker套件所自製的formatter
    formatter = this.$twDateFormatter;
    //科別與部門對應關係
    diviToDeptMap = new Map<string, string>();
    //====================上方搜尋相關===================="
    systemDate = new Date();
    //上方搜尋欄位起始資料
    estimatedCaseReportSearchForm = {
        globalEstimatedDate: moment(new Date(this.systemDate.getFullYear(),this.systemDate.getMonth(),this.systemDate.getDate()+1)),
        estimatedDateString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.systemDate.getFullYear(),this.systemDate.getMonth(),this.systemDate.getDate()+1))),
    }

    //搜尋後的時間字串
    afterSearchEstimatedDateString: string;



    /**
    * 將datePicker傳入的data:moment轉為input需要顯示得民國yyy-MM-dd模式
    */
    onEstimatedDateChange(date) {
        this.estimatedCaseReportSearchForm.estimatedDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date));
        this.validateCasesEstimatedDate(null, this.estimatedCaseReportSearchForm.estimatedDateString, () => { });
       
    }

    /**
    * 重新計算方法
    */
    reCalculateEstimatedReport() {

        if (this.grid.data.length != 0) {
            //計算回撥比例(C)/(B)
            let beginValue = parseInt(this.grid.data[0].unContactCasesLastDay) / parseInt(this.grid.data[0].newCasesLastDay);
            let cBRatioresult = Math.round((beginValue) * 1000) / 1000;
            if(parseInt(this.grid.data[0].unContactCasesLastDay)==0){
                cBRatioresult=0;
            }
            //預估部門待電訪總件數 【(A)+〔(A)*(C)/(B)〕+(C)】=預估部門待電訪總件數，取整數，無條件進位。
            let A = parseInt(this.grid.data[0].averageCasesLastThreeDays);
            let mid = A * cBRatioresult;
            let C = parseInt(this.grid.data[0].unContactCasesLastDay)

            let estimatedDepartmentTotalCases = Math.ceil(A + mid + C);

            //預估個人待電訪件數=預估部門待電訪總件數/(D)，取整數，無條件進位。
            let estimatedPersonalCases = 0;
            if (parseFloat(this.grid.data[0].pendingLaborNumber) == 0) {
                estimatedPersonalCases = estimatedDepartmentTotalCases

            } else {
                let initValue = estimatedDepartmentTotalCases / parseFloat(this.grid.data[0].pendingLaborNumber);
                estimatedPersonalCases = Math.ceil(initValue);
            }

            //將上方得到的結果賦值給this.grid.data
            let tempararyValue = cBRatioresult * 100
            let cbpercentResult = tempararyValue.toFixed(1) + "%";
            this.grid.data[0].callBackRatio = cbpercentResult;
            this.grid.data[0].estimatedDepartmentTotalPendingCases = estimatedDepartmentTotalCases.toString();
            this.grid.data[0].estimatedPersonalPendingCases = estimatedPersonalCases.toString();
            this.isExportDisable=false;
        } else {
            return
        }
    }
    async created() {
        //判斷搜尋日期是否為系統日隔一天的系統日
        let judgeWorkDayAfterSystemDateROCString=MomentUtil.default(new Date(this.systemDate.getFullYear(),this.systemDate.getMonth(),this.systemDate.getDate()+1));
        let resp=await this.$calendarTableApi.isRestUsingGET(judgeWorkDayAfterSystemDateROCString.trim(),'C')
        let returnDate;
        while(resp.data){
            let judgeDay=new Date(judgeWorkDayAfterSystemDateROCString);
            returnDate=new Date(judgeDay.getFullYear(),judgeDay.getMonth(),judgeDay.getDate()+1);
            judgeWorkDayAfterSystemDateROCString=MomentUtil.default(returnDate);
            let resp=await this.$calendarTableApi.isRestUsingGET(judgeWorkDayAfterSystemDateROCString.trim(),'C')
            if(!resp.data){
                let finalWorkDayAfterSystemDate=new Date(judgeWorkDayAfterSystemDateROCString);
                // this.estimatedCaseReportSearchForm.globalEstimatedDate=moment(finalWorkDayAfterSystemDate.getFullYear(),finalWorkDayAfterSystemDate.getMonth(),finalWorkDayAfterSystemDate.getDate());
                this.estimatedCaseReportSearchForm.estimatedDateString=MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(finalWorkDayAfterSystemDate.getFullYear(),finalWorkDayAfterSystemDate.getMonth(),finalWorkDayAfterSystemDate.getDate())));
                break;
            }
        }
        //取得科別和部門對應的map
        await this.$userApi.findUniqueUnitIdUsingGET().then((res: AxiosResponse<LoadUserDiviDto>) => {
            this.diviToDeptMap = new Map(Object.entries(res.data.diviToDeptMap));
        })
        this.onEstimatedReportSearch();
    }

    /**
    * 按下搜尋時需驗證欄成功才賦值
    */
    onEstimatedReportSearch() {
        //將民國年轉為西元年，為yyyy-MM-dd格式為後端需要的pattern
        this.isExportDisable = false;
        this.validateCasesEstimatedDate(null, this.estimatedCaseReportSearchForm.estimatedDateString, () => { });
        const validateDateBoolean = this.casesEstimatedValidateForm.casesEstimatedDate.state == "success" ? true : false;
        if (validateDateBoolean) {
            this.isExportDisable = false;
            this.afterSearchEstimatedDateString = MomentUtil.transformRocYearMonthDay(this.estimatedCaseReportSearchForm.estimatedDateString);
            this.reload();
        } else {
            return
        }
    }
    //控制不重複搜尋的flag
    searchFlag: boolean = true;
    /**
    * 重新讀取
    */
    async reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();
            //取得登入者的部門id
            // let userDepartmentId = this.diviToDeptMap.get(LoginModule.loginState.me.employee.departmentId);
            let userDepartmentId = LoginModule.loginState.me.employee.unitIdLevel3;

            await this.$casesEstimatedReportApi.getEstimatedReportUsingGET(userDepartmentId, this.afterSearchEstimatedDateString)
                .then(resp => {
                    this.grid.data = [];
                    let addData:CaseEstimatedReportDto=resp.data;
                    this.grid.data.push(addData);
                    this.reCalculateEstimatedReport()
                }).catch(error => {
                    ErrorModalUtil.modalError(this.$t('estimatedCasesReport_failed').toString()
                    );
                }).finally(() => {
                    this.searchFlag = true;
                    LoadingUtil.close();
                });
        }
    }

    /**
    * 清除案件預估報表
    */
    resetEstimatedReportSearch() {
        this.isExportDisable = true;
        this.estimatedCaseReportSearchForm.estimatedDateString = "";
        this.grid.data = [];
    }

    // ========================FBLDATEDRID相關呈現搜尋結果start=======================//

    /**
    * 當輸入框改變時改變當前table內的資料
    */
    onInputNumberChange(number, col) {

        if (col == "averageCasesLastThreeDays") {
            this.grid.data[0].averageCasesLastThreeDays = number;
        }

        if (col == "newCasesLastDay") {
            this.grid.data[0].newCasesLastDay = number;
        }

        if (col == "unContactCasesLastDay") {
            this.grid.data[0].unContactCasesLastDay = number;
        }
    }

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<CaseEstimatedReportDto> = {
        rowKey: "key",
        data: [],
        pagination: null,
        columns: [
            {
                type: FblColumnType.INPUTNUMBER,
                property: "averageCasesLastThreeDays",
                title: this.$t('average_cases_last_threeDays').toString()
                ,//前三工作日新件平均數(A)
                align: "center"
            },
            {
                type: FblColumnType.INPUTNUMBER,
                property: "newCasesLastDay",
                title: this.$t('new_case_lastDay').toString()
                ,//前一工作日新件件數(B)
                align: "center"

            }, {
                type: FblColumnType.INPUTNUMBER,
                property: "unContactCasesLastDay",
                title: this.$t('unReachable_lastDay').toString()
                ,//前一工作日聯絡不上件數(C)
                align: "center"
            },
            {
                type: FblColumnType.PLAIN,
                property: "callBackRatio",
                title: this.$t('callback_ratio(C/B)').toString()
                ,//回撥比例=(C)/(B)
                align: "center"

            },
            {
                type: FblColumnType.PLAIN,
                property: "pendingLaborNumber",
                title: this.$t('labor_on_Duty').toString()
                ,//應電訪當日人力數(D)
                align: "center"

            },
            {
                type: FblColumnType.PLAIN,
                property: "estimatedDepartmentTotalPendingCases",
                title: this.$t('estimatedDepartment_total_Cases').toString()
                ,//預估部門待電訪總件數
                align: "center"

            },
            {
                type: FblColumnType.PLAIN,
                property: "estimatedPersonalPendingCases",
                title: this.$t('estimatedPersonal_cases').toString()
                ,//預計個人待電訪件數
                align: "center"

            },
        ]
    };

    // ========================FBLDATEDRID相關end=======================//

    // ========================匯出export section start=======================//
    isExportDisable: boolean = false;

    /**
    * 匯出案件預估報表
    */
    exportCasesEstimatedReport() {
        if (this.isExportDisable) {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        } else if (this.grid.data.length == 0) {
            ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
        } else {
            LoadingUtil.show();

            this.$casesEstimatedReportApi.excelUserSkillUsingPOST(this.grid.data[0], { responseType: 'blob' })
                .then((res) => {
                    this.dealDownLoadData(res.data, "案件預估報表匯出.xlsx");
                    LoadingUtil.close();
                    MessageUtil.messageSuccess(this.$t("global_exportSuccess").toString()) //匯出成功
                })
                .catch((err) => {
                    ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                })
                .finally(() => {
                    LoadingUtil.close();
                });

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



    // ========================匯出export section end=======================//

    //===========================驗證篇 validate start====================================//

    casesEstimatedValidateForm = {
        casesEstimatedDate: {
            feedback: false,
            state: "",
            hover: "",
            content: "",
        }
    }

    validateCasesEstimatedDate(rule, value, callback) {
        this.casesEstimatedValidateForm.casesEstimatedDate.hover = "";
        if (value != null && value != "") {
            this.casesEstimatedValidateForm.casesEstimatedDate.state = "success";
            this.casesEstimatedValidateForm.casesEstimatedDate.feedback = false;
            callback();
        } else {
            this.casesEstimatedValidateForm.casesEstimatedDate.feedback = true;
            this.casesEstimatedValidateForm.casesEstimatedDate.hover = "hover";
            this.casesEstimatedValidateForm.casesEstimatedDate.state = "error";
            this.casesEstimatedValidateForm.casesEstimatedDate.content = this.$t('casesEstimated_date_not_blank').toString();//案件預估日必填
            callback(false);
        }

    }
    isCasesEstimatedDateVisible: boolean = false;

    estimatedDateMouseOver(value) {
        if (this.casesEstimatedValidateForm.casesEstimatedDate.state == "error") {
            this.isCasesEstimatedDateVisible = true;
        } else {
            this.isCasesEstimatedDateVisible = false;
        }
    }
    //===========================驗證篇 validate end====================================//
}