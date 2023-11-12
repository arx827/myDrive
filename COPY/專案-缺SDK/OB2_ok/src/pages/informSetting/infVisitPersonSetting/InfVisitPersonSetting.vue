<template>
  <div>
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 會辦項目-第一層-->
          <span class="card__title">{{ $t("visitPersonSetting_infItem_firstLevel") }}</span>
        </div>

        <div class="card__infomation">
          <a-row>
            <a-row>
              <a-col>
                <!-- 新增 -->
                <a-button
                  type="primary"
                  @click="showInformItemAddModal"
                  style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
                >
                  <a-icon type="plus" />{{ $t("global_add") }}
                </a-button>
              </a-col>
            </a-row>
            <a-spin :spinning="informItemloading">
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
                  @handleEllipsisClick="handleEllipsisClick"
                  @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
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
        <div class="card__title-position">
          <!-- 發送對象設定 -->
          <span class="card__title">{{ $t("visitPersonSetting_sendTarget") }}</span>
        </div>

        <div class="card__infomation">
          <a-spin :spinning="sendTargetGridloading">
            <fbl-data-grid
              :themeColor="'theme2'"
              :rowKey="sendTargetGrid.rowKey"
              :columns="sendTargetGrid.columns"
              :data="sendTargetGrid.data"
              :pagination="sendTargetGrid.pagination"
              @tableChange="sendTargetPageChange($event)"
              @actionClick="infSendTargetActionClick($event)"
              @handleEllipsisClick="handleEllipsisClick"
              @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
              size="middle"
              style="padding-left: 24px; padding-right: 12px"
            >
            </fbl-data-grid>
          </a-spin>
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
        "
      >
      </InfItemSettingEditForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isInformItemSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="informItemUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <!-- 修改-發送對象 -->
    <a-modal
      v-model="isInfSendTargetSettingVisible"
      :title="$t('visitPersonSetting_modify_sendTarget')"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="infSendTargetUpdateFormSubmit()"
    >

      <InfSendTargetSettingForm
      ref="infSendTargetUpdateForm"
      :initData="updateInfSendTarget"
      :originalSelectDepOptions="selectDepOptions"
      :originalEmailTemplateOptions="selectEmailTemplateOptions"
      :originalEmailAndTmrIdMap="emailAndTmrIdMap"
      @reloadInfSendTargetGrid="isInfSendTargetSettingVisible = false;
      sendTargetGridReload()
      "
      ></InfSendTargetSettingForm>
      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isInfSendTargetSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="infSendTargetUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script src="./InfVisitPersonSetting.ts" lang="ts"></script>
<style lang="less">
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
.card__infomation {
  padding: 30px 15px 15px;
  box-shadow: 1px 4px 8px #ddd;
  .ant-row-flex {
    + .ant-row-flex {
      margin-top: 10px;
    }
  }
}

.card__title-position {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-50%);
}
.card__title {
  background: @COLOR-WHITE;
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 600;
  font-size: 18px;
}
</style>