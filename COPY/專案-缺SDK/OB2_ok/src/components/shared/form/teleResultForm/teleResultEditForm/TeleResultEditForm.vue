<template>
  <div>
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }" 
      :model="teleResultChangeForm"
      :rules="teleResultFormRules"
    >
      <a-row :gutter="24">
        <!-- 電訪結果代碼 -->
        <a-col :span="12">
          <a-form-model-item
            :label="$t('teleResult_teleResultId')"
            class="teleResultId"
            prop="teleResultId"
            style="margin-bottom: 0px"
            :has-feedback="teleResultValidateForm.teleResultId.feedback"
            :validateStatus="teleResultValidateForm.teleResultId.state"
            required
          >
            <a-popover
              placement="top"
              :content="teleResultValidateForm.teleResultId.msg"
              :trigger="teleResultValidateForm.teleResultId.hover"
            >
              <a-input
                type="text"
                :max-length="20"
                v-model="teleResultChangeForm.teleResultId"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <!-- 電訪結果名稱 -->
          <a-form-model-item
            :label="$t('teleResult_teleResultName')"
            class="teleResultName"
            prop="teleResultName"
            style="margin-bottom: 0px"
            :has-feedback="teleResultValidateForm.teleResultName.feedback"
            :validateStatus="teleResultValidateForm.teleResultName.state"
            required
          >
            <a-popover
              placement="top"
              :content="teleResultValidateForm.teleResultName.msg"
              :trigger="teleResultValidateForm.teleResultName.hover"
            >
              <a-input
                type="text"
                :max-length="50"
                v-model="teleResultChangeForm.teleResultName"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <!-- 是否列入良質指標 -->
          <a-form-model-item
            :label="$t('teleResult_notSuspective')"
            class="notSuspective"
            prop="notSuspective"
            style="margin-bottom: 0px"
            :has-feedback="teleResultValidateForm.notSuspective.feedback"
            :validateStatus="teleResultValidateForm.notSuspective.state"
          >
            <a-popover
              placement="top"
              :content="teleResultValidateForm.notSuspective.msg"
              :trigger="teleResultValidateForm.notSuspective.hover"
            >
              <a-select
                v-model="teleResultChangeForm.notSuspective"
                :options="notSuspectiveOptions"
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
            :has-feedback="teleResultValidateForm.status.feedback"
            :validateStatus="teleResultValidateForm.status.state"
          >
            <a-popover
              placement="top"
              :content="teleResultValidateForm.status.msg"
              :trigger="teleResultValidateForm.status.hover"
            >
              <a-select
                v-model="teleResultChangeForm.status"
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
              >{{ teleResultChangeForm.createName }}</label
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
              teleResultChangeForm.createDate
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
              >{{ teleResultChangeForm.updateName }}</label
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
              teleResultChangeForm.updateDate
            }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script src="./TeleResultEditForm.ts" lang="ts"></script>
 
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