export interface FblMenuItem {
    key?: string,
    title?: string,
    iconName?: string,
    route?: string,
    uri?: string,
    children?: FblMenuItem[],
    disabled?: boolean,
    rootTitle?: string;
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