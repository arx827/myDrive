import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import transferUtil from '@/plugins/util/transferUtil';

@Component({
  components: {
    AdvancedSearch,
    IpkButton,
    CustomizationModal,
  },
})
export default class InvestmentLimitReportSetup extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  functionName = 'InvestmentLimitReportSetup' // [常用設定] 依照不同功能帶入不同functionName

  form = {
    baseDate: undefined,
    symId: undefined,
    counterPartyName: undefined,
    counterPartyId: undefined,
  }

  formRules = { // 進階查詢驗證規則
    baseDate: [
      {
        required: true,
        message: '請選擇基準日',
        trigger: ['blur', 'change'],
      },
    ],
  };

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  usualForm = {}; // [常用設定] 表單內容 v-model綁定

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    { label: '基準日', placeholder: 'yyyy/MM/dd', type: 'datePicker' },
    {
      label: '商品代碼',
      placeholder: '請至少輸3位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 3,
        filterOptions: [],
      },
    },
    {
      label: '歸戶名稱',
      placeholder: '請至少輸3位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 3,
        filterOptions: [],
      },
    },
    {
      label: '機構編號',
      placeholder: '請至少輸3位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 3,
        filterOptions: [],
      },
    },
  ]

  customCodeList = [] // 商品代碼下拉選單

  counterPartyNameList = [] // 歸戶名稱下拉選單

  counterPartyIdList = [] // 機構編號下拉選單

  modalCustomizationShow = false; // [檢視彈窗] modal開關

  reportSetupForm = { ...this.form };

  /**
   * hook
   */
  async created() {
    // 取得「進階查詢、常用設定」表單內容
    this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 取得下拉選單
    this.customCodeList = await this.getCustomCode();
    this.counterPartyNameList = await this.getCounterPartyName();
    this.counterPartyIdList = await this.getCounterPartyId();
    this.labelList.find((el) => el.label === '商品代碼').options = this.customCodeList;
    this.labelList.find((el) => el.label === '商品代碼').allOptions = this.customCodeList;
    this.labelList.find((el) => el.label === '歸戶名稱').options = this.counterPartyNameList;
    this.labelList.find((el) => el.label === '歸戶名稱').allOptions = this.counterPartyNameList;
    this.labelList.find((el) => el.label === '機構編號').options = this.counterPartyIdList;
    this.labelList.find((el) => el.label === '機構編號').allOptions = this.counterPartyIdList;
    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.REPORT_SETUP_TAB.val, this.$buttonKey.buttonKey.REPORT_SETUP.val);
    if (!getButtonsAuthInfoObj.byPass) {
    }
  }

  /**
  * methods
  */
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    let baseDate = this.isEmpty(data.baseDate) ? undefined : moment(data.baseDate);

    const form = {
      baseDate,
      symId: this.toKeyLabelOption(transferUtil.getSelectOption(this.customCodeList, data.symId.toString())),
      counterPartyName: this.toKeyLabelOption(transferUtil.getSelectOption(this.counterPartyNameList, data.counterPartyName)),
      counterPartyId: this.toKeyLabelOption(transferUtil.getSelectOption(this.counterPartyIdList, data.counterPartyId)),
    };

    if (e.modalName === 'advancedSearch') {
      this.advancedSearchForm = form;
    } else {
      this.usualForm = form;
    }
  }

  // 設定常用彈窗儲存按鈕
  submitSaveUsual(e) {
    // 整理後端所需格式
    const data = e.usualForm;
    const setupQueryObj = {
      baseDate: data.baseDate,
      symId: this.isEmpty(data.symId) ? undefined : data.symId.key,
      counterPartyName: this.isEmpty(data.counterPartyName) ? undefined : data.counterPartyName.key,
      counterPartyId: this.isEmpty(data.counterPartyId) ? undefined : data.counterPartyId.key,
    };
    // 如果是修改常用設定,queryCode帶null
    const queryCode = e.actionType === this.$actEnum.constant.ADD.val ? null : e.usual.key;
    const querySetupEditDto = {
      actionType: e.actionType,
      functionName: this.functionName,
      queryName: e.selectedName,
      setupQuery: JSON.stringify(setupQueryObj),
      department: this.$actEnum.departmentConstant.DEPARTMENT_SYS,
      queryCode,
    };

    // call API
    this.setLoading(true);
    this.$querySetupApi.addOrModifyQuerySetupUsingPOST(querySetupEditDto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          // 呼叫子元件方法
          (this.$refs.advancedSearch as any).resetNameToOrigin();
          return;
        }
        // 成功
        this.$message.success({ content: message, duration: 10 });
        // 呼叫子元件方法
        (this.$refs.advancedSearch as any).getSetupList();
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 開啟產檔彈窗
  openCustomizationModal() {
    // 檢核必填
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.advancedSearch)) {
      let byPass = (this.$refs.advancedSearch as any).validateSearch();
      if (!byPass) {
        InfoModal.alertInfo({ confirm: false, content: this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message });
        return;
      }
    }

    // 開啟彈窗
    this.modalCustomizationShow = true;

    // 整理產檔顯示資料
    // 基準日設定
    if (!this.isEmpty(this.advancedSearchForm.baseDate)) {
      this.reportSetupForm.baseDate = moment(this.advancedSearchForm.baseDate).format('YYYY/MM/DD');
    }

    // 商品代碼設定
    if (!this.isEmpty(this.advancedSearchForm.symId)) {
      this.reportSetupForm.symId = this.advancedSearchForm.symId.label;
    }

    // 歸戶名稱設定
    if (!this.isEmpty(this.advancedSearchForm.counterPartyName)) {
      this.reportSetupForm.counterPartyName = this.advancedSearchForm.counterPartyName.label;
    }

    // 機構編號設定
    if (!this.isEmpty(this.advancedSearchForm.counterPartyId)) {
      this.reportSetupForm.counterPartyId = this.advancedSearchForm.counterPartyId.label;
    }
  }

  // 關閉產檔彈窗
  closeCustomizationModal() {
    this.modalCustomizationShow = false;
  }

  // 確定產檔
  handleReportSetup() {
    // 整理後端所需格式
    let reportSetupDto = {
      baseDate: this.isEmpty(this.advancedSearchForm.baseDate) ? undefined : moment(this.advancedSearchForm.baseDate).format('YYYYMMDD'),
      symId: this.isEmpty(this.advancedSearchForm.symId) ? undefined : this.advancedSearchForm.symId.key,
      counterPartyName: this.isEmpty(this.advancedSearchForm.counterPartyName) ? undefined : this.advancedSearchForm.counterPartyName.key,
      counterPartyId: this.isEmpty(this.advancedSearchForm.counterPartyId) ? undefined : this.advancedSearchForm.counterPartyId.key,
    };
    // 產檔
    this.addReportSetup(reportSetupDto);
  }

  // 進階查詢產檔
  addReportSetup(dto) {
    this.setLoading(true);
    this.$investmentLimitReportApi.addInvestmentLimitReportUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        // 成功
        this.$message.success({ content: message, duration: 10 });
        // 關閉modal
        this.closeCustomizationModal();
        this.clearAdvancedSearch();
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 驗證必填欄位
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

  // 取得商品代碼下拉選單
  async getCustomCode() {
    let customCodeList = [];
    await this.$investmentLimitReportApi.searchCustomCodeUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          customCodeList.push(data);
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return customCodeList;
  }

  // 取得歸戶名稱下拉選單
  async getCounterPartyName() {
    let counterPartyNameList = [];
    this.$investmentLimitReportApi.searchCounterPartyNameUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          counterPartyNameList.push(data);
        });
      })
      .catch(() => {
        // API 失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return counterPartyNameList;
  }

  // 取得機構編號下拉選單
  async getCounterPartyId() {
    let counterPartyIdList = [];
    this.$investmentLimitReportApi.searchCounterPartyIdUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          counterPartyIdList.push(data);
        });
      })
      .catch(() => {
        // API 失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return counterPartyIdList;
  }

  toKeyLabelOption(option) {
    if (!option) {
      return undefined;
    }
    return {
      key: option ? option.value : undefined,
      label: option ? option.label : undefined,
    };
  }

  clearAdvancedSearch() {
    this.advancedSearchForm = { ...this.form };
  }
}
