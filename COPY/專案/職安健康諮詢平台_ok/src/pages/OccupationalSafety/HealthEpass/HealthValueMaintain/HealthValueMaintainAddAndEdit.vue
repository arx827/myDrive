<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          {{ paramsType }}健檢數值
        </div>
      </div>
      <div class="healthValue__wrap">
        <a-form-model
          ref="healthValueAddAndEditForm"
          class="form__wrap"
          :form="form"
          :model="form"
          :rules="rules"
          :hide-required-mark="true"
          :colon="false"
        >
          <!-- 健檢項目 -->
          <div
            class="healthValue__block bg__light"
          >
            <div class="block-header__wrap">
              <h2> 健檢項目 </h2>
            </div>
            <a-row
              type="flex"
              justify="start"
              :gutter="[16, 16]"
            >
              <a-col :span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop="checkType"
                  :rules="rules.checkType"
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    類別<span class="mark-required">*</span>
                  </span>
                  <a-select
                    v-model="form.checkType"
                    :show-arrow="true"
                    :show-search="true"
                    :allow-clear="true"
                    :options="optionEnum.checkType"
                    :placeholder="' e.g. 血液檢查'"
                    :filter-option="filterOption"
                    @change="onCheckTypeChange"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop="itemId"
                  :rules="rules.itemId"
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    檢查項目(中文_英文)<span class="mark-required">*</span>
                  </span>
                  <a-select
                    v-model="form.itemId"
                    :show-arrow="true"
                    :allow-clear="true"
                    :show-search="true"
                    :loading="isSelectLoading"
                    :options="optionEnum.itemId"
                    :placeholder="' e.g. 血色素_Hb'"
                    :filter-option="filterOption"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop="sex"
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    性別<span class="mark-required">*</span>
                  </span>
                  <div>
                    <a-radio-group
                      v-model="form.sex"
                      :options="optionEnum.sex"
                    />
                  </div>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 數值設定 三選一 -->
          <div class="healthValue__block block-type bg__light">
            <template v-if="form.showType">
              <div class="block-header__wrap">
                <h2> 數值設定type {{ form.showType }}  </h2>
                <button
                  class="btn__radius--primary--outline--small item-btn__add"
                  @click="handleAddItem"
                >
                  新增設定項
                </button>
              </div>
              <template v-if="form.showType=='1'">
                <div class="block-content__wrap">
                  <div class="content-form__wrap">
                    <a-row
                      type="flex"
                      justify="start"
                      :gutter="[16, 16]"
                    >
                      <a-col :span="12">
                        <a-form-model-item class="formItem-row">
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            正常值(區間)<span class="mark-required">*</span>
                          </span>
                          <a-input-group compact>
                            <a-form-model-item
                              class="formItem-row"
                              prop="normalMin"
                              :rules="[{ required: true, trigger: 'change', message: '數值不能空白'}]"
                            >
                              <a-input
                                v-model="form.normalMin"
                                style=" width: 100px; text-align: center"
                                placeholder="請輸入數值"
                              />
                            </a-form-model-item>
                            <a-input
                              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                              placeholder="~"
                              disabled
                            />
                            <a-form-model-item
                              class="formItem-row"
                              prop="normalMax"
                              :rules="[{ required: true, trigger: 'change', message: '數值不能空白'}]"
                            >
                              <a-input
                                v-model="form.normalMax"
                                style="width: 100px; text-align: center; border-left: 0"
                                placeholder="請輸入數值"
                              />
                            </a-form-model-item>
                          </a-input-group>
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-model-item
                          class="formItem-row"
                          prop="unit"
                          :rules="[{ required: true, trigger: 'change', message: '單位不能空白'}]"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            單位<span class="mark-required">*</span>
                          </span>
                          <a-input
                            v-model="form.unit"
                            allow-clear
                            placeholder="e.g. g/dL"
                          />
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-model-item
                          class="formItem-row"
                          prop="extremeMin"
                          :rules="[{ required: true, trigger: 'change', message: '最小極端值不能空白'}]"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            最小極端值<span class="mark-required">*</span>
                          </span>
                          <a-input
                            v-model="form.extremeMin"
                            allow-clear
                            placeholder="e.g. <12"
                          />
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-model-item
                          class="formItem-row"
                          prop="extremeMax"
                          :rules="[{ required: true, trigger: 'change', message: '最大極端值不能空白'}]"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            最大極端值<span class="mark-required">*</span>
                          </span>
                          <a-input
                            v-model="form.extremeMax"
                            allow-clear
                            placeholder="e.g. >16"
                          />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
                <div
                  v-for="(item, index) in form[`type${form.showType}InputDetails`]"
                  :key="index"
                  class="block-content__wrap  mt-3"
                >
                  <div class="content-form__wrap">
                    <button
                      class="icon-button icon__delete type-delete"
                      @click="handleDelete(item)"
                    >
                      <a-icon type="delete" />
                    </button>
                    <a-row
                      type="flex"
                      justify="start"
                      align="middle"
                      :gutter="[16, 16]"
                    >
                      <a-col
                        :xs="24"
                        :lg="5"
                      >
                        <div class="block-subTitle">
                          分級: {{ item.level }}級
                        </div>
                      </a-col>
                      <a-col
                        :xs="24"
                        :lg="19"
                      >
                        <a-form-model-item
                          class="formItem-row"
                          :class="{'d-flex':form.showType=='1'}"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            分級設定值(區間)<span class="mark-required">*</span>
                          </span>
                          <a-input-group
                            compact
                            :class="{'has__error': inputRangeErrMsg.configVal}"
                          >
                            <!-- 動態綁定檢核規則 -->
                            <a-form-model-item
                              class="formItem-row"
                              :prop="`type${form.showType}InputDetails.`+index+'.minRange'"
                              :rules="[{ required: true, trigger: 'change', message: '數值不能空白'}]"
                            >
                              <a-input
                                v-model="item.minRange"
                                style=" width: 100px; text-align: center"
                                placeholder="請輸入數值"
                              />
                            </a-form-model-item>
                            <a-input
                              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                              placeholder="~"
                              disabled
                            />
                            <a-form-model-item
                              class="formItem-row"
                              :prop="`type${form.showType}InputDetails.`+index+'.maxRange'"
                              :rules="[{ required: true, trigger: 'change', message: '數值不能空白'}]"
                            >
                              <a-input
                                v-model="item.maxRange"
                                style="width: 100px; text-align: center; border-left: 0"
                                placeholder="請輸入數值"
                              />
                            </a-form-model-item>
                          </a-input-group>
                          <p
                            v-if="inputRangeErrMsg.configVal"
                            class="message--error"
                          >
                            {{ inputRangeErrMsg.configVal }}
                          </p>
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </template>
              <template v-if="form.showType=='2'">
                <div
                  v-for="(item, index) in form[`type${form.showType}InputDetails`]"
                  :key="index"
                  class="block-content__wrap  mt-3"
                >
                  <div class="content-form__wrap">
                    <a-row
                      type="flex"
                      justify="space-between"
                    >
                      <div class="block-subTitle">
                        分級: {{ item.level }}級
                      </div>
                      <button
                        class="icon-button icon__delete"
                        @click="handleDelete(item)"
                      >
                        <a-icon type="delete" />
                      </button>
                    </a-row>
                    <a-row
                      type="flex"
                      justify="start"
                      :gutter="[16, 0]"
                    >
                      <a-col :span="12">
                        <a-form-model-item
                          class="formItem-row"
                          :prop="`type${form.showType}InputDetails.`+index+'.judgeValue'"
                          :rules="[{ required: true, trigger: 'change', message: '判斷值不能空白'}]"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            判斷值<span class="mark-required">*</span>
                          </span>
                          <a-textarea
                            v-model="item.judgeValue"
                            :placeholder="'請輸入判斷值，上限字數100字。'"
                            :rows="4"
                            :auto-size="{ minRows: 4}"
                            :max-length="100"
                            allow-clear
                          />
                        </a-form-model-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-model-item
                          class="formItem-row"
                          :prop="`type${form.showType}InputDetails.`+index+'.compareValue'"
                          :rules="[{ required: true, trigger: 'change', message: '比對值不能空白'}]"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            比對值<span class="mark-required">*</span>
                          </span>
                          <a-textarea
                            v-model="item.compareValue"
                            :placeholder="'請輸入判斷值，上限字數100字。'"
                            :rows="4"
                            :auto-size="{ minRows: 4}"
                            :max-length="100"
                            allow-clear
                          />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </template>
              <template v-if="form.showType=='3'">
                <div
                  v-for="(item, index) in form[`type${form.showType}InputDetails`]"
                  :key="index"
                  class="block-content__wrap  mt-3"
                >
                  <div class="content-form__wrap">
                    <a-row
                      type="flex"
                      justify="space-between"
                    >
                      <div class="block-subTitle">
                        分級: {{ item.level }}級
                      </div>
                      <button
                        class="icon-button icon__delete"
                        @click="handleDelete(item)"
                      >
                        <a-icon type="delete" />
                      </button>
                    </a-row>
                    <a-row
                      type="flex"
                      justify="start"
                      :gutter="[16, 0]"
                    >
                      <a-col :span="12">
                        <a-form-model-item
                          class="formItem-row"
                          :prop="`type${form.showType}InputDetails.`+index+'.compareValue'"
                          :rules="rules.compareValue"
                        >
                          <span
                            slot="label"
                            class="a-form-label"
                          >
                            比對值<span class="mark-required">*</span>
                          </span>
                          <a-select
                            v-model="item.compareValue"
                            mode="multiple"
                            allow-clear
                            placeholder="可複選"
                            :show-arrow="true"
                            :options="optionEnum.compareValue"
                            :filter-option="filterOption"
                          />
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </a-form-model>
      </div>
      <div class="healthValue-btn__wrap text-center">
        <button
          class="btn__radius--primary--outline"
          @click="handleCancel"
        >
          取消
        </button>
        <button
          class="btn__radius--primary"
          @click="handleSubmit"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { VueEditor, Quill } from 'vue2-editor';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import {
	SingleHealthCheckValuesDetail, Type1InputDetail, Type2InputDetail, Type3InputDetail,
} from '@fubonlife/oss-api-axios-sdk';
import InfoModal from '@/plugins/notification/infoModal';

