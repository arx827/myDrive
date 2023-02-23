import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class CheckEditInfoModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalCheckEditInfoShow: boolean // modal開關

  @Prop()
  beforeForm: object; // 修改前表單內容

  @Prop()
  afterForm: object; // 修改後表單內容

  @Prop({ default: false })
  isDisabled: boolean; // 判斷是否要鎖定

  /**
  * data
  */
  checkInfoModalVisible = false // modal開關

  checkInfoBeforeForm; // 檢視修改前modal表單內容

  checkInfoAfterForm; // 檢視修改後modal表單內容

  /**
  * watch
  */
  @Watch('modalCheckEditInfoShow')
  onChange(val) {
    this.checkInfoModalVisible = val;
    if (!this.checkInfoModalVisible) {
      this.reset();
    }
  }

  @Watch('beforeForm', { immediate: true, deep: true })
  onChangeBeforeForm(val) {
    this.checkInfoBeforeForm = val;
    this.transferDate(this.checkInfoBeforeForm);
  }

  @Watch('afterForm', { immediate: true, deep: true })
  onChangeAfterForm(val) {
    this.checkInfoAfterForm = val;
    this.transferDate(this.checkInfoAfterForm);
  }

  /**
  * hook
  */
  created() {
    this.reset();
  }

  reset() {
    this.checkInfoBeforeForm = { ...this.beforeForm };
    this.checkInfoAfterForm = { ...this.afterForm };
  }

  /**
  * methods
  */
 // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉modal
  closeCheckEditInfoModal() {
    this.$emit('closeCheckEditInfoModal');
  }

  // 拒絕
  handleReject() {
    let reviewDto = {
      applySeq: [this.checkInfoAfterForm.applySeq.key],
      reviewStatus: this.$actEnum.reviewStatus.REJECT.val,
      data: this.checkInfoAfterForm,
    };
    this.$emit('handleReject', reviewDto);
  }

  // 放行
  handleReview() {
    let reviewDto = {
      applySeq: [this.checkInfoAfterForm.applySeq.key],
      reviewStatus: this.$actEnum.reviewStatus.APPROVAL.val,
      data: this.checkInfoAfterForm,
    };
    this.$emit('handleReview', reviewDto);
  }

  // 日期格式轉換
  transferDate(form) {
    Object.entries(form).forEach(([key, item], index) => {
      if (this.isEmpty((item as any).key)) {
        return;
      }
      // string型別，無時間格式
      if ((item as any).type === 'date') {
        (item as any).key = moment((item as any).key).format('YYYY/MM/DD');
      }
      // string型別，有時間格式
      if ((item as any).type === 'dateTime') {
        (item as any).key = moment((item as any).key).format('YYYY/MM/DD HH:mm:ss');
      }
    });
  }
}
