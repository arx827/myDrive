import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import messageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder
} from "@/components/shared/data-grid/models";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import AgentForm from "@/components/shared/form/agentForm/AgentForm.vue";
import RoleUpdateForm from "@/components/shared/form/roleUpdateForm/RoleUpdateForm.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { AgentSearchForm } from "@/pages/agentSetting/model";
import { LoginModule } from "@/plugins/store/LoginModule";
import { DivisionUsersDto, LoadUserDiviDto, Option, PageOfUserAgentDto, UserAgentDto, UserAgentDtoIsAgentActivatedEnum, UserAgentDtoStatusEnum, UserDto, UserDtoIsAgentActivatedEnum, UserIsAgentActivatedEnum } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
@Component({
    components: { FblDataGrid, RoleUpdateForm, AgentForm, HiddenFolde }
})
export default class AgentSettingPage extends Vue {
    // 要搜尋過才能匯出
    exportDisable: boolean = true;

    // 預設帶入使用者資訊至使用者部門及科別
    defaultDeptId = "";
    defaultDiviId = "";

    // 代理人搜尋表單
    agentSearchForm: AgentSearchForm = {
        userDeptId: [],
        userDiviId: [],
        userAccount: [],
        agentDeptId: [],
        agentDiviId: [],
        agentAccount: [],
        isStaffNoAgentOnly: false,
        isAgentActivate: false,
    };

    // 代理人搜尋表單搜尋
    agentSearchFormFilter: AgentSearchForm = {
        userDeptId: [],
        userDiviId: [],
        userAccount: [],
        agentDeptId: [],
        agentDiviId: [],
        agentAccount: [],
        isStaffNoAgentOnly: false,
        isAgentActivate: false,
    };

    // 部門、科別和科員的對照關係(使用者與代理人可以共用，因為使用者範圍大於等於代理人)
    deptToDiviMap = new Map<string, string[]>();
    diviToDeptMap = new Map<string, string>();
    diviToUserMap = new Map<string, UserDto[]>();

    // 使用者搜尋下拉式選單資料來源
    selectUserDeptOptions: Option[] = [];
    selectUserDiviOptions: Option[] = [];
    selectUserOptions: Option[] = [];
    // 使用者搜尋下拉式選單資料來源會因為其他選單選擇而有所改變
    selectUserDiviOptionsOnSelect: Option[] = [];
    selectUserOptionsOnSelect: Option[] = [];

    // 代理人搜尋下拉式選單資料來源
    selectAgentDeptOptions: Option[] = [];
    selectAgentDiviOptions: Option[] = [];
    selectAgentOptions: Option[] = [];
    // 代理人搜尋下拉式選單資料來源會因為其他選單選擇而有所改變
    selectAgentDiviOptionsOnSelect: Option[] = [];
    selectAgentOptionsOnSelect: Option[] = [];

    // 科別代號與名稱一對一映射
    unitIdToUnitName: Map<string, string> = new Map();

    // 搜尋過濾器
    agentSearchFilters: FblFilters = {
        filters: []
    };

    /**
     * 頁面開啟
     * @returns 
     */
    async created() {
        LoadingUtil.show();
        this.agentSearchFormFilter.userDiviId.push(LoginModule.loginState.me.employee.departmentId);
        this.agentSearchFormFilter.agentDiviId.push(LoginModule.loginState.me.employee.departmentId);
        // 要確保以下資料抓完，否則使用者登入後直奔代理人設定表單會出錯。
        // 抓取所有User Table裡面全部的部門
        // const loadUserDeptPomise = this.loadUserDept();
        // 抓取所有User Table裡面全部的科別
        // 部門與科別的相互對應Map由此建立
        // const loadUserDiviPomise = this.loadUserDivi();
        // 載入所有科級單位及其對應的科員們的Map
        // const loadDiviUsersPomise = this.loadDiviUsers();
        // Promise.all([loadUserDeptPomise, loadUserDiviPomise, loadDiviUsersPomise])
        //     .then(() => this.agentSearch())
        //     .catch(e => console.error(e));

        // this.loadAgentDept();
        // this.loadAgentDivi();
        await this.loadUserDept();
        await this.loadUserDivi();
        await this.loadDiviUsers();
        this.agentSearch();
    }

