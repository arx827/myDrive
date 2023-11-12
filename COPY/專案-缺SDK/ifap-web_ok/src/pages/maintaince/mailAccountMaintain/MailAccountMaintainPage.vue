<template>
  <div class="searchBlock__wrap">
    <AccordionArea class="mb-2">
      <a-form-model ref="formRef" :colon="false" :model="form" :hide-required-mark="true">
        <div class="row">
          <div class="col-3">
            <a-form-model-item label="發信帳號" prop="mailAccountId">
              <a-input
                v-model="form.mailAccountId"
                placeholder="請輸入"
                allowClear
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="使用者" prop="userOptions">
              <a-select
                v-model="form.userOptions"
                placeholder="請選擇"
                allowClear
                mode="multiple"
                :options="userOptionsArr"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <a-form-model-item label="應用系統" prop="systemOptions">
              <a-select
                v-model="form.systemOptions"
                placeholder="請選擇"
                allowClear
                mode="multiple"
                :options="systemOptionsArr"
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
        <div class="d-flex gap-2">
          <a-button class="linearButton tableHeader__button" @click="addDate">
            新增
          </a-button>
          <a-button class="linearButton tableHeader__button" @click="exportFrom">
            <!-- :disabled="!isShowExportButton" -->
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
        @tableChange="onMasterPageChange($event)"
      >
        <!-- 使用者 -->
        <template v-slot:usersControl="slotProps">
          <a-button class="tableControl__button settingButton" @click="onUserClick(slotProps.data)" />
        </template>

        <!-- 應用系統 -->
        <template v-slot:systemsControl="slotProps">
          <a-button class="tableControl__button customButton" type="primary" icon="file-search" @click="onSysClick(slotProps.data)" />
        </template>
        <!-- 刪除 -->
        <template v-slot:deleteControl="slotProps">
          <!-- <a-popconfirm :title="userModal.sender" ok-text="是" cancel-text="否" @confirm="deleteRowClick(slotProps.data)"> -->
          <a-button class="tableControl__button deleteButton" @click="deleteRowClick(slotProps.data)" />
          <!-- <a-button class="tableControl__button deleteButton" /> -->
          <!-- </a-popconfirm> -->
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
      @cancel="closeEditModal"
    >
      <div>
        <div class="row">
          <a-form-model ref="formRefAddModal" :colon="false" :model="editUserModal.data" :hide-required-mark="true" :rules="editUserModal.submitRules">
            <div class="col-12">
              <a-form-model-item label="發信帳號" prop="sender">
                <a-input
                  v-model="editUserModal.data.sender"
                  placeholder="請輸入"
                  allowClear
                  :disabled="editUserModal.type === 'edit'"
                />
              </a-form-model-item>
            </div>
          </a-form-model>
          <a-form-model ref="formRefAddSystem" :colon="false" :model="editUserModal.data" :hide-required-mark="true" :rules="editUserModal.addRules">
            <div class="d-flex gap-3">
              <div class="col">
                <a-form-model-item label="應用系統代碼" prop="syscode">
                  <a-input
                    v-model="editUserModal.data.syscode"
                    placeholder="請輸入"
                    allowClear
                  />
                </a-form-model-item>
              </div>

              <div class="col">
                <a-form-model-item label="應用系統名稱" prop="sysName">
                  <a-input
                    v-model="editUserModal.data.sysName"
                    placeholder="請輸入"
                    allowClear
                  />
                </a-form-model-item>
              </div>
              <div class="addSystemBtn">
                <a-button type="primary" @click="addSystem">
                  +
                </a-button>
              </div>
            </div>
          </a-form-model>
        </div>
      </div>
      <div class="systemList">
        <FblDataGrid
          :row-key="editUserModal.data.systems.rowKey"
          :columns="editUserModal.data.systems.columns"
          :data="editUserModal.data.systems.data"
          size="small"
          :pagination="editUserModal.data.systems.pagination"
          :empty-data="editUserModal.data.systems.data.length <= 0"
        >
          <!-- 刪除 -->
          <template v-slot:deleteControl="slotProps">
            <a-button class="tableControl__button deleteButton" @click="deleteSysClick(slotProps.data)" />
          </template>
        </FblDataGrid>
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

    <!-- 彈窗：使用者 -->
    <a-modal v-model="userModal.visible" width="888px" :title="userModal.title" :destroyOnClose="true" @cancel="closeUserModal">
      <div class="row mb-2">
        <div class="col">
          未授權使用者
        </div>
        <div class="col ms-3">
          已授權使用者
        </div>
      </div>
      <a-transfer
        class="customTransfer"
        :data-source="userModal.mockData"
        :target-keys="userModal.targetKeys"
        :show-search="true"
        :show-select-all="false"
        :locale="userModal.locale"
        :filter-option="filterFunc"
        @change="onUserModalChange"
      >
        <template #children="{
          props: { filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
        >
          <FblDataGrid
            row-key="userId"
            :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
            :columns="userModal.tableColumns"
            :pagination="false"
            :data="filteredItems"
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
          >
            <template v-slot:status="slotProps">
              <a-badge v-if="slotProps.data.status === '1'" class="ifap__table__badge" color="#52C41A" text="有效" />
              <a-badge v-else class="ifap__table__badge" color="#f50" text="無效" />
            </template>
          </FblDataGrid>
        </template>
      </a-transfer>

      <template #footer>
        <a-button @click="closeUserModal">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitUserModal">
          確定
        </a-button>
      </template>
    </a-modal>

    <!-- 彈窗：應用系統-->
    <a-modal
      v-model="systemModal.visible"
      width="626px"
      :keyboard="false"
      :title="systemModal.title"
      @cancel="closeSysModal"
    >
      <div class="systemList">
        <FblDataGrid
          :row-key="systemModal.systemsTable.rowKey"
          :columns="systemModal.systemsTable.columns"
          :data="systemModal.systemsTable.data"
          size="small"
          :pagination="systemModal.systemsTable.pagination"
          :empty-data="systemModal.systemsTable.data.length <= 0"
        />
      </div>
      <template #footer>
        <a-button type="primary" class="" @click="closeSysModal">
          確定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script src="./MailAccountMaintainPage.ts" lang="ts"></script>

<style lang="scss" scoped>
.addSystemBtn {
  margin-top: 42px;
}

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
</style>
