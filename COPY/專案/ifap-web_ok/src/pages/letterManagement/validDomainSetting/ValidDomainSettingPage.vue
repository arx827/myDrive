<template>
  <div class="searchBlock__wrap">
    <AccordionArea class="mb-2">
      <a-form-model ref="formRef" :colon="false" :model="form" :rules="formRules" :hide-required-mark="true">
        <a-form-model-item label="郵件網域" prop="mailDomain">
          <a-input v-model.trim="form.mailDomain" />
        </a-form-model-item>
      </a-form-model>

      <div class="d-flex justify-content-center">
        <a-button class="linearButton" @click="search()">
          查詢
        </a-button>
        <a-button class="clearButton" @click="clearSearch()">
          清除
        </a-button>
      </div>
    </AccordionArea>
    <img class="searchBlock__bgImg bgImg__letterManagement" src="~@imgs/image_mailbg_2x.png" alt="">

    <!-- 查詢結果 控制項 -->
    <div class="searchResultWrap">
      <div class="searchResult__control d-flex justify-content-between align-items-center">
        <div class="showResultsNumber d-flex align-items-center">
          <a-icon type="search" />
          <span class="ms-1"> 查詢結果共有 {{ getDataNum }} 筆資料</span>
        </div>
        <div>
          <a-button class="linearButton tableHeader__button" @click="addValidDomain()">
            新增
          </a-button>
          <a-button class="linearButton tableHeader__button" @click="exportFile()">
            匯出
          </a-button>
          <a-button class="linearButton tableHeader__button" @click="uploadMultiDomain()">
            整批匯入
          </a-button>
        </div>
      </div>
      <FblDataGrid
        class=""
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :empty-data="isEmpty(grid.data.length)"
        @tableChange="onPageChange($event)"
      >
        <!-- 編輯 -->
        <template v-slot:editControl="slotProps">
          <a-button class="tableControl__button editButton" @click="editValidDomain(slotProps.data)" />
        </template>
        <!-- 刪除 -->
        <template v-slot:deleteControl="slotProps">
          <a-button class="tableControl__button deleteButton" @click="deleteValidDomain(slotProps.data)" />
        </template>
      </FblDataGrid>
    </div>

    <!-- 彈窗：整批匯入 -->
    <a-modal
      v-model="uploadDomainModal.isShow"
      width="600px"
      :dialogStyle="{'max-width': 'calc(100% - 30px)'}"
      :keyboard="false"
      :maskClosable="false"
      layout="vertical"
    >
      <template #title>
        整批匯入
      </template>
      <div>
        <a-card title="檔案上傳">
          <div>1. 檔案格式為 xlsx，檔案限制 5MB</div>
          <div>2. 本功能提供整批資料覆蓋的方式匯入</div>
          <div>3. 如有資料重複，則會擇一匯入</div>
          <a-upload
            :fileList="uploadDomainModal.uploadFiles"
            :remove="removeFile"
            :customRequest="customRequest"
            accept=".xlsx"
          >
            <a-button class="mt-3">
              <span class="file_upload_icon"><a-icon type="upload" /></span>
              選擇檔案
            </a-button>
          </a-upload>
        </a-card>
      </div>
      <template #footer>
        <a-button type="primary"
                  :disabled="isEmpty(uploadDomainModal.uploadFiles)"
                  @click="uploadFile()"
        >
          上傳
        </a-button>
        <a-button @click="uploadDomainModal.isShow = false">
          關閉
        </a-button>
      </template>
    </a-modal>

    <!-- 彈窗：新增有效郵件清單 -->
    <a-modal
      v-model="addValidDomainModal.isShow"
      width="626px"
      :keyboard="false"
      title="新增有效郵件清單"
      @cancel="closeAddModal()"
    >
      <a-form-model ref="formRefAddModal" :colon="false" :model="addValidDomainModal.data" :hide-required-mark="true" :rules="addValidDomainModal.rules">
        <div class="row">
          <a-form-model-item label="郵件網域" prop="domain">
            <a-input
              v-model.trim="addValidDomainModal.data.domain"
              placeholder="請輸入"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
      <template #footer>
        <a-button @click="closeAddModal()">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitAddModal">
          確定
        </a-button>
      </template>
    </a-modal>

    <!-- 彈窗：編輯有效郵件清單 -->
    <a-modal
      v-model="editValidDomainModal.isShow"
      width="626px"
      :keyboard="false"
      title="編輯有效郵件清單"
      @cancel="closeEditModal()"
    >
      <a-form-model ref="formRefEditModal" :colon="false" :model="editValidDomainModal.data" :hide-required-mark="true" :rules="editValidDomainModal.rules">
        <div class="row">
          <div class="col-6">
            <a-form-model-item label="序號" prop="domainNo">
              <a-input
                v-model="editValidDomainModal.data.domainNo"
                disabled
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <a-form-model-item label="郵件網域" prop="domain">
              <a-input
                v-model="editValidDomainModal.data.domain"
                placeholder="請輸入"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <a-form-model-item label="更新人員" prop="updateName">
              <a-input
                v-model="editValidDomainModal.data.updateName"
                disabled
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <a-form-model-item label="更新時間" prop="updateDate">
              <a-input
                v-model="editValidDomainModal.data.updateDate"
                disabled
              />
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>
      <template #footer>
        <a-button @click="closeEditModal()">
          關閉
        </a-button>
        <a-button type="primary" class="" @click="submitEditModal">
          確定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script src="./ValidDomainSettingPage.ts" lang="ts"></script>

<style lang="scss" scoped>

.file_upload_icon i {
  vertical-align: middle;
  font-size: 15px;
  padding-right: 5px;
}

</style>
