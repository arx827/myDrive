export interface IpkVxeTableModel {
  id?: string;
  data: any[]; // 欄位資料
  height?: number | string; // (auto, %, px)
  maxHeight?: number | string; // (%, px)
  tableHeight?: string; // (px)
  autoResize?: boolean; // 自動監聽父元素的變化去重新計算表格（對於父元素可能存在動態變化、顯示隱藏的容器中、列寬異常等場景中的可能會用到）
  syncResize?: boolean | number | string; // 自動跟隨某個屬性的變化去重新計算表格，和手動調用 recalculate 方法是一樣的效果（對於通過某個屬性來控制顯示/隱藏切換時可能會用到）
	stripe?: boolean; // 是否要有斑馬紋樣式
  border?: boolean | BorderStyle; // 是否需要table邊框
  round?: boolean; // 是否需要圓角邊框
  size?: 'medium' | 'small' | 'mini'; // 表格尺寸
  loading?: boolean; // 表格是否顯示加載中
  align?: 'left' | 'right' | 'center'; // 所有列的對齊方式
  headerAlign?: 'left' | 'right' | 'center'; // 表頭列的對齊方式
  footerAlign?: 'left' | 'right' | 'center'; // 表尾列的對齊方式
  showHeader?: boolean; // 是否顯示表頭
  showFooter?: boolean; // 是否顯示表尾
  showOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'; // 所有內容過長時顯示為省略號（如果是固定列建議設置該值，提升渲染速度）
  showHeaderOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'; // 設置表頭所有內容過長時顯示為省略號
  showFooterOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'; // 設置表尾所有內容過長時顯示為省略號
  footerMethod?: ({ columns, data }) => any[][]; // 表尾的數據獲取方法，返回一個二維數組
  mergeCells?: Array<{ row: number; col: number; rowspan: number; colspan: number }>; // 臨時合併指定的單元格 (不能用於展開行，不建議用於固定列、樹形結構)
  mergeFooterItems?: Array<{ row: number; col: number; rowspan: number; colspan: number }>; // 臨時合併表尾 (不能用於展開行，不建議用於固定列、樹形結構)
  keepSource?: boolean; // 保持原始值的狀態，被某些功能所依賴，比如編輯狀態、還原數據等（開啟後影響性能，具體取決於數據量）
  emptyText?: string; // 無資料時顯示的文字
  scrollX?: ScrollXItem; // 配置橫向scrollBar,也可用於指定滾動區域的寬和高
  scrollY?: ScrollYItem; // 配置縱向scrollBar,也可用於指定滾動區域的寬和高
  slots?: object | Function;
  pagerConfig: PagerItem; // 分頁配置
  columnConfig?: ColumnConfigItem; // 列配置
  rowConfig?: RowItem; // 列配置
  sortConfig?: VxeSortItem; // 排序
  filterConfig?: FilterItem; // 過濾器
  expandConfig?: ExpandItem; // 欄位展開設定
  checkboxConfig?: CheckboxItem; // Checkbox設定
  radioConfig?: RadioItem; // Radio設定
  treeConfig?: TreeItem; // 樹結構設定
  editConfig?: EditItem; // 編輯欄位設定
  editRules?: EditRulesItem; // 編輯欄位校驗設定
  columns: ColumnsItem[]; // 欄位配置
  rowClassName?: string | (({ row, rowIndex, $rowIndex }) => any); // 列附加 className
  cellClassName?: string | (({
    row, rowIndex, $rowIndex, column, columnIndex, $columnIndex,
  }) => any); // 單元格附加 className
}

export interface SortItem {
  selector?: string;
  desc?: boolean;
}

