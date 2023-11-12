<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '完成滿意度填答嚕！':'儲存失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          <p>謝謝您寶貴的回饋，祝您有個美好的一天！</p>
        </div>
        <div v-else>
          {{ errorMsg }}
        </div>
      </template>
      <template v-slot:buttons>
        <router-link :to="{name: 'MyRegistrationIndex'}">
          <button class="btn__radius--primary">
            返回我的報名
          </button>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({
	components: { Result },
})
export default class HealthPromoteResult extends Vue {
  result: 'success' | 'error';

  errorMsg: string = ''

  created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.errorMsg = query.errorMsg;
  }
}
</script>

<style lang="scss" scoped>
.result__footer {
	margin: 50px 0;
	button {
		width: 200px;
		max-width: 100%;
	}
}
</style>
