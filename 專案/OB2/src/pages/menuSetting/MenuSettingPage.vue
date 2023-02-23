<template >
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :rules="rules"
          ref="menuSettingRules"
          :model="menuSettingForm"
          style="background-color: #eef6f8"
        >
          <a-row>
            <a-col :span="5">
              <!-- 選單代碼 -->
              <a-form-model-item
                :label="$t('menuSP_menuCode')"
                prop="menuId"
                style="margin-bottom: 0px"
                :has-feedback="menuIdFeedback"
                :validateStatus="stateMenuId"
              >
                <!-- 選單代碼 格式錯誤提示訊息 僅可輸入英數字與底線 -->
                <a-popover
                  placement="top"
                  :content="$t('menuSP_menuCodeAlphanumericAndUnderscoresInputOnly')"
                  :trigger="menuIdHover"
                >
                  <a-input type="text" v-model="menuSettingForm.menuId" />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 選單名稱 -->
              <a-form-model-item
                :label="$t('menuSP_menuName')"
                prop="menuName"
                style="margin-bottom: 0px"
                :has-feedback="menuNameFeedback"
                :validateStatus="stateMenuName"
              >
                <!-- 選單名稱 格式錯誤提示訊息 不可輸入符號 -->
                <a-popover
                  placement="top"
                  :content="$t('menuSP_menuNameNoSymbols')"
                  :trigger="menuNameHover"
                >
                  <a-input type="text" v-model="menuSettingForm.menuName" />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="5"> -->
              <!-- 功能名稱/代碼 -->
              <!-- <a-form-model-item
                :label="$t('global_function') + $t('global_name')"
                prop="resourceId"
                style="margin-bottom: 0px"
              > -->
                <!-- 功能代碼 搜尋式下拉清單 -->
                <!-- <a-select
                  show-search
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  :options="selectResourceIdOptions"
                  v-model="menuSettingForm.resourceId"
                >
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="5">
              <!-- 狀態(是否啟用) -->
              <a-form-model-item
                :label="$t('global_status')"
                prop="enable"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="menuSettingForm.enable"
                  :options="selectEnableOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 是否為子選單 -->
              <a-form-model-item
                :label="$t('menuSP_isLeaf')"
                prop="isLeaf"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="menuSettingForm.isLeaf"
                  :options="selectLeafOptions"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 父選單名稱 -->
              <a-form-model-item
                :label="$t('menuSP_parentMenuName')"
                prop="parentMenuId"
                style="margin-bottom: 0px"
              >
                <!-- 父選單名稱/代碼 搜尋式下拉清單 -->
                <a-select
                  show-search
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  :options="selectParentMenuIdOptions"
                  v-model="menuSettingForm.parentMenuId"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <a-button type="primary" @click="menuSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 搜尋 -->
                <a-button type="default" @click="resetFrom">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 清除 -->
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
          @click="addMenuDetail"
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
          @actionClick="onMenuTableActionClick($event)"
          @tableChange="onPageChange($event)"
          style="padding-left: 24px; padding-right: 12px"
          ref="menuDataGrid"
        >
        </FblDataGrid>
      </a-col>
    </a-row>
    <!-- 取消與確認 -->
    <a-modal
      v-model="formVisible"
      :title="titleText"
      :maskClosable="false"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      @ok="onFormSubmit($event)"
      @cancel="onFormCalcel()"
    >
      <MenuForm ref="menuForm" :initData="menuChangeForm" @reloadData="reload">
      </MenuForm>
    </a-modal>
  </div>
</template>

<script src="./MenuSettingPage.ts" lang="ts"></script>

