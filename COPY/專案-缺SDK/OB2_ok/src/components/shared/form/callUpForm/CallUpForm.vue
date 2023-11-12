<template>
  <div class="result__table">
    <!-- 電訪資料 -->
    <FblDataGrid
      :themeColor="'theme2'"
      :scroll="{ x: 600, y: 400 }"
      :row-key="gridData.rowKey"
      :columns="gridData.columns"
      :data="gridData.data"
      :pagination="gridData.pagination"
      :empty-data="gridData.data.length <= 0"
    >
      <!-- 順序 -->
      <template v-slot:seqNoTemp="slotProps">
        <div v-if="isDataRow(slotProps.data)">
          <p align="center">{{ parseInt(slotProps.data.seqNo, 10) }}</p>
        </div>
        <div v-else-if="isAddedRow(slotProps.data)">
          <a-button
            class="rowBtn-minus"
            :disabled="isDialing"
            shape="circle"
            @click="onRemoveRow(slotProps.data)"
            ><a-icon type="minus"
          /></a-button>
        </div>
        <div v-else>
          <a-button
            class="rowBtn-plus"
            :disabled="isDialing"
            shape="circle"
            @click="onAddRow(slotProps.data)"
            ><a-icon type="plus"
          /></a-button>
        </div>
      </template>
      <!-- 取用原則 -->
      <!-- <template v-slot:useReasonTemp="slotProps">
        <div v-if="isDataRow(slotProps.data)">
          <p align="center">{{ useReasonMap.get(slotProps.data.useReason) }}</p>
        </div>
        <div v-else align="center">
          {{ useReasonMap.get(slotProps.data.useReason) }}
        </div>
      </template> -->
      <!-- 來源(保單/受理案號) -->
      <template v-slot:sourceCaseNoTemp="slotProps">
        <div v-if="isDataRow(slotProps.data)">
          <p align="center">
            {{
              (useSourceMap.get(slotProps.data.useSource)
                ? useSourceMap.get(slotProps.data.useSource)
                : slotProps.data.useSource
                ? slotProps.data.useSource
                : "") +
              (sourceCaseNoMap.get(slotProps.data.sourceCaseNo)
                ? sourceCaseNoMap.get(slotProps.data.sourceCaseNo)
                : slotProps.data.sourceCaseNo
                ? slotProps.data.sourceCaseNo
                : "")
            }}
          </p>
        </div>
        <div v-else-if="isAddedRow(slotProps.data)" align="center">
          <a-select
            :disabled="isDialing"
            style="width: 117px"
            v-model="slotProps.data.sourceCaseNo"
            :options="sourceCaseNoOptions"
          ></a-select>
        </div>
      </template>
      <!-- 實際電訪電話輸入欄位 -->
      <template v-slot:phoneNoTemp="slotProps">
        <div v-if="isDataRow(slotProps.data)">
          <a-input
            :disabled="isDialing"
            :maxLength="20"
            v-model="slotProps.data.phoneNo"
          ></a-input>
        </div>
        <div v-else-if="isAddedRow(slotProps.data)">
          <a-input
            :disabled="isDialing"
            :maxLength="20"
            v-model="slotProps.data.phoneNo"
          ></a-input>
        </div>
      </template>
      <!-- 撥號按鈕 -->
      <template v-slot:dialTemp="slotProps">
        <div v-if="isDataRow(slotProps.data) || isAddedRow(slotProps.data)">
          <a-button
            class="callUpForm-callBtn"
            :disabled="isDialing"
            @click="onDialClick(slotProps.data)"
            ><a-icon type="phone" theme="filled"
          /></a-button>
        </div>
      </template>
      <!-- 分機 -->
      <template v-slot:extensionTemp="slotProps">
        <div v-if="isDataRow(slotProps.data) || isAddedRow(slotProps.data)">
          <a-input
            :disabled="
              !(
                slotProps.data.seqNo == currentDialingSeqNo &&
                !isDialingExtension &&
                thisCodingNo
              )
            "
            v-model="slotProps.data.extension"
            @change="onExtensionChange(slotProps.data)"
          ></a-input>
        </div>
      </template>
      <!-- 分機撥號按鈕 -->
      <template v-slot:extensionDialTemp="slotProps">
        <div v-if="isDataRow(slotProps.data) || isAddedRow(slotProps.data)">
          <a-button
            :disabled="
              !(
                slotProps.data.seqNo == currentDialingSeqNo &&
                !isDialingExtension &&
                thisCodingNo
              )
            "
            @click="onExtensionDialClick(slotProps.data)"
            ><a-icon type="phone" theme="filled"
          /></a-button>
        </div>
      </template>
      <!-- 通話內容 -->
      <template v-slot:callUpRemarkTemp="slotProps">
        <div v-if="isDataRow(slotProps.data) || isAddedRow(slotProps.data)">
          <a-textarea
            v-model="slotProps.data.callUpRemark"
            :maxLength="500"
            :autoSize="{ minRows: 2, maxRows: 2 }"
          ></a-textarea>
        </div>
      </template>
      <!-- 本次撥號結果 -->
      <template v-slot:callUpResultTemp="slotProps">
        <div v-if="isDataRow(slotProps.data) || isAddedRow(slotProps.data)">
          <a-select
            :disabled="!wasTheOderDialed(slotProps.data.seqNo)"
            style="width: 100%"
            v-model="slotProps.data.callUpResult"
            :options="callUpResultOptions"
            @change="onCallUpResultCellChange(slotProps.data)"
          ></a-select>
        </div>
      </template>
    </FblDataGrid>
  </div>
</template>

<script src="./CallUpForm.ts" lang="ts"></script>

<style lang="less" scoped>
.callUpForm-callBtn {
  background-color: @BUTTON-CALL-BG-BLUE;
  color: @COLOR-WHITE;
}
.rowBtn-plus {
  color: @COLOR-WHITE;
  background-color: @BUTTON-CIRCLE-BG-BLUE;
  border: 1px solid @BUTTON-CIRCLE-COLOR-BLUE;
}
.rowBtn-minus {
  color: @BUTTON-CIRCLE-BG-BLUE;
  border: 1px solid @BUTTON-CIRCLE-COLOR-BLUE;
}
</style>
