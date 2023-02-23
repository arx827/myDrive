<template>
  <div class="container main-container accountPermissionsAdd">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        新增行政人員帳號權限
      </h2>
    </div>
    <a-form-model
      class="gioFormGroup"
      :form="searchForm"
      :layout="'vertical'"
      :model="searchForm"
      :hide-required-mark="true"
    >
      <a-row type="flex" justify="center" :gutter="[15, 0]">
        <!-- ID -->
        <a-col span="8">
          <a-form-model-item
            label="ID"
            prop="id"
            :validate-status="customErrorMsg.id ? 'error' : ''"
            :help="customErrorMsg.id"
          >
            <a-input-search
              v-model="searchForm.domainId"
              placeholder="e.g. A1234"
              @search="onAdmIdSubmit"
              @change="onChangeAdmId"
            >
              <a-button slot="enterButton">
                <img
                  class="icon-button__img"
                  src="~@images/button_search_white.svg"
                  alt=""
                >
              </a-button>
            </a-input-search>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-divider :dashed="true" />
    <div class="formContent container-fluid">
      <a-form-model
        ref="accountPermissionsAddForm"
        class="gioFormGroup formW550"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
      >
        <a-row type="flex" :gutter="[15, 0]">
          <!-- 產品線 -->
          <a-col span="12">
            <a-form-model-item prop="admCbrc" label="產品線">
              <a-select v-model="form.admCbrc" allow-clear placeholder="請選擇">
                <a-select-option v-for="item in admCbrcOpts" :key="item.key">
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[15, 0]">
          <!-- 群組名稱 -->
          <a-col span="24">
            <a-form-model-item prop="authId" label="群組名稱">
              <a-select
                v-model="form.authId"
                mode="multiple"
                :show-arrow="true"
                allow-clear
                placeholder="可複選"
                :filter-option="filterAuths"
              >
                <a-select-option
                  v-for="item in giOfficerOpts"
                  :key="item.key"
                  :value="item.key"
                  :label="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <template v-if="true">
          <a-row v-if="searchResult.admName" class="result__row">
            <p class="result__title">
              員工姓名
            </p>
            <p class="result__info">
              {{ searchResult.admName }}
            </p>
          </a-row>
          <a-row v-if="searchResult.admTelExt" class="result__row">
            <p class="result__title">
              電話與分機
            </p>
            <p class="result__info">
              {{ searchResult.admTelExt }}
            </p>
          </a-row>
          <a-row v-if="searchResult.admEmail" class="result__row">
            <p class="result__title">
              電子信箱
            </p>
            <p class="result__info">
              {{ searchResult.admEmail }}
            </p>
          </a-row>
        </template>
      </a-form-model>
      <div class="confirm__button-group text-center">
        <button
          class="confirm__button confirm__button-cancel"
          @click="$router.go(-1)"
        >
          取消
        </button>
        <button
          class="confirm__button confirm__button-submit"
          @click="onSubmit()"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Modal } from 'ant-design-vue';
