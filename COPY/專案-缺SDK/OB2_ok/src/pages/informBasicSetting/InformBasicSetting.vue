<template>
  <div>
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 日期設定 -->
          <span class="card__title">{{ $t("indDay_setting") }}</span>
        </div>

        <div class="card__infomation">
          <a-spin :spinning="infDayloading">
            <div class="result__table">
            <fbl-data-grid
              :themeColor="'theme2'"
              :rowKey="infDayGrid.rowKey"
              :columns="infDayGrid.columns"
              :data="infDayGrid.data"
              :pagination="infDayGrid.pagination"
              @tableChange="onInfDayPageChange($event)"
              @actionClick="onInfDayActionClick($event)"
              :scroll="infDayGrid.scroll"
              size="middle"
              style="padding-left: 24px; padding-right: 12px"
              @handleEllipsisClick="handleEllipsisClick"
             @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
            >
            </fbl-data-grid>
            </div>
          </a-spin>
        </div>
      </div>
    </a-row>

    <a-row style="padding-top: 25px; padding-bottom: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- Email 範本 -->
          <span class="card__title">{{ $t("infEmail_template") }}</span>
        </div>

        <div class="card__infomation">
           <a-row>
              <a-col>
                <!-- 新增 -->
                <a-button
                  type="primary"
                  @click="showemailTemplateAddModal"
                  style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
                >
                  <a-icon type="plus" />{{ $t("global_add") }}
                </a-button>
              </a-col>
            </a-row>
          <a-spin :spinning="emailTemplateGridloading">
            <fbl-data-grid
              :themeColor="'theme2'"
              :rowKey="emailTemplateGrid.rowKey"
              :columns="emailTemplateGrid.columns"
              :data="emailTemplateGrid.data"
              :pagination="emailTemplateGrid.pagination"
              @tableChange="emailTemplatePageChange($event)"
              @actionClick="emailTemplateActionClick($event)"
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
    <a-row>
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 回覆罐頭語設定 -->
          <span class="card__title">{{ $t("infReplcontent_setting") }}</span>
        </div>
        <div class="card__infomation">
          <a-row>
            <a-row>
              <a-col>
                <!-- 新增 -->
                <a-button
                  type="primary"
                  @click="showReplyAddModal"
                  style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
                >
                  <a-icon type="plus" />{{ $t("global_add") }}
                </a-button>
              </a-col>
            </a-row>
            <a-spin :spinning="informReplyContentGridloading">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="informReplyContentGrid.rowKey"
                :columns="informReplyContentGrid.columns"
                :data="informReplyContentGrid.data"
                :pagination="informReplyContentGrid.pagination"
                @tableChange="informReplyContentPageChange($event)"
                @actionClick="infReplyContentActionClick($event)"
                size="middle"
                style="padding-left: 24px; padding-right: 12px"
              >
              </fbl-data-grid>
            </a-spin>
          </a-row>
        </div>
      </div>
    </a-row>

    <a-modal
      v-model="isInfDaySettingVisible"
      :title="$t('modify_infDaySetting')"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="infDayUpdateFormSubmit()"
    >
      <InfDayUpdateForm
        ref="infDayUpdateForm"
        :initData="updateInfDay"
        @reloadInfDayGrid="
          isInfDaySettingVisible = false;
          infDayGridReload();
        "
      >
      </InfDayUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isInfDaySettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="infDayUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isEmailTemplateSettingVisible"
      :title="infEmailTemplateTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="infEmailTemplateUpdateFormSubmit()"
    >
      <InfEmailTemplateUpdateForm
        ref="infEmailTemplateUpdateForm"
        :initData="updateInfEmailTemplate"
        :originalMajorTypeOptions="majorTypeOptions"
        @reloadInfEmailTemplate="
          isEmailTemplateSettingVisible = false;
          emailTemplateGridReload();
        "
      >
      </InfEmailTemplateUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isEmailTemplateSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="infEmailTemplateUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isInfReplyContentSettingVisible"
      :title="infReplcontentSetting"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="infReplyContentUpdateFormSubmit()"
    >
      <InfReplyContentUpdateForm
        ref="infReplyContentUpdateForm"
        :initData="updateInfReplyContent"
        @reloadInfoReplyContent="
          isInfReplyContentSettingVisible = false;
          informReplyContentGridReload();
        "
      >
      </InfReplyContentUpdateForm>
      <template #footer>
        <!-- 離開 -->
        <a-button
          key="button"
          @click="isInfReplyContentSettingVisible = false"
          >{{ $t("global_leave") }}</a-button
        >
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="infReplyContentUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script src="./InformBasicSetting.ts" lang="ts"></script>
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