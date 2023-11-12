<template>
  <footer class="footer">
    © Fubon Financial. All Rights Reserved 建議您使用瀏覽器版本為Chrome、Safari、Edge最新版本
  </footer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Footer extends Vue {

}
</script>

<style lang="scss">
.footer{
  position: absolute;
  bottom: 0;
  text-align: center;
  background-color: $BG-PRIMARY;
  padding: 4px 0px;
  width: 100%;
  color: $FONT-LIGHT;
  font-size: 12px;
  // @include rwd-xll{
  //   padding: 10px 0px;
  //   font-size: 16px;
  // }
}
</style>
