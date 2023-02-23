<template>
  <div class="SearchDispatch">
    <LayoutLoading v-if="pageLoading" />
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的人員派件？(可多選)
      </h2>
    </div>
    <div class="search-dispatch">
      <a-form-model
        ref="searchDispatchIndexForm"
        class="gioFormGroup formW275"
        :layout="'vertical'"
        :hide-required-mark="true"
        :model="form"
        :rules="rules"
      >
        <a-row
          type="flex"
          justify="center"
        >
          <a-col span="24">
            <a-form-model-item label="產品線" prop="productLine">
              <a-select
                v-model="form.productLine"
                allow-clear
              >
                <a-select-option
                  v-for="item in productLineOpts"
                  :key="item.key"
                >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row
          type="flex"
          justify="center"
        >
          <a-col span="24">
            <a-form-model-item label="行政人員">
              <a-select
                v-model="form.admUserId"
                allow-clear
                :loading="isSelectLodaing"
                placeholder="請選擇"
              >
                <a-select-option
                  v-for="item in userIdOpts"
                  :key="item.key"
                >
                  {{ item.val }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="search-footer text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="handleSubmit()"
      >
        查詢
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

@Component({
  components: { LayoutLoading },
})
export default class SearchDispatch extends Vue {
  pageLoading = true;

  form = {
    // 【產品線】依登入者之權限帶入
    productLine: (this.$user.getAdmCbRc() as any == 'ALL') ? '0' : this.$user.getAdmCbRc(),
    admUserId: '0',
  };

  // 下拉選項是否 loading
  isSelectLodaing = true;

  // 【產品線】選項
  productLineOpts = [];

  // 【行政人員】選項
  userIdOpts: { key: string; val: string }[] = [];

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    productLine: [{ required: true, message: '請選擇欲查詢的產品線', trigger: 'change' }],
  }

  /**
   * Event
   */
  // 查詢
  handleSubmit() {
    (this.$refs.searchDispatchIndexForm as any).validate()
      .then(() => {
        const { form } = this;
        form.productLine = (form.productLine == '0') ? null : form.productLine;
        form.admUserId = (form.admUserId == '0') ? null : form.admUserId;
        this.$global.changeRouterAndaddParam({
          toRouter: 'SearchDispatchResult',
          query: {
            form,
          },
        });
      });
  }

 /**
 * Hooks
 */
  created() {
    // 【產品線】增加「全部」選項
    this.productLineOpts = JSON.parse(JSON.stringify(this.$enum.customer));
  }

  @Watch('form.productLine', { immediate: true })
  onProductLineChanged(newVal) {
    this.isSelectLodaing = true;
    if (newVal == 0) {
      // API: 團險行政人員下拉選單
      this.$gioUtilityApi.listAdmUserUsingPOST()
        .then((resp) => {
            const getData = JSON.parse(JSON.stringify(resp.data.data));
            this.userIdOpts = [{ admId: '0', admName: '全部' }, ...getData].map((i) => ({
              key: i.admId,
              val: (i.admId == '0') ? i.admName : [i.admId, i.admName].join(' '),
            }));
          })
          .catch((error) => {
            this.userIdOpts = [{ admId: '0', admName: '全部' }].map((i) => ({
              key: i.admId,
              val: i.admName,
            }));
          })
          .finally(() => {
            this.isSelectLodaing = false;
            this.pageLoading = false;
          });
    } else {
      // API: 團險產品線行政人員下拉選單
      this.$gioUtilityApi.listAdmCbRcUserUsingPOST(newVal)
        .then((resp) => {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          this.userIdOpts = [{ admId: '0', admName: '全部' }, ...getData].map((i) => ({
            key: i.admId,
            val: (i.admId == '0') ? i.admName : [i.admId, i.admName].join(' '),
          }));
          // 檢查已選的行政人員是否在選項中
          if (this.form.admUserId && this.userIdOpts.findIndex((i) => i.key == this.form.admUserId) < 0) {
            this.form.admUserId = '0';
          }
        })
        .catch((error) => {
          this.userIdOpts = [{ admId: '0', admName: '全部' }].map((i) => ({
            key: i.admId,
            val: i.admName,
          }));
        })
        .finally(() => {
          this.isSelectLodaing = false;
          this.pageLoading = false;
        });
    }
  }

 /**
 * 監聽
 */
}
</script>

<style scoped>
</style>
