<template>
  <div>
    <a-row class="spin__wrap" v-if="getLoading">
      <a-spin
        :spinning="getLoading"
        tip="資料處理中，請稍候..."
        :delay="200"
        class="spin"
      >
      </a-spin>
    </a-row>
    <FblLayout
      :collapsed="collapsed"
      :title="title"
      :avatarText="avatarText"
      :avatarActions="avatarActions"
      @onAvatarAction="onAvatarAction($event)"
    >
      <template v-slot:side>
        <input
          type="checkbox"
          id="sider-trigger"
          v-model="collapsed"
          style="display: none"
        />
        <div class="layout-sider-logo">
          <span class="layout-sider-title">AML審查作業平台</span>
          <a-divider type="vertical" style="font-size: 1.5rem" />
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        <a-divider type="horizontal" />
        <fbl-side-menu
          :items="menuItems"
          :collapsed="collapsed"
          @onItemNavigated="onItemNavigated($event)"
          class="layout-sider-menuBar"
        ></fbl-side-menu>
        <a
          target=" _blank"
          href="http://lyodsaml.fubonlife.com.tw:8080/LyodsAMLWeb/?lang=zh_TW"
          class="svg-liods-logo"
          v-if="!collapsed"
        >
          <img alt="icon-liods" src="@/assets/images/icon-menu-liods.svg" />
        </a>
      </template>
      <template v-slot:content>
        <router-view></router-view>
      </template>
    </FblLayout>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from "vuex-class";
import FblLayout from "@/components/shared/layout/FblLayout.vue";
import FblSideMenu from "@/components/shared/side-menu/FblSideMenu.vue";
import { FblMenuItem } from "@/components/shared/side-menu/model";
import { FblAvatarAction } from "@/components/shared/layout/models";
import { Subject } from "rxjs";
import { MenuNode } from "@fubonlife/edd-api-axios-sdk";
import { takeUntil } from "rxjs/operators";

@Component({
  components: {
    FblLayout,
    FblSideMenu,
  },
})
export default class MainPage extends Vue {
  private collapsed: boolean = false;
  private unsubscribe$ = new Subject<void>();
  public title: string = "請從左側選單開始操作，謝謝";
  public subtitle: string = "";
  public avatarText: string = "";
  public avatarActions: FblAvatarAction[] = [
    {
      name: "logout",
      title: "登出",
    },
  ];
  public menuItems: FblMenuItem[] = [];

  @Getter getLoading;

  created() {
    // this.$user.loginState$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((state) => {
    //     if (state && state.me) {
    //       this.avatarText = state.me.employee.name;
    //     }
    //   });
    const loginState = this.$user.loginState;
    if (loginState && loginState.me) {
      this.avatarText = loginState.me.employee.name;
    }

    this.$authApi.getAuthorizedMenuTreeUsingGET().then((resp) => {
      const node = resp.data;
      this.menuItems = node.children.map((c) => this.toMenuItem(c));
    });
  }
  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  onAvatarAction(action: FblAvatarAction) {
    switch (action.name) {
      case "logout":
        this.signOut();
        break;
    }
  }
  onItemNavigated(item: FblMenuItem) {
    if (item) {
      switch(item.key) {
        case '005002':        // 新增AML審查案件覆核 以 副標題 當 主標題
          this.title = item.title;
          break;
        default:
          this.title = item.rootTitle;
          break;
      }
      
    }
  }

  signOut() {
    this.$user.callLogoutApi();
    this.$user.signOut();
    window.location.href = process.env.VUE_APP_LOGIN_URL;
    // this.$router.replace({ path: "/login" });
  }
  toMenuItem(node: MenuNode, rootTitle?: string): FblMenuItem {
    const item = node.item;
    rootTitle = rootTitle ? rootTitle : item.title;
    return {
      key: item.id,
      title: item.title,
      iconName: item.iconName,
      route: item.route,
      uri: item.uri,
      children: node.children.map((c) => this.toMenuItem(c, rootTitle)),
      disabled: item.isLeaf && !item.enabled,
      rootTitle: rootTitle,
    };
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-layout-sider-children {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ant-menu-inline .ant-menu-item,
  .ant-menu-inline .ant-menu-submenu-title {
    font-size: 18px;
  }
  .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .anticon {
    font-size: 18px;
  }
}

.layout-sider-logo {
  padding: 20px 15px;
  font-size: 20px;
  font-weight: 500;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout-sider-title {
  margin-right: auto;
}
.ant-divider-horizontal {
  display: none;
}
#sider-trigger:checked ~ .layout-sider-logo {
  justify-content: center;
  margin: 4px;
}
#sider-trigger:checked ~ .layout-sider-logo span,
#sider-trigger:checked ~ .layout-sider-logo .ant-divider-vertical {
  display: none;
}
#sider-trigger:checked ~ .ant-divider-horizontal {
  display: block;
  margin: 0;
}
.layout-sider-menuBar {
  position: relative;
}
.liods__box {
  display: flex;
  justify-content: center;
}
.svg-liods-logo {
  padding: 10px 10px 30px;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
}


</style>
