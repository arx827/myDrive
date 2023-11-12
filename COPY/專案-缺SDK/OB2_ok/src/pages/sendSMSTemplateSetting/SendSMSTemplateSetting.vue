<template >
    <div tabindex="-1"  @keyup.enter="userUnlockSearch()">
        <HiddenFolde>
            <template v-slot:hiddenArea="hiddenFoldeStyle">
                 <a-form-model
                   :label-col="{ xs: 7, md: 9, xxl: 7 }"
                    :wrapper-col="{ xs: 17, md: 15, xxl: 17 }"
                    :model="sendSMSTemplateSearchForm"
                    :style="hiddenFoldeStyle.color"
                >
                <a-row
                    type="flex"
                    :gutter="[{ xs: 10, xxl: 10 }, 0]"
                    style="margin-left: -10px"
                >
                <a-col :span="5">
                <!-- 發送對象 -->
                    <a-form-model-item>
                        <span slot="label"> {{ $t("sendSMSTemplateSettingPage_sendTarget")}} </span>
                        <a-select
                        class="select"
                        v-model="sendSMSTemplateSearchForm.Target"
                        :allowClear="true"
                        :options="sendTargetOptions"
                        :filter-option="filterOption"
                        >
                        </a-select>
                    </a-form-model-item>
                </a-col>

                <!-- 發送範本 -->
                <a-col :span="5">
                <a-form-model-item
                    :label="$t('sendSMSTemplateSettingPage_content')"
                    prop="content"
                    style="margin-bottom: 0px"
                >
                    <a-input
                    type="text"
                    v-model="sendSMSTemplateSearchForm.content"
                    />
                </a-form-model-item>
                </a-col>
                </a-row>

                <div>
                    <a-row type="flex" justify="center" class="searchBar">
                    <a-space style="margin-bottom: 16px">
                        <!-- 查詢 -->
                        <a-button type="primary" @click="sendSMSTemplateSearch()">{{
                        $t("global_search")
                        }}</a-button>
                        <!-- 清除 -->
                        <a-button type="default" @click="sendSMSTemplateSearchReset()">{{
                        $t("global_clean")
                        }}</a-button>
                    </a-space>
                    </a-row>
                </div>
                </a-form-model>
            </template>
        </HiddenFolde>

        <a-row>
            <a-col>
                <a-button
                type="primary"
                style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
                @click="showSendSMSTemplateAddModal()"
                >
                <a-icon type="plus" />{{ $t("global_add") }}
                </a-button>
            </a-col>
        </a-row>

        <div class="fbl-table">
        <a-row :gutter="[24, 24]">  
        <a-col :span="24">      
        <FblDataGrid
        :themeColor="'theme2'"
            :rowKey="grid.rowKey"
            :columns="grid.columns"
            :data="grid.data"
            :pagination="grid.pagination"
            :scroll="grid.scroll"
            size="middle"
            @actionClick="onTableActionClick($event)"
            @tableChange="onPageChange($event)"
            style="padding-left: 24px; padding-right: 12px"
        >
        <template v-slot:deleteTemp="slotProps">
            <div>
              <a-icon v-if="slotProps.data.crud && slotProps.data.crud.includes('D')"
                type="delete"
                @click="deleteRecord(slotProps.data)"
              >
              </a-icon> 
            </div>
        </template>
        </FblDataGrid>
        </a-col>
        </a-row>
        </div>

<!-- 新增範本通知 -->
    <a-modal
      v-model="isSendSMSTemplateSettingVisible"
      :title="sendSMSTemplateSettingTitle"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :destroyOnClose="true"
      @ok="sendTemplateSettingUpdateFormSubmit()"
    >

      <SendTemplateSettingUpdateForm
      ref="sendTemplateSettingUpdateForm"
      :initData = "updateSendTemplateSetting"
      :originalSendTargetOptions="sendTargetOptions"
      :parentIsEmail = false
      :sendMode = "sendMode"
      @reloadSendSMSTemplate="isSendSMSTemplateSettingVisible = false;sendSMSTemplateSearch();"
      >
      
      </SendTemplateSettingUpdateForm>
       <template #footer>
        <!-- 離開 -->
        <a-button key="button" @click="isSendSMSTemplateSettingVisible = false">{{
          $t("global_leave")
        }}</a-button>
        <!-- 儲存 -->
        <a-button
          key="submit"
          type="primary"
          @click="sendTemplateSettingUpdateFormSubmit()"
          >{{ $t("global_save") }}</a-button
        >
      </template>
    </a-modal>
    </div>
</template>

<script src="./SendSMSTemplateSetting.ts" lang="ts"></script>