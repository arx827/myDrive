import Vue from 'vue';
import { Modal } from 'ant-design-vue';
import router from '@/router';

const timeout = {
	/** 逾時機制
   *  監聽:滑鼠移動，滑鼠點擊，按鍵按下
   *  逾時處理:跳出提示視窗，確定後會登出並回到登入頁
  */
	timeOut: (second = 30, destroyedEvent: any = null) => {
		let lastTime = new Date().getTime();
		let currentTime = new Date().getTime();
		let timer;
		const timeOutSecond = second * 60 * 1000; // 分
		// let isModalShow = false;
		localStorage.setItem('sign-out-time', lastTime as any); // 將時間寫入localStorage

		function timeUp() {
			window.clearInterval(timer);
			// localStorage.setItem('sign-out-time', 'timeUp');
			// window.removeEventListener('beforeunload', destroyedEvent, {
			// 	capture: true,
			// });
			localStorage.removeItem('sign-out-time');
			window.removeEventListener('mousedown', updateTime);
			window.removeEventListener('keyup', updateTime);
			window.removeEventListener('mousemove', updateTime);
			window.removeEventListener('scroll', updateTime);
			Modal.error({
				title: `閒置超過${second}分，請關閉重新登入`,
				okText: '確定',
				onOk: () => {
					signOut();
				},
			});
			// isModalShow = true;
		}

		function closeModal() {
			Modal.destroyAll();
			// isModalShow = false;
		}

		function detectTime() {
			currentTime = new Date().getTime(); // 更新當前時間
			const localStorageLastTime = localStorage.getItem('sign-out-time') as any;
			// if (localStorageLastTime === 'timeUp' && !isModalShow) {
			if (currentTime - localStorageLastTime > timeOutSecond) { // 判斷是否超時
				timeUp();
			}
		}

		function updateTime() {
			// if (localStorage.getItem('sign-out-time') == 'timeUp' && !isModalShow) {
			if (localStorage.getItem('sign-out-time') == 'timeUp') {
				timeUp();
			} else {
				lastTime = new Date().getTime(); // 更新操作時間
				localStorage.setItem('sign-out-time', lastTime as any);
			}
		}

		async function signOut() {
			if (router.currentRoute.name !== 'login') {
				router.push({ path: '/login' });
			}
		}

		window.addEventListener('mousemove', updateTime);
		window.addEventListener('keyup', updateTime);
		window.addEventListener('mousedown', updateTime);
		window.addEventListener('scroll', updateTime);

		timer = window.setInterval(detectTime, 1000); // 間隔1秒檢測閒置時間
	},
};

export default timeout;
