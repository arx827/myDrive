<template>
  <div class="checkResultWrap">
    <div v-if="is_fail">
      <img
        class="redError"
        src="~@/assets/imgs/image_error.svg"
        alt="圖片載入失敗"
      >
      <p>E-mail驗證失敗，請與您的保單服務人員聯繫!</p>
      <center>
        <a-button class="ensure_button_failed" @click="submit()">
          確認
        </a-button>
      </center>
    </div>
    <div v-if="is_invalid">
      <img
        class="redError"
        src="~@/assets/imgs/image_stop.svg"
        alt="圖片載入失敗"
      >
      <p class="invalid_p">
        URL已失效，請與您的保單人員聯繫，謝謝!
      </p>
      <center>
        <a-button v-if="btnVisible" class="ensure_button_invalid" @click="submit_invalid()">
          確認
        </a-button>
      </center>
    </div>
    <div v-if="is_success">
      <img
        class="redError"
        src="~@/assets/imgs/image_greensuccess.svg"
        alt="圖片載入失敗"
      >
      <p class="success_p">
        Email已驗證完成，謝謝!
      </p>
      <center>
        <a-button class="ensure_button_valid" @click="submit()">
          確認
        </a-button>
      </center>
    </div>
  </div>
</template>

<script src="./EmailCheckResultPage.ts" lang="ts"></script>

<style lang="scss" scoped>
.checkResultWrap {
  width: 95%;
  margin: 40px auto 0px;
  padding: 5px;
}
.redError {
  margin: 30px auto;
  display: flex;
}
.success_p {
  color: #71ae19;
}
.invalid_p {
  color:#F69323
}

.ensure_button_failed {
  width: 200px;
  color: #f5222d;
  font: normal normal normal 16px/22px PingFang TC;
  letter-spacing: 0px;
  word-spacing: -3px;
  position: relative;
  top:10px;
  &:hover {
    border-color: #f5222d;
  }
}

.ensure_button_valid {
  width: 200px;
  color: #71ae19;
  font: normal normal normal 16px/22px PingFang TC;
  letter-spacing: 0px;
  word-spacing: -3px;
  position: relative;
  top:10px;
  &:hover {
    border-color: #71ae19;
  }
}

.ensure_button_invalid {
  width: 200px;
  color: #F69323;
  font: normal normal normal 16px/22px PingFang TC;
  letter-spacing: 0px;
  word-spacing: -3px;
  position: relative;
  top:10px;
  &:hover {
    border-color: #F69323;
  }
}

p {
  color: #e2454a;
  font: normal normal 600 22px/30px PingFang TC;
  letter-spacing: 0px;
  text-align: center;
}
</style>>
