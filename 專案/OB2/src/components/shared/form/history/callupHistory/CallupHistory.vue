<template>
  <div>
    <a-spin :spinning="loading">
    <div class="result__table">
      <FblDataGrid
        :themeColor="'theme2'"
        :scroll="{ x: 1300, y: 300 }"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        @tableChange="onPageChange($event)"
      >
        <!-- 點錄音檔播放 -->
        <template v-slot:alink_eduId_Template="slotProps">
          <!-- <a-spin :spinning="playButtonLoading[slotProps.data.rowCountId]"> -->
          <div>
          <a-button 
            class="recordIcon"
            icon="caret-right" 
            :loading="playButtonLoading[slotProps.data.rowCountId]"
            shape="circle"
            v-if="slotProps.data.codingNo && authComponent.CALLUP_HISTORY_RECORD_FILE.show" 
            @click="clickLinkShowRecordPlayList(slotProps.data)" 
          >
          </a-button>
          </div>
          <!-- </a-spin> -->
        </template>
      </FblDataGrid>

      <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showRecordPlayList"
      :title="$t('serveConHis_recordPlayDetail') + callSys"
      width="45%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      @cancel="showRecordPlayList = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <RecordPlayList ref="recordPlayList" :loading="loading" :inumDtoList="inumDtoList" :caseCallUpHistoryDto="caseCallUpHistoryDto"/>
      <template slot="footer">
        <a-button
          type="primary"
          @click="showRecordPlayList = !showRecordPlayList"
        >
          {{ $t('onDutyPage_close') }}
        </a-button>
      </template>
    </DragModal>
    </div>
    </a-spin>
  </div>
</template>

<script src="./CallupHistory.ts" lang="ts"></script>
<style lang="less" scoped>
/deep/ .recordIcon{
width: 28px;
height: 28px;
min-width: auto
}
</style>