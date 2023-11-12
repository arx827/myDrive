<template>
  <div class="HomePage__wrap d-flex flex-column">
    <div class="page__content d-flex flex-column">
      <div class="page__logo" />
      <div class="page__main col d-flex align-items-center justify-content-center">
        <div class="card__itemGroup">
          <div class="row">
            <div class="col-4">
              <div class="card__item" @click="onClickCardItem('1')">
                <i class="card__icon" />
                <p class="card__title">
                  核保審核作業
                </p>
              </div>
            </div>
            <div class="col-4">
              <div class="card__item" @click="onClickCardItem('2')">
                <i class="card__icon" />
                <p class="card__title">
                  監控作業
                </p>
              </div>
            </div>
            <div class="col-4">
              <div class="card__item" @click="onClickCardItem('3')">
                <i class="card__icon" />
                <p class="card__title">
                  MIS統計
                </p>
              </div>
            </div>
            <div class="col-4">
              <div class="card__item" @click="onClickCardItem('4')">
                <i class="card__icon" />
                <p class="card__title">
                  權限管理
                </p>
              </div>
            </div>
            <div class="col-4">
              <div class="card__item" @click="onClickCardItem('5')">
                <i class="card__icon" />
                <p class="card__title">
                  報表列印
                </p>
              </div>
            </div>
            <div class="col-4">
              <div class="card__item" @click="onClickCardItem('6')">
                <i class="card__icon" />
                <p class="card__title">
                  查詢
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page__footer">
      最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved
    </div>
  </div>
</template>

<script lang="ts">
import FblFilterBuilder from '@/components/shared/filter-builder/FblFilterBuilder.vue';
// import { CrowdCredentials } from "@fubonlife/f2b_re-api-axios-sdk";
import { message } from 'ant-design-vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class HomePage extends Vue {
  /**
   * Event
   */
  // click Card
  onClickCardItem(key) {
    this.$router.push({ name: 'Main' });
  }
}
</script>

<style lang="scss" scoped>
.HomePage__wrap {
  min-height: 100vh;
}
.page__content {
  flex: 1;
  background: transparent linear-gradient(136deg, nth($COLOR-MAIN-BG-LINEAR, 1) 0%, nth($COLOR-MAIN-BG-LINEAR, 2) 36%, nth($COLOR-MAIN-BG-LINEAR, 3) 100%) 0% 0% no-repeat padding-box;
}
.page__logo {
  width: 218px;
  height: 46px;
  background: $COLOR-GRAY1;
  margin-top: 23px;
  margin-left: 82px;
}
.page__main {
  background: rgba($COLOR-WHITE, 0.37);
  margin: 18px 27px;
}

.card__itemGroup {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  flex-wrap: wrap;
  > .row {
    --bs-gutter-y: 60px;
    --bs-gutter-x: 30px;
  }
}
.card__item {
  height: 260px;
  border: 5px solid $COLOR-MAIN3;
  background: $COLOR-WHITE;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translate(-50%, 100%);
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 13px 13px 0 13px;
    border-top-color: $COLOR-MAIN3;
  }
}
.card__icon {
  display: block;
  width: 85px;
  height: 85px;
  background: $COLOR-GRAY1;
}
.card__title {
  font-size: 21px;
  margin-top: 28px;
  margin-bottom: 0;
  font-weight: 600;
}
</style>
