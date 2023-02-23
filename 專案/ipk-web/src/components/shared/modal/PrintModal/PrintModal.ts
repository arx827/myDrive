import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class PrintModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalPrintShow: boolean // modal開關

  @Prop()
  fileCodeOption: Array<any> // 下拉選單

  @Prop()
  defaultVal: any // 預設值

  @Prop()
	childrenTab: any; // 目前所在頁籤

	@Prop()
	buttonKey: any; // 按鈕權限對應key值

  /**
  * data
  */
  printModalVisible = false; // modal開關

  fileCode = null; // 檔案類型

  fileExtension = null; // 檔案格式

  /**
  * watch
  */
  @Watch('modalPrintShow')
  onChange(val) {
    this.printModalVisible = val;

    if (!val) {
      this.fileCode = undefined;
    }
  }

  @Watch('defaultVal', { immediate: true, deep: true })
  onDefaultValChange(val) {
    // 預設值
    this.fileCode = val ? val.fileCode : undefined;
    this.fileExtension = val ? val.fileExtension : undefined;
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉modal
  closePrintModal() {
    this.$emit('closePrintModal');
  }

  // 確認
  submitPrintModal() {
    // 整理成後端格式
    const printInfo = {
      fileCode: this.fileCode,
      fileExtension: this.fileExtension,
    };
    // call API
    this.$emit('submitPrint', printInfo);
  }
}
