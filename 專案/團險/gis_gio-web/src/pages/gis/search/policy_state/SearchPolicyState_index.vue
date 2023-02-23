<template>
  <div class="searchPolicyStateIndex">
    <LayoutLoading v-if="pageLoading" />
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的保單狀態？(可多選)
      </h2>
    </div>
    <div class="search-form formContant container-fluid">
      <a-form-model
        ref="searchPolicyStateIndexForm"
        class="gioFormGroup formW570"
        :layout="'vertical'"
        :hide-required-mark="true"
        :model="form"
        :rules="rules"
      >
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <a-col span="12">
            <a-form-model-item label="產品線" prop="productLine">
              <a-select
                v-model="form.productLine"
                allow-clear
                placeholder="請選擇"
              >
                <a-select-option
                  v-for="item in productLineOpts"
                  :key="item.key"
                >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="行政人員">
              <a-select
                v-model="form.userId"
                allow-clear
                placeholder="請選擇"
                :loading="isSelectLodaing"
              >
                <a-select-option
                  v-for="item in userIdOpts"
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
          :gutter="[15, 0]"
        >
          <a-col span="12">
            <a-form-model-item
              label="保單號碼"
              prop="policyNo"
              :validate-status="(customErrorMsg.policyNoError && customErrorMsg.policyNoError.length > 0)?'error':''"
            >
              <input
                v-model="form.policyNo"
                v-mask="'NNNNNNN-NNN'"
                class="ant-input"
                placeholder="e.g. 1234567 - 000"
                allow-clear
                type="text"
                @blur="policyNo = $event.target.value.toUpperCase()"
              >
              <p v-for="(msg, idx) in customErrorMsg.policyNoError" :key="idx" class="message--error">
                {{ msg }}
              </p>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="保險期間">
              <date-picker
                v-model="strDateRange"
                type="date"
                style="width: 100%"
                placeholder="e.g. 110/01/01～110/02/01"
                :range-separator="'~'"
                :range="true"
                :formatter="formatter"
                :allow-clear="true"
                :disabled-date="disabledDate"
                :class="{'has-error':isDateInputError}"
                @input-error="handleDateInputError"
              />
              <p v-if="customErrorMsg.strDateRangeError" class="message--error">
                {{ customErrorMsg.strDateRangeError }}
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item label="要保單位中文名稱">
              <a-input
                v-model="form.fullName"
                placeholder="e.g. 要保單位中文名稱"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item>
              <span slot="label" class="form-label-slot">
                要保單位承辦人
                <a-popover
                  trigger="click"
                  placement="top"
                >
                  <template slot="content">
                    <div>原住民特殊字元可以複製以下字元使用</div>
                    <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                  </template>
                  <a-icon
                    type="info-circle"
                    :style="{ color: '#4CAAF5', cursor: 'pointer', }"
                  />
                </a-popover>
              </span>
              <a-input
                v-model="form.applRepr"
                placeholder="e.g. 王小明"
                vue="true"
                alt="webfont"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item label="目前使用狀態" class="form-item__bg--blue">
              <a-radio-group
                v-model="form.cnctStat"
                name="cnctStatRadioGroup"
                :default-value="'all'"
                :options="cnctStatOpts"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="search-footer text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="handleSubmit"
      >
        查詢
      </button>
    </div>
  </div>
</template>

<script lang=ts>
import { Vue, Component, Watch } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { FGPPOLRQueryModel } from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';

@Component({
  components: { LayoutLoading },
})
export default class SearchPolicyState extends Vue {
  // 時間format格式
  formatter = this.$twDateFormatter;

  pageLoading = true;

  policyNo = null;

  form: FGPPOLRQueryModel = {
    productLine: '0',
    // userId: '0',
    policyNo: undefined,
  };

  // 【保險期間】欄位值
  strDateRange = [];

  // date picker 手動輸入是否有誤
  isDateInputError = false;

  // 下拉選項是否 loading
  isSelectLodaing = true;

  // 【產品線】選項
  productLineOpts = [];

  // 【行政人員】選項
  userIdOpts = []

