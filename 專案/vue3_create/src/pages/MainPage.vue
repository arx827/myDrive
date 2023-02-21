<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const $router = useRouter()
const $route = useRoute()

const title = ref(import.meta.env.VITE_APP_TITLE)
const sideMenuState = ref({
  theme: 'dark',
  collapsed: false,
  openKeys: [],
  preOpenKeys: [],
  selectedKeys: [],
  mode: 'vertical',
})

// TEST: 測試用 側邊選單 假資料
const apiMenuItems = ref([
  {
    item: {
      menuId: 'comp',
      isLeaf: false,
      menuName: '元件',
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
          menuName: '表單',
          route: '/comp/form',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 1000,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second102',
          isLeaf: true,
          menuName: 'Table',
          route: '/comp/table',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 3,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second103',
          isLeaf: true,
          menuName: 'Message_訊息',
          route: '/comp/message',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second104',
          isLeaf: true,
          menuName: 'Notification_通知提醒框',
          route: '/comp/notification',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second105',
          isLeaf: true,
          menuName: 'Modal_彈窗',
          route: '/comp/modal',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second106',
          isLeaf: true,
          menuName: 'Result_結果頁',
          route: '/comp/result',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second107',
          isLeaf: true,
          menuName: '上傳元件',
          route: '/comp/upload',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'comp',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'second108',
          isLeaf: true,
          menuName: '-> 另開頁面',
          route: '',
          uri: 'https://www.google.com/',
          enabled: true,
          menuSort: 1,
          parentId: null,
          caseCount: 0,
        },
        children: [],
      },
    ],
  },
  {
    item: {
      menuId: 'demo',
      isLeaf: false,
      menuName: 'Demo',
      route: null,
      uri: null,
      enabled: true,
      menuSort: 1,
      parentId: null,
    },
    children: [
      {
        item: {
          menuId: 'passParams',
          isLeaf: true,
          menuName: '參數傳遞/傳送',
          route: '/demo/passParams',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'demo',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'getParams',
          isLeaf: true,
          menuName: '參數傳遞/接收',
          route: '/demo/getParams',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'demo',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'numberUtilFunc',
          isLeaf: true,
          menuName: '數字轉換',
          route: '/demo/numberUtilFunc',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'demo',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'dateTimeUtilFunc',
          isLeaf: true,
          menuName: 'DateTime轉換',
          route: '/demo/dateTimeUtilFunc',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'demo',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'validateUtilFunc',
          isLeaf: true,
          menuName: 'Validate驗證',
          route: '/demo/validateUtilFunc',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'demo',
          caseCount: 0,
        },
        children: [],
      },
    ],
  },
  {
    item: {
      menuId: 'vue3',
      isLeaf: false,
      menuName: 'Vue3 實作練習',
      route: null,
      uri: null,
      enabled: true,
      menuSort: 1,
      parentId: null,
    },
    children: [
      {
        item: {
          menuId: 'docVue3',
          isLeaf: true,
          menuName: 'Vue3基礎知識',
          route: '/vue3/doc-vue3',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'vue3',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docVue3Answer',
          isLeaf: true,
          menuName: '[解]_ToDoList 小作業',
          route: '/vue3/doc-vue3-answer',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'vue3',
          caseCount: 0,
        },
        children: [],
      },
    ],
  },
  {
    item: {
      menuId: 'doc',
      isLeaf: false,
      menuName: '使用手冊',
      route: null,
      uri: null,
      enabled: true,
      menuSort: 1,
      parentId: null,
    },
    children: [
      {
        item: {
          menuId: 'docCreate',
          isLeaf: true,
          menuName: '建置專案',
          route: '/doc/doc-create',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docArchitecture',
          isLeaf: true,
          menuName: '架構說明',
          route: '/doc/doc-architecture',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docUnpluginVueComponents',
          isLeaf: true,
          menuName: 'Unplugin-vue-components',
          route: '/doc/doc-unplugin-vue-components',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docStyle',
          isLeaf: true,
          menuName: '樣式客製說明 (SCSS、Ant Design Vue、Bootstrap 5)',
          route: '/doc/doc-style',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docTable',
          isLeaf: true,
          menuName: '表格元件',
          route: '/doc/doc-table',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docFormValidate',
          isLeaf: true,
          menuName: '欄位檢核',
          route: '/doc/doc-form-validate',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docAddGlobal',
          isLeaf: true,
          menuName: '共用方法建立與使用',
          route: '/doc/doc-add-global',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docModalAndNotification',
          isLeaf: true,
          menuName: '彈窗、通知提醒框使用',
          route: '/doc/doc-modal-and-notification',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docApi',
          isLeaf: true,
          menuName: '宣告及呼叫API',
          route: '/doc/doc-api',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
      {
        item: {
          menuId: 'docUser',
          isLeaf: true,
          menuName: '會員機制',
          route: '/doc/doc-user',
          uri: null,
          enabled: true,
          menuSort: 1,
          parentId: 'doc',
          caseCount: 0,
        },
        children: [],
      },
    ],
  },
])

function toMenuItem(node) {
  const { item, children } = node
  return {
    key: item.menuId,
    title: item.menuName,
    route: item.route,
    uri: item.uri,
    caseCount: item.caseCount,
    parentId: item.parentId,
    children: children && children.length > 0 ? children.map(c => toMenuItem(c)) : null,
  }
}

