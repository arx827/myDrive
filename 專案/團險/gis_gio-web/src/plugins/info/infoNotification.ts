import Vue from 'vue';
import { notification } from 'ant-design-vue';

declare module 'vue/types/vue' {
  interface Vue {
    $infoNotification: InfoNotification;
  }
}

interface OptionNotification {
    Content: string;
		duration?: number;
    apiError?: object;
    onCallback?: () => void;
}

// export default new class InfoNotification {
export class InfoNotification extends Vue {
  vm = new Vue();

  // 為擴充 antd notification 功能
  $antdNotification = notification;

  h = this.vm.$createElement;

  /**
   * @summary 設定通知提示框-成功訊息
   * @param {string} Content 通知提醒内容
   * @param {number} duration 停留時間(若為 null， 3 秒後自動關閉)
   * @param {cb} onCallback
   */
  public success(option: OptionNotification) {
    this.$antdNotification.success({
      message: option.Content,
      class: 'notification__success',
      description: null,
      top: '96px',
      duration: option.duration || 3,
      onClose: option.onCallback,
    });
  }

  /**
   * @summary 設定通知提示框-錯誤訊息
   * @param {string} Content 通知提醒内容
   * @param {number} duration 停留時間(若為 null ，不自動關閉)
   * @param {object} apiError API 回的錯誤訊息
   * @param {cb} onCallback
   */
  public error(option: OptionNotification) {
    let $description = null;

    if (option.apiError) {
      const errorMessage = [];
      Object.values(option.apiError).map((i) => {
        (i as any).map((j) => {
          errorMessage.push(j);
        });
      });
      $description = () => this.h('ul', {}, (errorMessage as string[]).map((x) => this.h('li', x)));
    }

    this.$antdNotification.error({
      message: option.Content,
      class: 'notification__error',
      description: $description,
      top: '96px',
      duration: option.duration || null,
      onClose: option.onCallback,
    });
  }

  public destroy() {
    this.$antdNotification.destroy();
  }

  public install(Vue) {
    Vue.prototype.$infoNotification = this;
  }
}
export default new InfoNotification();
