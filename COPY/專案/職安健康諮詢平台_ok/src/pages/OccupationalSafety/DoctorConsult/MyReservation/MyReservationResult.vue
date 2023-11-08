<template>
  <div>
    <Result
      :page-title="'我的預約'"
      :result-title="result === 'success' ? '取消預約成功':'取消預約失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          <p>親愛的同仁您好，</p>
          <p>您欲取消預約的項目已處理成功，謝謝。</p>
        </div>
        <div v-else>
          親愛的同仁您好，
          <br>
          您欲取消預約的項目，因{{ errorMsg }}。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link :to="{name: 'MyReservationIndex'}">
          <button class="btn__radius--primary">
            回到我的預約
          </button>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class EventMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

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
