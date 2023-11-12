<template>
  <div>
    <a-modal
      ref="previewModal"
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="handleClose"
      :footer="null"
      :width="'80%'"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="previewModal__wrap">
        <div class="previewModal-header__wrap no-print">
          <h1 class="previewModal__title">
            健檢結果瀏覽
          </h1>
        </div>
        <div class="previewModal-result__wrap">
          <CollapseDataGrid
            :row-key="gridData.rowKey"
            :columns="gridData.columns"
            :data="gridData.data"
            :collapse-content-data="healthCheckData"
            :pagination="false"
          />
        </div>
        <div class="modal-btn__wrap text-center">
          <button
            class="btn__radius--primary--bg--small"
            @click="handlePrev"
          >
            返回
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import CollapseDataGrid from '@/components/shared/data-grid/CollapseDataGrid.vue';
import moment from 'moment';
import { CollapseContent } from '@/components/shared/data-grid/models';
import { HealthCheckItemCodeDto, HealthCheckDownloadInDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { CollapseDataGrid } })
export default class PreviewModal extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

	@Prop()
  infoId: number[]

  @Prop()
  visible: boolean

  modalVisible = false;

  activeKey = '';

  // TEST: 假資料
	healthCheckData: CollapseContent = {}

	// ===================================== Grid ========================================================
	gridData = {
  	rowKey: 'rowkey',
  	data: {},
  	columns: [
  		{
  			title: '健檢項目(中文)',
  			dataIndex: 'caName',
  			key: 'caName',
  			width: 200,
  		},
  		{
				title: '健檢項目(英文)',
  			dataIndex: 'enName',
  			key: 'enName',
  			width: 150,
  		},
  		{
  			title: '正常值',
  			dataIndex: 'normal',
  			key: 'normal',
  			width: 150,
				customRender: (data) => {
					if (data) {
						return	this.h('ul', data.map((i) => this.h('li', i)));
					} return '';
				},
  		},
  		{
				title: '健檢結果',
  			dataIndex: 'oneCheck',
  			key: 'oneCheck',
  			width: 150,
				customRender: (data) => {
					if (data) {
						return data.abnormalStatus === 'Y' ? this.h('div', { style: { color: 'red' } }, data.checkValue) : data.checkValue;
					} return '';
				},
  		},
  	],
	}

	/**
   * Func
   */
	// API: 查詢健檢資料
	getHealthCheckInfo() {
		this.setLoading(true);
		this.$HEEmpMyHealthCheckApi.getHealthCheckInfoUsingPOST(this.infoId)
			.then((resp) => {
  			if (resp.data.status == 200) {
					const getData = resp.data.data;
					if (getData) {
						// TEST:
						// console.log(getData);
						this.mappingData(getData);
					}
  			} else {
  				const getError = resp.data;
					this.handlePrev();
  				this.$infoNotification.error({
  					content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成查詢項目，請再次嘗試。',
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
				this.handlePrev();
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// mapping 成前端的資料格式
	mappingData(respData: Array<HealthCheckItemCodeDto>) {
		const obj = {};
		respData.splice(respData.indexOf(respData.find((i) => i.codeName == '基本資料')), 1);
		respData.forEach((dto) => {
			const { codeId, codeName, detailDto } = dto;
			Object.assign(obj, {
				[codeId]: {
					title: codeName,
					subTitle: '',
					rowDataList: detailDto,
				},
			});
		});

		this.healthCheckData = obj;
		// TEST:
		// console.log(this.healthCheckData);
	}

	/**
   * Event
   */
	handleClose() {
  	this.$emit('closeModal');
	}

	handlePrev() {
  	this.$emit('goToPrevModal');
	}

	/**
   * Hook
   */
	// created() {

	// }

  @Watch('visible')
	onChange(val) {
  	this.modalVisible = val;
		if (val) {
			this.getHealthCheckInfo();
		}
	}
}
</script>

<style lang="scss" scoped>
  .previewModal__title{
    font-weight: 600;
    font-size: 30px;
  }
  .previewModal-result__wrap {
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
</style>
