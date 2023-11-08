<template>
  <div class="custom__spinWrap flex-center">
    <a-spin
      class="custom__spinWrap__content flex-center"
      tip="請稍後"
      size="large"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Loading extends Vue {

}
</script>

<style lang="scss" scoped>
.custom__spinWrap{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0);
  ::v-deep{
    .ant-spin-lg .ant-spin-dot{
      font-size: 54.68px;
      i{
        background-color: #fff;
        width: 22px;
        height: 22px;
      }
    }
    .ant-spin-text{
      font-size: 18px;
      margin-top: 9px;
    }

  }
}
.custom__spinWrap__content{
  border-radius: 10px;
  flex-direction: column;
  background-color: rgba($color:#000000CC, $alpha:0.56);
  color: #fff;
  width: 14%;
  min-width: 157px;
  padding: 35px;
}
</style>
