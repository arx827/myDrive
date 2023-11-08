export interface FblLevelSelectHolder {
    levels: FblLevelConfig[],
    selected: {[key: string] : (string | number | Array<string | number>)},
};
export interface FblLevelConfig {
    title?: string,
    property: string,
    placeholder?: string,
    multiple?: boolean,
    allowClear?: boolean,
    showSearch?: boolean,
    load: (prev: FblLevelState) => Promise<FblLevelSelectOption[]>
};
export interface FblLevelState {
    isFirst: boolean,
    isLast: boolean,
    config: FblLevelConfig,
    options: FblLevelSelectOption[],
    value: string | number | Array<string | number>
};
export interface FblLevelSelectOption {
    value: string | number,
    label: string,
}