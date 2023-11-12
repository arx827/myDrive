import Vue, { PluginFunction, PluginObject } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $enum: GlobalEnum;
  }
}
export interface keyVal {
  label: any;
  value: any;
  color?: string;
}
export class GlobalEnum extends Vue {
  // 頁數
  public userStatus: keyVal[] = [
    {
      label: "有效",
      value: "1",
      color: "#52C41A",
    },
    {
      label: "無效",
      value: "0",
      color: '#f50',
    },
  ];

  // ---------------------func-------------------------------
  public getObject(objName: string, item: any): any {
    const target = this[objName].find((i) => i.value === item)
    return target
  }

  public getLabel(objName: string, item: any): string | null {
    const target = this[objName].find((i) => i.value === item)
    return target ? target.label : null
  }

  public getValue<T>(objName: string, item: T): T {
    const target = this[objName].find((i) => i.label === item)
    return target ? target.value : null
  }

  public install(Vue) {
    Vue.prototype.$enum = this;
  }
}
export default new GlobalEnum();
