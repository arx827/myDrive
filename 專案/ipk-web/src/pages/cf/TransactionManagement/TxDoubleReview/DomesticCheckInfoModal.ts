import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import CheckInfoForm from '@/components/shared/form/CheckInfoForm.vue';
import MultiCheckInfoForm from '@/components/shared/form/MultiCheckInfoForm.vue';

import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    PrintModal,
    CustomizationModal,
    UploadDragger,
    CheckInfoForm,
    MultiCheckInfoForm,
    IpkButton,
  },
})
export default class DomesticCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  checkInfoFormTitle: any; // 表單標題

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

  attachment = []; // 已儲存後端的上傳資料

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
    if (!this.isEmpty(this.checkInfoFormTitle)) {
      Object.entries(this.checkInfoFormTitle).forEach(([key, item], index) => {
        Object.entries(this.ssi[(item as any).value]).forEach(([formKey, formItem], formIndex) => {
          if (!this.isEmpty((formItem as any).key)) {
            (formItem as any).key = undefined;
          }
        });
      });
    }

    // 上傳的附件
    this.attachment = [];
  }
}
