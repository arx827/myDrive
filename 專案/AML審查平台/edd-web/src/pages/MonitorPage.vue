<template>
  <div style="background: #F0F2F5;">
    <div class="card--title">
      <collapse-area :searchArea="true" :isOpenSearch="collapseAreaOption" @toggle="toggleArea">
        <template v-slot:escape>
          <div>
            <div class="title" v-if="isReview">{{ $t("process_pending") }}</div>
            <div class="title" v-else>
              <h3>{{ $t("pending") }}</h3>
            </div>
            <a-divider type="horizontal" />
          </div>
        </template>
        <template v-slot:area>
          <div class="card__form--title" >
            <monitor-filter ref="monitorFilter"/>
            <div align="center">
              <a-button class="button btn__layout--green btn--primary searchButton" @click="onSearch()">{{
                $t("search")
              }}</a-button>
            </div>
          </div>
        </template>
      </collapse-area>
    </div>
    <div class="card--title" style="margin-top: 10.5px;">
      <div class="title">{{ $t("search_result") }}</div>
      <fbl-data-grid
        class="fbl-table"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :loading="isLoading"
        style="margin-top: 24px;"
        :scroll="{ x: '130%' }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import MonitorFilter from "@/components/shared/review-assignment/MonitorFilter.vue";
import CollapseArea from "@/components/shared/CollapseArea.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";

class MonitorDto {
  public reviewId: number;
  public reviewDep: string;
  public reviewDiv: string;
  public reviewer: string;
  public category: string;
  public total: number;
  public largePremiums: number;
  public matchList: number;
  public renew: number;

  constructor(
    reviewId: number,
    reviewDep: string,
    reviewDiv: string,
    reviewer: string,
    category: string,
    total: number,
    largePremiums: number,
    matchList: number,
    renew: number
  ) {
    this.reviewId = reviewId;
    this.reviewDep = reviewDep;
    this.reviewDiv = reviewDiv;
    this.reviewer = reviewer;
    this.category = category;
    this.total = total;
    this.largePremiums = largePremiums;
    this.matchList = matchList;
    this.renew = renew;
  }
}

@Component({ components: { MonitorFilter, FblDataGrid, CollapseArea} })
export default class Monitor extends Vue {
  public isReview: boolean = true;
  public isLoading: boolean = false;
  public collapseAreaOption: boolean = true;
  /*items: Array<MonitorDto> = [
    {

      reviewId: 1,
      reviewDep: "資訊服務",
      reviewDiv: "使用系統介面科",
      reviewer: "張某某",
      category: "保單變更",
      total: 2,
      largePremiums: 123445567,
      matchList: 1,
      renew: 1,
    },
    {
      reviewId: 2,
      reviewDep: "資訊服務",
      reviewDiv: "使用系統介面科",
      reviewer: "張某某",
      category: "保單變更",
      total: 2,
      largePremiums: 123445567,
      matchList: 2,
      renew: 2,
    },
    {
      reviewId: 3,
      reviewDep: "資訊服務",
      reviewDiv: "使用系統介面科",
      reviewer: "林某某",
      category: "保單變更",
      total: 2,
      largePremiums: 123445567,
      matchList: 3,
      renew: 3,
    },
  ];*/
  // data grid
  public grid: FblPDataGridHolder<MonitorDto> = {
    rowKey: "reviewId",
    data: [
        new MonitorDto(
        1,
        "資訊服務",
        "使用系統介面科",
        "張某某",
        "保單變更",
        1,
        123445567,
        1,
        1
      ),
      new MonitorDto(
        2,
        "資訊服務",
        "使用系統介面科",
        "張某某",
        "保單變更",
        2,
        123445567,
        2,
        2
      ),
      new MonitorDto(
        3,
        "資訊服務",
        "使用系統介面科",
        "張某某",
        "保單變更",
        3,
        123445567,
        3,
        3
      ),
    ],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "reviewDep",
        title: this.$t("review_dep") as string,
        width: 180,
        align: "center",
        inspect: true,
        sorter: (a, b) => a.reviewDep.localeCompare(b.reviewDep),
      },
      {
        type: FblColumnType.PLAIN,
        property: "reviewDiv",
        title: this.$t("review_div") as string,
        width: 180,
        align: "center",
        sorter: (a, b) => a.reviewDiv.localeCompare(b.reviewDiv),
      },
      {
        type: FblColumnType.PLAIN,
        property: "reviewer",
        title: this.$t("reviewer") as string,
        width: 180,
        align: "center",
        sorter: (a, b) => a.reviewer.localeCompare(b.reviewer),
      },
      {
        type: FblColumnType.PLAIN,
        property: "category",
        title: this.$t("category") as string,
        align: "center",
        sorter: (a, b) => a.category.localeCompare(b.category),
      },
      {
        type: FblColumnType.PLAIN,
        property: "total",
        title: this.$t("total") as string,
        align: "center",
        sorter: (a, b) => a.total - b.total,
      },
      {
        type: FblColumnType.PLAIN,
        property: "largePremiums",
        title: this.$t("large_premiums") as string,
        align: "center",
        sorter: (a, b) => a.largePremiums - b.largePremiums,
      },
      {
        type: FblColumnType.PLAIN,
        property: "matchList",
        title: this.$t("match_list") as string,        
        align: "center",
        sorter: (a, b) => a.matchList - b.matchList,
      },
      {
        type: FblColumnType.PLAIN,
        property: "renew",
        title: "RENEW",
        align: "center",
        sorter: (a, b) => a.renew - b.renew,
      },
    ],
  };
  onSearch() {
    (this.$refs.monitorFilter as any).validateForm().then((valid) => {
      console.log(valid);
    });
  }
  onChange() {}

  toggleArea() {
    this.collapseAreaOption = !this.collapseAreaOption;
  }
}
</script>

<style scoped>
.title {
  font-size: 18px;
  color: #227fa8;
}
.container {
  background-color: transparent;
}

</style>
