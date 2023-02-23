import { Vue, Component } from 'vue-property-decorator';
import InfoModal from '@/plugins/notification/infoModal';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';

@Component({
  components: {
    Breadcrumb,
    CustomizationModal,
  },
})
 export default class AlertMessage extends Vue {
   /**
    * data
    */
  rejectReason = ''; // [拒絕原因] 拒絕內容

  modalCustomizationShow = false; // [拒絕原因] modal開關

  reviewDto = {}; // 覆核(拒絕)資訊
   /**
    * hook
    */

   /**
    * methods
    */

  // 失敗訊息
  handleFail() {
    InfoModal.alertError({
      title: '放行失敗',
      confirm: false,
      content: '請確認後再試，謝謝。',
      customContent: null,
    });
  }

  // 成功訊息
  handleSuccess() {
    InfoModal.alertSuccess({
      title: '放行成功',
      confirm: false,
      content: '恭喜您放行成功，謝謝。',
      customContent: null,
    });
  }

  // 警告, 提示訊息
  handleInfo() {
    // 開啟拒絕彈窗
    this.modalCustomizationShow = true;
  }

  // 關閉拒絕原因彈窗
  closeCustomizationModal() {
    this.modalCustomizationShow = false;
  }
 }
