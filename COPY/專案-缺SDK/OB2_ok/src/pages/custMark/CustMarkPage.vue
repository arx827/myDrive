<template>
  <div tabindex="-1" @keyup.enter="custMarkSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          ref="custMarkRules"
          :model="custMarkPageSearchForm"
          :rules="custMarkSearchRules"
          :style="hiddenFoldeStyle.color"
          class="custMarkPage"
        >
          <a-row>
            <a-col :span="5">
              <!-- 客戶國籍 -->
              <a-form-model-item
                :label="$t('custMark_nationality')"
                prop="nationality"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="custMarkPageSearchForm.nationality"
                  :options="selectNationalityOptions"
                  @change="onSelectionChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <!-- 客戶身分證字號 -->
              <a-form-model-item
                :label="$t('custMark_custId')"
                prop="custId"
                style="margin-bottom: 0px"
                :has-feedback="custIdFeildValidation.feedback"
                :validateStatus="custIdFeildValidation.state"
                class="custId"
              >
                <a-popover
                  placement="top"
                  :content="custIdFeildValidation.msg"
                  :trigger="custIdFeildValidation.hover"
                >
                  <a-input type="text" v-model="custMarkPageSearchForm.custId" :maxLength="10"/>
                </a-popover>
              </a-form-model-item>
            </a-col>
            <!-- 語言 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('global_language')"
                prop="skillLanguage"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="custMarkPageSearchForm.skillLanguage"
                  :options="selectSkillLanguageOptions"
                  :filter-option="filterOption"
                  show-search
                  @change="onSelectionChange"
                  :placeholder="$t('global_all')"
                ></a-select>
                <!-- 全部 -->
              </a-form-model-item>
            </a-col>
            <!-- 客戶標籤 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('custMark_tag')"
                prop="skillTag"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="custMarkPageSearchForm.skillTag"
                  :options="selectSkillTagOptions"
                  :filter-option="filterOption"
                  show-search
                  :placeholder="$t('global_all')"
                  @change="onSelectionChange"
                ></a-select>
                <!-- 全部 -->
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 搜尋 -->
                <a-button type="primary" @click="custMarkSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetCustMarkSearchForm">
                  {{ $t("global_clean") }}
                </a-button>
                <a-divider type="vertical"></a-divider>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportCustMark"> {{$t('global_export')}} </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row>
      <a-col>
        <a-button
          type="primary"
          @click="showCustMarkAddModal"
          style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
        >
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <FblDataGrid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          size="middle"
          @actionClick="onTableActionClick($event)"
          @tableChange="onPageChange($event)"
          style="padding-left: 24px; padding-right: 12px"
          ref="custMarkDataGrid"
        >
        </FblDataGrid>
      </a-col>
    </a-row>
    <!-- 特殊保戶註記設定維護 -->
    <!-- 取消 -->
    <!-- <a-modal
      v-model="formVisible"
      :title="$t('global_custMark') + $t('global_setting') + $t('global_maintain')"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      width="1000px"
      :maskClosable="false"
      @ok="custMarkModalSubmit"
      @cancel="custMarkModalCancel"
    > -->
    <a-modal
      v-model="formVisible"
      :title="$t('custMark_settingMaintain')"
      :cancelText="$t('global_cancel')"
      :okText="formButtonText"
      width="1100px"
      :maskClosable="false"
      @ok="custMarkModalSubmit"
      @cancel="custMarkModalCancel"
    >
      <CustMarkForm
        :initData="editingData"
        :selectNationalityOptions="selectNationalityOptions"
        :selectLanguageOptions="selectSkillLanguageOptions"
        :selectTagOptions="selectSkillTagOptions"
        ref="custMarkForm"
        @reloadData="reload"
      >
      </CustMarkForm>
    </a-modal>
    
  </div>
</template>
<script src="./CustMarkPage.ts" lang="ts"></script>