import { Vue, Component, Watch } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
//import { RoleDto, Option, FunctionDto } from "@fubonlife/obd-api-axios-sdk";
import { RoleDto, Option, GroupDto, RoleInfoDto, StaffDto, UserDto, UserRolesUpdate, StaffDtoStatusEnum } from "@fubonlife/obd-api-axios-sdk";
import {
    EMPTY_PAGE,
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
    FblRow
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import momentUtil from "@/assets/config/MomentUtil";
import validationUtil from "@/assets/config/ValidationUtil";
import RoleSettingForm from "@/components/shared/form/roleSettingForm/RoleSettingForm.vue";
import message from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { RoleSearchForm, RoleSettingValidateObject } from "@/pages/roleSetting/model";
import RoleGroupForm from "@/components/shared/form/roleGroupForm/RoleGroupForm.vue";
import UserUpdateForm from "@/components/shared/form/userUpdateForm/UserUpdateForm.vue";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import messageUtil from "@/assets/config/MessageUtil";
import { Modal } from "ant-design-vue";
import VlidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";


@Component({
    components: { FblDataGrid, RoleSettingForm, HiddenFolde, RoleGroupForm, UserUpdateForm }
})
export default class RoleSettingPage extends Vue {

    exportDisable: boolean = true;

    // 角色代碼與名稱對照表
    roleIdToNameMap: Map<string, string> = new Map();
    roleNameToIdMap: Map<string, string> = new Map();

    // form modal
    updateChangeForm: RoleDto = null;
    columnRoleId: string = '';

    //該角色是否停用
    isRoleEnable: boolean = false;

    //API是否成功
    isGetAllUserSuccess: boolean = false;
    isGetUserByRoleIdSuccess: boolean = false;
    // 停用文字
    disableText:string = "";

    // 彈跳視窗 Model 參數
    modelParams = {
        // 角色異動
        roleSetting: {
            formVisible: false,
            titleText: ''
        },
        // 角色群組
        roleGroup: {
            formVisible: false,
            titleText: ''
        },
        roleUser: {
            formVisible: false,
            titleText: ''

        }
    }

    roleSettingValidateObject: RoleSettingValidateObject = {
        id: { feedback: false, hoverVisible: false },
        name: { feedback: false, hoverVisible: false },
    }

    // form modal
    formRoleVisible = false;
    roleSearchForm: RoleSearchForm = {
        id: "",
        name: "",
        roleDesc: "",
        group: "",
        status: "",
    };

    roleSearchFormFilter: RoleSearchForm = {
        id: "",
        name: "",
        roleDesc: "",
        group: "",
        status: "",
    };

    // ===================================== 下拉式表單 ========================================================

    // 角色代碼下拉選單
    selectIdOptions: Option[] = [{ label: this.$t('global_all').toString(), value: "" }];
    // 角色名稱下拉選單
    selectNameOptions: Option[] = [{ label: this.$t('global_all').toString(), value: "" }];
    // 狀態下拉選單
    selectStatusOptions: Option[] = [{ label: this.$t('global_all').toString(), value: "" }];
    // 群組下拉選單
    selectGroupOptions: Option[] = [{ label: "請選擇", value: "" }];

    // ===================================== 下拉式表單 ========================================================

    // From 欄位條件篩選
    roleSearchRules: { [key: string]: ValidationRule[] } = {
        // roleDesc: [{ validator: this.validateDesc, trigger: "blur" }],
        id: [{ validator: this.validateId, trigger: "blur" }],
        name: [{ validator: this.validateName, trigger: "blur" }],
    };

    // 角色資料篩選
    roleFormFilters: FblFilters;

    // 角色資料顯示設定
    grid: FblPDataGridHolder<RoleDto> = {
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
                        title: this.$t("global_edit").toString(),
                        edit: true
                    }
                ]
            },
            {
                type: FblColumnType.PLAIN,
                property: "id",
                title: this.$t('roleSP_roleCodeName').toString(), // 角色代碼
                sorter: true
            },
            {
                type: FblColumnType.PLAIN,
                property: "roleName",
                title: this.$t("roleSP_roleName").toString(), // 角色名稱
                sorter: true
            },
            {
                type: FblColumnType.PLAIN,
                property: "roleDesc",
                title: this.$t('roleSF_description').toString(), // 描述
            },
            {
                type: FblColumnType.ACTION,
                title: this.$t('roleSP_functionSetting').toString(), // 功能設定
                actions: [
                    {
                        name: "functionSetting",
                        title: this.$t('global_setting').toString(),
                        setting: true
                    }
                ]
            },
            {
                type: FblColumnType.ACTION,
                title: this.$t('roleSP_userSetting').toString(), // 使用者設定
                actions: [
                    {
                        name: "userSetting",
                        title: this.$t('global_setting').toString(),
                        setting: true
                    }
                ]
            },
            {
                type: FblColumnType.BADGE,
                property: "status",
                title: this.$t("global_status").toString(), // 狀態
                formatter: (data: RoleDto) => {
                    switch (data.status) {
                        case "Y":
                            return this.$t('global_effective').toString(); // 有效
                        case "N":
                            return this.$t('global_deactivate').toString(); // 停用
                        default:
                            return null;
                    }
                },
                badgeColor: (data: RoleDto) => {
                    switch (data.status) {
                        case "Y":
                            return "green";
                        case "N":
                            return "red";
                        default:
                            return null;
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createName",
                title: this.$t('roleSP_createName').toString() // 建立人員
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('roleSP_createDate').toString(), // 建立日期
                formatter: (data: RoleDto) => {
                    if (data.createDate) {
                        return momentUtil.transformRoc(data.createDate);
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateName",
                title: this.$t('roleSP_updateName').toString() // 最後異動人員
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('roleSP_updateDate').toString(), // 最後異動日期
                formatter: (data: RoleDto) => {
                    if (data.updateDate) {
                        return momentUtil.transformRoc(data.updateDate);
                    }
                }
            }
        ],
    };

    // ======================================= Event Start =======================================================

    async created() {
        // await this.reload();
        this.roleSearch();
        await this.dropdownDataLoading();
    }

    /**
     * 選擇角色代碼下拉選單
     */
    onSeletRoleId() {
        this.exportDisable = true;
        this.roleSearchForm.name = this.roleIdToNameMap.get(this.roleSearchForm.id);
    }

    /**
     * 選擇角色名稱下拉選單
     */
    onSeletRoleName() {
        this.exportDisable = true;
        this.roleSearchForm.id = this.roleNameToIdMap.get(this.roleSearchForm.name);
    }

    /**
     * 角色新增/編輯表單提交，透過ref呼叫RoleSettingForm的submit()
     * @returns 
     */
    async onFormSubmit() {
        // onFormSubmit() {
        // 等待角色異動成功才做事
        // await new Promise((resolve, reject) => (this.$refs.roleSetting as any).submit());
        if (await (this.$refs.roleSetting as any).validateSubmit()) {
            Modal.confirm({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_save').toString(), //儲存
                content: this.$t('roleSP_confirmDataUpdate').toString(), //確認執行資料更新
                onOk: () => {
                    (this.$refs.roleSetting as any).submit();
                }
            });
        }
    }

    /**
   * 角色新增/編輯表單取消，透過ref呼叫RoleSettingForm的cancel()
   * @returns 
   */
    async onFormCancel() {
        const cancel = await (this.$refs.roleUpdate as any).cancel();

        if (cancel) {
            this.formRoleVisible = false;
        }
        console.log("formRoleVisible", this.formRoleVisible);
    }

    /**
     * 角色表單資料新增
     * @returns 
     */
    addUserDetail() {
        this.modelParams.roleSetting.titleText = this.$t("roleSP_addRole").toString(); // 新增角色        
        this.updateChangeForm = {};
        this.modelParams.roleSetting.formVisible = true;
    }

    /**
     * @description 資料欄位可操作的動作
     * @param e 
     */
    onRoleTableActionClick(e: FblActionEvent<RoleDto>) {
        this.isRoleEnable = (e.row.data.status === 'Y') ? true : false;
        switch (e.action.name) {
            case "edit":
                this.createEditModal(e.row.data);
                break;
            case "functionSetting":
                this.openFunctionSettingFrom(e.row.data);
                break;
            case "userSetting":
                this.data = e.row.data;
                this.openUserSettingFrom(e.row.data);
                break;
        }
    }
    data: RoleDto;
    /**
     * 角色表單資料編輯
     * @param data 單筆角色資料 
     * @returns 
     */
    createEditModal(data: RoleDto) {
        this.modelParams.roleSetting.titleText = this.$t('roleSP_editRole').toString(); // 編輯角色
        this.updateChangeForm = JSON.parse(JSON.stringify(data));
        this.modelParams.roleSetting.formVisible = true;
    }
    roleUsersMockData = [];
    userIdRole = [];
    /**
     * 角色使用者設定
     * @param data 
     */
    async openUserSettingFrom(data: RoleDto) {
        LoadingUtil.show();
        this.roleUsersMockData = [];
        this.userIdRole = [];
        this.isGetAllUserSuccess = false;
        this.isGetUserByRoleIdSuccess = false;
        const getAllUserPromise = this.getAllUserApi(data);
        const getUserRoleByIdPromise = this.getUserRoleByIdApi(data);
        Promise.all([getAllUserPromise, getUserRoleByIdPromise]).then(async () => {
            if (this.isGetAllUserSuccess && this.isGetUserByRoleIdSuccess) {
                if (this.isRoleEnable) {
                    this.modelParams.roleUser.titleText = this.$t("roleSP_userSetting").toString() + " (" + data.id + " " + data.roleName + ")";
                } else {
                    this.modelParams.roleUser.titleText = this.$t('roleSP_userSetting').toString() + " (" + data.id + " " + data.roleName + ")" ;
                    this.disableText = "※" + this.$t('global_deactivate').toString();
                }
                this.modelParams.roleUser.formVisible = true;
            }
        }).finally(() => {
            LoadingUtil.close();
        })
    }

    //取得所有使用者
    async getAllUserApi(data: RoleDto) {
        //所有使用者
        return this.$userApi.getSpecifiedUsersByStatusAndRolesUsingGET(data.id)
            .then((resp: AxiosResponse<StaffDto[]>) => {
                let userList = resp.data;

                userList.forEach(user => {
                    let statusFlag = user.status == StaffDtoStatusEnum.Y ? "有效" : "停用"
                    this.roleUsersMockData.push({
                        key: user.id,
                        title: user.departmentName,
                        account: user.id,
                        name: user.name,
                        status: statusFlag
                    });
                });
                this.isGetAllUserSuccess = true;
            })
            .catch((error) => {
                ErrorModalUtil.modalError(this.$t("roleSP_unauthorized_userId_get_failed").toString());
            });
    }

    //取得已授權使用者
    async getUserRoleByIdApi(data: RoleDto) {
        return this.$userApi.getUsersByRoleIdUsingGET(data.id)
            .then((resp: AxiosResponse<String[]>) => {
                this.userIdRole = resp.data;
                this.isGetUserByRoleIdSuccess = true;
            }).catch((error) => {
                ErrorModalUtil.modalError(this.$t("roleSP_authorized_userId_get_failed").toString());

            })
    }

    async onRoleUserSubmit() {
        if (this.data.status == 'Y') {

            LoadingUtil.show();
            // let test = await new Promise((resolve, reject) => (this.$refs.roleUserForm as any).submit());
            let userRoleIdList = (this.$refs.roleUserForm as any).submit();

            // if (userRoleIdList) {
            //     this.modelParams.roleUser.formVisible = false;
            // }
            let roleId = this.data.id;
            let roleUsersIdListTemp: UserRolesUpdate = {}
            roleUsersIdListTemp.userRolesId = userRoleIdList;
            await this.$roleApi.updateRoleUsersByRoleIdUsingPOST(roleId, roleUsersIdListTemp).
                then(() => {
                    LoadingUtil.close();
                    this.modelParams.roleUser.formVisible = false;
                    message.messageSuccess(this.$t("roleSP_roleUser_setting_success").toString()); //角色使用者設定成功
                })
                .catch((err) => {
                    LoadingUtil.close();
                    ErrorModalUtil.modalError(this.$t("roleSP_roleUser_setting_failed").toString());
                });

            await this.reload();
        } else {
            //已停用的角色無法進行授權異動
            ErrorModalUtil.modalError(this.$t('roleSP_disableRoleCannotModify').toString())
        }
    }


    /**
     * 角色功能設定
     * @param data 
     */
    openFunctionSettingFrom(data: RoleDto) {
        this.columnRoleId = data.id;
        // 功能設定
        if (this.isRoleEnable) {
            this.modelParams.roleGroup.titleText = this.$t('roleSP_functionSetting').toString() + " (" + data.id + " " + data.roleName + ")";
        } else {
            this.modelParams.roleGroup.titleText = this.$t('roleSP_functionSetting').toString() + " (" + data.id + " " + data.roleName + ")" ;
            this.disableText = "※" + this.$t('global_deactivate').toString();
        }
        this.modelParams.roleGroup.formVisible = true;
    }
    // 
    // /**
    //  * 因已無角色刪除功能，故註解，帶未來如恢復此功能在打開
    //  * @param data 單筆角色資料 
    //  * @returns 
    //  * 
    //  * @version 20201/05/27
    //  * @author B1529
    //  */
    // createDeleteModal(data: RoleDto) {
    //     Modal.confirm({
    //         okText: "確定",
    //         cancelText: "取消",
    //         title: "刪除",
    //         content: `確定要刪除 ${data.id} 嗎?`,
    //         onOk: () => {
    //             this.isLoading = true;
    //             this.$roleApi
    //               .deleteUsingDELETE(data.id)
    //               .then((resp) => {
    //                 message.messageSuccess(`Deleted: ${data.id}`);
    //                 this.reload();
    //               })
    //               .catch(console.error)
    //               .finally(() => {
    //                 this.isLoading = false;
    //               });
    //           },
    //     });
    // }

    /**
     * 使用者列表下一頁時維持相同的排序
     * @param e 使用者列表下一頁事件 
     * @returns 
     */
    onPageChange(e: FblPageEvent) {
        if (!VlidationUtil.isEmpty(this.grid.data)) {
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
    }

    /**
     * 角色搜尋
     */
    roleSearch() {
        this.exportDisable = false;
        // 塞入查詢條件
        const id = FiltersUtil.setFilterParam("id", FblOperator.CONTAINS, this.roleSearchForm.id);
        const name = FiltersUtil.setFilterParam("roleName", FblOperator.CONTAINS, this.roleSearchForm.name);
        const roleDesc = FiltersUtil.setFilterParam("roleDesc", FblOperator.CONTAINS, this.roleSearchForm.roleDesc);
        const status = FiltersUtil.setFilterParam("status", FblOperator.EQ, this.roleSearchForm.status);

        // 整理為 Filters
        this.roleFormFilters = FiltersUtil.setFilters(id, name, roleDesc, status);
        //預設顯示第一頁查詢結果
        this.grid.pagination.current = 1;

        this.roleSearchFormFilter = {
            id: this.roleSearchForm.id,
            name: this.roleSearchForm.name,
            roleDesc: this.roleSearchForm.roleDesc,
            group: this.roleSearchForm.group,
            status: this.roleSearchForm.status,
        };
        this.reload();
    }

    dropdownDataLoading() {
        // LoadingUtil.show();
        // 取得角色代碼和角色名稱下拉選單
        //  this.$roleApi.findAllRolesUsingGET()
        //     .then((resp: AxiosResponse<RoleInfoDto[]>) => {
        //         this.selectIdOptions = [{ label: this.$t('global_all').toString(), value: "" }];
        //         this.selectNameOptions = [{ label: this.$t('global_all').toString(), value: "" }];
        //         this.roleIdToNameMap.set("", "");
        //         this.roleNameToIdMap.set("", "");
        //         resp.data.forEach(roleDto => {
        //             this.selectIdOptions.push({
        //                 label: roleDto.id,
        //                 value: roleDto.id
        //             });
        //             this.selectNameOptions.push({
        //                 label: roleDto.roleName,
        //                 value: roleDto.roleName
        //             });
        //             this.roleIdToNameMap.set(roleDto.id, roleDto.roleName);
        //             this.roleNameToIdMap.set(roleDto.roleName, roleDto.id);
        //         });
        //     }).catch((err) => {
        //         console.log(err);
        //     });

        //取得狀態下拉選單
        this.$commonApi.findByTypeIdUsingGET("status")
            .then((res: AxiosResponse<Option[]>) => {
                this.selectStatusOptions = [{ label: this.$t('global_all').toString(), value: "" }];
                this.selectStatusOptions = this.selectStatusOptions.concat(res.data);
            }).catch((err) => {
                console.log(err);
            });

        // 取得群組下拉選單
        // this.$functionApi.findAllFunctionsUsingGET()
        //     .then((res: AxiosResponse<FunctionDto[]>) => {
        //  this.$groupApi.findAllGroupdsIdUsingGET()
        //     .then((res: AxiosResponse<GroupDto[]>) => {
        //         res.data.forEach(functionDto => {
        //             this.selectGroupOptions.push({
        //                 label: functionDto.name,
        //                 value: functionDto.id
        //             });
        //         });
        //     }).catch((err) => {
        //         console.log(err);
        //     });
        // LoadingUtil.close();
    }

    /**
     * 重新載入頁面
     * @returns 
     */
    async reload() {
        const filter = JSON.stringify(this.roleFormFilters);
        LoadingUtil.show();
        // 查詢角色分頁資料
        await this.$roleApi.paginateRolesUsingGET(
            this.grid.pagination.current - 1,
            this.grid.pagination.pageSize,
            filter,
            this.roleSearchFormFilter.group,
            this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined
        ).then((resp) => {
            const p = { ...this.grid.pagination };
            p.total = parseInt(resp.data.totalElements);
            this.grid.data = resp.data.content;
            this.grid.pagination = p;
        })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                LoadingUtil.close();
            });
    }

    /**
     * 匯出搜尋結果
     */
    exportSearchResult() {
        if (!this.exportDisable) {
            if (this.grid.data.length < 1) {
                ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); // 無符合資料，無法匯出
            } else {
                LoadingUtil.show();
                const roleSearchfilter: string = JSON.stringify(this.roleFormFilters);
                this.$roleApi.exportRoleSearchMultipleSheetsUsingGET(
                    roleSearchfilter,
                    this.roleSearchForm.group,
                    { responseType: 'blob' })
                    .then((res) => {
                        // 確認查詢結果是否超出匯出最大限制筆數
                        this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then(exportCheck => {
                            if (exportCheck.data) {
                                if (!exportCheck.data.isOverMaxCount) {
                                    this.dealDownLoadData(res.data, this.$t('roleSP_roleSearchResultXlsx').toString()); // 角色搜尋結果.xlsx
                                    messageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
                                } else {
                                    ErrorModalUtil.modalError(exportCheck.data.errorMessage);
                                }
                            } else {
                                ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()) //匯出失敗
                            }
                        })
                    })
                    .catch((err) => {
                        ErrorModalUtil.modalError(this.$t('roleSP_exportFailure').toString()) // 匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); // 請先執行查詢再匯出
        }
    }

    /**
     * 處理後端回傳的下載內容
     * @param resData 
     * @param fileName 
     */
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
            messageUtil.messageError(this.$t('roleSP_exportFailure').toString()); //匯出失敗
        }
    }

    // /**
    //    * 說明，，篩選條件，不可輸入符號。
    //    * @param rule 驗證規則 
    //    * @param value 說明輸入值 
    //    * @param callback 回乎函數，不帶參數表示驗證成功。
    //    * @returns 
    //    */
    // validateDesc(rule, value, callback) {
    //     this.exportDisable = true;
    //     this.descHover = '';
    //     this.descFeedback = true;
    //     if (!validationUtil.isEmpty(value)) {
    //         if (validationUtil.nameValidation(value)) {
    //             this.stateDesc = 'success';
    //             this.descFeedback = false;
    //             callback();
    //         } else {
    //             this.descHover = 'hover';
    //             this.stateDesc = 'error';
    //             callback(false);
    //         }
    //     } else {
    //         this.stateDesc = null;
    //         this.descFeedback = false;
    //     }
    //     callback();
    // }

    /**
       * 角色名稱，篩選條件，不可輸入符號。
       * @param rule 驗證規則 
       * @param value 使用者姓名輸入值 
       * @param callback 回乎函數，不帶參數表示驗證成功。
       * @returns 
       */
    validateName(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.name, true, "", false);
        if (!validationUtil.isEmpty(value)) {
            if (!validationUtil.nameValidation(value)) {
                callback(() => { });
            } else {
                CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.name, false, "", false);
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.name, false, "", false);
        }
        callback();
    }

    /**
    * 角色代號，篩選條件，僅可輸入英數字與底線。
    * @param rule 驗證規則 
    * @param value 角色代號輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateId(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.id, true, "", false);
        if (!validationUtil.isEmpty(value)) {
            if (!validationUtil.idValidation(value)) {
                callback(() => { });
            } else {
                CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.id, false, "", false);
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.id, false, "", false);
        }
        callback();
    }

    /**
    * 清空篩選條件狀態
    * @returns 
    */
    resetFrom() {
        CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.id, false, "", false);
        CommonUtil.feildValidateWithVisible(this.roleSettingValidateObject.name, false, "", false);
        this.roleSearchForm = {
            id: "",
            name: "",
            roleDesc: "",
            group: "",
            status: "",
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.exportDisable = true;
        // this.reload();
    }

    /**
     * 收起RoleSettingForm
     * @returns 
     */
    async inVisible(val) {
        this.modelParams.roleSetting.formVisible = val;
        await this.dropdownDataLoading();
        await this.reload();
    }

    /**
     * 群組異動送出
     */
    async onFunctionFormSubmit() {
        await new Promise((resolve, reject) => (this.$refs.roleGroupForm as any).submit());
        await this.reload();
    }

    /**
     * 接收群組異動送出
     * @param val 
     */
    onGroupSubmit(val) {
        this.modelParams.roleGroup.formVisible = val;
        this.reload();
    }

    /**
     * 群組搜尋式下拉選單 過濾符合 input 條件的清單
     * @param input 
     * @param option 
     */
    filterGroupOption(input, option) {
        return (option.componentOptions.children[0].text.indexOf(input) >= 0);
    }

    //========================共用驗證相關物件開始===================================

    //取得驗證feedback綁定的參數
    callCommonUtilFeildFeedback(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateFeedback(fv);
    }

    //取得驗證status綁定的參數
    callCommonUtilFeildStatus(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateStatus(fv);
    }

    //取得trigger綁定的參數
    callCommonUtilFeildTrigger(fv: ValidateFormComponent) {
        CommonUtil.getFeildVaildateTrigger(fv);
    }

    //取得hoverVisivle綁定的參數
    callCommonUtilFeildHoverVisible(fv: ValidateFormComponent) {
        return CommonUtil.getFeildVaildateHoverVisible(fv);
    }

    //變更hoverVisivle參數
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    //========================共用驗證相關物件結束===================================
}