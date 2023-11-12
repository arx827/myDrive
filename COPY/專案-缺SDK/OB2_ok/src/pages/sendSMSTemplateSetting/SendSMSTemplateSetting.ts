import ValidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil, { AuthComonent, ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Vue, Component, Watch } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import { AxiosResponse } from "axios";
import { Option,SendTemplateSMSGrid,SendTemplateOptionsInit, PageOfSendTemplateSMSGrid } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import SendTemplateSettingUpdateForm from "@/components/shared/form/sendTemplateSettingUpdateForm/sendTemplateSettingUpdateForm.vue";
import { Modal } from "ant-design-vue";

@Component({
    components: { FblDataGrid, HiddenFolde,SendTemplateSettingUpdateForm}
})
export default class SendSMSTemplateSettingPage extends Vue {

    /**
     * 初始化範本後台頁面 B1350
     */
    created() {
        this.getSendTemplateOptionsInit();//初始化下拉選單
        this.sendSMSTemplateSearch();
    }


    // ===================================== 下拉式選單物件與其事件方法 ========================================================
    //發送對象下拉選單
    sendTargetOptions: Option[] = [];

    // 主表搜尋條件過濾配合後方specification
    sendSMSTemplateSettingFilter: FblFilters = {
        filters: []
    };

    /**
    * 取得下拉選單初始化
    */
     getSendTemplateOptionsInit() {
        this.$sendTemplateApi.getSendTemplateSelectOptionsUsingGET()
            .then((resp: AxiosResponse<SendTemplateOptionsInit>) => {
                let retvl = resp.data;
                this.sendTargetOptions = retvl.sendTargetOptions;
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

    // =================================grid物件與事件===================================

    // 使用者資料顯示設定
    grid: FblPDataGridHolder<SendTemplateSMSGrid> = {
        rowKey: "templateId",
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
                    }
                ],
            },
            {
                type: FblColumnType.TEMPLATE,
                template: "deleteTemp",
                title: "", 
                align: 'center',
                width: CommonUtil.countColumnWidth(2),
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('sendSMSTemplateSettingPage_templateId').toString(),//範本ID
                property: "templateId",
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('sendSMSTemplateSettingPage_sendTarget').toString(),//發送對象英文
                property: "target",
                hidden: true,
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('sendSMSTemplateSettingPage_sendTarget').toString(),//發送對象中文
                property: "targetDesc",
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('sendSMSTemplateSettingPage_codeName').toString(),//範本名稱
                property: "codeName",
            },
            {
                type: FblColumnType.PLAIN,
                title:this.$t('sendSMSTemplateSettingPage_content').toString(),//發送範本
                property: "content",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: SendTemplateSMSGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            }, 
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
                formatter: (data: SendTemplateSMSGrid) => {
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

    //換頁
    onPageChange(e: FblPageEvent) {
        this.grid.pagination = e.pagination;
        this.grid.sort = e.sort;
        this.reload();
    }

   /**
   * 刪除資料
   * @param data 
   */
  deleteRecord(data:SendTemplateSMSGrid) {
    if (!ValidationUtil.isEmpty(data.crud)) {

        console.log('===================>',data.crud.indexOf('D'));

        if(data.crud.indexOf('D')===0){
            console.log("data.crud",data.crud);   
            console.log("data.templateId",data.templateId); 
            this.sendTemplateDelete(data);
        }
    } else {
        console.log("data.crud",data.crud);       
    }
  }


    //查詢條件
    sendSMSTemplateSearchForm = {
        Target: "", //發送對象
        content:"",//範本內文
    };

    exportDisable: boolean = true;

    // @Watch('sendTemplateSettingSearchForm.sendTarget')
    // onNotiMajorTypeIdChange() {
    //     this.exportDisable = true;
    // }

    sendSMSTemplateSearch() {
        const target = FiltersUtil.setFilterParam("target", FblOperator.EQ, this.sendSMSTemplateSearchForm.Target);
        const content = FiltersUtil.setFilterParam("content", FblOperator.CONTAINS, this.sendSMSTemplateSearchForm.content);
        this.sendSMSTemplateSettingFilter = FiltersUtil.setFilters(target,content);
        this.grid.pagination.current=1;
        this.reload();
    }

    //送出範本設定
    sendTemplateSettingUpdateFormSubmit() {
        (this.$refs.sendTemplateSettingUpdateForm as any).submit();
    }

    //清除電仿照會碼搜尋結果
    sendSMSTemplateSearchReset() {
        this.sendSMSTemplateSearchForm = {
            Target: "", //發送對象
            content:"",//範本內文
        }
    }

    isSendSMSTemplateSettingVisible: boolean = false;
    sendSMSTemplateSettingTitle: string = "";
    updateSendTemplateSetting: SendTemplateSMSGrid = {};
    newTemplateId: string = "";
    sendMode: string="";

    //新增
    showSendSMSTemplateAddModal() {
        this.isSendSMSTemplateSettingVisible = true;
        this.sendSMSTemplateSettingTitle =  this.$t("sendTemplateSettingPage_create-sendTemplate").toString();    
        this.updateSendTemplateSetting = {};
        this.sendMode = "S";
    }

    //編輯//刪除  
	onTableActionClick(e: FblActionEvent<SendTemplateSMSGrid>) {


        switch (e.action.name) {

            case "edit":
                this.sendTemplateEdit(e.row.data);
                break;
            case "delete":
                this.sendTemplateDelete(e.row.data);
                break;    
        }
    }

    //編輯
    sendTemplateEdit(data:SendTemplateSMSGrid){
        console.log('parent data:',data);
        this.isSendSMSTemplateSettingVisible = true;
        this.sendSMSTemplateSettingTitle = this.$t("sendTemplateSettingPage_update-sendTemplate").toString();
        this.updateSendTemplateSetting = data;
        this.sendMode = "S";
    }

    //刪除
    sendTemplateDelete(data:SendTemplateSMSGrid){
        Modal.confirm({
            okText: this.$t('global_ok').toString(), //確定
            cancelText: this.$t('global_cancel').toString(), //取消
            title: this.$t('global_delete').toString(), //刪除
            content: this.$t('sendTemplate_confirmDeleteMsg').toString(), //請確認是否要刪除
            onOk: () => {
                LoadingUtil.show();
                this.$sendTemplateApi.deleteSendTemplateUsingPOST(data.templateId)
                .then(()=>{
                    //範本刪除成功
                    MessageUtil.messageSuccess(this.$t('sendTemplate_DeleteSuccess').toString());
                })
                .catch((err)=>{
                    //刪除失敗
                    ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());  
                }).finally(()=>{
                    LoadingUtil.close();
                    this.reload();
                })
            }
        });    
    }

     //避免搜尋連按導致無限迴圈的flag
     searchFlag: boolean = true;
     
     reload() {

        if (this.searchFlag) {
            this.searchFlag = false;
            this.exportDisable = false;
            LoadingUtil.show();
            let sendSMSTemplatefilterStringtify = JSON.stringify(this.sendSMSTemplateSettingFilter);
            this.$sendTemplateApi.paginateSendSMSTemplateUsingPOST(
                this.grid.pagination.current - 1,
                this.grid.pagination.pageSize,
                sendSMSTemplatefilterStringtify
            ).then((resp: AxiosResponse<PageOfSendTemplateSMSGrid>) => {
                const p = { ...this.grid.pagination };
                this.grid.data = resp.data.content;
                p.total = parseInt(resp.data.totalElements);
                this.grid.pagination = p;
                console.log('this.grid.data',this.grid.data);
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
    
}