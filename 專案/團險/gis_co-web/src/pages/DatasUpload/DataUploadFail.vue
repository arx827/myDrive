<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultFail>
      <template v-slot:body>
        <div>
          系統連線有誤，請重新上傳，謝謝。
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/index">
          <a
            class="btn__radius--primary--outline me-1"
            href="#"
          >返回首頁</a>
        </router-link>
        <button class="btn__radius--primary--outline">
          上傳結果查詢
        </button>
        <router-link to="/datasUpload">
          <a
            class="btn__radius--primary ms-1"
            href="#"
          >繼續資料上傳</a>
        </router-link>
      </template>
    </ResultFail>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultFail from '@/components/shared/layout/ResultFail.vue';

@Component({ components: { Breadcrumb, ResultFail } })
export default class Fail extends Vue {
  @Prop()
  breadcrumb: {}
}
</script>

<style lang="scss" scoped>
</style>
