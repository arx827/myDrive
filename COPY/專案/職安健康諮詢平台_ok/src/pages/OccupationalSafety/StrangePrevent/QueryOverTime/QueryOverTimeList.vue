<template>
  <div class="container">
    <div class="page__title">
      查詢結果
    </div>
    <div class="d-flex header">
      <div class="header__radio">
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
      <div class="header__btn">
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
        :columns="gridData.columns"
        :data-source="gridData.data"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        :pagination="gridData.pagination"
        @change="onPageChange($event)"
      >
        <span slot="customTitle"><div @click="showDispatchError()">派件</div></span>
        <div
          slot="handleSend"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              v-model="slotProps.sendCheck"
              :disabled="!isDispatch || slotProps.isClose === 'Y'"
            />
          </div>
        </div>
        <div
          slot="handleInfo"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              v-model="slotProps.healthCheck"
            />
          </div>
        </div>
        <div
          slot="handleDoc"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              v-model="slotProps.doctorCheck"
            />
          </div>
        </div>
        <div
          slot="handleForm"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              v-model="slotProps.formCheck"
            />
          </div>
        </div>
        <div
          slot="handleF"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              v-model="slotProps.fCheck"
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
              @click="goCaseMaintain(slotProps)"
            />
          </div>
        </div>
      </a-table>
    </div>
    <div class="btn__wrap text-center">
      <router-link :to="'/occupationSafety/AbnormalLoad/queryOverTime/index'">
        <button class="btn__radius--primary--outline mb-2">
          返回查詢
        </button>
      </router-link>
      <button
        class="btn__radius--primary--outline mb-2"
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
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import ChooseSendNurseModal from '@/components/modal/ChooseSendNurseModal.vue';
import notification from '@/plugins/notification/infoNotification';
import { EmpWoPersonnelListQueryDto, CheckDispatchNurseDto, EmpWoDispatchDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid, ChooseSendNurseModal } })
export default class QueryOverTimeList extends Vue {
  @Action('setLoading') setLoading;

	// table顯示的類別
	tableType = '';

	decrptQuery = null; // 解密查詢條件

	// radio的button選項
	tableTypeOption = [
		{ label: '全部地區', value: '' },
		{ label: '北區', value: 'NORTH' },
		{ label: '中區', value: 'CENTRAL' },
		{ label: '南區', value: 'SOUTH' },
	]

	// 控制派件Modal
	sendModalVisible = false;

	allCheckEmpty = true;

	sendResult: 'success'|'fail' = 'success';

	sendErrMsg = [];

	sendInfo = [];

	isDispatch = false; // 當下操作人員是否可勾選派件

	type = '';

	ownerId = null;

