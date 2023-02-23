<template>
  <div class="container main-container accountPermissionsEdit">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        項目修改
      </h2>
    </div>
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
        <a-row
          type="flex"
          :gutter="[15, 0]"
        >
          <!-- ID -->
          <a-col span="8">
            <a-form-model-item label="ID">
              <p class="result__info">
                {{ searchForm.domainId }}
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          :gutter="[15, 0]"
        >
          <!-- 產品線 -->
          <a-col span="12">
            <a-form-model-item
              prop="admCbrc"
              label="產品線"
            >
              <a-select
                v-model="form.admCbrc"
                allow-clear
                placeholder="請選擇"
              >
                <a-select-option
                  v-for="item in admCbrcOpts"
                  :key="item.key"
                >
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          :gutter="[15, 0]"
        >
          <!-- 群組名稱 -->
          <a-col span="24">
            <a-form-model-item
              prop="authId"
              label="群組名稱"
            >
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
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <template v-if="true">
          <a-row
            v-if="searchResult.admName"
            class="result__row"
          >
            <p class="result__title">
              員工姓名
            </p>
            <p class="result__info">
              {{ searchResult.admName }}
            </p>
          </a-row>
          <a-row
            v-if="searchResult.admTelExt"
            class="result__row"
          >
            <p class="result__title">
              電話與分機
            </p>
            <p class="result__info">
              {{ searchResult.admTelExt }}
            </p>
          </a-row>
          <a-row
            v-if="searchResult.admEmail"
            class="result__row"
          >
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
import { GiOfficerDto, GiOfficerUpdate, AuthDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';

@Component({})
export default class AccountPermissionsEdit extends Vue {
  @Action('setLoading') setLoading;

  searchForm: { domainId: string} = {
    domainId: undefined,
  };

  searchResult: GiOfficerDto = {
    admName: undefined,
    admTelExt: undefined,
    admEmail: undefined,
  }

  form: GiOfficerUpdate = {
    domainId: undefined,
    authId: undefined,
    admCbrc: undefined,
  };

  customErrorMsg: { [key: string]: string } = {
    id: '',
  }

  hasGetGiOfficer = false;

  admCbrcOpts: { key: string; value: string }[] = [
    { key: 'RC', value: 'RC' },
    { key: 'CB', value: 'CB' },
    { key: 'ALL', value: '全部' },
  ];

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
  // 取得 群組下拉
  getAuths() {
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
      .oneGiOfficerUsingPOST(searchId)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          this.searchResult.admName = getData.admName;
          this.searchResult.admTelExt = getData.admTelExt;
          this.searchResult.admEmail = getData.admEmail;
          this.hasGetGiOfficer = true;
        } else {
          // 查找失敗訊息
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得人員帳號權限資料錯誤'),
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
        // API失敗
        console.log(error.response);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得 Query 並帶入資料
  setEditParam(): void {
    const $query = this.$global.getQuery();
    if ($query) {
      this.searchForm.domainId = $query.admId;
      this.form.admCbrc = $query.admCbrc;
      this.form.authId = $query.authId;
    }
  }

  /**
 * Event
 */
  // 確定修改
  onSubmit(): void {
    (this as any).$validateForm('accountPermissionsAddForm')
      .then((res) => {
        if (this.hasGetGiOfficer) {
        // API: 修改人員權限
          this.setLoading(true);
          this.$maintenanceApi
            .updateGiOfficerUsingPATCH(this.form)
            .then((resp) => {
              if (resp.data.status == 200) {
                this.$router.push({ name: 'PersonnelAccPermissions' }).then(() => {
                  this.$infoNotification.success({
                    Content: '已完成修改',
                  });
                  // 清除 param
                  this.$global.clearParam();
                });
              } else {
                // 查找失敗訊息
                this.$infoNotification.error({
                  Content: '無法完成修改項目，請再次嘗試。',
                  apiError: resp.data.apiError,
                });
              }
            })
            .catch((error) => {
            // API失敗
              console.log(error.response);
            })
            .finally(() => {
              this.setLoading(false);
            });
        } else {
          this.$infoNotification.error({
            Content: '無法完成修改項目，請再次嘗試。',
            apiError: ['未比對ID資訊'],
          });
        }
      });
  }

  /**
 * Hooks
 */
  async created() {
    await this.getAuths();
    await this.setEditParam();
  }

  /**
 * 監聽
 */
  @Watch('searchForm.domainId')
  watchDomainId(newVal) {
    this.getGiOfficer(newVal);
    this.form.domainId = this.searchForm.domainId.toUpperCase();
  }

  updated() {
  	window.parseWord();
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
