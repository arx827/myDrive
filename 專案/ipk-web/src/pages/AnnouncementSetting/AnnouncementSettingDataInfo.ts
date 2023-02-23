import moment from 'moment';
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import AddAndEditModal from '@/pages/AnnouncementSetting/AddAndEditModal.vue';
import InfoModal from '@/plugins/notification/infoModal';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import AnnouncementModal from '@/pages/AnnouncementSetting/AnnouncementModal.vue';
import validateUtil from '@/plugins/util/validateUtil';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    IpkButton,
    AddAndEditModal,
    AnnouncementModal,
  },
})
export default class AnnouncementSettingDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */
  functionName = 'AnnouncementSetting'

  searchFormTemplate = { // 查詢表單樣版
    title: undefined,
    publishDate: undefined,
    effectDate: undefined,
    expiryDate: undefined,
    status: undefined,
  };

  advancedSearchSettings = { // 進階查詢設定
    title: { label: '公告標題', placeholder: '請輸入', type: 'inputText' },
    publishDate: { label: '發佈日', type: 'rangePicker' },
    effectDate: { label: '生效日', type: 'rangePicker' },
    expiryDate: { label: '失效日', type: 'rangePicker' },
    status: {
      label: '狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined,
    },
  }

  showAddAndEditModal = false; // [新增和編輯彈窗] modal開關

  showCheckInfoModal = false // [檢視彈窗] modal開關

  addAndEditInfo = { // [新增和編輯彈窗] 表單資訊
    actionType: null,
    formData: {},
  };

  announcementDetail = {
    id: null,
    tagColor: '',
    tagTitle: '',
    title: '',
    content: '',
    attachment: [],
    announcer: '',
    publishDate: '',
    effectDate: '',
    expiryDate: '',
    documentNum: '',
    releaseDepartment: '',
    clickTotal: 0,
  } // 公告詳細資訊

  labelList: Array<AdvancedSearchModel> = [
    this.advancedSearchSettings.title,
    this.advancedSearchSettings.publishDate,
    this.advancedSearchSettings.effectDate,
    this.advancedSearchSettings.expiryDate,
    this.advancedSearchSettings.status,
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
        title: '公告標題',
        field: 'announcementTitle',
        slots: { default: 'link' },
      },
      {
        title: '發佈者',
        field: 'announcementEmpDomain',
        width: 140,
      },
      {
        title: '發佈日',
        field: 'announcementPublishDate',
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
        title: '生效日',
        field: 'announcementEffectDate',
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
        title: '失效日',
        field: 'announcementExpiryDate',
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
        field: 'announcementStatus',
        width: 160,
        sortable: true,
        sortConfig: { orders: ['asc', 'desc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$settingsEnum.getObject('announcementStatus', row.announcementStatus).color,
                text: this.$settingsEnum.getObject('announcementStatus', row.announcementStatus).label,
              },
            }),
          ],
        },
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
    // 整理進階查詢狀態下拉選單
    const statusOption = this.getStatusList();
    this.advancedSearchSettings.status.options = statusOption;
    // 查詢資料
    this.searchInfo();
  }

  /**
   * methods
   */
  // 取得公告清單
  searchInfo() {
    this.setLoading(true);
    const dto = {
      title: this.advancedSearchForm.title,
      publishBeginDate: this.advancedSearchForm.publishDate ? this.advancedSearchForm.publishDate[0] : this.advancedSearchForm.publishDate,
      publishFinishDate: this.advancedSearchForm.publishDate ? this.advancedSearchForm.publishDate[1] : this.advancedSearchForm.publishDate,
      effectBeginDate: this.advancedSearchForm.effectDate ? this.advancedSearchForm.effectDate[0] : this.advancedSearchForm.effectDate,
      effectFinishDate: this.advancedSearchForm.effectDate ? this.advancedSearchForm.effectDate[1] : this.advancedSearchForm.effectDate,
      expiryBeginDate: this.advancedSearchForm.expiryDate ? this.advancedSearchForm.expiryDate[0] : this.advancedSearchForm.expiryDate,
      expiryFinishDate: this.advancedSearchForm.expiryDate ? this.advancedSearchForm.expiryDate[1] : this.advancedSearchForm.expiryDate,
      status: this.advancedSearchForm.status,
      pageNum: this.ipkGrid.pagerConfig.currentPage,
      pageSize: this.ipkGrid.pagerConfig.pageSize,
      sort: this.tableSort,
    };
    this.$announcementApi.paginateAnnouncementUsingPOST(dto)
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
          // 後端失效日記錄為隔天的00:00:00.000，因此前端顯示上要減1天來符合原設定含意
          expiryDate: !validateUtil.isEmpty(data.announcementExpiryDate) ? moment(data.announcementExpiryDate).subtract(1, 'days').format('YYYY/MM/DD') : '',
          actionType: this.getAvailableOperations(data),
          // 超過到期日則不可再做任何檢視之外的操作
          actionTypeDisabled: moment().isAfter(data.announcementExpiryDate),
        }));

        this.ipkGrid.data = [...gridData];
        this.ipkGrid.pagerConfig.total = totalCount;
      }).catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得公告狀態選單
  getStatusList() {
    return this.$settingsEnum.announcementStatus;
  }

  // 取得可用操作
  getAvailableOperations(data) {
    let statusOperation = this.$settingsEnum.getValue('getOptionsEnum', data.announcementStatus);
    // 超過發佈時間後不提供修改操作
    const today = moment();
    if (today.isAfter(moment(data.announcementPublishDate))) {
      return statusOperation.filter((option) => option.value !== this.$settingsEnum.constant.MODIFY.value);
    }
    return statusOperation;
  }

  // 取得公告資訊
  getAnnouncementData(announcementId) {
    this.setLoading(true);
    this.$announcementApi.searchAnnouncementDetailUsingGET(announcementId)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      const attachmentList = [];
      content.announcementNameList.forEach((attachment) => {
        const file: any = new File([''], attachment.attachmentName);
        file.uid = attachment.attachmentId * -1;
        file.isDownload = true;
        attachmentList.push(file);
      });

      this.addAndEditInfo.formData = {
        id: content.announcementId,
        title: content.announcementTitle,
        content: content.announcementContent,
        attachment: attachmentList,
        publishDate: !validateUtil.isEmpty(content.announcementPublishDate) ? moment(moment(content.announcementPublishDate).format('YYYY/MM/DD')) : '',
        effectDate: !validateUtil.isEmpty(content.announcementEffectDate) ? moment(moment(content.announcementEffectDate).format('YYYY/MM/DD')) : '',
        expiryDate: !validateUtil.isEmpty(content.announcementExpiryDate) ? moment(moment(content.announcementExpiryDate).format('YYYY/MM/DD')) : '',
        documentNum: content.announcementDocumentNo,
        type: content.announcementType,
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

  // 公告清單排序
  onSortChange(e) {
    this.tableSort = e.sort;
    this.searchInfo();
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

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.setLoading(true);
    this.$announcementApi.searchAnnouncementDetailUsingGET(e.formData.announcementId)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      const tagData = this.$settingsEnum.announcementType.filter((type) => type.value === content.announcementType)[0];

      this.announcementDetail = {
        id: content.announcementId,
        tagColor: tagData.color,
        tagTitle: tagData.label,
        title: content.announcementTitle,
        content: content.announcementContent,
        attachment: content.announcementNameList,
        announcer: content.announcementEmpDomain,
        publishDate: !validateUtil.isEmpty(content.announcementPublishDate) ? moment(content.announcementPublishDate).format('YYYY/MM/DD') : '',
        effectDate: !validateUtil.isEmpty(content.announcementEffectDate) ? moment(content.announcementEffectDate).format('YYYY/MM/DD') : '',
        expiryDate: !validateUtil.isEmpty(content.announcementExpiryDate) ? moment(content.announcementExpiryDate).format('YYYY/MM/DD') : '',
        documentNum: content.announcementDocumentNo,
        releaseDepartment: content.announcementBu,
        clickTotal: content.hitCount,
      };
      this.showCheckInfoModal = true;
    }).catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 取得操作及該筆資料
  async getActionType(e) {
    // Step1. 整理API資料
    const targetData = e.rowData;
    // Step2. 根據操作呼叫API
    const actionType = e.actionType;
    let getButtonsAuthInfoObj: any = {};
    switch (actionType) {
      case this.$settingsEnum.constant.MODIFY.value:
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.MODIFY.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.getAnnouncementData(targetData.announcementId);
        break;
      case this.$settingsEnum.constant.ENABLE.value:
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.ENABLE.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openEnableModal(targetData.announcementId);
        break;
      case this.$settingsEnum.constant.DISABLE.value:
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.DISABLE.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openDisableModal(targetData.announcementId);
        break;
    }
  }

  // 啟用公告警告
  openEnableModal(announcementId: number) {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$otherMsgEnumData.ANNOUNCEMENT_ENABLE_CONFIRM_INFO.message,
      onCallback: () => {
        this.$announcementApi.enableAnnouncementUsingPOST(announcementId)
        .then((res) => {
          const isSuccess = res.data.success;
          const message = res.data.message;

          if (!isSuccess) {
            InfoModal.alertError({ confirm: false, content: message });
            return;
          }
          this.$message.success(message, 10);
          this.searchInfo();
        })
        .catch(() => {
          // API失敗
          InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
        })
        .finally(() => {
          this.setLoading(false);
        });
      },
    });
  }

  // 停用公告警告
  openDisableModal(announcementId: number) {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$otherMsgEnumData.ANNOUNCEMENT_DISABLE_CONFIRM_INFO.message,
      onCallback: () => {
        this.$announcementApi.disableAnnouncementUsingPOST(announcementId)
        .then((res) => {
          const isSuccess = res.data.success;
          const message = res.data.message;

          if (!isSuccess) {
            InfoModal.alertError({ confirm: false, content: message });
            return;
          }
          this.$message.success(message, 10);
          this.searchInfo();
        })
        .catch(() => {
          // API失敗
          InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
        })
        .finally(() => {
          this.setLoading(false);
        });
      },
    });
  }
}
