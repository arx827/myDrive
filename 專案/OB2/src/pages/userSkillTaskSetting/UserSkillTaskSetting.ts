import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
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
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import UserTaskSettingForm from "@/components/shared/form/userTaskSettingForm/UserTaskSettingForm.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { resultMessage } from "@/components/shared/uploadAndLog/model";
import UploadAndLog from "@/components/shared/uploadAndLog/UploadAndLog.vue";
import { LoginModule } from "@/plugins/store/LoginModule";
import { DivisionUsersDto, ImportMessageDto, LoadUserDiviDto, Option, PageOfUserTaskDto, StaffDto, UserDto, UserTaskDto, UserTaskOptions } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import moment from "moment";
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: { UserTaskSettingForm, UploadAndLog, HiddenFolde, FblDataGrid }
})
export default class ScheduleManagement extends Vue {

    //傳入單筆表單的資料
    taskSettingData = {};


    tabActiveKey: string = "1";

    // ===================================== 下拉式選單 ========================================================
    // 部門
    selectDepOptions: Option[] = [];
    // 科別
    selectDiviOptions: Option[] = [];
    // 電訪員
    selectTmrOptions: Option[] = [];
    //使用者清單
    allUserList: Option[] = [];
    //使用者清單
    allDivList: Option[] = [];
    // 部門對應科別/人員資料(為map的形式)
    depUnitInfo = {};
    depUserInfo = {};
    // 科別對應人員資料
    unitUserInfo = {};

    //電訪項目下拉選單
    userTasksOptions = [];
    // ===================================== 下拉式選單  end========================================================
    //上方搜尋項目
    userTaskSearchForm = {
        departmentIdList: [],
        divisionIdList: [],
        tmrIdList: [],
        taskIds: [],
    };

    //初始化表單的使用者資料
    iniAllUserStaffList = [];

    //控制是否顯示單筆電訪項目
    taskSettingFormVisible: boolean = false;


    //
    titleText = "";

   
    /**
     * 使用者電訪項目搜尋條件清除
     * @returns 
     */
    resetUserTaskSearch() {
        this.userTaskSearchForm = {
            departmentIdList: [this.userSuperUnitId],
            divisionIdList: [],
            tmrIdList: [],
            taskIds: [],
        };

        this.isExportDisable = true;
        //將下方資料清空
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.grid.pagination.current = 1;
    }
    userSuperUnitId: string = "";

    /**
  * 頁面開啟
  * @returns 
  */
    async created() {

    LoadingUtil.show();
    this.$unitApi.getAllDepUnitTmrOptionsUsingGET()
    .then((resp)=>{
      if(resp.data!= null){

        // 部門對應科別/人員資料
        this.depUnitInfo = resp.data.depUnitInfo;
        this.depUserInfo = resp.data.depUserInfo;

        // 科別對應人員資料
        this.unitUserInfo = resp.data.unitUserInfo;

        // 部門 下拉
        this.selectDepOptions = Object.assign(resp.data.departOptions);
        this.userTaskSearchForm.departmentIdList.push(resp.data.defaultDepId);
        
        // 科別 下拉
        this.allDivList = resp.data.unitList;
        
        
        // 電訪員 下拉
        this.allUserList = resp.data.userList;
        

        // 有預設部門需一起異動科別/人員
        if(!ValidationUtil.isEmpty(resp.data.defaultDepId)) {
          this.userSuperUnitId=resp.data.defaultDepId;
          this.onSelectDept();
        }
      }else{
        ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常
        LoadingUtil.close();
      }
      LoadingUtil.close();
      this.reload();
    })
    .catch((err)=>{
      LoadingUtil.close();
    })

        //抓取使用者們(後端api修改不過濾部門)
        const getStaffs = this.$userApi.getAllUserWithStaffDtoUsingGET().then((res: AxiosResponse<StaffDto[]>) => {
            this.iniAllUserStaffList = res.data;
        }).catch(error => console.log(error));

        //取得任務下拉式選單
        this.$userTaskApi.findAllUserTaskOptionsUsingGET().then(
            (res: AxiosResponse<UserTaskOptions[]>) => {
                res.data.forEach(userTaskOption => {
                    this.userTasksOptions.push({
                        label: userTaskOption.taskName,
                        value: userTaskOption.taskId
                    })
                })
            }).catch((err) => {
                console.error(err);
            })

            
    }




