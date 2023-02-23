import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
      $noticeService: NoticeService;
  }
}

export class NoticeService extends Vue {
  // 預覽替換樣板為預覽範例字串
  public replaceSymbol(detail, replaceTargetFieldName) {
    let noticeSubject = detail.noticeSubject;
    let noticeContent = detail.noticeContent;
     detail.selectedNoticeSymbolList.forEach((noticeSymbol) => {
      noticeSubject = noticeSubject.replaceAll(noticeSymbol.noticeSymbolTemplate, noticeSymbol[replaceTargetFieldName]);
      noticeContent = noticeContent.replaceAll(noticeSymbol.noticeSymbolTemplate, noticeSymbol[replaceTargetFieldName]);
    });
    return {
      ...detail,
      noticeSubject,
      noticeContent,
    };
  }

	public install(Vue) {
  	Vue.prototype.$noticeService = this;
	}
}

export default new NoticeService();
