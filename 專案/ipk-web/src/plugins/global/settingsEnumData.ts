import Vue from 'vue';
import { keys } from 'xe-utils';

declare module 'vue/types/vue' {
	interface Vue {
		$settingsEnum: SettingsEnum;
	}
}
interface keyVal {
	key: string | number;
	val: string | Array<any>;
}

interface Option {
	label: string;
	value: any;
}

export class SettingsEnum extends Vue {
	// 常數
	public constant = {
		ADD: { label: '新增', value: 'A' },
		MODIFY: { label: '修改', value: 'M' },
		ENABLE: { label: '啟用', value: 'Y' },
		DISABLE: { label: '停用', value: 'N' },
	}

	public columns = {
		TITLE: { label: '標題', value: 'title' },
		SUBJECT: { label: '主旨', value: 'noticeSubject' },
		CONTENT: { label: '內容', value: 'noticeContent' },
		PUBLISH_DATE: { label: '發佈日', value: 'publishDate' },
		EXPIRY_DATE: { label: '到期日', value: 'expiryDate' },
		UNFINISHED: { label: '未完成', value: 'unfinished' },
		CAN_APPROVE: { label: '可覆核', value: 'canApprove' },
	}

	public noticeType = {
		EMAIL: { label: '信件', value: 'EMAIL' },
		NOTICE: { label: '通知', value: 'NOTICE' },
	}

	// ---------------------下拉選單區塊-------------------------------
	// 操作類型
	public getOptionsEnum = [
		// 啟用(EA), 停用(DA)
		{
			label: this.constant.ENABLE.value,
			value: [
				this.constant.MODIFY,
				this.constant.DISABLE,
			],
		},
		{
			label: this.constant.DISABLE.value,
			value: [
				this.constant.MODIFY,
				this.constant.ENABLE,
			],
		},
	]

	public noticeOperationOptionEnum = [
		{
			label: this.constant.MODIFY.value,
			value: [
				this.constant.MODIFY,
			],
		},
	]

	// 公告設定 - 公告狀態
	public announcementStatus = [
		{ ...this.constant.ENABLE, color: '#00BB00' }, // 綠
		{ ...this.constant.DISABLE, color: '#8E8E8E' }, // 深灰
	]

	// 公告設定 - 公告類類型
	public announcementType = [
		{ label: '重要', value: 'CRITICAL', color: '#f5222d' }, // 紅
		{ label: '系統', value: 'SYSTEM', color: '#2894FF' }, // 藍
		{ label: '一般', value: 'NORMAL', color: '#8E8E8E' }, // 深灰
	]

	// ---------------------func-------------------------------

	public getObject(objName, index) {
		if (this[objName].find((i) => i.value === index)) {
			return this[objName].find((i) => i.value === index);
		}
		return '';
	}

	public getLabel(objName, index) {
		if (this[objName].find((i) => i.value === index)) {
			return this[objName].find((i) => i.value === index).label;
		}
		return '';
	}

	public getValue(objName, index) {
		if (this[objName].find((i) => i.label === index)) {
			return this[objName].find((i) => i.label === index).value;
		}
		return '';
	}

	public install(Vue) {
		Vue.prototype.$settingsEnum = this;
	}
}
export default new SettingsEnum();
