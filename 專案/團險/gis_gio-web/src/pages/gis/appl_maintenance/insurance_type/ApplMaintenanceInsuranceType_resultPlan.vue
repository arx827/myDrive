<template>
  <div class="applMaintenanceInsuranceTypeResultPlan">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        計劃別維護
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
      <div class="info__item locker__item">
        <p class="info__item__title">
          險種代號
        </p>
        <p class="info__item__sub">
          {{ resultParam.insCode }}
        </p>
      </div>
      <div class="info__item">
        <p class="info__item__title">
          屬性
        </p>
        <p class="info__item__sub">
          {{ $enum.getVal('insurableAttrOptions', resultParam.attributes) }}
        </p>
      </div>
    </div>
    <div
      v-if="grid.data.length > 0"
      class="result__table"
    >
      <FblDataGrid
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :empty-data="grid.data.length <= 0"
      >
        <template v-slot:planContent="slotProps">
          <!-- 保額制 disabled 其他都開放 -->
          <a-textarea v-model="slotProps.data.planDescription" auto-size :disabled="editType === 'CB' && slotProps.data.insuredType == '1'" />
        </template>
        <template v-slot:InsuredUpper="slotProps">
          <p v-if="editType === 'RC'">
            {{ slotProps.data.maxSumAssured }}
          </p>
          <!-- 保額制 disabled -->
          <a-input v-if="editType === 'CB'" v-model="slotProps.data.maxSumAssured" class="text-end" :disabled="slotProps.data.insuredType == '1'" @change="
            onHandleAddComdify(
              $event,
              slotProps.data,
              'maxSumAssured'
            )
          "
          />
        </template>
        <template v-slot:InsuredLower="slotProps">
          <p v-if="editType === 'RC'">
            {{ slotProps.data.minSumAssured }}
          </p>
          <!-- 保額制 disabled -->
          <a-input v-if="editType === 'CB'" v-model="slotProps.data.minSumAssured" class="text-end" :disabled="slotProps.data.insuredType == '1'" @change="
            onHandleAddComdify(
              $event,
              slotProps.data,
              'minSumAssured'
            )
          "
          />
        </template>
        <template v-slot:Insured="slotProps">
          <p v-if="editType === 'RC'">
            {{ slotProps.data.insuredAmount }}
          </p>
          <!-- 保額制 開啟，其他disabled -->
          <a-input v-if="editType === 'CB'" v-model="slotProps.data.insuredAmount" class="text-end" :disabled="slotProps.data.insuredType == '3'" @change="
            onHandleAddComdify(
              $event,
              slotProps.data,
              'insuredAmount'
            )
          "
          />
        </template>
        <template v-slot:handleSwitch="slotProps">
          <a-switch v-model="slotProps.data.status" checked-children="有效" un-checked-children="停效" default-checked />
        </template>
      </FblDataGrid>
    </div>
    <div class="confirm__button-group text-center">
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
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

import { MaintenanceByPlanQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({
  components: { FblDataGrid, LayoutLoading },
})
export default class ApplMaintenanceInsuranceTypeResultPlan extends Vue {
  h = this.$createElement;

  pageLoading = false;

  resultParam: MaintenanceByPlanQueryDto = {
    policyNo: '',
    policySeq: '',
    times: '',
    attributes: '',
    insCode: '',
  }

  // 依保單號碼 判斷 CB / RC
  get editType() {
    return this.$global.getPolicyType(this.resultParam.policyNo);
  }

  // data grid
  public grid = {
    rowKey: 'rowkey',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'plan',
        title: '計劃別',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'vsan',
        title: '版次',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'planContent',
        property: 'planDescription',
        title: '計劃別說明',
        width: 250,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'insuredType',
        title: '保額型態',
        customRender: (data) => {
          if (data.insuredType) {
            return this.$enum.getVal('saTypeEnum', data.insuredType);
          }
            return this.$enum.getVal('saTypeEnum', '1');
        },
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'InsuredUpper',
        property: 'maxSumAssured',
        title: '保額上限',
        align: 'right',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'InsuredLower',
        property: 'minSumAssured',
        title: '保額下限',
        align: 'right',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'Insured',
        property: 'insuredAmount',
        title: '保額',
        align: 'right',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'as400PlanDescription',
        title: 'AS/400 計劃別說明',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleSwitch',
        title: '狀態',
      },
    ],
  };

  /**
 * Func
 */
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.resultParam.attributes = $query.attributes;
      this.resultParam.insCode = $query.insCode;
      this.resultParam.policyNo = $query.policyNo;
      this.resultParam.policySeq = $query.policySeq;
      this.resultParam.times = $query.times;
    }
  }

  // API:
  getGrid() {
    this.pageLoading = true;
    // TEST:
    const { attributes, insCode, ...other } = this.resultParam;
    this.$gioInsPlanReviewApi
      .maintenancyByPlanQueryUsingPOST(this.resultParam)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          // console.log(getData);
          const maintenanceByPlanContentDtos = JSON.parse(JSON.stringify(getData.maintenanceByPlanContentDto));
          maintenanceByPlanContentDtos.map((item, index) => {
            item.rowkey = index + 1;
            item.status = (item.status !== '0');
          });
          this.grid.data = maintenanceByPlanContentDtos;
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得計劃別維護錯誤'),
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

  /**
 * Event
 */
  // 增加千分位
  onHandleAddComdify(e, obj, ele) {
    // TEST:
    // console.log(obj);
    if (e.target.value) {
      const formatVal = this.$global.delComdify(e.target.value);
      obj[ele] = this.$global.autoAddComdify(formatVal);
    }
  }

  // API:
  onSubmit() {
    const exclude = ['as400PlanDescription', 'rowkey'];
    const form = JSON.parse(JSON.stringify(this.grid.data));
    form.map((obj) => {
      // 移除屬性
      exclude.map((key) => {
        delete obj[key];
      });

      // 追加屬性
      const {
        policyNo, policySeq, times, attributes, insCode,
      } = this.resultParam;
      obj.attributes = attributes;
      obj.insCode = insCode;
      obj.policyModel = {
        policyNo,
        policySeq,
        times,
      };

      // 移除千分位
      obj.maxSumAssured = Number(this.$global.delComdify(obj.maxSumAssured));
      obj.minSumAssured = Number(this.$global.delComdify(obj.minSumAssured));
      obj.insuredAmount = Number(this.$global.delComdify(obj.insuredAmount));

      // 轉換 status
      obj.status = (obj.status) ? 'Y' : 'N';
    });

    this.pageLoading = true;
    this.$gioInsPlanReviewApi
      .maintenancyByPlanUpdateUsingPOST(form)
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
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
 * Hooks
 */
  created() {
    this.setResultParam();
    this.getGrid();
  }
}
</script>
<style lang="scss" scoped>
  .confirm__button-group {
    margin-top: 20px;
  }
  ::v-deep {
    .ant-table-row {
      height: 52px;
    }
  }
</style>
