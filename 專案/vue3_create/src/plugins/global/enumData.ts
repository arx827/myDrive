import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $cfEnum: GlobalCfEnum
  }
}
export class GlobalCfEnum {
  cfStatusEnum = [
    { label: '已鎖定', value: '1', color: '#ffbe0b' },
    { label: '已比對', value: '2', color: '#00BB00' },
    { label: '已送審', value: '3', color: '#BEBEBE' },
  ]

  // 中文數字
  private chNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

  // 基本單位
  private chIntRadice = ['', '十', '百', '千']

  // 擴充單位
  private chIntUnits = ['', '萬', '億', '兆']

  public getObject(objName, index): any | '' {
    if (this[objName].find(i => i.value === index)) {
      return this[objName].find(i => i.value === index)
    }
    return ''
  }

  public getLabel(objName, index) {
    if (this[objName].find(i => i.value === index)) {
      return this[objName].find(i => i.value === index).label
    }
    return ''
  }

  public getValue(objName, index) {
    if (this[objName].find(i => i.label === index)) {
      return this[objName].find(i => i.label === index).value
    }
    return ''
  }

  public install(app: App) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$cfEnum = this
  }
}

export default new GlobalCfEnum()
