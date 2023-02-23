import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class PendingAddAndEditModal extends Vue {
  @Action('setLoading') setLoading;
  /**
  * props
  */

  @Prop()
  modalAddInfoShow: boolean // modal開關

  @Prop()
  form: any; // 傳入資訊

  @Prop()
  isDisabled: boolean // 判斷是否要鎖定

  @Prop({ default: '1' })
  activeKey: any; // 指定指向哪一個頁簽

  /**
  * data
  */
  modalVisible = false // modal開關

  isDefault = false;

  /**
  * watch
  */
  @Watch('modalAddInfoShow')
  onChange(val) {
    this.modalVisible = val;
  }

  /**
  * methods
  */
  // 單筆放行
  handleReview(e: any) {
    let reviewDto = {
      applySeq: [this.form.applySeq.key],
      reviewStatus: this.$cfEnum.reviewStatus.APPROVAL.val,
      data: this.form,
    };
    this.$emit('handleReview', reviewDto);
  }

  // 單筆拒絕
  handleReject(e: any) {
    let reviewDto = {
      applySeq: [this.form.applySeq.key],
      reviewStatus: this.$cfEnum.reviewStatus.REJECT.val,
      data: this.form,
    };
    this.$emit('handleReject', reviewDto);
  }

  // 關閉新增檢視彈窗
  closeCheckInfoModal() {
    this.$emit('closeCheckInfoModal');
  }
}
