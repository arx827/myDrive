import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $otherMsgEnumData: GlobalOtherMessageEnum;
  }
}
interface alertMessage {
  title?: string;
  message?: string;
  contentVal: number;
}
export class GlobalOtherMessageEnum extends Vue {
  // TODO: 成功: contentVal = 1, 失敗: contentVal = 0

  /*
  *
  * 成功訊息
  *
  */

  public REVIEW_SUCCESS: alertMessage = { title: '審核成功', contentVal: 1 }; // 點選『放行』、『拒絕』

  /*
  *
  * 提示訊息 - double check、前端驗證訊息(未call API)
  *
  */
  public SUBMIT_DELETE_CONFIRM_INFO: alertMessage = { message: '資料尚未送審，是否確定刪除此筆維護中資料？', contentVal: 1 }; // 刪除確認訊息

  public SUBMIT_REQUIRED_VALIDATE_INFO: alertMessage = { message: '檢測到必填欄位尚未填寫，請填寫完成，再進行下一步，謝謝。', contentVal: 0 }; // 送審驗證必填欄位

  public SUBMIT_MAXLENGTH_VALIDATE_INFO: alertMessage = { title: '超過允許長度', message: '檢測到欄位內容超過允許長度，請確認並修改後再進行下一步，謝謝。', contentVal: 0 }; // 內容超過允許長度

  public REVIEW_ITEM_VALIDATE_INFO: alertMessage = { message: '請選擇要覆核的項目。', contentVal: 0 }; // [待放行清單]

  public REJECT_REASON_REQUIRED_VALIDATE_INFO: alertMessage = { message: '請輸入拒絕原因。', contentVal: 0 }; // [待放行清單] 拒絕原因

  public START_DATE_ISNOTEMPTY_SAVE_VALIDATE_INFO: alertMessage = { title: '儲存失敗', message: '因生效訖日不為空白，請按送審才會一分為二，\r\n即生效訖日=生效起日-1 及新增一筆新生效起日，\r\n謝謝。', contentVal: 0 }; // 儲存生效訖日驗證

  public REQUIRED_VALIDATE_INFO: alertMessage = { title: '儲存失敗', message: '{requiredName}尚未填寫，請填寫完成，再進行下一步，謝謝。', contentVal: 0 }; // 儲存必填欄位驗證

  public DOWNLOAD_VALIDATE_INFO: alertMessage = { title: '下載失敗', message: '檔案{fileNames}下載失敗。', contentVal: 0 }; // 儲存必填欄位驗證

  public ANNOUNCEMENT_ENABLE_CONFIRM_INFO: alertMessage = { message: '啟用公告後，若今天已超過公告發佈日，公告將顯示於首頁，是否確定啟用？', contentVal: 0 }; // 是否啟用服務

  public ANNOUNCEMENT_DISABLE_CONFIRM_INFO: alertMessage = { message: '停用公告後將不顯示於首頁，是否確定停用？', contentVal: 0 }; // 是否啟用服務

  public EDITING_INFO: alertMessage = { message: '尚有編輯中資料，請確認後再進行下一步，謝謝。', contentVal: 0 }; // 編輯中提示

  public COPY_ADD_WITH_CUSTOM_MESSAGE_CONFIRM_INFO: alertMessage = { message: '是否進行複製新增？\n{customMessage}', contentVal: 0 } // 複製新增確認訊息

  public DELETE_WITH_CUSTOM_MESSAGE_CONFIRM_INFO: alertMessage = { message: '是否進行刪除？\n{customMessage}', contentVal: 0 } // 刪除確認訊息

  // lt：less than 小於
  // le：less than or equal to 小於等於
  // eq：equal to 等於
  // ge：greater than or equal to 大於等於
  // gt：greater than 大於
  public END_DATE_GT_START_DATE_VALIDATE_INFO: alertMessage = { title: '選取日期有誤', message: '生效訖日必須大於生效起日。', contentVal: 0 };

  public END_DATE_LESS_GE_SYS_DATE_VALIDATE_INFO: alertMessage = { title: '選取日期有誤', message: '生效訖日必須大於或等於系統日。', contentVal: 0 };

  public START_DATE_GT_SYS_DATE_VALIDATE_INFO: alertMessage = { title: '選取日期有誤', message: '生效起日必須大於系統日。', contentVal: 0 };

  public START_DATE_GT_ORI_START_DATE_VALIDATE_INFO: alertMessage = { title: '選取日期有誤', message: '生效起日必須大於原始生效起日。', contentVal: 0 };

  /*
  *
  * 失敗訊息 - call API後的錯誤
  *
  */

  // ================================================================================================================================================

	public install(Vue) {
  	Vue.prototype.$otherMsgEnumData = this;
	}
}
export default new GlobalOtherMessageEnum();
