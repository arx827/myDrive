<template>
  <div class="miTypeDataUnderwriteRuleAndPlan">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        核保規則/CB計劃別維護
      </h2>
    </div>
    <div class="main-HeaderBtn__group position-relative">
      <a-radio-group v-model="underwriteType" button-style="solid">
        <a-radio-button value="rule">
          核保規則維護
        </a-radio-button>
        <a-radio-button value="plan" :disabled="checkCBPlanDisabled">
          CB計劃別維護
        </a-radio-button>
      </a-radio-group>
      <div v-if="underwriteType === 'plan'" class="header-control__wrap position-absolute top-0 end-0">
        <button
          class="icon-button"
          @click="onAddPlanData"
        >
          <img
            class="icon-button__img"
            src="~@images/button_add.svg"
            alt=""
          >
        </button>
      </div>
    </div>
    <!-- 核保規則維護 -->
    <div
      v-if="underwriteType === 'rule'"
      class="result__table"
    >
      <FblDataGrid
        :row-key="ruleGrid.rowKey"
        :columns="ruleGrid.columns"
        :data="ruleGrid.data"
        :pagination="ruleGrid.pagination"
        :empty-data="ruleGrid.data.length <= 0"
        @tableChange="onMasterPageChange($event)"
      >
        <template v-slot:handleTemp="slotProps">
          <button
            class="icon-button icon__edit"
            @click="onEditRuleData(slotProps.data)"
          >
            <img
              class="icon-button__img"
              src="~@images/button_edit.svg"
              alt=""
            >
          </button>
          <button
            class="icon-button icon__delete"
            @click="onDeleteRuleData(slotProps.data)"
          >
            <img
              class="icon-button__img"
              src="~@images/button_delete.svg"
              alt=""
            >
          </button>
        </template>
      </FblDataGrid>
    </div>
    <!-- CB計劃別維護 -->
    <div
      v-if="underwriteType === 'plan'"
      class="result__table"
    >
      <div class="main-HeaderInfo d-flex">
        <div class="info__item">
          <p class="info__item__title">
            險種代號
          </p>
          <p class="info__item__sub">
            {{ item }}
          </p>
        </div>
      </div>
      <FblDataGrid
        :row-key="planGrid.rowKey"
        :columns="planGrid.columns"
        :data="planGrid.data"
        :pagination="planGrid.pagination"
        :empty-data="planGrid.data.length <= 0"
        @tableChange="onMasterPageChange($event)"
      >
        <template v-slot:handleTemp="slotProps">
          <button
            class="icon-button icon__edit"
            @click="onEditPlanData(slotProps.data)"
          >
            <img
              class="icon-button__img"
              src="~@images/button_edit.svg"
              alt=""
            >
          </button>
          <button
            class="icon-button icon__delete"
            @click="onDeletePlanData(slotProps.data)"
          >
            <img
              class="icon-button__img"
              src="~@images/button_delete.svg"
              alt=""
            >
          </button>
        </template>
      </FblDataGrid>
    </div>
    <div class="confirm__button-group card-confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="onGoBackIndex()"
      >
        返回「險種資料維護」
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

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
export default class MaintenanceInsuranceTypeDataUnderwriteRuleAndPlan extends Vue {
  underwriteType = 'rule';

  // 險種代號
  item = '';

  h = this.$createElement;

  planCanViewArray: string[] = ['GCAI', 'GAHI', 'GDI', 'GHS', 'GOH', 'GHR', 'GHI', 'GADI'];

  pageLoading = false;

  ruleGridDone = false;

  planGridDone = false;

