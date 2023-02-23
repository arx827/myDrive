<template>
  <div class="section-card section__reply">
    <div class="card__title-position">
      <!-- 會辦回覆 -->
      <span class="card__title">{{$t('infReplyForm_infReply')}}</span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :rules="infReplyFormRules"
        :model="infReplyReadOnly"
        class="countersignatureModalFormPage"
        labelAlign="right"
      >
      <!-- 唯讀顯示 -->
        <a-row type="flex" v-if="!$props.isEdit">
          <a-col :span="24" flex="1">
            <!-- 處理狀態-->
            <a-form-model-item :label="$t('infReplyForm_handleStatus')" class="readonly-form-item">
              <p>{{ infReplyReadOnly.handleStatusDesc }}</p>
            </a-form-model-item>
            <!-- 回覆內容 -->
            <a-form-model-item :label="$t('infReplyForm_content')" class="readonly-form-item">
              <p>{{ infReplyReadOnly.replyContent }}</p>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 處理狀態 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <a-form-model-item :label="$t('infReplyForm_handleStatus')"
              required
            >
              <a-select
                class="select"
                v-model="infReplyForm.handleStatus"
                :options="handleStatusOptions"
                @change="onHandleStatusChange"
                style="width:40%"
              />
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- 回覆內容 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <a-form-model-item :label="$t('infReplyForm_content')"
              :required="infReplyForm.handleStatus !='01'"
            >
              <a-select
                class="select"
                v-model="infReplyForm.contentId"
                :options="replyContentOption"
                @change="onContentIdChange"
                style="width:40%"
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('infReplyForm_content')"
              class="replyContent"
              :has-feedback="callCommonUtilFeildFeedback(infReplyValidateForm.content)"
              :validateStatus="callCommonUtilFeildStatus(infReplyValidateForm.content)"
              prop="content"
            >
              <a-popover
                placement="top"
                :content="callCommonUtilFeildMsg(infReplyValidateForm.content)"
                :trigger="callCommonUtilFeildTrigger(infReplyValidateForm.content)"
                :visible="callCommonUtilFeildHoverVisible(infReplyValidateForm.content)"
                @visibleChange="callCommonUtilFeildVisibleChange(infReplyValidateForm.content)"
                :destroyTooltipOnHide="true"
              >
                <a-textarea
                  v-model="infReplyForm.content"
                  :maxLength="200"
                  :autoSize="{ minRows: 2, maxRows: 3 }"
                ></a-textarea>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- 附加檔案-上傳元件 [編輯] 才出現 -->
        <a-row type="flex" v-if="$props.isEdit">
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
            <a-form-model-item :label="($props.isEdit) ? $t('infCom_fileList') : $t('infCom_fileListOther')" v-if="infTypeId !='6' &&($props.isEdit)" :required="infReplyForm.handleStatus !='01'"/>
            <a-form-model-item :label="($props.isEdit) ? $t('infCom_fileList') : $t('infCom_fileListOther')" v-else/>
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
                        v-if="$props.isEdit"
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
        <a-row type="flex" v-if="$props.isEdit">
          <a-col span="4" class="ant-form-item-label" :class="{'readonly-form-item': !$props.isEdit}">
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
                  :has-feedback="callCommonUtilFeildFeedback(infReplyValidateForm.contactDate)"
                  :validateStatus="callCommonUtilFeildStatus(infReplyValidateForm.contactDate)"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeildMsg(infReplyValidateForm.contactDate)"
                    :trigger="callCommonUtilFeildTrigger(infReplyValidateForm.contactDate)"
                    :visible="callCommonUtilFeildHoverVisible(infReplyValidateForm.contactDate)"
                    @visibleChange="callCommonUtilFeildVisibleChange(infReplyValidateForm.contactDate)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onContactDateChange"
                      v-model="infReplyForm.datePickerContactDate"
                      :disabled-date="disabledDate"
                      @clear="clearContactDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputContactDate"
                        :value="infReplyForm.contactString"
                        @mouseover="eventMouseOverContactDate"
                        @mouseleave="isContactDateVisible = false"
                      ></a-input>
                      <i
                        v-if="infReplyValidateForm.contactDate.feedback"
                        slot="icon-calendar"
                      ></i>
                    </DatePicker>
                  </a-popover>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item
                  label=""
                  class="infReplyTime"
                  style="margin-bottom: 0px"
                  prop="convenientContactStartTime"
                  :has-feedback="
                    callCommonUtilFeildFeedback(infReplyValidateForm.convenientContactStartTime)
                  "
                  :validateStatus="
                    callCommonUtilFeildStatus(infReplyValidateForm.convenientContactStartTime)
                  "
                  v-if="isTimePickerShow"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeildMsg(infReplyValidateForm.convenientContactStartTime)"
                    :trigger="callCommonUtilFeildTrigger(infReplyValidateForm.convenientContactStartTime)"
                    :visible="callCommonUtilFeildHoverVisible(infReplyValidateForm.convenientContactStartTime)"
                    @visibleChange="callCommonUtilFeildVisibleChange(infReplyValidateForm.convenientContactStartTime)"
                    :destroyTooltipOnHide="true"
                  >
                    <TimePicker
                      :open="isConvenientContactStartOpen"
                      @openChange="clickConvenientContactStartTimePicker"
                      style="width: 100%"
                      v-model="infReplyForm.convenientContactStartTime"
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
                  class="infReplyTime"
                  style="margin-bottom: 0px"
                  prop="convenientContactEndTime"
                  :has-feedback="
                    callCommonUtilFeildFeedback(infReplyValidateForm.convenientContactEndTime)
                  "
                  :validateStatus="
                    callCommonUtilFeildStatus(infReplyValidateForm.convenientContactEndTime)
                  "
                  v-if="isTimePickerShow"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeildMsg(infReplyValidateForm.convenientContactEndTime)"
                    :trigger="callCommonUtilFeildTrigger(infReplyValidateForm.convenientContactEndTime)"
                    :visible="callCommonUtilFeildHoverVisible(infReplyValidateForm.convenientContactEndTime)"
                    @visibleChange="callCommonUtilFeildVisibleChange(infReplyValidateForm.convenientContactEndTime)"
                    :destroyTooltipOnHide="true"
                  >
                    <TimePicker
                      :open="isConvenientContactEndOpen"
                      @openChange="clickConvenientContactEndTimePicker"
                      style="width: 100%"
                      v-model="infReplyForm.convenientContactEndTime"
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

        <!-- 方便聯絡時間、回覆人員、回覆時間 [唯讀] 才出現 -->
        <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]" v-if="!$props.isEdit">
          <a-col :span="24" flex="1">
            <!-- 方便聯絡時間 -->
            <a-form-model-item :label="$t('infReplyForm_visitTime')" class="readonly-form-item">
              <p>{{ infReplyReadOnly.visitDateRange }}</p>
            </a-form-model-item>
            <!-- 回覆人員 -->
            <a-form-model-item :label="$t('infReplyForm_replyId')" class="readonly-form-item">
              <p>{{ infReplyReadOnly.replierInfo }}</p>
            </a-form-model-item>
            <!-- 回覆時間 -->
            <a-form-model-item :label="$t('infReplyForm_replyTime')" class="readonly-form-item">
              <p>{{ infReplyReadOnly.replyTimeString }}</p>
            </a-form-model-item>
          </a-col>
        </a-row>

      </a-form-model>
    </div>  
  </div>
</template>
<script src="./Countersignature_reply_com.ts" lang="ts"></script>
<style  lang="less">
.section__reply {
  /* 回覆內容 */
  .replyContent{
    margin-left: 16.6%;
    .ant-form-item-label {
      width: 0%;
    }
    .ant-form-item-control-wrapper {
    width: 100%;
    }
  }
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
  .infReplyTime{
    .ant-form-item-label {
      width: 0%;
    }
    .ant-form-item-control-wrapper {
      width: 100%;
    }
  }
}
</style>