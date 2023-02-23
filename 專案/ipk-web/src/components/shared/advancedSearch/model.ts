/**
 * label: 欄位名稱。
 * placeholder: 輸入框提示字。
 * type: 輸入框的類型。
 *       (1) inputText：文字輸入框。
 *       (2) inputNum： 數字輸入框。
 *       (3) singleSelect： 單選下拉。
 *       (4) multiSelect： 複選下拉。
 *       (5) datePicker： 日期。
 *       (6) rangePicker： 區間日期。
 *       (7) monthPicker: 月份區間日期。
 *       (8) switch： 開關。
 *       (9) columnwrap: 欄位換行使用。
 *       (10) switchDate: 切換日期格式使用。
 * maxlength: 字數限制
 * showtime: 是否要顯示時間。
 * showTimeFormat: 時間元件要format的格式。如：'HH:mm' 或 'HH:mm:ss'
 * options: 下拉選單。
 * allOptions: 模糊搜尋用，預設值同options。
 * showSearch: 下拉選單是否要模糊查詢。
 * showSearchType: 模糊查詢規則，與showSearch配合使用(即showSearch必須設為true)。ex: showSearchType=' ' => 以空白作為多關鍵字搜尋。
 * showSelfDefined: 是否用客製化下拉選單，客製化模糊搜尋(單筆下拉使用)，因a-select選項超過300筆會有效能問題，故改成輸入4位以上時，再顯示選項
 * switchCheckedText: 開關選中時的内容。
 * switchUnCheckedText: 開關非選中時的内容。
 * labelInValue: 是否把每個選項的label包装到 value 中，會把Select的value類型從string變為{key: string, label: vNodes} 的格式
 * showInputText: 是否顯示日期格式切換按鈕，與switchDate配合使用
 */
 export interface AdvancedSearchModel {
  label?: string;
  placeholder?: string;
  type?: string;
  maxlength?: number;
  showTime?: boolean;
  showTimeFormat?: string;
  options?: any[];
  allOptions?: any[];
  /* 下拉選單模糊搜尋 start */
  showSearch?: boolean;
  showSearchType?: string;
  showSelfDefined? : showSelfDefinedItem;
  labelInValue?: boolean;
  /* 下拉選單模糊搜尋 end */
  switchCheckedText?: string;
  switchUnCheckedText?: string;
  showInputText?: boolean;
}

export interface showSelfDefinedItem {
  limitNum?: number; // 應輸入關鍵字最少數量
  filterOptions?: any[]; // 篩選後的下拉選單，一開始預設[]
}
