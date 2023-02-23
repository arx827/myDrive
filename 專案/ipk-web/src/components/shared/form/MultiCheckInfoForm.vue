<template>
  <div>
    <a-form-model
      layout="vertical"
      :model="checkInfoForm"
      :rules="formRules"
      class="checkInfo"
    >
      <div v-for="(titleItem, index) in checkInfoFormTitle" :key="index.toString()">
        <div class="modal__body__title">
          {{ titleItem.label }}
        </div>
        <a-row :gutter="[12]" type="flex" :wrap="true">
          <a-col
            v-for="(item,key,index1) in checkInfoForm[titleItem.value]"
            :key="index1"
            :span="item.span ? item.span : 6"
          >
            <a-form-model-item
              v-if="item.type !== 'action'"
              :prop="key"
              :label="item.label"
            >
              <a-input
                v-if="item.type === 'badge'"
                class="checkInfo__input"
                :disabled="true"
              >
                <a-badge
                  slot="prefix"
                  :color="getBadgeObject(item.key).color"
                  :text="getBadgeObject(item.key).key"
                />
              </a-input>
              <a-textarea
                v-else-if="item.type === 'textarea'"
                v-model="item.key"
                class="checkInfo__input"
                rows="1"
                :disabled="true"
              />
              <a-input
                v-else
                v-model="item.key"
                class="checkInfo__input"
                :disabled="true"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
  </div>
</template>
<script src="./MultiCheckInfoForm.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .checkInfo {
    .ant-input {
      border: none;
      border-radius: 0;
      resize: none;
      cursor: default;
    }
    .ant-input[disabled] {
      background-color: transparent;
    }
    .checkInfo__input {
      border: none;
      border-bottom: 1px solid $COLOR-GRAY13;
      border-radius: 0;
      color: $COLOR-MAIN2;
      font-size: 16px;
      padding: 0;
    }
  }
  // badge 文字
  .ant-badge-status-text {
    color: $COLOR-MAIN2;
    font-size: 16px;
  }
  // badge 大小
  .ant-badge-status-dot {
    width: 12px;
    height: 12px;
  }
}
.modal__body__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
}
</style>
