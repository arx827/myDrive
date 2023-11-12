<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          發送通知與紀錄
        </div>
        <div class="pt-4">
          <router-link to="/occupationSafety/HealthCheck/notificationAndRecord/sendQuery">
            <button
              class="btn__radius--primary--outline--small px-3"
            >
              查詢發送紀錄
            </button>
          </router-link>
        </div>
      </div>
      <div class="notificationQuery__content">
        <div class="notificationQuery__title text-center">
          您想處理什麼情境的衛教通知？
        </div>
        <div class="row">
          <div class="col-md-6 col-12">
            <div
              class="notificationQuery__block"
              :class="{'selected' : selectedSearch === 'single'}"
            >
              <div class="notificationQuery__block__title text-end">
                單筆
              </div>
              <div>
                <a-form-model
                  :layout="'vertical'"
                  :model="formSingle"
                >
                  <a-form-model-item label="員工姓名">
                    <a-input
                      v-model="formSingle.name"
                      vue="true"
                      alt="webfont"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="員編">
                    <a-input v-model="formSingle.empNo" />
                  </a-form-model-item>
                  <a-form-model-item label="身分證字號">
                    <a-input v-model="formSingle.empId" />
                  </a-form-model-item>
                </a-form-model>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div
              class="notificationQuery__block"
              :class="{'selected' : selectedSearch === 'batch'}"
            >
              <div class="notificationQuery__block__title text-start">
                批次
              </div>
              <div>
                <a-form-model
                  :layout="'vertical'"
                  :model="form"
                >
                  <a-form-model-item label="健檢日期區間">
                    <date-picker
                      v-model="form.date"
                      type="date"
                      :range="true"
                      placeholder="e.g. 2022/01/01～2022/02/01"
                      style="width: 100%;"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="分級">
                    <a-radio-group v-model="form.level">
                      <a-radio value="2">
                        2級
                      </a-radio>
                      <a-radio value="3">
                        3級以上
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item label="符合幾項衛教項目">
                    <a-input
                      v-model="form.category"
                      placeholder="e.g. 3"
                      :disabled="form.level!=='2'"
                    />
                    <!-- <a-select
                      v-model="form.category"
                      placeholder="e.g. 3"
                      :disabled="form.level!=='2'"
                    >
                      <a-select-option value="1">
                        1
                      </a-select-option>
                      <a-select-option value="2">
                        2
                      </a-select-option>
                    </a-select> -->
                  </a-form-model-item>
                </a-form-model>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary"
          @click="searchRecord"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { NoticeSentSingleDto, NoticeSentBatchDto } from '@fubonlife/oss-api-axios-sdk';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/notification/infoNotification';

@Component({ })
export default class NotificationAndRecordQuery extends Vue {
  @Action('setLoading') setLoading;

	form = {
		date: '',
		level: '2',
		category: '',
	}

  formSingle = {
  	name: '',
  	empNo: '',
  	empId: '',
  }

  selectedSearch: 'single' | 'batch' = null;

  @Watch('formSingle', { deep: true })
  onSigleFormChange(obj) {
  	if (this.checkObjHasVal(obj)) {
  		this.selectedSearch = 'single';
  		this.form = {
  			date: '',
  			level: '',
  			category: '',
  		};
  	}
  }

  @Watch('form', { deep: true })
  onFormChange(obj) {
  	if (this.checkObjHasVal(obj)) {
  		this.selectedSearch = 'batch';
  		this.formSingle = {
  			name: '',
  			empNo: '',
  			empId: '',
  		};
  	}
  }

  checkObjHasVal(obj) {
  	let bool = false;
  	for (const [key, value] of Object.entries(obj)) {
  		const val: any = value;
  		if (val.length !== 0) {
  			bool = true;
  		}
  	}
  	return bool;
  }

  searchRecord() {
  	if (!this.selectedSearch) {
  		notification.error({ content: '請輸入欲查詢資料' });
  		return;
  	}
  	if (this.selectedSearch === 'single') {
  		const dataSingle: NoticeSentSingleDto = {
  			idNo: this.formSingle.empId,
  			userName: this.formSingle.name,
  			empId: this.formSingle.empNo,
  		};
  		if (!this.checkObjHasVal(dataSingle)) {
  			notification.error({ content: '請輸入欲查詢資料' });
  			return;
  		}
  	  this.setLoading(true);
  		// 單一查詢
  		this.$HeRpnHeRpnNoticeSentControllerApi.getNoticeSentSingleQueryUsingPOST(dataSingle)
  			.then(async (resp) => {
  				if (resp.data.status === 200) {
  					if (resp.data.data && (resp.data.data.noticeLevel2DtoList.length > 0 || resp.data.data.noticeLeve3UpDtoList.length > 0)) {
  						const encryptStr = await this.$encryptionDecryption.encrypt(JSON.stringify({ data: dataSingle, type: 'single' }));
  						this.$global.changeRouterAndaddParam({
  							toRouter: 'NotificationAndRecordQueryList',
  							query: encryptStr,
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
  	} else {
  		const date: any = this.form.date;
  		const NewRangeDate = DateTimeFormmat.filterRangeDate(date);
  		const data: NoticeSentBatchDto = {
  			count: this.form.category,
  			startDate: NewRangeDate ? NewRangeDate[0] : '',
  			endDate: NewRangeDate ? NewRangeDate[1] : '',
  			level: this.form.level,
  		};
  		if (!this.checkObjHasVal(data)) {
  			notification.error({ content: '請輸入欲查詢資料' });
  			return;
  		}
  	  this.setLoading(true);
  		// 批次查詢
  		this.$HeRpnHeRpnNoticeSentControllerApi.getNoticeSentBatchQueryUsingPOST(data)
  			.then(async (resp) => {
  				if (resp.data.status === 200) {
  					if (resp.data.data && (resp.data.data.noticeLevel2DtoList.length > 0 || resp.data.data.noticeLeve3UpDtoList.length > 0)) {
  						const encryptStr = await this.$encryptionDecryption.encrypt(JSON.stringify({ data, type: 'batch' }));
  						this.$global.changeRouterAndaddParam({
  							toRouter: 'NotificationAndRecordQueryList',
  							query: encryptStr,
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
  }
  /**
   * Hook
   */
  // created() {
  // 	this.getGridData();
  // }

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
.notificationQuery__content {
	max-width: 716px;
	margin: auto;
	width: 100%;
}
.notificationQuery__block {
	background: #FFFFFF 0% 0% no-repeat padding-box;
	border: 1px solid #CED4D9;
	border-radius: 6px;
	padding: 20px 36px;
	height: 350px;
	margin-bottom: 25px;
	&:hover, &.selected {
		background: #F5F8FC;
		box-shadow: 0px 2px 2px #00000029;
	}
}
.notificationQuery__block__title {
	color: #7DC9CF;
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 30px;
}

::v-deep {
	.ant-form-item-label > label {
		color: #000000;
		font-weight: 600;
		font-size: 16px;
	}
}
</style>
