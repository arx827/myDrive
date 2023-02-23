<template>
  <header class="header login__header">
    <nav class="header__navBar navbar navbar-expand-sm">
      <div class="container">
        <div class="header__logo" href="">
          <img class="header__logo-img" src="~@images/image_logo.svg" alt="">
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div id="navbarNavDropdown" class="collapse navbar-collapse h-100">
          <!-- 主選單 第一層 -->
          <ul
            v-if="menuGroup"
            class="navbar-nav ms-auto align-items-stretch h-100"
          >
            <li class="nav-item">
              <!-- 首頁 -->
              <div @mouseover="hoverHome()">
                <router-link
                  class="nav-link"
                  :class="{ active: currentMenuGroup == 'home' }"
                  to="/"
                >
                  首頁
                </router-link>
              </div>
            </li>
            <template v-for="item in menuGroup">
              <!-- 排除 沒有子層 且 沒有 uri -->
              <li
                v-if="item.children.length > 0 || item.uri !== null"
                :key="item.id"
                class="nav-item"
              >
                <a v-if="item.uri !== null" class="nav-link" :href="item.uri">{{
                  item.title
                }}</a>
                <a
                  v-else-if="
                    item.children.some(
                      (i) => i.children.length > 0 || i.route !== null
                    )
                  "
                  class="nav-link"
                  href="javascript:void(0)"
                  :data-link="item.id"
                  :class="{ active: currentMenuGroup == item.id }"
                  @mouseover="menuHover"
                >{{ item.title }}</a>
              </li>
            </template>

            <!-- 測試用 連結 -->
            <!-- <li class="nav-item testF2e">
              <a
                class="nav-link"
                href="javascript:void(0)"
                @mouseover="menuHoverTest"
              >測</a>
            </li> -->

            <!-- 固定不變的按鈕群 -->
            <li class="nav-item nav-item-icon position-relative">
              <a
                class="nav-link"
                href="javascript:void(0)"
                @click="showMemberCard = !showMemberCard"
              ><span class="menu-icon ID-icon" /></a>
              <div
                v-show="showMemberCard"
                class="memberCard"
                @mouseleave="showMemberCard = false"
              >
                <div class="memberCard-topBg">
                  <img
                    class="memberCard-icon"
                    src="~@images/image_IDface.svg"
                    alt=""
                  >
                </div>
                <div class="memberCard-data">
                  <p v-if="$user.getMe()" class="memberCard-name">
                    {{ $user.getMe().admName }}
                  </p>
                  <p v-if="$user.getMe()" class="memberCard-email">
                    {{ $user.getMe().admEmail }}
                  </p>
                </div>
                <button class="btn memberCard-btn" @click="onAvatarAction">
                  登出
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- 展開選單 -->
    <slide-up-down
      v-if="menuGroup"
      class="menulink__slide"
      :active="showMenuBlock"
      :duration="300"
      @close-end="initCurrentMenuGroup"
    >
      <div class="menulinkblock" @mouseleave="menuleave">
        <div class="menulinkblock__justify mx-auto">
          <template v-for="f in menuGroup">
            <div
              v-if="f.children.length > 0"
              :key="f.id"
              class="ml_block"
              :class="{ show: currentMenuGroup == f.id }"
            >
              <template v-for="s in f.children">
                <!-- 排除次選項 沒有子層 或 無連結 -->
                <div
                  v-if="s.children.length > 0 || s.route !== null"
                  :key="s.id"
                  class="ml_blockGroup"
                >
                  <!-- 主標題 -->
                  <p class="ml_block-title">
                    <a v-if="s.route" class="ml_block-link" @click="onLinkTo(s.route)">{{ s.title }}</a>
                    <span v-else class="ml_block-link">{{ s.title }}</span>
                  </p>
                  <ul v-if="s.children.length > 0" class="ml_block-lists">
                    <li
                      v-for="t in s.children"
                      :key="t.id"
                      class="ml_block-list"
                    >
                      <a v-if="t.route" class="ml_block-link" @click="onLinkTo(t.route)">{{ t.title }}</a>
                      <span v-else class="ml_block-link">{{ t.title }}</span>
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </template>

          <!-- TEST: -->
          <div class="ml_block" :class="{ show: currentMenuGroup == 'test' }">
            <div class="ml_blockGroup">
              <p class="ml_block-title">
                <span class="ml_block-link">維護作業</span>
              </p>
              <ul class="ml_block-lists">
                <li class="ml_block-list">
                  <router-link
                    class="ml_block-link"
                    :to="{ name: 'MaintenanceInsuranceTypeData' }"
                  >
                    險種資料維護
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </slide-up-down>
  </header>
</template>

