<template>
  <div>
   
      <a-row style="padding-top:10px">
         <div class="clearfix">
            <a-upload 
             :file-list="fileList"
            :before-upload="beforeUpload"
            :remove="handleRemove"
            >
              <a-button> {{ $t("notiReplyPerson_file") }}</a-button>
            </a-upload>
          </div>
           <div style="margin-left: 24px; margin-bottom: 10px">
              <a-button
                  type="primary"
                  :disabled="fileList.length === 0"
                  @click="handleUploadChange"
                >
                  {{ $t("notiReplyPerson_confirm_upload") }}
                </a-button>


                <a-button
                  type="primary"
                  style="margin: 5px"
                  @click="exportNotiReplyPerson"
                >
                  {{ $t("global_export") }}
                </a-button>

              <div style="margin-left: 0px; margin-bottom: 10px">
                <template>
                  <a-space>
                    <span>{{ $t("notiReplyPerson_updateDate")+":" + latestUpdateRocDate }}</span>
                  </a-space>
                </template>
              </div>
              <div style="margin-left: 0px; margin-bottom: 10px">
                <template>
                  <a-space>
                    <span>{{ $t("notiReplyPerson_updatePerson")+":" + lastestUpdatedUnitNameAndPerson }}</span>
                  </a-space>
                </template>
              </div>



              </div>
        </a-row> 
      


    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <fbl-data-grid
        :themeColor="'theme2'"
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          @actionClick="onUserTaskTableActionClick($event)"
          @tableChange="onPageChange($event)"
          size="middle"
          style="padding-left: 24px; padding-right: 12px"
          ref="userDataGrid"
        >
        </fbl-data-grid>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./NotiReplyPerson.ts" lang="ts"></script>

<style scoped>
.clearfix {
  margin-left: 24px;
  margin-bottom: 10px;
  width: 25%;
}
</style>