<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  propData: Object,
  title: String,
  items: Object,
})

const $emit = defineEmits(['update:collapsed', 'update:openKeys'])

const router = useRouter()

// 扁平化 items
const renderItems = computed(() => {
  return props.items.map(m => toRenderItem(m, 1))
})

const mode = computed(() => {
  return props.propData.collapsed ? 'vertical' : 'inline'
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
  if (!props.propData.collapsed) {
    $emit('update:openKeys', twoMenuKeys)
  }
}
function itemClick(e) {
  const renderItem = keyMap[e.key]
  if (renderItem.route) {
    router.push(renderItem.route)
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
</script>

<template>
  <div :class="{ collapsed: propData.collapsed }">
    <div class="layout-sider-logoWrap d-flex align-items-center">
      <span class="layout-sider-title">{{ props.title }}</span>
      <div class="d-flex align-items-center">
        <a-divider class="layout-sider-logo__divider" type="vertical" />
        <button class="d-flex collapsedBtn" @click="$emit('update:collapsed')">
          <MenuUnfoldOutlined v-if="propData.collapsed" />
          <MenuFoldOutlined v-else />
        </button>
      </div>
    </div>
    <a-menu
      :mode="mode"
      :theme="propData.theme || 'light'"
      :openKeys="propData.openKeys"
      :selectedKeys="propData.selectedKeys"
      @click="itemClick($event)"
      @openChange="onOpenChange"
    >
      <template v-for="item in items" :key="item.menuId">
        <template v-if="!(item.children && item.children?.length > 0)">
          <!-- <div class="mainMenuClass"> -->
          <MenuItem :menuInfo="item" />
          <!-- </div> -->
        </template>
        <template v-else>
          <FblSubMenu :key="item.key" :menu-info="item" />
        </template>
      </template>
    </a-menu>
  </div>
</template>

<style lang="scss" scoped>
.layout-sider-logoWrap {
  padding: 2px 5px 2px 15px;
  font-size: 20px;
  font-weight: 600;
  color: $COLOR-WHITE;
  justify-content: space-between;
  border-bottom: 0.5px solid $COLOR-WHITE;
  .layout-sider-logo__divider {
    height: 30px;
    margin: 0 5px 0 11px;
    border-left: 1px solid #e8e8e8;
  }
  // 收合按鈕
  .collapsedBtn {
    border: 0;
    background: transparent;
    padding: 10px;
  }
}

:deep(.ant-menu-root) {
  .ant-menu-item {
    height: auto;
    align-items: baseline;
    line-height: 1.5;
    padding: 10px 0;
    margin: 0;
    display: flex;
    justify-content: center;
    padding-right: 10px;
  }
  .ant-menu-title-content {
    white-space: break-spaces;
  }
}

.collapsed {
  .layout-sider-logoWrap {
    padding: 2px 14px;
    justify-content: center;
    .layout-sider-title,
    .layout-sider-logo__divider {
      display: none;
    }
  }
  :deep(.ant-menu-inline-collapsed) {
    width: auto;

    .ant-menu-item {
      .ant-menu-title-content {
        display: none;
      }
    }
    .ant-menu-submenu {
      .ant-menu-submenu-title {
        .ant-menu-title-content {
          display: none;
        }
      }
    }
  }
}
</style>
