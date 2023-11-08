<template>
  <div>
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card-title-position">
          <!-- 會辦項目-第一層-->
          <span class="card-title">{{
            $t("communicatSetting_infItem_firstLevel")
          }}</span>
        </div>

        <div class="card-infomation">
          <a-row>
            <a-spin :spinning="informItemloading">
              <a-row>
                <a-col>
                  <!-- 新增 -->
                  <a-button
                    type="primary"
                    @click="showInformItemAddModal"
                    style="
                      margin-top: 6px;
                      margin-bottom: 6px;
                      margin-left: 24px;
                    "
                  >
                    <a-icon type="plus" />{{ $t("global_add") }}
                  </a-button>
                </a-col>
              </a-row>
              <div class="result__table">
                <fbl-data-grid
                  :themeColor="'theme2'"
                  :rowKey="informItemGrid.rowKey"
                  :columns="informItemGrid.columns"
                  :data="informItemGrid.data"
                  :pagination="informItemGrid.pagination"
                  @tableChange="onInformItemPageChange($event)"
                  @actionClick="onInformItemActionClick($event)"
                  :scroll="informItemGrid.scroll"
                  size="middle"
                  style="padding-left: 24px; padding-right: 12px"
                >
                </fbl-data-grid>
              </div>
            </a-spin>
          </a-row>
        </div>
      </div>
    </a-row>

    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card-title-position">
          <!-- 會辦項目-第二層-->
          <span class="card-title">{{
            $t("communicatSetting_infItem_secondLevel")
          }}</span>
        </div>

        <div class="card-infomation">
          <a-row>
            <a-spin :spinning="sendInfSettingSecondloading">
              <a-row>
                <a-col>
                  <!-- 新增 -->
                  <a-button
                    type="primary"
                    @click="showInformSecondItemAddModal"
                    style="
                      margin-top: 6px;
                      margin-bottom: 6px;
                      margin-left: 24px;
                    "
                  >
                    <a-icon type="plus" />{{ $t("global_add") }}
                  </a-button>
                </a-col>
              </a-row>
              <div class="result__table">
                <fbl-data-grid
                  :themeColor="'theme2'"
                  :rowKey="informItemSecondGrid.rowKey"
                  :columns="informItemSecondGrid.columns"
                  :data="informItemSecondGrid.data"
                  :pagination="informItemSecondGrid.pagination"
                  @tableChange="onInfSettingSecondPageChange($event)"
                  @actionClick="onInformSecondItemActionClick($event)"
                  :scroll="informItemSecondGrid.scroll"
                  size="middle"
                  style="padding-left: 24px; padding-right: 12px"
                >
                </fbl-data-grid>
              </div>
            </a-spin>
          </a-row>
        </div>
      </div>
    </a-row>
    <a-row style="padding-top: 25px; padding-bottom: 25px">
      <div class="section-card section__basic">
        <div class="card-title-position">
          <!-- 發送對象設定 -->
          <span class="card-title">{{
            $t("communicatSetting_sendTargeSetting")
          }}</span>
        </div>

        <div class="card-infomation">
          <a-spin :spinning="sendTargetGridloading">
            <fbl-data-grid
              :themeColor="'theme2'"
              :rowKey="sendTargetGrid.rowKey"
              :columns="sendTargetGrid.columns"
              :data="sendTargetGrid.data"
              :pagination="sendTargetGrid.pagination"
              @tableChange="sendTargetPageChange($event)"
              @actionClick="infSendTargetActionClick($event)"
              size="middle"
              style="padding-left: 24px; padding-right: 12px"
            >
            </fbl-data-grid>
          </a-spin>
        </div>
      </div>
    </a-row>
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card-title-position">
          <!-- 銀保通路對照表-->
          <span class="card-title">{{
            $t("communicatSetting_informBancassurance")
          }}</span>
        </div>

        <div class="card-infomation">
          <a-row>
            <a-spin :spinning="sendInfSettingSecondloading">
              <div class="clearfix">
                <a-upload
                  :file-list="fileList"
                  :before-upload="beforeUpload"
                  :remove="handleRemove"
                >
                  <a-button>
                    {{ $t("eventS_selectFile") }}
                  </a-button>
                </a-upload>
              </div>
              <div style="margin-left: 24px; margin-bottom: 10px">
                <a-button
                  type="primary"
                  :disabled="fileList.length === 0"
                  :loading="isUploading"
                  @click="handleUpload"
                >
                  {{ $t("eventS_fileUpload") }}
                </a-button>
                <a-button
                  type="primary"
                  :loading="isExporting"
                  style="margin: 5px"
                  @click="handleExport"
                >
                  {{ $t("global_export") }}
                </a-button>
              </div>
              <div style="margin-left: 24px; margin-bottom: 10px">
                <template>
                  <a-space>
                    <span>{{ "更新日期 : " + updateTime }}</span>
                  </a-space>
                </template>
              </div>
              <div style="margin-left: 24px; margin-bottom: 10px">
                <template>
                  <a-space>
                    <span>{{ "更新人員 : " + updateName }}</span>
                  </a-space>
                </template>
              </div>
              <div class="result__table">
                <fbl-data-grid
                  :themeColor="'theme2'"
                  :rowKey="infBancassuranceGrid.rowKey"
                  :columns="infBancassuranceGrid.columns"
                  :data="infBancassuranceGrid.data"
                  :pagination="infBancassuranceGrid.pagination"
                  @tableChange="infBancassurancePageChange($event)"
                  size="middle"
                  style="padding-left: 24px; padding-right: 12px"
                >
                </fbl-data-grid>
              </div>
            </a-spin>
          </a-row>
        </div>
      </div>
    </a-row>
    <!-- 會辦項目第一層-修改或新增 -->
    <a-modal
      v-model="isInformItemSettingVisible"
      :title="informItemSettingTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="informItemUpdateFormSubmit()"
    >
      <InfItemSettingEditForm
        :initData="infItemSettingUpdateDto"
        :originalSelectStatusOptions="selectStatusOptions"
        ref="infItemUpdateForm"
        @reloadInformItem="
          isInformItemSettingVisible = false;
          informItemReload();
          getFirstItem();
        "
      >
      </InfItemSettingEditForm>

      <template #footer>
        <!-- 離開 -->
        <a-button @click="isInformItemSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button type="primary" @click="informItemUpdateFormSubmit()">{{
          $t("global_save")
        }}</a-button>
      </template>
    </a-modal>

    <!-- 會辦項目第二層-修改或新增 -->
    <a-modal
      v-model="isInformSecondItemSettingVisible"
      :title="informSecondItemSettingTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="informSecondItemUpdateFormSubmit()"
    >
      <InfItemSecondSettingEditForm
        :initData="infItemSecondSettingUpdateDto"
        :originalSelectStatusOptions="selectStatusOptions"
        :originalFirsItemOptions="selectFirstItemOptions"
        ref="infSecondItemUpdateForm"
        @reloadInformItem="
          isInformSecondItemSettingVisible = false;
          sendInfSettingSecondReload();
        "
      >
      </InfItemSecondSettingEditForm>

      <template #footer>
        <!-- 離開 -->
        <a-button @click="isInformSecondItemSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button type="primary" @click="informSecondItemUpdateFormSubmit()">{{
          $t("global_save")
        }}</a-button>
      </template>
    </a-modal>

    <!-- 修改-發送對象 -->
    <a-modal
      v-model="isInfSendTargetSettingVisible"
      :title="$t('communicatSetting_sendTarget_modify')"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="infSendTargetUpdateFormSubmit()"
    >
      <InfSendMsgSettingEditForm
        ref="infSendTargetUpdateForm"
        :initData="updateInfSendTarget"
        :originalSelectDepOptions="allDepts"
        :originalSelectUnitOptions="allUnits"
        :originalSelectEmpOptions="allEmps"
        :originalEmailTemplateOptions="emailTemplates"
        @reloadInfSendTargetGrid="
          isInfSendTargetSettingVisible = false;
          sendTargetGridReload();
        "
      ></InfSendMsgSettingEditForm>
      <template #footer>
        <!-- 離開 -->
        <a-button @click="isInfSendTargetSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button type="primary" @click="infSendTargetUpdateFormSubmit()">{{
          $t("global_save")
        }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script src="./InfCommunicatSetting.ts" lang="ts"></script>
<style lang="less" scoped>
// 卡片樣式
.section-card {
  border: 1px solid #eee;
  border-radius: 5px;
  position: relative;
  min-height: 2em;
  margin-top: 5px;
  + .section-card {
    margin-top: 30px;
  }
  margin-left: 15px;
  margin-right: 15px;
}
.card-infomation {
  padding: 30px 15px 15px;
  box-shadow: 1px 4px 8px #ddd;
  .ant-row-flex {
    + .ant-row-flex {
      margin-top: 10px;
    }
  }
}
.card-title-position {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-50%);
}
.card-title {
  background: @COLOR-WHITE;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 600;
  font-size: 18px;
}
.clearfix {
  margin-left: 24px;
  margin-bottom: 10px;
  width: 25%;
}
</style>