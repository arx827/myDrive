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
          class="col-md-4 col-12 mb-3"
        >
          <div class="data__container__block">
            <div class="data__container__block__header d-flex justify-content-between">
              <div class="data__container__block__header__time">
                執行時間：&nbsp;{{ item.dataMonth }}
              </div>
              <div class="download__block d-flex justify-content-center align-items-center">
                <a-icon
                  type="download"
                  theme="outlined"
                  @click="download(item.recordId, item.formType)"
                />
              </div>
            </div>
            <div class="data__container__block__content d-flex flex-column justify-content-between">
              <div
                class="data__container__block__content__title"
                @click="openModal(item.formType, item.recordId)"
              >
                {{ item.formType }}
              </div>
              <div class="data__container__block__content__formNo d-flex justify-content-between">
                <div class="data__container__block__content__formNo__number">
                  {{ item.formId }}
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
    <LoadModal
      :visible="loadModalVisible"
      :record-id="recordId"
      @closeLoadModal="closeLoadModal"
    />
    <YearModal
      :visible="yearModalVisible"
      :record-id="recordId"
      @closeYearModal="closeYearModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import LoadModal from '@/pages/OccupationalSafety/StrangePrevent/StrangeMyRecord/LoadModal.vue';
import YearModal from '@/pages/OccupationalSafety/StrangePrevent/StrangeMyRecord/YearModal.vue';
import { EmpRecordDto, EmpCiIdDto, CiIdDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: { LoadModal, YearModal } })
export default class MotherMyRecordIndex extends Vue {
  @Action('setLoading') setLoading;

  uid = null;

  // 表單資料
  dataList: EmpRecordDto[] = [];

  // 表單uid
  empdata: EmpCiIdDto = {}

  // downloadData
  downLoadData: CiIdDto = {};

  // 職業壓力過負荷評估量表控制
  loadModalVisible = false;

  // 十年內心血管疾病發病風險評估量表控制
  yearModalVisible = false;

  // recordId
  recordId: number = null;

  getData() {
  	this.setLoading(true);
  	this.$AlEmpAlCaseRecordInquireControllerApi.getRecordUsingPOST(this.empdata)
  		.then((resp) => {
  			console.log(resp);
  			this.dataList = resp.data.data;
  			this.dataList.forEach((item, index) => {
  				if (item.formType === 'E0401') {
  					item.formType = '職業壓力過負荷評估量表';
  				} else if (item.formType === 'E0402') {
  					item.formType = '十年內心血管疾病發病風險評估量表';
  				}
  				// 刪除七年前之資料
  				item.dataMonth = `${item.dataMonth.slice(0, 4)}/${item.dataMonth.slice(4)}`;
  				const nowYear = new Date().getFullYear();
  				const itemYear = parseInt(item.dataMonth.slice(0, 4));
  				if (itemYear < (nowYear - 7)) {
  					this.dataList.splice(index, 1);
  				}
  			});
  			console.log(this.dataList);
  		})
  		.catch((error) => {
  			console.log('error status=', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  download(recordid, recordTitle) {
  	this.downLoadData = {
  		recordId: [recordid], // 負荷評估量表測試須改為[24]
  		uid: this.uid,
  	};
  	if (recordTitle === '職業壓力過負荷評估量表') {
  		this.$AlEmpAlCaseRecordInquireControllerApi.downloadOslasPdfUsingPOST(this.downLoadData, { responseType: 'blob' })
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
  					this.$AlEmpAlCaseRecordInquireControllerApi.downloadOslasPdfUsingPOST(this.downLoadData)
  						.then((resp) => {
  							const respData = JSON.stringify(resp);
  							const apiErrorMsg = JSON.parse(respData).data.apiError;
  							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  						}).catch((error) => {
  							console.log(error);
  						}).finally(() => {
  							this.setLoading(false);
  						});
  				}
  			console.log(resp);
  		})
  		.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	} else if (recordTitle === '十年內心血管疾病發病風險評估量表') {
  		this.$AlEmpAlCaseRecordInquireControllerApi.downloadFrstPdfUsingPOST(this.downLoadData, { responseType: 'blob' })
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
  					this.$AlEmpAlCaseRecordInquireControllerApi.downloadFrstPdfUsingPOST(this.downLoadData)
  						.then((resp) => {
  							const respData = JSON.stringify(resp);
  							const apiErrorMsg = JSON.parse(respData).data.apiError;
  							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  						}).catch((error) => {
  							console.log(error);
  						}).finally(() => {
  							this.setLoading(false);
  						});
  				}
  			console.log(resp);
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
  }

  openModal(formTitle, recordid) {
  	if (formTitle === '職業壓力過負荷評估量表') {
  		this.loadModalVisible = true;
  		this.recordId = recordid;
  	} else if (formTitle === '十年內心血管疾病發病風險評估量表') {
  		this.yearModalVisible = true;
  		this.recordId = recordid;
  	}
  }

  closeLoadModal() {
  	this.loadModalVisible = false;
  }

  closeYearModal() {
  	this.yearModalVisible = false;
  }

  created() {
  	this.uid = this.$user.getMe().userId;
  	this.empdata = {
  		uid: this.uid,
  	};
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
        height: 116px;
        @include rwd-lg {
          height: 130px;
        }
        .data__container__block__content__title {
          text-decoration: underline;
          font-size: 20px;
          cursor: pointer;
          // margin-bottom: 40px;
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
