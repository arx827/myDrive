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
import { Vue, Component } from "vue-property-decorator";
import FblLayout from "@/components/shared/layout/FblLayout.vue";
import FblSideMenu from "@/components/shared/side-menu/FblSideMenu.vue";
import { FblMenuItem } from "@/components/shared/side-menu/model";
import { FblAvatarAction } from "@/components/shared/layout/models";
import { Subject } from "rxjs";
import { MenuNode } from "@fubonlife/<%= code %>-api-axios-sdk";
import { takeUntil } from "rxjs/operators";

@Component({
  components: {
    FblLayout,
    FblSideMenu,
  },
})
export default class MainPage extends Vue {
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

  created() {
    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          this.avatarText = state.me.employeeId;
        }
      });

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
    this.title = item ? item.title : "<%= codeUpper %>";
  }

  signOut() {
    this.$user.signOut();
    this.$router.replace({ path: "/login" });
  }
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
}
</script>

<style>

</style>
