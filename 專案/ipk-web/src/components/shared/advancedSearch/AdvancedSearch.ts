import {
  Vue, Component, Prop, Watch,
 } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import transferUtil from '@/plugins/util/transferUtil';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
   components: {
    IpkButton,
     VNodes: {
       functional: true,
       render: (h, ctx) => ctx.props.vnodes,
     },
   },
})
export default class AdvancedSearch extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
   * props
   */
  @Prop()
  labelList: Array<AdvancedSearchModel>; // 輸入框label

  @Prop()
  value: object; // 進階查詢表單內容，用v-model方式傳遞，只能用value接值

  @Prop()
  formRules: { [key: string]: ValidationRule[] }; // 進階查詢驗證規則

  @Prop()
  usualFormData: object; // 常用設定表單內容

  @Prop()
  functionName: string; // 依照不同功能帶入不同functionName

  @Prop({ default: true })
  usualModalShow: boolean; // 是否顯示常用設定

  @Prop()
	childrenTab: any; // 目前所在頁籤

  @Prop({ default: 8 })
  defaultCount: boolean; // 基礎查詢欄位數量

  /**
   * data
   */
  /** *  進階查詢 ** */
  expand = false // 進階查詢縮合

  showSearchType = undefined; // 模糊查詢規則

  advancedSearchForm: object = {}; // 進階查詢表單內容

  adUsualSelected = ''; // 進階查詢，選取的常用設定選項

  /** *  常用設定 ** */
  modalUsualShow = false; // 常用設定彈窗開關

  usualForm: object = {}; // 常用設定表單內容

  usualList: Array<any> = []; // 常用設定下拉選單

  usual = { label: '請選擇常用', value: '' }; // 常用彈窗，選取的常用設定選項

  saveButtonDisabled = true; // 儲存按鈕disable控制

  btnDisabled = true; // 刪除&重新命名按鈕disable控制

  /** *  新增常用 / 重新命名彈窗 ** */
  inputModalVisible = false // 輸入名稱modal開關

  modalContent = null // 新增/修改的modal內容

  usualName = null;

  originName = null // 常用設定原始名稱

  okButtonDisabled = true // 重新命名-確定按鈕disable控制

  settingAction = null // 判斷常用設定操作的flag

  isEdit = false; // 判斷是新增流程還是修改流程

  /**
   * computed
   */
  // get count() {
  //   return this.expand ? Object.keys(this.advancedSearchForm).length : this.defaultCount;
  // }

  /**
   * watch
   */
  @Watch('usualFormData', { immediate: true, deep: true })
  onNewValChange(val) {
    this.usualForm = val;
  }

  @Watch('value', { immediate: true, deep: true })
  onNewVChange(val) {
    this.advancedSearchForm = val;
  }

  @Watch('advancedSearchForm', { immediate: true, deep: true })
  onAdvancedSearchFormChange(val) {
   this.$emit('input', val);
  }

  // @Watch('labelList', { immediate: true, deep: true })
  // onLabelListChange(val) {
  //   // 模糊搜尋預設
  //   Object.entries(val).forEach(([key, value], index) => {
  //     if (val[key].showSearch) {
  //       if (val[key].type === 'singleSelect' || val[key].type === 'multiSelect') {
  //         val[key] = { ...val[key], allOptions: [] };
  //         val[key].allOptions = val[key].options;
  //       }
  //     }
  //   });
  // }

  /**
   * hook
   */
  created() {
    // 欄位資訊
    this.advancedSearchForm = !this.isEmpty(this.value) ? { ...this.value } : undefined;
    this.usualForm = !this.isEmpty(this.usualFormData) ? { ...this.usualFormData } : undefined;

    // 取得常用設定名單
    if (this.usualModalShow) {
      this.getSetupList();
    }
  }

  mounted() {
    this.closeShowSearch();

    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeUsualModal;
  }

  /**
   * methods
   */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 將值初始化
  reset() {
    this.saveButtonDisabled = true;
    this.btnDisabled = true;
    this.okButtonDisabled = true;
    this.isEdit = false;
    this.originName = null;
    this.usualName = null;
    this.settingAction = null;
    this.usual = { label: '請選擇常用', value: '' };
  }

  // 進階查詢展開更多
  toggle() {
    this.expand = !this.expand;
  }

  // 查詢
  handleSearch() {
    // 驗證必填
    if (!this.validateSearch()) {
      // 驗證不通過，清空查詢結果
      this.$emit('resetDataInfo');
      return;
    }
    // 執行父元件查詢方法
    this.$emit('handleSearch');
  }

  // 清空進階查詢
  resetAdvancedSearchForm() {
    Object.entries(this.advancedSearchForm).forEach(([key, value], index) => {
      this.advancedSearchForm[key] = undefined;
    });
  }

  // 表單驗證
  validateSearch() {
    let byPass = true;
    if (!this.isEmpty(this.formRules)) {
      (this.$refs.formRef as any).validate((valid) => {
        if (!valid) {
          byPass = false;
        }
      });
    }
    return byPass;
  }

  // datepicker 時間改變
  onChange(value, index) {
    if (this.labelList[index].showTime) {
      // console.log('Selected Time: ', value);
      // console.log('Formatted Selected Time: ', value.format('YYYY/MM/DD HH:mm'));
    }
  }

  // datepicker 點擊確認
  onOk(value, index) {
    if (this.labelList[index].showTime) {
      // console.log('onOk: ', value);
    }
  }

  // rangePicker - 僅選擇月份
  handlePanelChange(value, key) {
    this.advancedSearchForm[key] = value;
  }

  // 切換日期格式
  switchDateFormat(formName, index, key) {
    (this.$refs.formRef as any).clearValidate();
    this.labelList[index].showInputText = !this.labelList[index].showInputText;
    // 進階查詢的步驟
    if (formName === 'advancedSearch') {
      this.advancedSearchForm[key] = undefined;
      return;
    }
    // 常用設定的步驟
    this.usualForm[key] = undefined;
  }

  // 改變月份選擇器
  handleMonthPickerChange(value, key) {
    this.advancedSearchForm[key] = value;
  }

  // 關閉月份選擇器
  handleCloseMonthPicker() {
    (this.$refs.monthPicker[0] as any).$refs.picker.sOpen = false;
  }

  // 下拉選單預設模糊查詢, 強制關閉
  closeShowSearch() {
    // 驗證
    if (this.isEmpty(this.labelList)) {
      return;
    }
    // 是否要模糊查詢
    let selectList = [];
    Object.entries(this.labelList).forEach(([key, value], index) => {
      if (this.labelList[key].type === 'singleSelect' && this.labelList[key].showSearch) {
        selectList.push(this.labelList[key]);
      }
      if (this.labelList[key].type === 'multiSelect') {
        selectList.push(this.labelList[key]);
      }
    });
    selectList.forEach((item, index) => {
      if (item.showSearch !== undefined) {
        if (item.showSearch) {
          (document.querySelector('.ant-select-search__field') as HTMLInputElement).readOnly = false;
          if (item.showSearchType !== undefined) {
            this.showSearchType = item.showSearchType;
          }
        }
      } else {
        (document.querySelector('.ant-select-search__field') as HTMLInputElement).readOnly = true;
      }
    });
  }

  // 下拉選單(複選)全選
  selectALL(key, index) {
    let formList = [];
    this.labelList[index].options.forEach((item) => {
      if (!this.isEmpty(item.value)) {
        formList.push(item.value);
      }
    });
    this.advancedSearchForm[key] = formList;
  }

  // 下拉選單(複選)清除
  clearALL(key) {
    this.advancedSearchForm[key] = undefined;
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
  clearSearchInput(key) {
    if (this.isEmpty(this.$refs[key])) {
      return;
    }
    (this.$refs[key][0] as any).$children[0].setInputValue('');
  }

  /**
   * @summary 下拉選單單筆模糊搜尋功能
   * @param {any} event: search事件event
   * @param {number} index: 第幾個欄位
  */
  handleFilterOption(event: any, index) {
    // TODO: 多筆模糊搜尋待調整
    const halfChar = transferUtil.fullCharToHalfChar(event);
    (this.labelList[index] as any).allOptions = halfChar.length > 0 ? transferUtil.filterOption(halfChar, this.labelList[index].options) : this.labelList[index].options;
    this.$forceUpdate();
  }

  /**
   * @summary 客製化模糊查詢: 因a-select選項超過300筆會有效能問題，故改成限制輸入關鍵字最少數量，再顯示選項
   * @param {any}} event: search事件event
   * @param {Array} options: 後端回傳的全部選單
   * @param {number} index: 該欄位index
  */
  handleOption(event: any, options: Array<any>, index: number) {
    if (this.isEmpty(event)) {
      return;
    }
    const halfChar = transferUtil.fullCharToHalfChar(event);
    this.labelList[index].showSelfDefined.filterOptions = halfChar.length >= this.labelList[index].showSelfDefined.limitNum ? transferUtil.filterOption(halfChar, options) : [];
    this.$forceUpdate();
  }

  /**
   * @summary 支援鍵盤方法
   * @param {string} key: 要清空的欄位
  */
  deleteInputValue(key, e) {
    if (this.isEmpty(key)) {
      return;
    }
    // 清空欄位值
    if (e.key === 'Delete') {
      this.advancedSearchForm[key] = undefined;
    }
    this.$forceUpdate();
  }

  /** ****************************************** 常用功能 start********************************************************* */
  // 清空常用設定
  resetUsualForm() {
    if (!this.isEmpty(this.usualForm)) {
      Object.entries(this.usualForm).forEach(([key, value], index) => {
        this.usualForm[key] = undefined;
      });
    }

    // 客製化常用彈窗(即用slot設定欄位的頁面)，清空欄位值使用
    this.$emit('resetOuterUsualForm');
  }

  // 點擊設定常用下拉選單，取得內容
  querySetupData(modalName, option) {
    // 選到請選擇
    if (this.isEmpty(option.key)) {
      this.reset();
      if (modalName === 'advancedSearch') {
        this.resetAdvancedSearchForm();
      } else {
        this.resetUsualForm();
      }
      return;
    }

    // 開啟重新命名/刪除/儲存按鈕
    this.btnDisabled = false;
    this.usualName = option.label.trim();
    this.isEdit = true;
    this.saveButtonDisabled = false;

    // call API取得常用設定內容
    this.setLoading(true);

    const querySetupEditDto = {
      functionName: this.functionName,
      queryCode: option.key,
    };

    this.$querySetupApi.searchQuerySetupUsingPOST(querySetupEditDto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const querySetupData = res.data.content;

      if (!isSuccess) {
        this.$message.error(message, 10);
        return;
      }
      this.$emit('querySetupData', { modalName, querySetupData });
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 開啟設定常用彈窗
  openUsualModal() {
    this.modalUsualShow = true;
    this.$emit('setCurrentFormName', 'usual');
  }

  // 關閉常用設定彈窗
  closeUsualModal() {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.resetUsualForm();
        this.getSetupList();
        this.reset();
        this.modalUsualShow = false;
        this.$emit('setCurrentFormName', 'advancedSearch');
      },
    });
  }

  // 警告, 提示訊息-確定要刪除此常用設定?
  openDeleteSetupModal() {
    InfoModal.alertInfo({
      title: '確定要刪除此常用設定嗎?',
      confirm: true,
      content: '',
      onCallback: () => {
        this.deleteSetup(this.usual);
      },
    });
  }

  // 刪除常用設定
  deleteSetup(deleted) {
    this.setLoading(true);

    this.$querySetupApi.removeQuerySetupUsingPOST(deleted.key)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      if (!isSuccess) {
        this.$message.error({ content: message, duration: 10 });
        return;
      }
      this.$message.success({ content: message, duration: 10 });
      this.getSetupList();
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 開啟新增/重新命名彈窗
  openSetupNameModal(action) {
    this.inputModalVisible = true;
    this.settingAction = action;
    this.modalContent = `輸入${action.key}的常用名稱`;

    // 新增
    if (action === this.$actEnum.constant.ADD) {
      this.usualName = null;
    }

    // 重新命名
    if (action === this.$actEnum.constant.RENAME) {
      this.originName = transferUtil.deepCopyData(this.usualName);
    }
  }

  // 檢測新增/重新命名彈窗輸入框是否異動
  validateInputValue() {
    // 新增
    if (this.settingAction === this.$actEnum.constant.ADD) {
      if (!this.isEmpty(this.usualName)) {
        this.okButtonDisabled = false;
      } else {
        this.okButtonDisabled = true;
      }
    }
    // 重新命名
    if (this.settingAction === this.$actEnum.constant.RENAME) {
      if (this.originName !== this.usualName) {
        this.okButtonDisabled = false;
      } else {
        this.okButtonDisabled = true;
      }
    }
  }

  // 新增/重新命名彈窗確定按鈕
  submitUsual() {
    this.saveButtonDisabled = false;
    this.inputModalVisible = false;

    // 新增
    if (this.settingAction === this.$actEnum.constant.ADD) {
      this.usualList.push({ label: this.usualName, key: Math.floor(Date.now() / 1000).toString() });
      this.usual = this.usualList[this.usualList.length - 1]; // 選項顯示剛新增的設定名稱
      this.isEdit = false;
      this.resetUsualForm();
    }

    // 重新命名
    if (this.settingAction === this.$actEnum.constant.RENAME) {
      this.submitSaveUsual(this.settingAction.val);
    }
  }

  // 設定常用彈窗儲存按鈕
  submitSaveUsual(actionType) {
    if (this.isEmpty(actionType)) {
      if (!this.isEdit) {
        actionType = this.$actEnum.constant.ADD.val;
      } else {
        actionType = this.$actEnum.constant.MODIFY.val;
      }
    }
    const empDomain = (this.getLoginInfo as any).domainId;
    let usualForm = {};
    if (!this.isEmpty(this.usualForm)) {
      usualForm = JSON.parse(JSON.stringify(this.usualForm));
    }

    this.$emit('submitSaveUsual', {
      actionType,
      empDomain,
      usual: this.usual,
      selectedName: this.usualName,
      usualForm,
    });
  }

  // 將重新命名的設定常用名稱改回原本的名稱
  resetNameToOrigin() {
    this.usualName = transferUtil.deepCopyData(this.originName);
  }

  // 常用設定多選下拉 - 全選
  selectALLUsual(key, index) {
    this.usualForm[key] = this.labelList[index].options.map((item) => item.value);
  }

  // 常用設定多選下拉 - 清除
  clearALLUsual(key) {
    this.usualForm[key] = undefined;
  }

  // 取得常用設定下拉選單
  getSetupList() {
    this.usualList = [];
    this.setLoading(true);
    this.$querySetupApi.searchQueryUsingPOST(this.functionName)
    .then((res) => {
      const isSuccess = res.data.success;

      if (isSuccess) {
        this.usualList = [...res.data.content];
        this.usual = { label: '請選擇常用', value: '' };
        this.adUsualSelected = undefined;
        this.reset();
        this.resetUsualForm();
      }
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  /** ****************************************** 常用功能 end********************************************************* */
}
