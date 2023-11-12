<template>
  <div class="section-card section__countersignature">
    <div class="card__title-position">
      <!-- 憂質內容 -->
      <span class="card__title">{{$t('reviewCasePage_suspectiveInfo').toString()}}</span>
    </div>
    <div class="card__infomation">
      <!-- 會辦單覆核 時 顯示 -->
      <a-row type="flex" justify="end" :gutter="[10, 0]">
        <a-col>
          <!-- 案件調閱 -->
          <a-button type="primary" @click="caseCheck()">{{
            $t("caseCheck")
          }}</a-button>
        </a-col>
      </a-row>
      <!-- 撥號歷程 -->
      <a-row>
        <BlockHeader
          :blockTitle="$t('case_search_grid_haveCallUpHis')"
          :themeColor="'theme2'"
          :displayAll="true"
          :blockName="'phoneCallHistory'"
        />
        <CallupHistory :isReviewPage="true" :callUpHistoryParam="callUpInput" />
      </a-row>
      <a-row>
        <!-- 郵寄通知函 -->
        <BlockHeader
          :blockTitle="$t('reviewCasePage_mailNotifaction').toString()"
          :themeColor="'theme2'"
          :displayAll="false"
        />
        <div class="result__table">
          <a-descriptions bordered>
            <!-- 收件人姓名 -->
            <a-descriptions-item :label="$t('postRecordForm_receiver_name').toString()" :span="1">
              {{mailInfo.receiver}}
            </a-descriptions-item>
            <!-- 郵寄地址 -->
            <a-descriptions-item :label="$t('mailNotice_grid_address').toString()" :span="2">
              {{mailInfo.address}}
            </a-descriptions-item>
            <!-- 產信日期 -->
            <a-descriptions-item :label="$t('postRecordForm_letterDate').toString()" :span="1">
              {{mailInfo.letterDate}}
            </a-descriptions-item>
            <!-- 郵寄日期 -->
            <a-descriptions-item :label="$t('postRecordForm_mailByPostDate').toString()" :span="1">
              {{mailInfo.mailByPostDate}}
            </a-descriptions-item>
            <!-- 人工/批次 -->
            <a-descriptions-item :label="$t('reviewCasePage_mailCreateType').toString()" :span="1">
              {{mailInfo.manulLetterStatus}}
            </a-descriptions-item>
            <!-- 退回日期 -->
            <a-descriptions-item :label="$t('riskControl_ntrnReturnDate').toString()" :span="1" >
              {{mailInfo.returnDate}}
            </a-descriptions-item>
            <!-- 退回原因 -->
            <a-descriptions-item :label="$t('riskControl_ntrnReturnReason').toString()" :span="1">
              {{mailInfo.returnReason}}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </a-row>
    </div>
  </div>
</template>
<script src="./SuspectiveInfo.ts" lang="ts"></script>
<style lang="less" scoped>
.countersignatureModalFormPage {
  .infDepartment {
    .ant-form-item-label {
      width: 16.7%;
    }
    .ant-form-item-control-wrapper {
      width: 35%;
    }
  }
}
</style>