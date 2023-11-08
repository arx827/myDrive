<template>
  <div class="section-card section__countersignature">
    <div class="card__title-position">
      <!-- 會辦資料 -->
      <span class="card__title">{{$t('infCom_infInformData')}}</span>
    </div>
    <div class="card__infomation">
      <!-- 會辦單覆核 時 顯示 -->
      <!-- 在待覆核的時候都不須顯示 -->
      <a-row type="flex" justify="end" :gutter="[10, 0]" v-if="($props.caseType == 'review' && ($route.name != 'REVIEW_MENU'|| !$props.isEdit)) || $props.isNotCloseNotify">
        <a-col>
          <!-- 會辦單PDF -->
          <a-button type="primary" :disabled="!infReadOnlyForm.infFileId" @click="onPdfOpen(infReadOnlyForm)">{{$t('infPdf')}}</a-button>
        </a-col>
        <a-col>
          <!-- 案件調閱 -->
          <a-button type="primary" @click="caseCheck()">{{$t('caseCheck')}}</a-button>
        </a-col>
      </a-row>
      <a-form-model
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        :gutter="[{ xs: 10, xxl: 10 }, 0]"
        :rules="infInformRules"
        :model="infReadOnlyForm"
        class="countersignatureModalFormPage"
      >
        <!-- [唯讀] -->
        <a-row type="flex" v-if="!$props.isEdit">
          <a-col :span="24" flex="1">
            <!-- 會辦單號-->
            <a-form-model-item :label="$t('infCom_InfInformId')" class="readonly-form-item">
              <p>{{ infReadOnlyForm.infInfoId }}</p>
            </a-form-model-item>
            <!-- 權益信函相關資訊 -->
            <a-form-model-item class="readonly-form-item" v-if="infReadOnlyForm.infTypeId =='5'">
              <span slot="label"> {{$t('infCom_ajunct')}} </span>
              <p v-if="infReadOnlyForm.interestLetter =='Y'">{{$t('global_yes')}}</p>
              <p v-else>{{$t('global_no')}}，{{$t('infCom_desc')}}： {{infReadOnlyForm.interestDes}}</p>
            </a-form-model-item>
            <!-- 會辦項目-->
            <a-form-model-item :label="$t('infCom_infItemList')" class="readonly-form-item">
              <p>{{infReadOnlyForm.infItemListString}}</p>
            </a-form-model-item>
            <!-- 會辦內容-->
            <a-form-model-item :label="$t('infCom_infContent')" class="readonly-form-item">
              <p>{{infReadOnlyForm.infContent}}</p>
            </a-form-model-item>
            <!-- 會辦部門 -->
            <a-form-model-item class="readonly-form-item">
              <span slot="label"> {{$t('infCom_infDept')}} </span>
              <p>{{ infReadOnlyForm.infDept }}</p>
            </a-form-model-item>
            <!-- 承辦窗口 -->
            <a-form-model-item class="readonly-form-item">
              <span slot="label"> {{$t('infCom_targetEmail')}} </span>
              <p>{{ infReadOnlyForm.contactMail }}</p>
            </a-form-model-item>
            <!-- 副本 -->
            <a-form-model-item class="readonly-form-item">
              <span slot="label"> {{$t('infCom_ccEmail')}} </span>
              <p>{{ infReadOnlyForm.carbonCopyMail }}</p>
            </a-form-model-item>
            <!-- 會辦到期日 -->
            <a-form-model-item class="readonly-form-item">
              <span slot="label"> {{$t('infCom_expire')}} </span>
              <p>{{ infReadOnlyForm.expireDateString }}</p>
            </a-form-model-item>
            <!--  其他附檔清單 -->
            <a-form-model-item :label="$t('infCom_fileListOther')" />
            <!-- 下載列表 -->
            <a-row type="flex"  justify="end" v-if="gridFileData.data.length > 0">
              <a-col span="20">
                <FblDataGrid
                  :themeColor="'theme2'"
                  :scroll="{ x: true }"
                  :row-key="gridFileData.rowKey"
                  :columns="gridFileData.columns"
                  :data="gridFileData.data"
                  :pagination="gridFileData.pagination"
                  :empty-data="gridFileData.data.length <= 0"
                >
                  <template v-slot:handleTemp="slotProps">
                    <div class="d-flex">
                      <button
                        v-if="$props.isEdit"
                        class="icon-button icon__delete"
                        @click="handleRemove(slotProps.data)"
                      >
                      <!-- 刪除 -->
                        <img
                          class="icon-button__img"
                          src="~@/assets/imgs/button_delete.svg"
                          :alt="$t('global_delete')"
                          :title="$t('global_delete')"
                        >
                      </button>
                      <button
                        class="icon-button"
                        @click="handleDownload(slotProps.data)"
                      >
                        <!-- 下載 -->
                        <img
                          class="icon-button__img"
                          src="~@/assets/imgs/button_download.svg"
                          :alt="$t('global_download')"
                          :title="$t('global_download')"
                        >
                      </button>
                    </div>
                  </template>
                </FblDataGrid>
              </a-col>
            </a-row>
            <!-- 電訪員 -->
            <a-form-model-item class="readonly-form-item">
              <span slot="label"> {{$t('global_telemarketer')}} </span>
              <p>{{ infReadOnlyForm.tmrInfo }}</p>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 會辦類型 [編輯] 才出現 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <!-- 會辦類型 -->
            <a-form-model-item :label="$t('infCom_InfType')"
              required
            >
            <!-- :has-feedback="infInformValidateForm.infType.feedback"
              :validateStatus="infInformValidateForm.infType.state" -->
              <!-- <a-popover
                placement="top"
                :content="infInformValidateForm.infType.msg"
                :trigger="infInformValidateForm.infType.hover"
              > -->
                <a-radio-group
                  v-model="form.countersignatureType"
                  name="countersignatureTypeGroup"
                  :options="infMainSelection"
                  @change="onMainTypeChange"
                  :disabled="isCaseClosed || $route.name == 'REVIEW_MENU'"
                />
              <!-- </a-popover> -->
              <!-- 再次通報 -->
              <a-checkbox
                :checked="form.reInform"
                @change="form.reInform = !form.reInform"
                v-if="isReCircularShow"
              >
                {{$t('infCom_reInform')}}
              </a-checkbox>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 附權益信函 [編輯] 才出現 -->
        <a-row type="flex" v-if="$props.isEdit && isAjunctShow">
          <a-col flex="1">
            <!-- 附權益信函 -->
            <a-form-model-item :label="$t('infCom_ajunct')" required>
              <a-row type="flex">
                <a-col>
                  <a-checkbox
                    :value="'Y'"
                    :checked="(form.adjunct.hasAdjunct !== null) ? form.adjunct.hasAdjunct == 'Y' : false"
                    @change="onCheckAdjunct"
                  >
                  <!-- 是 -->
                    <span>{{$t('global_yes')}}</span>
                  </a-checkbox>
                  <a-button v-if="form.adjunct.hasAdjunct == 'Y'" @click="adjuctPreviewClick" style="margin-right: 15px;">{{ $t("infCom_previewClick") }}</a-button>
                  <a-checkbox
                    :value="'N'"
                    :checked="(form.adjunct.hasAdjunct !== null) ? form.adjunct.hasAdjunct == 'N' : false"
                    @change="onCheckAdjunct"
                  >
                  <!-- 否 -->
                    <span>{{$t('global_no')}}</span>
                  </a-checkbox>
                </a-col>
                <a-col flex="1" v-if="form.adjunct.hasAdjunct == 'N'">
                  <!-- 說明 -->
                  <a-form-model-item
                    :label="$t('infCom_desc')"
                    :has-feedback="infInformValidateForm.adjunctDesc.feedback"
                    :validateStatus="infInformValidateForm.adjunctDesc.state"
                    prop="adjunctDesc"
                    required
                  >
                    <a-popover
                      placement="top"
                      :content="infInformValidateForm.adjunctDesc.msg"
                      :trigger="infInformValidateForm.adjunctDesc.hover"
                    >
                      <!-- <span class="d-inline-block" slot="label"> 說明 </span> -->
                      <a-input v-model="form.adjunct.desc" style="width: 200px" :maxLength="30"/>
                    </a-popover> 
                  </a-form-model-item>
                  
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- 會辦項目 [編輯] 才出現，會辦類型==通知類時，為單選，其餘多選-->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <!-- 會辦項目 -->
            <a-form-model-item :label="$t('infCom_infItem')">
              <a-row type="flex" :gutter="[10, 0]">
                <a-col :span="8">
                  <a-select
                    class="select"
                    v-model="form.subTypeId"
                    :options="infSubSelection"
                    @change="onSubTypeChange"
                    :disabled="!this.form.countersignatureType || ($route.name == 'REVIEW_MENU' && this.form.countersignatureType =='6')"
                  >
                  </a-select>
                </a-col>
                <a-col :span="8">
                  <a-select 
                    class="select"
                    v-model="form.secondTypeId"
                    :options="infSecondSelection"
                    :disabled="!form.subTypeId || this.form.countersignatureType =='5'"
                  >
                  </a-select>
                </a-col>
                <a-col>
                  <!-- 新增 -->
                  <a-button type="primary" :disabled="!(form.secondTypeId || (form.subTypeId && this.form.countersignatureType =='5'))" @click="onAddCountersignatureItem">{{$t('global_add')}}</a-button>
                </a-col>
                <a-col v-if="form.countersignatureType">
                  <!-- (單選)  (多選) -->
                  <small>{{ (this.form.countersignatureType === '6') ? $t('infCom_singleSelect') : $t('infCom_multipleSelect')}}</small>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <!-- 會辦項目清單 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <a-form-model-item :label="$t('infCom_infItemList')" required>
              <p class="readonly__textarea" v-if="form.infItemList.length > 0" >
                <a-tag closable color="blue"
                  v-for="(item) in form.infItemList"
                  :key="item.value"
                  @close="onCountersignatureItemClose(item.value)"
                >
                  {{ item.label }}
                </a-tag>
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- 會辦內容 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <a-form-model-item 
              :label="$t('infCom_infContent')" 
              :has-feedback="infInformValidateForm.content.feedback"
              :validateStatus="infInformValidateForm.content.state"
              required
              prop="content"
            >
              <a-popover
                placement="top"
                :content="infInformValidateForm.content.msg"
                :trigger="infInformValidateForm.content.hover"
              >
                <a-textarea
                  v-model="form.content"
                  :autoSize="{ minRows: 2, maxRows: 2 }"
                  :disabled="form.infItemList.length < 1"
                  @change="onContentChange"
                  :maxLength="1000"
                ></a-textarea>
              </a-popover> 
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- 會辦部門、承辦窗口、副本 [編輯] 才出現 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <!-- 會辦部門 -->
            <a-form-model-item :label="$t('infCom_infDept')"
              :has-feedback="infInformValidateForm.infDepartment.feedback"
              :validateStatus="infInformValidateForm.infDepartment.state"
              prop="infDepartment"
              required
              class="infDepartment"
            >
              <!-- <a-col :span="10"> -->
                <a-popover
                  placement="top"
                  :content="infInformValidateForm.infDepartment.msg"
                  :trigger="infInformValidateForm.infDepartment.hover"
                >
                  <a-select
                    class="select"
                    v-model="form.infDepartment"
                    :options="infDepartmentSelection"
                    :showArrow="true"
                    @change="onInfDepartmentChange"
                    :disabled="form.infItemList.length < 1"
                  />
                </a-popover>
              <!-- </a-col> -->
            </a-form-model-item>
            <!-- 承辦窗口 -->
            <a-form-model-item :label="$t('infCom_targetEmail')"
              :has-feedback="infInformValidateForm.targetEmail.feedback"
              :validateStatus="infInformValidateForm.targetEmail.state"
              prop="targetEmail"
              required
            >
              <a-popover
                placement="top"
                :content="infInformValidateForm.targetEmail.msg"
                :trigger="infInformValidateForm.targetEmail.hover"
              >
                <a-input v-model="form.targetPersonEmail" :disabled="form.infItemList.length < 1 || form.infDepartment ==''"/>
              </a-popover>
            </a-form-model-item>
            <!-- 副本 -->
            <a-form-model-item :label="$t('infCom_ccEmail')"
              :has-feedback="infInformValidateForm.carbonCopyEmail.feedback"
              :validateStatus="infInformValidateForm.carbonCopyEmail.state"
              prop="carbonCopyEmail"
            >
              <a-popover
                placement="top"
                :content="infInformValidateForm.carbonCopyEmail.msg"
                :trigger="infInformValidateForm.carbonCopyEmail.hover"
              >
                <a-input v-model="form.carbonCopyEmail" :disabled="form.infItemList.length < 1 || form.infDepartment ==''"/>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- 會辦到期日 [編輯] 才出現 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <a-form-model-item
              :label="$t('infCom_expire')"
              prop="expireDate"
              :has-feedback="infInformValidateForm.expireDate.feedback"
              :validateStatus="infInformValidateForm.expireDate.state"
              required
            >
              <a-popover
                placement="top"
                :content="infInformValidateForm.expireDate.msg"
                :trigger="infInformValidateForm.expireDate.hover"
                :visible="isExpireDateHoverVisible"
                :destroyTooltipOnHide="true"
              >
                <DatePicker
                  style="width: 200px"
                  :formatter="formatter"
                  @change="onDateChange"
                  :disabled-date="disabledDate"
                  v-model="form.expireDate"
                  :clearable="false"
                  :disabled="!form.countersignatureType"
                >
                  <a-input
                    slot="input"
                    @pressEnter="checkManualInputDate"
                    @mouseover="eventMouseOver"
                    @mouseleave="isExpireDateHoverVisible = false"
                    :value="form.expireString"
                    :disabled="!form.countersignatureType"
                  ></a-input>
                  <i v-if="infInformValidateForm.expireDate.feedback" slot="icon-calendar"></i>
                </DatePicker>
              </a-popover>
            </a-form-model-item>
          </a-col>
        </a-row>
         <!-- 附加檔案 -->
        <a-form-model-item :label="$t('infCom_file')" style="margin-bottom: 0px" v-if="$props.isEdit">
          <!-- 選擇檔案 -->
          <a-row :gutter="8">
            <a-col span="16">
              <a-input v-model="selectedFileName" />
            </a-col>
            <!-- 瀏覽 -->
            <a-col span="4">
              <a-upload
                class="FileListUpload"
                :multiple="false"
                :before-upload="beforeUpload"
                :showUploadList="false"
              >
                <a-button :disabled="isCaseClosed && $route.name=='OnDuty'">
                  <a-icon type="folder-open" />
                  {{ $t("uploadFileForm_selectFile") }}
                </a-button>
              </a-upload>
            </a-col>
            <!-- 上傳 -->
            <a-col span="4">
              <a-button
                :disabled="uploadingFile == null"
                :loading="isUploading"
                @click="handleUpload"
              >
              <!-- 上傳中...   上傳 -->
                <a-icon type="upload" />{{ isUploading ? $t('global_uploading') : $t('global_upload') }}
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <!-- 附加檔案 -->
        <a-row type="flex" v-if="$props.isEdit">
          <a-col flex="1">
            <!-- 上傳檔案清單 -->
            <a-form-model-item :label="$t('infCom_fileList')" />
            <!-- 下載列表 -->
            <a-row type="flex" justify="end" v-if="gridFileData.data.length > 0">
              <a-col span="20">
                <FblDataGrid
                  :themeColor="'theme2'"
                  :scroll="{ x: true }"
                  :row-key="gridFileData.rowKey"
                  :columns="gridFileData.columns"
                  :data="gridFileData.data"
                  :pagination="gridFileData.pagination"
                  :empty-data="gridFileData.data.length <= 0"
                >
                  <template v-slot:handleTemp="slotProps">
                    <div class="d-flex">
                      <button
                        v-if="$props.isEdit"
                        class="icon-button icon__delete"
                        @click="handleRemove(slotProps.data)"
                      >
                      <!-- 刪除 -->
                        <img
                          class="icon-button__img"
                          src="~@/assets/imgs/button_delete.svg"
                          :alt="$t('global_delete')"
                          :title="$t('global_delete')"
                        >
                      </button>
                      <button
                        class="icon-button"
                        @click="handleDownload(slotProps.data)"
                      >
                        <!-- 下載 -->
                        <img
                          class="icon-button__img"
                          src="~@/assets/imgs/button_download.svg"
                          :alt="$t('global_download')"
                          :title="$t('global_download')"
                        >
                      </button>
                    </div>
                  </template>
                </FblDataGrid>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </div>
</template>
<script src="./Countersignature_countersignature_com.ts" lang="ts"></script>
<style lang="less">
.countersignatureModalFormPage {
  .infDepartment {
    .ant-form-item-label {
      width: 16.7%;
    }
    .ant-form-item-control-wrapper {
      width: 35%;
    }
  }
}
</style>