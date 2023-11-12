<template>
  <div class="section-card section__closed">
    <div class="card__title-position">
      <span class="card__title">照會結案</span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :model="notificationClosedForm"
        :rules="notiClosedRules"
        class="countersignatureModalFormPage"
        labelAlign="right"
      >
        <!-- 附加檔案-上傳元件 [編輯] 才出現 -->
        <a-row type="flex">
          <a-col flex="1">
            <a-form-model-item :label="$t('infCom_file')" style="margin-bottom: 0px">
              <!-- 選擇檔案 -->
              <a-row :gutter="8">
                <a-col span="16">
                  <a-input v-model="selectedFileName" />
                </a-col>
                <!-- 瀏覽 -->
                <a-col span="4">
                  <a-upload
                    class="FileListUpload"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    :showUploadList="false"
                  >
                    <a-button>
                      <a-icon type="folder-open" />
                      {{ $t("uploadFileForm_selectFile") }}
                    </a-button>
                  </a-upload>
                </a-col>
                <!-- 上傳 -->
                <a-col span="4">
                  <a-button
                    :disabled="uploadingFile == null"
                    :loading="isUploading"
                    @click="handleUpload"
                  >
                  <!-- 上傳中...   上傳 -->
                    <a-icon type="upload" />{{ isUploading ? $t('global_uploading') : $t('global_upload') }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 附加檔案 -->
        <a-row type="flex">
          <a-col flex="1">
            <!-- 上傳檔案清單  其他附檔清單-->
            <a-form-model-item :label="$t('infCom_fileList')"/>
            <!-- 下載列表 -->
            <a-row type="flex" justify="end" v-if="gridFileData.data.length > 0">
              <a-col span="20">
                <FblDataGrid
                  :themeColor="'theme2'"
                  :scroll="{ x: true }"
                  :row-key="gridFileData.rowKey"
                  :columns="gridFileData.columns"
                  :data="gridFileData.data"
                  :pagination="gridFileData.pagination"
                  :empty-data="gridFileData.data.length <= 0"
                >
                  <template v-slot:handleTemp="slotProps">
                    <div class="d-flex">
                      <button
                        class="icon-button icon__delete"
                        @click="handleRemove(slotProps.data)"
                      >
                      <!-- 刪除 -->
                        <img
                          class="icon-button__img"
                          src="~@/assets/imgs/button_delete.svg"
                          :alt="$t('global_delete')"
                          :title="$t('global_delete')"
                        >
                      </button>
                      <button
                        class="icon-button"
                        @click="handleDownload(slotProps.data)"
                      >
                      <!-- 下載 -->
                        <img
                          class="icon-button__img"
                          src="~@/assets/imgs/button_download.svg"
                          :alt="$t('global_download')"
                          :title="$t('global_download')"
                        >
                      </button>
                    </div>
                  </template>
                </FblDataGrid>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <!-- 方便聯絡時間 -->
        <a-row type="flex">
          <a-col span="4" class="ant-form-item-label">
            <label> {{$t('infReplyForm_visitTime')}}</label>
          </a-col>
          <a-col span="20">
            <a-row type="flex" :gutter="[10, 0]">
              <a-col>
                <a-form-model-item
                  label=""
                  prop="contactDate"
                  class="contactDate"
                  style="margin-bottom: 0px"
                  :has-feedback="callCommonUtilFeild(notiCloseValidateForm.contactDate).feedback"
                  :validateStatus="callCommonUtilFeild(notiCloseValidateForm.contactDate).state"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiCloseValidateForm.contactDate).msg"
                    :trigger="callCommonUtilFeild(notiCloseValidateForm.contactDate).hover"
                    :visible="callCommonUtilFeild(notiCloseValidateForm.contactDate).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiCloseValidateForm.contactDate)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onContactDateChange"
                      v-model="notificationClosedForm.contactDate"
                      :disabled-date="disabledDate"
                      @clear="clearContactDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputContactDate"
                        :value="notificationClosedForm.contactString"
                      ></a-input>
                      <i
                        v-if="notiCloseValidateForm.contactDate.feedback"
                        slot="icon-calendar"
                      ></i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item
                  label=""
                  class="infVisitTime"
                  style="margin-bottom: 0px"
                  prop="convenientContactStartTime"
                  :has-feedback="callCommonUtilFeild(notiCloseValidateForm.notiContactStartTime).feedback"
                  :validateStatus="callCommonUtilFeild(notiCloseValidateForm.notiContactStartTime).state"
                  v-if="isTimePickerShow"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiCloseValidateForm.notiContactStartTime).msg"
                    :trigger="callCommonUtilFeild(notiCloseValidateForm.notiContactStartTime).hover"
                    :visible="callCommonUtilFeild(notiCloseValidateForm.notiContactStartTime).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiCloseValidateForm.notiContactStartTime)"
                    :destroyTooltipOnHide="true"
                  >
                    <TimePicker
                      :open="isConvenientContactStartOpen"
                      @openChange="clickConvenientContactStartTimePicker"
                      style="width: 100%"
                      v-model="notificationClosedForm.notiContactStartTime"
                      placeholder=""
                      @change="onConvenientContactStartTimeChange"
                      :minute-step="5"
                      format="HH:mm"
                      :allowClear="false"
                    >
                      <!-- 確定 -->
                      <a-button
                        slot="addon"
                        size="small"
                        type="primary"
                        @click="closeConvenientContactStartTimePicker"
                      >
                        {{ $t("global_ok") }}
                      </a-button>
                    </TimePicker>
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <a-col v-if="isTimePickerShow" style="width: 15px; padding-top: 10px;text-align:center"> ~ </a-col>
              <a-col>
                <a-form-model-item
                  label=""
                  class="infVisitTime"
                  style="margin-bottom: 0px"
                  prop="convenientContactEndTime"
                  :has-feedback="callCommonUtilFeild(notiCloseValidateForm.notiContactEndTime).feedback"
                  :validateStatus="callCommonUtilFeild(notiCloseValidateForm.notiContactEndTime).state"
                  v-if="isTimePickerShow"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeild(notiCloseValidateForm.notiContactEndTime).msg"
                    :trigger="callCommonUtilFeild(notiCloseValidateForm.notiContactEndTime).hover"
                    :visible="callCommonUtilFeild(notiCloseValidateForm.notiContactEndTime).hoverVisible"
                    @visibleChange="callCommonUtilFeildVisibleChange(notiCloseValidateForm.notiContactEndTime)"
                    :destroyTooltipOnHide="true"
                  >
                    <TimePicker
                      :open="isConvenientContactEndOpen"
                      @openChange="clickConvenientContactEndTimePicker"
                      style="width: 100%"
                      v-model="notificationClosedForm.notiContactEndTime"
                      placeholder=""
                      @change="onConvenientContactEndTimeChange"
                      :minute-step="5"
                      format="HH:mm"
                      :allowClear="false"
                    >
                      <!-- 確定 -->
                      <a-button
                        slot="addon"
                        size="small"
                        type="primary"
                        @click="closeConvenientContactEndTimePicker"
                      >
                        {{ $t("global_ok") }}
                      </a-button>
                    </TimePicker>
                  </a-popover>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <!-- 結案備註 -->
        <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
          <a-col flex="1">
            <a-form-model-item :label="$t('notificationModal_closeRemark')"
              :has-feedback="callCommonUtilFeild(notiCloseValidateForm.caseClosedRemark).feedback"
              :validateStatus="callCommonUtilFeild(notiCloseValidateForm.caseClosedRemark).state"
              :required="notificationClosedForm.contactDate != null"
              prop="caseClosedRemark"
            >
              <a-popover
                placement="top"
                :content="callCommonUtilFeild(notiCloseValidateForm.caseClosedRemark).msg"
                :trigger="callCommonUtilFeild(notiCloseValidateForm.caseClosedRemark).hover"
                :visible="callCommonUtilFeild(notiCloseValidateForm.caseClosedRemark).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(notiCloseValidateForm.caseClosedRemark)"
                :destroyTooltipOnHide="true"
              >
                <a-textarea
                  v-model="notificationClosedForm.caseClosedRemark"
                  :maxLength="200"
                  :autoSize="{ minRows: 2, maxRows: 2 }"
                ></a-textarea>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>

      </a-form-model>
    </div>
  </div>
</template>
<script src="./NotificationClosed.ts" lang="ts"></script>
<style  lang="less">
.section__closed {

  /* 方便聯絡日期 */
  .contactDate {
    .ant-form-item-label {
      width: 0%;
    }
    .ant-form-item-control-wrapper {
    width: 100%;
    }
  }

  /* 時間 */
  .infVisitTime{
    .ant-form-item-label {
      width: 0%;
    }
    .ant-form-item-control-wrapper {
      width: 100%;
    }
  }
}
</style>