import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $almEnum: GlobalAlmEnum;
  }
}
interface Option {
	label: string;
	value: any;
}
export class GlobalAlmEnum extends Vue {
  // 資產部位：報表類型常數
  public reportTypeConstant = {
    RM_ALM_MONETARY_ASSETS: 'RmAlmMonetaryAssets', // 金融資產細項表
    RM_ALM_GENERAL_LEDGER: 'RmAlmGeneralLedger', // 總帳系統細項表
    RM_ALM_RP_HL_SPLIT: 'RmAlmRpHlSplit', // RP及房貸放款拆分參數表
    RM_ALM_NII_RATIO: 'RmAlmNiiRatio', // NII分攤比例參數表
    RM_ALM_INVEST_EXP_AUM_RATIO: 'RmAlmInvestExpAumRatio', // 投資費用AUM分攤比例表
    RM_ALM_INVEST_EXP_NII_RATIO: 'RmAlmInvestExpNiiRatio', // 投資費用NII分攤比例表
  }

  // ----------------------------------------------------下拉選單區塊--------------------------------------------------------------

  // [ALM & Solvency 資產部位][進階查詢] 報表類型下拉選單
  public almReportTypeOption: Array<Option> = [
    { label: '金融資產細項表', value: 'RmAlmMonetaryAssets' },
    { label: '總帳系統細項表', value: 'RmAlmGeneralLedger' },
    { label: 'RP及房貸放款拆分參數表', value: 'RmAlmRpHlSplit' },
    { label: 'NII分攤比例參數表', value: 'RmAlmNiiRatio' },
    { label: '投資費用AUM分攤比例表', value: 'RmAlmInvestExpAumRatio' },
    { label: '投資費用NII分攤比例表', value: 'RmAlmInvestExpNiiRatio' },
  ]

  // [ALM & Solvency 資產部位][進階查詢] 金融資產細項表下拉選單
  public almMonetaryAssetsOption: Array<Option> = [
    { label: '投資分類', value: 'INVESTMENT_CATEGORY' },
    { label: '投資準則分類', value: 'MANDATE18' },
    { label: '投資準則大分類', value: 'MANDATE_CATEGORY' },
    { label: '幣別', value: 'CURRENCY' },
    { label: '公報分類', value: 'ACCOUNTING_CLASSIFICATION' },
    { label: '下一提前贖回日', value: 'NEXT_CALL_DATE' },
    { label: '可贖回債類型', value: 'CALL_STATUS' },
    { label: 'ICS資產分類', value: 'ICS_INDEX' },
    { label: 'ALM資產區隔', value: 'ASSET_SEGMENTATION_ALM' },
    { label: '適格資產	', value: 'ELIGIBLE' },
  ]

  // [ALM & Solvency 資產部位][進階查詢] 總帳系統細項表下拉選單
  public almGeneralLedgerOption: Array<Option> = [
    { label: '公司代碼', value: 'CORP_NO' },
    { label: '會計科目', value: 'ACCT_CODE' },
    { label: '原帳本', value: 'FROM_CORP_BUSINESS_CODE' },
    { label: '金融商品分類代碼', value: 'ASSEM_NO_028' },
    { label: '資產區隔', value: 'ASSEM_NO_055' },
    { label: '企業個體', value: 'ASSEM_NO_064_VAR_CODE_NAME' },
    { label: 'NII表達欄位', value: 'NII_NAME' },
    { label: 'ICS資產分類', value: 'ICS_NAME' },
  ]

