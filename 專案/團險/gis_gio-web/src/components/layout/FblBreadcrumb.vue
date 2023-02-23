<template>
  <div class="breadcrumb">
    <ul>
      <li />
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({})
export default class Breadcrumb extends Vue {
  breadcrumbList: [] = [];

  /**
 * Func
 */

  /**
 * Hook
 */

  /**
 * 監聽
 */
  @Watch('$route', { immediate: true, deep: true })
  watchbreadcrumb() {
    this.breadcrumbList = this.$route.meta.breadcrumb;
  }
}
</script>

<style lang="scss" scoped>
  // loading
  $spinSize: '80';
  .custom__spinWrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  .custom__spin {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }
  %size {
    width: #{$spinSize}px;
    height: #{$spinSize}px;
  }
  .custom__percent {
    position: relative;
    @extend %size;
    svg {
      position: relative;
      @extend %size;
      circle {
        @extend %size;
        fill: none;
        stroke-width: 4;
        stroke: #000;
        transform: translate(5px, 5px);
        stroke-dasharray: 440;
        stroke-dashoffset: 440;
        stroke-linecap: round;
        &:nth-child(1) {
          stroke-dashoffset: 0;
          stroke: #f3f3f3;
          display: none;
        }
        &:nth-child(2) {
          stroke-dashoffset: calc(440 - (230 * var(--progress)) / 100);
          stroke: $LOADING-COLOR;
        }
      }
    }
  }
  .custom__percentNum {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $LOADING-TXT-COLOR;
  }
  .custom__percentNum__txt {
    font-size: 20px;
  }
  .custom__percentNum__unit {
    margin-left: 3px;
    font-size: 16px;
  }
  .custom__text {
    color: $LOADING-TXT-COLOR;
    letter-spacing: 1px;
    font-size: 14px;
    padding: 10px;
  }
</style>
