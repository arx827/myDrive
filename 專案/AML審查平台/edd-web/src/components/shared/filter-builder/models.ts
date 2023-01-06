export interface FblFilters {
    filters: FblFilter[]
}
export interface FblFilter {
    property: string;                       //  backend proprty
    operator: FblOperator;
    operand: Array<string | number | Date>;  // value
    
}

export interface FblFilterItem {
    property: string,   // backend proprty
    title: string,      // table title
    dataType: FblFilterDataType,   // default filter

    // operator option
    excludedOperators?: FblOperator[], // excluded filter

    // STRING
    enum?: Array<string | number>,

    // NUMBER
    min?: number,
    max?: number,
    step?: number,
}

export enum FblFilterDataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATETIME = "DATETIME",
}

export enum FblOperator {
    // COMPARE
    EQ = "EQ",
    NEQ = "NEQ",
    LT = "LT",
    GT = "GT",
    LEQ = "LEQ",
    GEQ = "GEQ",

    // STRING
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    END_WITH = "END_WITH",

    // OTHER
    BETWEEN = "BETWEEN"
}

export const EMPTY_FILTER: FblFilters = {
    filters: []
}

export const DEFAULT_STRING_OPERATORS: FblOperator[] = [
    FblOperator.EQ,
    FblOperator.NEQ,
    FblOperator.CONTAINS,
    FblOperator.NOT_CONTAINS,
    FblOperator.STARTS_WITH,
    FblOperator.END_WITH
];

export const DEFAULT_NUMBER_OPERATORS: FblOperator[] = [
    FblOperator.EQ,
    FblOperator.NEQ,
    FblOperator.LT,
    FblOperator.GT,
    FblOperator.LEQ,
    FblOperator.GEQ,
    FblOperator.BETWEEN,
]

export const DEFAULT_BOOLEAN_OPERATORS: FblOperator[] = [
    FblOperator.EQ,
    FblOperator.NEQ,
]

export const DEFAULT_DATE_OPERATORS: FblOperator[] = [
    FblOperator.EQ,
    FblOperator.LEQ,
    FblOperator.GEQ,
    FblOperator.BETWEEN
]

export const DEFAULT_DATETIME_OPERATORS: FblOperator[] = [
    FblOperator.EQ,
    FblOperator.LEQ,
    FblOperator.GEQ,
    FblOperator.BETWEEN
]

export const OPERATOR_TITLE_MAP = {
    EQ: "等於",
    NEQ: "不等於",
    LT: "小於",
    GT: "大於",
    LEQ: "小於或等於",
    GEQ: "大於或等於",
    CONTAINS: "包含",
    NOT_CONTAINS: "不包含",
    STARTS_WITH: "開頭為",
    END_WITH: "結尾為",
    BETWEEN: "介於"
}

export interface FblFilterHolder {
    filters: FblFilters;
    filterItems: FblFilterItem[]
}