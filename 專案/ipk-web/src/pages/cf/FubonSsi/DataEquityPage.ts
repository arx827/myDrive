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
import DataEquityAddModal from '@/pages/cf/FubonSsi/DataEquityAddModal.vue';
import DataEquityHistoryModal from '@/pages/cf/FubonSsi/DataEquityHistoryModal.vue';
import DataEquityEditModal from '@/pages/cf/FubonSsi/DataEquityEditModal.vue';

@Component({
  components: {
    IpkVxeTable,
    DataEquityAddModal,
    DataEquityHistoryModal,
    DataEquityEditModal,
    IpkButton,
  },
})
export default class DataEquityPage extends Vue {
  @Action('setLoading') setLoading;
  /**
  * props
  */

  @Prop()
  modalAddInfoShow: boolean // modal開關

  @Prop()
  checkInfo: any // 新增修改資訊

  /**
  * data
  */
  equityModalAddInfoShow = false; // [檢視彈窗] modal開關

  currentEquityDetail = {}; // [查詢] 紀錄查詢時輸入參數(機構資訊)

  historyShow = false; // [歷史彈窗] modal開關

  historyInfo = { // [歷史彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  equityEditInfoShow = false; // [修改彈窗] modal開關

  equityEditInfo = { // [修改彈窗] 資料帶入
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
        title: '保管帳號',
        field: 'safekeepingAccount',
        width: 120,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '保管行名稱',
        field: 'safekeepingName',
        width: 200,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'Market',
        field: 'market',
        width: 130,
      },
      {
        title: 'Settlement Location',
        field: 'settlementLocation',
        width: 180,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'Custodian ID Type',
        field: 'custodianIdType',
        width: 180,
      },
      {
        title: 'Custodian ID',
        field: 'custodianId',
        width: 180,
      },
      {
        title: 'Custodian Account',
        field: 'custodianAccount',
        width: 300,
      },
      {
        title: 'Clearer ID Type',
        field: 'clearerIdType',
        width: 180,
      },
      {
        title: 'Clearer ID',
        field: 'clearerId',
        width: 180,
      },
      {
        title: 'Clearer Account',
        field: 'clearerAccount',
        width: 180,
      },
      {
        title: '統編',
        field: 'taxId',
        width: 130,
      },
      {
        title: '公債帳號對應銀行',
        field: 'pdAccountBank',
        width: 180,
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
    this.searchEquityDetail(dto);
  }

  /**
   * method
   */
  // -------------------查詢-------------------
  // 查詢券帳號資訊
  searchEquityDetail(dto) {
    // 紀錄目前機構資訊、頁碼、排序等資訊
    this.currentEquityDetail = dto;
    this.setLoading(true);
    // 分頁查詢款帳號
    this.$fubonSsiApi.paginateEquityUsingPOST(dto)
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

  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
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
        this.openEquityEditModal(e.actionType, e.rowData);
        break;
      // 歷程
      case 'H':
        this.openEquityHistoryModal(e.actionType, e.rowData);
        break;
    }
  }

  // 開啟編輯彈窗
  openEquityEditModal(actionType, editDto) {
    this.equityEditInfoShow = true;
    this.equityEditInfo.actionType = actionType;
    this.equityEditInfo.editInfo = editDto;
  }

  // 開啟歷程彈窗
  openEquityHistoryModal(actionType, editDto) {
    this.historyShow = true;
    this.historyInfo.actionType = actionType;
    this.historyInfo.editInfo = editDto;
  }

  // 關閉編輯彈窗
  closeEquityEditModal() {
    this.equityEditInfoShow = false;
  }

  // 關閉歷程彈窗
  closeEquityHistoryModal() {
    this.historyShow = false;
  }

  // 開啟新增彈窗(券)
  openAddAndEditModal() {
    if (this.checkInfo.editInfo.isEnable !== '1') {
      // TODO: 訊息調整
      infoModal.alertInfo({ confirm: false, content: '資料非啟用狀態，不可修改。' });
      return;
    }
    this.equityModalAddInfoShow = true;
  }

  // 關閉新增彈窗(券)
  closeAddAndEditModal() {
    this.equityModalAddInfoShow = false;
  }

  // -------------------其他-------------------
  // 頁碼改變
  handlePageChange(e) {
    // 輸入的資訊+頁碼變化 再打API
    let searchDto: CfFbSsiUidDto;
    searchDto = {
      ...this.currentEquityDetail,
      pageNum: e.currentPage,
      pageSize: e.pageSize,
    };
    this.searchEquityDetail(searchDto);
  }

  // 表格欄位排序
  onSortChange(e) {
    // 輸入的資訊+頁碼變化+排序內容 再打API
    let searchDto: CfFbSsiUidDto;
    searchDto = {
      ...this.currentEquityDetail,
      pageNum: this.ipkGrid.pagerConfig.currentPage,
      pageSize: this.ipkGrid.pagerConfig.pageSize,
      sort: e.sort,
    };
    this.searchEquityDetail(searchDto);
  }

  // 子頁簽傳遞getPendingInfoCount 查詢待放行筆數更新
  getPendingInfoCount() {
    // 查詢待放行清單筆數
    this.$emit('getPendingInfoCount');
  }
}
