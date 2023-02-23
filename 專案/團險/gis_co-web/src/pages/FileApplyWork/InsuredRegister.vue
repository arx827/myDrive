<template>
  <div class="BCcolor">
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div>
        <div class="query__title">
          投保名冊
        </div>
        <div class="card mx-auto">
          <div class="card-header text-center">
            保單號碼：{{ poliNum }}
          </div>
          <div class="card-body text-center">
            <p class="pt-4 mb-1">
              要保單位
            </p>
            <p class="fw-bold card-text">
              {{ unitName }}
            </p>
            <p class="pt-1 mb-1">
              保險期間
            </p>
            <p class="fw-bold card-text">
              {{ insurancePeriod }}
            </p>
            <p class="info__txt primary__txt mb-4">
              下載檔案含有個人資料，請妥善利用
            </p>
          </div>
        </div>
        <div class="block__btns text-center py-5 my-0">
          <button
            class="btn__radius--primary"
            @click="openModalPassword"
          >
            下載
          </button>
        </div>
        <img
          src="@/assets/image_hiMan.svg"
          alt=""
          class="image_hiMan"
        >
        <img
          src="@/assets/image_plant.svg"
          alt=""
          class="image_plant"
        >
      </div>
    </div>
    <ModalPassword
      :visible="ModalPasswordVisible"
      :form="formPassword"
      @submitPassword="downloadFile"
      @closeModal="closePasswordModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import { Modal } from 'ant-design-vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ModalPassword from '@/components/shared/form/ModalPassword.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb, ModalPassword } })
export default class InsuredRegister extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  poliNum = null; // 保單號碼

  unitName = null; // 要保單位

  insurancePeriod = null; // 保險期間

  ModalPasswordVisible = false;

  formPassword = {
  	password: null,
  }

  created() {
  	this.getUserInfo();
  }

  closePasswordModal() {
  	this.ModalPasswordVisible = false;
  }

  // 下載檔案
  downloadFile() {
  	this.setLoading(true);
  	this.ModalPasswordVisible = false;
  	const policyModel = this.$userInfo.getPolicyModel();
  	// 投保名冊-下載Excel
  	this.$rePrintDownloadApi.downloadInsuranceRegisterExcelUsingPOST(policyModel, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(
  	      resp.data as Blob,
  	      `投保名冊_${Number.parseInt(moment().format('YYYY')) - 1911}${moment().format('MMDD')}.xlsx`,
  			);
  				this.setLoading(false);
  			} else {
  				this.$rePrintDownloadApi.downloadInsuranceRegisterExcelUsingPOST(policyModel)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			this.setLoading(false);
  		})
  		.finally();
  }

  getUserInfo() {
  	this.setLoading(true);
  	const policyModel = this.$userInfo.getPolicyModel();
  	// 投保名冊-基本資料顯示
  	this.$rePrintDownloadApi.insuranceRegisterDetailUsingPOST(policyModel)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.poliNum = resp.data.data.poliNum;
  				this.unitName = resp.data.data.unitName;
  				this.insurancePeriod = resp.data.data.insurancePeriod;
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 打開密碼驗證彈窗
  openModalPassword() {
  	this.formPassword.password = null;
  	this.ModalPasswordVisible = true;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.BCcolor {
  background-color: #F2F8FF;
  position: relative;
}
.block__btns {
  padding-top: 80px;
  button {
    width: 150px;
    max-width: 100%;
    margin: 0 5px;
  }
}
.query__title {
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0;
}
.card {
  padding: 0;
  border-radius: 4px;
  opacity: 1;
  border: 1px solid #7CACD3;
  width: 536px;
  margin-bottom: 10px;
}
.card-header {
  color: white;
  background-color: #7CACD3;
  padding: 10px 0;
}
.card-text {
  font-size: 20px;
}
.image_hiMan {
  position: absolute;
  bottom: -76px;
  right: 130px;
  z-index: 1;
}
.image_plant {
  position: absolute;
  bottom: 0px;
  left: 130px;
}
</style>
