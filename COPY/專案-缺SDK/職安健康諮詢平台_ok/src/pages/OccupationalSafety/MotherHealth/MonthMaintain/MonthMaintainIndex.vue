<template>
  <div class="container">
    <div class="page__title">
      當月維護
    </div>
    <div class="d-flex justify-content-center radio__wrap">
      <a-radio-group
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
    </div>
    <div class="table">
      <a-table
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data-source="gridData.data"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        :pagination="gridData.pagination"
        @change="onPageChange"
      >
        <span slot="customTitle"><div @click="error()">派件</div></span>
        <div
          slot="handleSend"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              :disabled="slotProps.closeCaseDesc==='已結案' || !isDispatch"
              @click="slotProps.senddisabled=!slotProps.senddisabled"
            />
          </div>
        </div>
        <div
          slot="handleStatus"
          slot-scope="slotProps"
        >
          <a-tooltip
            overlay-class-name="custome__tooltip custome__tooltip__white"
            placement="bottomLeft"
          >
            <template
              #title
            >
              <div>
                <p class="rowtitle">
                  {{ slotProps.jobStatus }}
                </p>
                <p class="rowcontent">
                  {{ slotProps.jobStatusInfo }}
                </p>
              </div>
            </template>
            <div class="status">
              <a-icon
                class="statusicon"
                type="info-circle"
                theme="filled"
              /> {{ slotProps.jobStatus }}
            </div>
          </a-tooltip>
        </div>
        <div
          slot="handleIdentity"
          slot-scope="slotProps"
        >
          <a-tooltip
            overlay-class-name="custome__tooltip custome__tooltip__white"
            placement="bottomLeft"
          >
            <template
              #title
            >
              <p class="rowtitle">
                {{ slotProps.pregnantCategoryEnum }}
              </p>
              <p class="rowcontent">
                {{ slotProps.pregnantCategoryEnumInfo }}
              </p>
            </template>
            <div class="status">
              <a-icon
                class="statusicon"
                type="info-circle"
                theme="filled"
              /> {{ slotProps.pregnantCategoryEnum }}
            </div>
          </a-tooltip>
        </div>
        <div
          slot="handleFinish"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.closeCaseDate"
            class="finished"
          >
            {{ slotProps.closeCaseDate | formatDate }}
          </div>
          <div
            v-else
            class="unfinished"
          >
            {{ slotProps.closeCaseDesc }}
          </div>
        </div>
        <div
          slot="handleTea"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.teadisabled=!slotProps.teadisabled"
            />
          </div>
        </div>
        <div
          slot="handleDoc"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.docdisabled=!slotProps.docdisabled"
            />
          </div>
        </div>
        <div
          slot="handleForm"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.formdisabled=!slotProps.formdisabled"
            />
          </div>
        </div>
        <div
          slot="handleProtect"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center align-items-center iconblock">
            <a-icon
              type="idcard"
              theme="outlined"
              @click=" push(slotProps)"
            />
          </div>
        </div>
      </a-table>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline mb-2"
        :disabled="!isDispatch"
        @click="openSendModal"
      >
        派件
      </button>
      <button
        class="btn__radius--primary mb-2"
        @click="submit()"
      >
        發送
      </button>
    </div>
    <ChooseSendNurseModal
      :visible="sendModalVisible"
      @closeSendModal="closeSendModal"
      @toSendModalResult="toSendModalResult"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import ChooseSendNurseModal from '@/components/modal/ChooseSendNurseModal.vue';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import {
	MonPlanCurrentMonthMaintainSendMailDto,
	CheckDispatchNurseDto,
	MonPlanCurrentMonthMaintainAreaDto,
	MonPlanCurrentMonthMaintainAreaDtoAreaEnumEnum,
	MonPlanCurrentMonthMaintainDispatchDto,
} from '@fubonlife/oss-api-axios-sdk';

Vue.filter('formatDate', (value) => moment(value).format('YYYY/MM/DD'));

