<template>
  <div>
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }" 
      :model="caseClosedReasonChangeForm"
      :rules="caseClosedReasonFormRules"
    >
      <a-row :gutter="24">
        <!-- 結案原因代碼 -->
        <a-col :span="8">
          <a-form-model-item
            :label="$t('caseClosedReason_caseClosedReasonId')"
            class="caseClosedReasonId"
            prop="caseClosedReasonId"
            style="margin-bottom: 0px"
            :has-feedback="caseClosedReasonValidateForm.caseClosedReasonId.feedback"
            :validateStatus="caseClosedReasonValidateForm.caseClosedReasonId.state"
            required
          >
            <a-popover
              placement="top"
              :content="caseClosedReasonValidateForm.caseClosedReasonId.msg"
              :trigger="caseClosedReasonValidateForm.caseClosedReasonId.hover"
            >
              <a-input
                type="text"
                :max-length="20"
                v-model="caseClosedReasonChangeForm.caseClosedReasonId"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <!-- 結案原因名稱 -->
          <a-form-model-item
            :label="$t('caseClosedReason_caseClosedReasonName')"
            class="caseClosedReasonName"
            prop="caseClosedReasonName"
            style="margin-bottom: 0px"
            :has-feedback="caseClosedReasonValidateForm.caseClosedReasonName.feedback"
            :validateStatus="caseClosedReasonValidateForm.caseClosedReasonName.state"
            required
          >
            <a-popover
              placement="top"
              :content="caseClosedReasonValidateForm.caseClosedReasonName.msg"
              :trigger="caseClosedReasonValidateForm.caseClosedReasonName.hover"
            >
              <a-input
                type="text"
                :max-length="50"
                v-model="caseClosedReasonChangeForm.caseClosedReasonName"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <!-- 是否啟用 -->
          <a-form-model-item
            :label="$t('contactResult_status')"
            class="status"
            prop="status"
            style="margin-bottom: 0px"
            :has-feedback="caseClosedReasonValidateForm.status.feedback"
            :validateStatus="caseClosedReasonValidateForm.status.state"
          >
            <a-popover
              placement="top"
              :content="caseClosedReasonValidateForm.status.msg"
              :trigger="caseClosedReasonValidateForm.status.hover"
            >
              <a-select
                v-model="caseClosedReasonChangeForm.status"
                :options="statusOptions"
              >
              </a-select>
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
            prop="createName"
          >
            <label v-if="isEdit"
              >{{ caseClosedReasonChangeForm.createName }}</label
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 建立時間 -->
          <a-form-model-item
            class="time"
            :label="$t('global_createDate')"
            style="margin-bottom: 0px"
            prop="createDate"
          >
            <label v-if="isEdit">{{
              caseClosedReasonChangeForm.createDate
            }}</label>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 異動人員 -->
          <a-form-model-item
            class="updateName"
            :label="$t('global_lastChangeStaff')"
            style="margin-bottom: 0px"
            prop="updateName"
          >
            <label v-if="isEdit"
              >{{ caseClosedReasonChangeForm.updateName }}</label
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="7">
          <!-- 異動時間 -->
          <a-form-model-item
            class="time"
            :label="$t('global_lastChangeDate')"
            style="margin-bottom: 0px"
            prop="updateDate"
          >
            <label v-if="isEdit">{{
              caseClosedReasonChangeForm.updateDate
            }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script src="./CaseClosedReasonEditForm.ts" lang="ts"></script>

<style lang="less" scoped>
  /deep/ .singleCol .ant-form-item-label {
    width: 13% !important;
  }
  /deep/ .singleCol .ant-form-item-control-wrapper {
    width: 80% !important;
  }
  /* 最後異動人員 */
  /deep/.ant-row .ant-col .updateName .ant-form-item-label {
    width: 40% !important;
  }
  /deep/.ant-row .ant-col .updateName .ant-form-item-control-wrapper {
    width: 60%;
  }
  /* 建立日期、更新日期 */
  /deep/.ant-row .ant-col .time .ant-form-item-label {
    width: 40% !important;
  }
  /deep/.ant-row .ant-col .time .ant-form-item-control-wrapper {
    width: 60%;
  }
</style>