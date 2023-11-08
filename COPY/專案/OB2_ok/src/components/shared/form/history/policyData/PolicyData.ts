import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { message } from "ant-design-vue";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import { FblColumn, FblColumnType, FblPDataGridHolder, FblPageEvent } from "../../../data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import ValidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { AxiosResponse } from 'axios';
import { CasePackDto, GetBasicPolicyDataInput, GetBasicPolicyDataOutput, BasicPolicyDataDto} from "@fubonlife/obd-api-axios-sdk";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import DragModal from '@/components/shared/dragModal/DragModal.vue'
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
  components: { DragModal, FblDataGrid }
})
export default class PolicyData extends Vue {

  @Prop()
  currentPack : CasePackDto; // 名單案件包

  @Prop()
  isModal !: boolean;

  @Prop()
  isGetPolicyContractStatus: boolean; // 判斷是否有執行 取得契約狀態  getPolicyContractStatusDataUsingPOST

  isLoading: boolean = false;
  isShowCustomerNotice: boolean = false; // 客戶提醒彈跳視窗

  /**
   * 監聽 父層傳進來 是否執行 取得契約狀態
   */
  @Watch("isGetPolicyContractStatus")
  watchPolctContStatus(newVal) {
    // 已執行 取得契約狀態，call 初始
    if (newVal) {
      this.initial();
    }
  }

  /**
   * 監聽 父層傳入 名單案件包是否有簽換
   */
  @Watch('currentPack', {deep : true})
  watchCurrentPack(newVal: CasePackDto, oldVal: CasePackDto) {
    // 如果新的值不為空且新舊件名單不同在執行取值
    if (!ValidationUtil.isEmpty(newVal) && !newVal.packNo.match(oldVal.packNo)) {
      this.initial();
    }
  }

  /**
   * 保單基本資料 欄位
   */
  public policyDataGridColumns: FblColumn<BasicPolicyDataDto>[] = [
    {
      type: FblColumnType.TEMPLATE,
      property: 'isSecretCase',
      title: this.$t('policyData_grid_isSecretCase').toString(), // 密戶
      width: CommonUtil.countColumnWidth(5),
      fixed: 'left',
      template: "alink_isSecretCase_template",
    },
    {
      type: FblColumnType.PLAIN,
      property: 'casePolicy',
      title: this.$t('policyData_grid_casePolicy').toString(), // 保單號碼
      width: CommonUtil.countColumnWidth(10),
      sorter: true,
      fixed: 'left',
    },
    {
      type: FblColumnType.ELLIPSIS,
      property: 'pherName',
      title: this.$t('policyData_grid_pherName').toString(), // 要保人
      width: CommonUtil.countColumnWidth(7),
      fixed: 'left',
    },
    {
      type: FblColumnType.ELLIPSIS,
      property: 'insuName',
      title: this.$t('policyData_grid_insuName').toString(), // 被保險人
      width: CommonUtil.countColumnWidth(7),
      fixed: 'left',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'submitDate',
      title: this.$t('policyData_grid_submitDate').toString(), // 契約始期
      width: CommonUtil.countColumnWidth(5),
      sorter: true,
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'contractStatusDesc',
      title: this.$t('policyData_grid_contractStatusDesc').toString(), // 契約狀態
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'policyYear',
      title: this.$t('policyData_grid_policyYear').toString(), // 年期
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.TEMPLATE,
      property: 'insuranceCode',
      title: this.$t('policyData_grid_insuranceCode').toString(), // 險種
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
      template: "insuranceCode_template",
    },
    {
      type: FblColumnType.PLAIN,
      property: 'policyAmt',
      title: this.$t('policyData_grid_policyAmt').toString(), // 保額(單位/元)
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'payTypeDesc',
      title: this.$t('policyData_grid_payTypeDesc').toString(), // 繳別
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'payKindDesc',
      title: this.$t('policyData_grid_payKindDesc').toString(), // 繳法
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
      formatter:(data:BasicPolicyDataDto)=>{
        // 先抓 payKindDesc
        if(!ValidationUtil.isEmpty(data.payKindDesc)){
          return data.payKindDesc;
        }else{
          // 沒有 payKindDesc 抓 payKind
          if(!ValidationUtil.isEmpty(data.payKind)){
            return data.payKind;
          }else{
            // 沒有 payKindDesc 沒有 payKind 則空白
            return "";
          }
        }
      }
    },
    {
      type: FblColumnType.TEMPLATE,
      property: 'agentId',
      title: this.$t('policyData_grid_agentName').toString(), // 業務員1
      width: CommonUtil.countColumnWidth(7),
      align: 'center',
      template: 'agentName_template',
    },
  ];
  
