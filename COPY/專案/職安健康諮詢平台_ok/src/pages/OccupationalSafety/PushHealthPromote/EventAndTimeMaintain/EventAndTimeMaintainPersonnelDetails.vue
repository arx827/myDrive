<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        該場次報名名單
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small btn__downloadList"
          :disabled="actContent.count === 0"
          @click="goDownloadList"
        >
          <i
            class="os-icon-1 os-icon__downloadList"
            :class="{'os-icon__downloadList--disabled': actContent.count === 0}"
          />
          下載報名人員名單
        </button>
      </div>
    </div>
    <!-- 活動資訊 -->
    <div class="page__card page__card--shadow p-0">
      <div class="page__card__headerTitle">
        活動資訊
      </div>
      <div class="active__info__wrap">
        <a-row class="active__info__item">
          <a-col :span="20">
            <a-row>
              <a-col
                v-for="(item, index) in eventInfoGroup"
                :key="index"
                :span="item.colSpan"
              >
                <div
                  class="info__item__label"
                  :class="{ 'event__info__label': index > 1 }"
                >
                  {{ item.label }}
                </div>
                <div
                  class="info__item__value"
                  :class="{ 'event__info__value': index < 2 }"
                >
                  <template v-if="item.property=='sessionName'">
                    【{{ actContent[item.property] }}】
                  </template>
                  <template v-else-if="typeof item.property=='object'">
                    {{ getAdDate(actContent[item.property[0]]) }}  {{ actContent[item.property[1]] }}~{{ actContent[item.property[2]] }}
                  </template>
                  <template v-else>
                    {{ actContent[item.property] }}
                  </template>
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="4">
            <div class="qrCode_block">
              <img :src="actContent.qrCode">
              <span class="qrCode_text">簽到 QR code</span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 報名名單 -->
    <div class="registrationList__wrap">
      <fbl-data-grid
        class="registrationList__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :scroll="{ x: true }"
      >
        <template #telNo="data">
          <div>
            <div>{{ data.data.telNo.phone }}</div>
            <div>{{ data.data.telNo.email }}</div>
          </div>
        </template>
        <template #action="data">
          <div class="action">
            <button
              class="icon-button icon__edit"
              @click="edit(data.data)"
            >
              <a-icon type="edit" />
            </button>
          </div>
        </template>
        <template #modifyReserve="data">
          <button
            class="table__btn--cancel px-2 py-1"
            @click="cancelRegister(data.data)"
          >
            取消預約
          </button>
        </template>
      </fbl-data-grid>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="goMainPage"
      >
        返回
      </button>
    </div>
    <!-- 取消原因彈窗 -->
    <a-modal
      v-model="cancelModelOpen"
      class="ant-modal-confirm ant-modal-confirm-confirm modal__custom__confirm"
      :title="null"
      :closable="false"
      :footer="null"
      width="474px"
    >
      <div class="ant-modal-confirm-body-wrapper">
        <div class="ant-modal-confirm-body">
          <a-icon
            class="modal__icon modal__icon--error"
            type="exclamation-circle"
            theme="filled"
          />
          <span class="ant-modal-confirm-title">
            <div class="alert__modal__title">確定取消預約嗎？</div>
          </span>
          <div class="ant-modal-confirm-content">
            <p>系統即將取消您的預約，您確定要取消嗎？請選擇取消原因：</p>
            <a-form-model
              ref="ruleForm"
              :model="cancelModalForm"
              :rules="formRules"
              layout="vertical"
            >
              <a-radio-group
                v-model="cancelModalForm.cancelValue"
              >
                <a-radio
                  v-for="item in cancelOption"
                  :key="item.codeId"
                  :style="{display: 'block'}"
                  :value="item.codeDesc"
                >
                  {{ item.codeDesc }}
                </a-radio>
              </a-radio-group>
              <a-form-model-item prop="cancelOther">
                <a-textarea
                  v-if="cancelModalForm.cancelValue === '其他'"
                  v-model="cancelModalForm.cancelOther"
                  placeholder="請簡述取消原因"
                  class="mt-2"
                  :max-length="1000"
                  :auto-size="{ minRows: 1 }"
                  size="large"
                />
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
        <div class="ant-modal-confirm-btns">
          <a-button @click="closeCancelModal">
            取 消
          </a-button>
          <a-button
            class="ant-btn-error"
            :disabled="cancelModalForm.cancelValue.length === 0"
            @click="submitCancelModal"
          >
            確 定
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import { HealthActSingupInfoModel, HealthActSessionPageDto, HealthActSingupDownLoadExcelDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import InfoModal from '@/plugins/notification/infoModal';

export interface InfoModel {
  colSpan?: string;
  label: string;
  property: string | Array<string>;
}

export interface SessionPageInfoModel extends HealthActSessionPageDto {
  rowkey?: number;
  actId?: number;
  actName?: string;
  actDate?: Date;
  actStartTime?: string;
  actEndTime?: string;
}

@Component({ components: { FblDataGrid } })
export default class EventAndTimeMaintainPersonnelDetails extends Vue {
  @Action('setLoading') setLoading;

	cancelModelOpen = false;

	cancelOption: any = [
	];

	cancelModalForm = {
		cancelInfo: {},
		cancelValue: '',
		cancelOther: '',
	}

	formRules = {
		cancelOther: [{ required: true, message: '請填入取消原因' }],
	}

	selected = null;
	/**
   * data
   */

  h = this.$createElement;

  actContent: SessionPageInfoModel = {}

  // 活動資料
	eventInfoGroup: Array<InfoModel> = [
		{
			colSpan: '24',
			label: '',
			property: 'actName',
		},
		{
			colSpan: '24',
			label: '',
			property: 'sessionName',
		},
		{
			colSpan: '10',
			label: '活動日期／時間',
			property: ['actDate', 'actStartTime', 'actEndTime'],
		},
		{
			colSpan: '4',
			label: '活動類型',
			property: 'sessionTypeDesc',
		},
		{
			colSpan: '10',
			label: '目前參加人數',
			property: 'count',
		},
	]

	// 欄位資料
  grid = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: Number(this.$global.getPageArray()[1]),
  		pageSizeOptions: this.$global.getPageArray(),
  		total: 0,
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '報名人姓名',
  			width: 150,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'department',
  			title: '部門/單位',
  			customRender: (data) => this.h('div', {},
  				[
  					this.h('div', {}, data.department || ''),
  					// this.h('div', {}, data.unit || ''),
  				]),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'telNo',
  			template: 'telNo',
  			title: '聯絡電話/信箱',
  			customRender: (data) => this.h('div', {},
  				[
  					this.h('div', {}, data.telNo || ''),
  					this.h('div', {}, data.email || ''),
  				]),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'singupDate',
  			title: '填寫時間',
  			customRender: (data) => this.h('div', {},
  				[
  					this.h('div', {}, data.singupDate ? moment(data.singupDate).format('YYYY/MM/DD') : '- -'),
  					this.h('div', {}, data.singupDate ? moment(data.singupDate).format('HH:mm:ss') : '- -'),
  				]),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'signinDate',
  			title: '簽到時間',
  			customRender: (data) => this.h('div', {},
  				[
  					this.h('div', {}, data.signinDate ? moment(data.signinDate).format('YYYY/MM/DD') : '- -'),
  					this.h('div', {}, data.signinDate ? moment(data.signinDate).format('HH:mm:ss') : '- -'),
  				]),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updName',
  			title: '修改人員/時間',
  			customRender: (data) => this.h('div', {},
  				[
  					this.h('div', {}, data.updName || '- -'),
  					this.h('div', {}, data.updDate ? moment(data.updDate).format('YYYY/MM/DD HH:mm:ss') : '- -'),
  				]),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			template: 'action',
  			title: '',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'modifyReserve',
  			title: '修改預約',
  			width: 120,
  			template: 'modifyReserve',
  		},
  	],
  };

  /**
   * function
   */
  async edit(data) {
  	const { actId, actName } = this.actContent;
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainRegister',
  		params: {
  			type: 'edit',
  		},
  		query: {
  			singupInfoId: data.singupInfoId,
  			actId,
  			actName,
  		},
  	});
  }

  setData() {
  	this.setLoading(true);
  	const { actContent } = this.$global.getQuery();
  	const { sessionId } = actContent;
  	this.actContent = actContent;
  	const $searchModel: HealthActSingupInfoModel = {
  		pageNo: 0,
  		pageSize: 100,
  		sessionId,
  		// TEST:
  		// sessionId: 1,
  	};
  	this.$PHPRpnEventRegistrationListApi.getHealthActSingUpInfoPageRUsingPOST($searchModel)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				const { content } = getData;
  				this.grid.data = content;
  				this.grid.data.map((item, index) => {
  					item.rowkey = index + 1;
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  goDownloadList() {
  	this.setLoading(true);
  	const {
  		actId, sessionId, actName, sessionName,
  	} = this.actContent;
  	const downloadName = `${actName}【${sessionName}】_報名人員名單.xlsx`;

  	const $search: HealthActSingupDownLoadExcelDto = {
  		actId,
  		fileName: downloadName,
  		sessionId,
  	};
  	this.$PHPRpnEventRegistrationListApi.healthActSingupDownloadExcelRUsingPOST($search, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(resp.data as Blob, `${downloadName}.xlsx`);
  			} else {
  				this.$PHPRpnEventRegistrationListApi.healthActSingupDownloadExcelRUsingPOST($search)
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

  // 回到活動與場次維護頁面
  goMainPage() {
  	this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  }

  getAdDate(date) {
  	const adDate = this.$adDateFormatter.stringify(date);
  	let weekday = '';
  	switch (moment(date).format('d')) {
  	  case '0':
  		  weekday = '日';
  		  break;
  	  case '1':
  		  weekday = '一';
  		  break;
  	  case '2':
  		  weekday = '二';
  		  break;
  	  case '3':
  		  weekday = '三';
  		  break;
  	  case '4':
  		  weekday = '四';
  	  	break;
  	  case '5':
  		  weekday = '五';
  		  break;
  	  case '6':
  		  weekday = '六';
  		  break;
  	}
  	return `${adDate}(${weekday})`;
  }

  cancelRegister(event) {
  	this.cancelModelOpen = true;
  	this.selected = event;
  }

  // 查詢取消原因
  getReason() {
  	this.$PCREmpPhysicianConsultControllerApi.cancelReasonQueryListUsingPOST()
  		.then((resp) => {
  			console.log(resp);
			  this.cancelOption = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
  }

  // 取消送出
  submitCancelModal() {
  	if (this.cancelModalForm.cancelValue === '其他') {
  		(this.$refs.ruleForm as any).validate((valid) => {
  			if (valid) {
  				this.callCancelAPI();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  		});
  	} else {
  		this.callCancelAPI();
  	}
  }

  // API:取消報名
  callCancelAPI() {
  	console.log('this.selected:', this.selected);
  	this.setLoading(true);
  	const reason = this.cancelModalForm.cancelValue === '其他' ? this.cancelModalForm.cancelOther : this.cancelModalForm.cancelValue;
  	this.$PHPEmpHealthActSignupApi.cancelSingupInfoUsingPOST({ singupInfoId: this.selected.singupInfoId, cancelReason: reason })
  		.then((resp: any) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.cancelModelOpen = false;
  				notification.success({ content: '取消成功!' });
  				// this.refreshCard();
  				// setTimeout(() => {
  				// 	location.reload();
  				// }, 500);
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

  // 關閉取消彈窗
  closeCancelModal() {
  	this.cancelModelOpen = false;
  	this.cancelModalForm = {
  		cancelInfo: {},
  		cancelValue: '',
  		cancelOther: '',
  	};
  }

  /**
   * Hook
   */
  created() {
  	this.setData();
  	this.getReason();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  // 活動資訊
  .info__item__label {
    font-size: 16px;
    line-height: 32px;
    font-weight: 600;
    color: $COLOR-BLACK;
  }
  .event__info__label {
    padding-top: 10px ;
  }
  .info__item__value {
    font-size: 18px;
    line-height: 25px;
    color: $COLOR-GRAY1;
  }
  .event__info__value {
    color: $COLOR-MAIN1 !important;
    font-weight: 600 !important;
    font-size: 18px !important;
  }
  .qrCode_block {
    width: 103px;
    height: 103px;
    text-align: center;
  }
    .qrCode_text {
    color: $COLOR-GRAY1;
    font-size: 14px;
    font-weight: 600;
  }
  .active__info__wrap {
    padding: 30px 92px;
  }
  // 報名名單
  .registrationList__wrap {
    margin-top: 20px;
  }
  ::v-deep {
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 7px 16px;
      word-break: keep-all;
      color: $COLOR-GRAY1;
    }
    .ant-table-thead > tr > th span{
      font-weight: 600;
    }
    .query__wrap-result{
      padding-bottom: 70px;
    }
  }
  // 返回按鈕
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
	.btn__downloadList {
		display: flex;
		align-items: center;
	}
	.table__btn--cancel {
    color: #F46A6A;
    background: #FFEBEB;
    border-radius: 16px;
    border: 0;
    &:hover {
      color: #FFFFFF;
      background: #F46A6A;
			cursor: pointer;
    }
  }
</style>
