<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="page__title">
        角色維護
      </div>
      <div class="d-flex">
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="download"
        >
          下載
        </button>
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="openHistoryChangeModal"
        >
          歷史異動紀錄
        </button>
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="openCheckItemModal"
        >
          待覆核項目
        </button>
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="openRoleAddandEditModal()"
        >
          新增角色
        </button>
      </div>
    </div>
    <div class="table--scroll">
      <div class="table">
        <a-table
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data-source="gridData.data"
          :pagination="false"
          :empty-data="gridData.data.length <= 0"
          class="components-table-demo-nested"
        >
          <div
            slot="handleTemp"
            slot-scope="slotProps"
            class="d-flex"
          >
            <button
              class="icon-button icon__edit"
              :class="{'icon__edit--disabled': slotProps.dataStatus === 1}"
              :disabled="slotProps.dataStatus === 1"
              @click="openRoleAddandEditModal(slotProps)"
            >
              <a-icon type="edit" />
            </button>
          </div>
          <a-table
            slot="expandedRowRender"
            slot-scope="slotProps"
            :row-key="innerGridData.rowKey"
            :columns="innerGridData.columns"
            :data-source="innerGridData.data[`roleId_${slotProps.roleId}`]"
            :pagination="false"
          >
            <template
              slot="menuName"
              slot-scope="slotPropsChild"
            >
              <div>{{ slotPropsChild.menuName }} ({{ slotPropsChild.parentId }}/{{ slotPropsChild.menuId }})</div>
            </template>
          </a-table>
        </a-table>
      </div>
    </div>
    <div
      v-if="gridData.data.length!==0"
      class="d-flex justify-content-end pagination__block"
    >
      <a-pagination
        size="small"
        :total="gridData.pagination.total"
        :page-size-options="gridData.pagination.pageSizeOptions"
        show-size-changer
        show-quick-jumper
        @change="onPageChange"
        @showSizeChange="onShowSizeChange"
      />
    </div>

    <HistoryChangeModal
      :visible="historyChangeModalVisible"
      @closeHistoryChangeModal="closeHistoryChangeModal"
    />
    <CheckItemModal
      :visible="checkItemModalVisible"
      @closeCheckItemModal="closeCheckItemModal"
    />
    <RoleAddandEditModal
      :visible="roleAddandEditModalVisible"
      :type="roleAddandEditModalType"
      :edit-data="editData"
      @closeRoleAddandEditModal="closeRoleAddandEditModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import HistoryChangeModal from '@/pages/OccupationalSafety/OtherOptions/RoleMaintain/HistoryChangeModal.vue';
