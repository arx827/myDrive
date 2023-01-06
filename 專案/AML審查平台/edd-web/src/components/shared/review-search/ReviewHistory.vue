<template>
  <div>
    <a-row class="spin__wrap" v-if="reviewHistoryLoading">
      <a-spin
        :spinning="reviewHistoryLoading"
        tip="資料處理中，請稍候..."
        :delay="200"
        class="spin"
      >
      </a-spin>
    </a-row>
    <section>
      <p class="list-title">       
        <!-- <a-row type="flex">
          <h4 class="section__title list__count">審查歷程</h4>
        </a-row>       -->
        <fbl-data-grid
          class="fbl-table"
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          style="margin-top: 16px;"
        >
          <template v-slot:combinedAMLNo="slotProps">
            <div v-for="(item, index) in slotProps.data.combineNo" :key="index">
              {{item}}
            </div>
          </template>
        </fbl-data-grid>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import {LogMainStatusVO} from "@fubonlife/edd-api-axios-sdk";

@Component({ components: { FblDataGrid } })
export default class ReviewHistory extends Vue {
  reviewHistoryLoading: boolean = false;
  // data grid
  public grid: FblPDataGridHolder<LogMainStatusVO> = {
    rowKey: 'rowkey',
    data: [],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "folder",
        title: "案件資料夾",
      },
      {
        type: FblColumnType.PLAIN,
        property: "status",
        title: "案件狀態",
      },
      {
        type: FblColumnType.PLAIN,
        property: "updateUser",
        title: "狀態變更人員",
        formatter:(data:LogMainStatusVO) => {
          if(data.updateUser){
            return `${data.updateUser.domainId} ${data.updateUser.name}`
          }
            return 'BATCH';
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "startDate",
        title: "狀態開始時間",
      },
      {
        type: FblColumnType.TEMPLATE,
        property: "combineNo",
        template: "combinedAMLNo",
        title: "被併AML審查檔號"
      },
    ],
  };

  created(){
    this.reviewHistoryLoading = true;
    let amlID = sessionStorage["review_assignment_page"];
    // TEST:
    // const amlID = 'VP110073000001';
    this.$reviewApi.getLogInReviewUsingGET(amlID).then((resp)=>{
      const data = resp.data.data;
      // 加序號
      data.map((item,index) => {
        return Object.assign(item, {rowkey: index + 1})
      })
      this.grid.data = data;
    })
    .finally(() => {
      this.reviewHistoryLoading = false;
    })
  }
}
</script>

<style lang="less" scoped>
.list-title {
  font-size: 16px;
  > span {
    font-size: 14px;
  }
}
</style>
