<template>
  <div tabindex="-1" class="section-card section__callUpAgentContactPerson">
    <div class="card__title-position">
      <!-- 聯絡對象 -->
      <span class="card__title">{{ $t("mailRecord_contactPerson") }}</span>
    </div>
    <div class="card__infomation">
      <a-form-model
        :label-col="{ span: 12 }"
        :wrapper-col="{ span: 12 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :model="notiCallUpAgentContactPersonForm"
        labelAlign="right"
      >
        <a-row type="flex">
          <a-col flex="5">
            {{ this.notiCallUpAgentContactPersonForm.agent }}
          </a-col>
        </a-row>
        <a-row>
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
              <div v-if="isAddedRow(slotProps.data)">
                <a-button
                  v-if="!slotProps.data.isCallup"
                  class="rowBtn-minus"
                  :disabled="slotProps.data.isCallup"
                  shape="circle"
                  @click="onRemoveRow(slotProps.data)"
                  ><a-icon type="minus"
                /></a-button>
              </div>
              <div v-else-if="!slotProps.data.isProp">
                <a-button
                  class="rowBtn-plus"
                  shape="circle"
                  @click="onAddRow(slotProps.data)"
                  ><a-icon type="plus"
                /></a-button>
              </div>
            </template>
            <!-- 實際電訪電話輸入欄位 -->
            <template v-slot:phoneNoTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-input
                  :disabled="slotProps.data.isCallup"
                  :maxLength="20"
                  v-model="slotProps.data.phoneNo"
                ></a-input>
              </div>
            </template>
            <!-- 撥號按鈕 -->
            <template v-slot:dialTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-button
                  class="callUpForm-callBtn"
                  :disabled="slotProps.data.isCallup"
                  @click="onDialMobClick(slotProps.data)"
                  ><a-icon type="phone" theme="filled"
                /></a-button>
              </div>
            </template>
            <!-- 分機 -->
            <template v-slot:extensionTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-input
                  :disabled="!slotProps.data.isCallup"
                  v-model="slotProps.data.extension"
                  @change="onExtensionChange(slotProps.data)"
                ></a-input>
              </div>
            </template>
            <!-- 分機撥號按鈕 -->
            <template v-slot:extensionDialTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-button
                  :disabled="!slotProps.data.isCallup"
                  @click="onExtensionDialClick(slotProps.data.extension)"
                  ><a-icon type="phone" theme="filled"
                /></a-button>
              </div>
            </template>
            <!-- 撥號結果 -->
            <template v-slot:callUpResultTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-select
                  :disabled="!slotProps.data.isCallup"
                  style="width: 100%"
                  v-model="slotProps.data.callUpResult"
                  :options="callUpResultOptions"
                  @change="onCallUpResultCellChange(slotProps.data)"
                ></a-select>
              </div>
            </template>
            <!-- 聯絡結果 -->
            <template v-slot:contactResultTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-select
                  :disabled="!slotProps.data.isResult"
                  style="width: 100%"
                  v-model="slotProps.data.contactResult"
                  :options="selectContactResultTypeOptions"
                  @change="selectContactResultChange(slotProps.data)"
                ></a-select>
              </div>
            </template>
            <!-- 聯絡細項 -->
            <template v-slot:contactDetailTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-select
                  :disabled="!slotProps.data.isResult"
                  style="width: 100%"
                  v-model="slotProps.data.contactDetail"
                  :options="selectContactResultDetailOptions"
                  @change="onCallUpResultCellChange(slotProps.data)"
                ></a-select>
              </div>
            </template>
            <!-- 通話內容 -->
            <template v-slot:callUpRemarkTemp="slotProps">
              <div v-if="slotProps.data.isProp || slotProps.data.isDataAdd">
                <a-textarea
                  v-model="slotProps.data.callUpRemark"
                  :maxLength="500"
                  :autoSize="{ minRows: 2, maxRows: 2 }"
                ></a-textarea>
              </div>
            </template>
          </FblDataGrid>
        </a-row>
        <a-row v-if="hasDialMobClicked">
          <div
            type="flex"
            justify="end"
            style="text-align: right; margin: 16px auto"
          >
            <a-button type="primary" @click="saveCallInfo">
              {{ $t("global_save") }}
            </a-button>
          </div>
        </a-row>
        <!-- <a-row type="flex">
          <a-col flex="1"> -->
        <!-- 電話 -->
        <!-- <a-form-model-item
              :label="$t('notificationCallUpAgentContactPerson_mob')"
              class=""
              prop="agentMob"
              style="margin-bottom: 0px"
            >
              <a-input
                :disabled="isDialing"
                type="text"
                v-model="notiCallUpAgentContactPersonForm.agentMob"
              />
            </a-form-model-item>
          </a-col>
          <a-col flex="1"> -->
        <!-- 撥號鈕 -->
        <!-- <a-form-model-item>
              <a-button
                class="contcatPerson-callBtn"
                :disabled="isDialing"
                @click="
                  onDialMobClick(notiCallUpAgentContactPersonForm.agentMob)
                "
                ><a-icon type="phone" theme="filled"
              /></a-button>
            </a-form-model-item>
          </a-col>

          <a-col flex="1"> -->
        <!-- 公司電話 -->
        <!-- <a-form-model-item
              :label="$t('notificationAgentSearchModal_agentOfficeTel')"
              class=""
              prop="agentOfficeTel"
              style="margin-bottom: 0px"
            >
              <a-input
                :disabled="isDialing"
                type="text"
                v-model="notiCallUpAgentContactPersonForm.agentOfficeTel"
              />
            </a-form-model-item>
          </a-col>

          <a-col flex="1"> -->
        <!-- 撥號鈕 -->
        <!-- <a-form-model-item>
              <a-button
                class="contcatPerson-callBtn"
                :disabled="isDialing"
                @click="
                  onDialOffiecTelClick(
                    notiCallUpAgentContactPersonForm.agentOfficeTel
                  )
                "
                ><a-icon type="phone" theme="filled"
              /></a-button>
            </a-form-model-item>
          </a-col>
          <a-col flex="1"> -->
        <!-- 分機 -->
        <!-- <a-form-model-item
              :label="$t('global_extension')"
              class=""
              prop="agentOfficeTelExt"
              style="margin-bottom: 0px"
            >
              <a-input
                :disabled="!(!isDialingExtension && thisCodingNo)"
                type="text"
                v-model="notiCallUpAgentContactPersonForm.agentOfficeTelExt"
              />
            </a-form-model-item>
          </a-col>

          <a-col flex="1"> -->
        <!-- 撥號鈕 -->
        <!-- <a-form-model-item>
              <a-button
                class="contcatPerson-callBtn"
                :disabled="!(!isDialingExtension && thisCodingNo)"
                @click="
                  onExtensionDialClick(
                    notiCallUpAgentContactPersonForm.agentOfficeTelExt
                  )
                "
                ><a-icon type="phone" theme="filled"
              /></a-button>
            </a-form-model-item>
          </a-col>

          <a-col flex="1"> -->
        <!-- 撥號結果 -->
        <!-- <a-form-model-item
              :label="$t('onDutyPage_callUpResult')"
              class=""
              prop="callUpResultType"
              style="margin-bottom: 0px"
            >
              <a-select
                :disabled="wasTheOderDialed(thisCodingNo)"
                v-model="notiCallUpAgentContactPersonForm.callUpResultType"
                :options="callUpResultOptions"
                @change="onCallUpResultCellChange()"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row> -->
      </a-form-model>
    </div>
  </div>
</template>

<script src="./NotificationCallUpAgentContactPerson.ts" lang="ts"></script>

<style lang="less" scoped>
.section__callUpAgentContactPerson {
  margin-top: 30px;

  .contcatPerson-callBtn {
    background-color: @BUTTON-CALL-BG-BLUE;
    color: @COLOR-WHITE;
  }
  .rowBtn-plus {
    color: @COLOR-WHITE;
    background-color: @BUTTON-CIRCLE-BG-BLUE;
    border: 1px solid @BUTTON-CIRCLE-COLOR-BLUE;
  }
}
</style>