<template>
  <div class="miTypeDataIndex">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        險種資料維護
      </h2>
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
        <template v-slot:handleTemp="slotProps">
          <div class="d-flex">
            <button
              class="icon-button text-btn btn--gray"
              @click="goUnderwriteRuleAndPlan(slotProps.data)"
            >
              核保規則/CB計劃別維護
            </button>
            <button
              class="icon-button icon__edit"
              @click="onEditData(slotProps.data)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_edit.svg"
                alt=""
              >
            </button>
          </div>
        </template>
      </FblDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

import { GioInsuranceQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class MaintenanceInsuranceTypeData extends Vue {
  h = this.$createElement;

  pageLoading = false;

  public grid = {
    rowKey: 'rowkey',
    data: [],
    // pagination: {
    //   current: 1,
    //   pageSize: Number(this.$global.getPageArray()[0]),
    //   total: 1,
    //   showSizeChanger: true,
    //   pageSizeOptions: this.$global.getPageArray(),
    //   showQuickJumper: true,
    // },
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'item',
        title: '險種代號',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'itemSName',
        title: '中文簡稱',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'dtjxig',
        title: '中文全名',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'itemTyp',
        title: '險種類型',
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
  getGrid() {
    this.pageLoading = true;
    this.$gioInsuranceApi
      .insQueryUsingPOST()
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          // TEST:
          // console.log(getData);
          getData.content.map((item, index) => item.rowkey = index + 1);

          this.grid.data = getData.content;
          // this.grid.pagination.total = parseInt(getData.totalElements);
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

  /**
 * Event
 */
  // 修改
  onEditData(rowData) {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceInsuranceTypeDataEdit',
      query: {
        item: rowData.item, // 險種代號
      },
    });
  }

  // 核保規則 / CB計劃別維護
  goUnderwriteRuleAndPlan(rowData) {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceInsuranceTypeDataPlan',
      params: { underwriteType: 'rule' },
      query: {
        item: rowData.item, // 險種代號
      },
    });
  }

  /**
 * Hooks
 */
  created() {
    this.getGrid();
  }
}
</script>
