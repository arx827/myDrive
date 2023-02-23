<template>
  <div>
    <a-menu
      v-if="renderItems && renderItems.length > 0"
      v-model="selectedKeys"
      mode="inline"
      theme="dark"
      :default-open-keys="openKeys"
      :inline-indent="25"
      :open-keys="openKeys"
      @openChange="onOpenChange"
      @click="itemClick($event)"
    >
      <template v-for="item in renderItems">
        <a-menu-item
          v-if="!item.children"
          :key="item.key"
        >
          <span>
            <slot
              :name="'renderer'"
              :data="item.data"
            />
          </span>
        </a-menu-item>
        <sub-menu
          v-else
          :key="item.key"
          :menu-info="item"
        >
          <template v-slot:renderer="slotProp">
            <slot
              :name="'renderer'"
              :data="slotProp.data"
            />
          </template>
        </sub-menu>
      </template>
    </a-menu>
  </div>
</template>
<script>
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { beforeEnter$ } from '@/router';
import subMenu from './FblSubMenu';

export default {
  components: {
    'sub-menu': subMenu,
  },
  props: {
    items: Array,
  },
  data() {
    return {
      renderItems: [],
      keyMap: {},
      routeMap: {},
      unsubscribe$: null,
      selectedKeys: [],
      // collapsed: false,
      rootSubmenuKeys: ['001', '002', '003', '004'],
      openKeys: [],
      defaultSelectedKeys: [this.$route.path],
    };
  },
  computed: {},
  watch: {
    items() {
      this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
      this.keyMap = {};
      this.renderItems.forEach((m) => this.pushKeyMap(m));
      this.routeMap = {};
      this.renderItems.forEach((m) => this.pushRouteMap(m));
      // this.openKeys = Object.keys(this.keyMap);
      this.tryEmitItemNavigated(this.$route.path);
    },
  },

  created() {
    this.unsubscribe$ = new Subject();
    this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
    this.keyMap = {};
    this.renderItems.forEach((m) => this.pushKeyMap(m));
    this.routeMap = {};
    this.renderItems.forEach((m) => this.pushRouteMap(m));
    this.tryEmitItemNavigated(this.$route.path);

    this.beforeEnter$.pipe(takeUntil(this.unsubscribe$)).subscribe((e) => {
      if (!e) {
        return;
      }
      // console.log('curr route', e.to.path);
      this.tryEmitItemNavigated(e.to.path);
    });
  },
  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  },
  methods: {
    itemClick(e) {
      const renderItem = this.keyMap[e.key];
      if (renderItem.route) {
        this.$router.push(renderItem.route);
      } else if (renderItem.uri) {
        window.open(renderItem.uri);
      }
    },
    toRenderItem(item, level) {
      return {
        key: item.key,
        title: item.title,
        route: item.route,
        uri: item.uri,
        children:
          !!item.children && item.children.length > 0
            ? item.children.map((i) => this.toRenderItem(i, level + 1))
            : null,
        disabled: item.disabled,
        level,
        data: item,
      };
    },
    pushKeyMap(item) {
      if (item.key) {
        this.keyMap[item.key] = item;
      }
      if (item.children) {
        item.children.forEach((m) => this.pushKeyMap(m));
      }
    },
    pushRouteMap(item) {
      if (item.route) {
        this.routeMap[item.route] = item;
      }
      if (item.children) {
        item.children.forEach((m) => this.pushRouteMap(m));
      }
    },
    tryEmitItemNavigated(path) {
      const item = this.routeMap[path];
      if (item) {
        this.selectedKeys = [item.key];
        this.$emit('onItemNavigated', item);
      }
    },

    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1,
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
  },
};
</script>
