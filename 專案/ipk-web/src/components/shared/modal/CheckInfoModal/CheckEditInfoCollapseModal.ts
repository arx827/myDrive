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
export default class CheckEditInfoCollapseModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalCheckEditInfoShow: boolean // modal開關

  @Prop()
  checkInfoEditFormTitle: Array<any>; // 表單內容

  @Prop()
  beforeForm: object; // 修改前表單內容

  @Prop()
  afterForm: object; // 修改後表單內容

  @Prop({ default: false })
  isDisabled: boolean; // 是否鎖定放行/拒絕按鈕

  /**
  * data
  */
  checkInfoModalVisible = false // modal開關

  checkInfoBeforeForm; // 檢視修改前modal表單內容

  checkInfoAfterForm; // 檢視修改後modal表單內容

  activeCollapseKey = [] // 預設打開的縮合

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
    if (this.isEmpty(val)) {
      return;
    }
    this.checkInfoBeforeForm = val;
    this.transferDate(this.checkInfoEditFormTitle, this.checkInfoBeforeForm);
  }

  @Watch('afterForm', { immediate: true, deep: true })
  onChangeAfterForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.checkInfoAfterForm = val;
    this.transferDate(this.checkInfoEditFormTitle, this.checkInfoAfterForm);
  }

  @Watch('checkInfoEditFormTitle', { immediate: true, deep: true })
  onChangeCheckInfoEditFormTitle(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.checkInfoEditFormTitle.forEach((item, index) => {
      // 縮合預設展開項目
      this.activeCollapseKey.push(index);
    });
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
    this.activeCollapseKey = Array.from(Array(this.checkInfoEditFormTitle.length).keys()); // 縮合預設展開全部項目
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
  handleReject(e) {
    let reviewDto = {
      applySeq: [this.checkInfoAfterForm.rowData.applySeq],
      reviewStatus: this.$actEnum.reviewStatus.REJECT.val,
      data: this.checkInfoAfterForm,
    };

    this.$emit('handleReject', reviewDto);
  }

  // 放行
  handleReview(e) {
    let reviewDto = {
      applySeq: [this.checkInfoAfterForm.rowData.applySeq],
      reviewStatus: this.$actEnum.reviewStatus.APPROVAL.val,
      data: this.checkInfoAfterForm,
    };

    this.$emit('handleReview', reviewDto);
  }

  // 日期格式轉換
  transferDate(title, form) {
    Object.entries(title).forEach(([key, item], index) => {
      Object.entries(form[(item as any).value]).forEach(([formKey, formItem], formIndex) => {
        if (this.isEmpty((formItem as any).key)) {
          return;
        }
        // date 型別
        // if ((formItem as any).type === 'date') {
        //   (formItem as any).key = dateUtil.transform((formItem as any).key, false);
        // }
        // string型別，無時間格式
        if ((formItem as any).type === 'date') {
          (formItem as any).key = moment((formItem as any).key).format('YYYY/MM/DD');
        }
        // string型別，有時間格式
        if ((formItem as any).type === 'dateTime') {
          (formItem as any).key = moment((formItem as any).key).format('YYYY/MM/DD HH:mm:ss');
        }
      });
    });
  }
}
