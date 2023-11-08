import type { App } from 'vue'
import { notification } from 'ant-design-vue'
import type { NotificationArgsProps } from 'ant-design-vue/es/notification'
import 'ant-design-vue/es/notification/style/css'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $notification: NotificationService
  }
}

export class NotificationService {
  public default(option?: NotificationArgsProps) {
    notification.open({
      ...option,
    })
  }

  public info(option?: NotificationArgsProps) {
    notification.info({
      ...option,
    })
  }

  public success(option?: NotificationArgsProps) {
    notification.success({
      ...option,
    })
  }

  public error(option?: NotificationArgsProps) {
    notification.error({
      ...option,
    })
  }

  public warning(option?: NotificationArgsProps) {
    notification.warning({
      ...option,
    })
  }

  public destroy() {
    notification.destroy()
  }

  private init() {
    // 全局共用設定
    notification.config({
      duration: 3, // 默認自動關閉 (秒)
      maxCount: 5, // 最大顯示數
    })
  }

  public install(app: App) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$notification = this
    this.init()
  }
}

export default new NotificationService()
