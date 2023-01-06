<template>
  <div class="wrap">
    <div>
      <i class="error__img" />
    </div>
    <div class="error__block">
      <div class="error__title">訪問無權限</div>
      <div class="error__content">很抱歉，你無權登入系統！</div>
      <a-button class="error__btn" @click="goHome">離開</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ReviewDetailErrorPage extends Vue {
  goHome() {
    this.$user.signOut();
    // this.$router.replace({ name: "Login" });
    window.location.href = process.env.VUE_APP_LOGIN_URL;
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #FFFFFF;
}
.error__img{
  display: inline-block;
  background: url('../assets/images/main-no-power.svg') no-repeat;
  width: 400px;
  height: 400px;
  background-size: 100%;
}
.error__block{
  position: relative;
  bottom: 100px;
  margin-left: 75px;
}
.error__title{
  font-size: 56px;
  line-height: 64px;
}
.error__content{
  color: #00000073;
  line-height: 24px;
}
.error__btn{
  margin-top: 20px;
  width: 150px;
  height: 40px;
  background-color: #13C2C2;
  color:#fff;
}
</style>