  /**
   * modal 保單基本資料欄位，與非modal 欄位差別在於 不需要 fix，因為顯示欄位太少，畫面太寬 fix 會出現多於空白
   */
  public policyDataModalGridColumns: FblColumn<BasicPolicyDataDto>[] = [
    {
      type: FblColumnType.TEMPLATE,
      property: 'isSecretCase',
      title: this.$t('policyData_modal_grid_isSecretCase').toString(), // 密戶
      width: CommonUtil.countColumnWidth(5),
      template: "alink_isSecretCase_template",
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'casePolicy',
      title: this.$t('policyData_modal_grid_casePolicy').toString(), // 保單號碼
      width: CommonUtil.countColumnWidth(10),
      sorter: true,
      align: 'center',
    },
    {
      type: FblColumnType.ELLIPSIS,
      property: 'pherName',
      title: this.$t('policyData_modal_grid_pherName').toString(), // 要保人
      width: CommonUtil.countColumnWidth(3.5),
      align: 'center',
    },
    {
      type: FblColumnType.ELLIPSIS,
      property: 'insuName',
      title: this.$t('policyData_modal_grid_insuName').toString(), // 被保險人
      width: CommonUtil.countColumnWidth(3.5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'submitDate',
      title: this.$t('policyData_modal_grid_submitDate').toString(), // 契約始期
      width: CommonUtil.countColumnWidth(5),
      sorter: true,
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'contractStatusDesc',
      title: this.$t('policyData_modal_grid_contractStatusDesc').toString(), // 契約狀態
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'policyYear',
      title: this.$t('policyData_modal_grid_policyYear').toString(), // 年期
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.TEMPLATE,
      property: 'insuranceCode',
      title: this.$t('policyData_modal_grid_insuranceCode').toString(), // 險種
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
      template: "insuranceCode_template",
    },
    {
      type: FblColumnType.PLAIN,
      property: 'policyAmt',
      title: this.$t('policyData_modal_grid_policyAmt').toString(), // 保額(單位/元)
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'payTypeDesc',
      title: this.$t('policyData_modal_grid_payTypeDesc').toString(), // 繳別
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
    },
    {
      type: FblColumnType.PLAIN,
      property: 'payKindDesc',
      title: this.$t('policyData_modal_grid_payKindDesc').toString(), // 繳法
      width: CommonUtil.countColumnWidth(5),
      align: 'center',
      formatter:(data:BasicPolicyDataDto)=>{
        // 先抓 payKindDesc
        if(!ValidationUtil.isEmpty(data.payKindDesc)){
          return data.payKindDesc;
        }else{
          // 沒有 payKindDesc 抓 payKind
          if(!ValidationUtil.isEmpty(data.payKind)){
            return data.payKind;
          }else{
            // 沒有 payKindDesc 沒有 payKind 則空白
            return "";
          }
        }
      }
    },
    {
      type: FblColumnType.TEMPLATE,
      property: 'agentId',
      title: this.$t('policyData_modal_grid_agentName').toString(), // 業務員1
      width: CommonUtil.countColumnWidth(3.5),
      align: 'center',
      template: 'agentName_template'
    },
  ]

  /**
   * 保單基本資料 grid
   */
  public policyDataGrid: FblPDataGridHolder<BasicPolicyDataDto> = {
    rowKey: 'caseNo',
    data: [],
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0
    },
    columns: [],
  };
  
  /**
   * modal 的 pagination 主要為 顯示比數不同
   */
  public policyDataModalPagination = {
    current: 1,
    pageSize: 15,
    total: 0
  }



