<template>
  <div>
    <a-menu
      v-if="renderItems && renderItems.length > 0"
      mode="inline"
      theme="dark"
      v-model="selectedKeys"
      :defaultOpenKeys="openKeys"
      :inlineIndent="25"
      :open-keys="openKeys"
      @openChange="onOpenChange"
      @click="itemClick($event)"
    >
      <template v-for="item in renderItems">
        <a-menu-item v-if="!item.children" :key="item.key">
          <span>
            <slot :name="'renderer'" v-bind:data="item.data"></slot>
          </span>
        </a-menu-item>
        <sub-menu v-else :key="item.key" :menu-info="item">
          <template v-slot:renderer="slotProp">
            <slot :name="'renderer'" v-bind:data="slotProp.data"></slot>
          </template>
        </sub-menu>
      </template>
    </a-menu>
  </div>
</template>
<script>
//import FblSubMenu元件
import subMenu from "./FblSubMenu";
import { beforeEnter$ } from "@/router";
import { Subject } from "rxjs";
import { from } from "rxjs";
import { takeUntil } from "rxjs/operators";
export default {
  //定義components
  components: {
    "sub-menu": subMenu,
  },
  //定義傳遞參數
  props: {
    items: Array,
  },
  //定義menu資料
  data() {
    return {
      renderItems: [],
      keyMap: {},
      routeMap: {},
      unsubscribe$: null,
      selectedKeys: [],
      // collapsed: false,
      rootSubmenuKeys: ["001", "002", "003", "004"],
      openKeys: [],
      defaultSelectedKeys: [this.$route.path],
    };
  },
  computed: {},
  watch: {
    items: function() {
      this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
      this.keyMap = {};
      this.renderItems.forEach((m) => this.pushKeyMap(m));
      this.routeMap = {};
      this.renderItems.forEach((m) => this.pushRouteMap(m));
      // this.openKeys = Object.keys(this.keyMap);
      this.tryEmitItemNavigated(this.$route.path);
    },
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
        level: level,
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
        this.$emit("onItemNavigated", item);
      }
    },

    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
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
      console.log("curr route", e.to.path);
      this.tryEmitItemNavigated(e.to.path);
    });
  },
  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  },
};
</script>
