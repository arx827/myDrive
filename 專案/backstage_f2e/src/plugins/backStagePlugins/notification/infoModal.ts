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
	class?: string;
	disabled?: boolean;
	okText?: string;
	cancelText?: string;
	customContent?: () => any | any;
	onCallback?: () => any;
	onCancel?: () => any;
}

export default new class InfoModal {
  vm = new Vue()

  h = this.vm.$createElement;

	currentModal = null;

	/**
	 * @summary 設定提示單一錯誤訊息Modal or 設定提示多錯誤訊息Modal
	 * @param {string} content
	 * @param {string} title
	*/
	public alertError(option: OptionModal) {
  	const title = this.h('div', { attrs: { class: 'alert__modal__title' } }, option.title || '錯誤訊息');
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
  		this.currentModal = Modal.confirm({
  			icon,
  			title,
  			width: option.width || '474px',
  			content: option.customContent ? (h) => h('div', {}, [
  				content,
  				option.customContent(),
  			]) : content,
  			okType: option.okType || 'error',
  			okText: option.okText || '確定',
  			cancelText: option.cancelText || '取消',
  			class: `${option.class} modal__custom__confirm fubon-backStage_ant-modal` || 'modal__custom__confirm fubon-backStage_ant-modal',
  			onOk: option.onCallback,
  			onCancel: option.onCancel,
  			okButtonProps: {
  				props: {
  					disabled: option.disabled,
  				},
  			},
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
  			okType: option.okType || 'danger',
  			class: `${option.class} alert-modal modal__custom__confirm with__single__btn fubon-backStage_ant-modal` || 'alert-modal modal__custom__confirm with__single__btn fubon-backStage_ant-modal',
  			icon,
  			onOk: option.onCallback,
  			okButtonProps: {
  				props: {
  					disabled: option.disabled,
  				},
  			},
  		});
  	}
	}

	/**
	 * @summary 設定提示單一成功訊息Modal or 設定提示多成功訊息Modal
	 * @param {string} content
	 * @param {string} title
	*/
	public alertSuccess(option: OptionModal) {
  	const title = this.h('div', { attrs: { class: 'alert__modal__title' } }, option.title || '成功訊息');
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
				type: 'exclamation-circle',
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
  			okType: option.okType || 'error',
  			okText: option.okText || '確定',
  			cancelText: option.cancelText || '取消',
  			class: `${option.class} modal__custom__confirm fubon-backStage_ant-modal` || 'modal__custom__confirm fubon-backStage_ant-modal',
  			onOk: option.onCallback,
  			onCancel: option.onCancel,
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
  			class: `${option.class} alert-modal modal__custom__confirm with__single__btn fubon-backStage_ant-modal` || 'alert-modal modal__custom__confirm with__single__btn fubon-backStage_ant-modal',
  			icon,
  			onOk: option.onCallback,
  			onCancel: option.onCancel,
  		});
  	}
	}

	public destroy() {
  	Modal.destroyAll();
	}

	// 更新Modal按鈕的disabled狀態
	public changeOkBtn(status) {
  	this.currentModal.update({
  		okButtonProps: { props: { disabled: status } },
  	});
	}
}();
