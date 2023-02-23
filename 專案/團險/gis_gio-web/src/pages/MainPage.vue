<template>
  <div class="mainPage">
    <a-layout
      id="components-layout-demo-fixed-sider"
      :class="changeBgColor"
    >
      <LayoutHeader />
      <LayoutLoading v-if="getLoading" />

      <a-layout-content class="minContent">
        <LayoutContent>
          <template v-slot:layoutContentSlot>
            <router-view />
          </template>
        </LayoutContent>
        <LayoutFooter />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { Subject } from 'rxjs';
import { MenuNode } from '@fubonlife/co-giiss-api-axios-sdk';
import { takeUntil } from 'rxjs/operators';

import LayoutHeader from '@compononts/layout/FblLayoutHeader.vue';
import LayoutContent from '@compononts/layout/FblLayoutContent.vue';
import LayoutFooter from '@compononts/layout/FblLayoutFooter.vue';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

@Component({
  components: {
    LayoutHeader,
    LayoutContent,
    LayoutLoading,
    LayoutFooter,
  },
})
export default class MainPage extends Vue {
  private unsubscribe$ = new Subject<void>();

  public title = 'GIS-GIO';

  changeBgColor = '';

  // change 背景 的 routerName
  changeBgData = {
    MaintenanceInsuranceTypeDataEdit: 'bg__blue',
    MaintenanceInsuranceTypeDataConfirm: 'bg__blue',
    MaintenanceInsuranceTypeDataPlanAddAndEdit: 'bg__blue',
    ApplMaintenanceUndertakerDataAddAndEdit: 'bg__blue',
    ApplMaintenanceUndertakerDataConfirm: 'bg__blue',
    SearchChangeDataDetails: 'bg__blue',
    MaintenanceCompanyInfo: 'bg__blue',
    MaintenanceCompanyInfoConfirm: 'bg__blue',
    MaintenancePaAddAndEdit: 'bg__blue',
    MaintenanceBusinessAddAndEdit: 'bg__blue',
    ApplMaintenanceApplDataResult: 'bg__blue',
    ApplMaintenanceApplDataConfirm: 'bg__blue',
    MaintenanceDocAddAndEdit: 'bg__blue',
    MaintenanceDocApproving: 'bg__blue',
    MarketingGioMarketingEdit: 'bg__blue',
    MarketingGioMarketingApprove: 'bg__blue',
  };

  public menuItems: MenuNode[] = [];

  @Getter getLoading!: boolean;

  @Action('setLoading') setLoading;

  /**
   * Hook
   */
  created() {
    // this.$user.loginState$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((state) => {
    //     if (state && state.me) {
    //       this.avatarText = state.me.employeeId;
    //     }
    //   });
  }

  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * 監聽
   */
  // 監聽route 變更底色，預設為白底，有別的顏色再加到列舉裡
  @Watch('$route', { immediate: true, deep: true })
  watchRoute(newVal) {
    if (this.changeBgData[newVal.name] !== undefined) {
      this.changeBgColor = this.changeBgData[newVal.name];
    } else {
      this.changeBgColor = '';
    }
  }
}
</script>

<style lang="scss" scoped>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.minContent {
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
