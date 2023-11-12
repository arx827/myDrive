<template>
  <div tabindex="-1" @keyup.enter="userSearch">
    <hidden-folde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          ref="userMaintainRules"
          :model="userMaintainSearchForm"
          :rules="userSearchRules"
          style="background-color: #eef6f8"
        >
          <a-row>
            <!-- 使用者帳號 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('userMP_userAccount')"
                prop="userId"
                style="margin-bottom: 0px"
                :has-feedback="userMaintainValidateObject.userId.feedback"
                :validateStatus="
                  userMaintainValidateObject.userId.feedback == true
                    ? 'error'
                    : 'success'
                "
              >
                <a-popover
                  placement="top"
                  :destroyTooltipOnHide="true"
                  :content="$t('userMP_userAccountAlphanumericInputOnly')"
                  :trigger="
                    userMaintainValidateObject.userId.feedback == true
                      ? 'hover'
                      : ''
                  "
                  :visible="userMaintainValidateObject.userId.hoverVisible"
                  @visibleChange="
                    userMaintainValidateObject.userId.hoverVisible =
                      !userMaintainValidateObject.userId.hoverVisible
                  "
                >
                  <a-input
                    type="text"
                    v-model="userMaintainSearchForm.userId"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 使用者姓名 -->
              <a-form-model-item
                :label="$t('userMP_userHumanName')"
                prop="name"
                style="margin-bottom: 0px"
                :has-feedback="userMaintainValidateObject.name.feedback"
                :validateStatus="
                  userMaintainValidateObject.name.feedback == true
                    ? 'error'
                    : 'success'
                "
              >
                <a-popover
                  placement="top"
                  :destroyTooltipOnHide="true"
                  :content="$t('userMP_userHumanNameNoSymbols')"
                  :trigger="
                    userMaintainValidateObject.name.feedback == true
                      ? 'hover'
                      : ''
                  "
                  :visible="userMaintainValidateObject.name.hoverVisible"
                  @visibleChange="
                    userMaintainValidateObject.name.hoverVisible =
                      !userMaintainValidateObject.name.hoverVisible
                  "
                >
                  <a-input type="text" v-model="userMaintainSearchForm.name" />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <!-- 部門 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('global_department')"
                prop="dept"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="userMaintainSearchForm.deptId"
                  :options="selectDeptOptions"
                  @select="onSeletDept"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 科別 -->
              <a-form-model-item
                :label="$t('global_division')"
                prop="divi"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="userMaintainSearchForm.diviId"
                  :options="selectDiviOptionsOnSelect"
                  @select="onSeletDivi"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5">
              <!-- 員工編號 -->
              <a-form-model-item
                :label="$t('userMP_employeeSerialNumber')"
                prop="staffNo"
                style="margin-bottom: 0px"
                :has-feedback="userMaintainValidateObject.staffNo.feedback"
                :validateStatus="
                  userMaintainValidateObject.staffNo.feedback == true
                    ? 'error'
                    : 'success'
                "
              >
                <a-popover
                  placement="top"
                  :content="$t('userMP_employeeSerialNumberOnlyInputNumbers')"
                  :trigger="
                    userMaintainValidateObject.staffNo.feedback == true
                      ? 'hover'
                      : ''
                  "
                  :visible="userMaintainValidateObject.staffNo.hoverVisible"
                  @visibleChange="
                    userMaintainValidateObject.staffNo.hoverVisible =
                      !userMaintainValidateObject.staffNo.hoverVisible
                  "
                >
                  <a-input
                    type="text"
                    v-model="userMaintainSearchForm.staffNo"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 分機號碼 -->
              <a-form-model-item
                :label="$t('global_extension')"
                prop="extensionNo"
                style="margin-bottom: 0px"
                :has-feedback="userMaintainValidateObject.extensionNo.feedback"
                :validateStatus="
                  userMaintainValidateObject.extensionNo.feedback == true
                    ? 'error'
                    : 'success'
                "
              >
                <a-popover
                  placement="top"
                  :content="$t('userMP_extensionNumberOnlyInputNumbers')"
                  :trigger="
                    userMaintainValidateObject.extensionNo.feedback == true
                      ? 'hover'
                      : ''
                  "
                  :visible="userMaintainValidateObject.extensionNo.hoverVisible"
                  @visibleChange="
                    userMaintainValidateObject.extensionNo.hoverVisible =
                      !userMaintainValidateObject.extensionNo.hoverVisible
                  "
                >
                  <a-input
                    type="text"
                    v-model="userMaintainSearchForm.extensionNo"
                  />
                </a-popover>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 角色 -->
              <a-form-model-item
                :label="$t('global_role')"
                prop="role"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="userMaintainSearchForm.roles"
                  :options="selectRoleOptions"
                  :filter-option="filterOption"
                  @change="selectionChange"
                  :placeholder="$t('global_all')"
                ></a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 員工類別 -->
              <a-form-model-item
                :label="$t('userMP_employeeClass')"
                prop="staffType"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="userMaintainSearchForm.staffType"
                  :options="selectStaffTypeOptions"
                  @change="selectionChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5">
              <!-- 狀態 -->
              <a-form-model-item
                :label="$t('global_status')"
                prop="status"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="userMaintainSearchForm.status"
                  :options="selectUserStatus"
                  @change="selectionChange"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="userSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetUserSearchForm">
                  {{ $t("global_clean") }}
                </a-button>
                <a-divider type="vertical"></a-divider>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportSearchResult">
                  {{ $t("global_export") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </hidden-folde>

    <a-row>
      <a-col>
        <!-- 新增 -->
        <a-button
          type="primary"
          @click="showUserAddModal"
          style="margin-top: 6px; margin-bottom: 6px; margin-left: 24px"
        >
          <a-icon type="plus" />{{ $t("global_add") }}
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <fbl-data-grid
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :loading="isLoading"
          size="middle"
          @actionClick="onUserTableActionClick($event)"
          @tableChange="onPageChange($event)"
          style="padding-left: 24px; padding-right: 12px"
          ref="userDataGrid"
        >
        </fbl-data-grid>
      </a-col>
    </a-row>
    <a-modal
      v-model="formRoleVisible"
      width="900px"
      :footer="!isUserEnable ? null : undefined"
      :centered="true"
      :destroyOnClose="true"
      :maskClosable="false"
      @cancle="onRoleFormCancel"
    >
    <template slot="title">
      <div>
        <span>{{ formRoleModalTile }}</span>
        <span v-if="!isUserEnable" class="disable">{{ disableText }} </span>
      </div>
    </template>
      <template slot="footer">
        <div>
          <a-button @click="onRoleFormCancel">{{
            $t("global_cancel")
          }}</a-button>
          <a-button type="primary" @click="onRoleFormSubmit">{{
            $t("global_ok")
          }}</a-button>
        </div>
      </template>

      <role-update-form
        :loading="isLoading"
        ref="roleUpdate"
        :mockData="userRolesMockData"
        :targetKeys="userIdRole"
        :isUserEnable="isUserEnable"
      ></role-update-form>
    </a-modal>

    <a-modal
      v-model="formVisible"
      :title="titleText"
      :cancelText="$t('global_cancel')"
      :okText="$t('roleSF_confirm')"
      :maskClosable="false"
      @ok="userModalSubmit"
      @cancel="userModalCancel"
    >
      <!-- :unitFormOption="unitFormOption" -->
      <user-form
        :initData="editingData"
        :loading="isLoading"
        ref="userForm"
        @reloadData="userSearch"
        @reloadDropdownData="reloadDropdownData"
      >
      </user-form>
    </a-modal>
  </div>
</template>

<script src="./UserMaintainPage.ts" lang="ts"></script>
<style lang="less" scoped>
// 停用文字紅色顯示
.disable{
    color:red;
  }
</style>

