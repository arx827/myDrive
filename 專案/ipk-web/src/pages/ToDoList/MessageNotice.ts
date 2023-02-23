import moment from 'moment';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import NoticeCard from '@/pages/NoticeSetting/NoticeCard.vue';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
  components: {
    IpkVxeTable,
    NoticeCard,
  },
})
export default class MessageNotice extends Vue {
  @Getter getNotice;

  @Action('setLoading') setLoading;

  @Action('setNotice') setNotice;

  /**
   * data
   */

  ipkGrid: IpkVxeTableModel = { // [查詢] 通知清單
    data: [],
    pagerConfig: { enabled: false },
    border: false,
    scrollY: { gt: 200, mode: 'wheel' },
    showOverflow: 'ellipsis',
    tableHeight: '566px',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    rowClassName: 'notice',
    rowConfig: {
      isCurrent: true,
    },
    columns: [
      {
        title: '訊息(僅保留最近兩周)',
        field: 'systemNoticeTitle',
        className: 'notice__title',
        slots: {
          default: ({ row }, h) => [
            h('i', {
              class: row.isRead ? 'fa fa-envelope-open-o me-1' : 'fa fa-envelope me-1',
            }),
            h('span', row.systemNoticeTitle),
          ],
        },
      },
      {
        title: '日期',
        field: 'createDate',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  };

  noticeData = {
    noticeSubject: '',
    noticeContent: '',
  } // 當前選擇的通知資料

  noticeWatcher = undefined // 監聽事件

  isInit = false // 畫面初始化狀態(是否created)

  /**
   * computed
   */
  // sass取得table高度
  get tableHeight() {
    return this.ipkGrid.tableHeight;
  }

  /**
   * hook
   */
  async created() {
    // 查詢資料
    this.setLoading(true);
    try {
      const result = await this.$noticeApi.searchPersonalSystemNoticeUsingGET();
      this.searchMyNoticeCallBack(result);
    } catch (error) {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    }
    this.isInit = true;
    this.setLoading(false);
  }

  activated() {
    if (this.isInit) {
      this.searchMyNotice();
    }
  }

  deactivated() {
    if (this.noticeWatcher) {
      this.noticeWatcher();
      this.noticeWatcher = null;
    }
  }

  /**
   * methods
   */
  // 取得我的訊息通知
  searchMyNotice() {
    this.$noticeApi.searchPersonalSystemNoticeUsingGET()
      .then((res) => {
        this.searchMyNoticeCallBack(res);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
  }

  // 取得我的訊息通知後的處理
  async searchMyNoticeCallBack(res) {
    const isSuccess = res.data.success;
    const message = res.data.message;
    const content = res.data.content;

    if (!isSuccess) {
      InfoModal.alertError({ confirm: false, content: message });
      return;
    }

    this.ipkGrid.data = [...content];
    const unread = content.filter((notice) => !notice.isRead).length;
    await this.setNotice({
      ...this.getNotice,
      noticeCount: unread,
      needUpdate: false,
    });
    // 註冊監聽事件
    if (!this.noticeWatcher) {
      this.noticeWatcher = this.$watch('getNotice', this.handleNoticeChange);
    }
  }

  // 點擊通知
  handleRowCurrentChange(e) {
    // 取得當前選取列資訊
    const targetData = e.row;
    // 顯示當前資訊列的內容
    this.noticeData = {
      noticeSubject: targetData.systemNoticeTitle,
      noticeContent: targetData.systemNoticeContent,
    };
    // 若已經是已讀則不需要更新狀態
    if (targetData.isRead) {
      return;
    }
    this.$noticeApi.modifyIsReadStatusUsingPOST(targetData.systemNoticeId)
      .catch(() => { InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message }); });
    // 更新畫面的已讀狀態(為即時反應點擊後的已讀效果，這段不在API的CallBack執行)
    this.ipkGrid.data[e.rowIndex] = {
      ...e.row,
      isRead: true,
    };
    this.ipkGrid.data = [...this.ipkGrid.data];
    this.setNotice({
      ...this.getNotice,
      messageNoticeCount: this.getNotice.messageNoticeCount - 1,
    });
  }

  // 重新取得待辦數量後的資料更新
  handleNoticeChange(val) {
    if (!val.needUpdate) {
      return;
    }
    this.searchMyNotice();
  }
}
