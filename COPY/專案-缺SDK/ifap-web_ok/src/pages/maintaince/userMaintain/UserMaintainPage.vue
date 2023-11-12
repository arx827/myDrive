<template>
  <div class="searchBlock__wrap">
    <AccordionArea class="mb-2">
      <a-form-model ref="formRef" :colon="false" :model="form" :rules="formRules" :hide-required-mark="true">
        <div class="row">
          <div class="col-3">
            <a-form-model-item label="使用者帳號" prop="userId">
              <a-input
                v-model="form.userId"
                placeholder="請輸入"
                allowClear
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="使用者姓名" prop="userName">
              <a-input
                v-model="form.userName"
                placeholder="請輸入"
                allowClear
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="單位代碼" prop="deptId">
              <a-input
                v-model="form.deptId"
                placeholder="輸入單位代碼"
                allowClear
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="角色" prop="roleId">
              <a-select
                v-model="form.roleId"
                mode="multiple"
                placeholder="請選擇"
                allowClear
                :options="roleArr"
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="狀態" prop="status">
              <a-select
                v-model="form.status"
                placeholder="請選擇"
                allowClear
                :options="statusAndAllArr"
              />
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>
      <div class="d-flex justify-content-center">
        <a-button class="linearButton" @click="searchSubmit">
          查詢
        </a-button>
        <a-button class="clearButton" @click="resetFrom">
          清除
        </a-button>
      </div>
    </AccordionArea>
    <img class="searchBlock__bgImg bgImg__maintaince" src="~@imgs/image_editbg_2x.png" alt="">

    <!-- 查詢結果 控制項 -->
    <div class="searchResultWrap">
      <div class="searchResult__control d-flex justify-content-between align-items-center">
        <div class="showResultsNumber d-flex align-items-center">
          <a-icon type="search" />
          <span class="ms-1"> 查詢結果共有 {{ getDataNum }} 筆資料</span>
        </div>
        <div>
          <a-button class="linearButton tableHeader__button" @click="addDate">
            新增
          </a-button>
          <a-button class="linearButton tableHeader__button" @click="exportFrom">
            匯出
          </a-button>
        </div>
      </div>
      <FblDataGrid
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :empty-data="grid.data.length <= 0"
        @tableChange="onUserMaintainPageChange($event)"
      >
        <!-- 狀態 -->
        <template v-slot:stateStyle="slotProps">
          <!-- TODO: -->
          <!-- <a-badge v-if="slotProps.data.status" class="ifap__table__badge" color="#52C41A" text="有效" /> -->
          <a-badge v-if="!!(Number(slotProps.data.status))" class="ifap__table__badge" color="#52C41A" text="有效" />
          <a-badge v-else class="ifap__table__badge" color="#f50" text="無效" />
        </template>
        <!-- 角色維護 -->
        <template v-slot:roleCntrol="slotProps">
          <a-button class="tableControl__button settingButton" @click="roleClick(slotProps.data)" />
        </template>
        <!-- 編輯 -->
        <template v-slot:editControl="slotProps">
          <a-button class="tableControl__button editButton" :disabled="slotProps.data.editDisabled" @click="editClick(slotProps.data)" />
        </template>
      </FblDataGrid>
    </div>

    <!-- 彈窗：新增 / 編輯使用者 -->
    <a-modal
      v-model="editUserModal.visible"
      width="626px"
      :keyboard="false"
      :title="editUserModal.title[editUserModal.type === 'edit' ? 1 : 0]"
      :destroyOnClose="true"
      @cancel="closeEditModal"
    >
      <div class="ifap__description">
        <a-form-model ref="formRefEditModal" :colon="false" :model="editUserModal.data" :hide-required-mark="true" :rules="editUserModal.rules">
          <div class="row">
            <div class="col-6">
              <a-form-model-item label="使用者帳號" prop="userId">
                <a-input
                  v-if="editUserModal.type === 'edit'"
                  v-model="editUserModal.data.userId"
                  placeholder="請輸入"
                  :disabled="editUserModal.type === 'edit'"
                  allowClear
                />
                <a-input-search v-if="editUserModal.type === 'add'" v-model="editUserModal.data.userId" placeholder="請輸入" allowClear enter-button @search="searchUserId" />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="使用者姓名" prop="userName">
                <a-input
                  v-model="editUserModal.data.userName"
                  placeholder="請輸入"
                  allowClear
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="員工編號" prop="empNo">
                <a-input
                  v-model="editUserModal.data.empNo"
                  placeholder="請輸入"
                  :disabled="editUserModal.type === 'edit'"
                  allowClear
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="電子郵件" prop="email">
                <a-input
                  v-model="editUserModal.data.email"
                  placeholder="請輸入"
                  allowClear
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="分機號碼" prop="ext">
                <a-input
                  v-model="editUserModal.data.ext"
                  placeholder="請輸入"
                  allowClear
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="單位代號" prop="dptId">
                <a-input
                  v-model="editUserModal.data.dptId"
                  placeholder="請輸入"
                  allowClear
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="單位名稱">
                <a-input
                  :value="departmentName"
                  disabled
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <a-form-model-item label="狀態" prop="status">
                <a-select
                  v-model="editUserModal.data.status"
                  placeholder="請選擇"
                  :options="statusArr"
                  allowClear
                />
              </a-form-model-item>
            </div>
            <div v-if="editUserModal.type === 'edit'" class="col-6">
              <a-form-model-item label="帳號停用日">
                <a-input
                  :value="editUserModal.data.accountDisabledDate"
                  disabled
                />
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
      </div>
      <template #footer>
        <a-button @click="closeEditModal">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitEditModal">
          確定
        </a-button>
      </template>
    </a-modal>

    <!-- 彈窗：角色維護 -->
    <a-modal
      v-model="roleSettingModal.visible"
      :destroyOnClose="true"
      width="888px"
      :keyboard="false"
      :title="`角色設定 (${roleSettingModal.userId} ${roleSettingModal.userName})`"
      @cancel="closeRoleModal"
    >
      <div class="row mb-2">
        <div class="col">
          未授權角色
        </div>
        <div class="col ms-3">
          已授權角色
        </div>
      </div>
      <a-transfer
        class="customTransfer"
        :data-source="roleSettingModal.mockData"
        :target-keys="roleSettingModal.targetKeys"
        :show-search="true"
        :show-select-all="false"
        :locale="roleSettingModal.locale"
        :filter-option="filterFunc"
        @change="onChange"
      >
        <template #children="{
          props: { filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
        >
          <a-table
            :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
            :columns="roleSettingModal.tableColumns"
            :pagination="false"
            :data-source="filteredItems"
            size="small"
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :custom-row="({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })"
          />
        </template>
      </a-transfer>
      <template #footer>
        <a-button @click="closeRoleModal">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitRoleModal">
          確定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script src="./UserMaintainPage.ts" lang="ts"></script>

<style lang="scss" scoped>

::v-deep{
  .ifap__table__badge {
    .ant-badge-status-dot {
      width: 12px;
      height: 12px;
    }
  }

  .ant-form-item-label {
    .ant-form-item-required {
      &::after {
        content: '*';
        color: $COLOR-MAIN12;
      }
    }
  }
}

.customTransfer {
  ::v-deep{
    > .ant-transfer-list {
      flex: 1;
    }
  }
}
</style>
