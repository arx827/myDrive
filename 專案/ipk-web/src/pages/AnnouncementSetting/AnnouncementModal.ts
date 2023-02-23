import validateUtil from '@/plugins/util/validateUtil';
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import transferUtil from '@/plugins/util/transferUtil';
import exportUtil from '@/plugins/util/exportUtil';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
   IpkButton,
  },
})
export default class AnnouncementModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalAnnouncementShow: boolean // modal開關

  @Prop()
  detail: any // 公告詳細資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  announcementData = {
    title: { label: '標題', value: null },
    content: { label: '內文', value: null },
    attachment: { label: '附件', value: null },
    announcer: { label: '發佈者', value: null },
    publishDate: { label: '發佈日', value: null },
    effectDate: { label: '生效日', value: null },
    expiryDate: { label: '失效日', value: null },
    documentNum: { label: '文號', value: null },
    releaseDepartment: { label: '發佈單位', value: null },
    clickTotal: { label: '點閱次數', value: null },
  }

  /**
   * computed
   */
  // 是否顯示Modal
  get showModal() {
    return this.modalAnnouncementShow;
  }

  /**
  * watch
  */
  @Watch('modalAnnouncementShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('detail', { immediate: true, deep: true })
  onDetailChange(newDetail) {
    Object.entries(newDetail).forEach(([key, value], index) => {
      if (!validateUtil.isEmpty(this.announcementData[key])) {
        this.announcementData[key].value = value;
      }
    });
  }

  /**
  * hook
  */
  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAnnouncementModal;
  }

  /**
  * methods
  */
  // 關閉modal
  closeAnnouncementModal() {
    this.$emit('closeAnnouncementModal');
  }

  // 附件下載
  downloadAttachment(attachment) {
    this.setLoading(true);
    const fileFullName = attachment.attachmentName;
    const extDotIndex = fileFullName.lastIndexOf('.');
    const fileName = fileFullName.substring(0, extDotIndex);
    const ext = transferUtil.getFileExt(fileFullName);
    this.$announcementApi.downloadAttachmentUsingGET(this.detail.id, attachment.attachmentId, { responseType: 'blob' })
      .then((res) => {
        exportUtil.dealDownloadData(res.data, fileName, ext);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }
}
