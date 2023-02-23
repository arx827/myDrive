import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

@Component({
  components: {
    IpkVxeTable,
    CheckInfoModal,
  },
})
export default class HistoryModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalHistoryShow: boolean // modal開關

  @Prop()
  historyInfo: any // 傳進來的資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  tempHistoryInfo = {}; // [歷程彈窗] 暫存歷程內容換頁使用

  ipkHistoryGrid: IpkVxeTableModel = { // [歷程彈窗] 欄位資訊
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      pageSize: 10, // 若修改，須同步更改CutOffTimeDataInfo.ts開啟歷程彈窗傳入的pageSize
      total: 0,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: true,
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '操作類型',
        field: 'action',
        slots: { default: 'action' },
      },
      {
        title: '保管行',
        field: 'custodian',
      },
      {
        title: '幣別',
        field: 'currency',
      },
      {
        title: '國家',
        field: 'nationId',
        width: '25%',
      },
      {
        title: '交易類型',
        field: 'type',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('typeOption', data.cellValue);
        },
      },
      {
        title: '買賣類型',
        field: 'tradeType',
      },
      {
        title: '異動人員',
        field: 'updateId',
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 180,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
    ],
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
    custodian: { key: null, label: '保管行', type: 'inputText' },
    nationId: { key: null, label: '國家', type: 'inputText' },
    currency: { key: null, label: '幣別', type: 'inputText' },
    type: { key: null, label: '交易類型', type: 'inputText' },
	  tradeCycle: { key: null, label: '交易週期', type: 'inputText' },
    equityCutOffDay: { key: null, label: '券指示日', type: 'inputText' },
    equityCutOffTime: { key: null, label: '券指示時間', type: 'inputText' },
    equityBufferTime: { key: null, label: '券目標放行時間', type: 'inputText' },
    tradeType: { key: null, label: '買賣類型', type: 'inputText' },
    cashCutOffDay: { key: null, label: '款指示日', type: 'inputText' },
    cashCutOffTime: { key: null, label: '款指示時間', type: 'inputText' },
    cashBufferTime: { key: null, label: '款目標放行時間', type: 'inputText' },
    localTradeStartTime: { key: null, label: '當地交易時間起', type: 'inputText' },
    localTradeEndTime: { key: null, label: '當地交易時間迄', type: 'inputText' },
    twTradeStartTime: { key: null, label: '台灣交易時間起', type: 'inputText' },
    twTradeEndTime: { key: null, label: '台灣交易時間迄', type: 'inputText' },
    createId: { key: null, label: '建立人員', type: 'inputText' },
    createDate: { key: null, label: '建立日期', type: 'dateTime' },
    updateId: { key: null, label: '異動人員', type: 'inputText' },
    updateDate: { key: null, label: '異動日期', type: 'dateTime' },
  };

  /**
   * watch
   */
  @Watch('modalHistoryShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('historyInfo', { immediate: true, deep: true })
  onValChange(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.tempHistoryInfo = val;
    this.paginateHist(val);
  }

  /**
  * hook
  */
  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeHistoryModal;
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉歷程彈窗
  closeHistoryModal() {
    this.$emit('closeHistoryModal');
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
    // 清空
    Object.entries(this.checkInfoContentForm).forEach(([key, item], index) => {
      if (!this.isEmpty(this.checkInfoContentForm[key])) {
        item.key = null;
      }
    });
  }

  // 分頁查詢設定歷程
  paginateHist(e) {
    // 整理成後端格式
    let dto = {
      custodian: this.isEmpty(e.rowData.custodian) ? undefined : e.rowData.custodian,
      currency: this.isEmpty(e.rowData.currency) ? undefined : e.rowData.currency,
      nationId: this.isEmpty(e.rowData.nationId) ? undefined : e.rowData.nationId,
      type: this.isEmpty(e.rowData.type) ? undefined : e.rowData.type,
      tradeType: this.isEmpty(e.rowData.tradeType) ? undefined : e.rowData.tradeType,
      pageNum: e.pageNum,
      pageSize: e.pageSize,
    };

    // call API
    this.setLoading(true);
    this.$cutOffConfigApi.paginateHistUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkHistoryGrid.data = [];

      const actionEnum = JSON.parse(JSON.stringify(this.$cfEnum.actionEnum));
      actionEnum[0].icon = [this.$cfEnum.actionConstant.SEARCH];

      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkHistoryGrid.data.push({
            ...item,
            action: this.getOptionObject(actionEnum, item.changeType),
          });
        });
      }

      this.ipkHistoryGrid.pagerConfig.currentPage = dto.pageNum;
      this.ipkHistoryGrid.pagerConfig.pageSize = dto.pageSize;
      this.ipkHistoryGrid.pagerConfig.total = parseInt(res.data.totalCount);

      // 開啟彈窗
      this.modalHistoryShow = true;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 查詢歷程明細
  searchHistDetail(histId) {
    this.setLoading(true);
    this.$cutOffConfigApi.searchHistDetailUsingGET(histId)
    .then((res) => {
      const content = res.data.content;

      if (!this.isEmpty(content)) {
        Object.entries(content).forEach(([key, item], index) => {
          if (!this.isEmpty(this.checkInfoContentForm[key])) {
            this.checkInfoContentForm[key].key = item;
          }
        });
        this.checkInfoContentForm.cashCutOffDay.key = !this.isEmpty(content.cashCutOffDay) ? `SD-${content.cashCutOffDay}` : undefined;
        this.checkInfoContentForm.equityCutOffDay.key = !this.isEmpty(content.equityCutOffDay) ? `SD-${content.equityCutOffDay}` : undefined;
        this.checkInfoContentForm.tradeCycle.key = !this.isEmpty(content.tradeCycle) ? `SD-${content.tradeCycle}` : undefined;
        this.checkInfoContentForm.type.key = this.$cfEnum.getLabel('typeOption', content.type);
      }

      // 開啟檢視彈窗
      this.modalCheckInfoShow = true;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 歷程頁數改變
  handleHistPageChange(e) {
    // call API
    this.paginateHist({
      ...this.tempHistoryInfo,
      pageNum: e.currentPage,
      pageSize: e.pageSize,
    });
  }

  // 取得歷程檢視明細
  getHisSelected(e) {
    // call API
    this.searchHistDetail(e.row.histId);
  }

  // 取得選項
  getOptionObject(options, value) {
    for (let i = 0; i < options.length; i++) {
      if (options[i].val === value) {
        return options[i];
      }
    }
    return null;
  }
}
