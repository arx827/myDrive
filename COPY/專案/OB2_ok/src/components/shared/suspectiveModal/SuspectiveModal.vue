<template>
      <div class="countersignature__modal">
    <!-- 基本資料 -->
    <Basic 
      :basicCaseNo="propCaseNo"
      @emitCaseNo="updateCaseNo"
      @basicLoading="basicLoading"
      ref="infBasicform"
    />

    <SuspectiveInfo
      :isEdit="$props.step == 1 && !$props.caseType"
      :insetPolicy="policy"
      :comInfInfoId="infInfoId"
      :caseType="$props.caseType"
      :propCaseNo="$props.propCaseNo"
      @caseCheck="caseCheck"
      @resultLoading='countersignatureLoading'
      ref="infInform"
    >
    </SuspectiveInfo>

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

    <DragModal
      :visible="isCaseSearch"
      :title="$t('caseCheck')"
      width="75%"
      :visibleFooter="false"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @cancel="isCaseSearch = false"
    >
      <CaseSearchPage
        ref="CaseSearchPageForm"
        :packNumber="$props.propPackNo"
      />
    </DragModal>
  </div>
</template>
<script src="./SuspectiveModal.ts" lang="ts"></script>
<style lang="less" scoped>

  .button-group {
    margin-bottom: 10px;
  }
</style>
