<template>
  <div>
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
      :model="contactResultChangeForm"
      :rules="contactResultFormRules"
    >
      <a-row :gutter="24">
        <!-- 聯絡結果代碼 -->
        <a-col :span="12">
          <a-form-model-item
            :label="$t('contactResult_contactResultId')"
            class="contactResultId"
            prop="contactResultId"
            style="margin-bottom: 0px"
            :has-feedback="contactResultValidateForm.contactResultId.feedback"
            :validateStatus="contactResultValidateForm.contactResultId.state"
            required
          >
            <a-popover
              placement="top"
              :content="contactResultValidateForm.contactResultId.msg"
              :trigger="contactResultValidateForm.contactResultId.hover"
            >
              <a-input
                type="text"
                :max-length="20"
                v-model="contactResultChangeForm.contactResultId"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <!-- 聯絡結果名稱 -->
          <a-form-model-item
            :label="$t('contactResult_contactResultName')"
            class="contactResultName"
            prop="contactResultName"
            style="margin-bottom: 0px"
            :has-feedback="contactResultValidateForm.contactResultName.feedback"
            :validateStatus="contactResultValidateForm.contactResultName.state"
            required
          >
            <a-popover
              placement="top"
              :content="contactResultValidateForm.contactResultName.msg"
              :trigger="contactResultValidateForm.contactResultName.hover"
            >
              <a-input
                type="text"
                :max-length="50"
                v-model="contactResultChangeForm.contactResultName"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <!-- M+傳送 -->
          <a-form-model-item
            :label="$t('contactResult_sendMplus')"
            class="sendMplus"
            prop="sendMplus"
            style="margin-bottom: 0px"
            :has-feedback="contactResultValidateForm.sendMplus.feedback"
            :validateStatus="contactResultValidateForm.sendMplus.state"
          >
            <a-popover
              placement="top"
              :content="contactResultValidateForm.sendMplus.msg"
              :trigger="contactResultValidateForm.sendMplus.hover"
            >
              <a-select
                v-model="contactResultChangeForm.sendMplus"
                :options="sendMplusOptions"
              >
              </a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <!-- 是否啟用 -->
          <a-form-model-item
            :label="$t('contactResult_status')"
            class="status"
            prop="status"
            style="margin-bottom: 0px"
            :has-feedback="contactResultValidateForm.status.feedback"
            :validateStatus="contactResultValidateForm.status.state"
          >
            <a-popover
              placement="top"
              :content="contactResultValidateForm.status.msg"
              :trigger="contactResultValidateForm.status.hover"
            >
              <a-select
                v-model="contactResultChangeForm.status"
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
              >{{ contactResultChangeForm.createId }}-{{
                contactResultChangeForm.createName
              }}</label
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
              contactResultChangeForm.createDate
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
              >{{ contactResultChangeForm.updateId }}-{{
                contactResultChangeForm.updateName
              }}</label
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
              contactResultChangeForm.updateDate
            }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script src="./ContactResultEditForm.ts" lang="ts"></script>
 
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