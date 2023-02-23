import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { IpkVxeTableModel } from '../../data-grid/IpkVxeTableModels';

@Component({
  components: {
    IpkButton,
  },
})
export default class CheckInfoModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  form: object; // 表單內容

  @Prop()
  isPending: boolean; // 是否從待放行清單點擊檢視

  @Prop()
  codeTableShow: boolean; // 是否顯示表格

  @Prop({ default: false })
  isDisabled: boolean; // 判斷是否要鎖定

  @Prop()
  ipkGrid: IpkVxeTableModel;

  /**
  * data
  */
  checkInfoModalVisible = false // modal開關

  checkInfoForm; // 檢視modal表單內容

  /**
  * watch
  */
  @Watch('modalCheckInfoShow', { immediate: true, deep: true })
  onChange(val) {
    this.checkInfoModalVisible = val;
  }

  @Watch('form', { immediate: true, deep: true })
  onChangeForm(val) {
    this.checkInfoForm = val;

    // 日期格式轉換
    Object.entries(this.checkInfoForm).forEach(([key, item], index) => {
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

  /**
  * hook
  */
  created() {
    this.checkInfoForm = { ...this.form };
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
    this.$emit('closeCheckInfoModal');
  }

  // 拒絕
  handleReject() {
    let reviewDto = {
      applySeq: [this.checkInfoForm.applySeq.key],
      reviewStatus: this.$actEnum.reviewStatus.REJECT.val,
      data: this.checkInfoForm,
    };
    this.$emit('handleReject', reviewDto);
  }

  // 放行
  handleReview() {
    let reviewDto = {
      applySeq: [this.checkInfoForm.applySeq.key],
      reviewStatus: this.$actEnum.reviewStatus.APPROVAL.val,
      data: this.checkInfoForm,
    };
    this.$emit('handleReview', reviewDto);
  }
}
