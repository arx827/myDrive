<template>
  <div>
    <a-spin :spinning="loading">
      <a-form-model
        ref="formRef"
        :model="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-model-item prop="paramGroup" label="參數群組">
          <a-input
            v-model="form.paramGroup"
            allow-clear
            :disabled="type === 'modify'"
            @focus="thirdLayerVisible = true"
          />
        </a-form-model-item>
        <a-form-model-item prop="paramId" label="參數ID">
          <a-input
            v-model="form.paramId"
            allow-clear
            :disabled="type === 'modify'"
          />
        </a-form-model-item>
        <a-form-model-item prop="paramName" label="參數名稱">
          <a-input v-model="form.paramName" allow-clear />
        </a-form-model-item>
        <a-form-model-item prop="paramValue" label="參數值">
          <a-textarea v-model="form.paramValue" :rows="3" allow-clear />
        </a-form-model-item>
        <a-form-model-item prop="memo" label="說明">
          <a-input v-model="form.memo" allow-clear />
        </a-form-model-item>
        <a-form-model-item style="text-align: right" :wrapper-col="{ span: 24 }">
          <a-space>
            <a-checkbox v-if="type==='add'" :checked="continueAdd" @change="continueAdd = !continueAdd">
              繼續新增
            </a-checkbox>
            <a-button type="default" @click="cancel">
              取消
            </a-button>
            <a-button type="primary" @click="submit">
              送出
            </a-button>
          </a-space>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <a-modal
      v-if="thirdLayerVisible"
      v-model="thirdLayerVisible"
      :title="title"
      width="500px"
      :footer="null"
      :destroyOnClose="true"
    >
      <third-layer-form
        @submit="setParamGroup"
        @formCancel="thirdLayerVisible = false"
      />
    </a-modal>
  </div>
</template>

<script src="./SysParamSettingForm.ts" lang="ts">
</script>

<style>
</style>
