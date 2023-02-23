import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import CommonUtil from "@/assets/config/CommonUtil";
import { message } from "ant-design-vue";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
    FblActionEvent
} from "@/components/shared/data-grid/models";

import { PageOfInfDaySettingGrid,InfDaySettingGrid,ReviewType,Option,InfEmailTemplateSettingGrid,PageOfInfEmailTemplateSettingGrid,InfReplyContentSettingGrid,PageOfInfReplyContentSettingGrid} from "@fubonlife/obd-api-axios-sdk";
import InfDayUpdateForm from "@/components/shared/form/infDayUpdateForm/InfDayUpdateForm.vue";
import InfEmailTemplateUpdateForm from "@/components/shared/form/infEmailTemplateUpdateForm/InfEmailTemplateUpdateForm.vue";
import InfReplyContentUpdateForm from "@/components/shared/form/infReplyContentUpdateForm/InfReplyContentUpdateForm.vue";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import MessageUtil from "@/assets/config/MessageUtil";


@Component({
    components: {  FblDataGrid,InfDayUpdateForm,InfEmailTemplateUpdateForm,InfReplyContentUpdateForm }
})
export default class InformBasicSetting extends Vue {
   
    created(){
        this.infDayGridReload();
        this.emailTemplateGridReload();
        this.informReplyContentGridReload();
        this.getMajorTypeOptions();
    }

    // ============================================會辦日期設定infDayGrid 事件  start===================
    //日期設定buffer圈
    infDayloading:boolean=false;
   
    infDayGridReload(){
        this.infDayloading=true;
        this.$informBasicSettingApi.paginateInformDayUsingGET(this.infDayGrid.pagination.current-1,this.infDayGrid.pagination.pageSize)
        .then((resp:AxiosResponse<PageOfInfDaySettingGrid>)=>{

            this.infDayGrid.data=resp.data.content;
            const p = { ...this.infDayGrid.pagination };
            p.total = parseInt(resp.data.totalElements);
            this.infDayGrid.pagination = p;
        }).catch(error => {
           console.log(error);
        }).finally(() => {
            this.infDayloading=false;
        }
        )
    }
   
    //控制編輯視窗是否顯示
    isInfDaySettingVisible:boolean=false;
   updateInfDay:InfDaySettingGrid=null;
    onInfDayActionClick(e:FblActionEvent<InfDaySettingGrid>){

        this. isInfDaySettingVisible=true;
        this.updateInfDay=e.row.data;
    }
    //送出會辦日期設定
    async infDayUpdateFormSubmit(){
    const returnflag:boolean= await (this.$refs.infDayUpdateForm as any).submit();
   
    }

    //會辦主類別下拉選單取得
    majorTypeOptions:Option[]=[];
    getMajorTypeOptions(){
        this.$reviewedSettingApi.getAllReviewTypeUsingGET1().then((resp:AxiosResponse<ReviewType[]>)=>
        {
            resp.data.filter(e=>e.type=="INF").forEach(
               majorType=>{
                this.majorTypeOptions.push({label:majorType.description,value:majorType.reviewTypeId});

               }
           )
           
        }
        ).catch((error)=>{
            console.log(error);
        })

    }
   