    //避免搜尋連按導致無限迴圈的flag
    searchFlag: boolean = true;
    async reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();
            //下方使用者班別資料的來源
            await this.$userTaskApi.paginateUserTasksUsingGET(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                (this.userTaskSearchForm.departmentIdList.length != 0) ? this.userTaskSearchForm.departmentIdList : null,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                (this.userTaskSearchForm.taskIds.length != 0) ? this.userTaskSearchForm.taskIds : null,
                (this.userTaskSearchForm.divisionIdList.length != 0) ? this.userTaskSearchForm.divisionIdList : null,
                (this.userTaskSearchForm.tmrIdList.length != 0) ? this.userTaskSearchForm.tmrIdList : null,
            )
                .then((resp: AxiosResponse<PageOfUserTaskDto>) => {
                    const p = { ...this.grid.pagination };
                    p.total = parseInt(resp.data.totalElements);
                    this.grid.pagination = p;
                    this.grid.data = resp.data.content;
                }
                ).catch(error => {
                    ErrorModalUtil.modalError("搜尋使用者Logout資訊失敗"); //失敗
                })
                .finally(() => {
                    LoadingUtil.close();
                    this.isExportDisable = false;
                    if (this.grid.data.length == 0) {
                        //無符合篩選條件之資料、查詢結果
                        MessageUtil.messageInfo(this.$t('CUST_MARK_NOT_FOUND').toString());
                    }
                    this.searchFlag = true;
                }
                )
        }
    }

    /**
   * 選擇部門時，科別範圍限縮
   */
 onSelectDept() {

    this.selectDiviOptions = [];
    this.selectTmrOptions = [];
    
    if (this.userTaskSearchForm.departmentIdList.length > 0) {

      this.userTaskSearchForm.departmentIdList.forEach((depId) => {
        
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
    let unitIdTempList = Object.assign(this.userTaskSearchForm.divisionIdList);
    unitIdTempList.forEach((eachSelected)=>{

      // 如果當前選擇的科別不在科別下拉選單裡，則要移除
      if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
        if(this.userTaskSearchForm.divisionIdList.length > 0) {
          this.userTaskSearchForm.divisionIdList = this.userTaskSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
        }
      }
    });

    //重置電訪員選項
    let userIdTempList = Object.assign(this.userTaskSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.userTaskSearchForm.tmrIdList.length > 0) {
          this.userTaskSearchForm.tmrIdList = this.userTaskSearchForm.tmrIdList.filter(userId => userId != eachSelected);
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
    this.selectTmrOptions = [];


    // 有選擇科別
    if(this.userTaskSearchForm.divisionIdList.length > 0){

      // 取得科別對應人員
      this.userTaskSearchForm.divisionIdList.forEach( (unitId) => {
        if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
          this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
        }
      });

    }else{

      // 有選擇部門
      if (this.userTaskSearchForm.departmentIdList.length > 0) {

        this.userTaskSearchForm.departmentIdList.forEach((depId) => {
  
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
    let userIdTempList = Object.assign(this.userTaskSearchForm.tmrIdList);
    userIdTempList.forEach((eachSelected) => {

      // 如果當前選擇的人員不在人員下拉選單裡，則要移除
      if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
        if(this.userTaskSearchForm.tmrIdList.length > 0) {
          this.userTaskSearchForm.tmrIdList = this.userTaskSearchForm.tmrIdList.filter(userId => userId != eachSelected);
        }
      }
    });
    
  }

    //判斷當下是否可執行匯出
    isExportDisable: boolean = true;
    //匯出使用者電訪項目
    exportUserTasks() {
        if (this.isExportDisable) {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
        } else if (this.grid.data.length == 0) {
            ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
        } else {
            LoadingUtil.show();

            this.$userTaskApi.excelUserTaskExportUsingGET(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                (this.userTaskSearchForm.departmentIdList.length != 0) ? this.userTaskSearchForm.departmentIdList : null,
                this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                (this.userTaskSearchForm.taskIds.length != 0) ? this.userTaskSearchForm.taskIds : null,
                (this.userTaskSearchForm.divisionIdList.length != 0) ? this.userTaskSearchForm.divisionIdList : null,
                (this.userTaskSearchForm.tmrIdList.length != 0) ? this.userTaskSearchForm.tmrIdList : null,
                { responseType: 'blob' }
            ).then((res) => {
                this.dealDownLoadData(res.data, "電訪項目匯出.xlsx");
                LoadingUtil.close();
                MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
            })
                .catch((err) => {
                    ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                })
                .finally(() => {
                    LoadingUtil.close();
                });

        }

    }

    //上方搜尋
    async onUserTaskSearch() {
        this.grid.pagination.current = 1;
        this.reload();

    }

    /**
    *當被選定時匯出設定為失效
    */
    onUserTasksSelectChange() {
        this.isExportDisable = true;

    }



    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
        );
    }


    /**
    * 新增電訪技能
    * @returns 
    */
    showTaskAddModal() {
        this.titleText = this.$t('userTask_skillAdd').toString()
        this.taskSettingFormVisible = true;
        this.taskSettingData = {};
    }

    /**
     * 顯示編輯電訪技能
    * @param data 電訪技能單筆資料 
    * @returns 
    */
    showUserEditModal(data) {
        this.taskSettingFormVisible = true;
        this.titleText = this.$t('userTask_skillEdit').toString();
        this.taskSettingData = data;
    }

    /**
     * 電訪項目單筆技能新增/編輯表單送出
     */

    async taskSettingModalSubmit() {
        const flag = await await (this.$refs.taskSettingForm as any).validateBeforeSubmit();
        if (flag) {
            Modal.confirm({
                title: this.$t('global_save'), //儲存
                content: this.$t('global_confirmSave').toString() + '？', //資料無誤，確認執行儲存
                okText: this.$t('global_ok').toString(), //確認
                cancelText: this.$t('global_cancel').toString(),  //取消
                icon: 'warning',
                onOk: async () => {
                    await (this.$refs.taskSettingForm as any).submit();
                },
                onCancel: () => { },
            })
                ;
        } else {
            return
        }

    }

    /**
    * 當單筆技能成功新增後
    */
    onTaskSettingSuccess(val) {
        this.taskSettingFormVisible = val;
        this.reload();
    }
    /**
    * 電訪項目單筆技能新增/編輯表單取消
    */
    taskSettingModalCancel() {
        this.taskSettingFormVisible = false;
    }



    /*************************和下方table section相關************************* */
    /**
    * 使用者列表事件觸發選項
    * @param e 單筆使用者資料觸發事件 
    * @returns 
    */
    onUserTaskTableActionClick(e) {

        switch (e.action.name) {
            case "delete":
                this.userTaskDelete(e.row.data);
                break;
            case "edit":
                this.showUserEditModal(e.row.data);
                break;

        }
    }

    /**
    * 使用者列表單筆資料刪除
    * @param data 使用者列表單筆資料 
    * @returns 
    */
    userTaskDelete(data: UserTaskDto) {
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('global_delete').toString(),
            content: this.$t('eventS_confirmDelete').toString() + ' ?',
            onOk: async () => {

                try {
                    await this.$userTaskApi.deleteUserTaskUsingPOST(data.id);
                    MessageUtil.messageSuccess(this.$t('global_data_delete_success').toString()); //資料刪除成功
                    this.reload();
                } catch (err) {
                    MessageUtil.messageError(this.$t(err.response.data.apiErrorCode).toString() + "，" + this.$t('global_deleteFailed').toString()); //刪除失敗
                } finally {
                    this.reload();
                }
            },
            onCancel: () => { },
        });
    }

    /**
    * 使用者電訪項目列表下一頁時維持相同的排序
    * @param e 使用者列表下一頁事件 
    * @returns 
    */
    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        console.log(this.grid.sort);
        this.reload();
    }

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<any> = {
        rowKey: "id",
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
                        title: this.$t('global_edit').toString(),
                        edit: true
                    }, {
                        name: "delete",
                        title: this.$t('global_delete').toString(),
                        delete: true
                    }

                ],
            },
            {
                type: FblColumnType.PLAIN,
                property: "unitId",
                title: this.$t('global_division').toString(),
                formatter: (data: UserTaskDto) => {
                    return data.unitName
                },


            },
            {
                type: FblColumnType.PLAIN,
                property: "userId",
                title: this.$t('global_telemarketer').toString(),
                formatter: (data: UserTaskDto) => {
                    return data.userName
                },

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("global_workYear").toString(),//異動時間
                property: "workYear",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("userTask").toString(),
                property: "taskId",
                formatter: (data: UserTaskDto) => {
                    return data.taskName
                },

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("userTask_skillGetDate").toString(),
                property: "skillGetDate",
                formatter: (data: UserTaskDto) => {
                    return MomentUtil.transformRocYearMonthDay(data.skillGetDate);

                },

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("userTask_skillEffectiveDate").toString(),
                property: "effectiveDate",//生效日
                formatter: (data: UserTaskDto) => {
                    return MomentUtil.transformRocYearMonthDay(data.effectiveDate);
                },

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("global_modified_user").toString(),//異動人員 
                property: "updateId",

                formatter: (data: UserTaskDto) => {
                    if (data.updateName == null || data.updateName == "") {
                        return "";
                    } else {
                        return data.updateName
                    }

                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("global_modified_date").toString(),//異動時間
                property: "updateDate",

            },
        ]

    };

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
    //*******************************匯入import section start ************/
    //顯示匯入視窗
    userTasksUploadFormVisible: boolean = false;

    //上傳是否曾經成功(判斷是否重整頁面)
    isAnyUploadSuccessed = false;
    //上傳表單filter初始設定
    uploadProgressFilter: FblFilters = {
        filters: []
    };
    //匯入表單內的顯示文字
    describeList = [this.$t("global_importDescribeLimit").toString()];
    //檔案清單
    fileList = [];

    //匯入檢核訊息
    errorMessageList: resultMessage[] = [];

    //以上方叉叉關閉整批上傳表單
    onFormUploadReset() {
        (this.$refs.uploadAndLog as any).resetUploadForm();
        this.userTasksUploadFormVisible = false;
        if (this.isAnyUploadSuccessed) {
            this.reload();
        }
    }

    //以關閉按鈕關閉上傳表單
    onFormUploadClose() {
        this.userTasksUploadFormVisible = false;
        if (this.isAnyUploadSuccessed) {
            this.reload();
        }
    }

    /**
     * 點選整批匯入按鈕
     * @returns 
     */
    uploadReload() {
        this.userTasksUploadFormVisible = true;
        this.isAnyUploadSuccessed = false;
        this.getLogProgerss(false);

    }

    //加載上傳歷程
    async getLogProgerss(isUploaded) {
        let data = []
        LoadingUtil.show();
        const rangeEnd = moment().endOf('months').add(1, "days");
        const rangeStart = moment().startOf('months');
        const start = FiltersUtil.setFilterParam("uploadDate", FblOperator.GT, MomentUtil.format(new Date(rangeStart.toISOString()), "YYYY-MM-DD"));
        const end = FiltersUtil.setFilterParam("uploadDate", FblOperator.LT, MomentUtil.format(new Date(rangeEnd.toISOString()), "YYYY-MM-DD"));
        const classType = FiltersUtil.setFilterParam("type", FblOperator.EQ, "T");
        this.uploadProgressFilter = FiltersUtil.setFilters(start, end, classType);
        // 整理為 Filters
        const filterUploadProgress: string = JSON.stringify(this.uploadProgressFilter);
        //搜尋本月上傳歷程
        const resp = await this.$uploadProgressApi.findAllUploadProgressUsingGET(filterUploadProgress).then((resp) => {
            resp.data.forEach(item => {
                item.uploadDate = MomentUtil.transformRocYearMonthDayHHMMSS(item.uploadDate);
            });
            data = resp.data;
            LoadingUtil.close();
        }).catch((err) => {
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('global_historyLoadingFailure').toString());  //歷程載入失敗
        }).finally(() => {
            if (isUploaded) {
                (this.$refs.uploadAndLog as any).reloadLogProgress(data);
            } else {
                // console.log("開啟")
                (this.$refs.uploadAndLog as any).settingInitValue(data, this.describeList);
            }
        })

    }

    //本次上傳結束後，重新加載上傳歷程(新增顯示本次上傳結果)
    reloadLogProgress() {
        this.getLogProgerss(true);
    }
    //因為不接受一次上傳多個檔案，所以每次上傳要移除舊檔
    handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    }

    //上傳時檢查格式與檔案大小
    beforeUpload(file) {
        const isExcel = file.type.includes("sheet");
        //判斷檔案類型
        if (!isExcel) {
            (this.$refs.uploadAndLog as any).beforeUploadValidateFail(this.$t('global_formatFailure').toString());
            return false;
        }
        //判斷檔案大小
        const isLT5MB = parseInt(file.size) / 1024 / 1024 < 5;
        if (!isLT5MB) {
            (this.$refs.uploadAndLog as any).beforeUploadValidateFail(this.$t('eventS_fileSizeLimitExceeded').toString())
            return false;
        }
        (this.$refs.uploadAndLog as any).beforeUploadValidateSuccess(file);
        return false;
    }

    //上傳檔案至後端檢核
    async handleUpload(uploadData) {
        this.errorMessageList = [];
        let checkHasError = false;
        LoadingUtil.show();
        let SuccessedResultMessage = "";
        await this.$userTaskApi.excelImportUsingPOST2(uploadData)
            .then((res: AxiosResponse<ImportMessageDto[]>) => {
                if (res.data.length != 1 || (res.data[0].title != "檢核成功" && res.data[0].title != "匯入失敗")) {
                    checkHasError = true;
                    let count = 0;
                    res.data.forEach(eachMessage => {
                        count++;
                        this.errorMessageList.push({
                            index: count,
                            title: eachMessage.title,
                            context: eachMessage.message,
                        });
                    })
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t("global_importInformationError").toString()); //匯入資料有誤
                } else if (res.data[0].title == "檢核成功") {
                    checkHasError = false;
                    SuccessedResultMessage = res.data[0].message;
                    this.isAnyUploadSuccessed = true;
                    LoadingUtil.close();
                    MessageUtil.messageSuccess(this.$t('global_importSuccess').toString()); //匯入成功
                } else if (res.data[0].title == "匯入失敗") {
                    checkHasError = false;
                    SuccessedResultMessage = res.data[0].message;
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t('global_importFailure').toString()) //匯入失敗
                } else {
                    checkHasError = false;
                    SuccessedResultMessage = this.$t('eventS_importDataIncorrect').toString() //匯入資料有誤
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t("global_importInformationError").toString()); //匯入資料有誤
                }
            })
            .catch((err) => {
                checkHasError = true;
                SuccessedResultMessage = this.$t('global_importFailure').toString() //匯入失敗
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t('global_importFailure').toString()) //匯入失敗
            })
            .finally(() => {
                (this.$refs.uploadAndLog as any).handleUploadResult(this.errorMessageList, checkHasError, SuccessedResultMessage);
            });
    }

    //*******************************匯入section end ************/
}