    /**
     * 下拉式清單搜尋用(依input過濾顯示符合的清單)
     * @param input 
     * @param option 
     * @returns 
     */
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
     * 抓取所有User Table裡面全部的部門
     */
    async loadUserDept() {
        return this.$userApi.findUniqueSuperUnitIdUsingGET().then((res: AxiosResponse<Option[]>) => {
            this.selectUserDeptOptions = this.selectUserDeptOptions.concat(res.data);
            this.selectAgentDeptOptions = this.selectAgentDeptOptions.concat(res.data);
            // res.data.forEach(u => {
            //     if (u.unitLevel == "03") { // 限制在部級
            //         this.selectUserDeptOptions.push({ label: u.unitName, value: u.unitId });
            //         this.selectAgentDeptOptions.push({ label: u.unitName, value: u.unitId });
            //     }
            // });
        });
    }

    /**
     * 抓取所有User Table裡面全部的科別
     */
    async loadUserDivi() {
        const state = LoginModule.loginState;
        return this.$userApi.findUniqueUnitIdUsingGET().then((res: AxiosResponse<LoadUserDiviDto>) => {
            // res.data.forEach(u => {
            //     // if (u.unitLevel == "04") { // 限制在科級
            //     // let diviName = u.unitName.split(" "); // 去除部門名稱
            //     this.selectUserDiviOptions.push({ label: u.unitName, value: u.unitId });
            //     // this.selectAgentDiviOptions.push({ label: diviName.length > 1 ? diviName[1] : diviName[0], value: u.unitId });
            //     this.diviToDeptMap.set(u.unitId, u.superiorUnitId);

            //     if (this.deptToDiviMap.get(u.superiorUnitId)) {
            //         this.deptToDiviMap.set(u.superiorUnitId, this.deptToDiviMap.get(u.superiorUnitId).add(u.unitId));
            //     } else {
            //         this.deptToDiviMap.set(u.superiorUnitId, new Set());
            //         this.deptToDiviMap.get(u.superiorUnitId).add(u.unitId);
            //     }
            //     if (u.unitId == state.me.employee.departmentId) {
            //         this.agentSearchForm.userDeptId.push(u.superiorUnitId);
            //         this.agentSearchForm.agentDeptId.push(u.superiorUnitId);
            //         this.defaultDeptId = u.superiorUnitId;
            //     }
            //     // }
            // });
            this.selectUserDiviOptions = res.data.selectUserDiviOptions;
            this.diviToDeptMap = new Map(Object.entries(res.data.diviToDeptMap));
            this.deptToDiviMap = new Map(Object.entries(res.data.deptToDiviMap));

            // let superiorUnitId = this.diviToDeptMap.get(state.me.employee.departmentId);
            this.agentSearchForm.userDeptId.push(state.me.employee.unitIdLevel3);
            this.agentSearchForm.agentDeptId.push(state.me.employee.unitIdLevel3);
            this.defaultDeptId = state.me.employee.unitIdLevel3;

            this.selectAgentDiviOptions = this.selectAgentDiviOptions.concat(this.selectUserDiviOptions);

            this.selectUserDiviOptionsOnSelect = this.selectUserDiviOptions;
            // this.selectAgentDiviOptionsOnSelect = this.selectAgentDiviOptions;
            this.agentSearchForm.userDiviId.push(state.me.employee.departmentId);
            this.agentSearchForm.agentDiviId.push(state.me.employee.departmentId);
            this.defaultDiviId = state.me.employee.departmentId;
            this.renewUserDiviOption();
            this.renewAgentDiviOption();
        });
    }

    /**
     * 載入所有科級單位及其對應的科員們
     */
    async loadDiviUsers() {
        // let agentOption: Map<string, string> = new Map();
        return this.$userApi.getDivisionUsersUsingGET(true).then((resp: AxiosResponse<DivisionUsersDto>) => {
            // resp.data.forEach(d => {
            //     this.diviToUserMap.set(d.divisionId, new Set(d.users));
            //     d.users.forEach(u => {
            //         this.selectUserOptions.push({ label: u.name, value: u.userId });
            //         this.selectAgentOptions.push({ label: u.name, value: u.userId });
            //         // if (u.agent) {
            //         //     // 名字可能重複，故使用ID作為Key值
            //         //     agentOption.set(u.agent.userId, u.agent.name);
            //         // }
            //     });
            // });
            this.selectUserOptions = this.selectUserOptions.concat(resp.data.selectUserOptions);
            this.selectAgentOptions = this.selectUserOptions;
            this.diviToUserMap = new Map(Object.entries(resp.data.diviToUserMap));

            this.renewUserOption();
            // this.selectAgentOptions = [];
            // agentOption.forEach((k, v) => { this.selectAgentOptions.push({ label: k, value: v }) });
            this.selectAgentOptionsOnSelect = this.selectAgentOptions;
            this.renewAgentOption();
        });
    }

