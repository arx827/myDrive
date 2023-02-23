import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $cfEnum: GlobalCfEnum;
  }
}
interface Option {
	label: string;
	value: any;
}
export class GlobalCfEnum extends Vue {
	// 自動下載秒數設定，預設3秒
	downloadTime = 3000;

  // 日期區間不得超過天數
	rangeDateLimit = 90;

	// 常用常數
	public constant = {
		ADD: { key: '新增', val: 'A' },
		MODIFY: { key: '修改', val: 'M' },
		DELETE: { key: '刪除', val: 'D' },
		WAITREVIEW: { key: '待放行', val: 'W' },
	}

	// 是/否 字串常數
	public yesOrNoConstant = {
		YES: { label: '是', value: 'Y' },
		NO: { label: '否', value: 'N' },
	}

	// 交易狀態常數
	public cfStatusConstant = {
		RETURN_UNLOCKED: { key: '已放行', val: '0' }, // 退回解鎖會壓0
		LOCK: { key: '已鎖定', val: '1' },
		COMPARED: { key: '已比對', val: '2' },
		SUBMIT: { key: '已送審', val: '3' },
		TX_REVIEW: { key: '已初核', val: '4' },
		TX_DOUBLE_REIVEW: { key: '已確認', val: '5' },
		EMPTY: { key: '已放行', val: null },
	}

	// 操作類型常數 (icon顯示樣式)
	public actionConstant = {
		SEARCH: { key: '檢視', val: 'search' },
		COPY: { key: '複製_新增', val: 'copy' },
	}

	// [資料維護] 覆核常數
	public reviewStatus = {
		REJECT: { key: '拒絕', val: 'R' },
		APPROVAL: { key: '放行', val: 'A' },
	}

	// 交易確認放行常數
	public prodReviewStatus = {
		RETURN: { key: '退回', val: '7' },
	}

	// 初核放行常數
	public txReviewStatus = {
		RETURN: { key: '退回', val: '8' },
		APPROVAL: { key: '放行', val: '4' },
	}

	// 覆核放行常數
	public txDoubleReviewStatus = {
		RETURN: { key: '退回', val: '9' },
		APPROVAL: { key: '放行', val: '5' },
	}

	// [交易對手] 檔案類型常數
  public fileTypeConstant = {
    FILE_TYPE1: { label: '1交易對手帳號', value: '1' },
    FILE_TYPE2: { label: '2富邦帳號', value: '2' },
    FILE_TYPE3: { label: '3市場別', value: '3' },
    FILE_TYPE4: { label: '4其他', value: '4' },
  }

	// 檔案格式
	public fileExtensionEnum = {
		PDF: 'PDF',
		EXCEL: 'EXCEL',
		TXT: 'TXT',
		DOC: 'DOC',
		CSV: 'CSV',
		TIFF: 'TIFF',
		XLSX: 'XLSX',
		TIF: 'TIF',
	}

	// 列印參數對應表 01 產檔  02報表
	public printParam = {
		ForeignEquity: { fileType: '02', productGroup: 'FE' }, // 國外股票
		// ForeignBond: { fileType: '02', productGroup: 'FBNS' }, // 國外債
		ExchangeAndTender: { fileType: '02', productGroup: 'FBET' }, // 國外債_Exchange_TenderOffer
		StructuredNotes: { fileType: '02', productGroup: 'FBS' }, // 國外債_結構債
		UnStructuredNotes: { fileType: '02', productGroup: 'FBNS' }, // 國外債_非結構債
		DomesticBond: { fileType: '02', productGroup: 'DB' }, // 國內債
	}

	// ----------------------------------------------------------------------------------------------------

	// 放行狀態常數
	public reviewStatusEnum = [
		{ key: '待放行', val: 'W', color: '#ffbe0b' }, // 黃
		{ key: '已覆核', val: 'C', color: '#00BB00' }, // 綠
		{ key: '已拒絕', val: 'R', color: '#FF0000' }, // 紅
	]

	// 操作類型
	public actionEnum = [
		{
			key: '新增',
			val: 'A',
			icon: [
				{ ...this.actionConstant.SEARCH },
				{ ...this.actionConstant.COPY },
			],
		},
		{
			key: '修改',
			val: 'M',
			icon: [
				{ ...this.actionConstant.SEARCH },
			],
		},
	]

	// [富邦人壽款券帳號設定] 款/券
  processEnum = {
    CASH: 'Cash',
    EQUITY: 'equity',
  }

	// [富邦人壽款券帳號設定] 操作類型 款帳號/券帳號
	public actionCashEquityEnum = [
		{
			key: '新增款',
			val: '/addCash',
			icon: [
				{ ...this.actionConstant.SEARCH },
				{ ...this.actionConstant.COPY },
			],
		},
		{
			key: '新增券',
			val: '/addEquity',
			icon: [
				{ ...this.actionConstant.SEARCH },
				{ ...this.actionConstant.COPY },
			],
		},
		{
			key: '修改款',
			val: '/modifyCash',
			icon: [
				{ ...this.actionConstant.SEARCH },
			],
		},
		{
			key: '修改券',
			val: '/modifyEquity',
			icon: [
				{ ...this.actionConstant.SEARCH },
			],
		},
	]

