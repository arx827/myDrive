<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultSuccess>
      <template v-slot:body>
        <div>
          上傳資料正在處理中，可至

          <router-link to="/datasUpload/uploadResult">
            <a
              class="fw-bold"
              href="#"
            >「上傳結果」</a>
          </router-link>
          查詢上傳進度，謝謝。
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
          <router-link to="/datasUpload/uploadResult">
            上傳結果查詢
          </router-link>
        </button>
        <router-link to="/datasUpload">
          <a
            class="btn__radius--primary ms-1"
            href="#"
          >繼續資料上傳</a>
        </router-link>
      </template>
    </ResultSuccess>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultSuccess from '@/components/shared/layout/ResultSuccess.vue';

@Component({ components: { Breadcrumb, ResultSuccess } })
export default class Success extends Vue {
  @Prop()
  breadcrumb: {}

  files = null;

  created() {
  	this.files = [
  		{
  			name: 'XXXX.pdf',
  			size: '1.8MB',
  			link: 'XXXX.pdf',
  		},
  	];
  }
}
</script>

<style lang="scss" scoped>
</style>
