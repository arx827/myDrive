export interface FblMenuSettingForm {
    menuId?: string;
    menuName?: string;
    resourceId?: string;
    parentMenuId?: string;
    isLeaf?: string | boolean;
    enable?: string | boolean;
}

export interface MenuFormDto{
    menuId?: string;
    menuName?: string;
    resourceId?: string;
    parentMenuId?: string;
    isLeaf?: string | boolean;
    enable?: string | boolean;
    sortSequence?:number,
}