export interface ColumnsItem {
  type?: ColumnType; // 欄位的類型
  field?: string; // 欄位名稱
  title?: string; // 欄位名稱
  width?: number | string; // 欄位寬度 string-範例:'auto'/'50px'/'50%'
  minWidth?: number | string; // 欄位最小寬度 string-範例:'auto'/'50px'/'50%'
  resizable?: boolean; // 列是否允許拖動列寬調整大小
  visible?: boolean; // 是否顯示欄位 默認true
  fixed?: 'left' | 'right'; // 凍結窗格
  align?: 'left' | 'right' | 'center'; // 欄位中資料的位置
  headerAlign?: 'left' | 'right' | 'center'; // 表頭列的對齊方式
  footerAlign?: 'left' | 'right' | 'center'; // 表尾列的對齊方式
  showOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'; // 所有內容過長時顯示為省略號（如果是固定列建議設置該值，提升渲染速度）
  showHeaderOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'; // 設置表頭所有內容過長時顯示為省略號
  showFooterOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'; // 設置表尾所有內容過長時顯示為省略號
  className?: string | Function; // 欄位附加className
  headerClassName?: string | Function; // header欄位附加className
  footerClassName?: string | Function; // footer欄位附加className
  formatter?: Function | any[] | string; // 格式化顯示內容
  sortable?: boolean;
  sortBy?: string | (({ row, column }) => string | number);
  sortType?: 'auto' | 'number' | 'string'; // 只對sortable 有效，指定排序的字段（當值 formatter 格式化後，可以設置該字段，使用值進行排序）
  filters?: object[]; // 過濾器
  slots?: {} | Function; // 可以由此屬性設定客製化 slots的属性
  maxWidth?: number; // 欄位最大寬度
  sortConfig?: VxeSortItem; // 排序
  children?: ColumnsItem[]; // 子欄位配置
  editRender?: EditRenderItem; // 可編輯渲染器配置
  treeNode?: boolean; // 只對 tree-config 配置時有效，指定為樹節點
  params?: any; // 額外變數
}

export interface TreeItem {
  transform?: string; // 自動將列表轉為樹結構（支持虛擬滾動）
  rowField?: string; // 樹節點的字段名
  parentField?: string; // 樹父節點的字段名
  children?: string; // 樹子節點的字段名
  indent?: number; // 樹節點的縮進
  line?: boolean; // 樹節點的連接線（啟用連接線會降低渲染性能）
  expandAll?: boolean; // 默認展開所有子孫樹節點（只會在初始化時被觸發一次）
  expandRowKeys?: string[]; // 默認展開指定樹節點（只會在初始化時被觸發一次，需要有 row-id）
  accordion?: boolean; // 對於同一級的節點，每次只能展開一個
  trigger?: 'default' | 'cell' | 'row'; // 觸發方式（注：當多種功能重疊時，會同時觸發）
  lazy?: boolean; // 是否使用懶加載（啟用後只有指定 hasChild 的節點才允許被點擊）
  hasChild?: string; // 只對 lazy 啟用後有效，標識是否存在子節點，從而控制是否允許被點擊
  loadMethod?: ({ row }) => Promise<any[]>; // 該方法用於異步加載子節點（必須返回 Promise<any[]> 對象）
  toggleMethod?: ({
    expanded, row, column, columnIndex,
  }) => boolean; // 該方法在展開或關閉觸發之前調用，可以通過返回值來決定是否允許繼續執行
  reserve?: boolean; // 是否保留展開狀態，對於某些場景可能會用到，比如數據被刷新之後還保留之前展開的狀態（需要有 row-id）
  showIcon?: boolean; // 是否顯示圖標按鈕
  iconOpen?: string; // 自定義展開後顯示的圖標
  iconClose?: string; // 自定義收起後顯示的圖標
  iconLoaded?: string; // 自定義懶加載中顯示的圖標
}

export interface EditRenderItem {
  name?: 'input' | 'textarea' | 'select' | '$input' | '$select' | '$switch'; // 渲染器名稱
  enabled?: boolean; // 是否啟用
  props?: any; // 渲染的參數（請查看目標渲染的 Props）
  attrs?: any; // 渲染的屬性（請查看目標渲染的 Attribute）
  options?: any[]; // 只對 name=select 有效，下拉選項列表
  optionProps?: any; // 只對 name=select 有效，下拉選項屬性參數配置
  optionGroups?: any[]; // 只對 name=select 有效，下拉分組選項列表
  optionGroupProps?: any; // 只對 name=select 有效，下拉分組選項屬性參數配置
  events?: any; // 渲染組件的事件（請查看目標渲染的 Events）
  content?: string; // 渲染組件的內容（僅用於特殊組件）
  autofocus?: string; // 如果是自定義渲染可以指定聚焦的選擇器，例如 .my-input
  autoselect?: boolean; // 是否在激活编辑之后自动选中输入框内容
  defaultValue?: any | (({ column }) => any); // 默认值（插入数据时列的默认值）
  immediate?: boolean; // 輸入值實時同步更新（默認情況下單元格編輯的值只會在被觸發時同步，如果需要實時同步可以設置為 true）
  placeholder?: string; // 單元格佔位符，但單元格為空值時顯示的佔位符
}
export interface EditItem {
  trigger?: 'manual' | 'click' | 'dblclick'; // 觸發方式  manual（手動觸發方式，只能用於 mode=row）,click（點擊觸發編輯）,dblclick（雙擊觸發編輯）
  enabled?: boolean; // 是否啟用
  mode?: 'cell' | 'row'; // cell（欄位編輯模式）,row（行編輯模式）
  showIcon?: boolean; // 是否顯示列頭編輯圖標
  showStatus?: boolean; // 只對 keep-source 開啟有效，是否顯示單元格新增與修改狀態
  showUpdateStatus?: boolean; // 只對 keep-source 開啟有效，是否顯示單元格修改狀態
  showInsertStatus?: boolean; // 只對 keep-source 開啟有效，是否顯示單元格新增狀態
  showAsterisk?: boolean; // 是否顯示必填字段的紅色星號
  autoClear?: boolean; // 當點擊非編輯列之後，是否自動清除單元格的顯示狀態
  beforeEditMethod?: ({
    row, rowIndex, column, columnIndex,
  }) => boolean; // 該方法的返回值用來決定該單元格是否允許編輯
  icon?: string; // 自定義可編輯列的狀態圖標
}

