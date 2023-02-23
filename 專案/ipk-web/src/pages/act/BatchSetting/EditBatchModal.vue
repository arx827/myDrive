<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    :title="modalTitle"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :footer="null"
    :body-style="{ maxHeight: '780px', overflow: 'hidden', overflowY: 'scroll'}"
    :destroyOnClose="true"
    @cancel="closeEditBatchModal('cancel')"
  >
    <div>
      <div class="modal__body">
        <a-form-model
          ref="formRef"
          :model="editForm"
          :rules="editFormRules"
          :layout="'vertical'"
        >
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="12">
              <a-form-model-item prop="jobDesc" label="批次描述">
                <a-input
                  v-model.trim="editForm.jobDesc"
                  :maxLength="30"
                  placeholder="請輸入"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="qrtzUrl" label="URL">
                <a-input
                  v-model.trim="editForm.qrtzUrl"
                  :maxLength="200"
                  placeholder="請輸入"
                  style="width: 100%"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item prop="isExecutable" label="是否開啟排程">
                <a-switch v-model="editForm.isExecutable" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="排程異動前">
                <div class="trigger_detail_block">
                  <div class="pb-2">
                    {{ editForm.cronTrigger }}
                  </div>
                  <div v-for="(item, index) in beforeTriggerNameList" :key="index">
                    {{ item }}
                  </div>
                  <div>觸發排程</div>
                </div>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="排程異動後">
                <div class="trigger_detail_block">
                  <div class="pb-2">
                    {{ cron }}
                  </div>
                  <div v-for="(item, index) in afterTriggerNameList" :key="index">
                    {{ item }}
                  </div>
                  <div>觸發排程</div>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 排程設定區塊 -->
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="24">
              <a-form-model-item class="setting_block" prop="cronTrigger" label="排程設定">
                <a-tabs v-model="activeKey">
                  <!-- 月 -->
                  <a-tab-pane key="1" tab="月" class="tab_block">
                    <a-row>
                      <a-radio-group v-model="result.month.optionValue">
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.ONE">
                          每月
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.TWO">
                          從
                          <a-input-number
                            v-model="result.month.rangeStart"
                            :min="1"
                            :max="12"
                            :step="1"
                            class="inputNumberStyle"
                          />
                          月~
                          <a-input-number
                            v-model="result.month.rangeEnd"
                            :min="1"
                            :max="12"
                            :step="1"
                            class="inputNumberStyle"
                          />月
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.THREE">
                          從
                          <a-input-number
                            v-model="result.month.periodStart"
                            :min="1"
                            :max="11"
                            :step="1"
                            class="inputNumberStyle"
                            @change="setValueBelowMaxValue('month','periodStart','periodEnd',12)"
                          />
                          月開始，每
                          <a-input-number
                            v-model="result.month.periodEnd"
                            :min="1"
                            :max="12"
                            :step="1"
                            class="inputNumberStyle"
                            @change="setValueBelowMaxValue('month','periodStart','periodEnd',12)"
                          />
                          月執行一次
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.FOUR">
                          指定
                          <a-select
                            ref="multiSelect"
                            v-model="result.month.specified"
                            style="width:690px"
                            mode="multiple"
                            allowClear
                            :maxTagCount="10"
                            placeholder="請選擇"
                            :filter-option="filterOption"
                            @change="result.month.optionValue = $actEnum.numberConstant.FOUR"
                          >
                            <div slot="dropdownRender" slot-scope="menu">
                              <v-nodes :vnodes="menu" />
                              <a-divider class="dropdownRender__divider__block" />
                              <div
                                class="dropdownRender__block btnGroup text-left"
                                @mousedown="e => e.preventDefault()"
                              >
                                <div class="mt-1" @click="selectALL('month',monthOptionList)">
                                  <a-icon type="plus" /> 全選
                                </div>
                                <div class="mt-2" @click="clearALL('month')">
                                  <a-icon type="minus" /> 清空
                                </div>
                              </div>
                            </div>
                            <a-select-option
                              v-for="(option, index) in monthOptionList"
                              :key="index"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </a-select-option>
                          </a-select>
                        </a-radio>
                      </a-radio-group>
                    </a-row>
                  </a-tab-pane>
                  <!-- 日&週 -->
                  <a-tab-pane key="2" tab="日" class="tab_block">
                    <a-row>
                      <a-radio-group v-model="result.day.optionValue" @change="setWeekSpecifiedValue()">
                        <!-- 日 -->
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.ONE">
                          每日
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.TWO">
                          從
                          <a-input-number
                            v-model="result.day.periodStart"
                            :min="1"
                            :max="30"
                            :step="1"
                            class="inputNumberStyle"
                            @change="setValueBelowMaxValue('day','periodStart','periodEnd',31)"
                          />
                          日開始，每
                          <a-input-number
                            v-model="result.day.periodEnd"
                            :min="1"
                            :max="31"
                            :step="1"
                            class="inputNumberStyle"
                            @change="setValueBelowMaxValue('day','periodStart','periodEnd',31)"
                          />
                          天執行一次
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.THREE">
                          當月的最後一天
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.FOUR">
                          指定
                          <a-select
                            ref="multiSelect"
                            v-model="result.day.specified"
                            style="width:690px"
                            mode="multiple"
                            allowClear
                            :maxTagCount="10"
                            placeholder="請選擇"
                            :filter-option="filterOption"
                            @change="result.day.optionValue = $actEnum.numberConstant.FOUR"
                          >
                            <div slot="dropdownRender" slot-scope="menu">
                              <v-nodes :vnodes="menu" />
                              <a-divider class="dropdownRender__divider__block" />
                              <div
                                class="dropdownRender__block btnGroup text-left"
                                @mousedown="e => e.preventDefault()"
                              >
                                <div class="mt-1" @click="selectALL('day',dayOptionList)">
                                  <a-icon type="plus" /> 全選
                                </div>
                                <div class="mt-2" @click="clearALL('day')">
                                  <a-icon type="minus" /> 清空
                                </div>
                              </div>
                            </div>
                            <a-select-option
                              v-for="(option, index) in dayOptionList"
                              :key="index"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </a-select-option>
                          </a-select>
                        </a-radio>
                        <!-- 週 -->
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.FIVE">
                          從
                          <a-select
                            v-model="result.week.periodStart"
                            class="inputNumberStyle"
                            @change="result.day.optionValue = $actEnum.numberConstant.FIVE"
                          >
                            <a-select-option
                              v-for="(option,index) in weekCheckOptionList"
                              :key="index"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </a-select-option>
                          </a-select>
                          開始，每
                          <a-input-number
                            v-model="result.week.periodEnd"
                            :min="1"
                            :max="7"
                            :step="1"
                            class="inputNumberStyle"
                          />
                          週執行一次
                        </a-radio>
                        <a-radio class="radioStyle" :value="$actEnum.numberConstant.SIX">
                          指定
                          <a-checkbox-group
                            v-model="result.week.specified"
                            name="checkboxGroup"
                            :options="weekCheckOptionList"
                            class="ms-1"
                            @change="result.day.optionValue = $actEnum.numberConstant.SIX"
                          >
                            <span slot="label" slot-scope="option" :title="option.label">
                              {{ option.label }}
                            </span>
                          </a-checkbox-group>
                        </a-radio>
                      </a-radio-group>
                    </a-row>
                  </a-tab-pane>
                  <!-- 時 / 分 / 秒 -->
                  <a-tab-pane key="3" tab="時 / 分 / 秒" class="tab_block">
                    <a-collapse v-model="activeCollapseKey">
                      <a-collapse-panel key="1" header="時">
                        <!-- 時 -->
                        <a-row>
                          <a-radio-group v-model="result.hour.optionValue">
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.ONE">
                              每小時
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.TWO">
                              從
                              <a-input-number
                                v-model="result.hour.rangeStart"
                                :min="0"
                                :max="23"
                                :step="1"
                                class="inputNumberStyle"
                              />
                              點~
                              <a-input-number
                                v-model="result.hour.rangeEnd"
                                :min="1"
                                :max="23"
                                :step="1"
                                class="inputNumberStyle"
                              />
                              點
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.THREE">
                              從
                              <a-input-number
                                v-model="result.hour.periodStart"
                                :min="0"
                                :max="22"
                                :step="1"
                                class="inputNumberStyle"
                                @change="setValueBelowMaxValue('hour','periodStart','periodEnd',23)"
                              />
                              點開始，每
                              <a-input-number
                                v-model="result.hour.periodEnd"
                                :min="1"
                                :max="23"
                                :step="1"
                                class="inputNumberStyle"
                                @change="setValueBelowMaxValue('hour','periodStart','periodEnd',23)"
                              />
                              小時執行一次
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.FOUR">
                              指定
                              <a-select
                                ref="multiSelect"
                                v-model="result.hour.specified"
                                style="width:670px"
                                mode="multiple"
                                allowClear
                                :maxTagCount="10"
                                placeholder="請選擇"
                                :filter-option="filterOption"
                                @change="result.hour.optionValue = $actEnum.numberConstant.FOUR"
                              >
                                <div slot="dropdownRender" slot-scope="menu">
                                  <v-nodes :vnodes="menu" />
                                  <a-divider class="dropdownRender__divider__block" />
                                  <div
                                    class="dropdownRender__block btnGroup text-left"
                                    @mousedown="e => e.preventDefault()"
                                  >
                                    <div class="mt-1" @click="selectALL('hour',hourOptionList)">
                                      <a-icon type="plus" /> 全選
                                    </div>
                                    <div class="mt-2" @click="clearALL('hour')">
                                      <a-icon type="minus" /> 清空
                                    </div>
                                  </div>
                                </div>
                                <a-select-option
                                  v-for="(option, index) in hourOptionList"
                                  :key="index"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </a-select-option>
                              </a-select>
                            </a-radio>
                          </a-radio-group>
                        </a-row>
                      </a-collapse-panel>
                      <!-- 分 -->
                      <a-collapse-panel key="2" header="分">
                        <a-row>
                          <a-radio-group v-model="result.minute.optionValue">
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.ONE">
                              每分鐘
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.TWO">
                              從
                              <a-input-number
                                v-model="result.minute.rangeStart"
                                :min="0"
                                :max="59"
                                :step="1"
                                class="inputNumberStyle"
                              />
                              分~
                              <a-input-number
                                v-model="result.minute.rangeEnd"
                                :min="0"
                                :max="59"
                                :step="1"
                                class="inputNumberStyle"
                              />
                              分
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.THREE">
                              從
                              <a-input-number
                                v-model="result.minute.periodStart"
                                :min="0"
                                :max="58"
                                :step="1"
                                class="inputNumberStyle"
                                @change="setValueBelowMaxValue('minute','periodStart','periodEnd',59)"
                              />
                              分開始，每
                              <a-input-number
                                v-model="result.minute.periodEnd"
                                :min="1"
                                :max="59"
                                :step="1"
                                class="inputNumberStyle"
                                @change="setValueBelowMaxValue('minute','periodStart','periodEnd',59)"
                              />
                              分鐘執行一次
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.FOUR">
                              指定
                              <a-select
                                ref="multiSelect"
                                v-model="result.minute.specified"
                                style="width:670px"
                                mode="multiple"
                                allowClear
                                :maxTagCount="10"
                                placeholder="請選擇"
                                :filter-option="filterOption"
                                @change="result.minute.optionValue = $actEnum.numberConstant.FOUR"
                              >
                                <div slot="dropdownRender" slot-scope="menu">
                                  <v-nodes :vnodes="menu" />
                                  <a-divider class="dropdownRender__divider__block" />
                                  <div
                                    class="dropdownRender__block btnGroup text-left"
                                    @mousedown="e => e.preventDefault()"
                                  >
                                    <div class="mt-1" @click="selectALL('minute',minuteOptionList)">
                                      <a-icon type="plus" /> 全選
                                    </div>
                                    <div class="mt-2" @click="clearALL('minute')">
                                      <a-icon type="minus" /> 清空
                                    </div>
                                  </div>
                                </div>
                                <a-select-option
                                  v-for="(option, index) in minuteOptionList"
                                  :key="index"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </a-select-option>
                              </a-select>
                            </a-radio>
                          </a-radio-group>
                        </a-row>
                      </a-collapse-panel>
                      <!-- 秒 -->
                      <a-collapse-panel key="3" header="秒">
                        <a-row>
                          <a-radio-group v-model="result.second.optionValue">
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.ONE">
                              從
                              <a-input-number
                                v-model="result.second.periodStart"
                                :min="10"
                                :max="40"
                                :step="10"
                                class="inputNumberStyle"
                                @change="setValueBelowMaxValue('second','periodStart','periodEnd',50)"
                              />
                              秒開始，每
                              <a-input-number
                                v-model="result.second.periodEnd"
                                :min="10"
                                :max="50"
                                :step="10"
                                class="inputNumberStyle"
                                @change="setValueBelowMaxValue('second','periodStart','periodEnd',50)"
                              />
                              秒執行一次
                            </a-radio>
                            <a-radio class="radioStyle" :value="$actEnum.numberConstant.TWO">
                              指定
                              <a-select
                                ref="multiSelect"
                                v-model="result.second.specified"
                                style="width:670px"
                                mode="multiple"
                                allowClear
                                :maxTagCount="10"
                                placeholder="請選擇"
                                :filter-option="filterOption"
                                @change="result.second.optionValue = $actEnum.numberConstant.TWO"
                              >
                                <div slot="dropdownRender" slot-scope="menu">
                                  <v-nodes :vnodes="menu" />
                                  <a-divider class="dropdownRender__divider__block" />
                                  <div
                                    class="dropdownRender__block btnGroup text-left"
                                    @mousedown="e => e.preventDefault()"
                                  >
                                    <div class="mt-1" @click="selectALL('second',secondOptionList)">
                                      <a-icon type="plus" /> 全選
                                    </div>
                                    <div class="mt-2" @click="clearALL('second')">
                                      <a-icon type="minus" /> 清空
                                    </div>
                                  </div>
                                </div>
                                <a-select-option
                                  v-for="(option, index) in secondOptionList"
                                  :key="index"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </a-select-option>
                              </a-select>
                            </a-radio>
                          </a-radio-group>
                        </a-row>
                      </a-collapse-panel>
                    </a-collapse>
                  </a-tab-pane>
                </a-tabs>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="modal__btn__wrap btnGroup">
        <IpkButton
          buttonType="lightBlue"
          buttonText="取消"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeEditBatchModal('cancel')"
        />
        <IpkButton
          buttonType="primary"
          buttonText="儲存"
          iconType="save"
          :childrenTab="$childrenTab.childrenTab.BATCH_SETTING_TAB.val"
          :buttonKey="$buttonKey.buttonKey.MODIFY.val"
          @handleBtnEmit="saveInfo"
        />
      </div>
    </div>
  </a-modal>
</template>
<script src="./EditBatchModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
  .setting_block {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .radioStyle {
    display: block;
    height: 50px;
    line-height: 50px;
  }
  .inputNumberStyle {
    width: 100px;
    margin: 0 5px;
  }
  .trigger_detail_block {
    border: #0000002b 1px solid;
    padding: 10px;
    border-radius: 5px;
  }

::v-deep {
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-form-vertical .ant-form-item-label, .ant-col-24.ant-form-item-label, .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    color: unset !important;
    height: 32px;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
    height: 32px;
  }
  .ant-tabs-nav-scroll {
    background-color: unset !important;
    box-shadow: unset !important;
  }
}
</style>
