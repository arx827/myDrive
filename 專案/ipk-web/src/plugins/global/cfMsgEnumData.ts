import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $cfMessageEnum: GlobalCFMessageEnum;
  }
}
interface alertMessage {
  title?: string;
  message?: string;
  contentVal: number;
}
export class GlobalCFMessageEnum extends Vue {
  // TODO: 成功: contentVal = 1, 失敗: contentVal = 0

  /*
  *
  * 成功訊息
  *
  */
  public LOCK_SUCCESS: alertMessage = { title: '鎖定成功', contentVal: 1 }; // 點選『鎖定』

  public COMPARED_SUCCESS: alertMessage = { title: '資料比對成功', contentVal: 1 }; // 點選『資料比對』

  public SUBMIT_CONFIRM_SUCCESS: alertMessage = { title: '交易確認成功', contentVal: 1 }; // 點選『交易確認』

  public RETURN_EDIT_SUCCESS: alertMessage = { title: '退回修改成功', contentVal: 1 }; // 點選『退回修改』

  public RETURN_UNLOCKED_SUCCESS: alertMessage = { title: '退回解鎖成功', contentVal: 1 }; // 點選『退回解鎖』

  public REVIEW_SUCCESS: alertMessage = { title: '審核成功', contentVal: 1 }; // 點選『放行』、『拒絕』

  /*
  *
  * 提示訊息 - double check、前端驗證訊息(未call API)
  *
  */

  public COMPARED_VALIDATE_INFO: alertMessage = { message: '調整欄位與上傳附件皆須儲存才會生效，請記得儲存！', contentVal: 0 }; // 點選『資料比對』,單筆檢核訊息

  public TX_CONFRIM_VALIDATE_INFO: alertMessage = { message: '請至少選擇一筆交易，謝謝。', contentVal: 0 }; // 交易確認驗證訊息

  public FILE_TX_CODE_REQUIRED_VALIDATE_INFO: alertMessage = { message: '請勾選整批新增交易編號。', contentVal: 0 }; // [附件管理] 未勾選交易編號，僅上傳檔案就送出

  public FILE_ATTACHMENT_REQUIRED_VALIDATE_INFO: alertMessage = { message: '整批新增未上傳檔案，請確認。', contentVal: 0 }; // [附件管理] 有勾選交易編號，未上傳檔案就送出

  public FILE_EXTENSION_VALIDATE_INFO: alertMessage = { message: '副檔名必須為{fileExtension}，請確認。', contentVal: 0 }; // [附件管理] 副檔名驗證

  public MANAGE_FILE_SAVE_CONFIRM_INFO: alertMessage = { message: '檔案將進行上傳/刪除，是否確定儲存？', contentVal: 0 }; // [附件管理] 副檔名驗證

  public SAVE_REQUIRED_VALIDATE_INFO: alertMessage = { message: '檢測到必填欄位尚未填寫，請填寫完成，再進行下一步，謝謝。', contentVal: 0 }; // 單筆確認驗證儲存必填欄位

  public REJECT_REASON_REQUIRED_VALIDATE_INFO: alertMessage = { message: '請輸入退回原因。', contentVal: 0 }; // [初核、覆核放行] 拒絕原因

  public RETURN_CONFIRM_INFO: alertMessage = { message: '是否確定退回？', contentVal: 1 }; // 覆核退回確認訊息
  /*
  *
  * 失敗訊息 - call API後的錯誤
  *
  */

  // =========================================================  畫面訊息  ===========================================================================

  // 退回原因 Modal 設定
  public rejectReasonModalSettings = {
  title: '請輸入退回放行原因', content: '若確認退回放行，請輸入退回放行原因，謝謝。', placeholder: '請簡述退回放行原因。',
}

  // ================================================================================================================================================

	public install(Vue) {
  	Vue.prototype.$cfMessageEnum = this;
	}
}
export default new GlobalCFMessageEnum();
