<template>
  <div class="ApplMaintenanceUndertakerDataAddAndEdit">
    <LayoutLoading v-if="pageLoading" />
    <div class="form-header">
      <h2
        class="main-title"
      >
        新增/修改
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
    <div class="page__card">
      <a-form-model
        ref="applUndertakerAddAndEditForm"
        class="gioFormGroup formW720"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item
          label="承辦人身分證字號"
          prop="userId"
        >
          <input v-model="form.userId" v-mask="'NNNNNNNNNN'" class="ant-input" style="max-width: 276px" placeholder="e.g. A123456789">
        </a-form-model-item>

        <a-form-model-item prop="userName">
          <span slot="label" class="form-label-slot">
            承辦人姓名
            <a-popover
              trigger="click"
              placement="top"
            >
              <template slot="content">
                <div>原住民特殊字元可以複製以下字元使用</div>
                <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
              </template>
              <a-icon
                type="info-circle"
                :style="{
                  color: '#4CAAF5',
                  cursor: 'pointer',
                }"
              />
            </a-popover>
          </span>
          <a-textarea
            v-model="form.userName"
            placeholder="e.g. 林可可"
            :auto-size="{ minRows: 1}"
            allow-clear
            vue="true"
            alt="webfont"
          />
        </a-form-model-item>

        <a-form-model-item
          label="電子信箱"
          prop="userEmail"
        >
          <a-input v-model="form.userEmail" allow-clear placeholder="e.g. fubonlife123@fubon.com" />
        </a-form-model-item>

        <a-form-model-item
          label=" 電話 (區碼/電話/分機)"
        >
          <a-input-group>
            <a-row type="flex">
              <a-form-model-item prop="utelAreaCode">
                <input v-model="form.utelAreaCode" v-mask="'####'" class="ant-input" style="max-width: 92px" placeholder="e.g. 02">
              </a-form-model-item>
              <a-form-model-item prop="utelNo">
                <input v-model="form.utelNo" v-mask="'########'" class="ant-input" style="max-width: 168px" placeholder="e.g. 28885168">
              </a-form-model-item>
              <a-form-model-item prop="utelExtensionNo">
                <input v-model="form.utelExtensionNo" v-mask="'#####'" class="ant-input" style="max-width: 92px" placeholder="e.g. 82707">
              </a-form-model-item>
            </a-row>
          </a-input-group>
        </a-form-model-item>
        <p v-if="utelErrorMsg" class="message--error">
          {{ utelErrorMsg }}
        </p>

        <a-form-model-item
          label="權限內容"
          prop="authId"
          class="form-item__bg--blue radioBtn-group"
        >
          <a-radio-group
            v-model="form.authId"
            name="authorityRadioGroup"
            :options="authorityOptions"
          />
        </a-form-model-item>
        <p v-if="authIdError" class="message--error">
          {{ authIdError }}
        </p>
      </a-form-model>
    </div>
    <!-- 按鈕 -->
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
import { UserInfoDto, CoModifyDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { find } from 'rxjs/operators';

export interface ErrUtelModel {
  name: string; // 欄位名稱
  isEmpty: boolean; // 是否為空值
}

@Component({
  components: { LayoutLoading },
})
export default class ApplMaintenanceUndertakerDataAddAndEdit extends Vue {
  h = this.$createElement;

  pageLoading = true;

  // 新增/修改
  addAndEditType = '';

  // 表單內容
  form: CoModifyDto = {};

  // 要保單位查詢結果(直接顯示)
  searchResult: { poliId?: string; poliSeq?: string; fullName?: string; bossName?: string} = {};

  // 保單唯一碼
  policyId = '';

  // 【電話】欄位 錯誤訊息內容
  utelError: Array<ErrUtelModel> = [
    {
      name: '區碼',
      isEmpty: null,
    },
    {
      name: '電話',
      isEmpty: null,
    },
  ]

  utelErrorMsg = null;

  // 【權限內容】選項內容
  authorityOptions: { label?: string; value?: string}[] = [];

  // 【權限內容】欄位 錯誤訊息內容
  authIdError = null;

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    userId: [
      { required: true, message: '請填寫身分證字號', trigger: 'change' },
      { pattern: /[A-Za-z0-9]/, message: '身分證字號輸入格式錯誤' },
    ],
    userName: [
      { required: true, message: '請填寫姓名', trigger: 'change' },
      { max: 100, message: '姓名輸入格式錯誤' },
    ],
    userEmail: [
      { required: true, message: '請填寫電子信箱', trigger: 'change' },
      { pattern: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/, message: '電子信箱格式填寫錯誤', trigger: 'blur' },
    ],
    utelAreaCode: [{ required: true, trigger: 'change', validator: this.checkUtelAreaCode }],
    utelNo: [{ required: true, trigger: 'change', validator: this.checkUtelNo }],
    authId: [{ required: true, trigger: 'change', validator: this.checkAuthId }],
  }

  /**
   * Func
   */
  // 取得 Query 並帶入資料
  setEditParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      const { searchResult, type } = $query;
      this.searchResult = searchResult;
      this.addAndEditType = type;

      if (type === 'edit') {
        const { policyId } = $query;
        this.policyId = policyId;
        this.getOneCaseOfficer(policyId);
      } else {
        this.pageLoading = false;
      }
    } else {
      // 無query則強制跳轉至結果頁
      this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' });
    }
  }

  // 取得承辦人權限列表
  getAuthList() {
    this.$authApi
    .getAuthIdByRoleUsingPOST('CASE_OFFICER')
    .then((resp) => {
      if (resp.data.status == 200) {
        // TEST:
        // console.log(resp.data);
        const getData = resp.data.data;
        const auths = getData;
        this.authorityOptions = auths.map((item) => ({
          label: item.authName,
          value: item.authId,
        }));
      }
    })
    .finally();
  }

  // 查詢要保單位承辦人
  getOneCaseOfficer(policyId) {
    this.pageLoading = true;
    this.$unitManagementApi
      .oneCaseOfficerUsingPOST(policyId)
      .then((resp) => {
        if (resp.status == 200) {
          const getData = resp.data.data;
          const {
            policyNo, policySeq, userEmail, userId, userName, utelAreaCode, utelExtensionNo, utelNo, authNameList,
          } = getData;
          const authId = this.authorityOptions.filter((i) => i.label == authNameList[0])[0].value;
          this.form = {
            policyNo, policySeq, userEmail, userId, userName, utelAreaCode, utelExtensionNo, utelNo, authId,
          };
        } else {
          this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' }).then(() => {
            const getError = resp.data;
            this.$infoNotification.error({
              Content: '查無此承辦人資料，請再次嘗試。',
              apiError: getError.apiError,
            });
          });
        }
      })
      .catch((error) => {
        this.$router.push({ name: 'ApplMaintenanceUndertakerDataResult' }).then(() => {
          this.$infoNotification.error({
            Content: '查無此承辦人資料，請再次嘗試。',
          });
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 新增要保單位承辦人
  addOneCaseOfficer() {
    this.pageLoading = true;
    const { poliId, poliSeq } = this.searchResult;
    Object.assign(this.form, { policyNo: poliId, policySeq: poliSeq });
    this.$unitManagementApi
      .newCaseOfficerUsingPOST(this.form)
      .then((resp) => {
        if (resp.data.status == 200) {
          const responseData: UserInfoDto = JSON.parse(JSON.stringify(resp.data.data));
          const { policyId } = responseData;
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceUndertakerDataConfirm',
            params: { type: 'confirm' },
            query: {
              policyId,
              searchResult: this.searchResult,
            },
          });
        } else {
          const getError = resp.data;
          this.$infoNotification.error({
            Content: '無法完成新增項目，請再次嘗試。',
            apiError: getError.apiError,
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法完成新增項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 修改要保單位承辦人
  editOneCaseOfficer() {
    this.pageLoading = true;
    const $submit = Object.assign(JSON.parse(JSON.stringify(this.form)), { policyId: this.policyId });
    Object.entries($submit).forEach(([key, value]) => { $submit[key] = (value == '') ? null : value; });
    this.$unitManagementApi
      .updateCaseOfficerUsingPATCH($submit)
      .then((resp) => {
        // TEST:
        // console.log(resp);
        if (resp.data.status == 200) {
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceUndertakerDataConfirm',
            params: { type: 'confirm' },
            query: {
              policyId: this.policyId,
              searchResult: this.searchResult,
            },
          });
        } else {
          const getError = resp.data;
          this.$infoNotification.error({
            Content: '無法完成修改項目，請再次嘗試。',
            apiError: getError.apiError,
          });
        }
      })
      .catch((error) => {
        this.$infoNotification.error({
          Content: '無法完成修改項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 【電話-區碼】欄位檢核
  checkUtelAreaCode(rule, value, callback) {
    const idx = this.utelError.indexOf(this.utelError.find((i) => i.name == '區碼'));
    if (!value) {
      this.utelError[idx].isEmpty = true;
      callback('');
    } else {
      this.utelError[idx].isEmpty = false;
      callback();
    }
    this.concatUtelError();
  }

  // 【電話-號碼】欄位檢核
  checkUtelNo(rule, value, callback) {
    const idx = this.utelError.indexOf(this.utelError.find((i) => i.name == '電話'));
    if (!value) {
      this.utelError[idx].isEmpty = true;
      callback('');
    } else {
      this.utelError[idx].isEmpty = false;
      callback();
    }
    this.concatUtelError();
  }

  // 【權限內容】欄位檢核
  checkAuthId(rule, value, callback) {
    if (!value) {
      this.authIdError = '請選擇權限內容';
      callback('');
    } else {
      this.authIdError = null;
      callback();
    }
  }

  // 組合【電話】欄位的錯誤訊息
  concatUtelError() {
    // 組合欄位值為空值的欄位名稱
    const emptyErr = this.utelError.filter((i) => i.isEmpty == true).map((i) => i.name);

    if (emptyErr.length > 0) {
      this.utelErrorMsg = `請填寫${emptyErr.join('、')}`;
    } else {
      this.utelErrorMsg = null;
    }
  }

  /**
   * Event
   */
  // 送出表單資料
  handleSubmitForm() {
    // TEST:
    // console.log(this.form);
    (this.$refs.applUndertakerAddAndEditForm as any).validate()
      .then(() => {
        if (this.authIdError === null && this.utelErrorMsg === null) {
          if (this.addAndEditType == 'add') {
            this.addOneCaseOfficer();
          } else {
            this.editOneCaseOfficer();
          }
        }
      });
  }

  /**
   * Hooks
   */
  async created() {
    await this.getAuthList();
    this.setEditParam();
  }

  updated() {
  	window.parseWord();
  }

  /**
   * 監聽
   */
  // 【身分證字號】欄位 第一個字母轉大寫
  @Watch('form.userId')
  watchUserId(newVal) {
    if (newVal) {
      const rgx = /^[A-Za-z]{1}/;
      if (rgx.test(newVal)) {
        this.form.userId = this.form.userId.toUpperCase();
      }
    }
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
  .ant-row-flex {
    .ant-form-item {
      &:not(:first-child){
        margin-left: 10px;
      }
    }
  }
}

.gioFormGroup {
  padding-top: 35px;
}

.form-footer {
  padding: 30px 0 40px 0;
}

.radioBtn-group {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

textarea.ant-input {
  margin-bottom: 0;
}

.confirm-item__title {
  padding: 5px 0;
}

.result__info {
  padding: 5px 25px;
}

.message--error {
  padding-left: 205px;
}

</style>
