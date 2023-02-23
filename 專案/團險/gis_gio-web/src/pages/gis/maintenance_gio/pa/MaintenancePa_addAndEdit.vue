<template>
  <div class="MaintenancePaAddAndEdit">
    <div class="form-header">
      <h2
        class="main-title"
      >
        新增/修改
      </h2>
    </div>
    <div class="page__card">
      <a-form-model
        ref="maintenancePaAddAndEditForm"
        class="gioFormGroup formW720"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item
          label="主旨"
          prop="subject"
        >
          <a-textarea
            v-model="form.subject"
            :auto-size="{ minRows: 1}"
          />
        </a-form-model-item>

        <a-form-model-item
          label="內容"
          prop="content"
        >
          <a-textarea
            v-model="form.content"
            :auto-size="{ minRows: 3}"
          />
        </a-form-model-item>

        <a-form-model-item
          label="顯示日期"
          class="mb-0"
        >
          <a-row :gutter="13">
            <a-col :span="12">
              <a-form-model-item prop="dateRange">
                <date-picker
                  v-model="dateRange"
                  style="width: 100%"
                  :range-separator="'-'"
                  :range="true"
                  :formatter="formatter"
                  :allow-clear="true"
                  type="date"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <p v-if="dateError" class="message--error">
            {{ concatDateError(dateError) }}
          </p>
        </a-form-model-item>

        <a-form-model-item
          label="類別"
          prop="category"
          class="form-item__bg--blue radioBtn-group"
        >
          <a-radio-group
            v-model="form.category"
            name="categoryRadioGroup"
            :options="categoryOptions"
          />
        </a-form-model-item>
        <p v-if="categoryError" class="message--error">
          {{ categoryError }}
        </p>

        <a-form-model-item
          label="客戶"
          prop="customer"
          class="form-item__bg--blue radioBtn-group"
        >
          <a-radio-group
            v-model="form.customer"
            name="customerRadioGroup"
            :options="customerOptions"
          />
        </a-form-model-item>
        <p v-if="customerError" class="message--error">
          {{ customerError }}
        </p>

        <a-form-model-item
          label="置頂"
          prop="top"
          class="form-item__bg--blue radioBtn-group"
        >
          <a-radio-group
            v-model="form.top"
            name="topRadioGroup"
            :options="topOptions"
          />
        </a-form-model-item>
        <p v-if="topError" class="message--error">
          {{ topError }}
        </p>
      </a-form-model>
    </div>
    <div class="form-footer text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.go(-1)"
      >
        上一步
      </button>
      <button
        class="confirm__button confirm__button-submit"
        @click="handleSubmitForm"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { MessageMaintainUpdateModel } from '@fubonlife/co-giiss-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';

@Component({})
export default class MaintenancePaAddAndEdit extends Vue {
  @Action('setLoading') setLoading

  // 時間format格式
  formatter = this.$twDateFormatter;

  h = this.$createElement;

  // 錯誤訊息
  dateError: { startDate: string; endDate: string } = {
    startDate: null,
    endDate: null,
  }

  categoryError = null;

  customerError = null;

  topError = null;

  dateRange: Array<any> = [];

  currentRange: Array<any> = [];

  form: MessageMaintainUpdateModel = {
    top: 'N',
  };

  rules: { [key: string]: ValidationRule[] } = {
    subject: [
      {
        required: true,
        message: '請輸入主旨',
        trigger: 'change',
      },
    ],
    content: [
      {
        required: true,
        message: '請輸入內容',
        trigger: 'change',
      },
    ],
    category: [
      {
        required: true,
        trigger: 'change',
        validator: this.checkCategory,
      },
    ],
    customer: [
      {
        required: true,
        trigger: 'change',
        validator: this.checkCustomer,
      },
    ],
  }

  addAndEditType = '';

  // 置頂
  topOptions: {label: string; value: string}[] = this.$enum.top.map((i) => ({
    label: i.val,
    value: i.key,
  }))

  // 類別
  categoryOptions: {label: string; value: string}[] = this.$enum.category.map((i) => ({
    label: i.val,
    value: i.key,
  }))

