<template>
  <div class="MaintenanceDocApproving">
    <LayoutLoading v-if="pageLoading" />
    <div class="form-header d-flex align-items-center">
      <h2
        class="main-title"
      >
        主管核可
      </h2>
    </div>
    <div class="page__card my-3">
      <div class="gioConfirmGroup formW720">
        <!-- 文件代號 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            文件代號
          </a-col>
          <a-col :span="19" class="result__info">
            {{ form.docCode }}
          </a-col>
        </a-row>
        <!-- 文件說明 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            文件說明
          </a-col>
          <a-col :span="19" class="result__info">
            {{ form.docinstruction }}
          </a-col>
        </a-row>
        <!-- 檔案 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            檔案
          </a-col>
          <a-col>
            <a-button class="icon-button icon__upload-disabled" disabled>
              <a-icon type="upload" /> 上傳
            </a-button>
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
              </div>
            </div>
          </a-col>
        </a-row>
        <!-- 狀態 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            狀態
          </a-col>
          <a-col :span="19" class="result__info">
            {{ getStatusLabel(form.status) }}
          </a-col>
        </a-row>
        <!-- 生效日期 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            生效日期
          </a-col>
          <a-col :span="19" class="result__info">
            {{ $dateTime.customTWDateFormatter(form.effDate, 'YYYY/MM/DD') }}
          </a-col>
        </a-row>
        <!-- 修改人員 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            修改人員
          </a-col>
          <a-col :span="19" class="result__info">
            {{ form.updateId }}
          </a-col>
        </a-row>
        <!-- 修改時間 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            修改時間
          </a-col>
          <a-col :span="19" class="result__info">
            {{ $dateTime.TWDateFormatter(form.updateDatetime) }}
          </a-col>
        </a-row>
        <!-- 核可人員 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            核可人員
          </a-col>
          <a-col :span="19" class="result__info">
            {{ form.reviewerId }}
          </a-col>
        </a-row>
        <!-- 核可時間 -->
        <a-row type="flex" class="row-confirm-item" :gutter="[30, 0]">
          <a-col :span="5" class="confirm-item__title fw-bold">
            核可時間
          </a-col>
          <a-col :span="19" class="result__info">
            {{ form.reviewDatetime }}
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="form-footer text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="handleCancel"
      >
        上一步
      </button>
      <button
        class="confirm__button confirm__button-cancel"
        @click="handleReturn"
      >
        退回
      </button>
      <button
        class="confirm__button confirm__button-submit"
        @click="handleApprove"
      >
        核可
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { DocsetBringFixInfoDto, DocsetReviewModel } from '@fubonlife/co-giiss-api-axios-sdk';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import moment from 'moment';

@Component({
  components: { LayoutLoading },
})
export default class MaintenanceDocApproving extends Vue {
  pageLoading = true;

  h = this.$createElement;

  form: DocsetBringFixInfoDto = {};

  // 檔案內容(限單筆)
  fileList: {uid: string; url: string; name?: string}[] = [];

  /**
   * Func
   */
  async setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      const { id } = $query;
      this.getData(id);
      await this.getDownloadFile(id);
    }
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

  // 取得【狀態】 顯示用
  getStatusLabel(key) {
    return key ? this.$enum.getVal('docsetStatus', key) : '';
  }

  getData(id) {
    this.pageLoading = true;
    this.$gioDocsetApi
      .docsetUpdateUsingPOST(id)
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.form = getData[0];
          // TEST:
          // console.log(this.form);
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

  /**
   * Event
   */
  // 【主管核可】
  handleApprove() {
    this.pageLoading = true;
    const { docId, id } = this.form;
    const reviewModel: DocsetReviewModel = { docId, id };
    this.$gioDocsetApi
    .docSetReviewUsingPOST(reviewModel)
     .then((resp) => {
        if (resp.data.status == 200) {
          this.$router.push({ name: 'MaintenanceDoc' }).then(() => {
            this.$infoNotification.success({
              Content: '已完成核可',
            });
          });
          // 清除 param
          this.$global.clearParam();
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
        this.pageLoading = false;
      });
  }

  // 【取消】
  handleCancel() {
    this.$router.push({ name: 'MaintenanceDoc' });
  }

  // 【退回】
  handleReturn() {
    this.pageLoading = true;
    const { id } = this.form;
    this.$gioDocsetApi
    .docSetBackUsingPOST(id)
     .then((resp) => {
        if (resp.data.status == 200) {
          this.$router.push({ name: 'MaintenanceDoc' }).then(() => {
            this.$infoNotification.success({
              Content: '已完成退回',
            });
          });
          // 清除 param
          this.$global.clearParam();
        } else {
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
        this.pageLoading = false;
      });
  }

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-form-item-label {
    padding-left: 16px;
    padding-right: 16px;
    text-align: right;
  }
}

.form-footer {
  padding: 30px 0 40px 0;
  position: relative;
  .confirm__button-download {
    margin-left: 10px;
    position: absolute;
    right: 0;
  }
}

.upload-list {
  padding-top: 10px;
  font-size: 14px;
  .upload-list-item {
    position: relative;
    align-items: center;
    padding: 0 3px;
    .icon-paperclip {
      width: 13px;
    }
  }
}

</style>
