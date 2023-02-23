<template>
  <div class="custom__spinWrap">
    <div class="custom__spin">
      <div
        class="custom__percent"
        :style="{'--progress': loadingPercent}"
      >
        <svg>
          <circle
            cx="35"
            cy="35"
            r="37"
          />
          <circle
            cx="35"
            cy="35"
            r="37"
          />
        </svg>
        <div class="custom__percentNum">
          <p class="custom__percentNum__txt">
            {{ loadingPercent }}<span class="custom__percentNum__unit">%</span>
          </p>
        </div>
      </div>
      <span class="custom__text">載入資料中</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({})
export default class LayoutLoading extends Vue {
  // loading 百分比
  loadingPercent = 10;

  /**
 * Func
 */
  // 假loading 每0.1秒隨機加 1 ~ 9，停在90幾 並停止持續事件
  createLoading() {
  	const driver = setInterval(() => {
  		if (this.loadingPercent < 90) {
  			this.loadingPercent += Math.floor(Math.random() * 9);
  		} else {
  			clearInterval(driver);
  		}
  	}, 50);
  }

  /**
 * Hook
 */
  mounted() {
  	this.createLoading();
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
    z-index: 9999;
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
