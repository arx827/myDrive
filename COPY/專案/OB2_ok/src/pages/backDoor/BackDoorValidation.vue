<template>
  <div class="main" align="center">
    <!-- <div v-if="!isValidUser" class="token-submit"> -->
    <a-spin :spinning="loading">
      <h1 class="promt">{{ validUserPrompt }}</h1>
    </a-spin>
    <!-- </div> -->
    <!-- <div v-else>
      <h1 class="promt">
        IP驗證成功，會取到token，再按下「送出」，即可進入監控畫面。
      </h1>
      <a-input class="token-input" v-model="backDoorToken" />
      <a-button type="primary" @click="setBackDoorTokenAndForward"
        >送出</a-button
      >
    </div> -->
  </div>
</template>

<script src="./BackDoorValidation.ts" lang="ts"></script>

<style scoped>
.main {
  margin-top: 100px;
}

.token-submit {
  width: 1100px;
}

.token-input {
  width: 1000px;
}

h1.promt {
  color: red;
}
</style>