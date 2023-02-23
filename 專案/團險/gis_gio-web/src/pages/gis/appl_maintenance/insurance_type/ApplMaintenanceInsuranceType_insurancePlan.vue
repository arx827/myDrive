<template>
  <div class="applMaintenanceInsuranceTypeInsurancePlan">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        保險計劃維護
      </h2>
    </div>
    <div class="main-HeaderInfo d-flex">
      <div class="info__item locker__item">
        <p class="info__item__title">
          保單號碼
        </p>
        <p class="info__item__sub">
          {{ resultParam.policyNo }}-{{ resultParam.policySeq }}
        </p>
      </div>
      <div class="info__item">
        <p class="info__item__title">
          要保單位名稱
        </p>
        <p class="info__item__sub">
          {{ resultParam.organizationInsuredName }}
        </p>
      </div>
    </div>
    <div class="main-EditGroup">
      <div class="main-EditGroup__header">
        <div class="main-Edit__leftBlock locker__block">
          保險計劃代號
        </div>
        <div class="main-Edit__rightBlock">
          保險計劃名稱
        </div>
      </div>
      <div class="main-EditGroup__body">
        <a-form-model
          ref="mainEditGroupObjectForm"
          class="gioFormGroup inputStyle"
          :rules="rules"
          :form="form"
          :model="form"
          :colon="false"
          :hideRequiredMark="true"
        >
          <div
            v-for="(group_val, group_key) in form"
            :key="group_key"
            class="main-Edit__section"
          >
            <div class="main-Edit__item">
              <div class="main-Edit__item-title main-Edit__leftBlock">
                {{ group_key }}
              </div>
              <div class="main-Edit__item-formControl main-Edit__middleBlock">
                <a-form-model-item :prop="group_key">
                  <a-input v-model="form[group_key]" />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-form-model>
      </div>
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
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { Modal } from 'ant-design-vue';
import {
  InsPlanPolicyModel,
  MaintenanceByUnderRulesContentDto,
} from '@fubonlife/co-giiss-api-axios-sdk';

@Component({
  components: { LayoutLoading },
})
export default class ApplMaintenanceInsuranceTypeInsurancePlan extends Vue {
  h = this.$createElement;

  pageLoading = false;

  resultParam: InsPlanPolicyModel & { organizationInsuredName: string } = {
    policyNo: '',
    policySeq: '',
    organizationInsuredName: '',
    times: '',
  }

  form: {[keyName: string]: string} = {};

  // 保險計劃 代號與名稱
  mainEditGroupObject: MaintenanceByUnderRulesContentDto[] = [];

  rules: { [key: string]: ValidationRule[] } = {};

  /**
   * Func
   */
  // 欄位檢核
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  // 取得 Query 並帶入資料
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.resultParam.policyNo = $query.policyNo;
      this.resultParam.policySeq = $query.policySeq;
      this.resultParam.times = $query.times;
    }
  }

  // API: 取得 保險計劃維護 資料
  getInsuranceplanmaintenanceq() {
    const { policyNo, policySeq, times } = this.resultParam;
    this.pageLoading = true;
    this.$gioInsPlanReviewApi
      .insurancePlanMaintenanceQueryUsingPOST({ policyNo, policySeq, times })
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          // console.log(getData);
          this.resultParam.organizationInsuredName = getData.organizationInsuredName;

          getData.maintenanceByUnderRulesContentDto.forEach((i) => {
            this.$set(this.form, i.a5apc2, i.planDsc);
            this.rules[i.a5apc2] = [
              {
                required: true,
                message: '保險計劃名稱 不得為空。',
              },
              {
                max: 50,
                message: '保險計劃名稱 最長不能超過50字。',
              },
              {
                message: '請輸入半形字元',
                validator: this.fullWidthAcd,
              },
            ];
          });
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得保險計劃錯誤'),
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
        console.log(error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
   * Event
   */
  // 確定修改
  // API:
  onSubmit() {
    (this.$refs.mainEditGroupObjectForm as any).validate()
    .then(() => {
      const { policyNo, policySeq, times } = this.resultParam;
      this.mainEditGroupObject = Object.keys(this.form).map((i) => ({ a5apc2: i, planDsc: this.form[i] }));

      this.pageLoading = true;
      this.$gioInsPlanReviewApi
        .insurancePlanMaintenanceUpdateUsingPOST({
          policyModel: {
            policyNo,
            policySeq,
            times,
          },
          insPlanDtos: this.mainEditGroupObject,
        })
        .then((resp) => {
          if (resp.data.status == 200) {
            this.$router.push({ name: 'ApplMaintenanceInsuranceTypeResult' }).then(() => {
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
    })
    .catch((error) => {
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
  created() {
    this.setResultParam();
    this.getInsuranceplanmaintenanceq();
  }

  /**
   * 監聽
   */
  // TEST:
  // @Watch('form', { deep: true })
  // watchDomainId(newVal) {
  //   console.log(newVal);
  // }
}
</script>

<style lang="scss" scoped>
.main-EditGroup__header {
  padding: 0 30px;
}
.main-EditGroup__body {
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid $MAIN-EDITGROUP-SECTION-BORDER-COLOR;
}
.main-Edit__item {
  align-items: flex-start;
  padding: 0 10px 0 30px;
}
.main-Edit__leftBlock {
  text-align: left;
  flex: 0 0 120px;
}
.main-Edit__section {
  border-bottom: 0;
  padding: 5px 0;
}
.main-Edit__item-title {
  font-size: 16px;
}
.ant-form-item {
  margin-bottom: 0;
}
</style>
