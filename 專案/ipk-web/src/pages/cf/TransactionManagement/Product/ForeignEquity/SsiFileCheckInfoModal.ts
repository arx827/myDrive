import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    UploadDragger,
    IpkButton,
  },
})
export default class SsiFileCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalSsiCheckInfoShow: boolean // modal開關

  @Prop()
  formData: any // 檢視彈窗資訊

  /**
  * data
  */
  activeKey = this.$authService.attachmentTab.key;

  checkInfoModalVisible = false; // modal開關

  attachment = []; // 附件

  /**
  * watch
  */
  @Watch('modalSsiCheckInfoShow')
  onChange(val) {
    this.checkInfoModalVisible = val;

    // 初始化資訊
    if (this.checkInfoModalVisible) {
      this.searchCounterpartyAttachment();
    }
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉modal
  closeSsiCheckInfoModal() {
    // 初始化
    this.attachment = [];
    // 關閉
    this.$emit('closeSsiCheckInfoModal');
  }

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    const fileId = item.attachmentId;
    const fileName = item.attachmentName;
    const fileType = item.attachmentType;
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 查詢交易對手附件
  searchCounterpartyAttachment() {
    // 整理成後端格式
    let dto = {
      counterpartyId: this.formData.main ? this.formData.main.counterpartyId : undefined,
      currency: this.formData.main ? this.formData.main.currency : undefined,
      productId: this.formData.main ? this.formData.main.productId : undefined,
      custodian: this.formData.main ? this.formData.main.safekeepingSsi.split('/')[0] : undefined,
      psetCode: this.formData.ssi ? this.formData.ssi.psetCode : undefined,
    };

    // call API
    this.setLoading(true);
    this.$foreignEquityApi.searchCounterpartyAttachmentUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      this.attachment = content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    }).finally(() => {
      this.setLoading(false);
    });
  }
}
