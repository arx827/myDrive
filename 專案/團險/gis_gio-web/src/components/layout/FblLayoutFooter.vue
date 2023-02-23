<template>
  <footer class="footer">
    <!-- <nav class="footer__navBar">
      <a
        class="menu-item"
        href="https://www.fubon.com/life/BF2D481A7477466F91C1238212D38D64/fairdealing/history/"
        target="_blank"
      >公平待客原則</a>
      <a
        class="menu-item"
        href="https://www.fubon.com/life/statement/privacy/life-privacy/"
        target="_blank"
      >隱私權聲明</a>
      <a
        class="menu-item"
        href="https://www.ib.gov.tw/ch/"
        target="_blank"
      >主管機關相關連結</a>
      <a
        class="menu-item"
        href="./download/self-discipline.pdf"
        download="self-discipline.pdf"
      >保險業經營電子商務自律規範</a>
    </nav> -->
    <p class="footer__copyright">
      <span>建議瀏覽器版本：最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved</span>
    </p>
  </footer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class LayoutFooter extends Vue {
}
</script>

<style lang="scss" scoped>
  /**
   *  footer 區塊
   * ----------------------------------
   */
  .footer {
    background: $FOOTER-BG;
    text-align: center;
    padding-top: 16px;
    height: 48px;
  }
  .footer__navBar {
    margin-bottom: 1px;
    .menu-item {
      color: #000;
      font-size: 14px;
      border-left: 1px solid #000;
      padding-left: 8px;
      padding-right: 8px;
      font-weight: 600;
      &:last-child {
        border-right: 1px solid #000;
      }
      &:hover {
        color: $COLOR-MAIN3;
      }
    }
  }
  .footer__copyright {
    font-size: 12px;
    margin-bottom: 14px;
  }
</style>
