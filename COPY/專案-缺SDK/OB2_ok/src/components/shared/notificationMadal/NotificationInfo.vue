<template>
  <div class="section-card section__notificationInfo">
    <div class="card__title-position">
      <!-- 照會資訊 -->
      <span class="card__title">{{ $t('notificationInfo_info') }}</span>
    </div>
    <div class="card__infomation">
      <div class="noti_button_group">
      <!-- 照會單覆核 時 顯示 -->
      <!-- 在待覆核的時候都不須顯示 -->
      <a-row type="flex" justify="end" :gutter="[10, 0]" v-if="($props.propStep == notiStep.review && $route.name != 'REVIEW_MENU') || $props.isNotCloseNotify || ($route.name == 'REVIEW_MENU' && isReview)">
        <a-col>
          <!-- 照會單預覽 -->
          <a-button type="primary" @click="onPdfOpen(notiFileId)">{{$t('notificationModal_pdfPreview')}}</a-button>
        </a-col>
        <a-col>
          <!-- 案件調閱 -->
          <a-button type="primary" @click="caseCheck()">{{$t('caseCheck')}}</a-button>
        </a-col>
      </a-row>
      </div>
      <a-form-model
        :label-col="{ xs: 7, md: 6, xxl: 4 }"
        :wrapper-col="{ xs: 17, md: 18, xxl: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :rules="notiformRules"
        :model="notificationInfoForm"
        class="notificationInfoModalFormPage"
        v-if="($props.propStep != 4 || ($route.name == 'REVIEW_MENU' && !isReview)) && !$props.isNotCloseNotify"
      >
        <!-- 照會主類型 -->
        <a-row type="flex">
          <a-col :xs="24" :md="12" :xl="12" :xxl="12">
            <a-form-model-item :label="$t('notificationInfo_notiType')" 
              :has-feedback="callCommonUtilFeild(notiValidateForm.notiType).feedback"
              :validateStatus="callCommonUtilFeild(notiValidateForm.notiType).state"
              prop="notiType"
              required>

              <a-popover
                placement="top"
                :content="callCommonUtilFeild(notiValidateForm.notiType).msg"
                :trigger="callCommonUtilFeild(notiValidateForm.notiType).hover"
                :visible="callCommonUtilFeild(notiValidateForm.notiType).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(notiValidateForm.notiType)"
                :destroyTooltipOnHide="true"
              >
                <a-select
                  class="select"
                  v-model="notificationInfoForm.notiType"
                  :options="notiTypeOption"
                  :disabled="caseClosed"
                  @change="onNotiTypeChange"
                />
              
              </a-popover>
            </a-form-model-item>
          </a-col>
          <!-- 照會次類型 -->
          <a-col :xs="24" :md="12" :xl="12" :xxl="12">
            <a-form-model-item :label="$t('notificationInfo_notiSubType')" 
              :has-feedback="callCommonUtilFeild(notiValidateForm.notiSubType).feedback"
              :validateStatus="callCommonUtilFeild(notiValidateForm.notiSubType).state"
              prop="notiSubType"
              required>

              <a-popover
                placement="top"
                :content="callCommonUtilFeild(notiValidateForm.notiSubType).msg"
                :trigger="callCommonUtilFeild(notiValidateForm.notiSubType).hover"
                :visible="callCommonUtilFeild(notiValidateForm.notiSubType).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(notiValidateForm.notiSubType)"
                :destroyTooltipOnHide="true"
              >
                <a-select
                  class="select"
                  v-model="notificationInfoForm.notiSubType"
                  :options="notiSubTypeOption"
                  :disabled="notificationDisable.notiSubType || caseClosed"
                  @change="onSubTypeChange"
                />

              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <!-- 補字後內容 -->
        <a-row type="flex">
          <a-col :xs="24" :md="12" :xl="24" :xxl="24">
            <a-form-model-item 
              :label-col="{ xs: 7, md: 3, xxl: 2 }"
              :wrapper-col="{ xs: 17, md: 21, xxl: 22 }"
              :label="$t('notificationInfo_additional')" 
              :has-feedback="callCommonUtilFeild(notiValidateForm.additional).feedback"
              :validateStatus="callCommonUtilFeild(notiValidateForm.additional).state"
              prop="additional"
              required>

              <a-popover
                placement="top"
                :content="callCommonUtilFeild(notiValidateForm.additional).msg"
                :trigger="callCommonUtilFeild(notiValidateForm.additional).hover"
                :visible="callCommonUtilFeild(notiValidateForm.additional).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(notiValidateForm.additional)"
                :destroyTooltipOnHide="true"
              >
                <a-textarea
                  v-model="notificationInfoForm.additional"
                  :autoSize="{ minRows: 3, maxRows: 3 }"
                  :disabled="notificationDisable.additional || caseClosed"
                />
              
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 照會到期日 -->
        <a-row type="flex">
          <a-col :xs="24" :md="12" :xl="12" :xxl="12">
            <a-form-model-item
              :label="$t('notificationInfo_expireDate')"
              :has-feedback="callCommonUtilFeild(notiValidateForm.expireDate).feedback"
              :validateStatus="callCommonUtilFeild(notiValidateForm.expireDate).state"
              prop="expireDate"
              required
            >
              <a-popover
                placement="top"
                :content="callCommonUtilFeild(notiValidateForm.expireDate).msg"
                :trigger="callCommonUtilFeild(notiValidateForm.expireDate).hover"
                :visible="callCommonUtilFeild(notiValidateForm.expireDate).hoverVisible"
                @visibleChange="callCommonUtilFeildVisibleChange(notiValidateForm.expireDate)"
                :destroyTooltipOnHide="true"
              >
                <DatePicker
                  style="width: 100%"
                  :formatter="formatter"
                  @change="onDateChange"
                  v-model="notificationInfoForm.expireDate"
                  :disabled="caseClosed"
                  :clearable="false"
                >
                  <a-input
                    slot="input"
                    @pressEnter="checkManualInputDate"
                    :value="notificationInfoForm.expireDateString"
                    :disabled="caseClosed"
                  ></a-input>
                  <i v-if="notiValidateForm.expireDate.feedback" slot="icon-calendar"></i>
                </DatePicker>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="end" :gutter="[10, 0]">
          <!-- 清除 -->
          <a-col>
            <a-button type="primary" :disabled="caseClosed" @click="onCleanNotificationInfo(true)">{{ $t('global_clean') }}</a-button>
          </a-col>
          <!-- 新增 -->
          <a-col>
            <a-button type="primary" :disabled="caseClosed" @click="onAddNotificationInfo">{{ $t('global_add') }}</a-button>
          </a-col>
        </a-row>
      </a-form-model>
      
      <template v-if="showNotiInfoList">
        <a-divider  v-if="($props.propStep != 4 || ($route.name == 'REVIEW_MENU' && !isReview)) && !$props.isNotCloseNotify" />
        <FblDataGrid
          :scroll="{ x: true }"
          :row-key="gridFileData.rowKey"
          :columns="gridFileData.columns"
          :data="gridFileData.data"
          :empty-data="gridFileData.data.length <= 0"
          @actionClick="onTableClick($event)"
        ></FblDataGrid>
      </template>
        

    </div>
  </div>
</template>
<script src="./NotificationInfo.ts" lang="ts"></script>
<style lang="less" scoped>
  .notificationInfoModalFormPage {
    .infDepartment {
      .ant-form-item-label {
        width: 16.7%;
      }
      .ant-form-item-control-wrapper {
        width: 35%;
      }
    }
    
  }
  .section__notificationInfo {
    .btn__delete__icon {
      border: none;
      background: transparent;
      color: #F00;
      font-size: 18px;
    }
    /deep/ .ant-table-column-title {
      white-space: nowrap;
    }
  }
  .noti_button_group{
    padding-bottom: 10px;
  }
</style>