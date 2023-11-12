<template>
  <div class="searchBlock__wrap">
    <AccordionArea class="mb-2">
      <a-form-model ref="formRef" :colon="false" :model="form" :hide-required-mark="true">
        <div class="row">
          <div class="col-3">
            <a-form-model-item label="角色代碼" prop="roleId">
              <a-input
                v-model="form.roleId"
                placeholder="請輸入"
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="角色名稱" prop="roleName">
              <a-input
                v-model="form.roleName"
                placeholder="請輸入"
              />
            </a-form-model-item>
          </div>
          <div class="col-3">
            <a-form-model-item label="群組" prop="groupId">
              <a-select
                v-model="form.groupId"
                mode="multiple"
                placeholder="請選擇"
                :options="groupArr"
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
        <a-button class="clearButton" @click="clearSearch()">
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
        </div>
      </div>
      <FblDataGrid
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :empty-data="grid.data.length <= 0"
        @tableChange="onPageChange($event)"
      >
        <!-- 狀態 -->
        <template v-slot:statusStyle="slotProps">
          <a-badge v-if="!!(Number(slotProps.data.status))" class="ifap__table__badge" color="#52C41A" text="有效" />
          <a-badge v-else class="ifap__table__badge" color="#f50" text="無效" />
        </template>
        <!-- 群組 -->
        <template v-slot:groupControl="slotProps">
          <a-button class="tableControl__button groupButton" @click="groupClick(slotProps.data)" />
        </template>
        <!-- 編輯 -->
        <template v-slot:editControl="slotProps">
          <a-button class="tableControl__button editButton" :disabled="slotProps.data.editDisabled" @click="editClick(slotProps.data)" />
        </template>
      </FblDataGrid>
    </div>

    <!-- 彈窗：新增 / 編輯角色 -->
    <a-modal
      v-model="editRoleModal.visible"
      width="626px"
      :keyboard="false"
      :title="editRoleModal.title[editRoleModal.type === 'edit' ? 1 : 0]"
      @cancel="closeEditModal"
    >
      <EditRoleMaintain
        ref="formRefEditModal"
        :initData="editRoleModal"
        @closeModal="closeEditModal"
      />
      <template #footer>
        <a-button @click="closeEditModal">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitEditModal">
          確定
        </a-button>
      </template>
    </a-modal>

    <!-- 彈窗：角色群組維護 -->
    <a-modal
      v-model="groupSettingModal.visible"
      :destroyOnClose="true"
      width="888px"
      :keyboard="false"
      :title="`群組設定(${groupSettingModal.roleId} ${groupSettingModal.roleName})`"
      @cancel="closeGroupModal"
    >
      <EditRoleGroup
        ref="formRefGroup"
        :initData="groupSettingModal"
        @closeModal="closeGroupModal"
      />
      <template #footer>
        <a-button @click="closeGroupModal">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitGroupModal">
          確定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script src="./RoleMaintainPage.ts" lang="ts" />

<style lang="scss" scoped>
.groupButton {
  background-image: url("~@imgs/icon_setting.svg");
  &:hover {
    background-image: url("~@imgs/icon_setting_hover.svg");
  }
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

.ant-transfer {
  ::v-deep{
    .ant-transfer-list {
      // padding-top: 0;
      // .ant-transfer-list-header {
      //   display: none;
      // }

      .ant-transfer-list-body-customize-wrapper {
        .ant-table-row {
          td:not(.ant-table-selection-column) {
            max-width: 20%;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
