<template>
  <div class="marketingGioMarketingEdit">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        {{ pageTitle }}
      </h2>
    </div>
    <div class="page__card">
      <a-form-model
        ref="marketingGioMarketingEditForm"
        class="gioFormGroup formW720"
        :form="form"
        :model="form"
        :rules="rules"
        :layout="'vertical'"
        :hide-required-mark="true"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-row :gutter="[15, 0]">
          <!-- 類別 -->
          <a-form-model-item
            label="類別"
            class="readOnlyInfo"
          >
            <p class="result__info">
              {{ readOnlyInfo.areaName === 'BANNER' ? 'Banner': readOnlyInfo.areaName }}
            </p>
          </a-form-model-item>

          <!-- 連結方式 -->
          <!-- TODO: 狀態 若為核可則無法修改 -->
          <a-form-model-item
            label="連結方式"
            :class="{'form-item__bg--blue': isEdit && isStatusHasEdit, 'readOnlyInfo': !(isEdit && isStatusHasEdit)}"
            prop="urlStatus"
          >
            <a-radio-group
              v-if="isEdit && isStatusHasEdit"
              v-model="form.urlStatus"
              :options="$enum.marketingUrlStatus.map((i) => ({ label: i.val, value: i.key }))"
              :disabled="false"
            />
            <p v-else class="result__info">
              {{ $enum.getVal('marketingUrlStatus', form.urlStatus) }}
            </p>
          </a-form-model-item>
          <p v-if="customErrorMsg.urlStatus" class="message--error">
            {{ customErrorMsg.urlStatus }}
          </p>

          <!-- 商品主題 -->
          <!-- TODO: 狀態 若為核可則無法修改 -->
          <a-form-model-item
            label="商品主題"
            prop="productName"
            :class="{'readOnlyInfo': !(isEdit && isStatusHasEdit)}"
          >
            <a-input
              v-if="isEdit && isStatusHasEdit"
              v-model="form.productName"
              :allowClear="true"
            />
            <p v-else class="result__info">
              {{ form.productName }}
            </p>
          </a-form-model-item>

          <!-- 商品描述 -->
          <a-form-model-item
            label="商品描述"
            prop="productDescription"
            :class="{'readOnlyInfo': !(isEdit && isStatusHasEdit)}"
          >
            <a-input
              v-if="isEdit && isStatusHasEdit"
              v-model="form.productDescription"
              :allowClear="true"
            />
            <p v-else class="result__info">
              {{ form.productDescription }}
            </p>
          </a-form-model-item>

          <!-- URL連結 -->
          <a-form-model-item
            label="URL連結"
            prop="urlLink"
            :class="{'readOnlyInfo': !(isEdit && isStatusHasEdit)}"
          >
            <a-input
              v-if="isEdit && isStatusHasEdit"
              v-model="form.urlLink"
              :allowClear="true"
            />
            <p v-else class="result__info">
              {{ form.urlLink }}
            </p>
          </a-form-model-item>

          <a-form-model-item
            label="顯示圖檔"
            prop="imgFileList"
            class="align-items-start"
          >
            <a-row type="flex" align="middle">
              <a-upload
                ref="uploadRef"
                name="file"
                :multiple="false"
                :customRequest="uploadSingleImgFile"
                :remove="handleRemoveImgFile"
                :showUploadList="false"
              >
                <a-button class="icon-button icon__upload" :class="{'icon__upload-disabled': !(isEdit && isStatusHasEdit)}" :disabled="!(isEdit && isStatusHasEdit)">
                  <a-icon type="upload" /> 上傳
                </a-button>
              </a-upload>
              <p v-if="(isEdit && isStatusHasEdit)" class="ant-upload-hint mt-0">
                <span class="d-block">
                  BANNER大圖：<span class="small fw-light">圖片尺寸: 1366*250 px／解析度: 72 dpi／色彩模式: RGB</span>
                </span>
                <span class="d-block">
                  商品區塊規格：<span class="small fw-light">圖片尺寸: 342*347 px／解析度: 72 dpi／色彩模式: RGB</span>
                </span>
              </p>
            </a-row>
            <!-- 單筆上傳 -->
            <div v-if="imgFileList[0]" class="upload-list">
              <div v-for="item in imgFileList" :key="item.uid" class="upload-list-item d-flex">
                <img
                  class="icon-button__img icon-paperclip"
                  src="~@images/image_paperclip.svg"
                  alt=""
                >
                <a :title="item.name" :href="item.url" :download="item.name" class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                  {{ item.name }}
                </a>
                <img
                  v-if="isEdit"
                  title="刪除檔案"
                  class="icon-button__img icon-deleteGray"
                  src="~@images/button_deletGrey.svg"
                  @click="handleRemoveImgFile"
                >
              </div>
            </div>
            <p v-if="customErrorMsg.imgFileError" class="message--error ml-0">
              {{ customErrorMsg.imgFileError }}
            </p>
          </a-form-model-item>

          <a-form-model-item
            label="檔案"
            prop="fileList"
            class="align-items-start"
          >
            <a-row type="flex" align="middle">
              <a-upload
                ref="uploadRef"
                name="file"
                :multiple="false"
                :customRequest="uploadSingleFile"
                :remove="handleRemoveFile"
                :showUploadList="false"
                :before-upload="beforeUpload"
                @reject="beforeUpload"
              >
                <a-button class="icon-button icon__upload" :class="{'icon__upload-disabled': (!(isEdit && isStatusHasEdit) || form.urlStatus != '1')}" :disabled="(!(isEdit && isStatusHasEdit) || form.urlStatus != '1')">
                  <a-icon type="upload" /> 上傳
                </a-button>
              </a-upload>
              <p v-if="(isEdit && isStatusHasEdit)" class="ant-upload-hint mt-0">
                上傳檔案大小限制：10M
              </p>
            </a-row>
            <!-- 單筆上傳 -->
            <div v-if="fileList[0]" class="upload-list">
              <div v-for="item in fileList" :key="item.uid" class="upload-list-item d-flex">
                <img
                  class="icon-button__img icon-paperclip"
                  src="~@images/image_paperclip.svg"
                  alt=""
                >
                <a :title="item.name" :href="item.url" :download="item.name" class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                  {{ item.name }}
                </a>
                <img
                  v-if="isEdit"
                  title="刪除檔案"
                  class="icon-button__img icon-deleteGray"
                  src="~@images/button_deletGrey.svg"
                  @click="handleRemoveFile(item.uid)"
                >
              </div>
            </div>
            <p v-if="customErrorMsg.fileError" class="message--error ml-0">
              {{ customErrorMsg.fileError }}
            </p>
          </a-form-model-item>

          <!-- 狀態 -->
          <a-form-model-item
            label="狀態"
            class="readOnlyInfo"
          >
            <p class="result__info">
              {{ readOnlyInfo.status }}
            </p>
          </a-form-model-item>

          <!-- 修改人員 -->
          <a-form-model-item
            label="修改人員"
            class="readOnlyInfo"
          >
            <p class="result__info">
              {{ readOnlyInfo.createrId }}
            </p>
          </a-form-model-item>

          <!-- 修改時間 -->
          <a-form-model-item
            label="修改時間"
            class="readOnlyInfo"
          >
            <p class="result__info">
              {{ readOnlyInfo.createDate }}
            </p>
          </a-form-model-item>

          <!-- 核可人員 -->
          <a-form-model-item
            label="核可人員"
            class="readOnlyInfo"
          >
            <p class="result__info">
              {{ readOnlyInfo.reviewerId }}
            </p>
          </a-form-model-item>

          <!-- 核可時間 -->
          <a-form-model-item
            label="核可時間"
            class="readOnlyInfo"
          >
            <p class="result__info">
              {{ readOnlyInfo.reviewDate }}
            </p>
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </div>
    <!-- 預覽彈窗 -->
    <PreviewModal v-if="previewModal" :previewObj="previewObj" @close="closePreviewModal" />
    <div class="form-footer text-center">
      <!-- if 編輯 -->
      <template v-if="isEdit">
        <button
          class="confirm__button confirm__button-cancel"
          @click="onPreview(imgFileList[0].url)"
        >
          預覽
        </button>
        <button
          class="confirm__button confirm__button-cancel"
          @click="$router.go(-1)"
        >
          取消
        </button>
        <button
          v-if="isEdit"
          class="confirm__button confirm__button-submit"
          @click="onSubmitForm"
        >
          確定
        </button>
      </template>

      <!-- if 主管核可 -->
      <template v-if="!isEdit">
        <button
          class="confirm__button confirm__button-cancel"
          @click="$router.go(-1)"
        >
          取消
        </button>
        <button
          class="confirm__button confirm__button-cancel"
          @click="onWithDraw"
        >
          退回
        </button>
        <button
          class="confirm__button confirm__button-submit"
          @click="onApproving"
        >
          核可
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { Modal } from 'ant-design-vue';
import PreviewModal from '@compononts/modal/PreviewModal.vue';

