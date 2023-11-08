<template>
  <div>
    <a-form-model
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      :model="eventUpdateForm"
    >
      <a-row :gutter="24" justify="center" type="flex">
        <a-col :span="15">
          <!-- 日期 -->
          <a-form-model-item
            :label="$t('global_date')"
            style="margin-bottom: 0px"
            prop="eventDate"
          >
            <label>{{ eventUpdateForm.eventDate }}</label>
          </a-form-model-item>
          <!-- 電訪員 -->
          <a-form-model-item
            :label="$t('global_telemarketer')"
            style="margin-bottom: 0px"
            prop="user"
          >
            <label>{{ eventUpdateForm.user }}</label>
          </a-form-model-item>
          <!-- 班別 -->
          <a-form-model-item
            :label="$t('global_shiftWork')"
            style="margin-bottom: 0px"
            prop="shiftWork"
          >
            <label>{{ eventUpdateForm.shiftWork }}</label>
          </a-form-model-item>
          <!-- 異動後班別 -->
          <a-form-model-item
            :label="$t('eventS_modifiedShiftWork')"
            style="margin-bottom: 0px"
            prop="updateShiftWork"
            v-if="isShiftWrokModifyVisible"
          >
            <!-- 請選擇 -->
            <a-select mode="tags" :placeholder="$t('global_select')" style="width: 160px">
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
        </a-col>
      </a-row>
      <a-row :gutter="24" justify="center" type="flex">
        <a-col :span="15">
          <!-- 異動人員 -->
          <a-form-model-item
            :label="$t('global_changeStaff')"
            style="margin-bottom: 0px"
            prop="updateName"
          >
            <label>{{ eventUpdateForm.updateName }}</label>
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
          <!-- 異動時間 -->
          <a-form-model-item
            :label="$t('global_changeTime')"
            style="margin-bottom: 0px"
            prop="updateDate"
          >
            <label>{{ eventUpdateForm.updateDate }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
      <p></p>
      <EventsTableForm
        :form="eventUpdateForm"
        @changeEditState="changeEditState"
        ref="eventsTableForm"
        @reloadData="reloadParent"
        :editAuth="editAuth">
        </EventsTableForm>
    </a-form-model>
    
  </div>
</template>
<script src="./EventUpdateForm.ts" lang="ts"></script>