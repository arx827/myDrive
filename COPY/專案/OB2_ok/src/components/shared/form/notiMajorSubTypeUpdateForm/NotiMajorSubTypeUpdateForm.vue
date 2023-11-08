<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="notiMajorSubTypeUpdateForm"
    :rules="notiMajorSubTypeUpdateFormRules"
    ref="notiMajorSubTypeUpdateForm"
  >
  
    <!-- 次類別代碼 -->
    <a-form-model-item
      :label="$t('notification_majorSubType_code')"
      prop="userMajorSubTypeId"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiMajorSubTypeValidationForm.userMajorSubTypeId)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiMajorSubTypeValidationForm.userMajorSubTypeId)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(notiMajorSubTypeValidationForm.userMajorSubTypeId)"
        :trigger="
          callCommonUtilFeildTrigger(notiMajorSubTypeValidationForm.userMajorSubTypeId)
        "
        :visible="
          callCommonUtilFeildHoverVisible(notiMajorSubTypeValidationForm.userMajorSubTypeId)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiMajorSubTypeValidationForm.userMajorSubTypeId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiMajorSubTypeUpdateForm.userMajorSubTypeId"
          :maxLength="2"
          :disabled="isEditing"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 次類別說明 -->
    <a-form-model-item
      :label="$t('notification_majorSubType_code_description')"
      prop="description"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiMajorSubTypeValidationForm.description)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiMajorSubTypeValidationForm.description)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(notiMajorSubTypeValidationForm.description)"
        :trigger="
          callCommonUtilFeildTrigger(notiMajorSubTypeValidationForm.description)
        "
        :visible="
          callCommonUtilFeildHoverVisible(notiMajorSubTypeValidationForm.description)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiMajorSubTypeValidationForm.description
          )
        "
        :destroyTooltipOnHide="true"
      >
          <a-textarea
          type="text"
          v-model="notiMajorSubTypeUpdateForm.description"
          :maxLength="10"
        />
      </a-popover>
     
    </a-form-model-item>
    <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
      required
      v-if="isEditing"
    >
        <a-select
          v-model="notiMajorSubTypeUpdateForm.status"
          :options="selectStatusOptions"
          :placeholder="$t('roleSF_pleaseChoose')"
          
        >
        <!-- @change="onStatusChange" -->
        </a-select>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotiMajorSubTypeUpdateForm.ts" lang="ts"></script>
