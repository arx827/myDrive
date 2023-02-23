<template>
  <div class="btnGroup tabline">
    <AdvancedSearch
      ref="advancedSearch"
      v-model="advancedSearchForm"
      :labelList="labelList"
      :usualFormData="usualForm"
      :functionName="functionName"
      @handleSearch="handleSearch($event)"
    />
    <button class="btn__main btn__main--primary mt-3" @click="onAddClick">
      <a-icon type="plus" class="icon_margin" />
      新增
    </button>
    <IpkVxeTable
      :ipkGrid="ipkGrid"
      @getActionType="getActionType($event)"
      @handlePageChange="handlePageChange($event)"
    />
    <a-modal
      v-model="settingFormVisible"
      :title="settingFormTitle"
      width="400px"
      :footer="null"
      :destroyOnClose="true"
    >
      <sys-param-setting-form
        :initData="params"
        :type="formType"
        :loading="isLoading"
        @submitModify="onSubmitModify"
        @submitAdd="onSubmitAdd"
        @formCancel="settingFormVisible = false"
      />
    </a-modal>
    <a-modal
      v-model="histFormVisible"
      :title="histFormTitle"
      width="1350px"
      :footer="null"
      :destroyOnClose="true"
    >
      <sys-param-hist-form
        :initData="params"
        :loading="isLoading"
        @formCancel="histFormVisible = false"
      />
    </a-modal>
  </div>
</template>

<script src="./SysParamSettingPage.ts" lang="ts">
</script>

<style scoped>
</style>
