<template>
  <div>
    <a-form-model
      :label-col="{ span: 10 }"
      :wrapper-col="{ span: 10 }"
      :model="custMarkChangeForm"
      :rules="custMarkFormRules"
      class="custMarkForm"
    >
      <a-row :gutter="24">
        <!-- 客戶國籍 -->
        <a-col :span="7">
          <a-form-model-item
            class="nationality"
            :label="$t('custMark_nationality')"
            prop="nationality"
            style="margin-bottom: 0px"
            :has-feedback="custMarkValidateForm.nationality.feedback"
            :validateStatus="custMarkValidateForm.nationality.state"
            required
          >
            <a-popover
              placement="top"
              :content="custMarkValidateForm.nationality.msg"
              :trigger="custMarkValidateForm.nationality.hover"
            >
              <a-select
                v-model="custMarkChangeForm.nationality"
                :options="nationalityOptions"
                :filter-option="filterOption"
                @change="onNationalityChange"
              >
              </a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
          <!-- 客戶身分證字號 -->
          <a-form-model-item
            class="custId"
            :label="$t('custMark_custId')"
            prop="custId"
            style="margin-bottom: 0px"
            :has-feedback="custMarkValidateForm.custId.feedback"
            :validateStatus="custMarkValidateForm.custId.state"
            required
          >
            <a-popover
              placement="top"
              :content="custMarkValidateForm.custId.msg"
              :trigger="custMarkValidateForm.custId.hover"
            >
              <a-input type="text" v-model="custMarkChangeForm.custId" :maxLength="10"/>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <!-- 姓名 -->
          <a-form-model-item
            class="custName"
            :label="$t('global_humanName')"
            prop="name"
            style="margin-bottom: 0px"
            :has-feedback="custMarkValidateForm.name.feedback"
            :validateStatus="custMarkValidateForm.name.state"
            required
          >
            <a-popover
              placement="top"
              :content="custMarkValidateForm.name.msg"
              :trigger="custMarkValidateForm.name.hover"
            >
              <a-input type="text" :max-length="100" v-model="custMarkChangeForm.name" />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 語言 -->
      <a-form-model-item
        class="singleCol"
        :label="$t('global_language')"
        prop="languageIdList"
        style="margin-bottom: 0px"
        :has-feedback="custMarkValidateForm.languageIdList.feedback"
        :validateStatus="custMarkValidateForm.languageIdList.state"
      >
        <a-popover
          placement="top"
          :content="custMarkValidateForm.languageIdList.msg"
          :trigger="custMarkValidateForm.languageIdList.hover"
        >
          <a-checkbox-group
            @change="onLanguageChange"
            :value="custMarkChangeForm.languageIdList"
          >
            <a-space v-for="language in languageOptions" :key="language.value">
              <a-checkbox :value="language.value">
                {{ language.label }}
              </a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-popover>
      </a-form-model-item>
      <!-- 客戶標籤 -->
      <a-form-model-item
        class="singleCol"
        :label="$t('custMark_tag')"
        prop="tagIdList"
        style="margin-bottom: 0px"
        :has-feedback="custMarkValidateForm.tagIdList.feedback"
        :validateStatus="custMarkValidateForm.tagIdList.state"
      >
        <a-popover
          placement="top"
          :content="custMarkValidateForm.tagIdList.msg"
          :trigger="custMarkValidateForm.tagIdList.hover"
        >
          <a-checkbox-group
            @change="onTagChange"
            :value="custMarkChangeForm.tagIdList"
          >
            <a-space v-for="tag in tagOptions" :key="tag.value">
              <a-checkbox :value="tag.value">
                {{ tag.label }}
              </a-checkbox>
            </a-space>
          </a-checkbox-group>
        </a-popover>
      </a-form-model-item>
      <!-- 內容 -->
      <a-form-model-item
        class="singleCol"
        :label="$t('custMark_content')"
        prop="content"
        style="margin-bottom: 0px"
        :has-feedback="custMarkValidateForm.content.feedback"
        :validateStatus="custMarkValidateForm.content.state"
        v-if="custMarkChangeForm.tagIdList.length==0"
      >
        <a-popover
          placement="top"
          :content="custMarkValidateForm.content.msg"
          :trigger="custMarkValidateForm.content.hover"
        >
          <a-textarea
            type="text"
            v-model="custMarkChangeForm.content"
            :auto-size="{ minRows: 4, maxRows: 4 }"
            :maxLength="200"
          />
        </a-popover>
      </a-form-model-item>
      <a-form-model-item
        class="singleCol"
        :label="$t('custMark_content')"
        prop="content"
        style="margin-bottom: 0px"
        :has-feedback="custMarkValidateForm.content.feedback"
        :validateStatus="custMarkValidateForm.content.state"
        required
        v-if="custMarkChangeForm.tagIdList.length>0"
      >
        <a-popover
          placement="top"
          :content="custMarkValidateForm.content.msg"
          :trigger="custMarkValidateForm.content.hover"
        >
          <a-textarea
            type="text"
            v-model="custMarkChangeForm.content"
            :auto-size="{ minRows: 4, maxRows: 4 }"
            :maxLength="200"
          />
        </a-popover>
      </a-form-model-item>
      <!-- 處理方式 -->
      <a-form-model-item
        class="singleCol"
        :label="$t('custMark_handled')"
        prop="handled"
        style="margin-bottom: 0px"
      >
        <a-textarea
          type="text"
          v-model="custMarkChangeForm.handled"
          :auto-size="{ minRows: 4, maxRows: 4 }"
          :maxLength="200"
        />
      </a-form-model-item>
      <a-row :gutter="24">
        <a-col :span="8">
          <!-- 有效區間 -->
            <a-form-model-item
            class="start"
            :label="$t('custMark_activeRange')"
            style="margin-bottom: 0px"
            :has-feedback="custMarkValidateForm.effectiveStartDate.feedback"
            :validateStatus="custMarkValidateForm.effectiveStartDate.state"
            required
          >
            <a-popover
              placement="top"
              :content="custMarkValidateForm.effectiveStartDate.msg"
              :trigger="custMarkValidateForm.effectiveStartDate.hover"
              :visible="isDateStartVisible"
              :destroyTooltipOnHide="true"
            >
              <DatePicker
                :formatter="formatter"
                @change="onStartChange"
                v-model="custMarkChangeForm.datePickerEffectiveStartDate"
                @clear="clearStartDate"
                :clearable="custMarkValidateForm.effectiveStartDate.feedback"
              >
                <a-input
                  slot="input"
                  placeholder=""
                  @pressEnter="checkManualInputStartDate"
                  :value="custMarkChangeForm.effectiveStartString"
                  @mouseover="eventMouseOverStart"
                  @mouseleave="isDateStartVisible = false"
                ></a-input>
                <i
                  v-if="custMarkValidateForm.effectiveStartDate.feedback"
                  slot="icon-calendar"
                ></i>
                <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                <i
                  v-if="custMarkValidateForm.effectiveStartDate.feedback"
                  slot="icon-clear"
                >
                <a-icon type="close-circle" theme="filled" style="color:white"/>
                </i>
              </DatePicker>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="10">
          <!-- 此處label(訖) 不會顯示出來 -->
          <a-form-model-item
            class="end"
            label="(訖)"
            style="margin-bottom: 0px"
            :has-feedback="custMarkValidateForm.effectiveEndDate.feedback"
            :validateStatus="custMarkValidateForm.effectiveEndDate.state"
          >
            <a-space>
              ~
            <a-popover
              placement="top"
              :content="custMarkValidateForm.effectiveEndDate.msg"
              :trigger="custMarkValidateForm.effectiveEndDate.hover"
              :visible="isDateEndVisible"
              :destroyTooltipOnHide="true"
            >
              <DatePicker
                :formatter="formatter"
                @change="onEndChange"
                v-model="custMarkChangeForm.effectiveEndDate"
                @clear="clearEndDate"
                :clearable="true"
              >
                <a-input
                  slot="input"
                  placeholder=""
                  @pressEnter="checkManualInputEndDate"
                  :value="custMarkChangeForm.effectiveEndString"
                  @mouseover="eventMouseOverEnd"
                  @mouseleave="isDateEndVisible = false"
                ></a-input>
                <i
                  v-if="custMarkValidateForm.effectiveEndDate.feedback"
                  slot="icon-calendar"
                ></i>
                <!-- 如果檢核有誤置換原本的叉叉icon成另一個，並設成白色避免兩個icon重疊 -->
                <i
                  v-if="custMarkValidateForm.effectiveEndDate.feedback"
                  slot="icon-clear"
                >
                <a-icon type="close-circle" theme="filled" style="color:white"/>
                </i>
              </DatePicker>
            </a-popover>
            </a-space>
            
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="6">
          <!-- 建立人員 -->
          <a-form-model-item
            class="createName"
            :label="$t('global_createStaff')"
            style="margin-bottom: 0px"
            prop="createName"
          >
            <label v-if="isEdit"
              >{{ custMarkChangeForm.createId }}-{{
                custMarkChangeForm.createName
              }}</label
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 建立時間 -->
          <a-form-model-item
            class="time"
            :label="$t('global_createDate')"
            style="margin-bottom: 0px"
            prop="createTime"
          >
            <label v-if="isEdit">{{ custMarkChangeForm.createTime }}</label>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 異動人員 -->
          <a-form-model-item
            class="updateName"
            :label="$t('global_lastChangeStaff')"
            style="margin-bottom: 0px"
            prop="updateName"
          >
            <label v-if="isEdit"
              >{{ custMarkChangeForm.updateId
              }}-{{ custMarkChangeForm.updateName }}</label
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- 異動時間 -->
          <a-form-model-item
            class="time"
            :label="$t('global_lastChangeDate')"
            style="margin-bottom: 0px"
            prop="updateTime"
          >
            <label v-if="isEdit">{{ custMarkChangeForm.updateTime }}</label>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script src="./CustMarkForm.ts" lang="ts"></script>