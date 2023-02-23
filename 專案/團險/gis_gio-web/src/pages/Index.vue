<template>
  <div class="inner-content" />
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class Index extends Vue {

}
</script>

<style lang="scss" scoped>
.inner-content {
  overflow: initial;
  background: #fff;
  // 設定兩張背景圖
  background: url('~@images/iamge_homeBackground1.svg'),
              url('~@images/iamge_homeBackground2.svg');
  background-position: left 0 bottom 0, right 0 top 0;
  background-repeat: no-repeat;
  background-size: auto 70%;
  height: calc(100vh - 80px - 48px);
}
</style>
