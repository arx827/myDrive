<template>
  <div>
    <a-layout-header :style="{ background: '#fff', padding: 0 }" class="header">
      <img class="fbllogo" src="~@/assets/imgs/logo_fblife.svg" alt="">
      <img class="maillogo" src="~@/assets/imgs/logo_email.svg" alt="">
    </a-layout-header>
    <div class="inner-content">
      <router-view />
    </div>
  </div>
</template>

<script src="./EmailEffectiveMainPage.ts" lang="ts"></script>

<style  lang="scss" scoped>
.ant-page-header {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  padding: 16px 24px;
  background-color: #fff;
}

h1 {
  font-size: 25px;
  color: black;
}

.center {
  width: 95%;
  height: 80%;
  margin: 40px auto 0px;
  padding: 5px;
  background-color: #fff;
}
.inner-content {
  overflow: "initial";
  padding: 24px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 0px;
  height: 100%;
  width: 100%;
  position: absolute;
}

.inner-content {
  overflow: "initial";
  padding: 24px;
  background: #f0f0f0;
  margin: 16px 0px;
  height: 100%;
  width: 100%;
  position: absolute;
  margin: 0px;
}

.fbllogo {
  position: absolute;
  top: 24px;
  left: 57px;
}
.maillogo {
  position: absolute;
  top: 36px;
  left: 202px;
}
// 最上面的漸層線
.header {
  position: relative;
  height: 80px;
  background-color: white;
  padding-left: 36px;
  box-shadow: 0px 3px 6px #00000029; //目前無作用
  z-index: 1;
  &::before {
    position: absolute;
    left: 0;
    content: "";
    z-index: 1;
    width: 100%;
    height: 8px;
    background: transparent linear-gradient(270deg, #178f8a 0%, #127fbc 100%) 0%
      0% no-repeat padding-box;
  }
}
</style>
