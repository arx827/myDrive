import Vue from 'vue';

declare module 'vue/types/vue' {
	interface Vue {
		$ipEnum: GlobalIpEnum;
	}
}

export class GlobalIpEnum extends Vue {
	// 常用常數
	public constant = {
		ADD: { key: '新增', val: 'A' },
		MODIFY: { key: '修改', val: 'M' },
		DELETE: { key: '刪除', val: 'D' },
		STOP: { key: '停用', val: 'S' },
		RENAME: { key: '重新命名', val: 'R' },
		UPLOAD: { key: '整批上傳', val: 'U' },
		UNCHECK: { key: '維護中', val: 'U' },
		HISTORY: { key: '歷史件', val: 'H' },
		EXPORT: { key: '匯出', val: 'E' },
		DOWNLOAD: { key: '下載', val: 'D' },
		CANCEL: { key: '取消', val: 'C' },
		CANCEL_ALL: { key: '全部取消', val: 'A' },
		FILTER_CONDITION: { key: '篩選條件', val: 'F' },
		COPY: { key: '複製新增', val: 'CA' },
	}

	// 報表狀態常數
	public caseStatusConstant = {
		UNCHECK: { key: '維護中', val: 'U' },
		ENABLE: { key: '適用中', val: 'E' },
		HISTORY: { key: '歷史件', val: 'H' },
		BATCH_REVIEW: { key: '整批上傳', val: 'B' },
		WAIT_APPROVAL: { key: '待審核', val: 'B' },
		WAIT: { key: '待審核', val: 'W' },
		REJECT: { key: '已拒絕', val: 'R' },
		PAUSE: { key: '已停用', val: 'P' },
		INVALID: { key: '系統作廢', val: 'I' },
	}

	// 操作按鈕常數
	public actionButton = {
		CHECK: { key: '送審', val: 'C' },
		SAVE: { key: '儲存', val: 'S' },
	}

	// 覆核常數
	public reviewStatus = {
		REJECT: { key: '拒絕', val: 'R' },
		APPROVAL: { key: '放行', val: 'A' },
	}

	// 數字常數
	public numberConstant = {
		ONE: '1',
		TWO: '2',
		THREE: '3',
		FOUR: '4',
		FIVE: '5',
		SIX: '6',
		SEVEN: '7',
	}

	// 數字轉中文數字
	numToString = {
		1: '一',
		2: '二',
		3: '三',
		4: '四',
		5: '五',
		6: '六',
		7: '七',
		8: '八',
		9: '九',
		10: '十',
		11: '十一',
		12: '十二',
	}

	// 部門常數
	public departmentConstant = {
		DEPARTMENT_CONFIRM: 'C', // 投確
		DEPARTMENT_PLANNING: 'P', // 投規
		DEPARTMENT_ACCOUNTING: 'A', // 投會
		DEPARTMENT_RISK: 'R', // 風險精算
	}

	// 狀態燈號常數
	public caseStatusEnum = [
		{ key: '整批上傳', val: 'B', color: '#2894FF' }, // 藍
		{ key: '維護中', val: 'U', color: '#BEBEBE' }, // 淺灰
		{ key: '歷史件', val: 'H', color: '#3c6e71' }, // 墨綠
		{ key: '適用中', val: 'E', color: '#00BB00' }, // 綠
		{ key: '已拒絕', val: 'R', color: '#FF0000' }, // 紅
		{ key: '已停用', val: 'P', color: '#d36720' }, // 橘
		{ key: '待審核', val: 'W', color: '#ffbe0b' }, // 黃
		{ key: '待審核', val: 'F', color: '#ffbe0b' }, // 黃(待放行清單)
		{ key: '系統作廢', val: 'I', color: '#8E8E8E' }, // 深灰
	]

	// 操作類型
	public actionEnum = [
		{
			key: '新增',
			val: 'A',
			icon: [
				{ key: '檢視', val: 'search' },
			],
		},
		{
			key: '修改',
			val: 'M',
			icon: [
				{ key: '檢視', val: 'search' },
			],
		},
		{
			key: '停用',
			val: 'S',
			icon: [
				{ key: '檢視', val: 'search' },
			],
		},
		{
			key: '整批上傳',
			val: 'U',
			icon: [
				{ key: '整批上傳', val: 'paper-clip' },
			],
		},
	]

