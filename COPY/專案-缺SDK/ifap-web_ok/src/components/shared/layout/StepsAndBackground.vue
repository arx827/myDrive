<template>
  <div>
    <!--a-steps 進度條 -->
    <steps />
    <div class="inner-context">
      <!-- 放置狀態圖 -->
      <slot name="statusImg" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Steps from "./Steps.vue";
import WhiteBackground from "./WhiteBackground.vue";

@Component({
  components: { WhiteBackground, Steps },
})
export default class StepsAndBackground extends Vue {
  @Prop()
  current: number;
}
</script>
<style lang="scss" scoped>
//中間白框
.inner-context {
  background-color: white;
  top: 140px;
  left: 57px;
  // width: 1252px;
  // height: 532px;
  width: 100%;
  height: 100%;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 4px;
  margin: auto;
  display: flex;
  /* 水平置中 */
  justify-content: center;
  /* 垂直置中 */
  align-items: center;
}
</style>
