<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="notiSettingUpdateForm"
    :rules="notiSettingUpdateFormRules"
    ref="notiSettingUpdateForm"
  >
  <!-- 電訪照會碼 -->
    <a-form-model-item
      :label="$t('notiSettingPage_notiSetting')"
      prop="notiSettingId"
      style="margin-bottom: 0px"
      v-if="isEditing"
    >
   <p >{{notiSettingUpdateForm.notiUserSettingId}}</p>
    </a-form-model-item>


    <!-- 照會主類別 -->
    <a-form-model-item
      :label="$t('notiSettingPage_notiMajorType')"
      prop="notiMajorTypeId"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          notiSettingUpdateValidationForm.notiMajorTypeId
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          notiSettingUpdateValidationForm.notiMajorTypeId
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            notiSettingUpdateValidationForm.notiMajorTypeId
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            notiSettingUpdateValidationForm.notiMajorTypeId
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiSettingUpdateValidationForm.notiMajorTypeId
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiSettingUpdateValidationForm.notiMajorTypeId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          class="select"
          v-model="notiSettingUpdateForm.notiMajorTypeId"
          :options="notiMajorTypeSelectOptions"
          style="width: 150px"
          :disabled="isEditing"
          @change="onNotiMajorTypeIdChange"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 照會次類別 -->
    <a-form-model-item
      :label="$t('notiSettingPage_notiMajorSubType')"
      prop="notiMajorSubTypeId"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          notiSettingUpdateValidationForm.notiMajorSubTypeId
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          notiSettingUpdateValidationForm.notiMajorSubTypeId
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            notiSettingUpdateValidationForm.notiMajorSubTypeId
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            notiSettingUpdateValidationForm.notiMajorSubTypeId
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiSettingUpdateValidationForm.notiMajorSubTypeId
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiSettingUpdateValidationForm.notiMajorSubTypeId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          class="select"
          v-model="notiSettingUpdateForm.notiMajorSubTypeId"
          :options="notiMajorSubTypeSelectOptions"
          style="width: 240px"
          :disabled="isEditing"
          @change="onNotiMajorSubTypeIdChange"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 電訪照會說明 -->
    <a-form-model-item
      :label="$t('notiSettingPage_notiSettingDescription')"
      prop="notiDescription"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          notiSettingUpdateValidationForm.notiDescription
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          notiSettingUpdateValidationForm.notiDescription
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            notiSettingUpdateValidationForm.notiDescription
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            notiSettingUpdateValidationForm.notiDescription
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiSettingUpdateValidationForm.notiDescription
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiSettingUpdateValidationForm.notiDescription
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiSettingUpdateForm.notiDescription"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="30"
          @mouseenter="notiNotiDescriptionMouseOver"
          @mouseout="notiDescriptionVisible = false"
          @change="onNotiDescriptionChange()" 
        />
      </a-popover>
  
    </a-form-model-item>

    <!-- 電訪照會補字內容 -->
    <a-form-model-item
      :label="$t('notiSettingPage_notiSettingAdditionalContent')"
      prop="addtional"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(notiSettingUpdateValidationForm.addtional)
      "
      :validateStatus="
        callCommonUtilFeildStatus(notiSettingUpdateValidationForm.addtional)
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(notiSettingUpdateValidationForm.addtional)
        "
        :trigger="
          callCommonUtilFeildTrigger(notiSettingUpdateValidationForm.addtional)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiSettingUpdateValidationForm.addtional
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiSettingUpdateValidationForm.addtional
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="notiSettingUpdateForm.addtional"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="100"
          @mouseenter="notiNotiDescriptionMouseOver"
          @mouseout="addtionalVisible = false"
          @change="onAddtionalChange()"
        />
      </a-popover>
      
    </a-form-model-item>

    <!-- 銀保照會碼 -->
    <a-form-model-item
      :label="$t('notiSettingPage_notiBancassurance')"
      prop="notiBancassurance"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          notiSettingUpdateValidationForm.notiBancassurance
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          notiSettingUpdateValidationForm.notiBancassurance
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            notiSettingUpdateValidationForm.notiBancassurance
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            notiSettingUpdateValidationForm.notiBancassurance
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            notiSettingUpdateValidationForm.notiBancassurance
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            notiSettingUpdateValidationForm.notiBancassurance
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          class="select"
          v-model="notiSettingUpdateForm.notiBancassurance"
          :options="originalNotiBancassuranceEffectiveOptions"
          style="width: 240px"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
      v-if="isEditing"
      required
    >
      <a-select
        v-model="notiSettingUpdateForm.status"
        :options="originalNotiSettingStatusOptions"
        :placeholder="$t('roleSF_pleaseChoose')"
        style="width: 150px"
        @change="onNotiBancassuranceChange()"
      >
      </a-select>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./NotiSettingUpdateForm.ts" lang="ts"></script>
