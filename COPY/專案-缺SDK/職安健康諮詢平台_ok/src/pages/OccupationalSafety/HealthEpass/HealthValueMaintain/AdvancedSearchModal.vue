<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      :footer="false"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <!-- <template slot="footer" /> -->
      <div class="advancedSearch__header">
        <h1 class="modal__title">
          {{ modalTitle }}
        </h1>
      </div>
      <div class="advancedSearch__content">
        <!-- 查詢區域 -->
        <div class="content-block__search">
          <a-form-model
            ref="healthValueAdvancedSearchForm"
            class="form__wrap"
            :form="form"
            :model="form"
            :rules="rules"
            :hide-required-mark="true"
            :colon="false"
          >
            <a-row
              type="flex"
              justify="start"
              :gutter="[16, 16]"
            >
              <a-col :span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop="category"
                  :rules="rules.checkType"
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    類別<span class="mark-required">*</span>
                  </span>
                  <a-select
                    v-model="form.category"
                    :show-arrow="true"
                    :allow-clear="true"
                    :show-search="true"
                    :options="optionEnum.category"
                    :placeholder="' e.g. 血液檢查'"
                    :filter-option="filterOption"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop="checkItem"
                  :rules="rules.itemId"
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    檢查項目(中文_英文)<span class="mark-required">*</span>
                  </span>
                  <a-select
                    v-model="form.checkItem"
                    :show-arrow="true"
                    :show-search="true"
                    :allow-clear="true"
                    :loading="isSelectLoading"
                    :options="optionEnum.checkItem"
                    :placeholder="' e.g. 血色素_Hb'"
                    :filter-option="filterOption"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop="level"
                  label="分級"
                >
                  <div>
                    <a-radio-group
                      v-model="form.level"
                      :options="optionEnum.level"
                    />
                  </div>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--bg--small btn__confirm"
              @click="handleSearch"
            >
              確定
            </button>
          </div>
        </div>
        <!-- 查詢結果 -->
        <div
          v-if="gridData.data.length > 0"
          class="content-block__result"
        >
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
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { AdvancedSearchModel } from '@fubonlife/oss-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

@Component({})
export default class AdvancedSearchModal extends Vue {
  @Action('setLoading') setLoading

  @Prop()
  modalTitle: string

  @Prop()
  period: string

  @Prop()
  visible: boolean

  modalVisible = false;

  form = {
  	category: null,
  	checkItem: null,
  	level: null,
  };

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
  			},
  		],
  	},
  }

  isSelectLoading = false;

  // 下拉選項
  optionEnum = {
  	// 類別
  	category: [],
  	// 健檢項目
  	checkItem: [],
  	// 分級
  	level: [
  		{
  			value: '1',
  			label: '1級',
  		},
  		{
  			value: '2',
  			label: '2級',
  		},
  		{
  			value: '3',
  			label: '3級',
  		},
  		{
  			value: '4',
  			label: '4級',
  		},
  	],
  }

  rules: { [key: string]: ValidationRule[] } = {
  	checkType: [{ required: true, message: '類別不能空白', trigger: 'change' }],
  	itemId: [{ required: true, message: '檢查項目不能空白', trigger: 'change' }],
  }

  /**
   * Func
   */
  // API: 取得健檢類別下拉選單(含數值設定型別)
  getCategoryOpts() {
  	this.setLoading(true);
  	this.$HERpnNumericalMaintenanceApi.getHealthCheckTypeDescListUsingPOST()
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const getData = resp.data.data;
  			this.optionEnum.category = getData.map((item) => ({ value: item.codeId, label: item.codeDesc }));
  		})
  		.catch()
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 健檢類別帶出檢查項目(中文_英文)
  getCheckItemOpts(codeId) {
  	this.isSelectLoading = true;
  	this.$HERpnNumericalMaintenanceApi.getHealthCheckCheckItemListUsingPOST(codeId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const getData = resp.data.data;
  			this.optionEnum.checkItem = getData.map((item) => ({ value: item.itemId, label: item.enName ? `${item.cnName}_${item.enName}` : `${item.cnName}` }));
  			if (!getData.find((e) => e.itemId === this.form.checkItem)) {
  				this.form.checkItem = null;
  			}
  		})
  		.catch()
  		.finally(() => {
  				this.isSelectLoading = false;
  		});
  }

  // API: 取得所有健檢數值
  getGridData() {
  	this.setLoading(true);
  	const $search: AdvancedSearchModel = {
  		itemId: this.form.checkItem,
  		level: this.form.level,
  		period: this.period,
  	};
  	this.$HERpnNumericalMaintenanceApi.getAdvancedSearchUsingPOST($search)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				if (resp.data.data.length == 0) {
  					this.gridData.data = [];
  					this.$infoNotification.error({
  						content: '查無資料，請再次嘗試。',
  					});
  				} else {
  					const getData = resp.data.data;
  					const outerGridData = [];

  					getData.forEach((dto, index) => {
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
  							break;
  						}
  						console.log(typeDetail);
  						Object.assign(this.innerGridData.data, {
  							[valueId]: typeDetail.map((innerDto, innerIndex) => ({
  								rowkey: innerIndex + 1,
  								...innerDto,
  							})),
  						});
  					});
  					this.gridData.data = outerGridData;
  				}
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

  // 模糊搜尋
  filterOption(input, option) {
  	return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /**
   * Event
   */
  handleSearch() {
  	(this.$refs.healthValueAdvancedSearchForm as any).validate((valid) => {
  		if (valid) {
  			this.getGridData();
  		}
  	});
  }

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

  onClose() {
  	this.$emit('closeCateModal');
  }

  /**
   * Hook
   */
  created() {
  	this.getCategoryOpts();
  }

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Watch('form.category')
  checkItemChange(val) {
  	this.getCheckItemOpts(val);
  }
}
</script>

<style lang="scss" scoped>
  .modal__title {
    font-weight: 600;
    font-size: 30px;
    // letter-spacing: 2px;
  }

  .btn__wrap {
    margin: 30px 0 0;
    button {
      letter-spacing: 2px;
      font-weight: 500;
    }
    .btn__confirm {
      height: 40px;
      width: 120px;
    }
  }

  .content-block__result {
    margin-top: 40px;
    padding-top: 40px;
    border-top: 1px dashed $BORDER-COLOR-GRAY;
  }

  ::v-deep {

    // font-family: 'PingFang TC', Arial;
    .ant-modal-close-x {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mx-input {
      height: 40px;
    }
    .ant-form-item label {
      color: $COLOR-BLACK;
      font-weight: $TEXT-BOLD;
    }
    // reset ant select, input
    .ant-select-selection--single, .ant-input, .mx-input {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-form-item-control {
      line-height: 2rem;
    }
    .ant-time-picker-large .ant-time-picker-input {
      font-size: 16px;
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -10px -16px -11px;
    }

  }
</style>