	// 更多操作 actionType
	public getReportDownloadOptionsEnum = [
		{
			key: 'B', // 排程中
			val: [
				{ label: '篩選條件', value: 'F' },
				{ label: '取消當次', value: 'C' },
				{ label: '取消全部', value: 'A' },
			],
		},
		{
			key: 'U', // 等待中
			val: [
				{ label: '篩選條件', value: 'F' },
				{ label: '取消當次', value: 'C' },
				{ label: '取消全部', value: 'A' },
			],
		},
		{
			key: 'H', // 作業中
			val: [
				{ label: '篩選條件', value: 'F' },
			],
		},
		{
			key: 'E', // 已完成
			val: [
				{ label: '篩選條件', value: 'F' },
				{ label: '下載', value: 'D' },
			],
		},
		{
			key: 'A', // 全部取消
			val: [
				{ label: '篩選條件', value: 'F' },
			],
		},
		{
			key: 'R', // 當次取消
			val: [
				{ label: '篩選條件', value: 'F' },
			],
		},
		{
			key: 'W', // 產檔失敗
			val: [
				{ label: '篩選條件', value: 'F' },
			],
		},
	]

	// 投資準則目標區間維護 更多操作 actionType
	public getIpOptionsEnum = [
		// 適用中(E)/待審核(W)/已拒絕(R)/已停用(P)/維護中(U)/歷史件(H)/整批上傳(B)
		{
			key: 'E',
			val: [
				{ label: '修改', value: 'M' },
				{ label: '停用', value: 'S' },
				{ label: '複製新增', value: 'CA' },
			],
		},
		{
			key: 'U',
			val: [
				{ label: '修改', value: 'M' },
				{ label: '刪除', value: 'D' },
			],
		},
		{
			key: 'R',
			val: [
				{ label: '複製新增', value: 'CA' },
			],
		},
		{
			key: 'P',
			val: [
				{ label: '複製新增', value: 'CA' },
			],
		},
	]

	// 投資準則目標區間維護 更多操作 actionType
	public getIpAdjustmentOptionsEnum = [
		// 適用中(E)/待審核(W)/已拒絕(R)/已停用(P)/維護中(U)/歷史件(H)/整批上傳(B)
		{
			key: 'E',
			val: [
				{ label: '修改', value: 'M' },
				{ label: '複製新增', value: 'CA' },
			],
		},
		{
			key: 'R',
			val: [
				{ label: '複製新增', value: 'CA' },
			],
		},
		{
			key: 'U',
			val: [
				{ label: '送審', value: 'C' },
				{ label: '修改', value: 'M' },
				{ label: '刪除', value: 'D' },
			],
		},
	]

	// 會計資料維護設定 更多操作 actionType
	public getIpActInputOptionsEnum = [
		// 適用中(E)/待審核(W)/已拒絕(R)/已停用(P)/維護中(U)/歷史件(H)/整批上傳(B)
		{
			key: 'E',
			val: [
				{ label: '修改', value: 'M' },
			],
		},
		{
			key: 'U',
			val: [
				{ label: '修改', value: 'M' },
				{ label: '刪除', value: 'D' },
			],
		},
		{
			key: 'U',
			val: [],
		},
	]

	// 報表狀態燈號常數
	public reportStatusEnum = [
		{ key: '排程中', val: 'B', color: '#2894FF' }, // 藍
		{ key: '等待中', val: 'U', color: '#ffbe0b' }, // 黃
		{ key: '作業中', val: 'H', color: '#d36720' }, // 橘
		{ key: '已完成', val: 'E', color: '#00BB00' }, // 綠
		{ key: '全部取消', val: 'A', color: '#8E8E8E' }, // 深灰
		{ key: '當次取消', val: 'R', color: '#BEBEBE' }, // 淺灰
		{ key: '產檔失敗', val: 'W', color: '#FF0000' }, // 紅
	]

	// ---------------------下拉選單區塊-------------------------------

	// [資產區隔管理][進階查詢] 報表查詢方式下拉選單
	public reportSetupOption = [
		{ label: '立即執行', value: 'N' },
		{ label: '後續執行', value: 'A' },
		{ label: '排程執行', value: 'B' },
	]

