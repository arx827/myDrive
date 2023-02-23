<template>
  <div class="ApplMaintenanceUndertakerDataConfirm">
    <LayoutLoading v-if="pageLoading" />
    <div class="form-header d-flex align-items-center">
      <h2
        class="main-title"
      >
        承辦人帳號維護
      </h2>
    </div>
    <!-- 要保單位資料 -->
    <div class="page__card my-3">
      <div class="gioConfirmGroup formW720">
        <a-row v-for="(item,index) in $enum.applDataGroup" :key="index" type="flex" class="row-confirm-item" :gutter="[45, 0]">
          <a-col :span="7" class="confirm-item__title fw-bold">
            {{ item.label || '' }}
          </a-col>
          <a-col v-if="item.type=='policyNum'" :span="17" class="result__info">
            {{ `${searchResult[item.key[0]]}-${searchResult[item.key[1]]}` || '' }}
          </a-col>
          <a-col v-else :span="17" class="result__info">
            <template v-if="typeof item.key === 'string'">
              {{ searchResult[item.key] || '' }}
            </template>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 承辦人資料 -->
    <div v-if="form" class="page__card">
      <div class="gioConfirmGroup formW720">
        <a-row v-for="(item, index) in underTakerDataGroup" :key="index" type="flex" class="row-confirm-item" :gutter="[45, 0]">
          <a-col :span="7" class="confirm-item__title fw-bold">
            {{ item.label || '' }}
          </a-col>
          <a-col v-if="item.type=='txt' && typeof item.key === 'string'" :span="17" class="result__info">
            {{ form[item.key] || '' }}
          </a-col>
          <a-col v-if="item.type=='tel'" :span="17" class="result__info">
            {{ formatTelNum( item.key) || '' }}
          </a-col>
          <a-col v-if="item.type=='auth' && typeof item.key === 'string'" :span="17" class="result__info">
            {{ getAuthLabel(form[item.key]) || '' }}
          </a-col>
          <a-col v-if="item.type=='msg' && typeof item.key === 'string'" :span="17" class="result__info">
            <div v-for="(msg, idx) in form[item.key]" :key="idx">
              {{ msg }}
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 按鈕 -->
    <div class="form-footer text-center">
      <button
        v-if="!isConfirm"
        class="confirm__button confirm__button-cancel"
        @click="handleCancel"
      >
        上一步
      </button>
      <button
        v-if="!isConfirm"
        class="confirm__button confirm__button-cancel"
        @click="handleReturn"
      >
        退回
      </button>
      <button
        class="confirm__button confirm__button-submit"
        @click="handleSubmitForm"
      >
        {{ isConfirm ? '返回查詢結果' : $enum.reviewType.filter((i)=>i.params == paramsType)[0].val }}
      </button>
      <button
        v-if="!isConfirm"
        class="confirm__button confirm__button-download"
        @click="handleExport"
      >
        下載檢核表
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { ReviewCommendVI, UserInfoDto } from '@fubonlife/co-giiss-api-axios-sdk';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import moment from 'moment';

@Component({
  components: { LayoutLoading },
})
export default class ApplMaintenanceUndertakerDataConfirm extends Vue {
  h = this.$createElement;

  pageLoading = false;

  // 新增/修改
  addAndEditType= '';

  // 表單內容
  form: UserInfoDto = {};

  // 保單唯一碼
  policyId = '';

  // 是否為新增/修改內容確認頁
  isConfirm = true;

  // 路由參數 判斷為【新增/修改內容確認頁】or【覆核程序頁】
  paramsType = '';

  // 要保單位查詢結果(直接顯示)
  searchResult: { poliId?: string; poliSeq?: string; fullName?: string; bossName?: string} = {};

  // 承辦人資料
  underTakerDataGroup: {key: string | Array<string>; label: string; type: string}[] = [
    {
      key: 'userId',
      label: '承辦人身分證字號',
      type: 'txt',
    },
    {
      key: 'userName',
      label: '承辦人姓名',
      type: 'txt',
    },
    {
      key: 'userEmail',
      label: '電子信箱',
      type: 'txt',
    },
    {
      key: ['utelAreaCode', 'utelNo', 'utelExtensionNo'],
      label: '電話 (區碼/電話/分機)',
      type: 'tel',
    },
    {
      key: 'authNameList',
      label: '權限內容',
      type: 'auth',
    },
    {
      key: 'auditMessage',
      label: '檢核訊息',
      type: 'msg',
    },
  ]

