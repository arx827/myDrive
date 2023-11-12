<template>
  <a-spin :spinning="getLoading" :delay="200" wrapperClassName="ifap_spin" size="large">
    <fbl-layout
      :title="title"
      :subtitle="subtitle"
      :avatarText="avatarText"
      :avatarActions="avatarActions"
      @onAvatarAction="onAvatarAction($event)"
    >
      <template v-slot:menu>
        <fbl-side-menu :items="menuItems">
          <template v-slot:renderer="slotProp">
            <!-- <a-icon :type="slotProp.data.route ? 'file' : 'folder'" /> -->
            <span>{{ slotProp.data.menuName }}</span>
          </template>
        </fbl-side-menu>
      </template>
      <template v-slot:content>
        <!-- ===========麵包屑=========== -->
        <breadcrumb />
        <!-- ===========標題=========== -->
        <h1 v-if="$route.meta.title" class="page__title">
          {{ $route.meta.title }}
        </h1>
        <router-view />
      </template>
    </fbl-layout>

    <!-- <a-modal
      ref="timeOut"
      :visible="false"
      :closable="false"
      :footer="null"
      :width="400"
      wrap-class-name="modal__signout"
      centered="centered"
    >
      <div class="p_in_timeout_modal">
        <div class="title">
          系統已登出
        </div>
        <div class="content">
          系統閒置超過30分鐘
          <br>請重新登入。
        </div>
        <button
          class="ant-btn ant-btn-primary"
          @click="signOut"
        >
          確定
        </button>
      </div>
    </a-modal> -->
  </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import FblLayout from '@/components/shared/layout/FblLayout.vue';
import FblSideMenu from '@/components/shared/side-menu/FblSideMenu.vue';
import { FblMenuItem } from '@/components/shared/side-menu/model';
import { FblAvatarAction } from '@/components/shared/layout/models';
import { Subject } from 'rxjs';
import { MenuNode } from '@fubonlife/ifap-api-axios-sdk';
import { takeUntil } from 'rxjs/operators';
import { SettingOutlined } from '@ant-design/icons-vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import { Getter } from 'vuex-class';

@Component({
  components: {
    FblLayout,
    FblSideMenu,
    Breadcrumb,
  },
})
export default class MainPage extends Vue {
  @Getter getLoading!: boolean;

  @Getter getTimeOutVisible!: boolean;

  private unsubscribe$ = new Subject<void>();

  public title = '資訊輔助平台 IFAP';

  public subtitle = '';

  public avatarText = '使用者名稱';

  public avatarActions: FblAvatarAction[] = [
    {
      name: 'logout',
      title: '登出',
    },
  ];

  public menuItems: FblMenuItem[] = [];

  created() {
    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          // 右上角要顯示的登入者資料
          this.avatarText = `${state.me.employee?.domainId || ''} ${state.me.employee?.name || ''}`;
        }
      });

    this.$authApi.getAuthorizedMenuTreeUsingPOST().then((resp) => {
      const $getResp = resp.data.data
      // 這裡把menu把DB資料讀進來Map成FblMap
      if (resp.data.apiStatus) {
        const node = resp.data;
        this.menuItems = node.data.children.map((c) => this.toMenuItem(c));
      }
    });
    this.$user.initTimeOutSecond()
  }

  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onAvatarAction(action: FblAvatarAction) {
    switch (action.name) {
      case 'logout':
        this.signOut();
        break;
    }
  }

  onItemNavigated(item: FblMenuItem) {
    this.title = item ? item.title : 'IFAP';
  }

  signOut() {
    this.$user.signOut();
    // (this.$refs.timeOut as any).cleanUpTime('signOut');
    this.$router.replace({
      name: 'Login',
      params: {
        signOut_flag: 'Y',
      },
    });
  }

  toMenuItem(node: MenuNode): FblMenuItem {
    const item = node.item;
    return {
      key: item.menuId,
      title: item.menuName,
      route: item.uri,
      children: node.children.map((c) => this.toMenuItem(c)),
      disabled: item.isLeaf && !item.status,
    };
  }
}
</script>

<style lang="scss" scoped>
.ant-page-header {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  padding: 16px 24px;
  background-color: #fff;
}

h1 {
  font-size: 25px;
  color: black;
  &.page__title {
    font-weight: bold;
    font-size: 30px;
    padding: 8px 0;
  }
}

.ifap_spin {
  ::v-deep {
    .ant-spin {
      position: fixed;
      max-height: 100vh;
      z-index: 9999;
    }
    .ant-spin-blur::after {
        z-index: 9999;
    }
  }
}

// ::v-deep(.ant-spin-nested-loading > div > .ant-spin) {
//   bottom: 0;
//   right: 0;
// }

.timeout{
  padding: 90px 90px 90px 126px;
}

.modal__signout{
  .title{
    font-size: 20px;
    color: #000;
    font-weight: bold;
    text-align: center;
  }
  .content{
    font-size: 15px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 24px;
    margin-top: 10px;
    text-align: center;
  }
  img{
    width: 100%;
  }
  .p_in_modal {
  // letter-spacing: var(--unnamed-character-spacing-0);
  // font: normal normal normal 14px/25px PingFang TC;
  // letter-spacing: 0px;
  // color: #333333;
  padding: 0px 80px 10px;
  width: 400px;
  }

  .ant-btn {
    left: 40%;
  }
}
</style>