import CheckItemModal from '@/pages/OccupationalSafety/OtherOptions/RoleMaintain/CheckItemModal.vue';
import RoleAddandEditModal from '@/pages/OccupationalSafety/OtherOptions/RoleMaintain/RoleAddandEditModal.vue';
import notification from '@/plugins/notification/infoNotification';
import { QueryPageModel, RoleChangeQueryDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component({ components: { HistoryChangeModal, CheckItemModal, RoleAddandEditModal } })
export default class RoleMaintainIndex extends Vue {
	@Action('setLoading') setLoading;

  h = this.$createElement;

  historyChangeModalVisible = false;

  checkItemModalVisible = false;

	roleAddandEditModalVisible = false;

	roleAddandEditModalType = null;

	editData = null;

	 // 父層 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 25,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			title: '角色名稱',
  			dataIndex: 'roleName',
  			key: 'roleName',
  			width: 130,
  		},
  		{
  			title: '是否啟用',
  			dataIndex: 'enabled',
  			key: 'enabled',
  			width: 100,
  			customRender: (data) => {
  				if (data) {
  					return data === 'Y' ? '是' : '否';
  				}
  			},
  		},
  		{
  			title: '建立人員',
  			dataIndex: 'crtName',
  			key: 'crtName',
  			width: 130,
  		},
  		{
  			title: '建立時間',
  			dataIndex: 'crtDt',
  			key: 'crtDt',
  			width: 120,
  			customRender: (data) => {
  				if (data) {
  					return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
  				} return '';
  			},
  		},
  		{
  			title: '異動人員',
  			dataIndex: 'updName',
  			key: 'chengePerson',
  			width: 130,
  		},
  		{
  			title: '異動時間',
  			dataIndex: 'updDt',
  			key: 'updDt',
  			width: 120,
  			customRender: (data) => {
  				if (data) {
  					return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
  				} return '';
  			},
  		},
  		{
  			title: '備註',
  			dataIndex: 'remark',
  			key: 'remark',
  			width: 150,
  			customRender: (data) => ((data) || this.h('div', '--')),
  		},
  		{
  			title: '資料狀態',
  			dataIndex: 'dataStatus',
  			key: 'dataStatus',
  			width: 100,
  			customRender: (data) => (data === 0 ? '可異動' : '不可異動'),
  		},
  		{
  			title: '',
  			scopedSlots: { customRender: 'handleTemp' },
  			width: 100,
  		},
  	],
  }

  // 子層 欄位資料
  innerGridData = {
  	rowKey: 'rowkey',
  	data: {},
  	pagination: false,
  	columns: [
  		{
  			title: '模組名稱',
  			dataIndex: 'parentName',
  			key: 'parentName',
  			width: 200,
  		},
  		{
  			title: '功能名稱',
  			key: 'menuName',
  			scopedSlots: { customRender: 'menuName' },
  		},
  	],
  }

  openHistoryChangeModal() {
  	this.historyChangeModalVisible = true;
  }

  closeHistoryChangeModal() {
  	this.historyChangeModalVisible = false;
  }

  openCheckItemModal() {
  	this.checkItemModalVisible = true;
  }

  closeCheckItemModal() {
  	this.checkItemModalVisible = false;
  }

  openRoleAddandEditModal(data?) {
  	this.roleAddandEditModalVisible = true;
  	this.roleAddandEditModalType = data ? 'edit' : 'add';
  	this.editData = data;
  }

  closeRoleAddandEditModal() {
  	this.roleAddandEditModalVisible = false;
  }

  download() {
  	this.fetchDownloadRoles();
  }

  onPageChange(current) {
  	this.gridData.pagination.current = current;
  	this.fetchRolesPage();
  }

  onShowSizeChange(current, pageSize) {
  	this.gridData.pagination.current = current;
  	this.gridData.pagination.pageSize = pageSize;
  	this.fetchRolesPage();
  }

  // API:1.2.23.	查詢所有角色(page)
  fetchRolesPage() {
  	const $search: QueryPageModel = {
  		pageNo: this.gridData.pagination.current - 1,
  		pageSize: this.gridData.pagination.pageSize,
  	};
  	this.setLoading(true);
  	this.$AdminControlAdminApi.rolesPageUsingPOST($search)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp.data.data);
  			if (resp.data.data) {
  				const content = JSON.parse(JSON.stringify(resp.data.data.content));
  				this.gridData.data = content.map((role, index) => {
  					const innerData = role.menus.map((menu, index) => ({ rowkey: index + 1, ...menu }));
  					this.$set(this.innerGridData.data, `roleId_${role.roleId}`, innerData);
  					return { rowkey: index + 1, ...role };
  				});
  			}
  			this.gridData.pagination.total = Number(resp.data.data.totalElements);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 1.2.24.	查詢所有角色(page)-下載
  fetchDownloadRoles() {
  	this.setLoading(true);
  	this.$AdminControlAdminApi.rolesPageDownloadUsingPOST({ responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  			  let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  			} else {
  				this.$AdminControlAdminApi.rolesPageDownloadUsingPOST()
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						// TEST:
  						// console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error status = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	this.fetchRolesPage();
  }
}
</script>

<style lang="scss" scoped>
	.table--scroll {
		overflow-x: auto;
	}
	.pagination__block {
		margin-top: 20px;
		margin-bottom: 40px;
	}
  ::v-deep {
    .ant-table-header-column {
      font-weight: 900;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
  }
</style>
