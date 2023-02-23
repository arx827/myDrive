import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';

@Component({})
export default class IpkSelect extends Vue {
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

  /**
  * data
  */
  selected = undefined; // 已選取選單

  allOptions = []; // 單筆模糊搜尋功能用。

  filterOptions = []; // 依照輸入條件篩選選項

  isBlur = false; // 因blur會觸發兩次，所以卡控call一次

  /**
  * watch
  */
  @Watch('value', { immediate: true, deep: true })
  onNewVChange(val) {
    this.selected = val;
  }

  /**
  * hook
  */
  created() {
    this.allOptions = JSON.parse(JSON.stringify(this.options));
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 下拉選單多筆模糊搜尋功能
  multiFilterOption(input, option) {
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
  }

  // 清空下拉選單模糊搜尋框
  // clearSearchInput(key: string) {
  //   if (validateUtil.isEmpty(this.$refs[key])) {
  //     return;
  //   }
  //   (this.$refs[key] as any).$children[0].setInputValue('');
  // }

  /**
   * @summary 下拉選單單筆模糊搜尋功能
   * @param {any} event: search事件event
  */
  handleFilterOption(event: any) {
    const halfChar = transferUtil.fullCharToHalfChar(event);
    this.filterOptions = halfChar.length > 0 ? transferUtil.filterOption(halfChar, this.options) : this.options;
    this.$forceUpdate();
  }

  /**
   * @summary 客製化模糊查詢: 因a-select選項超過300筆會有效能問題，故改成限制輸入關鍵字最少數量，再顯示選項
   * @param {any} event: search事件event
  */
  handleOption(event: any) {
    if (this.isEmpty(event)) {
      return;
    }
    const halfChar = transferUtil.fullCharToHalfChar(event);
    this.filterOptions = halfChar.length >= this.limitNum ? transferUtil.filterOption(halfChar, this.options) : [];
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
    this.filterOptions = [];
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
}
