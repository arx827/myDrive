<template>
  <a-modal
    v-model="modalVisible"
    :centered="true"
    :closable="true"
    :footer="null"
    width="45%"
    @cancel="handleClose(false)"
  >
    <div class="previewModal__wrap">
      <h2 class="modal__title">
        {{ modalTitle }}
      </h2>
      <h2 class="modal__title">
        簽到 QR code
      </h2>
      <div class="modal__content">
        <img
          class="img-fluid mt-3"
          :src="pic"
        >
      </div>
      <div class="modal__btn__wrap btn__wrap">
        <button
          class="btn__radius--primary--outline"
          @click="handleClose(false)"
        >
          關閉
        </button>
        <button
          class="btn__radius--primary"
          @click="handleDownload()"
        >
          下載
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, Emit,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { HealthActQrCodeModel } from '@fubonlife/oss-api-axios-sdk';

@Component({})
export default class StaffQueryModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible!: boolean

  @Prop()
  modalInfo

	modalVisible = false

  modalTitle = ''

  pic = null

  actId = null

  sessionId = null

  // API: 下載健康促進活動QrCode
  fetchDownload() {
  	const search: HealthActQrCodeModel = {
  		actId: this.actId,
  		sessionId: this.sessionId,
  	};
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.downloadQrCodeUsingPOST(search, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
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
  				this.$PHPRpnEventSessionMaintainApi.downloadQrCodeUsingPOST(search)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					})
  					.finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  handleDownload() {
  	this.fetchDownload();
  }

  handleClose() {
  	this.$emit('closeModal');
  }

  @Watch('visible')
  visibleChange(val) {
  	this.modalVisible = val;
  }

  @Watch('modalInfo')
  modalInfoChange(val) {
  	const {
  		sessionName, sessionType, location, qrCode, actId, sessionId,
  	} = val;
  	this.pic = qrCode;
  	this.actId = actId;
  	this.sessionId = sessionId;
  	const type = sessionType == 1 ? '實體場' : '線上場';
  	this.modalTitle = sessionName ? `【${sessionName}${type}_${location}】` : location;
  }
}
</script>

<style lang="scss" scoped>
.previewModal__wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal__content {
  margin-top: 10px;
}

::v-deep {
  .ant-modal{
    margin-top: 80px;
  }
	 button.ant-modal-close{
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
		background-color: #23C4A8;
		width: 44px;
		height: 44px;
		border-radius: 50vh;
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			font-size: 18px;
    	color: #ffffff;
			font-weight: bold;
		}
	}

	.ant-modal-body{
    padding: 20px 45px;
		@include rwd-lg{
      padding: 40px 92px;
    }
	}

  .modal__title{
		color: #000000;
		font-size: 30px;
		font-weight: bold;
    margin-bottom: 0;
	}

	.modal__btn__wrap{
		display: flex;
		justify-content: center;
    margin: 20px 0 0 0;
    gap: 10px;
    @include rwd-lg{
      margin:40px 0 0 0;
    }
	}
}
</style>
