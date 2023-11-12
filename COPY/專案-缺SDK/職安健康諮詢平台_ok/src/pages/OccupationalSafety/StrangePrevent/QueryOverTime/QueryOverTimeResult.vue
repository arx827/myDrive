<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '發送成功':'發送失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          <p>親愛的護理同仁您好，您欲發送的項目已完成，謝謝！</p>
          <p
            v-for="(item, index) in sendList"
            :key="index"
          >
            {{ item.title }}：{{ item.count }} 筆
          </p>
        </div>
        <div v-else>
          親愛的護理同仁您好，
          <br>
          您欲發送的項目，因{{ errorMsg }}因素無法進行。
          <br>
          如尚需發送通知，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link :to="'/occupationSafety/AbnormalLoad/queryOverTime/list'">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回查詢結果</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class QueryOverTimeResult extends Vue {
  result: 'success' | 'fail' = null;

  errorMsg: string = ''

  sendList = []

  getSendList(data) {
  	this.sendList = data.map((e) => {
  		if (e.title === 'formCheck') {
  			e.title = '發送職業壓力過負荷評估量表填寫通知';
  		} else if (e.title === 'healthCheck') {
  			e.title = '發送衛教填寫通知';
  		} else if (e.title === 'doctorCheck') {
  			e.title = '發送醫師諮詢通知';
  		} else if (e.title === 'fCheck') {
  			e.title = '發送十年心血管疾病風險評估量表通知';
  		}
  		return e;
  	});
  }

  created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.errorMsg = query.errorMsg;
  	this.getSendList(query.sendInfo);
  	console.log(query);
  }
}
</script>

<style>

</style>
