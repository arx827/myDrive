<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        {{ paramsType }}滿意度問卷
      </div>
    </div>
    <div class="event__wrap bg__light">
      <a-form-model
        ref="questForm"
        class="questForm"
        :model="form"
        :rules="formRules"
        layout="vertical"
      >
        <div class="event__block">
          <a-form-model-item
            prop="imgData"
            label="滿意度問卷Banner"
          >
            <div>
              <a-upload-dragger
                name="file"
                accept="image/jpeg, image/png, image/gif,"
                :file-list="uploadedFileList"
                :custom-request="uploadFlie"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  選擇欲上傳資料：點擊或將文件拖曳到這裡上傳
                </p>
                <p class="ant-upload-hint">
                  最佳尺寸建議：寬1088＊高285，每張大小限制不超過3MB，限上傳 jpg、png、gif 格式。
                </p>
              </a-upload-dragger>
              <div
                :class="form.imgData?'form__img mt-3':'mt-3'"
                :style="`background-image:url(${form.imgData})`"
              />
            </div>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <a-form-model-item
            prop="questDesc"
            label="問卷文案"
          >
            <div class="block__content">
              <vue-editor
                v-model="form.questDesc"
                :editor-toolbar="customToolbar"
              />
            </div>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <a-form-model-item
            prop="personalInfoStatement"
            label="個資聲明文案"
          >
            <div class="block__content">
              <vue-editor
                v-model="form.personalInfoStatement"
                :editor-toolbar="customToolbar"
              />
            </div>
          </a-form-model-item>
        </div>
      </a-form-model>
    </div>
    <QuestSettinForm
      ref="QuestSettingFormComp"
      :data-source="editQuestDto"
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
        @click="handleCancel"
      >
        取消
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
    <PreviewModal
      :visible="visible"
      :item-list="editQuestDto"
      :pic="form.imgData"
      :quest-desc="form.questDesc"
      :personal-info-statement="form.personalInfoStatement"
      @closeModal="handleCloseModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueEditor, Quill } from 'vue2-editor';
