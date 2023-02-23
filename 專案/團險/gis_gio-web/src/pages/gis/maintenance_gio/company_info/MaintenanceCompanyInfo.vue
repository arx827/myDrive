<template>
  <div class="companyInfoEdit">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        公司基本資料變更
      </h2>
    </div>

    <div class="formContent container-fluid">
      <a-form-model
        ref="companyInfoEditForm"
        class="gioFormGroup formW900"
        :form="form"
        :layout="'vertical'"
        :model="form"
        :rules="rules"
        :hideRequiredMark="true"
      >
        <a-form-model-item label="總公司地址(郵遞區號/地址)">
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="3">
                <a-form-model-item prop="postalNo" class="inputStyle">
                  <a-input v-model="form.postalNo" placeholder="e.g. 106409" />
                </a-form-model-item>
              </a-col>
              <a-col :span="21">
                <a-form-model-item prop="address" class="inputStyle">
                  <a-input
                    v-model="form.address"
                    placeholder="e.g. 台北市內湖區瑞湖路62號10樓"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="總公司電話 (區碼/電話/分機)">
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="3">
                <a-form-model-item prop="telAreaCode" class="inputStyle">
                  <a-input v-model="form.telAreaCode" placeholder="e.g. 02" />
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item prop="telNo" class="inputStyle">
                  <a-input v-model="form.telNo" placeholder="e.g. 77788888" />
                </a-form-model-item>
              </a-col>
              <a-col :span="3">
                <a-form-model-item prop="telExtensionNo" class="inputStyle">
                  <a-input
                    v-model="form.telExtensionNo"
                    placeholder="e.g. 85797"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-model-item>

        <a-form-model-item label="總公司傳真 (區碼/傳真)">
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="3">
                <a-form-model-item prop="faxAreaCode" class="inputStyle">
                  <a-input v-model="form.faxAreaCode" placeholder="e.g. 02" />
                </a-form-model-item>
              </a-col>
              <a-col :span="5">
                <a-form-model-item prop="faxNo" class="inputStyle">
                  <a-input v-model="form.faxNo" placeholder="e.g. 12348888" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="onSubmit()"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { GiIngBasicDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';

@Component({})
export default class MaintenanceCompanyInfo extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  form: GiIngBasicDto = {
    postalNo: undefined,
    address: undefined,
    telAreaCode: undefined,
    telNo: undefined,
    telExtensionNo: undefined,
    faxAreaCode: undefined,
    faxNo: undefined,
  };

  rules: { [key: string]: ValidationRule[] } = {
    postalNo: [
      {
        required: true,
        message: '請輸入郵遞區號',
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    address: [
      {
        required: true,
        message: '請輸入公司地址',
      },
    ],
    telAreaCode: [
      {
        required: true,
        message: '請輸入區碼',
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    telNo: [
      {
        required: true,
        message: '請輸入電話號碼',
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    faxAreaCode: [
      {
        required: true,
        message: '請輸入區碼',
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    faxNo: [
      {
        required: true,
        message: '請輸入傳真號碼',
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
  };

  /**
   * Func
   */
  // 資料驗證
  validateForm(refsName) {
    return (this.$refs[refsName] as any).validate();
  }

  // 欄位檢核
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  // API: 查詢公司基本資料
  getCompanyInfo() {
    this.setLoading(true);
    this.$maintenanceApi
      .oneCompanyInfoUsingPOST()
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // TEST:
          // console.log(getData);
          this.form = getData;
          // 將資料 全形轉半形 (除了公司地址：可輸入全形半形)
          Object.keys(this.form).forEach((i) => {
            if (this.form[i] && i !== 'address') {
              this.form[i] = this.$global.toSBC(this.form[i]);
            }
          });
        } else {
          // 查找失敗訊息
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得公司基本資料錯誤'),
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

  /**
   * Event
   */
  // API: 確認修改 & 驗證必填欄位
  onSubmit() {
    // this.validateFocus = [];
    (this as any)
      .$validateForm('companyInfoEditForm')
      .then((res) => {
        // 更新公司基本資料
        this.setLoading(true);
        this.$maintenanceApi
          .updateBasicUsingPATCH(this.form)
          .then((resp) => {
            if (resp.data.status == 200) {
              // 成功訊息
              this.$router.push({ name: 'MaintenanceCompanyInfoConfirm' }).then(() => {
                this.$infoNotification.success({
                  Content: '已完成修改',
                });
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
            this.$infoNotification.error({
              Content: '無法完成修改項目，請再次嘗試。',
            });
          })
          .finally(() => {
            this.setLoading(false);
          });
      })
      .catch((err) => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = this.$el.querySelector('.has-error');
        if (getErrorEle) {
          // 新語法試用 scrollIntoView
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
  }

  /**
   * Hooks
   */
  created() {
    // 查詢公司基本資料
    this.getCompanyInfo();
  }

  /**
   * 監聽
   */
  // TEST:
  // @Watch('form', { deep: true })
  // watchForm(newVal) {
  //   console.log(newVal);
  // }
}
</script>

<style lang="scss" scoped>
.formContent {
  padding: 40px 0;
}

.confirm__button-group {
  margin-top: 40px;
}
</style>
