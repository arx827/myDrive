import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ResponseEntity,PageOfMaiHistoryGrid,MaiHistoryGrid} from "@fubonlife/obd-api-axios-sdk";
 
import CommonUtil from "@/assets/config/CommonUtil";

import {
    FblColumnType,
    FblActionEvent,
    FblPDataGridHolder,
    FblPageEvent,
    FblRow
} from "@/components/shared/data-grid/models";
import MomentUtil from "@/assets/config/MomentUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
// import InfInfoGrid from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
@Component({
    components: {
        FblDataGrid
    }
})
export default class MailHistory extends Vue {
    @Prop()
    caseNo:string;

    @Prop()
    caseLogId:string;

    isLoading: boolean = false;
    /**
     * 取得mailHistory 後端過來的
     */
    created() {
      this.reload();
    }
    /**
     * 取得mailHistory 後端過來的資料
     */
    reload(){
        this.isLoading = true;
        this.$historyApi.paginateMailHistoryUsingGET(this.caseNo,this.grid.pagination.current-1,this.grid.pagination.pageSize,this.caseLogId)
        .then((resp:AxiosResponse<PageOfMaiHistoryGrid>)=>{
            this.grid.data=resp.data.content;
            const p={...this.grid.pagination};
            p.total=parseInt(resp.data.totalElements);
            this.grid.pagination=p
        }).catch(err=>{
            console.log(err);
        }).finally(()=>{
            this.isLoading = false;
        })
       
    }

    onPageChange(e:FblPageEvent){
        
        this.grid.pagination=e.pagination;
        this.reload();
        
    }
    onInspectClick(row: FblRow<MaiHistoryGrid>) {
        this.$fileUploadApi.downloadFileUsingPOST(row.data.fileId, { responseType: 'blob' }).then((resp: AxiosResponse<ResponseEntity>) => {
            this.dealDownLoadData(resp.data,row.data.fileName);
        }).catch(error => console.log(error));
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
        } catch (e) {
            console.error(e);
             // 下載失敗
        }
    }
    // mailHistory顯示
    grid: FblPDataGridHolder<MaiHistoryGrid> = {
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
                type: FblColumnType.PLAIN,
                title: "",
                property: "sequence",//序號
                width:30
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_policyNo").toString(),//保單號碼
                property: "casePolicy",
                width:90
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_packNo").toString(),//名單序號
                property: "packNo",
                width:70
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("mailRecord_contactPerson").toString(),//對象
                property: "contactPerson",
                width:CommonUtil.countColumnWidth(2)
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("mailRecord_custName").toString(),//對象姓名
                property: "custName",
                width:CommonUtil.countColumnWidth(2)
            },
            {
                type: FblColumnType.PLAIN,
                title: "Email",//Email
                property: "emailAddress",
                width:90
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("mailRecord_subject").toString(),//"主旨"
                property: "subject",
                width:50
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("custMark_content").toString(),//內容
                property: "content",
                width:150
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("mailRecord_attachedFile").toString(),//"附件檔案"
                property: "fileId",
                inspect:true,
                formatter:(data:MaiHistoryGrid)=>{return data.fileName},
                width:80
            },  {
                type: FblColumnType.PLAIN,
                title: this.$t("mailRecord_errMessage").toString(),//寄送結果
                property: "errMessage",
                width:50,
                formatter:(data:MaiHistoryGrid)=>{

                    return data.errMessage?data.errMessage:this.$t("mailRecord_sendSuccess").toString();

                }
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("mailRecord_sendDate").toString(),//寄送日期
                property: "sendDate",
                width:90,
                formatter:(data:MaiHistoryGrid)=>
                {return MomentUtil.transformRocYearMonthDayHHMMSS(data.sendDate)},
            }
        ]
    };
    
}