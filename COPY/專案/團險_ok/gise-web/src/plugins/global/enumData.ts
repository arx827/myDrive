import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $giseEnum: GlobalGiseEnum
  }
}

interface Enum<T> {
  label: string
  value: T
  color?: string
}
export class GlobalGiseEnum {
  // [卡片]案件狀態
  caseStatus: Array<Enum<any>> = [
    { label: '有效', value: 'E', color: 'neutral' },
    { label: '退保', value: 'D', color: 'danger' },
    { label: '變更', value: 'M', color: 'warning' },
    { label: '加保', value: 'C', color: 'secondary' },
  ]

  // [表格]資料狀態 (TODO: value等API規格出再改)
  dataStatus: Array<Enum<any>> = [
    { label: '未完成', value: '0', color: 'danger' },
    { label: '完成送出', value: '1', color: 'neutral' },
    { label: '退件', value: '2', color: 'warning' },
  ]

  // 繳費方式
  paymentMethod: Array<Enum<any>> = [
    {
      label: '要保單位代扣',
      value: 'U',
    },
    {
      label: '銀行自動轉帳付款',
      value: 'T',
    },
    {
      label: '信用卡付款',
      value: 'C',
    },
  ]

  // 與員工關係
  insAttr: Array<Enum<any>> = [
    {
      label: '本人',
      value: '1',
    },
    {
      label: '配偶',
      value: '2',
    },
    {
      label: '子女',
      value: '3',
    },
    {
      label: '父母',
      value: '4',
    },
    {
      label: '其他',
      value: '5',
    },
  ]

  // 性別
  sex: Array<Enum<any>> = [
    {
      label: '男',
      value: '1',
    },
    {
      label: '女',
      value: '2',
    },
  ]

  // [下拉]繳費方式 (TODO: value等API規格出再改)
  payment: Array<Enum<any>> = [
    { label: '信用卡授權付款', value: 'C' },
    { label: '銀行自動轉帳付款', value: 'T' },
    { label: '要保單位代扣', value: 'U' },
  ]

  // 身故保險金受益人
  beneficiaryType: Array<Enum<any>> = [
    { label: '指定受益人', value: 'DES' },
    { label: '法定繼承人', value: 'LEG' },
    { label: '員工本人', value: 'SEL' },
    { label: '勞基法順位', value: 'LAW' },
    { label: '無', value: 'NON' },
  ]

  // 受益人類別
  beneficiaryCategory: Array<Enum<any>> = [
    { label: '法定繼承人', value: 'LEG' },
    { label: '自行輸入', value: 'NON' },
  ]

  // 是非題選項
  trueOrFalseEnum: Array<Enum<any>> = [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' },
  ]

  // 性別
  sexEnum: Array<Enum<any>> = [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ]

  /**
   * 查找enum陣列裡目標值完整obj
   * @param {string} objName: 陣列名稱
   * @param {any} item: 要查找的值
   * @return {any} 目標obj, 找不到回null
   */
  public getObject(objName: string, item: any): any {
    const target = this[objName].find(i => i.value === item)
    return target
  }

  /**
   * 查找enum陣列裡目標值之中文名稱
   * @param {string} objName: 陣列名稱
   * @param {any} item: 要查找的值
   * @return {string | null} 目標名稱, 找不到回null
   */
  public getLabel(objName: string, item: any): string | null {
    const target = this[objName].find(i => i.value === item)
    return target ? target.label : null
  }

  /**
   * 查找enum陣列裡目標值
   * @param {string} objName: 陣列名稱
   * @param {any} item: 要查找的欄位值
   * @return {any} 目標值, 找不到回null
   */
  public getValue<T>(objName: string, item: T): T {
    const target = this[objName].find(i => i.label === item)
    return target ? target.value : null
  }

  public install(app: App) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$giseEnum = this
  }
}

export default new GlobalGiseEnum()
