import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

@Component({
  components: {
    IpkVxeTable,
  },
})
export default class HistoryModal extends Vue {
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

  ipkGrid: IpkVxeTableModel = { // [歷程查詢]
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
        title: '操作類型',
        field: 'changeType',
        fixed: 'left',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          let num = String(data.cellValue);
          if (num === this.$cfEnum.constant.MODIFY.val) {
            return this.$cfEnum.constant.MODIFY.key;
          }
        },
      },
      {
        title: '商品類別',
        field: 'productType',
        width: '200px',
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

  /**
   * watch
   */
  @Watch('historyShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('historyInfo', { immediate: true, deep: true })
  onValChange(val) {
    if (validateUtil.isEmpty(val)) {
      return;
    }
    this.searchHistory(val);
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
  // 關閉modal
  closeHistoryModal() {
    this.$emit('closeHistoryModal');
  }

  // 歷程查詢
  searchHistory(val) {
    this.setLoading(true);
    this.$approvalConfigApi.searchHistUsingPOST(val.editInfo)
      .then((resp) => {
        this.ipkGrid.data = resp.data.content;
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }
}
