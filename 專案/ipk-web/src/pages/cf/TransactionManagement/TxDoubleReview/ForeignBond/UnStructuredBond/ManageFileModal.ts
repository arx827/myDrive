import {
  Vue, Component, PropSync,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import InfoModal from '@/plugins/notification/infoModal';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkVxeTable,
    UploadDragger,
    IpkButton,
  },
})
export default class ManageFileModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @PropSync('modalManageFileShow')
  modalManageFileShowSync: boolean // modal開關

  /**
  * data
  */

  activeKey = '0'; // 被選取的頁籤(預設首頁)

  tabList = [ // 頁籤資訊
    { label: '整批新增附件', key: '0' },
    { label: '整批刪除附件', key: '1' },
  ]

  addManageFileForm = {
    transactionDate: undefined, // 交易日
    invCategoryCode: undefined, // 資產類別
    transactionType: undefined, // 交易別
    bondKeeping: [], // 債券保管
    txCode: '', // 交易編號
  }

  deleteManageFileForm = {
    transactionDate: undefined, // 交易日
    invCategoryCode: undefined, // 資產類別
    transactionType: undefined, // 交易別
    bondKeeping: [], // 債券保管
    txCode: '', // 交易編號
  }

  formRules: { [key: string]: ValidationRule[] } = { // 表單驗證
    // transactionDate: [
    //   {
    //     required: true,
    //     message: '請輸入日期',
    //     trigger: 'change',
    //   },
    // ],
  };

  selectorOption = {
    invCategoryCodeOption: [],
    transactionType: [],
    bondKeeping: [],
  }

  /** 整批新增附件 */
  addSelectedRowList = []; // 已選取的待放行清單項目

  addIpkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: { enabled: false },
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
        align: 'center',
        width: 60,
      },
      {
        title: '交易編號',
        field: 'txCode',
      },
    ],
  }

  attachmentInfo = []; // 上傳的資料

  fileUploadData: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.pdf', // 可上傳的檔案類型
    acceptType: ['application/pdf'],
    showRemoveIcon: true,
    showDownload: true,
  }

  /** 整批刪除附件 */
  deleteSelectedRowList = []; // 已選取的待放行清單項目

  deleteIpkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: { enabled: false },
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
        align: 'center',
        width: 60,
      },
      {
        title: '附件名稱',
        field: 'attachmentName',
        slots: { default: 'link' },
      },
      {
        title: '交易編號',
        field: 'txCodeList',
      },
    ],
  }

  /**
  * hook
  */
   async created() {
    // 下拉選單
    this.selectorOption.invCategoryCodeOption = await this.$cfCommon.getInvestmentCategoryOption('nonstructure');
    this.selectorOption.transactionType = await this.$cfEnum.transactionOption;
    this.selectorOption.bondKeeping = await this.$cfCommon.getCustodianOption();
    // 初始資料
    this.resetManageFile();
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 查詢欄位驗證
  validateSearch(data) {
    let byPass = true;
    if (!this.isEmpty(data)) {
      Object.entries(data).forEach(([key, value]) => {
        if (this.isEmpty(value)) {
          byPass = false;
        }
      });
    }
    return byPass;
  }

  getDtoData() {
    const formTabId = (this.activeKey === '0') ? 'addManageFileForm' : 'deleteManageFileForm';
    return {
      custodian: this[formTabId].bondKeeping,
      invCategoryCode: this[formTabId].invCategoryCode,
      tradeDate: this[formTabId].transactionDate && moment(this[formTabId].transactionDate).format('YYYYMMDD'),
      bsType: this[formTabId].transactionType,
      txCode: this[formTabId].txCode,
    };
  }

  /**
  * API
  */
  // API: 驗證
  validateBeforeSaveAttachment(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$txDoubleReview.checkBeforeSaveAttachmentUsingPOST(dto)
      .then((res) => {
        resolve(res.data);
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

  // API: 查詢交易編號狀態
  searchTxCode(dto) {
    this.setLoading(true);
    this.$txDoubleReview.nonstructureSearchTxCodeUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      this.addIpkGrid.data = content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 查詢附件關聯
  searchAttachmentRelation(dto) {
    this.setLoading(true);
    this.$txDoubleReview.nonstructureSearchAttachmentRelationUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      this.deleteIpkGrid.data = content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 儲存附件
  saveAttachment() {
    let dto = {
      add: [],
      remove: [],
    };
    let txCodeList = [];
    // 整理新增附件
    if (!this.isEmpty(this.addSelectedRowList) && !this.isEmpty(this.attachmentInfo)) {
      this.addSelectedRowList.forEach((add) => {
        txCodeList.push(add.txCode);
      });
      this.attachmentInfo.forEach((file) => {
        dto.add.push({
          attachmentName: file.name,
          attachmentExtension: transferUtil.getFileExt(file.name),
          attachmentType: this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '成交單').val,
          txCode: txCodeList,
          file,
        });
      });
    }
    // 整理刪除附件
    this.deleteSelectedRowList.forEach((file) => {
      dto.remove.push(file.attachmentId);
    });
    // call API
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/common/saveAttachment`, 'attachment', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.addSelectedRowList = [];
        this.deleteSelectedRowList = [];
        this.attachmentInfo = [];
        // 重查整批新增附件頁籤
        this.searchTxCode(this.getDtoData());
        // 重查整批刪除附件頁籤
        this.searchAttachmentRelation(this.getDtoData());
      },
    );
  }

  /**
  * Event
  */
  // 關閉modal
  closeManageFileModal() {
    this.resetManageFile();
    this.modalManageFileShowSync = false;
    this.addIpkGrid.data = [];
    this.deleteIpkGrid.data = [];
  }

  // 清空
  resetManageFile() {
    this.addManageFileForm = {
      transactionDate: undefined, // 交易日
      invCategoryCode: undefined, // 市場別
      transactionType: undefined, // 交易別
      bondKeeping: [], // 債券保管
      txCode: '', // 交易編號
    };

    this.deleteManageFileForm = {
      transactionDate: undefined, // 交易日
      invCategoryCode: undefined, // 市場別
      transactionType: undefined, // 交易別
      bondKeeping: [], // 債券保管
      txCode: '', // 交易編號
    };

    this.attachmentInfo = [];
    this.addSelectedRowList = [];
    this.deleteSelectedRowList = [];
    this.activeKey = '0';

    // 清除checkbox勾選
    this.clearCheckbox('addIpkGrid');
    this.clearCheckbox('deleteIpkGrid');
  }

  // 點擊送出按鈕
  async submitManageFile() {
    // 驗證
    if (this.isEmpty(this.addSelectedRowList) && this.isEmpty(this.deleteSelectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

     // 整批新增驗證: 若未勾選交易編號，僅上傳檔案就送出 =>  彈窗提示[請勾選交易編號]
     if (this.isEmpty(this.addSelectedRowList) && !this.isEmpty(this.attachmentInfo)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.FILE_TX_CODE_REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    if (!this.isEmpty(this.addSelectedRowList)) {
      // 若有勾選交易編號，未上傳檔案就送出 => 彈窗提示[整批新增未上傳檔案，請確認]
      if (this.isEmpty(this.attachmentInfo)) {
        InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.FILE_ATTACHMENT_REQUIRED_VALIDATE_INFO?.message });
        return;
      }
      // 副檔名必須為PDF，若有非PDF的檔案以訊息卡控「附件格式須為PDF，請確認」
      for (let i = 0; i < this.attachmentInfo.length; i++) {
        if (transferUtil.getFileExt(this.attachmentInfo[i].name).toUpperCase() !== this.$cfEnum.fileExtensionEnum.PDF) {
          InfoModal.alertError({ confirm: false, content: this.$cfMessageEnum.FILE_EXTENSION_VALIDATE_INFO?.message.replace('{fileExtension}', 'PDF') });
          return;
        }
      }

      // 勾選的交易狀態是否為「已鎖定」，若有其他狀態則以訊息卡控「勾選了狀態不符的交易，請重新重新確認」
      let txCodeList = [];
      for (let i = 0; i < this.addSelectedRowList.length; i++) {
        // 組裝後端所需參數
        txCodeList.push(this.addSelectedRowList[i].txCode);
      }
      // 驗證
      let data = await this.validateBeforeSaveAttachment({ txCode: txCodeList });
      if (!data?.success) {
        InfoModal.alertError({ confirm: false, content: data?.message });
        return;
      }
    }
    InfoModal.alertInfo({
      confirm: true,
      content: this.$cfMessageEnum.MANAGE_FILE_SAVE_CONFIRM_INFO?.message,
      onCallback: () => {
        this.saveAttachment();
      },
    });
  }

  // 查詢按鈕_整批新增附件
  handleSearchAddFile() {
    // 必填欄位
    const rulesArr = Object.keys(this.formRules);
    // 只挑出 必填欄位
    const filterData = Object.keys(this.addManageFileForm)
    .filter((key) => rulesArr.includes(key))
    .reduce((res, key) => {
      res[key] = this.addManageFileForm[key];
      return res;
    }, {});

    // 驗證
    if (!this.validateSearch(filterData)) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    // 整理成後端格式
    let dto = this.getDtoData();
    // // call API
    this.searchTxCode(dto);
  }

  // 查詢按鈕_整批刪除附件
  handleSearchDeleteFile() {
    // 必填欄位
    const rulesArr = Object.keys(this.formRules);
    // 只挑出 必填欄位
    const filterData = Object.keys(this.deleteManageFileForm)
    .filter((key) => rulesArr.includes(key))
    .reduce((res, key) => {
      res[key] = this.deleteManageFileForm[key];
      return res;
    }, {});
    // 驗證
    if (!this.validateSearch(filterData)) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    // 整理成後端格式
    let dto = this.getDtoData();
    // call API
    this.searchAttachmentRelation(dto);
  }

  // 取得附件checkbox勾選項_整批新增附件
  onAddCheckboxChange(e) {
    this.addSelectedRowList = e.records;
  }

  // 取得附件checkbox勾選項_整批刪除附件
  onDeleteCheckboxChange(e) {
    this.deleteSelectedRowList = e.records;
  }

  // ----- 上傳物件 ----- //
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
      if (info.fileList.length > 1) {
        this.attachmentInfo = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.attachmentInfo = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.attachmentInfo.push(info.file);
    }
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.attachmentInfo = this.attachmentInfo.filter((el) => el.uid !== file.uid);
  }

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.formData.attachmentName) return;
    const fileId = item.formData.attachmentId;
    const fileName = item.formData.attachmentName.slice(0, item.formData.attachmentName.length - 4);
    const fileType = this.$cfEnum.fileExtensionEnum.PDF.toLowerCase();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 清除checkbox勾選
  clearCheckbox(type) {
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs[type])) {
      for (let i = 0; i < (this.$refs[type] as any).length; i++) {
        (this.$refs[type][i] as any).$refs.vxeGrid.clearCheckboxReserve();
        (this.$refs[type][i] as any).$refs.vxeGrid.clearCheckboxRow();
      }
    }
  }
}