export interface EditRulesItem {
  required?: boolean; // 是否必填
  min?: number; // 校驗值最小長度（如果 type=number 則比較值大小）
  max?: number; // 校驗值最大長度（如果 type=number 則比較值大小）
  type?: string; // 數據校驗的類型
  pattern?: RegExp | string; // 正則校驗
  validator?: ({ // 自定義校驗方法返回一個 Error 或者 Promise<new Error("提示消息")>
    cellValue, rule, rules, row, rowIndex, column, columnIndex,
  }) => Error | Promise<any>;
  message?: string; // 校驗提示內容（支持開啟國際化）
}

export interface ColumnConfigItem {
  useKey?: boolean; // 是否需要為每一欄位的 VNode 設置 key 屬性（非特殊情況下不需要使用）
  isCurrent?: boolean; // 當鼠標點擊當欄位時，是否要亮起當前欄位
  isHover?: boolean; // 當鼠標移到當欄位時，是否要亮起當前欄位
  resizable?: boolean; // 每一欄位是否啟用欄位寬度調整
  width?: number | string; // 每一欄位寬度 string-範例:'auto'/'50px'/'50%'
  minWidth?: number | string; // 每一欄位最小寬度 string-範例:'auto'/'50px'/'50%'
}

export interface ScrollXItem {
  enabled?: boolean; // 是否啟用
  gt?: number; // 指定大於指定列时自動啟動橫向虛擬滾動，如果為0則總是啟用；如果需要關閉，可以設定 enabled 為 false
  oSize?: number; // 指定每次渲染的數據偏移量，偏移量越大渲染次數就越少，但每次渲染耗時就越久（對於低性能瀏覽器可以設置大一點，減低渲染次數）
  scrollToLeftOnChange?: boolean; // 當數據源被更改時，自動將橫向滾動條滾動到左側
}

export interface ScrollYItem {
  enabled?: boolean; // 是否啟用
  mode?: 'default' | 'wheel'; // 滾動模式
  gt?: number; // 指定大於指定列时自動啟動橫向虛擬滾動，如果為0則總是啟用；如果需要關閉，可以設定 enabled 為 false
  oSize?: number; // 指定每次渲染的數據偏移量，偏移量越大渲染次數就越少，但每次渲染耗時就越久（對於低性能瀏覽器可以設置大一點，減低渲染次數）
  scrollToTopOnChange?: boolean; // 當數據源被更改時，自動將縱向滾動條滾動到頂部
}

export type BorderStyle = 'default' | 'full' | 'outer' | 'inner' | 'none';

export type ColumnType = 'seq' | 'checkbox' | 'radio' | 'expand';

export interface RowItem {
  useKey?: boolean; // 是否需要為每一行的 VNode 設置 key 屬性（非特殊情況下不需要使用）
  keyField?: string; // 自定義行數據唯一主鍵的字段名（默認自動生成）
  isCurrent?: boolean; // 當鼠標點擊當行時，是否要亮起當前行
  isHover?: boolean; // 當鼠標移到當行時，是否要亮起當前行
}

