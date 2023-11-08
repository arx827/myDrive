<template>
  <div>
    <Result
      :page-title="type==='發布'? '發布多場次結果' : '執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，您欲{{ type }}的項目已完成，謝謝!
        </div>
        <div v-else>
          親愛的護理同仁您好，您欲{{ type }}的項目因{{ msg }}，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/PhyConsult/serviceTimeMaintain/index">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回服務場次管理</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class ServiceTimeMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  msg = '';

  type = '';

  created() {
  	const query = this.$global.getQuery();
  	switch (this.$router.currentRoute.params.type) {
  	case 'add':
  		this.type = '新增';
  		break;
  	case 'edit':
  		this.type = '編輯';
  		break;
  	case 'release':
  		this.type = '發布';
  		break;
  	default:
  		break;
  	}
  	if (query) {
  		this.result = query.result;
  		this.msg = query.msg;
  	}
  }
}
</script>

<style>

</style>