    infDayGrid:FblPDataGridHolder<InfDaySettingGrid>={
        rowKey: "infDayId",
        data: [],
        pagination: {
            showSizeChanger: false,
            pageSizeOptions: ['5', '10', '15'],
            current: 1,
            pageSize: 5,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        scroll: { x: 500, y: 600 },
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
                width: CommonUtil.countColumnWidth(3),
            },
            {
                type: FblColumnType.PLAIN,
                property: "infType",
                title: this.$t("infPage_infType").toString(),
                width: CommonUtil.countColumnWidth(3),
            },
            {
                type: FblColumnType.PLAIN,
                property: "type",//類型
                title:this.$t("global_type").toString() ,
                formatter: (data: InfDaySettingGrid) => {
                    return data.type
                },
                width: CommonUtil.countColumnWidth(3),

            }, {
                type: FblColumnType.PLAIN,
                title:  this.$t("infBasic_workDay_setting").toString(),//設定天數(工作日)
                property: "workingDay",
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.ELLIPSIS,
                title: this.$t("infBasic_remarkExplanation").toString(),//備註說明
                property: "remark",
                width: CommonUtil.countColumnWidth(50),
            },
            
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: InfDaySettingGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            },{
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
                formatter: (data: InfDaySettingGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

      /**
    * 換頁事件對應方法
    */
       onInfDayPageChange(e: FblPageEvent) {
        this.infDayGrid.pagination = e.pagination;
        this.infDayGrid.sort = e.sort;
 
        this.infDayGridReload();
    }

    handleEllipsisClick($event, data) {
        message.destroy();
            message.config({
                duration: 0,
                top: `50px`
            });
            
            //摺疊字串，依照自訂字數摺疊
            var wordWrap:string = this.wordWrap(data,20);
            var arrWordWrap:Array<string> = wordWrap.split("\n");
           
            // 整理 message open 需要參數
            var arrVnode:Array<VNode> = [];
            arrWordWrap.forEach((wordStr)=>{
                arrVnode.push(this.$createElement("div", {attrs:{align:"left"}}, wordStr));
            });
            var wordWrapMessage:VNode = this.$createElement("div", arrVnode);
            var messageOptions:MessageOptions = {content:wordWrapMessage};
            message.open(messageOptions);
    
            //取得message 的html元件
            let antDesignMessage = document.getElementsByClassName('ant-message');
            //變更messae顯示位置
            MessageUtil.changePosition(antDesignMessage, $event.x, $event.y);
      }
      /**
       * @description 摺疊字串，依照自訂字數摺疊
       * @param str 總字串
       * @param maxWidth 欲摺疊字數
       * @returns 
       */
       wordWrap(str, maxWidth) {
        var newLineStr = "\n"; 
        var res = '';
    
        var testWhite = (x) => {
            var white = new RegExp(/^\s$/);
            return white.test(x.charAt(0));
        }
    
        while (str.length > maxWidth) {                 
            var found = false;
            // Inserts new line at first whitespace of the line
            for (var i = maxWidth - 1; i >= 0; i--) {
                if (testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }
            
        }
        
        return res + str;
      }
    
      // 滑鼠離開 message 顯示消失
      handleEllipsisMouseLeave() {
        message.destroy();
      }


    
     // ============================================infDayGrid 事件  end===================

    // ============================================emailTemplateGrid  start===================
    //控制email視窗是否能看到
    isEmailTemplateSettingVisible:boolean=false;
    updateInfEmailTemplate:InfEmailTemplateSettingGrid=null;
    infEmailTemplateTitle:string="";

    emailTemplateActionClick(e:FblActionEvent<InfEmailTemplateSettingGrid>){
        this.infEmailTemplateTitle="修改-Email範本";
        this.isEmailTemplateSettingVisible=true;
        this.updateInfEmailTemplate=e.row.data;
    }


    showemailTemplateAddModal(){
        this.infEmailTemplateTitle="新增-Email範本";
        this.isEmailTemplateSettingVisible=true;
        this.updateInfEmailTemplate={}

    }
    
    
    emailTemplateGridloading:boolean=false;
    emailTemplateGridReload(){
        this.emailTemplateGridloading=true;
        this.$informBasicSettingApi.paginateInformEmailTemplateUsingGET(this.emailTemplateGrid.pagination.current-1,this.emailTemplateGrid.pagination.pageSize)
        .then((resp:AxiosResponse<PageOfInfEmailTemplateSettingGrid>)=>{
            this. emailTemplateGrid.data=resp.data.content;
            const p = { ...this. emailTemplateGrid.pagination };
            p.total = parseInt(resp.data.totalElements);
            this. emailTemplateGrid.pagination = p;
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            this.emailTemplateGridloading=false;
        }
        )
    }
   
   
    emailTemplateGrid:FblPDataGridHolder<InfEmailTemplateSettingGrid>={
        rowKey: "infEmailTemplateId",
        data: [],
        pagination: {
            showSizeChanger: false,
            pageSizeOptions: ['5', '10', '15'],
            current: 1,
            pageSize: 5,
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
                property: "infType",
                title: this.$t('infPage_infType').toString()//"會辦類型",
            },
            {
                type: FblColumnType.PLAIN,
                property: "subject",
                title:this.$t('mailRecord_subject').toString(),// "主旨",
                width: CommonUtil.countColumnWidth(20),
            
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('email_content').toString(),//"內容",
                property: "content",
                width: CommonUtil.countColumnWidth(60),
             
            },{
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: InfDaySettingGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            },{
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
                formatter: (data: InfDaySettingGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

    infEmailTemplateUpdateFormSubmit(){
        (this.$refs.infEmailTemplateUpdateForm as any).submit();
    }

    emailTemplatePageChange(e: FblPageEvent) {
        this.emailTemplateGrid.pagination = e.pagination;
        this.emailTemplateGrid.sort = e.sort;
 
        this.emailTemplateGridReload();
    }


  

// ============================================emailTemplateGrid  end===================


// ============================================replyContent  start===================
isInfReplyContentSettingVisible:boolean=false;


infReplyContentActionClick(e:FblActionEvent<InfReplyContentSettingGrid>){
    switch(e.action.name){
    case "add":
    this.showReplyAddModal();
    break;
    case "edit":
    this.editReplyContent(e.row.data);
    break;
    }
}


infReplcontentSetting:string='';

updateInfReplyContent:InfReplyContentSettingGrid=null;
//新增罐頭語
showReplyAddModal(){
    this.infReplcontentSetting=this.$t("global_add").toString()+"-"+this.$t("infReplcontent_setting").toString();
    this.isInfReplyContentSettingVisible=true;
    this.updateInfReplyContent={};
}
//編輯罐頭語global_add
editReplyContent(data:InfReplyContentSettingGrid){
    this.infReplcontentSetting=this.$t("global_modify").toString()+"-"+this.$t("infReplcontent_setting").toString();
    this.isInfReplyContentSettingVisible=true;
    this.updateInfReplyContent=data;
}

informReplyContentGridloading:boolean=false;
informReplyContentGridReload(){
    this.informReplyContentGridloading=true;
    this.$informBasicSettingApi.paginateInformReplyContentUsingGET(this.informReplyContentGrid.pagination.current-1,this.informReplyContentGrid.pagination.pageSize)
    .then((resp:AxiosResponse<PageOfInfReplyContentSettingGrid>)=>{
        this. informReplyContentGrid.data=resp.data.content;
        const p = { ...this. informReplyContentGrid.pagination };
        p.total = parseInt(resp.data.totalElements);
        this. informReplyContentGrid.pagination = p;
    }).catch(error => {
        console.log(error);
    }).finally(() => {
        this.informReplyContentGridloading=false;
    }
    )
}

informReplyContentGrid:FblPDataGridHolder<InfReplyContentSettingGrid>={
    rowKey: "infInfoReplyContentId",
    data: [],
    pagination: {
        showSizeChanger: false,
        pageSizeOptions: ['5', '10', '15'],
        current: 1,
        pageSize: 5,
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
            title: this.$t("infPage_infType").toString(),
            property: "infType",
        },
        {
            type: FblColumnType.PLAIN,
            title: this.$t("infContent").toString(),
            property: "content",
           
        
        }, {
            type: FblColumnType.PLAIN,
            title:  this.$t("infSort").toString(),
            property: "sort",
          
        },{
            type: FblColumnType.PLAIN,
            title:this.$t("global_status").toString(),//"狀態",
            property: "status",
            formatter:(data:InfReplyContentSettingGrid)=>{
                if(data.status=="Y"){
                    return "有效"
                }else{
                    return "停用"
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            title: this.$t("infBasic_createdDate").toString(),//新增時間
            property: "createDate",
            formatter: (data: InfDaySettingGrid) => {
                return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
            },
        },
        {
            type: FblColumnType.PLAIN,
            title: this.$t("infBasic_createPerson").toString(),//新增人員
            property: "createName",

        },{
            type: FblColumnType.PLAIN,
            title: this.$t("infBasic_modifiedDate").toString(),//異動時間
            property: "updateDate",
            formatter: (data: InfDaySettingGrid) => {
                return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
            },
        },
        {
            type: FblColumnType.PLAIN,
            title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
            property: "updateName",
        },
    ]
}

  /**
* 換頁事件對應方法

*/
   informReplyContentPageChange(e: FblPageEvent) {
    this.informReplyContentGrid.pagination = e.pagination;
    this.informReplyContentGrid.sort = e.sort;
    this.informReplyContentGridReload();
}

infReplyContentUpdateFormSubmit(){

    (this.$refs.infReplyContentUpdateForm as any).submit();
}
   // ============================================replyContent  end===================


    }