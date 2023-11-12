<template>
  <div class="main__header d-flex justify-content-between align-items-center">
    <div class="header__logo" />
    <div class="header__control d-flex">
      <a-icon type="home" class="control__icon" />
      <a-icon type="user" class="control__icon" />
      <span class="account">B0123 林X生</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FblAvatarAction } from './models';

@Component({})
export default class FblLayoutHeader extends Vue {
}
</script>

<style lang="scss" scoped>
.main__header {
  height: #{$main-header-H}px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background: $COLOR-WHITE;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.12);
  padding: 0 18px;
}
.header__logo {
  width: 126px;
  height: 27px;
  background: $COLOR-GRAY1;
  margin-left: 47px;
}
.header__control {
  * + * {
    margin-left: 16px;
  }
  .control__icon,
  .anticon-user {
    font-size: 25px;
    color: $COLOR-MAIN10;
  }
  .account {
    margin-left: 10px;
  }
}
</style>
