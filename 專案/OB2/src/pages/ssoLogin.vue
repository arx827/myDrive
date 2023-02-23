<template>
  <div class="ssoLogin" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";

@Component
export default class SsoLogin extends Vue {
  created() {

    // 測試導頁1
    // API: 驗證 並導頁
    LoadingUtil.show();
    setTimeout(() => {
      this.$router.replace({ name: "permission1" })
        .then(() => {
          LoadingUtil.close();
        });
    }, 1000);
  }
}
</script>

<style lang="less" scoped>
</style>
