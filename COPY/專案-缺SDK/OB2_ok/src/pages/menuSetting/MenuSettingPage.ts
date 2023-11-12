import { Vue, Component } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { Modal } from "ant-design-vue";
import validationUtil from "@/assets/config/ValidationUtil";
import { FblMenuSettingForm, MenuFormDto } from "@/pages/menuSetting/models";
import MenuForm from "@/components/shared/form/menuForm/MenuForm.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
//import { MenuDto, MenuGrid, UrlResource, Option } from "@fubonlife/obd-api-axios-sdk";
import { MenuDto, MenuGrid, Option } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { AxiosResponse } from "axios";

@Component({
    components: { FblDataGrid, MenuForm, HiddenFolde }
})

export default class MenuSettingPage extends Vue {
    // hover message
    menuIdHover: string = '';
    menuNameHover: string = '';

    //feedback(錯誤時X圖案)
    menuIdFeedback: boolean = false;
    menuNameFeedback: boolean = false;

    // form status(紅框)
    stateMenuId: string = '';
    stateMenuName: string = '';

    //filter初始設定
    menuSearchFilters: FblFilters = {
        filters: []
    };

    //功能名稱/代碼選項(下拉式清單用)
    selectResourceIdOptions = [];

    //父選單名稱/代碼選項(下拉式清單用)
    selectParentMenuIdOptions = [];

    //是否為子選單選項(下拉式清單用)
    selectLeafOptions = [
        {
            value: '',
            label: this.$t('global_all').toString()
        },
        {
            value: "1",
            label: this.$t('global_yes').toString() //是
        },
        {
            value: "0",
            label: this.$t('global_no').toString() //否
        },
    ];

    //是否啟用選項(下拉式清單用)
    selectEnableOptions: Option[] = [];

    // form modal
    formVisible = false;
    resourceFormVisible = false;
    titleText: string = '';

    //新增、修改 form
    menuChangeForm: MenuFormDto = {
        menuId: null,
        menuName: null,
        resourceId: "",
        parentMenuId: "",
        isLeaf: "",
        enable: "",
        sortSequence: null,
    };

    //上方查詢條件 form
    menuSettingForm: FblMenuSettingForm = {
        menuId: null,
        menuName: null,
        resourceId: "",
        parentMenuId: "",
        isLeaf: "",
        enable: "",
    };

    // From 欄位條件篩選
    rules: { [key: string]: ValidationRule[] } = {
        menuId: [{ validator: this.validateMenuId, trigger: "blur" }],
        menuName: [{ validator: this.validateMenuName, trigger: "blur" }],
    };

