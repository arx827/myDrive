<template>
  <div class="ifap__description">
    <a-form-model ref="formRefEditModal" :colon="false" :model="initData.data" :hide-required-mark="true" :rules="initData.rules">
      <div class="row">
        <div class="col-6">
          <a-form-model-item label="角色代碼" prop="roleId">
            <a-input
              v-model="initData.data.roleId"
              placeholder="請輸入"
              :disabled="initData.type === 'edit'"
            />
          </a-form-model-item>
        </div>
        <div class="col-6">
          <a-form-model-item label="角色名稱" prop="roleName">
            <a-input
              v-model="initData.data.roleName"
              placeholder="請輸入"
            />
          </a-form-model-item>
        </div>
        <div class="col-6">
          <a-form-model-item label="狀態" prop="status">
            <a-select
              v-model="initData.data.status"
              placeholder="請選擇"
              :options="statusArr"
            />
          </a-form-model-item>
        </div>
      </div>
    </a-form-model>
  </div>
</template>
<script src="./EditRoleMaintain.ts" lang="ts"></script>
