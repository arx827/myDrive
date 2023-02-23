import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

import { RmAlmMasterDto } from '@fubonlife/ipk-api-axios-sdk';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    CheckInfoModal,
    CustomizationModal,
    UploadDragger,
    IpkButton,
  },
})
export default class AlmGeneralLedger extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  // 此頁面的全部子頁籤 (for排序子頁籤用)
  currentPageTabList = [this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$childrenTab.childrenTab.IMPORT_TAB.val]

  /** *  ALM資訊主檔 ** */
  form = {
    lotNumber: undefined,
    createDate: undefined,
  }

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  usualForm = {}; // [常用設定] 表單內容 v-model綁定

  functionName = 'RmAlmMaster' // [常用設定] 依照不同功能帶入不同functionName

  modalCustomizationShow = false; // [下載錯誤訊息] modal開關

  errorContent = ''; // [下載錯誤訊息] 內容

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
        title: '批號',
        field: 'lotNumber',
        fixed: 'left',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '資產版本',
        field: 'assetVer',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '資產年月',
        field: 'assetYm',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '案件來源',
        field: 'caseFrom',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '狀態',
        field: 'fileStat',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$actEnum.getObject('caseStatusAlmGeneralLedgerEnum', row.fileStat).color,
                text: this.$actEnum.getObject('caseStatusAlmGeneralLedgerEnum', row.fileStat).key,
              },
            }),
          ],
        },
      },
      {
        title: '最新資料',
        field: 'latest',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'ALM金融資產明細檔錯誤訊息',
        field: 'monetaryAssetsErrorMsg',
        width: 240,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'ALM總帳細項錯誤訊息',
        field: 'otherAssetsErrorMsg',
        width: 200,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'RP及房貸放款拆分錯誤訊息',
        field: 'rpMortgageErrorMsg',
        width: 240,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'NII分攤比例錯誤訊息',
        field: 'niiApportionRatioErrorMsg',
        width: 240,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '投資費用AUM分攤比例表錯誤訊息',
        field: 'aumAllocationRatioErrorMsg',
        width: 260,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '投資費用NII分攤比例表錯誤訊息',
        field: 'niiAllocationRatioErrorMsg',
        width: 260,
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
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '批號', placeholder: '請選擇', type: 'multiSelect', options: undefined, showSearch: true, allOptions: [],
    },
    { label: '建立日期', placeholder: 'yyyy/mm/dd', type: 'rangePicker' },
  ]

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
    lotNumber: { key: null, label: '批號', type: 'textarea' },
    assetVer: { key: null, label: '資產版本', type: 'textarea' },
    assetYm: { key: null, label: '資產年月', type: 'textarea' },
    caseFrom: { key: null, label: '案件來源', type: 'textarea' },
    fileStat: { key: null, label: '狀態', type: 'textarea' },
    latest: { key: null, label: '最新資料', type: 'textarea' },
    monetaryAssetsErrorMsg: { key: null, label: 'ALM金融資產明細檔錯誤訊息', type: 'textarea' },
    otherAssetsErrorMsg: { key: null, label: 'ALM總帳細項錯誤訊息', type: 'textarea' },
    rpMortgageErrorMsg: { key: null, label: 'RP及房貸放款拆分錯誤訊息', type: 'textarea' },
    niiApportionRatioErrorMsg: { key: null, label: 'NII分攤比例錯誤訊息', type: 'textarea' },
    aumAllocationRatioErrorMsg: { key: null, label: '投資費用AUM分攤比例表錯誤訊息', type: 'textarea' },
    niiAllocationRatioErrorMsg: { key: null, label: '投資費用NII分攤比例表錯誤訊息', type: 'textarea' },
    createName: { key: null, label: '建立人員', type: 'textarea' },
    createDate: { key: null, label: '建立日期', type: 'date' },
    updateName: { key: null, label: '異動人員', type: 'textarea' },
    updateDate: { key: null, label: '異動日期', type: 'date' },
  };

  showSubmitFileBtn = false; // 是否顯示送審檔案按鈕

  serialNo = undefined; // [匯出下載錯誤訊息資訊] 流水號

  fileList = []; // 上傳的資料

  fileUploadStatus = ''; // 判斷excel錯誤樣式

  fileUploadData: UploadModel = {
    multiple: false, // 是否可上傳多筆檔案
    acceptFileType: '.xls, .xlsx', // 可上傳的檔案類型
    acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    acceptFileSize: 30, // 可上傳的檔案大小(MB)
  }

  modalCheckEditInfoShow = false; // [檢視彈窗] modal開關

  tempSort = undefined; // 紀錄排序規則

  /**
   * hook
   */
  created() {
    // 取得子頁籤權限
    this.authInfo = this.$authService.getAuthInfo(this.$route.name);
    // 判斷要選定哪個子頁籤
    this.activeKey = this.$authService.getDefaultActiveTabKey(this.currentPageTabList, Object.keys(this.authInfo));
    // 取得「進階查詢、常用設定」表單內容
    this.advancedSearchForm = { ...this.form };
    this.usualForm = { ...this.form };
    // 下拉選單
    this.labelList.find((el) => el.label === '批號').options = this.getLotNumberList();
    this.labelList.find((el) => el.label === '批號').allOptions = this.getLotNumberList();
    // 驗證查詢權限
		const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
		}
    // 查詢
    this.handleSearch(false);
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}

  // 取得批號代碼下拉選單
  getLotNumberList() {
    let lotNumberList = [];
    this.$almGeneralLedgerApi.searchLotNumberUsingGET()
    .then((res) => {
      res.data.content.forEach((data) => {
        lotNumberList.push(data);
      });
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
    return lotNumberList;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;

    this.checkInfoContentForm.lotNumber.key = e.formData.lotNumber;
    this.checkInfoContentForm.assetVer.key = e.formData.assetVer;
    this.checkInfoContentForm.assetYm.key = e.formData.assetYm;
    this.checkInfoContentForm.caseFrom.key = e.formData.caseFrom;
    this.checkInfoContentForm.fileStat.key = e.formData.fileStat;
    this.checkInfoContentForm.latest.key = e.formData.latest;
    this.checkInfoContentForm.monetaryAssetsErrorMsg.key = e.formData.monetaryAssetsErrorMsg;
    this.checkInfoContentForm.otherAssetsErrorMsg.key = e.formData.otherAssetsErrorMsg;
    this.checkInfoContentForm.rpMortgageErrorMsg.key = e.formData.rpMortgageErrorMsg;
    this.checkInfoContentForm.niiApportionRatioErrorMsg.key = e.formData.niiApportionRatioErrorMsg;
    this.checkInfoContentForm.aumAllocationRatioErrorMsg.key = e.formData.aumAllocationRatioErrorMsg;
    this.checkInfoContentForm.niiAllocationRatioErrorMsg.key = e.formData.niiAllocationRatioErrorMsg;
    this.checkInfoContentForm.createName.key = e.formData.createName;
    this.checkInfoContentForm.createDate.key = e.formData.createDate;
    this.checkInfoContentForm.updateName.key = e.formData.updateName;
    this.checkInfoContentForm.updateDate.key = e.formData.updateDate;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 點擊進階查詢按鈕
  async handleSearch(isOperate: boolean) { // 新增/編輯/刪除成功重查下拉選單
    let dto = this.setSearchInfoDto(1, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchInfo(dto);

    if (isOperate) {
      this.labelList.find((el) => el.label === '批號').options = this.getLotNumberList();
    }
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchInfoDto(pageNum: number, pageSize: number) {
    let dto = {
      lotNumber: this.isEmpty(this.advancedSearchForm.lotNumber) ? undefined : this.advancedSearchForm.lotNumber,
      createStartDate: !this.isEmpty(this.advancedSearchForm.createDate) ? moment(this.advancedSearchForm.createDate[0]).format('YYYYMMDD') : null,
      createEndDate: !this.isEmpty(this.advancedSearchForm.createDate) ? moment(this.advancedSearchForm.createDate[1]).format('YYYYMMDD') : null,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchInfo(dto: RmAlmMasterDto) {
    this.setLoading(true);
    this.$almGeneralLedgerApi.paginateALMGeneralLedgerUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];

      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            actionType: this.$actEnum.getBatchOptionsEnum,
            ...item,
          });
        });
      }
      this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
      this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
      this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // ALM資訊主檔排序
  onSortChange(e) {
    this.tempSort = e.sort;
    let dto = this.setSearchInfoDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchInfo(dto);
  }

  // 進階查詢頁數改變
  handlePageChange(e) {
    let dto = this.setSearchInfoDto(e.currentPage, e.pageSize);
    // call API
    this.searchInfo(dto);
  }

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    let createStartDate = !validateUtil.isEmpty(data.createStartDate) ? moment(data.createStartDate) : null;
    let createEndDate = !validateUtil.isEmpty(data.createEndDate) ? moment(data.createEndDate) : null;

    const form = {
      lotNumber: data.lotNumber ? data.lotNumber : undefined,
      createDate: (!createStartDate && !createEndDate) ? null : [createStartDate, createEndDate],
    };

    if (e.modalName === 'advancedSearch') {
      this.advancedSearchForm = form;
    } else {
      this.usualForm = form;
    }
  }

  // 設定常用彈窗儲存按鈕
  submitSaveUsual(e) {
    // 整理後端所需格式
    const data = e.usualForm;
    const setupQueryObj = {
      lotNumber: data.lotNumber,
      createStartDate: !validateUtil.isEmpty(data.createDate) ? moment(data.createDate[0]).format('YYYYMMDD') : null,
      createEndDate: !validateUtil.isEmpty(data.createDate) ? moment(data.createDate[1]).format('YYYYMMDD') : null,
    };
    // 如果是新增常用設定,queryCode帶null
    const queryCode = e.actionType === this.$actEnum.constant.ADD.val ? null : e.usual.key;
    const querySetupEditDto = {
      actionType: e.actionType,
      functionName: this.functionName,
      queryName: e.selectedName,
      setupQuery: JSON.stringify(setupQueryObj),
      department: this.$actEnum.departmentConstant.DEPARTMENT_RISK,
      queryCode,
    };

    // call API
    this.setLoading(true);
    this.$querySetupApi.addOrModifyQuerySetupUsingPOST(querySetupEditDto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        // 呼叫子元件方法
        (this.$refs.advancedSearch as any).resetNameToOrigin();
        return;
      }
      // 成功
      this.$message.success({ content: message, duration: 10 });
      // 呼叫子元件方法
      (this.$refs.advancedSearch as any).getSetupList();
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 上傳change事件
  handleChange(info) {
    // 移除不合規的檔案(在beforeUpload方法裡status被設為removed的檔案)
    info.fileList.forEach((item, index, arr) => {
      if (item.status === 'removed') {
          arr.splice(index, 1);
      }
    });
    // 單筆上傳會進入的流程
    if (!this.fileUploadData.multiple) {
      this.fileUploadStatus = '';
      if (info.fileList.length > 1) {
        this.fileList = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.fileList = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.fileList.push(info.file);
    }
  }

  // 確認上傳檔案
  uploadFile() {
    if (this.isEmpty(this.fileList)) {
      return;
    }
    this.setLoading(true);
    let fileObj = this.fileList[0].originFileObj ? this.fileList[0].originFileObj : this.fileList[0];
    this.$almGeneralLedgerApi.uploadALMGeneralLedgerUsingPOST(fileObj)
    .then((res) => {
      const content = res.data.content;
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        // 如果上傳的檔案格式不對
        if (content.failedCount === 0) {
          const alertMessage = res.data.content.failedReason;
          InfoModal.alertError({
            title: message,
            confirm: false,
            content: `檔案：\r\n${fileObj.name}\r\n ${alertMessage}`,
          });
          fileObj.status = 'error';
          this.$set(this.fileList, 0, fileObj);
          return;
        }
        // 如果上傳的檔案格式無誤但是其中幾筆有問題
        const errorMessage = `檔案：\r\n${fileObj.name}\r\n 您上傳的資料有誤，可點擊"下載"檢視錯誤訊息。\r\n * 檢核正確：${res.data.content.successfulCount}\r\n * 檢核錯誤：${res.data.content.failedCount}`;
        InfoModal.alertError({
          title: message,
          confirm: false,
          content: errorMessage,
        });
        fileObj.status = 'download';
        this.fileUploadStatus = 'download';
        this.$set(this.fileList, 0, fileObj);
        this.serialNo = content.serialNo;
        return;
      }

      // 成功
      const successMessage = `檔案：\r\n${fileObj.name}\r\n * 檢核正確：${res.data.content.successfulCount}`;
      InfoModal.alertSuccess({
        title: message,
        confirm: false,
        content: successMessage,
      });
      fileObj.status = 'done';
      this.$set(this.fileList, 0, fileObj);
      this.fileList = [];
      // 重新查詢
      this.handleSearch(true);
    })
    .catch(() => {
      fileObj.status = 'error';
      this.$set(this.fileList, 0, fileObj);
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 移除檔案
  deleteFile(e) {
    this.fileList = this.fileList.filter((el) => el.uid !== e.uid);
  }

  // 取得狀態代碼對應的中文字
  getCaseStatusEnum(status) {
    if (this.isEmpty(status)) {
      return;
    }
    return this.$actEnum.getObject('caseStatusEnum', status).key;
  }
}
