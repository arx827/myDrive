<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="taskSettingForm"
    ref="taskSettingForm"
    ><div @mouseleave="isEffectiveDateVisible = false">
      
      <a-form-model-item
        :label="$t('global_department')"
        style="margin-bottom: 0px"
        prop="depId"
        :has-feedback="userTaskValidateForm.depId.feedback"
        :validateStatus="userTaskValidateForm.depId.state"
        required
      >
        <a-popover
          placement="top"
          :content="userTaskValidateForm.depId.content"
          :trigger="userTaskValidateForm.depId.hover"
        >
          <a-select
            v-model="taskSettingForm.selectedDep"
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
      <a-form-model-item
        :label="$t('global_division')"
        style="margin-bottom: 0px"
        :has-feedback="userTaskValidateForm.unitId.feedback"
        :validateStatus="userTaskValidateForm.unitId.state"
      >
        <a-popover
          placement="top"
          :content="userTaskValidateForm.unitId.content"
          :trigger="userTaskValidateForm.unitId.hover"
        >
          <a-select
            v-model="taskSettingForm.selectedUnit"
            style="width: 100%"
            :disabled="isEditing || unitDisable"
            :options="unitOptions"
            @change="onUnitSelectChange"
            :filter-option="filterOption"
          >
          </a-select>
        </a-popover>
      </a-form-model-item>
      <!-- 電訪員 -->
      <a-form-model-item
        :label="$t('global_telemarketer')"
        prop="userId"
        style="margin-bottom: 0px"
        :has-feedback="userTaskValidateForm.userId.feedback"
        :validateStatus="userTaskValidateForm.userId.state"
        required
      >
        <a-popover
          placement="top"
          :content="userTaskValidateForm.userId.content"
          :trigger="userTaskValidateForm.userId.hover"
        >
          <a-select
            v-model="taskSettingForm.userId"
            style="width: 100%"
            refs="selectUser"
            @change="onUserSelectChange"
            :options="unitUserOptions"
            :filter-option="filterOption"
            :disabled="isEditing || userIdDisable"
          >
          </a-select>
        </a-popover>
      </a-form-model-item>
      <!-- 電訪項目 -->
      <a-form-model-item
        :label="$t('userTask')"
        prop="taskId"
        style="margin-bottom: 0px"
        :has-feedback="userTaskValidateForm.taskId.feedback"
        :validateStatus="userTaskValidateForm.taskId.state"
        required
      >
        <a-popover
          placement="top"
          :content="userTaskValidateForm.taskId.content"
          :trigger="userTaskValidateForm.taskId.hover"
        >
          <a-select
            v-model="taskSettingForm.selectedTask"
            style="width: 100%"
            refs="selectedTask"
            :options="userTasksOptions"
            :filter-option="filterOption"
            @change="onUserTaskChange()"
            :defaultValue="taskSettingForm.selectedTask"
            :defaultActiveFirstOption="true"
          >
          </a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item
        :label="$t('userTask_skillGetDate')"
        prop="skillGetDate"
        style="margin-bottom: 0px"
        :has-feedback="userTaskValidateForm.skillGetDate.feedback"
        :validateStatus="userTaskValidateForm.skillGetDate.state"
        required
      >
        <a-popover
          placement="top"
          :content="userTaskValidateForm.skillGetDate.content"
          :trigger="userTaskValidateForm.skillGetDate.trigger"
          :visible="isSkillGetDateVisible"
          :destroyTooltipOnHide="true"
        >
          <date-picker
            :formatter="formatter"
            @change="onSkillgetDateChange"
            v-model="globalskillGetDate"
            :range="false"
            style="width: 100%"
            :clearable="false"
          >
            <a-input
              slot="input"
              @mouseover="skillGetDateMouseOver"
              @mouseleave="isSkillGetDateVisible = false"
              :value="taskSettingForm.skillGetDate"
            ></a-input>
            <i
              v-if="userTaskValidateForm.skillGetDate.feedback"
              slot="icon-calendar"
            ></i>
          </date-picker>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item
        :label="$t('userTask_skillEffectiveDate')"
        style="margin-bottom: 0px"
        prop="effectiveDate"
        :has-feedback="userTaskValidateForm.effectiveDate.feedback"
        :validateStatus="userTaskValidateForm.effectiveDate.state"
        required
      >
        <a-popover
          placement="top"
          :content="userTaskValidateForm.effectiveDate.content"
          :trigger="userTaskValidateForm.effectiveDate.trigger"
          :visible="isEffectiveDateVisible"
          :destroyTooltipOnHide="true"
        >
          <date-picker
            :formatter="formatter"
            @change="onEffectiveDateChange"
            v-model="globaleffectiveDate"
            :range="false"
            style="width: 100%"
            :clearable="false"
          >
            <a-input
              slot="input"
              :value="taskSettingForm.effectiveDate"
              @mouseover="effectiveMouseOver"
              @mouseleave="isEffectiveDateVisible = false"
            ></a-input>
            <i
              v-if="userTaskValidateForm.effectiveDate.feedback"
              slot="icon-calendar"
            ></i>
          </date-picker>
        </a-popover>
      </a-form-model-item>
    </div>
  </a-form-model>
</template>
<script src="./UserTaskSettingForm.ts" lang="ts"></script>
