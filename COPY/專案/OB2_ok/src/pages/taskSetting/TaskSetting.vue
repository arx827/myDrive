<template>
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :model="testForm"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :rules="formRules"
          style="background-color:#eef6f8;"
        >
          <a-row>
            <a-col :span="8" :xl="7" :xxl="6">
              <a-form-model-item label="電訪項目代碼" prop="taskId"
                                 :has-feedback="taskIdValid.feedback" :validateStatus="taskIdValid.state">
                <a-popover placement="top" :trigger="taskIdValid.hover" :content="taskIdValid.msg">
                  <a-input type="text" v-model="testForm.taskId" :maxLength="20" @change="onSearchFormChange"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="8" :xl="7" :xxl="6">
              <a-form-model-item label="電訪項目名稱">
                <a-input type="text" v-model="testForm.taskName" :maxLength="500" @change="onSearchFormChange"></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="8" :xl="7" :xxl="6">
              <a-form-model-item label="業務別類型">
                <a-select v-model="testForm.businessType" :options="selectBusinessTypeOptions" @change="onSearchFormChange"></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
    
          <a-row type="flex" justify="center">
            <div style="margin-bottom:16px;">
              <a-space :size="24">
                <a-button type="primary" @click="clickQuery"> 查詢 </a-button>
                <a-button type="primary" @click="doExport"> 匯出 </a-button>
                <a-button type="default" @click="resetForm"> 清除 </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row>
      <a-col span="24">
        <a-button type="primary" style="margin:6px 24px;" @click="createAddModal()">
          <a-icon type="plus" />新增
        </a-button>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <fbl-data-grid
          :rowKey="masterGrid.rowKey"
          :columns="masterGrid.columns"
          :data="masterGrid.data"
          :pagination="masterGrid.pagination"
          :loading="isLoading"
          @tableChange="onMasterPageChange($event)"
          @inspectClick="onMasterInspectClick($event)"
          @actionClick="onMasterActionClick($event)"
        ></fbl-data-grid>
      </a-col>
    </a-row>

    <!-- 新增/修改窗 -->
    <a-modal v-model="formVisible" :title="formTitle" 
      :centered="true"
      :maskClosable="false"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      @ok="onFormSubmit"
    >
      <task-setting-form
        :initData="masterEditing"
        :loading="isLoading"
        @formCallBack="onFormCallBack"
        ref="taskSettingForm"
      ></task-setting-form>
    </a-modal>

    <!-- 電訪期限及電訪頻率設定子視窗 -->
    <a-modal v-model="formSubConditionVisible" title="電訪期限及電訪頻率設定"  :zIndex="1" 
      :centered="true"
      :maskClosable="false"
      :bodyStyle="{ padding: '24px 24px 24px 5px' }"
      width="1000px"
    >
      <template slot="footer">
        <a-button type="primary" @click="doAddObj" :disabled="!isShowAdd">新增條件</a-button>
        <a-button type="primary" @click="doSubmit">確定</a-button>
        <a-button type="default" @click="doCancel">取消</a-button>
      </template>

      <task-setting-condition-form
        :initConditionData="conditionInspected"
        :loading="isLoading"
        @coditionFormCallBack="onCoditionFormCallBack"
        @btnCallBack="onBtnCallBack"
        ref="taskSettingConditionForm"
      ></task-setting-condition-form>
    </a-modal>
    
  </div>
</template>
<script src="./TaskSetting.ts" lang="ts"></script>




