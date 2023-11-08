<template>
  <div>
    <div class="container">
      <div class="page__title">
        健檢數值維護
      </div>
      <div class="healthValue-topPanel__wrap">
        <div class="d-flex align-items-center">
          <h3>年度</h3>
          <a-select
            v-model="period"
            :options="yearOpts"
            :show-arrow="true"
            class="select__year"
            @change="getGridData"
          />
        </div>
        <div class="healthValue__btnGroup">
          <button
            class="btn__radius--primary--outline--small"
            @click="conversionModalVisible = true"
          >
            分級對應表
          </button>
          <button
            class="btn__radius--primary--outline--small"
            @click="advancedSearchModalVisible = true"
          >
            進階查詢
          </button>
          <button
            class="btn__radius--primary--outline--small"
            @click="handleAdd"
          >
            新增
          </button>
        </div>
      </div>
      <div class="healthValue__wrap">
        <a-table
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data-source="gridData.data"
          class="components-table-demo-nested"
        >
          <template
            slot="handleSwitch"
            slot-scope="slotProps"
          >
            <a-switch
              v-model="slotProps.enabled"
              checked-children="啟用"
              un-checked-children="停用"
              @change="handleChangeStatus(slotProps)"
            />
          </template>
          <div
            slot="handleTemp"
            slot-scope="slotProps"
            class="d-flex"
          >
            <button
              class="icon-button icon__edit"
              :class="{'icon__edit--disabled': !slotProps.enabled}"
              :disabled="!slotProps.enabled"
              @click="handleEdit(slotProps)"
            >
              <a-icon type="edit" />
            </button>
          </div>
          <a-table
            slot="expandedRowRender"
            slot-scope="slotProps"
            :row-key="innerGridData.rowKey"
            :columns="innerGridData.columns[`type${slotProps.showType}`]"
            :data-source="innerGridData.data[slotProps.valueId]"
            :pagination="false"
          >
            <template
              slot="normalVal"
              slot-scope="innerSlotProps"
            >
              <div>{{ innerSlotProps.normalMin }}~{{ innerSlotProps.normalMax }}</div>
            </template>
            <template
              slot="rangeVal"
              slot-scope="innerSlotProps"
            >
              <div>{{ innerSlotProps.minRange }}~{{ innerSlotProps.maxRange }}</div>
            </template>
          </a-table>
        </a-table>
      </div>
    </div>
    <ConversionTableModal
      :visible="conversionModalVisible"
      :modal-title="'分級對應表'"
      :period="period"
      @closeCateModal="closeConversionModal"
    />
    <AdvancedSearchModal
      :visible="advancedSearchModalVisible"
      :period="period"
      :modal-title="'進階查詢'"
      @closeCateModal="closeAdvancedSearchModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AdvancedSearchModal from '@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/AdvancedSearchModal.vue';
import ConversionTableModal from '@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/ConversionTableModal.vue';
import { HealthCheckValuesModel } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

require('bootstrap/js/dist/modal');

export interface searchModule {
  key: string | Array<string>; // 屬性名稱
  label: string; // 標籤
  colSpan?: string; // 佔多少網格
  type: string; // 類型 (輸入框 / 下拉選單 / 單選框 ... )
}
@Component({ components: { ConversionTableModal, AdvancedSearchModal } })
export default class HealthValueMaintainList extends Vue {
	@Action('setLoading') setLoading

	h = this.$createElement;

	advancedSearchModalVisible = false;

	conversionModalVisible = false;

	yearOpts = [];

	period = null;