	// 操作工具icon
	public actionToolEnum = [
		{ key: '刪除', val: 'delete' },
		{ key: '編輯', val: 'form' },
	]

	// 交易確認狀態
	public cfStatusEnum = [
		{ ...this.cfStatusConstant.RETURN_UNLOCKED, color: '#FA8C16' }, // 橘
		{ ...this.cfStatusConstant.LOCK, color: '#ffbe0b' }, // 黃
		{ ...this.cfStatusConstant.COMPARED, color: '#00BB00' }, // 綠
		{ ...this.cfStatusConstant.SUBMIT, color: '#BEBEBE' }, // 淺灰
		{ ...this.cfStatusConstant.TX_REVIEW, color: '#8E8E8E' }, // 深灰
		{ ...this.cfStatusConstant.TX_DOUBLE_REIVEW, color: '#2894FF' }, // 藍
		{ ...this.cfStatusConstant.EMPTY, color: '#FA8C16' }, // 橘
	]

	// 簽核權限對應表
	public apvlLevelEnum = [
		{ key: '職等六同仁', val: '1' },
		{ key: '科主管', val: '2' },
		{ key: '部副主管', val: '3' },
		{ key: '部主管', val: '4' },
		{ key: '處副主管', val: '5' },
		{ key: '處主管', val: '6' },
	]

	// 前台覆核狀態對照表
	public confirmStatusEnum = [
		{ key: '已放行', val: '1' },
		{ key: '無須放行', val: '99' },
	];

	// 【非結構債】單筆交易確認視窗欄位分類 對應表
	public invCategoryCodeRegexEnum = [
		{ type: 'A', pattern: /^4|^5|^6|^7|^K/ }, // 4開頭、5開頭、6開頭、7開頭、K開頭
		{ type: 'B', pattern: /^B/ }, // B開頭
		{ type: 'C', pattern: /^[9A][^932]/ }, // 9開頭(不包括932) 、A%
		{ type: 'D', pattern: /932/ }, // 932
	]

	// 下載區檔案狀態
	public executeStatusEnum = [
		{ key: '完成', val: 'COMPLETED', color: '#52C41A' }, // 綠
		{ key: '失敗', val: 'FAILED', color: '#F5222D' }, // 紅
		{ key: '製作中', val: 'STARTED', color: '#F5BC22' }, // 黃
		{ key: '未知', val: 'UNKNOWN', color: '#BEBEBE' }, // 灰
		{ key: '執行', val: 'EXECUTING', color: '#3c6e71' }, // 墨綠
	]

	// 換券收/付款 對照
	public tradeDirectionEnum = [
		{ key: '收款', val: '1' },
		{ key: '付款', val: '-1' },
	]

	// Tender 收/付款 對照
	public tradeDirectionTenderEnum = [
		{ key: '收款', val: '-1' },
		{ key: '付款', val: '1' },
	]

	// 交易別 對照
	public eventEnum = [
		{ key: '換券', val: '15' },
		{ key: 'Tender Offer', val: '14' },
	]

	// 附件上傳類型
	public attachmentTypeEnum = [
		{ key: '成交單', val: '01' },
		{ key: '確認書', val: '02' },
		{ key: '簽核權限表', val: '03' },
		{ key: '其他', val: '99' },
	]

	// ---------------------------------下拉選單---------------------------------

	// 是/否
	yesOrNoOption: Array<Option> = [
		{ ...this.yesOrNoConstant.YES },
		{ ...this.yesOrNoConstant.NO },
	]

	// 保管行
	custodianOption: Array<Option> = [
		{ label: 'BONY', value: 'BONY' },
		{ label: 'CITI', value: 'CITI' },
		{ label: 'JPM', value: 'JPM' },
		{ label: 'TDCC', value: 'TDCC' },
	]

	// 交易類型
	typeOption: Array<Option> = [
		{ label: '款', value: 'cash' },
		{ label: '券', value: 'equity' },
	]

	// 買賣類型
	tradeTypeOption: Array<Option> = [
		{ label: 'ALL', value: 'ALL' },
		{ label: 'BUY', value: 'BUY' },
		{ label: 'SELL', value: 'SELL' },
	]

	// 放行狀態
	reviewTypeOption: Array<Option> = [
		{ label: '待放行', value: 'W' },
		{ label: '已覆核', value: 'C' },
		{ label: '已拒絕', value: 'R' },
	]

	// 更多操作
	actionTypeOption: Array<Option> = [
		{ label: '檢視', value: 'C' },
		{ label: '修改', value: 'M' },
		{ label: '歷程', value: 'H' },
	]

	// 更多操作
	contactActoinTypeOption: Array<Option> = [
		{ label: '檢視', value: 'C' },
		{ label: '刪除', value: 'D' },
	]

	// 交易階層
	hierarchyDescOption: Array<Option> = [
		{ label: '不動產部', value: '1672' },
		{ label: '另類暨專案投資部', value: '1601' },
		{ label: '國外股權收益部', value: '1602' },
	]

