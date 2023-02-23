import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import transferUtil from '@/plugins/util/transferUtil';

import CheckInfoForm from '@/components/shared/form/CheckInfoForm.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    PrintModal,
    CustomizationModal,
    UploadDragger,
    CheckInfoForm,
    IpkButton,
  },
})
export default class ForeignCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  mainForm: object // 前台成交資訊

  @Prop()
  otherForm: object // 其他成交資訊

  @Prop()
  ssiForm: object // 收付款資訊

  @Prop()
  attachmentInfo: Array<any> // 上傳附件

  @Prop()
  childrenTab: string // 目前所在頁籤

  /**
  * data
  */
  activeKey = this.$authService.mainTab.key; // 被選取的頁籤(預設前台成交資訊)

  checkInfoModalVisible = false // modal開關

  /** 前台成交資訊 */
  main: any = {};

  /** 其他成交資訊 */
  other: any = {};

  /** 收付款資訊 */
  ssi: any = {};

  /** 上傳附件 */
  fileUploadData: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.pdf', // 可上傳的檔案類型
    acceptType: ['application/pdf'],
    uploadDisabled: false,
    showRemoveIcon: true,
    showDownload: true,
  }

  attachment = []; // 已儲存後端的上傳資料

  deleteUploadList = []; // 刪除後端回傳的上傳資料

  /**
   * computed
   */
  // 交易確認狀態=「已確認」才顯示上傳區，非已確認僅顯示附件
  get isUploadShow() {
    let show = false;
    if (!this.isEmpty(this.main.cfStatus) && this.main.cfStatus.key === this.$cfEnum.cfStatusEnum.find((el) => el.key === '已確認').val) {
      show = true;
    }
    return show;
  }

  /**
  * watch
  */
  @Watch('modalCheckInfoShow')
  onChange(val) {
    this.checkInfoModalVisible = val;
  }

  @Watch('mainForm', { immediate: true, deep: true })
  onChangeMainForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.main = val;
  }

  @Watch('otherForm', { immediate: true, deep: true })
  onChangeOtherForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.other = val;
  }

  @Watch('ssiForm', { immediate: true, deep: true })
  onChangeSsiForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.ssi = val;
  }

  @Watch('attachmentInfo', { immediate: true, deep: true })
  onChangeAttachmentInfo(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.attachment = val;
  }

  /**
  * hook
  */
  created() {
    // 各頁籤資訊
    this.main = transferUtil.deepCopyData(this.mainForm);
    this.other = transferUtil.deepCopyData(this.otherForm);
    this.ssi = transferUtil.deepCopyData(this.ssiForm);
    this.attachment = [...this.attachmentInfo];
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉modal
  closeCheckInfoModal() {
    this.resetForm();
    this.$emit('closeCheckInfoModal');
  }

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.attachmentName) return;
    const fileId = item.attachmentId;
    const fileName = item.attachmentName.slice(0, item.attachmentName.length - 4);
    const fileType = this.$cfEnum.fileExtensionEnum.PDF.toLowerCase();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 退回
  handleReturn() {
    let reviewDto = {
      txCode: [this.main.txCode.key],
      cfStatus: this.$cfEnum.txDoubleReviewStatus.RETURN.val,
    };
    this.$emit('handleReturn', reviewDto);
  }

  // 放行
  handleReview() {
    let reviewDto = {
      txCode: [this.main.txCode.key],
      cfStatus: this.$cfEnum.txDoubleReviewStatus.APPROVAL.val,
    };
    this.$emit('handleReview', reviewDto);
  }

  // 清空各個form的值
  resetForm() {
    this.activeKey = this.$authService.mainTab.key;
    // 前台成交資訊
    if (!this.isEmpty(this.main)) {
      Object.entries(this.main).forEach(([key, item], index) => {
        if (!this.isEmpty(this.main[key])) {
          this.main[key].key = undefined;
        }
      });
    }
    // 其他成交資訊
    if (!this.isEmpty(this.other)) {
      Object.entries(this.other).forEach(([key, item], index) => {
        if (!this.isEmpty(this.other[key])) {
          this.other[key].key = undefined;
        }
      });
    }
    // 收付款資訊
    if (!this.isEmpty(this.ssi)) {
      Object.entries(this.ssi).forEach(([key, item], index) => {
        if (!this.isEmpty(this.ssi[key])) {
          this.ssi[key].key = undefined;
        }
      });
    }

    // 上傳的附件
    this.attachment = [];
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.attachment = this.attachment.filter((el) => el.uid !== file.uid);
    // 有attachmentId的表示為後端傳的，push進去
    if (file.attachmentId) {
      this.deleteUploadList.push(file.attachmentId);
    }
  }

  // 點擊儲存按鈕
  handleSaveAttachment() {
    let txCode = [this.main.txCode.key];
    // 驗證: 副檔名必須為PDF，若有非PDF的檔案以訊息卡控「附件格式須為PDF，請確認」
    if (!this.isEmpty(this.attachment)) {
      for (let i = 0; i < this.attachment.length; i++) {
        if (transferUtil.getFileExt(this.attachment[i].name).toUpperCase() !== this.$cfEnum.fileExtensionEnum.PDF) {
          InfoModal.alertError({ confirm: false, content: this.$cfMessageEnum.FILE_EXTENSION_VALIDATE_INFO?.message.replace('{fileExtension}', 'PDF') });
          return;
        }
      }
    }
    // 驗證
    this.validateBeforeSaveAttachment(txCode);
  }

  // 驗證
  validateBeforeSaveAttachment(txCode) {
    this.setLoading(true);
    this.$txDoubleReview.checkBeforeSaveAttachmentUsingPOST({ txCode })
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      // 提醒
      InfoModal.alertInfo({
        confirm: true,
        content: this.$cfMessageEnum.MANAGE_FILE_SAVE_CONFIRM_INFO?.message,
        onCallback: () => {
          this.submitSaveAttachment();
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

  // 儲存
  submitSaveAttachment() {
    // 整理儲存後端所需格式
    let txCode = this.main.txCode ? this.main.txCode.key : undefined;
    let dto = {
      add: [],
      remove: this.deleteUploadList,
    };
    this.attachment.forEach((file) => {
      // 沒有attachmentId的push進去
      if (!file.attachmentId) {
        dto.add.push({
          attachmentName: file.name,
          attachmentExtension: transferUtil.getFileExt(file.name),
          attachmentType: this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '成交單').val,
          txCode: [txCode],
          // file,
        });
      }
    });
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/common/saveAttachment`, 'attachment', dto, 'files', this.attachment,
      // 成功後要執行的流程 successCallBack
      () => {
        this.attachment = [];
        this.deleteUploadList = [];
        // 重查成交資訊明細
        this.$emit('searchTxDetail', txCode);
        // 重查國外股票資訊，要依進階查詢篩選條件重查
        this.$emit('handleSearch');
      },
    );
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
        this.attachment = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.attachment = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.attachment.push(info.file);
    }
  }
}
