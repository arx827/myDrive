<template>
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :model="testForm"
          :label-col="{ span: 9 }"
          :wrapper-col="{ span: 15 }"
          :rules="formRules"
          style="background-color:#eef6f8;"
        >
          <a-row>
            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="電訪項目代碼-名稱">
                <a-select v-model="testForm.taskId" :options="selectTaskIdNameOptions" @change="onSearchFormChange" show-search option-filter-prop="children"></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="問卷代碼" prop="questCode"
                                 :has-feedback="questCodeValid.feedback" :validateStatus="questCodeValid.state">
                <a-popover placement="top" :trigger="questCodeValid.hover" :content="questCodeValid.msg">
                  <a-input type="text" v-model="testForm.questCode" :maxLength="20" @change="onSearchFormChange"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="問卷名稱">
                <a-input type="text" v-model="testForm.questName" :maxLength="500" @change="onSearchFormChange"></a-input>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="是否啟用">
                <a-select v-model="testForm.questEnable" @change="onSearchFormChange">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">啟用</a-select-option>
                  <a-select-option value="1">停用</a-select-option>
                </a-select>
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
          @actionClick="onMasterActionClick($event)"
        ></fbl-data-grid>
      </a-col>
    </a-row>

    <!-- 新增/修改 主檔窗 -->
    <a-modal v-model="formVisible" :title="formTitle" 
      :centered="true"
      :maskClosable="false"
      :bodyStyle="{ padding: '24px 24px 24px 5px' }"
      width="1000px"
    >
      <template slot="footer">
        <a-upload :file-list="[]" :multiple="false" :before-upload="beforeUpload">
          <a-button type="primary"> <a-icon type="upload" /> 匯入 </a-button>
        </a-upload>
        <a-button type="primary" @click="doAddObj" :disabled="!isShowAdd"> 新增條件 </a-button>
        <a-button type="primary" @click="doSubmit"> 確定 </a-button>
        <a-button type="default" @click="doCancel"> 取消 </a-button>
      </template>

      <questionnaire-setting-main-form
        :initData="masterEditing"
        :loading="isLoading"
        @formCallBack="onMainFormCallBack"
        @btnCallBack="onBtnCallBack"
        ref="questionnaireSettingMainForm"
      ></questionnaire-setting-main-form>
    </a-modal>

    <!-- 條件細項 顯示窗 -->
    <a-modal v-model="showFormVisible" title="條件明細" 
      :centered="true"
      :maskClosable="false"
      :ok-button-props="{ style: { display: 'none' } }"
      cancelText="關閉"
      width="800px"
    >
      <questionnaire-setting-show-form
        :conditionList="conditionList"
      >
      </questionnaire-setting-show-form>
    </a-modal>

    <!-- 問卷設定窗 -->
    <a-modal v-model="settingFormVisible" title="問卷設定" 
      :centered="true"
      :maskClosable="false"
      width="1000px"
    >
      <template slot="footer">
        <a-button type="primary" @click="doSettingSubmit"> 儲存 </a-button>
        <a-button type="primary" @click="doSettingShowQuest"> 問卷預覽 </a-button>
        <a-button type="primary" @click="doSettingShowRight"> 權益信函預覽 </a-button>
        <a-button type="default" @click="doSettingCancel"> 取消 </a-button>
      </template>

      <questionnaire-setting-form
        :initData="settingFormData"
        :loading="isLoading"
        @formCallBack="onFormCallBack"
        ref="questionnaireSettingForm"
      ></questionnaire-setting-form>
    </a-modal>
    
  </div>
</template>
<script src="./QuestionnaireSetting.ts" lang="ts"></script>

<style scoped>
  /** 頁面滾動 */
  ::v-deep .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  /** 匯入Excel按鈕 */
  ::v-deep .ant-modal-footer > span {
    display: inline-block;
    margin-right: 8px;
  }
</style>