  // data grid
  // public grid: FblPDataGridHolder<AuthDto> = {
  // 核保規則維護
  public ruleGrid = {
    rowKey: 'rowkey',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'item',
        title: '險種代號',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'prodLine',
        title: '產品線',
        customRender: (data) => {
          if (data.prodLine) {
            return this.$enum.getVal('customer', data.prodLine);
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'itemName',
        title: '中文簡稱',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'itemTyp',
        title: '險種類型',
        customRender: (data) => {
          if (data.itemTyp) {
            return data.itemTyp.name;
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'attr',
        title: '屬性',
        customRender: (data) => {
          if (data.attr) {
            return data.attr.name;
          }
          return '';
        },
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 120,
        align: 'right',
        title: '',
      },
    ],
  };

  // CB計劃別維護
  public planGrid = {
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
        property: 'planDsc',
        title: '計劃別說明',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'saType',
        title: '保額型態',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'maxSa',
        title: '保額上限',
        align: 'right',
        customRender: (data) => {
          if (data.maxSa) {
            return this.$global.autoAddComdify(data.maxSa);
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'minSa',
        title: '保額下限',
        align: 'right',
        customRender: (data) => {
          if (data.minSa) {
            return this.$global.autoAddComdify(data.minSa);
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'insAttrs',
        title: '屬性',
        customRender: (data) => {
          if (data.insAttrs) {
            return data.insAttrs.join('、');
          }
          return '';
        },
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 120,
        align: 'right',
        title: '',
      },
    ],
  };

  /**
 * Func
 */
  // 取得 Query 並帶入資料
  setEditParam() {
    const $query = this.$global.getQuery();
    this.underwriteType = this.$router.currentRoute.params.underwriteType; // rule or plan
    if ($query) {
      this.item = $query.item;
    }
  }

  // 取得 核保規則維護 Grid
  getRuleGrid() {
    this.pageLoading = true;
    this.$gioInsuranceApi
      .insCheckQueryUsingPOST(this.item)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          // TEST:
          // console.log('核保規則維護:', getData);
          getData.map((item, index) => item.rowkey = index + 1);
          this.ruleGrid.data = getData;
          this.ruleGridDone = true;
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
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 取得 CB計劃別維護 Grid
  getPlanGrid() {
    this.pageLoading = true;
    this.$gioInsuranceApi
      .insPlanQueryUsingPOST({ item: this.item, admCbRc: this.$user.getAdmCbRc() })
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          // TEST:
          // console.log('CB計劃別維護:', getData);
          getData.map((item, index) => item.rowkey = index + 1);
          this.planGrid.data = getData;
          this.planGridDone = true;
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
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 變更TAB
  changeTab() {
    if (this.item) {
      if (this.underwriteType === 'rule' && this.ruleGridDone !== true) {
        this.getRuleGrid();
      } else if (this.underwriteType === 'plan' && this.planGridDone !== true) {
        this.getPlanGrid();
      }
    }
  }

  get checkCBPlanDisabled() {
    const $admCbRc: string = this.$user.getAdmCbRc();
    // TEST:
    // const $admCbRc = 'CB';
    return !(this.planCanViewArray.includes(this.item) && ['CB', 'ALL'].includes($admCbRc));
  }

  /**
 * Event
 */
  // table 事件 (change page)
  onMasterPageChange(e): void{
    const gridName = `${this.underwriteType}Grid`;
    const p = { ...this[gridName].pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== e.current || p.pageSize !== e.pageSize) {
      p.current = e.current;

      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== e.pageSize) {
        p.current = 1;
      }
      p.pageSize = e.pageSize;
      this[gridName].pagination = p;
      this.changeTab();
    }
  }

  // 核保規則維護 修改
  onEditRuleData(rowData): void {
    // TEST:
    // console.log(rowData);
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceInsuranceTypeDataRuleEdit',
      query: {
        item: rowData.item, // 險種代號
        attr: rowData.attr.id,
        prodLine: rowData.prodLine,
      },
    });
  }

  // 核保規則維護 刪除
  onDeleteRuleData(rowData): void {
    // TEST:
    // console.log(rowData);
    Modal.confirm({
      title: this.h('div', {}, '執行刪除'),
      content: '即將執行刪除此險種之檢核資料，您確定要刪除嗎？',
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        this.pageLoading = true;
        this.$gioInsuranceApi
          .deleteInsCheckUsingPOST({
            attr: rowData.attr.id,
            item: rowData.item,
            prodLine: rowData.prodLine,
          })
          .then(async (resp) => {
            if (resp.data.status == 200) {
              await this.getRuleGrid();
              this.$infoNotification.success({
                Content: '已完成刪除',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成刪除項目，請再次嘗試。',
              });
            }
          })
          .finally(() => {
            this.pageLoading = false;
          });
      },
    });
  }

  // CB計劃別維護 新增
  onAddPlanData(): void {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceInsuranceTypeDataPlanAddAndEdit',
      params: { type: 'add' },
      query: {
        item: this.item, // 險種代號
      },
    });
  }

  // CB計劃別維護 修改
  onEditPlanData(rowData): void {
    // TEST:
    // console.log(rowData);
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceInsuranceTypeDataPlanAddAndEdit',
      params: { type: 'edit' },
      query: {
        item: rowData.item, // 險種代號
        plan: rowData.plan, // 計劃別
      },
    });
  }

  // CB計劃別維護 刪除
  onDeletePlanData(rowData): void {
    Modal.confirm({
      title: this.h('div', {}, '執行刪除'),
      content: '即將執行刪除此險種之計劃別資料，您確定要刪除嗎？',
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        this.pageLoading = true;
        this.$gioInsuranceApi
          .deleteInsPlanUsingPOST({
            item: rowData.item,
            plan: rowData.plan,
          })
          .then(async (resp) => {
            if (resp.data.status == 200) {
              await this.getPlanGrid();
              this.$infoNotification.success({
                Content: '已完成刪除',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成刪除項目，請再次嘗試。',
              });
            }
          })
          .finally(() => {
            this.pageLoading = false;
          });
      },
    });
  }

  onGoBackIndex(): void {
    this.$router.push({ name: 'MaintenanceInsuranceTypeData' });
  }

  /**
 * Hooks
 */
  created() {
    this.setEditParam();
    this.getRuleGrid();

    // 判斷params切換TAB
    // 若險種代號 不可顯示計劃別 則自動跳轉到 核保規則TAB
    if (this.$router.currentRoute.params.underwriteType) {
      this.underwriteType = this.$router.currentRoute.params.underwriteType;
      if (this.underwriteType === 'plan') {
        if (!this.planCanViewArray.includes(this.item)) {
          this.underwriteType = 'rule';
          this.$router.push({ params: { underwriteType: 'rule' } });
        }
      }
    } else {
      this.$router.push({ params: { underwriteType: 'rule' } });
    }
  }

  /**
 * 監聽
 */
  @Watch('$route')
  watchRoute() {
    if (this.$router.currentRoute.params.underwriteType) {
      this.underwriteType = this.$router.currentRoute.params.underwriteType;
    }
  }

  // 點擊按鈕 動態更改 路徑 params
  @Watch('underwriteType')
  watchRouter(newVal) {
    if (newVal) {
      // 跳Tab 切換 route (非第一次進入頁面)
      if (newVal !== this.$router.currentRoute.params.underwriteType) {
        this.$router.push({ params: { underwriteType: newVal } });
        if (newVal === 'rule' && this.ruleGridDone !== true) {
          this.getRuleGrid();
        } else if (newVal === 'plan' && this.planGridDone !== true) {
          this.getPlanGrid();
        }
      } else {
        this.changeTab();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-header {
  margin-bottom: 20px;
}
.main-HeaderBtn__group {
  padding-left: 40px;
  padding-right: 40px;
}
.card-confirm__button-group {
  margin-top: 20px;
}
</style>
