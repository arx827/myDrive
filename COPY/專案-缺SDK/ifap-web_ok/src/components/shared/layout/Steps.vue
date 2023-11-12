<template>
  <!--a-steps 進度條 -->
  <div class="steps">
    <a-steps :current="current" size="small">
      <!-- <a-step title="個資同意" /> -->
      <a-step title="有效性驗證" />
      <a-step title="驗證成功" />
    </a-steps>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class Steps extends Vue {
  @Prop()
  current: number;
}
</script>
<style lang="scss" scoped>
.steps {
  /* Layout Properties */
  top: 100px;
  left: 342px;
  width: 455px;
  height: 24px;
  margin: 20px auto 20px auto;
}
</style>
