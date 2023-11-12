import { Vue, Component, Watch } from "vue-property-decorator";
import AccordionArea from "@shared/AccordionArea.vue";
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import difference from 'lodash/difference';
import { Action } from 'vuex-class';
import { keyVal } from 'src/plugins/global/enumData'
import moment from 'moment';
import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Modal } from 'ant-design-vue'

@Component({
  components: { AccordionArea, FblDataGrid },
})
export default class RoleMaintainPage extends Vue {
  @Action('setLoading') setLoading;

  dateFormat = 'YYYY/MM/DD';

  form = {
    userId: '',
    userName: '',
    deptId: '',
    roleId: [],
    status: undefined,
  }

  departmentName = '';

  searchCatch = {
    userId: '',
    userName: '',
    deptId: '',
    roleId: [],
    status: undefined,
  }

  formRules: { [key: string]: ValidationRule[] } = {
    userId: [
      // { required: true, trigger: 'change', message: '欄位必填' },
      { pattern: this.$validateUtil.pattern.enAndNum(), message: '請輸入英數字' },
    ],
    // userName: [{ required: true, trigger: 'change', message: '欄位必填' }],
    // deptId: [{ required: true, trigger: 'change', message: '欄位必填' }],
    // roleId: [{ required: true, trigger: 'change', message: '欄位必填' }],
    // type: [{ required: true, trigger: 'change', message: '欄位必填' }],
  }

  // 角色 下拉選單
  roleArr = [];

  // 狀態 下拉選單
  statusAndAllArr = [{ value: '', label: '全部' }].concat(this.$enum.userStatus);

  statusArr: keyVal[] = this.$enum.userStatus;

  // 彈窗：新增 / 編輯
  editUserModal = {
    visible: false,
    type: 'add',
    title: ['新增使用者資料', '編輯使用者資料'],
    data: {
      userId: '',
      userName: '',
      empNo: '',
      email: '',
      ext: '',
      dptId: '',
      status: '',
      accountDisabledDate: '',
    },
    init: {
      userId: '',
      userName: '',
      empNo: '',
      email: '',
      ext: '',
      dptId: '',
      status: '',
    },
    rules: {
      userId: [{ required: true, trigger: 'change', message: '欄位必填' }],
      userName: [{ required: true, trigger: 'change', message: '欄位必填' }],
      empNo: [{ required: true, trigger: 'change', message: '欄位必填' }],
      email: [{ required: true, trigger: 'change', message: '欄位必填' }],
      dptId: [{ required: true, trigger: 'change', message: '欄位必填' }],
      status: [{ required: true, trigger: 'change', message: '欄位必填' }],
    },
  };

  // 彈窗：角色設定
  roleSettingModal = {
    visible: false,
    userName: '',
    userId: '',
    locale: {
      searchPlaceholder: '輸入角色id或角色名稱',
    },
    tableColumns: [
      {
        dataIndex: 'roleId',
        title: '角色ID',
      },
      {
        dataIndex: 'roleName',
        title: '角色名稱',
      },
    ],
    mockData: [],
    targetKeys: [],
    selectedKeys: [],
  }

  	// 當前查詢條件，用來比對
    curSearchData = null;

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

  // 穿梭框 篩選
  filterFunc(inputValue, item) {
    return item.roleId.indexOf(inputValue.toUpperCase()) !== -1 || item.roleName.indexOf(inputValue.toUpperCase()) !== -1;
  }

