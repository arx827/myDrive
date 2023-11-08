<template>
  <div class="container">
    <div class="page__title">
      我的預約
    </div>
    <div class="page__banner__wrap">
      <img
        class="bannerImg"
        src="~@images/image_reserve.svg"
        alt=""
      >
    </div>
    <div class="reservation__row mb-0 pb-2 d-none d-md-flex row">
      <div class="col-2">
        預約日期
      </div>
      <div class="col-3">
        預約時段
      </div>
      <div class="col-2">
        值班醫師
      </div>
      <div class="col-2">
        預約地點
      </div>
      <div class="col-3" />
    </div>
    <div
      v-for="(data,index) in gridData.data"
      :key="index"
      class="reservation__row row bg__light"
    >
      <div class="col-12 col-md-2 d-flex justify-content-between">
        <div class="fw-bold d-md-none">
          預約日期
        </div>
        <div>{{ data.reserveDate }}</div>
      </div>
      <div class="col-12 col-md-3 d-flex justify-content-between">
        <div class="fw-bold d-md-none">
          預約時段
        </div>
        <div>{{ data.sessionStartDate }} ~ {{ data.sessionEndDate }}</div>
      </div>
      <div class="col-12 col-md-2 d-flex justify-content-between">
        <div class="fw-bold d-md-none">
          值班醫師
        </div>
        <div>{{ data.physicianName }}</div>
      </div>
      <div class="col-12 col-md-2 d-flex justify-content-between">
        <div class="fw-bold d-md-none">
          預約地點
        </div>
        <div>{{ data.reserveLoction }}</div>
      </div>
      <div class="col-12 col-md-3">
        <button
          class="cancelButton"
          :class="{
            'cancelButton--disabled': data.cancle === 'N',
          }"
          @click="handleCancel(data)"
        >
          取消預約
        </button>
      </div>
    </div>
    <div class="d-none d-md-block text-end mb-5">
      <a-pagination
        show-size-changer
        :total="gridData.pagination.total"
        :page-size-options="gridData.pagination.pageSizeOptions"
        @change="onPageChange"
        @showSizeChange="onShowSizeChange"
      />
    </div>
    <div
      v-if="gridData.pagination.total > 10"
      class="d-md-none text-center overflow-hidden mb-5"
    >
      <button
        class="btn__radius--gray--outline--small w-100"
        @click="onMPageChange"
      >
        <a-icon
          class="float-start"
          type="down"
        />
        查看更多
      </button>
    </div>
    <!-- <FblDataGrid
      v-if="gridData.data"
      :class-name="'custom__table'"
      :row-key="gridData.rowKey"
      :columns="gridData.columns"
      :data="gridData.data"
      :pagination="gridData.pagination"
      :empty-data="gridData.data.length <= 0"
      @tableChange="onPageChange($event)"
    >
      <template v-slot:handleTemp="slotProps">
        <button
          class="cancelButton"
          :class="{
            'cancelButton--disabled': slotProps.data.cancle === 'N',
          }"
          @click="handleCancel(slotProps)"
        >
          取消預約
        </button>
      </template>
    </FblDataGrid> -->

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
            <p>系統即將取消您的醫生諮詢預約，您確定要取消嗎？請選擇取消原因：</p>
            <a-form-model
              ref="ruleForm"
              :model="cancelModalForm"
              :rules="formRules"
              layout="vertical"
            >
              <a-form-model-item prop="cancelValue">
                <a-radio-group
                  v-model="cancelModalForm.cancelValue"
                >
                  <a-radio
                    v-for="item in cancelOption"
                    :key="item.codeId"
                    :value="item.codeDesc"
                  >
                    {{ item.codeDesc }}
                  </a-radio>
                </a-radio-group>
                <a-form-model-item
                  v-if="cancelModalForm.cancelValue === '其他'"
                  prop="cancelOther"
                >
                  <a-textarea
                    v-model="cancelModalForm.cancelOther"
                    placeholder="請簡述取消原因"
                    class="mt-2"
                    :max-length="1000"
                    :auto-size="{ minRows: 1 }"
                    size="large"
                  />
                </a-form-model-item>
              </a-form-model-item>
            </a-form-model>
            <!-- <div v-if="isComfirm && cancelModalForm.cancelValue"></div> -->
          </div>
        </div>
        <div class="ant-modal-confirm-btns">
          <a-button @click="closeCancelModal">
            取 消
          </a-button>
          <a-button
            class="ant-btn-error"
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
import {
	FblColumnType,
	FblPageEvent,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import InfoNotification from '@/plugins/notification/infoNotification';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
	components: { FblDataGrid },
})
export default class DoctorConsultIndex extends Vue {
	@Action('setLoading') setLoading;

