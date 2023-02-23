<template>
  <div>
    <a-form-model :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-row>
        <a-col>
          <a-form-model-item
            label="選擇表單"
            prop="codeTableName"
            style="margin-bottom: 0px"
          >
            <a-select
              v-model="selected"
              show-search
              placeholder="請選擇"
              style="width: 175px"
              :filter-option="filterOption"
              :options="options"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col>
          <a-form-model-item style="height: 80px" :wrapper-col="{ span: 24 }">
            <file-upload
              :chooseSpan="12"
              :uploadSpan="12"
              :accept="accept"
              @upload="onUpload($event)"
            />
          </a-form-model-item>
          <a-form-model-item
            style="text-align: right"
            :wrapper-col="{ span: 24 }"
          >
            <a-space>
              <a-button type="default" @click="cancel">
                取消
              </a-button>
            </a-space>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script src="./CodeTableForm.ts" lang="ts">
</script>

<style>
</style>
