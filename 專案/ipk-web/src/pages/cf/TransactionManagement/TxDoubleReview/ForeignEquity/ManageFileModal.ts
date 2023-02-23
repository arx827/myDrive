import {
  Vue, Component, Prop, Watch,
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

import { TxCodeArrayDto } from '@fubonlife/ipk-api-axios-sdk';

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
  @Prop()
  modalManageFileShow: boolean // modal開關

  /**
  * data
  */
  fileModalVisible = false; // modal開關

  activeKey = '0'; // 被選取的頁籤(預設首頁)

  tabList = [ // 頁籤資訊
    { label: '整批新增附件', key: '0' },
    { label: '整批刪除附件', key: '1' },
  ]

  addManageFileForm = {
    transactionDate: undefined, // 交易日
    isAsia: undefined, // 市場別
    hid: undefined, // 階層編號
  }

  deleteManageFileForm = {
    transactionDate: undefined, // 交易日
    isAsia: undefined, // 市場別
    hid: undefined, // 階層編號
  }

  formRules: { [key: string]: ValidationRule[] } = { // 表單驗證
    transactionDate: [
      {
        required: true,
        message: '請輸入日期',
        trigger: 'change',
      },
    ],
    isAsia: [
      {
        required: true,
        message: '請選擇',
        trigger: 'blur',
      },
    ],
    hid: [
      {
        required: true,
        message: '請選擇',
        trigger: 'blur',
      },
    ],
  };

  isAsiaOption = []; // 市場別下拉

  hierarchyDescOption = []; // 交易階層下拉

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
  * watch
  */
  @Watch('modalManageFileShow')
  onChange(val) {
    this.fileModalVisible = val;
  }

  /**
  * hook
  */
  created() {
    // 下拉選單
    this.isAsiaOption = this.$cfEnum.isAsiaOption;
    this.hierarchyDescOption = this.$cfEnum.hierarchyDescOption;
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

  // 清空
  resetManageFile() {
    let manageFileForm = {
      transactionDate: moment(new Date()),
      // 預設選第一個
      isAsia: !this.isEmpty(this.isAsiaOption) ? this.isAsiaOption[0].value : undefined,
      hid: !this.isEmpty(this.hierarchyDescOption) ? this.hierarchyDescOption[0].value : undefined,
    };
    this.addManageFileForm = { ...manageFileForm };
    this.deleteManageFileForm = { ...manageFileForm };
    this.addSelectedRowList = [];
    this.deleteSelectedRowList = [];
    this.attachmentInfo = [];
    this.activeKey = '0';

    // 清除checkbox勾選
    this.clearCheckbox('addIpkGrid');
    this.clearCheckbox('deleteIpkGrid');
  }

  // 關閉modal
  closeManageFileModal() {
    this.resetManageFile();
    this.addIpkGrid.data = [];
    this.deleteIpkGrid.data = [];
    this.$emit('closeManageFileModal');
  }

  // 取得新增附件checkbox勾選項
  onAddCheckboxChange(e) {
    this.addSelectedRowList = e.records;
  }

  // 取得刪除附件checkbox勾選項
  onDeleteCheckboxChange(e) {
    this.deleteSelectedRowList = e.records;
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

  // 點擊送出按鈕
  async submitManageFile() {
    // 驗證
    if (this.isEmpty(this.addSelectedRowList) && this.isEmpty(this.deleteSelectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    // 整批新增驗證: 若未勾選交易編號，僅上傳檔案就送出 =>  彈窗提示[請勾選交易編號]
    if (this.isEmpty(this.addSelectedRowList) && !this.isEmpty(this.attachmentInfo)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    if (!this.isEmpty(this.addSelectedRowList)) {
      // 若有勾選交易編號，未上傳檔案就送出 => 彈窗提示[整批新增未上傳檔案，請確認]
      if (this.isEmpty(this.attachmentInfo)) {
        InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.FILE_ATTACHMENT_REQUIRED_VALIDATE_INFO?.message });
        return;
      }
      // 驗證: 副檔名必須為PDF，若有非PDF的檔案以訊息卡控「附件格式須為PDF，請確認」
      if (!this.isEmpty(this.attachmentInfo)) {
        for (let i = 0; i < this.attachmentInfo.length; i++) {
          if (transferUtil.getFileExt(this.attachmentInfo[i].name).toUpperCase() !== this.$cfEnum.fileExtensionEnum.PDF) {
            InfoModal.alertError({ confirm: false, content: this.$cfMessageEnum.FILE_EXTENSION_VALIDATE_INFO?.message.replace('{fileExtension}', 'PDF') });
            return;
          }
        }
      }

      // 勾選的交易狀態是否為「已初核」，若有其他狀態則以訊息卡控「勾選了狀態不符的交易，請重新重新確認」
      let txCode = [];
      for (let i = 0; i < this.addSelectedRowList.length; i++) {
        // // 檢查勾選的交易狀態是否為「已鎖定」
        // if (this.addSelectedRowList[i].cfStatus !== this.$cfEnum.cfStatusConstant.LOCK.val) {
        //   InfoModal.alertInfo({ confirm: false, content: '勾選了狀態不符的交易，請重新確認' });
        //   return;
        // }
        // 組裝後端所需參數
        txCode.push(this.addSelectedRowList[i].txCode);
      }
      // 驗證
      let data = await this.validateBeforeSaveAttachment({ txCode });
      if (!data.success) {
        InfoModal.alertError({ confirm: false, content: data.message });
        return;
      }
    }
    // 提醒
    InfoModal.alertInfo({
      confirm: true,
      content: this.$cfMessageEnum.MANAGE_FILE_SAVE_CONFIRM_INFO?.message,
      onCallback: () => {
        this.submitSaveAttachment();
      },
    });
  }

  // 驗證
  validateBeforeSaveAttachment(dto: TxCodeArrayDto): any {
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

  // 儲存附件
  submitSaveAttachment() {
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
    if (!this.isEmpty(this.deleteSelectedRowList)) {
      this.deleteSelectedRowList.forEach((file) => {
        dto.remove.push(file.attachmentId);
      });
    }
    // call API
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/common/saveAttachment`, 'attachment', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.addSelectedRowList = [];
        this.deleteSelectedRowList = [];
        this.attachmentInfo = [];
        // 重查整批新增附件頁籤
        this.searchTxCode({
          isAsia: this.addManageFileForm.isAsia,
          tradeDate: moment(this.addManageFileForm.transactionDate).format('YYYYMMDD'),
          hid: this.addManageFileForm.hid,
        });
        // 重查整批刪除附件頁籤
        this.searchAttachmentRelation({
          isAsia: this.deleteManageFileForm.isAsia,
          tradeDate: moment(this.deleteManageFileForm.transactionDate).format('YYYYMMDD'),
          hid: this.addManageFileForm.hid,
        });
      },
    );
  }

  // 點擊新增附件查詢按鈕
  handleSearchAddFile() {
    // 驗證
    if (!this.validateSearch(this.addManageFileForm)) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    // 整理成後端格式
    let dto = {
      isAsia: this.addManageFileForm.isAsia,
      tradeDate: moment(this.addManageFileForm.transactionDate).format('YYYYMMDD'),
      hid: this.addManageFileForm.hid,
    };
    // call API
    this.searchTxCode(dto);
  }

  // 查詢交易編號狀態
  searchTxCode(dto) {
    this.setLoading(true);
    this.$txDoubleReview.foreignEquitySearchTxCodeUsingPOST(dto)
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

  // 點擊刪除附件查詢按鈕
  handleSearchDeleteFile() {
    // 驗證
    if (!this.validateSearch(this.deleteManageFileForm)) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    // 整理成後端格式
    let dto = {
      isAsia: this.deleteManageFileForm.isAsia,
      tradeDate: moment(this.deleteManageFileForm.transactionDate).format('YYYYMMDD'),
      hid: this.deleteManageFileForm.hid,
    };
    // call API
    this.searchAttachmentRelation(dto);
  }

  // 查詢附件關聯
  searchAttachmentRelation(dto) {
    this.setLoading(true);
    this.$txDoubleReview.searchAttachmentRelationUsingPOST(dto)
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

  // 驗證查詢
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

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.formData.attachmentName) return;
    const fileId = item.formData.attachmentId;
    const fileName = item.formData.attachmentName.slice(0, item.formData.attachmentName.length - 4);
    const fileType = this.$cfEnum.fileExtensionEnum.PDF.toLowerCase();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.attachmentInfo = this.attachmentInfo.filter((el) => el.uid !== file.uid);
  }

  // 下拉選單模糊查詢
  filterOption(input, option) {
    return option.componentOptions.children[0].text.indexOf(input) >= 0;
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
