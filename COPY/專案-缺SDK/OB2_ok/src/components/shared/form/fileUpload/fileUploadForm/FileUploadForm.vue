<template>
  <div>
    <div class="d-flex">
      <!-- 新增 -->
      <button class="header-button" @click="handleNewData">
        {{ $t("fileUpload_add") }}
      </button>
    </div>
    <div class="result__table">
      <FblDataGrid
        :themeColor="'theme2'"
        :scroll="{ x: 600, y: 400 }"
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data="gridData.data"
        :pagination="gridData.pagination"
        :empty-data="gridData.data.length <= 0"
      >
        <template v-slot:fileNameTemp="slotProps">
          <a href="#" @click="handleDownload(slotProps.data)">{{
            [slotProps.data.fileName, slotProps.data.fileExtension].join(".")
          }}</a>
        </template>
        <template v-slot:handleTemp="slotProps">
          <div class="d-flex">
            <button
              class="icon-button icon__edit"
              :class="{
                'icon__edit--diabled': slotProps.data.active == 'false',
              }"
              :disabled="slotProps.data.active == 'false'"
              @click="handleEditData(slotProps.data)"
            >
              <!-- 修改 -->
              <img
                class="icon-button__img"
                src="~@/assets/imgs/button_edit.svg"
                :alt="$t('fileUpload_modify')"
                :title="$t('fileUpload_modify')"
              />
            </button>
            <button
              class="icon-button icon__delete"
              @click="handleDeleteData(slotProps.data)"
            >
              <!-- 註銷 -->
              <img
                class="icon-button__img"
                src="~@/assets/imgs/button_delete.svg"
                :alt="$t('fileUpload_unregister')"
                :title="$t('fileUpload_unregister')"
              />
            </button>
          </div>
        </template>
      </FblDataGrid>
    </div>

    <!-- 新增/修改 Modal --->
    <a-modal
      v-model="isAddAndEditVisible"
      :title="addAndEditType"
      width="40%"
      :closable="true"
      :maskClosable="false"
      :keyboard="false"
      :cancelText="$t('global_leave')"
      :okText="$t('global_save')"
      :destroyOnClose="true"
      @ok="handleSave"
      @cancel="handleClose"
    >
      <FileUploadEditForm
        ref="fileUploadEditForm"
        :editData="rowData"
        :packNo="packNo"
        @fileUploadSaved="fileUploadSaved"
        :uploadFileData="gridData.data"
      />
    </a-modal>
  </div>
</template>


<script src="./FileUploadForm.ts" lang="ts"></script>

<style lang="less" scoped>
.header-button {
  margin-right: auto;
  padding: 6px 10px;
  background-color: @ICON-BUTTON-BG-BLUE;
  border-radius: 4px;
  border: 0;
  min-width: 33px;
  min-height: 33px;
  text-align: center;
  cursor: pointer;
  .text-white-format();
}
.result__table {
  margin-top: 0.5rem !important;
}
</style>