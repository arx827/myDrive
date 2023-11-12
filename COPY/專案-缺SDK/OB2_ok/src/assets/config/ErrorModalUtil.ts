import { Modal } from "ant-design-vue";
import VlidationUtil from "./ValidationUtil";
const MODAL_ERROR_TITLE = "錯誤";
const MODAL_CLASS_NAME = "error-modal-util-class"

export default class ErrorModalUtil {
    /**
     * 錯誤訊息(字串)
     * @param messageDescription 
     * @returns 
     */
    static modalError(messageDescription: String): void {
        Modal.error(this.messageContext(messageDescription));

    }

    /**
     * 錯誤訊息(清單)
     * @param messageDescriptionList
     * @param width 客製modal的寬度
     * @returns 
     */
    static modalListError(messageDescriptionList: String[], width: number): void {
        Modal.error(this.messageListContext(messageDescriptionList, width));
    }

    static modalSetColorError(color: String, colorText: String, normalText: String, title:string): void{
        Modal.error(this.customColorContext(color,colorText,normalText,title));
    }

    /**
     * 通用方法內容(字串)，可以調整全域提示樣式細節
     * @param messageDescription 
     * @returns config object
     */
    private static messageContext(messageDescription: String) {
        return {
            class: MODAL_CLASS_NAME,
            title: () => MODAL_ERROR_TITLE,
            content: () => messageDescription,
        }
    }

    /**
     * 通用方法內容(字串清單)，可以調整全域提示樣式細節
     * @param messageDescriptionList 
     * @param width 客製modal的寬度
     * @returns config object
     */
    private static messageListContext(messageDescriptionList: String[], width: number) {
        if (null == width) {
            width = 416;
        }
        return {
            class: MODAL_CLASS_NAME,
            title: () => MODAL_ERROR_TITLE,
            content: (h) => {
                let msgListWithPObject = [];
                messageDescriptionList.forEach(m => {
                    msgListWithPObject.push(h('p', m));
                });
                return h('div', {}, msgListWithPObject);
            },
            width: width,
        }
    }

    private static customColorContext(color: String, colorText: String, normalText, title:string) {
        let T = VlidationUtil.isEmpty(title)? MODAL_ERROR_TITLE : title;
        return {
            class: MODAL_CLASS_NAME,
            title: () => T,
            content: (h) => {
                let msgListWithPObject = [];
                msgListWithPObject.push(h('span',{ attrs: {
                        style: `color: ${color};`,
                    }, }, colorText));
                msgListWithPObject.push(h('span', normalText));
                return h('div', {}, msgListWithPObject);
            },
        }
    }
}
