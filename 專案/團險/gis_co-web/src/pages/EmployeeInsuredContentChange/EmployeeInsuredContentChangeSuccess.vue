<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultSuccess
      :files="files"
      @clickFile="clickFile"
    >
      <template v-slot:body>
        <p
          class="info__txt primary__txt fw-bold"
        >
          員工：{{ empName }}
        </p>
        <div class="fw-bold">
          被保險人姓名
        </div>
        <div>{{ insName }}</div>
        <div v-if="message">
          <hr>
          <div class="content__title">
            檢核訊息
          </div>
          <div class="content__msg">
            {{ message }}
          </div>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/index">
          <a
            class="btn__radius--primary--outline me-1"
            href="#"
          >返回首頁</a>
        </router-link>
        <router-link to="/empFamilyPolicyChange">
          <a
            class="btn__radius--primary ms-1"
            href="#"
          >繼續變更</a>
        </router-link>
      </template>
    </ResultSuccess>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultSuccess from '@/components/shared/layout/ResultSuccess.vue';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb, ResultSuccess } })
export default class Success extends Vue {
  @Prop()
  breadcrumb: {}

  empName = ''; // 員工姓名

  insName = ''; // 被保人姓名

  files = []; // 需補檔案

  message = null; // 檢核訊息

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.empName = query.empName;
  	this.insName = query.insName;
  	this.message = query.message;
  	if (query.file.hlNtcDocId !== null) {
  		this.files.push(
  		{ name: query.file.hlNtcDocFileName, id: query.file.hlNtcDocId },
  	);
  	}
  	if (query.file.disNtcDocId !== null) {
  		this.files.push(
  		{ name: query.file.disNtcDocFileName, id: query.file.disNtcDocId },
  	);
  	}
  }

  clickFile(pdf) {
    	this.$docsetApi.downloadNasFileForDocsetUsingPOST(pdf.id, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(resp);
  			let filename = '';
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				if (disposition.indexOf('attachment') !== -1) {
  				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  				const matches = filenameRegex.exec(disposition);
  				if (matches != null && matches[1]) {
  					filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  				}
  			}
  			this.$blobUtils.download(
          resp.data as Blob,
          filename,
          resp.headers['content-type'],
  			);
  			} else {
  				this.$docsetApi.downloadNasFileForDocsetUsingPOST(pdf.id)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally();
  			}
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.other__title {
  font-size: 14px;
  margin-bottom: 13px;
}
.result__wrap {
  padding: 40px 0;
}
.result__title {
  color: #000000;
  font-weight: 600;
  font-size: 18px;
  margin: 10px 0;
}
.result__body {
  background-color: #F2F8FF;
  padding: 25px 38px;
  border-radius: 4px;
  width: 536px;
  margin: auto;
}
.content__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}
.result__footer {
  margin-top: 80px;
}
hr {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
</style>