	// [資產區隔管理][進階查詢] 報表名稱下拉選單
	public reportNameOption = [
		{ label: 'iaNewFwdTran_衍商到期損益報表', value: 'IpIaNewFwdTranReport' },
		{ label: 'ipAllocation_資產區隔庫存報表', value: 'IpAllocationReport' },
		{ label: 'ipDetail_庫存報表', value: 'IpDetailReport' },
		{ label: 'ipESG', value: 'IpEsgReport' },
		{ label: 'ipMandateDetail', value: 'IpMandatedetailReport' },
		{ label: 'ipMandateSum', value: 'IpMandatesumReport' },
		{ label: 'ipSBT_Fund', value: 'IpSbtFundReport' },
		{ label: 'ipSBT_Stk_Bond', value: 'IpSbtStkBondReport' },
		{ label: 'ipTrans_Sum_Buy', value: 'IpTransSumBuyReport' },
		{ label: 'ipTrans_Sum_Sel', value: 'IpTransSumSelReport' },
		{ label: 'ipTrans_交易報表', value: 'IpTransReport' },
	]

	// [資產區隔管理][進階查詢] 衍商到期損益報表查詢欄位下拉選單
	public ipIaNewFwdTranReportOption = [
		{ label: 'PORTFOLIO', value: 'PORTFOLIO' },
		{ label: 'DF/NDF/SWAP', value: 'DFNDFSWAP' },
		{ label: '交易日', value: 'TRADE_DATE' },
		{ label: '交割日', value: 'SETTLE_DATE' },
		{ label: '定價日/Rollover Date', value: 'FIXING_DATE' },
		{ label: '到期交割日', value: 'TERMINATE_DATE' },
	]

	// [資產區隔管理][進階查詢] 交易報表查詢欄位下拉選單
	public ipTransReportOption = [
		{ label: '交易別', value: 'TRANSACTION_TYPE' },
		{ label: '交易日', value: 'TRADE_DATE' },
		{ label: '交割日', value: 'SETTLE_DATE' },
		{ label: '投資分類代碼及英文', value: 'INVESTMENT_CATEGORY_CODE	' },
		{ label: '投資分類中文', value: 'INVESTMENT_CATEGORY' },
		{ label: '投資準則分類代碼', value: 'TERMINATE_DATE' },
		{ label: '投資準則分類', value: 'MANDATE18_CODE' },
		{ label: '投資準則大分類', value: 'MANDATE_CATEGORY' },
		{ label: '幣別', value: 'CURRENCY' },
		{ label: '資產區隔', value: 'ASSET_SEGMENTATION' },
		{ label: '資產管理單位', value: 'ASSETS_MANAGER' },
		{ label: '公報分類', value: 'ACCOUNTING_CLASSIFICATION' },
	]

	// [資產區隔管理][進階查詢] 庫存報表查詢欄位下拉選單
	public ipDetailReportOption = [
		{ label: '投資分類代碼及英文', value: 'INVESTMENT_CATEGORY_CODE' },
		{ label: '投資分類中文', value: 'INVESTMENT_CATEGORY' },
		{ label: '投資準則分類代碼', value: 'MANDATE18_CODE' },
		{ label: '投資準則分類', value: 'MANDATE18' },
		{ label: '投資準則大分類', value: 'MANDATE_CATEGORY' },
		{ label: '資產區隔', value: 'ASSET_SEGMENTATION' },
		{ label: '資產管理單位', value: 'ASSETS_MANAGER' },
		{ label: '最後一個交易日期', value: 'TRADE_DATE_LAST' },
		{ label: '幣別', value: 'CURRENCY' },
		{ label: '公報分類', value: 'ACCOUNTING_CLASSIFICATION' },
		{ label: 'Next Call Date', value: 'NEXT_CALL_DATE' },
	]

	// [資產區隔管理][進階查詢] 報表報表產出檔名下拉選單
	public reportExportNameOption = [
		{ label: '報表名稱', value: 'name' },
		{ label: '報表名稱+查詢資料日期(區間)', value: 'nameDate' },
	]

	// 頻率選項
	public frequencyOption = [
		{ label: '每隔()日', value: '1' },
		{ label: '週頻率', value: '2' },
		{ label: '月頻率', value: '3' },
	]

