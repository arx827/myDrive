import Vue, { PluginFunction, PluginObject } from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $enum: GlobalEnum;
  }
}
interface ValOption {
  value: string;
  label: string;
}
export class GlobalEnum extends Vue {
	// Enum 與 API對應值
	// 有需要動態取得 列舉值再加
	public enumCorrespond = {
		dataTypeEnum: {
			apiInterface: '$dataCollectApi',
			functionName: 'getDataTypeInDataCollectUsingGET',
		},
	}

  // 十二月份
  public monthOption: ValOption[] = [
  	{
  		value: '01',
  		label: '1月',
  	},
  	{
  		value: '02',
  		label: '2月',
  	},
  	{
  		value: '03',
  		label: '3月',
  	},
  	{
  		value: '04',
  		label: '4月',
  	},
  	{
  		value: '05',
  		label: '5月',
  	},
  	{
  		value: '06',
  		label: '6月',
  	},
  	{
  		value: '07',
  		label: '7月',
  	},
  	{
  		value: '08',
  		label: '8月',
  	},
  	{
  		value: '09',
  		label: '9月',
  	},
  	{
  		value: '10',
  		label: '10月',
  	},
  	{
  		value: '11',
  		label: '11月',
  	},
  	{
  		value: '12',
  		label: '12月',
  	},
  ]

  // 季
  public quarter: ValOption[] = [
  	{
  		value: '1',
  		label: '(Q1)1~3月',
  	},
  	{
  		value: '2',
  		label: '(Q2)4~6月',
  	},
  	{
  		value: '3',
  		label: '(Q3)7~9月',
  	},
  	{
  		value: '4',
  		label: '(Q4)10~12月',
  	},
  ]

  // 權限清單
  public roleEnum: ValOption[] = [
  	{
  		label: 'ROLE_ROOT',
  		value: '系統管理員',
  	},
  	{
  		label: 'ROLE_Auditor',
  		value: '查核人員',
  	},
  	{
  		label: 'ROLE_Audit_Team_Head',
  		value: '組長',
  	},
  	{
  		label: 'ROLE_Audit_Department_Head',
  		value: '部主管',
  	},
  	{
  		label: 'ROLE_Audit_Office_Boss_Vice',
  		value: '副總稽核',
  	},
  	{
  		label: 'ROLE_Audit_Office_Boss',
  		value: '總稽核',
  	},
  ]

  // 資料類型 API: 已串接API
  // public dataTypeEnum = [
  // 	{
  // 		label: '法令函釋',
  // 		value: 'A',
  // 	},
  // 	{
  // 		label: '主要檢查缺失',
  // 		value: 'B',
  // 	},
  // 	{
  // 		label: '金檢年度檢查重點',
  // 		value: 'C',
  // 	},
  // 	{
  // 		label: '重大裁罰案件',
  // 		value: 'D',
  // 	},
  // 	{
  // 		label: '非重大裁罰案件',
  // 		value: 'E',
  // 	},
  // 	{
  // 		label: '作業風險事件清單',
  // 		value: 'F',
  // 	},
  // 	{
  // 		label: '作業委外合約清單',
  // 		value: 'G',
  // 	},
  // 	{
  // 		label: '重大市場/信用風險事件通報清單',
  // 		value: 'H',
  // 	},
  // 	{
  // 		label: '海外子公司之重大信用風險事件通報清單',
  // 		value: 'I',
  // 	},
  // ]

	// 資料確認狀態
	public dataConfirmStatusEnum: ValOption[] = [
  	{
			label: '資料確認中',
			value: 'A',
		},
		{
			label: '資料確認完成',
			value: 'B',
		},
		{
			label: '全組不確認',
			value: 'C',
		},
	]

	// 年度稽核計畫 查核項目狀態
	public yapStatusEnum: ValOption[] = [
		{
			label: '日常維運',
			value: 'A',
		},
		{
			label: '進行中',
			value: 'B',
		},
		{
			label: '主管審閱',
			value: 'C',
		},
		{
			label: '主管審閱完畢',
			value: 'D',
		},
		{
			label: '結案',
			value: 'E',
		},
	]

	// 工作底稿 查核內容 狀態
	public auditOpinionStatus: ValOption[] = [
		{
			label: '查核作業中',
			value: '01',
		},
		{
			label: '組長覆核',
			value: '02',
		},
		{
			label: '查核意見審核',
			value: '03',
		},
		{
			label: '查核意見審核(副總稽核)',
			value: '04',
		},
		{
			label: '查核意見審畢',
			value: '05',
		},
		{
			label: '查核溝通',
			value: '06',
		},
		{
			label: '稽核報告審閱',
			value: '07',
		},
		{
			label: '稽核報告審閱完畢',
			value: '08',
		},
		{
			label: '此項刪除',
			value: '90',
		},
		{
			label: '查核結束',
			value: '99',
		},
	]

