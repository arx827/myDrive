<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        登入覆核作業
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          @click="download"
        >
          下載
        </button>
      </div>
    </div>
    <div class="table">
      <a-table
        :row-key="gridData.rowKey"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="gridData.columns"
        :data-source="gridData.data"
        :pagination="gridData.pagination"
        :scroll="{ x: true }"
        @change="onPageChange($event)"
      />
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        :disabled="!isManager"
        @click="openModal()"
      >
        退回
      </button>
      <button
        class="btn__radius--primary"
        :disabled="!isManager"
        @click="agree()"
      >
        同意
      </button>
    </div>
    <ReasonModal
      :visible="reasonModalVisible"
      :table-data="reasonData"
      @closeReasonModal="closeReasonModal"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ReasonModal from '@/pages/OccupationalSafety/OtherOptions/LoginCheckWork/LoginCheckWorkBackReasonModal.vue';
import { QueryPageModel, CertPassUpdateDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import infoModal from '@/plugins/notification/infoModal';

@Component({ components: { ReasonModal } })
export default class LoginCheckWorkIndex extends Vue {
  @Action('setLoading') setLoading;

  // 退回原因modal控制
  reasonModalVisible = false;

	reasonData = null;

  // 檢核是否為主管
  isManager = false;

  closeReasonModal() {
  	this.reasonModalVisible = false;
  }

  openModal() {
  	if (this.selectedRowKeys.length !== 0) {
  		this.reasonData = this.filterSelectedData();
  		this.reasonModalVisible = true;
  	} else {
  		infoModal.alertError({
  			content: '請勾選您要退回的人員',
  		});
  	}
  }

  selectedRowKeys= [];

  pageWidth = document.documentElement.scrollWidth;

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			title: '護理AD/員編',
  			dataIndex: 'adId',
  			key: 'adId',
  			width: 150,
  		},
  		{
  			title: '登入護理人員',
  			dataIndex: 'name',
  			key: 'name',
  			width: 500,
  		},
  		{
  			title: '登入時間',
  			dataIndex: 'loginDt',
  			key: 'loginDt',
  			customRender: (data) => data && moment(data.loginDt).format('YYYY/MM/DD HH:mm:ss'),
  		},
  	],
  }

  onSelectChange(selectedRowKeys) {
  	this.selectedRowKeys = selectedRowKeys;
  }

  // 過濾選取物件
  filterSelectedData() {
  	const filterArr = [];
  	this.selectedRowKeys.map((rowkey) => {
  		filterArr.push(JSON.parse(JSON.stringify(this.gridData.data)).filter((i) => i.rowkey == rowkey)[0]);
  	});
  	return filterArr;
  }

  getGridData() {
  	this.setLoading(true);
  	const queryData: QueryPageModel = {
  		pageNo: this.gridData.pagination.current - 1,
  		pageSize: this.gridData.pagination.pageSize,
  	};
  	// 主管-護理師登入覆核作業-查詢API
  	this.$AdminControlManagerApi.loginReviewWorkListUsingPOST(queryData)
  		.then((resp) => {
  			this.gridData.data = resp.data.data.content;
  			this.gridData.data.forEach((item, idx) => {
  				item.rowkey = idx + 1;
  			});
  			console.log(this.gridData.data);
  			this.gridData.pagination.total = Number(resp.data.data.totalElements);
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  download() {
  	this.setLoading(true);
  	this.$AdminControlManagerApi.loginReviewWorkListDownloadUsingPOST({ responseType: 'blob' })
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
  				this.$AdminControlManagerApi.loginReviewWorkListDownloadUsingPOST()
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					}).finally(() => {
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

  agree() {
  	if (this.selectedRowKeys.length !== 0) {
  		this.setLoading(true);
  		const uuidArr = [];
  		this.filterSelectedData().map((i) => {
  			uuidArr.push(i.uuid);
  		});
  		const agreeData: CertPassUpdateDto = {
  			certPassUpdateUserDtoList: [],
  			isAgree: true,
  		};
  		for (let i = 0; i < uuidArr.length; i++) {
  			const block = {
  				uuid: uuidArr[i],
  			};
  			agreeData.certPassUpdateUserDtoList.push(block);
  		}
  		this.$AdminControlManagerApi.loginReviewWorkUpdateUsingPOST(agreeData)
  			.then((resp) => {
  				console.log(resp);
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'LoginCheckWorkResult',
  					params: {
  						type: 'check',
  					},
  					query: {
  						result: resp.data.status === 200 ? 'success' : 'fail',
  						errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					},
  				});
  			})
  			.catch((error) => {
  				console.log('error status => ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else {
  		infoModal.alertError({
  			content: '請勾選您要覆核的人員',
  		});
  	}
  }

  onPageChange(e) {
  	this.gridData.pagination = e;
  	this.getGridData();
  }

  // 角色確認API
  async checkRole() {
  	this.setLoading(true);
  	await this.$AdminControlManagerApi.checkUserRoleUsingPOST()
  		.then((resp) => {
  			if (resp.data.data.isManager) {
  				this.isManager = true;
  			}
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  async created() {
  	await this.checkRole();
  	if (this.isManager) {
  		this.getGridData();
  	} else {
  		notification.error({ content: '請確認您是否為主管' });
  	}
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 5px;
    }
  }
</style>
