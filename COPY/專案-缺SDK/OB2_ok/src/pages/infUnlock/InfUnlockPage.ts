import { Vue, Component, Watch } from "vue-property-decorator";
import { default as validationUtil, default as VlidationUtil } from "@/assets/config/ValidationUtil";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { Modal } from "ant-design-vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import { AxiosResponse } from "axios";
import { Option, GetInfUnlockInitDto, InfUnlockGrid, PageOfInfUnlockGrid} from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import "@/assets/less/infPage.less";
import { infUnlockSearchForm } from "@/pages/infUnlock/model";

@Component({
    components: { FblDataGrid, HiddenFolde }
})
export default class InfUnlockPage extends Vue {
    
    // 查詢條件
    infUnlockSearchForm:infUnlockSearchForm = {
        departmentIdList: [],
        divisionIdList: [],
        userId: "",
        userName: ""
    }

    // 部門下拉
    depOptions:Array<Option> = [];
    // 科別下拉
    divOptons:Array<Option> = [];
    // 部門科別資訊
    depUnitInfo = {};
    // 所有科別下拉資訊
    allDivList: Option[] = [];

    // ==================================================== Table ========================================================

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<InfUnlockGrid> = {
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
                        name: "unlock",
                        title: this.$t('global_delete').toString(),
                        unlock: true
                    }
                ],
                width: 60
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('global_department').toString(),//部門
                property: "superiorUnitName",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('global_division').toString(),//科別
                property: "unitName",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('unlockPage_user_account').toString(),//使用者帳號
                property: "userId",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t('unlockPage_user_name').toString(),// "使用者姓名",
                property: "name",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('token_expired_time').toString(),// "系統登出期限"
                property: "tokenExpiredTime",
                formatter: (data: InfUnlockGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.tokenExpiredTime);

                },
            },

        ]
    };

    // ==================================================== Hook =========================================================

    /**
     * 初始化頁面
     */
    created(){
        
        // 載入初始化資料
        this.initData();
    }

    // ==================================================== Event ========================================================

    /**
     * @description 清除
     * 
     * @author B1529
     * @version 2022/05/31
     */
    clear() {
        this.infUnlockSearchForm = {
            departmentIdList: [],
            divisionIdList: [],
            userId: "",
            userName: ""
        }
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.onSelectDept();
    }

    /**
     * @description 下拉式清單搜尋用(依input過濾顯示符合的清單)
     * @param input 
     * @param option 
     * @returns 
     */
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
     * @description 選擇部門時，科別範圍限縮
     */
    onSelectDept(){
        
        this.divOptons = [];
        if (this.infUnlockSearchForm.departmentIdList.length > 0) {

            this.infUnlockSearchForm.departmentIdList.forEach((depId) => {
                
                // 取得部門對應的科別
                if(!ValidationUtil.isEmpty(this.depUnitInfo) && !ValidationUtil.isEmpty(this.depUnitInfo[depId])){
                    this.divOptons = this.divOptons.concat(this.depUnitInfo[depId]);
                }
            });
            
        }else{
            // 科別 下拉
            if(!ValidationUtil.isEmpty(this.allDivList)){
                this.divOptons = Object.assign(this.allDivList);
            }
        }

        //重置科別選項
        let unitIdTempList = Object.assign(this.infUnlockSearchForm.divisionIdList);
        unitIdTempList.forEach((eachSelected)=>{

            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if(!this.divOptons.some((allDiv) => allDiv.value == eachSelected)){

                if(this.infUnlockSearchForm.divisionIdList.length > 0) {
                    this.infUnlockSearchForm.divisionIdList = this.infUnlockSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });
    }

    /**
     * @description 點選 Table 愈操作的動作
     * @param e 
     * 
     * @author B1529
     * @version 2022/06/05
     */
    onTableActionClick(e: FblActionEvent<InfUnlockGrid>) {
        this.unlock(e.row.data);
    }

    /**
     * @description 查詢結果換頁
     * @param e 
     * 
     * @author B1529
     * @version 2022/06/06
     */
    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        console.log(this.grid.sort);
        this.infUnlockSearch();
    }

    // ==================================================== AJAX =========================================================
    
    /**
     * @description 初始化資料
     * 
     * @author B1529
     * @version 2022/06/01
     */
    initData(){

        LoadingUtil.show();
        this.$unlockApi.getInfUnlockInitUsingPOST()
        .then((res:AxiosResponse<GetInfUnlockInitDto>) => {
            
            this.depOptions = res.data.depOptions;      // 部門
            this.divOptons = res.data.divisionOptions;  // 科別
            this.allDivList = res.data.divisionOptions; // 全部科別
            this.depUnitInfo = res.data.depUnitOptions; // 部門對應科別
            LoadingUtil.close();
            // 查詢
            this.infUnlockSearch();
        })
        .catch((err) => {
            console.log(err);
            LoadingUtil.close();
        });
        
    }

    /**
     * @description 會辦解鎖查詢
     * 
     * @author B1529
     * @version 2022/05/31
     */
     infUnlockSearch(){

        LoadingUtil.show();
        this.$unlockApi.paginateInfUnlockUsingPOST({
            departmentIdList : this.infUnlockSearchForm.departmentIdList,
            divisionIdList : this.infUnlockSearchForm.divisionIdList,
            page : this.grid.pagination.current - 1,
            size : this.grid.pagination.pageSize,
            userId : this.infUnlockSearchForm.userId,
            userName : this.infUnlockSearchForm.userName
        }).then((res:AxiosResponse<PageOfInfUnlockGrid>) => {

            const p = { ...this.grid.pagination };
            p.total = !ValidationUtil.isEmpty(res.data) ? parseInt(res.data.totalElements) : 0;
            this.grid.data = !ValidationUtil.isEmpty(res.data) ? res.data.content : [];
            this.grid.pagination = p;
            
            if( ValidationUtil.isEmpty(res.data) ){

                MessageUtil.messageInfo(this.$t('unlockPage_inf_not_found').toString());

            } else if (p.total != 0 && this.grid.data.length ==0 && p.current != 1){
                //若本頁最後一筆，將退回上一頁重新查詢
                p.current = p.current -1;
                this.infUnlockSearch();
            }

        }).catch((err) => {
            ErrorModalUtil.modalError(this.$t('unlockPage_inf_search_error').toString());
        }).finally(() => {
            LoadingUtil.close();
        });
    }
    
    /**
     * @description 解鎖
     * @param data
     * 
     * @author B1529
     * @version 2022/06/05 
     */
     unlock(data:InfUnlockGrid){
        Modal.confirm({
            okText: this.$t('global_yes').toString(),
            cancelText: this.$t('global_no').toString(),
            title: this.$t('unlock').toString(),
            content: this.$t('global_account').toString() + ' : ' + data.userId + data.name + this.$t('unlock_sure').toString(),//帳號林XX是否確定解鎖
            onOk: () => {

                LoadingUtil.show();
                this.$authApi.enforceLogoutUsingPOST(data.userId)
                .then(() => {

                    MessageUtil.messageSuccess(this.$t('unlock_success').toString());
                    // 重新查詢
                    this.infUnlockSearch();

                }).catch((err) => {
                    // /帳號 : 林XX解鎖失敗
                    let errMsg = this.$t('global_account').toString() + ' : ' + data.userId + data.name + this.$t('unlock_failed').toString();
                    ErrorModalUtil.modalError(errMsg);
                    LoadingUtil.close();
                });
            }
        });
    }
}

