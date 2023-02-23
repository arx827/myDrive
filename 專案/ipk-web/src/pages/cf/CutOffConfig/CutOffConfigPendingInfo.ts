import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import CheckEditInfoModal from '@/components/shared/modal/CheckInfoModal/CheckEditInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

import { ReviewDto, ApplyInfoDto } from '@fubonlife/ipk-api-axios-sdk';
import AddAndEditModal from '@/pages/cf/CutOffConfig/AddAndEditModal.vue';

let diff = require('deep-diff').diff;

@Component({
  components: {
    AdvancedSearch,
    AddAndEditModal,
    CheckInfoModal,
    CheckEditInfoModal,
    IpkVxeTable,
    IpkButton,
  },
})
export default class CutOffConfigPendingInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  tempSort = undefined; // 紀錄已點選的排序

  reviewDto = { // 覆核(拒絕)資訊
    applySeq: [],
    reviewStatus: undefined, // 此reviewStatus為"拒絕"/"放行"流程
    rejectReason: undefined,
  };

  isPending = false; // 是否從待放行清單點擊檢視

  isDisabled = false; // 是否鎖定放行/拒絕按鈕

  modalAddInfoShow = false; // [複製新增彈窗] modal開關

  addAndEditInfo = { // [複製新增彈窗]
    actionType: null,
    editInfo: {},
  };

  modalCheckEditInfoShow = false; // [檢視彈窗] modal開關

  pendingForm = { // [進階查詢] 表單內容 v-model綁定預設值
    applyId: undefined,
    applyDate: undefined,
    reviewStats: undefined,
  }

  advancedSearchPendingForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  pendingLabelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '申請人員', placeholder: '請選擇', type: 'inputText', maxlength: 5,
    },
    {
      label: '申請日期', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '放行狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ]

  checkInfoAddForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 新增表單內容 v-model綁定及表單欄位名稱
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
    applySeq: { key: null, label: '覆核申請編號', type: 'action' },
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoBeforeForm = {}; // [檢視彈窗] 修改前表單內容 v-model綁定

  checkInfoAfterForm = {}; // [檢視彈窗]修改後表單內容 v-model綁定

  checkInfoEditForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 修改表單預設內容 v-model綁定
    custodian: {
      key: null, isEdit: false, message: null, label: '保管行', type: 'inputText',
    },
    nationId: {
      key: null, isEdit: false, message: null, label: '國家', type: 'inputText',
    },
    currency: {
      key: null, isEdit: false, message: null, label: '幣別', type: 'inputText',
    },
    type: {
      key: null, isEdit: false, message: null, label: '交易類型', type: 'inputText',
    },
    tradeCycle: {
      key: null, isEdit: false, message: null, label: '交易週期', type: 'inputText',
    },
    equityCutOffDay: {
      key: null, isEdit: false, message: null, label: '券指示日', type: 'inputText',
    },
    equityCutOffTime: {
      key: null, isEdit: false, message: null, label: '券指示時間', type: 'inputText',
    },
    equityBufferTime: {
      key: null, isEdit: false, message: null, label: '券目標放行時間', type: 'inputText',
    },
    cashCutOffDay: {
      key: null, isEdit: false, message: null, label: '款指示日', type: 'inputText',
    },
    cashCutOffTime: {
      key: null, isEdit: false, message: null, label: '款指示時間', type: 'inputText',
    },
    cashBufferTime: {
      key: null, isEdit: false, message: null, label: '款目標放行時間', type: 'inputText',
    },
    tradeType: {
      key: null, isEdit: false, message: null, label: '買賣類型', type: 'inputText',
    },
    localTradeStartTime: {
      key: null, isEdit: false, message: null, label: '當地交易時間起', type: 'inputText',
    },
    localTradeEndTime: {
      key: null, isEdit: false, message: null, label: '當地交易時間迄', type: 'inputText',
    },
    twTradeStartTime: {
      key: null, isEdit: false, message: null, label: '台灣交易時間起', type: 'inputText',
    },
    twTradeEndTime: {
      key: null, isEdit: false, message: null, label: '台灣交易時間迄', type: 'inputText',
    },
    createId: {
      key: null, isEdit: false, message: null, label: '建立人員', type: 'inputText',
    },
    createDate: {
      key: null, isEdit: false, message: null, label: '建立日期', type: 'dateTime',
    },
    updateId: {
      key: null, isEdit: false, message: null, label: '異動人員', type: 'inputText',
    },
    updateDate: {
      key: null, isEdit: false, message: null, label: '異動日期', type: 'dateTime',
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
        title: '操作類型',
        field: 'action',
        fixed: 'left',
        slots: { default: 'action' },
      },
      {
        title: '申請人員',
        field: 'applyId',
        fixed: 'left',
      },
      {
        title: '申請日期',
        field: 'applyDate',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '放行狀態',
        field: 'reviewStatus',
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$cfEnum.getObject('reviewStatusEnum', row.reviewStatus).color,
                text: this.$cfEnum.getObject('reviewStatusEnum', row.reviewStatus).key,
              },
            }),
          ],
        },
      },
      {
        title: '放行人員',
        field: 'reviewId',
      },
      {
        title: '放行日期',
        field: 'reviewDate',
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
  * computed
  */
  // 監聽交易類型，轉換為中文字
  get beforeType() {
    return (this.checkInfoBeforeForm as any).type.key;
  }

  get afterType() {
    return (this.checkInfoAfterForm as any).type.key;
  }

  /**
   * hook
   */
  created() {
    // 取得「進階查詢」表單內容
    this.advancedSearchPendingForm = { ...this.pendingForm, reviewStats: this.$cfEnum.constant.WAITREVIEW.val };
    // 下拉選單
    this.pendingLabelList.find((el) => el.label === '放行狀態').options = this.$cfEnum.reviewTypeOption;
    this.pendingLabelList.find((el) => el.label === '放行狀態').allOptions = this.$cfEnum.reviewTypeOption;
    // 檢視修改前modal表單內容
    this.checkInfoBeforeForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
    // 檢視修改後modal表單內容
    this.checkInfoAfterForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch();
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得待放行清單已選取項目
  async getPendingSelected(e) {
    const content = await this.searchInformation(e) as any;
    // 已覆核、已拒絕鎖定按鈕
    this.isDisabled = e.row.reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val;
    // 新增(I)
    if (e.row.action.val === this.$cfEnum.constant.ADD.val) {
      switch (e.item) {
        // 開啟檢視彈窗
        case this.$cfEnum.actionConstant.SEARCH.val:
          this.modalCheckInfoShow = true;
          this.isPending = true;
          // 整理檢視彈窗顯示資訊
          if (!this.isEmpty(content.after)) {
            Object.entries(content.after).forEach(([key, item], index) => {
              if (!this.isEmpty(this.checkInfoAddForm[key])) {
                this.checkInfoAddForm[key].key = item;
              }
            });
            this.checkInfoAddForm.applySeq.key = content.rowData.applySeq;
            this.checkInfoAddForm.rowData = content.rowData;
            this.checkInfoAddForm.tradeCycle.key = !this.isEmpty(content.after.tradeCycle) ? `T+${content.after.tradeCycle}` : undefined;
            this.checkInfoAddForm.cashCutOffDay.key = !this.isEmpty(content.after.cashCutOffDay) ? `SD-${content.after.cashCutOffDay}` : undefined;
            this.checkInfoAddForm.equityCutOffDay.key = !this.isEmpty(content.after.equityCutOffDay) ? `SD-${content.after.equityCutOffDay}` : undefined;
            this.checkInfoAddForm.type.key = this.$cfEnum.getLabel('typeOption', content.after.type);
          }
          break;
        //  開啟複製新增彈窗
        case this.$cfEnum.actionConstant.COPY.val:
          this.openAddAndEditModal(content.after);
          break;
      }
    }
    // 修改(U)
    if (e.row.action.val === this.$cfEnum.constant.MODIFY.val) {
      // 整理修改前、後資訊
      this.getBeforeAndAfterInfo(content);
      // 開啟彈窗
      this.modalCheckEditInfoShow = true;
    }
  }

  // 關閉修改檢視彈窗
  closeCheckEditInfoModal() {
    this.modalCheckEditInfoShow = false;
    this.isDisabled = false;
    // 清空重設checkInfoBeforeForm
    this.checkInfoBeforeForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
    // 清空重設checkInfoAfterForm
    this.checkInfoAfterForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
  }

  // 開啟複製新增彈窗
  openAddAndEditModal(e) {
    this.modalAddInfoShow = true;
    this.addAndEditInfo.actionType = this.$cfEnum.constant.ADD.val;
    this.addAndEditInfo.editInfo = e;
  }

  // 關閉複製新增彈窗
  closeAddAndEditModal() {
    this.modalAddInfoShow = false;
    this.addAndEditInfo.actionType = null;
    this.addAndEditInfo.editInfo = {};
    // 重新查詢
    this.handleSearch();
  }

  // 關閉新增檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
    this.isPending = false;
    this.isDisabled = false;
    // 清空
    Object.entries(this.checkInfoAddForm).forEach(([key, item], index) => {
      if (!this.isEmpty(this.checkInfoAddForm[key])) {
        item.key = null;
      }
    });
  }

  // 點擊進階查詢按鈕
  handleSearch() {
    // 清空排序
    (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
    this.tempSort = undefined;
    // call API
    let dto = this.setSearchPendingInfoDto(1, 10);
    this.searchPendingInfo(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchPendingInfoDto(pageNum: number, pageSize: number) {
    let dto = {
      applyId: this.isEmpty(this.advancedSearchPendingForm.applyId) ? undefined : this.advancedSearchPendingForm.applyId,
      applyStartDate: this.isEmpty(this.advancedSearchPendingForm.applyDate) ? null : moment(this.advancedSearchPendingForm.applyDate[0]).format('YYYYMMDD'),
      applyEndDate: this.isEmpty(this.advancedSearchPendingForm.applyDate) ? null : moment(this.advancedSearchPendingForm.applyDate[1]).format('YYYYMMDD'),
      reviewStats: this.isEmpty(this.advancedSearchPendingForm.reviewStats) ? undefined : this.advancedSearchPendingForm.reviewStats,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 查詢待放行清單
  searchPendingInfo(dto: ApplyInfoDto) {
    this.setLoading(true);
    this.$cutOffConfigApi.paginateApplyInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.pendingDataGrid.data = [];

      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          let actionEnum = !this.isEmpty(item.action) ? item.action.substring(1, 2).toUpperCase() : undefined;
          this.pendingDataGrid.data.push({
            ...item,
            action: this.$cfEnum.getObject('actionEnum', actionEnum),
          });
        });
      }
      // 查詢待放行清單筆數
      this.$emit('getPendingInfoCount');

      this.pendingDataGrid.pagerConfig.currentPage = dto.pageNum;
      this.pendingDataGrid.pagerConfig.pageSize = dto.pageSize;
      this.pendingDataGrid.pagerConfig.total = parseInt(res.data.totalCount);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  //  表格欄位排序
  onPendingSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchPendingInfoDto(this.pendingDataGrid.pagerConfig.currentPage, this.pendingDataGrid.pagerConfig.pageSize);
    // call API
    this.searchPendingInfo(dto);
  }

  // 頁數改變
  handlePageChange(e) {
    let dto = this.setSearchPendingInfoDto(e.currentPage, e.pageSize);
    // call API
    this.searchPendingInfo(dto);
  }

  // 取得待放行清單checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 查詢檢視明細
  searchInformation(e) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$cutOffConfigApi.searchInformationUsingGET(e.row.applySeq)
      .then((res) => {
        const content = res.data.content;

        resolve({ ...content, rowData: e.row });
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
    });
  }

  // 整理修改前、後資訊
  getBeforeAndAfterInfo(content: any) {
    const before = this.checkInfoBeforeForm as any;
    const after = this.checkInfoAfterForm as any;
    // 修改前
    if (!this.isEmpty(content.before)) {
      Object.entries(content.before).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoBeforeForm[key])) {
          this.checkInfoBeforeForm[key].key = item;
        }
      });
      before.type.key = this.$cfEnum.getLabel('typeOption', this.beforeType);
      before.cashCutOffDay.key = !this.isEmpty(before.cashCutOffDay.key) ? `SD-${before.cashCutOffDay.key}` : undefined;
      before.equityCutOffDay.key = !this.isEmpty(before.equityCutOffDay.key) ? `SD-${before.equityCutOffDay.key}` : undefined;
      before.tradeCycle.key = !this.isEmpty(before.tradeCycle.key) ? `T+${before.tradeCycle.key}` : undefined;
    }
    // 修改後
    if (!this.isEmpty(content.after)) {
      Object.entries(content.after).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoAfterForm[key])) {
          this.checkInfoAfterForm[key].key = item;
        }
      });
      after.applySeq.key = content.rowData.applySeq;
      after.rowData = content.rowData;
      after.type.key = this.$cfEnum.getLabel('typeOption', this.afterType);
      after.cashCutOffDay.key = !this.isEmpty(after.cashCutOffDay.key) ? `SD-${after.cashCutOffDay.key}` : undefined;
      after.equityCutOffDay.key = !this.isEmpty(after.equityCutOffDay.key) ? `SD-${after.equityCutOffDay.key}` : undefined;
      after.tradeCycle.key = !this.isEmpty(after.tradeCycle.key) ? `T+${after.tradeCycle.key}` : undefined;
    }
    // 比較
    const differences = diff(content.before, content.after);
    if (!this.isEmpty(differences)) {
      differences.forEach((item) => {
        if (!this.isEmpty(this.checkInfoAfterForm[item.path[0]])) {
          this.checkInfoAfterForm[item.path[0]].isEdit = true;
        }
      });
    }
  }

  // 整批拒絕
  handleRejectList(action: string) {
    this.reviewDto.applySeq = [];
    this.reviewDto.reviewStatus = action;
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 勾選的"資料放行狀態"非「待放行」
      if (this.selectedRowList[i].reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
        InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
        return;
      }
      this.reviewDto.applySeq.push(this.selectedRowList[i].applySeq);
    }
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REJECT_CONFIRM_INFO?.message,
      onCallback: () => {
        this.review(this.reviewDto);
      },
    });
  }

  // 單筆拒絕
  handleReject(e: any) {
    // 勾選的"資料放行狀態"非「待放行」
    if (e.data.rowData.reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
      return;
    }
    this.reviewDto.applySeq = e.applySeq;
    this.reviewDto.reviewStatus = e.reviewStatus;
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REJECT_CONFIRM_INFO?.message,
      onCallback: () => {
        this.review(this.reviewDto);
      },
    });
  }

  // 整批放行
  handleReviewList(action: string) {
    let addApplySeq = []; // 新增
    let editApplySeq = []; // 修改
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 勾選的"資料放行狀態"非「待放行」
      if (this.selectedRowList[i].reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
        InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
        return;
      }
      // 操作類型為「新增」的資料送至後台檢查
      if (this.selectedRowList[i].action.val === this.$cfEnum.constant.ADD.val) {
        addApplySeq.push(this.selectedRowList[i].applySeq);
      } else {
        editApplySeq.push(this.selectedRowList[i].applySeq);
      }
    }
    // 整理覆核後端格式
    let reviewDto = {
      applySeq: [...addApplySeq, ...editApplySeq],
      reviewStatus: action, // 此reviewStatus為"拒絕"/"放行"流程
      rejectReason: undefined,
    };
    if (!this.isEmpty(addApplySeq)) {
      this.validateBeforeReview(addApplySeq, reviewDto);
    } else {
      this.review(reviewDto);
    }
  }

  // 單筆放行
  handleReview(e: any) {
    // 勾選的"資料放行狀態"非「待放行」
    if (e.data.rowData.reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
      return;
    }
    // 整理覆核後端格式
    let reviewDto = {
      applySeq: e.applySeq,
      reviewStatus: e.reviewStatus, // 此reviewStatus為"拒絕"/"放行"流程
      rejectReason: undefined,
    };
    // 操作類型為「新增」的資料送至後台檢查
    if (e.data.rowData.action.val === this.$cfEnum.constant.ADD.val) {
      this.validateBeforeReview(e.applySeq, reviewDto);
    } else {
      // call API
      this.review(reviewDto);
    }
  }

  // 覆核
  review(reviewDto: ReviewDto) {
    this.setLoading(true);
    this.$cutOffConfigApi.reviewUsingPATCH(reviewDto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 關閉檢視彈窗
      this.closeCheckInfoModal();
      this.closeCheckEditInfoModal();
      // 成功訊息
      this.$message.success(message, 10);
      // 清空checkbox勾選
      this.selectedRowList = [];
      // 重查待放行清單
      this.handleSearch();
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 放行前驗證
  validateBeforeReview(applySeq: any[], reviewDto: ReviewDto) {
    this.setLoading(true);

    this.$cutOffConfigApi.checkBeforeReviewUsingPOST(applySeq)
    .then((res) => {
      const message = res.data.message;

      // 覆核
      InfoModal.alertInfo({
        title: message,
        confirm: true,
        content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
        onCallback: () => {
          this.review(reviewDto);
        },
      });
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
