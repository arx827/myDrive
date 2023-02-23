import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import SsiHistoryModal from '@/pages/cf/CounterpartySsi/SsiHistoryModal.vue';
import SsiAddAndEditModal from '@/pages/cf/CounterpartySsi/SsiAddAndEditModal.vue';
import SsiCheckInfoModal from '@/pages/cf/CounterpartySsi/SsiCheckInfoModal.vue';

@Component({
  components: {
    AdvancedSearch,
    CheckInfoModal,
    IpkVxeTable,
    SsiHistoryModal,
    SsiAddAndEditModal,
    SsiCheckInfoModal,
    IpkButton,
  },
})
export default class CounterpartySsiDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  // 表單內容
  form = {
    counterpartyId: undefined,
    productId: undefined,
    currency: undefined,
  };

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  tempSort = undefined; // 紀錄已點選的排序

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
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
        title: '機構編號',
        field: 'counterpartyId',
        fixed: 'left',
        width: 300,
      },
      {
        title: '產品別',
        field: 'productName',
        width: 200,
      },
      {
        title: '幣別',
        field: 'currency',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '受款行銀行帳號',
        field: 'bfBankAccount',
        width: 200,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '受款人帳號',
        field: 'bfAccount',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'Broker ID Type',
        field: 'brokerIdType',
        width: 130,
      },
      {
        title: 'Broker ID',
        field: 'brokerId',
        width: 130,
      },
      {
        title: 'Clearer ID Type',
        field: 'clearerIdType',
        width: 130,
      },
      {
        title: 'Clearer ID',
        field: 'clearerId',
        width: 130,
      },
      {
        title: 'Settlement Location',
        field: 'settlementLocation',
        width: 200,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '股權集保帳號',
        field: 'equityTdccAccount',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '證券代號',
        field: 'brokerageCode',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '公債帳號',
        field: 'pdAccount',
        width: 130,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '債券集保帳號',
        field: 'bondTdccAccount',
        width: 130,
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // 進階查詢欄位名稱
    {
      label: '機構編號',
      placeholder: '請至少輸入4位關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      showSearch: true,
      showSelfDefined: {
        limitNum: 4,
        filterOptions: [],
      },
    },
    {
      label: '產品別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ];

  modalAddInfoShow = false; // [新增/修改彈窗] modal開關

  addAndEditInfo = { // [新增/修改彈窗] 後端邏輯-新增/修改
    actionType: null,
    editInfo: {},
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoForm = { // [檢視彈窗] 新增表單內容 v-model綁定及表單欄位名稱
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
    contact: {
      address: undefined,
      faxNumber1: undefined,
      faxNumber2: undefined,
      licenserName1: undefined,
      licenserTel1: undefined,
      licenserMobile1: undefined,
      licenserEmail1: undefined,
      licenserName2: undefined,
      licenserTel2: undefined,
      licenserMobile2: undefined,
      licenserEmail2: undefined,
      licenserName3: undefined,
      licenserTel3: undefined,
      licenserMobile3: undefined,
      licenserEmail3: undefined,
    },
    attachment: [],
  };

  historyShow = false; // [歷史彈窗] modal開關

  historyInfo = {}; // [歷史彈窗] 彈窗查詢內容

  /**
   * hook
   */
  async created() {
    // 取得「進階查詢」表單內容
    this.advancedSearchForm = { ...this.form };
    // 下拉選單設定
    let counterpartyIdOptions = await this.$cfCommon.getCounterpartyIdOption();
    let productIdOptions = await this.$cfCommon.getProductClassOption();
    let currencyOptions = await this.$cfCommon.getCurrencyOption([]);

    this.labelList.find((el) => el.label === '機構編號').options = counterpartyIdOptions;
    this.labelList.find((el) => el.label === '機構編號').allOptions = counterpartyIdOptions;
    this.labelList.find((el) => el.label === '產品別').options = productIdOptions;
    this.labelList.find((el) => el.label === '產品別').allOptions = productIdOptions;
    this.labelList.find((el) => el.label === '幣別').options = currencyOptions;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOptions;
    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch();
  }

  /**
  * methods
  */
  // ------------------查詢相關------------------
  // 點擊進階查詢按鈕
  handleSearch() {
    // 清空排序
    (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
    this.tempSort = undefined;
    // call API
    let dto = this.setSearchCounterpartySsiDto(1, this.ipkGrid.pagerConfig.pageSize);
    this.searchCounterpartySsi(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchCounterpartySsiDto(pageNum: number, pageSize: number) {
    let dto = {
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      productId: this.isEmpty(this.advancedSearchForm.productId) ? undefined : this.advancedSearchForm.productId,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 分頁查詢交易對手收付款機構
  searchCounterpartySsi(dto) {
    this.setLoading(true);
    this.$counterpartySsiApi.paginateCounterpartySsiUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        const isSuccess = res.data.success;
        const message = res.data.message;
        const totalCount = parseInt(res.data.totalCount);
        this.ipkGrid.data = [];

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              actionType: this.$cfEnum.actionTypeOption,
              ...item,
            });
          });
        }

        this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
        this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
        this.ipkGrid.pagerConfig.total = totalCount;

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

  // ------------------操作相關------------------
  // 取得更多操作及欄位資訊
  getActionType(e) {
    let getButtonsAuthInfoObj;
    switch (e.actionType) {
      // 檢視
      case 'C':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openCheckInfoModal(e);
        break;
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
        this.openAddAndEditModal(e);
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
        this.openHistoryModal({ ...e, pageNum: 1, pageSize: 10 });
        break;
    }
  }

  // 查詢交易對手收付款機構明細
  searchDetailInfo(ssiId: string): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$counterpartySsiApi.searchDetailUsingGET(ssiId)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        let obj = JSON.parse(JSON.stringify(content));
        resolve(obj);
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

  // ------------------檢視相關------------------
  // 開啟檢視彈窗
  async openCheckInfoModal(e) {
    // call API
    this.checkInfoForm = await this.searchDetailInfo(e.rowData.ssiId);
    // 開啟彈窗
    this.modalCheckInfoShow = true;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // ------------------歷程相關------------------
  // 開啟歷程彈窗
  openHistoryModal(historyInfo) {
    this.historyShow = true;
    this.historyInfo = historyInfo;
  }

  // 關閉歷程彈窗
  closeHistoryModal() {
    this.historyShow = false;
  }

  // 開啟新增/修改彈窗
  async openAddAndEditModal(e) {
    // 新增
    if (e.actionType === this.$cfEnum.constant.ADD.val) {
      this.addAndEditInfo.editInfo = {};
    }
    // 修改
    if (e.actionType === this.$cfEnum.constant.MODIFY.val) {
      if (this.isEmpty(e.rowData)) {
        return;
      }
      let content = await this.searchDetailInfo(e.rowData.ssiId);
      this.addAndEditInfo.editInfo = { ...content };
    }
    this.modalAddInfoShow = true;
    this.addAndEditInfo.actionType = e.actionType;
  }

  // 關閉新增/修改彈窗
  closeAddAndEditModal() {
    this.modalAddInfoShow = false;
    // 重新查詢
    this.handleSearch();
  }

  // ------------------其他------------------
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 排序改變
  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchCounterpartySsiDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchCounterpartySsi(dto);
  }

  // 頁碼改變
  handlePageChange(e) {
    let dto = this.setSearchCounterpartySsiDto(e.currentPage, e.pageSize);
    // call API
    this.searchCounterpartySsi(dto);
  }
}
