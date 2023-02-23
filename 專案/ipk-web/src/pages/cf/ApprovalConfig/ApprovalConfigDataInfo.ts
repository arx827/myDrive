import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';

import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import AddAndEditModal from '@/pages/cf/ApprovalConfig/AddAndEditModal.vue';
import HistoryModal from '@/pages/cf/ApprovalConfig/HistoryModal.vue';

@Component({
  components: {
    AddAndEditModal,
    HistoryModal,
    IpkVxeTable,
  },
})
export default class ApprovalConfigDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  modalAddInfoShow = false; // [編輯彈窗] modal開關

  historyShow = false; // [歷史彈窗] modal開關

  addAndEditInfo = { // [編輯彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  historyInfo = { // [歷史彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  ipkGrid: IpkVxeTableModel = { // [初始查詢] 查詢結果
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    maxHeight: '650',
    height: '650',
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '操作',
        field: 'actionType',
        headerAlign: 'left',
        align: 'center',
        fixed: 'left',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '商品類別',
        field: 'productType',
      },
      {
        title: '計算類型',
        field: 'calculateType',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('calculateTypeOption', String(data.cellValue));
        },
      },
      {
        title: '計算幣別',
        field: 'currency',
      },
      {
        title: '職等六上限',
        field: 'amountLv1',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return Number(data.cellValue) / 100000000;
        },
      },
      {
        title: '科主管上限',
        field: 'amountLv2',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return Number(data.cellValue) / 100000000;
        },
      },
      {
        title: '部副主管上限',
        field: 'amountLv3',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return Number(data.cellValue) / 100000000;
        },
      },
      {
        title: '部主管上限',
        field: 'amountLv4',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return Number(data.cellValue) / 100000000;
        },
      },
      {
        title: '處主管',
        field: 'amountLv4Above',
        formatter: (data) => {
          if (!data.row || !data.row.amountLv4) {
            return null;
          }
          return (`大於${Number(data.row.amountLv4) / 100000000}`);
        },
      },
    ],
  };

  /**
   * hook
   */
  created() {
    // 執行初始查詢
    this.getApprovalConfig();
  }

  /**
  * methods
  */
  // 查詢簽核權限設定
  getApprovalConfig() {
    this.setLoading(true);
    this.$approvalConfigApi.searchConfigUsingPOST()
      .then((resp) => {
        const content = resp.data.content;
        const actionTypeOption = [...this.$cfEnum.actionTypeOption];
        actionTypeOption.shift();

        this.ipkGrid.data = [];
        if (!validateUtil.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              actionType: actionTypeOption,
              ...item,
            });
          });
        }

        // 查詢待放行清單筆數
        this.$emit('getPendingInfoCount');
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得更多操作及欄位資訊
  getActionType(e) {
    let getButtonsAuthInfoObj;
    switch (e.actionType) {
      // 修改
      case 'M':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val, this.$cfButtonKey.buttonKey.MODIFY.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openAddAndEditModal(e.actionType, e.rowData);
        break;
      // 歷程
      case 'H':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openHistoryModal(e.actionType, e.rowData);
        break;
    }
  }

  // 開啟編輯彈窗
  openAddAndEditModal(actionType, editDto) {
    this.modalAddInfoShow = true;
    this.addAndEditInfo.actionType = actionType;
    this.addAndEditInfo.editInfo = editDto;
  }

  // 開啟歷程彈窗
  openHistoryModal(actionType, editDto) {
    this.historyShow = true;
    this.historyInfo.actionType = actionType;
    this.historyInfo.editInfo = editDto;
  }

  // 關閉編輯彈窗
  closeAddAndEditModal() {
    this.modalAddInfoShow = false;
  }

  // 關閉歷程彈窗
  closeHistoryModal() {
    this.historyShow = false;
  }
}
