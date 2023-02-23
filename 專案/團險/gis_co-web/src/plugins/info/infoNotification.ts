/**
 * @summary設定錯誤彈跳訊息
 * @param {string} Content
 * @param {number} duration
 * @param {cb} onCallback
*/
import Vue from 'vue';
import { notification } from 'ant-design-vue';

Vue.prototype.$notification = notification;

interface OptionNotification {
    Content: string;
		duration?: number;
    onCallback?: () => void;
}

export default new class InfoNotification {
  vm = new Vue()

  public success(option: OptionNotification) {
  	this.vm.$notification.success({
  		message: option.Content,
  		class: 'notification__success',
  		description: null,
  		top: '96px',
  		duration: 3 || option.duration,
  		onClose: option.onCallback,
  	});
  }

  public error(option: OptionNotification) {
  	const h = this.vm.$createElement;

  	this.vm.$notification.error({
  		message: option.Content,
  		class: 'notification__error',
  		description: null,
  		top: '96px',
  		duration: null || option.duration,
  		onClose: option.onCallback,
  	});
  }
}();
