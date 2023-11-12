<template>
  <div class="h-100">
    <FblHeader />
    <FblLayout
      :collapsed="collapsed"
      :title="title"
      :subtitle="subtitle"
      :avatarText="avatarText"
      :avatarActions="avatarActions"
      @onAvatarAction="onAvatarAction($event)"
    >
      <template v-slot:side>
        <input
          id="sider-trigger"
          v-model="collapsed"
          type="checkbox"
          style="display: none"
        >
        <div class="layout-sider-logo">
          <span class="layout-sider-title">核保審核平台</span>
          <div class="d-flex align-items-center">
            <a-icon
              class="trigger"
              type="sync"
              @click="() => (collapsed = !collapsed)"
            />
            <a-divider class="layout-sider-logo__divider" type="vertical" />
            <a-icon
              class="trigger menuFold"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
          </div>
        </div>
        <FblSideMenu
          :items="menuItems"
          :collapsed="collapsed"
          @onItemNavigated="onItemNavigated($event)"
        >
          <template v-slot:renderer="slotProp">
            <!-- {{ slotProp.data }} -->
            <div class="sideMenu__titleWrap">
              <span class="sideMenu__title">{{ slotProp.data.title }}</span>
            </div>
          </template>
          <template v-slot:subrenderer="slotProp">
            <div class="sideMenu__titleWrap">
              <a-badge :dot="!!slotProp.data.caseCount && collapsed">
                <i v-if="getMenuSvg( slotProp.data.key)" class="sideMenu__icon" :class="`sideMenu__icon__${getMenuSvg( slotProp.data.key)}`" />
              </a-badge>
              <span class="sideMenu__title">{{ slotProp.data.title }}</span>
              <a-badge v-if="slotProp.data.caseCount && !collapsed" class="sideMenu__badge ms-auto" :count="slotProp.data.caseCount" />
            </div>
          </template>
        </FblSideMenu>
      </template>
      <template v-slot:content>
        <router-view />
      </template>
    </FblLayout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FblLayout from '@/components/shared/layout/FblLayout.vue';
import FblSideMenu from '@/components/shared/side-menu/FblSideMenu.vue';
import { FblMenuItem } from '@/components/shared/side-menu/model';
import { FblAvatarAction } from '@/components/shared/layout/models';
import { Subject } from 'rxjs';
// import { MenuNode } from "@fubonlife/f2b_re-api-axios-sdk";
import { takeUntil } from 'rxjs/operators';
import FblHeader from '@/components/shared/layout/FblLayout__header.vue';

// TEST:
interface MenuNode {
    /**
     * 子選單節點
     * @type {Array<MenuNode>}
     * @memberof MenuNode
     */
    children?: Array<MenuNode>;
    /**
     *
     * @type {MenuDto}
     * @memberof MenuNode
     */
    item?: MenuDto;
}
interface MenuDto {
    /**
     * 是否啟用
     * @type {boolean}
     * @memberof MenuDto
     */
    enabled?: boolean;
    /**
     * 是否為末端節點 (可點擊之功能)
     * @type {boolean}
     * @memberof MenuDto
     */
    isLeaf?: boolean;
    /**
     * 選單 ID
     * @type {string}
     * @memberof MenuDto
     */
    menuId?: string;
    /**
     * 顯示名稱
     * @type {string}
     * @memberof MenuDto
     */
    menuName?: string;
    /**
     * 排序
     * @type {number}
     * @memberof MenuDto
     */
    menuSort?: number;
    /**
     * 父級選單 ID
     * @type {string}
     * @memberof MenuDto
     */
    parentId?: string;
    /**
     * 前端路由
     * @type {string}
     * @memberof MenuDto
     */
    route?: string;
    /**
     * 任意網址
     * @type {string}
     * @memberof MenuDto
     */
    uri?: string;
    caseCount?: number | string;
}

@Component({
  components: {
    FblLayout,
    FblHeader,
    FblSideMenu,
  },
})
export default class MainPage extends Vue {
  private collapsed = false;

  private unsubscribe$ = new Subject<void>();

  public title = 'F2B_RE';

  public subtitle = 'An example Vue project';

  public avatarText = '';

  public avatarActions: FblAvatarAction[] = [
    {
      name: 'logout',
      title: '登出',
    },
  ];

  public menuItems: FblMenuItem[] = [];

