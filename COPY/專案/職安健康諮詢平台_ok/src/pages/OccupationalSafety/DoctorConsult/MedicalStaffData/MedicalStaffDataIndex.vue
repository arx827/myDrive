<template>
  <div>
    <div class="container">
      <h2 class="page__title">
        醫護人員資訊維護
      </h2>
      <div class="query__wrapper d-flex">
        <a-radio-group
          class="query__radio"
          :default-value="tableTypeOption[0].value"
          button-style="solid"
          @change="onClickRadio"
        >
          <a-radio-button
            v-for="(item,index) in tableTypeOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
        <div class="query__bar">
          <div
            class="query__input"
            :class="{'query__input--size': tableType==='nurse'}"
          >
            <a-input-search
              v-model="searchValue"
              placeholder="你想查詢什麼 ?"
              @search="onSearch"
            />
          </div>
          <div
            v-if="tableType!=='nurse'"
            class="query__add"
          >
            <button
              class="query__add__btn btn__main btn__main--light"
              @click="clickAdd"
            >
              新增
            </button>
          </div>
        </div>
      </div>
      <div class="query__wrap-result">
        <fbl-data-grid
          :class="{'col__padding-first': (tableType!='doctor')}"
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
            <div class="action d-flex">
              <button
                v-if="checkAuth(data.data)"
                class="action__edit btn__main"
                @click="edit(data.data)"
              >
                <a-icon type="edit" />
              </button>
              <a
                v-if="tableType=='nurse' && checkAuth(data.data)"
                class="action__read d-flex flex-column justify-content-center"
                @click="readDetail(data.data)"
              >
                <a-icon type="right" />
              </a>
            </div>
          </template>
        </fbl-data-grid>
      </div>
    </div>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import {
	NurseInfoDto, WorkBuildingInfoDto, PhysicianInfoDto,
} from '@fubonlife/oss-api-axios-sdk';