    /**
     * 選擇使用者單位時，下級單位選單資料改為該下級單位
     */
    onUserSeletUnit() {
        this.exportDisable = true;
        let allEmpty = true;
        if (this.agentSearchForm.userDeptId && this.agentSearchForm.userDeptId.length > 0) {
            allEmpty = false;
            this.renewUserDiviOption();
            this.renewUserOption();
        }
        if (this.agentSearchForm.userDiviId && this.agentSearchForm.userDiviId.length > 0) {
            allEmpty = false;
            this.renewUserDiviOption();
            this.renewUserOption();
        }
        if (allEmpty) {
            this.selectUserDiviOptionsOnSelect = this.selectUserDiviOptions;
            this.selectUserOptionsOnSelect = this.selectUserOptions;
        }
    }

    /**
     * 更新使用者選項
     */
    renewUserOption() {
        this.selectUserOptionsOnSelect = [];
        let diviUserOption: Map<string, string> = new Map();
        if (this.agentSearchForm.userDiviId && this.agentSearchForm.userDiviId.length > 0) {
            this.agentSearchForm.userDiviId.forEach(userDiviId => {
                this.diviToUserMap.get(userDiviId).forEach(u => {
                    // 名字可能重複，故使用ID作為Key值
                    diviUserOption.set(u.userId, u.name);
                });
            });
        } else if (this.agentSearchForm.userDeptId && this.agentSearchForm.userDeptId.length > 0) {
            this.agentSearchForm.userDeptId.forEach(userDeptId => {
                let selectedDivis = [userDeptId]; // 除了部門下的科別外還包含部門本身
                selectedDivis = selectedDivis.concat(this.deptToDiviMap.get(userDeptId));
                // if (!VlidationUtil.isEmpty(selectedDivis)) {
                selectedDivis.forEach(userDiviId => {
                    let users = this.diviToUserMap.get(userDiviId);
                    if (!VlidationUtil.isEmpty(users)) {
                        users.forEach(u => {
                            // 名字可能重複，故使用ID作為Key值
                            diviUserOption.set(u.userId, u.name);
                        });
                    }
                });
                // } else {
                //     let deptUsers = this.diviToUserMap.get(userDeptId);
                //     if (!VlidationUtil.isEmpty(deptUsers)) {
                //         deptUsers.forEach(u => {
                //             // 名字可能重複，故使用ID作為Key值
                //             diviUserOption.set(u.userId, u.name);
                //         });
                //     }
                // }
            });
        }
        diviUserOption.forEach((k, v) => { this.selectUserOptionsOnSelect.push({ label: k, value: v }) });
        let selectUserOptionsOnSelectValue = this.selectUserOptionsOnSelect.map(user => user.value);
        this.agentSearchForm.userAccount = this.agentSearchForm.userAccount.filter(userAccount => selectUserOptionsOnSelectValue.includes(userAccount));
    }

    /**
     * 更新使用者科別選項
     */
    renewUserDiviOption() {
        this.selectUserDiviOptionsOnSelect = [];
        if (this.agentSearchForm.userDeptId && this.agentSearchForm.userDeptId.length > 0) {
            this.agentSearchForm.userDeptId.forEach(userDeptId => {
                let selectedDivis = this.deptToDiviMap.get(userDeptId);
                let selectUserDiviOptionsOnSelectList = [];
                if (!VlidationUtil.isEmpty(selectedDivis)) {
                    selectUserDiviOptionsOnSelectList = this.selectUserDiviOptions.filter(o => selectedDivis.includes(o.value));
                    this.selectUserDiviOptionsOnSelect = this.selectUserDiviOptionsOnSelect.concat(selectUserDiviOptionsOnSelectList);
                }
            });
            let userDiviOptionValue = this.selectUserDiviOptionsOnSelect.map(u => u.value);
            this.agentSearchForm.userDiviId = this.agentSearchForm.userDiviId.filter(userDiviId => userDiviOptionValue.includes(userDiviId));
        } else {
            this.selectUserDiviOptionsOnSelect = this.selectUserDiviOptions;
        }
    }

    // /**
    //  * 抓取所有User Table裡面全部的代理人部門
    //  */
    // async loadAgentDept() {
    //     await this.$agentApi.findAllAgentsDeptsUsingGET().then((res: AxiosResponse<UnitDto[]>) => {
    //         res.data.forEach(u => {
    //             this.selectAgentDeptOptions.push({ label: u.unitName, value: u.unitId })
    //         });
    //     })
    // }


