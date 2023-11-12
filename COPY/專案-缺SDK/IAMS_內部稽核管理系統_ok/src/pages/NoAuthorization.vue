<template>
  <div class="container">
    <div class="result__row row">
      <div class="col-12 col-md">
        <img
          class="result__img"
          src="@/assets/images/icon_no_login.svg"
          alt=""
        >
      </div>
      <div class="result__content col-12 col-md">
        <p class="result__title">
          Sorry 無權限訪問
        </p>
        <p class="result__text">
          您的帳號無權限登入使用
        </p>
        <button
          class="btn--backhome"
          @click="goLogin"
        >
          回登入頁
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({ })
export default class NoAuthorization extends Vue {
	goLogin() {
		this.$router.push({ name: 'Login' });
	}
}
</script>

<style lang="scss" scoped>
  .result__row{
    padding-top: 10vh;
    @include rwd-md{
      padding-top: 20vh;
    }
  }
  .result__img{
    float: right;
    width: 460px;
  }
  .result__content{
    padding-left: 82px;
    padding-top: 7vh;
    p{
      margin:0 ;
    }
    .result__title{
      font-size: 56px;
      font-weight: bold;
    }
    .result__text{
      font-size: 20px;
      color: #00000073;
      margin-bottom: 30px;
    }
  }
</style>