	// [資產區隔管理][進階查詢] 資料基準日/資料截至日下拉選單
	public dataBasicDateTypeOption = [
		{ label: '上月', value: '01' },
		{ label: '本月', value: '02' },
		{ label: '執行排程當日', value: '03' },
		{ label: '本月月初', value: '04' },
		{ label: '前一個月月初', value: '05' },
		{ label: '前一個月月底', value: '06' },
		{ label: '執行排程日前1日', value: '07' },
		{ label: '執行排程日前2日', value: '08' },
		{ label: '執行排程日前3日', value: '09' },
		{ label: '執行排程日前4日', value: '10' },
		{ label: '執行排程日前5日', value: '11' },
		{ label: '執行排程日前6日', value: '12' },
		{ label: '執行排程日前7日', value: '13' },
	]

	// [資產區隔管理][進階查詢] 資料起始日下拉選單
	public dataStartDateTypeOption = [
		{ label: '上月', value: '01' },
		{ label: '本月', value: '02' },
		{ label: '執行排程當日', value: '03' },
		{ label: '本月月初', value: '04' },
		{ label: '前一個月月初', value: '05' },
		{ label: '前一個月月底', value: '06' },
		{ label: '資料截至日前1日', value: '07' },
		{ label: '資料截至日前2日', value: '08' },
		{ label: '資料截至日前3日', value: '09' },
		{ label: '資料截至日前4日', value: '10' },
		{ label: '資料截至日前5日', value: '11' },
		{ label: '資料截至日前6日', value: '12' },
		{ label: '資料截至日前7日', value: '13' },
	]

	// 設定項目下拉選單
	public settingItemOption = [
		{ label: 'RP種類設定', value: 'RPTS' },
		{ label: 'RP配置之資產區隔設定', value: 'RPASS' },
		{ label: '衍商損益分攤設定', value: 'DPLAS' },
		{ label: '衍商損益分攤項目設定', value: 'DPLAIS' },
		{ label: '國內固收RP報表設定', value: 'FIS' },
		{ label: '精算保費調整設定', value: 'AIS' },
	]

	// 篩選方式進階查詢下拉選單
	public filterMethodOption = [
		{
			label: '= 等於',
			value: '=',
		},
		{
			label: '≠ 不等於',
			value: '!=',
		},
		{
			label: '> 大於',
			value: '>',
		},
		{
			label: '>= 大於等於',
			value: '>=',
		},
		{
			label: '< 小於',
			value: '<',
		},
		{
			label: '<= 小於等於',
			value: '<=',
		},
	]

	// 取得週排程選項
	public weekCheckOptionList: any = [
		{ label: '星期一', value: '2' },
		{ label: '星期二', value: '3' },
		{ label: '星期三', value: '4' },
		{ label: '星期四', value: '5' },
		{ label: '星期五', value: '6' },
		{ label: '星期六', value: '7' },
		{ label: '星期日', value: '1' },
	]

	// [資產區隔管理][進階查詢] 報表名稱下拉選單
	public ipIgRangeOption = [
		{ label: '國內固定收益', value: '1' },
		{ label: '放款', value: '2' },
		{ label: '國外固定收益', value: '3' },
		{ label: '變動收益', value: '4' },
	]

	// 資產區隔 - 投資準則目標區間維護 明細下載選項
	public ipIgRangeDownloadOptions: any = [
		{ label: '全部資料', value: 1 },
		{ label: '全部資產區隔維護差異比較', value: 2 },
		{ label: 'TRADITION維護差異比較', value: 3 },
		{ label: 'ISL維護差異比較', value: 4 },
		{ label: 'ANNUITY維護差異比較', value: 5 },
		{ label: 'LIFE維護差異比較', value: 6 },
		{ label: 'PAR_ANTAI維護差異比較', value: 7 },
		{ label: 'PAR_FUBON維護差異比較', value: 8 },
		{ label: 'Foreign Policy(USD & UAD)維護差異比較', value: 9 },
		{ label: 'F_ISL (USD)維護差異比較', value: 10 },
		{ label: 'Foreign Policy(CNY)維護差異比較', value: 11 },
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

	public getObject(objName, index) {
		if (this[objName].find((i) => i.val === index)) {
			return this[objName].find((i) => i.val === index);
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
		Vue.prototype.$ipEnum = this;
	}
}
export default new GlobalIpEnum();
