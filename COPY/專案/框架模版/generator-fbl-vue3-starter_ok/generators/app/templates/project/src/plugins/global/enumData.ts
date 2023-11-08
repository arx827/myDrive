import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $cfEnum: GlobalCfEnum
  }
}

interface IEnum<T> {
  label: string
  value: T
  color?: string
}

export class GlobalCfEnum {
  cfStatusEnum: Array<IEnum<String>> = [
    { label: '已鎖定', value: '1', color: '#ffbe0b' },
    { label: '已比對', value: '2', color: '#00BB00' },
    { label: '已送審', value: '3', color: '#BEBEBE' },
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
    $appGlobal.$cfEnum = this
  }
}

export default new GlobalCfEnum()