    // /**
    //  * 抓取所有User Table裡面全部的代理人科別
    //  */
    // async loadAgentDivi() {
    //     await this.$agentApi.findAllAgentsDivisUsingGET().then((res: AxiosResponse<UnitDto[]>) => {
    //         res.data.forEach(u => {
    //             let diviName = u.unitName.split(" "); // 去除部門名稱
    //             this.selectAgentDiviOptions.push({ label: diviName.length > 1 ? diviName[1] : diviName[0], value: u.unitId });
    //         });
    //         this.selectAgentDiviOptionsOnSelect = this.selectAgentDiviOptions;
    //     })
    // }

    /**
     * 選擇使用者單位時，下級單位選單資料改為該下級單位
     */
    onAgentSeletUnit() {
        this.exportDisable = true;
        let allEmpty = true;
        if (this.agentSearchForm.agentDeptId && this.agentSearchForm.agentDeptId.length > 0) {
            allEmpty = false;
            this.renewAgentDiviOption();
            this.renewAgentOption();
        }
        if (this.agentSearchForm.agentDiviId && this.agentSearchForm.agentDiviId.length > 0) {
            allEmpty = false;
            this.renewAgentDiviOption();
            this.renewAgentOption();
        }
        if (allEmpty) {
            this.selectAgentDiviOptionsOnSelect = this.selectAgentDiviOptions;
            this.selectAgentOptionsOnSelect = this.selectAgentOptions;
        }
    }

    /**
     * 更新代理人選項
     */
    renewAgentOption() {
        this.selectAgentOptionsOnSelect = [];
        let diviAgentOption: Map<string, string> = new Map();
        if (this.agentSearchForm.agentDiviId && this.agentSearchForm.agentDiviId.length > 0) {
            this.agentSearchForm.agentDiviId.forEach(agentDiviId => {
                this.diviToUserMap.get(agentDiviId).forEach(u => {
                    // 名字可能重複，故使用ID作為Key值
                    diviAgentOption.set(u.userId, u.name);
                });
            });
        } else if (this.agentSearchForm.agentDeptId && this.agentSearchForm.agentDeptId.length > 0) {
            this.agentSearchForm.agentDeptId.forEach(agentDeptId => {
                let selectedDivis = [agentDeptId]; // 除了部門下的科別外還包含部門本身
                selectedDivis = selectedDivis.concat(this.deptToDiviMap.get(agentDeptId));
                // if (!VlidationUtil.isEmpty(selectedDivis)) {
                selectedDivis.forEach(agentDiviId => {
                    let deptUsers = this.diviToUserMap.get(agentDiviId);
                    if (!VlidationUtil.isEmpty(deptUsers)) {
                        deptUsers.forEach(u => {
                            // 名字可能重複，故使用ID作為Key值
                            diviAgentOption.set(u.userId, u.name);
                        });
                    }
                });
                // } else {
                //     let deptUsers = this.diviToUserMap.get(agentDeptId);
                //     if (!VlidationUtil.isEmpty(deptUsers)) {
                //         deptUsers.forEach(u => {
                //             // 名字可能重複，故使用ID作為Key值
                //             diviAgentOption.set(u.userId, u.name);
                //         });
                //     }
                // }
            });
        }
        diviAgentOption.forEach((k, v) => {
            if (this.selectAgentOptions.map(a => a.value).includes(v)) {
                this.selectAgentOptionsOnSelect.push({ label: k, value: v });
            }
        });
        let selectAgentOptionsOnSelectValue = this.selectAgentOptionsOnSelect.map(user => user.value);
        this.agentSearchForm.agentAccount = this.agentSearchForm.agentAccount.filter(agentAccount => selectAgentOptionsOnSelectValue.includes(agentAccount));
    }

    /**
     * 更新代理人科別選項
     */
    renewAgentDiviOption() {
        this.selectAgentDiviOptionsOnSelect = [];
        if (this.agentSearchForm.agentDeptId && this.agentSearchForm.agentDeptId.length > 0) {
            this.agentSearchForm.agentDeptId.forEach(agentDeptId => {
                let selectedDivis = this.deptToDiviMap.get(agentDeptId);
                if (!VlidationUtil.isEmpty(selectedDivis)) {
                    let selectAgentDiviOptionsOnSelectList = this.selectAgentDiviOptions.filter(o => selectedDivis.includes(o.value));
                    this.selectAgentDiviOptionsOnSelect = this.selectAgentDiviOptionsOnSelect.concat(selectAgentDiviOptionsOnSelectList);
                }
            });
            let agentDiviOptionValue = this.selectAgentDiviOptionsOnSelect.map(u => u.value);
            this.agentSearchForm.agentDiviId = this.agentSearchForm.agentDiviId.filter(agentDiviId => agentDiviOptionValue.includes(agentDiviId));
        } else {
            this.selectAgentDiviOptionsOnSelect = this.selectAgentDiviOptions;
        }
    }

