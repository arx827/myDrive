<script setup lang="ts">
import { ref } from 'vue'
const footerCopyright = ref(
  '建議瀏覽器版本：最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved',
)
</script>
<template>
  <footer class="main__footer d-flex justify-content-center align-items-center">
    <p class="footer__copyright">
      <span>{{ footerCopyright }}</span>
    </p>
  </footer>
</template>

<style scoped lang="scss">
.main__footer {
  background: $FOOTER-BG;
  text-align: center;
  padding-top: 16px;
  height: 48px;
  margin-top: 20px;
}
.footer__copyright {
  font-size: 12px;
  margin-bottom: 14px;
}
</style>
