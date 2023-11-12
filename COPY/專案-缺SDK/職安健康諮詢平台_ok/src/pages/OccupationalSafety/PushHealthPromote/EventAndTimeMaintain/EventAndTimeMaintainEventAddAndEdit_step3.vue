<template>
  <div>
    <QuestSettinForm
      ref="QuestSettingFormComp"
      :data-source="itemList"
      @afterValidate="afterValidate"
    />

    <div class="btn__wrap text-center">
      <button
        class="btn__view btn__radius--primary--outline float-start"
        @click="handleValidate('saveTmp')"
      >
        暫存
      </button>
      <button
        class="btn__radius--primary--outline"
        @click="handlePrevStep"
      >
        上一步
      </button>
      <button
        class="btn__radius--primary"
        @click="handleValidate('submit')"
      >
        確定
      </button>
      <button
        class="btn__view btn__radius--primary--outline float-end"
        @click="handleValidate('preview')"
      >
        預覽
      </button>
    </div>

    <!-- 預覽 -->
    <EditRegisterPreviewModal
      :visible="previewModalVisible"
      :item-list="formData.questionnairesList"
      :placeholder="placeholder"
      @closeModal="handleCloseModal"
    />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import EditRegisterPreviewModal from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EditRegisterPreviewModal.vue';
