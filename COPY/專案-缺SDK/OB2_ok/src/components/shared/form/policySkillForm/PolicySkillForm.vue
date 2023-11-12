<template >
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="userSkillsSettingForm"
    ref="userSkillsSettingForm"
  >
  <!-- 部門 -->
    <a-form-model-item :label="$t('global_department')" style="margin-bottom: 0px"
     :has-feedback="userSkillsValidateForm.selectedDep.feedback"
     :validateStatus="userSkillsValidateForm.selectedDep.state"
     required
    >
     <a-popover
        placement="top"
        :content="userSkillsValidateForm.selectedDep.content"
        :trigger="userSkillsValidateForm.selectedDep.hover"
      >
      <a-select
        v-model="userSkillsSettingForm.selectedDep"
        style="width: 100%"
        :options="depOptions"
        :disabled="isEditing || departDisable"
        @change="onDepSelectChange"
        :filter-option="filterOption"
      >
      </a-select>
      </a-popover>
    </a-form-model-item>
<!-- 科別 -->
    <a-form-model-item :label="$t('global_division')" style="margin-bottom: 0px"
      :has-feedback="userSkillsValidateForm.selectedUnit.feedback"
      :validateStatus="userSkillsValidateForm.selectedUnit.state"
      >
       <a-popover
        placement="top"
        :content="userSkillsValidateForm.selectedUnit.content"
        :trigger="userSkillsValidateForm.selectedUnit.hover"
      >
      <a-select
        v-model="userSkillsSettingForm.selectedUnit"
        style="width: 100%"
        :disabled="isEditing || unitDisable"
        :options="unitOptions"
        @change="onUnitSelectChange"
        :filter-option="filterOption"
      >
      </a-select>
      </a-popover>
    </a-form-model-item>

    <a-form-model-item
      :label="$t('global_telemarketer')"
      prop="userId"
      style="margin-bottom: 0px"
      :has-feedback="userSkillsValidateForm.userId.feedback"
      :validateStatus="userSkillsValidateForm.userId.state"
      required
    >
      <a-popover
        placement="top"
        :content="userSkillsValidateForm.userId.content"
        :trigger="userSkillsValidateForm.userId.hover"
      >
        <a-select
          v-model="userSkillsSettingForm.selectedUserId"
          style="width: 100%"
          refs="selectUser"
          @change="onUserSelectChange"
          :options="unitUserOptions"
          :filter-option="filterOption"
          :disabled="isEditing||userIdDisable"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <a-form-model-item
      :label="$t('global_language')"
      prop="selectedLanguages"
      style="margin-bottom: 0px"
    >
      <a-popover
        placement="top"
        :content="userSkillsValidateForm.selectedLanguages.content"
        :trigger="userSkillsValidateForm.selectedLanguages.hover"
        :destroyTooltipOnHide="true"
        :visible="false"
      > 
        <span @mouseleave="isUserSkillsPopVisible=false" @mousemove="userSkillsMouseOver()">
        <a-checkbox-group
          v-model="userSkillsSettingForm.selectedLanguages"
          :options="userLanguagesOptions"
          :default-value="initialUserSkillsData.languageIds"
          @change="onselectedLangsChanged"
        />
        </span>
      </a-popover>
    </a-form-model-item>
    <!-- //TODO國際化 -->

    <a-form-model-item
      :label="$t('custMark_tag')"
      prop="selectedTags"
      style="margin-bottom: 0px"
      :destroyTooltipOnHide="true"
    >

     <a-popover
        placement="top"
        :content="userSkillsValidateForm.selectedTags.content"
        :trigger="userSkillsValidateForm.selectedTags.hover"
        :visible="false"
      >
      <span @mouseleave="isUserSkillsPopVisible=false" @mousemove="userSkillsMouseOver()">
      <a-checkbox-group
        v-model="userSkillsSettingForm.selectedTags"
        :options="userTagsOptions"
        :default-value="initialUserSkillsData.tagIds"
        @change="onselectedTagsChanged"
    
      />
      </span>
       </a-popover>
    </a-form-model-item>
  </a-form-model>
</template>
<script src="./PolicySkillForm.ts" lang="ts"></script>
