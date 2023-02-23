import {
 Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class CustomizationModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalCustomizationShow: boolean // modal開關

  @Prop()
  content?: string | string[]; // 內文

  @Prop()
	title?: string; // 標題

  @Prop()
	confirm?: boolean; // 只有確認按鈕

  @Prop()
	width?: string; // 寬度

  @Prop({ default: '取消' })
	cancelText?: string; // 取消文字

  @Prop({ default: '確認' })
	confirmText?: string; // 確認文字

  @Prop({ default: 'info' })
	iconClassName?: string; // 提示訊息icon樣式

  /**
  * data
  */
  modalVisible = false // modal開關

  iconType = undefined; // icon類型

  iconClass = undefined; // icon類型樣式顏色

  /**
  * watch
  */
  @Watch('modalCustomizationShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('iconClassName')
  onIconClassNameChange(val) {
    this.getIconClass(val);
  }

  /**
  * hook
  */
  created() {
    this.getIconClass(this.iconClassName);
  }

  /**
  * methods
  */
  // 關閉modal
  closeCustomizationModal() {
    this.$emit('closeCustomizationModal');
  }

  // 點擊確認
  handleSubmit() {
    this.$emit('handleSubmit');
  }

  // icon樣式
  getIconClass(val) {
    switch (val) {
      // 成功
      case 'success':
        this.iconType = 'check-circle';
        this.iconClass = 'modal__icon--success';
        break;
      // 錯誤
      case 'error':
        this.iconType = 'close-circle';
        this.iconClass = 'modal__icon--error';
        break;
      // 提醒
      case 'info':
        this.iconType = 'exclamation-circle';
        this.iconClass = 'modal__icon--error';
        break;
    }
  }
 }
