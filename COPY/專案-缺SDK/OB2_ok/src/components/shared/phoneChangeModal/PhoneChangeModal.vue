<template>
      <div class="countersignature__modal">
    <!-- 基本資料 -->
    <Basic 
      :basicCaseNo="propCaseNo"
      @emitCaseNo="updateCaseNo"
      @basicLoading="basicLoading"
      ref="infBasicform"
    />
  <div class="section-card section__basic">
    <div class="card__title-position">
      <!-- 電話變更內容 -->
      <span class="card__title">{{$t('pcReviewPage_telChangeContent')}}</span>
    </div>
    <div class="card__infomation">
      <a-row type="flex" justify="end" :gutter="[10, 0]" v-if="$props.caseType == 'review'">
        <a-col class="button-group">
          <!-- 錄音調閱 -->
          <a-button type="primary" @click="onRecordOpen">{{$t('infMainForm_getRecord')}}</a-button>
        </a-col>
      </a-row>
    <QuestTelChange
     :changeCaseNo='propCaseNo'
     :reviewNo='propInfInfoId'
     changeType="review"
     :isReSend="isEdit"
     @resultLoading='countersignatureLoading'
     ref="questTelChange"
    />
    </div>
  </div>

    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showRecordPlayList"
      :title="$t('serveConHis_recordPlayDetail') + callSys"
      width="45%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      @cancel="showRecordPlayList = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <RecordPlayList
        ref="recordPlayList"
        :loading="loading"
        :inumDtoList="inumDtoList"
        :tobdRecordHistoryDtoFromInform="tobdRecordHistoryDtoFromInform"
      />
      <template slot="footer">
        <a-button
          type="primary"
          @click="showRecordPlayList = !showRecordPlayList"
        >
          {{ $t('onDutyPage_close') }}
        </a-button>
      </template>
    </DragModal>

    <!-- 覆核作業 -->
    <ReviewWork
      v-if="$props.caseType == 'review'"
      :isEdit="isShowReviewButton"
      :insetPolicy="policy"
      :reviewNo="propInfInfoId"
      @emitFormData="updateFormData"
      @resultLoading="resultLoading"
      ref="reviewForm"
    />

    <!-- footer button -->
    <a-row type="flex" justify="end" class="countersignature__footerBar" :gutter="[10, 0]">

      <!-- 覆核作業 -->
      <template v-if="$props.caseType == 'review' && $route.name != 'REVIEW_MENU'">
          <a-col v-if="isShowReviewButton">
            <!-- 通過 -->
            <a-button type="primary" @click="onPassSubmit">{{$t('infMainForm_reviewPass')}}</a-button>
          </a-col>
          <a-col v-if="isShowReviewButton">
            <!-- 退回 -->
            <a-button type="primary" @click="onUnpassSubmit">{{$t('infMainForm_reviewReturn')}}</a-button>
          </a-col>
      </template>
      <!-- 覆核退回 -->
      <template v-if="$props.caseType == 'review' && $route.name == 'REVIEW_MENU'">
          <a-col v-if="isShowReviewButton">
          <!-- 重送 -->
           <a-button type="primary" @click="onReSendSubmit">{{$t('reviewPage_resend')}}</a-button>
          </a-col>
          <a-col v-if="isShowReviewButton">
           <!-- 取消 -->
           <a-button type="primary" @click="onCancelSubmit">{{$t('global_cancel')}}</a-button>
         </a-col>
      </template>

      <a-col>
        <!-- 離開 -->
        <a-button type="primary" @click="onLeave">{{$t('infMainForm_leave')}}</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script src="./PhoneChangeModal.ts" lang="ts"></script>
<style lang="less" scoped>

  /deep/ .card__infomation {

    .ant-descriptions-view {
      overflow: auto;
    }

    .ant-descriptions-item-label {
     
      white-space: nowrap;
      
    }

    .ant-descriptions-item-content {
      // 保留保單號碼 寬度
      min-width: 15em;
    }

  }

  .button-group {
    margin-bottom: 10px;
  }
</style>
