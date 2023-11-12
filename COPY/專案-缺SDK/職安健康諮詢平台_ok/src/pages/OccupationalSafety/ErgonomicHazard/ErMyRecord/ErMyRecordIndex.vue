<template>
  <div class="container">
    <div class="page__title">
      我的填寫紀錄
    </div>
    <div class="banner">
      <img src="~@images/image_threePeople.svg">
    </div>
    <div
      v-if="dataList.length != 0"
      class="data__container"
    >
      <div class="row">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="col-sm-4 col-12 mb-3"
        >
          <div class="data__container__block">
            <div class="data__container__block__header d-flex justify-content-between">
              <div class="data__container__block__header__time">
                執行時間：&nbsp;{{ item.execDt }}
              </div>
              <div class="download__block d-flex justify-content-center align-items-center">
                <a-icon
                  type="download"
                  theme="outlined"
                  @click="download(item.caseId, item.formName)"
                />
              </div>
            </div>
            <div class="data__container__block__content">
              <div
                class="data__container__block__content__title"
                @click="openModal(item.formTitle, item.recordId)"
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
    <QaModal
      :visible="qaModalVisible"
      :record-id="recordId"
      @closeQaModal="closeQaModal"
    />
    <MuscleModal
      :visible="muscleModalVisible"
      :record-id="recordId"
      @closeMuscleModal="closeMuscleModal"
    />
    <DescModal
      :visible="descModalVisible"
      :record-id="recordId"
      @closeDescModal="closeDescModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { UserQueryModel, HfeFormRecordDownloadDto } from '@fubonlife/oss-api-axios-sdk';
import QaModal from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/qaModal.vue';
import MuscleModal from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/muscleModal.vue';
import DescModal from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/descModal.vue';
import moment from 'moment';

@Component({ components: { QaModal, MuscleModal, DescModal } })
export default class MotherMyRecordIndex extends Vue {
  @Action('setLoading') setLoading;

  // 表單資料
  dataList = []

  // 人因性危害預防計畫問卷控制
  qaModalVisible = false;

  // 自覺肌肉骨骼不適症狀調查控制
  muscleModalVisible = false;

  // 症狀及病史說明控制
  descModalVisible = false;

  // recordId
  recordId: number = null;

  getData() {
  	const userData: UserQueryModel = {
  		userId: this.$user.getMe().userId,
  		// userId: 3, // 測試用
  	};
  	this.setLoading(true);
  	this.$EhEmpFormRecordControllerApi.queryPersonalFormRecordUsingPOST(userData)
  		.then((resp) => {
  			if (resp.data.data !== null) {
  				this.dataList = resp.data.data;
  				this.dataList.forEach((item, index) => {
  					if (item.formName === 'F0201') {
  						this.$set(item, 'formTitle', '人因性危害預防計畫問卷');
  					} else if (item.formName === 'F0202') {
  						this.$set(item, 'formTitle', '自覺肌肉骨骼不適症狀調查');
  					} else if (item.formName === 'F0203') {
  						this.$set(item, 'formTitle', '症狀及病史說明');
  					}
  					item.execDt = item.execDt !== null ? moment(item.execDt).format('YYYY/MM') : null;
  					// 刪除七年前之資料
  					const nowYear = new Date().getFullYear();
  					if (item.execDt !== null) {
  						const itemYear = parseInt(item.execDt.slice(0, 4));
  						if (itemYear < (nowYear - 7)) {
  							this.dataList.splice(index, 1);
  						}
  					}
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status= ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	// this.dataList = [
  	// 	{
  	// 		executeTime: '2022/6',
  	// 		formTitle: '人因性危害預防計畫問卷',
  	// 		formNo: '202200610001',
  	// 	},
  	// 	{
  	// 		executeTime: '2022/7',
  	// 		formTitle: '自覺肌肉骨骼不適症狀調查',
  	// 		formNo: '202200610002',
  	// 	},
  	// 	{
  	// 		executeTime: '2022/8',
  	// 		formTitle: '症狀及病史說明',
  	// 		formNo: '202200610003',
  	// 	},
  	// 	{
  	// 		executeTime: '2022/6',
  	// 		formTitle: '人因性危害預防計畫問卷',
  	// 		formNo: '202200610001',
  	// 	},
  	// 	{
  	// 		executeTime: '2022/7',
  	// 		formTitle: '自覺肌肉骨骼不適症狀調查',
  	// 		formNo: '202200610002',
  	// 	},
  	// 	{
  	// 		executeTime: '2022/8',
  	// 		formTitle: '症狀及病史說明',
  	// 		formNo: '202200610003',
  	// 	},
  	// ];
  }

  download(caseId, formName) {
  	this.setLoading(true);
  	const downloadData: HfeFormRecordDownloadDto = {
  		caseId,
  		formName,
  	};
  	this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.loF02UsingPOST(downloadData, { responseType: 'blob' })
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
  				this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.loF02UsingPOST(downloadData)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					}).finally(() => {
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

  openModal(formTitle, recordid) {
  	if (formTitle === '人因性危害預防計畫問卷') {
  		this.qaModalVisible = true;
  		this.recordId = recordid;
  	} else if (formTitle === '自覺肌肉骨骼不適症狀調查') {
  		this.muscleModalVisible = true;
  		this.recordId = recordid;
  	} else if (formTitle === '症狀及病史說明') {
  		this.descModalVisible = true;
  		this.recordId = recordid;
  	}
  }

  closeQaModal() {
  	this.qaModalVisible = false;
  }

  closeMuscleModal() {
  	this.muscleModalVisible = false;
  }

  closeDescModal() {
  	this.descModalVisible = false;
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
