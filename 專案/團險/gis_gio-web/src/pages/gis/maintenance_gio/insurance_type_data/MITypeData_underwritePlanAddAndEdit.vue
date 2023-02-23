<template>
  <div class="miTypeDataUnderwritePlanAndEdit">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        CB計劃別新增/修改
      </h2>
    </div>
    <div
      class="page__card"
    >
      <a-form-model
        ref="miTypeDataUnderwritePlanAndEditForm"
        class="gioFormGroup formW720"
        :form="form"
        :rules="rules"
        :layout="'vertical'"
        :model="form"
        :hide-required-mark="true"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-row :gutter="[15, 0]">
          <!-- 險種代號 -->
          <a-form-model-item
            label="險種代號"
            prop="item"
          >
            <p class="result__info">
              {{ form.item }}
            </p>
          </a-form-model-item>
          <!-- 計劃別 -->
          <a-form-model-item
            label="計劃別"
            prop="plan"
          >
            <a-input v-if="addAndEditType === 'add'" v-model="form.plan" placeholder="請輸入計劃別" />
            <p v-else class="result__info">
              {{ form.plan }}
            </p>
          </a-form-model-item>
          <!-- 計劃別說明 -->
          <a-form-model-item
            label="計劃別說明"
            prop="planDsc"
          >
            <a-input v-model="form.planDsc" placeholder="請輸入計劃別說明" />
          </a-form-model-item>
          <!-- 保額型態 -->
          <a-form-model-item
            label="保額型態"
            prop="saType"
          >
            <a-select v-model="form.saType" placeholder="請選擇保額型態" :disabled="addAndEditType === 'edit'">
              <a-select-option
                v-for="item in $enum.saTypeCBEnum"
                :key="item.key"
                :value="item.key"
              >
                {{ item.val }}
              </a-select-option>
            </a-select>
            <!-- <p v-else class="result__info">
              {{ getSaTypeName }}
            </p> -->
          </a-form-model-item>
          <!-- 保額上限 -->
          <a-form-model-item
            label="保額上限"
            prop="maxSa"
          >
            <a-input
              v-model="form.maxSa"
              :disabled="form.saType !== '3'"
              :placeholder="(form.saType === '3')? '請輸入保額上限':''"
              :validateStatus="(form.saType === '3')? 'validating': 'validating'"
              @input="
                onHandleAddComdify(
                  $event,
                  'maxSa'
                )"
            />
          </a-form-model-item>
          <!-- 保額下限 -->
          <a-form-model-item
            label="保額下限"
            prop="minSa"
          >
            <a-input
              v-model="form.minSa"
              :disabled="form.saType !== '3'"
              :placeholder="(form.saType === '3')? '請輸入保額上限':''"
              @input="
                onHandleAddComdify(
                  $event,
                  'minSa'
                )"
            />
          </a-form-model-item>
          <!-- 屬性 -->
          <a-form-model-item
            label="屬性"
            class="form-item__bg--blue"
            prop="insAttrs"
          >
            <a-checkbox-group
              v-model="form.insAttrs"
              :options="insurableAttrGetCheckboxGroup"
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
        取消
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
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Modal } from 'ant-design-vue';

@Component({
  components: { LayoutLoading },
})
export default class MaintenanceInsuranceTypeDataUnderwritePlanAndEdit extends Vue {
  h = this.$createElement;

  pageLoading = false;

  addAndEditType = '';

  insurableAttrError = null;

  insurableAttrGetCheckboxGroup = this.$enum.insurableAttrOptions.map((i) => ({ label: i.val, value: i.key }));

  form = {
    item: undefined,
    plan: undefined,
    planDsc: undefined,
    saType: undefined,
    maxSa: undefined,
    minSa: undefined,
    insAttrs: [],
  };

