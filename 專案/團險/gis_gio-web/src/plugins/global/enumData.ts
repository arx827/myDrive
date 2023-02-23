import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    $enum: GlobalEnum;
  }
}
interface keyVal {
  key: string;
  val: string;
}
export class GlobalEnum extends Vue {
  // 頁數
  public pageEnum: { key: string; page: string }[] = [
    { key: 'A', page: '10' },
    { key: 'B', page: '25' },
    { key: 'C', page: '50' },
  ];

  // 可投保屬性
  public insurableAttrOptions: keyVal[] = [
    {
      key: '1',
      val: '員工',
    },
    {
      key: '2',
      val: '配偶',
    },
    {
      key: '3',
      val: '子女',
    },
    {
      key: '4',
      val: '父母',
    },
    {
      key: '5',
      val: '其他',
    },
  ]

  // 可投保屬性(查詢用，多「全部」選項)
  public searchInsurableAttr: keyVal[] = [
    {
      key: '0',
      val: '全部',
    },
    {
      key: '1',
      val: '本人',
    },
    {
      key: '2',
      val: '配偶',
    },
    {
      key: '3',
      val: '子女',
    },
    {
      key: '4',
      val: '父母',
    },
    {
      key: '5',
      val: '其他',
    },
  ]

  // 保額名稱
  public insuredAmountOptions: keyVal[] = [
    {
      key: '0',
      val: '無',
    },
    {
      key: '1',
      val: '元',
    },
    {
      key: '2',
      val: '千元',
    },
    {
      key: '3',
      val: '萬元',
    },
    {
      key: '4',
      val: '倍提報工資',
    },
  ]

  // 核保規則 信息種類
  public insurableInfoType: keyVal[] = [
    {
      key: '0',
      val: '不檢核',
    },
    {
      key: '1',
      val: '錯誤',
    },
    {
      key: '2',
      val: '提示',
    },
  ];

  // 保額型態Enum (CB計劃別)
  public saTypeCBEnum: keyVal[] = [
    {
      key: '1',
      val: '保額制',
    },
    {
      key: '3',
      val: '保額範圍',
    },
  ];

  // 保額型態Enum
  public saTypeEnum: keyVal[] = [
    {
      key: '1',
      val: '保額制',
    },
    {
      key: '2',
      val: '倍薪制',
    },
    {
      key: '3',
      val: '保額範圍制',
    },
  ];

  // 行銷區域維護 連結方式
  public marketingUrlStatus: keyVal[] = [
    {
      key: '0',
      val: '無',
    },
    {
      key: '1',
      val: '檔案下載',
    },
    {
      key: '2',
      val: 'URL',
    },
  ]

  // 行銷區域維護 狀態
  public marketingStatus: keyVal[] = [
    {
      key: '0',
      val: '未上架',
    },
    {
      key: '1',
      val: '上架中',
    },
    {
      key: '2',
      val: '已下架',
    },
  ]

   // 要保單位資料維護 生效方式
   public effectiveWay: keyVal[] = [
    {
      key: '1',
      val: '契約相當日',
    },
    {
      key: '2',
      val: '受理翌日',
    },
    {
      key: '3',
      val: '受僱日',
    },
    {
      key: '4',
      val: '受理當日',
    },
    {
      key: '5',
      val: '職保生效日',
    },
    {
      key: '6',
      val: '職保生效日30天',
    },
  ]

  // 要保單位資料維護 受益人類別
  public beneficiaryCategory: keyVal[] = [
    {
      key: '11',
      val: '法定繼承人',
    },
    {
      key: '12',
      val: '依勞基法順位',
    },
    {
      key: '13',
      val: '員工',
    },
    {
      key: '*',
      val: '指定受益人',
    },
  ]

  // 承辦人【覆核程序】按鈕
  public reviewType: { key: string; val: string; params: string }[] = [
    {
      key: 'AUD',
      val: '審核',
      params: 'audit',
    },
    {
      key: 'REV',
      val: '覆核',
      params: 'review',
    },
    {
      key: 'MAN',
      val: '主管覆核',
      params: 'managerReview',
    },
  ]

  // 文件維護【狀態】列舉值
  public docsetStatus: keyVal[] = [
    {
      key: '0',
      val: '待核可',
    },
    {
      key: '1',
      val: '已生效',
    },
  ]

  // 置頂
  public top: keyVal[] = [
    { key: 'N', val: '否' },
    { key: 'Y', val: '是' },
  ];

  // 類別
  public category: keyVal[] = [
    { key: '0', val: '全部' },
    { key: '1', val: '登入前' },
    { key: '2', val: '登入後' },
  ]

  // 客戶
  public customer: keyVal[] = [
    { key: '0', val: '全部' },
    { key: '1', val: 'RC' },
    { key: '8', val: 'CB' },
  ]

  // 作業別
  public appType: keyVal[] = [
    {
      key: '0',
      val: '保險計劃加保',
    },
    {
      key: '1',
      val: '險種計劃加保',
    },
    {
      key: '2',
      val: '退保',
    },
    {
      key: '3',
      val: '基本資料變更(需審核)',
    },
    {
      key: '4',
      val: '薪資變更',
    },
    {
      key: '5',
      val: '險種計劃變更',
    },
    {
      key: '6',
      val: '保險計劃變更',
    },
    {
      key: '7',
      val: '基本資料變更(不需審核)',
    },
    {
      key: '8',
      val: '全部',
    },
  ]

  // 上傳狀態
  public uploadStatus: keyVal[] = [
    {
      key: '0',
      val: '全部',
    },
    {
      key: '1',
      val: '薪資未完成',
    },
    {
      key: '2',
      val: '未上傳',
    },
    {
      key: '3',
      val: '不上傳',
    },
    {
      key: '4',
      val: '已上傳',
    },
    {
      key: '5',
      val: '刪除',
    },
    {
      key: '9',
      val: '上傳失敗',
    },
  ]

  // 目前使用狀態
  public cnctStatus: keyVal[] = [
    {
      key: '0',
      val: '全部',
    },
    {
      key: '1',
      val: '有效',
    },
    {
      key: '2',
      val: '無效',
    },
    // TEST: 待需求確認是否保留
    // {
    //   key: '3',
    //   val: '停用',
    // },
  ]

  // 備註
  public noteType: keyVal[] = [
    {
      key: '0',
      val: '全部',
    },
    {
      key: '1',
      val: '有',
    },
    {
      key: '2',
      val: '沒有',
    },
  ]

  // 查詢條件
  public queryDate: { key: string; val: string; label: string }[] = [
    {
      key: '1',
      val: 'DUE_DATE',
      label: '應繳日期',
    },
    {
      key: '2',
      val: 'CAL_DATE',
      label: '出帳日期',
    },
    {
      key: '3',
      val: 'PAID_DATE',
      label: '核帳日期',
    },
  ]

  // 要保單位資料
  public applDataGroup: {key: string | Array<string>; label: string; type: string}[] = [
    {
      key: ['poliId', 'poliSeq'],
      label: '保單號碼',
      type: 'policyNum',
    },
    {
      key: 'fullName',
      label: '要保單位名稱',
      type: 'txt',
    },
    {
      key: 'bossName',
      label: '負責人',
      type: 'txt',
    },
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

  public install(Vue) {
    Vue.prototype.$enum = this;
  }
}
export default new GlobalEnum();
