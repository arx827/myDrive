<template>
  <div class="MaintenanceDocAddAndEdit">
    <LayoutLoading v-if="pageLoading" />
    <div class="form-header">
      <h2
        class="main-title"
      >
        新增/修改
      </h2>
    </div>
    <div class="page__card">
      <a-form-model
        ref="maintenceDocAddAndEditForm"
        class="gioFormGroup formW720"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <a-form-model-item
          label="文件代號"
          prop="docCode"
        >
          <a-input
            v-model="form.docCode"
            :allowClear="true"
            :maxLength="40"
          />
        </a-form-model-item>

        <a-form-model-item
          label="文件說明"
          prop="docinstruction"
        >
          <a-input
            v-model="form.docinstruction"
            :allowClear="true"
            :maxLength="100"
          />
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
            >
              <a-button class="icon-button icon__upload">
                <a-icon type="upload" /> 上傳
              </a-button>
            </a-upload>
            <p class="ant-upload-hint mt-0">
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
                title="刪除檔案"
                class="icon-button__img icon-deleteGray"
                src="~@images/button_deletGrey.svg"
                @click="handleRemoveFile"
              >
            </div>
          </div>
          <p v-if="fileError" class="message--error ml-0">
            {{ fileError }}
          </p>
        </a-form-model-item>

        <a-form-model-item
          label="狀態"
          prop="status"
        >
          {{ getStatusLabel(readOnlyInfo.status) }}
        </a-form-model-item>

        <a-form-model-item
          label="生效日期"
          prop="effDate"
        >
          <a-col :span="12">
            <date-picker
              v-model="effDate"
              style="width: 100%"
              :formatter="formatter"
              :allow-clear="true"
              type="date"
            />
          </a-col>
        </a-form-model-item>

        <a-form-model-item
          label="修改人員"
          prop="updateId"
        >
          {{ readOnlyInfo.updateId }}
        </a-form-model-item>

        <a-form-model-item
          label="修改時間"
          prop="updateDatetime"
        >
          {{ $dateTime.TWDateFormatter(readOnlyInfo.updateDatetime) }}
        </a-form-model-item>

        <a-form-model-item
          label="核可人員"
          prop="reviewerId"
        >
          {{ readOnlyInfo.reviewerId || '' }}
        </a-form-model-item>

        <a-form-model-item
          label="核可時間"
          prop="reviewDatetime"
        >
          {{ readOnlyInfo.reviewDatetime || '' }}
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="form-footer text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.go(-1)"
      >
        上一步
      </button>
      <button
        class="confirm__button confirm__button-submit"
        @click="handleSubmitForm"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

export interface DocsetModifyModel {
  docCode?: string;
  docId?: any;
  docinstruction?: string;
  effDate?: any;
  id?: any;
}

@Component({
  components: { LayoutLoading },
})

export default class MaintenanceDocAddAndEdit extends Vue {
  pageLoading = true;

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 【生效日期】欄位值
  effDate = null;

  // 是否為編輯頁面
  isEdit = false;

  // 唯讀的資料
  readOnlyInfo: { status?: string; updateId?: string; updateDatetime?: string; reviewerId?: string; reviewDatetime?: string } = {};

  // 待上傳檔案(限單筆輸入)
  fileList = [];

  fileError = null;

