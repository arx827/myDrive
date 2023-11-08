import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $fblicsEnum: GlobalFblicsEnum
  }
}

export interface IEnum<T> {
  label: string
  value: T
  color?: string
}

export class GlobalFblicsEnum {
  fblicsStatusEnum: Array<IEnum<string>> = [
    { label: '已鎖定', value: '1', color: '#ffbe0b' },
    { label: '已比對', value: '2', color: '#00BB00' },
    { label: '已送審', value: '3', color: '#BEBEBE' },
  ]

  workingStatus: Array<IEnum<string>> = [
    { label: '就緒', value: '1', color: '#52C41A' },
    { label: '未就緒', value: '2', color: '#F77878' },
  ]

  actionStatus: Array<IEnum<number>> = [
    { label: '新增', value: 1, color: '#52C41A' },
    { label: '修改', value: 2, color: '#FAAD14' },
    { label: '刪除', value: 3, color: '#F77878' },
  ]

  reviewStatus: Array<IEnum<number>> = [
    { label: '退回', value: 1 },
    { label: '同意', value: 2 },
    { label: '待審', value: 3 },
  ]

  reviewTypeStatus: Array<IEnum<number>> = [
    // { label: '工作狀態新增/修改', value: 1 },
    // { label: '客服人員服務時段', value: 'system_2' },
    // { label: '平日假日設定', value: 'system_3' },
    // { label: '非服務時段宣告文字訊息', value: 'system_4' },
    // { label: '系統維護宣告文字訊息', value: 'system_5' },
    { label: '卡片類型管理', value: 1 },
    { label: '卡片管理', value: 2 },
  ]

  itemType: Array<IEnum<string>> = [
    { label: '開啟檔案', value: '1' },
    { label: 'FAQ', value: '2' },
    { label: '超連結', value: '3' },
  ]

  loginSystemEnum = [
    { label: 'SCV', value: 1 },
    { label: '手機', value: 2 },
    { label: '官網', value: 3 },
    { label: 'Line', value: 4 },
  ]

  clientValidationEnum = [
    { label: '已核身', value: 1 },
    { label: '已核身', value: 2 },
    { label: '需人工核身', value: 3 },
  ]

  chatroomStatus = [
    { label: '客戶放棄等待', value: 3 },
    { label: '客戶主動離開', value: 4 },
    { label: '客戶閒置離開', value: 5 },
    { label: '客戶視窗關閉', value: 6 },
    { label: '客服人員離開', value: 7 },
  ]

  // 中文數字
  private chNums: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

  // 基本單位
  private chIntRadice: string[] = ['', '十', '百', '千']

  // 擴充單位
  private chIntUnits: string[] = ['', '萬', '億', '兆']

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
    $appGlobal.$fblicsEnum = this
  }
}

export default new GlobalFblicsEnum()
