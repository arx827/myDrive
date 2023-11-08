<template>
  <div>
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 10 }"
      :model="eventInsertForm"
      :rules="changeRules"
    >
      <!-- 科別 -->
      <a-form-model-item
        :label="$t('global_division')"
        prop="unitId"
        style="margin-bottom: 0px"
        :has-feedback="unitIdFeedback"
        :validateStatus="stateUnitId"
        required
      >
        <a-popover placement="top" :content="unitIdMsg" :trigger="unitIdHover">
          <a-select
            @change="onSeletDivi"
            v-model="eventInsertForm.selectUnitIdOptions"
            :options="selectDiviOptions"
            :filter-option="filterOption"
            show-search
          >
          </a-select>
        </a-popover>
      </a-form-model-item>
      <!-- 姓名 -->
      <a-form-model-item
        :label="$t('global_humanName')"
        prop="userName"
        style="margin-bottom: 0px"
        :has-feedback="userFeedback"
        :validateStatus="stateUser"
        required
      >
        <a-popover placement="top" :content="userMsg" :trigger="userHover">
          <a-select
            :disabled="isNameDisable"
            v-model="eventInsertForm.selectUserNameOptions"
            :options="selectTmrOptions"
            :filter-option="filterOption"
            show-search
          >
          </a-select>
        </a-popover>
      </a-form-model-item>
      <!-- 事件類別 -->
      <a-form-model-item
        :label="$t('eventS_eventType')"
        prop="eventName"
        style="margin-bottom: 0px"
      >
        <a-input
          type="text"
          v-model="eventInsertForm.eventName"
          :disabled="true"
        />
      </a-form-model-item>
      <!-- 日期 -->
      <a-form-model-item
        :label="$t('global_date')"
        prop="eventDate"
        style="margin-bottom: 0px"
        :has-feedback="eventDateFeedback"
        :validateStatus="stateEventDate"
        required
      >
        <a-popover
          placement="top"
          :content="eventDateMsg"
          :trigger="eventDateHover"
          :visible="isDateVisible"
          :destroyTooltipOnHide="true"
        >
          <DatePicker
            style="width: 200px"
            :formatter="formatter"
            @change="onDateChange"
            :disabled-date="disabledDate"
            v-model="eventInsertForm.eventDate"
            :clearable="!eventDateFeedback"
          >
            <a-input
              slot="input"
              @pressEnter="checkManualInputDate"
              @mouseover="eventMouseOver"
              @mouseleave="isDateVisible = false"
              :value="eventInsertForm.eventDateString"
            ></a-input>
            <i v-if="eventDateFeedback" slot="icon-calendar"></i>
          </DatePicker>
        </a-popover>
      </a-form-model-item>
      <!-- 時間(起) -->
      <a-form-model-item
        :label="$t('global_timeStart')"
        style="margin-bottom: 0px"
        prop="startTime"
        :has-feedback="startTimeFeedback"
        :validateStatus="stateStartTime"
        required
      >
        <a-popover
          placement="top"
          :content="startTimeMsg"
          :trigger="startTimeHover"
        >
          <TimePicker
            :open="isTimePickerStartOpen"
            @openChange="clickStartTimePicker"
            style="width: 200px"
            v-model="eventInsertForm.startTimeMoment"
            placeholder=""
            @change="onStartTimeChange"
            :minute-step="15"
            format="HH:mm"
            :allowClear="!startTimeFeedback"
          >
            <a-button slot="addon" size="small" type="primary" @click="closeStartTimePicker"> {{$t('global_ok')}} </a-button>
          </TimePicker>
        </a-popover>
      </a-form-model-item>
      <!-- 時間(訖) -->
      <a-form-model-item
        :label="$t('global_timeEnd')"
        style="margin-bottom: 0px"
        prop="endTime"
        :has-feedback="endTimeFeedback"
        :validateStatus="stateEndTime"
        required
      >
        <a-popover
          placement="top"
          :content="endTimeMsg"
          :trigger="endTimeHover"
        >
          <TimePicker
            :open="isTimePickerEndOpen"
            @openChange="clickEndTimePicker"
            style="width: 200px"
            v-model="eventInsertForm.endTimeMoment"
            placeholder=""
            @change="onEndTimeChange"
            :minute-step="15"
            format="HH:mm"
            :allowClear="!endTimeFeedback"
          >
            <a-button slot="addon" size="small" type="primary" @click="closeEndTimePicker"> {{$t('global_ok')}} </a-button>
          </TimePicker>
        </a-popover>
      </a-form-model-item>
      <!-- 備註 -->
      <a-form-model-item :label="$t('global_remark')" style="margin-bottom: 0px">
        <a-textarea
          v-model="eventInsertForm.remark"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="100"
        />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script src="./EventInsertForm.ts" lang="ts"></script>