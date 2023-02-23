<template>
  <div class="businessAddAndEdit">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        營業類別維護新增/修改
      </h2>
    </div>

    <div class="formContent container-fluid">
      <a-form-model
        ref="businessAddAndEditForm"
        class="gioFormGroup formW550 inputStyle"
        :form="form"
        :model="form"
        :colon="false"
        :rules="rules"
        :hideRequiredMark="true"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-model-item label="職災編號" prop="gpCode" class="inputStyle">
          <p v-if="editType === 'edit'">
            {{ form.gpCode }}
          </p>
          <a-input v-if="editType === 'add'" v-model="form.gpCode" style="width: 17%" placeholder="e.g. 04" />
        </a-form-model-item>

        <a-form-model-item label="營業類別" prop="gpCodeName" class="inputStyle">
          <a-input v-model="form.gpCodeName" style="width: 100%" placeholder="e.g. 遠洋漁業及海面養殖業" />
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
import { Getter, Action, State } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { GiCodeModelDto } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class MaintenancebusinessAddAndEdit extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  form: GiCodeModelDto= {
    gpCode: undefined,
    gpCodeName: undefined,
  };

  editType = '';

  hasGetQuery = false;

  rules: { [key: string]: ValidationRule[] } = {
    gpCode: [
      {
        required: true,
        message: '請輸入職災編號',
      },
      {
        pattern: new RegExp('[A-Za-z0-9]'),
        message: '請輸入有效英文數字',
      },
      {
        message: '請輸入半形字元',
        validator: this.fullWidthAcd,
      },
    ],
    gpCodeName: [
      {
        required: true,
        message: '請輸入營業類別',
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
  // 取得 Query 並帶入資料
  setResultParam() {
    const $query = this.$global.getQuery();
    this.editType = this.$router.currentRoute.params.type; // add or edit
    if ($query && this.editType == 'edit') {
      this.form.gpCode = $query.gpCode;
      this.form.gpCodeName = $query.gpCodeName;
    }
  }

  // 資料驗證
  validateForm(refsName) {
    return (this.$refs[refsName] as any).validate();
  }

  // 欄位檢核
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  /**
   * Event
   */
  // API: 新增/修改 & 驗證必填欄位
  onSubmit() {
    if (this.editType === 'edit') {
      // API: 修改營業類別
      this.validateForm('businessAddAndEditForm').then((res) => {
      this.setLoading(true);
      this.$maintenanceApi
        .updateBusinessTypeUsingPATCH(this.form)
        .then((resp) => {
          if (resp.data.status == 200) {
            this.$router
              .push({ name: 'MaintenanceBusiness' })
              .then(() => {
                this.$infoNotification.success({
                  Content: '已完成編輯',
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
    })
      .catch((error) => {
        // 檢核失敗
        console.log('error', error.response);
      });
    } else {
      // API: 新增營業類別
      this.validateForm('businessAddAndEditForm').then((res) => {
        this.setLoading(true);
        this.$maintenanceApi
          .newBusinessTypeUsingPOST(this.form)
          .then((resp) => {
            if (resp.data.status == 200) {
              this.$router.push({ name: 'MaintenanceBusiness' }).then(() => {
                this.$infoNotification.success({
                  Content: '已完成修改',
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
            this.$infoNotification.error({
              Content: '無法完成新增項目，請再次嘗試。',
            });
          })
          .finally(() => {
            this.setLoading(false);
          });
      })
      .catch((error) => {
        // 驗證失敗 要捲到 輸入框
        const getErrorEle = this.$el.querySelector('.has-error');
        if (getErrorEle) {
          // 新語法試用 scrollIntoView
          getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
      });
    }
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
.formContent {
  padding: 40px 0;
}

.confirm__button-group {
  margin-top: 40px;
}

::v-deep .gioFormGroup .ant-form-item-label {
  padding-bottom: 0px;
  padding-top: 0px;
}

::v-deep .gioFormGroup .ant-form-item-label > label {
  margin-right: 10px;
}
</style>
