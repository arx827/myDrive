// import { Vue } from "vue-property-decorator";
import { message } from "ant-design-vue"; 
import ValidationUtil from "./ValidationUtil";

const MESSAGE_SUCCESS_TITLE = "成功";
const MESSAGE_INFO_TITLE = "資訊";
const MESSAGE_WARNING_TITLE = "警告";
const MESSAGE_ERROR_TITLE = "失敗";
const ICON_STYLE = "font-size: 24px; padding: 12px;";
const MESSAGE_STYLE = "text-align: left; width: 320px;";
const MESSAGE_STYLE_EVENT = "text-align: left; width: 150px;";

export default class MessageUtil {

    /**
     * 成功訊息
     * @param messageDescription 訊息
     * @param showCloseBtn 是否顯示關閉鈕
     * @param sec 提示窗顯示秒數
     * @returns 
     */
    static messageSuccess(messageDescription: String, showCloseBtn?: boolean, sec?: number): void {
        let key = (showCloseBtn)? "success":"";
        message.success(this.messageContext(MESSAGE_SUCCESS_TITLE, messageDescription, "check-circle", "green", key, sec));
        // this.prototype.$message.success(this.prototype.messageContext(MESSAGE_SUCCESS_TITLE, messageDescription));
    }

    /**
     * 資訊訊息
     * @param messageDescription 
     * @param title="資訊"
     * @returns 
     */
    static messageInfo(messageDescription: String, title = MESSAGE_INFO_TITLE): void {
        message.info(this.messageContext(title, messageDescription, "info-circle", "#1890FF"));
    }

    /**
     * 警告訊息
     * @param messageDescription 
     * @returns 
     */
    static messageWarning(messageDescription: String): void {
        message.warning(this.messageContext(MESSAGE_WARNING_TITLE, messageDescription, "warning", "orange"));
    }

    /**
     * 警告訊息(支持換行)
     * @param messageDescription 
     * @returns 
     */
     static messageWarningWithNewLine(messageDescription: String): void {
        message.warning(this.messageContextWithNewLine(MESSAGE_WARNING_TITLE, messageDescription, "warning", "orange"));
    }

    /**
     * 錯誤訊息
     * @param messageDescription 
     * @returns 
     */
    static messageError(messageDescription: String): void {
        message.error(this.messageContext(MESSAGE_ERROR_TITLE, messageDescription, "close-circle", "red"));
    }

    static messageInfoEvent(messageDescription: String, title = MESSAGE_INFO_TITLE): void {
        message.info(this.messageContextEvent(title, messageDescription, "info-circle", "#1890FF"));
    }

    /**
     * 通用方法內容，可以調整全域提示樣式細節
     * @param messageStatus 
     * @param messageDescription 
     * @returns config object
     */
    static messageContext(messageStatus: String, messageDescription: String, iconType: String, iconColor: String, key?: string, sec?: number) {
        // var iconType = "close-circle";
        // var iconColor = "red";
        // switch (messageStatus) {
        //     case MESSAGE_SUCCESS_TITLE:
        //         iconType = "check-circle";
        //         iconColor = "green";
        //         break;
        //     case MESSAGE_INFO_TITLE:
        //         iconType = "info-circle";
        //         iconColor = "blue";
        //         break;
        //     case MESSAGE_WARNING_TITLE:
        //         iconType = "warning";
        //         iconColor = "orange";
        //         break;
        //     case MESSAGE_ERROR_TITLE:
        //         iconType = "close-circle";
        //         iconColor = "red";
        //         break;
        // }

        /** 關閉提示窗 */
        let remove = (key:string, msg:String) => {
            switch (key){
                case "success":
                    this.messageSuccess(msg, true, 0.01);
                    break;
            }
        };

        /** 關閉按鈕(顯示/隱藏) */
        let showCloseBtn = (key && key != "")? "block":"none";

        return {
            content: (h) => {
                return h("div", { attrs: { style: "display: flex;" } }, [
                    h("a-icon", {
                        attrs: {
                            type: iconType,
                            style: ICON_STYLE + `color: ${iconColor};`,
                        },
                    }),
                    h("div", {
                        attrs: { style: MESSAGE_STYLE }
                    }, 
                        [h("h4", [messageStatus]), h("span", [messageDescription])]
                    ),
                    h("div",{
                        attrs:{ style: `cursor:pointer; display:${showCloseBtn};`},
                        on: { click: () => remove(key, messageDescription) }
                    },
                        [h("h4", ["Ｘ"])]
                    )
                ]);
            },
            icon: (h) => null,
            duration: sec? sec: 2,
            key: key
        }
    }

    /**
     * 通用方法內容，可以調整全域提示樣式細節(支持換行)
     * @param messageStatus 
     * @param messageDescription 
     * @returns config object
     */
     static messageContextWithNewLine(messageStatus: String, messageDescription: String, iconType: String, iconColor: String, key?: string, sec?: number) {

        /** 關閉提示窗 */
        let remove = (key: string, msg: String) => {
            switch (key) {
                case "success":
                    this.messageSuccess(msg, true, 0.01);
                    break;
            }
        };

        /** 關閉按鈕(顯示/隱藏) */
        let showCloseBtn = (key && key != "") ? "block" : "none";

        return {
            content: (h) => {
                let contentArray = [h("h4", [messageStatus])]
                messageDescription.split("\n").forEach(word => {
                    contentArray.push(h("div", [word]));
                });

                return h("div", { attrs: { style: "display: flex;" } }, [
                    h("a-icon", {
                        attrs: {
                            type: iconType,
                            style: ICON_STYLE + `color: ${iconColor};`,
                        },
                    }),
                    h("div", {
                        attrs: { style: MESSAGE_STYLE }
                    },
                        contentArray
                    ),
                    h("div", {
                        attrs: { style: `cursor:pointer; display:${showCloseBtn};` },
                        on: { click: () => remove(key, messageDescription) }
                    },
                        [h("h4", ["Ｘ"])]
                    )
                ]);
            },
            icon: (h) => null,
            duration: sec ? sec : 2,
            key: key
        }
    }

    /**
     * 通用方法內容，可以調整全域提示樣式細節 (事件設定用 寬度150px)
     * @param messageStatus 
     * @param messageDescription 
     * @returns config object
     */
    static messageContextEvent(messageStatus: String, messageDescription: String, iconType: String, iconColor: String) {
        return {
            content: (h) => {
                return h("div", { attrs: { style: "display: flex;" } }, [
                    h("a-icon", {
                        attrs: {
                            type: iconType,
                            style: ICON_STYLE + `color: ${iconColor};`,
                        },
                    }),
                    h("div", {
                        attrs: { style: MESSAGE_STYLE_EVENT }
                    },
                        [h("h4", [messageStatus]), h("span", [messageDescription])]
                    ),
                ]);
            },
            icon: (h) => null,
        }
    }

    /**
     * @description 依滑鼠移入位置變更message顯示位置
     * @author B1683
     * @version 2022/07/13
     * 
     * @param message 提示訊息內容
     * @param x 滑鼠x座標
     * @param y 滑鼠y座標
     * @param fixedWidth 最大寬度(整數)
     */
     static changePosition(message, x, y, fixedWidth?) {
        let width = ValidationUtil.isEmpty(fixedWidth)? "fit-content":  fixedWidth + "px";
        for (var i = 0, len = message.length; i < len; i++) {
            message[i].style["width"] = width;
            message[i].style["position"] = "absolute";
            message[i].style["right"] = "initial";
            message[i].style["top"] = y + 10 + window.scrollY + "px";
            message[i].style["left"] = x + "px";
        }
    }
}