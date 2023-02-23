import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import infoModal from '@/plugins/notification/infoModal';
import { CfFbSsiUidDto } from '@fubonlife/ipk-api-axios-sdk';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import DataCashAddModal from '@/pages/cf/FubonSsi/DataCashAddModal.vue';
import DataCashEditModal from '@/pages/cf/FubonSsi/DataCashEditModal.vue';
import DataCashHistoryModal from '@/pages/cf/FubonSsi/DataCashHistoryModal.vue';

@Component({
  components: {
    IpkVxeTable,
    DataCashAddModal,
    DataCashHistoryModal,
    DataCashEditModal,
    IpkButton,
  },
})
export default class DataCashPage extends Vue {
  @Action('setLoading') setLoading;
  /**
  * props
  */

  @Prop()
  modalAddInfoShow: boolean // modal開關

  @Prop()
  checkInfo: any // 檢視傳過來的資訊

  /**
  * data
  */
  cashModalAddInfoShow = false; // [檢視彈窗] modal開關

  currentCashDetail = {}; // [查詢] 紀錄查詢時輸入參數(機構資訊)

  historyShow = false; // [歷史彈窗] modal開關

  historyInfo = { // [歷史彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  cashEditInfoShow = false; // [修改彈窗] modal開關

  cashEditInfo = { // [修改彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
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
    checkboxConfig: {
      showHeader: true,
      strict: true,
    },
    columns: [
      {
        title: '操作',
        field: 'actionType',
        headerAlign: 'left',
        fixed: 'left',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '受款銀行代碼',
        field: 'bfBankId',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '受款銀行帳號',
        field: 'bfBankAccount',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '受款銀行名稱',
        field: 'bfBankName',
        width: 300,
      },
      {
        title: '受款人帳號',
        field: 'bfAccount',
        width: 150,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '受款人戶名',
        field: 'bfAccountName',
        width: 300,
      },
      {
        title: '中間行代碼',
        field: 'imBankCode',
        width: 150,
      },
      {
        title: '中間行名稱',
        field: 'imBankName',
        width: 300,
      },
      {
        title: '調撥銀行帳號',
        field: 'tfBankAccount',
        width: 150,
      },
      {
        title: '調撥銀行名稱',
        field: 'tfBankName',
        width: 300,
      },
      {
        title: '預設',
        field: 'isDefault',
        width: 50,
      },
    ],
  };

  /**
  * watch
  */
  @Watch('checkInfo', { immediate: true, deep: true })
  onValChange(val) {
    if (this.isEmpty(val.editInfo.uid)) {
      this.ipkGrid.data = [];
      return;
    }
    // 初次查詢
    let dto = {
      uid: this.isEmpty(val.editInfo.uid) ? undefined : val.editInfo.uid,
      pageNum: 1,
      pageSize: 10,
    };
    this.searchCashDetail(dto);
  }

  /**
   * method
   */
  // -------------------查詢-------------------
  // 查詢款帳號資訊
  searchCashDetail(dto) {
    // 紀錄目前機構資訊、頁碼、排序等資訊
    this.currentCashDetail = dto;
    this.setLoading(true);
    // 分頁查詢款帳號
    this.$fubonSsiApi.paginateCashUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        const actionTypeOption = [...this.$cfEnum.actionTypeOption];
        actionTypeOption.shift();

        this.ipkGrid.data = [];
        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              actionType: actionTypeOption,
              ...item,
            });
          });
        }
        this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
        this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
        this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);
      })
      .catch((error) => {
        // API失敗
        infoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // -------------------操作-------------------
  // 取得更多操作及欄位資訊
  getActionType(e) {
    switch (e.actionType) {
      // 修改
      case 'M':
        if (this.checkInfo.editInfo.isEnable !== '1') {
          // TODO: 訊息調整
          infoModal.alertInfo({ confirm: false, content: '資料非啟用狀態，不可修改。' });
          return;
        }
        this.openCashEditModal(e.actionType, e.rowData);
        break;
      // 歷程
      case 'H':
        this.openCashHistoryModal(e.actionType, e.rowData);
        break;
    }
  }

  // 開啟編輯彈窗
  openCashEditModal(actionType, editDto) {
    this.cashEditInfoShow = true;
    this.cashEditInfo.actionType = actionType;
    this.cashEditInfo.editInfo = editDto;
  }

  // 開啟歷程彈窗
  openCashHistoryModal(actionType, editDto) {
    this.historyShow = true;
    this.historyInfo.actionType = actionType;
    this.historyInfo.editInfo = editDto;
  }

  // 關閉編輯彈窗
  closeCashEditModal() {
    this.cashEditInfoShow = false;
  }

  // 關閉歷程彈窗
  closeCashHistoryModal() {
    this.historyShow = false;
  }

  // 開啟新增彈窗(款)
  openAddAndEditModal() {
    if (this.checkInfo.editInfo.isEnable !== '1') {
      // TODO: 訊息調整
      infoModal.alertInfo({ confirm: false, content: '資料非啟用狀態，不可修改。' });
      return;
    }
    this.cashModalAddInfoShow = true;
  }

  // 關閉新增彈窗(款)
  closeAddAndEditModal() {
    this.cashModalAddInfoShow = false;
  }

  // -------------------其他-------------------
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 頁碼改變
  handlePageChange(e) {
    // 輸入的資訊+頁碼變化 再打API
    let searchDto: CfFbSsiUidDto;
    searchDto = {
      ...this.currentCashDetail,
      pageNum: e.currentPage,
      pageSize: e.pageSize,
    };
    this.searchCashDetail(searchDto);
  }

  // 表格欄位排序
  onSortChange(e) {
    // 輸入的資訊+頁碼變化+排序內容 再打API
    let searchDto: CfFbSsiUidDto;
    searchDto = {
      ...this.currentCashDetail,
      pageNum: this.ipkGrid.pagerConfig.currentPage,
      pageSize: this.ipkGrid.pagerConfig.pageSize,
      sort: e.sort,
    };
    this.searchCashDetail(searchDto);
  }

  // 子頁簽傳遞getPendingInfoCount 查詢待放行筆數更新
  getPendingInfoCount() {
    // 查詢待放行清單筆數
    this.$emit('getPendingInfoCount');
  }
}
