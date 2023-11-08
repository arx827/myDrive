<template>
  <div>
    <a-spin :spinning="isLoading">
      <a-row type="flex" align="bottom">
        <a-col span="12" align="center">
          <FblDataGrid
            :themeColor="'theme2'"
            :row-key="inumDtoListGrid.rowKey"
            :columns="inumDtoListGrid.columns"
            :data="inumDtoListGrid.data"
          >
            <template v-slot:inumTemp="slotProps">
              <div v-if="slotProps.data.inum">
                <a @click="openInumRecordUrl(slotProps.data)">{{
                  slotProps.data.inum
                }}</a>
              </div>
              <div v-else-if="slotProps.data.eduid && slotProps.data.recordUrl">
                <a @click="openEduidRecordUrl(slotProps.data)">{{
                  slotProps.data.eduid
                }}</a>
              </div>
            </template>
          </FblDataGrid>
        </a-col>
        <a-col span="12" align="center">
          <audio
            height="100%"
            type="audio/wav"
            controls
            controlsList="nodownload"
            oncontextmenu="return false;"
            v-if="showRecordPlayer"
          >
            <source :src="recordPlayUrl" />
          </audio>
        </a-col>
      </a-row>
    </a-spin>
    <!-- <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showRecordPlayer"
      :title="'錄音檔撥放'"
      width="400px"
      height="50px"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      @cancel="showRecordPlayer = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <video
        width="323"
        height="200"
        controls
        autoplay
        controlsList="nodownload"
        oncontextmenu="return false;"
      >
        <source :src="recordPlayUrl" />
      </video>
      <template slot="footer">
        <a-button type="primary" @click="showRecordPlayer = !showRecordPlayer">
          {{ $t('onDutyPage_close') }}
        </a-button>
      </template>
    </DragModal> -->
  </div>
</template>

<script src="./RecordPlayList.ts" lang="ts"></script>

<!-- <style lang= "less" scoped>
/* video {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
} */
</style> -->