  grid = {
    rowKey: 'userId',
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
        property: 'userId',
        title: '使用者帳號',
        width: 120,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'userName',
        title: '使用者姓名',
        width: 130,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'dptName',
        title: '單位',
        minWidth: 300,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'stateStyle',
        property: 'status',
        title: '狀態',
        width: 100,
        formatter: (data) => data.status.value,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'updateName',
        title: '最後異動人員',
        width: 200,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'updateDate',
        title: '最後異動日期',
        width: 200,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'roleCntrol',
        fixed: 'right',
        title: '角色',
        width: 60,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'editControl',
        fixed: 'right',
        title: '編輯',
        width: 60,
      },
    ],
  }

  // 取得總筆數資料 (筆數資料會在 剛開始取得資料時，更新 grid.pagination)
  get getDataNum() {
    return Number(this.grid.pagination.total);
  }

  /**
   * Event
   */
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
    this.postApi_exportUserMaintain(this.searchCatch);
  }

  // 新增
  addDate() {
    this.editUserModal.type = 'add';
    this.editUserModal.visible = true;
    this.editUserModal.data = {
      userId: '',
      userName: '',
      empNo: '',
      email: '',
      ext: '',
      dptId: '',
      status: '1',
      accountDisabledDate: '',
    }
  }

  // 新增使用者時，查詢使用者資料
  async searchUserId() {
    const $userId = this.editUserModal.data.userId;
    const $userInfo = await this.postApi_queryEmployee($userId);
    this.editUserModal.data.userName = $userInfo?.userName;
    this.editUserModal.data.empNo = $userInfo?.empNo;
    this.editUserModal.data.email = $userInfo?.email;
    this.editUserModal.data.ext = $userInfo?.ext;
    this.editUserModal.data.dptId = $userInfo?.dptId;
  }

  // 角色設定
  async roleClick({ userId, userName }) {
    this.roleSettingModal.userName = userName;
    this.roleSettingModal.userId = userId;
    const roleArrOrigin = await this.postApi_queryUserRoleSetting(userId);

    // 全部角色
    const allmockData = [...roleArrOrigin.authRole || [], ...roleArrOrigin.unAuthRole || []]
    this.roleSettingModal.mockData = allmockData.map((i) => (
      {
        key: i.roleId,
        roleId: i.roleId,
        roleName: i.roleName,
        disabled: false,
      }
    ))

    // 已授權角色 id arr
    this.roleSettingModal.targetKeys = (roleArrOrigin.authRole && roleArrOrigin.authRole.map((i) => i.roleId)) || [];

    this.roleSettingModal.visible = true
  }

  // 編輯
  editClick({
    userId, userName, empNo, email, ext, dptId, status, accountDisabledDate,
  }) {
    this.editUserModal.type = 'edit';
    this.editUserModal.data = {
      userId,
      userName,
      empNo,
      email,
      ext,
      dptId,
      status,
      accountDisabledDate: accountDisabledDate && moment(accountDisabledDate).format('YYYY/MM/DD HH:mm:ss'),
    }
    this.editUserModal.visible = true;
  }

  closeEditModal() {
    // console.log(this.editUserModal.data = { ...this.editUserModal.init })
    this.editUserModal.visible = false;
  }

  // 新增 / 編輯使用者 送出
  async submitEditModal() {
    // 檢核欄位
    (this.$refs.formRefEditModal as any).validate(async (valid) => {
      if (valid) {
        // 檢核通過
        // console.log('送出 新增使用者 表單', this.editUserModal.data)
        if (this.editUserModal.type == 'add') {
          await this.postApi_insertUserMaintain();
        } else if (this.editUserModal.type == 'edit') {
          await this.postApi_updateUserMaintain();
        }

        // 刷新列表
        this.postApi_gridData();
			}
		});
  }

  // 角色異動彈窗 關閉
  closeRoleModal() {
    this.roleSettingModal.visible = false;
  }

  // 角色異動彈窗 變更
  onChange(nextTargetKeys) {
    this.roleSettingModal.targetKeys = nextTargetKeys;
  }

  // 角色異動彈窗 送出
  submitRoleModal() {
    this.postApi_updateUserRole()
  }

  // 取得查詢條件
  getCurSearch() {
    return Object.values(this.form).join();
  }

  // table 事件 (change page)
  onUserMaintainPageChange(e) {
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

  /**
   * API
   */
  // API: 取得角色下拉
  postApi_select() {
    this.setLoading(true);
    this.$userMaintenanceApi.initUserMaintainUsingPOST()
      .then((resp) => {
        if (resp.data.apiStatus) {
          const $getData = this.$global.deepCopyData(resp.data.data);
          this.roleArr = $getData.roleSelectDtos;
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 使用者維護查詢
  postApi_gridData() {
    this.setLoading(true);
    const formData = {
      page: this.grid.pagination.current - 1,
      size: this.grid.pagination.pageSize,
      userPageSpecDto: { ...this.form },
    }
    this.$userMaintenanceApi.queryUserMaintainUsingPOST(formData)
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

  // API: 匯出使用者清單
  postApi_exportUserMaintain({
    deptId, roleId, status, userId, userName,
  }) {
    this.setLoading(true);
    const formData = {
      deptId,
      roleId,
      status,
      userId,
      userName,
    }
    this.$userMaintenanceApi.exportUserMaintainUsingPOST(formData)
      .then((res) => {
        // Success
        if (res.status === 200 && (res.data as any).status !== 400) {
          this.$userMaintenanceApi.exportUserMaintainUsingPOST(formData, { responseType: 'blob' })
          .then((res) => {
            if (res.status === 200) {
              const blob = new Blob([res.data] as BlobPart[])
              const fileName = `使用者清單.xlsx`
              const blobURL = window.URL.createObjectURL(blob);
              const tempLink = document.createElement('a');
              tempLink.style.display = 'none';
              tempLink.href = blobURL;
              tempLink.setAttribute('download', fileName);
              tempLink.setAttribute('target', '_blank');
              document.body.appendChild(tempLink);
              tempLink.click();
              document.body.removeChild(tempLink);
              setTimeout(() => {
                window.URL.revokeObjectURL(blobURL)
              }, 100)
            }
          })
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 人事資料查詢
  postApi_queryEmployee(userId) {
    if (!userId) return false;
    this.setLoading(true);
    const formData = { userId }
    return this.$userMaintenanceApi.queryEmployeeUsingPOST(formData)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            return getData || '';
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 部門單位查詢
  postApi_queryDepartment(dptId) {
    this.setLoading(true);
    const formData = { dptId }
    return this.$userMaintenanceApi.queryDepartmentUsingPOST(formData)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            return getData.dptName;
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 新增使用者
  postApi_insertUserMaintain() {
    this.setLoading(true);
    const formData = {
      deptId: this.editUserModal.data.dptId,
      email: this.editUserModal.data.email,
      empNo: this.editUserModal.data.empNo,
      ext: this.editUserModal.data.ext,
      statusFlag: this.editUserModal.data.status,
      userId: this.editUserModal.data.userId,
      userName: this.editUserModal.data.userName,
    }
    return this.$userMaintenanceApi.insertUserMaintainUsingPOST(formData)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
          const getData = this.$global.deepCopyData(resp.data.data);
          console.log("getData", getData)
          if (getData == "false") {
            this.$message.error("查無使用者帳號或員工編號");
          } else {
            this.$message.success(getData);
            this.closeEditModal();
          }
        } else {
          this.$message.error(resp.data.apiErrorMessage);
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 編輯使用者
  postApi_updateUserMaintain() {
    this.setLoading(true);
    const formData = {
      deptId: this.editUserModal.data.dptId,
      email: this.editUserModal.data.email,
      empNo: this.editUserModal.data.empNo,
      ext: this.editUserModal.data.ext,
      statusFlag: this.editUserModal.data.status,
      userId: this.editUserModal.data.userId,
      userName: this.editUserModal.data.userName,
    }
    return this.$userMaintenanceApi.updateUserMaintainUsingPOST(formData)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
          const getData = this.$global.deepCopyData(resp.data.data);
          this.$message.success(getData);
          this.closeEditModal();
        } else {
          this.$message.error(resp.data.apiErrorMessage);
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 角色設定查詢
  postApi_queryUserRoleSetting(userId) {
    this.setLoading(true);
    const formData = { userId }
    return this.$userMaintenanceApi.queryUserRoleSettingUsingPOST(formData)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            return getData;
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 異動使用者角色
  postApi_updateUserRole() {
    this.setLoading(true);
    const formData = {
      roleIds: this.roleSettingModal.targetKeys,
      userId: this.roleSettingModal.userId,
    }
    this.$userMaintenanceApi.updateUserRoleUsingPOST(formData)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            this.$message.success(getData);
            this.closeRoleModal();
        } else {
          this.$message.error(resp.data.apiErrorMessage);
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  /**
   * Hook
   */
  async mounted() {
    await this.postApi_select();

    // 首次載入 查詢
    this.postApi_gridData()
  }

  /**
   * 監聽
   */
  @Watch('editUserModal.data.dptId')
  async watchEmpNo(newVal) {
    if (newVal) {
      this.departmentName = await this.postApi_queryDepartment(newVal)
    } else {
      this.departmentName = ''
    }
  }
}
