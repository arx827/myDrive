<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="title"
      :result-type="result"
    >
      <template v-slot:body>
        <div>
          <div class="page__card__info">
            <!-- 成功訊息 -->
            <template v-if="result === 'success'">
              <p>親愛的護理人員您好，您欲{{ paramsType }}的「滿意度問卷<span v-if="version">:版號{{ version }}</span>」已完成，謝謝。</p>
            </template>

            <!-- 失敗訊息 -->
            <template v-else>
              <p>親愛的護理人員您好，</p>
              <p>您欲編輯的滿意度問卷，{{ errorMsg }}。</p>
              <p>如尚需編輯此資訊，請您再次嘗試，或與相關服務人員聯繫，謝謝您！</p>
              <p class="mt-4">
                相關問題也可聯繫健康促進公務信箱 <a
                  class="text-link"
                  :href="`mailto:${publicMail}`"
                >{{ publicMail }}</a> 。
              </p>
            </template>
          </div>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link :to="{name: 'SatisfyQuestMaintainIndex'}">
          <button class="form__btn btn__radius--primary">
            返回滿意度問卷維護
          </button>
        </router-link>
      </template>
    </Result>
    <!-- <TodoButton /> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';
import TodoButton from '@compononts/to-do/TodoButton.vue';

@Component({ components: { Result, TodoButton } })
export default class SatisfyQuestMaintainResult extends Vue {
	/**
   * data
   */
  title: string = ''

  version: string

  result: 'success' | 'fail' = 'fail';

  errorMsg: string

  paramsType: string

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

  publicMail = null;

  async created() {
  	// 執行結果 title設定
  	this.result = this.$global.getQuery().result;
  	this.version = this.$global.getQuery().version;
  	this.errorMsg = this.$global.getQuery().msg;
  	console.log(this.version);
  	const $type = this.$router.currentRoute.params.type;
  	this.paramsType = this.paramsTypeEnum.filter((i) => (i.key == $type))[0].val;
  	this.title = this.result == 'success' ? `${this.paramsType}成功` : `${this.paramsType}失敗`;
	  this.publicMail = await this.$global.getPublicEmail();
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
.page__card__info {
    margin-top: 20px;
    * {
      font-size: 18px;
      color: $COLOR-BLACK;
      line-height: 2;
      margin-bottom: 0;
    }
  }
  // 超連結樣式
  .text-link {
    color: $COLOR-MAIN15;
    text-decoration: underline;
  }
</style>