  // 父層 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			title: '類別',
  			dataIndex: 'typeDesc',
  			key: 'typeDesc',
  		},
  		{
  			title: '檢查項目(中文)',
  			dataIndex: 'cnName',
  			key: 'cnName',
  		},
  		{
  			title: '檢查項目(英文)',
  			dataIndex: 'enName',
  			key: 'enName',
  		},
  		{
  			title: '狀態',
  			key: 'enabled',
  			scopedSlots: { customRender: 'handleSwitch' },
  		},
  		{
  			title: '',
  			scopedSlots: { customRender: 'handleTemp' },
  			width: 30,
  			align: 'right',
  		},
  	],
  }

  // 子層 欄位資料
  innerGridData = {
  	rowKey: 'rowkey',
  	data: {},
  	pagination: false,
  	columns: {
  		type1: [
  			{
  				title: '性別',
  				dataIndex: 'sex',
  				key: 'sex',
  				customRender: (data) => {
  					if (data) {
  						return data === 'F' ? '女性' : '男性';
  					} return '不分';
  				},
  			},
  			{
  				title: '級數',
  				dataIndex: 'level',
  				key: 'level',
  			},
  			{
  				title: '正常值',
  				key: 'normalVal',
  				scopedSlots: { customRender: 'normalVal' },
  			},
  			{
  				title: '單位',
  				dataIndex: 'unit',
  				key: 'unit',
  			},
  			{
  				title: '最小極端值',
  				dataIndex: 'extremeMin',
  				key: 'extremeMin',
  			},
  			{
  				title: '最大極端值',
  				dataIndex: 'extremeMax',
  				key: 'extremeMax',
  			},
  			{
  				title: '分級設定值',
  				key: 'config',
  				scopedSlots: { customRender: 'rangeVal' },
  			},
  		],
  		type2: [
  			{
  				title: '性別',
  				dataIndex: 'sex',
  				key: 'sex',
  				width: 100,
  				customRender: (data) => {
  					if (data) {
  						return data === 'F' ? '女性' : '男性';
  					} return '不分';
  				},
  			},
  			{
  				title: '級數',
  				dataIndex: 'level',
  				key: 'level',
  				width: 100,
  			},
  			{
  				title: '判斷值',
  				dataIndex: 'judgeValue',
  				key: 'judgeValue',
  			},
  			{
  				title: '比對值',
  				dataIndex: 'compareValue',
  				key: 'compareValue',
  			},
  		],
  		type3: [
  			{
  				title: '性別',
  				dataIndex: 'sex',
  				key: 'sex',
  				width: 100,
  				customRender: (data) => {
  					if (data) {
  						return data === 'F' ? '女性' : '男性';
  					} return '不分';
  				},
  			},
  			{
  				title: '級數',
  				dataIndex: 'level',
  				key: 'level',
  				width: 100,
  			},
  			{
  				title: '比對值',
  				dataIndex: 'compareValue',
  				key: 'compareValue',
  				customRender: (data) => {
  					if (data) {
  						const arr = data.split(';');
  						return arr.reduce((prev, curr) => [...prev, this.optionEnum.compareValue.find((c) => c.value === curr).label], []).join(' ; ');
  					}
  				},
  			},
  		],
  	},
  }

	optionEnum = {
		compareValue: [],
	}

	/**
   * Func
   */
	// API: 取得所有健檢數值
	getGridData() {
  	this.setLoading(true);
  	const $search: HealthCheckValuesModel = {
  		pageNo: 0,
  		pageSize: 100,
  		period: this.period,
  	};
  	this.$HERpnNumericalMaintenanceApi.getHealthCheckValuesUsingPOST($search)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const outerGridData = [];
  				const getData = resp.data.data;
  				const { content } = getData;

  				content.forEach((dto, index) => {
  					const {
  						enabled, valueId, type1Details, type2Details, type3Details, showType, ...otherDto
  					} = dto;

  					// 外層Table
  					outerGridData.push({
  						rowkey: index + 1,
  						enabled: !!(enabled == 'Y'),
  						valueId,
  						showType,
  						...otherDto,
  					});

  					// 內層Table(細項)
  					let typeDetail = null;
  					switch (showType) {
  					case '1':
  						typeDetail = type1Details;
  						break;
  					case '2':
  						typeDetail = type2Details;
  						break;
  					case '3':
  						typeDetail = type3Details;
  						break;
  					default:
  					}
  					Object.assign(this.innerGridData.data, {
  						[valueId]: typeDetail.map((innerDto, innerIndex) => ({
  							rowkey: innerIndex + 1,
  							...innerDto,
  						})),
						 });
  				});
  				this.gridData.data = outerGridData;
  			} else {
  				const getError = resp.data;
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  					apiError: getError.apiError,
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 尿液項目代碼內容
	fetchUrineType() {
  	this.setLoading(true);
  	this.$HERpnNumericalMaintenanceApi.getUrineTypeListUsingPOST()
    	.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const getData = resp.data.data;
  			this.optionEnum.compareValue = getData.map((i) => ({ value: i.codeId, label: `(${i.codeDesc})` }));
  		})
  		.catch()
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	/**
   * Event
   */
	handleEdit({ valueId }) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'HealthValueMaintainAddAndEdit',
  		params: {
  			type: 'edit',
  		},
  		query: {
  			valueId,
  			period: this.period,
  		},
  	});
	}

	handleAdd() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'HealthValueMaintainAddAndEdit',
  		params: {
  			type: 'add',
  		},
  		query: {
  			period: this.period,
  		},
  	});
	}

	// API: 狀態啟用/停用
	handleChangeStatus({ valueId }) {
  	this.setLoading(true);
  	this.$HERpnNumericalMaintenanceApi.changeStatusUsingPOST(valueId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				this.$infoNotification.success({
  					content: '已成功修改狀態。',
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成修改狀態，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	closeAdvancedSearchModal() {
  	this.advancedSearchModalVisible = false;
	}

	closeConversionModal() {
  	this.conversionModalVisible = false;
	}

	/**
   * Hook
   */
	created() {
  	for (let i = 0; i < 7; i++) {
  		const yearStr = JSON.stringify(moment().year() - i);
  		this.yearOpts.push({ value: yearStr, label: yearStr });
  	}
  	this.period = JSON.stringify(moment().year());
		this.fetchUrineType();
  	this.getGridData();
	}
}
</script>

<style lang="scss" scoped>
.healthValue-topPanel__wrap {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
	h3 {
		color: $COLOR-BLACK;
		font-weight: $TEXT-BOLD;
		margin-bottom: 0;
	}
	.select__year {
		width: 100px;
		height: 36x;
		margin-left: 10px;
	}
}

.icon-button:not(:first-of-type) {
  margin-left: 10px;
}

::v-deep {
  .ant-table-header-column {
    font-weight: 900;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -12px -16px -13px;
  }
	// reset ant select, input
	.ant-select-selection--single, .ant-input, .mx-input {
		height: 40px;
	}
	.ant-select-selection__rendered {
		line-height: 36px;
	}
}

.healthValue__btnGroup {
  button:not(:first-of-type) {
    margin-left: 10px;
  }
}

</style>
