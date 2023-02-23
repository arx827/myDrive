<template>
  <div>
    <a-form-model
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 14 }"
      :model="teleRecordForm"
      ref="teleRecordEditForm"
      :rules="teleRecordEditFormRules"
    >
      <a-row>
        <a-col :span="8">
          <!-- 電訪項目 -->
          <a-form-model-item
            :label="$t('userTask')"
            style="margin-bottom: 0px"
            prop="taskId"
            required
            :has-feedback="
              callCommonUtilFeildFeedback(teleRecordEditValidationForm.taskId)
            "
            :validateStatus="
              callCommonUtilFeildStatus(teleRecordEditValidationForm.taskId)
            "
          >
            <a-popover
              placement="top"
              :content="
                callCommonUtilFeildMsg(teleRecordEditValidationForm.taskId)
              "
              :trigger="
                callCommonUtilFeildTrigger(teleRecordEditValidationForm.taskId)
              "
              :visible="
                callCommonUtilFeildHoverVisible(
                  teleRecordEditValidationForm.taskId
                )
              "
              @visibleChange="
                callCommonUtilFeildVisibleChange(
                  teleRecordEditValidationForm.taskId
                )
              "
              :destroyTooltipOnHide="true"
            >
              <a-select
                v-model="teleRecordForm.taskId"
                :options="taskOptions"
                @change="onSelectTaskChange"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 聯絡結果 -->
          <a-form-model-item
            :label="$t('pedding_contactResult')"
            style="margin-bottom: 0px"
            prop="contactResultId"
            required
            :has-feedback="
              callCommonUtilFeildFeedback(
                teleRecordEditValidationForm.contactResultId
              )
            "
            :validateStatus="
              callCommonUtilFeildStatus(
                teleRecordEditValidationForm.contactResultId
              )
            "
          >
            <a-popover
              placement="top"
              :content="
                callCommonUtilFeildMsg(
                  teleRecordEditValidationForm.contactResultId
                )
              "
              :trigger="
                callCommonUtilFeildTrigger(
                  teleRecordEditValidationForm.contactResultId
                )
              "
              :visible="
                callCommonUtilFeildHoverVisible(
                  teleRecordEditValidationForm.contactResultId
                )
              "
              @visibleChange="
                callCommonUtilFeildVisibleChange(
                  teleRecordEditValidationForm.contactResultId
                )
              "
              :destroyTooltipOnHide="true"
            >
              <a-select
                v-model="teleRecordForm.contactResultId"
                :options="contactResultOptions"
                @change="onSelectContactResultChange"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 電訪結果 -->
          <a-form-model-item
            :label="$t('pedding_pendingResult')"
            style="margin-bottom: 0px"
            prop="teleResultId"
            required
            :has-feedback="
              callCommonUtilFeildFeedback(
                teleRecordEditValidationForm.teleResultId
              )
            "
            :validateStatus="
              callCommonUtilFeildStatus(
                teleRecordEditValidationForm.teleResultId
              )
            "
          >
            <a-popover
              placement="top"
              :content="
                callCommonUtilFeildMsg(
                  teleRecordEditValidationForm.teleResultId
                )
              "
              :trigger="
                callCommonUtilFeildTrigger(
                  teleRecordEditValidationForm.teleResultId
                )
              "
              :visible="
                callCommonUtilFeildHoverVisible(
                  teleRecordEditValidationForm.teleResultId
                )
              "
              @visibleChange="
                callCommonUtilFeildVisibleChange(
                  teleRecordEditValidationForm.teleResultId
                )
              "
              :destroyTooltipOnHide="true"
            >
              <a-select
                v-model="teleRecordForm.teleResultId"
                :options="teleResultOptions"
                @change="onSelectTeleResultChange"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <!-- 結案原因 -->
          <a-form-model-item
            :label="$t('pedding_caseCloseReason')"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="teleRecordForm.caseClosedReasonId"
              :options="caseClosedReasonOptions"
            ></a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 是否照會 -->
          <a-form-model-item
            :label="$t('teleResultPage_isNoti')"
            style="margin-bottom: 0px"
            prop="notification"
            required
          >
            <a-select
              v-model="teleRecordForm.notification"
              :options="selectEngOptionsChild"
              @change="onSelectNotificationChange"
            ></a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 照會單是否結案 -->
          <a-form-model-item
            :label="$t('teleRecord_notificationClosedOrNot')"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="teleRecordForm.notiClosed"
              :options="selectEngOptionsChild"
              :disabled="notiClosedDisabledFlag"
            ></a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <!-- 是否郵寄權益信函 -->
          <a-form-model-item
            :label="$t('teleResultPage_isEmailAdjunct')"
            style="margin-bottom: 0px"
            prop="sendInteresetLetter"
            required
          >
            <a-select
              v-model="teleRecordForm.sendInteresetLetter"
              :options="selectEngOptionsChild"
              @change="onSelectSendInteresetLetterChange"
            ></a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <!-- 權益函退信原因≠招領逾期 -->
          <a-form-model-item
            :label="$t('teleRecord_mailLetterReturnReason')"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="teleRecordForm.recruitmentOverdue"
              :options="selectEngOptionsChild"
              :disabled="mailLetterReturnDisabledFlag"
            ></a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="8">
          <!-- 北富銀VS保經代網電訪結果 -->
          <a-form-model-item
            :label="$t('teleRecord_Taipei Fubon Bank VS Insurance teleResult')"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="teleRecordForm.campBankResult"
              :options="campBankResultOptions"
            ></a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row> </a-row>
      <a-row :gutter="24">
        <a-col :span="5">
          <!-- 建立人員 -->
          <a-form-model-item
            class="createName"
            :label="$t('global_createStaff')"
            style="margin-bottom: 0px"
          >
            <label v-if="isEdit">{{
              teleRecordForm.createId + "-" + teleRecordForm.createName
            }}</label>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 建立時間 -->
          <a-form-model-item
            class="time"
            :label="$t('global_createDate')"
            style="margin-bottom: 0px"
          >
            <label v-if="isEdit">{{ teleRecordForm.createDate }}</label>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 異動人員 -->
          <a-form-model-item
            class="updateName"
            :label="$t('global_lastChangeStaff')"
            style="margin-bottom: 0px"
          >
            <label v-if="isEdit">{{
              teleRecordForm.updateId + "-" + teleRecordForm.updateName
            }}</label>
          </a-form-model-item>
        </a-col>
        <a-col :span="7">
          <!-- 異動時間 -->
          <a-form-model-item
            class="time"
            :label="$t('global_lastChangeDate')"
            style="margin-bottom: 0px"
          >
            <label v-if="isEdit">{{ teleRecordForm.updateDate }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script src="./TeleRecordEditForm.ts" lang="ts"></script>