<script lang="ts">
import {
Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { MenuNode } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class LayoutHeader extends Vue {
  currentMenuGroup = '';

  showMenuBlock = false;

  showMemberCard = false;

  menuItems: MenuNode[] = [];

  // test
  menuObject: MenuNode[] = [];

  // 處理選單object
  get menuGroup() {
    // TODO:
    // 還未與團險年金合併前，先隱藏
    return this.menuObject
      .filter((i) => i.item.menuName !== '首頁' && i.item.menuName !== '團險年金')
      .map((i) => this.toMenuItem(i));
  }

  /**
   * Func
   */
  // 將 menu 打包格式
  toMenuItem(node: MenuNode, rootTitle?: string) {
    const { item, children } = node;
    return {
      id: item.menuId,
      title: item.menuName,
      route: item.route,
      uri: item.uri,
      children: children.map((c) => this.toMenuItem(c)),
    };
  }

  // 取得 Menu
  getMenuApi() {
    this.$menuApi.getMenuTreeByCurrentUsingPOST().then((res) => {
      if (res.data.status == 200) {
        const getData = res.data.data;
        this.menuObject = getData.children;
      } else {
        const getError = res.data;
      }
    });
  }

  hoverHome() {
    this.currentMenuGroup = 'home';
    this.showMenuBlock = false;
  }

  /**
   * Event
   */
  menuHover(e) {
    const thatData = (this.menuGroup as any).filter(
      (item) => item.id == e.target.dataset.link,
    )[0];
    if (thatData && thatData.children.length > 0) {
      // 假如各子層 都不需展開，也沒路徑
      this.currentMenuGroup = thatData.id;
      this.showMenuBlock = true;
    } else {
      this.showMenuBlock = false;
    }
  }

  menuleave() {
    this.showMenuBlock = false;
  }

  // TEST:
  menuHoverTest() {
    this.currentMenuGroup = 'test';
    this.showMenuBlock = true;
  }

  initCurrentMenuGroup() {
    this.currentMenuGroup = '';
  }

  // 登出
  onAvatarAction() {
    this.$user.signOut();
    this.$router.replace({ path: '/login' });
  }

  onLinkTo(routerName) {
    const allRoute = this.$router.getRoutes().flatMap((i) => i.name);
    // console.log(allRoute.includes(routerName), routerName);
    if (allRoute.includes(routerName)) {
      this.$router.push({ name: routerName });
    } else {
      window.open(routerName);
    }
  }

  /**
   * Hook
   */
  created() {
    this.getMenuApi();
  }

  /**
   * 監聽
   */
  @Watch('$route', { deep: true })
  watchRouter(newVal) {
    // 切換頁面後，收合 Menu
    this.showMenuBlock = false;
    this.getMenuApi();
  }
}
</script>

<style lang="scss" scoped>
/**
   *  header 區塊
   * ----------------------------------
   */
.header {
  position: fixed;
  width: 100%;
  z-index: 999;
  &::before {
    content: "";
    background: linear-gradient(to right, $COLOR-MAIN1 0%, $COLOR-MAIN2 100%);
    display: block;
    width: 100%;
    height: 8px;
  }
}
.header__navBar {
  background: #fff;
  height: 72px;
  box-shadow: 0 -3px 6px 5px rgba(0, 0, 0, 0.2);
  .nav-item {
    font-size: 17px;
    &.nav-item-icon {
      margin-left: 10px;
      .nav-link {
        padding: 0;
      }
    }
  }
  .nav-link {
    color: $NARBARMENU-COLOR;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 9px;
    &:hover,
    &.active {
      color: $NARBARMENU-HOVER-COLOR;
      font-weight: 600;
    }
  }
}
.header__logo {
  display: block;
  width: 135px;
}
.header__logo-img {
  width: 100%;
  height: auto;
}

.menu-icon {
  width: 30px;
  height: 30px;
  display: block;
  background-repeat: no-repeat;
  background-position: center;
}
.manual-icon {
  background-image: url("~@images/button_manual.svg");
}
.search-icon {
  background-image: url("~@images/button_search.svg");
}
.ID-icon {
  background-image: url("~@images/button_ID.svg");
}

.menulink__slide {
  box-shadow: 0 -3px 6px 5px rgba(0, 0, 0, 0.2);
}
.menulinkblock {
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  &.show {
    display: block;
  }
}
.menulinkblock__justify {
  display: flex;
  justify-content: center;
}
.ml_block {
  display: none;
  color: $COLOR-BLACK;
  &.show {
    display: flex;
  }
}
.ml_blockGroup {
  padding: 15px 0;
  &:hover {
    background: $COLOR-MAIN3;
    .ml_block-title {
      .ml_block-link {
        color: $COLOR-WHITE;
        &::before {
          background: $COLOR-WHITE;
        }
      }
    }
    .ml_block-link:not(:hover) {
      color: $COLOR-WHITE;
    }
  }
}
.ml_block-link {
  color: $COLOR-BLACK;
  transition: none;
  cursor: pointer;
  display: block;
}
.ml_block-title {
  margin-bottom: 0;
  font-size: 16px;
  .ml_block-link {
    padding: 10px 30px 15px;
    &::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      background: $COLOR-MAIN3;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}
.ml_block-lists {
  margin-bottom: 0;
  list-style: none;
  padding-left: 0;
}
.ml_block-list {
  .ml_block-link {
    padding: 10px 30px;
    &:hover {
      background: $COLOR-WHITE;
      color: $COLOR-MAIN4;
      font-weight: 600;
    }
  }
}

.memberCard {
  position: absolute;
  top: 65px;
  right: 50%;
  transform: translateX(50%);
  min-width: 150px;
  background: $COLOR-WHITE;
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding-bottom: 18px;
}
.memberCard-topBg {
  background: linear-gradient(to right, $COLOR-MAIN1 0%, $COLOR-MAIN2 100%);
  height: 51px;
  text-align: center;
  margin-bottom: 25px;
}
.memberCard-icon {
  position: relative;
  bottom: -25px;
}
.memberCard-data {
  text-align: center;
  margin: 0 15px 23px;
}
.memberCard-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0;
}
.memberCard-email {
  font-size: 10px;
  margin-bottom: 0;
  word-break: break-word;
}
.memberCard-btn {
  font-size: 14px;
  color: $BUTTON-COLOR;
  background: $BUTTON-BG;
  display: block;
  margin: 0 auto;
  padding: 5px 40px;
  border-radius: 50vh;
}

.testF2e {
  .nav-link {
    color: #f00;
  }
}
</style>
