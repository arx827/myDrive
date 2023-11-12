<template>
  <div>
    <a-card title="檔案上傳">
      <label>
        {{ $t('global_importDescribeLimit') }} <br />
        {{ secondText }} <br />
        <br v-if="!isSingleUpload" />
        {{ $t("global_workingMonth") }}：{{ allowMonth }} <br /><br />
      </label>
      <a-card>
        <a-upload
          :file-list="fileList"
          :multiple="false"
          :remove="handleRemove"
          :before-upload="beforeUpload"
        >
          <!-- 選擇檔案 -->
          <a-button>
            <a-icon type="upload" /> {{ $t("eventS_selectFile") }}
          </a-button>
        </a-upload>
      </a-card>
      <a-row type="flex" justify="end" style="margin-top: 16px">
        <!-- 上傳 -->
        <a-space>
          <a-button
            type="primary"
            :disabled="fileList.length === 0"
            @click="handleUpload"
          >
            {{ $t("global_upload") }}
          </a-button>
          <a-button @click="uploadFormClose">
            {{ $t("global_close") }}
          </a-button>
        </a-space>
      </a-row>
    </a-card>
    <p></p>
    <!-- 上傳歷程 -->
    <a-card :title="$t('global_uploadHistory')">
      <FblDataGrid
        :rowKey="gridLog.rowKey"
        :columns="gridLog.columns"
        :data="gridLog.data"
        :pagination="false"
        :scroll="gridLog.scroll"
        align="center"
        size="middle"
        bordered
        ref="shiftWorkUploadLog"
      >
      </FblDataGrid>
    </a-card>
    <p></p>
    <!-- 檢核結果 -->
    <a-card
      :title="$t('eventS_checkResult')"
      style="height: 240px"
      v-if="validationResult"
    >
      <label>{{ errorMessage }}</label>
      <FblDataGrid
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        :scroll="grid.scroll"
        v-if="hasError"
        align="center"
        size="middle"
        bordered
        ref="shiftWorkUploadDataGrid"
      >
      </FblDataGrid>
    </a-card>
  </div>
</template>
<script src="./ShiftWorkUploadForm.ts" lang="ts">
</script>
<style scoped>
/* 版面調整 */
.ant-card-head {
  padding: 10px 10px;
}

.ant-card-body {
  min-height: 20px;
  padding: 10px 24px;
}
.ant-card-head-wrapper {
  padding: 0px 10x;
}
.ant-card-head-title {
  padding: 0px 10px;
}
.ant-modal-body {
  padding: 10px 24px;
}
</style>