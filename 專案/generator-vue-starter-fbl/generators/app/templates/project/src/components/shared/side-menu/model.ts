export interface FblMenuItem {
    key?: string,
    title?: string,
    route?: string,
    uri?: string,
    children?: FblMenuItem[],
    disabled?: boolean,
}
export interface FblRenderMenuItem {
    key?: string,
    title?: string,
    route?: string,
    uri?: string,
    children?: FblRenderMenuItem[],
    disabled?: boolean,
    level?: number,
    selected: boolean,
    data?: FblMenuItem,
}