  // 客戶
  customerOptions: {label: string; value: string}[] = this.$enum.customer.map((i) => ({
    label: i.val,
    value: i.key,
  }))

  /**
   * Func
   */
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      const {
       type, id, form,
      } = $query;
      this.addAndEditType = type;
      if (form) {
        this.form = form;
      } else if (type === 'edit') {
        this.getMessageUpdate(id);
      }
    }
  }

  // 訊息公告維護-帶出單一訊息公告資料
  getMessageUpdate(id) {
    this.setLoading(true);
    this.$messageMaintainApi
      .messageUpdateUsingPOST(id)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.form = getData[0];
          this.dateRange = [new Date(this.form.startDate), new Date(this.form.endDate)];
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 檢核
  checkCategory(rule, value, callback) {
    // console.log(rule.validator());
    if (!value) {
      this.categoryError = '請選擇類別';
      callback('');
    } else {
      this.categoryError = null;
      callback();
    }
  }

  checkCustomer(rule, value, callback) {
    if (!value) {
      this.customerError = '請選擇客戶';
      callback('');
    } else {
      this.customerError = null;
      callback();
    }
  }

  // 組合顯示日期的錯誤訊息
  concatDateError(obj) {
    const { startDate, endDate } = obj;
    if (startDate || endDate) {
      const errArr = [];
      if (startDate) {
        errArr.push(startDate);
      }
      if (endDate) {
        errArr.push(endDate);
      }

      const errStr = errArr.join('、');
      return `請選擇${errStr}`;
    }
  }

  /**
   * Event
   */
  handleSubmitForm() {
    // console.log(this.form);
    (this.$refs.maintenancePaAddAndEditForm as any).validate()
      .then(() => {
        if (this.categoryError === null && this.customerError === null) {
          if (this.addAndEditType == 'add') {
            this.$messageMaintainApi
            .messageAddUsingPOST(this.form)
              .then((resp) => {
                // console.log(resp.data);
                if (resp.data.status == 200) {
                  this.$router
                    .push({ name: 'MaintenancePa' })
                    .then(() => {
                      this.$infoNotification.success({
                        Content: '已完成新增',
                      });
                    });
                } else {
                  // 查找失敗訊息
                  this.$infoNotification.error({
                    Content: '無法完成新增項目，請再次嘗試。',
                    apiError: resp.data.apiError,
                  });
                }
              })
              .catch((error) => {
                this.$infoNotification.error({
                  Content: '無法完成新增項目，請再次嘗試。',
                });
              })
              .finally(() => {
                this.setLoading(false);
              });
          } else {
            this.$messageMaintainApi
            .messageUpdateUsingPOST1(this.form)
              .then((resp) => {
                // TEST:
                // console.log(resp.data);
              if (resp.data.status == 200) {
                this.$router.push({ name: 'MaintenancePa' })
                .then(() => {
                  this.$infoNotification.success({
                    Content: '已完成修改',
                  });
                });
              } else {
                // 查找失敗訊息
                this.$infoNotification.error({
                  Content: '無法完成修改項目，請再次嘗試。',
                  apiError: resp.data.apiError,
                });
              }
            })
            .catch((error) => {
              this.$infoNotification.error({
                Content: '無法完成修改項目，請再次嘗試。',
              });
            })
            .finally(() => {
              this.setLoading(false);
            });
          }
        }
      });
  }

  /**
   * Hooks
   */
  async created() {
    this.setResultParam();
  }

  @Watch('dateRange')
  onDateRangeChanged(): void {
    this.form.startDate = this.dateRange[0];
    this.form.endDate = this.dateRange[1];
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-form-item-label {
    padding-left: 16px;
    padding-right: 27px;
    text-align: right;
  }
}

.form-footer {
  padding: 30px 0 40px 0;
}

.radioBtn-group {
  display: flex;
  align-items: center;
}

textarea.ant-input {
  margin-bottom: 0;
}

.confirm-item__title {
  padding: 5px 0;
}

.message--error {
  padding-left: 205px;
}

</style>
