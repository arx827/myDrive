<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，
          <br>
          您欲{{ type }}的項目已完成，謝謝！
        </div>
        <div v-else>
          親愛的護理同仁您好，
          <br>
          您欲{{ type }}的內容，因{{ errMsg }}。
          <br>
          如尚需{{ content }}，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/Other/caseMaintain/list">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回個案主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class CaseMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  errMsg = null;

  paramType = null;

  type = null;

  content = '儲存編輯';

  setResultParam() {
  	this.paramType = this.$route.params.type;
  	const query = this.$global.getQuery();
  	if (query) {
  		this.result = query.result;
  		this.errMsg = query.errorMsg;
  	}
  }

  created() {
  	this.setResultParam();

  	switch (this.paramType) {
  	case 'list':
  		this.type = '儲存';
  		break;
  	case 'edit':
  		this.type = '編輯';
  		break;
  	case 'email':
  		this.type = '發送';
  		this.content = '發送表單填寫通知';
  		break;
  	case 'docTalkForm':
  		this.type = '編輯';
  		break;
  	default:
  		this.type = '新增';
  		this.content = '新增檔案';
  		break;
  	}
  	this.getData();
  }

  getData() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	// console.log('query', query);
  	this.result = query.result;
  }
}
</script>
