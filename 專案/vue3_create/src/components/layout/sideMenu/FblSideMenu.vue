<script setup lang="ts">
import { defineProps, defineEmits, computed, watch, ref } from 'vue'
import type { PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { Key } from 'ant-design-vue/es/_util/type'

const props = defineProps({
  collapsed: Boolean,
  title: String,
  items: Object,
  openKeys: Array as PropType<Key[]>,
})

const $emit = defineEmits(['update:collapsed', 'update:openKeys'])

const router = useRouter()

// 扁平化 items
const renderItems = computed(() => {
  return props.items.map(m => toRenderItem(m, 1))
})

let currentOpenMenuKey = ref([])
let keyMap = ref({}) // items object Map
let routeMap = ref({}) // items route Map

/**
 * Function
 */
// 扁平化 items
function toRenderItem(item, level) {
  return {
    key: item.key,
    title: item.title,
    iconName: item.iconName,
    route: item.route,
    uri: item.uri,
    children: !!item.children && item.children.length > 0 ? item.children.map(i => toRenderItem(i, level + 1)) : null,
    disabled: item.disabled,
    level: level,
    data: item,
    rootTitle: item.rootTitle,
  }
}

// 組成 item 對應 map
function pushKeyMap(item) {
  if (item.key) {
    keyMap[item.key] = item
    routeMap[item.route] = item
  }
  if (item.children) {
    item.children.forEach(m => pushKeyMap(m))
  }
}

/**
 * Event
 */
// 主題展開收合
function onOpenChange(twoMenuKeys) {
  currentOpenMenuKey.value = twoMenuKeys
  $emit('update:openKeys', twoMenuKeys)
}
function itemClick(e) {
  const renderItem = keyMap[e.key]
  if (renderItem.route) {
    if (renderItem.route) {
      router.push(renderItem.route)
    }
    if (renderItem.data.parentId) {
      $emit('update:openKeys', [renderItem.data.parentId])
    }
  } else if (renderItem.uri) {
    window.open(renderItem.uri)
  }
}

/**
 * 監聽
 */
watch(
  () => renderItems,
  nV => {
    nV.value.map(m => pushKeyMap(m))
  },
  {
    immediate: true,
    deep: true,
  },
)
// watch(
//   () => currentOpenMenuKey,
//   nV => console.log(nV.value),
//   { deep: true },
// )
</script>

<template>
  <div :class="{ collapsed: props.collapsed }">
    <div class="layout-sider-logo d-flex align-items-center">
      <span class="layout-sider-title">{{ props.title }}</span>
      <div class="d-flex align-items-center">
        <a-divider class="layout-sider-logo__divider" type="vertical" />
        <button class="d-flex collapsedBtn" @click="$emit('update:collapsed')">
          <menu-unfold-outlined v-if="props.collapsed" />
          <menu-fold-outlined v-else />
        </button>
      </div>
    </div>
    <a-menu :open-keys="openKeys" mode="inline" @click="itemClick($event)" @openChange="onOpenChange">
      <template v-for="item in items">
        <a-menu-item v-if="!item.children" :key="item.key">
          <slot :name="'renderer'" :data="item" />
        </a-menu-item>
        <FblSubMenu v-else :menu-info="item" :key="item.menuId">
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
  padding: 2px 5px 2px 15px;
  font-size: 20px;
  font-weight: 600;
  color: $COLOR-WHITE;
  justify-content: space-between;
  .layout-sider-title {
    line-height: 1.5;
    transition: all 2ms;
  }
  .layout-sider-logo__divider {
    height: 30px;
    margin: 0 5px 0 11px;
    border-left: 1px solid #e8e8e8;
  }
}

:deep(.ant-menu) {
  background: transparent;
  // &:not(.ant-menu-horizontal) {
  //   .ant-menu-item-selected {
  //     background-color: initial;
  //   }
  // }
  .ant-menu-item-selected {
    background-color: $COLOR-MAIN9;
  }
}

:deep(.ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left) {
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
    &.ant-menu-submenu-open + .ant-menu-submenu {
      border-top: 0.5px solid $COLOR-WHITE;
    }
    > .ant-menu-submenu-title {
      width: 100%;
      height: auto;
      line-height: initial;
      margin: 0;
      padding: 3px 10px 3px 3px;
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

    > .ant-menu-item {
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

// 收合按鈕
.collapsedBtn {
  border: 0;
  background: transparent;
  padding: 10px;
}

// 收合樣式
.collapsed {
  .layout-sider-logo {
    padding: 2px 14px;
    justify-content: center;

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
      padding-left: 10px !important;
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
