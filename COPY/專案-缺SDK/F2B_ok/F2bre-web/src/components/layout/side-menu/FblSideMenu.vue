<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  SyncOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
// import FblSubMenu from './FblSubMenu.vue';
const props = defineProps({
  collapsed: Boolean,
  title: String,
  items: Object,
  openKeys: Array,
  selectedKeys: Array
})

let currentOpenMenuKey = reactive([]);
let renderItems = reactive([]);     // 扁平化 items
let keyMap = reactive({});    // items object Map
let routeMap = reactive({});    // items route Map

let $router = useRouter();

const emits = defineEmits(['changeCollapsed']);

function onOpenChange(twoMenuKeys) {
  const nextOpenMenuKey = twoMenuKeys.find(
    (key) => currentOpenMenuKey.indexOf(key) === -1,
  );
  currentOpenMenuKey = twoMenuKeys.length != 0 ? [nextOpenMenuKey] : [];
}

// 扁平化 items
function toRenderItem(item, level) {
  return {
    key: item.key,
    title: item.title,
    iconName: item.iconName,
    route: item.route,
    uri: item.uri,
    children:
      !!item.children && item.children.length > 0
        ? item.children.map((i) => toRenderItem(i, level + 1))
        : null,
    disabled: item.disabled,
    level: level,
    data: item,
    rootTitle: item.rootTitle,
  };
}

// 組成 item 對應 map
function pushKeyMap(item) {
  if (item.key) {
    keyMap[item.key] = item;
    routeMap[item.route] = item;
  }
  if (item.children) {
    item.children.forEach((m) => pushKeyMap(m));
  }
}

/**
 * Event
 */
// click menu link
function itemClick(e) {
  const renderItem = keyMap[e.key];
  if (renderItem.route) {
    $router.push({name: renderItem.route});
  } else if (renderItem.uri) {
    window.open(renderItem.uri);
  }
}
watch(() => props.items, (nV) => {
  renderItems = nV.map(m => toRenderItem(m, 1));
  renderItems.forEach(m => pushKeyMap(m));
},{
  immediate: true
})
</script>

<template>
  <div :class="{ 'collapsed': collapsed }">
    <div class="layout-sider-logo d-flex justify-content-between align-items-center">
      <span class="layout-sider-title">{{ title }}</span>
      <div class="d-flex align-items-center">
        <sync-outlined @click="" />
        <a-divider class="layout-sider-logo__divider" type="vertical" />
        <menu-unfold-outlined v-if="collapsed" @click="() => emits('changeCollapsed')" />
        <menu-fold-outlined v-else @click="() => emits('changeCollapsed')" />
      </div>
    </div>
    <a-menu
      :open-keys="openKeys"
      v-model="selectedKeys"
      mode="inline"
      @click="itemClick($event)"
      @openChange="onOpenChange"
    >
      <template v-for="item in items">
        <a-menu-item v-if="!item.children" :key="item.key">
          <slot :name="'renderer'" :data="item" />
        </a-menu-item>
        <FblSubMenu v-else :menu-info="item">
          <template v-slot:renderer="slotProp">
            <slot :name="'renderer'" :data="slotProp.data" />
          </template>
          <template v-slot:subrenderer="slotProp">
            <slot :name="'subrenderer'" :data="slotProp.data" />
          </template>
        </FblSubMenu>
      </template>
    </a-menu>
  </div>
</template>

<style lang="scss" scoped>
.layout-sider-logo {
  padding: 12px 10px 12px 26px;
  font-size: 20px;
  font-weight: 600;
  color: $COLOR-WHITE;
  .layout-sider-title {
    line-height: 1.5;
    transition: all 2ms;
  }
  .layout-sider-logo__divider {
    height: 30px;
    margin: 0 11px;
    border-left: 1px solid #e8e8e8;
  }
}

:deep(.ant-menu) {
  background: transparent;
  &:not(.ant-menu-horizontal) {
    .ant-menu-item-selected {
      background-color: initial;
    }
  }
}

:deep(.ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left) {
  border-right: 0;

  .sideMenu__title {
    margin-left: 0;
  }
}

:deep(.ant-menu-item) {
  height: auto;
}

:deep(.ant-menu-root) {
  border: 0;
  border-top: 0.5px solid $COLOR-WHITE;
  > .ant-menu-item {
    padding: 0 !important;
    margin: 0 !important;
  }

  .ant-menu-submenu {
    >.ant-menu-submenu-title {
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

// 作用中的subMenu
:deep(.ant-menu-sub) {
  &.ant-menu-inline {
    padding-top: 8px;
    padding-bottom: 8px;

    >.ant-menu-item {
      width: 100%;
      height: auto;
      color: $COLOR-WHITE;
      line-height: initial;
      margin: 0;
      padding: 0 !important;

      .ant-menu-title-content {
        padding: 7px 10px;
      }

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

:deep(.mainMenuClass) {
  .ant-menu-submenu-title {
    padding-left: 24px !important;
  }
}
:deep(.subMenuClass) {
  .ant-menu-title-content {
    padding-left: 34px !important;
  }
}

.collapsed {
  .layout-sider-logo {
    padding: 17px 23px;

    .layout-sider-title,
    .anticon-sync,
    .layout-sider-logo__divider {
      display: none;
    }
  }
  .ant-menu-submenu-title {
    padding-left: 3px !important;
    > .ant-menu-title-content {
      display: flex;
      justify-content: center;
    }
  }
  :deep(.mainMenuClass) {
    .ant-menu-submenu-title {
      padding-left: 0 !important;
    }
    > .ant-menu-submenu-title {
      .sideMenu__titleWrap {
        justify-content: center;
      }
    }
  }
  :deep(.subMenuClass) {
    justify-content: center;
    .ant-menu-title-content {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .sideMenu__titleWrap {
      justify-content: center;
    }
    .sideMenu__title {
      display: none;
    }
  }
}
</style>