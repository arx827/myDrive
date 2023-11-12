<template>
  <div>
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 照會主類別-->
          <span class="card__title">{{$t("notification_majorType")}}</span>
        </div>

        <div class="card__notiomation">
          <a-row>
            <a-col>
              <!-- 新增 -->
              <a-button
                type="primary"
                @click="showMajorTypeAddModal"
                style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
              >
                <a-icon type="plus" />{{ $t("global_add") }}
              </a-button>
            </a-col>
          </a-row>
          <a-spin :spinning="majorTypeGridloading">
            <div class="result__table">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="majorTypeGrid.rowKey"
                :columns="majorTypeGrid.columns"
                :data="majorTypeGrid.data"
                :pagination="majorTypeGrid.pagination"
                @tableChange="majorTypePageChange($event)"
                @actionClick="majorTypeActionClick($event)"
                :scroll="majorTypeGrid.scroll"
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
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 照會次類別-->
          <span class="card__title">{{$t("notification_majorSubType")}}</span>
        </div>

        <div class="card__notiomation">
          <a-row>
            <a-col>
              <!-- 新增 -->
              <a-button
                type="primary"
                @click="showMajorSubTypeAddModal()"
                style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
              >
                <a-icon type="plus" />{{ $t("global_add") }}
              </a-button>
            </a-col>
          </a-row>
          <a-spin :spinning="majorSubTypeGridloading">
            <div class="result__table">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="majorSubTypeGrid.rowKey"
                :columns="majorSubTypeGrid.columns"
                :data="majorSubTypeGrid.data"
                :pagination="majorSubTypeGrid.pagination"
                @tableChange="majorSubTypePageChange($event)"
                @actionClick="majorSubTypeActionClick($event)"
                :scroll="majorSubTypeGrid.scroll"
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
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 銀保照會單代碼-->
          <span class="card__title">{{ $t("notification_form_bancassuranceCode") }}</span>
        </div>

        <div class="card__notiomation">
          <a-row>
            <a-col>
              <!-- 新增 -->
              <a-button
                type="primary"
                @click="showBancassuranceAddModal"
                style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
              >
                <a-icon type="plus" />{{ $t("global_add") }}
              </a-button>
            </a-col>
          </a-row>
          <a-spin :spinning="notiBancassuranceGridloading">
            <div class="result__table">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="notiBancassuranceGrid.rowKey"
                :columns="notiBancassuranceGrid.columns"
                :data="notiBancassuranceGrid.data"
                :pagination="notiBancassuranceGrid.pagination"
                @tableChange="notiBancassuranceGridPageChange($event)"
                @actionClick="notiBancassuranceGridActionClick($event)"
                :scroll="notiBancassuranceGrid.scroll"
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
    <a-row style="padding-top: 25px">
      <div class="section-card section__basic">
        <div class="card__title-position">
          <!-- 日期設定 -->
          <span class="card__title">{{ $t("indDay_setting") }}</span>
        </div>

        <div class="card__notiomation">
          <a-spin :spinning="notiDayloading">
            <div class="result__table">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="notiDayGrid.rowKey"
                :columns="notiDayGrid.columns"
                :data="notiDayGrid.data"
                :pagination="notiDayGrid.pagination"
                @tableChange="onNotiDayPageChange($event)"
                @actionClick="onNotiDayActionClick($event)"
                :scroll="notiDayGrid.scroll"
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
        <div class="card__notiomation">
            <!-- 待需求確認是否需要新增Email 範本範本功能 -->

          <!-- <a-row>
              <a-col>
               
                <a-button
                  type="primary"
                  @click="showemailTemplateAddModal"
                  style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
                >
                  <a-icon type="plus" />{{ $t("global_add") }}
                </a-button>
              </a-col>
            </a-row> -->
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
        <div class="card__notiomation">
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
            <a-spin :spinning="notiReplyContentGridloading">
              <fbl-data-grid
                :themeColor="'theme2'"
                :rowKey="notiReplyContentGrid.rowKey"
                :columns="notiReplyContentGrid.columns"
                :data="notiReplyContentGrid.data"
                :pagination="notiReplyContentGrid.pagination"
                @tableChange="notiReplyContentPageChange($event)"
                @actionClick="notiReplyContentActionClick($event)"
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
      v-model="isMajorTypeSettingVisible"
      :title="notiMajorTypeTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiMajorTypeUpdateFormSubmit()"
    >
      <NotiMajorTypeUpdateForm
        ref="notiMajorTypeUpdateForm"
        :initData="updateNotiType"
        @reloadNotiMajorType="
          isMajorTypeSettingVisible = false;
          majorTypeGridReload();
        "
      >
      </NotiMajorTypeUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isMajorTypeSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiMajorTypeUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isMajorSubTypeSettingVisible"
      :title="notiMajorSubTypeTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiMajorSubTypeUpdateFormSubmit()"
    >
      <NotiMajotSubTypeUpdateForm
        ref="notiMajorSubTypeUpdateForm"
        :initData="updateNotiSubType"
        @reloadNotiMajorSubType="
          isMajorSubTypeSettingVisible = false;
          majorSubTypeGridReload();
        "
      >
      </NotiMajotSubTypeUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isMajorSubTypeSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiMajorSubTypeUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <!-- 銀行照會碼設定 -->
    <a-modal
      v-model="isNotiBancassuranceSettingVisible"
      :title="notiBancassuranceTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiBancassuranceUpdateFormSubmit()"
    >
      <NotiBancassuranceUpdateForm
        ref="notiBancassuranceUpdateForm"
        :initData="updateNotiBancassurance"
        @reloadNotiBancassurance="
          isNotiBancassuranceSettingVisible = false;
          notiBancassuranceGridReload();
        "
      >
      </NotiBancassuranceUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button
          key="button"
          @click="isNotiBancassuranceSettingVisible = false"
          >{{ $t("global_leave") }}</a-button
        >
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiBancassuranceUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isNotiDaySettingVisible"
      :title="$t('modify-notification_workingDay_setting')"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiDayUpdateFormSubmit()"
    >
      <NotiDayUpdateForm
        ref="notiDayUpdateForm"
        :initData="updateNotiDay"
        @reloadNotiDayGrid="
          isNotiDaySettingVisible = false;
          notiDayGridReload();
        "
      >
      </NotiDayUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isNotiDaySettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiDayUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isEmailTemplateSettingVisible"
      :title="notiEmailTemplateTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiEmailTemplateUpdateFormSubmit()"
    >
      <NotiEmailTemplateUpdateForm
        ref="notiEmailTemplateUpdateForm"
        :initData="updateNotiEmailTemplate"
        @reloadNotiEmailTemplate="
          isEmailTemplateSettingVisible = false;
          emailTemplateGridReload();
        "
      >
      </NotiEmailTemplateUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isEmailTemplateSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiEmailTemplateUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isEmailTemplateSettingVisible"
      :title="notiEmailTemplateTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiEmailTemplateUpdateFormSubmit()"
    >
      <NotiEmailTemplateUpdateForm
        ref="notiEmailTemplateUpdateForm"
        :initData="updateNotiEmailTemplate"
        @reloadNotiEmailTemplate="
          isEmailTemplateSettingVisible = false;
          emailTemplateGridReload();
        "
      >
      </NotiEmailTemplateUpdateForm>

      <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isEmailTemplateSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiEmailTemplateUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model="isNotiReplyContentSettingVisible"
      :title="notiReplcontentSetting"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="notiReplyContentUpdateFormSubmit()"
    >
      <NotiReplyContentUpdateForm
        ref="notiReplyContentUpdateForm"
        :initData="updateNotiReplyContent"
        @reloadNotiReplyContent="
          isNotiReplyContentSettingVisible = false;
          notiReplyContentGridReload();
        "
      >
      </NotiReplyContentUpdateForm>
      <template #footer>
        <!-- 離開 -->
        <a-button
          key="button"
          @click="isNotiReplyContentSettingVisible = false"
          >{{ $t("global_leave") }}</a-button
        >
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="notiReplyContentUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script src="./NotificationBasicSetting.ts" lang="ts"></script>
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
.card__notiomation {
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