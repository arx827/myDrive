<template>
  <div
    v-if="userInfo!==null"
    class="container"
  >
    <div
      class="white__wrap result__wrap text-center"
    >
      <h2 class="result__title">
        請至信箱重設密碼
      </h2>
      <!-- <h2 class="result__title result__title--error">
        很抱歉，查無此人
      </h2> -->
      <div
        class="result__content"
      >
        我們已將「重設密碼連結」寄至您的信箱 {{ userInfo.email }}，
        <br>
        請至信箱點選連結，以完成密碼設定，謝謝。
        <br>
        <a
          :disabled="isLoading"
          class="result__link"
          href="#"
          @click.prevent="send"
        >還沒收到信件？</a>
      </div>
    </div>
    <div class="result__img-wrap">
      <img
        class="result__img"
        src="@/assets/image_login_grass.svg"
        alt=""
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Component from 'vue-class-component';
import notification from '@/plugins/info/infoNotification';

Component.registerHooks([
	'beforeRouteEnter',
	'beforeRouteLeave',
	'beforeRouteUpdate',
]);

@Component({ components: {} })

export default class LoginFirst extends Vue {
  userInfo = null;

  isLoading = false;

  created() {
  	this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  }

  send() {
  	this.isLoading = true;
  	this.$userApi
  		.forgetUsingPOST(this.userInfo)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.data == 'OK' && resp.data.status === 200) {
  				// 重發信件
  				notification.success({
  					Content: '已成功發送信件',
  				});
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  		})
  		.finally(() => {
  			this.isLoading = false;
  		});
  }

  beforeRouteLeave(to, from, next) {
  	// 離開前清空使用者資訊
  	sessionStorage.clear();
  	next();
  }
}
</script>

<style lang="scss" scoped>
.result__wrap {
  position: relative;
  margin: 15vh auto 0 auto;
  width: 480px;
  max-width: 80%;
  padding: 40px 20px;
  border-radius: 10px;
}
.result__title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
  &.result__title--error {
    color: #ED7D7D;
  }
}
.result__content {
  font-size: 16px;
  line-height: 28px;
}
.result__img-wrap {
  position: relative;
  width: 55%;
  margin: -50px auto 0 auto;
  text-align: right;
  img {
    display: inline-block;
  }
}
.result__link {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 12px;
  display: inline-flex;
}
</style>
