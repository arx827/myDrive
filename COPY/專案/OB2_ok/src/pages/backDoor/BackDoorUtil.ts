import jwt from 'jsonwebtoken';

export default class BackDoorUtil {

    static BACK_DOOR_TOKEN: string = 'back_door_token';

    /**
     * 顯示token期限
     */
    static showTokenExp(): string {
        const jwtStr = localStorage.getItem(this.BACK_DOOR_TOKEN);
        if (jwtStr) {
            const decoded = jwt.decode(jwtStr);
            if (decoded) {
                const now = Date.now();
                let countDown = decoded.exp - Math.floor(now / 1000);
                if (countDown > 0){
                    return `token期限倒數 ${countDown} 秒`;
                } else {
                    return "目前token已到期，任何動作將導頁至驗證頁面！";
                }
            }
        }
        return "";
    }

    /**
     * 檢查token是否仍有效
     */
    static checkToken() {
        const jwtStr = localStorage.getItem(this.BACK_DOOR_TOKEN);
        if (jwtStr) {
            const decoded = jwt.decode(jwtStr);
            if (decoded) {
                const now = Date.now();
                return !(Math.floor(now / 1000) > decoded.exp);
            }
        }
        alert("token已失效，請重新進入，謝謝！");
        return false;
    }

    /**
     * 設置Back Door Token
     */
    static setBackDoorToken(backDoorToken: string) {
        localStorage.setItem(this.BACK_DOOR_TOKEN, backDoorToken);
    }

    /**
     * 取得Back Door Token
     */
    static getBackDoorToken() {
        return localStorage.getItem(this.BACK_DOOR_TOKEN);
    }

}