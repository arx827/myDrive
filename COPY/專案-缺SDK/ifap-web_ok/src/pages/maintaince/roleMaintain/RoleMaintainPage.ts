import { Vue, Component } from "vue-property-decorator";
import AccordionArea from "@shared/AccordionArea.vue";
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Action } from 'vuex-class';

import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { RolePageOutputDto } from "@fubonlife/ifap-api-axios-sdk";
import timeUtil from "@/plugins/util/timeUtil";
import EditRoleGroup from "@/components/roleMaintain/EditRoleGroup.vue";
import EditRoleMaintain from "@/components/roleMaintain/EditRoleMaintain.vue";

@Component({
  components: {
 AccordionArea, FblDataGrid, EditRoleMaintain, EditRoleGroup,
},
})
export default class RoleMaintainPage extends Vue {
  @Action('setLoading') setLoading;

  form = {
    roleId: '',
    roleName: '',
    groupId: [],
    status: undefined,
  }

  // 角色 下拉選單
  roleArr = [];

  // 狀態 下拉選單
  statusAndAllArr = [{ value: '', label: '全部' }].concat(this.$enum.userStatus);

  // 群組 下拉選單
  groupArr = [];

  // 彈窗：新增 / 編輯
  editRoleModal = {
    visible: false,
    type: '',
    title: ['新增角色資料', '編輯角色資料'],
    data: {
      roleId: '',
      roleName: '',
      status: '',
    },
    init: {
      roleId: '',
      roleName: '',
      status: '',
    },
    rules: {
      roleId: [
        { required: true, trigger: 'change', message: '欄位必填' },
        { pattern: this.$validateUtil.pattern.enAndNumAndDash(), message: '請輸入英數字或底線' }],
      roleName: [{ required: true, trigger: 'change', message: '欄位必填' }],
      status: [{ required: true, trigger: 'change', message: '欄位必填' }],
    },
  };

  // 彈窗：角色的群組設定
  groupSettingModal = {
    visible: false,
    roleName: '',
    roleId: '',
    locale: {
      searchPlaceholder: '輸入群組代碼或群組名稱',
    },
    tableColumns: [
      {
        dataIndex: 'groupId',
        title: '群組代碼',
        width: 100,
      },
      {
        dataIndex: 'groupName',
        title: '群組名稱',
        width: 100,
      },
      {
        dataIndex: 'status',
        title: '群組狀態',
        width: 45,
      },
    ],
    mockData: [],
    targetKeys: [],
    selectedKeys: [],
  }

