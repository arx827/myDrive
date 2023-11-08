<template>
  <div class="countersignature__modal">
    <!-- 基本資料 -->
    <Basic 
      :basicCaseNo="caseNo"
      :isEdit="$props.step == 1"
      
      @emitCaseNo="updateCaseNo"
      @emitInitInformPreviewFlag="initInformPreviewFlag"
      @emitChannelsId="updateChannelsId"
      @emitIsCaseClosed="changeCaseClosed"
      @basicLoading="basicLoading"
      ref="infBasicform"
    />
    
    <!-- 會辦資料 -->
    <Countersignature
      :isEdit="($props.step == 1 && !$props.caseType) || ($route.name == 'REVIEW_MENU' && isShowReviewButton)"
      :insetPolicy="policy"
      :comInfInfoId="infInfoId"
      :isNotCloseNotify="$props.isNotCloseNotify"
      :caseType="$props.caseType"
      :packNo="$props.propPackNo"
      @emitGetBasicEmailInfo="getBasicEmailInfo"
      @emitGetBasicCaseNo="getBasicCaseNo"
      @emitUpdateInfTypeInfo="updateInfTypeInfo"
      @emitUpdateInformPreviewFlag="updateInformPreviewFlag"
      @emitCheckChannelsId="checkChannelsId"
      @countersignatureLoading="countersignatureLoading"
      @caseCheck="caseCheck"
      ref="infInform"
    />
    
    <!-- 會辦回覆 -->
    <Reply
      v-if="$props.step > 1"
      :isEdit="$props.step > 1 && $props.step == 2"
      :replyInfInfoId="infInfoId"
      :insetPolicy="policy"
      :infTypeId="propInfTypeId"
      @emitFormData="updateFormData"
      @resultLoading="resultLoading"
      ref="infReplyForm"
    />

    <!-- 會辦結案 -->
    <Closed
      v-if="$props.step > 2"
      :isEdit="$props.step > 2 && $props.step == 3"
      :insetPolicy="policy"
      @emitFormData="updateFormData"
      ref="infCloseForm"
    />


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
      <template v-if="$props.step == 1">
        <a-col v-if="infInformType =='4'">
          <!-- 會辦單預覽 -->
          <a-button type="primary" :disabled="isCaseClosed" @click="onCountersignatureReview">{{$t('infMainForm_comPreview')}}</a-button>
        </a-col>
        <a-col>
          <!-- 發送 -->
          <a-button type="primary" :disabled="isCaseClosed" @click="onCountersignatureSubmit">{{$t('infMainForm_comSend')}}</a-button>
        </a-col>
      </template>

      <template v-if="$props.step == 2">
        <a-col>
          <!-- 轉件 -->
          <a-button type="primary" @click="onReplyTransfer">{{$t('infMainForm_replyTransfer')}}</a-button>
        </a-col>
        <a-col>
          <!-- 儲存 -->
          <a-button type="primary" @click="onReplySubmit">{{$t('global_save')}}</a-button>
        </a-col>
      </template>

      <template v-if="$props.step == 3">
        <a-col>
          <!-- 結案 -->
          <a-button type="primary" @click="onClosedSubmit">{{$t('infMainForm_closeCloseCase')}}</a-button>
        </a-col>
      </template>

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
          <a-col v-if="infInformType =='4'">
            <!-- 會辦單預覽 -->
            <!-- 只有值機畫面會disable會辦單預覽 -->
            <a-button type="primary" :disabled="isCaseClosed && $route.name=='OnDuty'" @click="onCountersignatureReview">{{$t('infMainForm_comPreview')}}</a-button>
          </a-col>
          <a-col v-if="isShowReviewButton">
          <!-- 重送 -->
           <a-button type="primary" @click="onResendSubmit">{{$t('reviewPage_resend')}}</a-button>
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

    <!-- 轉件 -->
    <a-modal
      v-model="isTransferFormVisible"
      :title="$t('infMainForm_transferFormTitle')"
      width="1000px"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <CountersignatureModalTransfer
        :infInfoId="propInfInfoId"
        @transferSuccess="transferSuccess"
      >
      </CountersignatureModalTransfer>
    </a-modal>

    <!-- 案件調閱 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
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
<script src="./CountersignatureModal.ts" lang="ts"></script>
<style lang="less">
  .countersignature__modal {
    // antd
    .ant-form-item {
      margin-bottom: 0;
    }
    // 唯讀欄位 調整 line-height
    .readonly-form-item {
      .ant-form-item-label,
      .ant-form-item-children {
        line-height: 2;
      }
      &.ant-form-item-label {
        line-height: 2;
      }
    }

    // tag樣式
    .ant-tag {
      padding: 5px;
    }

    // 卡片樣式
    .section-card {
      border: 1px solid #eee;
      border-radius: 5px;
      position: relative;
      min-height: 2em;
      margin-top: 5px;
      + .section-card {
        margin-top: 30px;
      }
    }
    .card__infomation {
      padding: 30px 15px 15px;
      box-shadow: 1px 4px 8px #ddd;
      .ant-row-flex {
        + .ant-row-flex {
          margin-top: 10px;
        }
      }
    }

    .card__title-position {
      position: absolute;
      top: 0;
      left: 5px;
      transform: translateY(-50%);
    }
    .card__title {
      background: @COLOR-WHITE;
      padding-left: 10px;
      padding-right: 10px;
      font-weight: 600;
      font-size: 18px;
    }

    // 欄位樣式
    .readonly__textarea {
      background-color: @COLOR-GRAY4;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      line-height: 1.5;
      padding: 10px;
    }
    .file__lists {
      margin-left: 80px;
      margin-right: 80px;
    }

    // footerBar
    .countersignature__footerBar {
      margin-top: 20px;
    }
  }
</style>