	// 表格欄位名稱資料
  gridData = {
  	rowKey: 'index',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 25,
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
  			dataIndex: 'dept',
  			key: 'dept',
  			title: '單位代號',
  		},
  		{
  			dataIndex: 'deptName',
  			key: 'deptName',
  			title: '單位名稱',
  		},
  		{
  			dataIndex: 'name',
  			key: 'name',
  			title: '姓名',
  		},
  		{
  			dataIndex: 'curStatus',
  			key: 'curStatus',
  			title: '在職狀態',
  			customRender: (data) => ((data === 'Y') ? '在職' : '離職'),
  		},
  		{
  			dataIndex: 'workPlace',
  			key: 'workPlace',
  			title: '工作地點',
  		},
  		{
  			dataIndex: 'year',
  			key: 'year',
  			title: '執行年份',
  		},
  		{
  			dataIndex: 'month',
  			key: 'month',
  			title: '執行月份',
  		},
  		{
  			dataIndex: 'friskLevel',
  			key: 'friskLevel',
  			title: '心血管分級',
  		},
  		{
  			dataIndex: 'workLevel',
  			key: 'workLevel',
  			title: '加班分級',
  		},
  		{
  			dataIndex: 'continuous',
  			key: 'continuous',
  			title: '每月加班>45hr的連續次數(月數)',
  			width: 100,
  		},
  		{
  			dataIndex: 'questionLevel',
  			key: 'questionLevel',
  			title: '問卷分級',
  		},
  		{
  			dataIndex: 'level',
  			key: 'level',
  			title: '綜合分級',
  		},
  		{
  			dataIndex: 'status',
  			key: 'status',
  			title: '執行狀態',
  			// customRender: (data) => {
  			// 	let status;
  			// 	switch (data.status) {
  			// 	case 'E0304':
  			// 		status = '已約';
  			// 		break;
  			// 	case 'E0303':
  			// 		status = '待約';
  			// 		break;
  			// 	case 'E0305':
  			// 		status = '已完成';
  			// 		break;

  			// 	default:
  			// 		status = '-';
  			// 		break;
  			// 	}
  			// 	return status;
  			// },
  		},
  		{
  			dataIndex: 'closeDate',
  			key: 'closeDate',
  			title: '結案日期',
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'healthEduGuidNotificationDate',
  			key: 'healthEduGuidNotificationDate',
  			title: '近期衛教指導通知日',
  			width: 120,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'phyConNotificationDate',
  			key: 'phyConNotificationDate',
  			title: '近期醫師諮詢通知日',
  			width: 120,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'formNotificationDate',
  			key: 'formNotificationDate',
  			title: '近期表單填寫通知日',
  			width: 120,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'fnotificationDate',
  			key: 'fnotificationDate',
  			title: '近期F表填寫通知日',
  			width: 120,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			dataIndex: 'workStatus',
  			key: 'workStatus',
  			title: '班別類型',
  		},
  		{
  			scopedSlots: { customRender: 'handleInfo' },
  			title: '發送衛教指導通知',
  			width: 100,
  			fixed: 'right',
  		},
  		{
  			scopedSlots: { customRender: 'handleDoc' },
  			title: '發送醫師諮詢通知',
  			width: 100,
  			fixed: 'right',
  			align: 'center',
  		},
  		{
  			scopedSlots: { customRender: 'handleForm' },
  			title: '發送表單填寫通知',
  			width: 100,
  			fixed: 'right',
  		},
  		{
  			scopedSlots: { customRender: 'handleF' },
  			title: '發送F表填寫通知',
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

  // 獲取表格資料
  getGridData() {
  	this.setLoading(true);
  	const query = this.decrptQuery;
  	const data: EmpWoPersonnelListQueryDto = {
  		area: this.tableType,
  		classType: query.classType,
  		continuous: query.continuous,
  		dateEnd: query.dateEnd,
  		dateStart: query.dateStart,
  		dept: query.dept,
  		friskLevel: query.friskLevel,
  		id: query.id,
  		level: query.level,
  		name: query.name,
  		questionLevel: query.questionLevel,
  		status: query.status,
  		workLevel: query.workLevel,
  		ownerId: this.ownerId,
  	};
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.getPersonnelListQueryUsingPOST(data, this.gridData.pagination.current - 1, this.gridData.pagination.pageSize)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.gridData.data = resp.data.data.content;
  				this.gridData.data.forEach((element, index) => {
  					this.$set(element, 'index', index);
  					this.$set(element, 'sendCheck', false);
  					this.$set(element, 'healthCheck', false);
  					this.$set(element, 'doctorCheck', false);
  					this.$set(element, 'formCheck', false);
  					this.$set(element, 'fCheck', false);
  				});
  				console.log(this.gridData.data);
  				this.gridData.pagination.total = parseInt(resp.data.data.totalElements);
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 操作錯誤彈窗
  showDispatchError() {
  	InfoModal.alertSuccess({
  		title: '錯誤操作',
  		confirm: false,
  		content: '欲發送通知，請選擇項目後點擊「發送」。 欲派件，請選擇項目後點擊「派件」。',
  	});
  }

  // 個案維護
  goCaseMaintain(slotProps) {
  	// console.log(slotProps);
  	const type: any = 'overload';
  	sessionStorage.setItem('caseMaintainType', JSON.stringify({ tableType: type }));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CaseMaintainList',
  		query: {
  			data: { uid: slotProps.uid },
  			type: 'overload',
  		},
  	});
  }

  getArrangeArr(arr) {
  	const newArr = arr.reduce((a, v, i) => ({ ...a, [v]: [] }), {});
  	this.gridData.data.forEach((element) => {
  		Object.entries(newArr).forEach((el: any) => {
  			if (element[el[0]]) {
  				el[1].push(element);
  				this.allCheckEmpty = false;
  			}
  		});
  	});
  	return newArr;
  }