  // 【目前使用狀態】選項
  cnctStatOpts = this.$enum.cnctStatus.map((i) => ({ label: i.val, value: i.key }))

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    productLine: [{ required: true, message: '請選擇欲查詢的產品線', trigger: 'change' }],
    policyNo: [{ trigger: 'change', validator: this.checkpolicyNo }],
  }

  // 錯誤提示訊息
  customErrorMsg: { [key: string]: Array<string> | string} = {
    policyNoError: null,
    strDateRangeError: null,
  }

  /**
   * Func
   */
  // 【保險期間】欄位 禁用大於系統日加1年的時間
  disabledDate(current) {
    return current && current > moment().add(1, 'years').toDate();
  }

  // 依登入者權限產出【產品線】選項
  getProductLineOpts() {
    const admCbRc = ((this.$user.getAdmCbRc() as string) !== 'ALL') ? this.$enum.getKey('customer', this.$user.getAdmCbRc()) : '0';
    this.productLineOpts = JSON.parse(JSON.stringify(this.$enum.customer));
    switch (admCbRc) {
      case '1':
      case '8':
        this.productLineOpts = this.productLineOpts.filter((i) => i.key == admCbRc);
        this.form.productLine = admCbRc;
        break;
      default:
        this.form.productLine = '0';
        break;
    }
  }

  // 檢核
  checkpolicyNo(rule, value, callback) {
    const rgx = /[A-Z0-9-]/;
    const formatNum = this.$global.formatPolicyNum(value);
    if (formatNum.length < 9 || !rgx.test(formatNum)) {
      this.customErrorMsg.policyNoError = ['保單號碼-序號不符，請再次輸入'];
      callback('');
    } else {
      this.customErrorMsg.policyNoError = null;
      callback();
    }
  }

  // date picker - 手動輸入錯誤時觸發
  handleDateInputError() {
    this.isDateInputError = true;
    this.customErrorMsg.strDateRangeError = '請輸入有效日期區間';
  }

  /**
   * Event
   */
  // 查詢
  handleSubmit() {
    if (this.form.policyNo) {
      (this.$refs.searchPolicyStateIndexForm as any).validate()
        .then(() => {
          if (this.customErrorMsg.policyNoError === null && this.customErrorMsg.strDateRangeError == null) {
            const [no, seq] = this.policyNo.split('-');
            Object.assign(this.form, {
              policyNo: no,
              policySeq: seq,
            });
            this.$global.changeRouterAndaddParam({
              toRouter: 'SearchPolicyStateResult',
              query: {
                form: this.form,
              },
            });
          }
        });
    } else {
      this.$global.changeRouterAndaddParam({
        toRouter: 'SearchPolicyStateResult',
        query: {
          form: this.form,
        },
      });
    }
  }

  /**
   * Hooks
   */
  created() {
    this.getProductLineOpts();
  }

  /**
   * 監聽
   */
  @Watch('strDateRange', { deep: true })
  watchQueryRange(newVal) {
    this.isDateInputError = !newVal;
    this.customErrorMsg.strDateRangeError = null;

    const [strDate, endDate] = newVal;
    if (strDate && endDate) {
      Object.assign(this.form, {
        // 將 Date 格式轉為 ISO860 格式傳到後端
        strDateStart: this.$dateTime.ISO8601DateFormatter(strDate),
        strDateEnd: this.$dateTime.ISO8601DateFormatter(endDate.setHours(23, 59, 59)),
      });
    }
  }

  @Watch('form.productLine', { immediate: true })
  onProductLineChanged(newVal) {
    this.isSelectLodaing = true;
    if (newVal == 0) {
      // API: 團險行政人員下拉選單
      this.$gioUtilityApi.listAdmUserUsingPOST()
        .then((resp) => {
            const getData = JSON.parse(JSON.stringify(resp.data.data));
            this.userIdOpts = [{ admId: '0', admName: '全部' }, ...getData].map((i) => ({
              key: i.admId,
              val: (i.admId == '0') ? i.admName : [i.admId, i.admName].join(' '),
            }));
          })
          .catch((error) => {
            this.userIdOpts = [{ admId: '0', admName: '全部' }].map((i) => ({
              key: i.admId,
              val: i.admName,
            }));
          })
          .finally(() => {
            this.isSelectLodaing = false;
            this.pageLoading = false;
          });
    } else {
      // API: 團險產品線行政人員下拉選單
      this.$gioUtilityApi.listAdmCbRcUserUsingPOST(newVal)
        .then((resp) => {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          this.userIdOpts = [{ admId: '0', admName: '全部' }, ...getData].map((i) => ({
            key: i.admId,
            val: (i.admId == '0') ? i.admName : [i.admId, i.admName].join(' '),
          }));
          // 檢查已選的行政人員是否在選項中
          if (this.form.userId && this.userIdOpts.findIndex((i) => i.key == this.form.userId) < 0) {
            this.form.userId = undefined;
          }
        })
        .catch((error) => {
          this.userIdOpts = [{ admId: '0', admName: '全部' }].map((i) => ({
            key: i.admId,
            val: i.admName,
          }));
        })
        .finally(() => {
          this.isSelectLodaing = false;
          this.pageLoading = false;
        });
    }
  }
}

</script>

<style lang='scss' scoped>
.form-item__bg--blue {
  &.ant-form-item {
    padding: 8px 10px;
  }
}
</style>
