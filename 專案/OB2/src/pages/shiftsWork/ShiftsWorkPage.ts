import { Vue, Component, Watch } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import moment from 'moment';
import ShiftsWorkUpdateForm from "@/components/shared/form/shiftsUpdateForm/shiftsWorkUpdateForm.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import ShiftWorkUploadForm from "@/components/shared/form/shiftWorkUploadForm/ShiftWorkUploadForm.vue"
import VlidationUtil from "@/assets/config/ValidationUtil";
import { StaffDto, ComponentDto, EmployeeDto, Option } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import { shiftsWorkModal } from "./model";
import ValidationUtil from "@/assets/config/ValidationUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { validShiftsWorkUpdateResult } from "@/components/shared/form/shiftsUpdateForm/model";
import { AuthComonent } from "@/assets/config/CommonUtil";
import { LoginModule } from "@/plugins/store/LoginModule";

@Component({
    components: {
        HiddenFolde, ShiftsWorkUpdateForm, ShiftWorkUploadForm,
    }
})
export default class ShiftsWorkPage extends Vue {

    //======================上方搜尋框物件屬性==========================

   

    //判斷是否過期
    overDate: boolean = false;

    //表單顯示控制
    shiftWorkUploadFormVisible = false;
    isSingleUpload = false;
    allowMonth = "";
    secondText = "";


    //儲存取消二次確認用的flag(是否編輯過)
    isDataEdited: boolean = false;
    //宣告日期變數
    date = new Date();
    modifiedShiftWorkCode: string = "";

    //上方班別設定搜尋的options
    shiftWorkCodeOptions = [];



    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;

