<template>
  <div>
      <a-card>
        <a-button type="primary" @click="addEventDetail" v-if="editAuth" :disabled="!editAuth">
          <!-- 新增 -->
          <a-icon type="plus" />{{ $t("global_add") }} 
        </a-button>
        <p></p>
        <FblDataGrid
            :rowClassName="rowClassName"
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
    
    <a-modal
      v-model="eventModifyFormVisible"
      :title="titleText"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      @ok="onModifyFormSubmit($event)"
      @cancel="onModifyFormCalcel()"
    >
      <EventModifyForm
        ref="eventModifyForm"
        :initData="eventModifyForm"
        @reloadData="reload"
        @modifyValue="modifyValue"
      >
      </EventModifyForm>
    </a-modal>
  </div>
</template>
<script src="./EventsTableForm.ts" lang="ts"></script>
<style>
/* 事件時間與異動後班別衝突顯示紅色 */
.red{
  color: red; 
}
</style>