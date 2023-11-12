<template>
  <div class="emailCheck__page">
    <Steps :current="current" />
    <div class="emailCheckWrap">
      <h1 class="pageTitle">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script  src='./ValidationSuccessfulPage.ts' lang="ts"></script>

<style scoped>
p {
  color: black;
}
.emailCheck__page {
  border-radius: 5px;
  width: 95%;
  height: 75%;
  margin: 40px auto 0px;
  padding: 5px;
  background-color: #fff;
}

.emailCheckWrap {
  max-width: 400px;
  margin: 40px auto;
}
.pageTitle {
  color: #1489d1;
  font-size: 22px;
  padding-bottom: 8px;
  text-align: center;
  line-height: 250px;
}
</style>