@Component({
	components: { FblDataGrid },
})
export default class MedicalStaffDataIndex extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

	searchValue = ''

	// table顯示的類別
	tableType = 'doctor';

	// radio的button選項
	tableTypeOption = [
		{ label: '醫師', value: 'doctor' },
		{ label: '護理', value: 'nurse' },
		{ label: '職場大樓', value: 'site' },
	]

	respData: NurseInfoDto[]|WorkBuildingInfoDto[]|PhysicianInfoDto[] = []

	// 不同table不同columns
	columnsTpye = {
		doctor:
		[
			{
				type: FblColumnType.PLAIN,
				property: 'physicianName',
				title: '姓名',
				width: '168',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'division',
				title: '科別',
				width: 80,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'status',
				title: '狀態',
				width: 80,
				customRender: (data) => this.h('div', {},
					data.status === 0 ? '停用' : '有效'),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'remark',
				title: '備註',
				width: 150,
				customRender: (data) => this.h('div', {},
					data.remark ? data.remark : '- -'),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updName',
				title: '維護人員',
				width: 120,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updDt',
				title: '維護時間',
				width: 120,
				formatter: (data) => moment(data.updDt).format('YYYY/MM/DD'),
			},
			{
				type: FblColumnType.TEMPLATE,
				property: 'action',
				template: 'action',
				title: '',
			},
		],
		nurse:
		[
			{
				type: FblColumnType.PLAIN,
				property: 'nurseName',
				title: '姓名',
				width: '352',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'adId',
				title: '員工編號',
				width: 120,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'department',
				title: '部門單位',
				width: 120,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'workArea',
				title: '工作縣市',
				width: 120,
			},
			{
				type: FblColumnType.TEMPLATE,
				property: 'action',
				template: 'action',
				title: '',
			},
		],
		site:
		[
			{
				type: FblColumnType.PLAIN,
				property: 'buildingName',
				title: '姓名',
				width: '302',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'address',
				title: '地址',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updName',
				title: '維護人員',
				width: 120,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updDt',
				title: '維護時間',
				width: 120,
				formatter: (data) => moment(data.updDt).format('YYYY-MM-DD'),
			},
			{
				type: FblColumnType.TEMPLATE,
				property: 'action',
				template: 'action',
				title: '',
				width: '5%',
			},
		],
	}

	public grid = {
		rowKey: 'name',
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['5', '10', '25'],
			showQuickJumper: true,
			showSizeChanger: true,
		},
		columns: [],
	};

	setData() {
		this.setLoading(true);
		this.grid.data = [];
		const pageNo = this.grid.pagination.current - 1;
		const pageSize = this.grid.pagination.pageSize;
		switch (this.tableType) {
		case 'doctor':
			this.grid.rowKey = 'physicianInfoId';
			this.$PCRRpnMedStaffInfoManagementApi.getPhysicianInfoPageRUsingPOST(pageNo, pageSize).then((resp) => {
				if (resp.status === 200) {
					console.log(resp.data.data);
					this.respData = resp.data.data.content;
					this.grid.data = resp.data.data.content;
					this.grid.pagination.total = Number(resp.data.data.totalElements);
				}
			}).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setLoading(false);
			});

			this.grid.columns = this.columnsTpye.doctor;
			break;
		case 'nurse':
			this.grid.rowKey = 'nurseInfoId';
			this.$PCRRpnMedStaffInfoManagementApi.getNurseInfoPageRUsingPOST(pageNo, pageSize).then((resp) => {
				console.log(resp);
				if (resp.status === 200) {
					this.respData = resp.data.data.content;
					this.grid.data = resp.data.data.content;
					this.grid.pagination.total = Number(resp.data.data.totalElements);
				}
			}).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setLoading(false);
			});

			this.grid.columns = this.columnsTpye.nurse;
			break;
		case 'site':
			this.grid.rowKey = 'wbInfoId';
			this.$PCRRpnMedStaffInfoManagementApi.getWorkBuildingInfoPageRUsingPOST(pageNo, pageSize).then((resp) => {
				if (resp.status === 200) {
					console.log(resp.data.data);
					this.respData = resp.data.data.content;
					this.grid.data = resp.data.data.content;
					this.grid.pagination.total = Number(resp.data.data.totalElements);
				}
			}).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setLoading(false);
			});
			this.grid.columns = this.columnsTpye.site;
			break;
		default:
			this.grid.columns = this.columnsTpye.doctor;
			break;
		}
		this.searchValue = '';
	}

	onPageChange(e) {
		this.grid.pagination.current = e.pagination.current;
		this.grid.pagination.pageSize = e.pagination.pageSize;
		this.setData();
	}

	onSearch() {
		if (!this.searchValue || this.searchValue === '') {
			this.grid.data = this.respData;
		} else {
			// 搜尋是否有符合字串 用column來搜尋
			const searchArray = [];
			const filterData = [];
			const regx = new RegExp(this.searchValue);
			this.grid.columns.forEach((item) => {
				searchArray.push(item.property);
			});
			this.respData.forEach((item) => {
				let include = false;
				searchArray.forEach((key) => {
					if (regx.test(item[key])) {
						include = true;
					}
				});
				if (include) {
					filterData.push(item);
				}
			});
			this.grid.data = filterData;
		}
	}

	edit(data) {
		this.setLoading(true);
		switch (this.tableType) {
		case 'doctor':
			this.$PCRRpnMedStaffInfoManagementApi.getOnePhysicianInfoRUsingPOST(data.physicianInfoId).then((resp) => {
				if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
						toRouter: 'MedicalStaffDataDoctorAddAndEdit',
						query: resp.data.data,
						params: {
							type: 'edit',
						},
					});
				}
			}).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setLoading(false);
			});
			break;
		case 'nurse':
			this.$global.changeRouterAndaddParam({
				toRouter: 'MedicalStaffDataNurseEdit',
				query: data.nurseInfoId,
			});
			break;
		case 'site':
			this.$PCRRpnMedStaffInfoManagementApi.getOneWorkBuildingInfoRUsingPOST(data.wbInfoId).then((resp) => {
				if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
						toRouter: 'MedicalStaffDataSiteAddAndEdit',
						query: resp.data.data,
						params: {
							type: 'edit',
						},
					});
				}
			}).catch((err) => {
				console.log(err);
			}).finally(() => {
				this.setLoading(false);
			});
			break;
		}
	}

	readDetail(data) {
		this.setLoading(true);
		this.$global.changeRouterAndaddParam({
			toRouter: 'MedicalStaffDataNurseDetail',
			query: data.nurseInfoId,
		});
		// this.$PCRRpnMedStaffInfoManagementApi.getOneNurseInfoRUsingPOST(data.nurseInfoId).then((resp) => {
		// 	if (resp.data.status === 200) {
		// 		this.$global.changeRouterAndaddParam({
		// 			toRouter: 'MedicalStaffDataNurseDetail',
		// 			query: resp.data.data,
		// 		});
		// 	}
		// }).catch((err) => {
		// 	console.log(err);
		// }).finally(() => {
		// 	this.setLoading(false);
		// });
	}

	clickAdd() {
		let path;
		switch (this.tableType) {
		case 'doctor':
			path = '/occupationSafety/PhyConsult/medicalStaffData/doctor/add';
			break;
		case 'site':
			path = '/occupationSafety/PhyConsult/medicalStaffData/site/add';
			break;
		default:
			path = '/occupationSafety/PhyConsult/medicalStaffData/doctor/add';
			break;
		}
		this.$router.push({ path });
	}

	resetPagination() {
		this.grid.pagination.current = 1;
		this.grid.pagination.pageSize = 10;
	}

	onClickRadio(e) {
		this.tableType = e.target.value;
		this.resetPagination();
		this.setData();
	}

	checkAuth(data?) {
		// 須檢查登入者權限為護理師時，登入UID是否與資料護理師UID一致，護理師只能檢視自己的資料
		const role = this.$user.getSelectedRole();
		const adId = this.$user.getMe().adId;
		console.log(data.adId, adId);
		if (this.tableType === 'nurse') {
			return data.adId === adId && role === '2';
		}
		return true;
	}

	created() {
		// this.checkAuth();
		this.setData();
	}

	 updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>

.query__radio{
	display: flex;
	justify-content:flex-end;
	width: 60%;
	// margin: 0px auto;
}
::v-deep .ant-radio-button-wrapper{
	min-width: 95px;
	// min-width: 87px;
	text-align: center;
}
.query__bar{
	width: 40%;
	display: flex;
	justify-content:flex-end;
	align-items:flex-end;
	right: 0;
	bottom: 0;
}
.query__input{
	width: 50%;
	border-radius: 4px;
	max-width: 212px;
	.ant-input-search:nth-child(2){
		margin-top: 22px;
	}
}
.query__input--size{
	width: 100%;
	border-radius: 4px;
	max-width: 212px;
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

.query__wrap-result{
	margin-top: 20px;
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

	.col__padding-first{
		.ant-table-thead > tr:first-child > th:first-child,.ant-table-tbody > tr > td:first-child{
			padding-left: 8%;
		}
	}
}

</style>
