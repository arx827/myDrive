import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import ExpandDataGridModal from '@/components/demoData/ExpandDataGridModal.vue';

 @Component({
  components: {
    IpkVxeTable,
    ExpandDataGridModal,
  },
 })
 export default class VxeTableExpandDemo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  showModalFlag = false // 資金調撥單彈窗開啟

  /** *  資料明細 ** */
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
    columns: [
      {
        title: '操作',
        field: 'actionType',
        fixed: 'left',
        headerAlign: 'left',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '帳本別',
        field: 'kbCode',
        fixed: 'left',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: { default: 'link' },
      },
      {
        title: '帳本別/名稱',
        field: 'kbName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '生效起日',
        field: 'effectStartDatec',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '生效訖日',
        field: 'effectEndDatec',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '備註',
        field: 'memo',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '狀態',
        field: 'caseStatus',
        width: 160,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$actEnum.getObject('caseStatusEnum', row.caseStatus).color,
                text: this.$actEnum.getObject('caseStatusEnum', row.caseStatus).key,
              },
            }),
          ],
        },
      },
      {
        title: '拒絕原因',
        field: 'rejectReason',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '建立人員',
        field: 'createName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '建立日期',
        field: 'createDate',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '異動人員',
        field: 'updateName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '覆核人員',
        field: 'reviewName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '覆核日期',
        field: 'reviewDate',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  };

  /**
   * hook
   */
  created() {
    // 查詢
    this.reloadData();
  }

  /**
  * methods
  */
  // 取得更多操作及欄位資訊
  getActionType(e) {
    console.log('取得更多操作及欄位資訊', e);
  }

  reloadData() {
    const content = [
      {
        serialNo: '1833',
        kbCode: '99',
        kbName: 'test748',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1834',
        kbCode: '99',
        kbName: 'test749',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1835',
        kbCode: '99',
        kbName: 'test750',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1836',
        kbCode: '99',
        kbName: 'test751',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1837',
        kbCode: '99',
        kbName: 'test752',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1838',
        kbCode: '99',
        kbName: 'test753',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1839',
        kbCode: '99',
        kbName: 'test754',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1840',
        kbCode: '99',
        kbName: 'test755',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'U',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1841',
        kbCode: '99',
        kbName: 'test756',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'R',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1842',
        kbCode: '99',
        kbName: 'test757',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'E',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
      {
        serialNo: '1843',
        kbCode: '99',
        kbName: 'test758',
        effectStartDatec: '20220630',
        effectEndDatec: '20220707',
        caseStatus: 'H',
        memo: null,
        applySeq: null,
        createId: 'b1854',
        createName: '',
        createDate: '20220701 131533',
        updateId: 'b1854',
        updateName: '',
        updateDate: '20220701 131533',
        rejectReason: null,
        reviewId: null,
        reviewName: '',
        reviewDate: null,
        action: null,
      },
    ];
    this.ipkGrid.data = [];
      if (!validateUtil.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            ...item,
            actionType: item.caseStatus ? this.$actEnum.getVal('getOptionsEnum', item.caseStatus) : undefined,
            actionTypeDisabled: item.caseStatus && (item.caseStatus !== this.$actEnum.caseStatusConstant.UNCHECK.val && item.caseStatus !== this.$actEnum.caseStatusConstant.ENABLE.val),
          });
        });
      }
    // *** 如需使用分頁，不管是使用前後端分頁，請加下列這段程式
    this.ipkGrid.pagerConfig.total = this.ipkGrid.data.length;
    // *** 如由後端分頁，則不需加下列三段程式碼，以下程式碼為前端分頁使用
    this.ipkGrid.data = this.ipkGrid.data.slice(
      (this.ipkGrid.pagerConfig.currentPage - 1) * this.ipkGrid.pagerConfig.pageSize,
      this.ipkGrid.pagerConfig.currentPage * this.ipkGrid.pagerConfig.pageSize,
    );
  }

  openCheckInfoModal() {
    console.log('打開彈窗');
  }

  // 交易明細排序
  onSortChange(e) {
    // API 參考
    // this.searchXXXX({ sort: e.sort });
  }

  // 交易明細換頁
  handlePageChange(e) {
    this.ipkGrid.pagerConfig.currentPage = e.currentPage;
    this.ipkGrid.pagerConfig.pageSize = e.pageSize;
    // API
    this.reloadData();
  }

  // 開啟資金調撥彈窗
  openModal() {
    this.showModalFlag = true;
  }

  // 關閉資金調撥彈窗
  closeModal(closeFlag) {
    this.showModalFlag = closeFlag;
  }
}