  // TEST: 假menu資料
  testMenuItems = {
    item: null,
    children: [
      {
        item: {
          menuId: 'first01',
          isLeaf: false,
          menuName: '審核',
          route: null,
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: null,
        },
        children: [
          {
            item: {
              menuId: 'second101',
              isLeaf: true,
              menuName: '待審核',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 1000,
            },
            children: [],
          },
          {
            item: {
              menuId: 'second102',
              isLeaf: true,
              menuName: '照會回覆待審核',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 0,
            },
            children: [],
          },
          {
            item: {
              menuId: 'second103',
              isLeaf: true,
              menuName: '會辦回覆待審核',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 0,
            },
            children: [],
          },
          {
            item: {
              menuId: 'second104',
              isLeaf: true,
              menuName: '退費待審核',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 3,
            },
            children: [],
          },
          {
            item: {
              menuId: 'second105',
              isLeaf: true,
              menuName: '待取消案件',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 0,
            },
            children: [],
          },
        ],
      },
      {
        item: {
          menuId: 'first02',
          isLeaf: false,
          menuName: '風控',
          route: null,
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: null,
        },
        children: [
          {
            item: {
              menuId: 'second201',
              isLeaf: true,
              menuName: '風控電訪中',
              route: '121',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 5,
            },
            children: [],
          },
          {
            item: {
              menuId: 'second202',
              isLeaf: true,
              menuName: '風控親訪中',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 0,
            },
            children: [],
          },
          {
            item: {
              menuId: 'second203',
              isLeaf: true,
              menuName: '風控回覆',
              route: '',
              uri: null,
              enabled: true,
              menuSort: 1,
              parentId: '',
              caseCount: 0,
            },
            children: [],
          },
        ],
      },
    ],
  }

  // svg 比對表
  svgIdenum = {
    second101: 'id',
    second102: 'eye',
    second103: 'id',
    second104: 'eye',
    second105: 'eye',
    second201: 'id',
    second202: 'eye',
    second203: 'eye',
  };

  // onAvatarAction(action: FblAvatarAction) {
  //   switch (action.name) {
  //     case "logout":
  //       this.signOut();
  //       break;
  //   }
  // }
  // onItemNavigated(item: FblMenuItem) {
  //   this.title = item ? item.title : "F2B_RE";
  // }

  // signOut() {
  //   this.$user.signOut();
  //   this.$router.replace({ path: "/login" });
  // }

  /**
   * Func
   */
  // 將 api menu 重新打包格式
  toMenuItem(node: MenuNode, rootTitle?: string) {
    const { item, children } = node;
    return {
      key: item.menuId,
      title: item.menuName,
      route: item.route,
      uri: item.uri,
      caseCount: item.caseCount,
      children: children.map((c) => this.toMenuItem(c)),
    };
  }

  // 取得對應svg value
  getMenuSvg(id) {
    return this.svgIdenum[id] || null;
  }

  /**
   * Hook
   */
  created() {
    // this.$user.loginState$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((state) => {
    //     if (state && state.me) {
    //       this.avatarText = state.me.employeeId;
    //     }
    //   });
    // this.$authApi.getAuthorizedMenuTreeUsingGET().then((resp) => {
    //   const node = resp.data;
    //   this.menuItems = node.children.map((c) => this.toMenuItem(c));
    // });

    // TEST:
    this.menuItems = this.testMenuItems.children.map((c) => this.toMenuItem(c));
  }

  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>
.layout-sider-logo {
  padding: 12px 10px 12px 26px;
  font-size: 20px;
  font-weight: 600;
  color: $COLOR-WHITE;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout-sider-logo__divider {
  font-size: 2.3rem;
  margin: 0 11px;
}

.sideMenu__titleWrap {
  display: flex;
  align-items: center;
}
.sideMenu__title {
  font-size: 16px;
  margin-left: 20px;
}

::v-deep {
  // 收合樣式
  .collapsed {
    .layout-sider-logo {
      padding: 22.6px 23px;
      .layout-sider-title,
      i[aria-label='icon: sync'],
      .layout-sider-logo__divider {
        display: none;
      }
    }
    .ant-menu-submenu-title {
      padding-left: 3px !important;
      justify-content: center;
    }
    .ant-menu-sub {
      .ant-menu-item {
        padding-left: 10px !important;
        .sideMenu__titleWrap {
          justify-content: center;
        }
        .sideMenu__title {
          display: none;
        }
      }
    }
  }
  .ant-menu {
    background: transparent;
    &:not(.ant-menu-horizontal) {
      .ant-menu-item-selected {
        background-color: initial;
      }
    }
  }
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0;
    .sideMenu__title {
      margin-left: 0;
    }
  }
  .ant-menu-root {
    border-top: 0.5px solid $COLOR-WHITE;
    > .ant-menu-submenu {
      > .ant-menu-submenu-title {
        width: 100%;
        height: auto;
        line-height: initial;
        margin: 0;
        padding: 3px;
        color: $COLOR-WHITE;
        display: flex;
        border-bottom: 0.5px solid $COLOR-WHITE;
        .ant-menu-submenu-arrow {
          display: none;
        }
      }
    }
  }
  .ant-menu-sub {
    &.ant-menu-inline {
      padding-top: 8px;
      padding-bottom: 8px;
      > .ant-menu-item {
        width: 100%;
        height: auto;
        color: $COLOR-WHITE;
        line-height: initial;
        padding: 7px 10px;
        margin: 0;
        .sideMenu__title {
          margin-left: 15px;
        }
        .sideMenu__badge {
          .ant-badge-count {
            background: transparent;
            min-width: 3em;
          }
        }
      }
    }
  }
}

</style>
