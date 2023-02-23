<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-model-item label="主機對應代碼" prop="coreSystemCode"
                         :has-feedback="coreSystemCodeValid.feedback" :validateStatus="coreSystemCodeValid.state">
        <a-popover placement="top" v-model="coreSystemCodeValid.hoverShow" :trigger="coreSystemCodeValid.hover" :content="coreSystemCodeValid.msg" >
          <a-input type="text" v-model="form.coreSystemCode" :disabled="isEditing" :maxLength="20"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="電訪項目代碼" prop="taskId"
                         :has-feedback="taskIdValid.feedback" :validateStatus="taskIdValid.state">
        <a-popover placement="top" v-model="taskIdValid.hoverShow" :trigger="taskIdValid.hover" :content="taskIdValid.msg">
          <a-input type="text" v-model="form.taskId" :disabled="isEditing" :maxLength="20"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="電訪項目名稱" prop="taskName"
                         :has-feedback="taskNameValid.feedback" :validateStatus="taskNameValid.state">
        <a-popover placement="top" v-model="taskNameValid.hoverShow" :trigger="taskNameValid.hover" :content="taskNameValid.msg">
          <a-input type="text" v-model="form.taskName" :maxLength="500"></a-input>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="類型" prop="taskTypeCode"
                         :has-feedback="taskTypeCodeValid.feedback" :validateStatus="taskTypeCodeValid.state">
        <a-popover placement="top" v-model="taskTypeCodeValid.hoverShow" :trigger="taskTypeCodeValid.hover" :content="taskTypeCodeValid.msg">
          <a-select v-model="form.taskTypeCode" :options="selectTaskTypeOptions"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="業務別" prop="businessType"
                         :has-feedback="businessTypeValid.feedback" :validateStatus="businessTypeValid.state">
        <a-popover placement="top" v-model="businessTypeValid.hoverShow" :trigger="businessTypeValid.hover" :content="businessTypeValid.msg">
          <a-select v-model="form.businessType" :options="selectBusinessTypeOptions"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="法源/內控依據">
        <a-input type="text" v-model="form.lawReason" :maxLength="500"></a-input>
      </a-form-model-item>

      <a-form-model-item label="權責部門" prop="respDepart"
                         :has-feedback="respDepartValid.feedback" :validateStatus="respDepartValid.state">
        <a-popover placement="top" v-model="respDepartValid.hoverShow" :trigger="respDepartValid.hover" :content="respDepartValid.msg">
          <a-select v-model="form.respDepart" :options="selectRespDepartOptions"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="電訪項目優先序" prop="priority"
                         :has-feedback="priorityValid.feedback" :validateStatus="priorityValid.state">
        <a-popover placement="top" v-model="priorityValid.hoverShow" :trigger="priorityValid.hover" :content="priorityValid.msg">
          <a-input type="text" v-model="form.priority" :maxLength="10"></a-input>
        </a-popover>
        <div class="tipDiv">(數字越小越優先)</div>
      </a-form-model-item>

      <a-form-model-item label="電訪重點">
        <a-input type="text" v-model="form.callKeypoint" :maxLength="500"></a-input>
      </a-form-model-item>

      <a-form-model-item label="執行時機" prop="executeTime"
                         :has-feedback="executeTimeValid.feedback" :validateStatus="executeTimeValid.state">
        <a-popover placement="top" v-model="executeTimeValid.hoverShow" :trigger="executeTimeValid.hover" :content="executeTimeValid.msg">
          <a-select v-model="form.executeTime" :options="selectExecuteTimeOptions"></a-select>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="電訪期限" prop="callLimit"
                         :has-feedback="callLimitValid.feedback" :validateStatus="callLimitValid.state">
        <a-popover placement="top" v-model="callLimitValid.hoverShow" :trigger="callLimitValid.hover" :content="callLimitValid.msg">
          <a-input type="text" id="callLimit" v-model="form.callLimit" :maxLength="10" style="width:calc(100% - 20px);"></a-input>
        </a-popover> 日
      </a-form-model-item>

      <a-form-model-item label="電訪頻率" style="margin-bottom:0px;" prop ="callFreqLab">
        <a-form-model-item style="width:50%; display:inline-block;" prop="callFreqDay" 
                           :has-feedback="callFreqDayValid.feedback" :validateStatus="callFreqDayValid.state">
          <a-popover placement="top" v-model="callFreqDayValid.hoverShow" :trigger="callFreqDayValid.hover" :content="callFreqDayValid.msg">
            <a-input type="text" id="callFreqDay" v-model="form.callFreqDay" :maxLength="10" style="width:calc(100% - 20px);"></a-input>
          </a-popover> 天
        </a-form-model-item>
        <a-form-model-item prop="callFreqVisit" style="width:50%; display:inline-block;"
                           :has-feedback="callFreqVisitValid.feedback" :validateStatus="callFreqVisitValid.state">
          <a-popover placement="top" v-model="callFreqVisitValid.hoverShow" :trigger="callFreqVisitValid.hover" :content="callFreqVisitValid.msg">
            <a-input type="text" id="callFreqVisit" v-model="form.callFreqVisit" :maxLength="10" style="width:calc(100% - 20px);"></a-input>
          </a-popover> 訪
        </a-form-model-item>
      </a-form-model-item>

      <a-form-model-item label="結案期限" prop="deadLine"
                         :has-feedback="deadLineValid.feedback" :validateStatus="deadLineValid.state">
        <a-popover placement="top" v-model="deadLineValid.hoverShow" :trigger="deadLineValid.hover" :content="deadLineValid.msg">
          <a-input type="text" id="deadLine" v-model="form.deadLine" :maxLength="10" style="width:calc(100% - 20px);"></a-input>
        </a-popover> 日
      </a-form-model-item>

      <a-form-model-item label="案件重啟">
        <a-select v-model="form.caseReopen" :options="selectYesNoOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="即時電訪">
        <a-select v-model="form.realTimeType" :options="selectYesNoOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="批次產信">
        <a-select v-model="form.batchLetter" :options="selectYesNoOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="M+/PUSH/EMAIL/簡訊通知">
        <a-select v-model="form.messageNotice" :options="selectYesNoOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="電話變更">
        <a-select v-model="form.callChange" :options="selectYesNoOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="第一線核保">
        <a-select v-model="form.firstLine" :options="selectYesNoOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="費用分攤設定">
        <a-select v-model="form.costSetting" :options="selectCostSettingOptions"></a-select>
      </a-form-model-item>

      <a-form-model-item label="項目執行期間起日" prop="taskStartDate"
                         :has-feedback="taskStartDateValid.feedback" :validateStatus="taskStartDateValid.state">
        <a-popover placement="top" v-model="taskStartDateValid.hoverShow" :trigger="taskStartDateValid.hover" :content="taskStartDateValid.msg">
          <date-picker id="taskStartDate" v-model="form.taskStartDate" :range="false" :formatter="formatter" style="width:100%;" @change="onStartDateChange">
            <a-input slot="input" :value="startDateStr" @blur="onStartDateBlur"></a-input>
            <i v-if="taskStartDateValid.feedback" slot="icon-calendar"></i>
          </date-picker>
        </a-popover>
      </a-form-model-item>

      <a-form-model-item label="項目執行期間迄日">
        <date-picker type="date" v-model="form.taskEndDate" :range="false" :formatter="formatter" style="width:100%;" @change="onEndDateChange">
        </date-picker>
        <div class="tipDiv">(迄日日期不輸入，表示永遠有效)</div>
      </a-form-model-item>

      <a-form-model-item label="最後匯入時間" prop="lastImportTime"
                         :has-feedback="lastImportTimeValid.feedback" :validateStatus="lastImportTimeValid.state">
        <a-popover placement="top" v-model="lastImportTimeValid.hoverShow" :trigger="lastImportTimeValid.hover" :content="lastImportTimeValid.msg">
          <a-input type="text" v-model="form.lastImportTime"></a-input>
        </a-popover>
        <div class="tipDiv">(超過此時間應電訪日為隔日,例如下午3點半,輸入格式為1530)</div>
      </a-form-model-item>

      <a-form-model-item label="建立人員">
        <a-input type="text" v-model="form.createId" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item label="建立日期" v-show="isEditing">
        <a-input type="text" v-model="form.createDate" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item label="最後異動人員" v-show="isEditing">
        <a-input type="text" v-model="form.updateId" :disabled="true"></a-input>
      </a-form-model-item>

      <a-form-model-item label="最後異動日期" v-show="isEditing">
        <a-input type="text" v-model="form.updateDate" :disabled="true"></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script src="./TaskSettingForm.ts" lang="ts"></script>

<style>
  /** 頁面滾動 */
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  /** 電訪期限,電訪頻率(天,訪),結案期限 檢核錯誤icon */
  #callLimit ~ .ant-form-item-children-icon,
  #callFreqDay ~ .ant-form-item-children-icon,  
  #callFreqVisit ~ .ant-form-item-children-icon,
  #deadLine ~ .ant-form-item-children-icon {
    margin-right: 17px;
  }
</style>

<style scoped>
  /** 欄位標題自動換行 */
  ::v-deep .ant-form-item-label > label {
    width: 100%;
    line-height: 18px;
    display: inline-block;
    white-space: pre-wrap;
  }

  /** 表單欄位提示訊息 */
  .tipDiv {
    margin: -10px 0px -20px 0px;
  }
</style>

