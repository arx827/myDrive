<template>
  <div>
    <a-form-model
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 15 }"
      :model="commonCodeChangeForm"
      :rules="commonCodeFormRules"
    >
      <a-row>
        <!-- 類別代碼 -->
        <a-col>
          <a-form-model-item
            class="typeId"
            :label="$t('commonCode_typeId')"
            prop="typeId"
            style="margin-bottom: 0px"
            :has-feedback="commonCodeValidateForm.typeId.feedback"
            :validateStatus="commonCodeValidateForm.typeId.state"
            required
          >
            <a-popover
              placement="top"
              :content="commonCodeValidateForm.typeId.msg"
              :trigger="commonCodeValidateForm.typeId.hover"
            >
              <a-select
                v-model="commonCodeChangeForm.typeId"
                :options="commonCodeTypeOptions"
                :filter-option="filterOption"
                show-search
                :disabled="isEdit"
                @blur="onTypeIdChange"
              >
              </a-select>
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col>
          <!-- 代碼ID -->
          <a-form-model-item
            class="code"
            :label="$t('commonCode_code')"
            prop="code"
            style="margin-bottom: 0px"
            :has-feedback="commonCodeValidateForm.code.feedback"
            :validateStatus="commonCodeValidateForm.code.state"
            required
          >
            <a-popover
              placement="top"
              :content="commonCodeValidateForm.code.msg"
              :trigger="commonCodeValidateForm.code.hover"
            >
              <a-input
                type="text"
                :max-length="200"
                v-model="commonCodeChangeForm.code"
                :disabled="isEdit"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col>
          <!-- 代碼說明 -->
          <a-form-model-item
            class="codeName"
            :label="$t('commonCode_codeName')"
            prop="codeName"
            style="margin-bottom: 0px"
            :has-feedback="commonCodeValidateForm.codeName.feedback"
            :validateStatus="commonCodeValidateForm.codeName.state"
            required
          >
            <a-popover
              placement="top"
              :content="commonCodeValidateForm.codeName.msg"
              :trigger="commonCodeValidateForm.codeName.hover"
            >
              <a-textarea
                type="text"
                :max-length="200"
                v-model="commonCodeChangeForm.codeName"
                :auto-size="{ minRows: 2, maxRows: 2 }"
              />
            </a-popover>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 代碼說明一 -->
      <a-form-model-item
        class="sMemo1"
        :label="$t('commonCode_sMemo1')"
        prop="sMemo1"
        style="margin-bottom: 0px"       
      >
        <a-textarea
          type="text"
          :max-length="1000"
          v-model="commonCodeChangeForm.sMemo1"
          :auto-size="{ minRows: 3, maxRows: 3 }"
        />
      </a-form-model-item>
      <!-- 代碼說明二 -->
      <a-form-model-item
        class="sMemo2"
        :label="$t('commonCode_sMemo2')"
        prop="sMemo2"
        style="margin-bottom: 0px"
      >
        <a-textarea
          type="text"
          :max-length="100"
          v-model="commonCodeChangeForm.sMemo2"
          :auto-size="{ minRows: 2, maxRows: 2 }"
        />
      </a-form-model-item>
      <!-- 代碼說明三 -->
      <a-form-model-item
        class="sMemo3"
        :label="$t('commonCode_sMemo3')"
        prop="sMemo3"
        style="margin-bottom: 0px"      
      >
        <a-textarea
          type="text"
          :max-length="100"
          v-model="commonCodeChangeForm.sMemo3"
          :auto-size="{ minRows: 2, maxRows: 2 }"
        />
      </a-form-model-item>
      <!-- 狀態 -->
      <a-form-model-item
        class="status"
        :label="$t('global_status')"
        prop="status"
        style="margin-bottom: 0px"
        :has-feedback="commonCodeValidateForm.status.feedback"
        :validateStatus="commonCodeValidateForm.status.state"
        required
      >
        <a-popover
          placement="top"
          :content="commonCodeValidateForm.status.msg"
          :trigger="commonCodeValidateForm.status.hover"
        >
          <a-select
            v-model="commonCodeChangeForm.status"
            :options="commonCodeStatusOptions"
            :filter-option="filterOption"
          >
          </a-select>
        </a-popover>
      </a-form-model-item>
      <!-- 排列順序 -->
      <a-form-model-item
        class="codeSort"
        :label="$t('menuSP_arrangeOrder')"
        prop="codeSort"
        style="margin-bottom: 0px"
        :has-feedback="commonCodeValidateForm.codeSort.feedback"
        :validateStatus="commonCodeValidateForm.codeSort.state"
        required
      >
        <a-popover
          placement="top"
          :content="commonCodeValidateForm.codeSort.msg"
          :trigger="commonCodeValidateForm.codeSort.hover"
        >
          <a-input
            type="text"
            :max-length="9"
            v-model="commonCodeChangeForm.codeSort"
          />
        </a-popover>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script src="./CommonCodeEditForm.ts" lang="ts"></script>