	// 市場別
	isAsiaOption: Array<Option> = [
		{ label: '亞股', value: 'Y' },
		{ label: '非亞股', value: 'N' },
	]

	// 成交類別
	dealTypeOption: Array<any> = [
		{ label: '預付交易', value: 'E1', column: 'est' },
		{ label: '實際交易', value: 'E2', column: 'act' },
	]

	// 簽核權限計算類型
	calculateTypeOption: Array<Option> = [
		{ label: '淨額交割', value: '01' },
		{ label: '總額交割', value: '02' },
	];

	// 交易別
  transactionOption: Array<Option> = [
    { label: '買入', value: '1' },
    { label: '賣出', value: '-1' },
  ];

	// 附件狀態
	attachmentStatusOption: Array<Option> = [
		{ label: '不需附件', value: '0' },
    { label: '已上傳', value: '1' },
    { label: '尚未上傳', value: '2' },
	]

	// 資產類別
	invCategoryCodeOption: Array<Option> = [
		{ label: '國債', value: '4' },
		{ label: '金融債', value: '5' },
		{ label: '公司債', value: '6' },
	]

	// [交易對手款券帳號設定] 檔案類型
	fileTypeOption: Array<Option> = [
		{ ...this.fileTypeConstant.FILE_TYPE1 },
		{ ...this.fileTypeConstant.FILE_TYPE2 },
		{ ...this.fileTypeConstant.FILE_TYPE3 },
		{ ...this.fileTypeConstant.FILE_TYPE4 },
	];

	// [交易對手款券帳號設定] Financial Indicator
	indicatorOption: Array<Option> = [
		{ label: 'A Bank', value: 'Y' },
		{ label: 'Not a Bank', value: 'N' },
	];

	// [交易對手款券帳號設定] Pay Charges Indicator
	chargesOption: Array<Option> = [
		{ label: 'OUR', value: 'OUR' },
		{ label: 'SHA', value: 'SHA' },
		{ label: 'BEN ', value: 'BEN' },
	];

	// [富邦人壽款券帳號設定] 使用類別
	useTypeOption: Array<Option> = [
		{ label: '自操', value: 'S' },
		{ label: '委外', value: 'O' },
	];

	// [富邦人壽款券帳號設定] 啟用狀態
	isEnableOption: Array<Option> = [
		{ label: '啟用', value: '1' },
		{ label: '停用', value: '0' },
	];

	// [國外債] 交易類別
	eventOption: Array<Option> = [
		{ label: '換券', value: '15' },
		{ label: 'Tender Offer', value: '14' },
	]

	// [國外債-換券] 收/付款
	tradeDirectionOption: Array<Option> = [
		{ label: '付款', value: '-1' },
		{ label: '收款', value: '1' },
	];

	// [下載區] 檔案類型
	fileDownloadTypeOption: Array<Option> = [
		{ label: '檔案', value: '01' },
		{ label: '報表', value: '02' },
	];

	// [初核覆核] 是否通過SPPI測試
	// TODO: 是否的value要統一 Y/N ??
	isSppiOption: Array<Option> = [
		{ label: '否', value: '0' },
		{ label: '是', value: '1' },
	];

	// [初核覆核] 付息頻率
	dividendFreqOption: Array<Option> = [
		{ label: '不付息', value: 'N' },
		{ label: '每月', value: '1' },
		{ label: '每季', value: '2' },
		{ label: '每半年', value: '3' },
		{ label: '每年', value: '4' },
		{ label: '單利', value: '0' },
	];

	// [國內債] 資產區隔
	asTypeOption: Array<Option> = [
		{ label: 'NONPAR', value: 'NONPAR' },
		{ label: 'PAR', value: 'PAR' },
	];

	// [國內債] 交割方式
	settleTypeOption: Array<Option> = [
		{ label: 'DVP', value: 'DVP' },
		{ label: 'FOP', value: 'FOP' },
	];

	// [國內債] 附件類型
	attachmentTypeOption: Array<Option> = [
		{ label: '成交單', value: '01' },
		{ label: '交易確認文件', value: '02' },
	]

	// [國內債] WI交易下拉選單
	isWIOption: Array<Option> = [
		{ ...this.yesOrNoConstant.YES },
		{ ...this.yesOrNoConstant.NO },
	]

	// [國內股] Portfolio下拉選單
	portfolioOption: Array<Option> = [
		{ label: 'ANN_IH', value: 'ANN_IH' },
		{ label: 'ISL_IH', value: 'ISL_IH' },
		{ label: 'LIF_IH', value: 'LIF_IH' },
		{ label: 'PFU_IH', value: 'PFU_IH' },
		{ label: 'TRA_IH', value: 'TRA_IH' },
		{ label: 'PAN_IH', value: 'PAN_IH' },
	]

	// ---------------------取得 cfEnumData.ts 裡 list 對應的 key/val 或 label/value值 func-------------------------------
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
  	Vue.prototype.$cfEnum = this;
	}
}
export default new GlobalCfEnum();
