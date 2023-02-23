/**
 * @summary設定提示錯誤訊息Modal
 * @param {string} content
 * @param {string} contentList
 * @param {string} title
*/
import Vue from 'vue';
import { Modal } from 'ant-design-vue';

interface OptionModal {
	content?: string | string[];
	title?: string;
	confirm?: boolean;
	okType?: string;
	width?: string;
	customContent?: () => any | any;
	onCallback?: () => any;
}

export default new class InfoModal {
  vm = new Vue()

  h = this.vm.$createElement;

  /**
	 * @summary 設定提示單一錯誤訊息Modal or 設定提示多錯誤訊息Modal
	 * @param {string} content
	 * @param {string} title
	*/
  public alertError(option: OptionModal) {
  	const title = this.h('div', { attrs: { class: 'alert__modal__title' } }, option.title || '錯誤');
  	// content 可支援 string | string[]
  	const content = (typeof option.content == 'string')
  		? this.h('div', { attrs: { class: 'alert__modal__content' } }, option.content)
  		: this.h('ul', {
  			attrs: { class: 'alert__modal__list' },
  		}, option.content.map((x) => this.h('li', x)));
  	const icon = (h) => h('a-icon', {
  		attrs:
			{
				type: 'close-circle',
				theme: 'filled',
				class: 'modal__icon modal__icon--error',
			},
  	});
  	if (option.confirm) {
  		Modal.confirm({
  			icon,
  			title,
  			width: option.width || '474px',
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			okType: option.okType || 'error',
  			okText: '確定',
  			cancelText: '取消',
  			onOk: option.onCallback,
  			// okButtonProps: {
  			// 	disabled: true,
  			// },
  		});
  	} else {
  		Modal.error({
  			title,
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			width: option.width || '474px',
  			okText: '確定',
  			okType: option.okType || 'error',
  			icon,
  			onOk: option.onCallback,
  		});
  	}
  }

  /**
	 * @summary 設定提示單一成功訊息Modal or 設定提示多成功訊息Modal
	 * @param {string} content
	 * @param {string} title
	*/
  public alertSuccess(option: OptionModal) {
  	const title = this.h('div', { attrs: { class: 'alert__modal__title' } }, option.title || '成功');
  	// content 可支援 string | string[]
  	// 組裝 content
  	const content = (typeof option.content == 'string')
  		? this.h('div', { attrs: { class: 'alert__modal__content' } }, option.content)
  		: this.h('ul', {
  			attrs: { class: 'alert__modal__list' },
  		}, option.content.map((x) => this.h('li', x)));
  	// 組裝 icon
  	const icon = (h) => h('a-icon', {
  		attrs:
			{
				type: 'check-circle',
				theme: 'filled',
				class: 'modal__icon modal__icon--success',
			},
  	});
  	if (option.confirm) {
  		Modal.confirm({
  			icon,
  			title,
  			width: option.width || '474px',
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			okType: option.okType || 'confirm',
  			okText: '確定',
  			cancelText: '取消',
  			class: 'modal__custom__confirm',
  			onOk: option.onCallback,
  		});
  	} else {
  		Modal.success({
  			title,
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			width: option.width || '474px',
  			okText: '確定',
  			okType: option.okType || 'confirm',
  			class: 'alert-modal modal__custom__confirm with__single__btn',
  			icon,
  			onOk: option.onCallback,
  		});
  	}
  }

	/**
	 * @summary 設定提示單一提醒訊息Modal or 設定提示多提醒訊息Modal
	 * @param {string} content
	 * @param {string} title
	*/
  public alertInfo(option: OptionModal) {
  	const title = this.h('div', { attrs: { class: 'alert__modal__title' } }, option.title || '提醒');
  	// content 可支援 string | string[]
  	const content = (typeof option.content == 'string')
  		? this.h('div', { attrs: { class: 'alert__modal__content' } }, option.content)
  		: this.h('ul', {
  			attrs: { class: 'alert__modal__list' },
  		}, option.content.map((x) => this.h('li', x)));
  	const icon = (h) => h('a-icon', {
  		attrs:
			{
				type: 'exclamation-circle',
				theme: 'filled',
				class: 'modal__icon modal__icon--error',
			},
  	});
  	if (option.confirm) {
  		Modal.confirm({
  			icon,
  			title,
  			width: option.width || '474px',
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			okType: option.okType || 'error',
  			okText: '確定',
  			cancelText: '取消',
  			onOk: option.onCallback,
  			// okButtonProps: {
  			// 	disabled: true,
  			// },
  		});
  	} else {
  		Modal.error({
  			title,
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			width: option.width || '474px',
  			okText: '確定',
  			okType: option.okType || 'error',
  			icon,
  			onOk: option.onCallback,
  		});
  	}
  }
}();
