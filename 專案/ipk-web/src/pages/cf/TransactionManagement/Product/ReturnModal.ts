import {
  Vue, Component, Prop,
} from 'vue-property-decorator';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    CustomizationModal,
    IpkButton,
  },
})
export default class ReturnModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalReturnShow: boolean // modal開關

  @Prop()
	childrenTab: any; // 目前所在頁籤

	@Prop()
	buttonKey: any; // 按鈕權限對應key值
  /**
  * methods
  */

  // 退回修改
  handleReturnFront() {
    this.$emit('handleReturnFront');
  }

  // 退回解鎖
  handleReturnLock() {
    this.$emit('handleReturnLock');
  }

  // 取消
  closeReturnModal() {
    this.$emit('closeReturnModal');
  }
}
