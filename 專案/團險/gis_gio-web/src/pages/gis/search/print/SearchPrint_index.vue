<template>
  <div>
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的收據項目？(可複選)
      </h2>
    </div>
    <a-form-model
      ref="SearchPrintForm"
      class="gioFormGroup formW"
      :layout="'vertical'"
      :hide-required-mark="true"
      :model="form"
      :rules="rules"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <div>
        <!-- <a-col> -->
        <a-form-model-item label="收據申請日期">
          <date-picker
            v-model="sqlRange"
            type="date"
            style="width: 100%"
            :range-separator="'~'"
            :range="true"
            :formatter="formatter"
            :allow-clear="true"
          />
        </a-form-model-item>
        <!-- </a-col> -->
        <a-form-model-item label="列印狀態" prop="status" class="radioStyle">
          <a-radio-group v-model="form.status" name="radioGroup">
            <a-radio value="1">
              全部
            </a-radio>
            <a-radio value="Y">
              已列印
            </a-radio>
            <a-radio value="X">
              未列印
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </div>
    </a-form-model>
    <div class="search-footer text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="onSubmit()"
      >
        查詢
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { ReceiptPrintQueryInDto } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class SearchPrint extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  pageLoading = false;

// 時間format格式
  formatter = this.$twDateFormatter;

  // 【收據列印日期】欄位值
  sqlRange = [];

  // 表單內容
  form: ReceiptPrintQueryInDto= {
    endDate: undefined,
    status: undefined,
    strDate: undefined,
  };

  // 【收據列印日期】錯誤提示訊息
  sqlRangeError= '';

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    // 【列印狀態】欄位檢核
    status: [
      {
        required: true,
        message: '請選擇列印狀態',
      },
    ],
  }

  /**
 * Func
 */
// 僅提供一年之資料
// checkSqlRange(rule, value, callback) {
//   console.log(value);
// }

  /**
   * Event
   */
  // 查詢
  onSubmit() {
    // 【收據列印日期】欄位檢核
    if (this.sqlRange) {
      const [str, end] = this.sqlRange;
      this.sqlRangeError = (str && end) ? null : '請選擇查詢區間';
      }
    this.form.endDate = this.$dateTime.ISO8601DateFormatter(this.sqlRange[1]);
    this.form.strDate = this.$dateTime.ISO8601DateFormatter(this.sqlRange[0]);
    (this.$refs.SearchPrintForm as any).validate()
      .then(() => {
        console.log(Response);
        this.getSearchData();
      });
  }

  // API: 查詢團險收據列印
  // 先確認查詢有資料
  getSearchData() {
    this.pageLoading = true;
    this.$gioDataProcessApi
      .receiptPrintQueryUsingPOST(this.form)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          const hasContent = (getData.numberOfElements > 0);
          // const hasContent = !(getData.content.length = 0);
          if (!hasContent) {
            Modal.error({
              title: this.h('div', {}, '錯誤訊息'),
              content: '查無資料，請重新選擇查詢條件。',
              okType: 'confrim',
              okText: '確定',
              icon: () =>
                this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
            });
          } else {
              this.$global.changeRouterAndaddParam({
                toRouter: 'SearchPrintResult',
                query: {
                  endDate: this.form.endDate,
                  status: this.form.status,
                  strDate: this.form.strDate,
                  },
                });
          }
        } else {
          // 查找失敗訊息
          this.$infoNotification.error({
            Content: '無法進行項目查詢，請檢查是否有欄位漏填。',
          });
        }
      })
      .catch((error) => {
        // TEST:
        console.log(error.response);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }
  // disabledDate(current) {
  //     // 以當天為基準，禁用未來和一年前的時間
  //   return current && (current < moment().subtract(1, 'years').toDate() || current > moment().endOf('day'));
  // }

 /**
  * Hooks
  */
  created() {
    if (!this.form.status) {
      this.form.status = '1';
    }
  }
}
</script>

<style scoped>
.formW{
  max-width: 352px;
  margin: 0 auto;
}

::v-deep .radioStyle{
  background-color:#E6F4FF;
  /* margin: 0 auto; */
  margin-bottom: 68px;
  padding-left: 16px;
}

::v-deep .ant-radio-group{
  font-weight: bold;
  color: #000000;
}
</style>
