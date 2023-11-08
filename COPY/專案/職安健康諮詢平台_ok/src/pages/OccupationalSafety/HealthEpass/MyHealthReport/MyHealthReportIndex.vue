<template>
  <div>
    <div class="container">
      <div class="healthReportPg-header__wrap">
        <div class="page__title">
          我的健檢資料
        </div>
        <!-- pc、平板 按鈕 -->
        <div class="pc--btn__wrap">
          <button
            class="btn__radius--primary--outline--small btn-search"
            @click="showAdvancedSearchModal"
          >
            進階查詢
          </button>
          <a-dropdown>
            <a-menu
              slot="overlay"
              class="healthCheck-download__wrap"
            >
              <a-menu-item
                v-for="item in pcBtnOpts"
                :key="item.value"
                :value="item.value"
                :disabled="item.isDisabled"
              >
                {{ item.label }}
                <button
                  class="icon-button icon__download"
                  @click="downloadPDF(item)"
                >
                  <a-icon type="download" />
                </button>
              </a-menu-item>
            </a-menu>
            <a-button class="btn-dropdown">
              下載健檢資料 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <!-- 手機板 按鈕 -->
        <a-dropdown class="phone--btn__wrap">
          <a-menu
            slot="overlay"
            class="healthCheck-download__wrap"
          >
            <a-menu-item
              v-for="item in phoneBtnOpts"
              :key="item.value"
              :value="item.value"
              :disabled="item.isDisabled"
              @click="showAdvancedSearchModal"
            >
              {{ item.label }}
              <button
                v-if="item.isDisabled"
                class="icon-button icon__download"
                @click="downloadPDF(item)"
              >
                <a-icon type="download" />
              </button>
            </a-menu-item>
          </a-menu>
          <div>
            <a-icon type="ellipsis" />
          </div>
        </a-dropdown>
      </div>
      <div class="healthReportPg-body__wrap">
        <div class="page__banner">
          <img
            class="img-girl__bg"
            src="~@images/image_girlBackground.svg"
            alt=""
          >
          <img
            class="img-girl"
            src="~@images/image_girl.svg"
            alt=""
          >
        </div>
        <div class="page-collapse__wrap">
          <!-- 展開收合 - 基本資料 -->
          <div class="collapse-baseInfo">
            <a-collapse v-model="activeKey">
              <a-collapse-panel
                key="1"
                header="基本資料"
              >
                <div class="baseInfo-content">
                  <a-row
                    :gutter="[16, 16]"
                  >
                    <a-col
                      v-for="(item, index) in baseInfoGroup"
                      :key="index"
                      class="infoBox-item"
                      :xs="item.colSpan[0]"
                      :md="item.colSpan[1]"
                    >
                      <div class="box-label">
                        {{ item.label }}
                      </div>
                      <h2>{{ item.value }}</h2>
                    </a-col>
                  </a-row>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <!-- 展開收合 - 健檢資料 -->
          <div class="collapse-table">
            <CollapseDataGrid
              :row-key="gridData.rowKey"
              :columns="gridData.columns"
              :data="gridData.data"
              :collapse-content-data="healthCheckData"
              :pagination="false"
            >
              <template v-slot:handleTemp="slotProps">
                <div
                  v-show="slotProps.childSlotProps.isChart=='Y'"
                  slot="handleTemp"
                  class="table-btn__wrap icon-button"
                  @click="handleExportChart(slotProps.childSlotProps)"
                >
                  <i class="icon-button os-icon__barChart" />
                </div>
              </template>
            </CollapseDataGrid>
          </div>
        </div>
      </div>
    </div>
    <AdvancedSearchModal
      ref="AdvancedSearchModal"
      :user-id="userId"
      :visible="advancedSearchModalVisible"
      :modal-title="'進階查詢'"
      @closeModal="closeAdvancedSearchModal"
      @backToModal="backToModal"
    />

    <LineChartModal
      :visible="lineChartModalVisible"
      :modal-info="modalInfo"
      @closeModal="closeLiChartModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import AdvancedSearchModal from '@/pages/OccupationalSafety/HealthEpass/MyHealthReport/AdvancedSearchModal.vue';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import CollapseDataGrid from '@/components/shared/data-grid/CollapseDataGrid.vue';
