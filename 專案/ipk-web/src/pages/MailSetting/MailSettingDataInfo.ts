import moment from 'moment';
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import AddAndEditModal from '@/pages/MailSetting/AddAndEditModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import MailModal from '@/pages/MailSetting/MailModal.vue';
import SendModal from '@/pages/MailSetting/SendModal.vue';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    AddAndEditModal,
    IpkButton,
    MailModal,
    SendModal,
  },
})
export default class MailSettingDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */
  functionName = 'MailSetting'

  noticeKind = this.$settingsEnum.noticeType.EMAIL.value

  searchFormTemplate = { // 查詢表單樣版
    templateName: undefined,
    noticeSubject: undefined,
  };

  advancedSearchSettings = { // 進階查詢設定
    templateName: { label: '版型名稱', placeholder: '請輸入', type: 'inputText' },
    noticeSubject: { label: '主旨', placeholder: '請輸入', type: 'inputText' },
  }

  showAddAndEditModal = false; // [新增和編輯彈窗] modal開關

  showCheckInfoModal = false // [檢視彈窗] modal開關

  showSendModal = false // [發送彈窗] modal開關

  addAndEditInfo = { // [新增和編輯彈窗] 表單資訊
    actionType: null,
    formData: {},
  };

  detail = {
    templateName: '',
    noticeSubject: '',
    noticeContent: '',
    selectedNoticeSymbolList: [],
  } // 詳細資訊

  labelList: Array<AdvancedSearchModel> = [
    this.advancedSearchSettings.templateName,
    this.advancedSearchSettings.noticeSubject,
  ] // [進階查詢] 表單欄位名稱

  advancedSearchForm = { ...this.searchFormTemplate }; // [進階查詢] 表單內容

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
    scrollY: { gt: 200, mode: 'wheel' },
    showOverflow: 'ellipsis',
    autoResize: true,
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
        title: '版型名稱',
        field: 'templateName',
        slots: { default: 'link' },
      },
      {
        title: '主旨',
        field: 'noticeSubject',
      },
      {
        title: '觸發操作',
        width: 160,
        field: 'noticeEventName',
      },
      {
        title: '建立人員',
        field: 'createId',
        width: 140,
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
        field: 'updateId',
        width: 140,
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

  tableSort = undefined; // 結果表格的資料排序

  /**
   * hook
   */
  created() {
    // 查詢資料
    this.searchInfo();
  }

  /**
   * methods
   */
  // 查詢信件版型清單
  searchInfo() {
    this.setLoading(true);
    const dto = {
      templateName: this.advancedSearchForm.templateName,
      noticeSubject: this.advancedSearchForm.noticeSubject,
      noticeKind: this.noticeKind,
      pageNum: this.ipkGrid.pagerConfig.currentPage,
      pageSize: this.ipkGrid.pagerConfig.pageSize,
      sort: this.tableSort,
    };
    this.$emailApi.paginateNoticeTemplateUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;
        const totalCount = parseInt(res.data.totalCount);

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        const gridData = content.map((data) => ({
          ...data,
          actionType: this.getAvailableOperations(),
        }));

        this.ipkGrid.data = [...gridData];
        this.ipkGrid.pagerConfig.total = totalCount;
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得可用操作(此功能僅提供編輯操作)
  getAvailableOperations() {
    return this.$settingsEnum.getValue('noticeOperationOptionEnum', this.$settingsEnum.constant.MODIFY.value);
  }

  // 取得樣板資訊
  getNoticeTemplate(noticeTemplateId) {
    this.setLoading(true);
    this.$emailApi.searchNoticeTemplateDetailUsingGET(noticeTemplateId)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.addAndEditInfo.formData = {
          noticeTemplateId: content.noticeTemplateId,
          templateName: content.templateName,
          noticeSubject: content.noticeSubject,
          noticeContent: content.noticeContent,
          selectedNoticeSymbolList: content.noticeSymbolVoList,
        };
        this.openAddAndEditModal(this.$settingsEnum.constant.MODIFY.value);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 查詢
  handleSearch() {
    this.ipkGrid.pagerConfig.currentPage = 1;
    this.searchInfo();
  }

  // 頁數改變
  handlePageChange(e) {
    this.ipkGrid.pagerConfig.currentPage = e.currentPage;
    this.ipkGrid.pagerConfig.pageSize = e.pageSize;
    this.searchInfo();
  }

  // 開啟新增編輯彈窗
  openAddAndEditModal(actionType: string) {
    this.addAndEditInfo.actionType = actionType;
    this.showAddAndEditModal = true;
  }

  // 關閉新增編輯彈窗
  closeAddAndEditModal() {
    this.showAddAndEditModal = false;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.showCheckInfoModal = false;
  }

  // 開啟發送彈窗
  openSendModal() {
    this.showSendModal = true;
  }

  // 關閉發送彈窗
  closeSendModal() {
    this.showSendModal = false;
  }

  // 通知清單排序
  onSortChange(e) {
    this.tableSort = e.sort;
    this.searchInfo();
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.setLoading(true);
    this.$emailApi.searchNoticeTemplateDetailUsingGET(e.formData.noticeTemplateId)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.detail = {
          templateName: content.templateName,
          noticeSubject: content.noticeSubject,
          noticeContent: content.noticeContent,
          selectedNoticeSymbolList: content.noticeSymbolVoList,
        };
        this.showCheckInfoModal = true;
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得操作及該筆資料
  getActionType(e) {
    const actionType = e.actionType;
    switch (actionType) {
      case this.$settingsEnum.constant.MODIFY.value:
        const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.MODIFY.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.getNoticeTemplate(e.rowData.noticeTemplateId);
        break;
    }
  }
}
