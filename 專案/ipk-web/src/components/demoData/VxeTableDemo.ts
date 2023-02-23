import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

@Component({
  components: {
    IpkVxeTable,
  },
})
export default class VxeTableDemo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */

  // 編輯/儲存/取消按鈕顯示控制
  showEditBtn = true;

  showSaveBtn = false;

  showEditFlag = false; // 是否顯示修改框的flag

  tempOldData = []; // 暫存修改資料

  oldData = []; // 修改前的資料

  newData = []; // 修改後的資料

  /** *  資料明細 ** */
  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: {
      enabled: false,
    },
    // 分頁配置
    // pagerConfig: {
    //   enabled: true,
    //   currentPage: 1,
    //   total: 0,
    //   pageSize: 10,
    //   pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
    //   layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    // },
    border: true,
    showOverflow: 'ellipsis',
    tableHeight: '566px', // 如有設定分頁則不用設定table高度
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '操作',
        field: 'actionType',
        fixed: 'left',
        headerAlign: 'center',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '序號',
        type: 'seq',
        fixed: 'left',
        headerAlign: 'center',
        align: 'center',
        width: 100,
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
        slots: { default: 'editInput' }, // 編輯input框
      },
      {
        title: '資產區隔代碼',
        field: 'portfolioCode',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: { default: 'editSelection' }, // 編輯下拉選單
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
   * computed
   */
  // sass取得table高度 ***需再到.vue檔增加scss
  get tableHeight() {
    return this.ipkGrid.tableHeight;
  }

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
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得更多操作及欄位資訊
  getActionType(e) {
    // 提供編輯欄位下拉選單的選單資料
    const optionList = [
      { label: 'A', value: 'A' },
      { label: 'ANNUITY', value: 'ANNUITY' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'E', value: 'E' },
    ];
    switch (e.actionType) {
      case 'ADD':
        let emptyObj = {};
        this.showEditFlag = true;
        // 將空白列加入
        Object.entries(this.ipkGrid.columns).forEach(([key, value], index) => {
          emptyObj[value.field] = '';
          (emptyObj as any).actionType = [{ label: '新增下一列', value: 'ADD' }, { label: '確認', value: 'SAVE' }, { label: '刪除', value: 'DELETE' }];
          (emptyObj as any).showInput = true;
          (emptyObj as any).portfolioCodeOption = optionList;
        });
        this.ipkGrid.data.splice(e.rowIndex + 1, 0, emptyObj);
        break;
      case 'DELETE':
        this.ipkGrid.data.splice(e.rowIndex, 1);
        break;
      case 'EDIT':
        // 暫存修改前的資料
        this.tempOldData = this.ipkGrid.data[e.rowIndex];
        this.ipkGrid.data[e.rowIndex].actionType = [{ label: '確認', value: 'SAVE' }, { label: '取消', value: 'CANCEL' }];
        this.ipkGrid.data[e.rowIndex].showInput = true;
        this.ipkGrid.data[e.rowIndex].portfolioCodeOption = optionList;
        this.showEditFlag = true;
        break;
      case 'SAVE':
        this.ipkGrid.data[e.rowIndex].showInput = false;
        delete this.ipkGrid.data[e.rowIndex].portfolioCodeOption;
        this.ipkGrid.data[e.rowIndex].actionType = [{ label: '新增下一列', value: 'ADD' }, { label: '編輯', value: 'EDIT' }, { label: '刪除', value: 'DELETE' }];
        break;
      case 'CANCEL':
        this.ipkGrid.data[e.rowIndex].showInput = false;
        delete this.ipkGrid.data[e.rowIndex].portfolioCodeOption;
        this.ipkGrid.data[e.rowIndex].actionType = [{ label: '新增下一列', value: 'ADD' }, { label: '編輯', value: 'EDIT' }, { label: '刪除', value: 'DELETE' }];
        this.ipkGrid.data[e.rowIndex] = this.tempOldData;
        break;
    }
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
        portfolioCode: null,
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
    if (!this.isEmpty(content)) {
      content.forEach((item) => {
        this.ipkGrid.data.push({
          ...item,
          actionType: [{ label: '新增下一列', value: 'ADD' }, { label: '編輯', value: 'EDIT' }, { label: '刪除', value: 'DELETE' }],
          showInput: '',
          // actionTypeDisabled: item.caseStatus !== undefined
          // && (item.caseStatus !== this.$actEnum.caseStatusConstant.UNCHECK.val && item.caseStatus !== this.$actEnum.caseStatusConstant.ENABLE.val),
          // 編輯框顯示條件
          // showInput: item.caseStatus !== undefined && (item.caseStatus !== this.$actEnum.caseStatusConstant.UNCHECK.val && item.caseStatus !== this.$actEnum.caseStatusConstant.ENABLE.val),
        });
      });
    }
    // *** 如需使用分頁，不管是使用前後端分頁，請加下列這段程式
    // this.ipkGrid.pagerConfig.total = this.ipkGrid.data.length;
    // *** 如由後端分頁，則不需加下列三段程式碼，以下程式碼為前端分頁使用
    // this.ipkGrid.data = this.ipkGrid.data.slice(
    //   (this.ipkGrid.pagerConfig.currentPage - 1) * this.ipkGrid.pagerConfig.pageSize,
    //   this.ipkGrid.pagerConfig.currentPage * this.ipkGrid.pagerConfig.pageSize,
    // );
  }

  // 顯示編輯欄位
  showEditColumn() {
    // 暫存修改前的資料
    this.tempOldData = this.ipkGrid.data.map((item) => ({ ...item }));
    // 提供編輯欄位下拉選單的選單資料
    let optionList = [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
    ];
    this.ipkGrid.data.map((el, index) => {
      el.portfolioCodeOption = optionList;
    });
    this.showEditFlag = true;
    this.showEditBtn = false;
    this.showSaveBtn = true;
  }

  // 編輯欄位change
  handleEditChange(e) {
    console.log('ipkGrid', this.ipkGrid.data[e.rowIndex]);
    // let editBeforeValue = this.tempOldData[e.rowIndex][e.columnName];
    // let editAfterValue = e.changedValue ? e.changedValue : null;

    // // 取得newData中的所有serialNo
    // let allSerialNo = this.newData.map((item) => item.serialNo);
    // // 在所有serialNo中尋找跟新資料的serialNo相同的index
    // let getIndex = allSerialNo.indexOf(e.rowData.serialNo);

    // // 如果更改的值跟原始的值不同
    // if (editBeforeValue !== editAfterValue) {
    //   // 如果找不到相同值的話getIndex就會為 -1，並把新資料push進去
    //   if (getIndex === -1) {
    //     // 將此列修改的欄位名放在editColumnList並加進rowData中
    //     this.newData.push(
    //       { ...e.rowData, editColumnList: [e.columnName] },
    //     );
    //   } else {
    //     // 從newData中找到相同值並以其index抓出editColumnList
    //     const editColumnList = this.newData[getIndex].editColumnList;
    //     // 比對editColumnList中是否有當前修改的欄位名稱，沒有的話將此欄位名稱push進去
    //     if (!editColumnList.includes(e.columnName)) {
    //       editColumnList.push(e.columnName);
    //     }
    //     // 如果有找到相同serialNo且當前修改的欄位名稱之前已有修改過，就會取得其index，把相同serialNo的資料替換成新資料
    //     this.newData[getIndex] = { ...e.rowData, editColumnList: [e.columnName] };
    //   }
    // } else {
    //   // 如果更改的值跟原始的值相同
    //   // 從newData中的editColumnList篩選出跟當前修改欄位不同的欄位
    //   let diffArr = this.newData[getIndex].editColumnList.filter((item) => item !== e.columnName);
    //   // 如果無篩選出不同欄位，代表與原始資料相符，將其從newData中移除
    //   if (this.isEmpty(diffArr)) {
    //     this.newData.splice(getIndex, 1);
    //   } else {
    //     // 如果有篩選出不同的欄位，代表有做其他修改，將篩選出的欄位放回editColumnList
    //     this.newData[getIndex] = { ...e.rowData, editColumnList: diffArr };
    //   }
    // }
  }

  // 儲存編輯資料
  saveEditColumn() {
    // 最終只需要將有修改的列傳給後端，資料已在handleEditChange中做整理
    console.log('this.newData', this.newData);

    // call API
    console.log('儲存成功');
    this.resetEdit();
  }

  // 取消顯示編輯欄位
  cancelEditColumn() {
    this.resetEdit();
    this.ipkGrid.data = this.tempOldData;
  }

  // reset編輯按鈕及data
  resetEdit() {
    this.showEditFlag = false;
    this.showEditBtn = true;
    this.showSaveBtn = false;
    this.newData = [];
    this.oldData = [];
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
  // handlePageChange(e) {
  //   this.ipkGrid.pagerConfig.currentPage = e.currentPage;
  //   this.ipkGrid.pagerConfig.pageSize = e.pageSize;
  //   // API
  //   this.reloadData();
  // }
}
