<template>
  <div>
    <div
      v-if="mode==='edit'"
      class="row"
    >
      <div class="col-10 offset-1">
        <label
          class="d-block"
          style="margin-bottom: 10px;"
        >{{ wording }}</label>
        <a-select
          v-model="selectedPlan"
          class="w-100"
          show-search
          placeholder="請選擇"
        >
          <a-select-option
            v-for="(plan, index) in insurancePlan"
            :key="index"
            class="card__dropdown__item"
            :value="plan.planCode"
          >
            {{ plan.planCode }} {{ plan.planDesc }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div
      class="product__content--bgblue"
    >
      <div
        class="row product__content"
      >
        <div
          class="col-12 col-lg-10 offset-0 offset-lg-1"
        >
          <div>
            <div
              v-if="mode === 'edit'"
              class="product__content__hearder d-flex justify-content-between"
            >
              <div class="header__text header__text--lg header__text--main">
                {{ tableTitle }}
              </div>
              <div class="header__text header__text--lg header__text--main">
                <span class="header__text header__text--lg header__text--sub">金額單位／</span>
                新台幣TWD
              </div>
            </div>
            <div
              v-else
              class="product__content__hearder"
            >
              <div class="header__text header__text--dark header__text--lg header__text--thin">
                {{ wording }}
              </div>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="header__text header__text--dark header__text--bold">
                    {{ productType === 'RC' ? insurancePlan.planCode : '' }} {{ insurancePlan.planDesc }}
                  </div>
                </div>
                <div
                  class="header__text header__text--main"
                >
                  <span class="header__text header__text--sub">金額單位／</span> 新台幣TWD
                </div>
              </div>
            </div>
            <div class="product__content__line product__content__line--main" />
            <div
              v-if="selected === null && mode === 'edit'"
              class="pt-3"
            >
              請選擇{{ wording }}
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
                      {{ item.cname }}
                    </div>
                    <div
                      v-if="productType === 'RC'"
                      class="item__title item__title--primary"
                    >
                      {{ item.plan }} {{ item.desc }}
                    </div>
                  </div>
                  <div
                    v-if="productType === 'RC' && item.sa == 0"
                    class="col-2 text-end pe-0"
                  >
                    是
                  </div>
                  <div
                    v-else
                    class="item__cost"
                  >
                    {{ item.saUnit&&item.saUnit.indexOf('元') !== -1 ? '$' : '' }} {{ item.sa.toLocaleString() }} {{ item.saUnit }}
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
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import {
	InsurancePlanDto,
} from '@fubonlife/co-giiss-api-axios-sdk';

@Component({ components: {} })
export default class InsurancePlanFrom extends Vue {
  @Prop()
  breadcrumb: {}

	@Prop()
	insurancePlan

  @Prop()
  mode: 'confirm' | 'edit'

  @Prop()
  planType: 'InsurancePlan' | 'Plan'

  @Prop()
  defaultSelect

  @Prop()
  productType: 'RC' | 'CB'

  @Prop()
  clearSelected: boolean // 若更改日期須清空已選選項

	selectedPlan = null;

	selected = null;

  // 時間format格式
  formatter = this.$twDateFormatter;

  get wording() {
  	return this.planType === 'InsurancePlan' ? '投保保險計劃代號' : '投保專案代號';
  }

  get tableTitle() {
  	return this.planType === 'InsurancePlan' ? '保險計劃' : '專案計劃';
  }

	@Watch('selectedPlan')
  onSelectChange(val) {
  	if (val !== null) {
  		this.selected = this.insurancePlan.find((e) => (e.planCode === val)).planItemDtoList;
  		this.$emit('selected', this.insurancePlan.find((e) => (e.planCode === val)));
  	} else {
  		this.selected = null;
  		this.$emit('selected', null);
  	}
  }

  @Watch('insurancePlan')
	onInsurancePlanChange() {
		// this.selected = this.insurancePlan.planItemDtoList;
		// console.log('insurancePlan change');
		// console.log(this.insurancePlan);
		if (this.clearSelected) {
			this.selectedPlan = null;
		}
	}

  @Watch('defaultSelect')
  onDefaultSelectChanged(val) {
  	console.log('defaultSelect', val);
  	if (val) {
  		this.selectedPlan = val.planCode;
  	} else {
  		this.selectedPlan = null;
  	}
  }

  created() {
  	console.log('組件created');
  	if (this.mode === 'confirm') {
  		this.selected = this.insurancePlan.planItemDtoList;
  	  console.log(this.selected);
  	}
  	if (this.defaultSelect) {
  		this.selectedPlan = this.defaultSelect.planCode;
  	}
  }
}
</script>

<style lang="scss" scoped>

</style>