import TodoButton from '@compononts/to-do/TodoButton.vue';
import PreviewModal from '@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/PreviewModal.vue';
import QuestSettinForm from '@/components/shared/servey-quest/QuestSettinForm.vue';
import QuestTypeBtn from '@/components/shared/servey-quest/QuestTypeBtn.vue';
import { HealthActSatisfyQuestTopicSingleDto,	HealthQuerySatisfyQuestSingleDto, HealthSatisfyQuestSaveDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import InfoModal from '@/plugins/notification/infoModal';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({
	components: {
		VueEditor, TodoButton, PreviewModal, QuestSettinForm, QuestTypeBtn,
	},
})
export default class SatisfyQuestMaintainAddAndEdit extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */

	myModal = document.getElementById('previewModal');

	type = 'add'

	// 滿意度問卷版本
	version

	// 滿意度問卷Id
	satisfyQuestId=0

  paramsType = '';

  paramsTypeEnum = [
  	{
  		key: 'edit',
  		val: '編輯',
  	},
  	{
  		key: 'add',
  		val: '新增',
  	},
  ]

	// 圖片名
	fileName: string=''

	// 圖片路徑
	filePath: string=''

	// 矩陣題
	matrixTopic = {
		optDescList: [],
		type: 7,
		weightingList: [],
		title: '',
		isAnswer: '',
		enabled: '',
		sort: null,
	}

	// 儲存格式
	saveDto: HealthSatisfyQuestSaveDto = {}

	// 問卷編輯格式
	editQuestDto = []

	// 新增問卷預設題目
	initDto = [
		{
			title: '一、基本資料填寫(不會有題號和必選，再下一題的題號是1)',
			type: 0,
			sort: null,
			enabled: 'Y',
		},
		{
			title: '姓名',
			type: 1,
			sort: 1,
			enabled: 'Y',
			isAnswer: 'Y',
		},
		{
			title: '性別',
			type: 3,
			optDescList: [
				{ content: '男' },
				{ content: '女' },
			],
			sort: 2,
			enabled: 'Y',
			isAnswer: 'Y',
		},
		{
			title: '您的年齡',
			type: 3,
			optDescList: [
				{ content: '21-25歲' },
				{ content: '26-30歲' },
				{ content: '31-35歲' },
				{ content: '36-40歲' },
				{ content: '41-45歲' },
				{ content: '46-50歲' },
				{ content: '51-55歲' },
				{ content: '55歲以上' },
			],
			isAnswer: 'Y',
			sort: 3,
			enabled: 'Y',
		},
		{
			title: '身分屬性',
			type: 3,
			optDescList: [
				{ content: '富邦人壽內勤同仁' },
				{ content: '富邦人壽外勤同仁' },
			],
			sort: 4,
			enabled: 'Y',
			isAnswer: 'Y',
		},
		{
			title: '二、資訊來源',
			type: 0,
			sort: 0,
			enabled: 'Y',
		},
		{
			title: '得知講座的管道(可複選)',
			type: 4,
			optDescList: [
				{ content: '富邦人壽同仁' },
				{ content: 'EDM線上行銷廣告' },
				{ content: '公告' },
				{ content: '其他', isDesc: true },
			],
			sort: 5,
			enabled: 'Y',
			isAnswer: 'Y',
		},
		{
			title: '三、報名原因',
			type: 0,
			sort: 0,
			enabled: 'Y',
		},
		{
			title: '報名講座的原因(可複選)',
			type: 4,
			optDescList: [
				{ content: '講座題目吸引人' },
				{ content: '對講座內容有需求' },
				{ content: '主講者的專業' },
				{ content: '主講者的知名度' },
				{ content: '講座完全免費' },
				{ content: '其他', isDesc: true },
			],
			sort: 6,
			enabled: 'Y',
		},
		{
			title: '四、您對今日講座滿意度',
			type: 7,
			sort: 0,
			enabled: 'Y',
			isAnswer: 'Y',
			optDescList: [
				{
					content: '測試滿意度題目對於主講者整體表現的滿意程度，您覺得',
				},
				{
					content: '測試滿意度題目對於議題內容深淺程度及適用性，您覺得',
				},
				{
					content: '測試滿意度題目對於主講者整體表現的滿意程度，您覺得',
				},
				{
					content: '測試滿意度題目對於議題內容深淺程度及適用性，您覺得',
				},
			],
			weightingList: [
				{ content: '非常不滿意', id: '1' },
				{ content: '不滿意', id: '2' },
				{ content: '普通', id: '3' },
				{ content: '滿意', id: '4' },
				{ content: '非常滿意', id: '5' },
			],
		},
		{
			title: '五、未來活動參與',
			type: 0,
			sort: 0,
			enabled: 'Y',
		},
		{
			title: '未來如有類似活動是否仍會參與',
			type: 3,
			optDescList: [
				{ content: '依議題' },
				{ content: '願意' },
				{ content: '不願意', isDesc: true },
			],
			sort: 8,
			enabled: 'Y',
			isAnswer: 'N',
		},
		{
			title: '六、其他建議',
			type: 0,
			sort: 0,
			enabled: 'Y',
		},
		{
			title: '希望增加的講座課程(可填寫多項)',
			type: 1,
			sort: 9,
			enabled: 'Y',
			isAnswer: 'Y',
		},
		{
			title: '其他意見與建議(可填寫多項)',
			type: 2,
			sort: 10,
			enabled: 'Y',
			isAnswer: 'N',
		},
	]

	// 問卷詳細資料
	detailDto: HealthQuerySatisfyQuestSingleDto = {}

	// 原始banner
	originImage = null

	// 上傳list
  uploadedFileList = []

  // 文字編輯bar
  customToolbar = [
  	[{ header: [1, 2, 3, 4, 5, 6, false] }],
  	[{ color: [] }, { background: [] }],
  	['bold', 'italic', 'underline', 'strike'],
  	[{ list: 'ordered' }, { list: 'bullet' }],
  	[{ align: [] }],
  	['link'],
  	['clean'],
  ]

	// 問卷文案表單
	form = {
		personalInfoStatement: null,
		questDesc: null,
		imgData: null,
	}

	// 問卷表單檢核規則
	formRules = {
		personalInfoStatement: [{ required: true, message: '個資聲明文案為必填', trigger: 'change' }],
		questDesc: [{ required: true, message: '問卷文案為必填', trigger: 'change' }],
		imgData: [{ required: true, message: '問卷Banner為必填', trigger: 'blur' }],
	}

	// 預覽彈窗控制
	visible: boolean = false

	// [儲存] 狀態 = 0 saveDto.isSrcTemp = true;
	status

  files = null

  created() {
  	this.type = this.$router.currentRoute.params.type;
  	this.paramsType = this.paramsTypeEnum.filter((i) => (i.key == this.type))[0].val;
  	if (this.type == 'edit') {
  		if (this.$global.getQuery()) {
  			const query = this.$global.getQuery();
  			this.version = query.version;
  			this.satisfyQuestId = query.satisfyQuestId;
  			this.status = query.status;
  		}
  		this.setData();
  	} else {
  		this.editQuestDto = this.initDto;
  	}
  }

  // 'Edit' API: 查詢單一問卷帶入資料
  setData() {
  	this.setLoading(true);
  	this.$PHPRpnQuerySatisfyQuestApi.queryOneSatisfyQuestUsingPOST(this.satisfyQuestId).then((resp) => {
  		if (resp.data.status === 200) {
  			this.detailDto = resp.data.data;
  			this.form.personalInfoStatement = this.detailDto.personalInfoStatement;
  			this.form.questDesc = this.detailDto.questDesc;
  			this.form.imgData = resp.data.data.bannerBase64;
  			// this.fileName = resp.data.data.bannerFileName;
  			// this.filePath = resp.data.data.bannerFilePath;
  			// this.saveDto = {
  			// 	satisfyQuestId: this.satisfyQuestId,
  			// };
  			console.log(this.saveDto);
  			this.originImage = this.dataURLtoFile(this.form.imgData, `picture.${this.form.imgData.substring('data:image/'.length, this.form.imgData.indexOf(';base64'))}`);

  			// 將問卷detail格式轉成編輯的格式
  			this.convertDetailToEditDto();
  		}
  	}).catch((err) => {
  		console.log(err);
  	}).finally(() => {
  		this.setLoading(false);
  	});
  }

  // 將問卷detail轉成編輯格式
  convertDetailToEditDto() {
  	const questTopicList = this.detailDto.healthActSatisfyQuestTopicSingleDtoList;
  	let num = 0;
  	questTopicList.map((item, index) => {
  				const optDescList = [];
  				// 矩陣題目
  				if ((item.type == 0) && ((questTopicList[index + 1]) && (questTopicList[index + 1].type == 7))) {
  					this.matrixTopic.optDescList = [];
  					this.matrixTopic.weightingList = [];
  					this.matrixTopic = {
  						...this.matrixTopic,
  						title: item.title,
  						isAnswer: item.isAnswer,
  						enabled: item.enable,
  					};
  				} else if (item.type == 7) {
  					this.matrixTopic.optDescList.push({
  						content: item.title,
  					});
  					// 矩陣題最後一題
  					if (!(questTopicList[index + 1]) || (questTopicList[index + 1].type != 7)) {
  						item.healthActSatisfyQuestOptSingleDtoList.forEach((weight, idx) => {
  							this.matrixTopic.weightingList.push({ content: weight.optDesc, id: weight.optId });
  						});
  						this.editQuestDto.push(this.matrixTopic);
  					}
  				} else {
  				// 單選題複選題選項整理
  					if (item.healthActSatisfyQuestOptSingleDtoList != null) {
  						item.healthActSatisfyQuestOptSingleDtoList.forEach((opt) => {
  							const option = { content: opt.optDesc, isDesc: opt.isDesc === 'Y' };
  							optDescList.push(option);
  						});
  					}
  					const newItem = {
  						optDescList,
  						title: item.title,
  						isAnswer: item.isAnswer,
  						enabled: item.enable,
  						type: item.type,
  						sort: null,
  					};
  					if (item.type != 0) {
  						num += 1;
  						newItem.sort = num;
  					}
  					this.editQuestDto.push(newItem);
  				}
  			});
  }

  // form表單檢核
	 handleValidate(action: 'submit'|'saveTmp'|'preview') {
  	(this.$refs.QuestSettingFormComp as any).validateForm(action);
  	(this.$refs.questForm as any).validate()
  		.then(() => true)
  		.catch((error) => {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  		});
  }

  afterValidate({ action, questionList }) {
  	this.editQuestDto = questionList;
  	this.convertSaveDto(questionList);
  	if (this.form.imgData) {
  		// const imgFile = this.dataURLtoFile(this.form.imgData, `picture.${this.form.imgData.substring('data:image/'.length, this.form.imgData.indexOf(';base64'))}`);
  		switch (action) {
  		case 'submit':
  			this.submit();
  			break;
  		case 'saveTmp':
  			this.saveTemp();
  			break;
  		case 'preview':
  			console.log('preview');
  			this.visible = true;
  			break;
  		}
  	}
  }

  // API: 儲存問卷
  submit() {
  	this.saveDto.satisfyQuestId = this.satisfyQuestId;
  	if (this.status === 0) {
 			this.saveDto.isSrcTemp = true;
  	}
  	this.setLoading(true);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.HEALTHTPUSHQUESTSAVE,
  		'model',
  		this.saveDto,
  		'file',
  		[this.files],
  		(resp) => {
  			this.$global.changeRouterAndaddParam({
  				query: {
  					version: this.version,
  					result: 'success',
  				},
  				toRouter: 'SatisfyQuestMaintainResult',
  				params: {
  					type: this.type,
  				},
  			});
  		},
  		(msg) => {
  				this.$global.changeRouterAndaddParam({
  				query: {
  					version: this.version,
  					result: 'fail',
  					msg,
  				},
  				toRouter: 'SatisfyQuestMaintainResult',
  				params: {
  					type: this.type,
  				},
  			});
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
  	// this.$PHPRpnQuerySatisfyQuestApi.saveSatisfyQuestUsingPOST1(this.saveDto)
  	// 	.then((resp) => {
  	// 		console.log(resp);
  	// 		let result = '';
  	// 		let errMsg = '';
  	// 		if (!resp.data.data) {
  	// 			result = 'success';
  	// 			console.log('success', resp.data);
  	// 		} else {
  	// 			console.log('fail', resp.data);
  	// 			errMsg = this.$global.getApiErrorMsg(resp.data.apiError).join('');
  	// 			result = 'fail';
  	// 		}
  	// 		this.$global.changeRouterAndaddParam({
  	// 			query: {
  	// 				version: this.version,
  	// 				result,
  	// 				msg: errMsg,
  	// 			},
  	// 			toRouter: 'SatisfyQuestMaintainResult',
  	// 			params: {
  	// 				type: this.type,
  	// 			},
  	// 		});
  	// 	}).catch((err) => {
  	// 		console.log(err);
  	// 	}).finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // API: 暫存問卷
  saveTemp() {
  	this.saveDto.satisfyQuestId = this.satisfyQuestId;
  	if (this.status === 0) {
 			this.saveDto.isSrcTemp = true;
  	}
  	this.setLoading(true);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.HEALTHTPUSHQUESTTEMPSAVE,
  		'model',
  		this.saveDto,
  		'file',
  		[this.files],
  		(resp) => {
  			this.$global.changeRouterAndaddParam({
  				query: {
  					version: this.version,
  					result: 'success',
  				},
  				toRouter: 'SatisfyQuestMaintainResult',
  				params: {
  					type: this.type,
  				},
  			});
  		},
  		(msg) => {
  				this.$global.changeRouterAndaddParam({
  				query: {
  					version: this.version,
  					result: 'fail',
  					msg,
  				},
  				toRouter: 'SatisfyQuestMaintainResult',
  				params: {
  					type: this.type,
  				},
  			});
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
  	// this.setLoading(true);
  	// this.$PHPRpnQuerySatisfyQuestApi.saveTempSatisfyQuestUsingPOST(this.saveDto)
  	// 	.then((resp) => {
  	// 		console.log(resp);
  	// 		let result = '';
  	// 		let errMsg = '';
  	// 		if (resp.data.data) {
  	// 			result = 'success';
  	// 		} else {
  	// 			errMsg = this.$global.getApiErrorMsg(resp.data.apiError).join('');
  	// 			result = 'fail';
  	// 		}
  	// 		this.$global.changeRouterAndaddParam({
  	// 			query: {
  	// 				version: this.version,
  	// 				result,
  	// 				msg: errMsg,
  	// 			},
  	// 			toRouter: 'SatisfyQuestMaintainResult',
  	// 			params: {
  	// 				type: this.type,
  	// 			},
  	// 		});
  	// 	}).catch((err) => {
  	// 		console.log(err);
  	// 	}).finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // 編輯資料格式轉成儲存資料格式
  convertSaveDto(formData) {
  	const topicDto = [];
  	formData.map((item) => {
  		let optDesc = [];
  		let data = {};

  		if (item.type === 7) {
  			// 矩陣題分類標題
  			data = {
  				title: item.title,
  				sort: item.sort,
  				type: 0,
  				isAnswer: item.isAnswer,
  				topicStatus: item.enabled,
  			};
  			topicDto.push(data);
  			// 矩陣題目
  			item.optDescList.forEach((e, index) => {
  				optDesc = [];
  				item.weightingList.forEach((weight) => {
  					const newWeight = {
  						optDescValue: weight,
  					};
  					optDesc.push(newWeight);
  				});
  				console.log('矩陣權重', optDesc);
  				data = {
  					title: e.content,
  					sort: item.sort + index + 1,
  					type: 7,
  					isAnswer: item.isAnswer,
  					topicStatus: item.enabled,
  					optDesc,
  				};
  				topicDto.push(data);
  			});
  		} else {
  			// 單選題、複選選項整理
  			if (item.type === 3 || item.type === 4) {
  				console.log(item.title);
  				item.optDescList.forEach((e) => {
  					optDesc.push({ optDescValue: e.content, isDesc: e.isDesc ? 'Y' : null });
  				});
  				data = {
  					optDesc,
  				};
  			}
  			data = {
  				title: item.title,
  				sort: item.sort,
  				type: item.type,
  				isAnswer: item.isAnswer,
  				topicStatus: item.enabled,
  				optDesc,
  			};
  			topicDto.push(data);
  		}
  	});
  	this.saveDto = {
  		// fileName: this.fileName,
  		// filePath: this.filePath,
  		topicDto,
  		personalInfoStatement: this.form.personalInfoStatement,
  		questDesc: this.form.questDesc,
  	};
  }

  // 點擊按鈕，『取消』
  handleCancel() {
  	// this.$router.go(-1);
  	this.$router.back();
  }

  // 移除圖片
  resetFile() {
  	this.uploadedFileList = [];
  	this.form.imgData = null;
  }

  // 更換圖片
  async handleChange(e) {
  	this.resetFile();
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	// if (e.file.status == 'uploading') {
  	// 	console.log('handlechange', e);
  	// 	const post = await this.uploadImg(e.file.originFileObj);
  	// 	console.log('post', post);
  	// 	if (post) {
  	// 		this.uploadedFileList = e.fileList.slice(-1);
  	// 		this.uploadedFileList.map((val) => {
  	// 			if (e.file.status == 'uploading') {
  	// 				val.status = 'done';
  	// 			}
  	// 			return val;
  	// 		});
  	// 	}
  	// }
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList.slice(-1);
  		this.uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  	if (this.uploadedFileList[0]) {
  		const el = this.uploadedFileList[0].originFileObj;
  		const reader = new FileReader();
  		reader.onload = (e) => {
  			const img = new Image();
  			img.src = reader.result.toString();
  			img.onload = () => {
  			// setTimeout(() => {
  				this.form.imgData = this.onLoadImage(img);
  			// });
  			};
  		};
  		reader.readAsDataURL(el);
  	}
  	if (e.file.status == 'removed') {
  		this.uploadedFileList = this.uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  	}
  }

  uploadFlie(options) {
  	if (this.beforeUpload) {
  	  this.uploadImg(options.file);
  	}
  }

  // API: 暫存圖片
  async uploadImg(file) {
  	this.files = file;
  	// this.setLoading(true);
  	// let success = false;
  	// await this.$PHPRpnQuerySatisfyQuestApi.uploadSatisfyQuestPictureUsingPOST(file)
  	// 	.then((resp) => {
  	// 		console.log('上傳', resp);
  	// 		if (resp.data.status == 200) {
  	// 			this.fileName = resp.data.data.fileName;
  	// 			this.filePath = resp.data.data.filePath;
  	// 			this.resetFile();
  	// 			success = true;
  	// 		}
  	// 		InfoModal.alertError({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  	// 		success = false;
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log(error);
  	// 	}).finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  	// return success;
  }

	 // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		'.png,.jpg,.gif,',
  		3,
  		2,
  	);
  	if (!vaildResult.vaild) {
  		InfoModal.alertError({ content: vaildResult.message });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  // file轉URL
  onLoadImage(img) {
  	let dataURL = '';
  	const canvas = document.createElement('canvas');
  	const maxWidth = 1088;
  	let zoomRatio = 1;
  	let width = img.width;
  	/** 圖片壓縮 */
  	if (width >= maxWidth) {
  		zoomRatio = maxWidth / width;
  		width = maxWidth;
  	}
  	const height = img.height * zoomRatio;

  	canvas.width = width;
  	canvas.height = height;
  	canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  	dataURL = canvas.toDataURL('image/jpeg');
  	// console.log(width);
  	return dataURL;
  }

  // 將base64轉成file格式
  dataURLtoFile(dataurl, filename = 'imgFile') {
  	const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1];
  	const bstr = atob(arr[1]); let n = bstr.length; const
  		u8arr = new Uint8Array(n);
  	while (n--) {
  		u8arr[n] = bstr.charCodeAt(n);
  	}
  	return new File([u8arr], filename, { type: mime });
  }

  handleCloseModal() {
  	this.visible = false;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.form__img{
	height: 110px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

::v-deep .questForm{
	.ant-form-item-required::before {
    content: '';
	}
		.ant-form-item-required::after {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 16px;
    font-family: SimSun, sans-serif;
    line-height: 1;
		content: '*';
	}
}
.event__wrap {
  padding: 30px 10%;
  line-height: 28px;
}
.event__block {
  margin-bottom: 20px;
}
.block__content {
  background: $COLOR-WHITE;
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
::v-deep {
  .ant-upload.ant-upload-drag {
    // height: 236px;
    background: $COLOR-WHITE;
  }
  .ant-upload-drag-icon {
    svg {
      width: 48px;
      height: 48px;
      color: #4CAAF5;
    }
  }
}
.ant-upload-text {
  font-size: 16px;
}
.ant-upload-hint {
  font-size: 14px;
  color: #0000006E;
}
.event__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
}
.ant-btn-lg {
  padding: 0;
  color: $COLOR-GRAY1;
  border-radius: 4px;
  width: 100%;
  min-height: 40px;
  height: auto;
  &:focus, &:hover {
    background-color: #E6F7FF;
  }
  @include rwd-xl {
    width: 150px;
  }
}

// 選擇題型樣式
.btn__block {
  margin-top: 20px;
  padding: 20px 25px 20px 25px;
  border-radius: 10px;
}
.choose__type__block {
  &.ant-col-5 {
    width: 200px;
    margin-left: 20px;
  }
}
.btn__icon__wrap {
  margin-top: 10px;
}
.btn__icon {
  background-color: #23C4A8;
  width: 40px;
  height: 100%;
}
.btn__icon__label {
  white-space: initial;
  text-align: left;
  line-height: 1.5;
  padding: 10px;
}
.btn__icon--white {
  color: $COLOR-WHITE;
  &.draggable__icon {
    display: block;
    padding: 5px 0px;
  }
}
// 編輯題目樣式
.question__wrap {
  margin-top: 40px;
}
.question__block {
  flex: 1;
  padding: 20px 25px 20px 0px;
}
.divider--gray {
  height: 2px;
  margin: 8px 0px;
  background-color: #D2D2D2;
}
.divider--green {
  height: 2px;
  background-color: $COLOR-MAIN1;
  margin-top: 30px;
}
.question__icon__default {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  justify-content: center;
}
.question__icon__fixed {
  padding-left: 3px;
  .question__item {
    padding-top: 5px;
    flex: 1;
  }
}
.question__icon__left {
  background-color: #BDBDBD;
  align-items: center;
  ::v-deep svg{
		font-size: 16px;
	}
}
.question__icon__right {
  background-color: #23C4A8;
  ::v-deep svg{
		font-size: 12px;
	}
}
.question__icon__col {
  font-size: 14px;
}
.question__item {
  color: $COLOR-WHITE;
  font-size: 20px;
}
</style>
