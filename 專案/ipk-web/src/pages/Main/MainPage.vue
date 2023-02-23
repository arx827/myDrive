<template>
  <div>
    <FblLoading />
    <FblLayout
      :avatarText="avatarText"
      :avatarActions="avatarActions"
      :collapsed="collapsed"
      @onAvatarAction="onAvatarAction($event)"
    >
      <template v-slot:side>
        <fbl-side-menu
          :items="menuItems"
          :collapsed="collapsed"
          class="layout-sider-menuBar"
          @onItemNavigated="onItemNavigated($event)"
        >
          <template v-slot:renderer="slotProp">
            <span v-if="slotProp.data.icon">
              <img :class="{'me-3' : collapsed}" :src="require(`@images/${slotProp.data.icon}_blue.svg`)">
            </span>
            <span :class="handleMenuWrap(slotProp.data)">
              {{ slotProp.data.title }}
            </span>
          </template>
        </fbl-side-menu>

        <!-- 選單縮合icon  start-->
        <input
          id="sider-trigger"
          v-model="collapsed"
          type="checkbox"
          class="d-none"
        >
        <div class="layout-sider-logo mt-auto d-flex">
          <button
            class="icon-button"
            :class="{'icon__unfolad': collapsed}"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
        <!-- 選單縮合icon  end-->
      </template>
      <template v-slot:content>
        <router-view />
      </template>
    </FblLayout>
  </div>
</template>

<script src="./MainPage.ts" lang="ts">
</script>

<style lang="scss" scoped>
.layout-sider-menuBar {
  position: relative;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 48px;
}
.layout-sider-logo {
  padding: 13px;
  font-size: 20px;
  font-weight: 500;
  border-top: 1px solid $COLOR-GRAY13;
  justify-content: flex-end;

  background-color: #FFFFFF;
  position: absolute;
  top: auto;
  bottom: 0;
  width: 256px;
  background: white;
  // box-shadow: 3px 3px 6px #00000029;
  // transition: 1s ease-in-out;
}
#sider-trigger:checked ~ .layout-sider-logo {
  justify-content: center;
  width: 100%;
}
#sider-trigger:checked ~ .layout-sider-logo span,
#sider-trigger:checked ~ .layout-sider-logo .ant-divider-vertical {
  display: none;
}
#sider-trigger:checked ~ .ant-divider-horizontal {
  display: block;
  margin: 0;
}
::v-deep {
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
}
.icon-button {
  min-width: 28px;
  min-height: 22px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $COLOR-WHITE;
  border-radius: 16px;
  border: 0;
  background: url('~@images/button_fold.svg') no-repeat center;
  transition: all 2ms ease-in-out;
}
.icon__unfolad {
  // background: url('~@images/button_unfold.svg') no-repeat center;
  transform: rotate(180deg);
}
::v-deep {
  .ant-menu-inline .ant-menu-submenu-title {
    padding-left: 0 !important;
  }
  .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 0 15px !important;
  }
  .ant-menu-item {
    padding-left: 0px !important;
  }
}
// 選單縮小的間距
.menu-collapsed__wrap {
  padding-left: 5px !important;
}
// 第二層選單的間距
.menu-second-item__wrap {
  padding-left: 55px !important;
}
// 第三層選單的間距
.menu-third-item__wrap {
  padding-left: 70px !important;
}
// 第四層選單的間距
.menu-fourth-item__wrap {
  padding-left: 84px !important;
}
// 第五層選單的間距
.menu-fiveth-item__wrap {
  padding-left: 98px !important;
}
</style>
