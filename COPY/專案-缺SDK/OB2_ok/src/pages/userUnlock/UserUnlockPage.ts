import { Vue, Component, Watch } from "vue-property-decorator";
import { default as validationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { Modal } from "ant-design-vue";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import MomentUtil from "@/assets/config/MomentUtil";
import { AxiosResponse } from "axios";
import { Option, PageOfUserUnlockGrid, StaffDto, UserUnlockGrid, } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import moment, { relativeTimeRounding } from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { message } from "ant-design-vue";
import { UserUnlockValidateObject } from "./model";
import CommonUtil from "@/assets/config/CommonUtil";

@Component({
    components: { FblDataGrid, HiddenFolde }
})
export default class UserUnlockPage extends Vue {
    //查詢條件
    userUnlockSearchForm = {
        departmentIdList: [], //部門
        divisionIdList: [], //科別
        userId: "", //電訪員
        userName: ""
    };

    // 主表搜尋條件過濾
    infFilter: FblFilters = {
        filters: []
    };

    //其他查詢條件
    otherFilter = {

        tmrDepartmentIdList: [],
        tmrDivisionIdList: [],
        tmrIdList: [],
    }
    // 部門對應科別/人員資料
    depUnitInfo = {};

    created() {

        this.$unitApi.getAllDepUnitTmrOptionsUsingGET()
            .then((resp) => {

                if (resp.data != null) {
                        // 部門對應科別
                        this.depUnitInfo = resp.data.depUnitInfo;
    
                        /// 部門 下拉
                        this.selectDepOptions = Object.assign(resp.data.departOptions);
                        this.userUnlockSearchForm.departmentIdList.push(resp.data.defaultDepId);
                        // 科別 下拉
                        this.allDivList = resp.data.unitList;
                        this.selectDiviOptions = Object.assign(resp.data.unitList);
                        //預設科別id
                        if (!ValidationUtil.isEmpty(resp.data.defaultUnitId)) {
                            this.userUnlockSearchForm.divisionIdList.push(resp.data.defaultUnitId);
                        }
                        // 有預設部門需一起異動科別
                        if (!ValidationUtil.isEmpty(resp.data.defaultDepId)) {
                            this.onSelectDept();
                        }
                        this.reload();
                   
                } else {
                    ErrorModalUtil.modalError(this.$t('case_search_getAllUserAndUnit_occur_error2').toString()); //取得使用者及部門科別清單發生異常

                }

            })
            .catch((err) => {

                // 會辦查詢 下拉選單載入失敗
                ErrorModalUtil.modalError(this.$t('infPage_querySelectionFailed').toString())
            })


    }

    //避免搜尋連按導致無限迴圈的flag
    searchFlag: boolean = true;
    reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            LoadingUtil.show();
            this.$authApi.getUserLoginPIARecordsUsingGET(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                (this.userUnlockSearchForm.departmentIdList.length != 0) ? this.userUnlockSearchForm.departmentIdList : null,
                (this.userUnlockSearchForm.divisionIdList.length != 0) ? this.userUnlockSearchForm.divisionIdList : null,
                (!ValidationUtil.isEmpty(this.userUnlockSearchForm.userId)) ? this.userUnlockSearchForm.userId : null,
                (!ValidationUtil.isEmpty(this.userUnlockSearchForm.userName)) ? this.userUnlockSearchForm.userName : null,
            ).then((resp: AxiosResponse<PageOfUserUnlockGrid>) => {

                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.pagination = p;
                this.grid.data = resp.data.content;
            }).catch(error => {
                ErrorModalUtil.modalError(this.$t('userTask_skillsGetFailed').toString()); //失敗
            })
                .finally(() => {
                    LoadingUtil.close();
                    if (this.grid.data.length == 0) {
                        //無符合篩選條件之資料、查詢結果
                        MessageUtil.messageInfo(this.$t('CUST_MARK_NOT_FOUND').toString());
                    }
                    this.searchFlag = true;
                }
                )
        }

    }
    // ===================================== 下拉式選單與其事件方法 ========================================================
    // 部門
    selectDepOptions: Option[] = [];
    // 科別
    selectDiviOptions: Option[] = [];

    //使用者清單
    allUserList: Option[] = [];
    //部門對應的科別清單
    allDivList: Option[] = [];

    /**
  * 選擇部門時，科別範圍限縮
  */
    onSelectDept() {
        this.selectDiviOptions = [];

        if (this.userUnlockSearchForm.departmentIdList.length > 0) {

            this.userUnlockSearchForm.departmentIdList.forEach((depId) => {

                // 取得部門對應的科別
                if (!ValidationUtil.isEmpty(this.depUnitInfo[depId])) {
                    this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
                }
            });
        } else {
            // 科別 下拉
            this.selectDiviOptions = Object.assign(this.allDivList);
        }

        //重置科別選項
        let unitIdTempList = Object.assign(this.userUnlockSearchForm.divisionIdList);
        unitIdTempList.forEach((eachSelected) => {

            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if (!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)) {
                if (this.userUnlockSearchForm.divisionIdList.length > 0) {
                    this.userUnlockSearchForm.divisionIdList = this.userUnlockSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });



    }
    /**
    * 選擇科別時，電訪員範圍限縮
    */
    onSeletDivi() {

    }
    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
    }
    //   ===============================搜尋Search Event事件===================================

    userUnlockSearch() {
        this.grid.pagination.current = 1;
        // if(!ValidationUtil.isEmpty(this.userUnlockSearchForm.userId)){
        // this.validateAccount(null,this.userUnlockSearchForm.userId,()=>{});
        // }
        const userAccountFlag = this.userUnlockValidateObject.userId.feedback == true ? false : true;
        let departmentIdAndUnitIdFlag = false;

        if (this.userUnlockSearchForm.userId.length != 5) {
            //至少部門或科別任一條件搜尋
            if (this.userUnlockSearchForm.departmentIdList.length > 0 || this.userUnlockSearchForm.divisionIdList.length > 0) {
                departmentIdAndUnitIdFlag = true;
            }
        } else {
            departmentIdAndUnitIdFlag = true;
        }
        if (userAccountFlag && departmentIdAndUnitIdFlag) {
            this.reload();
        } else {
            if (!departmentIdAndUnitIdFlag) {
                ErrorModalUtil.modalError("至少部門或科別任一條件搜尋");
            }
            return
        }
    }
    userUnlockSearchReset() {
        this.userUnlockSearchForm = {
            departmentIdList: [],
            divisionIdList: [],
            userId: "",
            userName: ""
        }
        this.grid.data = [];
        this.grid.pagination.total = 0;
        // 科別 下拉
        this.selectDiviOptions = [];
        this.selectDiviOptions = Object.assign(this.allDivList);

        CommonUtil.feildValidateWithVisible(this.userUnlockValidateObject.userId, false, "", false);
    }

    // =================================grid事件===================================

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<UserUnlockGrid> = {
        rowKey: "sequence",
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
                        name: "unlock",
                        title: this.$t('global_delete').toString(),
                        unlock: true
                    }
                ],
                width: 60
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('infTransferForm_dept').toString(),//部門
                property: "superiorUnitName",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('case_search_division').toString(),//科別
                property: "unitName",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('agentSP_userAccount').toString(),//使用者帳號
                property: "userId",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('agentSP_userName').toString(),// "使用者姓名",
                property: "name",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('token_expired_time').toString(),// "系統登出期限"
                property: "tokenExpiredTime",
                formatter: (data: UserUnlockGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.tokenExpiredTime);

                },
            },

        ]
    };

    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        console.log(this.grid.sort);
        this.reload();
    }
    onTableActionClick(e: FblActionEvent<UserUnlockGrid>) {
        this.userUnlockMethod(e.row.data);
    }
    //進行解鎖的動作
    userUnlockMethod(user: UserUnlockGrid) {
        Modal.confirm({
            okText: this.$t('global_yes').toString(),
            cancelText: this.$t('global_no').toString(),
            title: this.$t('unlock').toString(),
            content: this.$t('global_account').toString() + user.userId + user.name + this.$t('unlock_sure').toString(),//帳號林XX是否確定解鎖
            onOk: async () => {

                try {
                    await this.$authApi.enforceLogoutUsingPOST(user.userId);
                    MessageUtil.messageSuccess(this.$t('unlock_success').toString()); //解鎖成功
                } catch (err) {
                    MessageUtil.messageError(this.$t(err.response.data.apiErrorCode).toString() + "，" + this.$t('unlock_failed').toString()); //刪除失敗
                } finally {
                    this.grid.pagination.current = 1;
                    this.reload();
                }
            },
            onCancel: () => { },
        });

    }
    // ========================================驗證篇==========================
    // 使用者搜尋條件及欄位驗證回饋
    userUnlockValidateObject: UserUnlockValidateObject = {
        userId: { feedback: false, hoverVisible: false },
    }

    onUserIdclick() {

        this.validateAccount(null, this.userUnlockSearchForm.userId, () => { });

    }
    /**
    * 使用者搜尋，帳號驗證。使用者帳號僅可輸入英數字。
    * @param rule 驗證規則 
    * @param value 使用者搜尋帳號輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateAccount(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.userUnlockValidateObject.userId, true, "", false)
        if (value) {
            if (validationUtil.accountValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.userUnlockValidateObject.userId, false, "", false)
                callback();
            } else {
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.userUnlockValidateObject.userId, false, "", false)
        }
        callback();
    }
}

