<template >
  <div tabindex="-1" @keyup.enter="searchGetRecordPage">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ xs: 8, md: 10, xxl: 8 }"
          :wrapper-col="{ xs: 16, md: 14, xxl: 16 }"
          ref="casePage"
          :model="recordPageSearchForm"
          :rules="recordPageSearchRules"
          class="casePage"
        >
          <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
            <!-- 錄音時間區間 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-row>
                <a-form-model-item>
                  <span slot="label">{{ $t("getRecordPage_dial") }}</span>
                  <a-row type="flex" class="datePicker__interval">
                    <a-form-model-item
                      prop="dialStart"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.dialStart
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.dialStart
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.dialStart
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.dialStart
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.dialStart
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.dialStart
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onDialStartChange"
                          v-model="recordPageSearchForm.datePickerDialStart"
                          @clear="clearDial('StartDate')"
                        >
                          <!-- 請選擇日期(起) -->
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputDialStartDate"
                            :value="recordPageSearchForm.dialStartString"
                          />
                          <i
                            v-if="
                              callCommonUtilFeild(
                                recordPageSearchValidateForm.dialStart
                              ).feedback
                            "
                            slot="icon-calendar"
                          ></i>
                          <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                          <i
                            v-if="
                              callCommonUtilFeild(
                                recordPageSearchValidateForm.dialStart
                              ).feedback
                            "
                            slot="icon-clear"
                          >
                            <a-icon
                              type="close-circle"
                              theme="filled"
                              style="color: white"
                            />
                          </i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                    <a-form-model-item
                      class="timeStart"
                      style="margin-bottom: 0px"
                      prop="specifyContactStartTime"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.specifyContactStartTime
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.specifyContactStartTime
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.specifyContactStartTime
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.specifyContactStartTime
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.specifyContactStartTime
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.specifyContactStartTime
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <!-- 請選擇時間(起) -->
                        <TimePicker
                          :open="isSpecifyContactStartOpen"
                          @openChange="clickSpecifyContactStartTimePicker"
                          placeholder=""
                          style="width: 100%"
                          v-model="recordPageSearchForm.specifyContactStartTime"
                          @change="onSpecifyContactStartTimeChange"
                          :minute-step="5"
                          format="HH:mm"
                          :allowClear="
                            !callCommonUtilFeild(
                              recordPageSearchValidateForm.specifyContactStartTime
                            ).feedback
                          "
                        >
                          <!-- 確定 -->
                          <a-button
                            slot="addon"
                            size="small"
                            type="primary"
                            @click="closeSpecifyContactStartTimePicker"
                          >
                            {{ $t("global_ok") }}
                          </a-button>
                        </TimePicker>
                      </a-popover>
                    </a-form-model-item>
                    <!-- <span class="interval__symbol">~</span> -->
                    <a-form-model-item
                      prop="dialEnd"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.dialEnd
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.dialEnd
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.dialEnd
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.dialEnd
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.dialEnd
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.dialEnd
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <DatePicker
                          :formatter="formatter"
                          @change="onDialEndChange"
                          v-model="recordPageSearchForm.datePickerDialEnd"
                          @clear="clearDial('EndDate')"
                        >
                          <!-- 請選擇日期(迄) -->
                          <a-input
                            slot="input"
                            @pressEnter="checkManualInputDialEndDate"
                            :value="recordPageSearchForm.dialEndString"
                          />
                          <i
                            v-if="
                              callCommonUtilFeild(
                                recordPageSearchValidateForm.dialEnd
                              ).feedback
                            "
                            slot="icon-calendar"
                          ></i>
                          <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                          <i
                            v-if="
                              callCommonUtilFeild(
                                recordPageSearchValidateForm.dialEnd
                              ).feedback
                            "
                            slot="icon-clear"
                          >
                            <a-icon
                              type="close-circle"
                              theme="filled"
                              style="color: white"
                            />
                          </i>
                        </DatePicker>
                      </a-popover>
                    </a-form-model-item>
                    <a-form-model-item
                      class="timeEnd"
                      style="margin-bottom: 0px"
                      prop="specifyContactEndTime"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.specifyContactEndTime
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.specifyContactEndTime
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.specifyContactEndTime
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.specifyContactEndTime
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.specifyContactEndTime
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.specifyContactEndTime
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <!-- 請選擇時間(訖) -->
                        <TimePicker
                          :open="isSpecifyContactEndOpen"
                          @openChange="clickSpecifyContactEndTimePicker"
                          placeholder=""
                          style="width: 100%"
                          v-model="recordPageSearchForm.specifyContactEndTime"
                          @change="onSpecifyContactEndTimeChange"
                          :minute-step="5"
                          format="HH:mm"
                          :allowClear="
                            !callCommonUtilFeild(
                              recordPageSearchValidateForm.specifyContactEndTime
                            ).feedback
                          "
                        >
                          <!-- 確定 -->
                          <a-button
                            slot="addon"
                            size="small"
                            type="primary"
                            @click="closeSpecifyContactEndTimePicker"
                          >
                            {{ $t("global_ok") }}
                          </a-button>
                        </TimePicker>
                      </a-popover>
                    </a-form-model-item>
                  </a-row>
                </a-form-model-item>
              </a-row>
            </a-col>
            <!-- 電訪員帳號	 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                prop="userId"
                :has-feedback="
                  callCommonUtilFeild(recordPageSearchValidateForm.userId)
                    .feedback
                "
                :validateStatus="
                  callCommonUtilFeild(recordPageSearchValidateForm.userId).state
                "
              >
                <span slot="label">{{ $t("getRecordPage_userId") }}</span>
                <a-popover
                  placement="top"
                  :content="
                    callCommonUtilFeild(recordPageSearchValidateForm.userId).msg
                  "
                  :trigger="
                    callCommonUtilFeild(recordPageSearchValidateForm.userId)
                      .hover
                  "
                  :visible="
                    callCommonUtilFeild(recordPageSearchValidateForm.userId)
                      .hoverVisible
                  "
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      recordPageSearchValidateForm.userId
                    )
                  "
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="recordPageSearchForm.userId"
                    :maxLength="5"
                    @change="userIdUpper"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <!-- 電話號碼(來電) -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                prop="extNo"
                :has-feedback="
                  callCommonUtilFeild(recordPageSearchValidateForm.extNo)
                    .feedback
                "
                :validateStatus="
                  callCommonUtilFeild(recordPageSearchValidateForm.extNo).state
                "
              >
                <span slot="label">{{ $t("getRecordPage_extNo") }}</span>
                <a-popover
                  placement="top"
                  :content="
                    callCommonUtilFeild(recordPageSearchValidateForm.extNo).msg
                  "
                  :trigger="
                    callCommonUtilFeild(recordPageSearchValidateForm.extNo)
                      .hover
                  "
                  :visible="
                    callCommonUtilFeild(recordPageSearchValidateForm.extNo)
                      .hoverVisible
                  "
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      recordPageSearchValidateForm.extNo
                    )
                  "
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="recordPageSearchForm.extNo"
                    :maxLength="20"
                  ></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <!-- 電話號碼(外撥) -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item
                prop="telNo"
                :has-feedback="
                  callCommonUtilFeild(recordPageSearchValidateForm.telNo)
                    .feedback
                "
                :validateStatus="
                  callCommonUtilFeild(recordPageSearchValidateForm.telNo).state
                "
              >
                <span slot="label">{{ $t("getRecordPage_telNo") }}</span>
                <a-popover
                  placement="top"
                  :content="
                    callCommonUtilFeild(recordPageSearchValidateForm.telNo).msg
                  "
                  :trigger="
                    callCommonUtilFeild(recordPageSearchValidateForm.telNo)
                      .hover
                  "
                  :visible="
                    callCommonUtilFeild(recordPageSearchValidateForm.telNo)
                      .hoverVisible
                  "
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      recordPageSearchValidateForm.telNo
                    )
                  "
                  :destroyTooltipOnHide="true"
                >
                  <a-input
                    type="text"
                    v-model="recordPageSearchForm.telNo"
                    :maxLength="20"
                  ></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <!-- 保單號碼 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="8">
              <a-form-model-item>
                <span slot="label">{{ $t("getRecordPage_casePolicy") }}</span>
                <a-row type="flex" :gutter="[5]">
                  <a-col :span="12" :gutter="15">
                    <a-form-model-item
                      prop="policyNo"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.policyNo
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.policyNo
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policyNo
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policyNo
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policyNo
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.policyNo
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="10"
                          v-model="recordPageSearchForm.policyNo"
                          @change="policyNoUpper"
                        />
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="6" :gutter="15">
                    <a-form-model-item
                      prop="policySeq"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.policySeq
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.policySeq
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policySeq
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policySeq
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policySeq
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.policySeq
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="2"
                          v-model="recordPageSearchForm.policySeq"
                        />
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="1" :gutter="0">
                    <p class="text-center">-</p>
                  </a-col>
                  <a-col :span="4" :gutter="15">
                    <a-form-model-item
                      prop="policyIdDup"
                      :has-feedback="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.policyIdDup
                        ).feedback
                      "
                      :validateStatus="
                        callCommonUtilFeild(
                          recordPageSearchValidateForm.policyIdDup
                        ).state
                      "
                    >
                      <a-popover
                        placement="top"
                        :content="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policyIdDup
                          ).msg
                        "
                        :trigger="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policyIdDup
                          ).hover
                        "
                        :visible="
                          callCommonUtilFeild(
                            recordPageSearchValidateForm.policyIdDup
                          ).hoverVisible
                        "
                        @visibleChange="
                          callCommonUtilFeildVisibleChange(
                            recordPageSearchValidateForm.policyIdDup
                          )
                        "
                        :destroyTooltipOnHide="true"
                      >
                        <a-input
                          type="text"
                          :maxLength="1"
                          v-model="recordPageSearchForm.policyIdDup"
                        />
                      </a-popover>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div>
            <a-row
              type="flex"
              justify="center"
              align="middle"
              class="searchBar"
            >
              <!-- 查詢 -->
              <a-button
                v-if="authComponent.COM_RECORD_RESULT_SEARCH.show"
                :disabled="!authComponent.COM_RECORD_RESULT_SEARCH.enable"
                type="primary"
                @click="searchGetRecordPage"
                >{{ $t("global_search") }}</a-button
              >
              <!-- 清除查詢條件 -->
              <a-button
                v-if="authComponent.COM_RECORD_RESULT_SEARCH.show"
                :disabled="!authComponent.COM_RECORD_RESULT_SEARCH.enable"
                type="default"
                @click="resetGetRecordPage"
                >{{ $t("global_clean") }}</a-button
              >
              <a-divider
                v-if="authComponent.COM_RECORD_RESULT_EXPORT.show"
                type="vertical"
              ></a-divider>
              <!-- 查詢結果匯出 -->
              <a-button
                v-if="authComponent.COM_RECORD_RESULT_EXPORT.show"
                :disabled="!authComponent.COM_RECORD_RESULT_EXPORT.enable"
                class="ml-auto"
                type="primary"
                @click="exportSearchResult"
                >{{ $t("global_export") }}</a-button
              >
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>
    <a-row style="margin-left: 30px">
      <!-- 共 X 筆 -->
      {{
        $t("getRecordPage_total") +
        " " +
        this.grid.pagination.total +
        " " +
        $t("getRecordPage_pen")
      }}<br />
    </a-row>
    <a-row style="margin-left: 30px">
      <a-spin :spinning="isLoading">
        <audio
          height="100%"
          type="audio/wav"
          controls
          controlsList="nodownload"
          oncontextmenu="return false;"
          autoplay="autoplay"
          v-if="showRecordPlayer"
        >
          <source :src="recordPlayUrl" />
        </audio>
      </a-spin>
    </a-row>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :scroll="grid.scroll"
          size="middle"
          @tableChange="onPageChange($event)"
          @checkedChange="onCheckedChange($event)"
          style="padding-left: 24px; padding-right: 12px"
          ref="grid"
        >
          <template v-slot:playTemp="slotProps">
            <div v-if="slotProps.data.inumDto">
              <a-button
                icon="caret-right"
                shape="circle"
                @click="displayRecord(slotProps.data)"
              >
              </a-button>
            </div>
          </template>
          <template v-slot:downloadTemp="slotProps">
            <div v-if="slotProps.data.inumDto">
              <a-button
                v-if="authComponent.COM_RECORD_RESULT_DOWNLOAD.show"
                :disabled="!authComponent.COM_RECORD_RESULT_DOWNLOAD.enable"
                icon="caret-down"
                shape="circle"
                @click="downloadRecord(slotProps.data)"
              >
              </a-button>
            </div>
          </template>
        </FblDataGrid>
      </a-col>
    </a-row>
  </div>
</template>
<script src="./GetRecordPage.ts" lang="ts"></script>

<style lang="less" scoped>
.casePage {
  padding: 5px 15px 20px;
  background: @COLOR-MAIN11;
  .ant-form-item {
    margin-bottom: 0;
  }
}

.datePicker__interval {
  .mx-datepicker {
    flex: 1;
  }
  .interval__symbol {
    margin: 0 5px;
  }
}

.searchBar {
  margin: 15px auto 0;
  .ant-btn {
    margin: 0 5px;
  }
}

.dataNumBar {
  margin: 0 30px;
}

.fbl-table {
  padding-left: 24px;
  padding-right: 12px;
  margin: 10px 0;
}
</style>