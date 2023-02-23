<template>
  <a-dropdown :trigger="['click']">
    <a
      class="btn__radius--primary--small d-inline-flex"
      href="#"
      @click="e => e.preventDefault()"
    >
      <img
        class="me-1"
        src="@/assets/button_download.svg"
        alt=""
      >
      <span>上傳格式/範例</span>
    </a>
    <a-menu slot="overlay">
      <a-menu-item
        v-for="(item, index) in demoList"
        :key="index"
      >
        <a
          href="javascript:;"
          @click="download(item.docId, item.fileName)"
        >{{ item.fileName }}</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import notification from '@/plugins/info/infoNotification';

@Component
export default class DemoExcelList extends Vue {
  demoList = null;

  download(id, name) {
  	this.$docsetApi.downloadNasFileForDocsetUsingPOST(id, { responseType: 'blob' })
  		.then((resp) => {
  			if (resp.status === 200) {
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
  					this.$docsetApi.downloadNasFileForDocsetUsingPOST(id)
  						.then((resp) => {
  							const respData = JSON.stringify(resp);
  							const apiErrorMsg = JSON.parse(respData).data.apiError;
  							notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  						}).catch((error) => {
  							console.log('error status = ', error);
  						}).finally();
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// console.log();
  		});
  }

  async created() {
  	await this.$uploadApi.batchUploadFormatExampleUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.demoList = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// console.log();
  		});
  }
}
</script>

<style lang="scss" scoped>
</style>
