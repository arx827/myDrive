<template>
  <div>
    <a-form-model
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 14 }"
      :model="teleResultConfigForm"
      :rules="teleResultConfigFormRules"
    >
      <a-row>
        <a-col :span="8">
          <!-- 編號 -->
          <a-form-model-item
            v-if="!isEdit"
            :label="$t('global_serialNumber')"
            style="margin-bottom: 0px"
            prop="teleResultConfigId"
            :has-feedback="
              callCommonUtilFeild(teleResultConfigIdFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(teleResultConfigIdFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="teleResultConfigIdFeildValidation.msg"
              :trigger="teleResultConfigIdFeildValidation.hover"
            >
              <a-input
                type="text"
                :max-length="20"
                v-model="teleResultConfigForm.teleResultConfigId"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
          <a-form-model-item
            v-if="isEdit"
            :label="$t('global_serialNumber')"
            style="margin-bottom: 0px"
            prop="teleResultConfigId"
          >
            {{ teleResultConfigForm.teleResultConfigId }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <!-- 電訪項目 -->
          <a-form-model-item
            :label="$t('userTask')"
            style="margin-bottom: 0px"
            prop="taskId"
            :has-feedback="callCommonUtilFeild(taskIdFeildValidation).feedback"
            :validateStatus="callCommonUtilFeild(taskIdFeildValidation).state"
            required
          >
            <a-popover
              placement="top"
              :content="taskIdFeildValidation.msg"
              :trigger="taskIdFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.taskId"
                :options="taskOptions"
                :disabled="isEdit"
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
            :has-feedback="
              callCommonUtilFeild(contactResultIdFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(contactResultIdFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="contactResultIdFeildValidation.msg"
              :trigger="contactResultIdFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.contactResultId"
                :options="contactResultOptions"
                :disabled="isEdit"
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
            :has-feedback="
              callCommonUtilFeild(teleResultIdFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(teleResultIdFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="teleResultIdFeildValidation.msg"
              :trigger="teleResultIdFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.teleResultId"
                :options="teleResultOptions"
                :disabled="isEdit"
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
              v-model="teleResultConfigForm.caseClosedReasonId"
              :options="caseClosedReasonOptions"
              :disabled="isEdit"
            ></a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 是否照會 -->
          <a-form-model-item
            :label="$t('teleResultPage_isNoti')"
            style="margin-bottom: 0px"
            prop="notification"
            :has-feedback="
              callCommonUtilFeild(notificationFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(notificationFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="notificationFeildValidation.msg"
              :trigger="notificationFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.notification"
                :options="selectEngOptionsChild"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 是否會辦 -->
          <a-form-model-item
            :label="$t('teleResultPage_isInf')"
            style="margin-bottom: 0px"
            prop="inform"
            :has-feedback="callCommonUtilFeild(informFeildValidation).feedback"
            :validateStatus="callCommonUtilFeild(informFeildValidation).state"
            required
          >
            <a-popover
              placement="top"
              :content="informFeildValidation.msg"
              :trigger="informFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.inform"
                :options="selectEngOptionsChild"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <!-- 是否郵寄權益信函 -->
          <a-form-model-item
            :label="$t('teleResultPage_isEmailAdjunct')"
            style="margin-bottom: 0px"
            prop="sendInterestLetter"
            :has-feedback="
              callCommonUtilFeild(sendInterestLetterFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(sendInterestLetterFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="sendInterestLetterFeildValidation.msg"
              :trigger="sendInterestLetterFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.sendInterestLetter"
                :options="selectEngOptionsChild"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 是否列入有效保單 -->
          <a-form-model-item
            :label="$t('teleResultPage_isEffectivePolicy')"
            style="margin-bottom: 0px"
            prop="validPolicy"
            :has-feedback="
              callCommonUtilFeild(validPolicyFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(validPolicyFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="validPolicyFeildValidation.msg"
              :trigger="validPolicyFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.validPolicy"
                :options="selectEngOptionsChild"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 是否列入完成電訪 -->
          <a-form-model-item
            :label="$t('teleResultPage_isCompeletedUserTask')"
            style="margin-bottom: 0px"
            prop="completeTele"
            :has-feedback="
              callCommonUtilFeild(completeTeleFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(completeTeleFeildValidation).state
            "
            required
          >
            <a-popover
              placement="top"
              :content="completeTeleFeildValidation.msg"
              :trigger="completeTeleFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.completeTele"
                :options="completeTeleOptions"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <!-- 是否回寫AS400 -->
          <!-- 當「結案原因為空」時，「是否回寫AS400欄位預設為否，並disable」，
          反之則enable並維持預設值，如果當「是否回寫AS400為是」，
          然後又將「結案原因改為空」，這時要將「是否回寫AS400欄位改為否，並disable」 -->
          <a-form-model-item
            :label="$t('teleResultPage_isWritenInAs400')"
            style="margin-bottom: 0px"
            required
          >
            <a-select
              v-model="teleResultConfigForm.returnAs400"
              :options="selectChineseOptionsChild"
              :disabled="isAs400Disabled"
            ></a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="teleResultConfigForm.returnAs400 === 'Y'">
          <!-- 回寫至主機的對應值 -->
          <!-- 是否回寫400==Y，新增時必填，編輯時開放編輯 -->
          <a-form-model-item
            :label="$t('teleResultPage_isWritenInServer')"
            style="margin-bottom: 0px"
            prop="hostCorrespond"
            :has-feedback="
              callCommonUtilFeild(hostCorrespondFeildValidation).feedback
            "
            :validateStatus="
              callCommonUtilFeild(hostCorrespondFeildValidation).state
            "
            :required="ishostCorrespondRequired"
          >
            <a-popover
              placement="top"
              :content="hostCorrespondFeildValidation.msg"
              :trigger="hostCorrespondFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.hostCorrespond"
                :options="hostCorrespondOptions"
              ></a-select>
            </a-popover>
          </a-form-model-item>
          <!-- 是否回寫400!=N，新增時必填，編輯時不可編輯 -->
          <!-- <a-form-model-item
            v-if="teleResultConfigForm.returnAs400 !== 'Y'"
            :label="$t('teleResultPage_isWritenInServer')"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="teleResultConfigForm.hostCorrespond"
              :options="hostCorrespondOptions"
              :disabled="isEdit"
            ></a-select>
          </a-form-model-item> -->
        </a-col>
        <a-col :span="8">
          <!-- 是否啟用 -->
          <a-form-model-item
            :label="$t('contactResult_status')"
            style="margin-bottom: 0px"
            prop="status"
            :has-feedback="callCommonUtilFeild(statusFeildValidation).feedback"
            :validateStatus="callCommonUtilFeild(statusFeildValidation).state"
            required
          >
            <a-popover
              placement="top"
              :content="statusFeildValidation.msg"
              :trigger="statusFeildValidation.hover"
            >
              <a-select
                v-model="teleResultConfigForm.status"
                :options="selectStatusOptionsChild"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="5">
          <!-- 建立人員 -->
          <a-form-model-item
            class="createName"
            :label="$t('global_createStaff')"
            style="margin-bottom: 0px"
          >
            <label v-if="isEdit">{{
              teleResultConfigForm.createId +
              "-" +
              teleResultConfigForm.createName
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
            <label v-if="isEdit">{{ teleResultConfigForm.createDate }}</label>
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
              teleResultConfigForm.updateId +
              "-" +
              teleResultConfigForm.updateName
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
            <label v-if="isEdit">{{ teleResultConfigForm.updateDate }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script src="./TeleResultConfigEditForm.ts" lang="ts"></script>