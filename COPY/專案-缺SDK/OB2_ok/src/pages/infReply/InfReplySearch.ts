import { Vue, Component, Watch } from "vue-property-decorator";
import { Modal, message } from "ant-design-vue";
import { FblColumnType, FblPDataGridHolder, FblPageEvent} from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import {QueryReplyInformDto, GetQueryReplyInformInput, GetQueryReplyInformOutput } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from 'axios';
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import axios from 'axios';
import { LoginModule} from "@/plugins/store/LoginModule";
import CuntersignatureModal from "@/components/shared/countersignatureModal/CountersignatureModal.vue";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
  components: {FblDataGrid, CuntersignatureModal}
})
export default class InfReplySearch extends Vue {

    username:string = ""; // 登入者 title 姓名
    infInfoCount:number = 0; // 待處理案件筆數

    // 會辦回覆 modal
    isCountersignatureFormVisible: boolean = false;

     //會辦資料
    cuntersignatureData = {
      caseNo: '',
      infStep: 1,
      infInfoId: '',
      infTypeId: '',
    };

    // 待處理案件查尋欄位
    infReplyPageGrid: FblPDataGridHolder<any> = {
      rowKey: "rowkey",
      data: [],
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['15', '30', '50'],
        current: 1,
        pageSize: 15,
        total: 0,
        locale: { items_per_page: "" }
      },
      scroll: { x: 500, y: 600 },
      columns: [
        {
          type: FblColumnType.ELLIPSIS,
          property: "rowkey",
          title: this.$t('infReplySearch_grid_rowKey').toString(), // 流水號
          width: 100,
          align: 'center',
        },
        {
          type: FblColumnType.ELLIPSIS,
          property: "insuName",
          title: this.$t('infReplySearch_grid_insuName').toString(), // 被保險人姓名
          width: CommonUtil.countColumnWidth(1),
          align: 'center',
        },
        {
          type: FblColumnType.ELLIPSIS,
          property: "pherName",
          title: this.$t('infReplySearch_grid_pherName').toString(),  //要保人姓名
          width: CommonUtil.countColumnWidth(1),
          align: 'center',
        },
        {
          type: FblColumnType.TEMPLATE,
          property: "infInfoId",
          title: this.$t('infReplySearch_grid_infInfoId').toString(), // 會辦單號
          width: 100,
          align: 'center',
          template: "alink_infInfoId_Template",
        },
        {
          type: FblColumnType.PLAIN,
          property: "casePolicy",
          title: this.$t('infReplySearch_grid_casePolicy').toString(), //保單號碼
          width: 100,
          align: 'center',
        },
        {
          type: FblColumnType.PLAIN,
          property: "changeNo",
          title: this.$t('infReplySearch_grid_changeNo').toString(), // 受理案號
          width: 100,
          align: 'center',
        },
        {
          type: FblColumnType.PLAIN,
          property: "sendDate",
          title: this.$t('infReplySearch_grid_sendDate').toString(), // 會辦日期
          width: 100,
          align: 'center',
        },
        {
          type: FblColumnType.PLAIN,
          property: "infExpireDate",
          title: this.$t('infReplySearch_grid_infExpireDate').toString(), // 回覆期限
          width: 100,
          align: 'center',
        },
        
      ],
    }

    // init
    created(){
        // 拿登入者姓名
        this.username = LoginModule.loginState.me.employee.name;
        // 查尋 待處理案件
        this.getQueryReplyInform();
    }

    /**
     * 查尋待處理案件
     */
    getQueryReplyInform(){
      
      // 整理 查尋 input
      var getQueryReplyInformInput:GetQueryReplyInformInput = {};
      getQueryReplyInformInput.replyId = LoginModule.loginState.me.id; // 回覆人員抓 登入者 id

      var page = this.infReplyPageGrid.pagination.current-1;
      var size = this.infReplyPageGrid.pagination.pageSize;
      var sort = this.infReplyPageGrid.sort ? JSON.stringify([this.infReplyPageGrid.sort]) : undefined;

      LoadingUtil.show();
      this.$informApi.queryReplyInformUsingPOST(page, size, getQueryReplyInformInput, sort)
      .then((resp:AxiosResponse<GetQueryReplyInformOutput>)=>{
        if(resp.data != null){
          if(resp.data.success){
            
            let getData = JSON.parse(JSON.stringify(resp.data.replyInformPage));
            const p = {...this.infReplyPageGrid.pagination};
            p.total = parseInt(getData.totalElements);

            // rowkey 資料序列由這邊累加計算
            getData.content.map((i,index)=>{
              i.rowkey = getData.pageable.pageNumber * getData.pageable.pageSize + index + 1;
            });

            this.infReplyPageGrid.data = getData.content;
            this.infReplyPageGrid.pagination = p;
            this.infInfoCount = p.total;

            LoadingUtil.close();
          }else{
            ErrorModalUtil.modalError(this.$t('infrReplySearch_error_occur_1').toString()); // 查詢會辦回覆待處理資料清單失敗
            LoadingUtil.close();
          }
        }
      }).catch((error)=>{
        ErrorModalUtil.modalError(this.$t('infrReplySearch_error_occur_1').toString()); //查詢會辦回覆待處理資料清單失敗
        LoadingUtil.close();
      })

    }

    // ===================================== Grid 事件 ========================================================
 
    // 換頁
    onPageChange(e: FblPageEvent) {
      if (this.infReplyPageGrid.data.length > 0) {
          this.infReplyPageGrid.sort = e.sort;
          this.infReplyPageGrid.pagination = e.pagination;
          this.getQueryReplyInform();
      }
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

    // 離開彈窗 (未來統一修改為此關閉視窗方式) (目前已使用的彈窗為 ： 會辦資料、歸戶提示、服務歷程訊息彈窗)
    onCloseModal(modalName) {
      this[modalName] = false;
    }

    /**
     * 點擊會辦單號
     */
    clickInfInfoId(data){
      this.cuntersignatureData.caseNo = data.caseNo;
      this.cuntersignatureData.infStep = 2;
      this.cuntersignatureData.infInfoId = data.infInfoId;
      this.cuntersignatureData.infTypeId = data.infTypeId
      this.isCountersignatureFormVisible = true;
    }
}