  rules: { [key: string]: ValidationRule[] } = {
    item: [
      {
        required: true,
        trigger: 'change',
        message: '險種代號 必須填寫',
      },
    ],
    plan: [
      {
        required: true,
        trigger: 'change',
        message: '計劃別 必須填寫',
      },
    ],
    planDsc: [
      {
        required: true,
        trigger: 'change',
        message: '計劃別說明 必須填寫',
      },
    ],
    saType: [
      {
        required: true,
        trigger: 'change',
        message: '保額型態 必須選取',
      },
    ],
    insAttrs: [
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
  // 取得 Query 並帶入資料
  setEditParam() {
    const $query = this.$global.getQuery();
    this.addAndEditType = this.$router.currentRoute.params.type; // add or edit
    if ($query) {
      this.form.item = $query.item;
      switch (this.addAndEditType) {
        case 'add':
          this.form.saType = $query.saType;
          break;
        case 'edit':
          this.form.plan = $query.plan;
          break;
      }
    }
  }

  getEditApiData() {
    // 取得修改資料
    this.pageLoading = true;
    this.$gioInsuranceApi
      .insPlanUpdatePageUsingPOST({
        item: this.form.item,
        plan: this.form.plan,
      })
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          this.form.planDsc = getData.planDsc;
          this.form.saType = getData.saType.id;
          this.form.maxSa = getData.maxSa;
          this.form.minSa = getData.minSa;
          this.form.insAttrs = getData.insAttrs.map((i) => i.id);
        } else {
          // 查找失敗訊息
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得群組名單錯誤'),
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

  // 取得 保額型態中文 用於顯示
  get getSaTypeName() {
    if (this.form.saType) {
      return this.$enum.getVal('saTypeCBEnum', this.form.saType);
    }
    return null;
  }

  checkInsurableAttr(rule, value, callback) {
    if (value.length <= 0) {
      this.insurableAttrError = '請選擇可投保屬性';
      callback('');
    } else {
      this.insurableAttrError = null;
      callback();
    }
  }

  onHandleAddComdify(event, obj) {
    if (event.target.value) {
      const formatVal = this.$global.delComdify(event.target.value);
      this.form[obj] = this.$global.autoAddComdify(formatVal);
    }
  }

  /**
 * Event
 */
  // 確定 新增/修改
  onSubmit() {
    (this as any).$validateForm('miTypeDataUnderwritePlanAndEditForm')
      .then((res) => {
        if (this.insurableAttrError === null) {
          this.pageLoading = true;
          const submitData = { ...this.form };
          // TEST:
          // console.log(submitData);
          if (submitData.maxSa) {
            submitData.maxSa = Number(this.$global.delComdify(submitData.maxSa));
          }
          if (submitData.minSa) {
            submitData.minSa = Number(this.$global.delComdify(submitData.maxSa));
          }
          switch (this.addAndEditType) {
            case 'add':
              this.$gioInsuranceApi
                .insPlanAddUsingPOST(submitData)
                .then((resp) => {
                  if (resp.data.status == 200) {
                    this.$router.push({ name: 'MaintenanceInsuranceTypeDataPlan', params: { underwriteType: 'plan' } }).then(() => {
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
                  // API失敗
                  console.log(error.response);
                })
                .finally(() => {
                  this.pageLoading = false;
                });
              break;
            case 'edit':
              this.$gioInsuranceApi
                .insPlanUpdateUsingPOST(submitData)
                .then((resp) => {
                  if (resp.data.status == 200) {
                    this.$router.push({ name: 'MaintenanceInsuranceTypeDataPlan', params: { underwriteType: 'plan' } }).then(() => {
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
                  // API失敗
                  console.log(error.response);
                })
                .finally(() => {
                  this.pageLoading = false;
                });
              break;
          }
        }
      })
      .catch((err) => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = this.$el.querySelector('.has-error');
        if (getErrorEle) {
          // 新語法試用 scrollIntoView
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
  }

  /**
 * Hooks
 */
  async created() {
    await this.setEditParam();
    if (this.addAndEditType === 'edit') {
      this.getEditApiData();
    }
  }

  /**
 * 監聽
 */
  // 改變 保額型態時，切換 檢核保額上限、保額下限
  @Watch('form.saType')
  watchSaType(val) {
    if (val === '3') {
      Object.assign(this.rules, {
        maxSa: [
          {
            required: true,
            trigger: 'change',
            message: '保額上限 必須填寫',
          },
          {
            required: true,
            trigger: 'change',
            pattern: new RegExp('^[0-9,]+$'),
            message: '請輸入有效數字',
          },
          {
            trigger: 'change',
            message: '保額上限 最大不能超過50,000,000',
            validator: (rule, value) => Number(this.$global.delComdify(value)) <= 50000000,
          },
          {
            trigger: 'change',
            message: '保額上限 最小不能小於0',
            validator: (rule, value) => Number(this.$global.delComdify(value)) > 0,
          },
        ],
        minSa: [
          {
            required: true,
            trigger: 'change',
            message: '保額下限 必須填寫',
          },
          {
            required: true,
            trigger: 'change',
            pattern: new RegExp('^[0-9,]+$'),
            message: '請輸入有效數字',
          },
          {
            trigger: 'change',
            message: '保額下限 最大不能超過50,000,000',
            validator: (rule, value) => Number(this.$global.delComdify(value)) <= 50000000,
          },
          {
            trigger: 'change',
            message: '保額下限 最小不能小於0',
            validator: (rule, value) => Number(this.$global.delComdify(value)) > 0,
          },
        ],
      });
    } else {
      // 移除 maxSa、minSa 檢核，但是為了Error重置，
      // 目前只想到resetFields()，但resetFields()會連同value一起清空
      // 解決方式：將原始資料複製，再重置所有檢核，然後將資料回填
      this.form.maxSa = undefined;
      this.form.minSa = undefined;
      const oldVal = JSON.parse(JSON.stringify(this.form));
      (this.$refs as any).miTypeDataUnderwritePlanAndEditForm.resetFields();
      Object.assign(this.form, oldVal);
      delete this.rules.maxSa;
      delete this.rules.minSa;
    }
  }
}
</script>

<style lang="scss" scoped>
.miTypeDataUnderwritePlanAndEdit {
  .ant-form-item {
    font-size: 16px;
  }
}
::v-deep {
  .ant-form-item-label {
    padding-left: 16px;
    padding-right: 16px;
  }
}
.message--error {
  padding-left: 120px;
}

</style>
