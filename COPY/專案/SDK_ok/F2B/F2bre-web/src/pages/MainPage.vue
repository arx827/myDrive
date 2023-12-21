<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  // import FblLayout_header from '@/components/layout/FblLayout_header.vue';
  // import FblSideMenu from '../components/layout/side-menu/FblSideMenu.vue';
  import { v4 as uuidv4 } from 'uuid';
  import {
    LeftOutlined,
    RightOutlined,
    CloseCircleFilled
  } from '@ant-design/icons-vue';
  let collapsed = ref<boolean>(false);
  const title = '核保審核平台';

  // TEST: 假menu資料
  const apiMenuItems = reactive({
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
              route: 'AuditPage',
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
              uri: 'https://www.google.com/',
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
  });

  const openKeys = reactive(['first01']);
  const selectedKeys = reactive([]);

  // svg 比對表
  const svgIdenum = {
    second101: 'id',
    second102: 'id',
    second103: 'id',
    second104: 'id',
    second105: 'id',
    second201: 'id',
    second202: 'id',
    second203: 'id',
  };

  /**
   * Func
   */
  // 將 api menu 重新打包格式
  function toMenuItem(node) {
    const { item, children } = node;
    return {
      key: item.menuId,
      title: item.menuName,
      route: item.route,
      uri: item.uri,
      caseCount: item.caseCount,
      children: children && children.length > 0 ? children.map((c) => toMenuItem(c)) : null,
    };
  }

  const menuItems = computed(() => {
    return apiMenuItems.children.map((c) => toMenuItem(c));
  })

  // 取得對應svg value
  function getMenuSvg(id) {
    return svgIdenum[id] || null;
  }

  /**
   * Hook
   */


  let activeKey = ref('1');
  let panes = ref<{title: string; content: string; key: string; closable?: boolean}[]>([
    { title: '待審核', content: '待審核', key: '1', closable: false },
    { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
    { title: 'Tab 3', content: 'Content of Tab 3', key: '3' },
  ]);

  /**
   * Event
   */

  const onEdit = (targetKey: string | MouseEvent, action: string) => {
    if(action === 'add') {
      add();
    }else{
      remove(targetKey as string);
    }
  }

  const add = () => {
    activeKey.value = `newTab${uuidv4()}`;
    panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value });
  };

  const remove = (targetKey: string) => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes.value = panes.value.filter(pane => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
      if (lastIndex >= 0) {
        activeKey.value = panes.value[lastIndex].key;
      } else {
        activeKey.value = panes.value[0].key;
      }
    }
  };

  const prevTab = () => {
    const $idx = panes.value.indexOf(panes.value.find(pane => pane.key === activeKey.value));
    if($idx !== 0) {
      activeKey.value = panes.value[$idx - 1].key;
    }
  }

  const nextTab = () => {
    const $idx = panes.value.indexOf(panes.value.find(pane => pane.key === activeKey.value));
    if($idx !== panes.value.length) {
      activeKey.value = panes.value[$idx + 1].key;
    }
  }
</script>

<template>
  <div class="h-100">
    <fbl-layout_header />
    <a-layout id="components-layout-demo-fixed-sider" :class="{ 'collapsed': collapsed }">
      <a-layout-sider class="layout__sideWrap" :width="null" :trigger="null">
        <FblSideMenu
          :collapsed="collapsed"
          :title="title"
          :items="menuItems"
          :openKeys="openKeys"
          :selectedKeys="selectedKeys"
          @changeCollapsed="collapsed = !collapsed"
        >
          <template v-slot:renderer="slotProp">
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
      </a-layout-sider>
      <div class="main__content">
        <a-tabs
          v-model:activeKey="activeKey"
          type="editable-card"
          class="page__header__tabBar"
          :hideAdd="true"
          @edit="onEdit"
        >
          <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
            {{activeKey}}
            <template v-if="activeKey === '1'">
            
              <router-view />
            </template>
            <template v-if="activeKey !== '1'">
              {{pane.content}}
            </template>
            <template #closeIcon>
              <close-circle-filled />
            </template>
          </a-tab-pane>
          <template #leftExtra>
            <a-button class="tabs-extra-button" @click="prevTab"><left-outlined /></a-button>
          </template>
          <template #rightExtra>
            <a-button class="tabs-extra-button" @click="nextTab"><right-outlined /></a-button>
          </template>
        </a-tabs>
        
      </div>
    </a-layout>
  </div>
</template>

<style lang="scss" scoped>
#components-layout-demo-fixed-sider {
  padding-top: #{$main-header-H}px;

  // 收合尺寸
  &.collapsed {
    --fixed-sider-W: 68px;
  }
}

.layout__sideWrap {
  width: var(--fixed-sider-W);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: calc(100vh - #{$main-header-H}px);
  // position: fixed;
  // left: 0;
  background: transparent linear-gradient(180deg, nth($COLOR-MAIN-BG-LINEAR, 1) 0%, nth($COLOR-MAIN-BG-LINEAR, 2) 39%, nth($COLOR-MAIN-BG-LINEAR, 3) 100%) 0% 0% no-repeat padding-box;
  .sideMenu__titleWrap {
    display: flex;
    align-items: center;
    :deep(.ant-badge) {
      margin: 1px;
    }
  }

  .sideMenu__title {
    font-size: 16px;
  }
}

$container__margin__y: 7px;
.main__content{
  width: calc( 100% - var(--fixed-sider-W));

  margin: $container__margin__y;
  min-height: calc(100% - ($container__margin__y * 2));
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
</style>
