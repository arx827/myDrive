import ExpandDataGrid from '@/components/demoData/ExpandDataGrid.vue';
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component({
  components: {
    ExpandDataGrid,
  },
})
export default class ExpandDataGridModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  showModalFlag

  /**
  * data
  */

  selectedRowList = []; // 已選取的清單項目

  // 父層 欄位資料
  outerPendingGridData = {
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    showOverflow: 'ellipsis',
    tableHeight: '718px',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    checkboxConfig: {
      showHeader: true,
      strict: true,
      labelField: 'niiArNo',
    },
    expandConfig: {
      iconOpen: 'fa fa-minus-square-o',
      iconClose: 'fa fa-plus-square-o',
      expandAll: true,
      showIcon: false,
    },
    columns: [
      {
        title: '',
        field: 'niiArNo',
        type: 'checkbox',
        align: 'center',
        width: 50,
      },
      {
        type: 'expand',
        title: '',
        field: 'expandIcon',
        align: 'center',
        slots: { default: 'content' },
        width: 1,
      },
      {
        title: '交易編號',
        field: 'transactionNo',
      },
    ],
  }

  parentPendingGridData = {
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    showOverflow: 'ellipsis',
    tableHeight: '718px',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    checkboxConfig: {
      showHeader: true,
      strict: true,
      labelField: 'transactionSerialNo',
    },
    columns: [
      {
        title: '交易流水編號',
        field: 'transactionSerialNo',
        width: 160,
      },
      {
        title: '資產類別',
        field: 'assetType',
        width: 160,
      },
      {
        title: '交易日',
        field: 'transactionDate',
        width: 100,
        formatter: (data) => {
          if (!data) {
            return null;
          }
          return moment(data).format('YYYY/MM/DD');
        },
      },
      {
        title: '交割日',
        field: 'deliveryDate',
        width: 160,
        formatter: (data) => {
          if (!data) {
            return null;
          }
          return moment(data).format('YYYY/MM/DD');
        },
      },
      {
        title: '交易對象',
        field: 'transactionName',
        width: 300,
      },
      {
        title: '債券標的',
        field: 'bondSubject',
        width: 160,
      },
      {
        title: '付款金額',
        field: 'paymentAmount',
        width: 160,
      },
    ],
  }

  // 子層 欄位資料
  childrenPendingGridData = {
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '調撥單編號',
        field: 'requisitionCode',
        width: 160,
      },
      {
        title: '交易類型代碼',
        field: 'transactionTypeCode',
        width: 160,
      },
      {
        title: '表單類型',
        field: 'sheetType',
        width: 160,
      },
      {
        title: '資金調撥日',
        field: 'fundingDate',
        width: 160,
        formatter: (data) => {
          if (!data) {
            return null;
          }
          return moment(data).format('YYYY/MM/DD');
        },
      },
      {
        title: '交易對象',
        field: 'transactionName',
        width: 300,
      },
      {
        title: '付款銀行名稱',
        field: 'bankName',
        width: 160,
      },
      {
        title: '備註',
        field: 'memo',
        width: 160,
        slots: { default: 'editInput' },
      },
    ],
  }

  testOuterData = [
    {
      transactionNo: 11,
      parentId: null,
      niiArDatec: '20221026',
      parentData: [
        {
          transactionNo: '11',
          transactionSerialNo: 'THDFI220406001_1',
          assetType: '國債',
          transactionDate: '2022/08/21',
          deliveryDate: '2022/08/23',
          transactionName: '康和證券',
          bondSubject: 'A07107',
          paymentAmount: '300,000,000.00',
        },
        {
          transactionNo: '11',
          transactionSerialNo: 'THDFI220406001_1',
          assetType: '國債',
          transactionDate: '2022/08/21',
          deliveryDate: '2022/08/23',
          transactionName: '康和證券',
          bondSubject: 'A07107',
          paymentAmount: '',
        },
      ],
      childrenData: [
        {
          transactionSerialNo: 'THDFI220406001_1',
          requisitionCode: null,
          transactionTypeCode: 'A16',
          sheetType: '自動扣款',
          fundingDate: '2022/08/23',
          transactionName: '康和證券',
          bankName: '臺灣銀行仁愛分行',
          bankAccount: '122001004242',
          memo: '',
        },
        {
          transactionSerialNo: 'THDFI220406001_1',
          requisitionCode: null,
          transactionTypeCode: 'A16',
          sheetType: '富邦付款',
          fundingDate: '2022/08/23',
          transactionName: '康和證券',
          bankName: '台北富邦銀行敦南分行',
          bankAccount: '00737102000261',
          memo: '',
        },
      ],
    },
    {
      transactionNo: 12,
      niiArDatec: '20221027',
      parentId: null,
      parentData: [
        {
          transactionSerialNo: 'THDFI220406001_2',
          requisitionCode: null,
          transactionTypeCode: 'A16',
          sheetType: '自動扣款',
          fundingDate: '2022/08/23',
          transactionName: '康和證券',
          bankName: '臺灣銀行仁愛分行',
          bankAccount: '122001004242',
          paymentAmount: '300,000,000.00',
        },
      ],
      childrenData: [
        {
          transactionSerialNo: 'THDFI220406001_2',
          requisitionCode: null,
          transactionTypeCode: 'A16',
          sheetType: '自動扣款',
          fundingDate: '2022/08/23',
          transactionName: '康和證券',
          bankName: '臺灣銀行仁愛分行',
          bankAccount: '122001004242',
          memo: '',
        },
      ],
    },
  ]

  /**
   * hook
   */
  created() {
    // 查詢
    this.searchTableData();
  }

  /**
  * methods
  */
  // 取得待放行清單已選取項目
  getPendingSelected(e) {
    //
  }

  // 查詢待放行清單
  searchTableData() {
    // TODO: CALL API
    this.outerPendingGridData.data = [];
    this.parentPendingGridData.data = [];
    this.childrenPendingGridData.data = [];
    this.outerPendingGridData.data = [...this.testOuterData];
  }

  // 取得待放行清單checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 關閉資金調撥彈窗
  closeModal() {
    this.$emit('closeModal', false);
  }
}
