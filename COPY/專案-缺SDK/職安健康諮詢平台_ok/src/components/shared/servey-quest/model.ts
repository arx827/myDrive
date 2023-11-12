export interface questType {
  key?: number;
  val?: string;
	className?: string;
}

export interface questionnaireItem {
  id?: string;
  enabled?: boolean; // 啟用狀態
  isAnswer?: string; // 是否必答
  optDescList?: Array<string>; // 選項名稱
  sort?: number; // 排序
  title?: string; // 題目名稱
  type?: number; // 題型
  weightingList?: Array<string>; // 權重
}

export interface option {
  id?: string;
  content?: string; // 選項內容
}
