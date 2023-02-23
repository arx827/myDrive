import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

import { CutOffConfigDto } from '@fubonlife/ipk-api-axios-sdk';
import HistoryModal from '@/pages/cf/CutOffConfig/HistoryModal.vue';
import AddAndEditModal from '@/pages/cf/CutOffConfig/AddAndEditModal.vue';

@Component({
  components: {
    AdvancedSearch,
    AddAndEditModal,
    CheckInfoModal,
    IpkVxeTable,
    HistoryModal,
    IpkButton,
  },
})
export default class CutOffConfigDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = { // [進階查詢] 預設表單內容 v-model綁定
    custodian: undefined,
    currency: undefined,
    nationId: undefined,
    type: undefined,
    tradeType: undefined,
  }

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
        title: '保管行',
        field: 'custodian',
        fixed: 'left',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '幣別',
        field: 'currency',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '國家',
        field: 'nationId',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: '25%',
      },
      {
        title: '交易類型',
        field: 'type',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('typeOption', data.cellValue);
        },
      },
      {
        title: '買賣類型',
        field: 'tradeType',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '保管行', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '國家', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易類型', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '買賣類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ]

  modalAddInfoShow = false; // // [新增/修改彈窗] modal開關

  addAndEditInfo = { // // [新增/修改彈窗] 後端邏輯-新增/修改
    actionType: null,
    editInfo: {},
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
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
  };

  isPending = false; // 是否從待放行清單點擊檢視

  modalHistoryShow = false; // [歷程彈窗] modal開關

  historyInfo = {}; // [歷程彈窗] 彈窗查詢內容

  /**
   * hook
   */
  async created() {
    // 取得「進階查詢」表單內容
    this.advancedSearchForm = { ...this.form };
    // 取得下拉選單
    this.labelList.find((el) => el.label === '保管行').options = this.$cfEnum.custodianOption;
    this.labelList.find((el) => el.label === '保管行').allOptions = this.$cfEnum.custodianOption;
    this.labelList.find((el) => el.label === '交易類型').options = this.$cfEnum.typeOption;
    this.labelList.find((el) => el.label === '交易類型').allOptions = this.$cfEnum.typeOption;
    this.labelList.find((el) => el.label === '買賣類別').options = this.$cfEnum.tradeTypeOption;
    this.labelList.find((el) => el.label === '買賣類別').allOptions = this.$cfEnum.tradeTypeOption;
    let currencyOptions = await this.$cfCommon.getCurrencyOption([]);
    this.labelList.find((el) => el.label === '幣別').options = currencyOptions;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOptions;
    let nationIdOptions = await this.$cfCommon.getNationOption();
    this.labelList.find((el) => el.label === '國家').options = nationIdOptions;
    this.labelList.find((el) => el.label === '國家').allOptions = nationIdOptions;
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
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 開啟新增/修改彈窗
  async openAddAndEditModal(e) {
    this.modalAddInfoShow = true;
    this.addAndEditInfo.actionType = e.actionType;
    // 新增
    if (e.actionType === this.$cfEnum.constant.ADD.val) {
      this.addAndEditInfo.editInfo = {};
      return;
    }
    // 修改
    let dto = {
      custodian: this.isEmpty(e.rowData.custodian) ? undefined : e.rowData.custodian,
      currency: this.isEmpty(e.rowData.currency) ? undefined : e.rowData.currency,
      nationId: this.isEmpty(e.rowData.nationId) ? undefined : e.rowData.nationId,
      type: this.isEmpty(e.rowData.type) ? undefined : e.rowData.type,
      tradeType: this.isEmpty(e.rowData.tradeType) ? undefined : e.rowData.tradeType,
    };
    // call API
    let content = await this.searchDetail(dto);
    this.addAndEditInfo.editInfo = { ...content };
  }

  // 關閉新增彈窗
  closeAddAndEditModal() {
    this.modalAddInfoShow = false;
    // 重新查詢
    this.handleSearch();
  }

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

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = true;
    // 整理成後端格式
    let dto = {
      custodian: this.isEmpty(e.rowData.custodian) ? undefined : e.rowData.custodian,
      currency: this.isEmpty(e.rowData.currency) ? undefined : e.rowData.currency,
      nationId: this.isEmpty(e.rowData.nationId) ? undefined : e.rowData.nationId,
      type: this.isEmpty(e.rowData.type) ? undefined : e.rowData.type,
      tradeType: this.isEmpty(e.rowData.tradeType) ? undefined : e.rowData.tradeType,
    };
    // call API
    this.searchDetail(dto);
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
    this.isPending = false;
    // 清空
    Object.entries(this.checkInfoContentForm).forEach(([key, item], index) => {
      if (!this.isEmpty(this.checkInfoContentForm[key])) {
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
    let dto = this.setSearchCutOffTimeDto(1, this.ipkGrid.pagerConfig.pageSize);
    this.searchCutOffTime(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchCutOffTimeDto(pageNum: number, pageSize: number) {
    let dto = {
      custodian: this.isEmpty(this.advancedSearchForm.custodian) ? undefined : this.advancedSearchForm.custodian,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      nationId: this.isEmpty(this.advancedSearchForm.nationId) ? undefined : this.advancedSearchForm.nationId,
      type: this.isEmpty(this.advancedSearchForm.type) ? undefined : this.advancedSearchForm.type,
      tradeType: this.isEmpty(this.advancedSearchForm.tradeType) ? undefined : this.advancedSearchForm.tradeType,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchCutOffTime(dto: CutOffConfigDto) {
    this.setLoading(true);
    this.$cutOffConfigApi.paginateConfigUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];

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
      this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);

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

  // 表格欄位排序改變
  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchCutOffTimeDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchCutOffTime(dto);
  }

  // 頁數改變
  handlePageChange(e) {
    let dto = this.setSearchCutOffTimeDto(e.currentPage, e.pageSize);
    // call API
    this.searchCutOffTime(dto);
  }

  // 查詢檢視明細
  searchDetail(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$cutOffConfigApi.searchDetailUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;

        if (!this.isEmpty(content)) {
          Object.entries(content).forEach(([key, item], index) => {
            if (!this.isEmpty(this.checkInfoContentForm[key])) {
              this.checkInfoContentForm[key].key = item;
            }
          });
          this.checkInfoContentForm.cashCutOffDay.key = !this.isEmpty(content.cashCutOffDay) ? `SD-${content.cashCutOffDay}` : undefined;
          this.checkInfoContentForm.equityCutOffDay.key = !this.isEmpty(content.equityCutOffDay) ? `SD-${content.equityCutOffDay}` : undefined;
          this.checkInfoContentForm.tradeCycle.key = !this.isEmpty(content.tradeCycle) ? `T+${content.tradeCycle}` : undefined;
          this.checkInfoContentForm.type.key = this.$cfEnum.getLabel('typeOption', content.type);
          resolve(content);
        }
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

  // 開啟歷程彈窗
  openHistoryModal(historyInfo) {
    this.modalHistoryShow = true;
    this.historyInfo = historyInfo;
  }

  // 關閉歷程彈窗
  closeHistoryModal() {
    this.modalHistoryShow = false;
  }
}
