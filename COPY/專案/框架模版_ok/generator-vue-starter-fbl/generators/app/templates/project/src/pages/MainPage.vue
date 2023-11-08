<template>
  <div>
    <fbl-layout
      :title="title" 
      :subtitle="subtitle"
      :avatarText="avatarText"
      :avatarActions="avatarActions"
      @onAvatarAction="onAvatarAction($event)"
    >
      <template v-slot:side>
        <div class="logo" />
        <fbl-side-menu
          :items="menuItems"
          @onItemNavigated="onItemNavigated($event)"
        >
          <template v-slot:renderer="slotProp">
            <a-icon :type="slotProp.data.route || slotProp.data.uri ? 'file' : 'folder'" />
            <span>{{ slotProp.data.title }}</span>
          </template>
        </fbl-side-menu>
      </template>
      <template v-slot:content>
        <router-view></router-view>
      </template>
    </fbl-layout>
  </div>
</template>

<script lang="ts">
/* import 引用其他組件區塊 */
import { Vue, Component } from "vue-property-decorator";                    
import FblLayout from "@/components/shared/layout/FblLayout.vue";
import FblSideMenu from "@/components/shared/side-menu/FblSideMenu.vue";
import { FblMenuItem } from "@/components/shared/side-menu/model";
import { FblAvatarAction } from "@/components/shared/layout/models";
import { Subject } from "rxjs";
import { MenuNode } from "@fubonlife/<%= code %>-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
/* import 引用其他組件區塊 */

/* 定義 Template 用到的 Component */
@Component({
  components: {
    FblLayout,
    FblSideMenu,
  },
})
/* 使用TypeScript Class方法，定義組件MainPage */
export default class MainPage extends Vue {
  /* data定義區塊，定義Template用到雙向資料綁定的變數 */
  private unsubscribe$ = new Subject<void>();
  public title: string = "<%= codeUpper %>";
  public subtitle: string = "An example Vue project";
  public avatarText: string = "";
  public avatarActions: FblAvatarAction[] = [
    {
      name: "logout",
      title: "登出",
    },
  ];
  public menuItems: FblMenuItem[] = [];
  /* data定義區塊，定義Template用到雙向資料綁定的變數 */

  /* Vue 生命週期 Hooks function 區塊 */
  //組件初始化方法，將一些初始化資料，呼叫在此方法中實作
  created() {
    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          this.avatarText = state.me.employeeId;
        }
      });

    //呼叫後端API取得menuItems資料，並賦值與定義在data中的變數，以改變Template
    this.$authApi.getAuthorizedMenuTreeUsingGET().then((resp) => {
      const node = resp.data;
      this.menuItems = node.children.map((c) => this.toMenuItem(c));
    });
  }
  //組件Vue實體銷毀時觸發的事件
  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /* Vue 生命週期 Hooks function 區塊 */

  /* 自訂義方法區塊 */
  //fbl-layout中當登入者頭像點擊觸發事件
  onAvatarAction(action: FblAvatarAction) {
    switch (action.name) {
      case "logout":
        this.signOut();
        break;
    }
  }
  //fbl-layout中當左側Menu連結點擊觸發事件
  onItemNavigated(item: FblMenuItem) {
    this.title = item ? item.title : "<%= codeUpper %>";
  }
  //點擊登出觸發事件
  signOut() {
    this.$user.signOut();
    this.$router.replace({ path: "/login" });
  }
  //遞迴組合成選單樹狀結構資料方法，初始時呼叫
  toMenuItem(node: MenuNode): FblMenuItem {
    const item = node.item;
    return {
      key: item.id,
      title: item.title,
      route: item.route,
      uri: item.uri,
      children: node.children.map((c) => this.toMenuItem(c)),
      disabled: item.isLeaf && !item.enabled,
    };
  }
  /* 自訂義方法區塊 */
}
</script>

<style>
/* 自訂義CSS區塊 */

/* 自訂義CSS區塊 */
</style>