    /**
     * 快速搜尋專用的reset
     */
    fastSearchReset() {
        this.agentSearchForm = {
            userDeptId: this.agentSearchForm.userDeptId, // 【列出未設定代理人清單】及【列出已啟動代理清單】將『使用者部門』納入搜尋條件。
            userDiviId: [],
            userAccount: [],
            agentDeptId: [],
            agentDiviId: [],
            agentAccount: [],
            isStaffNoAgentOnly: false,
            isAgentActivate: false,
        };
        this.grid.data = [];
        this.exportDisable = false;
        this.agentSearchFilters = {
            filters: []
        };
    }

    /**
     *  列出未設定代理人清單快速搜尋
     */
    staffNoAgentOnlySearch() {
        this.fastSearchReset();
        this.agentSearchForm.isStaffNoAgentOnly = true;
        this.agentSearch();
        this.agentSearchForm.isStaffNoAgentOnly = false;
    }

    /**
     *  列出已啟動代理清單快速搜尋
     */
    isAgentActivateSearch() {
        this.fastSearchReset();
        this.agentSearchForm.isAgentActivate = true;
        this.agentSearch();
        this.agentSearchForm.isAgentActivate = false;
    }

    /**
     * 代理人條件搜尋
     * @returns 
     */
    agentSearch() {
        this.exportDisable = false;
        // 塞入查詢條件
        // const userId = FiltersUtil.setFilterParam("userId", FblOperator.CONTAINS, this.agentSearchForm.userAccount.toUpperCase());
        // const agentId = FiltersUtil.setFilterParam("agentId", FblOperator.CONTAINS, this.agentSearchForm.agentAccount.toUpperCase());
        // const unitId = FiltersUtil.setFilterParam("unitId", FblOperator.EQ, this.agentSearchForm.userDiviId);
        const isAgentActivated = FiltersUtil.setFilterParam("isAgentActivated", FblOperator.EQ, this.agentSearchForm.isAgentActivate ? UserIsAgentActivatedEnum.T : null);

        // 整理為 User Filters
        // this.agentSearchFilters = FiltersUtil.setFilters(userId, agentId, unitId, isAgentActivated);
        this.agentSearchFilters = FiltersUtil.setFilters(isAgentActivated);
        //預設顯示第一頁查詢結果
        this.grid.pagination.current = 1;

        this.agentSearchFormFilter = {
            userDeptId: this.agentSearchForm.userDeptId,
            userDiviId: this.agentSearchForm.userDiviId,
            userAccount: this.agentSearchForm.userAccount,
            agentDeptId: this.agentSearchForm.agentDeptId,
            agentDiviId: this.agentSearchForm.agentDiviId,
            agentAccount: this.agentSearchForm.agentAccount,
            isStaffNoAgentOnly: this.agentSearchForm.isStaffNoAgentOnly,
            isAgentActivate: this.agentSearchForm.isAgentActivate,
        };

        this.reload();
    }

    /**
     * 重新載入頁面
     * @returns 
     */
    reload() {
        this.formVisible = false;
        LoadingUtil.show();
        // 使用者列表的資料來源
        const agentSearchFilter: string = JSON.stringify(this.agentSearchFilters);
        this.$agentApi.paginateAgentsUsingGET(
            this.grid.pagination.current - 1,
            this.grid.pagination.pageSize,
            this.agentSearchFormFilter.agentAccount,
            this.agentSearchFormFilter.agentDeptId,
            this.agentSearchFormFilter.agentDiviId,
            agentSearchFilter,
            this.agentSearchFormFilter.isStaffNoAgentOnly,
            this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
            this.agentSearchFormFilter.userAccount,
            this.agentSearchFormFilter.userDeptId,
            this.agentSearchFormFilter.userDiviId
        ).then((res: AxiosResponse<PageOfUserAgentDto>) => {
            const p = { ...this.grid.pagination };
            p.total = parseInt(res.data.totalElements);
            this.grid.data = res.data.content;
            this.grid.pagination = p;
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            LoadingUtil.close();
        });
    }

