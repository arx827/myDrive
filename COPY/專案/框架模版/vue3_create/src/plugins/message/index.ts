import type { App } from 'vue'
import { message } from 'ant-design-vue'
import type { MessageArgsProps } from 'ant-design-vue/es/message'
import 'ant-design-vue/es/message/style/css'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageService
  }
}

export class MessageService {
  private wrapClassName = 'notificationCustom'
  public info(option?: MessageArgsProps) {
    message.info({
      ...option,
      class: `${this.wrapClassName} notification__info`,
    })
  }

  public success(option?: MessageArgsProps) {
    message.success({
      ...option,
      class: `${this.wrapClassName} notification__success`,
    })
  }

  public error(option?: MessageArgsProps) {
    message.error({
      ...option,
      class: `${this.wrapClassName} notification__error`,
    })
  }

  public warning(option?: MessageArgsProps) {
    message.warning({
      ...option,
      class: `${this.wrapClassName} notification__warning`,
    })
  }

  public destroy() {
    message.destroy()
  }

  private init() {
    // 全局共用設定
    message.config({
      top: `0px`, // message距離頂部位置
      duration: 3, // 默認自動關閉 (秒)
      maxCount: 5, // 最大顯示數
    })
  }

  public install(app: App) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$message = this
    this.init()
  }
}

export default new MessageService()