  grid = {
    rowKey: 'roleId',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      total: 0,
      showSizeChanger: true,
      pageSizeOptions: ['15', '25', '50'],
      showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'roleId',
        title: '角色代碼',
        width: 150,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'roleName',
        title: '角色名稱',
        width: 150,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'statusStyle',
        property: 'status',
        title: '狀態',
        width: 100,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'updateName',
        title: '最後異動人員',
        width: 150,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'updateDate',
        title: '最後異動時間',
        width: 150,
        formatter: (data: RolePageOutputDto) => {
          if (data.updateDate) {
            return timeUtil.formatStringDateDault(data.updateDate);
          }
        },
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'groupControl',
        fixed: 'right',
        title: '群組',
        width: 80,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'editControl',
        fixed: 'right',
        title: '編輯',
        width: 80,
      },

    ],
  }

  // 取得總筆數資料 (筆數資料會在 剛開始取得資料時，更新 grid.pagination)
  get getDataNum() {
    return Number(this.grid.pagination.total);
  }

  /* * * * * * * * * * * * *
   *       Ajax Start      *
   * * * * * * * * * * * * */

 	// API: 角色維護初始化資料_取得群組下拉
  postApi_select() {
    this.setLoading(true);
    this.$roleApi.initRoleMaintainUsingPOST()
      .then((resp) => {
        if (resp.data.apiStatus) {
          const $getData = this.$global.deepCopyData(resp.data.data);
          this.groupArr = $getData.groups;
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // API: 角色維護查詢
  postApi_gridData() {
    this.setLoading(true);
    const rolePageInputDto = {
      page: this.grid.pagination.current - 1,
      size: this.grid.pagination.pageSize,
      roleId: this.form.roleId,
      roleName: this.form.roleName,
      groupIds: this.form.groupId,
      status: this.form.status,
    }
    this.$roleApi.queryRoleMaintainUsingPOST(rolePageInputDto)
      .then((resp) => {
        if (!resp.data.apiStatus) {
          this.$message.error(resp.data.apiErrorMessage);
          return;
        }
        // Success
        if (!this.$validateUtil.isEmpty(resp.data.data)) {
          const respData = resp.data.data;
          this.grid.pagination.total = parseInt(respData.totalElements);
          this.grid.data = respData.content; // 資料放進格子
        } else {
          // 清空
          this.grid.pagination.total = 0;
          this.grid.data = [];
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  // // API: 群組查詢
  postApi_queryRoleGroup(roleId) {
    const roleGroupInputDto = {
      roleId,
    }
    return this.$roleApi.queryRoleGroupSettingUsingPOST(roleGroupInputDto)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
          const getData = this.$global.deepCopyData(resp.data.data);
          return getData;
        }
      })
  }

  // API: 異動角色群組
  postApi_updateRoleGroup() {
    this.setLoading(true);
    const roleGroupEditInputDto = {
      roleId: this.groupSettingModal.roleId,
      groupIds: this.groupSettingModal.targetKeys,
    }
    this.$roleApi.updateRoleGroupSettingUsingPOST(roleGroupEditInputDto)
      .then(async (resp) => {
        // Success
        if (resp.data.apiStatus) {
            const getData = this.$global.deepCopyData(resp.data.data);
            this.$message.success(getData.message);
            this.closeGroupModal();
        } else {
          this.$message.error(resp.data.apiErrorMessage);
        }
      })
      .finally(() => {
        this.setLoading(false);
      })
  }

  /**
   * Event
   */
  // 查詢
  searchSubmit() {
    // 檢核欄位
    (this.$refs.formRef as any).validate((valid) => {
			if (valid) {
        // 恢復頁數
        this.grid.pagination.current = 1;
        this.postApi_gridData();
			}
		});
  }

  // 點"清除
	clearSearch() {
		// 清掉查詢條件
		(this.$refs.formRef as any).resetFields();
	}

  // 新增
  addDate() {
    this.editRoleModal.type = 'add';
    this.editRoleModal.data = {
      roleId: '',
      roleName: '',
      status: '1',
    }
    this.editRoleModal.visible = true;
  }

  // 編輯
  editClick(grid) {
    this.editRoleModal.type = 'edit';
    this.editRoleModal.data = {
      roleId: grid.roleId,
      roleName: grid.roleName,
      status: grid.status,
    }
    this.editRoleModal.visible = true;
  }

  	// 分頁切換
	onPageChange(e) {
		const pagination = e.pagination;
    const p = this.grid.pagination;
		// 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== pagination.current || p.pageSize !== pagination.pageSize) {
      p.current = pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = pagination.pageSize;
      this.postApi_gridData()
    }
	}

  // 群組設定
  async groupClick(grid) {
    this.setLoading(true);
    this.groupSettingModal.roleId = grid.roleId;
    this.groupSettingModal.roleName = grid.roleName;

    const groupArrOrigin = await this.postApi_queryRoleGroup(grid.roleId);

    // 全部群組
    const allmockData = [...groupArrOrigin.authGroups || [], ...groupArrOrigin.unauthGroups || []]
    this.groupSettingModal.mockData = allmockData.map((i) => (
      {
        key: i.groupId,
        groupId: i.groupId,
        groupName: i.groupName,
        status: this.$enum.userStatus.find((e) => e.value == i.status).label,
        disabled: false,
      }
    ))

    this.groupSettingModal.targetKeys = (groupArrOrigin.authGroups && groupArrOrigin.authGroups.map((i) => i.groupId)) || [];

    this.groupSettingModal.visible = true;
    this.setLoading(false);
  }

  closeEditModal() {
    // 刷新列表
    this.postApi_gridData();
    this.editRoleModal.visible = false;
  }

  // 新增 / 編輯角色 送出
  async submitEditModal() {
    await (this.$refs.formRefEditModal as any).submitEditModal();

    // 關閉視窗
    this.closeEditModal();
	}

  // 群組異動彈窗 關閉
  closeGroupModal() {
    this.groupSettingModal.visible = false;
  }

  // 群組異動彈窗 送出
  submitGroupModal() {
    this.postApi_updateRoleGroup()
  }

  /**
   * Hook
   */
  async mounted() {
    await this.postApi_select();
    // 首次載入 查詢
    this.postApi_gridData()
  }
}
