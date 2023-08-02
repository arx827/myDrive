<template>
  <header class="header">
    <div class="header-container">
      <div class="header__logo">
        <img
          src="@/assets/images/header/icon-fubon-logo.svg"
          alt="fubon logo"
          class="header__logo__img"
        >
      </div>
      <div class="header__menu">
        <ul class="header__menu__list">
          <li>
            <router-link :to="{name: 'AgentSettingIndex'}">
              <span class="align-middle header__meun__dropdown__text">
                代理人設定
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'RoleMaintainIndex'}">
              <span class="align-middle header__meun__dropdown__text">
                角色維護
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'ParamMaintainIndex'}">
              <span class="align-middle header__meun__dropdown__text">
                參數維護
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'UserMaintainIndex'}">
              <span class="align-middle header__meun__dropdown__text">
                使用者維護
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({ components: { } })
export default class Header extends Vue {
}
</script>

<style lang="scss" scoped>
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #00829B;
    z-index: 1000;
  }
  .header-container {
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header__logo {
    display: flex;
    margin: 14px 0px;
    @media (min-width: 1365.98px) {
      flex-grow: 1;
    }
  }
  .header__logo__img {
    width: 106px;
    margin-left: 26px;
    @media (min-width: 1365.98px) {
      margin-left: 12%;
    }
  }
  .header__menu {
    .header__menu__list {
      height: 100%;
      margin: 0;
      display: flex;
      list-style: none;
      a {
        padding: 14px 25px;
        display: block;
        color: #FFFFFF;
        font-weight: bold;
      }
    }
  }
</style>
