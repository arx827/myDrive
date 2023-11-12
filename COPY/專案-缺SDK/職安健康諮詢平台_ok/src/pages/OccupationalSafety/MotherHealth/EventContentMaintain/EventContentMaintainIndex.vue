<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          活動內容維護
        </div>
        <div class="pt-4">
          <button
            class="btn__radius--primary--outline--small"
            @click="goEdit"
          >
            編輯
          </button>
        </div>
      </div>
      <div v-if="content">
        <div class="event__block">
          <div class="block__title">
            活動說明
          </div>
          <div class="block__content editor__preview">
            <a-card class="block__content__card">
              <template #cover>
                <img
                  alt="example"
                  :src="content[0].value"
                >
              </template>
              <a-card-meta class="block__content__card__content">
                <template #description>
                  <div v-html="content[1].value" />
                </template>
              </a-card-meta>
            </a-card>
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            個資聲明
          </div>
          <div class="block__content editor__preview">
            <div v-html="content[2].value" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueEditor, Quill } from 'vue2-editor';
import { Action } from 'vuex-class';

@Component({ components: { VueEditor } })
export default class EventContentMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

  content: any = null // 內容

  goEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventContentMaintainEdit',
  		query: this.content,
  	});
  }

  created() {
  	this.setLoading(true);
  	this.$MONPLANRpnEventContentMaintainApi.queryEventContentRUsingPOST()
  		.then((resp) => {
  			console.log(resp.data.data);
  			this.content = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    color: $COLOR-MAIN1;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
	.ant-card-cover img {
    border-radius: 10px 10px 0 0;
	}
	.block__content__card{
		width: 100%;
		border: 0.5px solid #CED4D9;
		border-radius: 10px;
		box-shadow: 0px 3px 0px #C9C9C9;
		.block__content__card__content{
			padding-left: calc(92/1088*100%);
      padding-right: calc(92/1088*100%);
		}
	}
</style>
