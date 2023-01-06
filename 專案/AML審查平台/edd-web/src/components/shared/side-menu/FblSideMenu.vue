<template>
  <div>
    <a-menu
      v-if="renderItems && renderItems.length > 0"
      mode="inline"
      theme="dark"
      v-model="selectedKeys"
      :open-keys="currentOpenMenuKey"
      :inlineIndent="24"
      @click="itemClick($event)"
      @openChange="onOpenChange"
    >
      <template v-for="item in renderItems">
        <a-menu-item v-if="!item.children" :key="item.key">
          <a-popconfirm
            title="是否另開新視窗?"
            ok-text="Yes"
            cancel-text="No"
            placement="right"
            trigger="contextmenu"
            v-if="item.key == '004'"
            @confirm="confirm(item.key)"
          >
            <!-- <a-icon :type="item.route || item.uri ? 'file' : 'folder'" />         :defaultOpenKeys="openKeys" -->
            <a><a-icon :type="item.iconName" /><span>{{ item.title }}</span></a>
          </a-popconfirm>
          <a v-else><a-icon :type="item.iconName" /><span>{{ item.title }}</span></a>
        </a-menu-item>
        <sub-menu v-else :key="item.key" :menu-info="item" />
      </template>
    </a-menu>
    <!-- 遮罩 -->
    <div class="cover" @click="stopMove" v-if="alreadyOpenDetail"></div>
  </div>
</template>
<script>
import subMenu from "./FblSubMenu";
import { beforeEnter$ } from "@/router";
import { Subject } from "rxjs";
import { from } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Modal } from "ant-design-vue";
export default {
  components: {
    "sub-menu": subMenu,
  },
  props: {
    items: Array,
    collapsed: Boolean,
  },
  data() {
    return {
      renderItems: [],
      keyMap: {},
      routeMap: {},
      unsubscribe$: null,
      selectedKeys: [],
      openKeys: [],
      currentOpenMenuKey: [],
      // alreadyOpenDetail: false,
    };
  },
  computed: {
    alreadyOpenDetail: function () {
      return this.$store.state.alreadyOpenDetail;
    },
  },
  watch: {
    items: function () {
      this.renderItems = this.items.map((m) => this.toRenderItem(m, 1));
      this.keyMap = {};
      this.renderItems.forEach((m) => this.pushKeyMap(m));
      this.routeMap = {};
      this.renderItems.forEach((m) => this.pushRouteMap(m));
      this.openKeys = Object.keys(this.keyMap);
      this.tryEmitItemNavigated(this.$route.path);
    },
    collapsed: function () {
      if (this.collapsed) {
        this.currentOpenMenuKey = [];
      }
    },
  },
  methods: {
    onOpenChange(twoMenuKeys) {
      const nextOpenMenuKey = twoMenuKeys.find(
        (key) => this.currentOpenMenuKey.indexOf(key) === -1
      );
      this.currentOpenMenuKey =
        twoMenuKeys.length != 0 ? [nextOpenMenuKey] : [];
    },
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
        iconName: item.iconName,
        route: item.route,
        uri: item.uri,
        children:
          !!item.children && item.children.length > 0
            ? item.children.map((i) => this.toRenderItem(i, level + 1))
            : null,
        disabled: item.disabled,
        level: level,
        data: item,
        rootTitle: item.rootTitle,
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
    confirm(key) {
      const renderItem = this.keyMap[key];
      if (renderItem.route) {
        window.open(`${renderItem.route}FullMain`);
      } else if (renderItem.uri) {
        window.open(renderItem.uri);
      }
    },
    avisibleChange() {
      this.sss = true;
    },

    //如果已開啟明細頁，不給予使用sideMenu
    stopMove() {
      const h = this.$createElement;
      Modal.error({
        title: `提醒！`,
        content: `系統偵測到您正在處理案件`,
        icon: () =>
          h("a-icon", {
            props: {
              type: "close-circle",
              theme: "filled",
            },
          }),
        class: "modal__custom",
        okText: "確定",
        okType: "okButton",
        onOk: () => {
          if (this.windowCheck) this.windowCheck.focus();
        },
      });
    },
  },

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

<style lang="scss" scoped>
.ant-menu-submenu-selected {
  background-color: #006d75;
}
.ant-menu-item.ant-menu-item-selected span {
  color: white;
}
.ant-menu-item.ant-menu-item-selected {
  background-color: #006d75;
}
.ant-menu-submenu .ant-menu-sub * {
  background-color: white;
}
.cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // height: 100%;
  // width: 100%;
  z-index: 999;
  background-color: transparent;
}


::v-deep {
  .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
    font-size: 18px;
  }
  .ant-menu-vertical > .ant-menu-item,
  .ant-menu-vertical-left > .ant-menu-item,
  .ant-menu-vertical-right > .ant-menu-item,
  .ant-menu-inline > .ant-menu-item,
  .ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
  .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    height: 56px;
    line-height: 56px;
  }
  .ant-menu-vertical {
    > .ant-menu-submenu {
      > .ant-menu-submenu-title {
        height: 80px;
        line-height: 85px;
        padding: 0 27px !important;
      }
    }
  }
  .ant-menu-inline-collapsed {
    > .ant-menu-submenu {
      > .ant-menu-submenu-title {
        .anticon {
          font-size: 28px !important;
        }
      }
    }
    .ant-menu-item {
      .anticon {
        font-size: 28px !important;
      }
    }
  }
  .ant-menu-vertical {
    > .ant-menu-item {
      height: 80px;
      line-height: 85px;
      padding: 0 27px !important;
    }
  }
  
}
.ant-menu-vertical.ant-menu-sub .ant-menu-item {
  font-size: 17px;
  padding: 7px;
  height: auto;
}
</style>
