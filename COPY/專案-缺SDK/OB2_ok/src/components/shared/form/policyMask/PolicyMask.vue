<template>
  <div>
    <a-form-model
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 10 }"
      :model="policyMaskForm"
      :rules="policyMaskFormRules"
      class="policyMaskForm"
    >
      <a-row>
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :scroll="grid.scroll"
          size="middle"
          style="padding-left: 24px; padding-right: 12px"
          ref="casePolicyList"
          @handleEllipsisClick="handleEllipsisClick"
          @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
        <!-- 電訪期限 -->
          <template v-slot:rocDateTimeTemp="slotProps">
            <span v-html="slotProps.data.rocDateTime"></span>
          </template>
        </FblDataGrid>
      </a-row>
      <a-row v-if="policyMaskForm.isReboot">
        <!-- 案件重啟 -->
        <a-form-model-item
          :label="$t('pedding_case_reboot')"
          prop=""
          class="isReboot"
          style="margin-bottom: 0px"
        >
          <a-checkbox v-model="policyMaskForm.isReboot" :disabled="policyMaskForm.isReboot"></a-checkbox>
        </a-form-model-item>
      </a-row>
      <a-row :gutter="24" v-if="authComponent.PENDING_MARK_TMR.show">
        <a-col :span="9">
          <!-- 指定電訪員 -->
          <a-form-model-item
            :label="$t('pedding_specifyTmr')"
            prop="departmentId"
            style="margin-bottom: 0px"
            class="departmentId"
            :has-feedback="policyMaskValidateForm.departmentId.feedback"
            :validateStatus="policyMaskValidateForm.departmentId.state"
          >
            <a-popover
              placement="top"
              :content="policyMaskValidateForm.departmentId.msg"
              :trigger="policyMaskValidateForm.departmentId.hover"
            >
              <a-select
                v-model="policyMaskForm.departmentId"
                :options="selectDeptOptions"
                @change="onSelectDept"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="5">
          <!-- 科別 -->
          <a-form-model-item
            :label="$t('global_division')"
            prop="divisionId"
            style="margin-bottom: 0px"
            class="divisionId"
            :has-feedback="policyMaskValidateForm.divisionId.feedback"
            :validateStatus="policyMaskValidateForm.divisionId.state"
          >
            <a-popover
              placement="top"
              :content="policyMaskValidateForm.divisionId.msg"
              :trigger="policyMaskValidateForm.divisionId.hover"
            >
              <!-- 請選擇 -->
              <a-select
                v-model="policyMaskForm.divisionId"
                :options="selectDiviOptions"
                @change="onSeletDivi"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="5">
          <!-- 電訪員 -->
          <a-form-model-item
            :label="$t('global_telemarketer')"
            style="margin-bottom: 0px"
            prop="tmrId"
            class="tmrId"
            :has-feedback="policyMaskValidateForm.tmrId.feedback"
            :validateStatus="policyMaskValidateForm.tmrId.state"
          >
            <a-popover
              placement="top"
              :content="policyMaskValidateForm.tmrId.msg"
              :trigger="policyMaskValidateForm.tmrId.hover"
            >
              <!-- 請選擇 -->
              <a-select
                v-model="policyMaskForm.tmrId"
                :filter-option="filterOption"
                :options="selectTmrOptions"
                @change="onSelectTmr"
              ></a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- 調整案件等級 -->
        <a-form-model-item
          :label="$t('pedding_change_caseLevel')"
          prop="caseLevelId"
          style="margin-bottom: 0px"
          class="caseLevelId"
          :has-feedback="policyMaskValidateForm.caseLevelId.feedback"
          :validateStatus="policyMaskValidateForm.caseLevelId.state"
        >
          <a-popover
            placement="top"
            :content="policyMaskValidateForm.caseLevelId.msg"
            :trigger="policyMaskValidateForm.caseLevelId.hover"
          >
            <a-select
              v-model="policyMaskForm.caseLevelId"
              :filter-option="filterOption"
              :options="selectLevelOptions"
              @change="onLevelChange"
              :disabled="isLevelDisable"
            ></a-select>
          </a-popover>
        </a-form-model-item>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="9">
          <!-- 設定方便連絡時段 -->
          <a-form-model-item
            :label="$t('pedding_set_visitContactTime')"
            prop="contactDate"
            class="contactDate"
            style="margin-bottom: 0px"
            :has-feedback="policyMaskValidateForm.contactDate.feedback"
            :validateStatus="policyMaskValidateForm.contactDate.state"
          >
            <a-popover
              placement="top"
              :content="policyMaskValidateForm.contactDate.msg"
              :trigger="policyMaskValidateForm.contactDate.hover"
              :visible="isContactDateVisible"
              :destroyTooltipOnHide="true"
            >
              <DatePicker
                :formatter="formatter"
                @change="onContactDateChange"
                v-model="policyMaskForm.contactDate"
                :disabled-date="disabledDate"
                @clear="clearContactDate"
                :clearable="true"
                style="width: 100%"
                :disabled="isContactTimeDisable"
                v-if="!isContactTimeDisable"
              >
                <a-input
                  slot="input"
                  @pressEnter="checkManualInputContactDate"
                  :value="policyMaskForm.contactString"
                  @mouseover="eventMouseOverContactDate"
                  @mouseleave="isContactDateVisible = false"
                  :disabled="isContactTimeDisable"
                  v-if="!isContactTimeDisable"
                ></a-input>
                <i
                  v-if="policyMaskValidateForm.contactDate.feedback"
                  slot="icon-calendar"
                ></i>
              </DatePicker>
            </a-popover>
            <a-input
              @pressEnter="checkManualInputContactDate"
              :value="policyMaskForm.contactString"
              @mouseover="eventMouseOverContactDate"
              @mouseleave="isContactDateVisible = false"
              :disabled="isContactTimeDisable"
              v-if="isContactTimeDisable"
            >
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <!-- 此處label不會顯示出來 -->
          <a-form-model-item
            :label="$t('pedding_contactTime')"
            class="policyMarkTime"
            style="margin-bottom: 0px"
            prop="convenientContactStartTime"
            :has-feedback="
              policyMaskValidateForm.convenientContactStartTime.feedback
            "
            :validateStatus="
              policyMaskValidateForm.convenientContactStartTime.state
            "
            v-if="isTimePickerShow"
          >
            <a-popover
              placement="top"
              :content="policyMaskValidateForm.convenientContactStartTime.msg"
              :trigger="policyMaskValidateForm.convenientContactStartTime.hover"
            >
              <TimePicker
                :open="isConvenientContactStartOpen"
                @openChange="clickConvenientContactStartTimePicker"
                style="width: 100%"
                v-model="policyMaskForm.convenientContactStartTime"
                placeholder=""
                @change="onConvenientContactStartTimeChange"
                :minute-step="5"
                format="HH:mm"
                :allowClear="false"
              >
                <!-- 確定 -->
                <a-button
                  slot="addon"
                  size="small"
                  type="primary"
                  @click="closeConvenientContactStartTimePicker"
                >
                  {{ $t("global_ok") }}
                </a-button>
              </TimePicker>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col v-if="isTimePickerShow" :span="1" style="width: 15px; padding-top: 10px;text-align:center"> ~ </a-col>
        <a-col :span="4">
          <!-- 此處label不會顯示出來 -->
          <a-form-model-item
            :label="$t('pedding_contactTime')"
            class="policyMarkTime"
            style="margin-bottom: 0px"
            prop="convenientContactEndTime"
            :has-feedback="
              policyMaskValidateForm.convenientContactEndTime.feedback
            "
            :validateStatus="
              policyMaskValidateForm.convenientContactEndTime.state
            "
            v-if="isTimePickerShow"
          >
            <a-popover
              placement="top"
              :content="policyMaskValidateForm.convenientContactEndTime.msg"
              :trigger="policyMaskValidateForm.convenientContactEndTime.hover"
            >
              <TimePicker
                :open="isConvenientContactEndOpen"
                @openChange="clickConvenientContactEndTimePicker"
                style="width: 100%"
                v-model="policyMaskForm.convenientContactEndTime"
                placeholder=""
                @change="onConvenientContactEndTimeChange"
                :minute-step="5"
                format="HH:mm"
                :allowClear="false"
              >
                <!-- 確定 -->
                <a-button
                  slot="addon"
                  size="small"
                  type="primary"
                  @click="closeConvenientContactEndTimePicker"
                >
                  {{ $t("global_ok") }}
                </a-button>
              </TimePicker>
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- 案件等級與方便連絡時段須擇一填寫 -->
        <div v-if="policyMaskForm.isReboot" style="margin-left:170px;color:red">
            {{ $t("pedding_level_time_is_empty") }}
        </div>
      </a-row>
      <!-- 案件備註 -->
      <a-form-model-item
        :label="$t('pedding_mark_policyMark')"
        prop="custMark"
        class="textArea"
        style="margin-bottom: 0px"
        :has-feedback="policyMaskValidateForm.custMark.feedback"
        :validateStatus="policyMaskValidateForm.custMark.state"
      >
        <a-popover
          placement="top"
          :content="policyMaskValidateForm.custMark.msg"
          :trigger="policyMaskValidateForm.custMark.hover"
        >
          <a-textarea
            type="text"
            v-model="policyMaskForm.custMark"
            :auto-size="{ minRows: 3, maxRows: 3 }"
            :maxLength="200"
          />
        </a-popover>
        
      </a-form-model-item>
      <a-row>
        <div style="width:767px">
          <UploadFileListForm
            ref="uploadFileListForm"
            :fileListProp="fileList"
            @editSingleFile="editSingleFile"
            @addSingleFile="addSingleFile"
            @deleteSingleFile="deleteSingleFile"
          >
          </UploadFileListForm>    
        </div>
      </a-row>
      <!-- 註記原因 -->
      <a-form-model-item
        :label="$t('pedding_mark_reason')"
        prop="markReason"
        class="textArea"
        style="margin-bottom: 0px"
        required
        :has-feedback="policyMaskValidateForm.markReason.feedback"
        :validateStatus="policyMaskValidateForm.markReason.state"
      >
        <a-popover
          placement="top"
          :content="policyMaskValidateForm.markReason.msg"
          :trigger="policyMaskValidateForm.markReason.hover"
        >       
          <a-textarea
            type="text"
            v-model="policyMaskForm.markReason"
            :auto-size="{ minRows: 2, maxRows: 2 }"
            :maxLength="250"
          />
        </a-popover>
      </a-form-model-item>
      
    </a-form-model>
    
  </div>
</template>
<script src="./PolicyMask.ts" lang="ts"></script>