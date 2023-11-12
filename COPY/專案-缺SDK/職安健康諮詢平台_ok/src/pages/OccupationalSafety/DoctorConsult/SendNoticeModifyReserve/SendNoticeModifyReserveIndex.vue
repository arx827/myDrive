<template>
  <div>
    <div class="container">
      <div class="page__title">
        發送通知與修改預約
      </div>
      <div class="query__title">
        您想處理什麼時間的通知和預約？
      </div>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :layout="'vertical'"
        :rules="formRules"
      >
        <div class="row query__wrap m-auto">
          <div class="col-md-6 col-12">
            <div
              class="date__wrap"
              :class="{'query__wrap--selected': dateOneIsSelected}"
            >
              <p class="query__title mt-2 mb-1 text-end me-3">
                單日
              </p>
              <a-form-model-item prop="dateOne">
                <date-picker
                  v-model="form.dateOne"
                  placeholder="e.g. 2022/01/01"
                  type="date"
                  :format="'YYYY/MM/DD'"
                  @change="clearDataRange"
                  @focus="dateOneIsSelected=true"
                />
              </a-form-model-item>
            </div>
          </div>
          <div
            class="col-md-6 col-12"
          >
            <div
              class="date__wrap"
              :class="{'query__wrap--selected': dateRangeIsSelected}"
            >
              <p class="query__title mt-2 mb-1 text-start ms-3">
                區間
              </p>
              <a-form-model-item prop="dateRange">
                <date-picker
                  v-model="form.dateRange"
                  placeholder="e.g. 2022/01/01～2022/02/01"
                  type="date"
                  :range="true"
                  :format="'YYYY/MM/DD'"
                  @change="clearDataOne"
                  @focus="dateRangeIsSelected=true"
                />
              </a-form-model-item>
            </div>
          </div>
        </div>
      </a-form-model>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary"
          @click="onSearch"
        >
          查詢
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DataTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb } })
export default class SendNoticeModifyReserveIndex extends Vue {
  // 聚焦區間
  dateOneIsSelected = false;

  // 聚焦單日
  dateRangeIsSelected = false;

  // 表單
  form = {
  	dateOne: null, // 單日
  	dateRange: null, // 區間
  }

  // 檢核規則
  formRules = {
  	dateOne: [{ required: true, message: '請填入有效單日日期' }],
  	dateRange: [{ required: true, message: '請填入有效區間日期' }],
  }

  // 清除單一檢核
  clearDataOne() {
  	this.dateOneIsSelected = false;
  	this.dateRangeIsSelected = true;
  	this.formRules.dateOne = [{ required: false, message: '' }];
  	this.formRules.dateRange = [{ required: true, message: '請填入有效區間日期' }];
  	this.form.dateOne = null;
  }

  // 清除區間檢核
  clearDataRange() {
  	this.dateOneIsSelected = true;
  	this.dateRangeIsSelected = false;
  	this.formRules.dateOne = [{ required: true, message: '請填入有效單日日期' }];
  	this.formRules.dateRange = [{ required: false, message: '' }];
  	this.form.dateRange = null;
  }

  async setQuery() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'SendNoticeModifyReserveResult',
  		query: {
  			dateType: this.dateOneIsSelected ? 'single' : 'range',
  			data: this.dateOneIsSelected ? DataTimeFormmat.formatStringDateDault(this.form?.dateOne) : (this.form?.dateRange && DataTimeFormmat.filterRangeDate(this.form?.dateRange)),
  		},
  	});
  }

  // 查詢
  onSearch() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.setQuery();
  		} else {
  			console.log('error search!!');
  			return false;
  		}
  	});
  }
}
</script>

<style lang="scss" scoped>
  .query__title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #000000;
    text-align: center;
  }
  .query__wrap {
    max-width: 720px;
    margin: auto;
    width: 100%;
  }
  .date__wrap {
    border: 0.5px solid #CED4D9;
    border-radius: 6px;
    text-align: center;
    margin-bottom: 20px;
    &:hover {
      background-color: #7DC9CF;
      box-shadow: 0px 2px 2px #00000029;
      .query__title {
        color: #fff;
      }
    }
    &.query__wrap--selected {
      background-color: #7DC9CF;
      box-shadow: 0px 2px 2px #00000029;
      .query__title {
        color: #fff;
      }
    }
  }
  ::v-deep {
    .mx-input, .mx-input-wrapper, .mx-datepicker {
      height: 40px;
      width: 98%;
      margin: auto;
      font-size: 16px;
      i {
        margin-right: 5px;
      }
    }
  }
  .btn__wrap {
    margin: 30px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
