<template>
  <div class="companyInfoConfirm">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        公司基本資料維護
      </h2>
      <div class="header-control__wrap ms-auto">
        <button class="card-header-btn text-btn btn__bg--primary" @click="previousPage">
          <p>變更資料</p>
        </button>
      </div>
    </div>
    <div class="page__card my-3">
      <div class="gioConfirmGroup formW900">
        <div class="row-confirm-item">
          <p class="fw-bold">
            總公司地址(郵遞區號/地址)
          </p>
          <p class="result__info">
            {{ result.postalNo }} {{ result.address }}
          </p>
        </div>
        <div class="row-confirm-item">
          <p class="fw-bold">
            總公司電話 (區碼/電話/分機)
          </p>
          <p class="result__info">
            {{ result.telAreaCode }}－{{ result.telNo }}{{ (result.telExtensionNo)? `－${result.telExtensionNo}` : '' }}
          </p>
        </div>
        <div class="row-confirm-item">
          <p class="fw-bold">
            總公司傳真 (區碼/傳真)
          </p>
          <p class="result__info">
            {{ result.faxAreaCode }}－{{ result.faxNo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { GiIngBasicDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';

@Component({})
export default class MaintenanceCompanyInfoConfirm extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  result: GiIngBasicDto = {
    postalNo: undefined,
    address: undefined,
    telAreaCode: undefined,
    telNo: undefined,
    telExtensionNo: undefined,
    faxAreaCode: undefined,
    faxNo: undefined,
  };

  /**
   * Func
   */
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
          this.result = getData;
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
  // 回上一頁
  previousPage(): void {
    this.$router.push({ name: 'MaintenanceCompanyInfo' });
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
.page__card {
  .gioConfirmGroup {
    padding-top: 20px;
  }
}
.result__info {
  font-size: 16px;
  padding: 5px 0;
}
</style>
