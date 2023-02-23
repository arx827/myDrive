<template>
  <div class="applMaintenanceUndertakerDataResult">
    <LayoutLoading v-if="pageLoading" />
    <div
      class="result-header d-flex justify-content-between"
    >
      <h2
        class="main-title"
      >
        查詢結果
      </h2>
      <button
        class="header-button"
        @click="handleNewData"
      >
        新增承辦人
      </button>
    </div>
    <div class="result-body">
      <!-- 要保單位資料 -->
      <div
        class="insurance-info d-flex justify-content-between my-2"
      >
        <div v-for="(item, index) in $enum.applDataGroup" :key="index" class="info-item">
          <p class="fw-bold">
            {{ item.label || '' }}
          </p>
          <p v-if="item.type=='policyNum'" v-show="searchResult[item.key[0]]">
            {{ `${searchResult[item.key[0]]}-${searchResult[item.key[1]]}` || '' }}
          </p>
          <p v-else-if="typeof item.key === 'string'">
            {{ searchResult[item.key] || '' }}
          </p>
        </div>
      </div>
      <!-- 承辦人Table -->
      <div class="result__table">
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
                v-for="item in $enum.reviewType"
                :key="item.key"
                class="icon-button word-button__default"
                :class="{ 'btn--gray': slotProps.data.buttonName == item.key }"
                :disabled="slotProps.data.buttonName != item.key"
                @click="handleReviewData(slotProps.data, item.key)"
              >
                {{ item.val }}
              </button>
              <button
                class="icon-button icon__edit"
                :class="{'icon__edit--diabled': slotProps.data.active == 'false'}"
                :disabled="slotProps.data.active == 'false'"
                @click="handleEditData(slotProps.data)"
              >
                <img
                  v-if="slotProps.data.active == 'false'"
                  class="icon-button__img"
                  src="~@images/button_edit_disabled.svg"
                >
                <img
                  v-else
                  class="icon-button__img"
                  src="~@images/button_edit.svg"
                  alt="修改"
                  title="修改"
                >
              </button>
              <button
                class="icon-button icon__delete"
                @click="handleDeleteData(slotProps.data)"
              >
                <img
                  class="icon-button__img"
                  src="~@images/button_delete.svg"
                  alt="註銷"
                  title="註銷"
                >
              </button>
            </div>
          </template>
        </FblDataGrid>
      </div>
      <div class="confirm__button-group text-center">
        <button
          class="confirm__button confirm__button-cancel"
          @click="$router.push({name: 'ApplMaintenanceUndertakerData'})"
        >
          上一步
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { Modal } from 'ant-design-vue';
import { ExtPolicyModelWithOutTimes } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class ApplMaintenanceUndertakerDataResult extends Vue {
  h = this.$createElement;

  pageLoading = true;

  // 查詢保單資料須帶入的參數
  resultParam: ExtPolicyModelWithOutTimes = {}

  // 要保單位查詢結果(直接顯示)
  searchResult: { poliId?: string; poliSeq?: string; fullName?: string; bossName?: string} = {};

  // Table 內容
  public grid = {
    rowKey: 'rowkey',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'userName',
        title: '承辦人姓名',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'userId',
        title: '承辦人身分證字號',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'userEmail',
        title: '電子信箱',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'invalidDate',
        title: '密碼有效期限',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'status',
        title: '狀態',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 220,
        align: 'right',
        title: '',
      },
    ],
  };

  /**
   * Func
   */
  // 取得 Query 並帶入資料
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      const { searchUnitCo } = $query;
      this.resultParam = searchUnitCo;
      this.getGridData();
    } else {
      // 無query則強制跳轉至查詢頁
      this.$router.push({ name: 'ApplMaintenanceUndertakerData' });
    }
  }

  // 取得 Table 內容
  getGridData() {
    this.pageLoading = true;
    // 查詢要保單位
    this.$unitManagementApi
      .getUnitCoDtoUsingPOST(this.resultParam)
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.status == 200) {
          const gridData = JSON.parse(JSON.stringify(resp.data.data));
          const {
            poliId, poliSeq, fullName, bossName, caseOfficers,
          } = gridData;
          Object.assign(this.searchResult, {
            poliId, poliSeq, fullName, bossName,
          });

          caseOfficers.map((item, index) => item.rowkey = index + 1);
          this.grid.data = caseOfficers;
        }
      })
      .catch((error) => { console.log(error); })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
   * Event
   */
  // 新增承辦人
  handleNewData() {
    const { searchResult } = this;
    this.$global.changeRouterAndaddParam({
      toRouter: 'ApplMaintenanceUndertakerDataAddAndEdit',
      query: {
        searchResult,
        type: 'add',
      },
    });
  }

  // 修改承辦人
  handleEditData({ policyId }) {
    const { searchResult } = this;

    this.$global.changeRouterAndaddParam({
      toRouter: 'ApplMaintenanceUndertakerDataAddAndEdit',
      query: {
        policyId,
        searchResult,
        type: 'edit',
      },
    });
  }

  // 刪除承辦人
  handleDeleteData({ policyId }) {
    Modal.confirm({
      title: this.h('div', {}, '執行註銷'),
      content: '即將執行註銷該筆承辦人資料，您確定要刪除嗎？',
      okType: 'warning',
      okText: '註銷',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        // 刪除
        this.pageLoading = true;
        this.$unitManagementApi
          .deleteCaseOfficerUsingPOST(policyId)
          .then(async (resp) => {
            if (resp.data.status == 200) {
              await this.getGridData();
              this.$infoNotification.success({
                Content: '已完成註銷',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成刪除項目，請再次嘗試。',
                apiError: resp.data.apiError,
              });
            }
          })
          .catch((error) => {
            this.$infoNotification.error({
              Content: '無法完成刪除項目，請再次嘗試。',
            });
          })
          .finally(() => {
            this.pageLoading = false;
          });
      },
    });
  }

  // 進入覆核程序
  handleReviewData({ policyId }, key) {
    this.pageLoading = true;
    const { searchResult } = this;
    const type = this.$enum.reviewType.filter((i) => i.key == key)[0].params;
    this.$global.changeRouterAndaddParam({
      toRouter: 'ApplMaintenanceUndertakerDataConfirm',
      params: {
        type,
      },
      query: {
        policyId,
        searchResult,
      },
    });
  }

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
  }

  updated() {
  	window.parseWord();
  }

  /**
   * 監聽
 */
}
</script>

<style lang="scss" scoped>

.header-button {
  padding: 7px;
  background-color: $ICON-BUTTON-BG-BLUE;
  color: $COLOR-WHITE;
  border-radius: 4px;
  border: 0;
  min-width: 33px;
  min-height: 33px;
  text-align: center;
}

.insurance-info {
  .info-item {
    background-color: $COLOR-MAIN8;
    padding: 10px;
    &:first-child {
      width: 150px;
    }
    &:not(:first-child) {
      flex: 1;
    }
    + .info-item {
      margin-left: 10px;
    }
  }
}

.word-button__default {
  background-color: $BUTTON-DISABLED-BG-GRAY;
  color: $BUTTON-DISABLED-COLOR-GRAY;
  letter-spacing: 1px;
  &.btn--gray {
    background: $BUTTON-BG-GRAY;
    color: $BUTTON-COLOR-WHITE;
  }
}

</style>