  /**
   * Func
   */
  // 取得 Query 並帶入資料
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.paramsType = this.$router.currentRoute.params.type;
      this.isConfirm = this.paramsType == 'confirm';

      const {
        policyId, searchResult, type,
      } = $query;
      this.policyId = policyId;
      this.searchResult = searchResult;
      this.addAndEditType = type;
      this.getData(this.policyId);
    } else {
      // 無query則強制跳轉至結果頁
      this.$router.replace({ name: 'ApplMaintenanceUndertakerDataResult' });
    }
  }

  // 陣列取【權限內容】欄位值
  getAuthLabel(arr) {
    return arr ? arr[0] : '';
  }

  // 電話號碼格式化 「區碼-電話 #分機」
  formatTelNum(properties) {
    const [code, num, ext] = properties;
    if (this.form[code] && this.form[num] && this.form[ext]) {
      return `${this.form[code]}-${this.form[num]} #${this.form[ext]}`;
    } if (this.form[code] && this.form[num]) {
      return `${this.form[code]}-${this.form[num]}`;
    }
    return '';
  }

  // 查詢要保單位承辦人
  getData(policyId) {
    this.pageLoading = true;
    this.$unitManagementApi
      .oneCaseOfficerUsingPOST(policyId)
      .then((resp) => {
        if (resp.status == 200) {
          const getData = resp.data.data;
          this.form = getData;
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

  // 進入覆核程序
  reviewOneCaseOfficer() {
    this.pageLoading = true;
    this.$unitManagementApi
      .validateCaseOfficerUsingPOST({ policyId: this.policyId })
      .then((resp) => {
        const paramsTypeTxt = this.$enum.reviewType.filter((i) => i.params == this.paramsType)[0].val;
        if (resp.data.status == 200) {
          this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' }).then(() => {
            this.$infoNotification.success({
              Content: `已完成${paramsTypeTxt}`,
            });
          });
        } else {
          this.$infoNotification.error({
            Content: '無法完成覆核項目，請再次嘗試。',
            apiError: resp.data.apiError,
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法完成覆核項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
   * Event
   */
  // 返回查詢結果 or 覆核
  handleSubmitForm() {
    if (this.isConfirm) {
      this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' });
    } else {
      this.reviewOneCaseOfficer();
    }
  }

  // 【取消】
  handleCancel() {
    this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' });
  }

  // 退回此承辦人
  handleReturn() {
    this.pageLoading = true;
    this.$unitManagementApi
      .validateDenyCaseOfficerUsingPOST(this.policyId)
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.data.status == 200) {
          this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' }).then(() => {
            this.$infoNotification.success({
              Content: '已成功退回',
            });
          });
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

  // 下載檢核表
  handleExport() {
    this.pageLoading = true;
    this.$unitManagementApi
      .exportCaseOfficerUsingPOST(this.policyId, { responseType: 'blob' })
      .then((resp) => {
        // TEST:
        // console.log('export:', resp);
        if (resp.headers['content-disposition']) {
          const current = moment(new Date()).format('YYYY/MM/DD').split('/');
          const twYear = `${parseInt(current[0]) - 1911}`;
          const downloadName = `承辦人檢核表_${twYear}${current[1]}${current[2]}`;
          this.$blobUtils.download((resp.data as unknown as Blob), `${downloadName}.pdf`);
        } else {
          this.$unitManagementApi
          .exportCaseOfficerUsingPOST(this.policyId)
          .then((resp) => {
            const errorData = JSON.parse(JSON.stringify(resp));
            if (errorData.data.status != 200) {
              const getError = errorData.data;
              this.$infoNotification.error({
                Content: '無法完成下載項目，請再次嘗試。',
                apiError: getError.apiError,
              });
            }
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法完成下載項目，請再次嘗試。',
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

  updated() {
  	window.parseWord();
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

.result__info {
  word-break: break-all;
}

</style>
