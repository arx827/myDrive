<template>
  <div class="MarketingGioPremiumGio">
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的團險保費？(可多選)
      </h2>
    </div>
    <div class="search-dispatch">
      <a-form-model
        ref="marketingGioPremiumGioIndexForm"
        class="gioFormGroup formW275"
        :layout="'vertical'"
        :hide-required-mark="true"
        :model="form"
        :rules="rules"
      >
        <a-row
          type="flex"
          justify="center"
        >
          <a-col span="24">
            <a-form-model-item label="產品線" prop="productLine">
              <a-select
                v-model="form.productLine"
                allow-clear
              >
                <a-select-option
                  v-for="item in $enum.customer"
                  :key="item.key"
                >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="center"
        >
          <a-col span="24">
            <a-form-model-item label="日期條件" prop="queryDate">
              <a-select
                v-model="form.queryDate"
                allow-clear
              >
                <a-select-option
                  v-for="item in $enum.queryDate"
                  :key="item.key"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="center"
        >
          <a-col span="24">
            <a-form-model-item label="查詢區間 (僅提供近三年之資料)">
              <date-picker
                v-model="queryRange"
                type="date"
                style="width: 100%"
                placeholder="e.g. 110/01/01～110/02/01"
                :class="{'has-error':queryRangeError}"
                :range-separator="'~'"
                :range="true"
                :formatter="formatter"
                :allow-clear="true"
                :disabled-date="disabledDate"
              />
              <p v-if="queryRangeError" class="message--error">
                {{ queryRangeError }}
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="search-footer text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="handleSubmit()"
      >
        下載
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { GiPremiumQueryModel } from '@fubonlife/co-giiss-api-axios-sdk';
import { Getter, Action, State } from 'vuex-class';
import moment from 'moment';

@Component({})
export default class MarketingGioPremiumGio extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 【查詢區間】欄位值
  // TEST:
  // queryRange = [new Date('2010-10-10T15:49:12.000+0800'), new Date('2011-10-10T15:49:12.000+0800')];
  queryRange = [];

  // 表單內容
  form: GiPremiumQueryModel = {
    productLine: '1',
    queryDate: '1',
  };

  // 【查詢區間】錯誤提示訊息
  queryRangeError= '';

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    productLine: [{ required: true, message: '請選擇產品線', trigger: 'change' }],
    queryDate: [{ required: true, message: '請選擇日期條件', trigger: 'change' }],
  }

  /**
   * Func
   */
  disabledDate(current) {
    // 以當天為基準，禁用未來和三年前的時間
  	return current && (current < moment().subtract(3, 'years').toDate() || current > moment().endOf('day'));
  }

  /**
   * Event
   */
  // 下載
  handleSubmit() {
    if (this.queryRange) {
      const [str, end] = this.queryRange;
      this.queryRangeError = (str && end) ? null : '請選擇查詢區間';
    }
    (this.$refs.marketingGioPremiumGioIndexForm as any).validate()
      .then(() => {
        if (!this.queryRangeError) {
          this.setLoading(true);
          const { form } = this;
          const current = moment(new Date()).format('YYYY/MM/DD').split('/');
          const twYear = `${parseInt(current[0]) - 1911}`;
          const downloadName = `團險保費查詢結果_${twYear}${current[1]}${current[2]}`;
          form.fileName = downloadName;
          const $submit = JSON.parse(JSON.stringify(form));
          // 【產品線】欄位值若為「全部」，則帶 null 給後端
          $submit.productLine = ($submit.productLine === '0') ? null : $submit.productLine;

          this.$gioDataProcessApi.downloadGiPremiumExcelUsingPOST($submit, { responseType: 'blob' })
            .then((resp) => {
              if (resp.headers['content-disposition']) {
                this.$blobUtils.download(resp.data as Blob, `${downloadName}.xlsx`);
              } else {
                this.$gioDataProcessApi.downloadGiPremiumExcelUsingPOST($submit)
                .then((resp) => {
                  const errorData = JSON.parse(JSON.stringify(resp));
                  if (errorData.data.status != 200) {
                    const getError = errorData.data;
                    this.$infoNotification.error({
                      Content: '無法完成查詢項目，請再次嘗試。',
                      apiError: getError.apiError,
                    });
                  }
                });
              }
              // ------------------------------
            })
            .catch((error) => {
              this.$infoNotification.error({
                Content: '無法完成下載項目，請再次嘗試。',
              });
            })
            .finally(() => {
              this.setLoading(false);
            });
        }
      });
  }

 /**
 * Hooks
 */
  created() {

    // TEST: 測試資料
    // if (this.queryRange) {
    //   const [strDate, endDate] = this.queryRange;
    //   if (strDate && endDate) {
    //     Object.assign(this.form, {
    //       strDate: this.$dateTime.ADDateFormatter(strDate),
    //       endDate: this.$dateTime.ADDateFormatter(endDate),
    //     });
    //   }
    // }
  }

 /**
 * 監聽
 */
  @Watch('queryRange')
  watchQueryRange(val) {
    const [strDate, endDate] = val;
    if (strDate && endDate) {
      Object.assign(this.form, {
        strDate: this.$dateTime.ADDateFormatter(strDate),
        endDate: this.$dateTime.ADDateFormatter(endDate),
      });
      this.queryRangeError = null;
    } else {
      this.queryRangeError = '請選擇查詢區間';
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
