<template>
  <div class="section-card section__reply">
    <div class="card__title-position">
      <span class="card__title">會辦結案</span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :model="countersignatureModalForm_closed"
        :rules="infCloseormRules"
        class="countersignatureModalFormPage"
        labelAlign="right"
      >
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
            <a-form-model-item :label="($props.isEdit) ? $t('infCom_fileList') : $t('infCom_fileListOther')"/>
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
                  :has-feedback="callCommonUtilFeildFeedback(infCloseValidateForm.contactDate)"
                  :validateStatus="callCommonUtilFeildStatus(infCloseValidateForm.contactDate)"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeildMsg(infCloseValidateForm.contactDate)"
                    :trigger="callCommonUtilFeildTrigger(infCloseValidateForm.contactDate)"
                    :visible="callCommonUtilFeildHoverVisible(infCloseValidateForm.contactDate)"
                    @visibleChange="callCommonUtilFeildVisibleChange(infCloseValidateForm.contactDate)"
                    :destroyTooltipOnHide="true"
                  >
                    <DatePicker
                      :formatter="formatter"
                      @change="onContactDateChange"
                      v-model="infCloseForm.contactDate"
                      :disabled-date="disabledDate"
                      @clear="clearContactDate"
                      :clearable="true"
                      style="width: 100%"
                    >
                      <a-input
                        slot="input"
                        @pressEnter="checkManualInputContactDate"
                        :value="infCloseForm.contactString"
                        @mouseover="eventMouseOverContactDate"
                        @mouseleave="isContactDateVisible = false"
                      ></a-input>
                      <i
                        v-if="infCloseValidateForm.contactDate.feedback"
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
                  :has-feedback="
                    callCommonUtilFeildFeedback(infCloseValidateForm.convenientContactStartTime)
                  "
                  :validateStatus="
                    callCommonUtilFeildStatus(infCloseValidateForm.convenientContactStartTime)
                  "
                  v-if="isTimePickerShow"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeildMsg(infCloseValidateForm.convenientContactStartTime)"
                    :trigger="callCommonUtilFeildTrigger(infCloseValidateForm.convenientContactStartTime)"
                    :visible="callCommonUtilFeildHoverVisible(infCloseValidateForm.convenientContactStartTime)"
                    @visibleChange="callCommonUtilFeildVisibleChange(infCloseValidateForm.convenientContactStartTime)"
                    :destroyTooltipOnHide="true"
                  >
                    <TimePicker
                      :open="isConvenientContactStartOpen"
                      @openChange="clickConvenientContactStartTimePicker"
                      style="width: 100%"
                      v-model="infCloseForm.convenientContactStartTime"
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
                  :has-feedback="
                    callCommonUtilFeildFeedback(infCloseValidateForm.convenientContactEndTime)
                  "
                  :validateStatus="
                    callCommonUtilFeildStatus(infCloseValidateForm.convenientContactEndTime)
                  "
                  v-if="isTimePickerShow"
                >
                  <a-popover
                    placement="top"
                    :content="callCommonUtilFeildMsg(infCloseValidateForm.convenientContactEndTime)"
                    :trigger="callCommonUtilFeildTrigger(infCloseValidateForm.convenientContactEndTime)"
                    :visible="callCommonUtilFeildHoverVisible(infCloseValidateForm.convenientContactEndTime)"
                    @visibleChange="callCommonUtilFeildVisibleChange(infCloseValidateForm.convenientContactEndTime)"
                    :destroyTooltipOnHide="true"
                  >
                    <TimePicker
                      :open="isConvenientContactEndOpen"
                      @openChange="clickConvenientContactEndTimePicker"
                      style="width: 100%"
                      v-model="infCloseForm.convenientContactEndTime"
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
            <a-form-model-item v-if="!infCloseForm.contactString" label="結案備註"
              :has-feedback="callCommonUtilFeildFeedback(infCloseValidateForm.caseClosedRemark)"
              :validateStatus="callCommonUtilFeildStatus(infCloseValidateForm.caseClosedRemark)"
              prop="caseClosedRemark"
            >
              <a-popover
                placement="top"
                :content="callCommonUtilFeildMsg(infCloseValidateForm.caseClosedRemark)"
                :trigger="callCommonUtilFeildTrigger(infCloseValidateForm.caseClosedRemark)"
                :visible="callCommonUtilFeildHoverVisible(infCloseValidateForm.caseClosedRemark)"
                @visibleChange="callCommonUtilFeildVisibleChange(infCloseValidateForm.caseClosedRemark)"
                :destroyTooltipOnHide="true"
              >
                <a-textarea
                  v-model="infCloseForm.caseClosedRemark"
                  :maxLength="200"
                  :autoSize="{ minRows: 2, maxRows: 2 }"
                  v-if="$props.isEdit"
                ></a-textarea>
              </a-popover>
              <p v-if="!$props.isEdit">{{ countersignatureModalForm_closed.data3 }}</p>
            </a-form-model-item>
            <a-form-model-item v-if="infCloseForm.contactString" label="結案備註" required
              :has-feedback="callCommonUtilFeildFeedback(infCloseValidateForm.caseClosedRemark)"
              :validateStatus="callCommonUtilFeildStatus(infCloseValidateForm.caseClosedRemark)"
              prop="caseClosedRemark"
            >
              <a-popover
                placement="top"
                :content="callCommonUtilFeildMsg(infCloseValidateForm.caseClosedRemark)"
                :trigger="callCommonUtilFeildTrigger(infCloseValidateForm.caseClosedRemark)"
                :visible="callCommonUtilFeildHoverVisible(infCloseValidateForm.caseClosedRemark)"
                @visibleChange="callCommonUtilFeildVisibleChange(infCloseValidateForm.caseClosedRemark)"
                :destroyTooltipOnHide="true"
              >
                <a-textarea
                  v-model="infCloseForm.caseClosedRemark"
                  :maxLength="200"
                  :autoSize="{ minRows: 2, maxRows: 2 }"
                  v-if="$props.isEdit"
                ></a-textarea>
              </a-popover>
              <p v-if="!$props.isEdit">{{ countersignatureModalForm_closed.data3 }}</p>
            </a-form-model-item>
          </a-col>
        </a-row>

      </a-form-model>
    </div>
  </div>
</template>
<script src="./Countersignature_closed_com.ts" lang="ts"></script>
<style  lang="less">
.section__reply {

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