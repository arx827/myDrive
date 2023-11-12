<template>
  <div>
    <div class="container">
      <div class="page__header">
        <h2 class="page__title">
          建立員工健檢資料
        </h2>
        <div class="header__btn__wrap row">
          <a-button
            class="float-end btn__radius--primary--outline"
            @click="()=>{uploadModalVisible=true}"
          >
            批次匯入
          </a-button>
          <a-button
            class="float-end btn__radius--primary--outline"
            @click="()=>{queryModalVisible=true}"
          >
            單筆建檔
          </a-button>
        </div>
      </div>
      <div class="query__wrap-result">
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :custom-row="grid.customRow"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        >
          <template #action="data">
            <div
              v-if="data.data.dataType == 1"
              class="action"
            >
              <button
                class="action__edit btn__main"
                @click="clickEdit(data.data)"
              >
                <a-icon type="edit" />
              </button>
            </div>
          </template>
        </fbl-data-grid>
      </div>
    </div>
    <upload-file-modal
      :visible="uploadModalVisible"
      @close-modal="closeUploadModal"
    />
    <staff-query-modal
      :visible="queryModalVisible"
      @close-modal="closeQueryModal"
    />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import StaffQueryModal from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/StaffQueryModal.vue';
import UploadFileModal from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/uploadFileModal.vue';
import { HealthCheckItemResultIdDto } from '@fubonlife/oss-api-axios-sdk';

@Component({
	components: { FblDataGrid, StaffQueryModal, UploadFileModal },
})
export default class EmpHealthReportList extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

	uploadModalVisible = false

	queryModalVisible = false

	// 假資料
	fakaData = [
		{
			createDate: new Date('2022/05/01'),
			cmethod: 1,
			status: true,
			count: 1,
			name: '蕭可芸(預留空間)',
		},
		{
			createDate: new Date('2022/03/01'),
			cmethod: 2,
			status: true,
			count: 200000,
			name: '何小珮',
		},
	]

	public grid = {
		rowKey: 'id',
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
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 60,
  		},
			{
				type: FblColumnType.PLAIN,
				property: 'crtDt',
				title: '建立日期',
				formatter: (data) => data.crtDt && DateTimeFormmat.transformRocDate(moment(data.crtDt).format('YYYY/MM/DD')),
				width: 200,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'dataType',
				title: '建立方式',
				customRender: (data) => this.h('div', {},
					data.dataType == 1 ? '單筆建檔' : '批次匯入'),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'count',
				title: '筆數',
				formatter: (data) => this.autoAddComdify(data.count),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'createName',
				title: '建立人',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'status',
				title: '狀態',
				customRender: (data) => this.h('div', {},
					data.status == 1 ? '已建立' : '暫存'),
			},
			{
				type: FblColumnType.TEMPLATE,
				property: 'action',
				template: 'action',
				title: '',
			}],
	};

	created() {
		this.setData();
	}

	setData() {
		this.setLoading(true);
  	// 查詢健檢資料匯入結果
  	this.$HERpnCreateHealthCheckApi.healthCheckResultQueryUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.grid.data = resp.data.data;
					for (let i = 0; i < this.grid.data.length; i++) {
  					this.grid.data[i].id = i.toString();
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	clickEdit(data) {
		this.$global.changeRouterAndaddParam({
			query: { resultId: data.resultId },
			params: {
				type: 'edit',
			},
			toRouter: 'EmpHealthReportAdd',
		});
	}

	closeUploadModal(data) {
		this.uploadModalVisible = false;
	}

	async closeQueryModal(data) {
		this.queryModalVisible = false;
		if (data) {
			const { userName, department, uid } = data;
			this.$global.changeRouterAndaddParam({
				query: { userName, department, uid },
				params: {
					type: 'add',
				},
				toRouter: 'EmpHealthReportAdd',
			});
		}
	}

	onPageChange(e) {
		this.grid.pagination.current = e.pagination.current;
		this.grid.pagination.pageSize = e.pagination.pageSize;
		this.setData();
	}

	// 轉千分位
	autoAddComdify(val) {
		if (!val) return val;
		const rgx = /(\d)(?=(?:\d{3})+$)/g;
		const c = val.toString().replace(rgx, '$1,');
		return c;
	}
}
</script>

<style lang="scss" scoped>
.page__header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
}
.header__btn__wrap{
	max-width: 360px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	button{
		margin-left: 10px;
		width: 110px;
		margin-top: 5px;
		@include rwd-md{
			margin-top: 0px;
		}
	}
}

.query__radio{
	display: flex;
	justify-content: center;
	margin: 0px auto;
}
::v-deep .ant-radio-button-wrapper{
	min-width: 95px;
	text-align: center;
}
.query__wrapper{
	position: relative;
}
.query__bar{
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	position: absolute;
	right: 0;
	bottom: 0;
}
.query__input{
	border-radius: 4px;
	width: 212px;
	.ant-input-search:nth-child(2){
		margin-top: 22px;
	}
}
::v-deep .ant-input-suffix{
	font: 1.2em;
}
.query__add {
	margin-left: 10px;
	.query__add__btn{
	padding: 4px 24px;
	}
}
.action{
	float: right;
}
.action__edit{
	color: $COLOR-MAIN1;
	padding: 4px 15px;
	&:hover{
		background-color: #23C4A8;
		::v-deep .anticon{
			color: #fff;
		}
	}
}
.action__read{
	color:#000000A6;
	margin-left: 18px;
	::v-deep svg{
		font-size: 13px;
	}
}

::v-deep {
	.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 7px 16px;
	}
	.ant-table-thead > tr > th span{
		font-weight: bold;
	}

	.query__wrap-result{
		padding-bottom: 70px;
	}

}

</style>