import QuestSettinForm from '@/components/shared/servey-quest/QuestSettinForm.vue';
import QuestTypeBtn from '@/components/shared/servey-quest/QuestTypeBtn.vue';
import { HealthActCreateModel } from '@fubonlife/oss-api-axios-sdk';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({
	components: {
		EditRegisterPreviewModal, QuestSettinForm, QuestTypeBtn,
	},
})
export default class EventAndTimeMaintainEventAddAndEditStep3 extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */
	actId = null;

  previewModalVisible = false;

	prevData = null;

  // 預設的前五項
  itemList = [
  	{
  		title: '欲報名場次',
  		sort: 1,
  		type: 3,
  		optDescList: [],
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '報名人姓名',
  		sort: 2,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '部門/單位',
  		sort: 3,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '聯絡電話',
  		sort: 4,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  	{
  		title: '聯絡信箱',
  		sort: 5,
  		type: 1,
  		isAnswer: 'Y',
  		enabled: 'Y',
  		isFixed: true,
  	},
  ]

	placeholder = ['', 'e.g. 許亮亮', 'e.g. 系統整合部', 'e.g. 0918372888', '']

	formData: HealthActCreateModel = {};

  // 編輯 or 新增
  paramsType = '';

  /**
   * func
   */
  // mapping 成後端接受的資料型態
  mapToFormData(): HealthActCreateModel {
  	const { picture, fileName, ...prevFromData } = this.prevData;
  	return {
  		...prevFromData,
  		questionnairesList: this.itemList.map((item) => {
  			const {
  				optDescList, isFixed, ...other
  			} = item;
  			if (optDescList) {
  				return {
  					optDescList: optDescList.map((opt, idx) => ({
  						sort: idx + 1,
  						optionContent: (opt as any).content,
  						isDesc: opt.isDesc ? 'Y' : 'N',
  					})),
  					...other,
  				};
  			}
  			return {
  				...other,
  			};
  		}),
  	};
  }

  async setResultParam() {
  	const query = this.$global.getQuery();
  	this.actId = query.actId;
  	this.paramsType = this.$router.currentRoute.params.type;

  	if (this.paramsType == 'edit') {
  		await this.getActInfo();
  		await this.getSessionInfo();
  		await this.getQuesInfo();
  	}

  	// 判斷 session 有沒有資料
  	if (sessionStorage.getItem('form_step1')) {
  		this.prevData = JSON.parse(sessionStorage.getItem('form_step1'));
  	}
  	if (sessionStorage.getItem('form_step2')) {
  		this.prevData = { ...this.prevData, ...JSON.parse(sessionStorage.getItem('form_step2')) };
  		// 欲報名場次的選項從前頁帶入
  		this.itemList[0].optDescList = this.prevData.activitiesList.map((i) => {
  			const { sessionName, location } = i;
  			const type = i.type == 1 ? '實體場' : '線上場';
  			return {
  				isDesc: null,
  				content: sessionName ? `【${sessionName}_${type}】${location}` : location,
  			};
  		});
  	}
  }

  // API: 查詢單一健康促進活動API
  async getActInfo() {
  	this.setLoading(true);
  	await this.$PHPRpnEventSessionMaintainApi.getOneHealthActRpnUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const {
  					edmBannerFileName, ...other
  				} = resp.data.data;
  				this.prevData = {
  					fileName: edmBannerFileName,
  					...other,
  				};
  			} else {
  				const getError = resp.data;
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  					apiError: getError.apiError,
  				});
  				this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  			this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢場次資訊API
  async getSessionInfo() {
  	this.setLoading(true);
  	await this.$PHPRpnEventSessionMaintainApi.getHealthActSessionDetailUsingPOST(this.actId)
  	.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				// TEST:
  				// console.log(getData);

  				// 題項1的選項
  				if (getData.length > 0) {
  					this.itemList[0].optDescList = getData.map((i) => {
  						const { sessionName, location, sessionType } = i;
  						const type = sessionType == 1 ? '實體場' : '線上場';
  						return {
  							isDesc: null,
  							content: sessionName ? `【${sessionName}_${type}】${location}` : location,
  						};
  					});
  				}

  				// prevData 組合場次資訊
  				const filterActivitiesList = [];
  				getData.forEach((obj) => {
  					filterActivitiesList.push({
  						location: obj.location,
  						maxCount: obj.maxCount,
  						minCount: obj.minCount,
  						sessionName: obj.sessionName,
  						type: obj.sessionType,
  						wbInfoId: obj.wbInfoId,
  					});
  				});
  				Object.assign(this.prevData, { activitiesList: filterActivitiesList });
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢健康促進活動問卷-編輯活動場次使用
  async getQuesInfo() {
  	this.setLoading(true);
  	await this.$PHPRpnEventSessionMaintainApi.getHealthActQuestForModifyUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const getData = JSON.parse(JSON.stringify(resp.data.data));
  				if (getData.length > 0) {
  					this.itemList = getData.map((item, index) => {
  						const { optDescList, ...otherData } = item;
  						return {
  							isFixed: index < 5 || false,
  							optDescList: optDescList.map((i) => ({
  								isDesc: null,
  								content: i.optionContent,
  							})),
  							...otherData,
  						};
  					});
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 暫存健康促進活動 API
  saveTemp() {
  	const file = this.$customUpload.dataURLtoFile(this.prevData.picture, this.prevData.fileName);
  	// console.log(file);
  	this.setLoading(true);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.HEALTHTPUSHTEMPSAVE,
  		'healthActCreateModel',
  		this.formData,
  		'file',
  		[file],
  		(resp) => {
  			this.$infoNotification.success({
  				content: '已成功暫存。',
  			});
  		},
  		(msg) => {
  			this.$infoNotification.error({ content: this.$global.getApiErrorMsg(msg).join('') });
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
  	// this.setLoading(true);
  	// this.$PHPRpnEventSessionMaintainApi.saveTempHealthActWithPictureUsingPOST(this.formData)
  	// 	.then((resp) => {
  	// 		if (resp.data.status == 200) {
  	// 			this.prevData.filePath = resp.data.data.filePath;
  	// 			this.$infoNotification.success({
  	// 				content: '已成功暫存。',
  	// 			});
  	// 		} else {
  	// 			const getError = resp.data;
  	// 			this.$infoNotification.error({
  	// 				content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成暫存項目，請再次嘗試。',
  	// 			});
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 		this.$infoNotification.error({
  	// 			content: '無法完成暫存項目，請再次嘗試。',
  	// 		});
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // API: 儲存健康促進活動 API
  saveWithPicture() {
  	const file = this.$customUpload.dataURLtoFile(this.prevData.picture, this.prevData.fileName);
  	// console.log(file);
  	this.setLoading(true);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.HEALTHPUSHSAVE,
  		'healthActCreateModel',
  		this.formData,
  		'file',
  		[file],
  		(resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'EventAndTimeMaintainEventAddAndEditStep4',
  				params: this.paramsType,
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
  					msg: resp.data.status === 200 ? undefined : resp.data?.apiError && this.$global.getApiErrorMsg(resp.data.apiError).join('、'),
  				},
  			});
  		},
  		(msg) => {
  			this.$infoNotification.error({ content: this.$global.getApiErrorMsg(msg).join('') });
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
  	// this.setLoading(true);
  	// this.$PHPRpnEventSessionMaintainApi.saveHealthActWithPictureUsingPOST(this.formData)
  	// 	.then((resp) => {
  	// 		this.$global.changeRouterAndaddParam({
  	// 			toRouter: 'EventAndTimeMaintainEventAddAndEditStep4',
  	// 			params: this.paramsType,
  	// 			query: {
  	// 				result: resp.data.status === 200 ? 'success' : 'fail',
  	// 				msg: resp.data.status === 200 ? undefined : resp.data?.apiError && this.$global.getApiErrorMsg(resp.data.apiError).join('、'),
  	// 			},
  	// 		});
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 		this.$infoNotification.error({
  	// 			content: '無法完成儲存項目，請再次嘗試。',
  	// 		});
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  /**
   * Event
   */
  // 檢核
  handleValidate(action: 'submit'| 'preview'| 'saveTmp') {
  	(this.$refs.QuestSettingFormComp as any).validateForm(action);
  }

  afterValidate({ action, questionList }) {
  	this.itemList = JSON.parse(JSON.stringify(questionList));
  	this.formData = this.mapToFormData();
  	// TEST:
  	// console.log(this.formData);
  	switch (action) {
  	case 'submit':
  		this.saveWithPicture();
  		break;
  	case 'preview':
  		this.previewModalVisible = true;
  		break;
  	case 'saveTmp':
  		this.saveTemp();
  	}
  }

  // 點擊按鈕，『上一步』
  handlePrevStep() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep2',
  		params: {
  			type: this.paramsType,
  		},
  		query: { actId: this.actId },
  	});
  }

  handleCloseModal() {
  	this.previewModalVisible = false;
  }

  /**
   * Hook
   */
  async created() {
  	this.$emit('changeParent', { step: 3, pageTitle: null });
  	this.setResultParam();
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>
.event__wrap {
  margin-top: 20px;
  padding: 30px 92px;
  border-radius: 10px;
}
.btn__wrap {
  margin: 50px 0;
  button {
    width: 200px;
    max-width: 100%;
    margin: 0 5px;
  }
  .btn__view {
    width: 100px;
    margin: 0;
  }
}

.btn__icon--white {
  color: $COLOR-WHITE;
  &.draggable__icon {
    display: block;
    padding: 5px 0px;
  }
}
</style>
