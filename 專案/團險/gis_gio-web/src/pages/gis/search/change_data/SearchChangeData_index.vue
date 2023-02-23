<template>
  <div class="searchChangeDataIndex">
    <LayoutLoading v-if="pageLoading" />
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的異動資料？(可多選)
      </h2>
    </div>
    <div class="search-form formContant container-fluid">
      <a-form-model
        class="gioFormGroup formW860"
        :layout="'vertical'"
        :hide-required-mark="true"
      >
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <a-col span="8">
            <a-form-model-item label="產品線">
              <a-select
                v-model="form.productLine"
                allow-clear
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
          <a-col span="8">
            <a-form-model-item label="行政人員">
              <a-select
                v-model="form.userId"
                allow-clear
                :loading="isSelectLodaing"
                placeholder="請選擇"
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
          <a-col span="8" />
        </a-row>
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <a-col span="8">
            <a-form-model-item label="保單號碼">
              <input
                v-model="policyNum"
                v-mask="'NNNNNNN-NNN'"
                class="ant-input"
                placeholder="e.g. 1234567 - 000"
                allow-clear
                type="text"
                @blur="policyNum = $event.target.value.toUpperCase()"
              >
            </a-form-model-item>
          </a-col>
          <a-col span="8">
            <a-form-model-item label="受理日期">
              <date-picker
                v-model="appDate"
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
              <p v-if="appDateRangeError" class="message--error">
                {{ appDateRangeError }}
              </p>
            </a-form-model-item>
          </a-col>
          <a-col span="8" />
        </a-row>
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <a-col span="16">
            <a-form-model-item>
              <span slot="label" class="form-label-slot">
                被保險人姓名
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
              <a-input v-model="form.insName" placeholder="e.g. 陳林小王" vue="true" alt="webfont" />
            </a-form-model-item>
          </a-col>
          <a-col span="8">
            <a-form-model-item label="身分證字號/居留證號碼">
              <input
                v-model="form.insIdNo"
                v-mask="'NNNNNNNNNN'"
                placeholder="e.g. A123456789"
                class="ant-input"
              >
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item label="上傳狀態" class="form-item__bg--blue">
              <a-radio-group
                v-model="form.status"
                name="statusRadioGroup"
                :default-value="'0'"
                :options="statusOpts"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item label="作業別" class="form-item__bg--blue">
              <a-radio-group
                v-model="form.appType"
                name="appTypeRadioGroup"
                :default-value="'8'"
                :options="appTypeOpts"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item label="屬性" class="form-item__bg--blue">
              <a-radio-group
                v-model="form.insAttr"
                name="insAttrRadioGroup"
                :default-value="'0'"
                :options="insurableAttrOptions"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="24">
            <a-form-model-item label="備註" class="form-item__bg--blue">
              <a-radio-group
                v-model="form.noteType"
                name="noteTypeRadioGroup"
                :default-value="'0'"
                :options="noteTypeOpts"
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
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import moment from 'moment';
import { InschgMasterQueryModel } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({
  components: { LayoutLoading },
})
export default class SearchChangeData extends Vue {
  appDate = null;

  appDateRangeError = null;

  // 【作業別】選項
  appTypeOpts = this.$enum.appType.map((i) => ({ label: i.val, value: i.key }))

  // 時間format格式
  formatter = this.$twDateFormatter;

  form: InschgMasterQueryModel = {
    // 【產品線】依登入者之權限帶入
    productLine: ((this.$user.getAdmCbRc() as string) !== 'ALL') ? this.$enum.getKey('customer', this.$user.getAdmCbRc()) : '1',
    userId: '0',
  };

  // 【可投保屬性】選項
  insurableAttrOptions = this.$enum.searchInsurableAttr.map((i) => ({ label: i.val, value: i.key }))

  // 【備註】選項
  noteTypeOpts = this.$enum.noteType.map((i) => ({ label: i.val, value: i.key }))

  pageLoading = true;

  policyNum = null;

  // 【產品線】選項
  productLineOpts = [];

  // 【上傳狀態】選項
  statusOpts = this.$enum.uploadStatus.map((i) => ({ label: i.val, value: i.key }))

  // 【行政人員】選項
  userIdOpts = [];

  // date picker 手動輸入是否有誤
  isDateInputError = false;

  // 下拉選項是否 loading
  isSelectLodaing = true;

  /**
   * Func
   */
  // 【受理日期】欄位 禁用大於系統日加1年的時間
  disabledDate(current) {
    return current && current > moment().add(1, 'years').toDate();
  }

  // date picker - 手動輸入錯誤時觸發
  handleDateInputError() {
    this.isDateInputError = true;
    this.appDateRangeError = '請輸入有效日期區間';
  }

  /**
   * Event
   */
  // 保單號碼 查詢
  handleSubmit() {
    if (this.policyNum) {
      const [no, seq] = this.policyNum.split('-');
      Object.assign(this.form, {
        policyNo: no,
        policySeq: seq,
      });
    }
    if (this.appDateRangeError === null) {
      this.$global.changeRouterAndaddParam({
        toRouter: 'SearchChangeDataResult',
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
    // 【產品線】下拉選單增加「全部」選項
    this.productLineOpts = JSON.parse(JSON.stringify(this.$enum.customer));
  }

  /**
   * 監聽
   */
  // 【身分證字號】欄位 第一個字母轉大寫
  @Watch('form.insIdNo')
  watchInsIdNo(newVal) {
    if (newVal) {
      const rgx = /^[A-Za-z]{1}/;
      if (rgx.test(newVal)) {
        this.form.insIdNo = this.form.insIdNo.toUpperCase();
      }
    }
  }

  @Watch('appDate', { deep: true })
  appDateChanged(newVal) {
    this.isDateInputError = !newVal;
    this.appDateRangeError = null;

    const [start, end] = newVal;
    if (start && end) {
      Object.assign(this.form, {
        // 將 Date 格式轉為 ISO860 格式傳到後端
        appDateStart: this.$dateTime.ISO8601DateFormatter(start),
        appDateEnd: this.$dateTime.ISO8601DateFormatter(end.setHours(23, 59, 59)),
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
            this.form.userId = '0';
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
