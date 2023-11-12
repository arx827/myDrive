<template>
  <div tabindex="-1" @keyup.enter="onEstimatedReportSearch()">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          style="background-color: #eef6f8"
          :model="estimatedCaseReportSearchForm"
        >
          <a-row>
            <a-col :span="6">
              <a-form-model-item
                :label="$t('casesEstimated_date')"
                style="margin-bottom: 0px"
                prop="estimatedDate"
                required
                :has-feedback="
                  casesEstimatedValidateForm.casesEstimatedDate.feedback
                "
                :validateStatus="
                  casesEstimatedValidateForm.casesEstimatedDate.state
                "
              >
                <a-popover
                  placement="top"
                  :content="casesEstimatedValidateForm.casesEstimatedDate.content"
                  :trigger="casesEstimatedValidateForm.casesEstimatedDate.hover"
                  :visible="isCasesEstimatedDateVisible"
                  :destroyTooltipOnHide="true"
                >
                  <date-picker
                    style="width: 100%"
                    :range="false"
                    :clearable="false"
                    :formatter="formatter"
                    v-model="estimatedCaseReportSearchForm.globalEstimatedDate"
                    @change="onEstimatedDateChange"
                  >
                    <a-input
                      slot="input"
                      @mouseover="estimatedDateMouseOver"
                      @mouseleave="isCasesEstimatedDateVisible = false"
                      :value="estimatedCaseReportSearchForm.estimatedDateString"
                    ></a-input>
                    <i v-if="casesEstimatedValidateForm.casesEstimatedDate.feedback" slot="icon-calendar"></i>
                  </date-picker>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <a-button type="primary" @click="
                isExportDisable=true;
                reCalculateEstimatedReport()">
                 {{$t("reCalculate")}}
                </a-button>
                <a-button type="primary" @click="onEstimatedReportSearch()">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 搜尋 -->
                <a-button type="default" @click="resetEstimatedReportSearch">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 清除 -->

                <a-button type="primary" @click="exportCasesEstimatedReport()">
                  {{ $t("global_export") }}
                </a-button>
                <!-- 匯出 -->
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          @handleInPutNumberChange="onInputNumberChange"
          size="middle"
          style="padding-left: 24px; padding-right: 12px"
          ref="userDataGrid"
        >
        </FblDataGrid>
      </a-col>
    </a-row>

    <a-row style="padding-left: 24px">一、名詞定義：</a-row>

    <a-row style="padding-left: 24px"
      >1.新件：保戶端或業務員端無撥號記錄，且應電訪日=當日之案件</a-row
    >
    <a-row style="padding-left: 24px"
      >2.聯絡不上案件：聯絡結果為聯絡不上、結案原因為空值，且回撥時間設定為系統日之案件。</a-row
    >
    <a-row style="padding-left: 24px"
      >3.前三工作日新件平均件數(A)：系統日前三個工作日，應電訪日=工作當日的新件平均數，取整數，無條件進位。</a-row
    >
    <a-row style="padding-left: 24px"
      >4.前一工作日新件件數(B)：系統日前一工作日，且應電訪日=工作當日的新件。</a-row
    >
    <a-row style="padding-left: 24px"
      >5.前一工作日聯絡不上件數(C)：截至系統日前一個工作日以前聯絡不上的案件，且回撥日期設定為系統當日的案件(包含大眾池和個人池的案件)</a-row
    >
    <a-row style="padding-left: 24px"
      >6.回撥比例=(C)/(B) ，四捨五入，小數點後一位。</a-row
    >
    <a-row style="padding-left: 24px"
      >7.應電訪當日人力數(D)=參照班別設定與調整，電訪員的分鐘數總合/480，四捨五入，計算至小數點後一位。</a-row
    >
    <a-row> </a-row>
    <a-row style="padding-left: 24px; margin-top: 16px"
      >二、公式說明如下:</a-row
    >
    <a-row style="padding-left: 24px"
      >1.【(A)+〔(A)*(C)/(B)〕+(C)】=預估部門待電訪總件數。</a-row
    >
    <a-row style="padding-left: 24px"
      >2.預估部門待電訪總件數/(D)=預估個人待電訪件數，取整數，無條件進位。</a-row
    >
  </div>
</template>

<script lang="ts" src="./CaseEstimateReportPage.ts">
</script>

<style scoped>
</style>