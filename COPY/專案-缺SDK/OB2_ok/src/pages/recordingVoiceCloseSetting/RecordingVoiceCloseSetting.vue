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
            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="段落類型">
                <a-select v-model="testForm.itemTypeCode" :options="selectItemTypeOptions"></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="編號" prop="itemCode"
                                :has-feedback="itemCodeValid.feedback" :validateStatus="itemCodeValid.state">
                <a-popover placement="top" :trigger="itemCodeValid.hover" :content="itemCodeValid.msg">
                  <a-input type="text" v-model="testForm.itemCode" :maxLength="20"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="內容">
                <a-input type="text" v-model="testForm.itemContent" :maxLength="500"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="答案類別">
                <a-select v-model="testForm.answerTypeCode">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="ATC01">單選</a-select-option>
                  <a-select-option value="null">無選項</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="是否啟用">
                <a-select v-model="testForm.itemEnable" >
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
      <recording-voice-close-setting-form
        :initData="masterEditing"
        :loading="isLoading"
        @formCallBack="onFormCallBack"
        ref="recordingVoiceCloseSettingForm"
      ></recording-voice-close-setting-form>
    </a-modal>
    
  </div>
</template>
<script src="./RecordingVoiceCloseSetting.ts" lang="ts"></script>



