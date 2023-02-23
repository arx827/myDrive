import {
  Vue, Component, Prop,
} from 'vue-property-decorator';

interface NoticeData {
  noticeSubject: string; // 標題
  noticeContent: string; // 內容
}

@Component({})
export default class NoticeCard extends Vue {
  /**
   * props
   */
  @Prop()
  noticeData: NoticeData // 通知資料
}
