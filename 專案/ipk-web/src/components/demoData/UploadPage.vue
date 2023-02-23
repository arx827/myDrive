<template>
  <div class="btnGroup tabline">
    <div class="event__block form__title pb-3">
      共用上傳
      <span class="ms-3">
        <button class="btn__main btn__main--lightBlue" @click="openUploadModal">
          <a-icon type="upload" class="icon_margin" />
          上傳
        </button>
      </span>
    </div>
    <a-row>
      <div class="setting__desc" style="width: 100%">
        <div>
          使用方法：
        </div>
        <ul class="form__content">
          <li>import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';</li>
          <li>import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';</li>
          <li><span class="text--bold">掛載元件</span>- 複製以下元件程式碼</li>
          <li>
            ＜UploadDragger<br>
            :fileUploadData="fileUploadData"<br>
            :fileUploadStatus="fileUploadStatus"<br>
            :fileList="fileList"<br>
            @handleChange="handleChange"<br>
            /＞
          </li>
        </ul>
      </div>
      <a-modal
        :visible="showModalFlag"
        title="上傳"
        :closable="true"
        :maskClosable="false"
        :after-close="closeUploadModal"
        :destroyOnClose="true"
        @cancel="closeUploadModal"
      >
        <UploadDragger
          :fileUploadData="fileUploadData"
          :fileUploadStatus="fileUploadStatus"
          :fileList="fileList"
          @deleteFile="deleteFile"
          @handleChange="handleChange"
        />
        <template slot="footer">
          <IpkButton
            buttonType="lightBlue"
            buttonText="取消"
            iconType="close"
            :isAuthorize="false"
            @handleBtnEmit="closeUploadModal"
          />
          <vue-excel-xlsx
            v-if="fileUploadStatus === 'download'"
            :data="exportUploadData"
            :columns="exportUploadColumns"
            :file-name="exportFileName"
            :file-type="'xlsx'"
            :sheet-name="'sheetName'"
            class="ant-btn btn__main btn__main--lightBlue"
          >
            <a-icon type="download" class="icon_margin" />下載
          </vue-excel-xlsx>
          <IpkButton
            buttonType="primary"
            buttonText="送審"
            iconType="check"
            :isAuthorize="false"
            @handleBtnEmit="uploadFile"
          />
        </template>
      </a-modal>
    </a-row>
    <div class="event__block form__title pb-3">
      共用下載
      <span class="ms-3">
        <vue-excel-xlsx
          :data="exportUploadData"
          :columns="exportUploadColumns"
          :file-name="'資料明細'"
          :file-type="'xlsx'"
          :sheet-name="'sheetName'"
          class="btn__main btn__main--lightBlue"
        >
          <a-icon type="download" class="icon_margin" />下載
        </vue-excel-xlsx>
      </span>
    </div>
    <a-row>
      <div class="setting__desc" style="width: 100%">
        <div>
          使用方法：
        </div>
        <ul class="form__content">
          <li><span class="text--bold">掛載元件</span>- 複製以下元件程式碼</li>
          <li>
            ＜vue-excel-xlsx<br>
            :data="exportUploadData"<br>
            :columns="exportUploadColumns"<br>
            :file-name="'資料明細'"<br>
            :file-type="'xlsx'"<br>
            :sheet-name="'sheetName'"<br>
            class="btn__main btn__main--lightBlue"<br>
            ＞<br>
            ＜a-icon type="download" class="icon_margin" /＞下載<br>
            ＜/vue-excel-xlsx＞
          </li>
        </ul>
      </div>
    </a-row>
  </div>
</template>

<script src="./UploadPage.ts" lang="ts">
</script>

<style lang="scss" scoped>
li {
  margin: 10px 0;
}
// 表單標題
.form__title {
    color: #2F6A9A;
    font-size: 20px;
    font-weight: 700;
}
.setting__desc {
  border: 1px solid gray;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 15px;
  width: 550px;
}
.form__content {
  list-style: decimal;
}
.text--bold {
  font-weight: bold;
  line-height: 1.5;
}
.examplePic {
  width: 60%;
  height: 60%;
}
.event__block {
  margin-top: 20px;
}
</style>
