<template>
  <div class="miTypeDataEdit">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        險種資料修改
      </h2>
    </div>
    <div class="page__card">
      <a-form-model
        ref="miTypeDataEditForm"
        class="gioFormGroup formW720"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-row :gutter="[15, 0]">
          <!-- 險種代號 -->
          <a-form-model-item label="險種代號">
            <p class="result__info">
              {{ form.item }}
            </p>
          </a-form-model-item>
          <!-- 中文簡稱 -->
          <a-form-model-item
            label="中文簡稱"
            prop="itemSname"
          >
            <a-textarea
              v-model="form.itemSname"
              :auto-size="{ minRows: 1}"
              placeholder="e.g. 重大疾病險"
            />
          </a-form-model-item>
          <!-- 中文全名 -->
          <a-form-model-item label="中文全名">
            <p class="result__info">
              {{ dtjxig }}
            </p>
          </a-form-model-item>
          <!-- 英文全名 -->
          <a-form-model-item
            label="英文全名"
            prop="itemEname"
          >
            <a-textarea
              v-model="form.itemEname"
              :auto-size="{ minRows: 1}"
              placeholder="e.g. Fubon Life New Group Cancer Medical Health Insurance Rider Type A(Gcni)"
            />
          </a-form-model-item>
          <!-- 險種類型 -->
          <a-form-model-item
            label="險種類型"
            prop="type"
          >
            <a-select
              v-model="form.type"
              :show-arrow="true"
              allow-clear
            >
              <a-select-option
                v-for="item in insuranceType"
                :key="item.key"
                :value="item.key"
              >
                {{ item.key }}_{{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- 保額名稱 -->
          <a-form-model-item
            label="保額名稱"
            prop="saUnitName"
            type="flex"
            class="form-item__bg--blue"
          >
            <a-radio-group
              v-model="form.saUnitName"
              name="insuredAmountGroup"
              :options="insuredAmountOptions"
            />
          </a-form-model-item>
          <p class="message--error">
            {{ insuredAmountError }}
          </p>
          <!-- 可投保屬性 -->
          <a-form-model-item
            label="可投保屬性"
            prop="attr"
            class="form-item__bg--blue"
          >
            <a-checkbox-group
              v-model="form.attr"
              name="insuredAmountGroup"
              :options="insurableAttrOptions"
            />
          </a-form-model-item>
          <p class="message--error">
            {{ insurableAttrError }}
          </p>
        </a-row>
      </a-form-model>
    </div>
    <div class="confirm__button-group card-confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.go(-1)"
      >
        上一步
      </button>
      <button
        class="confirm__button confirm__button-submit"
        @click="onSubmit()"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Modal } from 'ant-design-vue';

@Component({
  components: { LayoutLoading },
})
export default class MaintenanceInsuranceTypeDataEdit extends Vue {
  h = this.$createElement;

  pageLoading = false;

  dtjxig = '';

  insuredAmountError = null;

  insurableAttrError = null;

  // 險種類型 (未來可能會變動，先不共用)
  insuranceType: {
    key: string;
    value: string;
  }[] = [
    {
      key: 'S',
      value: '愛滋險',
    },
    {
      key: 'D',
      value: '重疾險',
    },
    {
      key: 'O',
      value: '職災險',
    },
    {
      key: 'C',
      value: '癌症險',
    },
    {
      key: 'M',
      value: '意外醫療',
    },
    {
      key: 'H',
      value: '醫療險',
    },
    {
      key: 'A',
      value: '意外險',
    },
    {
      key: 'L',
      value: '壽險',
    },
  ];

  // 保額名稱
  insuredAmountOptions = this.$enum.insuredAmountOptions.map((i) => ({ label: i.val, value: i.key }));

  // 可投保屬性
  insurableAttrOptions = this.$enum.insurableAttrOptions.map((i) => ({ label: i.val, value: i.key }));

  form = {
    item: undefined,
    itemEname: undefined,
    itemSname: undefined,
    type: undefined,
    saUnitName: undefined,
    attr: [],
  };

  rules: { [key: string]: ValidationRule[] } = {
    itemEname: [
      {
        required: true,
        message: '請輸入英文全名',
        trigger: 'change',
      },
      {
        message: '字數上限100字',
        trigger: 'change',
        max: 100,
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    itemSname: [
      {
        required: true,
        message: '請輸入中文簡稱',
        trigger: 'change',
      },
      {
        message: '字數上限100字',
        trigger: 'change',
        max: 100,
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    type: [
      {
        required: true,
        message: '請選擇險種類型',
        trigger: 'change',
      },
    ],
    attr: [
      {
        required: true,
        trigger: 'change',
        validator: this.checkInsurableAttr,
      },
    ],
  };

  /**
   * Func
   */
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  // 資料驗證
  validateForm(refsName) {
    return (this.$refs[refsName] as any).validate();
  }

  // 取得 Query 並帶入資料
  setEditParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.getInsuranceData($query.item);
    }
  }

  // 取得 單筆修改資料
  getInsuranceData(param) {
    this.pageLoading = true;
    this.$gioInsuranceApi
      .insUpdatePageUsingPOST(param)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          // console.log(getData);
          this.dtjxig = getData.dtjxig;

          this.form.item = getData.item;
          this.form.itemSname = getData.itemSname;
          this.form.itemEname = getData.itemEname;
          this.form.type = (getData.type && getData.type.id) ? getData.type.id : null;
          this.form.saUnitName = this.$enum.getKey('insuredAmountOptions', getData.saUnitName.name);
          this.form.attr = getData.attr.map((i) => i.id);
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '無法取得資料'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 檢核 保額名稱
  checkInsuredAmountError(rule, value, callback) {
    if (value.length <= 0) {
      this.insuredAmountError = '請選擇可投保屬性';
      callback('');
    } else {
      this.insuredAmountError = null;
      callback();
    }
  }

  // 檢核 可投保屬性
  checkInsurableAttr(rule, value, callback) {
    if (value.length <= 0) {
      this.insurableAttrError = '請選擇可投保屬性';
      callback('');
    } else {
      this.insurableAttrError = null;
      callback();
    }
  }

  /**
   * Event
   */
  // 完成
  onSubmit() {
    (this.$refs.miTypeDataEditForm as any).validate()
      .then(() => {
        if (this.insurableAttrError === null) {
          // 修改險種資料
          this.pageLoading = true;
          this.$gioInsuranceApi
            .insUpdateUsingPOST(this.form)
            .then((resp) => {
              if (resp.data.status == 200) {
                this.$router.push({ name: 'MaintenanceInsuranceTypeData' }).then(() => {
                  this.$infoNotification.success({
                    Content: '已完成修改',
                  });
                  // 清除 param
                  this.$global.clearParam();
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
              console.log('error = ', error);
            })
            .finally(() => {
              this.pageLoading = false;
            });
        }
      })
      .catch((error) => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = this.$el.querySelector('.has-error');
        if (getErrorEle) {
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
  }

  /**
   * Hooks
   */
  created() {
    this.setEditParam();
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-form-item-label {
    padding-left: 16px;
    padding-right: 16px;
  }
}
.message--error {
  padding-left: 115px;
}

</style>