  // 表單內容
  form: DocsetModifyModel = {};

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    docCode: [{ required: true, message: '請填入有效文件代號', trigger: 'change' }],
    docinstruction: [{ required: true, message: '請填入有效文件說明', trigger: 'change' }],
    fileList: [{ required: true, trigger: 'change', validator: this.checkFileList }],
  }

  /**
   * Func
   */
  async setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      const { id } = $query;
      await this.getDocUpdateInfo(id);
      await this.getDownloadFile(id);
      this.isEdit = true;
    } else {
      this.pageLoading = false;
    }
  }

  // 取得【權限】中文 顯示用
  getStatusLabel(key) {
    return key ? this.$enum.getVal('docsetStatus', key) : '待核可';
  }

  // 取得原資料
  getDocUpdateInfo(id) {
    this.pageLoading = true;
    this.$gioDocsetApi
      .docsetUpdateUsingPOST(id)
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          const {
            docCode, docId, docinstruction, effDate, id, ...other
          } = getData[0];
          this.form = {
            docCode, docId, docinstruction, effDate, id,
          };
          this.effDate = new Date(effDate);
          this.readOnlyInfo = { ...other };
        }
      })
      .catch((error) => {
        // TEST:
        // console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 取得文件檔案
  getDownloadFile(id) {
    this.pageLoading = true;
    this.$gioDocsetApi
      .downloadNasFileForDocsetUsingPOST(id, { responseType: 'blob' })
      .then((resp) => {
        if (resp.headers['content-disposition']) {
          // 獲取fileName並轉成中文
          const filename = this.$blobUtils.decodeFileName(resp);
          if (filename) {
            this.fileList = this.$blobUtils.fetchFileList((resp.data as unknown as Blob), filename, this.fileList);
          }
        } else {
          this.$gioDocsetApi
          .downloadNasFileForDocsetUsingPOST(id)
          .then((resp) => {
            const errorData = JSON.parse(JSON.stringify(resp));
            if (errorData.data.status != 200) {
              const getError = errorData.data;
              this.$infoNotification.error({
                Content: '無法取得文件檔案，請再次嘗試。',
                apiError: getError.apiError,
              });
            }
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法取得文件檔案，請再次嘗試。',
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 【檔案】欄位檢核
  checkFileList(rule, value, callback) {
    if (this.fileList.length == 0) {
      this.fileError = '請選擇有效檔案';
      callback('');
    } else {
      this.fileError = null;
      callback();
    }
  }

  // 檢查上傳的檔案
  beforeUpload(file) {
    // TEST:
    // console.log(file.size);
    const isValidFileSize = file.size / 1024 / 1024 < 10;
    if (!isValidFileSize) {
      this.handleRemoveFile(file);
      return false;
    }
      return true;
  }

  //  更新上傳檔案列表(僅限單筆) 可檢視檔案
  uploadSingleFile({ file }) {
    this.beforeUpload(file);
    this.fileList = this.$blobUtils.updateFileList(file, file.name, this.fileList, false);
  }

  /**
   * Event
   */
  // 提交表單
  handleSubmitForm() {
    (this.$refs.maintenceDocAddAndEditForm as any).validate()
      .then(() => {
        if (this.fileError == null) {
          const { fileList } = this;
          // TEST:
          // console.log(this.form, fileList);

          let addAndEditType = '';
          addAndEditType = (!this.isEdit) ? '新增' : '修改';

          this.pageLoading = true;

          if (this.isEdit) {
            this.$gioDocsetApi.docSetModifyUsingPOST(fileList[0], JSON.stringify(this.form))
            .then((resp) => {
              // TEST:
              // console.log(resp);
              if (resp.data.status == 200) {
                this.$router.push({ name: 'MaintenanceDoc' }).then(() => {
                  this.$infoNotification.success({
                    Content: `已完成${addAndEditType}`,
                  });
                });
                this.$global.clearParam();
              } else {
                this.$infoNotification.error({
                  Content: `無法完成${addAndEditType}項目，請再次嘗試。`,
                  apiError: resp.data.apiError,
                });
              }
            })
            .catch((error) => {
              this.$infoNotification.error({
                Content: `無法完成${addAndEditType}項目，請再次嘗試。`,
              });
            })
            .finally(() => {
              this.pageLoading = false;
            });
          } else {
            this.$gioDocsetApi
              .docSetAddUsingPOST(fileList[0], JSON.stringify(this.form))
              .then((resp) => {
                // TEST:
                // console.log(resp);
                if (resp.data.status == 200) {
                  this.$router.push({ name: 'MaintenanceDoc' }).then(() => {
                    this.$infoNotification.success({
                      Content: `已完成${addAndEditType}`,
                    });
                  });
                  this.$global.clearParam();
                } else {
                  this.$infoNotification.error({
                    Content: `無法完成${addAndEditType}項目，請再次嘗試。`,
                    apiError: resp.data.apiError,
                  });
                }
              })
              .catch((error) => {
                this.$infoNotification.error({
                  Content: `無法完成${addAndEditType}項目，請再次嘗試。`,
                });
              })
              .finally(() => {
                this.pageLoading = false;
              });
            }
          }
      });
  }

  // 刪除上傳檔案列表的檔案
  handleRemoveFile(file) {
    this.fileList.pop();
  }

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
  }

  updated() {
  	window.parseWord();
  }

  destroyed() {
    this.fileList.forEach((i) => {
      this.$blobUtils.revokeObjectURL(i.url);
    });
  }

  @Watch('effDate')
  effDateChanged(val) {
    // 將 Date 格式轉為 ISO860 格式傳到後端
    this.form.effDate = this.$dateTime.ISO8601DateFormatter(val);
  }
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
    width: auto;
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
  align-items: center;
}

</style>
