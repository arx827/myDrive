<template>
  <div class="Notification__modal">
    
    <template v-if="$props.step == notiStep.open || $props.step == notiStep.review || $props.isNotCloseNotify">
      <!-- 基本資料 -->
      <Basic 
        :basicCaseNo="caseNo"
        :notiInfoId="$props.propNotiInfoId"
        :isEdit="($props.step == notiStep.open)"
        :isReview="$props.step == notiStep.review || $props.isNotCloseNotify"
        @emitBasicInfo="getChildInformation"
        ref="notiBasicform"
      />

      <!-- 照會內容 -->
      <Interview 
        :isEdit="($props.step == notiStep.review && isShowReviewButton && $route.name == 'REVIEW_MENU')"
        :basicCaseNo="submitData.basicInfoData.caseNo"
        :caseLogId="caseLogId"
        @emitIntereview="getChildInformation"
        @emitReviewStatus="getReviewStatus"
        ref="notiInterviewform"
      />
      <!-- 照會資料 -->
      <NotificationInfo
        :isEdit="$props.step == notiStep.open"
        :insetPolicy="policy"
        :caseClosed="isCaseClosed && $route.name == 'OnDuty'"
        :propReOpen="reOpen"
        :notiInfoId="propNotiInfoId"
        @emitItemInfo="getChildInformation"
        :propStep="$props.step"
        :isReview="(!isShowReviewButton && $route.name == 'REVIEW_MENU') || $route.name == 'REVIEW_NOTI' || $props.isNotCloseNotify"
        :notiData="submitData.basicInfoData"
        :isNotCloseNotify="$props.isNotCloseNotify"
        @caseCheck="caseCheck"
        @emitReviewStatus="getReviewStatus"
        ref="notiInfoform"
      />

      <!-- 覆核作業 -->
      <ReviewWork
        v-if="$props.step == notiStep.review"
        :isEdit="isShowReviewButton"
        :reviewNo="propNotiInfoId"
        @emitFormData="updateFormData"
        @emitItemInfo="getChildInformation"
        ref="reviewForm"
      />
    </template>
    <template v-else>

      <!-- 照會回覆 -->
      <NotificationReplyInfo
        :isEdit="$props.step == notiStep.reply"
        :notiInfoId="$props.propNotiInfoId"
        :caseNo="$props.propCaseNo"
        @emitReplySubmit="onSubmitLeave"
        @emitReplyClosedSubmit="onReplySubmitLeave"
        ref="notificationReplyInfo"
      ></NotificationReplyInfo>

      <!-- 照會結案 -->
      <NotificationClosed 
        v-if="$props.step == notiStep.close"
        :notiInfoId="$props.propNotiInfoId"
        :caseNo="$props.propCaseNo"
        @emitClosedSubmit="onSubmitLeave"
        ref="notificationClosedInfo"
      ></NotificationClosed>
  
    </template>
    <!-- footer button -->
    <a-row type="flex" justify="end" class="countersignature__footerBar" :gutter="[10, 0]">
      
      <!-- 照會開單 -->
      <template v-if="$props.step == notiStep.open">
        <!-- 照會單預覽 -->
        <a-col>
          <a-button type="primary" :disabled="isCaseClosed" @click="onNotiPdfPreview">{{ $t('notificationModal_pdfPreview') }}</a-button>
        </a-col>
        
        <!-- 發送 -->
        <a-col>
          <a-button type="primary" :disabled="isCaseClosed" @click="onSendNotification">{{ $t('notificationModal_send') }}</a-button>
        </a-col>
      </template>

      <!-- 照會回覆 -->
      <template v-if="$props.step == notiStep.reply">
        
        <!-- 儲存 -->
        <a-col>
          <a-button type="primary" @click="onReplySubmit">{{$t('global_save')}}</a-button>
        </a-col>

        <!-- 結案 -->
        <a-col>
          <a-button type="primary" @click="onReplyClosedSubmit">{{$t('infMainForm_closeCloseCase')}}</a-button>
        </a-col>
      </template>

      <!-- 照會結案 -->
      <template v-if="$props.step == notiStep.close">
        <a-col>
          <!-- 結案 -->
          <a-button type="primary" @click="onClosedSubmit">{{$t('infMainForm_closeCloseCase')}}</a-button>
        </a-col>
      </template>

      <!-- 覆核作業 -->
      <template v-if="$props.step == notiStep.review && $route.name != 'REVIEW_MENU'">
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
      <template v-if="$props.step == notiStep.review && $route.name == 'REVIEW_MENU'">
          <!-- 照會單預覽 -->
          <a-col v-if="isShowReviewButton">
            <a-button type="primary" @click="onNotiPdfPreview">{{ $t('notificationModal_pdfPreview') }}</a-button>
          </a-col>
          <a-col v-if="isShowReviewButton">
          <!-- 重送 -->
           <a-button type="primary" @click="onReSendSubmit">{{$t('reviewPage_resend')}}</a-button>
          </a-col>
          <a-col v-if="isShowReviewButton">
           <!-- 取消 -->
           <a-button type="primary" @click="onCancelSubmit">{{$t('global_cancel')}}</a-button>
         </a-col>
      </template>

      <!-- 離開 -->
      <a-col>
        <a-button @click="onLeave">{{ $t('global_leave') }}</a-button>
      </a-col>
    </a-row>
    
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
<script src="./NotificationModal.ts" lang="ts"></script>
<style lang="less">
  .Notification__modal {
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
      margin-top: 30px;
      &.section-card:first-child {
        margin-top: 5px;
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