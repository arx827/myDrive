import Vue from 'vue';

declare module 'vue/types/vue' {
	interface Vue {
		$actEnum: GlobalActEnum;
	}
}
interface Option {
	label: string;
	value: any;
}
export class GlobalActEnum extends Vue {
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
		LOCK: { key: '鎖定', val: 'L' },
	}

	// 操作類型常數 (icon顯示樣式)
	public actionConstant = {
		SEARCH: { key: '檢視', val: 'search' },
		COPY: { key: '複製_新增', val: 'copy' },
		UPLOAD: { key: '整批上傳', val: 'paper-clip' },
	}

	// 是/否 字串常數
	public yesOrNoConstant = {
		YES: { label: '是', value: 'Y' },
		NO: { label: '否', value: 'N' },
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

	// 英文常數
	public wordConstant = {
		DAILY: 'D',
		MONTH: 'M',
	}

	// 部門常數
	public departmentConstant = {
		DEPARTMENT_CONFIRM: 'C', // 投確
		DEPARTMENT_PLANNING: 'P', // 投規
		DEPARTMENT_ACCOUNTING: 'A', // 投會
		DEPARTMENT_RISK: 'R', // 風險精算
		DEPARTMENT_SYS: 'S', // 投系
	}

	// 狀態燈號常數
	public caseStatusEnum = [
		{ key: '整批上傳', val: 'B', color: '#2894FF' }, // 藍
		{ key: '維護中', val: 'U', color: '#BEBEBE' }, // 淺灰
		{ key: '歷史件', val: 'H', color: '#3c6e71' }, // 墨綠
		{ key: '適用中', val: 'E', color: '#00BB00' }, // 綠
		{ key: '已拒絕', val: 'R', color: '#FF0000' }, // 紅
		{ key: '待審核', val: 'W', color: '#ffbe0b' }, // 黃
		{ key: '待審核', val: 'F', color: '#ffbe0b' }, // 黃(待放行清單)
		{ key: '系統作廢', val: 'I', color: '#8E8E8E' }, // 深灰
	]

	// 狀態燈號常數
	public caseStatusGeneralLedgerEnum = [
		{ key: '待轉入', val: '1', color: '#ffbe0b' }, // 黃
		{ key: '中介已介接', val: '2', color: '#d36720' }, // 橘
		{ key: '總帳回傳傳票號碼', val: '3', color: '#00BB00' }, // 綠
		{ key: '異常', val: 'E', color: '#FF0000' }, // 紅
		{ key: '試算表寫入成功', val: '4', color: '#2894FF' }, // 藍
		{ key: '匯出傳票明細檔', val: '5', color: '#d36720' }, // 橘
		{ key: '匯入傳票號碼', val: '6', color: '#d36720' }, // 橘
	]

	// 狀態燈號常數
	public caseStatusAlmGeneralLedgerEnum = [
		{ key: '待轉入', val: '1', color: '#ffbe0b' }, // 黃
		{ key: '已轉入', val: '2', color: '#00BB00' }, // 綠
		{ key: '轉入異常', val: 'E', color: '#FF0000' }, // 紅
	]

	// 批次-是否開始排程燈號常數
	public isExecutableEnum = [
		{ key: '輪巡中', val: 'Y', color: '#00BB00' }, // 綠
		{ key: '暫停', val: 'N', color: '#FF0000' }, // 紅
	]

	// 批次設定-更多操作 actionType
	public getBatchOptionsEnum: any = [
		{ label: '執行', value: 'S' },
		{ label: '修改', value: 'M' },
		{ label: '歷程', value: 'H' },
	]

	// 批次紀錄-更多操作 actionType
	public getBatchLogOptionsEnum: any = [
		{ label: '下載明細', value: 'D' },
		{ label: '檢視明細', value: 'H' },
	]

	// 批次紀錄-更多操作 actionType
	public getActBatchLogOptionsEnum: any = [
		{ label: '檢視明細', value: 'H' },
	]

	// 批次狀態標籤常數
	public batchLogStatusEnum = [
		{ key: 'COMPLETED', val: 'COMPLETED', color: 'green' }, // 綠
		{ key: 'FAILED', val: 'FAILED', color: 'red' }, // 紅
	]

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

	// 資料明細狀態常數
	public caseStatusConstant = {
		UNCHECK: { key: '維護中', val: 'U' },
		ENABLE: { key: '適用中', val: 'E' },
		HISTORY: { key: '歷史件', val: 'H' },
		BATCH_REVIEW: { key: '整批上傳', val: 'B' },
		WAIT_APPROVAL: { key: '待審核', val: 'B' },
		REJECT: { key: '已拒絕', val: 'R' },
	}

	// 介接總帳記錄檔狀態常數
	public generalStatusConstant = {
		WAIT: { key: '待轉入', val: '1' },
		CATCHED: { key: '中介已介接', val: '2' },
		RETURN: { key: '總帳回傳傳票號碼', val: '3' },
		ERROR: { key: '異常', val: 'E' },
		WRITE: { key: '試算表寫入成功', val: '4' },
		EXPORT: { key: '匯出傳票明細檔', val: '5' },
		IMPORT: { key: '匯入傳票號碼', val: '6' },
	}

	// 更多操作 actionType
	public getOptionsEnum = [
		// 適用中(E)/待審核(W)/已拒絕(R)/維護中(U)/歷史件(H)/整批上傳(B)
		{
			key: 'E',
			val: [
				{ label: '修改', value: 'M' },
				{ label: '停用', value: 'S' },
			],
		},
		{
			key: 'U',
			val: [
				{ label: '修改', value: 'M' },
				{ label: '刪除', value: 'D' },
				{ label: '送審', value: 'C' },
			],
		},
	]

	// 更多操作 傳票明細狀態status : 介接總帳記錄檔狀態常數(generalStatusConstant)
		// TODO: 1.2.5.6 是???
	public getOptionsStatusEnum = [
		{
			key: '1',
			val: [
				{ label: '鎖定', value: 'L' },
			],
		},
		{
			key: '2',
			val: [
				{ label: '匯出', value: 'E' },
			],
		},
		{
			key: '5',
			val: [
				{ label: '匯出', value: 'E' },
			],
		},
		{
			key: '6',
			val: [
				{ label: '匯出', value: 'E' },
			],
		},
	]

	// 操作類型 (icon顯示樣式)
	public actionEnum = [
		{
			key: '新增',
			val: 'A',
			icon: [
				{ ...this.actionConstant.SEARCH },
			],
		},
		{
			key: '修改',
			val: 'M',
			icon: [
				{ ...this.actionConstant.SEARCH },
			],
		},
		{
			key: '停用',
			val: 'S',
			icon: [
				{ ...this.actionConstant.SEARCH },
			],
		},
		{
			key: '整批上傳',
			val: 'U',
			icon: [
				{ ...this.actionConstant.UPLOAD },
			],
		},
	]

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

	// ---------------------------------下拉選單---------------------------------

	// 取得台/外幣活存下拉選單
	public surviveCurrencyList: Array<Option> = [
		{ label: '台幣活存', value: '台幣活存' },
		{ label: '外幣活存', value: '外幣活存' },
	]

	// 取得帳戶歸屬下拉選單
	public accountBelongList: Array<Option> = [
		{ label: '投資戶', value: '投資戶' },
		{ label: '財務戶', value: '財務戶' },
	]

	// 取得貨幣性/非貨幣性下拉選單 後端接中文value
	public tranMoneyMarketList: Array<Option> = [
		{ label: '貨幣性', value: '貨幣性' },
		{ label: '非貨幣性', value: '非貨幣性' },
	]

	// 取得國內外下拉選單
	public internationalCodeList: Array<Option> = [
		{ label: 'DOM', value: 'DOM' },
		{ label: 'FOR', value: 'FOR' },
	]

	// 取得結算作業下拉選單
	public processTypeList: Array<Option> = [
		{ label: 'D', value: 'D-日結' },
		{ label: 'M', value: 'M-月結' },
	]

	// 取得是否作廢下拉選單
	public repealList: Array<Option> = [
		{ label: '1:是', value: '1' },
		{ label: '0:否', value: '0' },
	]

	// 取得是否迴轉下拉選單
	// TODO: 選項不顯示中文??
	public reversalStatusList: Array<Option> = [
		{ label: 'Y', value: 'Y' },
		{ label: 'N', value: 'N' },
	]

	// 取得迴轉時點下拉選單
	public reversalDayList: Array<Option> = [
		{ label: '次月初', value: 'F' },
		{ label: '次月底', value: 'E' },
	]

	// TODO: 報表下拉選單是動態???
	// 取得報表下拉選單
	public reportCodeList: Array<Option> = [
		{ label: 'iaBondTran', value: '01' },
		{ label: 'iaIntReceived', value: '02' },
		{ label: '國內外股票.基金公版-報表-交易', value: '03' },
		{ label: '國內外股票.基金公版-報表-股利', value: '04' },
		{ label: 'iaNewFwdTran_交易明細表', value: '05' },
		{ label: 'iaNewFwdTran_到期明細表', value: '06' },
		{ label: 'IRS and CCS新作明細表', value: '07' },
		{ label: 'IRS and CCS提解/到期明細表', value: '08' },
		{ label: 'IRS and CCS 收付息明細表', value: '09' },
		{ label: '還券交易明細表', value: '10' },
		{ label: '預付款報表_交易成交單_預計成交繳款', value: '11' },
		{ label: '預付款報表_交易通知單_實際成交', value: '12' },
	]

	// 取得報表下拉選單
	public monthReportCodeList: Array<Option> = [
		{ label: 'iaIntReceived', value: '01' },
		{ label: 'iaAccrInt_T', value: '02' },
		{ label: 'iBondHolding', value: '03' },
		{ label: '國內外股票.基金公版-報表-庫存', value: '04' },
		{ label: 'iaNewFwd_v2', value: '05' },
		{ label: 'IRS市價明細表', value: '06' },
		{ label: 'IRS部位損益明細表', value: '07' },
		{ label: '國內股票-借券庫存明細表', value: '08' },
	]

	// 取得商品屬性下拉選單
	public productTypeList: Array<Option> = [
		{ label: '衍生性商品', value: '1' },
		{ label: '國內股票(自操/委外)', value: '2' },
		{ label: '國內基金(自操)', value: '3' },
		{ label: '國內債券(自操)', value: '4' },
		{ label: '國外股票(不含權益法)(自操)', value: '5' },
		{ label: '國外基金(自操)', value: '6' },
		{ label: '國外債券(自操)', value: '7' },
		{ label: '國外債券(委外)', value: '8' },
		{ label: '未上線商品', value: '9' },
	]

	// 取得批次類型下拉選單
	public batchJobTypeList: Array<Option> = [
		{ label: '日結交易', value: 'D' },
		{ label: '月結', value: 'M' },
		{ label: '人工啟動帳務處理', value: 'O' },
	]

	// [一般帳務處理-寶碩報表匯入] 寶碩日結報表下拉選單
	public actDailyReportName: Array<Option> = [
		{ label: 'iaBondTran', value: 'ActDailyReportBondTran' },
		{ label: 'iaIntReceived', value: 'ActDailyReportBondIntReceived' },
		{ label: '國內外股票.基金公版-報表-交易', value: 'ActDailyReportEquityTrans' },
		{ label: '國內外股票.基金公版-報表-股利', value: 'ActDailyReportEquityDividend' },
		{ label: 'iaNewFwdTran_交易明細表', value: 'ActDailyReportDerivativesTrans' },
		{ label: 'iaNewFwdTran_到期明細表', value: 'ActDailyReportDerivativesMaturity' },
		{ label: 'IRS and CCS 新作明細表', value: 'ActDailyReportIrsCcsCreate' },
		{ label: 'IRS and CCS 提解/到期明細表', value: 'ActDailyReportIrsCcsExtract' },
		{ label: 'IRS and CCS 收付息明細表', value: 'ActDailyReportIrsCcsPayment' },
	]

	// [一般帳務處理-寶碩報表匯入] 寶碩月結報表下拉選單
	public actMonthReportName: Array<Option> = [
		{ label: 'iaIntReceived', value: 'ActMonthReportBondIntReceived' },
		{ label: 'iaAccrInt_T', value: 'ActMonthReportBondAccruedInterest' },
		{ label: 'iBondHolding', value: 'ActMonthReportBondHolding' },
		{ label: '國內外股票.基金公版-報表-庫存', value: 'ActMonthReportEquityHolding' },
		{ label: 'iaNewFwd_v2', value: 'ActMonthReportDerivatives' },
		{ label: 'IRS市價明細表', value: 'ActMonthReportIrsCcsMkPrice' },
		{ label: 'IRS部位損益明細表', value: 'ActMonthReportIrsCcsProfitLoss' },
	]

	// 取得會計科目規則設定-傳票種類下拉選單
	public accCategoryList: Array<Option> = [
		{ label: '1-交易日', value: '1' },
		{ label: '2-交割日(涉及金流)', value: '2' },
		{ label: '3-交易日≧交割日(涉及金流)', value: '3' },
		{ label: '4-交易日=交割日(不涉及金流)', value: '4' },
		{ label: '5-交易日(股利估列)', value: '5' },
		{ label: '6-交割日(股利實收)', value: '6' },
		{ label: '7-交割日(利息實收)', value: '7' },
		{ label: '8-借券收入(涉及金流)', value: '8' },
		{ label: '9-預付投資款(涉及金流)', value: '9' },
		{ label: '10-預付投資款沖銷(涉及金流)', value: '10' },
	]

	// 取得會計科目規則設定-交易日/交割日比對結果下拉選單
	public compareResultTypeList: Array<Option> = [
		{ label: '1-交易日<交割日', value: '1' },
		{ label: '2-交易日=交割日', value: '2' },
		{ label: '23-交易日≧交割日', value: '23' },
	]

	// --------------------- cronTrigger 排程區塊-------------------------------
	// 取得週排程選項
	public weekCheckOptionList: Array<Option> = [
		{ label: '星期日', value: '1' },
		{ label: '星期一', value: '2' },
		{ label: '星期二', value: '3' },
		{ label: '星期三', value: '4' },
		{ label: '星期四', value: '5' },
		{ label: '星期五', value: '6' },
		{ label: '星期六', value: '7' },
	]

	// ---------------------取得 actEnumData.ts 裡 list 對應的 key/val 或 label/value值 func-------------------------------
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

	// --------------------------------------------------------------------------------------------------------

	public install(Vue) {
		Vue.prototype.$actEnum = this;
	}
}
export default new GlobalActEnum();
