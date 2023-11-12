<template>
  <div>
    <a-menu
      v-if="renderItems && renderItems.length > 0"
      v-model="selectedKeys"
      :mode="'inline'"
      :inline-collapsed="collapsed"
      :open-keys="openKeys"
      @openChange="onOpenChange"
      @click="itemClick($event)"
    >
      <template v-for="item in renderItems">
        <a-menu-item v-if="!item.children" :key="item.key">
          <slot :name="'renderer'" :data="item.data" />
        </a-menu-item>
        <SubMenu v-else :key="item.key" :menu-info="item">
          <template v-slot:renderer="slotProp">
            <slot :name="'renderer'" :data="slotProp.data" />
          </template>
          <template v-slot:subrenderer="slotProp">
            <slot :name="'subrenderer'" :data="slotProp.data" />
          </template>
        </SubMenu>
      </template>
    </a-menu>
  </div>
</template>
<script>
import { beforeEnter$ } from '@/router';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import SubMenu from './FblSubMenu.vue';

@Component({
  components: { SubMenu },
})
export default class SideMenu extends Vue {
  @Prop()
  items;

  @Prop()
  collapsed;

  renderItems = [];

  keyMap = {};

  routeMap = {};

  unsubscribe$ = null;

  selectedKeys = [];

  // collapsed: false,
  // rootSubmenuKeys = ['first01', 'first02'];

  openKeys = ['first01'];

  currentOpenMenuKey = [];

  defaultSelectedKeys = [this.$route.path];

  /**
   * Func
   */
  itemClick(e) {
    const renderItem = this.keyMap[e.id];
    if (renderItem.route) {
      this.$router.push(renderItem.route);
    } else if (renderItem.uri) {
      window.open(renderItem.uri);
    }
  }

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
  }

  pushKeyMap(item) {
    if (item.key) {
      this.keyMap[item.key] = item;
    }
    if (item.children) {
      item.children.forEach((m) => this.pushKeyMap(m));
    }
  }

  pushRouteMap(item) {
    if (item.route) {
      this.routeMap[item.route] = item;
    }
    if (item.children) {
      item.children.forEach((m) => this.pushRouteMap(m));
    }
  }

  tryEmitItemNavigated(path) {
    const item = this.routeMap[path];
    if (item) {
      this.selectedKeys = [item.key];
      this.$emit('onItemNavigated', item);
    }
  }

  onOpenChange(twoMenuKeys) {
    const nextOpenMenuKey = twoMenuKeys.find(
      (key) => this.currentOpenMenuKey.indexOf(key) === -1,
    );
    this.currentOpenMenuKey = twoMenuKeys.length != 0 ? [nextOpenMenuKey] : [];
  }

  get getMode() {
    return this.collapsed ? 'vertical' : 'inline';
  }

  /**
   * Hook
   */
  created() {
    this.unsubscribe$ = new Subject();
    this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
    this.keyMap = {};
    this.renderItems.forEach((m) => this.pushKeyMap(m));
    this.routeMap = {};
    this.renderItems.forEach((m) => this.pushRouteMap(m));
    this.openKeys = Object.keys(this.keyMap);
    this.tryEmitItemNavigated(this.$route.path);

    this.beforeEnter$.pipe(takeUntil(this.unsubscribe$)).subscribe((e) => {
      if (!e) {
        return;
      }
      console.log('curr route', e.to.path);
      this.tryEmitItemNavigated(e.to.path);
    });
  }

  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * 監聽
   */
  @Watch('items', { immediate: true, deep: true })
  WatchItems() {
    this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
    this.keyMap = {};
    this.renderItems.forEach((m) => this.pushKeyMap(m));
    this.routeMap = {};
    this.renderItems.forEach((m) => this.pushRouteMap(m));
    this.openKeys = Object.keys(this.keyMap);
    this.tryEmitItemNavigated(this.$route.path);
    console.log(this.items);
    console.log(this.renderItems);
  }

  @Watch('collapsed')
  WatchCollapsed() {
    if (this.collapsed) {
      this.currentOpenMenuKey = [];
    }
  }
}
</script>
