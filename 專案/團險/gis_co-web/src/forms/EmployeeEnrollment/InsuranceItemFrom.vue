<template>
  <div>
    <div class="row">
      <div class="col-10 offset-1">
        <div
          v-if="mode === 'edit'"
          class="form__product__title text-center"
        >
          您已選擇的險種計畫
          <span class="form__product__title--primary"> {{ countSelected }} </span>
          項
        </div>
      </div>
    </div>

    <div class="product__content--bgblue">
      <div
        class="row product__content"
      >
        <div class="col-12 col-lg-10 offset-0 offset-lg-1 px-2 px-lg-0 ">
          <div>
            <div class="product__content__hearder d-flex justify-content-between">
              <div class="header__text header__text--lg header__text--main">
                {{ mode === 'edit' ? '所有險種計畫':'險種計畫' }}
              </div>
              <div class="header__text header__text--lg header__text--main">
                <span class="header__text header__text--lg header__text--sub">金額單位／</span>
                新台幣TWD
              </div>
            </div>
            <div class="product__content__line product__content__line--main mb-3" />
          </div>
          <div
            v-if="mode === 'edit'"
            class="form__product"
          >
            <div
              v-for="(item, index) in insuranceItemNew"
              :key="index"
              class="row form__product__item"
            >
              <div class="col-11">
                <div
                  v-if="item.insPlanItemDtoList !== null"
                  :class="{'selected': (item.itemSelectedModel !== undefined) && (item.itemSelectedModel.indexOf('-1-1') < 0)}"
                  class="product__choice"
                >
                  <div>
                    <label for="">{{ item.cname }}</label>
                  </div>
                  <a-select
                    v-model="item.itemSelectedModel"
                    class="w-100"
                    placeholder="請選擇"
                  >
                    <a-select-option
                      v-for="(sub, idx) in item.insPlanItemDtoList"
                      :key="idx"
                      :value="item.item+sub.plan+sub.vrsn"
                    >
                      <span v-if="productType === 'RC'">
                        {{ sub.plan !== '-1' ? sub.plan : '' }}{{ sub.desc }}
                        <span>{{ sub.plan !== '-1' ? sub.sa.toLocaleString() : '' }}{{ item.saUnit.indexOf('元') == -1 ? item.saUnit : '' }}</span>
                      </span>
                      <span v-else-if="productType === 'CB'">
                        {{ (checkCBItem.find(e=>e===item.item) !== undefined) && sub.plan !== '-1' ? sub.plan + sub.desc : sub.desc }}
                      </span>
                      <span v-else>
                        {{ sub.desc }}
                      </span>
                    </a-select-option>
                  </a-select>
                </div>
                <div
                  v-else
                  :class="{'selected': item.itemSelectedModel > 0}"
                  class="product__choice"
                >
                  <div>
                    <label for="">{{ item.cname }}</label>
                  </div>
                  <a-input-number
                    v-model="item.itemSelectedModel"
                    class="w-100"
                    :formatter="value => item.saUnit.indexOf('元') !== -1 ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : (value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + item.saUnit)"
                  />
                </div>
              </div>
              <div class="col-1 align-self-end">
                <div class="form__product__unit">
                  {{ item.saUnit&&item.saUnit.indexOf('元') !== -1 ? item.saUnit : '' }}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              v-for="(item,index) in insuranceItemNew.filter((e)=>e.insPlanItemDto.sa !== null)"
              :key="index"
            >
              <div
                v-if="item.insPlanItemDtoList !== null"
              >
                <div
                  class="product__content__item"
                >
                  <div
                    v-for="(list, idx) in item.insPlanItemDtoList.filter((e)=>item.item+e.plan+e.vrsn == item.itemSelectedModel)"
                    :key="idx"
                  >
                    <div
                      class="row d-flex justify-content-between align-items-center w-100"
                    >
                      <div class="col-10">
                        <div class="item__title">
                          {{ item.cname }}
                        </div>
                        <div class="text-primary">
                          {{ list.plan }} {{ list.desc }}
                        </div>
                      </div>
                      <div
                        v-if="list.sa !== 0"
                        class="col-2 text-end pe-0"
                      >
                        $ {{ list.sa.toLocaleString() }} {{ item.saUnit }}
                      </div>
                      <div
                        v-if="productType === 'RC' && list.sa == 0"
                        class="col-2 text-end pe-0"
                      >
                        是
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="index+1 < insuranceItemNew.filter((e)=>e.insPlanItemDto.sa !== null).length"
                  class="product__content__line product__content__line--dash"
                />
              </div>
              <div v-else-if="item.insPlanItemDto.sa">
                <div
                  class="product__content__item"
                >
                  <div
                    class="row d-flex justify-content-between align-items-center w-100"
                  >
                    <div class="col-10">
                      <div class="item__title">
                        {{ item.cname }}
                      </div>
                      <div class="text-primary">
                        {{ item.insPlanItemDto.plan }} {{ item.insPlanItemDto.desc }}
                      </div>
                    </div>
                    <div class="col-2 text-end pe-0">
                      $ {{ item.insPlanItemDto.sa }} {{ item.saUnit }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="index+1 < insuranceItemNew.filter((e)=>e.insPlanItemDto.sa !== null).length"
                  class="product__content__line product__content__line--dash"
                />
              </div>
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

@Component({ components: {} })
export default class InsuranceItemFrom extends Vue {
  @Prop()
  breadcrumb: {}

  @Prop()
  insuranceItem: any

  @Prop()
  mode: 'edit' | 'confirm'

  @Prop()
  productType: 'RC' | 'CB'

  @Prop()
  clearSelected: boolean // 若更改日期須清空已選選項

  insuranceItemNew = null;

  // 時間format格式
  formatter = this.$twDateFormatter;

  checkCBItem = ['GAHI', 'GCAI', 'GDI', 'GHI', 'GHR', 'GHS'];

  @Watch('insuranceItemNew', { deep: true })
  onChange(val) {
  	// console.log(val);
  	this.$emit('selected', val);
  }

  @Watch('insuranceItem', { deep: true })
  onInsuranceItemChange(val) {
  	// console.log(val);
  	this.insuranceItemNew = val;
  	this.setData();
  }

  get countSelected() {
  	let countSelected: number = 0;
  	if (this.insuranceItemNew) {
  		this.insuranceItemNew.forEach((element) => {
  			if (element.insPlanItemDtoList !== null) {
  				if (element.itemSelectedModel !== undefined) {
  					if (element.itemSelectedModel.indexOf('-1-1') < 0) {
  						countSelected++;
  					}
  				}
  			} else if (element.itemSelectedModel > 0) {
  				countSelected++;
  			}
  		});
  	}
  	return countSelected;
  }

  created() {
  	this.insuranceItemNew = this.insuranceItem;
  	this.setData();
  	console.log('this.insuranceItemNew', this.insuranceItemNew);
  }

  setData() {
  	if (this.mode === 'edit' && this.insuranceItemNew) {
  		this.insuranceItemNew.forEach((element) => {
  			if (!element.itemSelectedModel && !this.clearSelected) {
  				// this.$set(element, 'itemSelectedModel', '不投保');
  				if (element.insPlanItemDtoList !== null) {
  					if (element.insPlanItemDto) {
  						// 有預設值
  					  this.$set(element, 'itemSelectedModel', element.item + element.insPlanItemDto.plan + element.insPlanItemDto.vrsn);
  					} else {
  						// this.$set(element, 'itemSelectedModel', element.item + element.insPlanItemDtoList[0].plan + element.insPlanItemDtoList[0].vrsn);
  						this.$set(element, 'itemSelectedModel', undefined);
  					}
  				} else if (element.insPlanItemDto.sa !== null) {
  					// 有預設值
  					  this.$set(element, 'itemSelectedModel', element.insPlanItemDto.sa);
  					} else {
  					  // this.$set(element, 'itemSelectedModel', element.saMin);
  					  this.$set(element, 'itemSelectedModel', undefined);
  				}
  			}
  		});
  	}
  }
}
</script>

<style lang="scss" scoped>
.product__choice {
  border-left: 6px white solid;
  padding-left: 15px;
  // margin-left: 70px;
  &.selected {
    border-left: 6px #4CAAF5 solid;
  }
}
</style>
