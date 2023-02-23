import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import InfoModal from '@/plugins/notification/infoModal';
import { MenuNode } from '@fubonlife/ipk-api-axios-sdk';
import validateUtil from '@/plugins/util/validateUtil';

@Component({
  components: {
    IpkVxeTable,
  },
})
export default class ToDoList extends Vue {
  @Getter getNotice;

  @Getter getMenuItem;

  @Getter getMenuIdList;

  @Action('setLoading') setLoading;

  @Action('setTabArray') setTabArray;

  @Action('setActiveSubTab') setActiveSubTab;

  @Action('setNotice') setNotice;

  /**
   * data
   */

  ipkGrid: IpkVxeTableModel = { // 待辦事項列表格式設定
    data: [],
    pagerConfig: {
      enabled: false,
    },
    border: false,
    scrollY: { gt: 200, mode: 'wheel' },
    showOverflow: 'ellipsis',
    autoResize: true,
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    rowConfig: {
      isHover: true,
    },
    columns: [
      {
        title: '功能名稱',
        field: 'functionName',
        width: '50%',
      },
      {
        title: '未完成',
        field: 'unFinished',
        width: '25%',
        align: 'center',
        slots: {
          default: ({ row }, h) => (row.unFinished > 0 ? [
            h('a', {
              class: 'link__style',
              on: {
                click: () => { this.goToFunctionPage(row.renderItem, this.$childrenTab.childrenTab.DATA_INFO_TAB.val); },
              },
            }, `${row.unFinished}筆`),
          ] : [
            h('span', `${row.unFinished}筆`),
          ]),
        },
      },
      {
        title: '可覆核',
        field: 'canApprove',
        width: '25%',
        align: 'center',
        slots: {
          default: ({ row }, h) => (row.canApprove > 0 ? [
            h('a', {
              class: 'link__style',
              on: {
                click: () => { this.goToFunctionPage(row.renderItem, this.$childrenTab.childrenTab.PENDING_INFO_TAB.val); },
              },
            }, `${row.canApprove}筆`),
          ] : [
            h('span', `${row.canApprove}筆`),
          ]),
        },
      },
    ],
  }

  toDoListForData = {} // 待辦事項列表(資料)

  toDoList = []; // 待辦事項列表(顯示用)

  noticeWatcher = undefined // 監聽事件

  isInit = false // 畫面初始化狀態(是否created)

  /**
   * hook
   */
  async created() {
    this.setLoading(true);
    this.convertMenuItemToToDoList();
    try {
      const dto = {
        functionCode: this.getMenuIdList,
      };
      const res = await this.$noticeApi.searchPersonalTodoListUsingPOST(dto);
      this.getPersonalToDoListCallBack(res);
    } catch (error) {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    }
    this.isInit = true;
    this.setLoading(false);
  }