    // data grid Setting
    grid: FblPDataGridHolder<MenuGrid> = {
        rowKey: "menuId",
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
                        title: this.$t('global_edit').toString(), //編輯
                        edit: true
                    }, {
                        name: "delete",
                        title: this.$t('global_delete').toString(), //刪除
                        delete: true
                    }
                ],
            },
            {
                type: FblColumnType.PLAIN,
                property: "menuId",
                title: this.$t('menuSP_menuCode').toString(), //選單代碼
            },
            {
                type: FblColumnType.PLAIN,
                property: "menuName",
                title: this.$t('menuSP_menuName').toString(), //選單名稱
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('menuSP_functionCode').toString(), //功能代碼
                formatter: (data: MenuGrid) => {
                    return data.resourceId == null ? "一" : data.resourceId;
                },
            },
            {
                type: FblColumnType.BADGE,
                title: this.$t('menuSP_isLeaf').toString(), //是否為子選單
                formatter: (data: MenuGrid) => {
                    //若是true，回傳"是"，false則回傳"否"
                    return data.isLeaf === true ? this.$t('global_yes').toString() : this.$t('global_no').toString();
                },
                badgeColor: (data: MenuGrid) => {
                    return data.isLeaf === false ? "red" : "green";
                },
            },
            {
                type: FblColumnType.BADGE,
                title: this.$t('global_status').toString(), //狀態是否啟用
                formatter: (data: MenuGrid) => {
                    //若是true，回傳"啟用"，false則回傳"不啟用"
                    return data.enable === true ? this.$t('global_effective').toString() : this.$t('global_deactivate').toString();
                },
                badgeColor: (data: MenuGrid) => {
                    return data.enable === false ? "red" : "green";
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('menuSP_parentMenuCode').toString(), //父選單代碼
                formatter: (data: MenuGrid) => {
                    return data.parentMenuId == null ? "一" : data.parentMenuId;
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('menuSP_parentMenuName').toString(), //父選單名稱
                formatter: (data: MenuGrid) => {
                    return data.parentMenuName == null ? "一" : data.parentMenuName;
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "sortSequence",
                title: this.$t('menuSP_arrangeOrder').toString(), //排列順序
            },
        ],
    };

    // ======================================= Event Start =======================================================

    //新增
    addMenuDetail() {
        this.titleText = this.$t('menuSP_menuAdd').toString(); //新增選單
        this.menuChangeForm = {
            menuId: null,
            menuName: null,
            resourceId: "",
            parentMenuId: "",
            isLeaf: "",
            enable: "",
            sortSequence: null,
        };
        this.formVisible = true;
    }

    //判斷編輯或刪除
    onMenuTableActionClick(e: FblActionEvent<MenuDto>) {
        const data = e.row.data;
        switch (e.action.name) {
            case "delete":
                this.createDeleteModal(e.row.data);
                break;
            case "edit":
                this.createEditModal(data);
                break;
        }
    }

    //編輯
    createEditModal(data: MenuDto) {
        this.titleText = this.$t('menuSP_menuEdit').toString(); //編輯選單
        this.menuChangeForm = {
            menuId: data.menuId,
            menuName: data.menuName,
            resourceId: data.resourceId,
            parentMenuId: data.parentMenuId,
            sortSequence: data.sortSequence,
        };
        //若是true回傳'1'，false則回傳'0'
        (data.isLeaf == true) ? this.menuChangeForm.isLeaf = '1' : this.menuChangeForm.isLeaf = '0';
        (data.enable == true) ? this.menuChangeForm.enable = '1' : this.menuChangeForm.enable = '0';
        this.formVisible = true;
    }

    //刪除選單
    createDeleteModal(data: MenuDto) {
        Modal.confirm({
            title: this.$t('global_delete').toString(), //刪除          
            content: this.$t('eventS_confirmDelete').toString() + ` ${data.menuId} ?`, //確定刪除
            okText: this.$t('global_ok').toString(), //確定           
            cancelText: this.$t('global_cancel').toString(), //取消
            onOk: async () => {
                LoadingUtil.show();
                try {
                    LoadingUtil.close();
                    await this.$menuApi.deleteMenuUsingDELETE(data.menuId);
                    MessageUtil.messageSuccess(`${data.menuName}` + this.$t('global_deleteSucess').toString()); //刪除成功
                    this.reload();
                } catch (err) {
                    console.error(err);
                    MessageUtil.messageError(this.$t(err.response.data.apiErrorCode).toString() + "，" + this.$t('global_deleteFailed').toString()); //刪除失敗
                } finally {
                    LoadingUtil.close();
                }
            },
            onCancel: () => { },
        });
    }

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
        );
    }

    //重設表單
    resetFrom() {
        (this.$refs.menuSettingRules as any).resetFields();
        this.menuSearch();
    }

    /**
     * 頁面開啟
     * @returns 
     */
    created() {
        this.reload();
    }

    /**
     * 重新載入頁面
     * @returns 
     */
    async reload() {
        this.formVisible = false;
        this.resourceFormVisible = false;
        LoadingUtil.show();
        // 選單列表的資料來源
        const filter: string = JSON.stringify(this.menuSearchFilters);
        try {
            const resp = await this.$menuApi.paginateUsingGET(this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                filter);
            this.grid.data = resp.data.content;
            const p = { ... this.grid.pagination };
            p.total = parseInt(resp.data.totalElements);
            this.grid.pagination = p;
            LoadingUtil.close();
        } catch (err) {
            console.error(err);
        } finally {
            LoadingUtil.close();
        }
        // 父選單名稱/代碼下拉式清單中的資料來源
        this.selectParentMenuIdOptions = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
        this.$menuApi.findAllParentUsingGET()
            .then((res: AxiosResponse<MenuFormDto[]>) => {
                res.data.forEach(menu => this.selectParentMenuIdOptions.push(
                    {
                        label: menu.menuName,
                        value: menu.menuId
                    }
                ));
            })
            .catch((err) => {
                console.error(err);
            })
        // 功能名稱/代碼下拉式清單中的資料來源
        // this.selectResourceIdOptions = [{ label: this.$t('global_select').toString(), value: '' }]; //請選擇
        // this.$urlResourceApi.findAllUrlResourceUsingGET()
        //     .then((res: AxiosResponse<UrlResource[]>) => {
        //         res.data.forEach(urlResource => this.selectResourceIdOptions.push(
        //             {
        //                 label: urlResource.resourceName,
        //                 value: urlResource.resourceId
        //             }
        //         ));
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     })
        this.selectEnableOptions = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
        this.$commonApi.findByTypeIdUsingGET("status")
            .then((res: AxiosResponse<Option[]>) => {
                res.data.forEach(status => {
                    this.selectEnableOptions.push({label: status.label, value: status.value})
                })
            }).catch((err) => {
                console.log(err);
            });
    }

    /**
     * 選單列表下一頁時維持相同的排序
     * @param e 選單列表下一頁事件 
     * @returns 
     */
    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        this.reload();
    }

    //送出新增/編輯表單
    onFormSubmit(e: MenuDto) {
        (this.$refs.menuForm as any).onFormSubmit();
    }

    //取消新增/編輯表單(關閉新增/編輯表單)
    onFormCalcel() {
        this.formVisible = false;
    }

    //按下查詢按鈕
    menuSearch() {
        // 塞入查詢條件
        const menuId = FiltersUtil.setFilterParam("menuId", FblOperator.CONTAINS, this.menuSettingForm.menuId);
        const menuName = FiltersUtil.setFilterParam("menuName", FblOperator.CONTAINS, this.menuSettingForm.menuName);
        const isLeaf = FiltersUtil.setFilterParam("isLeaf", FblOperator.EQ, validationUtil.isEmpty(this.menuSettingForm.isLeaf) ? this.menuSettingForm.isLeaf : (this.menuSettingForm.isLeaf == true));
        const enable = FiltersUtil.setFilterParam("enable", FblOperator.EQ, validationUtil.isEmpty(this.menuSettingForm.enable) ? this.menuSettingForm.enable : (this.menuSettingForm.enable == 'Y'));
        const parentMenuId = FiltersUtil.setFilterParam("parentMenuId", FblOperator.CONTAINS, this.menuSettingForm.parentMenuId);
        const resourceId = FiltersUtil.setFilterParam("resourceId", FblOperator.CONTAINS, this.menuSettingForm.resourceId);
        // 整理為 Filters
        this.menuSearchFilters = FiltersUtil.setFilters(menuId, menuName, parentMenuId, isLeaf, resourceId, enable);
        //預設顯示第一頁查詢結果
        this.grid.pagination.current = 1;
        this.reload();
    }

    /**
    * 選單代碼，篩選條件，僅可輸入英數字與底線。
    * @param rule 驗證規則 
    * @param value 選單代碼輸入值 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateMenuId(rule, value, callback) {
        this.menuIdFeedback = true;
        this.menuIdHover = '';
        //若非空值，判斷是否符合規定
        if (value) {
            if (!validationUtil.idValidation(value)) {
                this.menuIdHover = 'hover';
                this.stateMenuId = 'error';
                callback(() => { });
            } else {
                this.stateMenuId = 'success';
                this.menuIdFeedback = false;
            }
        } else {
            this.stateMenuId = null;
            this.menuIdFeedback = false;
        }
        callback();
    }

    /**
   * 選單名稱，篩選條件，不可輸入符號。
   * @param rule 驗證規則 
   * @param value 選單名稱輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
    validateMenuName(rule, value, callback) {
        this.menuNameFeedback = true;
        this.menuNameHover = '';
        //若非空值，判斷是否符合規定
        if (value) {
            if (!validationUtil.nameValidation(value)) {
                this.menuNameHover = 'hover';
                this.stateMenuName = 'error';
                callback(() => { });
            } else {
                this.stateMenuName = 'success';
                this.menuNameFeedback = false;
            }
        } else {
            this.stateMenuName = null;
            this.menuNameFeedback = false;
        }
        callback();
    }
}