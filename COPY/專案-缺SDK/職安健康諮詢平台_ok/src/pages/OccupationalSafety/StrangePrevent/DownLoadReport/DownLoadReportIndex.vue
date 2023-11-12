<template>
  <div class="container">
    <div class="page__title">
      報表查詢下載
    </div>
    <div class="query__title">
      想找什麼報表？
    </div>
    <a-form-model
      ref="formRef"
      :rules="formRules"
      :model="form"
    >
      <a-form-model-item
        prop="choose"
      >
        <a-radio-group
          v-model="form.choose"
          class="row"
        >
          <div
            v-for="item in donwloadEnumList"
            :key="item.key"
            class="col-xl-4 col-md-6 col-12 mb-3"
          >
            <div class="report__block">
              <div class="radio__block">
                <a-radio
                  :value="item.key"
                />
              </div>
              <div class="input__block">
                <div class="input__name">
                  {{ item.label }}
                </div>
                <div class="input__title d-flex">
                  <div>{{ item.subtitle }}</div>
                  <div class="mark-required">
                    *
                  </div>
                </div>
                <a-form-model-item
                  :prop="item.key"
                >
                  <date-picker
                    v-model="form[item.key]"
                    class="range__block"
                    type="month"
                    :range="item.range"
                    :format="'YYYY/MM'"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        :disabled="!form.choose"
        @click="goDownLoad"
      >
        下載
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import moment from 'moment';

@Component({ components: {} })
export default class DownLoadReportIndex extends Vue {
  @Action('setLoading') setLoading;

  donwloadEnumList = [
  	{
  		key: 'yearReportRange',
  		label: '年度統計資料',
  		subtitle: '查詢區間(年/月)',
  		apiMethod: 'getYearStatisticUsingPOST',
  		range: true,
  	},
  	{
  		key: 'overTimeAllListDate',
  		label: '加班時數總筆數',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getSingleMonthOvertimeHoursTotalPeopleUsingPOST',
  		range: false,
  	},
  	{
  		key: 'riskEvaluation',
  		label: '各項評估風險等級件數',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getSingleMonthRiskEvaluationUsingPOST',
  		range: false,
  	},
  	{
  		key: 'monthOverTimeDate',
  		label: '單月加班時數管理清單',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getSingleMonthOvertimeHoursManageListsUsingPOST',
  		range: false,
  	},
  	{
  		key: 'monthManageDate',
  		label: '每月管理清單',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getMonthlyManageListsUsingPOST',
  		range: false,
  	},
  	{
  		key: 'executeReportDate',
  		label: '執行報告',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getExecutionReportUsingPOST',
  		range: false,
  	},
  	{
  		key: 'nightMemberDate',
  		label: '夜班人員管理名單',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getNightShiftStaffManagementListToExcelUsingPOST',
  		range: false,
  	},
  	{
  		key: 'dayMemberDate',
  		label: '日夜輪班人員管理名單',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getDayAndNightShiftManagementListToExcelUsingPOST',
  		range: false,
  	},
  	{
  		key: 'executeRecordDate',
  		label: '執行紀錄',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getExecutionRecordUsingPOST',
  		range: false,
  	},
  	{
  		key: 'avgOverTimeDate',
  		label: '近半年平均加班時數管理清單',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getRecentHalfYearAverageOvertimeHoursManageListsUsingPOST',
  		range: false,
  	},
  	{
  		key: 'strangeWorkDate',
  		label: '異常工作負荷促發疾病預防管理名單',
  		subtitle: '查詢時間(年/月)',
  		apiMethod: 'getDiseasePreventManagementUsingPOST',
  		range: false,
  	},
  ]

  // 表單欄位名稱資料
  form = {
  	choose: null,
  	yearReportRange: [],
  	overTimeAllListDate: null,
  	riskEvaluation: null,
  	monthOverTimeDate: null,
  	monthManageDate: null,
  	executeReportDate: null,
  	nightMemberDate: null,
  	dayMemberDate: null,
  	executeRecordDate: null,
  	avgOverTimeDate: null,
  	strangeWorkDate: null,
  }

  formRules: { [key: string]: ValidationRule[] } = {
  	choose: [{ required: true, message: '請選擇報表', trigger: 'change' }],
  	yearReportRange: [{ required: false, message: '請填寫查詢區間(年/月)', trigger: 'change' }],
  	overTimeAllListDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	riskEvaluation: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	monthOverTimeDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	monthManageDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	executeReportDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	nightMemberDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	dayMemberDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	executeRecordDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	avgOverTimeDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  	strangeWorkDate: [{ required: false, message: '請填寫查詢時間(年/月)', trigger: 'change' }],
  }

  // API: 下載
  getDownloadAPI(method, searchForm) {
  	this.$AlRpnReportQueryDownloadApi[method](searchForm, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log('export:', resp);
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
  				this.$AlRpnReportQueryDownloadApi[method](searchForm)
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
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  checkFrom(): boolean {
  	let isValid = false;
  	(this.$refs.formRef as any).validate((valid) => {
  		if (!valid) {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			isValid = false;
  		} else {
  			isValid = true;
  		}
  	});
  	return isValid;
  }

  goDownLoad() {
  	if (!this.checkFrom()) {
  		return;
  	}
  	const choose = this.form.choose;
  	const searchForm = {};
  	const searchDate = this.form[choose];
  	if (this.donwloadEnumList.find((i) => i.key == choose).range) {
  		const [st, end] = searchDate.length > 0 && DateTimeFormmat.filterRangeDate([...searchDate]);
  		Object.assign(searchForm, {
  			dateStart: st,
  			dateEnd: end,
  		});
  	} else {
  		Object.assign(searchForm, { dateStart: searchDate && DateTimeFormmat.formatStringDateDault(searchDate) });
  	}

  	if (this.donwloadEnumList.find((i) => i.key == choose) && this.donwloadEnumList.find((i) => i.key == choose).apiMethod) {
  		const method = this.donwloadEnumList.find((i) => i.key == choose).apiMethod;
  		this.setLoading(true);
  		this.getDownloadAPI(method, searchForm);
  	}
  }

	@Watch('form.choose')
  onChooseChange(val) {
  	for (const [key, value] of Object.entries(this.form)) {
  		if (key === val || key === 'choose') {
  			this.formRules[key][0].required = true;
  		} else {
  			this.form[key] = (key === 'yearReportRange') ? [] : null;
  			this.formRules[key][0].required = false;
  		}
  	}
  	this.checkFrom();
  }
}
</script>

<style lang="scss" scoped>
  .query__title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .report__form {
    width: 100%;
  }
  .report__block {
    height: 100%;
    background-color: #F9FCFC;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 36px;
    border-radius: 4px;
    box-shadow: 0px 2px 2px transparent;
    border: 0.5px solid transparent;
    display: flex;
    flex-direction: row;
    &:hover {
      box-shadow: 0px 2px 2px #00000029;
      border: 0.5px solid #D1D1D1;
    }
    .radio__block {
      margin-right: 36px;
    }
    .input__block {
      width: 100%;
      .input__name {
        color: $COLOR-MAIN1;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .input__title {
        margin-bottom: 10px;
      }
    }
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    margin-left: 5px;
  }
  .range__block {
    width: 100%;
  }
  .btn__wrap {
    margin-top: 26px;
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
  ::v-deep {
    .ant-radio-group {
      width: 100%;
    }
  }
</style>
