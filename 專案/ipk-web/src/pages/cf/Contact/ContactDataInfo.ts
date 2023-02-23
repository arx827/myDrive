import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

import { ContactDto, ContactEditDto } from '@fubonlife/ipk-api-axios-sdk';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import AddModal from '@/pages/cf/Contact/AddModal.vue';

@Component({
  components: {
    AdvancedSearch,
    AddModal,
    CheckInfoModal,
    IpkVxeTable,
    IpkButton,
  },
})
export default class ContactDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = { // [進階查詢] 預設表單內容 v-model綁定
    productGroup: undefined,
    empDomain: undefined,
  }

  advancedSearchForm: any = {
    productGroup: undefined,
    empDomain: undefined,
  }; // [進階查詢] 表單內容 v-model綁定

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
        title: '產品群組',
        field: 'productGroupName',
        fixed: 'left',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '帳號',
        field: 'empDomain',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '姓名',
        field: 'empName',
        sortable: false,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: '25%',
      },
      {
        title: '建立人員',
        field: 'createId',
        sortable: false,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '建立日期',
        field: 'createDate',
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

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '產品群組', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '帳號', placeholder: '請選擇', type: 'inputText',
    },
  ]

  modalAddInfoShow = false; // [新增彈窗] modal開關

  addInfo = { // [新增彈窗] 後端邏輯-新增/修改
    actionType: null,
    editInfo: {},
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
    productGroupName: { key: null, label: '產品群組', type: 'inputText' },
    empDomain: { key: null, label: '帳號', type: 'inputText' },
    unitName: { key: null, label: '單位', type: 'inputText' },
    tel: { key: null, label: '分機', type: 'inputText' },
    createId: { key: null, label: '建立人員', type: 'inputText' },
    createDate: { key: null, label: '建立日期', type: 'dateTime' },
  };

  /**
   * hook
   */
  async created() {
    this.advancedSearchForm = { ...this.form };
    // 取得下拉選單
    let productGroupOption = await this.$cfCommon.getProductGroupOption();
    this.labelList.find((el) => el.label === '產品群組').options = productGroupOption;
    this.labelList.find((el) => el.label === '產品群組').allOptions = productGroupOption;
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

  // 開啟新增
  openAddModal() {
    this.modalAddInfoShow = true;
  }

  // 關閉新增彈窗
  closeAddModal() {
    this.modalAddInfoShow = false;
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
      // 刪除
      case 'D':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val, this.$cfButtonKey.buttonKey.REMOVE.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.handleDeleteContact(e);
        break;
    }
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = true;
    // 整理成後端格式
    let dto = {
      productGroup: this.isEmpty(e.rowData.productGroup) ? undefined : e.rowData.productGroup,
      empDomain: this.isEmpty(e.rowData.empDomain) ? undefined : e.rowData.empDomain,
    };
    // call API
    this.searchDetail(dto);
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
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
    let dto = this.setSearchContactDto(1, this.ipkGrid.pagerConfig.pageSize);
    this.searchContact(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchContactDto(pageNum: number, pageSize: number) {
    let dto = {
      productGroup: this.isEmpty(this.advancedSearchForm.productGroup) ? undefined : this.advancedSearchForm.productGroup,
      empDomain: this.isEmpty(this.advancedSearchForm.empDomain) ? undefined : this.advancedSearchForm.empDomain,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchContact(dto: ContactDto) {
    this.setLoading(true);
    this.$contactApi.paginateContactUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];

        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              actionType: this.$cfEnum.contactActoinTypeOption,
              ...item,
            });
          });
        }

        this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
        this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
        this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);
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
    let dto = this.setSearchContactDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchContact(dto);
  }

  // 頁數改變
  handlePageChange(e) {
    let dto = this.setSearchContactDto(e.currentPage, e.pageSize);
    // call API
    this.searchContact(dto);
  }

  // 查詢檢視明細
  searchDetail(dto: ContactEditDto): any {
    this.setLoading(true);
    this.$contactApi.searchContactDetailUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;

        if (!this.isEmpty(content)) {
          Object.entries(content).forEach(([key, item], index) => {
            if (!this.isEmpty(this.checkInfoContentForm[key])) {
              this.checkInfoContentForm[key].key = item;
            }
          });
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

  // 點擊刪除按鈕
  handleDeleteContact(e): any {
    let dto = {
      productGroup: this.isEmpty(e.rowData.productGroup) ? undefined : e.rowData.productGroup,
      empDomain: this.isEmpty(e.rowData.empDomain) ? undefined : e.rowData.empDomain,
    };
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.DELETE_CONFIRM_INFO?.message,
      onCallback: () => {
        this.deleteContact(dto);
      },
    });
  }

  // 刪除聯繫人
  deleteContact(dto) {
    this.setLoading(true);
    this.$contactApi.removeContactUsingDELETE(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      this.$message.success(message);
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
}
