import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';

export default class TimeOut extends Vue {
  @Action('setTimeoutVisible') setTimeoutVisible;
  // isTimeOut: boolean = false;

  vm = this;

  lastTime = new Date().getTime();

  currentTime = new Date().getTime();

  timer;

  timeOutSecond;

  created() {
  	// TEST:
  	// console.log('init');
  }

  /** 逾時機制
   *  監聽:滑鼠移動，滑鼠點擊，按鍵按下
   *  逾時處理:登出系統跳出提示視窗，確定後會回到登入頁
  */
  public timeOut(minute = 1, destroyedEvent: any = null) {
    console.log('!! timeOut start')
  	this.lastTime = new Date().getTime();
  	this.currentTime = new Date().getTime();
  	this.timer;
  	this.timeOutSecond = minute * 60 * 1000; // 分
  	// 判斷登入才開始倒數計時
    const flag = this.$user.hasValidToken();
  	if (this.$user.hasValidToken() && localStorage.getItem('sign-out-time') !== 'timeUp') {
  		this.initTime();
  	}
  // else {
  // 	console.log('vm.$route.name', vm.$route.name);
  // 	timeUp();
  // }
  }

  timeUp() {
  	// this.isTimeOut = true;
  	this.cleanUpTime();
    this.setTimeoutVisible(true);
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
  	localStorage.setItem('sign-out-time', this.lastTime as any);
  	window.addEventListener('mousemove', this.updateTime);
  	window.addEventListener('keyup', this.updateTime);
  	window.addEventListener('mousedown', this.updateTime);
  	window.addEventListener('scroll', this.updateTime);

  	this.timer = window.setInterval(this.detectTime, 1000); // 間隔1秒檢測閒置時間
  }

  cleanUpTime() {
  	console.log('clear');
  	window.clearInterval(this.timer);
  	window.removeEventListener('mousedown', this.updateTime);
  	window.removeEventListener('keyup', this.updateTime);
  	window.removeEventListener('mousemove', this.updateTime);
  	window.removeEventListener('scroll', this.updateTime);
  	localStorage.setItem('sign-out-time', 'timeUp');
  }

  async signOut() {
  	if (this.$user.hasValidToken()) {
  		await this.$user.signOut();
  	}
  	this.$router.replace({ path: '/login' });
  }

  closeModal() {
  	// this.isVisible = false;
  }
}
