<template>
  <div class="container">
    <div class="page__title">
      上傳名單列表
    </div>
    <div class="table">
      <FblDataGrid
        class="col__padding-first"
        :row-key="gridData.rowKey"
        :columns="gridData.columns[uploadType]"
        :pagination="false"
        :data="gridData.data"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
      />
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        @click="back()"
      >
        返回上傳
      </button>
      <button
        class="btn__radius--primary"
        :disabled="gridData.data.length === 0"
        @click="save()"
      >
        儲存
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { EmpWoSaveShiftInfoModel, EmpWoSaveOvertimeInfoModel } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class BuildOverTimeList extends Vue {
	@Action('setLoading') setLoading;

	h = this.$createElement;

	formData: Array<EmpWoSaveShiftInfoModel | EmpWoSaveOvertimeInfoModel> = [];

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	columns:
		{
			shift: [
				{
					type: FblColumnType.PLAIN,
					property: 'name',
					title: '姓名',
					width: 180,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'idNo',
					title: '身分證字號',
					width: 120,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'empId',
					title: '員工編號',
					width: 120,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'unit',
					title: '單位',
					width: 180,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'status',
					title: '輪班類型',
					width: 150,
					customRender: (data) => this.h('div', {},
						data.status === 0 ? '夜班' : '輪班'),
				},
			],
			overTime: [
				{
					type: FblColumnType.PLAIN,
					property: 'name',
					title: '姓名',
					width: 180,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'idNo',
					title: '身分證字號',
					width: 120,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'empId',
					title: '員工編號',
					width: 120,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'unit',
					title: '單位',
					width: 180,
				},
				{
					type: FblColumnType.PLAIN,
					property: 'monthTotalHr',
					title: '當月總加班時數',
					width: 150,
				},
			],
		},
  }

  // 輪班人員 or 加班資訊
  uploadType: 'shift'| 'overTime' = 'shift';

  setResultParam() {
  	const query = this.$global.getQuery();
  	if (query) {
  		const { uploadType, date } = query;
  		const respData = query.respData;
  		this.uploadType = uploadType;
  		if (respData) {
  			this.gridData.data = respData;
  			this.gridData.data.map((i, index) => { i.rowkey = index + 1; });

  			switch (uploadType) {
  			case 'shift':
  				this.formData = respData.map((dto) => ({
  					date,
  					uid: dto.uid,
  					status: dto.status,
  				}));
  				break;
  			case 'overTime':
  				this.formData = respData.map((dto) => ({
  					date,
  					uid: dto.uid,
  					monthTotalHr: dto.monthTotalHr,
  				}));
  				break;
  			default:
  				break;
  			}
  		}
  	}
  }

  // API: 儲存論班人員
  saveShiftInfo() {
  	this.setLoading(true);
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.saveShiftInfoUsingPOST(this.formData)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'BuildOverTimeResult',
  					query: {
  						result: 'success',
  						count: this.gridData.data.length,
  					},
  				});
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'BuildOverTimeResult',
  					query: {
  						result: 'fail',
  						apiError: resp.data.apiError,
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error status = ', error);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'BuildOverTimeResult',
  				query: {
  					result: 'fail',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 儲存加班資訊
  saveOvertimeInfo() {
  	this.setLoading(true);
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.saveOvertimeInfoUsingPOST(this.formData)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'BuildOverTimeResult',
  					query: {
  						result: 'success',
  						count: this.gridData.data.length,
  					},
  				});
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'BuildOverTimeResult',
  					query: {
  						result: 'fail',
  						apiError: resp.data.apiError,
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error status = ', error);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'BuildOverTimeResult',
  				query: {
  					result: 'fail',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  async save() {
  	switch (this.uploadType) {
  	case 'shift':
  		await this.saveShiftInfo();
  		break;
  	case 'overTime':
  		await this.saveOvertimeInfo();
  		break;
  	default:
  		break;
  	}
  	this.$global.clearParam();
  }

  back() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'BuildOverTimeIndex',
  	});
  	this.$global.clearParam();
  }

  created() {
  	this.setResultParam();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .table {
    margin-bottom: 40px;
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
			margin-right: 5px;
      width: 200px;
      max-width: 100%;
    }
  }
  ::v-deep {
    .col__padding-first{
      .ant-table-thead > tr:first-child > th:first-child,.ant-table-tbody > tr > td:first-child{
        padding-left: 8%;
      }
    }
  }
</style>