  // 操作人員是否可派件
  checkDispatch() {
  	const data: CheckDispatchNurseDto = {
  		srcFrom: 'OVERLOAD_PN',
  	};
  	this.setLoading(true);
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

  submit() {
  	// 拿取勾選項目
  	const checkList = this.getArrangeArr(['healthCheck', 'doctorCheck', 'formCheck', 'fCheck']);
  	if (this.allCheckEmpty) {
  		// InfoModal.alertError({ content: '請勾選欲發送通知' });
  		this.showDispatchError();
  		return;
  	}
  	this.submitCheck(checkList);
  }

  // 送出勾選項目
  async submitCheck(array) {
  	const API_KEYS = {
  		getSendFormNotificationUsingPOST: 'formCheck', // 發送表單填寫通知
  		getSendHealthEducationFillingNoticeUsingPOST: 'healthCheck', // 發送衛教填寫通知
  		getSendPhysicianConsultationNotificationUsingPOST: 'doctorCheck', // 發送醫師諮詢通知通知
  		getSendTenYearMentalBurdenScaleNotificationUsingPOST: 'fCheck', // 發送十年心力負荷量表通知
  	};
  	this.setLoading(true);
  	for (const [key, value] of Object.entries(array)) {
  		const checkArr: any = value;
  		const checkKey = key;
  		for (const [key, value] of Object.entries(API_KEYS)) {
  			if (checkArr.length > 0 && value === checkKey) {
  				// eslint-disable-next-line no-await-in-loop
  				await this.$AlRpnAlRpnWorkOvertimeListControllerApi[key](checkArr.map((e) => e.infoId))
  					.then((resp) => {
  						if (resp.data.status !== 200) {
  							this.sendResult = 'fail';
  							this.sendErrMsg.push(this.$global.getApiErrorMsg(resp.data.apiError).join(''));
  						}
  						this.sendInfo.push({ title: checkKey, count: checkArr.length });
  						// console.log(resp);
  						// this.$global.changeRouterAndaddParam({
  						// 	toRouter: 'QueryOverTimeResult',
  						// 	query: {
  						// 		result: resp.data.status === 200 ? 'success' : 'fail',
  						// 		errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  						// 		sendInfo: { title: checkKey, count: checkArr.length },
  						// 	},
  						// });
  					})
  					.catch((error) => {
  						console.log('error status = ', error);
  					})
  					.finally(() => {
  						// this.setLoading(false);
  					});
  			}
  		}
  	}
  	setTimeout(() => {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'QueryOverTimeResult',
  		query: {
  			result: this.sendResult,
  			errorMsg: this.sendErrMsg,
  			sendInfo: this.sendInfo,
  		},
  	});
  	this.setLoading(false);
  	}, 1000);
  	// console.log(arr);
  }

  onClickRadio(e) {
  	this.tableType = e.target.value;
  	console.log(this.tableType);
  	// reset pagination
  	this.gridData.pagination.current = 1;
  	this.gridData.pagination.pageSize = 10;
  	this.getGridData();
  }

  onPageChange(e) {
  	this.gridData.pagination = e;
  	this.getGridData();
  }

  openSendModal() {
  	console.log(this.gridData.data);
  	let openDispatchModal = false;
  	this.gridData.data.forEach((element) => {
  		if (element.sendCheck) {
  			openDispatchModal = true;
  		}
  	});
  	if (openDispatchModal) {
  		this.sendModalVisible = true;
  	} else {
  		this.showDispatchError();
  	}
  }

  closeSendModal() {
  	this.sendModalVisible = false;
  }

  // 送出派件
  toSendModalResult(uid) {
  	const dispatchArr = this.getArrangeArr(['sendCheck']).sendCheck;
  	const dispatchInfoIdArr = dispatchArr.map((e) => e.infoId);
  	const data: EmpWoDispatchDto = {
  		infoId: dispatchInfoIdArr,
  		uid,
  	};
  	this.setLoading(true);
  	// 派件
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.currentMonthMaintainDispatchRUsingPOST(data)
  		.then((resp) => {
  			console.log(resp.data);
  			if (resp.data.status === 200) {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'QueryOverTimeSendModalResult',
  					query: {
  						result: 'success',
  					},
  				});
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'QueryOverTimeSendModalResult',
  					query: {
  						message: this.$global.getApiErrorMsg(resp.data.apiError).join(),
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

  download() {
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.getDownloadCheckHealthInfoUsingPOST(this.decrptQuery, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			console.log(resp);
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
  				this.$AlRpnAlRpnWorkOvertimeListControllerApi.getDownloadCheckHealthInfoUsingPOST(this.decrptQuery)
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
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  async created() {
  	this.type = this.$router.currentRoute.params.type;
  	console.log('type:', this.type);
  	const query = this.$global.getQuery();
  	console.log('query', query);
  	if (this.type == 'todo') {
  		this.ownerId = this.$user.getMe().userId;
  		console.log('ownerId', this.ownerId);
  	}

  	await this.checkDispatch();
  	// this.decrptQuery = JSON.parse(await this.$encryptionDecryption.decrypt(this.$global.getQuery()));
  	this.decrptQuery = query;
  	this.getGridData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
  }
  .iconblock{
		width: 46px;
		height: 32px;
		background-color: $COLOR-MAIN10;
		border-radius: 16px;
		color: $COLOR-MAIN1;
	}
  .btn__wrap {
    margin: 40px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
  }
	.header {
		margin-bottom: 20px;
		.header__radio {
			width: 80%;
			display: flex;
			justify-content:flex-end;
			@include rwd-xl {
				width: 65%;
			}
		}
		.header__btn {
			width: 20%;
			display: flex;
			justify-content: flex-end;
			@include rwd-xl{
				width: 35%;
			}
		}
	}
	::v-deep {
		.ant-radio-button-wrapper {
			min-width: 95px;
			text-align: center;
		}
	}
</style>
