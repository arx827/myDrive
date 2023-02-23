<template>
  <div>
    <a-menu
      v-if="renderItems && renderItems.length > 0"
      v-model="selectedKeys"
      mode="inline"
      theme="light"
      :inlineIndent="25"
      :inline-collapsed="collapsed"
      @click="itemClick($event)"
    >
      <template v-for="item in renderItems">
        <a-menu-item v-if="!item.children" :key="item.key">
          <div :class="{'nuActive': (selectKey.toString() !== item.key.toString())}">
            <slot :name="'renderer'" :data="item.data" />
          </div>
        </a-menu-item>
        <sub-menu v-else :key="item.key" :menu-info="item" :selectKey="selectKey" :selectedKeysEmpty="isEmpty(selectedKeys)">
          <template v-slot:renderer="slotProp">
            <slot :name="'renderer'" :data="slotProp.data" />
          </template>
        </sub-menu>
      </template>
    </a-menu>
  </div>
</template>
<script>
import router, { beforeEnter$ } from '@/router';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import { mapGetters } from 'vuex';
import subMenu from './FblSubMenu';

export default {
  components: {
    'sub-menu': subMenu,
  },
  props: {
    items: Array, // 選單資訊
    collapsed: Boolean, // 選單縮合開關
  },
  data() {
    return {
      renderItems: [],
      keyMap: {},
      routeMap: {},
      unsubscribe$: null,
      rootSubmenuKeys: ['001', '002', '003', '004'], // 選單階層
      openKeys: [],
      selectedKeys: [],
      defaultSelectedKeys: [this.$route.path],
      selectKey: '',
    };
  },
  computed: {
    ...mapGetters([
      'getActiveTab',
    ]),
  },
  watch: {
    items() {
      this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
      this.keyMap = {};
      this.renderItems.forEach((m) => this.pushKeyMap(m));
      this.routeMap = {};
      this.renderItems.forEach((m) => this.pushRouteMap(m));
      // this.openKeys = Object.keys(this.keyMap);
      // this.tryEmitItemNavigated(this.$route.path);
    },
    // 選單根據選定的頁籤變化
    getActiveTab() {
      // 首頁不在選單內
      if (this.getActiveTab === '0') {
        this.selectedKeys = [];
        return;
      }
      this.selectedKeys = [this.getActiveTab];
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
    // 判斷空值
    isEmpty(data) {
      return validateUtil.isEmpty(data);
    },
    itemClick(e) {
      // 選單icon顏色
      if (e.keyPath === null) {
        return;
      }
      switch (e.keyPath.length) {
        case 1:
          this.selectKey = e.keyPath[0];
          break;
        case 2:
          this.selectKey = e.keyPath[1];
          break;
        case 3:
          this.selectKey = e.keyPath[2];
          break;
      }
      // 驗證主頁籤權限
      const renderItem = this.keyMap[e.key];
      if (!this.validateChildrenTabAuth(renderItem.route)) {
        return;
      }
      // keepAlive緩存機制
      let itemPart = renderItem.route.split('-');
      let res = '';
      for (let i = 0; i < itemPart.length; i++) {
        res += (itemPart[i][0].toUpperCase() + itemPart[i].slice(1));
      }
      // let res = itemPart[0][0].toUpperCase() + itemPart[0].slice(1) + itemPart[1][0].toUpperCase() + itemPart[1].slice(1);
      this.handleSelect(res);
      // 開啟頁籤
      if (this.validateHasRouterSetting(renderItem.route)) {
        this.$store.dispatch('setTabArray', renderItem);
      } else {
        InfoModal.alertInfo({ confirm: false, content: '此功能無授權任一頁籤權限。' });
      }
      // if (renderItem.route) {
      //   this.$router.push({ name: renderItem.route });
        // this.$router.push(renderItem.route);
      // } else if (renderItem.uri) {
        // window.open(renderItem.uri);
      // }
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
        icon: item.icon,
        breadCrumb: item.breadCrumb,
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

    // onOpenChange(openKeys) {
    //   const latestOpenKey = openKeys.find(
    //     (key) => this.openKeys.indexOf(key) === -1,
    //   );
    //   if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //     this.openKeys = openKeys;
    //   } else {
    //     this.openKeys = latestOpenKey ? [latestOpenKey] : [];
    //   }
    // },

    // 判斷頁籤權限
    validateChildrenTabAuth(route) {
      const authInfo = this.$authService.getAuthInfo(route);
      let isExist = false;
      // 1. 判斷點擊的頁籤是否被開啟
      if (!this.isEmpty(this.$store.getters.getTabArray)) {
        isExist = this.$store.getters.getTabArray.filter((tab) => tab.data.route === route).length;
      }
      // 2. 頁籤已被開啟
      if (isExist) {
        return true;
      }
      // 3. 頁籤未開啟，且無權限
      if (this.isEmpty(authInfo)) {
        InfoModal.alertError({
          confirm: false,
          content: '此功能無授權任一頁籤權限',
        });
        return false;
      }
      return true;
    },

    // 點擊左側選單事件
    handleSelect(name) {
      if (this.$store.getters.getKeepAliveList.indexOf(name) > -1) {
        // this.resetKeepAive(name, this.$store.getters.getKeepAliveList);
      } else {
        this.$store.dispatch('setAddCachedView', name);
      }
    },

    // 判斷router是否有設定頁面
    validateHasRouterSetting(data) {
      let isExist = false;
      let routerItem = router.options.routes;
      if (!this.isEmpty(routerItem)) {
        for (let i = 0; i < routerItem.length; i++) {
          if (!this.isEmpty(routerItem[i].children)) {
            for (let j = 0; j < routerItem[i].children.length; j++) {
              if (!this.isEmpty(routerItem[i].children[j])) {
                for (let k = 0; k < routerItem[i].children[j].children.length; k++) {
                  if (data === routerItem[i].children[j].children[k].path) {
                    isExist = true;
                  }
                }
              }
            }
          }
        }
      }
      return isExist;
    },
  },
};
</script>
<style lang="scss" scoped>
  .nuActive {
    ::v-deep img {
      filter: grayscale(100%);
      opacity: 0.8;
    }
  }
</style>
