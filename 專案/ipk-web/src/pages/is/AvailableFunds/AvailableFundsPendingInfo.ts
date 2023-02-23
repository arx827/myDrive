import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import CheckEditInfoModal from '@/components/shared/modal/CheckInfoModal/CheckEditInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import { AvailableFundsPageDto, ReviewDto } from '@fubonlife/ipk-api-axios-sdk';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import transferUtil from '@/plugins/util/transferUtil';
import { isEmpty } from 'xe-utils';

@Component({
  components: {
    CheckInfoModal,
    IpkVxeTable,
    CheckEditInfoModal,
    CustomizationModal,
    IpkButton,
  },
})
export default class AvailableFundsPendingInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  rejectReason = ''; // [拒絕原因] 拒絕內容

  modalCustomizationShow = false; // [拒絕原因] modal開關

  reviewDto = { // 覆核(拒絕)資訊
    applySeq: [],
    reviewStatus: null, // 此reviewStatus為"拒絕"/"放行"流程
    rejectReason: null,
  };

  isPending = false; // 是否從待放行清單點擊檢視

  checkInfoAddForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 新增表單內容 v-model綁定及表單欄位名稱
    fundName: { key: null, label: '名稱', type: 'textarea' },
    amount: { key: null, label: '金額', type: 'textarea' },
    date: { key: null, label: '日期', type: 'textarea' },
    maintainDate: { key: null, label: '資料維護日期', type: 'textarea' },
    caseStatus: { key: null, label: '狀態', type: 'badge' },
    createName: { key: null, label: '建立人員', type: 'textarea' },
    createDate: { key: null, label: '建立日期', type: 'date' },
    updateName: { key: null, label: '異動人員', type: 'textarea' },
    updateDate: { key: null, label: '異動日期', type: 'date' },
    applySeq: { key: null, label: '覆核申請編號', type: 'action' },
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  modalCheckEditInfoShow = false; // [檢視彈窗] modal開關

  checkInfoBeforeForm = {}; // [檢視彈窗] 修改前表單內容 v-model綁定

  checkInfoAfterForm = {}; // [檢視彈窗]修改後表單內容 v-model綁定

  checkInfoEditForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 修改表單預設內容 v-model綁定
    fundName: {
      key: null, isEdit: false, message: null, label: '名稱', type: 'textarea',
    },
    amount: {
      key: null, isEdit: false, message: null, label: '金額', type: 'textarea',
    },
    date: {
      key: null, isEdit: false, message: null, label: '日期', type: 'date',
    },
    maintainDate: {
      key: null, isEdit: false, message: null, label: '資料維護日期', type: 'date',
    },
    createName: {
      key: null, isEdit: false, message: null, label: '建立人員', type: 'textarea',
    },
    createDate: {
      key: null, isEdit: false, message: null, label: '建立日期', type: 'date',
    },
    updateName: {
      key: null, isEdit: false, message: null, label: '異動人員', type: 'textarea',
    },
    updateDate: {
      key: null, isEdit: false, message: null, label: '異動日期', type: 'date',
    },
    applySeq: {
      key: null, isEdit: false, message: null, label: '覆核申請編號', type: 'action',
    },
  };

  selectedRowList = []; // 已選取的待放行清單項目

  pendingDataGrid: IpkVxeTableModel = { // [待放行清單] 查詢結果
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
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
    },
    columns: [
      {
        type: 'checkbox',
        fixed: 'left',
        align: 'center',
        width: 60,
      },
      {
        title: '類型',
        field: 'actionType',
        fixed: 'left',
        width: 140,
        slots: { default: 'action' },
      },
      {
        title: '資料維護日期',
        field: 'maintainDate',
        fixed: 'left',
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
        title: '名稱',
        field: 'fundName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '金額',
        field: 'amount',
        width: 180,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return transferUtil.transferPrice(data.cellValue);
        },
      },
      {
        title: '日期',
        field: 'date',
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
    ],
  };

  /**
   * computed
   */

  // sass取得table高度
  get tableHeight() {
    return this.pendingDataGrid.tableHeight;
  }

  /**
   * hook
   */
  created() {
    // 檢視修改前modal表單內容
    this.checkInfoBeforeForm = { ...this.checkInfoEditForm };
    // 檢視修改後modal表單內容
    this.checkInfoAfterForm = { ...this.checkInfoEditForm };
    // 查詢
    this.paginateReviewingAvailableFunds({
      pageNum: 1,
      pageSize: 10,
    });
  }

  /**
  * methods
  */
  // 取得待放行清單已選取項目
  getPendingSelected(e) {
    if (validateUtil.isEmpty(e.row.actionType)) {
      return;
    }

    let actionEnum = e.row.actionType.val;
    // 新增(I)、停用(S)
    if (actionEnum === this.$actEnum.constant.ADD.val || actionEnum === this.$actEnum.constant.STOP.val) {
      this.modalCheckInfoShow = true;
      this.isPending = true;
      this.checkInfoAddForm.fundName.key = e.row.fundName;
      this.checkInfoAddForm.amount.key = e.row.amount;
      this.checkInfoAddForm.date.key = e.row.date;
      this.checkInfoAddForm.maintainDate.key = e.row.maintainDate;
      this.checkInfoAddForm.caseStatus.key = this.$actEnum.getObject('caseStatusEnum', e.row.caseStatus);
      this.checkInfoAddForm.createName.key = e.row.createName;
      this.checkInfoAddForm.createDate.key = e.row.createDate;
      this.checkInfoAddForm.updateName.key = e.row.updateName;
      this.checkInfoAddForm.updateDate.key = e.row.updateDate;
      this.checkInfoAddForm.applySeq.key = e.row.applySeq;
    }
    // 修改(U)
    if (actionEnum === this.$actEnum.constant.MODIFY.val) {
      // 取得修改前資訊
      this.getBeforeInfo(e.row);
    }
  }

  // 查詢待放行清單
  paginateReviewingAvailableFunds(dto: AvailableFundsPageDto) {
    this.setLoading(true);
    this.$availableFundsApi.paginatePendingInfoAvailableFundsUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.pendingDataGrid.data = [];
        if (!validateUtil.isEmpty(content)) {
          content.forEach((item) => {
            let actionEnum = !validateUtil.isEmpty(item.actionType) ? item.actionType : undefined;
            this.pendingDataGrid.data.push({
              ...item,
              actionType: this.$actEnum.getObject('actionEnum', actionEnum),
            });
          });
        }
        this.pendingDataGrid.pagerConfig.currentPage = dto.pageNum;
        this.pendingDataGrid.pagerConfig.pageSize = dto.pageSize;
        this.pendingDataGrid.pagerConfig.total = parseInt(res.data.totalCount);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 待放行清單排序
  onPendingSortChange(e) {
    this.paginateReviewingAvailableFunds({
      pageNum: this.pendingDataGrid.pagerConfig.currentPage,
      pageSize: this.pendingDataGrid.pagerConfig.pageSize,
      sort: e.sort,
    });
  }

  // 取得待放行清單checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 關閉新增檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
    this.isPending = false;
  }

  // 關閉修改檢視彈窗
  closeCheckEditInfoModal() {
    this.modalCheckEditInfoShow = false;
  }

  // 取得修改前資訊
  getBeforeInfo(e) {
    this.setLoading(true);
    this.$availableFundsApi.searchBeforeAvailableFundsUsingPOST(e.seqNo)
    .then((res) => {
      const content = res.data.content;

      // 開啟檢視彈窗
      this.modalCheckEditInfoShow = true;

      // 修改前資訊
      this.checkInfoBeforeForm = {
        fundName: { ...this.checkInfoEditForm.fundName, key: content.fundName },
        amount: { ...this.checkInfoEditForm.amount, key: transferUtil.transferPrice(content.amount) },
        date: { ...this.checkInfoEditForm.date, key: content.date },
        maintainDate: { ...this.checkInfoEditForm.maintainDate, key: content.maintainDate },
        createName: { ...this.checkInfoEditForm.createName, key: content.createName },
        createDate: { ...this.checkInfoEditForm.createDate, key: content.createDate },
        updateName: { ...this.checkInfoEditForm.updateName, key: content.updateName },
        updateDate: { ...this.checkInfoEditForm.updateDate, key: content.updateDate },
        applySeq: { ...this.checkInfoEditForm.applySeq, key: content.applySeq },
      };

      // 建立日期、異動日期去掉時分秒作比對
      let beforeCreateDate = !validateUtil.isEmpty(content.createDate) ? moment(content.createDate).format('YYYY/MM/DD') : null;
      let beforeUpdateDate = !validateUtil.isEmpty(content.updateDate) ? moment(content.updateDate).format('YYYY/MM/DD') : null;
      let afterCreateDate = !validateUtil.isEmpty(e.createDate) ? moment(e.createDate).format('YYYY/MM/DD') : null;
      let afterUpdateDate = !validateUtil.isEmpty(e.updateDate) ? moment(e.updateDate).format('YYYY/MM/DD') : null;
      // 修改後資訊(isEdit: 判斷是否修改，異動欄位改變字體顏色)
      this.checkInfoAfterForm = {
        fundName: { ...this.checkInfoEditForm.fundName, key: e.fundName, isEdit: content.fundName !== e.fundName },
        amount: { ...this.checkInfoEditForm.amount, key: transferUtil.transferPrice(e.amount), isEdit: content.amount !== e.amount },
        date: { ...this.checkInfoEditForm.date, key: e.date, isEdit: content.date !== e.date },
        maintainDate: { ...this.checkInfoEditForm.maintainDate, key: e.maintainDate, isEdit: content.maintainDate !== e.maintainDate },
        createName: { ...this.checkInfoEditForm.createName, key: e.createName, isEdit: content.createName !== e.createName },
        createDate: { ...this.checkInfoEditForm.createDate, key: e.createDate, isEdit: beforeCreateDate !== afterCreateDate },
        updateName: { ...this.checkInfoEditForm.updateName, key: e.updateName, isEdit: content.updateName !== e.updateName },
        updateDate: { ...this.checkInfoEditForm.updateDate, key: e.updateDate, isEdit: beforeUpdateDate !== afterUpdateDate },
        applySeq: { ...this.checkInfoEditForm.applySeq, key: e.applySeq, isEdit: false },
      };
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 整批放行
  handleReviewList(action: string) {
    // validate
    if (validateUtil.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$otherMsgEnumData.REVIEW_ITEM_VALIDATE_INFO?.message });
      return;
    }
    // 整理覆核後端格式
    let reviewDto = {
      applySeq: [],
      reviewStatus: action, // 此reviewStatus為"拒絕"/"放行"流程
      rejectReason: null,
    };
    for (let i = 0; i < this.selectedRowList.length; i++) {
      reviewDto.applySeq.push(this.selectedRowList[i].applySeq);
    }

    // call API
    this.review(reviewDto);
  }

  // 單筆放行
  handleReview(e: any) {
    // 整理覆核後端格式
    let reviewDto = {
      applySeq: e.applySeq,
      reviewStatus: e.reviewStatus, // 此reviewStatus為"拒絕"/"放行"流程
      rejectReason: null,
    };

    // call API
    this.review(reviewDto);
  }

  // 整批拒絕
  handleRejectList(action: string) {
    // validate
    if (validateUtil.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$otherMsgEnumData.REVIEW_ITEM_VALIDATE_INFO?.message });
      return;
    }

    this.reviewDto.applySeq = [];
    this.reviewDto.reviewStatus = action;
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.reviewDto.applySeq.push(this.selectedRowList[i].applySeq);
    }
    // 開啟拒絕原因彈窗
    this.modalCustomizationShow = true;
  }

  // 單筆拒絕
  handleReject(e: any) {
    this.reviewDto.applySeq = e.applySeq;
    this.reviewDto.reviewStatus = e.reviewStatus;
    // 開啟拒絕原因彈窗
    this.modalCustomizationShow = true;
  }

  // 拒絕原因彈窗送出
  submitReject() {
    // 驗證拒絕原因
    if (validateUtil.isEmpty(this.rejectReason)) {
      InfoModal.alertInfo({ confirm: false, content: this.$otherMsgEnumData.REJECT_REASON_REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    this.reviewDto.rejectReason = this.rejectReason;

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REJECT_CONFIRM_INFO?.message,
      onCallback: () => {
        this.review(this.reviewDto);
      },
    });
  }

  // 關閉拒絕原因彈窗
  closeCustomizationModal() {
    this.modalCustomizationShow = false;
    this.rejectReason = null;
  }

  // 覆核
  review(reviewDto: ReviewDto) {
    this.setLoading(true);
    this.$availableFundsApi.reviewAvailableFundsUsingPOST(reviewDto)
    .then((res) => {
      const message = res.data.message;
      const content = res.data.content;

      // 關閉檢視彈窗
      this.closeCheckInfoModal();
      this.closeCheckEditInfoModal();
      // 關閉拒絕彈窗
      if (reviewDto.reviewStatus === this.$actEnum.reviewStatus.REJECT.val) {
        this.closeCustomizationModal();
      }

      // 顯示成功/失敗筆數
      if (content.failedCount === 0) {
        InfoModal.alertSuccess({
          confirm: false,
          content: message,
          customContent: () => this.$createElement('div', {}, [
            this.$createElement('div', {}, `* 成功筆數：${content.successfulCount}筆`),
          ]),
        });
        // 重查待放行清單及資料明細清單
        this.paginateReviewingAvailableFunds({
          pageNum: this.pendingDataGrid.pagerConfig.currentPage,
          pageSize: this.pendingDataGrid.pagerConfig.pageSize,
        });
        // 清空checkbox勾選
        this.selectedRowList = null;
      } else {
        InfoModal.alertError({
          confirm: false,
          content: message,
          customContent: () => this.$createElement('div', {}, [
              this.$createElement('div', {}, `* 成功筆數：${content.successfulCount}筆`),
              this.$createElement('div', {}, `* 失敗筆數：${content.failedCount}筆`),
            ]),
        });
      }
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 進階查詢頁數改變
  handlePageChange(e) {
    let dto = {
      pageNum: e.currentPage,
      pageSize: e.pageSize,
    };
    // call API
    this.paginateReviewingAvailableFunds(dto);
  }
}
