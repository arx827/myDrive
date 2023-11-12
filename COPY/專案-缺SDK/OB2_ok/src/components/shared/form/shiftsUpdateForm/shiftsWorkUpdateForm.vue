<template>
  <div>
    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
      :model="shiftsDataForm"
    >
      <a-row :gutter="24" justify="center" type="flex">
        <a-col :span="12">
          <!-- 日期 -->
          <a-form-model-item
            :label="$t('global_date')"
            style="margin-bottom: 0px"
            prop="eventDate"
          >
            <label>{{ shifitUpdateForm.eventDate }}</label>
          </a-form-model-item>
          <!-- 人員 -->
          <a-form-model-item
            :label="$t('global_staff')"
            style="margin-bottom: 0px"
            prop="user"
          >
            <label>{{ shifitUpdateForm.user }}</label>
          </a-form-model-item>
          <!-- 班別 -->
          <a-form-model-item
            :label="$t('global_shiftWork')"
            style="margin-bottom: 0px"
            prop="shiftWork"
          >
            <label>{{showOriginalShiftWork }}</label>
          </a-form-model-item>
          <!-- 異動後班別 -->
          <a-form-item 
            :label="$t('eventS_modifiedShiftWork')" 
            :has-feedback="updateShiftWorkFeedback"
            :validateStatus="stateUpdateShiftWork"
          >
            <a-popover 
              placement="top" 
              :content="updateShiftWorkMsg" 
              :trigger="updateShiftWorkHover"
            >
              <a-select
                :options="shiftWorkCodeOptions"
                :disabled="overDate"
                v-model="shifitUpdateForm.modifiedShiftWorkCode"
                @change="onSelectShfitCodeChange"
              ></a-select>
              </a-popover>
          </a-form-item>
          <!-- 備註 --> <!-- VL903-318 班表設定不需要備註-->
          <!-- <a-form-item :label="$t('global_remark')">
            <a-input
              type="textarea"
              v-model="shifitUpdateForm.remark"
              :disabled="overDate"
              :auto-size="{ minRows: 4, maxRows: 4 }"
              :maxLength="100"
            ></a-input>
          </a-form-item> -->
        </a-col>

        <a-col :span="12">
          <!-- 異動人員 -->
          <a-form-model-item
            :label="$t('global_changeStaff')"
            style="margin-bottom: 0px"
            prop="updateName"
          >
            <label>{{ shifitUpdateForm.updateName }}</label>
          </a-form-model-item>
          <!-- 異動時間 -->
          <a-form-model-item
            :label="$t('global_changeTime')"
            style="margin-bottom: 0px"
            prop="updateDate"
          >
            <label>{{ shifitUpdateForm.updateDate }}</label>
          </a-form-model-item>
          <!-- 提示 選擇空值表示刪除班別 -->
          <a-form-model-item 
            v-if="isShowNoticeSelectedEmptyShift"
            style="margin-bottom: 0px; padding-top:40px; margin-left:-60px">
            <label style="color:red;">{{ $t('shiftS_notice_selected_empty_shift') }}</label> <!-- 選擇空值表示刪除班別 -->
          </a-form-model-item>
        </a-col>
      </a-row>
      <p></p>
      <a-card v-if="isShowEventData">
        <a-button v-if="isAddEventBtnShow" type="primary" @click="addEventDetail" :disabled="overDate">
          <!-- 新增 -->
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
        <p></p>
        <FblDataGrid
          :rowClassName="rowClassName"
          v-if="fblDataGridShow"
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          align="center"
          size="middle"
          bordered
          @actionClick="onEventTableActionClick($event)"
          ref="eventUpdateDataGrid"
        >
        </FblDataGrid>
      </a-card>
    </a-form-model>
    <!-- 取消 確定 -->
    <a-modal
      v-model="eventModifyFormVisible"
      :title="titleText"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      @ok="onModifyFormSubmit($event)"
      @cancel="onModifyFormCalcel()"
      width="500px"
      :closable="false"
      :maskClosable="false"
    >
      <EventModifyForm
        ref="eventModifyForm"
        :initData="eventModifyForm"
        @reloadData="reload"
        @modifyValue="modifyValue"
      >
      </EventModifyForm>
    </a-modal>

    <!-- 系統已刪除班別及相關事件 -->
    <a-modal
      v-model="isShowDeletedEventsModal"
      :title="$t('shiftS_title_sysAutoDeleteShiftAndEvents')"
      width="500px"
      :closable="false"
      :maskClosable="false">
      
      <a-form-model
      :label-col="{ span: 8}"
      :wrapper-col="{ span: 12 }"
      v-model="deleteShiftWorkInfo"
      >
        <a-row class="row-style">
          <a-col :span="12">
            <a-form-model-item
              :label="$t('global_date')"
              style="margin-bottom: 0px"
              >
              <label> {{ deleteShiftWorkInfo.workDate }} </label>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :label="$t('global_staff')"
              style="margin-bottom: 0px"
              >
              <label> {{ deleteShiftWorkInfo.user }} </label>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row class="row-style">
          <a-col :span="12">
              <a-form-model-item
                :label="$t('global_shiftWork')"
                style="margin-bottom: 0px"
                >
                <label> {{ deleteShiftWorkInfo.shiftWork }} </label>
              </a-form-model-item>
          </a-col>
        </a-row>
          
      </a-form-model>
      
      <FblDataGrid
        :rowKey="deletedGrid.rowKey"
        :columns="deletedGrid.columns"
        :data="deletedGrid.data"
        :pagination="false"
        align="center"
        size="middle"
        bordered
      >
      </FblDataGrid>
      <template slot="footer">
          <a-button key="ok" type="primary" @click="closeDeletedEventModal">{{ $t('global_confirm') }}</a-button>
      </template>
    </a-modal>


  </div>
</template>
<script src="./shiftsWorkUpdateForm.ts" lang="ts"></script>
<style>
/* 事件時間與異動後班別衝突顯示紅色 */
.red{
  color: red; 
}
</style>