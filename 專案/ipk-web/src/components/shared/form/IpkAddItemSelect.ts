import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import InfoModal from '@/plugins/notification/infoModal';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class IpkAddItemSelect extends Vue {
  /**
  * props
  */
  @Prop()
  value: any; // 用v-model方式傳遞，只能用value接值

  @Prop()
  options: any[]; // 後端回傳的所有選項

  @Prop()
  isDisabled: boolean; // 是否鎖定

  @Prop({ default: '請選擇' })
  placeholder: string; // 輸入框提示字。

  @Prop({ default: false })
  showSearch: boolean; // 下拉選單是否要模糊查詢。

  @Prop({ default: undefined })
  showSearchType: string; // 模糊查詢規則，與showSearch配合使用(即showSearch必須設為true)。ex: showSearchType=' ' => 以空白作為多關鍵字搜尋。

  @Prop({ default: false })
  showSelfDefined: boolean; // 是否用客製化下拉選單

  @Prop({ default: 4 })
  limitNum: number; // 應輸入關鍵字最少數量

  @Prop()
  refKey: string;

  @Prop({ default: false })
  labelInValue: boolean; // 是否把每個選項的label包装到value中，會把Select的value類型從string變為{key: string, label: vNodes}的格式。

  @Prop()
  addItemMaxLength: number; // 新增選項字數限制

  @Prop()
  formRule: number; // 新增選項欄位輸入規則，參照 validateUtil.validateFormData

  /**
  * data
  */
  selected = undefined; // 已選取選單

  allOptions = []; // 新增選項會改變原本的選單，prop會報錯，故宣告另一個變數接。

  addOptions = []; // 紀錄新增的選項

  filterOptions = []; // 依照輸入條件篩選選項

  addItemForm = {
    addItem: undefined, // 新增選項v-model綁定
  }

  addItemFormRules = {
    addItem: [],
  }

  isAdd = false; // 自定義下拉選單

  modalAddOptionShow = false; // 新增選項彈窗modal開關

  isBlur = false; // 因blur會觸發兩次，所以卡控call一次

  /**
  * watch
  */
  @Watch('value', { immediate: true, deep: true })
  onNewVChange(val) {
    this.selected = val;
  }

  @Watch('options', { immediate: true, deep: true })
  onOptionsChange(val) {
    this.allOptions = JSON.parse(JSON.stringify(val));
  }

  /**
  * hook
  */
  created() {
    if (!this.isEmpty(this.formRule)) {
      this.addItemFormRules.addItem.push({
        required: true,
        validator: this.formRuleValidator,
        trigger: 'blur',
      });
    }
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 下拉選單(複選)模糊查詢
  filterOption(input, option) {
    // 多筆模糊搜尋功能
    if (this.showSearchType !== undefined) {
      let keys = input.split(this.showSearchType);
      let count = 0;
      for (let i = 0; i < keys.length; i++) {
        if (option.componentOptions.children[0].text.toUpperCase().indexOf(keys[i].toUpperCase()) >= 0) {
          count++;
        }
      }
      return count > 0;
    }
    return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
  }

  // 清空下拉選單模糊搜尋框
  // clearSearchInput(key) {
  //   if (validateUtil.isEmpty(this.$refs[key])) {
  //     return;
  //   }
  //   (this.$refs[key] as any).$children[0].setInputValue('');

  //   // 清除表單驗證
  //   this.$emit('clearValidateField', key);
  // }

  /**
   * @summary 客製化模糊查詢: 因a-select選項超過300筆會有效能問題，故改成限制輸入關鍵字最少數量，再顯示選項
   * @param {string} event: search事件event
   * @param {string} options: 後端回傳的全部選單
  */
  handleOption(event: any) {
    if (validateUtil.isEmpty(event)) {
      return;
    }
    const halfChar = transferUtil.fullCharToHalfChar(event);
    this.filterOptions = halfChar.length >= this.limitNum ? transferUtil.filterOption(halfChar, this.allOptions) : this.addOptions;
    this.$forceUpdate();
  }

  // 支援鍵盤方法
  deleteInputValue(e: any) {
    // 清空欄位值
    if (e.key === 'Delete') {
      this.selected = undefined;
    }
    this.$forceUpdate();
  }

  // 已選取選項方法
  handleSelect(data, type) {
    // 因blur會觸發兩次，所以卡控call一次
    if (type === 'blur') {
      if (this.isBlur) {
        this.isBlur = false;
        return;
      }
      this.isBlur = true;
    }
    this.filterOptions = this.addOptions;
    // v-modal雙向綁定
    this.$emit('input', data);
  }

  // 點擊allowClear事件
  handleClear(e) {
    // 獲取dom元素
    let clearDom = e.path[0].children[0].children[1];
    // 添加點擊事件
    clearDom.addEventListener('click', () => {
      // 清空操作
      this.$emit('input', undefined);
    });
  }

  // 轉換成大寫
  transferInput() {
    if (this.isEmpty(this.addItemForm.addItem)) {
      return;
    }
    this.addItemForm.addItem = transferUtil.fullCharToHalfChar(this.addItemForm.addItem).toUpperCase();
  }

  // 點擊新增選項彈窗確定按鈕
  submitAddOptionItem() {
    for (let i = 0; i < this.allOptions.length; i++) {
      if (this.addItemForm.addItem === this.allOptions[i].value) {
        InfoModal.alertInfo({ confirm: false, content: '已存在相同選項。' });
        return;
      }
    }
    this.allOptions.push({ label: this.addItemForm.addItem, value: this.addItemForm.addItem });
    this.addOptions.push({ label: this.addItemForm.addItem, value: this.addItemForm.addItem });
    // 已選取選項方法
    this.handleSelect(this.addItemForm.addItem, 'addItem');
    // 關閉新增選項彈窗
    this.handleCloseAddModal();
  }

  // 開啟新增選項彈窗
  handleOpenAddModal() {
    this.modalAddOptionShow = true;
  }

  // 關閉新增選項彈窗
  handleCloseAddModal() {
    this.modalAddOptionShow = false;
    this.addItemForm.addItem = undefined;
  }

  // 新增選項輸入驗證
  formRuleValidator(rule: any, value: any, callback: Function) {
    this.addItemForm.addItem = validateUtil.validateFormData(this.formRule, value);
  }
}
