import { Vue, Component, Watch } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import messageUtil from "@/assets/config/MessageUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import { AxiosResponse } from "axios";
import { Option, PageOfNotiSettingGrid, NotiSettingGrid, NotiSettingOptionsInit } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import NotiSettingUpdateForm from "@/components/shared/form/notiSettingUpdateForm/NotiSettingUpdateForm.vue"
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import MessageUtil from "@/assets/config/MessageUtil";


@Component({
    components: { FblDataGrid, HiddenFolde, NotiSettingUpdateForm }
})
export default class NotiSettingPage extends Vue {

    /**
  * 初始化電訪照會碼頁面 B1530
  */
    created() {
        this.getNotiSettingOptionsInit();//初始化下拉選單
        this.notiSettingSearch();
    }
    // ===================================== 下拉式選單物件與其事件方法 ========================================================
    //照會主類別下拉選單
    notiMajorTypeOptions: Option[] = [];
    //照會主類別有效下拉選單
    notiMajorTypeEffectiveOptions: Option[] = [];

    //照會次類別下拉選單
    notiMajotSubTypeOptions: Option[] = [];
    //照會次類別有效下拉選單
    notiMajotSubTypeEffectiveOptions: Option[] = [];
    //銀保照會碼下拉選單
    notiBancassuranceOptions: Option[] = [];
    //銀保照會碼有效下拉選單
    notiBancassuranceEffectiveOptions: Option[] = [];
    //狀態下拉選單
    notiSettingStatusOptions: Option[] = [];

    // 主表搜尋條件過濾配合後方specification
    notiSettingFilter: FblFilters = {
        filters: []
    };

