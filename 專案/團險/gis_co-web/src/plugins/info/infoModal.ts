/**
 * @summary設定提示錯誤訊息Modal
 * @param {string} content
 * @param {string} contentList
 * @param {string} title
*/
import Vue from 'vue';
import { Modal } from 'ant-design-vue';

interface OptionSingleErrModal {
    content: string;
		title?: string ;
		onCallback?: () => any;
}

interface OptionListErrModal {
  contentList: string[];
  title?: string ;
	onCallback?: () => any;
}

export default new class InfoModal {
  vm = new Vue()

  h = this.vm.$createElement;

  /**
 * @summary設定提示單一錯誤訊息Modal
 * @param {string} content
 * @param {string} title
*/
  public alertForSingleError(option: OptionSingleErrModal) {
  	const title = !option.title ? '錯誤訊息' : option.title;
  	Modal.error({
  		title: this.h('div', { attrs: { class: 'alert__modal__title' } }, title),
  		content: this.h('div', { attrs: { class: 'alert__modal__content' } }, option.content),
  		okText: '確定',
  		okType: 'danger',
  		class: 'alert-modal',
  		icon: () => this.h('span', { attrs: { class: 'modal__icon modal__icon--alert' } }),
  		onOk: option.onCallback,
  	});
  }

  /**
 * @summary設定提示多錯誤訊息Modal
 * @param {string} contentList
 * @param {string} title
*/
  public alertForListError(option: OptionListErrModal) {
  	const title = !option.title ? '錯誤訊息' : option.title;
  	Modal.error({
  		title: this.h('div', { attrs: { class: 'alert__modal__title' } }, title),
  		content: this.h('ul', {
  			attrs: { class: 'alert__modal__list' },
  		}, option.contentList.map((x) => this.h('li', x))),
  		okText: '確定',
  		okType: 'danger',
  		class: 'alert-modal',
  		icon: () => this.h('span', { attrs: { class: 'modal__icon modal__icon--alert' } }),
  		onOk: option.onCallback,
  	});
  }
}();