export interface CheckboxItem {
  labelField?: string; // 複選框顯示的字段名，可以直接顯示在複選框中
  checkField?: string; // 綁定選中屬性，如果設置了該屬性渲染速度更快（建議數據量大時使用，行數據中必須存在該字段，否則無效）
  showHeader?: boolean; // 是否顯示全選按鈕（如果 checkStrictly=true 則默認為 false）
  checkAll?: boolean; // 默認勾選全部（只會在初始化時被觸發一次）
  checkRowKeys?: string[]; // 默認勾選指定行（只會在初始化時被觸發一次，需要有 row-id）
  checkStrictly?: boolean; // 是否嚴格的遵循父子不互相關聯的做法
  strict?: boolean; // 嚴格模式，當數據為空或全部禁用時，列頭的複選框為禁用狀態
  visibleMethod?: ({ row }) => boolean; // 是否允許勾選的方法，該方法，的返回值用來決定這一行的 checkbox 是否顯示
  checkMethod?: ({ row }) => boolean; // 是否允許勾選的方法，該方法的返回值用來決定這一行的 checkbox 是否可以勾選
  trigger?: 'default' | 'cell' | 'row'; // 觸發方式（當多種功能重疊時，會同時觸發）
  highlight?: boolean; // highlight勾選行
  reserve?: boolean; // 是否保留勾選狀態，對於某些場景可能會用到，比如數據被刷新之後還保留之前選中的狀態（需要有 row-id）
  range?: boolean; // 開啟複選框範圍選擇功能（啟用後通過鼠標在複選框的列內滑動選中或取消指定行）
}

export interface RadioItem {
  strict?: boolean; // 嚴格模式，選中後不能取消
  reserve?: boolean; // 是否保留選中狀態，例如：數據被刷新或者分頁之後還保留之前選中的狀態（需要有 row-id）
  labelField?: string; // 單選框顯示的字段名，可以直接顯示在單選框中
  checkRowKeys?: string[]; // 默認選中指定行（只會在初始化時被觸發一次，需要有 row-id）
  visibleMethod?: ({ row }) => boolean; // 是否允許選中的方法，該方法的返回值用來決定這一行的 radio 是否顯示
  checkMethod?: ({ row }) => boolean; // 是否允許選中的方法，該方法的返回值用來決定這一行的 radio 是否可以選中
  trigger?: 'default' | 'cell' | 'row'; // 觸發方式（當多種功能重疊時，會同時觸發）
  highlight?: boolean; // highlight選中行
}

export interface PagerItem {
  enabled?: boolean; // 是否啟用分頁
	currentPage?: number; // 當前頁面
  pageSize?: number; // 每一頁顯示的條數
  total?: number; // 總頁數
  pagerCount?: number;
  pageSizes?: number[] | Array<{label: string; value: number}>;
  align?: 'left' | 'center' | 'right';
  autoHidden?: boolean; // 當頁面只有一頁時不顯示分頁
  layouts?: string[]; // 分頁自定義項 默認[PrevJump, PrevPage, Jump, PageCount, NextPage, NextJump, Sizes, Total]
}

export interface VxeSortItem {
  orders?: string[]; // 排序類型 'desc', 'asc', 'null'
  sortMethod?: Function;
  multiple?: boolean; // 是否啟用多列組合篩選
  remote?: boolean; // 所有列是否使用服務端排序，如果設置為 true 則不會對數據進行處理
  trigger?: 'default' | 'cell'; // 排序觸發方式（當多種功能重疊時，會同時觸發）
  showIcon?: boolean; // 是否顯示列表排序圖標
}

export interface FilterItem {
  filterMethod?: Function;
  remote?: boolean; // 所有列是否使用服務端排序，如果設置為 true 則不會對數據進行處理
  showIcon?: boolean; // 是否顯示列表排序圖標
}

export interface ExpandItem {
  labelField?: string; // 展開列顯示的字段名，可以直接顯示在單元格中
  expandAll?: boolean; // 默認展開所有行（只會在初始化時被觸發一次）
  expandRowKeys?: string[]; // 默認展開指定行（只會在初始化時被觸發一次，需要有 row-id）
  accordion?: boolean; // 每次只能展開一行
  height?: number; // 展開內容的高度，默認自適應高度
  trigger?: 'default' | 'cell' | 'row'; // 觸發方式（當多種功能重疊時，會同時觸發）
  lazy?: boolean; // 是否用lazyLoading
  loadMethod?: Function; // 該方法用於異步加載展開後的內容（必須返回 Promise<any[]> 對象）
  toggleMethod?: Function; // 該方法在展開或關閉觸發之前調用，可以通過返回值來決定是否允許繼續執行
  visibleMethod?: Function; // 該函數的返回值用來決定是否允許顯示展開按鈕
  reserve?: boolean; // 是否保留展開狀態，對於某些場景可能會用到，比如數據被刷新之後還保留之前展開的狀態（需要有 row-id）
  showIcon?: boolean; // 是否顯示列表排序圖標
  iconOpen?: string;
  iconClose?: string;
  iconLoaded?: string; // 自定義lazyLoading中顯示的圖標
}