    /**
    * 取得下拉選單初始化
    */
    getNotiSettingOptionsInit() {
        this.$notiSettingApi.getNotiSettingSelectOptionsUsingGET()
            .then((resp: AxiosResponse<NotiSettingOptionsInit>) => {
                let retvl = resp.data;
                this.notiMajorTypeOptions = retvl.notiMajorTypeOptions;
                this.notiMajorTypeEffectiveOptions = retvl.notiMajorTypeEffectiveOptions
                this.notiMajotSubTypeOptions = retvl.notiMajorSubTypeOptions;
                this.notiMajotSubTypeEffectiveOptions = retvl.notiMajorSubTypeEffectiveOptions;
                this.notiBancassuranceOptions = retvl.notiBancasuuranceOptions;
                this.notiBancassuranceEffectiveOptions = retvl.notiBancasuuranceEffectiveOptions;
                this.notiSettingStatusOptions = retvl.notiSettingStatusOptions;
            }).catch((error) => {
                console.log(error);
            })
    }



    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
    }
    //   ===============================搜尋Search Event事件===================================


    // =================================grid物件與事件===================================

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<NotiSettingGrid> = {
        rowKey: "notiSettingId",
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
                ],
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('notiSettingPage_notiSetting').toString(),//電訪照會碼 - 使用者定義電訪照會碼
                property: "notiUserSettingId",
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('notiSettingPage_notiSetting').toString(),//電訪照會碼 - 系統使用不顯示
                property: "notiSettingId",
                hidden: true,
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('notiSettingPage_notiMajorType').toString(),//照會主類別
                property: "reviewDescription",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('notiSettingPage_notiMajorSubType').toString(),//照會次類別
                property: "reviewSubTypeDescription",
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('notiSettingPage_notiSettingDescription').toString(),//電訪照會說明
                property: "notiDescription",
            }, {
                type: FblColumnType.PLAIN,
                title:this.$t('notiSettingPage_notiSettingAdditionalContent').toString(),//電訪照會補字內容
                property: "addtional",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('notiSettingPage_notiBancassuranceCode').toString(),//銀保照會代碼
                property: "notiBancassuranceId",
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('global_status').toString(),//狀態
                property: "status",
                formatter: (data: NotiSettingGrid) => {
                    if ("Y" == data.status) {
                        return this.$t('global_effective').toString()
                    } else {
                        return this.$t('global_deactivate').toString()
                    }
                },
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: NotiSettingGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
                formatter: (data: NotiSettingGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },

        ]
    };

    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        this.reload();
    }

    isNotiSettingVisible: boolean = false;
    notiSettingTitle: string = "";
    updateNotiSetting: NotiSettingGrid = {};


    onTableActionClick(e: FblActionEvent<NotiSettingGrid>) {
        this.notiSettingTitle = this.$t("notiSettingPage_modify-notiSetting").toString();
        this.isNotiSettingVisible = true;
        this.updateNotiSetting = e.row.data;
    }

    showNotiSettingAddModal() {
        this.notiSettingTitle =  this.$t("notiSettingPage_create-notiSetting").toString();
        this.isNotiSettingVisible = true;
        this.updateNotiSetting = {};
    }

    notiSettingUpdateFormSubmit() {
        (this.$refs.notiSettingUpdateForm as any).submit();
    }

    notiSettingSearch() {
        const notiMajorTypeId = FiltersUtil.setFilterParam("reviewTypeId", FblOperator.EQ, this.notiSettingSearchForm.notiMajorTypeId);
        const notiMajorSubTypeId = FiltersUtil.setFilterParam("reviewSubTypeId", FblOperator.EQ, this.notiSettingSearchForm.notiMajorSubTypeId);
        const notiSettingId = FiltersUtil.setFilterParam("notiReviewId", FblOperator.CONTAINS, this.notiSettingSearchForm.notiSettingId);
        const notiBancassuranceId = FiltersUtil.setFilterParam("bancassuranceId", FblOperator.EQ, this.notiSettingSearchForm.notiBancassurance);
        const status = FiltersUtil.setFilterParam("status", FblOperator.EQ, this.notiSettingSearchForm.status);
        this.notiSettingFilter = FiltersUtil.setFilters(notiMajorTypeId, notiMajorSubTypeId, notiSettingId, notiBancassuranceId, status);
        this.grid.pagination.current=1;
        this.reload();
    }
    //避免搜尋連按導致無限迴圈的flag
    searchFlag: boolean = true;
    reload() {

        
        if (this.searchFlag) {
            this.searchFlag = false;
            this.exportDisable = false;
            LoadingUtil.show();
            let notiSettingfilterStringtify = JSON.stringify(this.notiSettingFilter);
            this.$notiSettingApi.paginateNotiSettingUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                notiSettingfilterStringtify
            ).then((resp: AxiosResponse<PageOfNotiSettingGrid>) => {
                const p = { ...this.grid.pagination };
                this.grid.data = resp.data.content;
                p.total = parseInt(resp.data.totalElements);
                this.grid.pagination = p;
                
            }).catch(error => {
                console.log(error);
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
    //清除電仿照會碼搜尋結果
    notiSettingSearchReset() {
        this.notiSettingSearchForm = {
            notiMajorTypeId: "", //照會主類別
            notiMajorSubTypeId: "", //照會次類別
            notiSettingId: "", //電訪照會碼
            notiBancassurance: "",//銀保照會碼
            status: "",//狀態
        }
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.exportDisable = true;
    }

    //查詢條件
    notiSettingSearchForm = {
        notiMajorTypeId: "", //照會主類別
        notiMajorSubTypeId: "", //照會次類別
        notiSettingId: "", //電訪照會碼
        notiBancassurance: "",//銀保照會碼
        status: "",//狀態
    };

    @Watch('notiSettingSearchForm.notiMajorTypeId')
    onNotiMajorTypeIdChange() {
        this.exportDisable = true;
    }

    @Watch('notiSettingSearchForm.notiMajorSubTypeId')
    onNotiMajorSubTypeIdChange() {
        this.exportDisable = true;
    }

    @Watch('notiSettingSearchForm.notiSettingId')
    onNotiSettingIdChange() {
        this.exportDisable = true;
    }

    @Watch('notiSettingSearchForm.notiBancassurance')
    onNotiBancassuranceChange() {
        this.exportDisable = true;
    }

    @Watch('notiSettingSearchForm.status')
    onStatusChange() {
        this.exportDisable = true;
    }




    exportDisable: boolean = true;
    //匯出notiSetting
    exportNotiSetting() {

        if (!this.exportDisable) {
            if (this.grid.data.length < 1) {
                ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); // 無符合資料，無法匯出
            } else {
                LoadingUtil.show();
                const notiSettingFilterString: string = JSON.stringify(this.notiSettingFilter);
                this.$notiSettingApi.exportNotiSettingUsingPOST(
                    this.grid.pagination.current - 1,
                    this.grid.pagination.pageSize,
                    notiSettingFilterString,
                    { responseType: 'blob' })
                    .then((res) => {
                        // 確認查詢結果是否超出匯出最大限制筆數
                        this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then(exportCheck => {
                            if (exportCheck.data) {
                                if (!exportCheck.data.isOverMaxCount) {
                                    this.dealDownLoadData(res.data, this.$t('notiSettingPage_notiSettingResearchResult.xlsx').toString()); // 電訪照會碼搜尋結果.xlsx
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

}

