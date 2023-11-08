import { ComponentDto, CaseCallUpHistoryDto, CaseCallUpHistoryInput, INumDto, PageOfCaseCallUpHistoryDto, ServiceHistorygDto, CallRecordDto,ImpairmentInfoDto } from "@fubonlife/obd-api-axios-sdk";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import CommonUtil from "@/assets/config/CommonUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { FblColumn, FblColumnType, FblPageEvent, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import { List, message } from "ant-design-vue";
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import moment from "moment";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import RecordPlayList from "@/components/shared/form/history/serveContactHistroy/RecordPlayList.vue";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import VlidationUtil from "@/assets/config/ValidationUtil";
import { AxiosResponse } from "axios";
import { AuthComonent } from "@/assets/config/CommonUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({ components: { FblDataGrid, DragModal, RecordPlayList } })
export default class CallupHistory extends Vue {

  // 畫面元件
  authComponent: AuthComonent ={
    CALLUP_HISTORY_RECORD_FILE : {
        show: false,
        enable: false,
    }
  };


  @Prop()
  callUpHistoryParam:CaseCallUpHistoryInput;

  // 是否是覆核進來
  @Prop({default:false})
  isReviewPage: boolean;

  caseCallUpHistoryDto: CaseCallUpHistoryDto = null;

  // 錄音編號是否隱藏
  isDisableRecordColumn: boolean = true;

  callUpColumn:FblColumn<CaseCallUpHistoryDto>[];

  // 載入畫面
  public loading: boolean = false;

  // 錄音檔撥放清單
  inumDtoList: INumDto[] = [];
  showRecordPlayList: boolean = false;
  playButtonLoading = {};
  isPlayListLoading = false;
  callSys: string = "";
  callRecordDto : CallRecordDto = {
    codingNo: "",
    eduId: "",
  }

