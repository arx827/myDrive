<template>
  <div class="applMaintenanceInsuranceTypeResult">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        險種核保規則/計劃別維護
      </h2>
      <div v-if="editType == 'RC'" class="header-control__wrap ms-auto">
        <button class="card-header-btn text-btn btn__bg--primary" @click="onEditInsurancePlan">
          保險計劃維護
        </button>
      </div>
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
        <template v-slot:handleSwitch="slotProps">
          <a-switch v-model="slotProps.data.status" checked-children="有效" un-checked-children="停效" @change="onChangeStatus(slotProps)" />
        </template>
        <template v-slot:handleTemp="slotProps">
          <div class="d-flex">
            <button
              class="icon-button text-btn btn__bg--secondary"
              @click="onEditUnderwritePlan(slotProps.data)"
            >
              計劃別維護
            </button>
            <button
              class="icon-button text-btn btn--gray"
              @click="onEditUnderwriteRule(slotProps.data)"
            >
              核保規則維護
            </button>
          </div>
        </template>
      </FblDataGrid>
    </div>
    <div class="confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.push({name: 'ApplMaintenanceInsuranceType'})"
      >
        上一步
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

import { AuthDto } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class ApplMaintenanceInsuranceTypeResult extends Vue {
  h = this.$createElement;

  pageLoading = false;

  resultParam: {
    policyNo?: string;
    policySeq?: string;
    organizationInsuredName?: string;
    times?: string;
  } = {
    policyNo: '',
    policySeq: '',
    organizationInsuredName: '',
    times: '',
  }

  // 依保單號碼 判斷 CB / RC
  get editType() {
    return this.$global.getPolicyType(this.resultParam.policyNo);
    // TEST:
    // return 'CB';
  }

  // data grid
  public grid = {
    rowKey: 'rowkey',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'insCode',
        title: '險種代號',
        width: 120,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'attributesName',
        title: '屬性',
        width: 100,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleSwitch',
        property: 'status',
        title: '狀態',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 240,
        align: 'right',
        title: '',
      },
    ],
  };

/**
 * Func
 */
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.resultParam.policyNo = $query.policyNo;
      this.resultParam.policySeq = $query.policySeq;
    }
  }

  // API: 取得保單資料
  getPolicyInfo() {
    this.pageLoading = true;
    this.$gioInsPlanReviewApi
    .insUnderPlanQueryUsingPOST({
      policyNo: this.resultParam.policyNo,
      policySeq: this.resultParam.policySeq,
    })
    .then((resp) => {
      if (resp.data.status == 200) {
        const getData = resp.data.data;
        // TEST:
        // console.log(getData);
        this.resultParam.organizationInsuredName = getData.organizationInsuredName;
        this.resultParam.times = getData.times;
        const insReviewContentDtos = JSON.parse(JSON.stringify(getData.insReviewContentDto));
        insReviewContentDtos.map((item, index) => {
          item.rowkey = index + 1;
          item.status = (item.status !== '0');
        });
        this.grid.data = insReviewContentDtos;
      } else {
        const errorMsg = [];
        Object.values(resp.data.apiError).map((i) => {
          (i as any).map((j) => {
            errorMsg.push(j);
          });
        });
        Modal.error({
          title: this.h('div', {}, '錯誤訊息'),
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
  // API: 狀態變更
  onChangeStatus(slotProps) {
    const rowData = slotProps.data;
    this.$gioInsPlanReviewApi
    .upDateStatusUsingPOST({
      attributes: rowData.attributes,
      insCode: rowData.insCode,
      policyNo: this.resultParam.policyNo,
      policySeq: this.resultParam.policySeq,
      status: (rowData.status) ? 'Y' : 'N',
      times: this.resultParam.times,
    })
    .then((resp) => {
      if (resp.data.status == 200) {
        this.$infoNotification.success({
          Content: '已完成狀態變更',
        });
      } else {
        // 查找失敗訊息
        this.$infoNotification.error({
          Content: '無法完成狀態變更。',
          apiError: resp.data.apiError,
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

  // 保險計劃維護 (含試戳)
  onEditInsurancePlan() {
    const { policyNo, policySeq, times } = this.resultParam;
    this.pageLoading = true;
    this.$gioInsPlanReviewApi
      .insurancePlanMaintenanceQueryUsingPOST({ policyNo, policySeq, times })
      .then((resp) => {
        // console.log(resp);
        if (resp.data.status == 200) {
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceInsuranceTypeResultInsurancePlan',
            query: this.resultParam,
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

  // 計劃別維護 (含試戳)
  onEditUnderwritePlan(rowData) {
    this.pageLoading = true;
    const { attributes, insCode } = rowData;
    const { policyNo, policySeq, times } = this.resultParam;

    this.$gioInsPlanReviewApi
      .maintenancyByPlanQueryUsingPOST({
        attributes,
        insCode,
        policyNo,
        policySeq,
        times,
      })
      // TEST:
      // .maintenancyByPlanQueryUsingPOST({
      //   attributes: '1',
      //   insCode: 'GCAI',
      //   ...other,
      // })
      .then((resp) => {
        if (resp.data.status == 200) {
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceInsuranceTypeResultPlan',
            query: {
              attributes,
              insCode,
              policyNo,
              policySeq,
              times,
            },
          });
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

  // 核保規則維護 (含試戳)
  onEditUnderwriteRule(rowData) {
    const { attributes, insCode } = rowData;
    const { policyNo, policySeq, times } = this.resultParam;
    this.pageLoading = true;
    // 先確認保單是否存在 再導頁
    this.$gioInsPlanReviewApi
      .maintenanceByUnderRulesQueryUsingPOST({
        attributes,
        insCode,
        policyModel: {
          policyNo,
          policySeq,
          times,
        },
      })
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceInsuranceTypeResultRule',
            query: {
              attributes,
              insCode,
              policyModel: {
                policyNo,
                policySeq,
                times,
              },
            },
          });
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得投保規則資料錯誤'),
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
 * Hooks
 */
  created() {
    this.setResultParam();
    this.getPolicyInfo();
  }

/**
 * 監聽
 */
  // TEST:
  // @Watch('grid.data', { immediate: true, deep: true })
  // watchResultParam(newVal) {
  //   console.log(newVal);
  // }
}
</script>