	// 組別 已串接 API
	// this.$dataCollectApi.getGroupInDataCollectUsingGET()
	// public auditGroupEnum: ValOption[] = [
	// 	{
	// 		label: '保險業務組',
	// 		value: 'A',
	// 	},
	// 	{
	// 		label: '投資財務組',
	// 		value: 'B',
	// 	},
	// 	{
	// 		label: '資訊組',
	// 		value: 'C',
	// 	},
	// 	{
	// 		label: '行政組',
	// 		value: 'D',
	// 	},
	// 	{
	// 		label: '海外業務組',
	// 		value: 'E',
	// 	},
	// ]

	// 認列狀態
	public dataClaimStatusEnum: ValOption[] = [
  	{
			label: '已認列(處理中)',
			value: 'A',
		},
		{
			label: '已認列(覆核中)',
			value: 'B',
		},
		{
			label: '已認列(已覆核)',
			value: 'C',
		},
		{
			label: '非本組認列(覆核中)',
			value: 'D',
		},
		{
			label: '非本組認列(已覆核)',
			value: 'E',
		},
	]

	// 執行動作
	public operate: ValOption[] = [
  	{
			label: '新增',
			value: 'add',
		},
		{
			label: '刪除',
			value: 'delete',
		},
		{
			label: '修改',
			value: 'modify',
		},
	]

	// 覆核狀態
	public approveStatus: ValOption[] = [
  	{
			label: '退回',
			value: 'N',
		},
		{
			label: '同意',
			value: 'Y',
		},
		{
			label: '待確認',
			value: 'X',
		},
	]

	// 中文數字
	public chNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

	// 基本單位
	public chIntRadice = ['', '十', '百', '千'];

	// 擴充單位
	public chIntUnits = ['', '萬', '億', '兆'];

	// ---------------------func-------------------------------
	/**
   * 轉換用 取 value (key)
   */
	public getValue(objName, index) {
  	if (this[objName].find((i) => i.label === index)) {
  		return this[objName].find((i) => i.label === index).value;
  	}
  	return '';
	}

	/**
   * 轉換用 取 label
   */
	public getLabel(objName, index) {
  	if (this[objName].find((i) => i.value === index)) {
  		return this[objName].find((i) => i.value === index).label;
  	}
  	return '';
	}

	/**
   * C.      年度檢查重點
   * B.      主要檢查缺失
   * D、E.   裁罰案件(重大、非重大)
   * A.      法令函釋
	 * F、H、Ｉ.事件清單
	 * G.      委外作業清單
   */
	// 資料類型 對應 component 編號
	public getDataTypeComp(dataType) {
		switch (dataType) {
		case 'A':
			return 'comp1';
		case 'B':
			return 'comp2';
		case 'C':
		case 'D':
		case 'E':
			return 'comp3';

		case 'F':
		case 'H':
		case 'I':
		case 'G':
			return 'comp4';
		}
	}

	// 轉 中文數字
	public intNumToCh(int) {
  	let origin;
		let returnStr = '';
  	// 處理例外
  	if (typeof int === 'string') {
  		if (int === '') return '';
  		if (isNaN(parseFloat(int))) {
  			console.log('引數有誤，無法轉數字');
  		}
			// 去掉千分符(,)
			int = int.replace(/,/g, '');
  		origin = parseFloat(int);
  	} else if (typeof int === 'number') {
  		origin = int;
  	} else {
  		console.log('引數有誤，非中文、數字');
  	}

  	// 處理 0 => 直接回傳 '零'
  	if (origin === 0) {
  		return this.chNums[origin];
  	}
		let zeroCount = 0;
		const intStr = origin.toString();
		const IntLen = intStr.length;
		if (origin >= 10) {
			for (let i = 0; i < IntLen; i++) {
				const currentStr = intStr.substr(i, 1);
				// 剩餘待處理的數量
				const surplus = IntLen - i - 1;
				// 擴充單位
				const expandUnit = surplus / 4;
				// 基本單位
				const baseUnit = surplus % 4;
				// 零遇到零時，累加，如：100000 => 十萬
				if (currentStr === '0') {
					zeroCount++;
				} else {
					if (zeroCount > 0) {
						returnStr += this.chNums[0];
					}
					// 歸零
					zeroCount = 0;
					if (i === 0 && currentStr === '1' && baseUnit == 1) {
						// 如：將 一十萬 => 十萬
						returnStr += this.chIntRadice[baseUnit];
					} else {
						returnStr += this.chNums[parseInt(currentStr)] + this.chIntRadice[baseUnit];
					}
				}
				// + 擴充單位
				if (baseUnit === 0 && zeroCount < 4) {
					returnStr += this.chIntUnits[expandUnit];
				}
			}
		} else {
			returnStr += this.chNums[parseInt(intStr)];
		}
		return returnStr;
	}

	public install(Vue) {
  	Vue.prototype.$enum = this;
	}
}
export default new GlobalEnum();