  activated() {
    if (this.isInit) {
      this.getPersonalToDoList();
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
  // 取得個人待辦事項
  getPersonalToDoList() {
    const dto = {
      functionCode: this.getMenuIdList,
    };
    this.$noticeApi.searchPersonalTodoListUsingPOST(dto)
      .then((res) => {
        this.getPersonalToDoListCallBack(res);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
  }

  // 取得代辦事項後，分配各個代辦事項數量顯示到對應的功能列中
  async getPersonalToDoListCallBack(res) {
    const isSuccess = res.data.success;
    const message = res.data.message;
    const content = res.data.content;

    if (!isSuccess) {
      InfoModal.alertError({ confirm: false, content: message });
      return;
    }
    const unFinishedTotal = this.distributeToDoCount(content.unfinished, this.$settingsEnum.columns.UNFINISHED.value);
    const canApproveTotal = this.distributeToDoCount(content.canApprove, this.$settingsEnum.columns.CAN_APPROVE.value);
    for (let i = 0; i < this.toDoList.length; i++) {
      const toDoListData = this.toDoList[i];
      const toDoListGroup = toDoListData.groupId;
      toDoListData.gridData.data = [...this.toDoListForData[toDoListGroup]];
    }
    await this.setNotice({
      ...this.getNotice,
      todoCount: unFinishedTotal + canApproveTotal,
      needUpdate: false,
    });
    // 註冊監聽事件
    if (!this.noticeWatcher) {
      this.noticeWatcher = this.$watch('getNotice', this.handleNoticeChange);
    }
  }

  // 將menu轉換為待辦清單顯示格式
  convertMenuItemToToDoList() {
    const res = [];
    this.getMenuItem.children.forEach((menuNode) => {
      const nodeData = {
        groupId: menuNode.item.id,
        groupIcon: menuNode.item.icon,
        groupName: menuNode.item.title,
        gridData: { ...this.ipkGrid, data: [] },
      };
      const data = [];
      this.generateToDoItem(data, menuNode, 1);
      nodeData.gridData.data = [...data];
      this.toDoListForData[menuNode.item.id] = [...data];
      res.push(nodeData);
    });
    this.toDoList = [...res];
  }

  // 製作各功能待辦事項的顯示格式
  generateToDoItem(leafNode, node: MenuNode, startLevel: number) {
    if (node.children && node.children.length === 0) {
      const item = node.item;
      const toDoItem = {
        functionCode: item.id,
        functionName: item.title,
        unFinished: 0,
        canApprove: 0,
        renderItem: {
          key: item.id,
          title: item.title,
          route: item.route,
          uri: item.uri,
          children: [],
          disabled: item.isLeaf && !item.enabled,
          startLevel,
          data: item,
          icon: item.icon,
          breadCrumb: item.breadCrumb,
        },
      };
      leafNode.push(toDoItem);
    }
    node.children.forEach((subNode) => {
      this.generateToDoItem(leafNode, subNode, startLevel + 1);
    });
  }

  // 分配各功能的待辦事項數量，回傳總數
  distributeToDoCount(toDoDataList, toDoType): number {
    let totalCount = 0;
    // 更新待辦數量
    for (let i = 0; i < toDoDataList.length; i++) {
      const toDoData = toDoDataList[i];
      const groupId = toDoData.functionGroup;
      const groupData = this.toDoListForData[groupId];
      // menu中的functionCode是字串，因此用雙等於
      const targetDataIndex = groupData.findIndex((data) => data.functionCode == toDoData.functionCode);
      if (toDoType === this.$settingsEnum.columns.UNFINISHED.value) {
        groupData[targetDataIndex].unFinished = toDoData.toDoCount;
      }
      if (toDoType === this.$settingsEnum.columns.CAN_APPROVE.value) {
        groupData[targetDataIndex].canApprove = toDoData.toDoCount;
      }
      totalCount += toDoData.toDoCount;
    }
    return totalCount;
  }

  // 跳轉至對應功能頁面的指定子頁籤
  goToFunctionPage(renderItem, activeTab) {
    // 驗證主頁籤權限
    if (!this.validateChildrenTabAuth(renderItem.route)) {
      return;
    }
    // 開啟頁籤
    this.setTabArray(renderItem);
    this.setActiveSubTab(activeTab);
  }

  // 判斷頁籤權限
  validateChildrenTabAuth(route) {
    const authInfo = this.$authService.getAuthInfo(route);
    let isExist = false;
    // 1. 判斷點擊的頁籤是否被開啟
    if (!validateUtil.isEmpty(this.$store.getters.getTabArray)) {
      isExist = this.$store.getters.getTabArray.filter((tab) => tab.data.route === route).length;
    }
    // 2. 頁籤已被開啟
    if (isExist) {
      return true;
    }
    // 3. 頁籤未開啟，且無權限
    if (validateUtil.isEmpty(authInfo)) {
      InfoModal.alertError({
        confirm: false,
        content: '此功能無授權任一頁籤權限',
      });
      return false;
    }
    return true;
  }

  // 重新取得待辦數量後的資料更新
  handleNoticeChange(val) {
    if (!val.needUpdate) {
      return;
    }
    this.getPersonalToDoList();
  }
}
