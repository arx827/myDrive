export interface FblMenuItem {
    key?: string,
    title?: string,
    route?: string,
    uri?: string,
    children?: FblMenuItem[],
    disabled?: boolean,
    casesCount?:string,
    // 急件數
    emergencyCase?:string,
}
export interface FblRenderMenuItem {
    key?: string,
    title?: string,
    route?: string,
    uri?: string,
    children?: FblMenuItem[],
    disabled?: boolean,
    level?: number,
    selected: boolean;
}