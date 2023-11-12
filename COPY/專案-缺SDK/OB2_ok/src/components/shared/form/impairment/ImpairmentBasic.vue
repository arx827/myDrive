<template>
  <div class="section-card section__basic">
    <div class="card__title-position">
      <!-- 基本資料 -->
      <span class="card__title">{{$t('infBasic_basicInfo')}}</span>
    </div>
    <div class="card__infomation">
        <a-descriptions size="middle" :column="1" bordered>
        <!-- 受訪者ID： -->
        <a-descriptions-item :label="$t('pedding_custId')">{{ policyInfoData.custId }}</a-descriptions-item>
        <!-- 受訪者姓名： -->
        <a-descriptions-item :label="$t('pedding_custName')">{{ policyInfoData.custName }}</a-descriptions-item>
        <!-- 聽語障： -->
        <a-descriptions-item :label="$t('pedding_impairment')">{{ policyInfoData.pherId }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>
<script src="./ImpairmentBasic.ts" lang="ts"></script>
<style lang="less" scoped>

  /deep/ .card__infomation {

    .ant-descriptions-view {
      overflow: auto;
    }

    .ant-descriptions-item-label {
     
      white-space: nowrap;
      
    }

    // .ant-descriptions-item-content {
    //   // 保留保單號碼 寬度
    //   min-width: 15em;
    // }

  }
</style>