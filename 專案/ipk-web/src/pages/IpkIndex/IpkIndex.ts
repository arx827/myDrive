import moment from 'moment';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { uuid } from 'vue-uuid';
import InfoModal from '@/plugins/notification/infoModal';
import AnnouncementModal from '@/pages/AnnouncementSetting/AnnouncementModal.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import validateUtil from '@/plugins/util/validateUtil';

@Component({
  components: {
    IpkVxeTable,
    AnnouncementModal,
  },
})
export default class IpkIndex extends Vue {
  @Getter getNotice;

  @Action('setLoading') setLoading;

  @Action('setActiveSubTab') setActiveSubTab;

  @Action('setTabArray') setTabArray;

  /**
  * data
  */
  ipkGrid: IpkVxeTableModel = { // 公告Table
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: false,
    scrollY: { gt: 200, mode: 'wheel' },
    showOverflow: 'ellipsis',
    autoResize: true,
    columns: [
      {
        title: '標題',
        field: 'announcementTitle',
        slots: {
          default: ({ row }, h) => [
            h('a-tag', {
              props: {
                color: this.$settingsEnum.getObject('announcementType', row.announcementType).color,
                class: 'tagStyle',
              },
            }, this.$settingsEnum.getObject('announcementType', row.announcementType).label),
            h('a', {
              on: {
                click: () => { this.openCheckInfoModal(row); },
              },
            }, row.announcementTitle),
          ],
         },
      },
      {
        title: '發布單位',
        field: 'announcementBu',
        width: 300,
      },
      {
        title: '發佈日',
        field: 'announcementPublishDate',
        width: 140,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  };

  showCheckInfoModal = false // [檢視彈窗] modal開關

  // 常用功能是否有異動
  edited = false;

  // 要新增功能的資料夾的key
  addFunctionFileKey = '';

  // 新增功能彈窗
  addFunctionModalVisible = false;

  // 編輯功能彈窗
  editNameModalVisible = false;

  fileName = '';

  funcKey = '';

  functionModalVisible = false;

  selectedKeys = []

  checkedKeys = []

  // 取得全部現有功能表
  allFileList = []

  // 使用者客製化功能表
  customizeFileList = []

  // 最終定版客製化功能表
  finalFileList = []

  announcementList: Array<any> = [];

  // 公告事項彈窗
  modalAnnouncementShow = false;

  // 點選的公告事項
  detail = {};

  /**
   * computed
   */
  get noticeTotalCount() {
    return this.getNotice.messageNoticeCount + this.getNotice.todoCount;
  }

  @Watch('selectedKeys')
  onValChange(val) {
    this.selectedKeys = val;
  }

  @Watch('checkedKeys')
  onNewChange(val) {
    this.checkedKeys = val;
  }

  /**
  * hook
  */
  created() {
    this.reloadFunctionList();
    this.finalFileList = JSON.parse(JSON.stringify(this.customizeFileList));
    this.searchAnnouncementList();
  }

  /**
  * methods
  */
  toMenuItem(node) {
    const item = node.item;
    return {
      key: item.id,
      title: item.title,
      route: item.route,
      uri: item.uri,
      children: node.children.map((c) => this.toMenuItem(c)),
      disabled: item.isLeaf && !item.enabled,
      icon: item.icon,
      breadCrumb: item.breadCrumb,
    };
  }

  // 查詢公告清單
  searchAnnouncementList() {
    this.setLoading(true);
    const dto = {
      pageNum: this.ipkGrid.pagerConfig.currentPage,
      pageSize: this.ipkGrid.pagerConfig.pageSize,
    };
    this.$announcementApi.paginateAvailableAnnouncementUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;
        const totalCount = parseInt(res.data.totalCount);

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.ipkGrid.data = [...content];
        this.ipkGrid.pagerConfig.total = totalCount;
      }).catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 開啟公告內容彈窗
  openCheckInfoModal(e) {
    this.setLoading(true);
    this.$announcementApi.searchAnnouncementInfoUsingGET(e.announcementId)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        const tagData = this.$settingsEnum.announcementType.filter((type) => type.value === content.announcementType)[0];

        this.detail = {
          id: content.announcementId,
          tagColor: tagData.color,
          tagTitle: tagData.label,
          title: content.announcementTitle,
          content: content.announcementContent,
          attachment: content.announcementNameList,
          announcer: content.announcementEmpDomain,
          publishDate: !validateUtil.isEmpty(content.announcementPublishDate) ? moment(content.announcementPublishDate).format('YYYY/MM/DD') : '',
          effectDate: !validateUtil.isEmpty(content.announcementEffectDate) ? moment(content.announcementEffectDate).format('YYYY/MM/DD') : '',
          // 後端失效日記錄為隔天的00:00:00.000，因此前端顯示上要減1天來符合原設定含意
          expiryDate: !validateUtil.isEmpty(content.announcementExpiryDate) ? moment(content.announcementExpiryDate).subtract(1, 'days').format('YYYY/MM/DD') : '',
          documentNum: content.announcementDocumentNo,
          releaseDepartment: content.announcementBu,
          clickTotal: content.hitCount,
        };
        this.showCheckInfoModal = true;
      }).catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.showCheckInfoModal = false;
  }

  // 頁數改變
  handlePageChange(e) {
    this.ipkGrid.pagerConfig.currentPage = e.currentPage;
    this.ipkGrid.pagerConfig.pageSize = e.pageSize;
    this.searchAnnouncementList();
  }

  // 開啟個人通知畫面
  openMyNoticePage() {
    let itemPart = this.$authService.myNoticeTabSetting.route.split('-');
    let res = '';
    for (let i = 0; i < itemPart.length; i++) {
      res += (itemPart[i][0].toUpperCase() + itemPart[i].slice(1));
    }
    this.$store.dispatch('setAddCachedView', res);
    this.setTabArray(this.$authService.myNoticeTabSetting);
    this.setActiveSubTab(this.$childrenTab.childrenTab.NOTICE.val);
  }

  // ------------------------------------------ 常用功能表 start --------------------------------------------------------
  // TEST 取得常用功能表
  reloadFunctionList() {
    this.allFileList = [
      {
        key: uuid.v4(),
        id: '004002',
        title: '帳務基本資料設定',
        slots: { icon: 'folder-open' },
        scopedSlots: {
            title: 'custom',
        },
        children: [
          {
            key: uuid.v4(),
            id: '004002002',
            value: 'KeepBook',
            title: '帳本別設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002003',
            value: 'AccountCodePage',
            title: '會計科目設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002004',
            value: 'FinancialAssetPage',
            title: '金融商品分類設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002005',
            value: 'PortfolioCodePage',
            title: '資產區隔設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002006',
            value: 'OutsourcingCodePage',
            title: '自操委外設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002007',
            value: 'BankCodePage',
            title: '銀行代碼設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002008',
            value: 'ReconciliationCodePage',
            title: '調節項目設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002009',
            value: 'SegmentExpenseCodePage',
            title: '費用單位代號設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '0040020010',
            value: 'NIICodePage',
            title: 'NII分類設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '0040020011',
            value: 'ICSCodePage',
            title: 'ICS分類設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
        ],
      },
    ];

    this.customizeFileList = [
      {
        key: uuid.v4(),
        title: '帳務基本資料設定',
        slots: { icon: 'folder-open' },
        scopedSlots: {
            title: 'custom',
        },
        disableCheckbox: true,
        children: [
          {
            key: uuid.v4(),
            id: '004002002',
            value: 'KeepBook',
            title: '帳本別設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002003',
            value: 'AccountCodePage',
            title: '會計科目設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002004',
            value: 'FinancialAssetPage',
            title: '金融商品分類設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002005',
            value: 'PortfolioCodePage',
            title: '資產區隔設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002006',
            value: 'OutsourcingCodePage',
            title: '自操委外設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002007',
            value: 'BankCodePage',
            title: '銀行代碼設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            id: '004002008',
            value: 'ReconciliationCodePage',
            title: '調節項目設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            value: 'SegmentExpenseCodePage',
            title: '費用單位代號設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            value: 'NIICodePage',
            title: 'NII分類設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
          {
            key: uuid.v4(),
            value: 'ICSCodePage',
            title: 'ICS分類設定',
            slots: { icon: 'file' },
            scopedSlots: {
                title: 'custom',
            },
          },
        ],
      },
    ];
  }

  // 新增資料夾
  addFile() {
    this.edited = true;
    const item = {
      key: uuid.v4(),
      title: '新增資料夾',
      slots: { icon: 'folder-open' },
      scopedSlots: {
          title: 'custom',
      },
      disableCheckbox: true,
      children: [],
    };
    this.customizeFileList.push(item);
  }

  // 刪除資料夾
  deleteFile(key, data) {
    InfoModal.alertInfo({
      title: '確定要刪除此資料夾嗎?',
      confirm: true,
      content: '此資料夾下的所有功能也會一併刪除',
      onCallback: () => {
        const deleteIndex = this.customizeFileList.findIndex((row) => row.key === key);
        this.customizeFileList.splice(deleteIndex, 1);
        if (data.children) {
          data.children = [];
        }
        this.edited = true;
      },
    });
  }

  // 顯示修改資料夾名稱的modal
  showEditModal(fileName, funcKey) {
    if (!fileName) {
      return;
    }
    this.funcKey = funcKey;
    this.fileName = fileName;
    this.editNameModalVisible = true;
  }

  // 編輯資料夾名稱
  submitEditName() {
    this.edited = true;
    this.editNameModalVisible = true;
    this.customizeFileList.find((row) => {
      row.key === this.funcKey ? row.title = this.fileName : row.key;
    });
    this.$message.success({
      content: '修改成功',
      duration: 5,
    });
    this.editNameModalVisible = false;
    this.fileName = '';
    this.funcKey = '';
  }

  // 複製資料夾
  copyFile(file, fileName) {
    const copyFile = JSON.parse(JSON.stringify(file.dataRef));
    copyFile.title = `${fileName}copy`;
    copyFile.key = (parseInt(copyFile.key) + 1).toString();
    copyFile.children.forEach((element) => {
      element.key = uuid.v4();
    });// 改key值為uuid
    this.customizeFileList.push(copyFile);
    this.edited = true;
  }

  // 開啟新增功能modal
  openSetFunctionModal() {
    this.functionModalVisible = true;
  }

  // 關閉新增功能modal
  closeSetFunctionModal() {
    if (this.edited === true) {
      InfoModal.alertInfo({
        confirm: true,
        content: '尚未儲存設定，是否確定關閉燈箱？',
        onCallback: () => {
          this.functionModalVisible = false;
          this.edited === false;
          this.reloadFunctionList();
        },
      });
    } else {
      this.functionModalVisible = false;
      this.reloadFunctionList();
    }
  }

  // 移除功能
  deleteFunction(func) {
    this.edited = true;
    this.customizeFileList.forEach((row) => {
      row.children.find((childRow, index) => {
        if (childRow.key === func.key) {
          row.children.splice(index, 1);
        }
      });
    });
  }

  // 複製功能
  copyFunction(func) {
    this.edited = true;
    let parentIndex = 0;
    // 比對子節點的key,尋找父節點
    this.customizeFileList.forEach((row, index) => {
      row.children.find((childRow) => {
        if (childRow.key === func.key) {
          parentIndex = index;
        }
      });
    });

    this.customizeFileList[parentIndex].children.find((childRow) => {
      const copyFunc = JSON.parse(JSON.stringify(func.dataRef));
      copyFunc.key = uuid.v4();
      if (childRow.id === func.id) {
        this.customizeFileList[parentIndex].children.push(copyFunc);
      }
    });
  }

  // 開啟新增功能彈窗
  openAddFunctionModal(item) {
    this.addFunctionFileKey = item.key; // 取得要新增的資料夾KEY
    this.addFunctionModalVisible = true;
  }

  // 關閉新增功能彈窗
  closeAddFunctionModal() {
    this.checkedKeys = [];
    this.addFunctionModalVisible = false;
  }

  // 儲存常用功能設定
  submitSave() {
    this.finalFileList = this.customizeFileList;
    this.functionModalVisible = false;
    this.edited = false;
  }

  // 選擇要新增的功能
  onCheck(checkedKeys, e) {
    this.checkedKeys = checkedKeys;
  }

  // 確定新增功能
  submitAddFunc() {
    this.edited = true;
    // 從取得要新增的資料夾Index
    const fileIndex = this.customizeFileList.findIndex((row) => row.key.toString() === this.addFunctionFileKey.toString());
    // 從allFileList找要新增的功能
    this.allFileList.forEach((row) => {
      row.children.forEach((childRow) => {
        this.checkedKeys.forEach((key) => {
          if (childRow.key === key) {
            const addItem = JSON.parse(JSON.stringify(childRow));
            addItem.key = uuid.v4();
            this.customizeFileList[fileIndex].children.push(addItem);
          }
        });
      });
    });
    this.$message.success({
      content: '新增成功',
      duration: 5,
    });
    this.addFunctionModalVisible = false;
    this.checkedKeys = [];
  }

  // 拖曳功能
  onDrop(info) {
    this.edited = true;
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...this.customizeFileList];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert
          item.children.push(dragObj);
        });
      } else if (
        (info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      this.customizeFileList = data;
  }

  // ------------------------------------------ 常用功能表 end --------------------------------------------------------
}
