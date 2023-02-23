<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="userAgentChangeForm"
  >
    <a-form-model-item :label="$t('global_user')" style="margin-bottom: 0px">
      <label v-if="userAgentChangeForm.unit">{{
        `${userAgentChangeForm.unit.unitName.replace(" ", " - ")} - ${
          userAgentChangeForm.name
        }`
      }}</label>
      <label v-else>{{ userAgentChangeForm.name }}</label>
    </a-form-model-item>
    <a-form-model-item
      :label="$t('agentF_agentDepartment')"
      style="margin-bottom: 0px"
      prop="agentDeptId"
      :has-feedback="validate.agentDept.feedback"
      :validateStatus="validate.agentDept.state"
    >
      <a-popover
        placement="top"
        :content="validate.agentDept.msg"
        :trigger="validate.agentDept.hover"
      >
        <a-select
          v-model="agentEditForm.agentDeptId"
          :options="selectAgentDeptOptions"
          @change="onAgentDeptSelect"
          @blur="onAgentDeptSelect"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <a-form-model-item
      :label="$t('agentF_agentDivision')"
      style="margin-bottom: 0px"
      prop="agentDiviId"
      :has-feedback="validate.agentDivi.feedback"
      :validateStatus="validate.agentDivi.state"
    >
      <a-popover
        placement="top"
        :content="validate.agentDivi.msg"
        :trigger="validate.agentDivi.hover"
      >
        <a-select
          v-model="agentEditForm.agentDiviId"
          :options="selectAgentDiviOptionsOnSelect"
          @change="onAgentDiviSelect"
          @blur="onAgentDiviSelect"
          :disabled="selectAgentDiviOptionsOnSelect.length <= 0"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <a-form-model-item
      :label="$t('global_agent')"
      style="margin-bottom: 0px"
      prop="agentId"
      :has-feedback="validate.agentId.feedback"
      :validateStatus="validate.agentId.state"
    >
      <a-popover
        placement="top"
        :content="validate.agentId.msg"
        :trigger="validate.agentId.hover"
      >
        <a-select
          v-model="agentEditForm.agentId"
          :options="selectAgentOptions"
          @change="onAgentIdSelect"
          @blur="onAgentIdSelect"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <a-form-model-item
      :label="$t('global_changeStaff')"
      style="margin-bottom: 0px"
    >
      <label>{{ userAgentChangeForm.updateName }}</label>
    </a-form-model-item>
    <a-form-model-item
      :label="$t('global_changeTime')"
      style="margin-bottom: 0px"
    >
      <label>{{ userAgentChangeForm.updateDate }}</label>
    </a-form-model-item>
  </a-form-model>
</template>
<script src="./AgentForm.ts" lang="ts"></script>