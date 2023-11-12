export enum FblColumnType {
    PLAIN = "PLAIN",
    TEMPLATE = "TEMPLATE",
    BADGE = "BADGE",
    TAG = "TAG",
    ACTION = "ACTION",
    ACTIONCONTROL = "ACTIONCONTROL",
    ACTIONDELETE = "ACTIONDELETE",
    IMAGE = "IMAGE",
    COLLAPSE="COLLAPSE",
    CHECKBOX = "CHECKBOX",
    BUTTON="BUTTON",
    SELECTION="SELECTION",
    ELLIPSIS = "ELLIPSIS",
    INPUTNUMBER = "INPUTNUMBER",
    LINK = "LINK",
}

export interface FblAction<T> {
    name: string;
    title: string;
    more?: boolean;
    hidden?: ((data:T) => boolean)|boolean;
    edit?:boolean;
    delete?:boolean;
    setting?:boolean;
    unlock?:boolean;
    skill?:boolean;
    add?:boolean
    role?:boolean;
    download?: boolean;
    uploadButton?:boolean;
    button?: boolean;
    filePdf?: boolean;
    urlResource?:boolean;
    functionResource?:boolean;
    formatter?: (data) => boolean;
    formatterBoolean?: boolean;
}

export interface FblColumn<T> {
    
    type: FblColumnType;
    title: string;
    property?: keyof T;
    width?: number;
    actions?: FblAction<T>[];
    actionsNoDelete?: FblAction<T>[];
    moreActionTitle?: string;
    hidden?: boolean;
    template?: string;
    sorter?: boolean;
    sortProperty?: string;
    defaultSortOrder?: string;
    inspect?: ((data: T) => boolean) | boolean;
    formatter?: (data: T) => string;
    badgeColor?: (data: T) => string | string;
    tagColor?: (data: T) => string | string;
    align?: string;
    maxLength?: number;
    fontSize?: number;
    fixed?: string | boolean;
    // 需抓取的list裡面的key值
    linkTemplate?: string;
    // 中間間格需給的符號
    spliteSign?: string;
    customRender?: any;
}

export interface FblRow<T> {
    data: T;
}

export interface FblActionEvent<T> {
    row: FblRow<T>;
    action: FblAction<T>;
}
export interface Pagination {
    current?: number;
    pageSize?: number;
    total?: number;
    pageSizeOptions?: string[]; // 指定可選擇每頁多少筆資料
    showSizeChanger?: boolean;  // 是否顯示變更每頁幾筆的下拉選單
    locale?: object;            // 自訂每頁幾筆的下拉選單的 wording
    showTotal?: boolean;        // 顯示總筆數
}

export interface SortItem {
    selector?: string;
    desc?: boolean;
}

export interface FblPDataGridHolder<T> {
    rowKey: string,
    data: T[],
    pagination?: Pagination,
    // pageIdx: number,
    // pageSize: number,
    // total: number,
    sort?: SortItem,
    columns: FblColumn<T>[];
    scroll?: object;
}

export let EMPTY_PAGE: Page<any> = {
    content: [],
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    size: 0,
    totalElements: 1,
    totalPages: 0
};

export interface Page<T> {
    content?: Array<T>;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    size?: number;
    totalElements?: string | number;
    totalPages?: number;
}

export interface FblPageEvent {
    pagination: Pagination;
    sort: SortItem;
}




