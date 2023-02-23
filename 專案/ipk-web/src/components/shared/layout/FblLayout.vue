<template>
  <a-layout>
    <a-layout-header class="event--shadow">
      <div class="header__wrap">
        <div class="d-flex">
          <div class="header__logo">
            <router-link to="/">
              <a href="javascript:void(0)">
                <img
                  src="@/assets/images/image_fubonLogo.svg"
                  alt="logo"
                  class="mt-2"
                >
              </a>
            </router-link>
          </div>
          <div>
            <a href="javascript:void(0)">
              <img
                v-if="isProd"
                src="@/assets/images/image_InvestLogo.svg"
                alt="logo"
              >
              <img
                v-else
                src="@/assets/images/image_InvestLogoDev.svg"
                alt="logo"
              >
            </a>
          </div>
          <div class="ms-auto">
            <div class="header__icon__wrap d-flex align-items-center">
              <a-badge :count="noticeTotalCount" class="mx-3" @click="openMyNoticePage">
                <a href="javascript:void(0)">
                  <img
                    src="@/assets/images/icon_bell.svg"
                    alt="logo"
                  >
                </a>
              </a-badge>

              <a class="mx-2" href="javascript:void(0)">
                <img
                  src="@/assets/images/icon_user.svg"
                  alt="logo"
                >
              </a>
              <label class="avatar__label">{{ avatarText }}</label>
              <a-dropdown>
                <a-avatar
                  icon="down"
                  class="mx-2"
                />
                <a-menu slot="overlay">
                  <a-menu-item v-for="action of avatarActions" :key="action.name">
                    <a @click="handleAvatarAction(action)">{{ action.title }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
        </div>
      </div>
    </a-layout-header>

    <input id="sider-toggle" v-model="collapsed" type="checkbox" class="d-none">

    <a-layout>
      <a-layout-sider v-model="collapsed" class="layout__sider event--shadow" :width="256">
        <slot name="side" />
      </a-layout-sider>
    </a-layout>

    <a-layout id="layout-custom-content">
      <a-layout-content
        class="inner-content"
        :style="{ margin: '0px 10px', background: '#fff'}"
      >
        <slot name="content">
          <OuterTab />
        </slot>
        <!-- <a-layout-footer class="layout__footer">
          <p class="footer__copyright">
            <span>© Fubon Financial. All Rights Reserved</span><span>本平台網頁標準為 Chrome瀏覽器，1920x1080、1280x1024 兩種解析度</span>
          </p>
        </a-layout-footer> -->
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import OuterTab from '@/components/shared/tab/OuterTab.vue';
import { FblAvatarAction } from './models';

@Component({ components: { OuterTab } })
export default class FblLayout extends Vue {
  @Getter getNotice;

  @Action('setActiveSubTab') setActiveSubTab;

  @Action('setTabArray') setTabArray;

  @Prop()
  public collapsed: boolean;

  @Prop()
  public title: string;

  @Prop()
  public subtitle: string;

  @Prop()
  public avatarText: string;

  @Prop()
  public avatarActions: FblAvatarAction[];

  /**
  * data
  */
  isProd = false; // 判斷是否為正式環境

  /**
   * computed
   */
  get noticeTotalCount() {
    return this.getNotice.messageNoticeCount + this.getNotice.todoCount;
  }

  /**
   * hook
   */
  created() {
    this.isProd = process.env.NODE_ENV === 'production';
  }

  /**
  * methods
  */
  handleAvatarAction(action: FblAvatarAction) {
    this.$emit('onAvatarAction', action);
  }

  // 開啟個人通知畫面
  openMyNoticePage() {
    let itemPart = this.$authService.myNoticeTabSetting.route.split('-');
    let res = '';
    for (let i = 0; i < itemPart.length; i++) {
      res += (itemPart[i][0].toUpperCase() + itemPart[i].slice(1));
    }
    this.$store.dispatch('setAddCachedView', res);
    this.setTabArray(this.$authService.myNoticeTabSetting);
    this.setActiveSubTab(this.$childrenTab.childrenTab.NOTICE.val);
  }
}
</script>

<style lang="scss" scoped>
.header__wrap {
  &::before {
    content: '';
    display: block;
    height: 5px;
    width: 100%;
    background: linear-gradient(to right, $COLOR-MAIN3, $COLOR-MAIN5);
  }
}
::v-deep {
  .ant-layout-header {
    height: 55px;
    padding: 0;
    line-height: 60px;
    background: $COLOR-WHITE;
  }
  .ant-page-header-content {
    padding-top: 0;
  }
  .ant-avatar {
    background: $COLOR-WHITE;
    i {
      cursor: pointer;
      svg {
        color: $COLOR-GRAY10;
        font-size: 15px;
      }
    }
  }
  .ant-layout-content {
    margin: 0 12px 12px;
    background: $COLOR-WHITE;
    min-height: 280px;
  }
  .ant-layout-sider {
    background: $COLOR-WHITE;
  }
  .ant-layout-sider-trigger {
    color: #212529;
    background: $COLOR-WHITE;
    border-top: 1px solid $COLOR-GRAY13;
  }
}
.header__logo {
  margin-left: 100px;
  margin-right: 23px;
}
.header__icon__wrap {
  font-size: 20px;
  color: $COLOR-GRAY10;
  ::v-deep {
    .ant-avatar {
      i {
        svg {
          font-size: 20px;
          margin-top: 5px;
        }
      }
    }
  }
}
.avatar__label {
  font-size:16px;
  text-align:center;
}
.layout__sider {
  height: calc(100% - 60px);
  // overflow-y: auto;
  position: fixed;
  // margin-top: 12px;
  margin-top: 5px;
}
$side-width: 256px;
#layout-custom-content {
  margin-left: $side-width;
  transition: margin-left 200ms;
}
#sider-toggle:checked ~ #layout-custom-content {
  margin-left: 80px;
}
.inner-content {
  // box-shadow: rgb(0 0 0 / 5%) -1px 2px, rgb(0 0 0 / 16%) -1px -1px 6px inset;
  // box-shadow: rgb(0 0 0 / 10%) -1px 2px;
  background-color: white;
  overflow: auto;
  position: fixed;
  left: $side-width;
  top: 66px;
  height: calc(100% - 75px);
  min-height: calc(100% - 75px);
  width: calc(100% - (20px + #{$side-width}));
  transition: left 200ms;
  margin: 0px 17px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  > :not(footer){
    flex: 1;
  }
}
#sider-toggle:checked ~ #layout-custom-content .inner-content {
  left: 80px;
  width: calc(100% - 100px);
}

.layout__footer {
  background: #f0f2f5;
  position: static;
  text-align: center;
  padding: 10px;
  height: auto;
  color: rgba(0,0,0,0.45);
  .footer__copyright {
    margin-bottom: 5px;
    span {
      margin-left: 2.5px;
      margin-right: 2.5px;
    }
  }
}
img {
  vertical-align: text-bottom;
  border-style: none;
}
</style>
