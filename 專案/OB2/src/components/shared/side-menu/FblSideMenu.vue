<template>
  <!-- <div style="overflow-x: hidden; overflow-y: hidden"> -->
  <div>
    <a-menu
      mode="inline"
      theme="light"
      v-model="selectedKeys"
      :inlineIndent="15"
      @click="itemClick($event)"
      :openKeys="openSubKeys"
      @openChange="onOpenChange"
    >
      <!-- 展開子選單 -->
      <template v-for="item in renderItems">
        <a-menu-item v-if="!item.children" :key="item.key">
          <!-- <a-icon :type="item.route || item.uri ? 'file' : 'folder'" /> -->
          <span style="font-size: 16px; font-weight: bold">
            <a-icon type="appstore" theme="filled" filled-color="black" />
            {{ item.title }}
          </span>
        </a-menu-item>
        <SubMenu v-else :key="item.key" :menu-info="item" />
      </template>
    </a-menu>
    
    <!-- 關掉國際化語系切換 -->
    <div v-show="false">
      <a-button @click="setLanguage('en_US')"> English </a-button>
      <a-button @click="setLanguage('zh_TW')"> 中文 </a-button>
    </div>

    <!-- 常見問題 -->
    <DragModal
        class="pointer-events-none"
        :visible="isCommonQuestionVisible"
        :title="$t('CommonQuestion_Title')"
        width="810px"
        :okText="$t('onDutyPage_close')"
        @ok="onClosePopWindows('commonQuestion')"
        :closable="true"
        @cancel="isCommonQuestionVisible = false"
        :removeCancelButton="true"
        :isMasked="false"
      >
      <CommonQuestionForm ref="commonQuestionForm"/>
    </DragModal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import SubMenu from "./FblSubMenu.vue";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import I18nUtil from "@/assets/config/I18nUtil";
import { MenuItemsModule } from "@/plugins/store/MenuItemsModule";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import CommonQuestionForm from "@/components/shared/form/commonQuestion/CommonQuestionForm.vue";

@Component({
  components: { SubMenu, DragModal, CommonQuestionForm }
})
export default class FblSideMenu extends Vue {
  renderItems = [];
  keyMap = {};            //{母子key:items}
  routeMap = {};          //{path(route):items}
  unsubscribe$ = null;
  selectedKeys = [];
  defaultOpenKeys = null;
  openKeys = [];
  openSubKeys = [];
  keyRecord = [];
  popWindows: Array<string> = ["popCommonQuestion"]; //設定彈跳視窗的url
  isCommonQuestionVisible: boolean = false;

  get $item() {
    return MenuItemsModule.getMenuItem;
  }

  get $routePath() {
    return this.$route.path;
  }

  /**
   * Func
   */
  // 調整結構
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
      casesCount: item.casesCount,
      // 急件數
      emergencyCase: item.emergencyCase,
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

  //異動selectedKey
  tryEmitItemNavigated() {
    const item = this.routeMap[this.$route.path];
    if (item) {
      this.selectedKeys = [item.key];
    }
  }

  /**
   * Event
   */
  /**
   * 設定系統語系
   * @param lang 語系代號，如'zh_TW'或'en_US'。
   * @returns
   */
  setLanguage(lang) {
    I18nUtil.prototype.setLang(lang);
  }
  itemClick(e) {
    const renderItem = this.keyMap[e.key];
    let path = renderItem.route;
    if (path) {
      //判斷是否是彈跳的選單
      if(this.popWindows.includes(path)){
        if( path == "popCommonQuestion"){
          this.isCommonQuestionVisible = true;
        }
      } else if (
        //Routes中有path頁面 再轉頁
        this.$route.path != path &&
        this.$router.getRoutes().find((route) => path == route.path)
      ) {
        this.$router.push(path);
        this.$emit("onItemNavigated", renderItem, this.routeMap[path].key);
      }
    } else if (renderItem.uri) {
      window.open(renderItem.uri);
    }
  }
  //submenu只保留一個，其他收起，電訪作業 always 展開
  onOpenChange(openKeyss) {
    // console.log("1.openKeyss", openKeyss);
    // console.log("2.this.openSubKeys", this.openSubKeys);
    const latestOpenKey = openKeyss[openKeyss.length - 1];
    // console.log("3.latestOpenKey", latestOpenKey);
    if (this.openKeys.indexOf(latestOpenKey) === -1) {
      this.openSubKeys = Object.assign(openKeyss, ['OUTBOUND']);
    } else {
      this.openSubKeys = [latestOpenKey, 'OUTBOUND'];
    }
  }

  onClosePopWindows(closePop){
    if( closePop == "commonQuestion"){
      this.isCommonQuestionVisible = false;
    }
  }

  /**
   * Hook
   */
  created() {
    //在取得左側選單時 同步取得第三層選單清單
    this.$emit("renderThirdMenu", this.$route.name);

    this.unsubscribe$ = new Subject();
    this.renderItems = this.$item.map((m) => this.toRenderItem(m, 1));
    this.keyMap = {};
    this.renderItems.forEach((m) => this.pushKeyMap(m));

    this.routeMap = {};
    this.renderItems.forEach((m) => this.pushRouteMap(m));
    this.openKeys = Object.keys(this.keyMap);
    // this.beforeEnter$.pipe(takeUntil(this.unsubscribe$)).subscribe((e) => {
    //   if (!e) {
    //     return;
    //   }
    //   // console.log("curr route", e.to.path);
    //   this.tryEmitItemNavigated(e.to.path);
    // });
    // console.log("openKeys", this.openKeys);

    // 初始化展開 電訪作業
    this.openSubKeys = ['OUTBOUND'];
  }
  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * 監聽
   */

  //左側選單異動時
  @Watch('$item', { immediate: true, deep: true})
  watchItems(val) {
    this.renderItems = this.$item.map((m) => this.toRenderItem(m, 1));
    this.keyMap = {};
    this.renderItems.forEach((m) => this.pushKeyMap(m));
    this.routeMap = {};
    this.renderItems.forEach((m) => this.pushRouteMap(m));
    this.openKeys = Object.keys(this.keyMap);
    this.tryEmitItemNavigated();
  }

  //routePath異動時
  @Watch('$routePath', { immediate: true, deep: true})
  watchRoutePath(val) {
    if(this.$route.path){
      //刷新SelectedKey
      this.tryEmitItemNavigated();
    }
  }
  
}
</script>