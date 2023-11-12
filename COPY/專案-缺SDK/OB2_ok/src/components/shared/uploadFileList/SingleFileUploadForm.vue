<template>
    <div>
        <a-form-model
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            :rules="singleFileUploadRules"
        >
        <!-- 上傳附件 -->
            <a-form-model-item
                :label="$t('uploadFileForm_uploadFile')"
                style="margin-bottom: 0px"
                required
            >
                <a-upload class="FileListUpload" :file-list="fileList" :multiple="false" :remove="handleRemove" :before-upload="beforeUpload">
                <!-- 選擇檔案 -->
                <a-row>
                    <a-input style="width:305px" v-model="singleFile.fileName"> </a-input> 
                    <!-- 瀏覽 -->
                    <a-button> <a-icon type="upload" /> {{$t('uploadFileForm_selectFile')}} </a-button>
                
                </a-row>
                
                </a-upload>
            </a-form-model-item>
            <!-- 附件備註 -->
            <a-form-model-item
                :label="$t('uploadFileForm_fileRemark')"
                style="margin-bottom: 0px"
                required
                prop="remark"
                :has-feedback="singleFileUploadValidateForm.remark.feedback"
                :validateStatus="singleFileUploadValidateForm.remark.state"
            >
                <a-popover
                    placement="top"
                    :content="singleFileUploadValidateForm.remark.msg"
                    :trigger="singleFileUploadValidateForm.remark.hover"
                >
                    <a-textarea
                        v-model="singleFile.fileRemark"
                        :auto-size="{ minRows: 4, maxRows: 4 }"
                        :maxLength="50"
                    />
                </a-popover>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script src="./SingleFileUploadForm.ts" lang="ts"></script>
<style>
.FileListUpload > .ant-upload-list {
    display: none;
}
</style>