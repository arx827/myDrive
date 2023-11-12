import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { default as loadingUtil, default as LoadingUtil } from "@/assets/config/LoadingUtil";
import { default as message, default as messageUtil } from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { default as validationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder
} from "@/components/shared/data-grid/models";
import { FblFilter, FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import RoleUpdateForm from "@/components/shared/form/roleUpdateForm/RoleUpdateForm.vue";
import UserForm from "@/components/shared/form/userForm/UserForm.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { UserMaintainValidateObject, UserSearchForm } from "@/pages/userMaintain/model";
import { LoginModule } from "@/plugins/store/LoginModule";
import { LoadUserDiviDto, Option, PageOfUserDto, RoleInfoDto, RoleInfoDtoStatusEnum, UnitDto, UserDto, UserDtoStaffTypeEnum, UserDtoStatusEnum, UserRolesDto, UserRolesUpdate } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
@Component({
    components: { FblDataGrid, RoleUpdateForm, UserForm, HiddenFolde }
})
export default class UserMaintainPage extends Vue {
    // 載入畫面
    isLoading: boolean = false;

    exportDisable: boolean = true;

    // unitFormOption: Option[];

    //該帳號是否停用
    isUserEnable: boolean = false;

    //使用者角色設定屬性
    userRoleIdListTemp: UserRolesUpdate = {};
    data: UserDto = {};

    userRolesMockData = [];
    userIdRole = [];

    userSearchRules: { [key: string]: ValidationRule[] } = {
        name: [{ validator: this.validateName, trigger: "blur" }],
        userId: [{ validator: this.validateAccount, trigger: "blur" }],
        staffNo: [{ validator: this.validateStaffNo, trigger: "blur" }],
        extensionNo: [{ validator: this.validateExtensionNo, trigger: "blur" }],
    };

    // 使用者搜尋條件及欄位驗證回饋
    userMaintainValidateObject: UserMaintainValidateObject = {
        name: { feedback: false, hoverVisible: false },
        userId: { feedback: false, hoverVisible: false },
        staffNo: { feedback: false, hoverVisible: false },
        extensionNo: { feedback: false, hoverVisible: false },
    }

    selectRoleOptions = [];
    userMaintainSearchForm: UserSearchForm = {
        userId: "",
        name: "",
        deptId: "",
        diviId: "",
        staffNo: "",
        extensionNo: "",
        roles: [],
        staffType: "",
        status: ""
    };
    userMaintainSearchFormFilter: UserSearchForm = {
        userId: "",
        name: "",
        deptId: "",
        diviId: "",
        staffNo: "",
        extensionNo: "",
        roles: [],
        staffType: "",
        status: ""
    };
    selectStaffTypeOptions: Option[] = [
        {
            label: this.$t('global_all').toString(),
            value: ""
        },
        {
            label: this.$t('global_fullTimeJob').toString(),
            value: UserDtoStaffTypeEnum.F
        },
        {
            label: this.$t('userMP_othersJobType').toString(),
            value: UserDtoStaffTypeEnum.P
        },
        // {
        //     label: this.$t('global_prohibit').toString()+this.$t('global_login').toString()+this.$t('global_system').toString(),
        //     value: UserDtoStaffTypeEnum.N
        // }
    ];

    // 狀態下拉
    selectUserStatus = [
        {
            label: this.$t('global_all').toString(),
            value: ""
        },
        {
            label: this.$t('global_effective').toString(),
            value: UserDtoStatusEnum.Y
        }, {
            label: this.$t('global_deactivate').toString(),
            value: UserDtoStatusEnum.N
        }
    ]

    userSearchFilters: FblFilters = {
        filters: []
    };

    // 部門與科別對照關係
    deptToDiviMap = new Map<string, string[]>();
    diviToDeptMap = new Map<string, string>();

    // 部門搜尋下拉式選單資料來源
    selectDeptOptions: Option[] = [{ label: this.$t('global_all').toString(), value: '' }];

    // 科別搜尋下拉式選單資料來源
    selectDiviOptions: Option[] = [{ label: this.$t('global_all').toString(), value: '' }];
    selectDiviOptionsOnSelect: Option[] = [{ label: this.$t('global_all').toString(), value: '' }];

    // 單位驗證後的值
    editingDataUnit: UnitDto = {
        isCurrentUnit: "",
        superiorUnitId: "",
        supervisorEmpId: "",
        supervisorIdNo: "",
        unitCreateDate: "",
        unitId: "",
        unitLevel: "",
        unitName: "",
        unitRevokeDate: "",
        updateDate: "",
        updateId: ""
    };

    // 使用者新增/編輯視窗顯示及編輯資料
    formVisible = false;
    titleText: string = '';
    editingData: UserDto = {
        createDate: "",
        createId: "",
        email: "",
        extensionNo: "",
        // idNo: "",
        leavedDate: "",
        name: "",
        roles: [],
        staffNo: "",
        staffType: null,
        status: null,
        supervisorId: "",
        unitId: "",
        unit: this.editingDataUnit,
        updateDate: "",
        updateId: "",
        userId: ""
    };

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<UserDto> = {
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
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t('global_edit').toString(),
                        edit: true
                    },
                    // {
                    //     name: "delete",
                    //     title: this.$t('global_delete').toString(),
                    //     delete: true
                    // }
                ],
            },
            {
                type: FblColumnType.PLAIN,
                property: "userId",
                title: this.$t('userMP_userAccount').toString(),
                sorter: true
            },
            {
                type: FblColumnType.PLAIN,
                property: "name",
                title: this.$t('userMP_userHumanName').toString(),
                sorter: true
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('global_division').toString(),
                sorter: true,
                property: "unitId",
                formatter(data: UserDto) {
                    if (data.unit) {
                        return `${data.unitId} - ${data.unit.unitName}`;
                    } else {
                        return "";
                    }
                }
            },
            {
                type: FblColumnType.ACTION,
                title: this.$t("global_role").toString(),
                actions: [
                    {
                        name: "roleSetting",
                        title: this.$t('global_setting').toString(),
                        setting: true
                    }
                ]
            },
            {
                type: FblColumnType.PLAIN,
                property: "staffType",
                title: this.$t('userMP_employeeClass').toString(),
                formatter: (data: UserDto) => {
                    switch (data.staffType) {
                        case UserDtoStaffTypeEnum.F:
                            return this.$t('global_fullTimeJob').toString();
                        case UserDtoStaffTypeEnum.P:
                            return this.$t("userMP_othersJobType").toString();
                        case UserDtoStaffTypeEnum.N:
                            return this.$t('userMP_prohibitLoginSystem').toString(); //禁止登入系統
                        default:
                            return null;
                    }
                },
                sorter: true
            }
            , {
                type: FblColumnType.PLAIN,
                property: "aetnaDate",
                title: this.$t("loginPage_aetnaDate").toString(), //到職日
                sorter: true,
                formatter: (data: UserDto) => {
                    if (data.aetnaDate) {
                        return MomentUtil.transformRocYearMonthDay(data.aetnaDate);
                    } else {
                        return ""
                    }
                }
            }
            , {
                type: FblColumnType.PLAIN,
                property: "leavedDate",
                title: this.$t("loginPage_disableDate").toString(), //帳號停用日
                sorter: true,
                formatter: (data: UserDto) => {
                    if (data.leavedDate) {
                        return MomentUtil.transformRocYearMonthDay(data.leavedDate);
                    } else {
                        return ""
                    }
                }
            },
            {
                type: FblColumnType.BADGE,
                property: "status",
                title: this.$t("global_status").toString(), // 狀態
                sorter: true,
                formatter: (data: UserDto) => {
                    switch (data.status) {
                        case UserDtoStatusEnum.Y:
                            return this.$t('global_effective').toString(); // 有效
                        case UserDtoStatusEnum.N:
                            return this.$t('global_deactivate').toString(); // 停用
                        default:
                            return null;
                    }
                },
                badgeColor: (data: UserDto) => {
                    switch (data.status) {
                        case UserDtoStatusEnum.Y:
                            return "green";
                        case UserDtoStatusEnum.N:
                            return "red";
                        default:
                            return null;
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateId",
                title: this.$t('userMP_lastUpdateName').toString(), // 最後異動人員
                sorter: true,
                formatter: (data: UserDto) => {
                    return data.updateName;
                },
            }, {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('userMP_lastUpdateDate').toString(), // 最後異動時間
                sorter: true,
                formatter: (data: UserDto) => {
                    if (data.updateDate) {
                        return MomentUtil.transformRoc(data.updateDate);
                    }
                }
            }
        ]
    };

    // 角色新增/編輯視窗顯示及編輯資料
    formRoleVisible = false;

    // 角色新增/編輯視窗標題
    formRoleModalTile = "";
    // 停用文字
    disableText:string="";

    userSkillForm = {
        userId: '',
        userName: ''
    };

    defaultDeptId = "";
    defaultDiviId = "";

    /**
     * 頁面開啟
     * @returns 
      */
    created() {
        LoadingUtil.show();
        this.defaultDiviId = LoginModule.loginState.me.employee.departmentId;
        this.defaultDeptId = LoginModule.loginState.me.employee.unitIdLevel3;
        const reloadDropdownDataPromise = this.reloadDropdownData();
        reloadDropdownDataPromise.then(() => {
            this.userMaintainSearchForm.deptId = this.defaultDeptId;
            this.onSeletDept();
            this.userMaintainSearchForm.diviId = this.defaultDiviId;
            this.userSearch();
        });
    }

    /**
     * 
     * @returns 載入下拉選單資料
     */
    async reloadDropdownData() {
        const loadDiviPromise = this.loadDivi();
        const loadDeptPromise = this.loadDept();
        return Promise.all([loadDiviPromise, loadDeptPromise])
            .then(async () => {
                if (!VlidationUtil.isEmpty(this.userMaintainSearchForm.diviId)) {
                    let selectedDivis = [];
                    if (!VlidationUtil.isEmpty(this.userMaintainSearchForm.deptId)) {
                        selectedDivis = this.deptToDiviMap.get(this.userMaintainSearchForm.deptId);
                    } else {
                        selectedDivis = this.deptToDiviMap.get(this.defaultDeptId);
                    }
                    if (!VlidationUtil.isEmpty(selectedDivis)) {
                        let selectDiviOptionsOnSelectList = this.selectDiviOptions.filter(o => {
                            return selectedDivis.includes(o.value);
                        });
                        this.selectDiviOptionsOnSelect = [{ label: this.$t('global_all').toString(), value: '' }];
                        this.selectDiviOptionsOnSelect = this.selectDiviOptionsOnSelect.concat(selectDiviOptionsOnSelectList);
                    }
                }
            })
            .catch(e => console.error(e));
    }
    /**
     * 抓取所有User Table裡面全部的部門
     */
    async loadDept() {
        return this.$userApi.findUniqueSuperUnitIdUsingGET().then((res: AxiosResponse<Option[]>) => {
            this.selectDeptOptions = [{ label: this.$t('global_all').toString(), value: '' }];
            this.selectDeptOptions = this.selectDeptOptions.concat(res.data);
            // res.data.forEach(u => {
            // if (u.unitLevel == "03") { // 限制在部級
            // this.selectDeptOptions.push({ label: u.unitName, value: u.unitId })
            // }
            // });
        })
    }

    /**
     * 抓取所有User Table裡面全部的科別
     */
    async loadDivi() {
        // this.unitFormOption = [];
        // this.unitFormOption.push({ label: this.$t('global_select').toString(), value: '' });
        return this.$userApi.findUniqueUnitIdUsingGET().then((res: AxiosResponse<LoadUserDiviDto>) => {
            // res.data.forEach(u => {
            //     // if (u.unitLevel == "04") { // 限制在科級
            //     if (u.unitId == this.defaultDiviId) {
            //         this.userMaintainSearchForm.deptId = u.superiorUnitId;
            //         this.defaultDeptId = u.superiorUnitId;
            //     }
            //     // this.unitFormOption.push({ label: u.unitName, value: u.unitId });
            //     // let diviName = u.unitName.split(" "); // 去除部門名稱
            //     this.selectDiviOptions.push({ label: u.unitName, value: u.unitId });
            //     this.diviToDeptMap.set(u.unitId, u.superiorUnitId);

            //     if (this.deptToDiviMap.get(u.superiorUnitId)) {
            //         this.deptToDiviMap.set(u.superiorUnitId, this.deptToDiviMap.get(u.superiorUnitId).add(u.unitId));
            //     } else {
            //         this.deptToDiviMap.set(u.superiorUnitId, new Set());
            //         this.deptToDiviMap.get(u.superiorUnitId).add(u.unitId);
            //     }
            //     // }
            // });
            this.selectDiviOptions = [{ label: this.$t('global_all').toString(), value: '' }];
            this.selectDiviOptions = this.selectDiviOptions.concat(res.data.selectUserDiviOptions);
            this.diviToDeptMap = new Map(Object.entries(res.data.diviToDeptMap));
            this.deptToDiviMap = new Map(Object.entries(res.data.deptToDiviMap));
            // this.defaultDeptId = this.diviToDeptMap.get(LoginModule.loginState.me.employee.departmentId);
        });
    }

    /**
     * 選擇科別時，部門改為該科別部門
     */
    onSeletDivi() {
        this.exportDisable = true;
        // if (this.userMaintainSearchForm.diviId) {
        //     this.userMaintainSearchForm.deptId = this.diviToDeptMap.get(this.userMaintainSearchForm.diviId);
        // }
    }

    /**
     * 選擇部門時，科別下拉式選單資料改為該部門科別
     */
    onSeletDept() {
        this.exportDisable = true;
        this.userMaintainSearchForm.diviId = "";
        this.selectDiviOptionsOnSelect = [{ label: this.$t('global_all').toString(), value: '' }];
        if (this.userMaintainSearchForm.deptId) {
            let selectedDivis = this.deptToDiviMap.get(this.userMaintainSearchForm.deptId);
            if (!VlidationUtil.isEmpty(selectedDivis)) {
                let selectDiviOptionsOnSelectList = this.selectDiviOptions.filter(o => {
                    return selectedDivis.includes(o.value);
                });
                this.selectDiviOptionsOnSelect = this.selectDiviOptionsOnSelect.concat(selectDiviOptionsOnSelectList);
            }
        } else {
            this.selectDiviOptionsOnSelect = this.selectDiviOptions;
        }
    }

    /**
     * 科別下拉式清單搜尋用(依input過濾顯示符合的清單)
     * @param input 
     * @param option 
     * @returns 
     */
    unitFilterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
     * 部門下拉式清單搜尋用(依input過濾顯示符合的清單)
     * @param input 
     * @param option 
     * @returns 
     */
    deptFilterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
     * 處理搜尋單位下拉選單
     */
    processUnit(): string[] {
        let mappedUnits: string[] = [];
        if (!VlidationUtil.isEmpty(this.userMaintainSearchFormFilter.diviId)) {
            mappedUnits.push(this.userMaintainSearchFormFilter.diviId);
        } else {
            if (this.userMaintainSearchFormFilter.deptId) {
                mappedUnits.push(this.userMaintainSearchFormFilter.deptId);
                if (this.deptToDiviMap.get(this.userMaintainSearchFormFilter.deptId)) {
                    let units = Array.from(this.deptToDiviMap.get(this.userMaintainSearchFormFilter.deptId));
                    mappedUnits = mappedUnits.concat(units);
                }
            }
        }
        return mappedUnits;
    }

    /**
     * 重新載入頁面
     * @returns 
     */
    reload() {
            this.formVisible = false;
            const userSearchfilter: string = JSON.stringify(this.userSearchFilters);
            this.reloadDropdownData();
            let mappedUnits = this.processUnit();
            // 使用者搜尋時的角色下拉式選單中的資料來源
            this.selectRoleOptions = [];
            const findBindedRolesPromise = this.$roleApi.findBindedRolesUsingGET()
                .then((res: AxiosResponse<RoleInfoDto[]>) => {
                    res.data.forEach(role => {
                        if (role.status == RoleInfoDtoStatusEnum.Y) {
                            this.selectRoleOptions.push(
                                {
                                    label: role.roleName,
                                    value: role.id
                                }
                            );
                        }
                    });
                    // 使用者列表的資料來源
                }).catch((err) => {
                    console.error(err);
                });

        const paginateUsersPromise = this.$userApi.paginateUsersUsingPOST(
            {
                page : this.grid.pagination.current - 1,
                size : this.grid.pagination.pageSize,
                roles : this.userMaintainSearchFormFilter.roles,
                units : mappedUnits,
                filter : this.userSearchFilters
            }, this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined
        ).then((res: AxiosResponse<PageOfUserDto>) => {
            const p = { ...this.grid.pagination };
            p.total = parseInt(res.data.totalElements);

            // 因為個資問題.. API 個資會用 Base64 編碼... 因此需要解碼 
            if(!VlidationUtil.isEmpty(res.data.content)){
                res.data.content.forEach(user => user.email = !VlidationUtil.isEmpty(user.email) ? atob(user.email) : user.email );
            }

            this.grid.data = res.data.content;
            this.grid.pagination = p;
        }).catch((err) => {
            console.error(err);
        })

        return Promise.all([findBindedRolesPromise, paginateUsersPromise]);
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
     * 匯出搜尋結果
     */
    exportSearchResult() {
        if (!this.exportDisable) {
            if (this.grid.data.length < 1) {
                ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合資料，無法匯出
            } else {
                LoadingUtil.show();
                const userSearchfilter: string = JSON.stringify(this.userSearchFilters);
                let mappedUnits = this.processUnit();
                this.$userApi.exportUserSearchResultUsingGET(
                    userSearchfilter,
                    this.userMaintainSearchForm.roles,
                    this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                    mappedUnits,
                    { responseType: 'blob' })
                    .then((res) => {
                        // 確認查詢結果是否超出匯出最大限制筆數
                        this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then(exportCheck => {
                            if (exportCheck.data) {
                                if (!exportCheck.data.isOverMaxCount) {
                                    this.dealDownLoadData(res.data, this.$t('userMP_exportFileName').toString()); // 使用者搜尋結果.xlsx
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
                        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()) //匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
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
            messageUtil.messageError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

    /**
     * 使用者列表事件觸發選項
     * @param e 單筆使用者資料觸發事件 
     * @returns 
     */
    onUserTableActionClick(e: FblActionEvent<UserDto>) {
        this.data = e.row.data;
        this.isUserEnable = (e.row.data.status === 'Y')? true: false;
        switch (e.action.name) {
            case "delete":
                this.userDelete(e.row.data);
                break;
            case "edit":
                this.showUserEditModal(this.data);
                break;
            case "roleSetting":
                this.openRoleUpdate(this.data);
                break;
        }
    }

    /**
     * 使用者列表下一頁時維持相同的排序
     * @param e 使用者列表下一頁事件 
     * @returns 
     */
    onPageChange(e: FblPageEvent) {
        if (!VlidationUtil.isEmpty(this.grid.data)) {
            LoadingUtil.show();
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload().catch(e => console.error(e)).finally(() => LoadingUtil.close());
        }
    }

    /**
     * 使用者列表單筆資料刪除
     * @param data 使用者列表單筆資料 
     * @returns 
     */
    userDelete(data: UserDto) {
        Modal.confirm({
            okText: this.$t('global_ok').toString(),
            cancelText: this.$t('global_cancel').toString(),
            title: this.$t('global_delete').toString(),
            content: this.$t('eventS_confirmDelete').toString() + ' ' + data.userId + ' ?',
            onOk: () => {
                this.$userApi.deleteUserUsingPOST(data.userId).then(() => {
                    message.messageSuccess(this.$t('userMP_userDeleteSuccess').toString());
                }).catch((error) => {
                    // console.log("error status = ", error.status);
                    message.messageError(this.$t('userMP_userDeleteFailure').toString());
                }).finally(() => {
                    LoadingUtil.show();
                    this.reload().catch(e => console.error(e)).finally(() => LoadingUtil.close());
                });
            }
        });
    }

    /**
     * 使用者列表單筆資料編輯
     * @param data 使用者列表單筆資料 
     * @returns 
     */
    showUserEditModal(data: UserDto) {
        this.formVisible = true;
        this.titleText = this.$t('userMP_editUser').toString();
        this.editingData = data;
    }

    /**
     * 使用者列表單筆資料新增
     * @returns 
     */
    showUserAddModal() {
        this.formVisible = true;
        this.titleText = this.$t('userMP_addUser').toString();
        this.editingData = {
            createDate: "",
            createId: "",
            email: "",
            extensionNo: "",
            // idNo: "",
            leavedDate: "",
            name: "",
            roles: [],
            staffNo: "",
            staffType: null,
            status: null,
            supervisorId: "",
            unitId: "",
            unit: this.editingDataUnit,
            updateDate: "",
            updateId: "",
            userId: ""
        };
    }

    /**
     * 使用者搜尋條件清除
     * @returns 
     */
    resetUserSearchForm() {
        this.userMaintainSearchForm = {
            userId: "",
            name: "",
            deptId: this.defaultDeptId,
            diviId: "",
            staffNo: "",
            extensionNo: "",
            roles: [],
            staffType: "",
            status: ""
        };
        this.onSeletDept();
        this.userMaintainSearchForm.diviId = this.defaultDiviId;
        this.resetValidation()
        this.grid.data = [];
        this.exportDisable = true;
        this.grid.data = [];
        this.grid.pagination.total = 0;
    }

    /**
     * 重設欄位驗證相關變數
     * @returns 
     */
    resetValidation() {
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.userId, false, "", false)
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.name, false, "", false)
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.staffNo, false, "", false)
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.extensionNo, false, "", false)
    }

    /**
     * 使用者列表單筆資料新增/編輯表單提交
     * @returns 
     */
    async userModalSubmit() {
        // 執行UserForm.ts中的onFormSubmit()方法
        await (this.$refs.userForm as any).onFormSubmit();
    }

    /**
     * 使用者列表單筆資料新增/編輯表單取消
     * @returns 
     */
    userModalCancel() {
        // 執行UserForm.ts中的reset()方法
        (this.$refs.userForm as any).reset();
    }

    /**
     * 使用者搜尋，姓名驗證。使用者姓名不可輸入符號。
     * @param rule 驗證規則 
     * @param value 使用者搜尋姓名輸入值 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateName(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.name, true, "", false)
        if (value) {
            if (validationUtil.nameValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.name, false, "", false)
                callback();
            } else {
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.name, false, "", false)
        }
        callback();
    }

    /**
     * 使用者搜尋，帳號驗證。使用者帳號僅可輸入英數字。
     * @param rule 驗證規則 
     * @param value 使用者搜尋帳號輸入值 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateAccount(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.userId, true, "", false)
        this.exportDisable = true;
        if (value) {
            if (validationUtil.accountValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.userId, false, "", false)
                callback();
            } else {
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.userId, false, "", false)
        }
        callback();
    }

    /**
     * 使用者搜尋，員工編號驗證。使用者員工編號僅可輸入數字。
     * @param rule 驗證規則 
     * @param value 使用者搜尋員工編號輸入值 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateStaffNo(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.staffNo, true, "", false)
        this.exportDisable = true;
        if (value) {
            if (validationUtil.staffNoValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.staffNo, false, "", false)
                callback();
            } else {
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.staffNo, false, "", false)
        }
        callback();
    }

    /**
     * 使用者搜尋，分機驗證。使用者分機僅可輸入數字。
     * @param rule 驗證規則 
     * @param value 使用者搜尋分機輸入值 
     * @param callback 回乎函數，不帶參數表示驗證成功。
     * @returns 
     */
    validateExtensionNo(rule, value, callback) {
        CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.extensionNo, true, "", false)
        this.exportDisable = true;
        if (value) {
            if (validationUtil.extensionNoValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.extensionNo, false, "", false)
                callback();
            } else {
                callback(() => { });
            }
        } else {
            CommonUtil.feildValidateWithVisible(this.userMaintainValidateObject.extensionNo, false, "", false)
        }
        callback();
    }

    selectionChange() {
        this.exportDisable = true;
    }

    /**
     * 使用者條件搜尋
     * @returns 
     */
    userSearch() {
        LoadingUtil.show();
        this.exportDisable = false;
        // 塞入查詢條件
        const userId = FiltersUtil.setFilterParam("userId", FblOperator.EQ, this.userMaintainSearchForm.userId.toUpperCase());
        const name = FiltersUtil.setFilterParam("name", FblOperator.CONTAINS, this.userMaintainSearchForm.name);
        const staffType = FiltersUtil.setFilterParam("staffType", FblOperator.EQ, this.userMaintainSearchForm.staffType);
        const status = FiltersUtil.setFilterParam("status", FblOperator.EQ, this.userMaintainSearchForm.status);
        const staffNo = FiltersUtil.setFilterParam("staffNo", FblOperator.EQ, this.userMaintainSearchForm.staffNo);
        const extensionNo = FiltersUtil.setFilterParam("extensionNo", FblOperator.EQ, this.userMaintainSearchForm.extensionNo);

        // 整理為 User Filters
        this.userSearchFilters = FiltersUtil.setFilters(userId, name, staffType, status, staffNo, extensionNo);
        //預設顯示第一頁查詢結果
        this.grid.pagination.current = 1;

        this.userMaintainSearchFormFilter = {
            userId: this.userMaintainSearchForm.userId,
            name: this.userMaintainSearchForm.name,
            deptId: this.userMaintainSearchForm.deptId,
            diviId: this.userMaintainSearchForm.diviId,
            staffNo: this.userMaintainSearchForm.staffNo,
            extensionNo: this.userMaintainSearchForm.extensionNo,
            roles: this.userMaintainSearchForm.roles,
            staffType: this.userMaintainSearchForm.staffType,
            status: this.userMaintainSearchForm.status,
        };

        this.reload().catch(e => console.error(e)).finally(() => LoadingUtil.close());
    }

    /**
     * 使用者搜尋，準備搜尋條件物件。
     * @param entityField 搜尋欄位 
     * @param searchCondition 搜尋條件，如相等、包含等。 
     * @param inputValue 搜尋條件值
     * @returns 
     */
    prepareFblFilter(entityField: string, searchCondition: FblOperator, inputValue: string): FblFilter {
        return {
            property: entityField,
            operator: searchCondition,
            operand: [inputValue]
        }
    }

    // ======================================= Role Start =======================================================

    //判斷是true，彈出RoleUpdate
    openRoleUpdate(data: any) {
        LoadingUtil.show();
        this.formRoleVisible = true;
        if (this.isUserEnable) {
            this.formRoleModalTile = this.$t('userMP_roleSetting').toString() + " (" + data.userId + " " + data.name + ")";
        } else {
            this.formRoleModalTile = this.$t('userMP_roleSetting').toString() + " (" + data.userId + " " + data.name + ")";
            this.disableText = "※" + this.$t('global_deactivate').toString()
        }
        this.userIdRole = [];
        this.userRolesMockData = [];
        //所有角色
        const findAllRolesPromise = this.$roleApi.findAllRolesUsingGET()
            .then((res: AxiosResponse<RoleInfoDto[]>) => {
                let rolesSet = res.data;
                rolesSet.forEach(i => {
                    if (i.status == "Y") {
                        this.userRolesMockData.push(
                            {
                                key: i.id,
                                title: i.id,
                                description: i.roleName,
                            });
                    }
                });

            })
            .catch((error) => {
                ErrorModalUtil.modalError(this.$t('reviewSP_all_roles_failed').toString());
            })

        //根據使用者id找到其資料庫內的roles
        const findRolesByUserIdPromise = this.$roleApi.findRolesByUserIdUsingGET(data.userId).
            then((res: AxiosResponse<UserRolesDto>) => {

                let userRolesSet = res.data.roles;
                userRolesSet.forEach(i =>
                    this.userIdRole.push(
                        i.id
                    )
                )
            }).catch((error) => {
                ErrorModalUtil.modalError(this.$t('reviewSP_unauthorized_roles_failed').toString());
            });

            Promise.all([findAllRolesPromise, findRolesByUserIdPromise]).finally(() => LoadingUtil.close());
    }

    onRoleFormSubmit() {
        LoadingUtil.show();
        let userRoleIdList = (this.$refs.roleUpdate as any).submit();
        this.userRoleIdListTemp.userRolesId = userRoleIdList;
        this.$userApi.updateRolesByUserIdUsingPOST(this.data.userId, this.userRoleIdListTemp).
            then(() => {
                this.reload()
                .then(() => message.messageSuccess(this.$t('userMP_roleUpldatSuccess').toString())) //使用者角色設定成功
                .catch(e => console.error(e)).finally(() => {
                    LoadingUtil.close();
                    this.formRoleVisible = false;
                });
            })
            .catch((err) => {
                ErrorModalUtil.modalError(this.$t('global_data_save_failed').toString());
                LoadingUtil.close();
                this.formRoleVisible = false;
            })
    }


    onRoleFormCancel() {
        const test = (this.$refs.roleUpdate as any).cancel();

        if (test) {
            this.formRoleVisible = false;
        }

    }

    getUserRoles(userId: string) {
        this.$roleApi.findRolesByUserIdUsingGET(userId).then((res: AxiosResponse<UserRolesDto>) => {
            return res.data.roles;
        })
    }
}