	// 欄位資料
	gridData = {
		rowKey: 'reserveInfoId',
		data: null,
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
				type: FblColumnType.PLAIN,
				property: 'reserveDate',
				title: '預約日期',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'sessionStartDate',
				title: '預約時段',
				formatter: (data) => `${data.sessionStartDate}~${data.sessionEndDate}`,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'physicianName',
				title: '值班醫師',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'reserveLoction',
				title: '預約地點',
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleTemp',
				width: 130,
				align: 'center',
			},
		],
	};

	cancelModelOpen = false;

	cancelOption: any = [
	];

	cancelModalForm = {
		cancelInfo: {},
		cancelValue: '',
		cancelOther: '',
	}

	uid = null;

	seletedReserveInfoId = null;

	formRules = {
  	cancelOther: [{ required: true, message: '請填入取消原因' }],
		cancelValue: [{ required: true, message: '請選擇取消原因' }],
	}

	/**
	 * Func
	 */
	getGridData() {
		this.setLoading(true);
		this.$PCREmpPhysicianConsultControllerApi.getReserveInfoDataUsingPOST(this.gridData.pagination.current - 1, this.gridData.pagination.pageSize, this.uid)
			.then((resp) => {
  			console.log(resp);
				if (resp.data.status === 200) {
					this.gridData.data = resp.data.data.content;
					this.gridData.pagination.total = parseInt(resp.data.data.totalElements);
				} else {
					InfoNotification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	onShowSizeChange(current, pageSize) {
		console.log(current, pageSize);
		this.gridData.pagination.current = current;
		this.gridData.pagination.pageSize = pageSize;
		this.getGridData();
	}

	onPageChange(current) {
		this.gridData.pagination.current = current;
		this.getGridData();
	}

	onMPageChange() {
		this.gridData.pagination.current++;
		this.getGridData();
	}

	/**
	 * Event
	 */
	handleCancel(data) {
		if (data.cancle === 'N') return;

		this.seletedReserveInfoId = data.reserveInfoId;

		this.cancelModelOpen = true;
	}

	// 取消預約原因彈窗，『取消』
	closeCancelModal() {
		this.seletedReserveInfoId = null;
		this.cancelModelOpen = false;
		this.cancelModalForm = {
			cancelInfo: {},
			cancelValue: '',
			cancelOther: '',
		};
	}

	// 取消預約原因彈窗，『確定』
	submitCancelModal() {
		(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
				this.cancelAPI();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
	}

	// 取消預約API
	cancelAPI() {
		this.setLoading(true);
		const reason = this.cancelModalForm.cancelValue === '其他' ? this.cancelModalForm.cancelOther : this.cancelModalForm.cancelValue;

		this.$PCREmpPhysicianConsultControllerApi.getCancelReasonAppointmentUsingPOST({
			cancelReason: reason,
			reserveInfoId: this.seletedReserveInfoId,
		})
			.then((resp) => {
				this.$global.changeRouterAndaddParam({
					toRouter: 'MyReservationResult',
					query: {
						result: resp.data.status === 200 ? 'success' : 'error',
						errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
					},
				});
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 查詢取消原因
	getReason() {
		this.$PCREmpPhysicianConsultControllerApi.cancelReasonQueryListUsingPOST()
			.then((resp) => {
  			this.cancelOption = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
	}

	// onPageChange(e) {
	// 	this.gridData.pagination = e.pagination;
	// 	this.getGridData();
	// }

	/**
	 * Hook
	 */
	created() {
		this.uid = this.$user.getMe().userId;
		this.getGridData();
		this.getReason();
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
.page__title {
	margin-bottom: 30px;
}
.page__banner__wrap {
	position: relative;
	background: $COLOR-GRAY7;
	height: 85px;
	border-radius: 8px;
	margin-bottom: 10px;
	.bannerImg {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}
}
.cancelButton {
	font-size: 16px;
	line-height: 1.3;
	color: $COLOR-MAIN17;
	background: $COLOR-MAIN20;
	border: 0;
	border-radius: 50vh;
	padding: 5px 10px;
	margin: 0 auto;
	display: block;
	&.cancelButton--disabled {
		color: $COLOR-GRAY10;
		background: $COLOR-MAIN9;
	}
	&:not(.cancelButton--disabled) {
		cursor: pointer;
		&:hover {
			color: $COLOR-WHITE;
			background: $COLOR-MAIN17;
		}
	}
	@include media-breakpoint-down('md') {
		padding: 5px 50px;
	}
}

.reservation__row {
	padding: 20px 10px;
	border-radius: 10px;
	margin: 0 0 20px 0;
	line-height: 2;
}

::v-deep {
	.ant-radio-group {
		.ant-radio-wrapper {
			display: block;
			+ .ant-radio-wrapper {
				margin-top: 10px;
			}
		}
	}
	.ant-radio-checked {
		.ant-radio-inner {
			border-color: $COLOR-MAIN15;
			&::after {
				background-color: $COLOR-MAIN15;
			}
		}
	}
	.ant-radio-wrapper:hover .ant-radio,
	.ant-radio:hover .ant-radio-inner,
	.ant-radio-input:focus + .ant-radio-inner {
		border-color: $COLOR-MAIN15;
	}
}

</style>
