<template>
  <div class="mt-1 search__wrap">
    <div class="ant-advanced-search-form">
      <slot :name="'content'">
        <a-form-model
          ref="formRef"
          :model="advancedSearchForm"
          :rules="formRules"
          :layout="'vertical'"
        >
          <template v-if="!isEmpty(advancedSearchForm) || !isEmpty(labelList)">
            <!-- 一般查詢欄位 -->
            <a-row :gutter="[12]" type="flex" :wrap="true">
              <template v-for="(item, key, index) in advancedSearchForm">
                <a-col
                  v-if="index < defaultCount"
                  :key="index"
                  :span="6"
                >
                  <a-form-model-item :ref="key" :prop="key" :label="labelList[index].label">
                    <!-- 文字輸入框 -->
                    <a-input
                      v-if="labelList[index].type === 'inputText'"
                      v-model.trim="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      :maxLength="isEmpty(labelList[index].maxlength) ? 100 : labelList[index].maxlength"
                    />
                    <!-- 數字輸入框 -->
                    <a-input-number
                      v-if="labelList[index].type === 'inputNum'"
                      v-model="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      style="width: 100%"
                      :min="0"
                    />
                    <!-- 日期(時間 => 判斷渲染) -->
                    <a-date-picker
                      v-if="labelList[index].type === 'datePicker'"
                      v-model="advancedSearchForm[key]"
                      :format="(labelList[index].showTime) ? ('YYYY/MM/DD'+labelList[index].showTimeFormat) : 'YYYY/MM/DD'"
                      :placeholder="labelList[index].placeholder"
                      style="width: 100%"
                      :show-time="(labelList[index].showTime) ? { format: labelList[index].showTimeFormat } : null"
                      @change="onChange($event, index)"
                      @ok="onOk($event, index)"
                    />
                    <!-- 區間日期(時間 => 判斷渲染) -->
                    <a-range-picker
                      v-if="labelList[index].type === 'rangePicker'"
                      v-model="advancedSearchForm[key]"
                      :show-time="(labelList[index].showTime) ? { format: labelList[index].showTimeFormat } : null"
                      :format="(labelList[index].showTime) ? ('YYYY/MM/DD'+labelList[index].showTimeFormat) : 'YYYY/MM/DD' "
                      :placeholder="(labelList[index].showTime) ?
                        [('yyyy/mm/dd'+labelList[index].showTimeFormat), ('yyyy/mm/dd'+labelList[index].showTimeFormat)] : ['yyyy/mm/dd', 'yyyy/mm/dd']"
                      style="width: 100%"
                      @change="onChange($event, index)"
                      @ok="onOk($event, index)"
                    />
                    <!-- 區間日期(僅選擇月份) -->
                    <a-range-picker
                      v-if="labelList[index].type === 'monthPicker'"
                      ref="monthPicker"
                      v-model="advancedSearchForm[key]"
                      format="YYYY/MM"
                      :placeholder="['yyyy/mm', 'yyyy/mm']"
                      :mode="['month', 'month']"
                      @panelChange="handlePanelChange($event, key)"
                      @change="handleMonthPickerChange($event, key)"
                    >
                      <template slot="renderExtraFooter">
                        <!-- TODO: 日期裡的確定，待修改 -->
                        <button
                          size="small"
                          class="monthPicker_close btn__main btn__main--lightBlue"
                          @click="handleCloseMonthPicker"
                        >
                          確定
                        </button>
                      </template>
                    </a-range-picker>
                    <!-- 單選下拉(模糊查詢 => 判斷渲染) -->
                    <a-select
                      v-if="labelList[index].type === 'singleSelect' && isEmpty(labelList[index].showSelfDefined)"
                      v-model="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      allowClear
                      :show-search="labelList[index].showSearch"
                      :labelInValue="(labelList[index].labelInValue) ? true : false"
                      optionFilterProp="children"
                      :filter-option="false"
                      @search="handleFilterOption($event, index)"
                      @inputKeydown="deleteInputValue(key, $event)"
                    >
                      <a-select-option
                        v-for="(singleSelect, index1) in labelList[index].allOptions"
                        :key="index1"
                        :value="singleSelect.value"
                      >
                        {{ singleSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 單選下拉(客製化模糊查詢) -->
                    <a-select
                      v-if="labelList[index].type === 'singleSelect' && !isEmpty(labelList[index].showSelfDefined)"
                      :ref="`${key}`"
                      v-model="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      allowClear
                      show-search
                      :labelInValue="(labelList[index].labelInValue) ? true : false"
                      optionFilterProp="children"
                      :filter-option="false"
                      @select="labelList[index].showSelfDefined.filterOptions = []"
                      @blur="clearSearchInput(`${key}`), labelList[index].showSelfDefined.filterOptions = []"
                      @search="handleOption($event, labelList[index].options, index)"
                      @inputKeydown="deleteInputValue(key, $event)"
                    >
                      <a-select-option
                        v-for="(singleSelect, index1) in labelList[index].showSelfDefined.filterOptions"
                        :key="index1"
                        :value="singleSelect.value"
                      >
                        {{ singleSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 多選下拉(模糊查詢 => 判斷渲染) -->
                    <a-select
                      v-if="labelList[index].type === 'multiSelect'"
                      ref="multiSelect"
                      v-model="advancedSearchForm[key]"
                      mode="multiple"
                      allowClear
                      :maxTagCount="2"
                      :placeholder="labelList[index].placeholder"
                      :filter-option="(labelList[index].showSearch) ? filterOption : false"
                    >
                      <div slot="dropdownRender" slot-scope="menu">
                        <v-nodes :vnodes="menu" />
                        <a-divider class="dropdownRender__divider__block" />
                        <div
                          class="dropdownRender__block btnGroup text-left"
                          @mousedown="e => e.preventDefault()"
                        >
                          <div class="mt-1" @click="selectALL(key, index)">
                            <a-icon type="plus" /> 全選
                          </div>
                          <div class="mt-2" @click="clearALL(key)">
                            <a-icon type="minus" /> 清空
                          </div>
                        </div>
                      </div>
                      <a-select-option
                        v-for="(multiSelect, index2) in labelList[index].options"
                        :key="index2"
                        :value="multiSelect.value"
                      >
                        {{ multiSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 開關 -->
                    <a-switch
                      v-if="labelList[index].type === 'switch'"
                      v-model="advancedSearchForm[key]"
                      :checked-children="labelList[index].switchCheckedText"
                      :un-checked-children="labelList[index].switchUnCheckedText"
                      class="switch_wrap"
                    />
                    <!-- 可切換格式的日期欄位 -->
                    <!-- for formRules驗證用，實際不顯示於畫面 -->
                    <a-range-picker
                      v-if="labelList[index].type === 'switchDate' && !labelList[index].showInputText"
                      v-show="false"
                      v-model="advancedSearchForm[key]"
                      :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                    >
                      <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                    <a-input
                      v-if="labelList[index].type === 'switchDate' && labelList[index].showInputText"
                      v-show="false"
                      v-model.trim="advancedSearchForm[key]"
                      style="width: 100%"
                      placeholder="請輸入日期(yyyy或yyyymm)"
                      allowClear
                      :maxLength="7"
                    />
                    <!-- 實際會顯示於畫面的元件 -->
                    <a-row v-if="labelList[index].type === 'switchDate'" type="flex" :wrap="true">
                      <a-col v-if="!labelList[index].showInputText" :span="21">
                        <a-range-picker
                          v-model="advancedSearchForm[key]"
                          :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                        >
                          <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                      </a-col>
                      <a-col v-if="labelList[index].showInputText" class="inputDate" :span="21">
                        <a-input
                          v-model.trim="advancedSearchForm[key]"
                          style="width: 100%"
                          placeholder="請輸入日期(yyyy或yyyymm)"
                          allowClear
                          :maxLength="7"
                          @blur="()=>{$refs[key][0].onFieldBlur()}"
                        />
                      </a-col>
                      <a-col :span="1" class="ms-1">
                        <a-tooltip placement="top" title="切換" arrow-point-at-center>
                          <a-button
                            class="btn__select--default"
                            @click="switchDateFormat('advancedSearch', index, key)"
                          >
                            <a-icon type="retweet" />
                          </a-button>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
              </template>
            </a-row>
            <!-- 進階查詢欄位   -->
            <a-row v-if="Object.keys(advancedSearchForm).length > defaultCount" :gutter="[12]" type="flex" :wrap="true">
              <template v-for="(item, key, index) in advancedSearchForm">
                <a-col
                  v-if="index >= defaultCount && expand"
                  :key="index"
                  :span="6"
                >
                  <a-form-model-item :ref="key+'Advanced'" :prop="key" :label="labelList[index].label">
                    <!-- 文字輸入框 -->
                    <a-input
                      v-if="labelList[index].type === 'inputText'"
                      v-model.trim="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      :maxLength="isEmpty(labelList[index].maxlength) ? 100 : labelList[index].maxlength"
                    />
                    <!-- 數字輸入框 -->
                    <a-input-number
                      v-if="labelList[index].type === 'inputNum'"
                      v-model="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      style="width: 100%"
                      :min="0"
                    />
                    <!-- 日期(時間 => 判斷渲染) -->
                    <a-date-picker
                      v-if="labelList[index].type === 'datePicker'"
                      v-model="advancedSearchForm[key]"
                      :format="(labelList[index].showTime) ? ('YYYY/MM/DD'+labelList[index].showTimeFormat) : 'YYYY/MM/DD'"
                      :placeholder="labelList[index].placeholder"
                      style="width: 100%"
                      :show-time="(labelList[index].showTime) ? { format: labelList[index].showTimeFormat } : null"
                      @change="onChange($event, index)"
                      @ok="onOk($event, index)"
                    />
                    <!-- 區間日期(時間 => 判斷渲染) -->
                    <a-range-picker
                      v-if="labelList[index].type === 'rangePicker'"
                      v-model="advancedSearchForm[key]"
                      :show-time="(labelList[index].showTime) ? { format: labelList[index].showTimeFormat } : null"
                      :format="(labelList[index].showTime) ? ('YYYY/MM/DD'+labelList[index].showTimeFormat) : 'YYYY/MM/DD' "
                      :placeholder="(labelList[index].showTime) ?
                        [('yyyy/mm/dd'+labelList[index].showTimeFormat), ('yyyy/mm/dd'+labelList[index].showTimeFormat)] : ['yyyy/mm/dd', 'yyyy/mm/dd']"
                      style="width: 100%"
                      @change="onChange($event, index)"
                      @ok="onOk($event, index)"
                    />
                    <!-- 區間日期(僅選擇月份) -->
                    <a-range-picker
                      v-if="labelList[index].type === 'monthPicker'"
                      ref="monthPicker"
                      v-model="advancedSearchForm[key]"
                      format="YYYY/MM"
                      :placeholder="['yyyy/mm', 'yyyy/mm']"
                      :mode="['month', 'month']"
                      @panelChange="handlePanelChange($event, key)"
                      @change="handleMonthPickerChange($event, key)"
                    >
                      <template slot="renderExtraFooter">
                        <button
                          size="small"
                          class="monthPicker_close btn__main btn__main--lightBlue"
                          @click="handleCloseMonthPicker"
                        >
                          確定
                        </button>
                      </template>
                    </a-range-picker>
                    <!-- 單選下拉(模糊查詢 => 判斷渲染) -->
                    <a-select
                      v-if="labelList[index].type === 'singleSelect' && isEmpty(labelList[index].showSelfDefined)"
                      v-model="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      allowClear
                      :show-search="labelList[index].showSearch"
                      :filter-option="false"
                      :labelInValue="(labelList[index].labelInValue) ? true : false"
                      optionFilterProp="children"
                      @search="handleFilterOption($event, index)"
                      @inputKeydown="deleteInputValue(key, $event)"
                    >
                      <a-select-option
                        v-for="(singleSelect, index1) in labelList[index].allOptions"
                        :key="index1"
                        :value="singleSelect.value"
                      >
                        {{ singleSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 單選下拉(客製化模糊查詢) -->
                    <a-select
                      v-if="labelList[index].type === 'singleSelect' && !isEmpty(labelList[index].showSelfDefined)"
                      :ref="`${key}`"
                      v-model="advancedSearchForm[key]"
                      :placeholder="labelList[index].placeholder"
                      allowClear
                      show-search
                      :labelInValue="(labelList[index].labelInValue) ? true : false"
                      optionFilterProp="children"
                      :filter-option="false"
                      @select="labelList[index].showSelfDefined.filterOptions = []"
                      @blur="clearSearchInput(`${key}`)"
                      @search="handleOption($event, labelList[index].options, index)"
                      @inputKeydown="deleteInputValue(key, $event)"
                    >
                      <a-select-option
                        v-for="(singleSelect, index1) in labelList[index].showSelfDefined.filterOptions"
                        :key="index1"
                        :value="singleSelect.value"
                      >
                        {{ singleSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 多選下拉(模糊查詢 => 判斷渲染) -->
                    <a-select
                      v-if="labelList[index].type === 'multiSelect'"
                      ref="multiSelect"
                      v-model="advancedSearchForm[key]"
                      mode="multiple"
                      allowClear
                      :maxTagCount="2"
                      :placeholder="labelList[index].placeholder"
                      :filter-option="(labelList[index].showSearch) ? filterOption : false"
                    >
                      <div slot="dropdownRender" slot-scope="menu">
                        <v-nodes :vnodes="menu" />
                        <a-divider class="dropdownRender__divider__block" />
                        <div
                          class="dropdownRender__block btnGroup text-left"
                          @mousedown="e => e.preventDefault()"
                        >
                          <div class="mt-1" @click="selectALL(key, index)">
                            <a-icon type="plus" /> 全選
                          </div>
                          <div class="mt-2" @click="clearALL(key)">
                            <a-icon type="minus" /> 清空
                          </div>
                        </div>
                      </div>
                      <a-select-option
                        v-for="(multiSelect, index2) in labelList[index].options"
                        :key="index2"
                        :value="multiSelect.value"
                      >
                        {{ multiSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 開關 -->
                    <a-switch
                      v-if="labelList[index].type === 'switch'"
                      v-model="advancedSearchForm[key]"
                      :checked-children="labelList[index].switchCheckedText"
                      :un-checked-children="labelList[index].switchUnCheckedText"
                      class="switch_wrap"
                    />
                    <!-- 可切換格式的日期欄位 -->
                    <!-- for formRules驗證用，實際不顯示於畫面 -->
                    <a-range-picker
                      v-if="labelList[index].type === 'switchDate' && !labelList[index].showInputText"
                      v-show="false"
                      v-model="advancedSearchForm[key]"
                      :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                    >
                      <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                    <a-input
                      v-if="labelList[index].type === 'switchDate' && labelList[index].showInputText"
                      v-show="false"
                      v-model.trim="advancedSearchForm[key]"
                      style="width: 100%"
                      placeholder="請輸入日期(yyyy或yyyymm)"
                      allowClear
                      :maxLength="7"
                    />
                    <!-- 實際會顯示於畫面的元件 -->
                    <a-row v-if="labelList[index].type === 'switchDate'" type="flex" :wrap="true">
                      <a-col v-if="!labelList[index].showInputText" :span="21">
                        <a-range-picker
                          v-model="advancedSearchForm[key]"
                          :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                        >
                          <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                      </a-col>
                      <a-col v-if="labelList[index].showInputText" class="inputDate" :span="21">
                        <a-input
                          v-model.trim="advancedSearchForm[key]"
                          style="width: 100%"
                          placeholder="請輸入日期(yyyy或yyyymm)"
                          allowClear
                          :maxLength="7"
                          @blur="()=>{$refs[key+'Advanced'][0].onFieldBlur()}"
                        />
                      </a-col>
                      <a-col :span="1" class="ms-1">
                        <a-tooltip placement="top" title="切換" arrow-point-at-center>
                          <a-button
                            class="btn__select--default"
                            @click="switchDateFormat('advancedSearch', index, key)"
                          >
                            <a-icon type="retweet" />
                          </a-button>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
              </template>
            </a-row>
          </template>
        </a-form-model>
      </slot>
      <!-- 按鈕 -->
      <a-row>
        <a-col :span="3">
          <div class="btn__block">
            <a-select
              v-if="usualModalShow"
              v-model="adUsualSelected"
              placeholder="請選擇常用"
              allowClear
              :labelInValue="true"
              style="width: 100%"
              @change="querySetupData('advancedSearch',adUsualSelected)"
            >
              <a-select-option
                v-for="(item, index) in usualList"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </a-col>
        <a-col :span="4">
          <IpkButton
            v-if="usualModalShow"
            class="ms-2"
            buttonType="lightBlue"
            buttonText="設定常用"
            :isAuthorize="false"
            @handleBtnEmit="openUsualModal"
          />
        </a-col>
        <a-col :span="17" class="text-end">
          <slot :name="'collapse'">
            <a v-if="!isEmpty(labelList) && labelList.length > 8" class="collapse_info me-2" @click="toggle">
              進階查詢 <a-icon :type="expand ? 'up' : 'down'" />
            </a>
            <IpkButton
              buttonType="primary"
              buttonText="查詢"
              iconType="search"
              :childrenTab="childrenTab"
              :buttonKey="$buttonKey.buttonKey.SEARCH.val"
              @handleBtnEmit="handleSearch"
            />
          </slot>
        </a-col>
      </a-row>
    </div>

    <!-- 設定常用Modal -->
    <a-modal
      ref="modal"
      v-model="modalUsualShow"
      title="設定常用"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :destroyOnClose="true"
      @cancel="closeUsualModal"
    >
      <div>
        <a-row class="modal__body__block">
          <a-col :span="24" class="modal-title">
            請選擇要編輯的常用查詢
          </a-col>
          <a-col :span="6" class="col-space">
            <a-select
              v-model="usual"
              placeholder="請選擇常用"
              show-search
              allowClear
              :autoFocus="true"
              :labelInValue="true"
              style="width: 100%"
              @change="querySetupData('usual',usual)"
            >
              <a-select-option
                v-for="(item, index) in usualList"
                :key="index"
                :value="item.value"
                :disabled="!item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="18" class="btnGroup">
            <IpkButton
              buttonType="lightBlue"
              buttonText="新增"
              :isAuthorize="false"
              @handleBtnEmit="openSetupNameModal($actEnum.constant.ADD)"
            />
            <IpkButton
              buttonType="lightBlue"
              buttonText="刪除"
              :buttonDisabled="btnDisabled"
              :isAuthorize="false"
              @handleBtnEmit="openDeleteSetupModal"
            />
            <IpkButton
              buttonType="lightBlue"
              buttonText="重新命名"
              :buttonDisabled="btnDisabled"
              :isAuthorize="false"
              @handleBtnEmit="openSetupNameModal($actEnum.constant.RENAME)"
            />
          </a-col>
        </a-row>
        <div><a-divider /></div>
        <!-- 設定常用區塊 -->
        <div class="modal__body">
          <slot :name="'usualContent'">
            <a-form-model
              ref="usualFormRef"
              :model="usualForm"
              :rules="formRules"
              :layout="'vertical'"
            >
              <a-row v-if="!isEmpty(usualForm) || !isEmpty(labelList)" :gutter="[16]" type="flex" :wrap="true">
                <a-col
                  v-for="(item, key, index) in usualForm"
                  :key="index"
                  :span="6"
                >
                  <a-form-model-item :ref="key+'Usual'" :prop="key" :label="labelList[index].label">
                    <!-- 文字輸入框 -->
                    <a-input
                      v-if="labelList[index].type === 'inputText'"
                      v-model.trim="usualForm[key]"
                      :placeholder="labelList[index].placeholder"
                      :maxLength="isEmpty(labelList[index].maxlength) ? 100 : labelList[index].maxlength"
                    />
                    <!-- 數字輸入框 -->
                    <a-input-number
                      v-if="labelList[index].type === 'inputNum'"
                      v-model="usualForm[key]"
                      :placeholder="labelList[index].placeholder"
                      style="width: 100%"
                      :min="0"
                    />
                    <!-- 日期(時間 => 判斷渲染) -->
                    <a-date-picker
                      v-if="labelList[index].type === 'datePicker'"
                      v-model="usualForm[key]"
                      :format="(labelList[index].showTime) ? ('YYYY/MM/DD'+labelList[index].showTimeFormat) : 'YYYY/MM/DD'"
                      :placeholder="labelList[index].placeholder"
                      style="width: 100%"
                      :show-time="(labelList[index].showTime) ? { format: labelList[index].showTimeFormat } : null"
                      @change="onChange($event, index)"
                      @ok="onOk($event, index)"
                    />
                    <!-- 區間日期(時間 => 判斷渲染) -->
                    <a-range-picker
                      v-if="labelList[index].type === 'rangePicker'"
                      v-model="usualForm[key]"
                      :show-time="(labelList[index].showTime) ? { format: labelList[index].showTimeFormat } : null"
                      :format="(labelList[index].showTime) ? ('YYYY/MM/DD'+labelList[index].showTimeFormat) : 'YYYY/MM/DD' "
                      :placeholder="(labelList[index].showTime) ?
                        [('yyyy/mm/dd'+labelList[index].showTimeFormat), ('yyyy/mm/dd'+labelList[index].showTimeFormat)] : ['yyyy/mm/dd', 'yyyy/mm/dd']"
                      style="width: 100%"
                      @change="onChange($event, index)"
                      @ok="onOk($event, index)"
                    />
                    <!-- 區間日期(僅選擇月份) -->
                    <a-range-picker
                      v-if="labelList[index].type === 'monthPicker'"
                      ref="monthPicker"
                      v-model="usualForm[key]"
                      format="YYYY/MM"
                      :placeholder="['yyyy/mm', 'yyyy/mm']"
                      :mode="['month', 'month']"
                      @panelChange="handlePanelChange($event, key)"
                      @change="handleMonthPickerChange($event, key)"
                    >
                      <template slot="renderExtraFooter">
                        <!-- TODO: 日期裡的確定，待修改 -->
                        <button
                          size="small"
                          class="monthPicker_close btn__main btn__main--lightBlue"
                          @click="handleCloseMonthPicker"
                        >
                          確定
                        </button>
                      </template>
                    </a-range-picker>
                    <!-- 單選下拉(模糊查詢 => 判斷渲染) -->
                    <a-select
                      v-if="labelList[index].type === 'singleSelect' && isEmpty(labelList[index].showSelfDefined)"
                      v-model="usualForm[key]"
                      :placeholder="labelList[index].placeholder"
                      allowClear
                      :show-search="labelList[index].showSearch"
                      :labelInValue="(labelList[index].labelInValue) ? true : false"
                      optionFilterProp="children"
                      :filter-option="false"
                      @search="handleFilterOption($event, index)"
                      @inputKeydown="deleteInputValue(key, $event)"
                    >
                      <a-select-option
                        v-for="(singleSelect, index1) in labelList[index].allOptions"
                        :key="index1"
                        :value="singleSelect.value"
                      >
                        {{ singleSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 單選下拉(客製化模糊查詢) -->
                    <a-select
                      v-if="labelList[index].type === 'singleSelect' && !isEmpty(labelList[index].showSelfDefined)"
                      :ref="`${key}`"
                      v-model="usualForm[key]"
                      :placeholder="labelList[index].placeholder"
                      allowClear
                      show-search
                      :labelInValue="(labelList[index].labelInValue) ? true : false"
                      optionFilterProp="children"
                      :filter-option="false"
                      @select="labelList[index].showSelfDefined.filterOptions = []"
                      @blur="clearSearchInput(`${key}`)"
                      @search="handleOption($event, labelList[index].options, index)"
                      @inputKeydown="deleteInputValue(key, $event)"
                    >
                      <a-select-option
                        v-for="(singleSelect, index1) in labelList[index].showSelfDefined.filterOptions"
                        :key="index1"
                        :value="singleSelect.value"
                      >
                        {{ singleSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 多選下拉(模糊查詢 => 判斷渲染) -->
                    <a-select
                      v-if="labelList[index].type === 'multiSelect'"
                      ref="multiSelect"
                      v-model="usualForm[key]"
                      mode="multiple"
                      allowClear
                      :maxTagCount="2"
                      :placeholder="labelList[index].placeholder"
                      :filter-option="(labelList[index].showSearch) ? filterOption : false"
                    >
                      <div slot="dropdownRender" slot-scope="menu">
                        <v-nodes :vnodes="menu" />
                        <a-divider class="dropdownRender__divider__block" />
                        <div
                          class="dropdownRender__block btnGroup text-left"
                          @mousedown="e => e.preventDefault()"
                        >
                          <div class="mt-1" @click="selectALL(key, index)">
                            <a-icon type="plus" /> 全選
                          </div>
                          <div class="mt-2" @click="clearALL(key)">
                            <a-icon type="minus" /> 清空
                          </div>
                        </div>
                      </div>
                      <a-select-option
                        v-for="(multiSelect, index2) in labelList[index].options"
                        :key="index2"
                        :value="multiSelect.value"
                      >
                        {{ multiSelect.label }}
                      </a-select-option>
                    </a-select>
                    <!-- 開關 -->
                    <a-switch
                      v-if="labelList[index].type === 'switch'"
                      v-model="usualForm[key]"
                      :checked-children="labelList[index].switchCheckedText"
                      :un-checked-children="labelList[index].switchUnCheckedText"
                      class="switch_wrap"
                    />
                    <!-- 可切換格式的日期欄位 -->
                    <!-- for formRules驗證用，實際不顯示於畫面 -->
                    <a-range-picker
                      v-if="labelList[index].type === 'switchDate' && !labelList[index].showInputText"
                      v-show="false"
                      v-model="usualForm[key]"
                      :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                    >
                      <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                    <a-input
                      v-if="labelList[index].type === 'switchDate' && labelList[index].showInputText"
                      v-show="false"
                      v-model.trim="usualForm[key]"
                      style="width: 100%"
                      placeholder="請輸入日期(yyyy或yyyymm)"
                      allowClear
                      :maxLength="7"
                    />
                    <!-- 實際會顯示於畫面的元件 -->
                    <a-row v-if="labelList[index].type === 'switchDate'" type="flex" :wrap="true">
                      <a-col v-if="!labelList[index].showInputText" :span="21">
                        <a-range-picker
                          v-model="usualForm[key]"
                          :placeholder="['yyyy/mm/dd', 'yyyy/mm/dd']"
                        >
                          <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                      </a-col>
                      <a-col v-if="labelList[index].showInputText" class="inputDate" :span="21">
                        <a-input
                          v-model.trim="usualForm[key]"
                          style="width: 100%"
                          placeholder="請輸入日期(yyyy或yyyymm)"
                          allowClear
                          :maxLength="7"
                          @blur="()=>{$refs[key+'Usual'][0].onFieldBlur()}"
                        />
                      </a-col>
                      <a-col :span="1" class="ms-1">
                        <a-tooltip placement="top" title="切換" arrow-point-at-center>
                          <a-button
                            class="btn__select--default"
                            @click="switchDateFormat('usual', index, key)"
                          >
                            <a-icon type="retweet" />
                          </a-button>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </slot>
        </div>
      </div>
      <template slot="footer">
        <IpkButton
          buttonType="lightBlue"
          buttonText="關閉"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeUsualModal"
        />
        <IpkButton
          buttonType="primary"
          buttonText="儲存"
          iconType="save"
          :buttonDisabled="saveButtonDisabled"
          :isAuthorize="false"
          @handleBtnEmit="submitSaveUsual(null)"
        />
      </template>
    </a-modal>

    <!-- 新增/重新命名彈窗 -->
    <a-modal
      v-model="inputModalVisible"
      :title="settingAction===$actEnum.constant.ADD ? '新增常用' : '重新命名'"
      :destroyOnClose="true"
    >
      <div class="modal__body">
        <div>{{ modalContent }}</div>
        <a-input
          v-model.trim="usualName"
          class="my-2"
          :maxLength="15"
          @change="validateInputValue"
        />
      </div>
      <template slot="footer">
        <IpkButton
          buttonType="lightBlue"
          buttonText="關閉"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="inputModalVisible=false"
        />
        <IpkButton
          buttonType="primary"
          buttonText="確定"
          iconType="save"
          :buttonDisabled="okButtonDisabled"
          :isAuthorize="false"
          @handleBtnEmit="submitUsual"
        />
      </template>
    </a-modal>
  </div>
</template>
<script src="./AdvancedSearch.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-advanced-search-form {
    // padding: 5px 12px;
    // box-shadow: 0px 2px 6px #00000029;
    padding: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
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
}
.collapse_info {
  color: $COLOR-GRAY17;
  font-size: 14px;
}
// .btn__wrap {
//   margin-left: 20px;
// }
.btn__block {
  flex: 1;
}
.search__wrap {
  margin-bottom: 8px;
}
.select__btn--disabled{
  color: #CECECE;
  cursor: not-allowed;
}
.modal__body__block {
  padding: 12px;
  background-color: $COLOR-GRAY14;
}
.inputModalBody {
  padding: 12px;
}
.switch_wrap {
  margin: 4px 0px 0px 0px;
}
.monthPicker_close {
  color: #fff;
  background-color: #1890ff;
  border: 1px solid #1890ff;
  padding: 0 7px;
  margin: 5px 0px;
}
</style>
