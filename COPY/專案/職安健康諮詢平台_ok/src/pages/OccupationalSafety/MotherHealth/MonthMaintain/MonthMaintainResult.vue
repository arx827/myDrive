<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '發送成功':'發送失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，您欲發送的項目已完成，謝謝！
          <br>
          衛教指導通知(跟催)：{{ healthCnt }} 筆
          <br>
          醫師諮詢通知(跟催)：{{ phyConsultCnt }} 筆
          <br>
          表單填寫通知(跟催)：{{ formCnt }} 筆
        </div>
        <div v-else>
          親愛的護理同仁您好， 您欲發送的項目，因{{ msg }}因素無法進行。 如尚需發送通知，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/MaternalProtect/monthMaintain/index">
          <a
            class="btn__radius--primary me-1 btn"
            href="#"
          >返回</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class EventContentMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  // 錯誤訊息
  msg = '';

  // 表單填寫通知 筆數
  formCnt = '';

  // 衛教指導通知 筆數
  healthCnt = '';

  // 醫師諮詢通知 筆數
  phyConsultCnt = '';

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	if (this.result === 'success') {
  		this.formCnt = query.data.formCnt;
  		this.healthCnt = query.data.healthCnt;
  		this.phyConsultCnt = query.data.phyConsultCnt;
  	} else {
  		this.msg = query.message.join('、');
  	}
  }
}
</script>

<style lang="scss" scoped>
  .btn{
    width: 200px;
  }
</style>
