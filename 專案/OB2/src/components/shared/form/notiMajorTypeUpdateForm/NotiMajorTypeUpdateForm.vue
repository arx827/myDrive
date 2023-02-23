<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="notiMajorTypeUpdateForm"
    :rules="notiMajorTypeUpdateFormRules"
    ref="notiMajorTypeUpdateForm"
  >
  
    <!-- 選單內容 -->
    <a-form-model-item
      :label="$t('notification_majorType_code')"
      prop="majorTypeId"
      style="margin-bottom: 0px"
      v-if="isEditing"
    >
    <p>{{initData.sequence}}</p>
    </a-form-model-item>
    <!-- 主類別說明 -->
    <a-form-model-item
      :label="$t('notification_majorType_description')"
      prop="description"
      style="margin-bottom: 0px"
      required
     :has-feedback="
        callCommonUtilFeildFeedback(notiMajorTypeValidationForm.description)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiMajorTypeValidationForm.description)
      "
    >
      <a-popover
        placement="top"
        :content="callCommonUtilFeildMsg(notiMajorTypeValidationForm.description)"
        :trigger="
          callCommonUtilFeildTrigger(notiMajorTypeValidationForm.description)
        "
        :visible="
          callCommonUtilFeildHoverVisible(notiMajorTypeValidationForm.description)
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiMajorTypeValidationForm.description
          )
        "
        :destroyTooltipOnHide="true"
      >
          <a-textarea
          type="text"
          v-model="notiMajorTypeUpdateForm.description"
          :maxLength="10"
          @mouseover="notiDescriptionMouseOver()"
          @change="onDescriptionChange()"
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
          v-model="notiMajorTypeUpdateForm.status"
          :options="selectStatusOptions"
          :placeholder="$t('roleSF_pleaseChoose')"
        >
        <!-- @change="onStatusChange" -->
        </a-select>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotiMajorTypeUpdateForm.ts" lang="ts"></script>
