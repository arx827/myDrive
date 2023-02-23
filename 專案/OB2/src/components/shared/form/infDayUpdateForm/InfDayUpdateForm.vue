<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="infDaySettingForm"
  >
    <!-- 會辦類型 -->
    <a-form-model-item      
      :label="$t('infPage_infType')"
      prop="infType"
      style="margin-bottom: 0px"
     
    >
        <p>{{infDaySettingForm.infType}}</p>
    </a-form-model-item>
    <!-- 類型 -->
    <a-form-model-item      
       :label="$t('global_type')"
      prop="type"
      style="margin-bottom: 0px"
     
    >
        <p>{{infDaySettingForm.type}}</p>
    </a-form-model-item>
    <!-- 設定工作天數 -->
    <a-form-model-item
      label="設定工作天數"
      prop="workingDay"
      style="margin-bottom: 0px"
        :has-feedback="
        infDayValidationForm.workingDay.feedback
      "
         :validateStatus="
       infDayValidationForm.workingDay.state
      "
       required
    > 

     <a-popover
        placement="top"
        :trigger="infDayValidationForm.workingDay.hover"
        :content="infDayValidationForm.workingDay.content"
        :visible="isInfDayWorkingVisible"
        :destroyTooltipOnHide="true"
      >
      <a-input-number
            
            :min="1"
            :max="20"
            v-model="infDaySettingForm.workingDay"
          @mouseenter="infDayWorkingDayMouseOver"
          @mouseout=" isInfDayWorkingVisible = false"
          @change="onWorkingDayChange"
          />

        </a-popover>
        
    </a-form-model-item>
    <!-- 備註說明 -->
    <a-form-model-item
      label="備註說明"
      style="margin-bottom: 0px"
      prop="remark"
      :has-feedback="
        infDayValidationForm.remark.feedback
      "
         :validateStatus="
       infDayValidationForm.remark.state
      "
       required
    >
     <a-popover
        placement="top"
        :trigger="infDayValidationForm.remark.hover"
        :content="infDayValidationForm.remark.content"
        :visible="isInfDayRemarkVisible"
        :destroyTooltipOnHide="true"
      >
     <a-textarea
          type="text"
          v-model="infDaySettingForm.remark"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          @mouseenter="infDayRemarkMouseOver"
          @mouseout="isInfDayRemarkVisible = false"
          @change="onRemarkChange"
          
          :maxLength="100"  
        />
        </a-popover>
    </a-form-model-item>
  </a-form-model>
  <!-- </a-spin> -->
</template>
<script src="./InfDayUpdateForm.ts" lang="ts"></script>
<style scoped>
::v-deep
.ant-form-explain{
  display: none;
}
</style>