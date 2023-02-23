import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import MessageNotice from '@/pages/ToDoList/MessageNotice.vue';
import ToDoList from '@/pages/ToDoList/ToDoList.vue';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
  components: {
    MessageNotice,
    ToDoList,
  },
})
export default class MyNotice extends Vue {
  @Getter getMenuIdList;

  @Getter getNotice;

  @Action('setLoading') setLoading;

  @Action('setNotice') setNotice;

  /**
   * data
   */

  tabList = [ // 當前功能子頁籤清單(順序有意義)
    this.$childrenTab.childrenTab.NOTICE.val,
    this.$childrenTab.childrenTab.TO_DO_LIST.val,
  ];

  activeKey = null; // 被選取的頁籤

  noticeCount = 0; // 訊息通知數量

  todoCount = 0; // 待辦事項數量

  /**
   * computed
   */
  get activeDataInfoTab() {
    return this.activeKey === this.$childrenTab.childrenTab.NOTICE.val;
  }

  get activeTodoInfoTab() {
    return this.activeKey === this.$childrenTab.childrenTab.TO_DO_LIST.val;
  }

  /**
   * watch
   */

  @Watch('getNotice', { immediate: true, deep: true })
  onNoticeChange(val) {
    this.noticeCount = val.messageNoticeCount;
    this.todoCount = val.todoCount;
  }

  /**
   * hook
   */
  created() {
    // 選定初始顯示的子頁籤
    this.activeKey = this.tabList[0];
    this.searchNoticeCount();
  }

  /**
   * methods
   */
  // 取得訊息通知總筆數
  searchNoticeCount() {
    this.setLoading(true);
    const dto = {
      functionCode: this.getMenuIdList,
    };
    this.$noticeApi.searchNoticeAndTodoCountUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.setNotice({
          ...this.getNotice,
          messageNoticeCount: content.messageNoticeCount,
          todoCount: content.todoCount,
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }
}
