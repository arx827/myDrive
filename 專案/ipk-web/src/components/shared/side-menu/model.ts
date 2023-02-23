export interface FblMenuItem {
    key?: string;
    title?: string;
    route?: string;
    uri?: string;
    children?: FblMenuItem[];
    disabled?: boolean;
    icon?: string;
    breadCrumb?: string;
    isLeaf?: boolean;
    description?: string;
}
export interface FblRenderMenuItem {
    key?: string;
    title?: string;
    route?: string;
    uri?: string;
    children?: FblRenderMenuItem[];
    disabled?: boolean;
    level?: number;
    selected: boolean;
    data?: FblMenuItem;
    icon?: string;
    breadCrumb?: string;
}