function getFlatMenuList(data) {
  let $return = []
  function replay(date) {
    date.map(i => {
      if (i.children && i.children.length > 0) {
        replay(i.children)
      } else {
        $return.push(i)
      }
    })
  }
  replay(data)
  return $return
}

const menuItems = computed(() => {
  return apiMenuItems.value.map(c => toMenuItem(c))
})

const autoActionMenu = () => {
  // 尋找 目前路徑 對應的 menu list
  const flatMenuListArr = getFlatMenuList(menuItems.value)
  const filterCurrentPage = flatMenuListArr.find(i => {
    const iArr: string[] = Array.from<string>(i.route.split('/')).filter(el => el) // 每一組陣列
    const routerArr: string[] = Array.from<string>($router.currentRoute.value.fullPath.split('/')).filter(el => el) // 目前router
    // 判斷 iArr 全包含在 routerArr 中
    return i.route && iArr.every(i => routerArr.includes(i))
  })
  // 作用中的 menu
  sideMenuState.value.selectedKeys = [filterCurrentPage.key]
  // 將 目前主題 加入 openKeys
  sideMenuState.value.openKeys = [filterCurrentPage.parentId]
}

function toggleCollapsed() {
  sideMenuState.value.collapsed = !sideMenuState.value.collapsed
  if (!sideMenuState.value.collapsed) {
    autoActionMenu()
  }
}

/**
 * 監聽
 */
watch(
  () => $route,
  () => {
    autoActionMenu()
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
<template>
  <div class="h-100">
    <LayoutHeader />
    <Loading />
    <div id="components-layout-demo-fixed-sider" class="d-flex" :class="{ collapsed: sideMenuState.collapsed }">
      <div class="layout__sideWrap">
        <FblSideMenu
          :propData="sideMenuState"
          :title="title"
          :items="menuItems"
          @update:openKeys="sideMenuState.openKeys = $event"
          @update:collapsed="toggleCollapsed"
        />
      </div>
      <div class="main__content">
        <LayoutBreadcrumb />
        <RouterView />
        <LayoutFooter />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#components-layout-demo-fixed-sider {
  padding-top: #{$MAIN-HEADER-H}px;

  // 收合尺寸
  &.collapsed {
    --fixed-sider-W: 68px;
  }
}

.layout__sideWrap {
  width: var(--fixed-sider-W);
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - #{$MAIN-HEADER-H}px);
  // position: fixed;
  // left: 0;
  box-shadow: 1px 0 4px rgba(0, 21, 41, 0.5);
  z-index: 20;
  background: transparent
    linear-gradient(
      180deg,
      nth($COLOR-MAIN-BG-LINEAR, 1) 0%,
      nth($COLOR-MAIN-BG-LINEAR, 2) 39%,
      nth($COLOR-MAIN-BG-LINEAR, 3) 100%
    )
    0% 0% no-repeat padding-box;
  padding-bottom: 20px;
  .sideMenu__titleWrap {
    display: flex;
    align-items: start;
    :deep(.ant-badge) {
      margin: 1px 5px 1px 1px;
    }
  }

  .sideMenu__title {
    font-size: 16px;
    white-space: break-spaces;
  }
}

$container__margin__y: 7px;
.main__content {
  width: calc(100% - var(--fixed-sider-W));
  background: #fff;
  overflow: auto;
  height: calc(100vh - #{$MAIN-HEADER-H}px);
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
}

:deep(.page__header__tabBar) {
  height: calc(100vh - 60px);
  .ant-tabs-nav {
    align-items: stretch;
    margin: 0;
  }
  .ant-tabs-content-holder {
    background: $COLOR-WHITE;
    border: {
      color: $COLOR-GRAY2;
      style: solid;
      width: 0 1px 1px;
    }
  }
}

.ant-tabs-extra-content {
  .tabs-extra-button {
    line-height: initial;
    height: 100%;
    padding: 4px;
  }
}

:deep(.ant-tabs-card) {
  > .ant-tabs-nav,
  > div > .ant-tabs-nav {
    .ant-tabs-tab {
      padding: 5px 13px;
      margin-left: 3px;
      background: $COLOR-GRAY3;
      border-left-color: $COLOR-GRAY4;
      border-top-color: $COLOR-GRAY4;
      border-right-color: $COLOR-GRAY4;
      box-shadow: inset 0px -8px 10px -13px rgba(0, 0, 0, 0.5);
      &.ant-tabs-tab-active {
        border: 1px solid $COLOR-MAIN5;
        border-bottom-color: $COLOR-WHITE;
        box-shadow: none;
        .ant-tabs-tab-btn {
          color: $COLOR-MAIN5;
        }
      }
    }
    .ant-tabs-tab-active {
      color: $COLOR-MAIN5;
      background: $COLOR-WHITE;
    }
  }
  &.ant-tabs-top {
    > .ant-tabs-nav,
    > div > .ant-tabs-nav {
      .ant-tabs-tab {
        border-radius: 5px 5px 0 0;
        + .ant-tabs-tab {
          margin-left: 3px;
        }
      }
      .ant-tabs-tab-active {
        border-radius: 5px 5px 0 0;
      }
    }
  }
  .ant-tabs-tab-remove {
    display: flex;
    font-size: 15px;
  }
}

.menu-icon__color {
  color: #fff;
}
</style>
