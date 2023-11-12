<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      on-ok="handleOk"
    >
      <template slot="footer">
        <div class="btn__wrap text-center mt-0 mb-4">
          <button
            class="btn__radius--primary"
            @click="onClose"
          >
            返回
          </button>
        </div>
      </template>
      <template slot="title">
        <div class="page__title m-0">
          健檢結果瀏覽
        </div>
      </template>
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="healthCategory__content">
        <!-- 展開收合 - 基本資料 -->
        <!-- <div class="collapse-baseInfo">
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
        </div> -->
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
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { CollapseContent } from '@/components/shared/data-grid/models';
import { HealthCheckItemCodeDto, HealthCheckDownloadInDto } from '@fubonlife/oss-api-axios-sdk';
import CollapseDataGrid from '@/components/shared/data-grid/CollapseDataGrid.vue';

export interface InfoModule {
  colSpan?: string | number[];
  label?: string;
	property?: string;
  value?: string;
}

@Component({ components: { CollapseDataGrid } })
export default class ReportPreviewModal extends Vue {
  @Prop()
  visible: boolean

	@Prop()
	fetchData

  modalVisible = false;

	activeKey = '1';

	// 收合表格資料內容
	healthCheckData: CollapseContent = {}

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

	h = this.$createElement;

	@Watch('fetchData')
	onValChange(val) {
		console.log(val);
		if (val) this.mappingData(val);
	}

	@Watch('visible')
  	onChange(val) {
  	this.modalVisible = val;
  	console.log(val);
  	}

	onClose() {
  	this.$emit('closeModal');
	}

	// arrageData() {
	// 	console.log(this.fetchData);
	// 	// 基本資料
	// 	this.fetchData.forEach((element, index) => {
	// 		if (element.codeName === '基本資料') {
	// 			this.baseInfoGroup = [
	// 				{
	// 					colSpan: [24, 24],
	// 					label: '姓名',
	// 					value: element.name,
	// 				},
	// 				{
	// 					colSpan: [24, 3],
	// 					label: '性別',
	// 					value: element.sex,
	// 				},
	// 				{
	// 					colSpan: [24, 5],
	// 					label: '身分證字號',
	// 					value: element.idNo,
	// 				},
	// 				{
	// 					colSpan: [24, 5],
	// 					label: '出生日期',
	// 					value: element.birthday,
	// 				},
	// 				{
	// 					colSpan: [24, 11],
	// 					label: '部門/單位',
	// 					value: element.dept,
	// 				},
	// 			];
	// 		} else {
	// 			this.healthCheckDto2[element.codeId] = {
	// 				title: element.codeName,
	// 				groupList: [
	// 				],
	// 			};
	// 			// console.log(this.fetchData[0]);
	// 		}
	// 	});
	// 	console.log(this.healthCheckDto2);
	// }

	// 開啟【圖表】彈窗
	handleExportChart(data) {
		// TEST:
		console.log(data);
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

		console.log(this.healthCheckData);

		// TEST:
		// console.log(this.healthCheckData);
	}

	async created() {
  	// console.log(this.visible);
		this.modalVisible = this.visible;
		setTimeout(() => {
			this.mappingData(this.fetchData);
		}, 100);

  	// 子標題所屬欄位需合併其他欄位
  	// this.getColSpan('name_ch');
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
  .healthCategory__block {
    border-bottom: 1px #D1D1D1 solid;
    padding-bottom: 20px;
    margin-bottom: 20px;
    &:last-child {
      border: 0;
    }
  }

  .healthCategory__opt {
    float: left;
    width: 50%;
    // padding: 0 20px;
  }

  .healthCategory__block__title {
    color: $COLOR-MAIN1;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .collapse-baseInfo {
	margin: 20px 0;
	.baseInfo-content {
		padding: 20px 90px;
		.infoBox-item {
			.box-label {
				font-weight: 600;
				color: $COLOR-BLACK;
			}
			h2 {
				font-size: 20px;
			}
		}
	}
}
.collapse-table {
	.collapse-panel:not(:first-of-type) {
		font-weight: 400;
	}
	.ant-collapse {
		border: none;
	}
	.table-forHeader {
		::v-deep {
			.ant-collapse-content {
				border: none;
			}
			.ant-table-placeholder {
				display: none;
			}
			.ant-table-footer {
				padding: 0;
			}
		}
	}

	.table-forBody {
		::v-deep {
			.ant-table-thead {
				display: none;
			}
		}
	}
}

  ::v-deep {
    .ant-collapse-header {
      background: $COLLAPSE-HEADER-BG;
      color: $COLOR-WHITE !important;
      font-weight: 600;
      i {
        color: $COLOR-WHITE !important;
      }
    }
    .cate__modal {
      .ant-modal-header, .ant-modal-body {
        padding: 24px 10%;
        border: 0;
      }
    }
  }
</style>
