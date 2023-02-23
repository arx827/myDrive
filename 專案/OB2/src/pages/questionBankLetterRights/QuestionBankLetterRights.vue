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
              <a-form-model-item label="題目類型">
                <a-select v-model="testForm.itemTitleCode" :options="selectItemTitleOptions"></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="題目編號" prop="itemCode"
                                :has-feedback="itemCodeValid.feedback" :validateStatus="itemCodeValid.state">
                <a-popover placement="top" :trigger="itemCodeValid.hover" :content="itemCodeValid.msg">
                  <a-input type="text" v-model="testForm.itemCode" :maxLength="20"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="題目內容">
                <a-input type="text" v-model="testForm.itemContent" :maxLength="500"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="答案類別">
                <a-select v-model="testForm.answerTypeCode" :options="selectAnswerTypeOptions"></a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="權益信函內容">
                <a-input type="text" v-model="testForm.rightsContent" :maxLength="500"></a-input>
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
            <div style="margin-bottom: 16px">
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
    <a-modal v-model="formVisible" :title="formTitle" :zIndex="1" 
      :centered="true"
      :maskClosable="false"
      :cancelText="$t('global_cancel')"
      :okText="$t('global_ok')"
      @ok="onFormSubmit"
    >
      <question-bank-letter-rights-form
        :initData="masterEditing"
        :loading="isLoading"
        @formOpenSub="openSubForm"
        @formCallBack="onFormCallBack"
        ref="questionBankLetterRightsForm"
      ></question-bank-letter-rights-form>
    </a-modal>

    <!-- 子題項設定/顯示窗 -->
    <a-modal v-model="formSubVisible" title="子題項設定" :zIndex="2"
      :ok-button-props="okBtnStyle"
      :cancel-button-props="cancelBtnStyle"
      :centered="true"
      :destroyOnClose="true"
      :maskClosable="false"
      :okText="$t('global_ok')"
      cancelText="關閉"
      width="900px"
      @ok="onSubFormSubmit"
    >
      <question-bank-letter-rights-sub-form
        :selectItemTitleOptions="selectItemTitleOptions"
        :isSubEditing="isSubEditing"
        :answerOption="subAnswerOption"
        :selectedMap="selectedSubItem"
        :showSubItem="showSubItem"
        @subFormCallBack="onSubFormCallBack"
        ref="questionBankLetterRightsSubForm"
      ></question-bank-letter-rights-sub-form>
    </a-modal>

    <!-- 問項條件視窗 -->
    <a-modal v-model="formConditionVisible" :title="formTitle" :zIndex="1" 
      :centered="true"
      :maskClosable="false"
      :bodyStyle="{ padding: '24px 24px 24px 5px' }"
      width="1000px"
    >
      <template slot="footer">
        <a-upload :file-list="[]" :multiple="false" :before-upload="beforeUpload">
          <a-button type="primary"> <a-icon type="upload" />匯入</a-button>
        </a-upload>
        <a-button type="primary" @click="doAddObj" :disabled="!isShowAdd">新增條件</a-button>
        <a-button type="primary" @click="doSubmit">確定</a-button>
        <a-button type="default" @click="doCancel">取消</a-button>
      </template>

      <question-bank-letter-rights-condition-form
        :initData="masterEditing"
        :loading="isLoading"
        @formCallBack="onMainFormCallBack"
        @btnCallBack="onBtnCallBack"
        ref="questionBankLetterRightsConditionForm"
      ></question-bank-letter-rights-condition-form>
    </a-modal>

  </div>
</template>
<script src="./QuestionBankLetterRights.ts" lang="ts"></script>

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



