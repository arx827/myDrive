export enum FblColumnType {
    PLAIN = "PLAIN",
    TEMPLATE = "TEMPLATE",
    BADGE = "BADGE",
    TAG = "TAG",
    ACTION = "ACTION"
}

export interface FblAction<T> {
    name: string;
    title: string;
    more?: boolean;
    disabled?: boolean | ((row: FblRow<T>) => boolean);
}

export interface FblColumn<T> {
    type: FblColumnType;
    title: string;
    property?: string;
    width?: number;
    minWidth?: number;
    actions?: FblAction<T>[];
    moreActionTitle?: string;
    actionButtonType?: string;
    hidden?: boolean;
    fixed?: 'left' | 'right';
    template?: string;
    inspect?: boolean;
    sorter?: boolean;
    sortProperty?: string;
    formatter?: (data: T) => string;
    badgeColor?: (data: T) => string | string;
    tagColor?: (data: T) => string | string;
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
}
export interface SortItem {
    selector?: string;
    desc?: boolean;
}
export interface FblPDataGridHolder<T> {
    rowKey: string,
    data: T[],
    pagination: Pagination,
    sort?: SortItem,
    columns: FblColumn<T>[];
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
    pagination: Pagination
    sort: SortItem
}