    // modal驅動
    shiftsUpDateVisible: boolean = false;
    isLoading: boolean = false;
    // modal title
    titleText: string = '';
    buttonText: string = '';
    // 下拉式選單選取值(班別選擇)
    selectedItems: string[] = [];
    // modal資料 user: 員編, date: 日期, shiftDate:  班別
    shiftsDataForm = {
        id: "",
        date: "",
        userId: "",
        userName: "",
        shiftWorkCode: "",
        shiftsTime: "",
        userIndex: "",
        dataIndex: "",
        updateId: "",
        updateDate: "",
        remark: "",
        workDate: "",
        //用來判定子元件回傳值是編輯模式
        editing: true,
        isHoliday: false
    }
    // 宣告當前時間格式
    dayData = {
        year: new Date().getFullYear(),
        month: new Date().getUTCMonth(),
        date: new Date().getUTCDate(),
        date2: new Date().getDate(),
    }
    ShiftsworkSearchForm = {
        startDate: moment(new Date()),
        endDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 14)),
        startString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
        endString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 14))),
        selectMonth: null,
        departmentIdList: [], //部門
        divisionIdList: [], //科別
        tmrIdList: [], //電訪員
        shiftWorkCodes: [],
    }

    // 畫面元件
    authComponent: AuthComonent = {
        SHIFT_SEARCH_CLEAR: {
            show: false,
            enable: false
        },
        SHIFT_IMPORT: {
            show: false,
            enable: false
        },
        SHIFT_EXPORT: {
            show: false,
            enable: false
        },
        EVENT_CREATE : {
            show: false,
            enable: false
        },
    };

    //經過搜尋按鈕動作更新後 才會進入到後端的變數
    afterSearchSelectedSuperDeps = [];
    afterSearchSelectedDivi = [];
    afterSearchEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));
    afterSearchShiftWorkCodes = [];
    afterSearchStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), 1)));
    afterSearchSelectedUser = [];

    // 下方user與其班別的資料宣告
    userData = [];

    //班別的資料宣告
    shiftWorks = [];

    // 表頭內容
    columns = []


    //==================================下拉式選單 start========================

    // 部門
    selectDepOptions: Option[] = [];
    // 科別
    selectDiviOptions: Option[] = [];
    // 電訪員
    selectTmrOptions: Option[] = [];
    //使用者清單
    allUserList: Option[] = [];
    //部門對應的科別清單
    allDivList: Option[] = [];

      // 部門對應科別/人員資料(為map的形式)
      depUnitInfo = {};
      depUserInfo = {};
      // 科別對應人員資料
      unitUserInfo = {};
    // ==================================下拉式選單 end========================

    defaultDepartId:string="";
    //  ========================================初始化班表資料===============================================
    async created() {
        LoadingUtil.show();
        // 取得畫面元件權限 範例
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
            .then((res: AxiosResponse<ComponentDto>) => {
                if (res.data.component) {
                    this.authComponent.SHIFT_SEARCH_CLEAR = ValidationUtil.isEmpty(res.data.component.SHIFT_SEARCH_CLEAR) ? this.authComponent.SHIFT_SEARCH_CLEAR : res.data.component.SHIFT_SEARCH_CLEAR;
                    this.authComponent.SHIFT_IMPORT = ValidationUtil.isEmpty(res.data.component.SHIFT_IMPORT) ? this.authComponent.SHIFT_IMPORT : res.data.component.SHIFT_IMPORT;
                    this.authComponent.SHIFT_EXPORT = ValidationUtil.isEmpty(res.data.component.SHIFT_EXPORT) ? this.authComponent.SHIFT_EXPORT : res.data.component.SHIFT_EXPORT;
                    this.authComponent.EVENT_CREATE = ValidationUtil.isEmpty(res.data.component.EVENT_CREATE) ? this.authComponent.EVENT_CREATE : res.data.component.EVENT_CREATE; //REPAIR
                    console.log("ShiftsWorkPage: ", JSON.stringify(this.authComponent));
                }

            }).catch((err) => {
                console.log(err);
            });
        //初始化日期時間為當月份
        let endDate = MomentUtil.default(new Date(MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.endString)))
        let startDate = MomentUtil.default(new Date(MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.startString)));
        try {
            const resp = await this.$userShiftWorkApi.getShiftsWorkCalenderUsingGET(endDate, startDate)

            this.columns = resp.data.map(data => {
                let dateTime = new Date();
                let dateString = dateTime.setDate(dateTime.getDate() - 1);
                dateTime = new Date(dateString);
                return {
                    title: data.rocworkDate, key: data.workDate, subTitle: data.weekDay, isHoliday: data.isHoliday,
                    yesterDayDate: dateTime.getTime(), month: this.dayData.month, width: 100
                };
            });
        } catch (e) {
            console.log(e);
            LoadingUtil.close();
        }
        try {
            const resp = await this.$userShiftWorkApi.getShiftsWorkCalenderUsingGET(endDate, startDate);
            this.columns = resp.data.map(data => {
                let dateTime = new Date();
                let dateString = dateTime.setDate(dateTime.getDate() - 1);
                dateTime = new Date(dateString);
                return {
                    title: data.rocworkDate, key: data.workDate, subTitle: data.weekDay, isHoliday: data.isHoliday,
                    yesterDayDate: dateTime.getTime(), month: this.dayData.month, width: 100
                };
            });
        } catch (e) {
            console.log(e);
            LoadingUtil.close();
        }
        
        //取得部門 科別 電訪員下拉選單
        this.$userApi.getStaffListInSchedulePageUsingGET()
            .then((resp) => {

                if (resp.data != null) {
                 
                        // 部門對應科別/人員資料
                    this.depUnitInfo = resp.data.depUnitInfo;
                    this.depUserInfo = resp.data.depUserInfo;

                    // 科別對應人員資料
                    this.unitUserInfo = resp.data.unitUserInfo;
                    // 部門 下拉
                    this.selectDepOptions = Object.assign(resp.data.departOptions);
                    //預設登入者部門id
                    this.ShiftsworkSearchForm.departmentIdList.push(resp.data.defaultDepId);
                    this.defaultDepartId=resp.data.defaultDepId;
                        
                    // // 全部科別
                    this.allDivList = resp.data.unitList;
   
                    //全部電訪員
                    this.allUserList = resp.data.userList;

                     // 有預設部門需一起異動科別/人員
                    if(!ValidationUtil.isEmpty(resp.data.defaultDepId)) {
                    this.onSelectDept();
                    }
                  
                } else {
                    ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常

                }

            })
            .catch((err) => {

                ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常
            }).finally(() => {
                LoadingUtil.close();
                this.reload();
            })

        this.afterSearchSelectedDivi = (this.ShiftsworkSearchForm.divisionIdList.length == 0) ? null : this.ShiftsworkSearchForm.divisionIdList;
        this.afterSearchEndString = this.ShiftsworkSearchForm.endString ? MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.endString) : this.ShiftsworkSearchForm.endString;
        this.afterSearchShiftWorkCodes = (this.ShiftsworkSearchForm.shiftWorkCodes.length == 0) ? null : this.ShiftsworkSearchForm.shiftWorkCodes;
        this.afterSearchSelectedSuperDeps = (this.ShiftsworkSearchForm.departmentIdList.length == 0) ? null : this.ShiftsworkSearchForm.departmentIdList;
        this.afterSearchStartString = this.ShiftsworkSearchForm.startString ? MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.startString) : this.ShiftsworkSearchForm.startString,
        this.afterSearchSelectedUser = (this.ShiftsworkSearchForm.tmrIdList.length == 0) ? null : this.ShiftsworkSearchForm.tmrIdList

    }
  /**
   * 選擇部門時，科別範圍限縮
   */
 onSelectDept() {
    this.isExportDisable = true;

    this.selectDiviOptions = [];
    this.selectTmrOptions = [];
    
    if (this.ShiftsworkSearchForm.departmentIdList.length > 0) {

      this.ShiftsworkSearchForm.departmentIdList.forEach((depId) => {
        
        // 取得部門對應的科別
        if(!ValidationUtil.isEmpty(this.depUnitInfo[depId])){
          this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
        }

        // 取得部門對應人員
        if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
        }
        
      });
        
    }else{
      // 科別 下拉
      this.selectDiviOptions = Object.assign(this.allDivList);
      
      // 電訪員 下拉
      this.selectTmrOptions = Object.assign(this.allUserList);
      
    }

    //重置科別選項
    let unitIdTempList = Object.assign(this.ShiftsworkSearchForm.divisionIdList);
    unitIdTempList.forEach((eachSelected)=>{

      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
        if(this.ShiftsworkSearchForm.divisionIdList.length > 0) {
          this.ShiftsworkSearchForm.divisionIdList = this.ShiftsworkSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.ShiftsworkSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.ShiftsworkSearchForm.tmrIdList.length > 0) {
          this.ShiftsworkSearchForm.tmrIdList = this.ShiftsworkSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
    //連動科別異動
    this.onSeletDivi(); 
  }

  /**
   * 選擇科別時，電訪員範圍限縮
   */
  onSeletDivi() {
    this.isExportDisable = true;
    this.selectTmrOptions = [];


    // 有選擇科別
    if(this.ShiftsworkSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.ShiftsworkSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.ShiftsworkSearchForm.departmentIdList.length > 0) {

        this.ShiftsworkSearchForm.departmentIdList.forEach((depId) => {
  
          // 取得部門對應人員
          if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
            this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
          }
          
        });
          
      } else {
        // 電訪員 下拉
        this.selectTmrOptions = Object.assign(this.allUserList);
      }
    }

    //重置電訪員選項
    let userIdTempList = Object.assign(this.ShiftsworkSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.ShiftsworkSearchForm.tmrIdList.length > 0) {
          this.ShiftsworkSearchForm.tmrIdList = this.ShiftsworkSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }

    onSelectTmr(){
        this.isExportDisable = true;
    }



    sort: any;

    //上方搜尋按鈕的搜尋方法
    async onShiftWorkSearch() {

        //驗證成功後才會去改變其時間
        if (this.validateSubmit()) {
            let startDate = MomentUtil.default(moment(this.ShiftsworkSearchForm.startDate).toDate());
            let endDate = MomentUtil.default(moment(this.ShiftsworkSearchForm.endDate).toDate());

            try {
                const resp = await this.$userShiftWorkApi.getShiftsWorkCalenderUsingGET(endDate, startDate);

                this.dateChangeworkDateList =
                    this.columns = resp.data.map(data => {
                        let dateTime = new Date();
                        let dateString = dateTime.setDate(dateTime.getDate() - 1);
                        dateTime = new Date(dateString);
                        return {
                            title: data.rocworkDate, key: data.workDate, subTitle: data.weekDay, isHoliday: data.isHoliday,
                            yesterDayDate: dateTime.getTime(), month: this.dayData.month, width: 100
                        };
                    });
                this.afterSearchSelectedDivi = (this.ShiftsworkSearchForm.divisionIdList.length == 0) ? null : this.ShiftsworkSearchForm.divisionIdList;
                this.afterSearchEndString = this.ShiftsworkSearchForm.endString ? MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.endString) : this.ShiftsworkSearchForm.endString;
                this.afterSearchShiftWorkCodes = (this.ShiftsworkSearchForm.shiftWorkCodes.length == 0) ? null : this.ShiftsworkSearchForm.shiftWorkCodes;
                this.afterSearchSelectedSuperDeps = (this.ShiftsworkSearchForm.departmentIdList.length == 0) ? null : this.ShiftsworkSearchForm.departmentIdList;
                this.afterSearchStartString = this.ShiftsworkSearchForm.startString ? MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.startString) : this.ShiftsworkSearchForm.startString,
                this.afterSearchSelectedUser = (this.ShiftsworkSearchForm.tmrIdList.length == 0) ? null : this.ShiftsworkSearchForm.tmrIdList
            } catch (e) {
                console.log(e);
                // ErrorModalUtil.modalError(this.$t('global_failure' + e).toString());
            }
            this.reload();
        }
    }
    //避免搜尋連按導致無限迴圈的flag
    searchFlag: boolean = true;
    shiftWorkDateSort: any;

    async reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            this.shiftsUpDateVisible = false;
            LoadingUtil.show();
            //下方使用者班別資料的來源
            this.$userShiftWorkApi.dynamicPaginateFindAllUserShiftWorkDataUsingGET(
                this.afterSearchSelectedDivi,
                this.afterSearchEndString,
                this.isAcsend,
                this.selectedSortDate,
                this.afterSearchShiftWorkCodes,
                this.afterSearchStartString,
                this.afterSearchSelectedUser,
                this.afterSearchSelectedSuperDeps,
            )
                .then((resp) => {
                    this.userData = resp.data.userDataList;
                }
                ).catch(error => {
                    console.log(error);
                    // ErrorModalUtil.modalError(this.$t('global_failure').toString()); //失敗
                })
                .finally(() => {
                    LoadingUtil.close();
                    this.isExportDisable = false;
                    if (this.userData.length == 0) {
                        //無符合篩選條件之資料、查詢結果
                        MessageUtil.messageInfo(this.$t('eventS_noMatchedData').toString() + "！", this.$t('global_searchResult').toString());
                    }
                    this.searchFlag = true;
                }
                )
        }
    }

    //初始化下拉選單
    mounted() {
        this.initiSelectOptions();
    }
    /**
   *初始化班別下拉式選單
   */
    async initiSelectOptions() {

        try {
            const resp = await this.$userShiftWorkApi.getAllShiftsWorkUsingGET();
            let shiftWorks = resp.data;

            shiftWorks.forEach(shiftWork => {
                let workStartTime = shiftWork.workStartTime.substring(11, 16);
                let workEndTime = shiftWork.workEndTime.substring(11, 16);

                this.shiftWorkCodeOptions.push(
                    {
                        value: shiftWork.shiftWorkCode,
                        label: shiftWork.shiftWorkCode + "(" + workStartTime + "~" + workEndTime + ")"
                    }
                )

            })
        } catch (e) {
            console.log(e)
            // ErrorModalUtil.modalError(this.$t('global_failure' + e).toString());
        }


    }

    //當分頁改變的時候
    sortFlag = false;
    selectedSortDate: string = null;
    isAcsend: boolean = false;
    onPageChange(pagination, filter, sort) {
        if (this.userData.length == 0) {
            return
        } else {
            if (this.sortFlag == false || sort.columnKey != this.selectedSortDate) {
                this.sortFlag = true;
            } else {
                this.sortFlag = false;
            }
            this.selectedSortDate = sort.columnKey;
            this.isAcsend = this.sortFlag
            this.reload();
        }


    }

    //改變編輯狀態
    changeEditState(flag: boolean, shiftWorkCode: string) {
        this.isDataEdited = flag;
        this.modifiedShiftWorkCode = shiftWorkCode;
    }



    shiftWordCodeInformation: string;



    /**
    *清空搜尋框表單
    */
    async resetShiftsWorkSearchForm() {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;

        this.startHover = "";
        this.startFeedback = false;
        this.stateStart = "";
        this.startErrorMsg = '';

        this.endHover = "";
        this.endFeedback = false;
        this.stateEnd = "";
        this.endErrorMsg = '';


        //將排序歸零
        this.selectedSortDate = null;
        this.isAcsend = false;
        this.userData = [];

        this.afterSearchSelectedDivi = [];
        this.afterSearchSelectedSuperDeps = [];
        this.afterSearchEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));
        this.afterSearchShiftWorkCodes = [];
        this.afterSearchStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), 1)));
        this.afterSearchSelectedUser = [];

        this.ShiftsworkSearchForm = {
            startDate: moment(new Date()),
            endDate: moment(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 14)),
            startString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            endString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + 14))),
            selectMonth: null,
            departmentIdList: [], //部門
            divisionIdList: [], //科別
            tmrIdList: [], //電訪員
            shiftWorkCodes: [],
        }

        //重新設定起始日期
        let endDate = MomentUtil.default(new Date(MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.endString)))
        let startDate = MomentUtil.default(new Date(MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.startString)));

        try {
            const resp = await this.$userShiftWorkApi.getShiftsWorkCalenderUsingGET(endDate, startDate);
            this.columns = resp.data.map(data => {
                let dateTime = new Date();
                let dateString = dateTime.setDate(dateTime.getDate() - 1);
                dateTime = new Date(dateString);
                return {
                    title: data.rocworkDate, key: data.workDate, subTitle: data.weekDay, isHoliday: data.isHoliday,
                    yesterDayDate: dateTime.getTime(), month: this.dayData.month, width: 100
                };
            });
        } catch (e) {
            console.log(e);
            // ErrorModalUtil.modalError(this.$t('global_failure' + e).toString());
        }
        this.selectDiviOptions = [];
        this.selectTmrOptions = [];
        // 科別 下拉
        this.selectDiviOptions = [];
        
        this.selectDiviOptions=Object.assign(this.allDivList);
        
        //電訪員下拉
        this.selectTmrOptions=Object.assign(this.allUserList);
       

    }
    workDate: string;
    // 按下編輯班別按鈕觸發的事件
    editUserShiftWork(record, index, event, text, col) {
        this.isDataEdited = false;

        //當前選定userShiftwork的日期時間格式
        this.workDate = col.key;
        //判斷該天是否可以編輯，先透過月份和日期來判斷
        this.overDate = false;
        this.buttonText = this.$t("global_cancel").toString(); //取消

        //判斷overDate時間
        let dateTime = new Date();
        let dateString = dateTime.setDate(dateTime.getDate() - 1);
        dateTime = new Date(dateString);
        //若為非本月或者今日之前的日期 則判斷為過期日ｏｖｅｒＤａｔｅ
        if (dateTime.getTime() > new Date(this.workDate).getTime() || col.isHoliday) {
            this.overDate = true;
            this.buttonText = this.$t("global_close").toString(); //關閉
        }

        // 當權限 為 無法異動事件時，將該點擊班別 模擬成 過期 狀態
        if(!this.authComponent.EVENT_CREATE.show){
            this.overDate = true;
            this.buttonText = this.$t("global_close").toString(); //關閉
        }

        //假設欄位有值的時候進入編輯模式，對子元件的值進行填充
        if (text) {
            this.titleText = this.$t("shiftSP_shiftWorkEdit").toString(); //編輯班別

            this.$userShiftWorkApi.searchUserShiftWorkbyUserIdAndDateUsingGET(record.userId, this.workDate)
                .then((resp) => {
                    let userIdShifitWork = resp.data;
                    this.shiftsDataForm = {
                        id: userIdShifitWork.id,
                        date: col.title,
                        userId: record.userId,
                        userName: record.depId + "-" + record.userName,
                        shiftWorkCode: userIdShifitWork.shiftWorkCode,
                        shiftsTime: "",
                        userIndex: index,
                        dataIndex: event.dataIndex,
                        updateId: userIdShifitWork.updateId,
                        updateDate: MomentUtil.transformRoc(userIdShifitWork.updateDate),
                        remark: resp.data.remarks,
                        workDate: this.workDate,
                        //用來判定子元件回傳值是編輯模式
                        editing: true,
                        isHoliday: false
                    }

                    this.shiftsUpDateVisible = true;
                }
                ).catch(e => {
                    console.log(e);
                    // ErrorModalUtil.modalError(this.$t('global_failure' + e).toString());//失敗

                }
                )
        } else if (col.isHolday) {
            //假日模式
            this.titleText = this.$t("shiftSP_shiftWorkEdit").toString(); //編輯班別
            this.shiftsDataForm = {
                id: "",
                date: col.title,
                userId: record.userId,
                userName: record.userName,
                shiftWorkCode: "假日無班別",
                shiftsTime: "",
                userIndex: index,
                dataIndex: event.dataIndex,
                updateId: "",
                updateDate: "",
                remark: "",
                workDate: this.workDate,
                //用來判定子元件回傳值是編輯模式
                editing: false,
                isHoliday: col.isHoliday
            }
            //確定得到子元件要顯示的值後才彈開視窗
            this.shiftsUpDateVisible = true;

        } else {
            //新增模式
            this.titleText = this.$t("shiftSP_shiftWorkAdd").toString(); //新增班別;

            this.shiftsDataForm = {
                id: "",
                date: col.title,
                userId: record.userId,
                userName: record.userName,
                shiftWorkCode: "尚未設定班別",
                shiftsTime: "",
                userIndex: index,
                dataIndex: event.dataIndex,
                updateId: "",
                updateDate: "",
                remark: "",
                workDate: this.workDate,
                //用來判定子元件回傳值是編輯模式
                editing: false,
                isHoliday: col.isHoliday
            }

            //確定得到子元件要顯示的值後才彈開視窗
            this.shiftsUpDateVisible = true;
        }
    }

    //關閉整批上傳表單
    onFormUploadClose() {
        (this.$refs.shiftWorkUploadForm as any).onFormUploadClose();
        this.shiftWorkUploadFormVisible = false;
    }

    //單筆匯入
    addSingleUserShiftWork() {
        this.isSingleUpload = true;
        this.secondText = this.$t('global_importDescribeThisMonth').toString(); //2.本功能僅提供當月新增訪員班別匯入
        this.titleText = this.$t('shiftS_importSingleRow').toString(); //單筆匯入
        this.allowMonth = MomentUtil.transformRocYearMonth(MomentUtil.format(moment(new Date()).toDate(), 'YYYY/MM'));
        this.shiftWorkUploadFormVisible = true;

    }

    //整批上傳
    shiftWorkUpload() {
        this.isSingleUpload = false;
        this.secondText = this.$t('global_importShiftWorkNextMonth').toString(); //2.本功能僅提供次月班表匯入
        this.titleText = this.$t('eventS_batchUpload').toString(); //整批上傳
        this.allowMonth = MomentUtil.transformRocYearMonth(MomentUtil.format(moment(new Date(this.dayData.year, this.dayData.month + 1, this.dayData.date)).toDate(), 'YYYY/MM'));
        this.shiftWorkUploadFormVisible = true;
    }

    //  ========================================events Start===============================================

    //送出多筆修改表單
    onFormUpdateSubmit(e) {

        // 若都沒還編輯過資料 異動班別表 資料預設為 空
        if (!this.isDataEdited) {
            this.modifiedShiftWorkCode = ""
        }

        //驗證必填欄位- 異動班別表欄位 為空 依情形判斷
        if (VlidationUtil.isEmpty(this.modifiedShiftWorkCode)) {
            var validResult: validShiftsWorkUpdateResult = (this.$refs.shiftUpdateForm as any).validateSubmit();

            // 判斷驗證後 有回傳物件，接著判斷是 新增 或者 編輯 流程要做的事情 
            if (!ValidationUtil.isEmpty(validResult)) {
                // 驗證失敗 且 沒有回傳 訊息 表示 新增 錯誤 (沒有填寫必填)
                if (!validResult.success && ValidationUtil.isEmpty(validResult.message)) {
                    // 顯示 必填 由 shiftsWorkUpdateForm 做

                }
                // 驗證失敗 且 有回傳 訊息 表示 編輯 填寫異動班表為 空 顯示視窗 要刪除 班表及事件 詢問 操作者意見
                else if (!validResult.success && !ValidationUtil.isEmpty(validResult.message)) {
                    Modal.confirm({
                        title: this.$t('global_save').toString(),// 儲存
                        content: validResult.message,
                        okText: this.$t('global_ok').toString(), //確認
                        cancelText: this.$t('global_cancel').toString(),  //取消
                        icon: 'info-circle',
                        onOk: async () => {
                            // 確定執行刪除 班表及事件的 api
                            await (this.$refs.shiftUpdateForm as any).deleteShiftAndEvent();

                        },
                        onCancel: () => {
                            // 取消刪除，不做事情
                        },
                    });
                }
            }

        } else {
            //如果資料沒有過期
            if (!this.overDate && this.isDataEdited) {
                Modal.confirm({
                    title: this.$t('global_save').toString(), //儲存
                    content: this.$t('shiftS_saveConfirm').toString() + '？', //當日原班別回撥案件若非新班別時段將拋回大眾池，確認執行班別異動
                    okText: this.$t('global_ok').toString(), //確認
                    cancelText: this.$t('global_cancel').toString(),  //取消
                    icon: 'info-circle',
                    onOk: async () => {
                        const resultBoolean = await (this.$refs.shiftUpdateForm as any).onFormUpdateSubmit();
                        if (resultBoolean) {
                            this.shiftsUpDateVisible = false;
                            await this.reload();
                            MessageUtil.messageSuccess(this.$t('shiftS_updateSuccessed').toString()); //資料修改成功
                        }
                    },
                    onCancel: () => {
                        this.shiftsUpDateVisible = false;
                    },
                });
            } else {
                this.shiftsUpDateVisible = false;
            }
        }

    }

    //關閉刪除後的彈跳視窗 接著關閉 班表設定 modal
    closeCheckModalDeletedShiftAndEvents(flag: boolean) {
        this.shiftsUpDateVisible = flag;
    }

    //多筆更新取消儲存
    onFormUpdateCalcel() {
        if (this.isDataEdited) {
            Modal.confirm({
                title: this.$t('global_warning').toString(), //警告
                content: this.$t('eventS_isAbandonThisModifyOrNot').toString() + '？', //是否放棄儲存本次修改內容
                okText: this.$t('global_ok').toString(), //確認
                cancelText: this.$t('global_cancel').toString(),  //取消
                icon: 'warning',
                onOk: () => { this.cancelConfirm(true); },
                onCancel: () => { this.cancelConfirm(false); },
            })
        } else {
            this.shiftsUpDateVisible = false;
        }
    }

    //多筆更新取消 判斷是否修改過資料
    cancelConfirm(data) {
        if (data) {
            this.shiftsUpDateVisible = false;
        } else {
            this.shiftsUpDateVisible = true;
        }
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
        );
    }





    //判斷當下是否可執行匯出
    isExportDisable: boolean = true;
    async exportUserShiftWorks() {
        if (this.isExportDisable) {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        } else if (this.userData == null || this.userData.length == 0) {
            ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
        } else {

            LoadingUtil.show();

            if (this.validateSubmit()) {

                let startDate = MomentUtil.default(moment(this.ShiftsworkSearchForm.startDate).toDate());
                let endDate = MomentUtil.default(moment(this.ShiftsworkSearchForm.endDate).toDate());
                try {
                    const resp = await this.$userShiftWorkApi.getShiftsWorkCalenderUsingGET(endDate, startDate);

                    this.dateChangeworkDateList =
                        this.columns = resp.data.map(data => {
                            let dateTime = new Date();
                            let dateString = dateTime.setDate(dateTime.getDate() - 1);
                            dateTime = new Date(dateString);
                            return {
                                title: data.rocworkDate, key: data.workDate, subTitle: data.weekDay, isHoliday: data.isHoliday,
                                yesterDayDate: dateTime.getTime(), month: this.dayData.month, width: 100
                            };
                        });
                } catch (e) {
                    console.log(e);
                    // ErrorModalUtil.modalError(e);
                    LoadingUtil.close();
                }

                //依據條件搜尋符合的班別並且匯出
                this.$userShiftWorkApi.excelExportUsingGET1(
                    (this.ShiftsworkSearchForm.divisionIdList.length == 0) ? null : this.ShiftsworkSearchForm.divisionIdList,
                    this.ShiftsworkSearchForm.endString ? MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.endString) : this.ShiftsworkSearchForm.endString,
                    this.ShiftsworkSearchForm.shiftWorkCodes,
                    this.ShiftsworkSearchForm.startString ? MomentUtil.transformRocYearMonthDay(this.ShiftsworkSearchForm.startString) : this.ShiftsworkSearchForm.startString,
                    (this.ShiftsworkSearchForm.departmentIdList.length == 0) ? null : this.ShiftsworkSearchForm.departmentIdList,
                    (this.ShiftsworkSearchForm.tmrIdList.length == 0) ? null : this.ShiftsworkSearchForm.tmrIdList,
                    { responseType: 'blob' }
                )
                    .then((res) => {
                        this.dealDownLoadData(res.data, this.ShiftsworkSearchForm.startString + "/" + "班別.xlsx");
                        LoadingUtil.close();
                        MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
                    })
                    .catch((err) => {
                        MessageUtil.messageError(this.$t('global_exportFailure').toString()); //匯出失敗
                    })
                    .finally(() => {
                        LoadingUtil.close();
                    });
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

    //****************************時間驗證篇************************************** */
    //日期選擇器，可選擇範圍限定於最近六個月與次月日期
    disabledDate(value) {
        const rangeEnd = moment().add(1, 'months').endOf('months');
        const rangeStart = moment().add((-6), 'months').startOf('months');
        if (!value || !rangeEnd || !rangeStart) {
            return false;
        }
        return (value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf());
    }
    // 解決Tooltip無法隱藏的問題
    isDateStartVisible: boolean = false;
    isDateEndVisible: boolean = false;

    // 欄位驗證錯誤訊息
    startHover: string = "";
    startFeedback: boolean = false;
    stateStart: string = "";
    startErrorMsg: string = '';

    endHover: string = "";
    endFeedback: boolean = false;
    stateEnd: string = "";
    endErrorMsg: string = '';


    dateChangeworkDateList = [];
    //日期選擇器(起)，自動轉為字串更新搜尋條件
    async onStartChange(date) {
        this.isExportDisable = true;

        this.ShiftsworkSearchForm.startString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date)
        );
        this.validateSubmit();

    }

    //日期選擇器(訖)，自動轉為字串更新搜尋條件
    onEndChange(date) {
        this.isExportDisable = true;
        if (date == null) {
            this.ShiftsworkSearchForm.endDate = moment(new Date());
            this.ShiftsworkSearchForm.endString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date()));
        } else {
            this.ShiftsworkSearchForm.endString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        }
        this.validateSubmit();
    }
    /**
 * 確保Tooltip在日期正確時確實隱藏
 */
    eventMouseOverStart() {
        if (this.startFeedback) {
            this.isDateStartVisible = true;
        } else {
            this.isDateStartVisible = false;
        }
    }
    eventMouseOverEnd() {
        if (this.endFeedback) {
            this.isDateEndVisible = true;
        } else {
            this.isDateEndVisible = false;
        }
    }

    //驗證時間欄位格式
    validateSubmit() {
        let vaild = true;

        //日期格式範圍驗證
        let startAndEndValidate = true;

        this.validateStartDate(null, this.ShiftsworkSearchForm.startString, () => {
            if (this.stateStart == 'error') {
                vaild = false;
                startAndEndValidate = false;
            }
        });

        this.validateEndDate(null, this.ShiftsworkSearchForm.endString, () => {
            if (this.stateEnd == 'error') {
                vaild = false;
                startAndEndValidate = false;
            }
        });

        //起始與結束皆符合規範才進一步判斷起訖區間
        if (startAndEndValidate) {
            this.validateStartAndEndDate(null, this.ShiftsworkSearchForm.startDate, this.ShiftsworkSearchForm.endDate, () => {
                if (this.stateStart == 'error' || this.stateEnd == 'error') {
                    vaild = false;
                }
            });
        }
        return vaild;
    }

    /**
    * 日期格式驗證
    * @param rule 驗證規則 
    * @param value 開始日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateStartDate(rule, value, callback) {
        this.startFeedback = true;
        this.startHover = '';
        this.stateStart = "";
        this.startErrorMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                this.startFeedback = false;
                callback();//不帶參數表示驗證成功
            } else {
                this.isDateStartVisible = true;
                this.startHover = "hover";
                this.stateStart = "error";
                this.startErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
                callback(() => { });
            }
        } else {
            this.startHover = "hover";
            this.stateStart = "error";
            this.startErrorMsg = this.$t('eventS_dateRequired').toString(); //事件日期必填
            callback(() => { });
        }
        callback();
    }



    /**
    * 日期格式驗證
    * @param rule 驗證規則 
    * @param value 結束日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateEndDate(rule, value, callback) {
        this.endFeedback = true;
        this.endHover = '';
        this.stateEnd = "";
        this.endErrorMsg = '';
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                this.endFeedback = false;
                callback();
            } else {
                this.isDateEndVisible = true;
                this.endHover = "hover";
                this.stateEnd = "error";
                this.endErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
                callback(() => { });
            }
        } else {
            this.endHover = "hover";
            this.stateEnd = "error";
            this.endErrorMsg = "事件" + this.$t('eventS_dateRequired').toString(); //事件日期必填
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
    validateStartAndEndDate(rule, startDate, endDate, callback) {
        this.startFeedback = true;
        this.endFeedback = true;
        if (this.ShiftsworkSearchForm.startString == this.ShiftsworkSearchForm.endString ||
            moment(startDate).isBefore(endDate)) {
            let date = moment(JSON.parse(JSON.stringify(this.ShiftsworkSearchForm.startDate)));
            let isInOneMonth = date.add(31, 'days').isAfter(this.ShiftsworkSearchForm.endDate)
            if (isInOneMonth) {
                this.isDateEndVisible = false;
                this.isDateStartVisible = false;
                this.startFeedback = false;
                this.endFeedback = false;
                callback();
            } else {
                this.isDateEndVisible = true;
                this.isDateStartVisible = true;
                this.stateStart = 'error';
                this.startHover = "hover";
                this.startErrorMsg = "查詢起訖區間不可大於31天" //查詢起訖區間不可大於31天
                this.stateEnd = 'error';
                this.endHover = "hover";
                this.endErrorMsg = "查詢起訖區間不可大於31天" //查詢起訖區間不可大於31天
                callback(() => { });
            }

        } else {
            this.isDateEndVisible = true;
            this.isDateStartVisible = true;
            this.stateStart = 'error';
            this.startHover = "hover";
            this.startErrorMsg = this.$t('global_pleaseInputCorrectStartAndEndDate').toString(); //請輸入正確的起訖日期
            this.stateEnd = 'error';
            this.endHover = "hover";
            this.endErrorMsg = this.$t('global_pleaseInputCorrectStartAndEndDate').toString(); //請輸入正確的起訖日期
            callback(() => { });
        }
        callback();
    }

    //FIXME hover 位置跑掉


    /**
  * 手動輸入開始日期時檢查日期是否符合曆法
  * @param data 
  */
    checkManualInputStartDate(data: any) {
        this.isDateStartVisible = false;
        this.isDateEndVisible = false;
        this.startFeedback = true;
        this.startHover = "";
        this.stateStart = '';
        this.startErrorMsg = "";
        this.endHover = "";
        this.stateEnd = '';
        this.endErrorMsg = "";
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.startFeedback = false;
            this.endFeedback = false;
        } else {
            this.isDateStartVisible = true;
            this.startHover = "hover";
            this.stateStart = 'error';
            this.startErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
        }
        this.ShiftsworkSearchForm.startDate = parseDate ? parseDate : this.ShiftsworkSearchForm.startDate;
        this.ShiftsworkSearchForm.startString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.ShiftsworkSearchForm.startDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }
    /**
     * 手動輸入結束日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputEndDate(data: any) {
        this.isDateEndVisible = false;
        this.isDateStartVisible = false;
        this.endFeedback = true;
        this.endHover = "";
        this.stateEnd = '';
        this.endErrorMsg = "";
        this.startHover = "";
        this.stateStart = '';
        this.startErrorMsg = "";
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            this.endFeedback = false;
            this.startFeedback = false;
        } else {
            this.isDateEndVisible = true;
            this.endHover = "hover";
            this.stateEnd = 'error';
            this.endErrorMsg = this.$t('global_dateError').toString(); //日期錯誤
        }
        this.ShiftsworkSearchForm.endDate = parseDate ? parseDate : this.ShiftsworkSearchForm.endDate;
        this.ShiftsworkSearchForm.endString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.ShiftsworkSearchForm.endDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }


}