<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '檢核上傳成功':'檢核上傳失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，<br>
          您欲上傳的資料檔案已建立，共計1筆資料，謝謝！
        </div>
        <div v-else>
          親愛的護理同仁您好，<br>
          您欲上傳的檔案
          <span class="font-gray">，因{{ msg }}。<br>
            如尚需上傳檔案，請您再次嘗試。或與相關服務人員聯繫，謝謝您!</span>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/HealthCheck/empHealthReport/list">
          <a
            class="btn__radius--primary"
            href="#"
          >返回資料維護</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class EmpHealthReportUploadSingleResult extends Vue {
  result: 'success' | 'fail' = null;

  // 錯誤訊息
  msg = '';

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.msg = query.message;
  }
}
</script>

<style lang="scss" scoped>
  .font-gray{
    color: #363636;
  }

</style>
