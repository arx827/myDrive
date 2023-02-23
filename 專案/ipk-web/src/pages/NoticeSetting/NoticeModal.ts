import {
  Vue, Component, Prop,
} from 'vue-property-decorator';
import NoticeCard from '@/pages/NoticeSetting/NoticeCard.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    NoticeCard,
    IpkButton,
  },
})
export default class NoticeModal extends Vue {
  /**
   * props
   */
  @Prop()
  modalNoticeShow: boolean // modal開關

  @Prop()
  detail: any // 通知詳細資訊

  @Prop()
  showPreview: boolean // 是否顯示預覽按鈕

  /**
   * data
   */
  modalVisible = false // modal開關

  showPreviewModal = false // [預覽彈窗] modal開關

  detailPreview = {
    noticeSubject: '',
    noticeContent: '',
  } // 預覽

  /**
   * computed
   */
  // 是否顯示Modal
  get showModal() {
    return this.modalNoticeShow;
  }

  /**
   * hook
   */
  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.modalClose;
  }

  /**
   * methods
   */
  // 關閉modal
  modalClose() {
    this.$emit('modalClose');
  }

  // 開啟預覽彈窗
  openPreviewModal() {
    this.detailPreview = this.$noticeService.replaceSymbol(this.detail, 'noticeSymbolExample');
    this.showPreviewModal = true;
  }

  // 關閉預覽彈窗
  closePreviewModal() {
    this.showPreviewModal = false;
  }
}