require('bootstrap/js/dist/modal');

@Component({ components: { VueEditor } })
export default class HealthValueMaintainAddAndEdit extends Vue {
  @Action('setLoading') setLoading

  customToolbar = [
  	['bold', 'italic', 'underline'],
  	[{ list: 'ordered' }, { list: 'bullet' }],
  	[
  		{ align: 'left' },
  		{ align: 'center' },
  		{ align: 'right' },
  		{ align: 'justify' },
  	],
  	[{ color: [] }],
  ]

  form = {
  	checkType: null,
  	enabled: null,
  	extremeMax: null,
  	extremeMin: null,
  	itemId: null,
  	normalMax: null,
  	normalMin: null,
  	period: null,
  	sex: null,
  	showType: null,
  	type1InputDetails: null,
  	type2InputDetails: null,
  	type3InputDetails: null,
  	unit: null,
  	valueId: null,
  };

  isSelectLoading = false;

  inputRangeErrMsg = {
  	configVal: null,
  }

  optionEnum = {
  	checkType: [],
  	itemId: [],
  	sex: [
  		{
  			value: null,
  			label: '不分',
  		},
  		{
  			value: 'M',
  			label: '男性',
  		},
  		{
  			value: 'F',
  			label: '女性',
  		},
  	],
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
  	compareValue: [],
  }