  /**
   * vue 初始
   */
  created() {
    this.initial();
  }

  /**
   * 初始
   */
  initial() {
    this.policyDataGrid.data = [];
    
    // 有取到案件包
    if (!ValidationUtil.isEmpty(this.currentPack)) {
      // 有執行過 取得契約狀態
      if (this.isGetPolicyContractStatus) {
        this.getGridData(this.currentPack.packNo);
      }

    }

  }


  /**
   * 取得保單基本資料
   * @param currentPackNo 
   */
  getGridData(currentPackNo: string){
    
    this.isLoading = true;
    // 整理查詢保單基本資料輸入參數
    var getBasicPolicyDataInput:GetBasicPolicyDataInput = {};

    // 清空 pagination
    var page = 0;
    var size = 0;
    var sort = undefined;

    // 整理 modal pagination
    if(this.isModal){
      this.policyDataGrid.columns = this.policyDataModalGridColumns;
      this.policyDataGrid.pagination = this.policyDataModalPagination;
      page = this.policyDataModalPagination.current-1;
      size = this.policyDataModalPagination.pageSize;
      sort = this.policyDataGrid.sort ? JSON.stringify([this.policyDataGrid.sort]): undefined;
    }
    // 整理 非modal pagination
    else{
      this.policyDataGrid.columns = this.policyDataGridColumns;
      page = this.policyDataGrid.pagination.current-1;
      size = this.policyDataGrid.pagination.pageSize;
      sort = this.policyDataGrid.sort ? JSON.stringify([this.policyDataGrid.sort]): undefined;
    }

    getBasicPolicyDataInput.packNo = currentPackNo; // 名單序號

    this.$policyDataApi.getBasicPolicyDataUsingPOST(page,size,getBasicPolicyDataInput,sort)
    .then((resp:AxiosResponse<GetBasicPolicyDataOutput>)=>{
      if(resp != null){
          if(resp.data.success){
              // 需轉換資料避免 typescript 錯誤
              let getData = JSON.parse(JSON.stringify(resp.data.basicPolicyDataDtoPage));

              const p = {...this.policyDataGrid.pagination};
              p.total = parseInt(getData.totalElements);

              getData.content.map(i => {
                i.isInsuranceCodTipShow = false; // 設定每列 險種 tooltip 為不開啟
                i.isAgentInfoPopShow = false; // 設定每列 業務員 popover 為不開啟
              });
              this.policyDataGrid.data = getData.content;
              this.policyDataGrid.pagination = p;
          }else{
            console.log("查詢保單基本資料錯誤: ", resp.data.returnMessage);
          }
      }else{
        console.log("查詢保單基本資料錯誤")
      }

    })
    .catch((error)=>{
      // 錯誤不出現視窗來顯示錯誤資訊
      console.error(error)
    })
    .finally(()=>{
      // 傳回父層，給父層用來顯示 是否顯示 總筆數、顯示全部、顯示全部彈跳視窗
      this.$emit('havePolicyData', this.policyDataGrid.pagination.total);
      this.isLoading = false;
    });
  
  }

  /**
   * 點擊 密戶
   */
  clickLinkIsSecretCase() {
    this.isShowCustomerNotice = true;
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

  // 換頁(提供換頁共用，name為要切頁的grid)
  onPageChange(e: FblPageEvent) {
    
    // modal 需要的切頁
    if(this.isModal){
      if(this.policyDataGrid.data.length > 0){
        // 先存到 modal 的 pagination
        this.policyDataModalPagination.current = e.pagination.current;
        this.policyDataModalPagination.pageSize = e.pagination.pageSize;
        this.policyDataModalPagination.total = e.pagination.total;
        // 再存到共用的 grid
        this.policyDataGrid.pagination = this.policyDataModalPagination;
        this.policyDataGrid.sort = e.sort;
        this.initial();
      }      
    }
    // 非modal 需要的切頁
    else{
      if(this.policyDataGrid.data.length > 0){
        this.policyDataGrid.sort = e.sort;
        this.policyDataGrid.pagination = e.pagination;
        this.initial();
      }
    }
  }

}