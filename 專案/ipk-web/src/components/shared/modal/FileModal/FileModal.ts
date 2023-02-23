import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class FileModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalFileShow: boolean // modal開關

  @Prop()
  defaultCustodian: string // 預設保管行

  @Prop()
	childrenTab: any; // 目前所在頁籤

	@Prop()
	buttonKey: any; // 按鈕權限對應key值

  /**
  * data
  */
  fileModalVisible = false; // modal開關

  custodian = ''; // [產檔彈窗] 保管行

  /**
  * watch
  */
  @Watch('modalFileShow')
  onChange(val) {
    this.fileModalVisible = val;
  }

  /**
  * hook
  */
  created() {
    this.custodian = this.defaultCustodian || 'BONY';
  }

  /**
  * methods
  */
  // 關閉modal
  closeFileModal() {
    // 回到預設值
    this.custodian = this.defaultCustodian || 'BONY';
    // 關閉
    this.$emit('closeFileModal');
  }

  // 確認
  submitDataFile() {
    // call API
    this.$emit('submitFile', { custodian: this.custodian });
  }
}
