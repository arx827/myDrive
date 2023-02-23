import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import exportUtil from '@/plugins/util/exportUtil';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckEditInfoCollapseModal from '@/components/shared/modal/CheckInfoModal/CheckEditInfoCollapseModal.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { ReviewDto, ApplyInfoDto } from '@fubonlife/ipk-api-axios-sdk';
import SsiCheckInfoModal from '@/pages/cf/CounterpartySsi/SsiCheckInfoModal.vue';
import SsiAddAndEditModal from '@/pages/cf/CounterpartySsi/SsiAddAndEditModal.vue';

let diff = require('deep-diff').diff;

@Component({
  components: {
    AdvancedSearch,
    CheckEditInfoCollapseModal,
    IpkVxeTable,
    SsiCheckInfoModal,
    SsiAddAndEditModal,
    IpkButton,
  },
})
export default class CounterpartySsiPendingInfo extends Vue {
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

  isDisabled = false; // 是否鎖定放行/拒絕按鈕

  pendingForm = { // [進階查詢] 表單內容 v-model綁定預設值
    applyId: undefined,
    applyDate: undefined,
    reviewStats: this.$cfEnum.constant.WAITREVIEW.val,
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

  modalAddInfoShow = false; // [複製新增彈窗] modal開關

  addAndEditInfo = { // [複製新增彈窗]
    actionType: null,
    editInfo: {},
  };

  modalCheckInfoShow = false; // [新增檢視彈窗] modal開關

  checkInfoForm = { // [新增檢視彈窗] 新增表單內容 v-model綁定及表單欄位名稱
    cash: {
      counterpartyId: undefined,
      productName: undefined,
      productId: undefined,
      currency: undefined,
      bfBankCode: undefined,
      bfBankName: undefined,
      bfBankAccount: undefined,
      bfBankIban: undefined,
      bfBankAba: undefined,
      bfAccountName: undefined,
      bfAccountNameCode: undefined,
      bfAccount: undefined,
      bfBankType: undefined,
      bfAccountNoType: undefined,
      bfAccountNameType: undefined,
      ImBankCode: undefined,
      ImBankName: undefined,
      ImBankCodeType: undefined,
      draweeType: undefined,
      draweeName: undefined,
      draweeCode: undefined,
      indicator: undefined,
      charges: undefined,
      memo: undefined,
      remark: undefined,
      isDefault: undefined,
      effectStatus: undefined,
    },
    equity: {
      counterpartyId: undefined,
      productName: undefined,
      productId: undefined,
      currency: undefined,
      custodian: undefined,
      brokerIdType: undefined,
      brokerId: undefined,
      brokerAccount: undefined,
      brokerName: undefined,
      clearerIdType: undefined,
      clearerId: undefined,
      clearerAccount: undefined,
      clearerName: undefined,
      bsCodeType: undefined,
      bsCode: undefined,
      bsName: undefined,
      clAgentCodeType: undefined,
      clAgentCode: undefined,
      clAgentName: undefined,
      market: undefined,
      cycd: undefined,
      psetCode: undefined,
      settlementLocation: undefined,
      settlementIndicator: undefined,
      equityTdccAccount: undefined,
      brokerage: undefined,
      brokerageCode: undefined,
      pdAccountBank: undefined,
      pdAccount: undefined,
      pdAccountName: undefined,
      bondTdccAccount: undefined,
      taxId: undefined,
      memo: undefined,
      remark: undefined,
      isDefault: undefined,
      effectStatus: undefined,
    },
    attachment: [],
    reviewInfo: {},
  };

  modalCheckEditInfoShow = false; // [修改檢視彈窗] modal開關

  checkInfoBeforeForm: any = {}; // [修改檢視彈窗] 修改前表單內容 v-model綁定

  checkInfoAfterForm: any = {}; // [修改檢視彈窗]修改後表單內容 v-model綁定

  fileBeforeData = []; // [修改檢視彈窗] 修改前多筆附件內容 v-model綁定

  fileAfterData = []; // [修改檢視彈窗] 修改後多筆附件內容 v-model綁定

  checkInfoEditFormTitle = [ // [修改檢視彈窗] 各區塊標題
    { label: '款帳號資訊', value: 'cash' },
    { label: '券帳號資訊', value: 'equity' },
    { label: '上傳附件', value: 'attachment' },
  ];

  checkInfoEditForm = { // [修改檢視彈窗] 修改表單內容 v-model綁定預設值
    cash: {
      counterpartyId: {
        key: null, isEdit: false, message: null, label: '機構編號', type: 'inputText',
      },
      productName: {
        key: null, isEdit: false, message: null, label: '產品別', type: 'inputText',
      },
      currency: {
        key: null, isEdit: false, message: null, label: '幣別', type: 'inputText',
      },
      bfBankCode: {
        key: null, isEdit: false, message: null, label: '受款銀行代碼', type: 'inputText',
      },
      bfBankName: {
        key: null, isEdit: false, message: null, label: '受款銀行名稱', type: 'inputText',
      },
      bfBankAccount: {
        key: null, isEdit: false, message: null, label: '受款行銀行帳號', type: 'inputText',
      },
      bfBankIban: {
        key: null, isEdit: false, message: null, label: '受款銀行IBAN號碼', type: 'inputText',
      },
      bfBankAba: {
        key: null, isEdit: false, message: null, label: '受款銀行ABA', type: 'inputText',
      },
      bfAccountName: {
        key: null, isEdit: false, message: null, label: '受款人名稱', type: 'inputText',
      },
      bfAccountNameCode: {
        key: null, isEdit: false, message: null, label: '受款人帳戶名稱代碼', type: 'inputText',
      },
      bfAccount: {
        key: null, isEdit: false, message: null, label: '受款人帳號', type: 'inputText',
      },
      bfBankType: {
        key: null, isEdit: false, message: null, label: '受款銀行類型', type: 'inputText',
      },
      bfAccountNoType: {
        key: null, isEdit: false, message: null, label: '受款人帳戶號碼類型', type: 'inputText',
      },
      bfAccountNameType: {
        key: null, isEdit: false, message: null, label: '受款人帳戶名稱類型', type: 'inputText',
      },
      imBankCode: {
        key: null, isEdit: false, message: null, label: '中間行代碼', type: 'inputText',
      },
      imBankName: {
        key: null, isEdit: false, message: null, label: '中間行名稱', type: 'inputText',
      },
      imBankCodeType: {
        key: null, isEdit: false, message: null, label: '中間行代碼類型', type: 'inputText',
      },
      draweeType: {
        key: null, isEdit: false, message: null, label: '付款人類型', type: 'inputText',
      },
      draweeName: {
        key: null, isEdit: false, message: null, label: '付款人名稱', type: 'inputText',
      },
      draweeCode: {
        key: null, isEdit: false, message: null, label: '付款人代碼', type: 'inputText',
      },
      indicator: {
        key: null, isEdit: false, message: null, label: 'Financial Indicator', type: 'inputText',
      },
      charges: {
        key: null, isEdit: false, message: null, label: 'Pay Charges Indicator', type: 'inputText',
      },
      memo: {
        key: null, isEdit: false, message: null, label: '附言', type: 'textarea',
      },
      remark: {
        key: null, isEdit: false, message: null, label: '備註', type: 'textarea',
      },
      isDefault: {
        key: null, isEdit: false, message: null, label: '預設', type: 'switch',
      },
      effectStatus: {
        key: null, isEdit: false, message: null, label: '生效', type: 'switch',
      },
    },
    equity: {
      counterpartyId: {
        key: null, isEdit: false, message: null, label: '機構編號', type: 'inputText',
      },
      productName: {
        key: null, isEdit: false, message: null, label: '產品別', type: 'inputText',
      },
      currency: {
        key: null, isEdit: false, message: null, label: '幣別', type: 'inputText',
      },
      custodian: {
        key: null, isEdit: false, message: null, label: '保管行', type: 'select',
      },
      brokerIdType: {
        key: null, isEdit: false, message: null, label: 'Broker ID Type', type: 'select',
      },
      brokerId: {
        key: null, isEdit: false, message: null, label: 'Broker ID', type: 'inputText',
      },
      brokerAccount: {
        key: null, isEdit: false, message: null, label: 'Broker Account', type: 'inputText',
      },
      brokerName: {
        key: null, isEdit: false, message: null, label: 'Broker Name', type: 'inputText',
      },
      clearerIdType: {
        key: null, isEdit: false, message: null, label: 'Clearer ID Type', type: 'select',
      },
      clearerId: {
        key: null, isEdit: false, message: null, label: 'Clearer ID', type: 'inputText',
      },
      clearerAccount: {
        key: null, isEdit: false, message: null, label: 'Clearer  Account', type: 'inputText',
      },
      clearerName: {
        key: null, isEdit: false, message: null, label: 'Clearer  Name', type: 'inputText',
      },
      bsCodeType: {
        key: null, isEdit: false, message: null, label: 'Buyer/Seller code Type', type: 'select',
      },
      bsCode: {
        key: null, isEdit: false, message: null, label: 'Buyer/Seller code', type: 'inputText',
      },
      bsName: {
        key: null, isEdit: false, message: null, label: 'Buyer/Seller Name', type: 'inputText',
      },
      clAgentCodeType: {
        key: null, isEdit: false, message: null, label: 'Clearing Agent Code Type', type: 'inputText',
      },
      clAgentCode: {
        key: null, isEdit: false, message: null, label: 'Clearing Agent code/   ClearingBroker', type: 'inputText',
      },
      clAgentName: {
        key: null, isEdit: false, message: null, label: 'Clearing Agent Name', type: 'inputText',
      },
      market: {
        key: null, isEdit: false, message: null, label: 'Market', type: 'select',
      },
      cycd: {
        key: null, isEdit: false, message: null, label: 'CyCd', type: 'inputText',
      },
      psetCode: {
        key: null, isEdit: false, message: null, label: 'PSET CODE', type: 'select',
      },
      settlementLocation: {
        key: null, isEdit: false, message: null, label: 'Settlement Location', type: 'select',
      },
      settlementIndicator: {
        key: null, isEdit: false, message: null, label: 'Settlement Indicator', type: 'inputText',
      },
      equityTdccAccount: {
        key: null, isEdit: false, message: null, label: '股權集保帳號', type: 'inputText',
      },
      brokerage: {
        key: null, isEdit: false, message: null, label: '證券商(130)', type: 'inputText',
      },
      brokerageCode: {
        key: null, isEdit: false, message: null, label: '證券代號', type: 'inputText',
      },
      pdAccountBank: {
        key: null, isEdit: false, message: null, label: '公債帳號對應銀行', type: 'inputText',
      },
      pdAccount: {
        key: null, isEdit: false, message: null, label: '公債帳號', type: 'select',
      },
      pdAccountName: {
        key: null, isEdit: false, message: null, label: '公債帳號戶名', type: 'select',
      },
      bondTdccAccount: {
        key: null, isEdit: false, message: null, label: '債券集保帳號', type: 'select',
      },
      taxId: {
        key: null, isEdit: false, message: null, label: '統編', type: 'select',
      },
      memo: {
        key: null, isEdit: false, message: null, label: '附言', type: 'textarea',
      },
      remark: {
        key: null, isEdit: false, message: null, label: '備註', type: 'textarea',
      },
      isDefault: {
        key: null, isEdit: false, message: null, label: '預設', type: 'switch',
      },
      effectStatus: {
        key: null, isEdit: false, message: null, label: '生效', type: 'switch',
      },
    },
    attachment: {
      // fileData: {
      //   key: null, isEdit: false, message: null, label: '附件(檔案類型/商品代碼/市場別)', type: 'file',
      // },
    },
    rowData: {}, // 已選取的交易table資訊
  };

  checkEditAttachment = { // [修改檢視彈窗] 修改附件內容
    attachmentId: {
      key: null, isEdit: false, message: null, label: '附件ID', type: 'inputText',
    },
    attachmentName: {
      key: null, isEdit: false, message: null, label: '附件名稱', type: 'inputText',
    },
    attachmentType: {
      key: null, isEdit: false, message: null, label: '附件類別', type: 'inputText',
    },
    market: {
      key: null, isEdit: false, message: null, label: 'makret', type: 'input',
    },
    productCode: {
      key: null, isEdit: false, message: null, label: '商品別', type: 'input',
    },
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
          // 整理檢視彈窗顯示資訊
          if (!this.isEmpty(content.after)) {
            // 整理款帳號資訊
            if (!this.isEmpty(content.after.cash)) {
              Object.entries(content.after.cash).forEach(([key, item], index) => {
                this.checkInfoForm.cash[key] = item;
              });
            }
            // 整理券帳號資訊
            if (!this.isEmpty(content.after.equity)) {
              Object.entries(content.after.equity).forEach(([key, item], index) => {
                this.checkInfoForm.equity[key] = item;
              });
            }
            // 上傳附件
            this.checkInfoForm.attachment = content.after.attachment;
            // 待放行資訊
            this.checkInfoForm.reviewInfo = e.row;
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
      this.getBeforeAndAfterInfo(content, e);
      // 整理[附件]修改前、後資訊
      this.getBeforeAndAfterAttachment(content);
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

  // 關閉新增檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
    this.isDisabled = false;
    // 清除款帳號資訊
    Object.entries(this.checkInfoForm.cash).forEach(([key, item], index) => {
      this.checkInfoForm.cash[key] = undefined;
    });
    // 清除券帳號資訊
    Object.entries(this.checkInfoForm.equity).forEach(([key, item], index) => {
      this.checkInfoForm.equity[key] = undefined;
    });
    // 清除上傳附件
    this.checkInfoForm.attachment = [];
    // 清空待放行資訊
    this.checkInfoForm.reviewInfo = {};
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
    this.$counterpartySsiApi.paginateApplyInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      const isSuccess = res.data.success;
      const message = res.data.message;
      const totalCount = parseInt(res.data.totalCount);
      this.pendingDataGrid.data = [];

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          let actionEnum = !this.isEmpty(item.action) ? item.action.substring(1, 2).toUpperCase() : undefined;
          this.pendingDataGrid.data.push({
            ...item,
            action: this.$cfEnum.getObject('actionEnum', actionEnum),
          });
        });

        this.pendingDataGrid.pagerConfig.currentPage = dto.pageNum;
        this.pendingDataGrid.pagerConfig.pageSize = dto.pageSize;
        this.pendingDataGrid.pagerConfig.total = totalCount;

        this.selectedRowList = [];
        // 查詢待放行清單筆數
        this.$emit('getPendingInfoCount');
      }
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
      this.$counterpartySsiApi.searchInformationUsingPOST(e.row.applySeq)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        resolve(content);
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
        reject();
      })
      .finally(() => {
        this.setLoading(false);
      });
    });
  }

  /**
   * @summary 整理修改前、後資訊
   * @param {any} content: searchInformation_API 回傳資訊
   * @param {any} tableInfo: 所點選的交易table資訊
  */
  getBeforeAndAfterInfo(content: any, tableInfo: any) {
    // 修改前
    if (!this.isEmpty(content.before)) {
      // 整理款帳號資訊
      if (!this.isEmpty(content.before.cash)) {
        Object.entries(content.before.cash).forEach(([key, value], index) => {
          if (!this.isEmpty(this.checkInfoBeforeForm.cash[key])) {
            this.checkInfoBeforeForm.cash[key].key = value || undefined;

            if (key === 'effectStatus') {
              this.checkInfoBeforeForm.cash.effectStatus.key = value ? 'Y' : 'N';
            }
            if (key === 'indicator') {
              this.checkInfoBeforeForm.cash.indicator.key = value ? this.$cfEnum.getLabel('indicatorOption', value) : undefined;
            }
          }
        });
      }
      // 整理券帳號資訊
      if (!this.isEmpty(content.before.equity)) {
        Object.entries(content.before.equity).forEach(([key, value], index) => {
          if (!this.isEmpty(this.checkInfoBeforeForm.equity[key])) {
            this.checkInfoBeforeForm.equity[key].key = value || undefined;
          }
          if (key === 'effectStatus') {
            this.checkInfoBeforeForm.equity.effectStatus.key = value ? 'Y' : 'N';
          }
        });
      }
      this.checkInfoBeforeForm.rowData = tableInfo.row;
    }

    // 修改後
    if (!this.isEmpty(content.after)) {
      // 整理款帳號資訊
      if (!this.isEmpty(content.after.cash)) {
        Object.entries(content.after.cash).forEach(([key, value], index) => {
          if (!this.isEmpty(this.checkInfoAfterForm.cash[key])) {
            this.checkInfoAfterForm.cash[key].key = value || undefined;

            if (key === 'effectStatus') {
              this.checkInfoAfterForm.cash.effectStatus.key = value ? 'Y' : 'N';
            }
            if (key === 'indicator') {
              this.checkInfoAfterForm.cash.indicator.key = value ? this.$cfEnum.getLabel('indicatorOption', value) : undefined;
            }
          }
        });
      }
      // 整理券帳號資訊
      if (!this.isEmpty(content.after.equity)) {
        Object.entries(content.after.equity).forEach(([key, value], index) => {
          if (!this.isEmpty(this.checkInfoAfterForm.equity[key])) {
            this.checkInfoAfterForm.equity[key].key = value || undefined;

            if (key === 'effectStatus') {
              this.checkInfoAfterForm.equity.effectStatus.key = value ? 'Y' : 'N';
            }
          }
        });
      }
      this.checkInfoAfterForm.rowData = tableInfo.row;
    }

    // 比較
    const differences = diff(content.before, content.after);
    if (!this.isEmpty(differences)) {
      differences.forEach((item) => {
        if (!this.isEmpty(this.checkInfoAfterForm[item.path[0]][item.path[1]])) {
          this.checkInfoAfterForm[item.path[0]][item.path[1]].isEdit = true;
        }
      });
    }
  }

  // 整理[附件]修改前、後資訊
  getBeforeAndAfterAttachment(content: any) {
    // 初始化 修改前附件Map
    const beforeAttachment = new Map();
    // 逐筆將附件組裝成客製化物件再裝進Map
    content.before.attachment.forEach((attachmentItem) => {
      // 初始化 修改前附件物件 deep copy物件避免參考同一個物件
      const beforeAttach = JSON.parse(JSON.stringify(this.checkEditAttachment));
      // 將值塞入每個屬性的key
      Object.entries(attachmentItem).forEach(([key, item], index) => {
        // beforeAttachment.set(key, item);
        beforeAttach[key].key = item;
      });
      // 將整理好的物件塞入Map，key為attachmentId，value為整理好的物件
      beforeAttachment.set((beforeAttach as any).attachmentId.key, beforeAttach);
    });

    // 初始化 修改後附件Map
    const afterAttachment = new Map();
    // 逐筆將附件組裝成客製化物件再裝進Map
    content.after.attachment.forEach((attachmentItem) => {
      // 初始化 修改後附件內容 deep copy物件避免參考同一個物件
      const afterAttach = JSON.parse(JSON.stringify(this.checkEditAttachment));
      // 將值塞入每個屬性的key
      Object.entries(attachmentItem).forEach(([key, item], index) => {
        // afterAttachment.set(key, item);
        afterAttach[key].key = item;
      });
      // 將整理好的物件塞入Map，key為attachmentId，value為整理好的物件
      afterAttachment.set((afterAttach as any).attachmentId.key, afterAttach);
    });

    // 逐筆比對附件修改前後內容
    afterAttachment.forEach((value, key) => {
      // 檢核修改前是否存在該附件
      if (this.isEmpty(beforeAttachment.get(key))) {
        // 逐筆走訪修改後物件屬性並將isEdit設定為true
        Object.entries(value).forEach(([propKey, propValue], index) => {
          (propValue as any).isEdit = true;
        });
      } else { // 比較修改前後附件內容
        const attachmentDiff = diff(beforeAttachment.get(key), value);
        if (!this.isEmpty(attachmentDiff)) {
          attachmentDiff.forEach((item) => {
            if (!this.isEmpty(value[item.path[0]])) {
              value[item.path[0]].isEdit = true;
            }
          });
        }
      }
    });

    // 修改前附件資料
    this.fileBeforeData = Array.from(beforeAttachment.values());
    // 修改後附件資料
    this.fileAfterData = Array.from(afterAttachment.values());
  }

  // 整理編輯前/編輯後拒絕資訊
  setRejectData(e) {
    let reviewDto = {
      applySeq: e.applySeq,
      reviewStatus: e.reviewStatus,
      reviewType: e.data.rowData.reviewStatus, // 放行狀態
      action: e.data.rowData.action.val,
    };
    this.handleReject(reviewDto);
  }

  // 整理編輯前/編輯後放行資訊
  setReviewData(e) {
    let reviewDto = {
      applySeq: e.applySeq,
      reviewStatus: e.reviewStatus,
      reviewType: e.data.rowData.reviewStatus, // 放行狀態
      action: e.data.rowData.action.val,
    };
    this.handleReview(reviewDto);
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
    if (e.reviewType !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
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
    this.reviewDto.applySeq = [...addApplySeq, ...editApplySeq];
    this.reviewDto.reviewStatus = action; // 此reviewStatus為"拒絕"/"放行"流程
    if (!this.isEmpty(addApplySeq)) {
      this.validateBeforeReview(addApplySeq, this.reviewDto);
    } else {
      InfoModal.alertInfo({
        confirm: true,
        content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
        onCallback: () => {
          this.review(this.reviewDto);
        },
      });
    }
  }

  // 單筆放行
  handleReview(e: any) {
    // 勾選的"資料放行狀態"非「待放行」
    if (e.reviewType !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
      return;
    }
    // 整理覆核後端格式
    this.reviewDto.applySeq = e.applySeq;
    this.reviewDto.reviewStatus = e.reviewStatus;
    // 操作類型為「新增」的資料送至後台檢查
    if (e.action === this.$cfEnum.constant.ADD.val) {
      this.validateBeforeReview(e.applySeq, this.reviewDto);
    } else {
      InfoModal.alertInfo({
        confirm: true,
        content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
        onCallback: () => {
          this.review(this.reviewDto);
        },
      });
    }
  }

  // 覆核
  review(reviewDto: ReviewDto) {
    this.setLoading(true);
    this.$counterpartySsiApi.reviewUsingPATCH(reviewDto)
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
    this.$counterpartySsiApi.checkBeforeReviewUsingPOST(applySeq)
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

  // 已上傳附件下載
  async handleDownloadAttachment(itemId, itemName) {
    if (!itemName) return;
    const fileName = itemName.slice(0, itemName.length - 4);
    const fileType = this.$cfEnum.fileExtensionEnum.PDF.toLowerCase();
    await this.$counterpartySsiApi.downloadUsingGET(itemId, { responseType: 'blob' })
    .then((res) => {
      const content = res.data;
      exportUtil.dealDownloadData(content, fileName, fileType);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
  }
}
