import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { CfFbSsiUidDto } from '@fubonlife/ipk-api-axios-sdk';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

@Component({
  components: {
    IpkVxeTable,
  },
})
export default class DataEquityHistoryModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  historyShow: boolean // modal開關

  @Prop()
  historyInfo: any // 傳進來的資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  modalTitle = '' // modal標題

  currentEquityHistoryDetail = {}; // [查詢] 紀錄查詢時輸入參數

  ipkGrid: IpkVxeTableModel = { // [歷程查詢]
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
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
        field: 'changeType',
        width: 100,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          let num = String(data.cellValue);
          if (num === this.$cfEnum.constant.MODIFY.val) {
            return this.$cfEnum.constant.MODIFY.key;
          }
          if (num === this.$cfEnum.constant.ADD.val) {
            return this.$cfEnum.constant.ADD.key;
          }
        },
      },
      {
        title: '保管帳號',
        field: 'safekeepingAccount',
        width: 200,
      },
      {
        title: '保管行名稱',
        field: 'safekeepingName',
        width: 200,
      },
      {
        title: 'Market',
        field: 'market',
        width: 200,
      },
      {
        title: 'Settlement Location',
        field: 'settlementLocation',
        width: 200,
      },
      {
        title: 'Custodian ID Type',
        field: 'custodianIdType',
        width: 200,
      },
      {
        title: 'Custodian ID',
        field: 'custodianId',
        width: 200,
      },
      {
        title: 'Custodian Account',
        field: 'custodianAccount',
        width: 300,
      },
      {
        title: 'Clearer ID Type',
        field: 'clearerIdType',
        width: 200,
      },
      {
        title: 'Clearer ID',
        field: 'clearId',
        width: 200,
      },
      {
        title: 'Clearer Account',
        field: 'clearAccount',
        width: 200,
      },
      {
        title: '統編',
        field: 'taxId',
        width: 200,
      },
      {
        title: '公債帳號對應銀行',
        field: 'pdAccountBank',
        width: 200,
      },
      {
        title: '附言',
        field: 'memo',
        width: 200,
      },
      {
        title: '備註',
        field: 'remark',
        width: 200,
      },
      {
        title: '預設',
        field: 'isDefault',
        width: 60,
      },
      {
        title: '異動人員',
        field: 'updateId',
        width: 100,
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 200,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
    ],
  };

  /**
   * watch
   */
  @Watch('historyShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('historyInfo', { immediate: true, deep: true })
  onValChange(val) {
    if (this.isEmpty(val) || this.isEmpty(val.editInfo)) {
      return;
    }
    // 查詢
    let dto = {
      uid: this.isEmpty(val.editInfo.uid) ? undefined : val.editInfo.uid,
      market: this.isEmpty(val.editInfo.market) ? undefined : val.editInfo.market,
      settlementLocation: this.isEmpty(val.editInfo.settlementLocation) ? undefined : val.editInfo.settlementLocation,
      pageNum: 1,
      pageSize: 10,
    };
    this.searchHistory(dto);
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
  // -------------------歷程-------------------
  // 查詢歷程
  searchHistory(dto) {
    // 紀錄目前機構資訊、頁碼、排序等資訊
    this.currentEquityHistoryDetail = dto;
    // 歷程查詢
    this.setLoading(true);
    this.$fubonSsiApi.paginateEquityHistUsingPOST(dto)
      .then((resp) => {
        const content = resp.data.content;

        this.ipkGrid.data = [];
        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              ...item,
            });
          });
        }
        this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
        this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
        this.ipkGrid.pagerConfig.total = parseInt(resp.data.totalCount);
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // -------------------其他-------------------
  // 關閉modal
  closeHistoryModal() {
    this.$emit('closeHistoryModal');
  }

  // 頁碼改變
  handlePageChange(e) {
    // 輸入的資訊+頁碼變化 再打API
    let searchDto: CfFbSsiUidDto;
    searchDto = {
      ...this.currentEquityHistoryDetail,
      pageNum: e.currentPage,
      pageSize: e.pageSize,
    };
    this.searchHistory(searchDto);
  }

  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }
}
