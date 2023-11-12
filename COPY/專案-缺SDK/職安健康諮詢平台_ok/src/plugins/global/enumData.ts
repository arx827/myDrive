import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    $enum: GlobalEnum;
  }
}
interface keyVal {
  key: string | number;
  val: string;
}
export class GlobalEnum extends Vue {
  // 頁數
  public pageEnum: { key: string; page: string }[] = [
  	{ key: 'A', page: '10' },
  	{ key: 'B', page: '25' },
  	{ key: 'C', page: '50' },
  ];

	// 頁面新增/編輯
	paramsTypeEnum: Array<any> = [
  	{
  		key: 'edit',
  		val: '編輯',
  	},
  	{
  		key: 'add',
  		val: '新增',
  	},
	]

	// 服務場次管理-活動狀態
	public releaseStatusEnum: keyVal[] = [
		{
			key: '0',
			val: '暫存',
		},
		{
			key: '1',
			val: '待發布',
		},
		{
			key: '2',
			val: '已發布',
		},
	]

	// 服務場次管理-發布活動設定
	public publicStatusEnum: keyVal[] = [
		{
			key: '0',
			val: '自動',
		},
		{
			key: '1',
			val: '手動',
		},
	]

	// 星期
	public weeksEnum = [
  	{ key: '1', val: '一' },
  	{ key: '2', val: '二' },
  	{ key: '3', val: '三' },
  	{ key: '4', val: '四' },
  	{ key: '5', val: '五' },
  	{ key: '6', val: '六' },
  	{ key: '7', val: '日' },
	];

	// 活動與場次維護-活動狀態
	public actStatusEnum: keyVal[] = [
		{
			key: 0,
			val: '暫存',
		},
		{
			key: 1,
			val: '進行中',
		},
		{
			key: 2,
			val: '已結束',
		},
	]

	// 活動與場次維護-活動類型
	public sessionTypeEnum: keyVal[] = [
		{
			key: 1,
			val: '實體',
		},
		{
			key: 2,
			val: '線上',
		},
	]

	// 問卷題型
	serveyQuestTypeEnum: keyVal[] = [
		{
			key: 0, val: 'title',
		},
		{
			key: 1, val: 'text',
		},
		{
			key: 2, val: 'textarea',
		},
		{
			key: 3, val: 'radio',
		},
		{
			key: 4, val: 'checkBox',
		},
		{
			key: 5, val: 'inputNumber',
		},
		{
			key: 6, val: 'rate',
		},
		{
			key: 7, val: 'matrix',
		},
	]

	reviewStatusEnum: keyVal[] = [
		{
			key: '1', val: '同意',
		},
		{
			key: '2', val: '退回',
		},
		{
			key: '3', val: '全部',
		},
	]

	execActionEnum: keyVal[] = [
		{
			key: 'CREATE', val: '新增',
		},
		{
			key: 'READ', val: '查詢',
		},
		{
			key: 'UPDATE', val: '修改',
		},
		{
			key: 'DELETE', val: '刪除',
		},
	]

	srcFromEnum: keyVal[] = [
		{
			key: 'D0101', val: '健康快e通',
		},
		{
			key: 'D0102', val: '母性健康保護',
		},
		{
			key: 'D0103', val: '異常負荷預防',
		},
		{
			key: 'D0104', val: '人因危害預防',
		},
		{
			key: 'D0105', val: '醫師諮詢服務',
		},
	]

	// ---------------------func-------------------------------
	public getKey(objName, index) {
  	if (this[objName].find((i) => i.val === index)) {
  		return this[objName].find((i) => i.val === index).key;
  	}
  	return '';
	}

	public getVal(objName, index) {
  	if (this[objName].find((i) => i.key === index)) {
  		return this[objName].find((i) => i.key === index).val;
  	}
  	return '';
	}

	public install(Vue) {
  	Vue.prototype.$enum = this;
	}
}
export default new GlobalEnum();
