<template>
  <a-form-model
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 19 }"
    :model="infSendTargetSettingForm"
    :rules="infSendTargetSettingFormRules"
  >
    <!-- 案件通路 -->
    <a-form-model-item
      :label="$t('communicatSetting_infSendTarget_caseChannel')"
      style="margin-bottom: 0px"
    >
      {{ infSendTargetSettingForm.infChannels }}
    </a-form-model-item>
    <!-- 部門 -->
    <a-form-model-item
      :label="$t('global_department')"
      style="margin-bottom: 0px"
      required
    >
      <a-select
        v-model="infSendTargetSettingForm.selectedDep"
        style="width: 100%"
        :options="selectDepOptions"
        @change="onSelectDept()"
        :filter-option="filterOption"
        show-search
      >
      </a-select>
    </a-form-model-item>
    <!-- 科別 -->
    <a-form-model-item
      :label="$t('global_division')"
      style="margin-bottom: 0px"
    >
      <a-select
        v-model="infSendTargetSettingForm.selectedUnit"
        style="width: 100%"
        :options="selectUnitOptions"
        @change="onSelectUnit()"
        :filter-option="filterOption"
        show-search
        allowClear="true"
      >
      </a-select>
    </a-form-model-item>

    <!-- 承辦窗口多選-->
    <a-form-model-item
      :label="$t('infCom_targetEmail')"
      style="margin-bottom: 0px"
      required
      prop="empList"
      :has-feedback="infSendTargetSettingValidationForm.empList.feedback"
      :validateStatus="infSendTargetSettingValidationForm.empList.state"
    >
      <a-popover
        placement="top"
        :content="infSendTargetSettingValidationForm.empList.msg"
        :trigger="
          callCommonUtilFeildTrigger(infSendTargetSettingValidationForm.empList)
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.empList
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.empList
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          mode="multiple"
          v-model="infSendTargetSettingForm.empList"
          style="width: 100%"
          @change="onSelectEmp()"
          :options="selectEmpOptions"
          :filter-option="filterOption"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 窗口Email -->
    <a-form-model-item
      :label="$t('visitPersonSetting_contactPersonEmail')"
      style="margin-bottom: 0px"
      required
      prop="contactEmail"
      :has-feedback="infSendTargetSettingValidationForm.contactEmail.feedback"
      :validateStatus="infSendTargetSettingValidationForm.contactEmail.state"
    >
      <a-popover
        placement="top"
        :content="infSendTargetSettingValidationForm.contactEmail.msg"
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.contactEmail
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.contactEmail
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.contactEmail
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infSendTargetSettingForm.contactEmail"
          :auto-size="{ minRows: 3, maxRows: 10 }"
          :maxLength="100"
          @mouseenter="infContactEmailMouseOver"
          @mouseout="infContactEmailVisible = false"
          @change="onContactEmailChange"
        />
      </a-popover>
    </a-form-model-item>

    <!-- 窗口副本 -->
    <a-form-model-item
      :label="$t('visitPersonSetting_carbonCopy')"
      style="margin-bottom: 0px"
      required
      prop="empCopyList"
      :has-feedback="infSendTargetSettingValidationForm.empCopyList.feedback"
      :validateStatus="infSendTargetSettingValidationForm.empCopyList.state"
    >
      <a-popover
        placement="top"
        :content="infSendTargetSettingValidationForm.empCopyList.msg"
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.empCopyList
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.empCopyList
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.empCopyList
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          mode="multiple"
          v-model="infSendTargetSettingForm.empCopyList"
          style="width: 100%"
          @change="onSelectEmpCopy()"
          :options="selectEmpCopyOptions"
          :filter-option="filterOption"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 副本Email -->
    <a-form-model-item
      :label="$t('visitPersonSetting_carbonCopyEmail')"
      style="margin-bottom: 0px"
      required
      prop="carbonCopyEmail"
      :has-feedback="
        infSendTargetSettingValidationForm.carbonCopyEmail.feedback
      "
      :validateStatus="infSendTargetSettingValidationForm.carbonCopyEmail.state"
    >
      <a-popover
        placement="top"
        :content="infSendTargetSettingValidationForm.carbonCopyEmail.msg"
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.carbonCopyEmail
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.carbonCopyEmail
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.carbonCopyEmail
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-textarea
          type="text"
          v-model="infSendTargetSettingForm.carbonCopyEmail"
          :auto-size="{ minRows: 3, maxRows: 10 }"
          :maxLength="100"
          @mouseenter="infCarbonCopyEmailMouseOver"
          @mouseout="infCopyEmailVisible = false"
          @change="onCarbonCopyEmailChange"
        />
      </a-popover>
    </a-form-model-item>

    <!-- email範本 -->
    <a-form-model-item
      :label="$t('email_template')"
      style="margin-bottom: 0px"
      required
      prop="emailTemplateId"
      :has-feedback="infSendTargetSettingValidationForm.emailTemplateId.feedback"
      :validateStatus="infSendTargetSettingValidationForm.emailTemplateId.state"
    >
      <a-popover
        placement="top"
        :content="infSendTargetSettingValidationForm.emailTemplateId.msg"
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.emailTemplateId
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.emailTemplateId
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.emailTemplateId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          label-in-value
          :default-value="{ key: infSendTargetSettingForm.emailTemplateId }"
          style="width: 100%"
          :options="selectEmailTemplateOptions"
          :filter-option="filterOption"
          @change="onSelectedEmailTemplateChange"
        >
        </a-select>
      </a-popover>
      {{ infSendTargetSettingForm.emailTemplateSubject }}
    </a-form-model-item>
  </a-form-model>
</template>
<script src="./infSendMsgSettingEditForm.ts" lang="ts"></script>
