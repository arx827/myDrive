import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ResponseEntity,MplusSendMessageGrid, PageOfMplusSendMessageGrid } from "@fubonlife/obd-api-axios-sdk";
import { MessageOptions } from "ant-design-vue/types/message";
import { VNode } from "vue/types/umd";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal, message } from "ant-design-vue";
import {
    FblColumnType,
    FblActionEvent,
    FblPDataGridHolder,
    FblPageEvent,
} from "@/components/shared/data-grid/models";
import MomentUtil from "@/assets/config/MomentUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
// import InfInfoGrid from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil from "@/assets/config/CommonUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import moment, { Moment } from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import InfRecord from '@/components/shared/form/history/infRecord/InfRecord.vue';
import MailRecord from '@/components/shared/form/history/mailHistory/MailHistory.vue';
import QuestionAnswer from '@/components/shared/form/questionAnswer/QuestionAnswer.vue';
import DragModal from '@/components/shared/dragModal/DragModal.vue';




@Component({
    components: { FblDataGrid }
})
export default class MPlusHistory extends Vue {

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
    reload() {
        this.isLoading = true;

       this.$historyApi.paginateMplusAndMessageHistoryUsingGET(this.caseNo,this.grid.pagination.current-1,this.grid.pagination.pageSize,this.caseLogId).
       then((resp:AxiosResponse<PageOfMplusSendMessageGrid>)=>{
        this.grid.data=resp.data.content;
        const p={...this.grid.pagination};
        p.total=parseInt(resp.data.totalElements);
        this.grid.pagination=p

       }).finally(
        ()=>{
            this.isLoading=false;
        }
       )
       this.isLoading=false;
    }
    //分頁改變的時候
    onPageChange(e: FblPageEvent) {
        
        this.grid.pagination = e.pagination;
        this.reload();

    }
    //MPlusHistory顯示
    grid: FblPDataGridHolder<MplusSendMessageGrid> = {
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
        scroll:{x:50,y:500},
        columns: [
            {
                type: FblColumnType.PLAIN,
                title: "",
                property: "sequence",//序號
                width: 30
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_policyNo").toString(),//保單號碼
                property: "casePolicy",
                width: 90
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_packNo").toString(),//名單序號
                property: "packNo",
                width: 70
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("global_class").toString(),//類別
                property: "messageType",
                width: 70
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("contact_person").toString(),//對象
                property: "contactPerson",
                width: 35
            },
            {
                type: FblColumnType.ELLIPSIS,
                title: this.$t("contact_person_name").toString(),//對象姓名
                property: "custName",
                width: CommonUtil.countColumnWidth(5)
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("textMessage_sendMsgGrid_telePhone").toString(),//Email 
                property: "telephone",
                width: 90
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("mplustRecords_content").toString(),//內容
                property: "content",
                width: 120
            }, {
                type: FblColumnType.PLAIN,
                title:  this.$t("sending_result").toString(),//發送M+/簡訊結果
                property: "errMessage",
                width: 50
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("mplustRecords_send_date").toString(),//發送M+/簡訊日期
                property: "sendDate",
                width: 90,
                formatter: (data: MplusSendMessageGrid) => {

                    if (!ValidationUtil.isEmpty(data.sendDate)) {
                        return MomentUtil.transformRocYearMonthDayHHMMSS(data.sendDate)
                    } else {
                        return "";
                    }
                }
            },{
                type: FblColumnType.PLAIN,
                title:this.$t("MplusQualification").toString(),//M+資格
                property: "mplusQualification",
                width: 90,


            }
        ]
    };

 /**
   * 換行
   */
  handleEllipsisClick($event, data) {
    
    message.destroy();
        message.config({
            duration: 0,
            top: `50px`
        });
        
        //摺疊字串，依照自訂字數摺疊
        var wordWrap:string = this.wordWrap(data,7);
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
}