<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-baseline">
      <div class="page__title">
        查詢結果
      </div>
      <div class="button-bar">
        <button
          class="btn__radius--primary--outline--small"
          @click="download"
        >
          下載
        </button>
        <button
          class="btn__radius--primary--outline--small"
          @click="openModal('create')"
        >
          新增系統參數
        </button>
      </div>
    </div>
    <div class="table">
      <FblDataGrid
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data="gridData.data"
        :pagination="gridData.pagination"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      >
        <template v-slot:edit="slotProps">
          <div class="d-flex justify-content-center">
            <button
              class="d-flex justify-content-center align-items-center icon-block icon-button icon__edit"
              @click="openModal('edit', slotProps.data.codeType, slotProps.data.codeId)"
            >
              <a-icon
                type="edit"
              />
            </button>
          </div>
        </template>
        <template v-slot:delete="slotProps">
          <div class="d-flex justify-content-center">
            <button
              class="d-flex justify-content-center align-items-center icon-block icon-button icon__delete"
              @click="delBtn(slotProps.data.codeType, slotProps.data.codeId)"
            >
              <a-icon
                type="delete"
              />
            </button>
          </div>
        </template>
      </FblDataGrid>
    </div>
    <div class="btn__wrap button__wrap text-center">
      <router-link :to="{name: 'ParamMaintainIndex'}">
        <button class="btn__radius--primary">
          返回
        </button>
      </router-link>
    </div>
    <ParamModal
      :modal-type="modalType"
      :select-code-type="selectCodeType"
      :select-code-id="selectCodeId"
      @closeModal="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import InfoModal from '@/plugins/notification/infoModal';
import InfoNotification from '@/plugins/notification/infoNotification';
import ParamModal from '@/pages/OccupationalSafety/OtherOptions/ParamMaintain/ParamModal.vue';
import { Action } from 'vuex-class';
import { SysCodeQueryDto, SysCodeInfoQueryDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component({ components: { FblDataGrid, ParamModal } })
export default class ParamMaintainList extends Vue {
	@Action('setLoading') setLoading;

	selectCodeType = null;

	selectCodeId = null;

  // 系統參數 CRUD modal 顯示: ['none', 'create', 'edit', 'delete']
  modalType = 'none';

  download() {
  	this.setLoading(true);
  	const downloadData: SysCodeQueryDto = {
  		codeType: this.$global.getQuery().className,
  		codeDesc: this.$global.getQuery().classContent,
  		remark: this.$global.getQuery().note,
  		reserve1: this.$global.getQuery().reserved1,
  		reserve2: this.$global.getQuery().reserved2,
  		reserve3: this.$global.getQuery().reserved3,
  		enabled: this.$global.getQuery().enabled,
  	};
  	this.$AdminControlAdminApi.sysCodeDownloadUsingPOST(downloadData, { responseType: 'blob' })
  		.then((resp) => {
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
  				this.$AdminControlAdminApi.sysCodeDownloadUsingPOST(downloadData)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					})
  					.finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  openModal(oper, CodeType, CodeId) {
  	this.modalType = oper;
  	if (oper === 'edit') {
  		this.selectCodeId = CodeId;
  		this.selectCodeType = CodeType;
  	}
  }

  delBtn(codeType, codeId) {
  	console.log(codeType, codeId);
  	InfoModal.alertError({
  		title: '確定刪除嗎？',
  		content: '該參數資料即將執行刪除，您確定要刪除嗎？',
  		confirm: true,
  		onCallback: () => {
  			this.setLoading(true);
  			const delData: SysCodeInfoQueryDto = {
  				codeId,
  				codeType,
  			};
  			this.$AdminControlAdminApi.deleteSysCodeUsingPOST(delData)
  				.then((resp) => {
  					if (resp.data.status === 200) {
  						InfoNotification.success({
  							content: '已完成資料刪除',
  							duration: 3,
  						});
  						this.getGridData();
  					} else {
  						InfoNotification.error({
  							content: '無法完成資料刪除，請再次嘗試。',
  							duration: 3,
  						});
  					}
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		},
  	});
  }

  closeModal() {
  	this.modalType = 'none';
  }

  // className, number, classContent, order, enabled, note, reserved1, reserved2, reserved3, userChanged, timeChanged
  gridData = {
  	rowKey: 'rowkey',
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'className',
  			title: '分類代碼/名稱',
  			width: 180,
  			fixed: 'left',
  			customRender: (data) => `${data.codeType} ${data.codeName}`,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'codeId',
  			title: '代碼',
  			width: 100,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'codeDesc',
  			title: '代碼內容',
  			width: 220,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'isortby',
  			title: '資料順序',
  			width: 100,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'enabled',
  			title: '是否啟用',
  			width: 100,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'remark',
  			title: '備註',
  			width: 220,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserve1',
  			title: '保留欄位一',
  			width: 220,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserve2',
  			title: '保留欄位二',
  			width: 220,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserve3',
  			title: '保留欄位三',
  			width: 220,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtName',
  			title: '建立人員',
  			width: 140,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtDt',
  			title: '建立時間',
  			width: 140,
  			customRender: (data) => (data.crtDt !== null ? moment(data.crtDt).format('YYYY/MM/DD HH:mm:ss') : ''),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updName',
  			title: '異動人員',
  			width: 140,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updDt',
  			title: '異動時間',
  			width: 140,
  			customRender: (data) => (data.updDt !== null ? moment(data.updDt).format('YYYY/MM/DD HH:mm:ss') : ''),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'edit',
  			fixed: 'right',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'delete',
  			fixed: 'right',
  		},
  	],
  	data: [],
  }

  getGridData() {
  	this.setLoading(true);
  	this.gridData.data = [];
  	const queryData: SysCodeQueryDto = {
  		codeType: this.$global.getQuery().className,
  		codeDesc: this.$global.getQuery().classContent,
  		pageNo: this.gridData.pagination.current - 1,
  		pageSize: this.gridData.pagination.pageSize,
  		remark: this.$global.getQuery().note,
  		reserve1: this.$global.getQuery().reserved1,
  		reserve2: this.$global.getQuery().reserved2,
  		reserve3: this.$global.getQuery().reserved3,
  		enabled: this.$global.getQuery().enabled,
  	};
  	this.$AdminControlAdminApi.sysCodePageUsingPOST(queryData)
  		.then((resp) => {
  			this.gridData.data = resp.data.data.content;
  			this.gridData.pagination.total = Number(resp.data.data.totalElements);
  			this.gridData.data.forEach((item, idx) => {
  				item.rowkey = idx + 1;
  			});
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onPageChange(e) {
  	this.gridData.pagination.current = e.pagination.current;
  	this.gridData.pagination.pageSize = e.pagination.pageSize;
  	this.getGridData();
  }

  created() {
  	this.getGridData();
  }
}
</script>
<style lang="scss" scoped>
  .button-bar {
    button:last-child {
      margin-left: 10px
    };
  }
  .button__wrap {
    margin: 40px 0;
  }

	::v-deep {
		.icon-block{
      cursor: pointer;
			.anticon svg {
				font-size: 20px;
			}
		}
	}
</style>
