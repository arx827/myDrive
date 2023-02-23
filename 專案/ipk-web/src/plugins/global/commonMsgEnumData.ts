import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $commonMessageEnum: GlobalCommonMessageEnum;
  }
}
interface alertMessage {
  title?: string;
  message?: string;
  contentVal: number;
}
export class GlobalCommonMessageEnum extends Vue {
  // TODO: 成功: contentVal = 1, 失敗: contentVal = 0

  /*
  *
  * 成功訊息
  *
  */
  public VALIDATE_SUCCESS: alertMessage = { message: '通過檢核', contentVal: 1 }; // 檢核

  /*
  *
  * 提示訊息 - double check、前端驗證訊息(未call API)
  *
  */
  public CLOSE_MODAL_CONFIRM_INFO: alertMessage = { message: '是否確定關閉表單？', contentVal: 1 }; // 關閉彈窗確認訊息

  public SUBMIT_CONFIRM_INFO: alertMessage = { message: '是否確定送出？', contentVal: 1 }; // 送出確認訊息

  public DELETE_CONFIRM_INFO: alertMessage = { message: '是否確定刪除？', contentVal: 1 }; // 刪除確認訊息

  public REVIEW_CONFIRM_INFO: alertMessage = { message: '是否確定放行？', contentVal: 1 }; // 覆核放行確認訊息

  public REJECT_CONFIRM_INFO: alertMessage = { message: '是否確定拒絕？', contentVal: 1 }; // 覆核拒絕確認訊息

  public SUBMIT_TO_PENDING_CONFIRM_INFO: alertMessage = { message: '資料將送往待放行清單等待主管放行，是否送出？', contentVal: 1 }; // [資料維護] 資料明細新增修改送至待放行清單確認訊息

  public PENDING_VALIDATE_INFO: alertMessage = { message: '勾選了含已放行資料，請確認。', contentVal: 0 }; // [資料維護] 待放行清單覆核驗證訊息

  public REQUIRED_VALIDATE_INFO: alertMessage = { message: '必填欄位尚未填寫。', contentVal: 0 }; // 表單必填欄位驗證

  public SEND_TO_ALL_INFO: alertMessage = { message: '是否確定發送全體通知？', contentVal: 0 }; // 發送全體通知確認訊息

  public UPLOAD_VALIDATE_INFO: alertMessage = { message: '請先上傳檔案後再進行下一步，謝謝！', contentVal: 0 } // 上傳檢核

  public UPLOAD_MAXIMA_ALLOW_COUNT_INFO: alertMessage = { message: '最多僅可上傳{number}筆檔案', contentVal: 0 } // 最多可上傳數量檢核

  /*
  *
  * 失敗訊息 - call API後的錯誤
  *
  */
  public SYSTEM_ERROR: alertMessage = { message: '系統發生錯誤，請洽窗口。', contentVal: 0 }; // API發生錯誤

  // ================================================================================================================================================

	public install(Vue) {
  	Vue.prototype.$commonMessageEnum = this;
	}
}
export default new GlobalCommonMessageEnum();
