<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infSendTargetSettingForm"
    ref="infSendTargetSettingForm"
    :rules="infSendTargetSettingFormRules"
  >
    <!-- 第一層 -->
    <a-form-model-item
      :label="$t('visitPersonSetting_firstLevel')"
      style="margin-bottom: 0px"
      prop="selectedInfItemId"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.selectedInfItemId
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.selectedInfItemId
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            infSendTargetSettingValidationForm.selectedInfItemId
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.selectedInfItemId
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.selectedInfItemId
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.selectedInfItemId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          v-model="infSendTargetSettingForm.selectedInfItemId"
          style="width: 100%"
          :options="selectInfItemOptions"
          @change="onSelectInfItem()"
          :filter-option="filterOption"
          
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 第二層 -->
    <a-form-model-item
      :label="$t('second_level_item')"
      style="margin-bottom: 0px"
      prop="selectedInfSettingId"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.selectedInfSettingId
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.selectedInfSettingId
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            infSendTargetSettingValidationForm.selectedInfSettingId
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.selectedInfSettingId
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.selectedInfSettingId
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.selectedInfSettingId
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          v-model="infSendTargetSettingForm.selectedInfSettingId"
          style="width: 100%"
          :options="selectInfSettingOptions"
          :filter-option="filterOption"
        
          @change="onSelectedInfItemIdChange()"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!--會辦 部門 -->
    <a-form-model-item
      :label="$t('infPage_infDep')"
      style="margin-bottom: 0px"
      prop="selectedDep"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.selectedDep
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.selectedDep
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(infSendTargetSettingValidationForm.selectedDep)
        "
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.selectedDep
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.selectedDep
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.selectedDep
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          v-model="infSendTargetSettingForm.selectedDep"
          style="width: 100%"
          :options="selectDepOptions"
          @change="
           initDeptChangeFlag=false;
          onSelectDept()"
          :filter-option="filterOption"
          show-search
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 科別 -->
    <a-form-model-item
      :label="$t('global_division')"
      style="margin-bottom: 0px"
    >
      <a-select
        v-model="infSendTargetSettingForm.selectedUnit"
        style="width: 100%"
        :options="selectDiviOptions"
        @change="onSeletDivi()"
        :filter-option="filterOption"
        show-search
        :allowClear="true"
      >
      </a-select>
    </a-form-model-item>

    <!-- 承辦窗口多選-->
    <a-form-model-item
      :label="$t('infCom_targetEmail')"
      prop="tmrIdList"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.tmrIdList
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(infSendTargetSettingValidationForm.tmrIdList)
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(infSendTargetSettingValidationForm.tmrIdList)
        "
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.tmrIdList
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.tmrIdList
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.tmrIdList
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          mode="multiple"
          v-model="infSendTargetSettingForm.tmrIdList"
          style="width: 100%"
          refs="selectUser"
          @change="onSelectTmr()"
          :options="selectTmrOptions"
          :filter-option="filterOption"
          
        >
        </a-select>
      </a-popover>
    </a-form-model-item>

    <!-- 窗口Email -->
    <a-form-model-item
      :label="$t('visitPersonSetting_contactPersonEmail')"
      prop="contactEmail"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.contactEmail
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.contactEmail
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            infSendTargetSettingValidationForm.contactEmail
          )
        "
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
      prop="tmrIdcopyList"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.tmrIdcopyList
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.tmrIdcopyList
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            infSendTargetSettingValidationForm.tmrIdcopyList
          )
        "
        :trigger="
          callCommonUtilFeildTrigger(
            infSendTargetSettingValidationForm.tmrIdcopyList
          )
        "
        :visible="
          callCommonUtilFeildHoverVisible(
            infSendTargetSettingValidationForm.tmrIdcopyList
          )
        "
        @visibleChange="
          callCommonUtilFeildVisibleChange(
            infSendTargetSettingValidationForm.tmrIdcopyList
          )
        "
        :destroyTooltipOnHide="true"
      >
        <a-select
          mode="multiple"
          v-model="infSendTargetSettingForm.tmrIdcopyList"
          style="width: 100%"
          @change="onSelectTmrCopy()"
          :options="selectTmrOptions"
          :filter-option="filterOption"
          
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 副本Email -->
    <a-form-model-item
      :label="$t('visitPersonSetting_carbonCopyEmail')"
      prop="carbonCopyEmail"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.carbonCopyEmail
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.carbonCopyEmail
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            infSendTargetSettingValidationForm.carbonCopyEmail
          )
        "
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

      <!-- 狀態 -->
    <a-form-model-item
      :label="$t('global_status')"
      style="margin-bottom: 0px"
      prop="status"
      v-if="isEditing"
      required
    >
      <a-select
        v-model="infSendTargetSettingForm.status"
        :options="selectStatusOptions"
        :placeholder="$t('roleSF_pleaseChoose')"
      >
      </a-select>
    </a-form-model-item>

    <!-- email範本 -->
    <a-form-model-item
      label="Email範本"
      prop="emailTemplateId"
      style="margin-bottom: 0px"
      required
      :has-feedback="
        callCommonUtilFeildFeedback(
          infSendTargetSettingValidationForm.emailTemplateId
        )
      "
      :validateStatus="
        callCommonUtilFeildStatus(
          infSendTargetSettingValidationForm.emailTemplateId
        )
      "
    >
      <a-popover
        placement="top"
        :content="
          callCommonUtilFeildMsg(
            infSendTargetSettingValidationForm.emailTemplateId
          )
        "
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
          v-model="infSendTargetSettingForm.emailTemplateId"
          style="width: 100%"
          :options="selectEmailTemplateOptions"
          :filter-option="filterOption"
          @change="onSelectedEmailTemplateChange"
        >
        </a-select>
      </a-popover>

      {{infSendTargetSettingForm.subject}}
    </a-form-model-item>
  
  </a-form-model>
</template>
<script src="./NotiInfSendTargetSettingForm.ts" lang="ts"></script>
