import { Vue, Component, Watch } from "vue-property-decorator";
import AccordionArea from "@shared/AccordionArea.vue";
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import difference from 'lodash/difference';
import { Action } from 'vuex-class';
import { keyVal } from 'src/plugins/global/enumData'

import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { multicast } from "rxjs/operators";
import AjaxService from "@/services/ajaxService";
import { Modal } from 'ant-design-vue'

import { UserSettingDto } from "@fubonlife/ifap-api-axios-sdk"

@Component({
  components: { AccordionArea, FblDataGrid },
})
export default class RoleMaintainPage extends Vue {
  @Action('setLoading') setLoading;

  dateFormat = 'YYYY/MM/DD';

  form = {
    mailAccountId: '',
    userOptions: [],
    systemOptions: [],
  }

  departmentName = '';

  searchCatch = {
    mailAccountId: '',
    userOptions: [],
    systemOptions: [],
  }

  // 使用者 下拉選單  => [ { value: 'u1', label: '使用者1' }, ...]
  userOptionsArr: keyVal[] = [];

  // 應用系統 下拉選單  => [ { value: 's1', label: '系統1' }, ...]
  systemOptionsArr: keyVal[] = [];

  statusArr: keyVal[] = this.$enum.userStatus;

  grid = {
    rowKey: 'sender',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      total: 5,
      showSizeChanger: true,
      pageSizeOptions: ['15', '25', '50'],
      showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'sender',
        title: '發信帳號',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'usersControl',
        property: 'users',
        title: '使用者',
        align: 'center',
        width: 100,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'systemsControl',
        property: 'systems',
        title: '應用系統',
        align: 'center',
        width: 100,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'updateName',
        title: '最後異動人員',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'updateDate',
        title: '最後異動時間',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'editControl',
        fixed: 'right',
        title: '編輯',
        width: 70,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'deleteControl',
        fixed: 'right',
        title: '刪除',
        width: 70,
      },
    ],
  }

  // 取得 總筆數資料 (筆數資料會在 剛開始取得資料時，更新 grid.pagination)
  get getDataNum() {
    return Number(this.grid.pagination.total);
  }

  // 取得 匯出按鈕 顯示/隱藏
  // get isShowExportButton() {
  //   return this.grid.data.length > 0;
  // }

  // 彈窗：新增 / 編輯
  editUserModal = {
    visible: false,
    type: 'add',
    title: ['新增發信帳號資料', '編輯發信帳號資料'],
    data: {
      sender: '',
      syscode: '',
      sysName: '',
      uuid: '',
      systems: {
        rowKey: 'syscode',
        data: [],
        pagination: false,
        columns: [
          {
            type: FblColumnType.PLAIN,
            property: 'syscode',
            title: '應用系統代碼',
            width: 120,
          },
          {
            type: FblColumnType.PLAIN,
            property: 'sysName',
            title: '應用系統名稱',
          },
          {
            type: FblColumnType.TEMPLATE,
            template: 'deleteControl',
            title: '刪除',
            width: 70,
          },
        ],
      },
    },
    submitRules: {
      sender: [{ required: true, trigger: 'change', message: '欄位必填' }],
    },
    addRules: {
      sysName: [{ required: true, trigger: 'change', message: '欄位必填' }],
      syscode: [{ required: true, trigger: 'change', message: '欄位必填' }],
    },
  };

  	// 當前查詢條件，用來比對
	curSearchData = null;

  // 彈窗：使用者編輯
  userModal = {
    visible: false,
    title: '使用者設定',
    sender: '',
    locale: {
      searchPlaceholder: '輸入使用者帳號或名稱',
    },
    tableColumns: [
      {
        type: FblColumnType.PLAIN,
        property: 'userId',
        title: '使用者帳號',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'userName',
        title: '使用者名稱',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'status',
        title: '使用者狀態',
      },
    ],
    mockData: [],
    targetKeys: [],
    selectedKeys: [],
  };

  // 穿梭框 篩選
  filterFunc(inputValue, item) {
    return item.userId.indexOf(inputValue.toUpperCase()) !== -1 || item.userName.indexOf(inputValue.toUpperCase()) !== -1;
  }

  // 彈窗：應用系統
  systemModal = {
    visible: false,
    title: '應用系統',
    systemsTable: {
      rowKey: 'syscode',
      data: [],
      pagination: false,
      columns: [
        {
          type: FblColumnType.PLAIN,
          property: 'syscode',
          title: '應用系統代碼',
        },
        {
          type: FblColumnType.PLAIN,
          property: 'sysName',
          title: '應用系統名稱',
        },
      ],
    },
  }

  /**
   * Event
   */
  // table 事件 (change page)
  onMasterPageChange(e) {
    const $pagination = e.pagination;
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== $pagination.current || p.pageSize !== $pagination.pageSize) {
      p.current = $pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== $pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = $pagination.pageSize;
      this.grid.pagination = p;
      this.postApi_gridData();
    }
  }

  // 清除
  resetFrom() {
    (this.$refs.formRef as any).resetFields();
  }

  // 查詢
  searchSubmit() {
    // 檢核欄位
    (this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				this.postApi_gridData();

        this.searchCatch = this.$global.deepCopyData(this.form);
			}
		});
      // 當前條件
			this.curSearchData = this.getCurSearch();
  }

  // 匯出
  exportFrom() {
    if (this.curSearchData != this.getCurSearch()) {
			Modal.warning({
				content: '請先執行查詢，再執行匯出',
				okText: "確定",
			})
			return;
		}
    this.postApi_exportMailAccount(this.searchCatch);
  }

  // 新增
  addDate() {
    this.editUserModal.type = 'add';
    this.editUserModal.visible = true;
  }

  // 使用者
  async onUserClick({ sender }) {
    this.setLoading(true);
    const $userSetting = await this.postApi_return_queryUserSetting(sender);
    const $authRole: UserSettingDto[] = $userSetting.authRole;
    const $unAuthRole: UserSettingDto[] = $userSetting.unAuthRole;
    this.userModal.title = `使用者設定 ${sender}`
    this.userModal.sender = sender;

    // 全部使用者
    const allmockData = [...$authRole || [], ...$unAuthRole || []]
    this.userModal.mockData = allmockData.map((i) => (
      {
        key: i.userId,
        userId: i.userId,
        userName: i.userName,
        status: i.status,
      }
    ));

    // 已授權使用者
    this.userModal.targetKeys = ($authRole && $authRole.map((i) => i.userId)) || [];
    this.userModal.visible = true;

    this.setLoading(false);
  }

  // 取得查詢條件
	getCurSearch() {
		return Object.values(this.form).join();
	}

  // 應用系統
  async onSysClick({ sender }) {
    const $querySenderSystem = await this.postApi_return_querySenderSystem(sender);

    this.systemModal.title = `應用系統 ${sender}`
    this.systemModal.systemsTable.data = $querySenderSystem.sysInfos;

    this.systemModal.visible = true;
  }

  // ----------------- Modal：新增 / 編輯 發信帳號 ----------------- //
  delmesg ="";

  // 刪除
  deleteRowClick({ sender }) {
    Modal.confirm({
      content: `確定要刪除${sender}?`,
      cancelText: `否`,
      okText: `是`,
      onOk: () => {
        this.postApi_deletedMailAccountMaintain(sender);
			},
   })
  }

  // (彈窗) 新增發信帳號資料 - 新增應用系統
  addSystem() {
    (this.$refs.formRef as any).resetFields();
    (this.$refs.formRefAddSystem as any).validate((valid) => {
      if (valid) {
        // 已新增的 data {syscode,sysName}
        const syscode = this.editUserModal.data.systems.data;

        // 取得所有 syscode Array
        const syscodeArr = syscode.map((i) => i.syscode);
        if (syscodeArr.includes(this.editUserModal.data.syscode)) {
          this.$message.error('應用系統代碼不得重複!');
          return false;
        }

        this.editUserModal.data.systems.data.push(
          {
            syscode: this.editUserModal.data.syscode,
            sysName: this.editUserModal.data.sysName,
          },
        );
        this.editUserModal.data.syscode = '';
        this.editUserModal.data.sysName = '';
      }
    })
  }

  // (彈窗) 新增發信帳號資料 - 編輯
  async editClick(data) {
    this.editUserModal.visible = true;
    this.editUserModal.type = 'edit';
    this.editUserModal.data.sender = data.sender;
    this.editUserModal.data.uuid = data.uuid;

    const $querySenderSystem = await this.postApi_return_querySenderSystem(data.sender);
    const $sysArr = $querySenderSystem.sysInfos;
    $sysArr.map((i, index) => ({
      rowKey: index,
      ...i,
    }))
    this.editUserModal.data.systems.data = $sysArr;
  }

  // (彈窗) 新增發信帳號資料 - 關閉
  closeEditModal() {
    this.editUserModal.data.systems.data = [];
    (this.$refs.formRefAddModal as any).resetFields();
    (this.$refs.formRefAddSystem as any).resetFields();
    this.editUserModal.visible = false;
  }

  // (彈窗) 新增 / 編輯使用者 送出
  submitEditModal() {
    // 檢核欄位
    (this.$refs.formRefAddModal as any).validate((valid) => {
      if (valid) {
        if (this.editUserModal.data.systems.data.length <= 0) {
          this.$message.error('應用系統清單 不得為空');
        } else {
          // 檢核通過
          let $submitData;
          if (this.editUserModal.type == 'add') {
            $submitData = {
              sender: this.editUserModal.data.sender,
              systems: this.editUserModal.data.systems.data,
            }
            this.postApi_insertMailAccountMaintain($submitData)
          } else if (this.editUserModal.type == 'edit') {
            $submitData = {
              sender: this.editUserModal.data.sender,
              systems: this.editUserModal.data.systems.data,
              uuid: this.editUserModal.data.uuid,
            }
            this.postApi_updateMailAccountMaintain($submitData);
          }
        }
      }
    });
    (this.$refs.formRef as any).resetFields();
    this.postApi_selectOption();
  }

  // (彈窗) 刪除 系統
  deleteSysClick({ systemCode }) {
    const $systemArr = this.editUserModal.data.systems.data;
    const $currentSystem = this.editUserModal.data.systems.data.find((i) => i.systemCode === systemCode)
    $systemArr.splice($systemArr.indexOf($currentSystem), 1);
  }

  // ----------------- Modal：使用者 ----------------- //
  closeUserModal() {
    this.userModal.visible = false;
  }

  submitUserModal() {
    this.postApi_updateUserSettingUsingPOST({
      sender: this.userModal.sender,
      userIds: this.userModal.targetKeys,
    })
  }

  // 群組異動彈窗 變更
  onUserModalChange(nextTargetKeys) {
    this.userModal.targetKeys = nextTargetKeys;
  }

  getRowSelection({
    disabled,
    selectedKeys,
    itemSelectAll,
    itemSelect,
  }) {
    return {
      getCheckboxProps: (item) => ({ props: { disabled: disabled || item.disabled } }),
      onSelectAll(selected, selectedRows) {
        const treeSelectedKeys = selectedRows
          .filter((item) => !item.disabled)
          .map(({ key }) => key);
        const diffKeys = selected
          ? difference(treeSelectedKeys, selectedKeys)
          : difference(selectedKeys, treeSelectedKeys);
        itemSelectAll(diffKeys, selected);
      },
      onSelect({ key }, selected) {
        itemSelect(key, selected);
      },
      selectedRowKeys: selectedKeys,
    };
  }

  // ----------------- Modal：應用系統 ----------------- //
  closeSysModal() {
    this.systemModal.visible = false;
  }

  /**
   * API
   */
  // API: 取得使用者下拉、應用系統下拉
  postApi_selectOption() {
    this.setLoading(true);
    this.$mailAccountApi.initMailAccountMaintainUsingPOST()
      .then((resp) => {
        if (resp.data.status === 200) {
          const $getData = this.$global.deepCopyData(resp.data.data);
          this.userOptionsArr = $getData.users;
          this.systemOptionsArr = $getData.systems.map((i) => ({
            label: i.sysName,
            value: i.syscode,
          }))
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 發信帳號維護查詢
  postApi_gridData() {
    this.setLoading(true);
    const formData = {
      page: this.grid.pagination.current - 1,
      size: this.grid.pagination.pageSize,
      sender: this.form.mailAccountId,
      syscode: this.form.systemOptions,
      userIds: this.form.userOptions,
    }
    this.$mailAccountApi.queryMailAccountMaintainUsingPOST(formData)
      .then((resp) => {
        // Success
        if (resp.data.apiStatus) {
          const getData = this.$global.deepCopyData(resp.data.data);
          const p = { ...this.grid.pagination };
          p.total = parseInt(getData.totalElements);
          this.grid.data = getData.content; // 資料放進格子
          this.grid.pagination = p;
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 匯出發信帳號清單
  postApi_exportMailAccount(searchCatch) {
    this.setLoading(true);
    const formData = {
      sender: this.form.mailAccountId,
      syscode: this.form.systemOptions,
      userIds: this.form.userOptions,
    }

    AjaxService.postExportFile('/api/mailAccount/exportMailAccountMaintain', formData)
		.then((resp) => {
			if (!resp.data.apiStatus) {
				this.$message.error(resp.data.apiErrorMessage);
			}
		})
    .finally(() => {
      this.setLoading(false);
    })
  }

  // API: 新增發信帳號
  postApi_insertMailAccountMaintain(formData) {
    this.setLoading(true);
    this.$mailAccountApi.insertMailAccountMaintainUsingPOST(formData)
      .then((res) => {
        // Success
        if (res.status === 200 && (res.data as any).status !== 400) {
          const getData = this.$global.deepCopyData(res.data.data);
          this.$message.success('新增發信帳號資料成功');
          this.closeEditModal();

          // 刷新列表
          this.postApi_gridData();
        } else {
          this.$message.error(res.data.apiErrorMessage)
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 更新發信帳號
  postApi_updateMailAccountMaintain(formData) {
    this.setLoading(true);
    this.$mailAccountApi.updateMailAccountMaintainUsingPOST(formData)
      .then((res) => {
        // Success
        if (res.status === 200 && (res.data as any).status !== 400) {
          const getData = this.$global.deepCopyData(res.data.data);
          this.$message.success('編輯發信帳號資料成功');
          this.closeEditModal();

          // 刷新列表
          this.postApi_gridData();
        } else {
          this.$message.error(res.data.apiErrorMessage)
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 刪除發信帳號
  postApi_deletedMailAccountMaintain(sender) {
    this.setLoading(true);
    this.$mailAccountApi.deletedMailAccountMaintainUsingPOST({ sender })
      .then((res) => {
        // Success
        if (res.status === 200 && (res.data as any).status !== 400) {
          const getData = this.$global.deepCopyData(res.data.data);
          this.$message.success('刪除發信帳號資料成功');
          this.closeEditModal();

          // 刷新列表
          this.postApi_gridData();
        } else {
          this.$message.error(res.data.apiErrorMessage)
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 使用者設定查詢
  async postApi_return_queryUserSetting(sender) {
    return this.$mailAccountApi.queryUserSettingUsingPOST({ sender })
      .then(async (res) => {
        if (res.data.apiStatus) {
          const getData = await this.$global.deepCopyData(res.data.data);
          return getData;
        }
        // API response錯誤
        this.setLoading(false);
        this.$message.error(res.data.apiErrorMessage);
      })
  }

  // API: 異動使用者設定
  postApi_updateUserSettingUsingPOST(formData) {
    this.setLoading(true);
    this.$mailAccountApi.updateUserSettingUsingPOST(formData)
      .then((res) => {
        const getData = this.$global.deepCopyData(res.data.data);
        this.$message.success("更新成功");
        this.userModal.visible = false;
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 發信帳號應用系統查詢
  postApi_return_querySenderSystem(sender) {
    this.setLoading(true);
    return this.$mailAccountApi.querySenderSystemUsingPOST({ sender })
      .then(async (res) => {
        const $return = await res.data.data;
        return $return;
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  /**
   * Hook
   */
  async mounted() {
    await this.postApi_selectOption();

    // 首次載入 查詢
    this.postApi_gridData();
  }
}
