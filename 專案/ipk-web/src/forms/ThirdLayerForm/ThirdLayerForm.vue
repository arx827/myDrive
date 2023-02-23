<template>
  <div>
    <a-form-model
      ref="formRef"
      :model="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-row>
        <a-col :span="19">
          <a-form-model-item prop="paramGroup1" label="參數群組1">
            <a-input
              v-model="form.paramGroup1"
              :readOnly="true"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" @click="submit(form.paramGroup1)">
            <a-icon type="plus-circle" />
          </a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="19">
          <a-form-model-item prop="paramGroup2" label="參數群組2">
            <a-input
              v-model="form.paramGroup2"
              :readOnly="true"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="3">
          <a-button type="primary" @click="submit(form.paramGroup2)">
            <a-icon type="plus-circle" />
          </a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script src="./ThirdLayerForm.ts" lang="ts">
</script>

<style>
</style>
