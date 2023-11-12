<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="roleChangeForm"
    ref="roleChangeRules"
    :rules="changeRules"
  >
    <!-- 角色代碼 -->
    <a-form-model-item      
      :label="$t('roleSF_roleCodeName')"
      prop="id"
      style="margin-bottom: 0px"
      :has-feedback="callCommonUtilFeildFeedback(roleSettingFormValidateObject.id)"
      :validateStatus="callCommonUtilFeildStatus(roleSettingFormValidateObject.id)"
      required
    >
      <a-popover placement="top"
        :destroyTooltipOnHide="true"
        :content="callCommonUtilFeildMsg(roleSettingFormValidateObject.id)"
        :trigger="callCommonUtilFeildTrigger(roleSettingFormValidateObject.id)"
        :visible="callCommonUtilFeildHoverVisible(roleSettingFormValidateObject.id)"
        @visibleChange="callCommonUtilFeildVisibleChange(roleSettingFormValidateObject.id)"
      >
        <a-input
          type="text"
          v-model="roleChangeForm.id"
          :disabled="isEditing"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 角色名稱 -->
    <a-form-model-item      
      :label="$t('roleSF_roleName')"
      prop="roleName"
      style="margin-bottom: 0px"
      :has-feedback="callCommonUtilFeildFeedback(roleSettingFormValidateObject.name)"
      :validateStatus="callCommonUtilFeildStatus(roleSettingFormValidateObject.name)"
      required
    >
      <a-popover placement="top"
        :destroyTooltipOnHide="true"
        :content="callCommonUtilFeildMsg(roleSettingFormValidateObject.name)"
        :trigger="callCommonUtilFeildTrigger(roleSettingFormValidateObject.name)"
        :visible="callCommonUtilFeildHoverVisible(roleSettingFormValidateObject.name)"
        @visibleChange="callCommonUtilFeildVisibleChange(roleSettingFormValidateObject.name)"
      >
        <a-input type="text" v-model="roleChangeForm.roleName" />
      </a-popover>
    </a-form-model-item>
    <!-- 描述 -->
    <a-form-model-item
      :label="$t('roleSF_description')"
      prop="roleDesc"
      style="margin-bottom: 0px"
    >
      <!-- <a-popover placement="top" :content="descMsg" :trigger="descHover"> -->
        <a-input type="text" v-model="roleChangeForm.roleDesc" />
      <!-- </a-popover> -->
    </a-form-model-item>

    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
    >
      <a-select
        v-model="roleChangeForm.status"
        :options="selectStatusOptions"
        :placeholder="$t('roleSF_pleaseChoose')"
      >
      </a-select>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./RoleSettingForm.ts" lang="ts"></script>
