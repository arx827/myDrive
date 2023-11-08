import { Module, VuexModule, Mutation, MutationAction, getModule } from 'vuex-module-decorators';
import axios from 'axios';
import { store } from '@/plugins/store';
import { FblMenuItem } from "@/components/shared/side-menu/model";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MappingUtil from "@/assets/config/MappingUtil";
import { ReviewSettingCreation, ReviewSettingCreationTypeEnum } from "@fubonlife/obd-api-axios-sdk";
const CURRENT_MENU_ITEM = 'current_menu_item';

@Module({ dynamic: true, namespaced: true, store, name: 'UserMenuItemsModule' })
export default class UserMenuItemsModule extends VuexModule {

  menuItems$: FblMenuItem[] = [];

  //當前頁面menuItem內容
  currentMenuItem$: FblMenuItem = null;

  thirdMenuId$: string = null;

  tabActiveKey$: string=null;

  @Mutation
  updateTabActiveKey(tabActiveKey: string) {
    this.tabActiveKey$=tabActiveKey;
  }

  get tabActiveKey():string{
    return this.tabActiveKey$;
  }

  reviewableSettingSearchDto$: ReviewSettingCreation = null;

  @Mutation
  updateReviewableSettingSearchDto(object: ReviewSettingCreation) {
    this.reviewableSettingSearchDto$ = object;
  }

  @MutationAction({ mutate: ['reviewableSettingSearchDto$'] })
  async updateReviewableSettingActionSearchDto(object: ReviewSettingCreation) {
    
    return {
      reviewableSettingSearchDto$: object
    }
  
  }

  @Mutation
  updateThirdMenuId(thirdMenuId: string) {
    this.thirdMenuId$ = thirdMenuId;
  }

  get thirdMenuID(): string {

    return this.thirdMenuId$;
  }

  //更新當前頁面menuItme內容
  @MutationAction({ mutate: ['currentMenuItem$'] })
  async updateCurrentMenuItem(menuItem) {
    //存放至localStorage
    localStorage.setItem(CURRENT_MENU_ITEM, JSON.stringify(menuItem));
    return {
      currentMenuItem$: menuItem
    }
  }

  //取得當前頁面menuItme內容
  get currentMenuItem(): FblMenuItem {
    const memCurrentMenuItem = this.currentMenuItem$;
    if (memCurrentMenuItem) {
      return memCurrentMenuItem;
    }
    const currentMenuItemStr = localStorage.getItem(CURRENT_MENU_ITEM);
    if (currentMenuItemStr) {
      return JSON.parse(currentMenuItemStr);
    }
    return null;
  }

  @Mutation
  setMenuItems(menuItems: FblMenuItem[]) {
    this.menuItems$ = menuItems;
  }
  //更新待電訪項目 (目前沒用到)
  @MutationAction({ mutate: ['menuItems$'] })
  async updateMenuPendingCasesCounts() {
    let menuKeyAndCaseCountsmap = new Map();
    let menuItems: FblMenuItem[] = [];
    let prevMenuItems: Array<FblMenuItem> = [];
    this.menuItems$.forEach((e: FblMenuItem) => prevMenuItems.push(e));
    //這裡需加await 後面的menuKeyAndCaseCountsmap才不會取到null
    await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/casecounts/getPendingCasesCount`)
      .then((res) => {
        const object = res.data;
        for (let key in object) {
          menuKeyAndCaseCountsmap.set(key, object[key]);
        }
        prevMenuItems
          .filter((e) => e.key == "OUTBOUND")
          .forEach((e) => {
            e.children
              .filter((e) => e.key == "PENDDING_MENU")
              .forEach((e) => {
                e.casesCount = menuKeyAndCaseCountsmap.get("PENDDING_MENU");
              });
          });
        menuItems = prevMenuItems;
      })
      .catch((error) => {
        console.log(error)
      });
    return {
      menuItems$: menuItems
    }
  }

  //更新ａｌｌ電訪項目數量 (目前沒用到)
  @MutationAction({ mutate: ['menuItems$'] })
  async updateMenuItems() {

    let menuKeyAndCaseCountsmap = new Map();
    let menuItems: FblMenuItem[] = [];
    await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/casecounts`)
      .then((res) => {
        const object = res.data;
        for (let key in object) {
          menuKeyAndCaseCountsmap.set(key, object[key]);
        }
      })
      .catch((error) => {
        console.log(error)
      });
    await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/menu`)
      .then((resp) => {
        const nodes = resp.data;
        menuItems = nodes.children.map((c) => MappingUtil.toMenuItem(c));
        menuItems.forEach((parentMenu) => {
          if (parentMenu.children != null) {
            parentMenu.children.forEach((e) => {
              e.casesCount = menuKeyAndCaseCountsmap.get(e.key);
            });
          }
        });

      })
      .catch((error) => {
        console.log(error)
      });

    return {
      menuItems$: menuItems
    }

  }
  // 清空所有menu物件
  @Mutation
  clearMenuItems(this) {
    this.menuItems$ = [];
    this.currentMenuItem$ = null;
    this.thirdMenuId$ = null;
    this.tabActiveKey$=null;
  }

  // 取得所有 menuItems
  get getMenuItem() {
    return this.menuItems$;
  }
}
export const MenuItemsModule = getModule(UserMenuItemsModule);