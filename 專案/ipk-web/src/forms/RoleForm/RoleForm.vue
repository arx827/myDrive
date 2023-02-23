<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"

      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="功能選單">
        <a-tree
          ref="menuTree"
          v-model="checkedKeys"
          checkable
          :treeData="menuNodes"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-button type="primary" @click="submit">
            送出
          </a-button>
          <a-button type="default" @click="cancel">
            取消
          </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script src="./RoleForm.ts" lang="ts">
</script>

<style>
</style>
