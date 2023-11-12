<template>
  <div>
    <a-spin :spinning="isLoading">
      <div class="result__table">
        <FblDataGrid
          :themeColor="'theme1'"
          :scroll="{ x: 1300, y: 300 }"
          :row-key="serveGrid.rowKey"
          :columns="serveGrid.columns"
          :data="serveGrid.data"
          :pagination="serveGrid.pagination"
          @tableChange="onPageChange($event, 'serveGrid')"
          @linkClick="openHandleList($event)"
          @handleEllipsisClick="handleEllipsisClick"
          @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
          <!-- 通話內容 -->
          <template v-slot:handleTemp="slotProps">
            <i class="odp-icon odp-icon__contact"
              v-if="slotProps.data.Service_SYS_Code=='OBD' 
              && checkEmpty(slotProps.data.Contact_Content)"
              @click="handleTemp(slotProps.data)"
            /> 
            <span class="word_hidden" v-else
              @click="handleEllipsisClick($event, slotProps.data.Contact_Content)"
              @mouseout="handleEllipsisMouseLeave"
            >{{slotProps.data.Contact_Content}}</span>
          </template>
          <!-- 錄音檔案播放 -->
          <template v-slot:codingNoTemp="slotProps">
            <a-button
              style="height: 100%"
              icon="caret-right"
              :loading="playButtonLoading[slotProps.data.rowKey]"
              shape="circle"
              v-if="
                authComponent.SERVE_CONTACT_HIS_REORD_FILE.show &&
                slotProps.data != null &&
                (slotProps.data.codingNo || slotProps.data.eduid)
              "
              @click="handleRecordPlayList(slotProps.data)"
            >
            </a-button>
          </template>
          <!-- 檔案上傳歷程 -->
          <template v-slot:uploadFileExistTemp="slotProps">
            <a
              v-if="slotProps.data != null && slotProps.data.uploadFileExist"
              @click="handleUploadFileHistory(slotProps.data)"
              >Y</a
            >
            <p v-else>N</p>
          </template>
          <!-- MAIL紀錄 -->
          <template v-slot:mailRecordExistTemp="slotProps">
            <a
              v-if="slotProps.data.mailRecordExist"
              @click="handleMailRecord(slotProps.data)"
              >Y</a
            >
            <p v-else>N</p>
          </template>
          <!-- M+/簡訊紀錄 -->
          <template v-slot:mplusMesgExistTemp="slotProps">
            <a
              v-if="slotProps.data.mplusMesgExist"
              @click="handleMPlusMesg(slotProps.data)"
              >Y</a
            >
            <p v-else>N</p>
          </template>
          <!-- 會辦紀錄 -->
          <template v-slot:informExistTemp="slotProps">
            <a
              v-if="slotProps.data.informExist"
              @click="handleInform(slotProps.data)"
              >Y</a
            >
            <p v-else>N</p>
          </template>
          <!-- 郵寄紀錄 -->
          <template v-slot:postRecordExistTemp="slotProps">
            <a
              v-if="slotProps.data.postRecordExist"
              @click="handlePostRecord(slotProps.data)"
              >Y</a
            >
            <p v-else>N</p>
          </template>
          <!-- 照會紀錄 -->
          <template v-slot:countersignatureExistTemp="slotProps">
            <a
              v-if="slotProps.data.countersignatureExist"
              @click="handleCountersignature(slotProps.data)"
              >Y</a
            >
            <p v-else>N</p>
          </template>
          <!-- 通話內容 -->
          <template v-slot:contentTemp="slotProps">
            <a
              v-if="slotProps.data.content == 'Y'"
              @click="handleContent(slotProps.data)"
              >Y</a
            >
            <p v-else-if="slotProps.data.content == 'N'">N</p>
            <p v-else>{{ slotProps.data.content }}</p>
          </template>
          <template v-slot:custNameTemp="slotProps">
            <div
              v-if="
                slotProps.data.custName && slotProps.data.custName.length > 7
              "
            >
              <a-popover :content="slotProps.data.custName">
                <p>{{ slotProps.data.custName.substring(0, 7) }}</p>
              </a-popover>
            </div>
            <div v-else>
              <p>{{ slotProps.data.custName }}</p>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </a-spin>

    <!-- 檔案上傳歷程 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showUploadFileHistory"
      :title="$t('serveConHis_fileUploadHistory')"
      width="45%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      @cancel="showUploadFileHistory = false"
      :removeCancelButton="true"
      :isMasked="false"
    >
      <UploadFileHistroy
        ref="uploadFileHistroy"
        :caseNo="caseNo"
        :caseLogid="caseLogid"
      />
      <template slot="footer">
        <a-button
          type="primary"
          @click="showUploadFileHistory = !showUploadFileHistory"
        >
          {{ $t("onDutyPage_close") }}
        </a-button>
      </template>
    </DragModal>

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
      <RecordPlayList ref="recordPlayList" :loading="loading" :inumDtoList="inumDtoList" :serviceHistorygDto="serviceHistorygDto"/>
      <template slot="footer">
        <a-button
          type="primary"
          @click="showRecordPlayList = !showRecordPlayList"
        >
          {{ $t('onDutyPage_close') }}
        </a-button>
      </template>
    </DragModal>

    <!-- 會辦紀錄 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="infReocrdvisible"
      title="會辦紀錄"
      width="60%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="infReocrdvisible = false"
    >
      <HandleInfoForm 
        :data="handleInfoData"
        @getVisible="getInfReocrdvisible"
      ></HandleInfoForm>
      <!-- <InfRecord :caseNo="caseNo" :caseLogId="caseLogid"> </InfRecord> -->
    </DragModal>

    <!-- 通話內容 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showQuestionAnswerHistory"
      :title="$t('callUpF_callUpRemark')"
      width="60%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @cancel="showQuestionAnswerHistory = false"
      :visibleFooter="false"
    >
      <QuestionAnswer
        @getCount="questionAnswerCount"
        :questionAnswerParam="questionAnswerParam"
      ></QuestionAnswer>
    </DragModal>
    <!-- 處理單號 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="showHandleNoInfo"
      :title="$t('onDutyPage_handleNo')"
      width="65%"
      :okText="$t('onDutyPage_close')"
      :closable="true"
      :isMasked="false"
      :removeCancelButton="true"
      @cancel="showHandleNoInfo = false"
      :visibleFooter="false"
    >
      <HandleInfoForm :data="handleInfoData"></HandleInfoForm>
    </DragModal>

    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="infEmailRecordsVisible"
      :title="$t('email_records')"
      width="80%"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      :footer="null"
      :isMasked="false"
      :destroyOnClose="true"
      :v-once="false"
      :visibleFooter="false"
      @cancel="infEmailRecordsVisible = false"
    >
      <MailRecord
        :caseNo="questionAnswerParam.CASE_NO"
        :caseLogId="questionAnswerParam.GUID"
      >
      </MailRecord>
    </DragModal>

    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="infMplusSendMessageVisible"
      :title="$t('MplusSendMessageRecords')"
      width="60%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="infMplusSendMessageVisible = false"
    >
      <MPlusHistory
        :caseNo="questionAnswerParam.CASE_NO"
        :caseLogId="questionAnswerParam.GUID"
      >
      </MPlusHistory>
    </DragModal>
    
    <!-- 郵寄紀錄 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="infPostRecordVisible"
      :title="$t('postRecords')"
      width="60%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="infPostRecordVisible = false"
    >
      <PostRecord
        :caseId="caseNo"
        :caseLogId="caseLogid"
      >
      </PostRecord>
    </DragModal>

    <!-- 照會紀錄 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="notiReocrdvisible"
      :title="$t('handleInfoForm_notiRecord')"
      width="60%"
      :closable="true"
      :isMasked="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
      :visibleFooter="false"
      @cancel="notiReocrdvisible = false"
    >
      <HandleInfoForm 
        :data="handleInfoData"
        @getVisible="getNotiReocrdvisible"
      ></HandleInfoForm>
    </DragModal>
  </div>
</template>


<script src="./ServeContactHistroy.ts" lang="ts"></script>

<style lang="less" scoped>
// 通話內容超出的字隱藏起來
.word_hidden {
    overflow: hidden; 
    white-space:nowrap;
    text-overflow:ellipsis;
    width:160px;
    display:inline-block;
}
</style>
