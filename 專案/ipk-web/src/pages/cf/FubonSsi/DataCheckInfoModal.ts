import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import transferUtil from '@/plugins/util/transferUtil';
import DataCashPage from '@/pages/cf/FubonSsi/DataCashPage.vue';
import DataEquityPage from '@/pages/cf/FubonSsi/DataEquityPage.vue';

@Component({
  components: {
    DataCashPage,
    DataEquityPage,
    IpkButton,
  },
})
export default class DataCheckInfoModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  checkInfo: any // 檢視資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  activeKey = '1'; // 被選取的頁籤(預設款帳號)

  oriForm = { // 檢視彈窗 v-model綁定
    custodianBankCode: undefined,
    currency: undefined,
    type: undefined,
  }

  /**
  * watch
  */
  @Watch('modalCheckInfoShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('checkInfo', { immediate: true, deep: true })
  onValChange(val) {
    // 檢視
    if (val.actionType === 'C') {
      this.oriForm.custodianBankCode = val.editInfo.custodianBankCode;
      this.oriForm.currency = val.editInfo.currency;
      this.oriForm.type = transferUtil.getSelectOption(this.$cfEnum.useTypeOption, val.editInfo.type)?.label;
    }
  }

  /**
  * hook
  */
  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeCheckInfoModal;
  }

  /**
  * methods
  */
  // 關閉modal
  closeCheckInfoModal() {
    this.$emit('closeCheckInfoModal');
    this.activeKey = '1';
  }

  // 清空帶入資訊
  reset() {
    this.oriForm = {
      custodianBankCode: undefined,
      currency: undefined,
      type: undefined,
    };
  }

  // 子頁簽傳遞getPendingInfoCount 查詢待放行筆數更新
  getPendingInfoCount() {
    // 查詢待放行清單筆數
    this.$emit('getPendingInfoCount');
  }
}
