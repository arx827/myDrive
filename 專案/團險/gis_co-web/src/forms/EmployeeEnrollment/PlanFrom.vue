<template>
  <div>
    <div v-if="insurancePlan">
      <div class="row">
        <div class="col-10 offset-1">
          <label
            class="d-block"
            style="margin-bottom: 10px;"
          >投保專案代號</label>
          <a-select
            v-model="selectedPlan"
            class="w-100"
            show-search
          >
            <a-select-option
              v-for="item in insurancePlan"
              :key="item.planCode+item.plan"
              :value="item.planCode+item.plan"
            >
              {{ item.planDesc }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="product__content--bgblue">
        <div
          class="row product__content"
        >
          <div class="col-12 col-lg-10 offset-0 offset-lg-1">
            <div>
              <div
                v-if="mode === 'edit'"
                class="product__content__hearder d-flex justify-content-between"
              >
                <div class="header__text header__text--lg header__text--main">
                  專案計劃
                </div>
                <div class="header__text header__text--lg header__text--main">
                  <span class="header__text header__text--lg header__text--sub">金額單位／</span>
                  新台幣TWD
                </div>
              </div>
              <div class="product__content__line product__content__line--main" />
              <div
                v-if="selected === null && mode === 'edit'"
                class="pt-3"
              >
                請選擇投保專案代號
              </div>
              <div
                v-for="(item,index) in selected"
                :key="index"
              >
                <div
                  class="product__content__item"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <div class="item__title">
                        {{ item.cname }}({{ item.item }})
                      </div>
                    </div>
                    <div class="item__cost">
                      $ {{ item.sa.toLocaleString() }} {{ item.saUnit }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="index+1 < selected.length"
                  class="product__content__line product__content__line--dash"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center product__content--bgblue py-5"
    >
      查無資料
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

export interface formModel {
	option: string;
  changeTime: string;
  changeTimeRange: string;
  idno: string;
  insName: string;
  appNoStart: string;
  appNoEnd: string;
  applyFor: string;
}

@Component({ components: {} })
export default class PlanFrom extends Vue {
  @Prop()
  breadcrumb: {}

  @Prop()
	insurancePlan

  @Prop()
  mode: 'comfirm' | 'edit'

  @Prop()
  defaultSelect

  @Prop()
  clearSelected: boolean // 若更改日期須清空已選選項

	selectedPlan = null;

	selected = null;

  // 時間format格式
  formatter = this.$twDateFormatter;

	@Watch('selectedPlan')
  onSelectChange(val) {
  	if (val !== null) {
  		this.selected = this.insurancePlan.find((e) => ((e.planCode + e.plan) === val)).planItemDtoList;
  		this.$emit('selected', this.insurancePlan.find((e) => ((e.planCode + e.plan) === val)));
  	} else {
  		this.selected = null;
  		this.$emit('selected', null);
  	}
  }

  @Watch('insurancePlan')
	onInsurancePlanChange() {
		// this.selected = this.insurancePlan.planItemDtoList;
		// console.log('this.insurancePlan', this.insurancePlan);
		if (this.clearSelected) {
			this.selectedPlan = null;
		}
	}

  @Watch('defaultSelect')
  onDefaultSelectChanged(val) {
  	if (val) {
  		this.selectedPlan = val.planCode + val.plan;
  	} else {
  		this.selectedPlan = null;
  	}
  }

  created() {
  	if (this.mode === 'comfirm') {
  		this.selected = this.insurancePlan.planItemDtoList;
  	  console.log(this.selected);
  	}
  	if (this.defaultSelect) {
  		this.selectedPlan = this.defaultSelect.planCode + this.defaultSelect.plan;
  	}
  }
}
</script>

<style lang="scss" scoped>
</style>
