<template>
  <div>
    <Result
      :result-title="title"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好， 您欲{{ paramsType }}的項目已完成，謝謝！
        </div>
        <div v-else>
          親愛的護理同仁您好， 您欲{{ paramsType }}的項目因{{ msg }}因素無法進行。<br>
          如尚需{{ paramsType }}項目，請您再次嘗試，或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <button
          class="btn__radius--primary me-1"
          @click="goEventAndTimeMaintainPage()"
        >
          返回活動主頁
        </button>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class EventAndTimeMaintainEventAddAndEditStep4 extends Vue {
  /**
   * data
   */
  title: string = ''

  result: 'success' | 'fail' = 'success';

  msg: string = ''

  paramsType: string = ''

  paramsTypeEnum: Array<any> = [
  	{
  		key: 'edit',
  		val: '編輯',
  	},
  	{
  		key: 'add',
  		val: '新增',
  	},
  ]

  setResultParam() {
  	const $query = this.$global.getQuery();
  	this.result = $query?.result;
  	this.msg = $query?.msg;
  }

  /**
   * Event
   */
  // 回到活動與場次維護
  goEventAndTimeMaintainPage() {
  	this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  }

  /**
   * Hook
   */
  created() {
  	this.$emit('changeParent', { step: 4, pageTitle: '執行結果' });
  	this.setResultParam();
  	// 執行結果 title設定
  	const $type = this.$router.currentRoute.params.type;
  	this.paramsType = this.paramsTypeEnum.filter((i) => (i.key == $type))[0].val;
  	this.title = this.result == 'success' ? `${this.paramsType}成功` : `${this.paramsType}失敗`;
  }
}
</script>

<style lang="scss" scoped>
</style>