  // 篩選方式進階查詢下拉選單
  public filterMethodOption = [
    {
      label: '= 等於',
      value: '=',
    },
    {
      label: '≠ 不等於',
      value: '!=',
    },
    {
      label: '> 大於',
      value: '>',
      hideOptionKey: [
        // 金融資產細項表欄位
        'INVESTMENT_CATEGORY', 'MANDATE18', 'MANDATE_CATEGORY', 'CURRENCY', 'ACCOUNTING_CLASSIFICATION', 'CALL_STATUS', 'ICS_INDEX', 'ASSET_SEGMENTATION_ALM', 'ELIGIBLE',
        // 總帳系統細項表欄位
        'CORP_NO', 'ACCT_CODE', 'FROM_CORP_BUSINESS_CODE', 'ASSEM_NO_028', 'ASSEM_NO_055', 'ASSEM_NO_064_VAR_CODE_NAME', 'NII_NAME', 'ICS_NAME',
      ],
    },
    {
      label: '>= 大於等於',
      value: '>=',
      hideOptionKey: [
        // 金融資產細項表欄位
        'INVESTMENT_CATEGORY', 'MANDATE18', 'MANDATE_CATEGORY', 'CURRENCY', 'ACCOUNTING_CLASSIFICATION', 'CALL_STATUS', 'ICS_INDEX', 'ASSET_SEGMENTATION_ALM', 'ELIGIBLE',
        // 總帳系統細項表欄位
        'CORP_NO', 'ACCT_CODE', 'FROM_CORP_BUSINESS_CODE', 'ASSEM_NO_028', 'ASSEM_NO_055', 'ASSEM_NO_064_VAR_CODE_NAME', 'NII_NAME', 'ICS_NAME',
      ],
    },
    {
      label: '< 小於',
      value: '<',
      hideOptionKey: [
        // 金融資產細項表欄位
        'INVESTMENT_CATEGORY', 'MANDATE18', 'MANDATE_CATEGORY', 'CURRENCY', 'ACCOUNTING_CLASSIFICATION', 'CALL_STATUS', 'ICS_INDEX', 'ASSET_SEGMENTATION_ALM', 'ELIGIBLE',
        // 總帳系統細項表欄位
        'CORP_NO', 'ACCT_CODE', 'FROM_CORP_BUSINESS_CODE', 'ASSEM_NO_028', 'ASSEM_NO_055', 'ASSEM_NO_064_VAR_CODE_NAME', 'NII_NAME', 'ICS_NAME',
      ],
    },
    {
      label: '<= 小於等於',
      value: '<=',
      hideOptionKey: [
        // 金融資產細項表欄位
        'INVESTMENT_CATEGORY', 'MANDATE18', 'MANDATE_CATEGORY', 'CURRENCY', 'ACCOUNTING_CLASSIFICATION', 'CALL_STATUS', 'ICS_INDEX', 'ASSET_SEGMENTATION_ALM', 'ELIGIBLE',
        // 總帳系統細項表欄位
        'CORP_NO', 'ACCT_CODE', 'FROM_CORP_BUSINESS_CODE', 'ASSEM_NO_028', 'ASSEM_NO_055', 'ASSEM_NO_064_VAR_CODE_NAME', 'NII_NAME', 'ICS_NAME',
      ],
    },
  ]

  public reportTypeOptions: Array<Option> = [
    { label: '資產區隔對照表', value: 'RmAssetSegmentation' },
    { label: '資產區隔分籃對照表', value: 'RmAssetSegmentationAlm' },
    { label: 'ICS資產分類對照表', value: 'RmIcsMapping' },
    { label: '貼水計算幣別對照表', value: 'RmDiscountMapping' },
    { label: '信用評等對照表', value: 'RmCreditRatingMapping' },
    { label: '發行人最低信評對照表', value: 'RmIssuerMapping' },
  ]

  // ---------------------func-------------------------------
  public getKey(objName, index) {
    if (this[objName].find((i) => i.val === index)) {
      return this[objName].find((i) => i.val === index).key;
    }
    return '';
  }

  public getVal(objName, index) {
    if (this[objName].find((i) => i.key === index)) {
      return this[objName].find((i) => i.key === index).val;
    }
    return '';
  }

  public getObject(objName, index) {
    if (this[objName].find((i) => i.val === index)) {
      return this[objName].find((i) => i.val === index);
    }
    return '';
  }

  public getLabel(objName, index) {
    if (this[objName].find((i) => i.value === index)) {
      return this[objName].find((i) => i.value === index).label;
    }
    return '';
  }

  public getValue(objName, index) {
    if (this[objName].find((i) => i.label === index)) {
      return this[objName].find((i) => i.label === index).value;
    }
    return '';
  }

  public install(Vue) {
    Vue.prototype.$almEnum = this;
  }
}
export default new GlobalAlmEnum();
