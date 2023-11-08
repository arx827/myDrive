<template>
  <footer
    :class="{'footer--shadow': currentRouterName === 'index'}"
  >
    <div class="container-xxl">
      <div class="text-center">
        <ul class="footer__menu">
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/BF2D481A7477466F91C1238212D38D64/fairdealing/history/"
            >公平待客原則</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/statement/privacy/life-privacy/"
            >隱私權聲明</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.ib.gov.tw/ch/"
            >相關連結</a>
          </li>
        </ul>
      </div>
      <div class="footer__copyright text-center">
        建議瀏覽器版本：最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({})
export default class LayoutFooter extends Vue {
  // 當前router名稱
  currentRouterName = this.$route.name;

  /**
   * Hook
   */
  mounted() {
  	this.currentRouterName = this.$route.name;
  }

  /**
   * 監聽
   */
  @Watch('$route.name')
  onRouterChanged(val) {
  	this.currentRouterName = val;
  }
}
</script>

<style lang="scss" scoped>
footer {
  background: #DFE6EC;
  padding: 10px 0;
  position: relative;
  min-height: 76px;
  display: flex;
  align-items: center;
  @include rwd-xl {
		padding: 16px 0;
	}
}
.footer--shadow{
  box-shadow: 0px -4px 6px rgba(0, 0, 0, 0.1);
}
.footer__menu {
  font-weight: bold;
  margin-bottom: 2px;
  li {
    display: inline-flex;
    &::before, &:last-child::after {
      content: '|';
      display: inline-block;
      vertical-align: middle;
      padding: 0 5px;
      font-size: 13px;
      line-height: 20px;
      @include rwd-xl {
        font-size: 14px;
      }
    }
    a {
      color: $COLOR-BLACK;
      display: inline-block;
      vertical-align: middle;
      font-size: 11px;
      line-height: 20px;
      @include rwd-xl {
        font-size: 14px;
      }
      &:hover {
        color: $COLOR-MAIN1;
        text-decoration: underline;
      }
    }
  }
}
.footer__copyright {
  color: $COLOR-BLACK;
  font-size: 11px;
  @include rwd-xl {
    font-size: 12px;
  }
}
.index__footer--right{
  position: absolute;
  right: 0px;
  bottom: 0;
  z-index: 1000;
  width: 15.7%;
  max-width: 215px;
}
.index__footer--left{
  position: absolute;
  left: 17px;
  bottom: 33px;
  z-index: 1000;
  width: 8.9%;
  max-width: 122px;
}
</style>
