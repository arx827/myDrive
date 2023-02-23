import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import transferUtil from '@/plugins/util/transferUtil';
import CheckInfoForm from '@/components/shared/form/CheckInfoForm.vue';

import {
 FbSettlementLocationDto, SearchCpSettlementLocationDto, ForeignBondNonStructureChangeTxSsiFbDto, ForeignBondNonStructureChangeTxSsiCpDto, TxCodeArrayWithCfStatusDto,
} from '@fubonlife/ipk-api-axios-sdk';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ReturnModal from '@/pages/cf/TransactionManagement/Product/ReturnModal.vue';

@Component({
  components: {
    UploadDragger,
    ReturnModal,
    PrintModal,
    CheckInfoForm,
    IpkButton,
  },
})
export default class USNCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  form: object // 檢視彈窗資訊

  /**
  * data
  */
  // isLock = false; // 控制頁籤是否鎖定

  activeKey = this.$authService.mainTab.key; // 被選取的頁籤(預設前台成交資訊)

  cfStatus = '';

  txCode = '';

  /** 前台成交資訊 */
  main = { // v-model綁定及表單欄位名稱
    typeA: {
      txCode: {
        key: undefined, label: '交易編號', type: 'inputText', isEdit: false,
      },
      cfStatus: {
        key: undefined, label: '交易確認狀態	', type: 'badge', isEdit: false,
      },
      bsType: {
        key: undefined, label: '交易別', type: 'inputText', isEdit: false,
      },
      invCategoryName: {
        key: undefined, label: '資產類別', type: 'inputText', isEdit: false,
      },
      bondCode: {
        key: undefined, label: '債券標的(ISIN)', type: 'inputText', isEdit: false,
      },
      tradeDate: {
        key: undefined, label: '交易日', type: 'date', isEdit: false,
      },
      settleDate: {
        key: undefined, label: '券交割日', type: 'date', isEdit: false,
      },
      paymentSettleDate: {
        key: undefined, label: '款交割日', type: 'date', isEdit: false,
      },
      currency: {
        key: undefined, label: '幣別', type: 'inputText', isEdit: false,
      },
      tradeNpa: {
        key: undefined, label: '買/賣成交面額', type: 'inputText', isEdit: false,
      },
      tradePrice: {
        key: undefined, label: '買入/賣出價格', type: 'inputText', isEdit: false,
      },
      apDealAmount: {
        key: undefined, label: '除息金額', type: 'inputText', isEdit: false,
      },
      apAiAmount: {
        key: undefined, label: '前手息', type: 'inputText', isEdit: false,
      },
      apTax: {
        key: undefined, label: '前手稅', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA 顯示
      apTaxAmount: {
        key: undefined, label: '手續費', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA 顯示
      commission: {
        key: undefined, label: 'Commission', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA 顯示
      paymentAmount: {
        key: undefined, label: '交割款項', type: 'inputText', isEdit: false,
      },
      counterpartyId: {
        key: undefined, label: '交易對象', type: 'inputText', isEdit: false,
      },
      actCurrency: {
        key: undefined, label: '實際交割幣別', type: 'inputText', isEdit: false,
      },
      actRate: {
        key: undefined, label: '實際交割匯率', type: 'inputText', isEdit: false,
      },
      actAmount: {
        key: undefined, label: '實際交割金額', type: 'inputText', isEdit: false,
      },
      ap: {
        key: undefined, label: '會計分類', type: 'inputText', isEdit: false,
      },
      asName: {
        key: undefined, label: '資產區隔', type: 'inputText', isEdit: false,
      },
      custodian: {
        key: undefined, label: '債券保管', type: 'inputText', isEdit: false,
      },
      memo: {
        key: undefined, label: '備註', type: 'inputText', isEdit: false,
      },
      apvlLevel: {
        key: undefined, label: '簽核權限', type: 'inputText', isEdit: false,
      },
      updateId: {
        key: undefined, label: '作業人員', type: 'inputText', isEdit: false,
      },
      updateDate: {
        key: undefined, label: '作業日期', type: 'dateTime', isEdit: false,
      },
    },
    typeB: {
      txCode: {
        key: undefined, label: '交易編號', type: 'inputText', isEdit: false,
      },
      cfStatus: {
        key: undefined, label: '交易確認狀態	', type: 'badge', isEdit: false,
      },
      bsType: {
        key: undefined, label: '交易別', type: 'inputText', isEdit: false,
      },
      invCategoryName: {
        key: undefined, label: '資產類別', type: 'inputText', isEdit: false,
      },
      bondCode: {
        key: undefined, label: '債券標的(ISIN)', type: 'inputText', isEdit: false,
      },
      tradeDate: {
        key: undefined, label: '交易日', type: 'date', isEdit: false,
      },
      settleDate: {
        key: undefined, label: '券交割日', type: 'date', isEdit: false,
      },
      paymentSettleDate: {
        key: undefined, label: '款交割日', type: 'date', isEdit: false,
      },
      currency: {
        key: undefined, label: '幣別', type: 'inputText', isEdit: false,
      },
      tradeNpa: {
        key: undefined, label: '買/賣成交面額', type: 'inputText', isEdit: false,
      },
      tradePrice: {
        key: undefined, label: '買入/賣出價格', type: 'inputText', isEdit: false,
      },
      apDealAmount: {
        key: undefined, label: '除息金額', type: 'inputText', isEdit: false,
      },
      apAiAmount: {
        key: undefined, label: '前手息', type: 'inputText', isEdit: false,
      },
      paymentAmount: {
        key: undefined, label: '交割款項', type: 'inputText', isEdit: false,
      },
      counterpartyId: {
        key: undefined, label: '交易對象', type: 'inputText', isEdit: false,
      },
      actCurrency: {
        key: undefined, label: '實際交割幣別', type: 'inputText', isEdit: false,
      },
      actRate: {
        key: undefined, label: '實際交割匯率', type: 'inputText', isEdit: false,
      },
      actAmount: {
        key: undefined, label: '實際交割金額', type: 'inputText', isEdit: false,
      },
      ap: {
        key: undefined, label: '會計分類', type: 'inputText', isEdit: false,
      },
      asName: {
        key: undefined, label: '資產區隔', type: 'inputText', isEdit: false,
      },
      custodian: {
        key: undefined, label: '債券保管', type: 'inputText', isEdit: false,
      },
      memo: {
        key: undefined, label: '備註', type: 'inputText', isEdit: false,
      },
      apvlLevel: {
        key: undefined, label: '簽核權限', type: 'inputText', isEdit: false,
      },
      updateId: {
        key: undefined, label: '作業人員', type: 'inputText', isEdit: false,
      },
      updateDate: {
        key: undefined, label: '作業日期', type: 'dateTime', isEdit: false,
      },
    },
    typeC: {
      txCode: {
        key: undefined, label: '交易編號', type: 'inputText', isEdit: false,
      },
      cfStatus: {
        key: undefined, label: '交易確認狀態	', type: 'badge', isEdit: false,
      },
      bsType: {
        key: undefined, label: '交易別', type: 'inputText', isEdit: false,
      },
      invCategoryName: {
        key: undefined, label: '資產類別', type: 'inputText', isEdit: false,
      },
      bondCode: {
        key: undefined, label: '債券標的(ISIN)', type: 'inputText', isEdit: false,
      },
      tradeDate: {
        key: undefined, label: '交易日', type: 'date', isEdit: false,
      },
      settleDate: {
        key: undefined, label: '券交割日', type: 'date', isEdit: false,
      },
      paymentSettleDate: {
        key: undefined, label: '款交割日', type: 'date', isEdit: false,
      },
      currency: {
        key: undefined, label: '幣別', type: 'inputText', isEdit: false,
      },
      tradeNpa: {
        key: undefined, label: '買/賣成交面額', type: 'inputText', isEdit: false,
      },
      tradePrice: {
        key: undefined, label: '買入/賣出價格', type: 'inputText', isEdit: false,
      },
      apDealAmount: {
        key: undefined, label: '除息金額', type: 'inputText', isEdit: false,
      },
      apAiAmount: {
        key: undefined, label: '前手息', type: 'inputText', isEdit: false,
      },
      paymentAmount: {
        key: undefined, label: '交割款項', type: 'inputText', isEdit: false,
      },
      counterpartyId: {
        key: undefined, label: '交易對象', type: 'inputText', isEdit: false,
      },
      actCurrency: {
        key: undefined, label: '實際交割幣別', type: 'inputText', isEdit: false,
      },
      actRate: {
        key: undefined, label: '實際交割匯率', type: 'inputText', isEdit: false,
      },
      actAmount: {
        key: undefined, label: '實際交割金額', type: 'inputText', isEdit: false,
      },
      ap: {
        key: undefined, label: '會計分類', type: 'inputText', isEdit: false,
      },
      asName: {
        key: undefined, label: '資產區隔', type: 'inputText', isEdit: false,
      },
      custodian: {
        key: undefined, label: '債券保管', type: 'inputText', isEdit: false,
      },
      memo: {
        key: undefined, label: '備註', type: 'inputText', isEdit: false,
      },
      apvlLevel: {
        key: undefined, label: '簽核權限', type: 'inputText', isEdit: false,
      },
      updateId: {
        key: undefined, label: '作業人員', type: 'inputText', isEdit: false,
      },
      updateDate: {
        key: undefined, label: '作業日期', type: 'dateTime', isEdit: false,
      },
    },
    typeD: {
      txCode: {
        key: undefined, label: '交易編號', type: 'inputText', isEdit: false,
      },
      cfStatus: {
        key: undefined, label: '交易確認狀態	', type: 'badge', isEdit: false,
      },
      bsType: {
        key: undefined, label: '交易別', type: 'inputText', isEdit: false,
      },
      invCategoryName: {
        key: undefined, label: '資產類別', type: 'inputText', isEdit: false,
      },
      bondCode: {
        key: undefined, label: '債券標的(ISIN)', type: 'inputText', isEdit: false,
      },
      tradeDate: {
        key: undefined, label: '交易日', type: 'date', isEdit: false,
      },
      settleDate: {
        key: undefined, label: '券交割日', type: 'date', isEdit: false,
      },
      paymentSettleDate: {
        key: undefined, label: '款交割日', type: 'date', isEdit: false,
      },
      currency: {
        key: undefined, label: '幣別', type: 'inputText', isEdit: false,
      },
      tradeNpa: {
        key: undefined, label: '買/賣成交面額', type: 'inputText', isEdit: false,
      },
      tradePrice: {
        key: undefined, label: '買入/賣出價格', type: 'inputText', isEdit: false,
      },
      apDealAmount: {
        key: undefined, label: '除息金額', type: 'inputText', isEdit: false,
      },
      apAiAmount: {
        key: undefined, label: '前手息', type: 'inputText', isEdit: false,
      },
      paymentAmount: {
        key: undefined, label: '交割款項', type: 'inputText', isEdit: false,
      },
      counterpartyId: {
        key: undefined, label: '交易對象', type: 'inputText', isEdit: false,
      },
      tradeDirection: {
        key: undefined, label: '收/付款', type: 'inputText', isEdit: false,
      }, // 僅在 TypeD 顯示
      actCurrency: {
        key: undefined, label: '實際交割幣別', type: 'inputText', isEdit: false,
      },
      actRate: {
        key: undefined, label: '實際交割匯率', type: 'inputText', isEdit: false,
      },
      actAmount: {
        key: undefined, label: '實際交割金額', type: 'inputText', isEdit: false,
      },
      ap: {
        key: undefined, label: '會計分類', type: 'inputText', isEdit: false,
      },
      asName: {
        key: undefined, label: '資產區隔', type: 'inputText', isEdit: false,
      },
      custodian: {
        key: undefined, label: '債券保管', type: 'inputText', isEdit: false,
      },
      memo: {
        key: undefined, label: '備註', type: 'inputText', isEdit: false,
      },
      apvlLevel: {
        key: undefined, label: '簽核權限', type: 'inputText', isEdit: false,
      },
      updateId: {
        key: undefined, label: '作業人員', type: 'inputText', isEdit: false,
      },
      updateDate: {
        key: undefined, label: '作業日期', type: 'dateTime', isEdit: false,
      },
    },

  };

  /** 其他成交資訊 */
  other = { // v-model綁定及表單欄位名稱
    typeA: {
      tradeDealYield: {
        key: undefined, label: '買入/賣出殖利率', type: 'inputText', isEdit: false,
      },
      tradeSpread: {
        key: undefined, label: '買入/賣出Spread', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA 顯示
      issuer: {
        key: undefined, label: '發行公司/所屬國家', type: 'inputText', isEdit: false,
      },
      bondName: {
        key: undefined, label: '債券名稱', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeD 顯示
      sector: {
        key: undefined, label: '產業別/國家Asset Class', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB 顯示
      creditRating: {
        key: undefined, label: '信用評等', type: 'inputText', isEdit: false,
      },
      otherNotation: {
        key: undefined, label: '其他申明(註)', type: 'inputText', isEdit: false,
      },
      isTradePurpose: {
        key: undefined, label: '是否為交易目的', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      isOtc: {
        key: undefined, label: '是否為境內掛牌', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB 顯示
      isStakeholder: {
        key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
      },
      oldPortfolio: {
        key: undefined, label: '舊Portfolio', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      trader: {
        key: undefined, label: '交易員', type: 'inputText', isEdit: false,
      },
      confirmManager1: {
        key: undefined, label: '放行主管1', type: 'inputText', isEdit: false,
      },
      confirmManager2: {
        key: undefined, label: '放行主管2', type: 'inputText', isEdit: false,
      },
      confirmManager3: {
        key: undefined, label: '放行主管3', type: 'inputText', isEdit: false,
      },
      confirmStatus: {
        key: undefined, label: '覆核狀態', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      isSppi: {
        key: undefined, label: '是否通過SPPI測試', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
    },
    typeB: {
      tradeDealYield: {
        key: undefined, label: '買入/賣出殖利率', type: 'inputText', isEdit: false,
      },
      issuer: {
        key: undefined, label: '發行公司/所屬國家', type: 'inputText', isEdit: false,
      },
      issueCountry: {
        key: undefined, label: '所屬國家', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      sector: {
        key: undefined, label: '產業別/國家Asset Class', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB 顯示
      creditRating: {
        key: undefined, label: '信用評等', type: 'inputText', isEdit: false,
      },
      otherNotation: {
        key: undefined, label: '其他申明(註)', type: 'inputText', isEdit: false,
      },
      isTradePurpose: {
        key: undefined, label: '是否為交易目的', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      isOtc: {
        key: undefined, label: '是否為境內掛牌', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB 顯示
      isStakeholder: {
        key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
      },
      oldPortfolio: {
        key: undefined, label: '舊Portfolio', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      trader: {
        key: undefined, label: '交易員', type: 'inputText', isEdit: false,
      },
      confirmManager1: {
        key: undefined, label: '放行主管1', type: 'inputText', isEdit: false,
      },
      confirmManager2: {
        key: undefined, label: '放行主管2', type: 'inputText', isEdit: false,
      },
      confirmManager3: {
        key: undefined, label: '放行主管3', type: 'inputText', isEdit: false,
      },
      confirmStatus: {
        key: undefined, label: '覆核狀態', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      isSppi: {
        key: undefined, label: '是否通過SPPI測試', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      guarantor: {
        key: undefined, label: '保證人(Guarantor)', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB 顯示
      issueDate: {
        key: undefined, label: '債券發行日', type: 'date', isEdit: false,
      }, // 僅在 TypeB 顯示
      maturityDate: {
        key: undefined, label: '債券到期日', type: 'date', isEdit: false,
      }, // 僅在 TypeB 顯示
      rateType: {
        key: undefined, label: '固定/浮動利率', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      couponRate: {
        key: undefined, label: '票面利率', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      dividendFreq: {
        key: undefined, label: '付息頻率', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
    },
    typeC: {
      tradeDealYield: {
        key: undefined, label: '買入/賣出殖利率', type: 'inputText', isEdit: false,
      },
      issuer: {
        key: undefined, label: '發行公司/所屬國家', type: 'inputText', isEdit: false,
      },
      issueCountry: {
        key: undefined, label: '所屬國家', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      creditRating: {
        key: undefined, label: '信用評等', type: 'inputText', isEdit: false,
      },
      otherNotation: {
        key: undefined, label: '其他申明(註)', type: 'inputText', isEdit: false,
      },
      isTradePurpose: {
        key: undefined, label: '是否為交易目的', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      isStakeholder: {
        key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
      },
      oldPortfolio: {
        key: undefined, label: '舊Portfolio', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      trader: {
        key: undefined, label: '交易員', type: 'inputText', isEdit: false,
      },
      confirmManager1: {
        key: undefined, label: '放行主管1', type: 'inputText', isEdit: false,
      },
      confirmManager2: {
        key: undefined, label: '放行主管2', type: 'inputText', isEdit: false,
      },
      confirmManager3: {
        key: undefined, label: '放行主管3', type: 'inputText', isEdit: false,
      },
      confirmStatus: {
        key: undefined, label: '覆核狀態', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      isSppi: {
        key: undefined, label: '是否通過SPPI測試', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeB、TypeC 顯示
      rateType: {
        key: undefined, label: '固定/浮動利率', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      couponRate: {
        key: undefined, label: '票面利率', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      dividendFreq: {
        key: undefined, label: '付息頻率', type: 'inputText', isEdit: false,
      }, // 僅在 TypeB、TypeC 顯示
      factor: {
        key: undefined, label: 'Factor', type: 'inputText', isEdit: false,
      }, // 僅在 TypeC 顯示
      currentNpa: {
        key: undefined, label: '目前面額', type: 'inputText', isEdit: false,
      }, // 僅在 TypeC 顯示
      years: {
        key: undefined, label: '存續期間(YEARS)', type: 'inputText', isEdit: false,
      }, // 僅在 TypeC 顯示
    },
    typeD: {
      tradeDealYield: {
        key: undefined, label: '買入/賣出殖利率', type: 'inputText', isEdit: false,
      },
      issuer: {
        key: undefined, label: '發行公司/所屬國家', type: 'inputText', isEdit: false,
      },
      bondName: {
        key: undefined, label: '債券名稱', type: 'inputText', isEdit: false,
      }, // 僅在 TypeA、TypeD 顯示
      creditRating: {
        key: undefined, label: '信用評等', type: 'inputText', isEdit: false,
      },
      otherNotation: {
        key: undefined, label: '其他申明(註)', type: 'inputText', isEdit: false,
      },
      isStakeholder: {
        key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
      },
      trader: {
        key: undefined, label: '交易員', type: 'inputText', isEdit: false,
      },
      confirmManager1: {
        key: undefined, label: '放行主管1', type: 'inputText', isEdit: false,
      },
      confirmManager2: {
        key: undefined, label: '放行主管2', type: 'inputText', isEdit: false,
      },
      confirmManager3: {
        key: undefined, label: '放行主管3', type: 'inputText', isEdit: false,
      },
      tradeCouponRate: {
        key: undefined, label: '買入/賣出票面利率(Coupon)', type: 'inputText', isEdit: false,
      }, // 僅在 TypeD 顯示
      isPrivate: {
        key: undefined, label: '是否為私募', type: 'inputText', isEdit: false,
      }, // 僅在 TypeD 顯示
    },
  };

  /** 收付款資訊 */
  // usnCheckInfoForm: { [key: string]: CheckInfoModel } = {}; // 畫面顯示用

  ssi: any = { // v-model綁定及表單欄位名稱
    safekeepingAccount: undefined,
    fbPayAccount: undefined,
    fbSettlementLocation: undefined,
    fbClearerId: undefined,
    fbClearerIdAccount: undefined,
    cpSettlementLocation: undefined,
    cpClAgentCode: undefined,
    cpBrokerAccount: undefined,
    cpBfAccount: undefined,
    cpBfBankCode: undefined,
    cpBfBankName: undefined,
    cpBfAccountName: undefined,
    cpImBankCode: undefined,
    cpImBankName: undefined,
    cpRemark: undefined,
  }

  ssiLayout = { // ssi渲染畫面用
    safekeepingAccount: {
      key: undefined, label: '保管銀行帳號', type: 'inputText', colSpan: '6', disabled: true,
    },
    fbPayAccount: {
      key: undefined, label: '我方付款帳號', type: 'inputText', colSpan: '6', disabled: true,
    },
    fbSettlementLocation: {
      key: undefined, label: '我方Settlement Location', type: 'select', colSpan: '6', options: undefined,
    },
    fbClearerId: {
      key: undefined, label: '我方SSI', type: 'inputText', colSpan: '6', disabled: true,
    },
    fbClearerIdAccount: {
      key: undefined, label: '我方SSI Sub. Account', type: 'inputText', colSpan: '6', disabled: true,
    },
    cpSettlementLocation: {
      key: undefined, label: '交易對手Settlement Location', type: 'select', colSpan: '6', options: undefined,
    },
    cpClAgentCode: {
      key: undefined, label: '交易對手SSI', type: 'inputText', colSpan: '6', disabled: true,
    },
    cpBrokerAccount: {
      key: undefined, label: '交易對手sub account', type: 'inputText', colSpan: '6', disabled: true,
    },
    cpBfAccount: {
      key: undefined, label: '交易對手付款帳號', type: 'inputText', colSpan: '6', disabled: true,
    },
    cpBfBankCode: {
      key: undefined, label: '受款銀行代碼', type: 'inputText', colSpan: '6', disabled: true,
    },
    cpBfBankName: {
      key: undefined, label: '受款銀行名稱', type: 'inputText', colSpan: '18', disabled: true,
    },
    cpBfAccountName: {
      key: undefined, label: '受款人名稱', type: 'inputText', colSpan: '18', disabled: true,
    },
    cpImBankCode: {
      key: undefined, label: '交易對手中間行代碼', type: 'inputText', colSpan: '6', disabled: true,
    },
    cpImBankName: {
      key: undefined, label: '交易對手中間行名稱', type: 'inputText', colSpan: '18', disabled: true,
    },
    cpRemark: {
      key: undefined, label: 'Special Instruction', type: 'inputText', colSpan: '6', disabled: false,
    },
  };

  ssiRules: { [key: string]: ValidationRule[] } = { // 表單驗證
    fbSettlementLocation: [
      {
        required: true,
        message: '請選擇',
        trigger: 'change',
      },
    ],
    cpSettlementLocation: [
      {
        required: true,
        message: '請選擇',
        trigger: 'blur',
      },
    ],
  };

  /** 上傳附件 */
  fileUploadData: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.pdf', // 可上傳的檔案類型
    acceptType: ['application/pdf'],
    uploadDisabled: false,
    showRemoveIcon: true,
    showDownload: true,
  }

  attachmentInfo = []; // 已儲存後端的上傳資料

  deleteUploadList = []; // 刪除後端回傳的上傳資料

  checkInfoModalVisible = false; // modal開關

  invCategoryCodeType = ''; // 資產類別分類

  invCategoryCode = null; // 資產類別代碼

  modalPrintShow = false; // [列印彈窗] modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

  modalReturnShow = false; // [退回彈窗] modal開關

  productId = null; // 產品Id

  modalShowCount = 0; // 判斷modal是否是開啟狀態

  /**
  * computed
  */
   // 已比對後不可再調整收付款資訊頁籤欄位與上傳附件
   get disabledSsiTabCol() {
    let disalbed = false; // 收付款資訊頁籤欄位鎖定
    this.fileUploadData.uploadDisabled = false; // 上傳附件鎖定
    if (this.cfStatus !== this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val
      && this.cfStatus !== this.$cfEnum.cfStatusConstant.LOCK.val
      && this.cfStatus !== this.$cfEnum.cfStatusConstant.EMPTY.val) {
        disalbed = true;
        this.fileUploadData.uploadDisabled = true;
    }
    return disalbed;
  }

  // modal footer 上邊線
  get dividerBase() {
    return this.isEmpty(this.cfStatus) ? 0 : this.cfStatus;
  }

  /**
  * watch
  */

  @Watch('modalCheckInfoShow')
  onChange(val) {
    this.checkInfoModalVisible = val;
  }

  @Watch('form', { immediate: true, deep: true })
  onChangeForm(val) {
    if (!val || (val && Object.values(val).every((x) => x === undefined))) {
      return;
    }

    // 整理初始資訊
    this.cfStatus = val?.main?.cfStatus;
    this.txCode = val?.main?.txCode;
    let type = 'A'; // 預設
    // 依資產類別代碼取得欄位分類
    this.$cfEnum.invCategoryCodeRegexEnum.forEach((el) => {
      const regex = el?.pattern;
      const matches = val?.main?.invCategoryCode && (val?.main?.invCategoryCode as any).match(regex);
      if (matches) {
        type = el?.type;
      }
    });
    this.invCategoryCodeType = type;
    this.setInitInfo(val);
  }

  /**
   * hook
   */
  // created() {

  // }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 整理成交資訊
  async setInitInfo(data) {
    // 取得下拉選單
    await this.searchFbSettlementLocation(data?.main);
    await this.searchCpSettlementLocation(data?.main);
    // 整理前台成交資訊
    this.setMainInitInfo(data.main);
    // 整理其他成交資訊
    this.setOtherInitInfo(data.other);
    // 收付款資訊
    this.setSsiInitInfo(data.ssi);
    // 上傳附件
    this.setUploadList(data.attachment);
    // this.attachment = data.attachment;
    // 查詢成交資訊明細比較前後差異
    if (this.modalShowCount === 1) {
      this.searchDetailDifferent();
    }
  }

  // 整理前台成交資訊
  setMainInitInfo(main) {
    if (this.isEmpty(main)) {
      return;
    }
    this.productId = main.productId;
    Object.entries(main).forEach(([key, item], index) => {
      const itemVal: any = item;
      if (!this.isEmpty(this.main[`type${this.invCategoryCodeType}`][key])) {
        // 轉換成中文格式
        if (key === 'apvlLevel') {
          this.main[`type${this.invCategoryCodeType}`][key].key = this.$cfEnum.getKey('apvlLevelEnum', item);
        } else {
          this.main[`type${this.invCategoryCodeType}`][key].key = item;
          // this.transferDate(this.main[`type${this.invCategoryCodeType}`][key]);
        }

        if (key === 'tradePrice' || key === 'apDealAmount' || key === 'tradeNpa' || key === 'paymentAmount' || key === 'apAiAmount') {
          this.main[`type${this.invCategoryCodeType}`][key].key = transferUtil.transferPrice(itemVal);
        }
      }
    });

    this.invCategoryCode = main.invCategoryCode;
  }

  // 整理其他成交資訊
  setOtherInitInfo(other) {
    if (this.isEmpty(other)) {
      return;
    }
    Object.entries(other).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[`type${this.invCategoryCodeType}`][key])) {
        this.other[`type${this.invCategoryCodeType}`][key].key = item;
        // this.transferDate(this.other[`type${this.invCategoryCodeType}`][key]);

        if (key === 'couponRate') {
          this.other[`type${this.invCategoryCodeType}`][key].key = typeof (item) === 'number' ? `${item}%` : '';
        }

        if (key === 'tradeDealYield') {
          this.other[`type${this.invCategoryCodeType}`][key].key = item && this.invCategoryCode !== '932' ? `${item}%` : item;
        }

        if (key === 'confirmStatus') {
          this.other[`type${this.invCategoryCodeType}`][key].key = item ? this.$cfEnum.getKey('confirmStatusEnum', item) : '';
        }

        if (key === 'dividendFreq') {
          this.other[`type${this.invCategoryCodeType}`][key].key = this.$cfEnum.getLabel('dividendFreqOption', item);
        }
      }
    });
  }

  // 整理收付款資訊
  setSsiInitInfo(ssi) {
    if (this.isEmpty(ssi)) {
      return;
    }
    Object.entries(ssi).forEach(([ssiKey, item], index) => {
      // if (!this.isEmpty(this.ssi[ssiKey])) {
        this.ssi[ssiKey] = item || undefined;
        if (!this.isEmpty(this.ssiLayout[ssiKey])) {
          this.ssiLayout[ssiKey].key = item || undefined;
        }
        // this.transferDate(this.ssi[key]);
      // }
    });
  }

   // 整理附件上傳
   setUploadList(attachment) {
    this.attachmentInfo = [];
    if (this.isEmpty(attachment)) {
      return;
    }
    const empDomain = (this.getLoginInfo as any).domainId;
    attachment.forEach((file) => {
      this.attachmentInfo.push({
        ...file,
        uid: file.attachmentId,
        name: file.attachmentName,
        isDownload: true,
        isRemoved: empDomain !== file.createId, // 非自己上傳，不得刪除
      });
    });
  }

  // 上傳change事件
  handleChange(info) {
    // 移除不合規的檔案(在beforeUpload方法裡status被設為removed的檔案)
    info.fileList.forEach((item, index, arr) => {
      if (item.status === 'removed') {
          arr.splice(index, 1);
      }
    });
    // 單筆上傳會進入的流程
    if (!this.fileUploadData.multiple) {
      if (info.fileList.length > 1) {
        this.attachmentInfo = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.attachmentInfo = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.attachmentInfo.push(info.file);
    }
  }

  // 關閉modal
  closeCheckInfoModal() {
    this.resetForm();
    this.$emit('closeCheckInfoModal');
    this.$emit('handleSearch', true);
  }

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.attachmentName) return;
    const fileId = item.attachmentId;
    const fileName = item.attachmentName.slice(0, item.attachmentName.length - 4);
    const fileType = this.$cfEnum.fileExtensionEnum.PDF.toLowerCase();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.attachmentInfo = this.attachmentInfo.filter((el) => el.uid !== file.uid);
    // 有attachmentId的表示為後端傳的，push進去
    if (file.attachmentId) {
      this.deleteUploadList.push(file.attachmentId);
    }
  }

  // 點擊鎖定
  async handleDataLock() {
    // 進行狀態檢核API
    let dto: TxCodeArrayWithCfStatusDto = { txCode: [this.txCode], cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
      InfoModal.alertInfo({
        confirm: true,
        content: check.message,
        onCallback: async () => {
          let respData: any = await this.modifyCfStatus(dto);

          if (respData?.success) {
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.LOCK_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: async () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', this.txCode);
              },
            });
          }
        },
      });
    });
  }

  // 點擊資料比對
  handleDataComparison() {
    // 進行狀態檢核API
    let dto: TxCodeArrayWithCfStatusDto = { txCode: [this.txCode], cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
      InfoModal.alertInfo({
        confirm: true,
        content: this.$cfMessageEnum.COMPARED_VALIDATE_INFO?.message + check.message,
        onCallback: async () => {
          let respData: any = await this.modifyCfStatus(dto);

          if (respData?.success) {
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.COMPARED_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', this.txCode);
              },
            });
          }
        },
      });
    });
  }

  // 點擊產檔
  async handleDataFile() {
    // 進行狀態檢核API
    let check = await this.$generateFileCommon.validateBeforeGenerate([this.txCode], '$foreignBondNonstructureApi');
    if (typeof (check) === 'object') {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check?.message });
        return;
      }
    } else {
      InfoModal.alertError({ confirm: false, content: check });
      return;
    }

    // 產檔
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: [this.txCode],
      custodian: this.main[`type${this.invCategoryCodeType}`].custodian.key,
    }, '$foreignBondNonstructureApi');
    // 產檔失敗
    if (typeof (check) === 'object') {
      if (!data.success) {
        InfoModal.alertError({ confirm: false, content: data.message });
        return;
      }
    } else {
      InfoModal.alertError({ confirm: false, content: data });
      return;
    }

    // 產檔成功
    let fileData = data.content;
    InfoModal.alertInfo({
      confirm: false,
      content: data.message,
      onCallback: async () => {
        // 下載檔案
        if (!this.isEmpty(fileData)) {
          setTimeout(() => {
            this.$generateFileCommon.download(fileData.fileId, fileData.fileDesc, fileData.fileExtension);
          }, this.$cfEnum.downloadTime);
          // await this.$generateFileCommon.download(fileData.fileId, fileData.fileDesc, fileData.fileExtension.toLowerCase());
        }
      },
    });
  }

  // 點擊列印
  async handleDataPrint() {
    // 進行狀態檢核API
    let check = await this.$generateFileCommon.validateBeforeGenerate([this.txCode], '$foreignBondNonstructureApi');
    // 產檔失敗
    if (typeof (check) === 'object') {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
    } else {
      InfoModal.alertError({ confirm: false, content: check });
      return;
    }

    // 取得列印下拉選單
    this.fileCodeOption = await this.$cfCommon.getSearchFile({
      productGroup: this.$cfEnum.printParam.UnStructuredNotes.productGroup,
      fileType: this.$cfEnum.printParam.UnStructuredNotes.fileType,
    });
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL

    // 檢核成功開啟彈窗
    this.modalPrintShow = true;
  }

    // 列印確認送出
    async submitDataPrint(e) {
      // 列印
      let data = await this.$generateFileCommon.getGenerateFile({
        txCode: [this.main[`type${this.invCategoryCodeType}`].txCode.key],
        fileCode: e.fileCode,
        fileExtension: e.fileExtension,
        custodian: undefined,
      }, '$foreignBondNonstructureApi');
      // 列印失敗
      if (!data.success) {
        InfoModal.alertError({ confirm: false, content: data.message });
        return;
      }
      // 關閉列印彈窗
      let fileData = data.content;
      InfoModal.alertInfo({
        confirm: false,
        content: data.message,
        onCallback: async () => {
          if (!this.isEmpty(fileData)) {
            setTimeout(async () => {
              this.$generateFileCommon.download(fileData.fileId, fileData.fileDesc, fileData.fileExtension.toLowerCase());
            }, this.$cfEnum.downloadTime);
          }
          // 關閉列印彈窗
          this.closePrintModal();
        },
      });
    }

  // 關閉列印彈窗
  closePrintModal() {
    this.modalPrintShow = false;
    this.defaultVal.fileCode = undefined;
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
  }

  // 點擊退回
  handleDataReturn() {
    this.modalReturnShow = true;
  }

  // 退回修改
  handleReturnFront() {
    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
    let dto: TxCodeArrayWithCfStatusDto = { txCode: [this.txCode], cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
      InfoModal.alertInfo({
        confirm: true,
        content: check.message,
        onCallback: async () => {
          let respData: any = await this.modifyCfStatus(dto);

          if (respData?.success) {
            // 關閉退回彈窗
            this.closeReturnModal();
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.RETURN_EDIT_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: () => {
                // this.attachmentInfo = [];
                // this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', this.txCode);
              },
            });
          }
        },
      });
    });
  }

  // 退回解鎖
  handleReturnLock() {
    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto: TxCodeArrayWithCfStatusDto = { txCode: [this.txCode], cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
      InfoModal.alertInfo({
        confirm: true,
        content: check.message,
        onCallback: async () => {
          let respData: any = await this.modifyCfStatus(dto);

          if (respData?.success) {
            // 關閉退回彈窗
            this.closeReturnModal();
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.RETURN_UNLOCKED_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: async () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', this.txCode);
              },
            });
          }
        },
      });
    });
  }

  // 關閉退回彈窗
  closeReturnModal() {
    this.modalReturnShow = false;
  }

  // 點擊交易確認
  handleDataConfirm() {
    // 異動交易確認狀態前檢查
    let dto: TxCodeArrayWithCfStatusDto = { txCode: [this.txCode], cfStatus: this.$cfEnum.cfStatusConstant.SUBMIT.val };
    this.validateBeforeModifyCfStatus(dto).then((data) => {
      if (!data.success) {
        InfoModal.alertError({ confirm: false, content: data.message });
        return;
      }
      InfoModal.alertInfo({
        confirm: true,
        content: this.$commonMessageEnum.SUBMIT_CONFIRM_INFO?.message,
        onCallback: async () => {
          let respData: any = await this.modifyCfStatus(dto);
          if (respData.success) {
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.SUBMIT_CONFIRM_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: () => {
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', this.txCode);
                // 重查table資料
                this.$emit('handleSearch');
              },
            });
          }
        },
      });
    });
  }

// 點擊儲存按鈕
handleSaveDetail() {
  // 驗證必填
  if (this.isEmpty(this.ssi.fbSettlementLocation) || this.isEmpty(this.ssi.cpSettlementLocation)) {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$cfMessageEnum.SAVE_REQUIRED_VALIDATE_INFO?.message,
    });

    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.ssiModalForm)) {
      (this.$refs.ssiModalForm as any).validate((valid) => {
        if (!valid) {
          return false;
        }
      });
    }
    // 頁籤跳至收付款資訊
    this.activeKey = this.$authService.ssiTab.key;
    return;
  }
  // call API
  this.saveDetail();
}

  // API: 8. 查詢我方Settlement Location下拉選單
  async searchFbSettlementLocation(data) {
    const dto: FbSettlementLocationDto = {
      custodian: data?.custodian,
      currency: data?.currency,
    };
  	await this.$foreignBondNonstructureApi.searchFbSettlementLocationUsingPOST(dto)
    .then((res) => {
      this.ssiLayout.fbSettlementLocation.options = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
  }

  // API: 9. 異動我方收付款資訊
  changeTxSsiFb(settlementLocation) {
    this.setLoading(true);
    const dto: ForeignBondNonStructureChangeTxSsiFbDto = {
      settlementLocation,
      custodian: this.main[`type${this.invCategoryCodeType}`].custodian?.key,
      currency: this.main[`type${this.invCategoryCodeType}`].currency?.key,
    };
    this.$foreignBondNonstructureApi.changeTxSsiFbUsingPOST(dto)
    .then((res) => {
      const {
        fbClearerId, fbClearerIdAccount, safekeepingAccount,
      } = res.data.content;
      this.ssi.fbClearerId = fbClearerId;
      this.ssi.fbClearerIdAccount = fbClearerIdAccount;
      this.ssi.safekeepingAccount = safekeepingAccount;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 10. 查詢交易對手Settlement Location下拉選單
  async searchCpSettlementLocation(data) {
    const dto: SearchCpSettlementLocationDto = {
      custodian: data?.counterpartyId,
      productId: data?.productId,
    };
  	await this.$foreignBondNonstructureApi.searchCpSettlementLocationUsingPOST(dto)
    .then((res) => {
      this.ssiLayout.cpSettlementLocation.options = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
  }

  // API: 11. 異動交易對手收付款資訊
  changeTxSsiCp(settlementLocation) {
    this.setLoading(true);
    const dto: ForeignBondNonStructureChangeTxSsiCpDto = {
      settlementLocation,
      counterpartyId: this.main[`type${this.invCategoryCodeType}`]?.counterpartyId?.key,
      productId: this.productId,
    };
    this.$foreignBondNonstructureApi.changeTxSsiCpUsingPOST(dto)
    .then((res) => {
      const {
        cpBsCodeType, cpBsName, cpBfAccount, cpBfAccountName, cpBfBankCode, cpBfBankName, cpBrokerAccount, cpClAgentCode, cpImBankCode, cpImBankName, cpRemark,
      }: any = res.data.content;
      this.ssi.cpBfAccount = cpBfAccount;
      this.ssi.cpBfAccountName = cpBfAccountName;
      this.ssi.cpBfBankCode = cpBfBankCode;
      this.ssi.cpBfBankName = cpBfBankName;
      this.ssi.cpBrokerAccount = cpBrokerAccount;
      this.ssi.cpClAgentCode = cpClAgentCode;
      this.ssi.cpImBankCode = cpImBankCode;
      this.ssi.cpImBankName = cpImBankName;
      this.ssi.cpRemark = cpRemark;
      this.ssi.cpBsCodeType = cpBsCodeType;
      this.ssi.cpBsName = cpBsName;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 12. 異動交易確認狀態前檢查
  async validateBeforeModifyCfStatus(dto) {
    let data: any = {};
    this.setLoading(true);
    await	this.$foreignBondNonstructureApi.checkBeforeModifyCfStatusUsingPOST(dto)
    .then((res) => {
      data = res.data;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // API:  13. 異動交易確認狀態
  async modifyCfStatus(dto) {
    let data: any = {};
    this.setLoading(true);
    await this.$foreignBondNonstructureApi.modifyCfStatusUsingPATCH(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      data = res.data;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // API: 15.儲存交易資訊明細
  saveDetail() {
    let dto = {
      txCode: this.txCode,
      ssi: this.ssi,
      attachment: {
        add: [],
        remove: this.deleteUploadList,
      },
    };
    this.attachmentInfo.forEach((file) => {
      // 沒有attachmentId的push進去
      if (!file.attachmentId) {
        dto.attachment.add.push({
          attachmentName: file.name,
          attachmentExtension: transferUtil.getFileExt(file.name),
          attachmentType: this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '確認書').val,
        });
      }
    });
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/foreign-bond-nonstructure/saveDetail`, 'dto', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.attachmentInfo = [];
        this.deleteUploadList = [];
        // 重查成交資訊明細
        this.$emit('searchTxDetail', dto.txCode);
        // 重查國外債table，要依進階查詢篩選條件重查
        this.$emit('handleSearch');
      },
      // 失敗後要執行的流程
      // () => {
      //   this.attachmentInfo = [];
      //   this.deleteUploadList = [];
      // },
    );
  }

  // API: 16. 產檔列印前檢查
  async fetchCheckBeforeGenerate(txCode) {
    let data: any = {};
    this.setLoading(true);
    await	this.$foreignBondNonstructureApi.checkBeforeGenerateUsingPOST(txCode)
    .then((res) => {
      data = res.data;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // API: 17. 查詢成交資訊明細比較前後差異
  async searchDetailDifferent() {
    let data = await this.$cfCommon.searchDetailDifferent({ txCode: this.txCode }, '$domesticBondApi');
    const content = data.content;

    // 有值代表有差異
    if (!this.isEmpty(content)) {
      // 整理前台成交資訊
      if (!this.isEmpty(content.main)) {
        Object.entries(content.main).forEach(([key, item], index) => {
          if (!this.isEmpty(this.main[key])) {
            this.main[key].isEdit = !this.isEmpty(item);
          }
        });
      } else {
        Object.entries(this.main).forEach(([key, item], index) => {
          this.main[key].isEdit = false;
        });
      }

      // 整理其他成交資訊
      if (!this.isEmpty(content.other)) {
        Object.entries(content.other).forEach(([key, item], index) => {
          if (!this.isEmpty(this.other[key])) {
            this.other[key].isEdit = !this.isEmpty(item);
          }
        });
      } else {
        Object.entries(this.other).forEach(([key, item], index) => {
          this.other[key].isEdit = false;
        });
      }

      // 收付款資訊下拉選單
      // if (!this.isEmpty(content.ssi)) {
      //   Object.entries(content.ssi).forEach(([key, item], index) => {
      //     if (!this.isEmpty(this.ssi[key])) {
      //       this[key] = !this.isEmpty(item);
      //     }
      //   });
      // }
    }
  }

  // 清空各個form的值
  resetForm() {
    this.activeKey = this.$authService.mainTab.key;
    // 前台成交資訊
    Object.entries(this.main[`type${this.invCategoryCodeType}`]).forEach(([key, item], index) => {
      if (!this.isEmpty(this.main[`type${this.invCategoryCodeType}`][key])) {
        this.main[`type${this.invCategoryCodeType}`][key].key = undefined;
      }
    });
    // 其他成交資訊
    Object.entries(this.other[`type${this.invCategoryCodeType}`]).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[`type${this.invCategoryCodeType}`][key])) {
        this.other[`type${this.invCategoryCodeType}`][key].key = undefined;
      }
    });
    // 收付款資訊
    Object.entries(this.ssi).forEach(([ssiKey, item], index) => {
      // if (!this.isEmpty(this.ssi[ssiKey])) {
        if (!this.isEmpty(this.ssiLayout[ssiKey])) {
          this.ssiLayout[ssiKey].key = undefined;
        }

        this.ssi[ssiKey] = undefined;
      // }
    });
    // 上傳的附件
    this.attachmentInfo = [];
    // 必填驗證紅框樣式
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.ssiModalForm)) {
      (this.$refs.ssiModalForm as any).resetFields();
    }
  }
}
