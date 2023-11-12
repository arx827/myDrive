<template>
  <div class="container">
    <div class="page__title">
      建立加班資訊名單
    </div>
    <div class="query__title">
      請選擇上傳項目
    </div>

    <div class="query__wrap">
      <div class="row">
        <div class="col-md-6 col-12 mb-2">
          <a-form-model
            ref="formShiftRef"
            :rules="formRules"
            :model="formShift"
          >
            <div
              class="member__wrap"
              :class="{'selected': selectedUpload == 'shift'}"
            >
              <p class="member__wrap__title">
                夜班、輪班人員名單
              </p>
              <div class="member__wrap__month">
                <p class="month__title">
                  建立檔案的年月
                </p>
                <a-form-model-item
                  prop="date"
                  :rules="formRules.date"
                >
                  <date-picker
                    v-model="formShift.date"
                    :disabled="true"
                    class="month__input"
                    type="month"
                    :format="'YYYY/MM'"
                  />
                </a-form-model-item>
              </div>
              <div class="member__wrap__upload">
                <div class="upload__title">
                  上傳檔案
                </div>
                <div class="upload__subtitle">
                  檔案大小限不超過3MB，限定 Excel 格式。
                </div>
                <a-upload
                  name="shiftFile"
                  accept=".xlsx, .xls"
                  :custom-request="uploadFlie"
                  :file-list="formShift.fileList"
                  :before-upload="beforeUpload"
                  :show-upload-list="false"
                >
                  <button class="upload__btn">
                    選擇檔案
                  </button>
                </a-upload>
                <div
                  v-if="formShift.fileList[0]"
                  class="upload-list"
                >
                  <div
                    v-for="item in formShift.fileList"
                    :key="item.uid"
                    class="upload-list-item d-flex"
                  >
                    <a-icon
                      type="paper-clip"
                      class="icon__style"
                    />
                    <a
                      :title="item.name"
                      :href="item.url"
                      :download="item.name"
                      class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                    >
                      {{ item.name }}
                    </a>
                    <a-icon
                      type="close"
                      @click="handleRemoveFile('formShift')"
                    />
                  </div>
                </div>
                <p
                  v-if="errorMsg.shift"
                  class="message--error ml-0"
                >
                  {{ errorMsg.shift }}
                </p>
              </div>
            </div>
          </a-form-model>
        </div>
        <div class="col-md-6 col-12">
          <a-form-model
            ref="formOverTimeRef"
            :rules="formRules"
            :model="formOverTime"
          >
            <div
              class="member__wrap"
              :class="{'selected': selectedUpload == 'overTime'}"
            >
              <p class="member__wrap__title">
                加班資訊名單
              </p>
              <div class="member__wrap__month">
                <p class="month__title">
                  建立檔案的年月
                </p>
                <a-form-model-item
                  prop="date"
                  :rules="formRules.date"
                >
                  <date-picker
                    v-model="formOverTime.date"
                    :disabled="true"
                    class="month__input"
                    type="month"
                    :format="'YYYY/MM'"
                  />
                </a-form-model-item>
              </div>
              <div class="member__wrap__upload">
                <div class="upload__title">
                  上傳檔案
                </div>
                <div class="upload__subtitle">
                  檔案大小限不超過3MB，限定 Excel 格式。
                </div>
                <a-upload
                  name="overTimeFile"
                  accept=".xlsx, .xls"
                  :custom-request="uploadFlie"
                  :file-list="formOverTime.fileList"
                  :before-upload="beforeUpload"
                  :show-upload-list="false"
                >
                  <button class="upload__btn">
                    選擇檔案
                  </button>
                </a-upload>
                <div
                  v-if="formOverTime.fileList[0]"
                  class="upload-list"
                >
                  <div
                    v-for="item in formOverTime.fileList"
                    :key="item.uid"
                    class="upload-list-item d-flex"
                  >
                    <a-icon
                      type="paper-clip"
                      class="icon__style"
                    />
                    <a
                      :title="item.name"
                      :href="item.url"
                      :download="item.name"
                      class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                    >
                      {{ item.name }}
                    </a>
                    <a-icon
                      type="close"
                      @click="handleRemoveFile('formOverTime')"
                    />
                  </div>
                </div>
                <p
                  v-if="errorMsg.overTime"
                  class="message--error ml-0"
                >
                  {{ errorMsg.overTime }}
                </p>
              </div>
            </div>
          </a-form-model>
        </div>
      </div>
    </div>

    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        :disabled="!selectedUpload"
        @click="goUpload()"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import notification from '@/plugins/notification/infoNotification';
