<template>
  <div>
    <a-col :span="chooseSpan">
      <a-upload
        :accept="accept"
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button type="primary">
          <a-icon type="select" /> 選擇檔案
        </a-button>
      </a-upload>
    </a-col>
    <a-col :span="uploadSpan">
      <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="width: 110px"
        @click="handleUpload"
      >
        <a-icon type="upload" />
        {{ uploading ? "上傳中.." : "上傳" }}
      </a-button>
    </a-col>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FileUpload extends Vue {
  @Prop({ default: false })
  multiple: boolean;

  @Prop({ default: 12 })
  chooseSpan: number;

  @Prop({ default: 12 })
  uploadSpan: number;

  @Prop({ default: null })
  accept: string;

  fileList: any = [];

  uploading = false;

  handleRemove(file) {
    const index = this.fileList.indexOf(file);
    const newFileList = this.fileList.slice();
    newFileList.splice(index, 1);
    this.fileList = newFileList;
  }

  beforeUpload(file) {
    if (this.multiple) {
      this.fileList = [...this.fileList, file];
    } else {
      this.fileList = [file];
    }
    return false;
  }

  handleUpload() {
    const { fileList } = this;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    this.uploading = true;

    // You can use any AJAX library you like
    console.log(fileList);

    this.fileList = [];
    this.uploading = false;
    this.$emit('upload', fileList[0]);
  }
}
</script>

<style>
</style>