  paramsType = '';

  paramsTypeEnum = [
  	{
  		key: 'edit',
  		val: '編輯',
  	},
  	{
  		key: 'add',
  		val: '新增',
  	},
  ]

  rules: { [key: string]: ValidationRule[] } = {
  	checkType: [{ required: true, message: '類別不能空白', trigger: 'change' }],
  	itemId: [{ required: true, message: '檢查項目不能空白', trigger: 'change' }],
  	compareValue: [{ required: true, message: '比對值不能空白', trigger: 'change' }],
  }

  /**
   * Func
   */
  setResultParam() {
  	const $type = this.$router.currentRoute.params.type;
  	this.paramsType = this.paramsTypeEnum.filter((i) => (i.key == $type))[0].val;

  	const $query = this.$global.getQuery();
  	if ($query) {
  		const { valueId, period } = $query;
  		this.form.period = period;
  		if ($type == 'edit') {
  			this.getCheckValue(valueId);
  			this.form.valueId = valueId;
  		}
  	}
  }

  // API: 取得健檢類別下拉選單(含數值設定型別)
  getCategoryOpts() {
  	this.setLoading(true);
  	this.$HERpnNumericalMaintenanceApi.getHealthCheckTypeDescListUsingPOST()
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const getData = resp.data.data;
  			this.optionEnum.checkType = getData.map((item) => {
  				const { codeId, codeDesc, ...dto } = item;
  				return {
  					value: codeId,
  					label: codeDesc,
  					...dto,
  				};
  			});
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
  			this.optionEnum.itemId = getData.map((item) => ({ value: item.itemId, label: item.enName ? `${item.cnName}_${item.enName}` : `${item.cnName}` }));
  			if (!getData.find((e) => e.itemId === this.form.itemId)) {
  				this.form.itemId = null;
  			}
  		})
  		.catch()
  		.finally(() => {
  			this.isSelectLoading = false;
  		});
  }

  // API: 取得單一健檢數值
  getCheckValue(valueId) {
  	this.setLoading(true);
  	this.$HERpnNumericalMaintenanceApi.getSingleHealthCheckValueUsingPOST(valueId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				this.form = getData as any;
  				if (getData.showType == '3') {
  					getData.type3InputDetails.forEach((i, index) => {
  						this.form.type3InputDetails[index].compareValue = i.compareValue.indexOf(';') ? i.compareValue.split(';') : [i.compareValue];
  					});
  				}
  			} else {
  				const getError = resp.data;
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  					apiError: getError.apiError,
  				});
  				this.$router.replace({ name: 'HealthValueMaintainList' });
  			}

  			this.getCheckItemOpts(this.form.checkType);
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  			this.$router.replace({ name: 'HealthValueMaintainList' });
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

  // API: 儲存健檢數值
  saveMaintenance() {
  	const { type3InputDetails, ...other } = this.form;
  	if (this.form.showType == '3') {
  		this.form.type3InputDetails.forEach((i, index) => {
  			type3InputDetails[index].compareValue = (i.compareValue.length > 1) ? i.compareValue.join(';') : i.compareValue[0].toString();
  		});
  	}
  	this.setLoading(true);
  	this.$HERpnNumericalMaintenanceApi.saveHealthCheckValueUsingPOST({ type3InputDetails, ...other })
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);

  			if (resp.data.status == 200) {
  				this.$global.changeRouterAndaddParam({
          	toRouter: 'HealthValueMaintainResult',
          	query: {
  						type: this.paramsType,
  						result: 'success',
  					},
  				});
  			} else {
  				const getError = resp.data;
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'HealthValueMaintainResult',
          	query: {
  						type: this.paramsType,
  						result: 'fail',
  						msg: getError.apiError && this.$global.getApiErrorMsg(getError.apiError).join(''),
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成儲存項目，請再次嘗試。',
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

  // 產生對應的type物件
  getNewItem(type: string, lastLevel?: string): Type1InputDetail|Type2InputDetail|Type3InputDetail {
  	const level = lastLevel ? JSON.stringify(parseInt(lastLevel) + 1) : '1';
  	switch (type) {
  	case '1':
  		return {
  			minRange: undefined,
  			maxRange: undefined,
  			level,
  		};
  	case '2':
  		return {
  			compareValue: undefined,
  			judgeValue: undefined,
  			level,
  		};
  	case '3':
  		return {
  			compareValue: undefined,
  			level,
  		};
  	}
  }

  /**
   * Event
   */
  handleAddItem() {
  	const type = this.form.showType;
  	let obj = {};
  	if (this.form[`type${type}InputDetails`].length > 0) {
  		const lastLevel = this.form[`type${type}InputDetails`][this.form[`type${type}InputDetails`].length - 1].level;
  		obj = this.getNewItem(type, lastLevel);
  	} else {
  		obj = this.getNewItem(type);
  	}
  	this.form[`type${type}InputDetails`].push(obj);
  }

  handleDelete(item) {
  	if (this.form[`type${this.form.showType}InputDetails`].length === 1) {
  		InfoModal.alertSuccess({
  			title: '須至少保留一個數值',
  			confirm: false,
  			content: '無法完成您的刪除，該分級設定內容必須至少保留一個數值。',
  		});
  		return;
  	}
  	this.form[`type${this.form.showType}InputDetails`].splice(this.form[`type${this.form.showType}InputDetails`].indexOf(item), 1);
  }

  handleSubmit() {
  	// 清空其他type
  	for (let i = 1; i <= 3; i++) {
  		if (JSON.stringify(i) !== this.form.showType) {
  			this.form[`type${i}InputDetails`] = undefined;
  		}
  	}
  	(this.$refs.healthValueAddAndEditForm as any).validate((valid) => {
  		if (valid) {
  			this.saveMaintenance();
  		}
  	});
  }

  handleCancel() {
  	this.$router.push({ name: 'HealthValueMaintainList' });
  }

  // 依據類別項目，帶出數值type
  onCheckTypeChange(value, option) {
  	if (value) {
  		const { data } = option;
  		this.getCheckItemOpts(value);
  		const typeNum = data.props.showType;
  		this.form.showType = typeNum;
  		if (!this.form[`type${typeNum}InputDetails`]) {
  			this.$set(this.form, `type${typeNum}InputDetails`, [this.getNewItem(typeNum)]);
  		}
  	}
  }

  /**
   * Hook
   */
  created() {
  	this.getCategoryOpts();
  	this.setResultParam();
  	this.fetchUrineType();
  }
}
</script>

<style lang="scss" scoped>
  .healthValue__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
    .block-header__wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      h2 {
        font-weight: 600;
        color: $TEXT-GREEN;
        font-size: 20px;
        margin-bottom: 0;
      }
      .item-btn__add {
        padding: 1px 24px;
      }
    }
    .block-content__wrap {
      background: $COLOR-WHITE;
      padding: 10px;
      .content-form__wrap {
        margin: 20px 70px;
        position: relative;
        .type-delete {
          position: absolute;
          right: 0;
          top: 10px;
          z-index: 100;
        }
      }
      .block-subTitle {
        color: $LOGIN-BANNER-TITLE-COLOR;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
  .block-type {
    min-height: 300px;
  }
  .label__radio {
    margin-bottom: 10px;
  }
  .healthValue-btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
    .btn__view {
      width: 100px;
      margin: 0;
    }
  }
  ::v-deep {
    .ant-form-item {
      margin-bottom: 0;
      label {
        color: $COLOR-BLACK;
        font-weight: $TEXT-BOLD;
      }
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
  }

  .quillWrapper {
    background: $COLOR-WHITE;
  }
</style>