    // --------------------------------------------------搜尋相關--------------------------------------------------
    /**
    * 使用者搜尋條件清除
    * @returns 
    */
    resetUserSearchForm() {
        this.agentSearchForm = {
            userDeptId: [this.defaultDeptId],
            userDiviId: [this.defaultDiviId],
            userAccount: [],
            agentDeptId: [this.defaultDeptId],
            agentDiviId: [this.defaultDiviId],
            agentAccount: [],
            isStaffNoAgentOnly: false,
            isAgentActivate: false,
        };
        this.renewUserDiviOption();
        this.renewAgentDiviOption();
        this.renewUserOption();
        this.renewAgentOption();
        // this.selectUserDiviOptionsOnSelect = this.selectUserDiviOptions;
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.exportDisable = true;
    }

    /**
     * 群組搜尋式下拉選單 過濾符合 input 條件的清單
     * @param input 
     * @param option 
     */
    filterUnitOption(input, option) {
        return (option.componentOptions.children[0].text.indexOf(input) >= 0);
    }

    // --------------------------------------------------資料呈現--------------------------------------------------
    // 使用者資料顯示設定
    grid: FblPDataGridHolder<UserAgentDto> = {
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
                        title: this.$t("global_edit").toString(),
                        edit: true
                    }
                ],
            },
            {
                type: FblColumnType.TEMPLATE,
                title: this.$t("agentSP_activateAgent").toString(),
                template: "activateAgentTemplate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_userDepartment").toString(),
                // sorter: true,
                property: "unitId",
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.unit && data.unit.unitName ?
                            data.unit.unitName.split(" ")[0] :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_userDivision").toString(),
                // sorter: true,
                property: "unitId",
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.unit && data.unit.unitName ?
                            data.unit.unitName.split(" ")[1] :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_userAccount").toString(),
                sorter: true,
                property: "userId",
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.userId ?
                            data.userId :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_userName").toString(),
                sorter: true,
                property: "name",
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.name ?
                            data.name :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_agentDepartment").toString(),
                // sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.userAgentDto && data.userAgentDto.unit.unitName ?
                            data.userAgentDto.unit.unitName.split(" ")[0] :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentF_agentDivision").toString(),
                // sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.userAgentDto && data.userAgentDto.unit.unitName ?
                            data.userAgentDto.unit.unitName.split(" ")[1] :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_agentAccount").toString(),
                property: "agentId",
                sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.userAgentDto && data.userAgentDto.userId ?
                            data.userAgentDto.userId :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("agentSP_agentName").toString(),
                // sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data) {
                        return data.userAgentDto && data.userAgentDto.name ?
                            data.userAgentDto.name :
                            "";
                    }
                }
            },
            {
                type: FblColumnType.BADGE,
                title: this.$t("agentSP_activate").toString(),
                // sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data.userAgentDto) {
                        switch (data.userAgentDto.isAgentActivated) {
                            case UserAgentDtoIsAgentActivatedEnum.F:
                                return "N"; // 未啟動
                            case UserAgentDtoIsAgentActivatedEnum.T:
                                return "Y"; // 已啟動
                            default:
                                return "N";
                        }
                    } else {
                        return "";
                    }

                },
                badgeColor: (data: UserAgentDto) => {
                    if (data.userAgentDto) {
                        switch (data.userAgentDto.isAgentActivated) {
                            case UserAgentDtoIsAgentActivatedEnum.F:
                                return "green";
                            case UserAgentDtoIsAgentActivatedEnum.T:
                                return "red";
                            default:
                                return "green";
                        }
                    } else {
                        return "";
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "createId",
                title: this.$t('agentSP_createName').toString(),
                sorter: true,
                formatter: (data: UserAgentDto) => {
                    return data.createName;
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('agentSP_createDate').toString(),
                sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data.createDate) {
                        return MomentUtil.transformRoc(data.createDate);
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateId",
                title: this.$t('global_changeStaff').toString(),
                sorter: true,
                formatter: (data: UserAgentDto) => {
                    return data.updateName;
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateDate",
                title: this.$t('global_changeTime').toString(),
                sorter: true,
                formatter: (data: UserAgentDto) => {
                    if (data.updateDate) {
                        return MomentUtil.transformRoc(data.updateDate);
                    }
                }
            }
        ]
    };

    /**
    * 使用者列表事件觸發選項
    * @param e 單筆使用者資料觸發事件 
    * @returns 
    */
    onUserTableActionClick(e: FblActionEvent<UserAgentDto>) {
        switch (e.action.name) {
            case "edit":
                this.showUserEditModal(e.row.data);
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
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
    }

    /**
     * 使用者列表單筆資料編輯
     * @param data 使用者列表單筆資料 
     * @returns 
     */
    showUserEditModal(data: UserAgentDto) {
        // 業務邏輯驗證
        let validForBusiness = true;

        // // 啟動他人代理人需要有ADMIN角色身分
        // if (!LoginModule.loginState.me.roles.map(role => role.id).includes('ADMIN')) {
        //     // 此作業需要系統管理員身分
        //     ErrorModalUtil.modalError(this.$t("agentSP_thisOperationRequiresAdminStatus").toString());
        //     validForBusiness = false;
        // }

        // // 被停用的使用者不能更改代理人
        // if (data.status == UserAgentDtoStatusEnum.N) {
        //     ErrorModalUtil.modalError(this.$t('agentF_agentIsDisable').toString()); // 員工編號無效
        //     validForBusiness = false;
        // }

        if (validForBusiness) {
            this.$userApi.getUserUsingGET(data.userId)
                .then((res: AxiosResponse<UserDto>) => {
                    if (res.data.isAgentActivated == UserDtoIsAgentActivatedEnum.T) {
                        // 您目前正在啟動代理，無法變更代理人
                        ErrorModalUtil.modalError(this.$t('agentSP_noAgentChangeAtActivation').toString());
                    } else {
                        this.formVisible = true;
                        this.editingData = JSON.parse(JSON.stringify(data));
                    }
                });
        }
    }

    /**
     * 是否列出未設定代理人清單
     * @param slotProps 使用者資料 
     * @returns 
     */
    async activateAgent(user: UserAgentDto) {
        if (user.isAgentActivated == UserAgentDtoIsAgentActivatedEnum.T) {
            // 確認是否取消啟動代理
            Modal.confirm({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                // 確認取消代理?
                content: this.$t('agentSP_confirmCancelSurrogate').toString(),
                onOk: async () => {
                    await this.$agentApi.activateAgentUsingPOST(UserAgentDtoIsAgentActivatedEnum.F, user.userId).finally(() => {
                        this.reload();
                    });
                }
            });
        } else {
            // 業務邏輯驗證
            let validForBusiness = true;
            let errorMessage = [];

            // 檢核使用者是否有設定代理人
            if (user.userAgentDto == null) {
                // ErrorModalUtil.modalError(this.$t('agentSP_youHaveNotSetAnAgent').toString());
                errorMessage.push(this.$t('agentSP_youHaveNotSetAnAgent').toString()); // 尚未設定代理人
                validForBusiness = false;
            }

            // 檢查代理人是否停用
            if (user.userAgentDto && user.userAgentDto.status == UserAgentDtoStatusEnum.N) {
                // 代理人帳號已停用，無法代理！
                // ErrorModalUtil.modalError(this.$t('agentF_agentIsDisable').toString());
                errorMessage.push(this.$t('agentF_agentIsDisable').toString()); // 代理人已停用請重新設定代理人

                validForBusiness = false;
            }

            // // 檢查使用者是否停用
            // if (user.status == UserAgentDtoStatusEnum.N) {
            //     errorMessage.push(this.$t('agentF_userIsDisable').toString()); // 員工編號無效
            //     validForBusiness = false;
            // }

            // 檢核使用者自身是否正在代理他人(檢查選擇使用者自身為代理人的使用者們是否啟動代理)
            await this.$agentApi.getUsersWithTheSameAgentUsingGET(user.userId).then((res: AxiosResponse<UserDto[]>) => {
                if (res.data.some(user => user.isAgentActivated == UserDtoIsAgentActivatedEnum.T)) {
                    // 您已有代理他人事件進行中，無法啟動代理!
                    // ErrorModalUtil.modalError(this.$t('agentSP_youAreAnAgent').toString());
                    errorMessage.push(this.$t('agentSP_youAreAnAgent').toString());
                    validForBusiness = false;
                    return;
                }
                // res.data.forEach(user => {
                //     // 檢查使用者們是否有啟動代理
                //     if (user.isAgentActivated == UserDtoIsAgentActivatedEnum.T) {
                //         // 您已有代理他人事件進行中，無法啟動代理!
                //         ErrorModalUtil.modalError(this.$t('agentSP_youAreAnAgent').toString());
                //         validForBusiness = false;
                //         return;
                //     }
                // });
            });

            // 檢核使用者的代理人是否正被代理(檢查自己的代理人是否啟動代理)
            // 找出選擇使用者自身為代理人的使用者們
            if (user.userAgentDto) {
                await this.$userApi.getUserUsingGET(user.userAgentDto.userId).then((res: AxiosResponse<UserDto>) => {
                    // 檢查使用者是否有啟動代理
                    if (res.data.isAgentActivated == UserDtoIsAgentActivatedEnum.T) {
                        // 該代理人已啟動代理,請先更換其他代理人!
                        // ErrorModalUtil.modalError(this.$t('agentSP_theAgentIsAlreadyActivated').toString());
                        errorMessage.push(this.$t('agentSP_theAgentIsAlreadyActivated').toString());
                        validForBusiness = false;
                        return;
                    }
                });
            }

            // await this.$agentApi.getUsersWithTheSameAgentUsingGET(user.userAgentDto.userId).then((res: AxiosResponse<UserDto[]>) => {
            //     res.data.forEach(user => {
            //         // 檢查使用者們是否有啟動代理
            //         if (user.isAgentActivated == UserDtoIsAgentActivatedEnum.T) {
            //             // 該代理人正在代理他人,請先更換其他代理人!
            //             ErrorModalUtil.modalError(this.$t('agentSP_theAgentIsBusy').toString());
            //             validForBusiness = false;
            //             return;
            //         }
            //     })
            // });

            // // 啟動自己需要有A01角色身分、啟動他人代理人需要有ADMIN角色身分
            // if (!(LoginModule.loginState.me.roles.map(role => role.id).includes('A01') && LoginModule.loginState.me.id == user.userId)
            //     || !LoginModule.loginState.me.roles.map(role => role.id).includes('ADMIN')) {
            //     // 僅系統管理員身分或訪員本人可啟動代理
            //     ErrorModalUtil.modalError(this.$t('agentSP_adminOrSelfCanActivateOnly').toString());
            //     validForBusiness = false;
            // }

            // 確認是否啟動代理
            if (validForBusiness) {
                Modal.confirm({
                    okText: this.$t('global_ok').toString(),
                    cancelText: this.$t('global_cancel').toString(),
                    // 確認啟動代理?
                    content: this.$t('agentSP_confirmActivateSurrogate').toString(),
                    onOk: () => {
                        this.$agentApi.activateAgentUsingPOST(UserDtoIsAgentActivatedEnum.T, user.userId).finally(() => {
                            this.reload();
                        });
                    }
                });
            } else {
                ErrorModalUtil.modalListError(errorMessage, null);
            }
        }
    }

    // --------------------------------------------------彈跳視窗--------------------------------------------------
    // 使用者新增/編輯視窗顯示及編輯資料
    formVisible = false;
    editingData: UserAgentDto = {
        name: "",
        unitId: "",
        updateDate: "",
        updateId: "",
        userId: "",
        userAgentDto: null
    };

    /**
     * 使用者列表單筆資料新增/編輯表單提交
     * @returns 
     */
    userModalSubmit() {
        // 執行AgentForm.ts中的onFormSubmit()方法
        (this.$refs.agentForm as any).onFormSubmit();
    }

    /**
     * 使用者列表單筆資料新增/編輯表單取消
     * @returns 
     */
    userModalCancel() {
        // 執行AgentForm.ts中的reset()方法
        (this.$refs.agentForm as any).reset();
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
                const agentSearchFilter: string = JSON.stringify(this.agentSearchFilters);
                this.$agentApi.exportAgentSearchResultUsingGET(
                    this.agentSearchFormFilter.agentAccount,
                    this.agentSearchFormFilter.agentDeptId,
                    this.agentSearchFormFilter.agentDiviId,
                    agentSearchFilter,
                    this.agentSearchFormFilter.isStaffNoAgentOnly,
                    this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,
                    this.agentSearchFormFilter.userAccount,
                    this.agentSearchFormFilter.userDeptId,
                    this.agentSearchFormFilter.userDiviId,
                    { responseType: 'blob' })
                    .then((res) => {
                        // 確認查詢結果是否超出匯出最大限制筆數
                        this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then(exportCheck => {
                            if (exportCheck.data) {
                                if (!exportCheck.data.isOverMaxCount) {
                                    this.dealDownLoadData(res.data, this.$t('agentSP_agentSearchResultXlsx').toString()); // 代理人搜尋結果.xlsx
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
                        ErrorModalUtil.modalError(this.$t('agentSP_exportFailure').toString()) //匯出失敗
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
            messageUtil.messageError(this.$t('agentSP_exportFailure').toString()); //匯出失敗
        }
    }

}