import {
  GiOfficerDto,
  GiOfficerUpdate,
  AuthDto,
} from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class AccountPermissionsAdd extends Vue {
  @Action('setLoading') setLoading;

  searchForm: { [key: string]: string } = {
    domainId: undefined,
  };

  searchResult: GiOfficerDto = {
    admName: undefined,
    admTelExt: undefined,
    admEmail: undefined,
  };

  hasGetGiOfficer = false;

  form: GiOfficerUpdate = {
    domainId: undefined,
    authId: undefined,
    admCbrc: undefined,
  };

  customErrorMsg: { [key: string]: string } = {
    id: '',
  };

  admCbrcOpts: { key: string; value: string }[] = [
    { key: 'RC', value: 'RC' },
    { key: 'CB', value: 'CB' },
    { key: 'ALL', value: '全部' },
  ];

  // 群組名單
  giOfficerOpts: {
    key: string;
    label: string;
    value: string;
  }[] = [];

  rules: { [key: string]: ValidationRule[] } = {
    admCbrc: [
      {
        required: true,
        message: '請選擇產品線',
        trigger: 'change',
      },
    ],
    authId: [
      {
        required: true,
        message: '請至少選擇一個群組',
        trigger: 'change',
      },
    ],
  };

  h = this.$createElement;

  /**
   * Func
   */

  // 取得 群組名單下拉
  getAuths(): void {
    this.setLoading(true);
    this.$maintenanceApi
      .listAuthUsingPOST()
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.giOfficerOpts = getData.map((i) => ({
            key: i.authId,
            label: i.authName,
            value: i.authName,
          }));
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得群組名單錯誤'),
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
        console.log('error = ', error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 多選下拉 有搜尋功能，使用此Func補足bug
  filterAuths(inputValue, option): boolean {
    const regx = new RegExp(inputValue);
    return regx.test(option.componentOptions.propsData.label);
  }

  // 取得 行政人員帳號權限資料
  getGiOfficer(searchId): void {
    this.setLoading(true);
    this.$maintenanceApi
      .oneGiOfficerUsingPOST(searchId.toUpperCase())
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.searchResult.admName = getData.admName;
          this.searchResult.admTelExt = getData.admTelExt;
          this.searchResult.admEmail = getData.admEmail;
          this.hasGetGiOfficer = true;
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          this.customErrorMsg.id = errorMsg.join('、');
        }
      })
      .catch((error) => {
        // API失敗
        console.log(error.response);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  /**
   * Event
   */
  // ID 欄位變更
  onChangeAdmId(): void {
    this.customErrorMsg.id = '';
    this.searchResult.admName = '';
    this.searchResult.admTelExt = '';
    this.searchResult.admEmail = '';
    this.hasGetGiOfficer = false;
  }

  // ID 查詢
  onAdmIdSubmit(): void {
    const rgx = /^[A-Za-z]{1,2}[0-9]{3,4}$/;
    const searchId = this.searchForm.domainId;
    if (searchId) {
      if (searchId.length != 5 || !rgx.test(searchId)) {
        this.customErrorMsg.id = 'ID格式不符';
      } else {
        this.customErrorMsg.id = '';
        this.getGiOfficer(searchId);
      }
    } else {
      this.customErrorMsg.id = 'ID不得為空';
    }
  }

  // 確認新增
  onSubmit(): void {
    if (!this.hasGetGiOfficer) {
      this.customErrorMsg.id = '請先查詢人員ID';
    }
    (this as any).$validateForm('accountPermissionsAddForm').then((res) => {
      if (this.hasGetGiOfficer) {
        // API: 新增人員權限
        this.setLoading(true);
        this.$maintenanceApi
          .newGiOfficerUsingPOST(this.form)
          .then((resp) => {
            if (resp.data.status == 200) {
              this.$router
                .push({ name: 'PersonnelAccPermissions' })
                .then(() => {
                  this.$infoNotification.success({
                    Content: '已完成新增',
                  });
                });
            } else {
              // 查找失敗訊息
              this.$infoNotification.error({
                Content: '無法完成新增項目，請再次嘗試。',
                apiError: resp.data.apiError,
              });
            }
          })
          .catch((error) => {
            // API失敗
            console.log('error', error.response);
          })
          .finally(() => {
            this.setLoading(false);
          });
      }
    });
  }

  /**
   * Hooks
   */
  created() {
    // 取得下拉選項
    this.getAuths();
  }

  updated() {
  	window.parseWord();
  }

  /**
   * 監聽
   */
  // 轉存大寫到 form
  @Watch('searchForm.domainId')
  watchDomainId(newVal) {
    this.form.domainId = this.searchForm.domainId.toUpperCase();
  }
}
</script>

<style lang="scss" scoped>
.result__row {
  margin-top: 20px;
}
.result__title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  padding-bottom: 5px;
}
.result__info {
  font-size: 16px;
}
</style>
