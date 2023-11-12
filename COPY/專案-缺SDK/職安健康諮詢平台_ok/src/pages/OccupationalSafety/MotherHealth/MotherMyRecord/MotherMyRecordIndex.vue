<template>
  <div class="container">
    <div class="page__title">
      我的填寫紀錄
    </div>
    <div class="banner">
      <img src="~@images/image_threePeople.svg">
    </div>
    <div
      v-if="dataList.length!=0"
      class="data__container"
    >
      <div class="row">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="col-lg-4 col-12 mb-3"
        >
          <div class="data__container__block">
            <div class="data__container__block__header d-flex justify-content-between">
              <div class="data__container__block__header__time">
                執行時間：&nbsp;{{ item.executeTime }}
              </div>
              <div class="download__block d-flex justify-content-center align-items-center">
                <a-icon
                  type="download"
                  theme="outlined"
                  @click="download(item.formId, item.caseId)"
                />
              </div>
            </div>
            <div class="data__container__block__content">
              <div
                class="data__container__block__content__title"
                @click="getFormDetail(item)"
              >
                {{ item.formTitle }}
              </div>
              <div class="data__container__block__content__formNo d-flex justify-content-between">
                <div class="data__container__block__content__formNo__number">
                  {{ item.formNo }}
                </div>
                <div class="data__container__block__content__formNo__title">
                  表單編號
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="data__container__none"
    >
      無填寫紀錄
    </div>
    <RecordModal
      :form-title="formTitle"
      :visible="formModalVisible"
      :form-input="formInput"
      @closeFormModal="closeFormModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import RecordModal from '@/pages/OccupationalSafety/MotherHealth/MotherMyRecord/RecordModal.vue';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: { RecordModal } })
export default class MotherMyRecordIndex extends Vue {
  @Action('setLoading') setLoading;

  // 表單資料
  dataList = []

  // 表單彈窗控制
  formModalVisible = false

  // 選定表單標題
  formTitle = null

  // 選定表單資訊
  formInput = null

  // 取得表單列表
  getData() {
  	this.setLoading(true);
  	this.$MONPLANEmpFormApi.myFormListEUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				// this.initFormData = resp.data.data;
  				this.dataList = resp.data.data.map((e) => ({
  					executeTime: moment(e.createCaseDate).format('YYYY/MM/DD'),
  					formTitle: e.formName,
  					formNo: e.formNo,
  					caseId: e.caseId,
  					pregnantCategoryEnum: e.pregnantCategoryEnum,
  					formId: e.formId,
  				}));
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取得表單資訊
  getFormDetail(data) {
  	console.log(data);
  	this.formTitle = data.formTitle;
  	this.formInput = {
  		caseId: data.caseId,
  		formNo: data.formId,
  		pregnantCategoryEnum: data.pregnantCategoryEnum,
  	};
  	this.openModal();
  }

  clearFormDetail() {
  	this.formTitle = null;
  	this.formInput = null;
  }

  // 下載表單文件
  download(formId, caseId) {
  	this.setLoading(true);
  	this.$MONPLANEmpFormApi.exportFormUsingPOST({ formId, caseId }, { responseType: 'blob' })
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
  				this.$MONPLANEmpFormApi.exportFormUsingPOST({ formId, caseId })
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  openModal() {
  	this.formModalVisible = true;
  }

  closeFormModal() {
  	this.formModalVisible = false;
  	this.clearFormDetail();
  }

  created() {
  	this.getData();
  }
}
</script>

<style lang="scss" scoped>
  .banner {
    width: 100%;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .data__container {
    margin-top: 20px;
    margin-bottom: 40px;
    .data__container__block {
      .data__container__block__header {
        background-color: #24C7A7;
        border-radius: 6px 6px 0px 0px;
        padding: 16px 16px;
        .data__container__block__header__time {
          color: white;
          font-size: 20px;
          font-weight: $TEXT-BOLD;
        }
      }
      .data__container__block__content {
        padding: 20px 16px;
        border-radius: 0px 0px 6px 6px;
        border-left: 0.5px solid #D1D1D1;
        border-right: 0.5px solid #D1D1D1;
        border-bottom: 0.5px solid #D1D1D1;
        .data__container__block__content__title {
          text-decoration: underline;
          font-size: 20px;
          cursor: pointer;
          margin-bottom: 40px;
          &:hover {
            font-weight: $TEXT-BOLD;
          }
        }
        .data__container__block__content__formNo {
          font-size: 16px;
          color: #9A9A99;
        }
      }
    }
  }
  .data__container__none {
    border: 0.5px solid #D1D1D1;
    border-radius: 6px;
    text-align: center;
    color: #9A9A99;
    margin-top: 20px;
    margin-bottom: 40px;
    padding-top: 65px;
    padding-bottom: 65px;
    font-size: 20px;
  }
  ::v-deep {
    .download__block{
      width: 46px;
      height: 32px;
      background-color: $COLOR-MAIN10;
      border-radius: 16px;
      color: $COLOR-MAIN1;
      .anticon svg {
        font-size: 24px;
      }
    }
  }
</style>
