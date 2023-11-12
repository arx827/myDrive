<template>
  <div tabindex="-1" @keyup.enter="searchLetterValidate()">
    <a-form-model
      :label-col="{ xs: 7, md: 9, xxl: 6}"
      :model="letterValidateSearchForm"
      :rules="letterValidateSearchValidForm"
      ref="ruleForm"
      class="letterValidatePageModel"
    >
      <!-- 產信日期 -->
      <a-row :gutter="[{ xs: 10, xxl: 10 }, 0]">
        <a-col :span="5">
          <a-form-model-item>
            <span slot="label">{{$t('letterValidate_label_letterDate')}}</span>
            <a-row type="flex" class="datePicker__interval">
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(letterValidateSearchValidForm.letterStart).feedback"
                :validateStatus="callCommonUtilFeild(letterValidateSearchValidForm.letterStart).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(letterValidateSearchValidForm.letterStart).msg"
                  :trigger="callCommonUtilFeild(letterValidateSearchValidForm.letterStart).hover"
                  :visible="callCommonUtilFeild(letterValidateSearchValidForm.letterStart).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(letterValidateSearchValidForm.letterStart)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onLetterStartDateChange"
                    v-model="letterValidateSearchForm.letterStartDate"
                    @clear="clearLetterStartDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputLetterStartDate"
                      :value="letterValidateSearchForm.letterStartDateString"
                    ></a-input>
                    <i
                      v-if="letterValidateSearchValidForm.letterStart.feedback"
                      slot="icon-calendar"
                    ></i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
              <span class="interval__symbol">~</span>
              <a-form-model-item
                :has-feedback="callCommonUtilFeild(letterValidateSearchValidForm.letterEnd).feedback"
                :validateStatus="callCommonUtilFeild(letterValidateSearchValidForm.letterEnd).state"
              >
                <a-popover
                  placement="top"
                  :content="callCommonUtilFeild(letterValidateSearchValidForm.letterEnd).msg"
                  :trigger="callCommonUtilFeild(letterValidateSearchValidForm.letterEnd).hover"
                  :visible="callCommonUtilFeild(letterValidateSearchValidForm.letterEnd).hoverVisible"
                  @visibleChange="callCommonUtilFeildVisibleChange(letterValidateSearchValidForm.letterEnd)"
                  :destroyTooltipOnHide="true"
                >
                  <DatePicker
                    :formatter="formatter"
                    @change="onLetterEndDateChange"
                    v-model="letterValidateSearchForm.letterEndDate"
                    @clear="clearLetterEndDate"
                    :clearable="true"
                    style="width: 100%"
                  >
                    <a-input
                      slot="input"
                      @pressEnter="checkManualInputLetterEndDate"
                      :value="letterValidateSearchForm.letterEndDateString"
                    ></a-input>
                    <i v-if="letterValidateSearchValidForm.letterEnd.feedback" slot="icon-calendar"></i>
                  </DatePicker>
                </a-popover>
              </a-form-model-item>
            </a-row>
          </a-form-model-item>
        </a-col>
        <a-col :span="7" class="btnBar">
          <!-- 查詢 -->
          <a-button type="primary" @click="searchLetterValidate()">{{ $t("global_search") }}</a-button>
          <!-- 信函驗證 -->
          <a-button type="primary" @click="clickLetterVerify()">{{ $t("letterValidate_btn_verify") }}</a-button>
          <!-- 信函打包 -->
          <a-button type="primary" @click="clickToPackingMailPost()">{{ $t("letterValidate_btn_package") }}</a-button>
          <!-- 清除 -->
          <a-button type="primary" @click="resetSearchLetterValidate()">{{ $t("global_clean") }}</a-button>
          <!-- 匯出 -->
          <a-button type="primary" @click="exportLetterValidate()">{{ $t("global_export") }}</a-button>
        </a-col>
      </a-row>
    </a-form-model>

    <div class="fbl-table">
      <FblDataGrid
        :rowKey="letterValidateGrid.rowKey"
        :columns="letterValidateGrid.columns"
        :data="letterValidateGrid.data"
        ref="LetterValidateGrid"
      >
        <template v-slot:alink_abnormalCount_Template="slotProps">
          <!-- 異常件數數量大於0才能點擊 否則僅顯示 -->
          <a v-if="slotProps.data.abnormalCount!=='0'" @click="clickAbnormalCount(slotProps.data)">{{slotProps.data.abnormalCount}}</a>
          <span v-else >{{slotProps.data.abnormalCount}}</span>
        </template>
      </FblDataGrid>
    </div>

    <!-- 異常件數明細 modal -->
    <a-modal
      v-model="letterValidateGridModal.isAbnormalDetailShow"
      :title="$t('letterValidate_modal_1')"
      width="70%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :footer="null"
      :destroyOnClose="true"
    >
      <LetterValidateAbnormalModal
        :propLetterDate="abnormalDetailParam.propLetterDate"
      >
      </LetterValidateAbnormalModal>
    </a-modal>

    <!-- 信函驗證 -->
    <a-modal
      v-model="letterValidateModal.isSamplingModalShow"
      :title="$t('letterValidate_modal_2')"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      width="50%"
      @ok="letterValidateSamplingModalFormSubmit()"
    >
      <LetterValidateSamplingModal
        :letterDate="samplingParam"
        @closeModal="onCloseModal('isSamplingModalShow')"
        @reloadSearchLetterValidate="searchLetterValidate(); onCloseModal('isSamplingModalShow');"
        ref="letterValidateSamplingModalForm"
      >
      </LetterValidateSamplingModal>
      
      <template #footer>
        <a-row type="flex" justify="center">
          <a-button type="primary" @click="letterValidateSamplingModalFormSubmit()">{{ $t("global_save") }}</a-button>
        </a-row>
      </template>

    </a-modal>

  </div>
</template>

<script src="./LetterValidatePage.ts" lang="ts"></script>

<style lang="less" scoped>
.letterValidatePageModel {
  padding: 5px 5px 5px;
  // background: @COLOR-MAIN11;
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

.btnBar {
  margin-top: 4px;
  .ant-btn {
    margin: 0 5px;
  }
}

.fbl-table {
  width: 50%;
  padding-left: 24px;
  padding-right: 12px;
  margin: 10px 0;
}
.dataNumBar {
  margin: 0 30px;
}
</style>
