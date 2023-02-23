<template>
  <div class="section-card section__interview">
    <div class="card__title-position">
      <!-- 電訪內容 -->
      <span class="card__title">{{ $t('notificationInterview_content') }}</span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <FblDataGrid
          :scroll="{ x: true }"
          :row-key="gridFileData.rowKey"
          :columns="gridFileData.columns"
          :data="gridFileData.data"
          :empty-data="gridFileData.data.length <= 0"
        >
          <template v-slot:answerInput="slotProps">
            <!-- 保戶回答 -->
            <a-form-model-item
              :has-feedback="callCommonUtilFeild(slotProps.data.validate).feedback"
              :validateStatus="callCommonUtilFeild(slotProps.data.validate).state"
              prop="answer"
              required
            >
              <a-popover
                placement="top"
                :content="callCommonUtilFeild(slotProps.data.validate).msg"
                :trigger="callCommonUtilFeild(slotProps.data.validate).hover"
                :visible="callCommonUtilFeild(slotProps.data.validate).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(slotProps.data.validate)"
                :destroyTooltipOnHide="true"
              >
                <a-textarea
                  v-if="isEdit"
                  v-model="slotProps.data.answer"
                  :maxLength="1000"
                  :autoSize="{ minRows: 3, maxRows: 3 }"
                  @blur="onAnswerChange(slotProps.data.answer, slotProps.data.validate)"
                />
                <span v-if="!isEdit" style="white-space: pre-line;">{{ slotProps.data.answer }}</span>
              </a-popover>
            </a-form-model-item>
          </template>
        </FblDataGrid>
      </a-form-model>
    </div>
  </div>
</template>
<script src="./NotificationInterview.ts" lang="ts"></script>
<style lang="less" scoped>
</style>