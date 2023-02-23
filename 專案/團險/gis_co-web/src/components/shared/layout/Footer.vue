<template>
  <footer
    :class="{'footer--shadow': currentRouterName === 'index'}"
  >
    <img
      v-if="currentRouterName === 'index'"
      class="index__footer--right"
      src="@/assets/index/image_bottomCat.svg"
      alt=""
    >
    <img
      v-if="currentRouterName === 'index'"
      class="index__footer--left"
      src="@/assets/index/image_bottomGrass.svg"
      alt=""
    >
    <div class="w-100">
      <div class="text-center">
        <ul class="footer__menu">
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/Investors/public-info/fubon/public/"
            >公開揭露資訊</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/BF2D481A7477466F91C1238212D38D64/fairdealing/history/"
            >公平待客原則</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/statement/privacy/life-privacy/"
            >隱私權聲明</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.ib.gov.tw/ch/"
            >主管機關相關連結</a>
          </li>
          <li>
            <a
              href="#"
              @click.prevent="downloadPdf"
            >保險業經營電子商務自律規範</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/statement/C083EB0A88DF458C979B82DBE0C8A2FF/"
            >防制洗錢及打擊資恐專區</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/statement/privacy/web-privacy/"
            >網站隱私權聲明</a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.fubon.com/life/statement/privacy/data-privacy/"
            >個資保護聲明</a>
          </li>
        </ul>
      </div>
      <div class="footer__copyright text-center">
        建議瀏覽器版本：最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import infoNotification from '@/plugins/info/infoNotification';

@Component
export default class Footer extends Vue {
  @Action('setLoading') setLoading;

  // 當前router名稱
  currentRouterName = this.$route.name;

  @Watch('$route.name')
  onRouterChanged(val) {
  	this.currentRouterName = val;
  }

  downloadPdf() {
  	this.$homeNoticeApi.downloadUserManualUsingPOST('EC_SELF_REGULATION', { responseType: 'blob' })
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
  				this.setLoading(false);
  			} else {
  				this.$homeNoticeApi.downloadUserManualUsingPOST('EC_SELF_REGULATION')
  		    .then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						infoNotification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally(() => {
  			        this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log(error);
  		});
  }

  mounted() {
  	this.currentRouterName = this.$route.name;
  }
}
</script>

<style lang="scss" scoped>
footer {
  background: #DFE6EC;
  padding: 16px 0;
  position: relative;
}
.footer--shadow{
  box-shadow: 0px -4px 6px rgba(0, 0, 0, 0.1);
}
.footer__menu {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 2px;
    display: flex;
    justify-content: center;
    li {
        display: inline-flex;
        &::before, &:last-child::after{
            content: '|';
            display: inline-block;
            vertical-align: middle;
            padding: 0 5px;
            margin-top: -2px;
        }
        a {
            color: #000000;
            display: inline-block;
            vertical-align: middle;
            &:hover {
              color: #4CAAF5;
              text-decoration: underline;
            }
        }
    }
}
.footer__copyright {
    color: #000000;
    font-size: 12px;
}
.index__footer--right{
  position: absolute;
  right: 0px;
  bottom: 0;
  z-index: 1000;
  width: 15.7%;
  max-width: 215px;
}
.index__footer--left{
  position: absolute;
  left: 17px;
  bottom: 33px;
  z-index: 1000;
  width: 8.9%;
  max-width: 122px;
}
</style>
