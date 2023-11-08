<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          員工健檢資料匯出 (請擇一進行查詢)
        </div>
      </div>
      <div class="notificationQuery__content">
        <div class="row">
          <div class="col-md-4 col-12">
            <div
              class="notificationQuery__block"
              :class="{'selected': collaspeOpen === 1}"
            >
              <div class="mb-2">
                <img
                  src="@/assets/images/image_byPeople.svg"
                  alt=""
                >
              </div>
              <div class="notificationQuery__block__title">
                員工健檢資料（依個人）
              </div>
              <div>
                <a-form-model
                  :layout="'vertical'"
                  :model="formIndividual"
                >
                  <div
                    class="mustFill__block bg__light"
                  >
                    <div class="note__title">
                      ＊此區欄位至少必需擇一填寫
                    </div>
                    <a-form-model-item label="員工姓名">
                      <a-input
                        v-model="formIndividual.userName"
                        vue="true"
                        alt="webfont"
                      />
                    </a-form-model-item>
                    <a-form-model-item label="身分證字號/員編">
                      <a-input v-model="formIndividual.userNo" />
                    </a-form-model-item>
                  </div>
                  <a-form-model-item label="健檢年度">
                    <a-input v-model="formIndividual.period" />
                  </a-form-model-item>
                  <a-form-model-item label="健檢日期（區間）">
                    <date-picker
                      v-model="formIndividual.date"
                      type="date"
                      :range="true"
                      placeholder="e.g. 2022/01/01～2022/02/01"
                      style="width: 100%;"
                    />
                  </a-form-model-item>
                </a-form-model>
              </div>
              <div
                class="collaspe__block"
                @click="collaspeBlock(1)"
              >
                <a-icon
                  type="down"
                  :style="{ fontSize: '36px'}"
                />
              </div>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div
              class="notificationQuery__block"
              :class="{'selected': collaspeOpen === 2}"
            >
              <div class="mb-2">
                <img
                  src="@/assets/images/image_byData.svg"
                  alt=""
                >
              </div>
              <div class="notificationQuery__block__title text-start">
                員工健檢資料（依資料）
              </div>
              <div>
                <a-form-model
                  :layout="'vertical'"
                  :model="formInfo"
                >
                  <a-form-model-item
                    label="健檢日期（區間）"
                    required
                  >
                    <date-picker
                      v-model="formInfo.date"
                      type="date"
                      :range="true"
                      placeholder="e.g. 2022/01/01～2022/02/01"
                      style="width: 100%;"
                    />
                  </a-form-model-item>
                  <a-form-model-item
                    label="健檢項目（可複選）"
                    required
                  >
                    <button
                      class="btn__healthCate mx-2 mb-1"
                      style="position: absolute; top: -40px; right: 0;"
                      @click="getHealthItem"
                    >
                      選擇
                    </button>
                    <div
                      class="health__category"
                    >
                      <div
                        v-for="(item, index) in showCateOpts"
                        :key="index"
                        class="health__category__item"
                        :data-id="item.id"
                      >
                        {{ item.name }}
                        <a-icon
                          class="btn__close"
                          type="close"
                          @click.stop="removeHealthItem(item.id)"
                        />
                      </div>
                    </div>
                  </a-form-model-item>
                  <a-form-model-item label="部門/單位">
                    <a-select
                      v-model="formInfo.dept"
                      placeholder="e.g. 系統整合部 職安勤務科"
                      :show-arrow="true"
                      :allow-clear="true"
                      :show-search="true"
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        v-for="(dept, index) in depts"
                        :key="index"
                        :value="dept.deptCd"
                      >
                        {{ dept.deptName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="年齡（區間）">
                    <a-input-number
                      v-model="formInfo.startAge"
                      :min="1"
                      :max="100000"
                    />
                    -
                    <a-input-number
                      v-model="formInfo.endAge"
                      :min="2"
                      :max="100000"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="檢查時期">
                    <a-radio-group v-model="formInfo.ckeckPeriod">
                      <a-radio value="0">
                        全部
                      </a-radio>
                      <a-radio value="1">
                        新進員工
                      </a-radio>
                      <a-radio value="2">
                        定期檢查
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item label="性別">
                    <a-radio-group v-model="formInfo.sex">
                      <a-radio value="M">
                        男性
                      </a-radio>
                      <a-radio value="F">
                        女性
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item label="分級">
                    <a-radio-group v-model="formInfo.level">
                      <a-radio value="0">
                        全部
                      </a-radio>
                      <a-radio value="1">
                        1級
                      </a-radio>
                      <a-radio value="2">
                        2級
                      </a-radio>
                      <a-radio value="3">
                        3級
                      </a-radio>
                      <a-radio value="4">
                        4級
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-form-model>
              </div>
              <div
                class="collaspe__block"
                @click="collaspeBlock(2)"
              >
                <a-icon
                  type="down"
                  :style="{ fontSize: '36px'}"
                />
              </div>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div
              class="notificationQuery__block"
              :class="{'selected': collaspeOpen === 3}"
            >
              <div class="mb-2">
                <img
                  src="@/assets/images/image_byTop.svg"
                  alt=""
                >
              </div>
              <div class="notificationQuery__block__title text-start">
                十大異常分析
              </div>
              <div>
                <a-form-model
                  :layout="'vertical'"
                  :model="formAnalyze"
                >
                  <div
                    class="mustFill__block bg__light"
                  >
                    <div class="note__title">
                      ＊此區欄位至少必需擇一填寫
                    </div>
                    <a-form-model-item label="健檢年度">
                      <a-input
                        v-model="formAnalyze.period"
                      />
                    </a-form-model-item>
                    <a-form-model-item label="健檢日期（區間）">
                      <date-picker
                        v-model="formAnalyze.date"
                        type="date"
                        :range="true"
                        placeholder="e.g. 2022/01/01～2022/02/01"
                        style="width: 100%;"
                      />
                    </a-form-model-item>
                    <a-form-model-item label="部門/單位">
                      <!-- <a-input
                        v-model="formAnalyze.dept"
                        placeholder="e.g. 系統整合部"
                      /> -->
                      <a-select
                        v-model="formAnalyze.dept"
                        placeholder="e.g. 系統整合部 職安勤務科"
                        :show-arrow="true"
                        :allow-clear="true"
                        :show-search="true"
                        :filter-option="filterOption"
                      >
                        <a-select-option
                          v-for="(dept, index) in depts"
                          :key="index"
                          :value="dept.deptCd"
                        >
                          {{ dept.deptName }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="年齡（區間）">
                      <!-- <a-select
                        v-model="formAnalyze.startAge"
                        placeholder="e.g. 20-30"
                      >
                        <a-select-option value="1">
                          1
                        </a-select-option>
                      </a-select> -->
                      <a-input-number
                        v-model="formAnalyze.startAge"
                        :min="1"
                        :max="100000"
                      />
                      -
                      <a-input-number
                        v-model="formAnalyze.endAge"
                        :min="2"
                        :max="100000"
                      />
                    </a-form-model-item>
                  </div>
                  <a-form-model-item label="性別">
                    <a-radio-group v-model="formAnalyze.sex">
                      <a-radio value="">
                        全部
                      </a-radio>
                      <a-radio value="M">
                        男性
                      </a-radio>
                      <a-radio value="F">
                        女性
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item
                    label="生活習慣（吸菸/嚼檳/榔喝酒）"
                    required
                  >
                    <a-radio-group v-model="formAnalyze.habit">
                      <a-radio value="Y">
                        全部
                      </a-radio>
                      <a-radio value="N">
                        否，不包含
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-form-model>
              </div>
              <div
                class="collaspe__block"
                @click="collaspeBlock(3)"
              >
                <a-icon
                  type="down"
                  :style="{ fontSize: '36px'}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary"
          @click="queryData"
        >
          確定
        </button>
      </div>
    </div>
    <HealthCategoryModal
      :visible="modalVisible"
      :selected-cate="cateSelected"
      :modal-title="'健檢項目'"
      @closeCateModal="closeCateModal"
      @changeSelected="changeCateSelected"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { CheckDataPersonalHealthInfoEnterDto, CheckDataDataHealthInfoEnterDto, CheckDataLAAHealthInfoEnterDto } from '@fubonlife/oss-api-axios-sdk';
import HealthCategoryModal from '@/components/modal/HealthCategoryModal.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/notification/infoNotification';
import infoModal from '@/plugins/notification/infoModal';

@Component({ components: { HealthCategoryModal } })
export default class NotificationAndRecordQuery extends Vue {
  @Action('setLoading') setLoading;

	formIndividual = {
		userName: null,
		userNo: null,
		period: null,
		date: null,
	}

  formInfo = {
  	date: null,
  	ckeckPeriod: null,
  	dept: undefined,
  	endAge: null,
  	startAge: null,
  	itemId: null,
  	level: null,
  	sex: null,
  }

  formAnalyze = {
  	date: null,
  	dept: undefined,
  	endAge: null,
  	endDate: null,
  	habit: null,
  	period: null,
  	sex: null,
  	startAge: null,
  	startDate: null,
  }

  collaspeOpen = 1;

  modalVisible = false;

  cateSelected: [{name: string; id: string; isChecked: boolean}] = null;

  depts = null // 部門下拉

  get showCateOpts() {
  	if (!this.cateSelected) return;
  	const allOpts = this.cateSelected;
  	const arr = allOpts.filter((e: any) => e.isChecked);
  	return arr;
  }

  // 模糊搜尋
  filterOption(input, option) {
  	return option.componentOptions?.children[0]?.text?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0;
  }

  openModal() {
  	this.modalVisible = true;
  }

  closeCateModal() {
  	this.modalVisible = false;
  }

  changeCateSelected(data) {
  	this.cateSelected = data;
  }

  collaspeBlock(target) {
  	this.collaspeOpen = target;
  }

  // 確定查詢
  queryData() {
  	this.$notification.destroy(); // 清除錯誤彈窗
  	switch (this.collaspeOpen) {
  	case 1:
  		this.queryIndividualData();
  		break;
  	case 2:
  		this.queryInfoData();
  		break;
  	case 3:
  		this.queryAnalyzeData();
  		break;

  	default:
  		break;
  	}
  }

  // 拿取部門下拉資料
  getDeptList() {
  	this.$UtilityApi.deptListUsingPOST()
  		.then((resp) => {
  				if (resp.data.status === 200) {
  					this.depts = resp.data.data;
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
  				// this.setLoading(false);
  			});
  }

  // 查詢健檢項目
  getHealthItem() {
  	if (!this.cateSelected) {
  	// 首次點擊需讀取API項目
  		this.setLoading(true);
  		this.$HeRpnHeRpnCheckDataExportControllerApi.getQueryHealthCheckItemsUsingPOST()
  			.then((resp: any) => {
  				if (resp.data.status === 200) {
  					this.cateSelected = resp.data.data.map((e) => ({
  						name: e.cnName, id: e.itemId, isChecked: false,
  					}));
  					this.openModal();
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
  	} else {
  		this.openModal();
  	}
  }

  // 移除健檢項目
  removeHealthItem(removeID) {
  	this.cateSelected.forEach((element) => {
  		if (element.id === removeID) {
  			element.isChecked = false;
  		}
  	});
  }

  checkRequiredPass(obj) {
  	let isValidate = false;

  	for (const [key, value] of Object.entries(obj)) {
  		const val: any = value;
  		if (val) {
  			isValidate = true;
  		}
  		console.log(val);
  	}

  	return isValidate;
  }

  // 員工健檢資料（依個人）
  queryIndividualData() {
  	const date: any = this.formIndividual.date;
  	const NewRangeDate = date ? DateTimeFormmat.filterRangeDate(date) : null;
  	const data = {
  		userName: this.formIndividual.userName,
  		userNo: this.formIndividual.userNo,
  		period: this.formIndividual.period,
  		startDate: NewRangeDate ? NewRangeDate[0] : null,
  		endDate: NewRangeDate ? NewRangeDate[1] : null,
  	};

  	if (!this.checkRequiredPass({ userName: this.formIndividual.userName, userNo: this.formIndividual.userNo, period: this.formIndividual.period })) {
  		infoModal.alertError({
  			content: '必填欄位未填',
  		});
  		return;
  	}
  	this.setLoading(true);

  	this.$HeRpnHeRpnCheckDataExportControllerApi.getCheckdataexportPersonalPageUsingPOST(data, 0, 10)
    	.then(async (resp) => {
  			if (resp.data.status === 200) {
  				if (resp.data.data && resp.data.data.checkDataPersonalHealthInfoDtoPage.content.length > 0) {
  					const encryptString = await this.$encryptionDecryption.encrypt(JSON.stringify(data));
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'EmpHealthDataIndividualList',
  						query: encryptString,
  					});
  				} else {
  					notification.error({
  						content: '查無資料',
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

  // 員工健檢資料（依資料）
  queryInfoData() {
  	const date: any = this.formInfo.date;
  	const NewRangeDate = date ? DateTimeFormmat.filterRangeDate(date) : null;
  	console.log(this.showCateOpts);
  	const data: CheckDataDataHealthInfoEnterDto = {
  		ckeckPeriod: this.formInfo.ckeckPeriod,
  		dept: this.formInfo.dept,
  		endAge: this.formInfo.endAge,
  		endDate: NewRangeDate ? NewRangeDate[1] : null,
  		itemId: this.showCateOpts ? this.showCateOpts.map((e) => e.id).join(';') : null,
  		// itemId: 'H0001;H0002', // 測試資料
  		level: this.formInfo.level,
  		sex: this.formInfo.sex,
  		startAge: this.formInfo.startAge,
  		startDate: NewRangeDate ? NewRangeDate[0] : null,
  	};

  	console.log(this.formInfo);

  	if (!this.checkRequiredPass({ date: this.formInfo.date }) || !this.checkRequiredPass({ itemId: data.itemId })) {
  		infoModal.alertError({
  			content: '必填欄位未填',
  		});
  		return;
  	}
  	this.setLoading(true);
  	this.$HeRpnHeRpnCheckDataExportControllerApi.getCheckdataexportDataPageUsingPOST(data, 0, 10)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (resp.data.data.checkDataPersonalHealthInfoDtoPage.content && resp.data.data.checkDataPersonalHealthInfoDtoPage.content.length > 0) {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'EmpHealthDataList',
  						query: data,
  					});
  				} else {
  					notification.error({
  						content: '查無資料',
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

  // 十大異常分析
  queryAnalyzeData() {
  	const date: any = this.formAnalyze.date;
  	const NewRangeDate = date ? DateTimeFormmat.filterRangeDate(date) : null;
  	const data: CheckDataLAAHealthInfoEnterDto = {
  		dept: this.formAnalyze.dept,
  		endAge: this.formAnalyze.endAge,
  		endDate: NewRangeDate ? NewRangeDate[1] : null,
  		habit: this.formAnalyze.habit,
  		period: this.formAnalyze.period,
  		sex: this.formAnalyze.sex,
  		startAge: this.formAnalyze.startAge,
  		startDate: NewRangeDate ? NewRangeDate[0] : null,
  	};
  	if (!this.checkRequiredPass({
  		dept: this.formAnalyze.dept, date: this.formAnalyze.date, 	period: this.formAnalyze.period, age: this.formAnalyze.endAge && this.formAnalyze.startAge ? 'true' : null,
  	}) || !this.checkRequiredPass({ habit: this.formAnalyze.habit })) {
  		infoModal.alertError({
  			content: '必填欄位未填',
  		});
  		return;
  	}
  	this.setLoading(true);
  	this.$HeRpnHeRpnCheckDataExportControllerApi.getCheckdataLargeAnomalyAnalysisInfoUsingPOST(data)
    	.then((resp) => {
  			console.log(resp);
  			if (resp.data.data) {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmpHealthDataAnalyzeList',
  					query: data,
  				});
  			} else {
  				notification.error({
  					content: '查無資料',
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

  /**
   * Hook
   */
  created() {
  	this.getDeptList();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.notificationQuery__title {
	font-size: 24px;
	margin-bottom: 20px;
}
.notificationQuery__block {
  position: relative;
	background: #FFFFFF 0% 0% no-repeat padding-box;
	border: 1px solid #CED4D9;
	border-radius: 6px;
	padding: 20px 36px;
	margin-bottom: 25px;
  height: 330px;
  overflow: hidden;
  &.selected {
    height: auto;
    overflow: auto;
    box-shadow: 0px 0px 0px 2px rgba(35,196,168, 0.35);
    border: 1px solid #23C4A8;
    .collaspe__block {
      display: none;
    }
  }
  .mustFill__block {
    margin-left: -36px;
    margin-right: -36px;
    padding: 20px 36px;
    margin-bottom: 20px;
  }
}
.notificationQuery__block__title {
	color: #7DC9CF;
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 30px;
}
.note__title {
  color: #7DC9CF;
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
}
.collaspe__block {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 165px;
  background: url(../../../../assets/images/image_gradient.png) repeat;
  cursor: pointer;
  i {
    position: absolute;
    bottom: 20px;
    left: 50%;
    margin-left: -18px;
    color: $COLOR-MAIN1;
    ::v-deep {
      svg {
        font-size: 36px;
      }
    }
  }
}

::v-deep {
	.ant-form-item-label > label {
		color: #000000;
		font-weight: 600;
		font-size: 16px;
	}
}
</style>