import moment from 'moment';

@Component({ components: {} })
export default class BuildOverTimeIndex extends Vue {
  @Action('setLoading') setLoading;

  showModel = false; // 是否打開CheckModel

  finished = false; // 是否成功上傳

  checked = 3; // 檢查結果

  // 表單欄位資料-輪班人員名單
  formShift = {
  	date: null,
  	fileList: [],
  }

  // 表單欄位資料-加班資訊名單
  formOverTime = {
  	date: null,
  	fileList: [],
  }

  // 檢核規則
  formRules = {
  	date: [{ required: true, message: '年月不可為空' }],
  }

  errorMsg = {
  	shift: '',
  	overTime: '',
  }

  // 聚焦 輪班人員 or 加班資訊(二擇一)
  selectedUpload: 'shift'| 'overTime' = null;

  // API: 檢查輪班人員格式
  checkShiftInfoFormat() {
  	const { date, fileList } = this.formShift;
  	const dateStr: string = moment(date).format('YYYYMM');
  	this.setLoading(true);
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.checkShiftInfoFormatUsingPOST(fileList[0], dateStr)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				const getData = resp.data.data;
  				const { empWoCheckShiftInfoDtoList, error } = getData;
  				if (error && error.length > 0) {
  					error.forEach((i) => {
  						switch (i) {
  						case 0:
  							// 檔案格式錯誤
  							InfoModal.alertSuccess({
  								title: '檢核訊息',
  								confirm: false,
  								content: '檔案格式錯誤，無法進行上傳。請將原檔案格式修正完成後，再次上傳。',
  							});
  							break;
  						case 1:
  							// 資料格式錯誤
  							InfoModal.alertSuccess({
  								title: '檢核訊息',
  								confirm: false,
  								content: '資料格式錯誤，無法進行上傳。請將原檔案格式修正完成後，再次上傳。',
  							});
  							break;
  						default:
  							InfoModal.alertSuccess({
  								title: '檢核訊息',
  								confirm: true,
  								content: '請再次上傳。',
  							});
  							break;
  						}
  					});
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'BuildOverTimeList',
  						query: {
  							uploadType: this.selectedUpload,
  							date: dateStr,
  							respData: empWoCheckShiftInfoDtoList,
  						},
  					});
  				}
  			} else {
  				notification.error({
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
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

  // API: 檢查加班資訊格式
  checkOvertimeInfoFormat() {
  	const { date, fileList } = this.formOverTime;
  	const dateStr: string = moment(date).format('YYYYMM');
  	this.setLoading(true);
  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.checkOvertimeInfoFormatUsingPOST(fileList[0], dateStr)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (resp.data.data) {
  					const getData = resp.data.data;
  					const { empWoCheckOvertimeInfoDtoList, error } = getData;
  					if (error && error.length > 0) {
  						error.forEach((i) => {
  							switch (i) {
  							case 0:
  								// 檔案格式錯誤
  								InfoModal.alertSuccess({
  									title: '檢核訊息',
  									confirm: false,
  									content: '檔案格式錯誤，無法進行上傳。請將原檔案格式修正完成後，再次上傳。',
  								});
  								break;
  							case 1:
  								// 資料格式錯誤
  								InfoModal.alertSuccess({
  									title: '檢核訊息',
  									confirm: false,
  									content: '資料格式錯誤，無法進行上傳。請將原檔案格式修正完成後，再次上傳。',
  								});
  								break;
  							case 2:
  								// 裡面有不同月份資料
  								InfoModal.alertSuccess({
  									title: '檢核訊息',
  									confirm: true,
  									content: '您的檔案內含不同月份之資訊，請問還是要繼續上傳嗎？',
  								});
  								break;
  						  case 3:
  								// 資料庫資料有重複
  								InfoModal.alertError({
  									title: '檢核訊息',
  									confirm: true,
  									content: '您上傳的檔案資料重覆，如欲繼續上傳，上次檔案資料將被覆蓋更新。請問還是要上傳嗎？',
  									class: 'modal__confirm__overtime--error',
  									onCallback: () => {
  										this.$global.changeRouterAndaddParam({
  											toRouter: 'BuildOverTimeList',
  											query: {
  												uploadType: this.selectedUpload,
  												date: dateStr,
  												respData: empWoCheckOvertimeInfoDtoList,
  											},
  										});
  									},
  								});
  								break;
  							default:
  								InfoModal.alertSuccess({
  									title: '檢核訊息',
  									confirm: true,
  									content: '請再次上傳。',
  								});
  								break;
  							}
  				  	});
  					} else {
  						this.$global.changeRouterAndaddParam({
  							toRouter: 'BuildOverTimeList',
  							query: {
  								uploadType: this.selectedUpload,
  								date: dateStr,
  								respData: empWoCheckOvertimeInfoDtoList,
  							},
  						});
  					}
  				}
  			} else {
  				notification.error({
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
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

  goUpload() {
  	this.checkFileList();
  	if (this.selectedUpload === 'shift' && !this.errorMsg[this.selectedUpload]) {
  		this.checkShiftInfoFormat();
  	} else if (this.selectedUpload === 'overTime' && !this.errorMsg[this.selectedUpload]) {
  		this.checkOvertimeInfoFormat();
  	}
  }

  closeModal() {
  	this.showModel = false;
  }

  uploadFlie({ file, filename }) {
  	switch (filename) {
  	case 'shiftFile':
  		this.formShift.fileList = this.$blobUtils.updateFileList(file, file.name, this.formShift.fileList, false);
  		this.selectedUpload = 'shift';
  		break;
  	default:
  		this.formOverTime.fileList = this.$blobUtils.updateFileList(file, file.name, this.formOverTime.fileList, false);
  		this.selectedUpload = 'overTime';
  		break;
  	}
  	this.checkFileList();
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	return true;
  }

  handleRemoveFile(form) {
  	this[form].fileList.pop();
  }

  // 檢核檔案欄位
  checkFileList() {
  	switch (this.selectedUpload) {
  	case 'shift':
  		this.errorMsg.shift = (this.formShift.fileList.length == 0) ? '請選擇有效檔案' : null;
  		this.errorMsg.overTime = null;
  		break;
  	case 'overTime':
  		this.errorMsg.overTime = (this.formOverTime.fileList.length == 0) ? '請選擇有效檔案' : null;
  		this.errorMsg.shift = null;
  		break;
  	default:
  		break;
  	}
  }

  // 檢查是否有屬性值
  checkObjHasVal(obj) {
  	let bool = false;
  	for (const [key, value] of Object.entries(obj)) {
  		const val: any = value;
  		if (val && val.length !== 0) {
  			bool = true;
  		}
  	}
  	return bool;
  }

  created() {
  	this.formShift.date = new Date();
  	this.formOverTime.date = new Date();
  	this.$global.clearParam();
  }

  @Watch('formShift.fileList', { deep: true })
  onFormShiftChange(val) {
  	if (this.checkObjHasVal(val)) {
  		this.selectedUpload = 'shift';
  		this.formOverTime.fileList = [];
  	}
  }

  @Watch('formOverTime.fileList', { deep: true })
  onFormOverTimeChange(val) {
  	if (this.checkObjHasVal(val)) {
  		this.selectedUpload = 'overTime';
  		this.formShift.fileList = [];
  	}
  }
}
</script>

<style lang="scss" scoped>
  .query__title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #000000;
    text-align: center;
  }
  .query__wrap {
    max-width: 720px;
    margin: auto;
    margin-bottom: 40px;
    .member__wrap {
      border-radius: 6px;
      padding: 20px 36px;
      border: 0.5px solid $COLOR-GRAY2;
      .member__wrap__title {
        color: $COLOR-MAIN12;
        font-weight: $TEXT-BOLD;
        font-size: 24px;
        margin-bottom: 30px;
      }
      .member__wrap__month {
        margin-bottom: 20px;
        .month__title {
          font-size: 16px;
          font-weight: $TEXT-BOLD;
          margin-bottom: 10px;
        }
        .month__input {
          width: 100%;
        }
      }
      .member__wrap__upload {
        .upload__title {
          font-size: 16px;
          margin-bottom: 5px;
          font-weight: $TEXT-BOLD;
        }
        .upload__subtitle {
          margin-bottom: 10px;
        }
        .upload__btn {
          background-color: $COLOR-MAIN13;
          color: $COLOR-WHITE;
          font-weight: $TEXT-BOLD;
          border-radius: 4px;
          padding: 9px 33px;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
      }
      &:hover, &.selected {
        background-color: $COLOR-MAIN10;
        box-shadow: 0px 2px 2px #00000029;
      }
    }
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
