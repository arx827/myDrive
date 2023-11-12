<template>
    <div>
        <a-form-model
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 12 }"
            :model="eventModifyForm"
            :rules="changeRules"
        >
            <!-- 日期 -->
            <a-form-model-item
                :label="$t('global_date')"
                prop="dateString"
                style="margin-bottom: 0px"
            >
                <a-input type="text" v-model="eventModifyForm.dateString" :disabled="true" />
            </a-form-model-item>
            <!-- 電訪員 -->
            <a-form-model-item
                :label="$t('global_telemarketer')"
                prop="user"
                style="margin-bottom: 0px"
            >
                <a-input type="text" v-model="eventModifyForm.user" :disabled="true" />
            </a-form-model-item>
            <!-- 班別 -->
            <a-form-model-item
                :label="$t('global_shiftWork')"
                prop="shiftWork"
                style="margin-bottom: 0px"
            >
                <a-input type="text" v-model="eventModifyForm.shiftWork" :disabled="true" />
            </a-form-model-item>
            <!-- 事件類型 -->
            <a-form-model-item
                :label="$t('eventS_eventType')"
                prop="eventCode"
                style="margin-bottom: 0px"
                :has-feedback="eventCodeFeedback"
                :validateStatus="stateEventCode"
                required
            >
                <a-popover 
                    placement="top" 
                    :content="eventCodeMsg" 
                    :trigger="eventCodeHover"
                >
                    <a-select
                        :options="selectEventCodeOptions"
                        v-model="eventModifyForm.eventCode"
                    >
                    </a-select>
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
                        style="width: 235px" 
                        v-model="eventModifyForm.startTimeDate" 
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
                        style="width: 235px" 
                        v-model="eventModifyForm.endTimeDate" 
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
            <a-form-model-item
                :label="$t('global_remark')"
                style="margin-bottom: 0px"
            >
                <a-textarea
                    v-model="eventModifyForm.remark"
                    :auto-size="{ minRows: 4, maxRows: 4 }"
                    :maxLength="100"
                />
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script src="./EventModifyForm.ts" lang="ts"></script>