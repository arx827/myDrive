<template>
  <div class="inner-context">
    <!-- 放置狀態圖 -->
    <slot name="statusImg" class="statusImg" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class WhiteBackground extends Vue {}
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
.statusImg {
  margin: auto;
}
</style>
