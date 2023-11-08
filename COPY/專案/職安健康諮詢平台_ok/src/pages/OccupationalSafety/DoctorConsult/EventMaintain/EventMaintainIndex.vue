<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          活動資訊設定
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
      <div
        v-if="content"
        class="event__wrap bg__light mb-5"
      >
        <div class="event__block">
          <div class="block__title">
            活動EDM Banner
          </div>
          <div class="block__content">
            <img
              :src="content.edmBannerPath"
              alt=""
              class="img-fluid w-100"
            >
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            活動說明
          </div>
          <div class="block__content editor__preview">
            <div v-html="content.description" />
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            規範聲明
          </div>
          <div class="block__content editor__preview">
            <div v-html="content.appointmentSpec" />
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            個資聲明
          </div>
          <div class="block__content editor__preview">
            <div v-html="content.personalInfoStatement" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { VueEditor, Quill } from 'vue2-editor';

@Component({ components: { VueEditor } })
export default class DoctorConsultIndex extends Vue {
  @Action('setLoading') setLoading;

  content: any = null // 內容

  goEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventMaintainEdit',
  		query: this.content,
  	});
  }

  created() {
  	this.setLoading(true);
  	this.$PCRRpnPortalApi.getPhyConsultConfigRpnUsingPOST()
  		.then((resp) => {
  			console.log(resp);
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
  .event__wrap {
    padding: 30px 10%;
    line-height: 28px;
    ol {
      list-style: decimal;
    }
    ul {
      list-style: disc;
    }
    ol,ul {
      margin-left: 20px;
    }
  }
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    color: $COLOR-MAIN1;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
