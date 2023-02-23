import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import InfoModal from '@/plugins/notification/infoModal';

import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkVxeTable,
    UploadDragger,
    IpkButton,
  },
})
export default class DBManageFileModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalManageFileShow: boolean // modal開關

  @Prop()
  apiController: string // API controller 名稱

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
    tradeDate: undefined, // 交易日
    counterpartyId: undefined, // 交易對手
    invCategoryCode: undefined, // 資產類別
    asType: undefined, // 資產區隔
    attachmentStatus: undefined, // 附件狀態
  }

  deleteManageFileForm = {
    tradeDate: undefined, // 交易日
    counterpartyId: undefined, // 交易對手
    invCategoryCode: undefined, // 資產類別
    asType: undefined, // 資產區隔
    attachmentStatus: undefined, // 附件狀態
    attachmentType: undefined, // 附件類型
  }

  formRules: { [key: string]: ValidationRule[] } = { // 表單驗證
    tradeDate: [
      {
        required: true,
        message: '請輸入日期',
        trigger: 'change',
      },
    ],
  };

  invCategoryCodeOption = []; // 資產類別下拉選單

  asTypeOption = []; //  資產區隔下拉選單

  attachmentStatusOption = []; // 附件狀態下拉選單

  attachmentTypeOption = []; // 附件狀態下拉選單

  attachmentType = ''; // 附件上傳類型，整批新增上傳radio選頂的值

  /** 整批新增附件 */
  addSelectedRowList = []; // 已選取的整批新增附件交易編號

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
      {
        title: '交易確認狀態',
        field: 'cfStatus',
        width: 130,
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$cfEnum.getObject('cfStatusEnum', row.cfStatus).color,
                text: this.$cfEnum.getObject('cfStatusEnum', row.cfStatus).key,
              },
            }),
          ],
        },
      },
      {
        title: '附件狀態',
        field: 'attachmentStatus',
        width: 100,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('attachmentStatusOption', data.cellValue);
        },
      },
      {
        title: '簽核權限',
        field: 'apvlLevel',
        width: 120,
        formatter: (data) => {
          if (data.cellValue) {
            return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
          } return '';
        },
      },
    ],
  }

  attachmentInfo = []; // 上傳的資料

  fileUploadData: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.pdf, .tif', // 可上傳的檔案類型
    acceptType: ['application/pdf', 'image/tiff'],
    showRemoveIcon: true,
    showDownload: true,
  }

  /** 整批刪除附件 */
  deleteSelectedRowList = []; // 已選取的整批刪除附件交易編號

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
  async created() {
    // 下拉選單
    this.invCategoryCodeOption = this.$cfEnum.invCategoryCodeOption;
    this.asTypeOption = this.$cfEnum.asTypeOption;
    this.attachmentStatusOption = this.$cfEnum.attachmentStatusOption;
    this.attachmentTypeOption = this.$cfEnum.attachmentTypeOption;
    // 設定初始資料
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
      tradeDate: moment(new Date()),
      counterpartyId: undefined,
      invCategoryCode: !this.isEmpty(this.$cfEnum.invCategoryCodeOption) ? this.$cfEnum.invCategoryCodeOption.find((el) => el.label === '國債').value : undefined,
      asType: !this.isEmpty(this.$cfEnum.asTypeOption) ? this.$cfEnum.asTypeOption.find((el) => el.label === 'NONPAR').value : undefined,
      attachmentStatus: undefined,
    };
    this.addManageFileForm = { ...manageFileForm };
    this.deleteManageFileForm = { ...manageFileForm, attachmentType: undefined };
    this.addSelectedRowList = [];
    this.deleteSelectedRowList = [];
    this.attachmentInfo = [];
    this.activeKey = '0';
    this.attachmentType = this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '確認書').val; // 附件上傳類型，預設交易確認文件

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

  // 點擊新增附件查詢按鈕
  handleSearchAddFile() {
    // 驗證
    if (this.isEmpty(this.addManageFileForm.tradeDate)) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    // 整理成後端格式
    let dto = {
      tradeDate: moment(this.addManageFileForm.tradeDate).format('YYYYMMDD'),
      counterpartyId: this.addManageFileForm.counterpartyId,
      invCategoryCode: this.addManageFileForm.invCategoryCode,
      asType: this.addManageFileForm.asType,
      attachmentStatus: this.addManageFileForm.attachmentStatus,
    };
    // call API
    this.searchTxCodeStatus(dto);
  }

  // 查詢交易編號狀態
  searchTxCodeStatus(dto) {
    this.setLoading(true);
    this[`$${this.apiController}`].searchTxCodeStatusUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;
      const content = res.data.content;
      this.addIpkGrid.data = [];
      this.attachmentInfo = [];

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
    if (this.isEmpty(this.deleteManageFileForm.tradeDate)) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    // 整理成後端格式
    let dto = {
      tradeDate: moment(this.deleteManageFileForm.tradeDate).format('YYYYMMDD'),
      counterpartyId: this.deleteManageFileForm.counterpartyId,
      invCategoryCode: this.deleteManageFileForm.invCategoryCode,
      asType: this.deleteManageFileForm.asType,
      attachmentStatus: this.deleteManageFileForm.attachmentStatus,
      attachmentType: this.deleteManageFileForm.attachmentType,
    };
    // call API
    this.searchAttachmentRelation(dto);
  }

  // 查詢附件關聯
  searchAttachmentRelation(dto) {
    this.setLoading(true);
    // this.$foreignEquityApi.searchAttachmentRelationUsingPOST(dto)
    this[`$${this.apiController}`].searchAttachmentRelationUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;
      const content = res.data.content;
      this.deleteIpkGrid.data = [];

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
      // 副檔名必須為PDF，若有非PDF、TIF的檔案以訊息卡控「附件格式須為PDF或TIF，請確認」
      for (let i = 0; i < this.attachmentInfo.length; i++) {
        if ((transferUtil.getFileExt(this.attachmentInfo[i].name).toUpperCase() !== this.$cfEnum.fileExtensionEnum.PDF)
        || (transferUtil.getFileExt(this.attachmentInfo[i].name).toUpperCase() !== this.$cfEnum.fileExtensionEnum.TIF)) {
          InfoModal.alertError({ confirm: false, content: this.$cfMessageEnum.FILE_EXTENSION_VALIDATE_INFO?.message.replace('{fileExtension}', 'PDF或TIF') });
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
      let dto = { txCode: txCodeList, attachmentType: this.attachmentType };
      let data = await this.validateBeforeSaveAttachment(dto);
      if (!data.success) {
        InfoModal.alertError({ confirm: false, content: data.message });
        return;
      }
    }
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.SUBMIT_CONFIRM_INFO?.message,
      onCallback: () => {
        this.saveAttachment();
      },
    });
  }

  // 驗證
  validateBeforeSaveAttachment(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this[`$${this.apiController}`].checkBeforeSaveAttachmentUsingPOST(dto)
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
  saveAttachment() {
    // 整理成後端格式
    let attachment = {
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
        attachment.add.push({
          attachmentName: file.name,
          attachmentExtension: transferUtil.getFileExt(file.name),
          attachmentType: this.attachmentType,
          txCode: txCodeList,
          file,
        });
      });
    }
    // 整理刪除附件
    if (!this.isEmpty(this.deleteSelectedRowList)) {
      this.deleteSelectedRowList.forEach((file) => {
        attachment.remove.push(file.attachmentId);
      });
    }

    // call API
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/common/saveAttachment`, 'attachment', attachment, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.addSelectedRowList = [];
        this.deleteSelectedRowList = [];
        this.attachmentInfo = [];
        this.attachmentType = this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '確認書').val; // 附件上傳類型，預設交易確認文件
        // 重查整批新增附件頁籤
        this.searchTxCodeStatus({
          counterpartyId: this.addManageFileForm.counterpartyId,
          tradeDate: moment(this.addManageFileForm.tradeDate).format('YYYYMMDD'),
          invCategoryCode: this.addManageFileForm.invCategoryCode,
          asType: this.addManageFileForm.asType,
          attachmentStatus: this.addManageFileForm.attachmentStatus,

        });
        // 重查整批刪除附件頁籤
        this.searchAttachmentRelation({
          counterpartyId: this.deleteManageFileForm.counterpartyId,
          tradeDate: moment(this.deleteManageFileForm.tradeDate).format('YYYYMMDD'),
          invCategoryCode: this.deleteManageFileForm.invCategoryCode,
          asType: this.deleteManageFileForm.asType,
          attachmentStatus: this.deleteManageFileForm.attachmentStatus,
          attachmentType: this.deleteManageFileForm.attachmentType,
        });
      },
    );
  }

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.formData.attachmentName) return;
    const fileId = item.formData.attachmentId;
    const fileName = item.formData.attachmentName.slice(0, item.formData.attachmentName.length - 4);
    const fileType = item.formData.attachmentName.split('.').pop();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.attachmentInfo = this.attachmentInfo.filter((el) => el.uid !== file.uid);
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