import { CollapseContent } from '@/components/shared/data-grid/models';
import { HealthCheckItemCodeDto, HealthCheckDownloadInDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import LineChartModal from '@/pages/OccupationalSafety/HealthEpass/MyHealthReport/LineChartModal.vue';

require('bootstrap/js/dist/modal');

export interface InfoModule {
  colSpan?: string | number[];
  label?: string;
	property?: string;
  value?: string;
}

@Component({ components: { AdvancedSearchModal, LineChartModal, CollapseDataGrid } })
export default class MyHealthReport extends Vue {
	@Action('setLoading') setLoading;

	h = this.$createElement;

	activeKey = '1';

	modalInfo = null;

	// 【進階查詢】彈窗開關
	advancedSearchModalVisible = false;

	// 【歷年趨勢圖】彈窗開關
	lineChartModalVisible = false;

	// 基本資料
	baseInfoGroup: Array<InfoModule> = [
		{
			colSpan: [24, 24],
			label: '姓名',
			property: 'name',
		},
		{
			colSpan: [24, 3],
			label: '性別',
			property: 'sex',
		},
		{
			colSpan: [24, 5],
			label: '身分證字號',
			property: 'idNo',
		},
		{
			colSpan: [24, 5],
			label: '出生日期',
			property: 'birthday',
		},
		{
			colSpan: [24, 11],
			label: '部門/單位',
			property: 'dept',
		},
	]

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
				title: '近期第一次健檢',
  			dataIndex: 'oneCheck',
  			key: 'oneCheck',
  			width: 150,
				customRender: (data) => {
					if (data) {
						return data.abnormalStatus === 'Y' ? this.h('div', { style: { color: 'red' } }, data.checkValue) : data.checkValue;
					} return '';
				},
  		},
  		{
				title: '近期第二次健檢',
  			dataIndex: 'twoCheck',
  			key: 'twoCheck',
  			width: 150,
				customRender: (data) => {
					if (data) {
						return data.abnormalStatus === 'Y' ? this.h('div', { style: { color: 'red' } }, data.checkValue) : data.checkValue;
					}
					return '';
				},
  		},
  		{
				title: '近期第三次健檢',
  			dataIndex: 'threeCheck',
  			key: 'threeCheck',
  			width: 150,
				customRender: (data) => {
					if (data) {
						return data.abnormalStatus === 'Y' ? this.h('div', { style: { color: 'red' } }, data.checkValue) : data.checkValue;
					}
					return '';
				},
  		},
  		{
  			title: '趨勢圖',
				template: 'handleTemp',
  			width: 80,
  		},
  	],
	}

	// 收合表格資料內容
	healthCheckData: CollapseContent = {}

	// pc-右上按鈕下拉選單
	pcBtnOpts = [
		{
  		value: '0',
  		label: '所有近三次健檢',
			isDisabled: true,
  	},
  	{
  		value: '1',
  		label: '近期第一次健檢',
			isDisabled: true,
  	},
  	{
  		value: '2',
  		label: '近期第二次健檢',
			isDisabled: true,
  	},
  	{
  		value: '3',
  		label: '近期第三次健檢',
			isDisabled: true,
  	},
	];

	// 手機板-右上按鈕下拉選單
	phoneBtnOpts = [{ value: 'search', label: '進階查詢', isDisabled: false }, ...this.pcBtnOpts];

	// 使用者代碼
	userId = null;

	/**
	 * Func
   */
	// 關閉【進階查詢】彈窗
	closeAdvancedSearchModal() {
		this.advancedSearchModalVisible = false;
	}

	// API: 查詢健檢資料
	getHealthCheckInfo() {
		this.setLoading(true);
		this.$HEEmpMyHealthCheckApi.getHealthCheckInfoUsingPOST([0])
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
  				this.$infoNotification.error({
  					content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成查詢項目，請再次嘗試。',
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 下載健檢資料
	downloadPDF({ label, value }) {
		const $payLoad: HealthCheckDownloadInDto = {
			checkData: value,
		};
		this.setLoading(true);
		this.$HEEmpMyHealthCheckApi.healthCheckDownloadPdfUsingPOST($payLoad, { responseType: 'blob' })
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
  				this.$HEEmpMyHealthCheckApi.healthCheckDownloadPdfUsingPOST($payLoad)
  					.then((resp) => {
							const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).apiError;
							this.$infoNotification.error({
								content: apiErrorMsg ? this.$global.getApiErrorMsg(apiErrorMsg.apiError).join('') : '無法完成下載項目，請再次嘗試。',
							});
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
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 開啟【圖表】彈窗
	handleExportChart(data) {
		// TEST:
		console.log(data);
		this.modalInfo = data;
		this.lineChartModalVisible = true;
	}

	// 關閉【圖表】彈窗
	closeLiChartModal() {
		this.lineChartModalVisible = false;
	}

	// mapping 成前端的資料格式
	mappingData(respData: Array<HealthCheckItemCodeDto>) {
		const obj = {};
		respData.forEach((dto) => {
			const { codeId, codeName, detailDto } = dto;
			if (codeName == '基本資料') {
				this.baseInfoGroup = this.baseInfoGroup.map((item) => {
					const { property, ...other } = item;
					return {
						value: dto[property],
						...other,
					};
				});
			} else {
				Object.assign(obj, {
					[codeId]: {
						title: codeName,
						subTitle: '',
						rowDataList: detailDto,
					},
				});
			}
		});

		this.healthCheckData = obj;

		// TEST:
		// console.log(this.healthCheckData);
	}

	// 開啟【進階查詢】彈窗
	showAdvancedSearchModal() {
		(this.$refs.AdvancedSearchModal as any).resetDataGrid();
		this.advancedSearchModalVisible = true;
	}

	// 返回【進階查詢】彈窗
	backToModal() {
		this.advancedSearchModalVisible = true;
	}

	/**
	 * Hook
   */
	created() {
		this.getHealthCheckInfo();
		this.userId = JSON.parse(sessionStorage.getItem('login_state')).me.userId;
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
.healthReportPg-header__wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;
	.page__title {
		margin: 0;
	}
}
.healthReportPg-body__wrap {
	margin-bottom: 80px;
}

.page__banner {
	position: relative;
	padding-top: 55px;
	margin-bottom: 20px;
	.img-girl__bg {
		background-repeat: no-repeat;
		width: 100%;
	}
	.img-girl {
		position: absolute;
		top: 0;
    right: calc((100% - 188px) / 2);
	}
}

.collapse-baseInfo {
	margin: 20px 0;
	.baseInfo-content {
		padding: 20px;
		@include rwd-sm {
			padding: 20px 70px;
		}
		@include rwd-xl {
			padding: 20px 90px;
		}
		.infoBox-item {
			.box-label {
				font-weight: 600;
				color: $COLOR-BLACK;
			}
			h2 {
				font-size: 16px;
				margin: 0;
				@include rwd-xl {
					font-size: 20px;
				}
			}
		}
	}
}

.icon-button:not(:first-of-type) {
  margin-left: 10px;
}
.pc--btn__wrap {
	margin: 0;
	display: none;
	@include rwd-sm {
		display: flex;
	}
	button {
		padding: 5px 0;
		height: 40px;
		margin-right: 10px;
	}
	.btn-search {
		width: 110px;
		font-size: 14px;
		@include rwd-xl {
			font-size: 16px;
		}
	}
	.healthCheck-download__wrap {
		width: 200px;
		color: $COLOR-MAIN1;
		font-size: 16px;
		font-weight: 600;
	}
	.btn-dropdown {
		height: 40px;
		border: 1px solid $COLOR-MAIN1;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 200px;
		color: $COLOR-MAIN1;
		font-size: 16px;
		font-weight: 600;
	}
}

.phone--btn__wrap {
	cursor: pointer;
	@include rwd-sm {
		display: none;
	}
}

.icon__download {
	margin-left: 10px;
	background: $BUTTON-BG-LIGHT-BLUE;
	color: $BUTTON-MAIN;
	cursor: pointer;
	&:focus, &:hover {
		background: $BUTTON-MAIN;
		color: $COLOR-WHITE;
	}
	svg {
		font-size: 23px;
	}
}

.table-btn__wrap {
	background: $BUTTON-BG-BLUE;
}

::v-deep {
	.ant-collapse > .ant-collapse-item:last-child, .ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header {
		border-radius: 0;
	}
	.ant-collapse-header {
		background: $COLLAPSE-HEADER-BG;
		color: $COLOR-WHITE !important;
		font-weight: 600;
		font-size: 16px;
		i {
			color: $COLOR-WHITE !important;
		}
	}
	.ant-collapse-content-box {
		padding: 0;
	}
	.anticon-ellipsis {
		svg {
			font-size: 25px;
		}
	}
}

</style>

<style lang="scss">
// 針對 antd 產生的下拉框 調整 (因為生成在app層，不在component裡，故寫成全域，className為自定義)
.healthCheck-download__wrap {
	padding: 0;
	.ant-dropdown-menu-item {
		font-size: 14px;
		padding: 8px 15px;
		@include rwd-xl {
			font-size: 16px;
		}
		&:hover {
			background-color: $BUTTON-BG-LIGHT-BLUE !important;
		}
		&:not(:last-of-type) {
			border-bottom: 1px solid rgba($color: $COLOR-BLACK, $alpha: .17);
		}
	}
	.ant-dropdown-menu-item-disabled {
		cursor: default;
		color: $COLOR-BLACK;
		&:hover {
			background-color: $COLOR-WHITE !important;
		}
	}
}
</style>