@Component({ components: { FblDataGrid, ChooseSendNurseModal } })
export default class MonthMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

	// 欄位名稱
	gridData = {
  	rowKey: 'caseId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
			pageSizeOptions: ['5', '10', '25'],
  		showSizeChanger: true,
  		showQuickJumper: true,
  	},
  	columns: [
			{
				fixed: 'left',
				slots: { title: 'customTitle' },
				scopedSlots: { customRender: 'handleSend' },
			},
			{
  			dataIndex: 'nurseName',
				key: 'nurseName',
  			title: '負責護理人員',
				fixed: 'left',
  		},
  		{
  			dataIndex: 'createCaseDate',
				key: 'createCaseDate',
  			title: '立案時間',
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'name',
				key: 'name',
  			title: '姓名',
  		},
  		{
  			dataIndex: 'idNo',
				key: 'idNo',
  			title: 'ID',
  		},
  		{
  			dataIndex: 'age',
				key: 'age',
  			title: '年齡',
  		},
  		{
				scopedSlots: { customRender: 'handleStatus' },
  			title: '狀態',
  		},
			{
  			dataIndex: 'workArea',
				key: 'workArea',
  			title: '工作地點',
  		},
  		{
				scopedSlots: { customRender: 'handleIdentity' },
  			title: '身分別',
  		},
  		{
  			dataIndex: 'questionnaireStatus',
				key: 'questionnaireStatus',
  			title: '問卷狀態(未填/已填)',
  			width: 130,
  		},
  		{
  			dataIndex: 'actDate',
				key: 'actDate',
  			title: '諮詢預約日期',
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'nextTraceDate',
				key: 'nextTraceDate',
  			title: '下次追蹤日',
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			title: '結案日期(未結案/已結案)',
				scopedSlots: { customRender: 'handleFinish' },
  			width: 130,
  		},
  		{
  			dataIndex: 'healthDt',
				key: 'healthDt',
  			title: '近期衛教指導通知日',
  			width: 130,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'phyConsultDt',
				key: 'phyConsultDt',
  			title: '近期醫師諮詢通知日',
  			width: 130,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'followDt',
				key: 'followDt',
  			title: '近期表單填寫通知日',
  			width: 130,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			title: '發送衛教指導通知(跟催)',
				scopedSlots: { customRender: 'handleTea' },
  			width: 100,
  			fixed: 'right',
  			align: 'center',
  		},
  		{
				scopedSlots: { customRender: 'handleDoc' },
  			title: '發送醫生指導通知(跟催)',
  			width: 100,
  			fixed: 'right',
  		},
  		{
				scopedSlots: { customRender: 'handleForm' },
  			title: '發送表單填寫通知(跟催)',
  			width: 100,
  			fixed: 'right',
  		},
  		{
				scopedSlots: { customRender: 'handleProtect' },
  			title: '個案維護',
  			fixed: 'right',
  		},

  	],
	};

	type = '';

	ownerId = null;

	toDoId = null;

	// 獲取資料
	getGridData() {
		this.gridData.data = [];

		if (this.type == 'todo') {
  		this.ownerId = this.$user.getMe().userId;
  	  console.log('ownerId', this.ownerId);
			if (this.$global.getQuery()) {
  			const query = this.$global.getQuery();
				this.toDoId = query.todoId;
  			console.log('toDoId', this.toDoId);
			}
  	}

		const page: MonPlanCurrentMonthMaintainAreaDto = {
			areaEnum: MonPlanCurrentMonthMaintainAreaDtoAreaEnumEnum[this.tableType],
			ownerId: this.ownerId,
			toDoId: this.toDoId,
			pageNo: this.gridData.pagination.current - 1,
			pageSize: this.gridData.pagination.pageSize,
		};
		this.setLoading(true);
  	// 查詢當月維護
  	this.$MONPLANRpnCurrentMonthMaintainApi.currentMonthMaintainPageRUsingPOST(page)
  		.then((resp) => {
				this.gridData.data = resp.data.data.content;
				this.gridData.pagination.total = Number(resp.data.data.totalElements);
				this.gridData.data.forEach((item) => {
					this.$set(item, 'senddisabled', false);
					this.$set(item, 'teadisabled', false);
					this.$set(item, 'docdisabled', false);
					this.$set(item, 'formdisabled', false);
				});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 個案維護按鈕
	push(slotProps) {
		console.log(slotProps);
		const type: any = 'mother';
  	sessionStorage.setItem('caseMaintainType', JSON.stringify({ tableType: type }));
		this.$global.changeRouterAndaddParam({
			toRouter: 'CaseMaintainList',
			query: {
				data: { uid: slotProps.userId },
				type: 'mother',
			},
		});
	}

	// table顯示的類別
	tableType = 'ALL';

	// radio的button選項
	tableTypeOption = [
		{ label: '全部地區', value: 'ALL' },
		{ label: '北區', value: 'NORTH' },
		{ label: '中區', value: 'CENTRAL' },
		{ label: '南區', value: 'SOUTH' },
	]

	onClickRadio(e) {
		this.tableType = e.target.value;
		this.getGridData();
	}

	onPageChange(e) {
		this.gridData.pagination.current = e.current;
		this.gridData.pagination.pageSize = e.pageSize;
		this.getGridData();
	}

	async created() {
		this.type = this.$router.currentRoute.params.type;
		console.log('this.type:', this.type);
  	await this.checkDispatch();
		this.getGridData();
	}

	// 是否可以派件
	isDispatch = false;

	checkDispatch() {
		const data: CheckDispatchNurseDto = {
			srcFrom: 'MON_PLAN_PN',
		};
  	this.setLoading(true);
  	// 是否可派件
  	this.$UtilityApi.isDispatchUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
					this.isDispatch = true;
				} else {
					this.isDispatch = false;
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 有勾選
	isCheck = false;

	// 發送
	submit() {
		this.isCheck = false;
		const data: MonPlanCurrentMonthMaintainSendMailDto = {
			monPlanCurrentMonthMaintainSendMailCaseIdDtoList: [],
		};
		this.gridData.data.forEach((item, index) => {
			data.monPlanCurrentMonthMaintainSendMailCaseIdDtoList[index] = {
				caseId: item.caseId,
				form: item.formdisabled,
				health: item.teadisabled,
				phyConsult: item.docdisabled,
			};
			if (item.formdisabled || item.teadisabled || item.docdisabled) {
				this.isCheck = true;
			}
		});
		if (this.isCheck) {
			this.setLoading(true);
			// 當月維護發送信件
			this.$MONPLANRpnCurrentMonthMaintainApi.currentMonthMaintainSendMailRUsingPOST(data)
				.then((resp) => {
					if (resp.data.data.isSuccess) {
						this.$global.changeRouterAndaddParam({
							toRouter: 'MonthMaintainResult',
							query: {
								data: resp.data.data,
								result: 'success',
							},
						});
					} else {
						this.$global.changeRouterAndaddParam({
							toRouter: 'MonthMaintainResult',
							query: {
								message: this.$global.getApiErrorMsg(resp.data.apiError),
								result: 'fail',
							},
						});
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
		} else {
			this.error();
		}
	}

	error() {
		InfoModal.alertSuccess({
			title: '錯誤操作',
			confirm: false,
			content: '欲發送通知，請選擇項目後點擊「發送」。 欲派件，請選擇項目後點擊「派件」。',
		});
	}

	// 控制派件Modal
	sendModalVisible = false;

	// 派件勾選列
	sendCaseIds = [];

	openSendModal() {
		this.isCheck = false;
		this.gridData.data.forEach((item) => {
			if (item.senddisabled) {
				this.isCheck = true;
				this.sendCaseIds.push(item.caseId);
			}
		});
		if (this.isCheck) {
			this.sendModalVisible = true;
		} else {
			this.error();
		}
	}

	closeSendModal() {
		this.sendModalVisible = false;
	}

	toSendModalResult(uid) {
		const data: MonPlanCurrentMonthMaintainDispatchDto = {
			caseIds: this.sendCaseIds,
			uid,
		};
		this.setLoading(true);
  	// 派件
  	this.$MONPLANRpnCurrentMonthMaintainApi.currentMonthMaintainDispatchRUsingPOST1(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
						toRouter: 'SendModalResult',
						query: {
							result: 'success',
						},
					});
				} else {
					this.$global.changeRouterAndaddParam({
						toRouter: 'SendModalResult',
						query: {
							message: this.$global.getApiErrorMsg(resp.data.apiError),
							result: 'fail',
						},
					});
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	updated() {
  	window.parseWord();
	}
}
</script>
<style lang="scss" scoped>
  .heaher{
    width: 100%;
  }
  .page__month{
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 20px;
    margin-top: 20px;
    color: #000000;
  }
	.wrap{
		align-items: center;
	}
	.statusicon{
		color: $COLOR-MAIN1;
	}

	.unfinished{
		color: red;
	}
	.rowtitle{
		padding-top: 10px;
		padding-left:10px;
		padding-right:10px;
		color: $COLOR-MAIN1;
	}
	.rowcontent{
		padding-left:10px;
		padding-right:10px;
	}
	.iconblock{
		width: 46px;
		height: 32px;
		background-color: $COLOR-MAIN10;
		border-radius: 16px;
		color: $COLOR-MAIN1;
	}
	.btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
	.radio__wrap {
		margin-bottom: 20px;
	}
	::v-deep {
		.ant-radio-button-wrapper {
			min-width: 95px;
			text-align: center;
		}
	}

</style>