  // 撥號歷程查詢結果顯示
  grid: FblPDataGridHolder<CaseCallUpHistoryDto> = {
    rowKey: "rowCountId",
    data: [],
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0,
      locale: { items_per_page: "" },
    },
    columns: []
  };

  get callUpHistory() {
    return this.callUpHistoryParam.caseNo || this.callUpHistoryParam.guid || this.callUpHistoryParam.custId;
  }

  @Watch("callUpHistory")
  onDataChange() {
    this.reload();
  }

  created() {
    // 畫面元件 component 權限
    this.getAuthComponent();

    // 如果是覆核頁面進來不需要看到錄音編號功能
     // 若是案件查詢跟案件歷程 顯示錄音檔編號欄位
    if(VlidationUtil.isEmpty(this.callUpHistoryParam.custId) && !this.isReviewPage){
        // 抓取錄音檔編號的index位置並將其隱藏
        // const index = this.grid.columns.findIndex(c => c.property == 'eduId')
        // this.grid.columns[index].hidden = false;
      this.isDisableRecordColumn=false;
    } else {
      // 如果是覆核的畫面，需以時間小到大排序
      this.isDisableRecordColumn=true;
      if(this.isReviewPage){
        this.grid.sort = Object.assign({'selector':'createDate','desc':false})   
      }
    }
      
    // 因不同畫面使用欄位有些需隱藏，改道created在給columns欄位內容
    this.grid.columns=[{
      type: FblColumnType.PLAIN,
      property: 'createDate',
      title: this.$t("global_date").toString(), // 日期
      width: 170,
      sorter: true,
      fixed: 'left',
      formatter(data: CaseCallUpHistoryDto) {
        if (VlidationUtil.isEmpty(data.createDate)) {
          return "";
        } else {
            return MomentUtil.transformRocYearMonthDayHHMMSS(MomentUtil.transferDate(new Date(data.createDate)));
        }
      }
    },
    {
      type: FblColumnType.PLAIN,
      property: 'rowCount',
      title: this.$t("onDutyPage_dialCount").toString(), // 撥號次數
      width: 100,
      fixed: 'left',
      hidden: this.isReviewPage,
    },
    {
      type: FblColumnType.PLAIN,
      property: 'packNo',
      title: this.$t("pedding_packNo").toString(), // 名單序號
      width: 150,
      fixed: 'left',
      hidden: this.isReviewPage,
    },
    {
      type: FblColumnType.PLAIN,
      property: 'contactPerson',
      title: this.$t("mailRecord_contactPerson").toString(), // 聯絡對象
      width: 100,
      fixed: 'left',
      hidden: this.isReviewPage,
    },
    {
      type: FblColumnType.PLAIN,
      property: 'casePolicy',
      title: this.$t("pedding_policyNo").toString(), // 保單號碼
      width: 150,
      sorter: true,
      hidden: this.isReviewPage,
    },
    {
      type: FblColumnType.ELLIPSIS,
      property: 'contactPersonName',
      title: this.$t("mailRecord_custName").toString(), // 聯絡對象姓名
      width: CommonUtil.countColumnWidth(7),
      hidden: this.isReviewPage,
    },
    {
      type: FblColumnType.PLAIN,
      property: 'phoneNo',
      title: this.$t("textMessage_sendMsgGrid_telePhone").toString(), // 電話號碼
      width: 120,
    },
    {
      type: FblColumnType.PLAIN,
      property: 'callUpResult',
      title: this.$t("onDutyPage_callUpResult").toString(), // 撥號結果
      width: CommonUtil.countColumnWidth(7),
    },
    {
      type: FblColumnType.PLAIN,
      property: 'contDetails',
      title: this.$t("onDutyPage_contDetails").toString(), // 聯絡細項
      width: CommonUtil.countColumnWidth(15),
      hidden: this.isReviewPage,
    },
    {
      type: FblColumnType.PLAIN,
      property: 'callUpRemark',
      title: this.$t("callUpF_callUpRemark").toString(), // 通話內容
      width: 350,
    },
    // TODO:因需求問題此階段先拿掉，後續確認後再處理
    // {
    //   type: FblColumnType.PLAIN,
    //   property: 'visitStartDate',
    //   title: this.$t("onDutyPage_visitDate").toString(), // 方便聯絡時間
    //   width: 190,
    //   formatter: (data: CaseCallUpHistoryDto) => {
    //     if (data.visitStartDate == null && data.visitEndDate == null) {
    //       return "";
    //     } else if (data.visitStartDate == null) {
    //       return " ~ " + MomentUtil.transformRocYearMonthDay(data.visitEndDate) + " "+ moment(data.visitEndDate).format("HH:mm");
    //     } else if (data.visitEndDate == null) {
    //       return MomentUtil.transformRocYearMonthDay(data.visitStartDate) + " " + moment(data.visitStartDate).format("HH:mm") + "~";
    //     } else {
    //       return MomentUtil.transformRocYearMonthDay(data.visitStartDate) + " " + moment(data.visitStartDate).format("HH:mm") + "~" + moment(data.visitEndDate).format("HH:mm");
    //     }
    //   },
    // },
    {
      type: FblColumnType.TEMPLATE,
      property: 'eduId',
      title: this.$t("callUp_recordNumber").toString(), // 錄音檔編號
      width: 200,
      align: 'center',
      template: "alink_eduId_Template",
      hidden: this.isDisableRecordColumn,
    },] ;




    this.reload();
  }

  /**
   * 畫面元件 component 權限
   */
  getAuthComponent(){
    // 固定傳值讓撥放清單按鈕呈現
    this.$authApi.getAuthComponentUsingGET('/case-page')
    .then((res: AxiosResponse<ComponentDto>) => {
        if (res.data.component) {
            this.authComponent.CALLUP_HISTORY_RECORD_FILE = VlidationUtil.isEmpty(res.data.component.CALLUP_HISTORY_RECORD_FILE) ? this.authComponent.CALLUP_HISTORY_RECORD_FILE : res.data.component.CALLUP_HISTORY_RECORD_FILE;
        }
        console.log("CallUpHistory authComponent: ", JSON.stringify(this.authComponent));

    }).catch((err) => {
        console.log(err);
    });
  }

  reload() {
    this.loading = true;
    let input: CaseCallUpHistoryInput ={
      custId: this.callUpHistoryParam.custId,
      caseNo: this.callUpHistoryParam.caseNo,
      guid: this.callUpHistoryParam.guid,
    };
    this.$historyApi.paginatePhoneCallHistoryUsingPOST(
        this.grid.pagination.current - 1,
        this.grid.pagination.pageSize,
        input,
        this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined
      ).then((resp:AxiosResponse<PageOfCaseCallUpHistoryDto>) => {
        const p = { ... this.grid.pagination };
        p.total = parseInt(resp.data.totalElements);
        this.grid.data = resp.data.content;
        this.grid.pagination = p;
        resp.data.content.forEach(r=> {
          this.playButtonLoading[r.rowCountId] = false;
        })
        
      }).catch((err) => {
        // 撥號歷程查詢失敗
        ErrorModalUtil.modalError(this.$t("callUP_searchHistoryFail").toString());
      }).finally(() => {
        this.getCount(this.grid.pagination.total);
        this.loading = false;
      });
  }

  //滑鼠移出cell，detail消失
  handleEllipsisMouseLeave() {
    message.destroy();
  }

  //滑鼠點擊該cell，顯示detail
  handleEllipsisClick($event, data) {
    message.destroy();
    message.config({
      duration: 0,
      top: `50px`,
    });
    message.info(data);
    //取得message 的html元件
    let antDesignMessage = document.getElementsByClassName('ant-message');
    //變更messae顯示位置
    MessageUtil.changePosition(antDesignMessage, $event.x, $event.y)
    message.config({
      duration: 3,
      top: `50px`,
    });
  }

  onPageChange(e: FblPageEvent) {
    if (this.grid.data.length > 0) {
      this.grid.pagination = e.pagination;
      if(this.isReviewPage){
        // 如果是覆核的畫面，需以時間小到大排序
        this.grid.sort = Object.assign({'selector':'createDate','desc':false})
      } else {
        this.grid.sort = e.sort;
      }

      this.reload();
    }
  }

  // 將資料筆數回傳
  getCount(dataLength: number) {
    this.$emit("getCount", dataLength);
  }

  // 點擊 錄音檔編號 超連結打開視窗
  clickLinkShowRecordPlayList(data: CaseCallUpHistoryDto){
    this.caseCallUpHistoryDto = data;
    this.callRecordDto.codingNo = data.codingNo;
    this.callRecordDto.eduId = data.eduId;
    // 開啟modal的loading，同時也開啟icon的讓使用者知道是點擊哪個按鈕
    this.loading = true;
    this.playButtonLoading[data.rowCountId] = true;
        if (!VlidationUtil.isEmpty(this.callRecordDto)) {
            // 打API擷取錄音檔
            this.$historyApi.getRecordsPlayListUsingPOST(this.callRecordDto)
                .then((resp: AxiosResponse<INumDto[]>) => {
                    this.inumDtoList = resp.data;
                    if (!VlidationUtil.isEmpty(this.inumDtoList)) {
                        if (this.inumDtoList.some(i => !VlidationUtil.isEmpty(i.inum))) {
                            this.callSys = " - ACR";
                        } else {
                            this.callSys = " - EZ";
                        }
                        this.showRecordPlayList = true;
                    } else {
                        // 沒有錄音檔跳錯誤訊息：「請由錄音系統調閱錄音」。
                        ErrorModalUtil.modalError(this.$t("recordPlayList_theRecordCanNotReach").toString());
                        this.showRecordPlayList = false;
                    }
                })
                .catch(e => {
                    console.error(e);
                    ErrorModalUtil.modalError(this.$t("recordPlayList_apiFail").toString()); // 網路服務異常
                    this.showRecordPlayList = false;
                })
                .finally(() => {
                  // this.showRecordPlayList = true;
                  this.playButtonLoading[data.rowCountId] = false;
                  this.loading = false;
                });
        }
  }
}