<template>
  <footer class="footer">
    最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved
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
  background-color: #00829B;
  padding: 4px 0px;
  width: 100%;
  color: $BS-COLOR-WHITE;
  font-size: 12px;
}
</style>
