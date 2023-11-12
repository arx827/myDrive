<template class="uploadModal">
    <div class="upload">
        <a-card title="檔案上傳">
            <div v-for="describe in describeList" :key="describe">
                <label>{{describe}}</label>
            </div>
            <br>
            <a-card>
                <a-upload :file-list="fileList" :multiple="false" :remove="handleRemove" :before-upload="beforeUpload">
                <!-- 選擇檔案 -->
                <a-button> <a-icon type="upload" /> {{$t('global_selectFile')}} </a-button>
            </a-upload>
           
            </a-card>
             <a-row type="flex" justify="end" style="margin-top: 16px">
                 <!-- 上傳 -->
                 <a-space>
                    <a-button
                        type="primary"
                        :disabled="fileList.length === 0"
                        @click="handleUpload"
                    >
                        {{$t('global_upload')}}
                    </a-button>
                    <a-button
                        @click="uploadFormClose"
                    >
                        {{$t('global_close')}}
                    </a-button>
                 </a-space>
                
            </a-row>
        </a-card>
        <p></p>
        <!-- 上傳歷程 -->
         <a-card :title="$t('global_uploadHistory')">
            <FblDataGrid
                :rowKey="gridLog.rowKey"
                :columns="gridLog.columns"
                :data="gridLog.data"
                :pagination="false"
                :scroll="gridLog.scroll"
                align="center"
                size="middle"
                bordered
                ref="eventUploadLog"
            >
            </FblDataGrid>          
        </a-card>
        <p></p>
        <!-- 檢核結果 -->
        <a-card :title="$t('global_checkResult')" style="height:220px" v-if="validationResult">
            <label>{{SuccessedResultMessage}}</label>
            <FblDataGrid
                :rowKey="grid.rowKey"
                :columns="grid.columns"
                :data="grid.data"
                :pagination="false"
                :scroll="grid.scroll"
                v-if="checkHasError"
                align="center"
                size="middle"
                bordered
                ref="uploadDataGrid"
            >
            </FblDataGrid>          
        </a-card>
    </div>
</template>
<script src="./UploadAndLog.ts" lang="ts">
</script>
<style>
/* 版面調整 */
.upload > .ant-card > .ant-card-head {
    padding: 10px 10px;
}

.upload > .ant-card > .ant-card-body {
    min-height: 20px;
    padding: 10px 24px;
}
.upload > .ant-card > .ant-card-head > .ant-card-head-wrapper {
    padding: 0px 10x;
}
.upload > .ant-card > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title {
    padding: 0px 10px;
}
</style>