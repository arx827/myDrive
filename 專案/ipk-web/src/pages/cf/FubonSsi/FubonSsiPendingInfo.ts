import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import transferUtil from '@/plugins/util/transferUtil';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import CheckEditInfoCollapseModal from '@/components/shared/modal/CheckInfoModal/CheckEditInfoCollapseModal.vue';
import { ApplyInfoDto, ReviewDto } from '@fubonlife/ipk-api-axios-sdk';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import DataCashAddModal from '@/pages/cf/FubonSsi/DataCashAddModal.vue';
import DataEquityAddModal from '@/pages/cf/FubonSsi/DataEquityAddModal.vue';
import PendingCheckInfoModal from '@/pages/cf/FubonSsi/PendingCheckInfoModal.vue';

let diff = require('deep-diff').diff;

@Component({
  components: {
    AdvancedSearch,
    CheckInfoModal,
    CheckEditInfoCollapseModal,
    IpkVxeTable,
    DataCashAddModal,
    DataEquityAddModal,
    PendingCheckInfoModal,
    IpkButton,
  },
})
export default class FubonSsiPendingInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  addCash = '/addCash';

  addEquity = '/addEquity';

  modifyCash = '/modifyCash';

  modifyEquity = '/modifyEquity';

  functionName = 'FubonSsi' // [常用設定] 依照不同功能帶入不同functionName

  reviewDto = { // 覆核(拒絕)資訊
    applySeq: [],
    reviewStatus: undefined, // 此reviewStatus為"拒絕"/"放行"流程
    rejectReason: undefined,
  };

  oriForm = {
    custodianBankCode: undefined,
    currency: undefined,
    type: undefined,
  };

  isDisabled = false; // 是否鎖定放行/拒絕按鈕

  activeKey = '1'; // 被選取的頁籤(預設資料明細)

  modalAddInfoShow = false; // [新增彈窗] modal開關

  checkInfo = { // [新增彈窗] 後端邏輯-新增/修改
    actionType: null,
    editInfo: {},
  };

  modalCheckEditInfoShow = false; // [檢視彈窗] modal開關

  cashModalAddInfoShow = false; // [複製icon 款 彈窗] modal開關(CHIAO)

  equityModalAddInfoShow = false; // [複製icon 券 彈窗] modal開關(CHIAO)

  pendingForm = {
    applyId: undefined,
    applyDate: undefined,
    reviewStats: 'W',
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
    bfBankId: { key: null, label: '受款銀行代碼', type: 'inputText' },
    bfBankAccount: { key: null, label: '受款銀行帳號', type: 'inputText' },
    bfBankName: { key: null, label: '受款銀行名稱', type: 'inputText' },
    bfAccount: { key: null, label: '受款人帳號', type: 'inputText' },
    bfAccountName: { key: null, label: '受款人戶名', type: 'inputText' },
    imBankCode: { key: null, label: '中間行代碼', type: 'inputText' },
    imBankName: { key: null, label: '中間行名稱', type: 'inputText' },
    tfBankAccount: { key: null, label: '調撥銀行帳號', type: 'inputText' },
    tfBankName: { key: null, label: '調撥銀行名稱', type: 'inputText' },
    safekeepingAccount: { key: null, label: '保管帳號', type: 'inputText' },
    safekeepingName: { key: null, label: '保管行名稱', type: 'inputText' },
    market: { key: null, label: '市場別', type: 'inputText' },
    settlementLocation: { key: null, label: 'Settlement Location', type: 'inputText' },
    custodianIdType: { key: null, label: 'Custodian ID Type', type: 'inputText' },
    custodianId: { key: null, label: 'Custodian ID', type: 'inputText' },
    custodianAccount: { key: null, label: 'Custodian Account', type: 'inputText' },
    clearerIdType: { key: null, label: 'Clearer ID Type', type: 'inputText' },
    clearerId: { key: null, label: 'Clearer ID', type: 'inputText' },
    clearerAccount: { key: null, label: 'Clearer Account', type: 'inputText' },
    taxId: { key: null, label: '統編', type: 'inputText' },
    pdAccountBank: { key: null, label: '公債帳號對應銀行', type: 'inputText' },
    memo: { key: null, label: '附言', type: 'inputText' },
    remark: { key: null, label: '備註', type: 'inputText' },
    isDefault: { key: null, label: '預設', type: 'inputText' },
    updateId: { key: null, label: '異動人員', type: 'inputText' },
    updateDate: { key: null, label: '異動日期', type: 'dateTime' },
    applySeq: { key: null, label: '覆核申請編號', type: 'action' },
    custodianBankCode: { key: null, label: '保管機構', type: 'inputText' },
    currency: { key: null, label: '幣別', type: 'inputText' },
    type: { key: null, label: '使用類別', type: 'inputText' },
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoBeforeForm = {}; // [檢視彈窗] 修改前表單內容 v-model綁定

  checkInfoAfterForm = {}; // [檢視彈窗] 修改後表單內容 v-model綁定

  checkInfoEditForm = {}; // [檢視彈窗] 修改表單預設內容 v-model綁定

  checkInfoEditFormTitle = []; // [檢視彈窗] 修改表單 收合標題，根據款或券個別設定

  checkCashInfoEditForm = { // [檢視彈窗] 修改表單預設內容 v-model綁定
    cash: {
      bfBankId: {
        key: null, isEdit: false, message: null, label: '受款銀行代碼', type: 'inputText',
      },
      bfBankAccount: {
        key: null, isEdit: false, message: null, label: '受款銀行帳號', type: 'inputText',
      },
      bfBankName: {
        key: null, isEdit: false, message: null, label: '受款銀行名稱', type: 'inputText',
      },
      bfAccount: {
        key: null, isEdit: false, message: null, label: '受款人帳號', type: 'inputText',
      },
      bfAccountName: {
        key: null, isEdit: false, message: null, label: '受款人戶名', type: 'inputText',
      },
      imBankCode: {
        key: null, isEdit: false, message: null, label: '中間行代碼', type: 'inputText',
      },
      imBankName: {
        key: null, isEdit: false, message: null, label: '中間行名稱', type: 'inputText',
      },
      tfBankAccount: {
        key: null, isEdit: false, message: null, label: '調撥銀行帳號', type: 'inputText',
      },
      tfBankName: {
        key: null, isEdit: false, message: null, label: '調撥銀行名稱', type: 'inputText',
      },
      isDefault: {
        key: null, isEdit: false, message: null, label: '預設', type: 'inputText',
      },
      memo: {
        key: null, isEdit: false, message: null, label: '附言', type: 'inputText',
      },
      remark: {
        key: null, isEdit: false, message: null, label: '備註', type: 'inputText',
      },
      applySeq: {
        key: null, isEdit: false, message: null, label: '覆核申請編號', type: 'action',
      },
    },
  };

  checkEquityInfoEditForm = { // [檢視彈窗] 修改表單預設內容 v-model綁定
    equity: {
      safekeepingAccount: {
        key: null, isEdit: false, message: null, label: '保管帳號', type: 'inputText',
      },
      safekeepingName: {
        key: null, isEdit: false, message: null, label: '保管行名稱', type: 'inputText',
      },
      market: {
        key: null, isEdit: false, message: null, label: '市場別', type: 'inputText',
      },
      settlementLocation: {
        key: null, isEdit: false, message: null, label: 'Settlement Location', type: 'inputText',
      },
      custodianIdType: {
        key: null, isEdit: false, message: null, label: 'Custodian ID Type', type: 'inputText',
      },
      custodianId: {
        key: null, isEdit: false, message: null, label: 'Custodian ID', type: 'inputText',
      },
      custodianAccount: {
        key: null, isEdit: false, message: null, label: 'Custodian Account', type: 'inputText',
      },
      clearerIdType: {
        key: null, isEdit: false, message: null, label: 'Clearer ID Type', type: 'inputText',
      },
      clearerId: {
        key: null, isEdit: false, message: null, label: 'Clearer ID', type: 'inputText',
      },
      clearerAccount: {
        key: null, isEdit: false, message: null, label: 'Clearer Account', type: 'inputText',
      },
      taxId: {
        key: null, isEdit: false, message: null, label: '統編', type: 'inputText',
      },
      pdAccountBank: {
        key: null, isEdit: false, message: null, label: '公債帳號對應銀行', type: 'inputText',
      },
      isDefault: {
        key: null, isEdit: false, message: null, label: '預設', type: 'inputText',
      },
      memo: {
        key: null, isEdit: false, message: null, label: '附言', type: 'inputText',
      },
      remark: {
        key: null, isEdit: false, message: null, label: '備註', type: 'inputText',
      },
      applySeq: {
        key: null, isEdit: false, message: null, label: '覆核申請編號', type: 'action',
      },
    },
  };

  selectedRowList = []; // 已選取的待放行清單項目

  tempSort = undefined; // 紀錄已點選的排序

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
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '申請日期',
        field: 'applyDate',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '放行日期',
        field: 'reviewDate',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
   * hook
   */
  created() {
    // 取得「進階查詢」表單內容
    this.advancedSearchPendingForm = { ...this.pendingForm };
    // 下拉選單
    this.pendingLabelList.find((el) => el.label === '放行狀態').options = this.$cfEnum.reviewTypeOption;
    this.pendingLabelList.find((el) => el.label === '放行狀態').allOptions = this.$cfEnum.reviewTypeOption;
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
    // 指定開啟分頁後是指在款or卷的頁簽
    this.judgeActionTypeChange(e.row.action.val);
    // 新增款(/addCash)
    if (e.row.action.val === this.addCash) {
      switch (e.item) {
        // 開啟檢視彈窗
        case this.$cfEnum.actionConstant.SEARCH.val:
          this.openCheckIcon(content);
          break;
        //  開啟新增彈窗
        case this.$cfEnum.actionConstant.COPY.val:
          this.cashModalAddInfoShow = true;
          this.openCopyIcon(content);
          break;
      }
    }
    // 新增券(/addEquity)
    if (e.row.action.val === this.addEquity) {
      switch (e.item) {
        // 開啟檢視彈窗
        case this.$cfEnum.actionConstant.SEARCH.val:
          this.openCheckIcon(content);
          break;
        //  開啟新增彈窗 (CHIAO)
        case this.$cfEnum.actionConstant.COPY.val:
          this.equityModalAddInfoShow = true;
          this.openCopyIcon(content);
          break;
      }
    }
    // 修改款(/modifyCash)
    if (e.row.action.val === this.modifyCash) {
      this.checkInfoEditFormTitle = [
        { label: '款帳號資訊', value: 'cash' },
      ];
      this.checkInfoEditForm = { ...this.checkCashInfoEditForm };
      this.checkInfoBeforeForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
      this.checkInfoAfterForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
      // 整理修改前、後資訊
      this.getBeforeAndAfterInfo(content, 'cash');
    }
    // 修改券(/modifyEquity)
    if (e.row.action.val === this.modifyEquity) {
      this.checkInfoEditFormTitle = [
        { label: '券帳號資訊', value: 'equity' },
      ];
      this.checkInfoEditForm = { ...this.checkEquityInfoEditForm };
      this.checkInfoBeforeForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
      this.checkInfoAfterForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
      // 整理修改前、後資訊
      this.getBeforeAndAfterInfo(content, 'equity');
    }
  }

  // 關閉修改檢視彈窗
  closeCheckEditInfoModal() {
    this.modalCheckEditInfoShow = false;
    this.isDisabled = false;

    this.checkInfoBeforeForm = {}; // 清空checkInfoBeforeForm，以便下次比對差異
    this.checkInfoAfterForm = {}; // 清空checkInfoAfterForm，以便下次比對差異
    this.checkInfoEditForm = {}; // 清空checkInfoEditForm
  }

  // 開啟新增-複製icon彈窗
  openCopyIcon(e) {
    this.checkInfo.actionType = this.$cfEnum.constant.ADD.val;
    this.checkInfo.editInfo = e;
  }

  // 開啟新增-檢視icon彈窗
  openCheckIcon(e) {
    this.modalAddInfoShow = true;
    // 整理檢視彈窗顯示資訊
    if (!this.isEmpty(e.after)) {
      Object.entries(e.after).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoAddForm[key])) {
          this.checkInfoAddForm[key].key = item;
          this.transferResponseVal(key, item);
        }
      });
      this.checkInfoAddForm.applySeq.key = e.rowData.applySeq;
      this.checkInfoAddForm.rowData = e.rowData;
    }
  }

  // 關閉款copy新增彈窗
  closeCashAddModal() {
    this.cashModalAddInfoShow = false;
    this.checkInfo.actionType = null;
    this.checkInfo.editInfo = {};
  }

  // 關閉券copy新增彈窗
  closeEquityAddModal() {
    this.equityModalAddInfoShow = false;
    this.checkInfo.actionType = null;
    this.checkInfo.editInfo = {};
  }

  // 關閉新增檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
    this.modalAddInfoShow = false; // modal開關
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
    let dto = this.setSearchPendingInfoDto(1, this.pendingDataGrid.pagerConfig.pageSize);
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
    this.$fubonSsiApi.paginateApplyInfoUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.pendingDataGrid.data = [];

        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            let actionCashEquityEnum = !this.isEmpty(item.action) ? item.action : undefined;
            this.pendingDataGrid.data.push({
              ...item,
              action: this.$cfEnum.getObject('actionCashEquityEnum', actionCashEquityEnum),
            });
          });
        }
        this.pendingDataGrid.pagerConfig.currentPage = dto.pageNum;
        this.pendingDataGrid.pagerConfig.pageSize = dto.pageSize;
        this.pendingDataGrid.pagerConfig.total = parseInt(res.data.totalCount);

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
      this.$fubonSsiApi.searchInformationUsingGET(e.row.applySeq)
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

  getBeforeAndAfterInfo(content: any, type: string) {
    // 修改前
    if (!this.isEmpty(content.before)) {
      Object.entries(content.before).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoBeforeForm[type][key])) {
          this.checkInfoBeforeForm[type][key].key = item;
        }
      });
    }
    // 修改後
    if (!this.isEmpty(content.after)) {
      Object.entries(content.after).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoAfterForm[type][key])) {
          this.checkInfoAfterForm[type][key].key = item;
        }
      });
      (this.checkInfoAfterForm[type] as any).applySeq.key = content.rowData.applySeq;
      (this.checkInfoAfterForm[type] as any).rowData = content.rowData;
    }
    // 比較
    const differences = diff(content.before, content.after);
    if (!this.isEmpty(differences)) {
      differences.forEach((item) => {
        if (!this.isEmpty(this.checkInfoAfterForm[type][item.path[0]])) {
          this.checkInfoAfterForm[type][item.path[0]].isEdit = true;
        }
      });
    }

    (this.checkInfoAfterForm as any).rowData = content.rowData;

    if (!this.isEmpty((content.after as any).custodianBankCode)) {
      this.oriForm.custodianBankCode = (content.after as any).custodianBankCode;
    }
    if (!this.isEmpty((content.after as any).currency)) {
      this.oriForm.currency = (content.after as any).currency;
    }
    if (!this.isEmpty((content.after as any).type)) {
      this.oriForm.type = transferUtil.getSelectOption(this.$cfEnum.useTypeOption, (content.after as any).type)?.label;
    }

    // 開啟彈窗
    this.modalCheckEditInfoShow = true;
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
  handleReject(e: any, process: string) {
    let reviewStatus = null;
    let actionType = null;
    // 編輯檢視
    if (process === this.$cfEnum.constant.MODIFY.val) {
      reviewStatus = e.data[this.checkInfoEditFormTitle[0].value].rowData.reviewStatus;
      actionType = e.data[this.checkInfoEditFormTitle[0].value].rowData.action.val;
    }
    // 新增檢視
    if (process === this.$cfEnum.constant.ADD.val) {
      reviewStatus = e.data.rowData.reviewStatus;
      actionType = e.data.rowData.action.val;
    }
    // 勾選的"資料放行狀態"非「待放行」
    if (reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
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
      const actionType = this.selectedRowList[i].action.val;
      if (actionType.substring(1, 2).toUpperCase() === this.$cfEnum.constant.ADD.val) {
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
      InfoModal.alertInfo({
        confirm: true,
        content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
        onCallback: () => {
          this.review(reviewDto);
        },
      });
    }
  }

  // 單筆放行
  handleReview(e: any, process: string) {
    let reviewStatus = null;
    let actionType = null;
    // 編輯檢視
    if (process === this.$cfEnum.constant.MODIFY.val) {
      reviewStatus = e.data[this.checkInfoEditFormTitle[0].value].rowData.reviewStatus;
      actionType = e.data[this.checkInfoEditFormTitle[0].value].rowData.action.val;
    }
    // 新增檢視
    if (process === this.$cfEnum.constant.ADD.val) {
      reviewStatus = e.data.rowData.reviewStatus;
      actionType = e.data.rowData.action.val;
    }

    // 勾選的"資料放行狀態"非「待放行」
    if (reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
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
    if (actionType.substring(1, 2).toUpperCase() === this.$cfEnum.constant.ADD.val) {
      this.validateBeforeReview(e.applySeq, reviewDto);
    } else {
      InfoModal.alertInfo({
        confirm: true,
        content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
        onCallback: () => {
          this.review(reviewDto);
        },
      });
    }
  }

  // 覆核
  review(reviewDto: ReviewDto) {
    this.setLoading(true);
    this.$fubonSsiApi.reviewUsingPATCH(reviewDto)
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
        // 查詢待放行清單筆數
        this.$emit('getPendingInfoCount');
        // 清空checkbox勾選
        this.selectedRowList = null;
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

    this.$fubonSsiApi.checkBeforeReviewUsingPOST(applySeq)
      .then((res) => {
        const message = res.data.message;
        const success = res.data.success;

        if (!success) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

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

  // 子頁簽傳遞getPendingInfoCount 查詢待放行筆數更新
  getPendingInfoCount() {
    // 查詢待放行清單筆數
    this.$emit('getPendingInfoCount');
  }

  // 取得更多操作及欄位資訊
  getActionType(e) {
    this.openAddAndEditModal(e.actionType, e.rowData);
  }

  // 開啟編輯彈窗
  openAddAndEditModal(actionType, editDto) {
    this.modalAddInfoShow = true;
    this.checkInfo.actionType = actionType;
    this.checkInfo.editInfo = editDto;
  }

  // 重新初始重查
  reSearch() {
    const dto = {
      pageNum: this.pendingDataGrid.pagerConfig.currentPage,
      pageSize: this.pendingDataGrid.pagerConfig.pageSize,
    };
    this.searchPendingInfo(dto);
  }

  // 判斷款or卷於檢視彈窗預設指定頁簽
  judgeActionTypeChange(val) {
    if (val === this.addEquity) {
      this.activeKey = '2';
    } else {
      this.activeKey = '1';
    }
  }

  // 轉換earchInformation api回傳值塞入checkInfoAddForm
  transferResponseVal(key, item) {
    if (key === 'isDefault') {
      if (item === 'Y') {
        this.checkInfoAddForm[key].key = true;
      } else if (item === 'N') {
        this.checkInfoAddForm[key].key = false;
      }
    } else if (key === 'type') {
      this.checkInfoAddForm[key].key = transferUtil.getSelectOption(this.$cfEnum.useTypeOption, item)?.label;
    }
  }
}
