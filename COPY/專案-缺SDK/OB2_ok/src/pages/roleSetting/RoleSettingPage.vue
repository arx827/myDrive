<template >
  <div tabindex="-1" @keyup.enter="roleSearch">
    {{ roleSearchForm.roleName }}
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          ref="roleSettingRules"
          :model="roleSearchForm"
          :rules="roleSearchRules"
          style="background-color: #eef6f8"
        >
          <a-row>
            <a-col :span="5">
              <!-- 角色代號 -->
              <a-form-model-item
                :label="$t('roleSP_roleCodeName')"
                prop="id"
                style="margin-bottom: 0px"
                :has-feedback="
                  callCommonUtilFeildFeedback(roleSettingValidateObject.id)
                "
                :validateStatus="
                  callCommonUtilFeildStatus(roleSettingValidateObject.id)
                "
              >
                <a-popover
                  placement="top"
                  :destroyTooltipOnHide="true"
                  :content="
                    $t('global_role') +
                    $t('global_codeName') +
                    $t('global_alphanumericAndUnderscoresInputOnly')
                  "
                  :trigger="
                    callCommonUtilFeildTrigger(roleSettingValidateObject.id)
                  "
                  :visible="
                    callCommonUtilFeildHoverVisible(
                      roleSettingValidateObject.id
                    )
                  "
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      roleSettingValidateObject.id
                    )
                  "
                >
                  <a-input type="text" v-model="roleSearchForm.id" />
                </a-popover>
                <!-- <a-select
                  show-search
                  v-model="roleSearchForm.id"
                  :options="selectIdOptions"
                  @select="onSeletRoleId"
                  @change="exportDisable = true"
                ></a-select> -->
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 角色名稱 -->
              <a-form-model-item
                :label="$t('roleSP_roleName')"
                prop="name"
                style="margin-bottom: 0px"
                :has-feedback="
                  callCommonUtilFeildFeedback(roleSettingValidateObject.name)
                "
                :validateStatus="
                  callCommonUtilFeildStatus(roleSettingValidateObject.name)
                "
              >
                <a-popover
                  placement="top"
                  :destroyTooltipOnHide="true"
                  :content="
                    $t('global_role') +
                    $t('global_name') +
                    $t('global_noSymbols')
                  "
                  :trigger="
                    callCommonUtilFeildTrigger(roleSettingValidateObject.name)
                  "
                  :visible="
                    callCommonUtilFeildHoverVisible(
                      roleSettingValidateObject.name
                    )
                  "
                  @visibleChange="
                    callCommonUtilFeildVisibleChange(
                      roleSettingValidateObject.name
                    )
                  "
                >
                  <a-input type="text" v-model="roleSearchForm.name" />
                </a-popover>
                <!-- <a-select
                  show-search
                  v-model="roleSearchForm.name"
                  :options="selectNameOptions"
                  @select="onSeletRoleName"
                  @change="exportDisable = true"
                ></a-select> -->
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 描述 -->
              <a-form-model-item
                :label="$t('roleSF_description')"
                prop="roleDesc"
                style="margin-bottom: 0px"
              >
                <!-- <a-popover
                  placement="top"
                  :content="$t('roleSP_instructionNoSymbols')"
                > -->
                <a-input
                  type="text"
                  v-model="roleSearchForm.roleDesc"
                  @change="exportDisable = true"
                />
                <!-- </a-popover> -->
              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 狀態 -->
              <a-form-model-item
                :label="$t('global_status')"
                style="margin-bottom: 0px"
              >
                <a-select
                  v-model="roleSearchForm.status"
                  :options="selectStatusOptions"
                  @select="exportDisable = true"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 群組 -->
          <!-- <a-row>
            <a-col :span="5">
              <a-form-model-item
                :label="$t('global_group')"
                style="margin-bottom: 0px"
              >
                <a-select
                  show-search
                  v-model="roleSearchForm.group"
                  :options="selectGroupOptions"
                  :placeholder="$t('global_select')"
                  option-filter-prop="children"
                  :filter-option="filterGroupOption"
                  @select="exportDisable = true"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="roleSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetFrom">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportSearchResult">
                  {{ $t("global_export") }}
                </a-button>
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
          @click="addUserDetail"
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
          @actionClick="onRoleTableActionClick($event)"
          style="padding-left: 24px; padding-right: 12px"
          @tableChange="onPageChange($event)"
        >
        </FblDataGrid>
      </a-col>
    </a-row>

    <a-modal
      v-model="modelParams.roleSetting.formVisible"
      :title="modelParams.roleSetting.titleText"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      :maskClosable="false"
      @ok="onFormSubmit"
    >
      <RoleSettingForm
        :initData="updateChangeForm"
        @Visible="inVisible"
        ref="roleSetting"
      >
      </RoleSettingForm>
    </a-modal>

    <!-- 角色功能設定 -->
    <a-modal
      id="roleGroupTitle"
      v-model="modelParams.roleGroup.formVisible"
      width="1100px"
      :footer="!isRoleEnable ? null : undefined"
      :destroyOnClose="true"
      :maskClosable="false"
    >
    <template slot="title">
      <div>
        <span>{{ modelParams.roleGroup.titleText }}</span>
        <span v-if="!isRoleEnable" class="disable">{{ disableText }} </span>
      </div>
    </template>
      <template slot="footer">
        <div>
          <a-button @click="modelParams.roleGroup.formVisible = false">{{
            $t("global_cancel")
          }}</a-button>
          <a-button type="primary" @click="onFunctionFormSubmit">{{
            $t("global_ok")
          }}</a-button>
        </div>
      </template>
      <RoleGroupForm
        :roleId="columnRoleId"
        :isRoleEnable="isRoleEnable"
        @roleGroupSubmit="onGroupSubmit"
        ref="roleGroupForm"
      >
      </RoleGroupForm>
    </a-modal>

    <!-- 角色人員設定 -->
    <a-modal
      id="roleUserTitle"
      v-model="modelParams.roleUser.formVisible"
      width="1100px"
      :footer="!isRoleEnable ? null : undefined"
      :destroyOnClose="true"
      :maskClosable="false"
    >
    <template slot="title">
      <div>
        <span>{{ modelParams.roleUser.titleText }}</span>
        <span v-if="!isRoleEnable" class="disable">{{ disableText }} </span>
      </div>
    </template>
      <template slot="footer">
        <div>
          <a-button @click="modelParams.roleUser.formVisible = false">{{
            $t("global_cancel")
          }}</a-button>
          <a-button type="primary" @click="onRoleUserSubmit">{{
            $t("global_ok")
          }}</a-button>
        </div>
      </template>
      <UserUpdateForm
        :mockData="roleUsersMockData"
        :targetKeys="userIdRole"
        :isRoleEnable="isRoleEnable"
        ref="roleUserForm"
      >
      </UserUpdateForm>
    </a-modal>
  </div>
</template>

<script src="./RoleSettingPage.ts" lang="ts"></script>
<style lang="less" scoped>
// 停用文字紅色顯示
.disable{
    color:red;
  }
</style>
