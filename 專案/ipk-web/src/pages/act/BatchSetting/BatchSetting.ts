import { Vue, Component } from 'vue-property-decorator';
import BatchSettingInfo from '@/pages/act/BatchSetting/BatchSettingInfo.vue';
import BatchLogInfo from '@/pages/act/BatchSetting/BatchLogInfo.vue';
import validateUtil from '@/plugins/util/validateUtil';

@Component({
  components: {
    BatchSettingInfo,
    BatchLogInfo,
  },
})
export default class BatchSetting extends Vue {
  /**
  * data
  */
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  // 此頁面的全部子頁籤 (for排序子頁籤用)
  currentPageTabList = [this.$childrenTab.childrenTab.BATCH_SETTING_TAB.val, this.$childrenTab.childrenTab.BATCH_LOG_TAB.val]

  /**
   * hook
   */
   created() {
    // 取得子頁籤權限
    this.authInfo = this.$authService.getAuthInfo(this.$route.name);
    // 判斷要選定哪個子頁籤
    this.activeKey = this.$authService.getDefaultActiveTabKey(this.currentPageTabList, Object.keys(this.authInfo));
  }

  /**
  * methods
  */
  // 判斷空值
	isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}
}