export interface ProductModel {
  urlStatus?: string | null;
  productName?: string | null;
  productDescription?: string | null;
  urlLink?: string | null;
  status?: string | null;
  picBase64?: string | null;

  id?: number | null;
  areaId?: number | null;
}

@Component({
  components: { LayoutLoading, PreviewModal },
})

export default class marketingGioMarketingEditClass extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  pageType = '';

  status = '';

  previewModal = false;

  previewObj = {
    imgUrl: '',
    title: '',
    content: '',
  }

  // 頁面標題
  get pageTitle() {
    if (this.pageType === 'edit') {
      return '項目修改';
    }
    if (this.pageType === 'approving') {
      return '主管核可';
    }
      return '';
  }

  // 是否為修改頁
  get isEdit() {
    return this.pageType === 'edit';
  }

  // 可否編輯
  get isStatusHasEdit() {
    return this.status != '1';
  }

  pageLoading = false;

  // 唯讀的資料
  readOnlyInfo: {
    areaName?: string | null;
    status?: string | null;
    createrId?: string | null;
    createDate?: string | null;
    reviewerId?: string | null;
    reviewDate?: string | null;
    picBase64?: string | null;
  } = {};

  // 表單內容
  form: ProductModel = {
    urlStatus: null,
    productName: null,
    productDescription: null,
    urlLink: null,
    status: null,
    id: null,
    areaId: null,
  };

  customErrorMsg: { [key: string]: string | null } = {
    urlStatus: null,
    imgFileError: null,
    fileError: null,
  }

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 【生效日期】欄位值
  effDate = null;

  // 待上傳圖檔(限單筆輸入)
  imgFileList = [];

  // 待上傳檔案(限單筆輸入)
  fileList = [];

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    urlStatus: [
      {
        trigger: 'change',
        validator: this.checkRadio,
      },
    ],
    productName: [
      {
        max: 10,
        message: '最多10個字',
        trigger: 'change',
      },
    ],
    productDescription: [
      {
        max: 50,
        message: '最多50個字',
        trigger: 'change',
      },
    ],
    urlLink: [
      {
        max: 200,
        message: '最多200個字',
        trigger: 'change',
      },
    ],
    imgFileList: [
      {
        required: true,
        trigger: 'change',
        validator: this.checkImgFileList,
      },
    ],
    fileList: [
      {
        required: true,
        trigger: 'change',
        validator: this.checkFileList,
      },
    ],
  }

  /**
   * Func
   */
  // 初始資料
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.form.id = $query.id;
      this.form.areaId = $query.areaId;
    }
  }

  // API: 取得 單一行銷首頁維護修改資料
  async getMarketingEditInfo() {
    await this.$gioMarketingApi
      .marketingUpdateUsingPOST(this.form.id)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          // console.log(getData);
          this.readOnlyInfo.areaName = getData.areaName.toUpperCase() || '--';
          this.status = getData.status;
          this.readOnlyInfo.status = this.$enum.getVal('marketingStatus', getData.status);
          this.readOnlyInfo.createrId = getData.createrId || '--';
          this.readOnlyInfo.createDate = this.$dateTime.customTWDateFormatter(getData.createDate, 'YYYY/MM/DD HH:mm') || '--';
          this.readOnlyInfo.reviewerId = getData.reviewerId || '--';
          this.readOnlyInfo.reviewDate = this.$dateTime.customTWDateFormatter(getData.reviewDate, 'YYYY/MM/DD HH:mm') || '--';
          this.readOnlyInfo.picBase64 = getData.picBase64;

          this.form.areaId = getData.areaId;
          this.form.urlStatus = getData.urlStatus || '--';
          this.form.productName = getData.productName || '--';
          this.form.productDescription = getData.productDescription || '--';
          this.form.status = getData.status || '--';
          this.form.urlLink = getData.urlLink || '--';
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '錯誤訊息'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((error) => {
        // TEST:
        console.log('error = ', error);
      });
  }

  // API: 取得圖檔
  async getDownloadPic() {
    await this.$gioMarketingApi
      .downloadNasPicUsingPOST(this.form.id, { responseType: 'blob' })
      .then((resp) => {
        // 獲取fileName並轉成中文
        const filename = this.$blobUtils.decodeFileName(resp);
        if (filename) {
          this.imgFileList = this.$blobUtils.fetchFileList((resp.data as unknown as Blob), filename, this.imgFileList);
        }
        // console.log(this.imgFileList);
      })
      .catch((error) => {
        // TEST:
        console.log('error = ', error);
      });
  }

  // API: 取得檔案
  async getDownloadFile() {
    await this.$gioMarketingApi
      .downloadNasFileUsingPOST(this.form.id)
      .then(async (resp) => {
        if (resp.data) {
          await this.$gioMarketingApi
            .downloadNasFileUsingPOST(this.form.id, { responseType: 'blob' })
            .then((resp) => {
              // 獲取fileName並轉成中文
              const filename = this.$blobUtils.decodeFileName(resp);
              if (filename) {
                this.fileList = this.$blobUtils.fetchFileList((resp.data as unknown as Blob), filename, this.fileList);
              }
          })
          .catch((error) => {
            // TEST:
            console.log('error = ', error);
          });
        }
        // 獲取fileName並轉成中文
        // const filename = this.$blobUtils.decodeFileName(resp);
        // if (filename) {
        //   this.fileList = this.$blobUtils.fetchFileList((resp.data as unknown as Blob), filename, this.fileList);
        // }
        // console.log(this.fileList);
      })
      .catch((error) => {
        // TEST:
        console.log('error = ', error);
      });
  }

  // 檢核 Radio欄位空值
  checkRadio(rule, value, callback) {
    if (!value) {
      this.customErrorMsg.urlStatus = '請選擇連結方式';
      callback('');
    } else {
      this.customErrorMsg.urlStatus = null;
      callback();
    }
  }

  // 【圖檔】欄位檢核
  checkImgFileList(rule, value, callback) {
    if (this.imgFileList.length == 0) {
      this.customErrorMsg.imgFileError = '請選擇檔案';
      callback('');
    } else {
      this.customErrorMsg.imgFileError = null;
      callback();
    }
  }

  // 【檔案】欄位檢核
  checkFileList(rule, value, callback) {
    if (this.fileList.length == 0 && this.form.urlStatus == '1') {
      this.customErrorMsg.fileError = '請選擇檔案';
      callback('');
    } else {
      this.customErrorMsg.fileError = null;
      callback();
    }
  }

  // 刪除上傳 圖檔 列表的檔案
  handleRemoveImgFile() {
    this.imgFileList.pop();
  }

  // 刪除上傳 檔案 列表的檔案
  handleRemoveFile(uid) {
    const uidIndex = this.fileList.findIndex((i) => i.uid === uid);
    this.fileList.splice(uidIndex, 1);
  }

  // 檢查上傳的 檔案
  beforeUpload(file) {
    const isValidFileSize = file.size / 1024 / 1024 < 10;
    if (!isValidFileSize) {
      // this.handleRemoveFile(file);
      this.$notification.error({
        message: '無法完成上傳。',
        description: '上傳檔案大小限制：10M',
        class: 'notification__error',
        top: '96px',
        duration: null,
      });
      return false;
    }
      return true;
  }

  // 更新上傳 圖片 列表(僅限單筆) 可檢視檔案
  uploadSingleImgFile({ file }) {
    this.imgFileList = this.$blobUtils.updateFileList(file, file.name, this.imgFileList, false);
  }

  // 更新上傳 檔案 列表(僅限單筆) 可檢視檔案
  uploadSingleFile({ file }) {
    this.fileList = this.$blobUtils.updateFileList(file, file.name, this.fileList, false);
  }

  /**
   * Event
   */
  // 預覽
  onPreview(url) {
    // TEST:
    // console.log(url);
    // console.log(this.form);
    this.previewObj.imgUrl = url;
    this.previewObj.title = this.form.productName;
    this.previewObj.content = this.form.productDescription;
    this.previewModal = true;
  }

  // 關閉預覽彈窗
  closePreviewModal() {
    this.previewModal = false;
  }

  // 提交表單
  onSubmitForm() {
    (this.$refs.marketingGioMarketingEditForm as any).validate()
      .then(() => {
        if (Object.values(this.customErrorMsg).every((i) => i === null)) {
          this.setLoading(true);
          this.$gioMarketingApi
            .marketingModifyUsingPOST(this.imgFileList[0], this.fileList[0], JSON.stringify(this.form))
            .then((resp) => {
              if (resp.data.status == 200) {
                this.$router.push({ name: 'MarketingGioMarketing' }).then(() => {
                  this.$infoNotification.success({
                    Content: '已完成修改',
                  });
                });
                this.$global.clearParam();
              } else {
                this.$infoNotification.error({
                  Content: '無法完成修改，請再次嘗試。',
                  apiError: resp.data.apiError,
                });
              }
            })
            .catch((error) => {
              this.$infoNotification.error({
                Content: '無法完成修改，請再次嘗試。',
              });
            })
            .finally(() => {
              this.setLoading(false);
            });
        } else {
          // 驗證失敗 要捲到 輸入框
          const getErrorEle = this.$el.querySelector('.has-error');
          if (getErrorEle) {
            getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
          }
        }
      })
      .catch((error) => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = this.$el.querySelector('.has-error');
        if (getErrorEle) {
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
  }

  // API: 退回
  onWithDraw() {
    const { id } = this.form;
    this.setLoading(true);
    this.$gioMarketingApi
      .marketingBackUsingPOST(id)
      .then((resp) => {
        if (resp.data.status == 200) {
          // 成功訊息
          this.$router.push({ name: 'MarketingGioMarketing' }).then(() => {
            this.$infoNotification.success({
              Content: '已完成退回',
            });
          });
        } else {
          // 失敗訊息
          this.$infoNotification.error({
            Content: '無法完成退回項目，請再次嘗試。',
            apiError: resp.data.apiError,
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法完成退回項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // API: 主管核可
  onApproving() {
    const { id, areaId } = this.form;
    this.setLoading(true);
    this.$gioMarketingApi
      .marketingReviewUsingPOST({ areaId, id })
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.data.status == 200) {
          // 成功訊息
          this.$router.push({ name: 'MarketingGioMarketing' }).then(() => {
            this.$infoNotification.success({
              Content: '已完成核可',
            });
          });
        } else {
          this.$infoNotification.error({
            Content: '無法完成核可項目，請再次嘗試。',
            apiError: resp.data.apiError,
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法完成核可項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  /**
   * Hooks
   */
  async created() {
    this.pageType = this.$router.currentRoute.meta.type;
    // TEST:
    // console.log(this.$router.currentRoute.meta.type);
    // console.log(this.pageType);
    this.setLoading(true);
    await this.setResultParam();
    Promise.all([
      this.setResultParam(),
      this.getMarketingEditInfo(),
      this.getDownloadPic(),
      this.getDownloadFile(),
    ])
    .then(() => {
      this.setLoading(false);
    });
  }

  updated() {
  	window.parseWord();
  }

  // @Watch('effDate')
  // effDateChanged(val) {
  //   // 將 Date 格式轉為 ISO860 格式傳到後端
  //   this.form.effDate = this.$dateTime.ISO8601DateFormatter(val);
  // }

  /**
   * 監聽
   */
  // @Watch('isRender', { immediate: true })
  // watchIsRender(newVal) {
  //   console.log(newVal);
  // }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-form-item-label {
    padding-left: 16px;
    padding-right: 27px;
    text-align: right;
  }
  .ant-upload-list-item-name {
    color: $TEXT-COLOR-BLUE;
  }
}

.gioFormGroup {
  padding-top: 35px;
}

.form-footer {
  padding: 30px 0 40px 0;
}

textarea.ant-input {
  margin-bottom: 0;
}

.confirm-item__title {
  padding: 5px 0;
}

.ant-form-item {
  display: flex;
  align-items: start;
}

.message--error {
    padding-left: 120px;
}

.readOnlyInfo {
  margin-bottom: 0px;
  &.form-item__bg--blue {
    margin-bottom: 5px;
  }
}

// 檔案上傳
.upload-list {
  font-size: 14px;
  .upload-list-item {
    position: relative;
    align-items: center;
    padding: 0 3px;
    margin-top: 8px;
    &:hover {
      background-color: $ICON-BG-HOVER-BLUE;
      .icon-deleteGray {
        opacity: 1;
      }
    }
    .icon-paperclip {
      width: 13px;
      margin: 0;
    }
    .icon-deleteGray {
      position: absolute;
      right: 3px;
      cursor: pointer;
      width: 13px;
      opacity: 0;
    }
  }
}
</style>
