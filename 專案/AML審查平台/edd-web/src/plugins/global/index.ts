import Vue from 'vue'
import { UserService } from '@/plugins/user'
import { Modal } from "ant-design-vue";

const global = {
  /** 逾時機制
   *  監聽:滑鼠移動，滑鼠點擊，按鍵按下
   *  逾時處理:跳出提示視窗，確定後會登出並導向人壽EIP首頁
  */
  timeOut: (second:number = 30, destroyedEvent:any = null) => {
    let lastTime = new Date().getTime();
    let currentTime = new Date().getTime();
    let timeOutSecond = second * 60 * 1000; //分
    
    window.addEventListener('mousemove', (ev) => {
      lastTime = new Date().getTime(); //更新操作時間
    });
    window.addEventListener('keyup', (ev) => {
      lastTime = new Date().getTime(); //更新操作時間
    });
    window.addEventListener('mousedown', (ev) => {
      lastTime = new Date().getTime(); //更新操作時間
    });
    window.addEventListener('scroll', (ev) => {
      lastTime = new Date().getTime(); //更新操作時間
    }, true);

    function detectTime() {
      currentTime = new Date().getTime(); //更新當前時間
      if(currentTime - lastTime > timeOutSecond){ //判斷是否超時
        window.clearInterval(timer);
        window.removeEventListener("beforeunload", destroyedEvent, {
          capture: true,
        });
        Modal.error({
          title: `閒置超過${timeOutSecond / 60 / 1000}分，請重新登入`,
          okText: "確定",
          onOk: () => {
            signOut();
          },
        });
      }
    }

    async function signOut() {
      const userApi = Vue.prototype.$user;
      await userApi.signOut();
      if(window.opener != null){
        window.opener.location.href = process.env.VUE_APP_LOGIN_URL;
        window.close();
      }else{
        window.location.href = process.env.VUE_APP_LOGIN_URL;
      }
    }
    
    let timer = window.setInterval(detectTime, 1000); //間隔1秒檢測閒置時間
  },
  // 補零
  padLeftZero: (str, len) => {
    function padLeft($str) {
      $str = '' + $str;
      if($str.length >= len) {
        return $str;
      }else{
        return padLeft("0" + $str);
      }
    }
    return padLeft(str);
  }
}

export default global 