<template>
  <a-modal
    :visible="isVisible"
    :closable="false"
    :footer="null"
    :width="995"
    wrap-class-name="modal__signout"
    centered="centered"
  >
    <div class="d-flex timeout">
      <div class="row w-100">
        <div class="col">
          <div class="title">
            系統已登出
          </div>
          <div class="content">
            系統閒置超過30分鐘或帳號已登出，
            <br>請重新登入。
          </div>
          <!-- <div
            v-else
            class="content"
          >
            系統已被登出，請重新登入。
          </div> -->
          <button
            class="btn--backhome"
            @click="closeModal"
          >
            關閉
          </button>
        </div>
        <div class="col">
          <img
            class="img"
            src="@/assets/images/icon_time_out.svg"
            alt=""
          >
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';

@Component({
	components: { IconTextButton, InfoModal },
})
export default class ConfirmForm extends Vue {
  isVisible=false;

  // isTimeOut: boolean = false;

  vm = this;

  lastTime = new Date().getTime();

  currentTime = new Date().getTime();

  timer;

  timeOutSecond;

  created() {
  	// console.log('init');
  }

  /** 逾時機制
   *  監聽:滑鼠移動，滑鼠點擊，按鍵按下
   *  逾時處理:登出系統跳出提示視窗，確定後會回到登入頁
  */
  timeOut(minute = 30, destroyedEvent: any = null) {
  	this.lastTime = new Date().getTime();
  	this.currentTime = new Date().getTime();
  	this.timeOutSecond = minute * 60 * 1000; // 分
  	// 判斷登入才開始倒數計時
  	if (this.$user.hasValidToken() && localStorage.getItem('sign-out-time') !== 'timeUp') {
  		this.initTime();
  	}
  }

  timeUp() {
  	// this.isTimeOut = true;
  	this.cleanUpTime();
  	this.signOut();
  }

  detectTime() {
  	this.currentTime = new Date().getTime(); // 更新當前時間
  	const localStorageLastTime = localStorage.getItem('sign-out-time') as any;
  	// console.log('經過時間', `${(this.currentTime - localStorageLastTime) / 60 / 1000}分`);

  	if (localStorageLastTime === 'timeUp' || this.currentTime - localStorageLastTime > this.timeOutSecond) { // 判斷是否超時
  		this.timeUp();
  	}
  	// if (!this.$user.hasValidToken()) {
  	// 	vm.isTimeOut = false;
  	// } else if (localStorageLastTime === 'timeUp' || this.currentTime - localStorageLastTime > this.timeOutSecond) { // 判斷是否超時
  	// 	this.timeUp();
  	// }
  }

  updateTime() {
  	// console.log('updateTime');

  	if (localStorage.getItem('sign-out-time') === 'timeUp') {
  		this.timeUp();
  	} else {
  		this.lastTime = new Date().getTime(); // 更新操作時間
  		localStorage.setItem('sign-out-time', this.lastTime as any);
  	}
  }

  initTime() {
  	if (this.timer) window.clearInterval(this.timer);
  	localStorage.setItem('sign-out-time', this.lastTime as any);
  	window.addEventListener('mousemove', this.updateTime);
  	window.addEventListener('keyup', this.updateTime);
  	window.addEventListener('mousedown', this.updateTime);
  	window.addEventListener('scroll', this.updateTime);

  	this.timer = window.setInterval(this.detectTime, 1000); // 間隔1秒檢測閒置時間
  }

  cleanUpTime() {
  	console.log('clear');
  	console.log('timer', this.timer);
  	window.clearInterval(this.timer);
  	window.removeEventListener('mousedown', this.updateTime);
  	window.removeEventListener('keyup', this.updateTime);
  	window.removeEventListener('mousemove', this.updateTime);
  	window.removeEventListener('scroll', this.updateTime);
  	localStorage.setItem('sign-out-time', 'timeUp');
  	console.log('clear timer', this.timer);
  }

  async signOut() {
  	if (this.$user.hasValidToken()) {
  		await this.$user.signOut();
  	}
  	if (this.$route.name !== 'Login') {
  		this.$router.replace({ path: '/login' });
  	}
  	this.isVisible = true;
  }

  closeModal() {
  	this.isVisible = false;
  }
}
</script>

<style lang="scss" scoped>
.timeout{
  padding: 90px 90px 90px 126px;
}

.modal__signout{
  .title{
    font-size: 56px;
    color: #000;
    // margin-bottom: 30px;
    font-weight: bold;
    margin-top: 30px;
  }
  .content{
    font-size: 20px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 24px;
  }
  img{
    width: 100%;
  }
}
</style>
